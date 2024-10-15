<template>
  <div class="container mx-auto p-8">
    <h2 class="text-2xl font-bold mb-4">Grozs</h2>

    <div v-if="cartItems.length > 0">

      <div v-for="item in cartItems" :key="item.id" class="flex justify-between items-center border-b py-4">
        <div class="flex items-center space-x-4">
          <img :src="item.image" alt="product image" class="w-24 h-24 object-cover" />
          <div class="text-left">
            <p class="font-bold">{{ item.name }}</p>
            <p class="text-sm text-gray-500">{{ item.price }} $ </p>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <input 
            type="number" 
            v-model.number="item.quantity" 
            @change="updateQuantity(item.id, item.quantity)"
            min="1" 
            class="w-16 border rounded p-1 text-center"
          />
          <button @click="removeFromCart(item.id)" class="bg-red-500 text-white px-2 py-1 rounded">Izdzest</button>
        </div>
      </div>

      <div class="flex justify-between items-center mt-6">
        <p class="text-lg font-bold">Kopumā:</p>
        <p class="text-lg font-bold">{{ totalPrice }} $</p>
      </div>


      <button @click="checkout" class="mt-4 bg-black text-white px-4 py-2 rounded">Pasūtīt</button>
    </div>

    <div v-else>
      <p class="text-lg text-gray-500">Jūsu krozs ir tukšs.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cartItems: [
        { id: 1, name: 'Ziedi', price: 100, quantity: 1, image: 'https://via.placeholder.com/150' },
        { id: 2, name: 'Ziedi', price: 20, quantity: 1, image: 'https://via.placeholder.com/150' },
        { id: 3, name: 'Ziedi', price: 15, quantity: 1, image: 'https://via.placeholder.com/150' },
      ],
    };
  },
  computed: {
    totalPrice() {
      return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    },
  },
  methods: {
    removeFromCart(id) {
      this.cartItems = this.cartItems.filter(item => item.id !== id);
    },
    updateQuantity(id, quantity) {
      const item = this.cartItems.find(item => item.id === id);
      if (item && quantity >= 1) {
        item.quantity = quantity;
      }
    },
    checkout() {
      alert(`Veiksmīgi pasūtījāt`);
      this.cartItems = [];
    },
  },
};
</script>

