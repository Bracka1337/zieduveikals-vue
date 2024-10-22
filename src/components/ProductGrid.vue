<template>
  <div class="flex mx-auto max-w-[1200px] flex-col p-8">
    <div class="my-8 p-4 bg-white rounded shadow-lg">
      <div class="mb-4">
          <label for="search-text" class="block text-lg font-semibold mb-2">Meklēt</label>
          <input type="text" id="search-text" placeholder="Ievadiet atslēgvārdu" class="w-full p-2 border border-gray-300 rounded-lg" v-model="searchText">
      </div>
      <div class="mt-6">
          <button class="w-full py-2 px-4 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition" @click="performSearch">
              Meklēt
          </button>
      </div>
    </div>
    <div class="flex justify-center">
      <span v-if="Loading">Ielādē produktus...</span>
      <span v-if="!Loading && data.products.length === 0">Produkti nav atrasti ;(</span>
    </div>
    <div class="my-6 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-around gap-4">
        <div v-for="(product, index) in data.products" :key="index">
          <router-link :to="{ name: 'product', params: { id: product.id } }" class="flex flex-col max-w-full w-full aspect-[4/4] hover:scale-110 transition">
            <div class="max-w-full h-full bg-black/[0.19] shadow-lg" :style="{ backgroundImage: 'url(' + product.options[0].images[0] + ')' }" id="background">
                <div v-if="product.discount" class="text-xs w-fit text-white p-2 bg-[#399918]">-{{ product.discount }}%</div>
            </div>
            <div class="mt-2">
                <button class="box-border py-2 px-4 w-full bg-[#fff] hover:bg-[#4be15c] shadow-lg transition">Pievienot grozam</button>
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
  data() {
    return {
      data: { products: [] },
      Loading: false,
      searchText: '',
      cacheDuration: 3600000, // Cache duration in milliseconds (e.g., 1 hour)
    };
  },
  methods: {
    async performSearch() {
      this.data = [];
      await this.getProducts(this.searchText);
    },

    async getProducts(searchQuery = '') {
      const cachedData = this.getCachedProducts();
      if (cachedData && searchQuery == '') {
        console.log("Using cached data");
        this.data = cachedData;
        return;
      }

      this.Loading = true;

      const params = {
        limit: 16,
        ...(searchQuery && { name: searchQuery }),
      };

      try {
        const qs = new URLSearchParams(params).toString();
        const response = await fetch(`https://ziedu-veikals.vercel.app/products?${qs}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();

        if (response.ok) {
          console.log("success");
          this.data = data;
          this.cacheProducts(data);
        } else {
          console.log("Couldn't get products");
        }
      } catch (error) {
        console.error("Couldn't get products", error);
      } finally {
        this.Loading = false;
      }
    },
    cacheProducts(newProducts) {
      const existingData = this.getCachedProducts();
      const updatedData = existingData ? existingData.products : [];

      const combinedProducts = Array.from(
        new Set([
          ...updatedData,
          ...newProducts.products,
        ].map(product => product.id))
      ).map(id => {
        return [...updatedData, ...newProducts.products].find(product => product.id === id);
      });

      const cacheData = {
        data: { products: combinedProducts },
        timestamp: Date.now(),
      };
      localStorage.setItem("products", JSON.stringify(cacheData));
    },
    getCachedProducts() {
      const cached = localStorage.getItem("products");
      if (cached) {
        const cachedData = JSON.parse(cached);
        const currentTime = Date.now();

        if (currentTime - cachedData.timestamp < this.cacheDuration) {
          return cachedData.data;
        } else {
          localStorage.removeItem("products");
        }
      }
      return null;
    },
    calculateFinalPrice(product) {
      const price = product.options[0].price;
      const discount = product.discount;

      return discount ? (price - price * (discount / 100)).toFixed(2) : price.toFixed(2);
    },
  },
  mounted() {
    this.getProducts();
  },
};
</script>

<style lang="scss" scoped>

#background {
  background-image: url('/src/assets/images/bg.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

</style>