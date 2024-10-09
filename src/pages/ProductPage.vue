<template>
    <div class="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div v-if="loading" class="text-center">
        <p>Loading product details...</p>
      </div>
      <div v-else class="flex flex-col lg:flex-row items-start lg:space-x-8 space-y-8 lg:space-y-0">
        
        <div class="w-full lg:w-1/2">
          <img :src="product.mainImage" alt="Product Image" class="w-full h-auto object-cover "/>
          <div class="mt-4 flex space-x-4">
            <img v-for="(image, index) in product.gallery" :key="index" :src="image" alt="Product Image" class="w-20 h-20 object-cover"/>
          </div>
        </div>
  
        <div class="w-full lg:w-1/2">
          <h1 class="text-3xl font-bold text-gray-900">{{ product.title }}</h1>
          <p class="mt-2 text-gray-600">{{ product.shortDescription }}</p>
          
          <div class="mt-4">
            <span class="text-2xl font-semibold text-gray-900">${{ product.price }}</span>
          </div>
  
  
          <!-- Action Buttons -->
          <div class="mt-8">
            <button class="w-full text-white py-3 bg-black transition" @click="buyNow">
              Buy Now
            </button>
            <button class="w-full mt-4  py-3 outline transition" @click="addToCart">
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
        loading: false, // You can still use this for a loading state if you want
        product: {
          title: "Nice flowers",
          shortDescription: "Sergej delivery very fast",
          fullDescription:
            "This smartwatch combines style, fitness tracking, and notifications. With a sleek design, long-lasting battery, and powerful fitness tracking features, it's perfect for everyday use. You'll receive notifications for calls, messages, and apps right on your wrist. Plus, it's water-resistant and tracks your heart rate, steps, and workouts.",
          price: 199.99,
          mainImage: "https://www.shutterstock.com/image-photo/daisy-flowr-260nw-465039545.jpg", // Main product image
          gallery: [
            "https://via.placeholder.com/100",
            "https://via.placeholder.com/100",
            "https://via.placeholder.com/100",
          ],
          specifications: [
            "Display: 1.4-inch AMOLED",
            "Battery Life: Up to 7 days",
            "Water Resistance: 5 ATM",
            "Heart Rate Monitor: Yes",
            "GPS: Built-in",
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
  