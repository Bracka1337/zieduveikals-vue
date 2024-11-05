<template>
  <div class="flex mx-auto max-w-[1200px] flex-col p-8">
    <!-- Search Box -->
    <div class="my-8 p-4 bg-white rounded shadow-lg">
      <div class="mb-4">
        <label class="block text-lg font-semibold mb-2" for="search-text">Meklēt</label>
        <input
          id="search-text"
          v-model="searchText"
          @input="debounceSearch"
          class="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="Ievadiet atslēgvārdu"
          type="text"
        />
      </div>
    </div>

    <!-- Loading Indicator and No Results Message -->
    <div class="flex justify-center">
      <span v-if="Loading">Ielādē produktus...</span>
      <span v-else-if="!Loading && products.length === 0">Produkti nav atrasti ;(</span>
    </div>

    <!-- Products List -->
    <div class="my-6 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-around gap-4">
      <div v-for="product in products" :key="product.id">
        <router-link
          class="flex flex-col max-w-full w-full aspect-[4/4] hover:scale-110 transition"
          :to="{ name: 'product', params: { id: product.id } }"
        >
          <div
            id="background"
            class="max-w-full h-full bg-black/[0.19] shadow-lg"
            :style="{ backgroundImage: `url(${product.options[0].images[0]})` }"
          >
            <div v-if="product.discount" class="text-xs w-fit text-white p-2 bg-[#ffc2c2]">
              -{{ product.discount }}%
            </div>
          </div>
          <div class="mt-2">
            <button class="box-border py-2 px-4 w-full bg-white hover:bg-[#ffc2c2] shadow-lg transition">
              Pievienot grozam
            </button>
            <div class="p-2">
              <p class="font-bold">{{ product.name }}</p>
              <p class="text-slate-500 text-sm">{{ product.short_description }}</p>
              <div class="flex row mt-1 text-lg">
                <p>{{ calculateFinalPrice(product) }}€</p>
                <p v-if="product.discount" class="line-through text-[#84898e] pl-2">
                  {{ product.options[0].price }}€
                </p>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  data() {
    return {
      products: [],
      Loading: false,
      searchText: '',
      cacheDuration: 3600000, // Cache duration in milliseconds (e.g., 1 hour)
    }
  },
  watch: {
    searchText: 'debounceSearch'
  },
  mounted() {
    this.getProducts()
  },
  methods: {
    debounceSearch: _.debounce(function () {
      this.performSearch()
    }, 300),

    async performSearch() {
      this.products = []
      await this.getProducts(this.searchText)
    },

    async getProducts(searchQuery = '') {
      const cachedData = this.getCachedProducts(searchQuery)
      if (cachedData) {
        console.log('Using cached data')
        this.products = cachedData
        return
      }

      this.Loading = true

      const params = {
        limit: 16,
        ...(searchQuery && { name: searchQuery }),
      }

      try {
        const qs = new URLSearchParams(params).toString()
        const response = await fetch(`https://ziedu-veikals.vercel.app/products?${qs}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const data = await response.json()

        if (response.ok) {
          console.log('Fetched products successfully')
          this.products = data.products
          this.cacheProducts(searchQuery, data.products)
        } else {
          console.log("Couldn't get products")
        }
      } catch (error) {
        console.error("Couldn't get products", error)
      } finally {
        this.Loading = false
      }
    },
    
    cacheProducts(searchQuery, newProducts) {
      const cacheData = {
        products: newProducts,
        timestamp: Date.now(),
      }
      localStorage.setItem(`products_${searchQuery}`, JSON.stringify(cacheData))
    },

    getCachedProducts(searchQuery) {
      const cached = localStorage.getItem(`products_${searchQuery}`)
      if (cached) {
        const cachedData = JSON.parse(cached)
        const currentTime = Date.now()

        if (currentTime - cachedData.timestamp < this.cacheDuration) {
          return cachedData.products
        } else {
          localStorage.removeItem(`products_${searchQuery}`)
        }
      }
      return null
    },

    calculateFinalPrice(product) {
      const price = product.options[0].price
      const discount = product.discount
      return discount ? (price - price * (discount / 100)).toFixed(2) : price.toFixed(2)
    },
  },
}
</script>

<style lang="scss" scoped>
#background {
  background-image: url('/src/assets/images/bg.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
