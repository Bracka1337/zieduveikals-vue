<template>
  <div class="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div v-if="loading" class="text-center">
      <p>Loading product details...</p>
    </div>
    <div v-else class="flex flex-col lg:flex-row items-start lg:space-x-8 space-y-8 lg:space-y-0">
      
      <div class="w-full lg:w-1/2">
        <img :src="product.mainImage" alt="Product Image" class="w-full h-auto object-cover rounded-lg"/>
        <div class="mt-4 flex overflow-x-auto space-x-2">
          <img 
            v-for="(image, index) in product.gallery" 
            :key="index" 
            :src="image" 
            alt="Gallery Image" 
            class="w-20 h-20 object-cover flex-shrink-0 rounded-lg border border-gray-300 transition-transform transform hover:scale-105">
        </div>
      </div>

      <div class="w-full lg:w-1/2">
        <h1 class="text-3xl font-bold text-gray-900">{{ product.title }}</h1>
        <p class="mt-2 text-gray-600">{{ product.Description }}</p>
        
        <div class="mt-4">
          <span class="text-2xl font-semibold text-gray-900">${{ product.price }}</span>
        </div>

        <div class="mt-8 flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4">
          <button 
            class="w-full lg:w-60 py-3 bg-black text-white rounded-lg shadow-lg transition-transform transform hover:scale-105"
            @click="buyNow">
            Buy Now
          </button>
          <button 
            class="w-full lg:w-60 py-3 bg-white text-black rounded-lg shadow-lg transition-transform transform hover:scale-105"
            @click="addToCart">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      product: {
        title: "Nice flowers",
        Description: "Sergej delivery very fast",
        price: 10,
        mainImage: "https://th.bing.com/th/id/R.e5e1ee97efb60c85d7b8ee5a007183df?rik=BBHVxDKM6ojH5A&riu=http%3a%2f%2fhdwpro.com%2fwp-content%2fuploads%2f2016%2f02%2fCool-Pink-Flower-1620x1080.jpg&ehk=I1QYVm6SivG%2bcxjY%2fUhmQj0a6HFBuaDu4uC1dYsQEGM%3d&risl=&pid=ImgRaw&r=0",
        gallery: [
          "https://th.bing.com/th/id/R.e5e1ee97efb60c85d7b8ee5a007183df?rik=BBHVxDKM6ojH5A&riu=http%3a%2f%2fhdwpro.com%2fwp-content%2fuploads%2f2016%2f02%2fCool-Pink-Flower-1620x1080.jpg&ehk=I1QYVm6SivG%2bcxjY%2fUhmQj0a6HFBuaDu4uC1dYsQEGM%3d&risl=&pid=ImgRaw&r=0",
          "https://th.bing.com/th/id/R.e5e1ee97efb60c85d7b8ee5a007183df?rik=BBHVxDKM6ojH5A&riu=http%3a%2f%2fhdwpro.com%2fwp-content%2fuploads%2f2016%2f02%2fCool-Pink-Flower-1620x1080.jpg&ehk=I1QYVm6SivG%2bcxjY%2fUhmQj0a6HFBuaDu4uC1dYsQEGM%3d&risl=&pid=ImgRaw&r=0",
        ],
       
      },
    }; 
  },

  methods: {
    buyNow() {
      alert('Redirecting to checkout...');
    },
    addToCart() {
      alert('Added to cart!');
    },
  },
  mounted() {
    this.loading = false; 
  },
};
</script>

