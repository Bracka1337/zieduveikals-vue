<template>
  <div class="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div v-if="loading" class="text-center">
      <p>Loading product details...</p>
    </div>
    <div v-else class="flex flex-col lg:flex-row items-start lg:space-x-8 space-y-8 lg:space-y-0">

      <div class="w-full lg:w-1/2">
        <img alt="Product Image" class="w-full h-auto object-cover rounded-lg" :src="data.options[0].images[0]">
        <div class="mt-4 flex overflow-x-auto space-x-2">
          <img
            v-for="(image, index) in data.options[0].images"
            :key="index"
            alt="Gallery Image"
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
          <label class="mr-2" for="quantity">Quantity:</label>
          <input
            v-model="quantity"
            class="w-20 border border-gray-300 rounded-lg px-2"
            :max="data.options[0].quantity"
            min="1"
            type="number"
          >
        </div>

        <div class="mt-8 flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
          <button
            class="w-full lg:w-60 py-3 bg-black text-white rounded-lg shadow-lg transition-transform transform hover:scale-105"
            @click="buyNow"
          >
            Buy Now
          </button>
          <button
            class="w-full lg:w-60 py-3 bg-white text-black rounded-lg shadow-lg transition-transform transform hover:scale-105"
            @click="addToCart"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        loading: true,
        quantity: 1, // Initialize quantity
        data: [],
      }
    },
    mounted () {
      this.getProduct()
    },
    methods: {
      buyNow () {
        alert(`Redirecting to checkout for ${this.quantity} items...`)
      },
      addToCart () {
        alert(`Added ${this.quantity} items to cart!`)
      },
      async getProduct () {
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
            console.log('Failure')
          }
        } catch (error) {
          console.error("Couldn't get featured products", error)
        } finally {
          this.loading = false
        }
      },
      calculateFinalPrice (product) {
        const price = product.options[0].price
        const discount = product.discount

        return discount ? (price - price * (discount / 100)).toFixed(2) : price.toFixed(2)
      },
    },
  }
</script>
