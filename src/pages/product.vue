<template>
  <div class="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div v-if="loading" class="text-center">
      <p>Loading product details...</p>
    </div>
    <div v-else class="flex flex-col lg:flex-row items-start lg:space-x-8 space-y-8 lg:space-y-0">
      <div class="w-full lg:w-1/2">
        <img :alt="data.name" class="w-full h-auto object-cover rounded-lg" :src="data.options[0].images[0]">
        <div class="mt-4 flex overflow-x-auto space-x-2">
          <img
            v-for="(image, index) in data.options[0].images"
            :key="index"
            :alt="`${data.name} - Image ${index + 1}`"
            class="w-20 h-20 object-cover flex-shrink-0 rounded-lg border border-gray-300 transition-transform transform hover:scale-105"
            :src="image"
          >
        </div>
      </div>

      <div class="w-full lg:w-1/2">
        <h1 class="text-3xl font-bold text-gray-900">{{ data.name }}</h1>
        <p class="mt-2 text-gray-600">{{ data.options[0].description }}</p>

        <div class="mt-4">
          <span class="text-2xl font-semibold text-gray-900">${{ calculateFinalPrice(data) }}</span>
        </div>

        <div class="mt-4 flex items-center">
          <label class="mr-2" for="quantity">Daudzums:</label>
          <input
            v-model.number="quantity"
            id="quantity"
            class="w-20 border border-gray-300 rounded-lg px-2 py-1"
            :max="data.options[0].quantity"
            min="1"
            type="number"
          >
        </div>

        <div class="mt-8 flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
          <button
            class="w-full lg:w-60 py-3 bg-[#ffb0b0] text-white rounded-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffc2c2]"
            @click="buyNow"
            :disabled="isAddingToCart"
          >
            {{ isAddingToCart ? 'Processing...' : 'Pirkt' }}
          </button>
          <button
            class="w-full lg:w-60 py-3 bg-white text-black border border-gray-300 rounded-lg shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            @click="addToCart"
            :disabled="isAddingToCart"
          >
            {{ isAddingToCart ? 'Pievieno...' : 'Pievienot Grozam' }}
          </button>
        </div>

        <p v-if="errorMessage" class="mt-4 text-red-500">{{ errorMessage }}</p>
        <p v-if="successMessage" class="mt-4 text-green-500">{{ successMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      data: null,
      quantity: 1,
      isAddingToCart: false,
      errorMessage: '',
      successMessage: '',
    }
  },
  mounted() {
    this.getProduct()
  },
  methods: {
    async buyNow() {
      await this.addToCart()
      if (!this.errorMessage) {
        // Redirect to cart page or checkout page
        this.$router.push('/cart')
      }
    },
    async addToCart() {
      this.isAddingToCart = true
      this.errorMessage = ''
      this.successMessage = ''

      const accessToken = localStorage.getItem('access_token')
      if (!accessToken) {
        this.errorMessage = 'Please log in to add items to your cart.'
        this.isAddingToCart = false
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
                id: this.data.id,
                quantity: this.quantity,
                option_id: this.data.options[0].id
              }
            ]
          }),
        })

        const result = await response.json()

        if (response.ok) {
          this.successMessage = `Added ${this.quantity} item(s) to cart!`
        } else {
          this.errorMessage = result.message || 'Failed to add item to cart. Please try again.'
        }
      } catch (error) {
        console.error('Error adding to cart:', error)
        this.errorMessage = 'An error occurred. Please try again later.'
      } finally {
        this.isAddingToCart = false
      }
    },
    async getProduct() {
      this.loading = true

      try {
        const response = await fetch(`https://ziedu-veikals.vercel.app/product/${this.$route.params.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const data = await response.json()

        if (response.ok) {
          this.data = data
          console.log(data)
        } else {
          this.errorMessage = 'Failed to load product details.'
        }
      } catch (error) {
        console.error("Couldn't get product details", error)
        this.errorMessage = 'An error occurred while loading product details.'
      } finally {
        this.loading = false
      }
    },
    calculateFinalPrice(product) {
      const price = product.options[0].price
      const discount = product.discount

      return discount ? (price - price * (discount / 100)).toFixed(2) : price.toFixed(2)
    },
  },
}
</script>
