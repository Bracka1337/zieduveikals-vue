<template>
  <div class="container mx-auto p-8">
    <h2 class="text-2xl font-bold mb-4">Grozs</h2>

    <div v-if="cartItems.length > 0">
      <div
        v-for="item in cartItems"
        :key="item.id"
        class="flex justify-between items-center border-b py-4"
      >
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
            @change="updateQuantity(item.id, item.quantity, item)"
            min="1"
            class="w-16 border rounded p-1 text-center"
          />
          <button
            @click="removeFromCart(item.id)"
            class="bg-red-500 text-white px-2 py-1 rounded"
          >
            Izdzēst
          </button>
        </div>
      </div>

      <div v-if="errorMessage" class="text-red-500 mt-4">
        {{ errorMessage }}
      </div>

      <div class="flex justify-between items-center mt-6">
        <p class="text-lg font-bold">Kopumā:</p>
        <p class="text-lg font-bold">{{ totalPrice.toFixed(2) }} $</p>
      </div>

      <button @click="checkout" class="mt-4 bg-black text-white px-4 py-2 rounded">
        Pasūtīt
      </button>
    </div>

    <div v-else>
      <p class="text-lg text-gray-500">Jūsu grozs ir tukšs.</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cartItems: [],
      loading: false,
      errorMessage: '',
    };
  },
  computed: {
    totalPrice() {
      return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    },
  },
  methods: {
    async fetchCartItems() {
      this.loading = true;
      this.errorMessage = '';
      const accessToken = localStorage.getItem('access_token');

      if (!accessToken) {
        this.errorMessage = 'Jums ir jāpiesakās, lai skatītu grozu.';
        this.loading = false;
        return;
      }

      try {
        const response = await fetch('https://ziedu-veikals.vercel.app/cart', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          this.cartItems = data.cart_items.map(item => ({
            id: item.id,
            product_id: item.product_id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image || 'https://via.placeholder.com/150', 
          }));
        } else {
          const errorData = await response.json();
          this.errorMessage = errorData.message || 'Neizdevās iegūt groza preces.';
        }
      } catch (error) {
        console.error('Kļūda, iegūstot groza preces:', error);
        this.errorMessage = 'Kļūda savienojumā ar serveri.';
      } finally {
        this.loading = false;
      }
    },
    async removeFromCart(id) {
      const accessToken = localStorage.getItem('access_token');
      try {
        const response = await fetch(`https://ziedu-veikals.vercel.app/cart/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          this.cartItems = this.cartItems.filter(item => item.id !== id);
        } else {
          const errorData = await response.json();
          this.errorMessage = errorData.message || 'Neizdevās noņemt preci no groza.';
        }
      } catch (error) {
        console.error('Kļūda, noņemot preci no groza:', error);
        this.errorMessage = 'Kļūda savienojumā ar serveri.';
      }
    },
    async updateQuantity(id, quantity, item) {
      if (quantity < 1) {
        this.errorMessage = 'Daudzumam jābūt vismaz 1.';
        item.quantity = 1; 
        return;
      }

      const accessToken = localStorage.getItem('access_token');
      const previousQuantity = item.quantity;

      try {
        const response = await fetch(`https://ziedu-veikals.vercel.app/cart/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ quantity }),
        });

        if (response.ok) {
          const data = await response.json();
          this.errorMessage = '';
        } else {
          const errorData = await response.json();
          this.errorMessage = errorData.message || 'Neizdevās atjaunināt preces daudzumu.';
          item.quantity = previousQuantity;
        }
      } catch (error) {
        console.error('Kļūda, atjauninot preces daudzumu:', error);
        this.errorMessage = 'Kļūda savienojumā ar serveri.';
        item.quantity = previousQuantity;
      }
    },
    checkout() {
      alert('Veiksmīgi pasūtījāt');
      this.cartItems = [];
    },
  },
  mounted() {
    this.fetchCartItems();
  },
};
</script>