<template>
  <div class="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div v-if="loading" class="text-center">
      <p>Loading product details...</p>
    </div>
    <div v-else-if="!data" class="text-center">
      <p>No product data available.</p>
    </div>
    <div v-else class="flex flex-col lg:flex-row items-start lg:space-x-8 space-y-8 lg:space-y-0">
      <div class="w-full lg:w-1/2">
        <img :src="selectedOption.images[0]" :alt="data.name" class="w-full h-auto object-cover rounded-lg" />
        <div class="mt-4 flex overflow-x-auto space-x-2">
          <img
            v-for="(image, index) in selectedOption.images"
            :key="index"
            :src="image"
            :alt="`${data.name} - Image ${index + 1}`"
            class="w-20 h-20 object-cover flex-shrink-0 rounded-lg border border-gray-300 transition-transform transform hover:scale-105"
          />
        </div>
      </div>

      <div class="w-full lg:w-1/2">
        <h1 class="text-3xl font-bold text-gray-900">{{ data.name }}</h1>
        <p class="mt-2 text-gray-600">{{ selectedOption.description }}</p>

        <div class="mt-4">
          <span class="text-2xl font-semibold text-gray-900">${{ calculateFinalPrice(data, selectedOption) }}</span>
          <span v-if="data.discount" class="ml-2 text-sm text-red-500">{{ data.discount }}% off</span>
        </div>

        <div v-if="data.options.length > 1" class="mt-4">
          <label class="block text-sm font-medium text-gray-700">Options:</label>
          <div class="mt-1 flex flex-wrap gap-2">
            <button
              v-for="option in data.options"
              :key="option.id"
              @click="selectedOption = option"
              :class="[
                'px-3 py-1 rounded-full text-sm',
                selectedOption.id === option.id ? 'bg-[#ffc2c2] text-white' : 'bg-gray-200 text-gray-800'
              ]"
            >
              {{ option.name }}
            </button>
          </div>
        </div>

        <div class="mt-4 flex items-center">
          <label class="mr-2" for="quantity">Quantity:</label>
          <input
            v-model.number="quantity"
            id="quantity"
            type="number"
            class="w-20 border border-gray-300 rounded-lg px-2 py-1"
            :max="selectedOption.quantity"
            min="1"
          />
        </div>

        <div class="mt-8 flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
          <button
            class="w-full lg:w-60 py-3 bg-[#ffc2c2] text-white rounded-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffc2c2]"
            @click="buyNow"
            :disabled="isAddingToCart"
          >
            {{ isAddingToCart ? 'Processing...' : 'Buy Now' }}
          </button>
          <button
            class="w-full lg:w-60 py-3 bg-white text-black border border-gray-300 rounded-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            @click="addToCart"
            :disabled="isAddingToCart"
          >
            {{ isAddingToCart ? 'Adding...' : 'Add to Cart' }}
          </button>
        </div>

        <p v-if="errorMessage" class="mt-4 text-red-500">{{ errorMessage }}</p>
        <p v-if="successMessage" class="mt-4 text-green-500">{{ successMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const data = ref(null)
const quantity = ref(1)
const selectedOption = ref(null)
const isAddingToCart = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const getProduct = async (id) => {
  loading.value = true
  try {
    const response = await fetch(`https://ziedu-veikals.vercel.app/product/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const result = await response.json()
    if (response.ok) {
      data.value = result
      selectedOption.value = result.options[0]
    } else {
      errorMessage.value = 'Failed to load product details.'
    }
  } catch (error) {
    console.error("Couldn't get product details", error)
    errorMessage.value = 'An error occurred while loading product details.'
  } finally {
    loading.value = false
  }
}

const calculateFinalPrice = (product, option) => {
  const price = option.price
  const discount = product.discount
  return discount ? (price - price * (discount / 100)).toFixed(2) : price.toFixed(2)
}

const addToCart = async () => {
  isAddingToCart.value = true
  errorMessage.value = ''
  successMessage.value = ''

  const accessToken = localStorage.getItem('access_token')
  if (!accessToken) {
    errorMessage.value = 'Please log in to add items to your cart.'
    isAddingToCart.value = false
    return
  }

  try {
    const response = await fetch('https://ziedu-veikals.vercel.app/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        products: [
          {
            id: data.value.id,
            quantity: quantity.value,
            option_id: selectedOption.value.id
          }
        ]
      }),
    })

    const result = await response.json()

    if (response.ok) {
      successMessage.value = `Added ${quantity.value} item(s) to cart!`
    } else {
      errorMessage.value = result.message || 'Failed to add item to cart. Please try again.'
    }
  } catch (error) {
    console.error('Error adding to cart:', error)
    errorMessage.value = 'An error occurred. Please try again later.'
  } finally {
    isAddingToCart.value = false
  }
}

const buyNow = async () => {
  await addToCart()
  if (!errorMessage.value) {
    router.push('/cart')
  }
}

watch(() => route.params.id, (newId) => {
  if (newId) {
    getProduct(newId)
  }
})

onMounted(() => {
  if (route.params.id) {
    getProduct(route.params.id)
  }
})

watch(selectedOption, (newOption) => {
  quantity.value = Math.min(quantity.value, newOption.quantity)
})
</script>