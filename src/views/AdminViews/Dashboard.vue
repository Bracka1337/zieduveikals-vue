<template>
  <v-main>
    <v-row>
      <v-col cols="12" md="6" lg="3">
        <v-card>
          <v-card-title>Total Users</v-card-title>
          <v-card-subtitle class="text-h4">{{ totalUsers }}</v-card-subtitle>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="3">
        <v-card>
          <v-card-title>Total Products</v-card-title>
          <v-card-subtitle class="text-h4">{{ totalProducts }}</v-card-subtitle>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="3">
        <v-card>
          <v-card-title>Total Orders</v-card-title>
          <v-card-subtitle class="text-h4">{{ totalOrders }}</v-card-subtitle>
        </v-card>
      </v-col>

    </v-row>
  </v-main>
</template>

<script>
export default {
  data() {
    return {
      totalUsers: "Loading...",
      totalProducts: "Loading...",
      totalOrders: "Loading..."
    };
  },
  mounted() {
    this.fetchTotalUsers();
    this.fetchTotalProducts();
    this.fetchTotalOrders();
  },
  methods: {
    async fetchTotalUsers() {
      try {
        const response = await fetch('https://ziedu-veikals.vercel.app/get_users', {
          headers: {
            'Authorization': localStorage.getItem('access_token')
          }
        });
        const data = await response.json();
        this.totalUsers = data.users.length;
      } catch (error) {
        console.error('Ошибка при получении пользователей:', error);
      }
    },
    async fetchTotalProducts() {
      try {
        const response = await fetch('https://ziedu-veikals.vercel.app/products');
        const data = await response.json();
        this.totalProducts = data.products.length;
      } catch (error) {
        console.error('Ошибка при получении продуктов:', error);
      }
    },
    async fetchTotalOrders() {
      try {
        const response = await fetch('https://ziedu-veikals.vercel.app/orders', {
          headers: {
            'Authorization': localStorage.getItem('access_token')
          }
        });
        const data = await response.json();
        this.totalOrders = data.orders.length;
      } catch (error) {
        console.error('Ошибка при получении заказов:', error);
      }
    }
  }
};
</script>
