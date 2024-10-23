<template>
  <div class="max-w-[1400px] flex mx-auto flex-col px-8 mt-[50px] transition">
    <span class="text-4xl">Iemīļotākie produkti</span>
    <div class="my-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-around gap-4">
      <div v-for="(product, index) in data.products" :key="index">
        <router-link class="flex flex-col max-w-full w-full aspect-[4/4] hover:scale-110 transition" :to="{ name: 'product', params: { id: product.id } }">
          <div id="background" class="max-w-full h-full shadow-lg" :style="{ backgroundImage: 'url(' + product.options[0].images[0] + ')' }">
            <div v-if="product.discount" class="text-xs w-fit text-white p-2 bg-[#ffc2c2]">-{{ product.discount }}%</div>
          </div>
          <div class="mt-2">
            <button class="box-border py-2 px-4 w-full bg-[#fff] hover:bg-[#ffc2c2] shadow-lg transition">Pievienot grozam</button>
            <div class="p-2">
              <p class="font-bold">{{ product.name }}</p>
              <p class="text-slate-500 text-sm">{{ product.short_description }}</p>
              <div class="flex row mt-1 text-lg">
                <p>{{ calculateFinalPrice(product) }}€</p>
                <p v-if="product.discount" class="line-through text-[#84898e] pl-2">{{ product.options[0].price }}€</p>
              </div>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        data: [],
        Loading: false,
        cacheDuration: 3600000, // Cache duration in milliseconds (e.g., 1 hour)
      }
    },
    mounted () {
      this.getProducts()
    },
    methods: {
      async getProducts () {
        const cachedData = this.getCachedProducts()
        if (cachedData) {
          this.data = cachedData
          return
        }

        this.Loading = true

        const params = {
          is_featured: true,
          limit: 4,
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
            this.data = data
            this.cacheProducts(data)
          } else {
            console.log('Failure')
          }
        } catch (error) {
          console.error("Couldn't get featured products", error)
        } finally {
          this.Loading = false
        }
      },

      cacheProducts (data) {
        const cacheData = {
          data,
          timestamp: Date.now(),
        }
        localStorage.setItem('featuredProducts', JSON.stringify(cacheData))
      },

      getCachedProducts () {
        const cached = localStorage.getItem('featuredProducts')
        if (cached) {
          const cachedData = JSON.parse(cached)
          const currentTime = Date.now()

          if (currentTime - cachedData.timestamp < this.cacheDuration) {
            return cachedData.data
          } else {
            localStorage.removeItem('featuredProducts')
          }
        }
        return null
      },

      calculateFinalPrice (product) {
        const price = product.options[0].price
        const discount = product.discount

        return discount ? (price - price * (discount / 100)).toFixed(2) : price.toFixed(2)
      },
    },
  }
</script>

<style lang="scss" scoped>

#background {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

</style>
