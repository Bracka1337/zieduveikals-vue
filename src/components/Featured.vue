<template>
    <div class="max-w-[1400px] flex mx-auto flex-col px-8 mt-[50px] transition">
        <span class="text-4xl">Iemīļotākie produkti</span>
        <div class="my-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 justify-around gap-4">
            <div v-for="(product, index) in data.products" :key="index" class="flex flex-col max-w-full w-full aspect-[4/4] hover:scale-110 transition">
                <div class="max-w-full h-full" :style="{ backgroundImage: 'url(' + product.options[0].images[0] + ')' }" id="background">
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
      }
    },
    methods: {
      async getProducts() {
        this.Loading = true;
        
        const params = {
          is_featured: true,
          limit: 4
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
          console.error('Couldn\'t get featrued products', error);
        } finally {
          this.loading = false;
        }
      },
      calculateFinalPrice(product) {
        const price = product.options[0].price;
        const discount = product.discount;

        return discount ? (price - price * (discount / 100)).toFixed(2) : price.toFixed(2);
      }
    },
    mounted() {
      this.getProducts();
    }
  }
</script>

<!-- data() {
  return {
    username: '',
    password: '',
    loading: false,
    errorMessage: '',
    successMessage: ''
  };
},
methods: {
  async submitLogin() {
    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;

    const payload = {
      username: this.username,
      password: this.password
    };

    try {
      const response = await fetch('https://ziedu-veikals.vercel.app/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        this.successMessage = 'Pieteikšanās veiksmīga!';
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        this.$router.push('/');
      } else {
        this.errorMessage = data.message || 'Pieteikšanās neizdevās.';
      }
    } catch (error) {
      console.error('Kļūda pieteikšanās laikā:', error);
      this.errorMessage = 'Kļūda savienojumā ar serveri.';
    } finally {
      this.loading = false;
    }
  }
} -->








<style lang="scss" scoped>

#background {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

</style>