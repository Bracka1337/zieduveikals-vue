<template>
  <div class="flex mx-auto max-w-[1200px] flex-col p-8">
    <div class="my-8 p-4 bg-white rounded shadow-lg">
      <div class="mb-4">
          <label for="search-text" class="block text-lg font-semibold mb-2">Search</label>
          <input type="text" id="search-text" placeholder="Enter flower name or description" class="w-full p-2 border border-gray-300 rounded-lg">
      </div>
      <div class="mt-6">
          <button class="w-full py-2 px-4 bg-green-500 text-white font-bold rounded hover:bg-green-600 transition">
              Search
          </button>
      </div>
    </div>
    <div class="my-6 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-around gap-4">
        <div v-for="(item, index) in items" :key="index" class="flex flex-col max-w-full w-full aspect-[4/4] hover:scale-110 transition">
            <div class="max-w-full h-full" id="background">
                <div class="text-xs w-fit text-white p-2 bg-[#399918]">-100%</div>
            </div>
            <div class="mt-2">
                <button class="box-border py-2 px-4 w-full border bg-[#fff] hover:bg-[#4be15c] shadow-lg transition">Add to Cart</button>
                <div class="p-2">
                    <p class="font-bold">Some Flower</p>
                    <p class="text-slate-500 text-sm">Short description for a flower</p>
                    <div class="flex row mt-1 text-lg">
                        <p>100.99€</p>
                        <p class="line-through text-[#84898e] pl-2">100.99€</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        items: Array.from({ length: 4 }),
        data: null,
        Loading: false,
      }
    },
    methods: {
      async getProducts() {
        this.Loading = true;
        
        const params = {
          limit: 10
        };

        try {
          const qs = new URLSearchParams(params).toString();
          const response = await fetch(`https://ziedu-veikals.vercel.app/products?${qs}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
          });
          const data = await response.json();
          if (response.ok) {
            console.log("success");
            console.log(data);
            this.data = data;
          } else {
            console.log("Failure");
          }
        } catch (error) {
          console.error('Couldn\'t get products', error);
        } finally {
          this.loading = false;
        }
      }
    },
    mounted() {
      this.getProducts();
    }
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