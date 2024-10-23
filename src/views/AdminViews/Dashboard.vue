<template>
  <v-main>
    <v-row>
      <v-col cols="12" md="6" lg="3">
        <v-card class="pa-4">
          <v-card-title>Total Users</v-card-title>
          <v-card-subtitle class="text-h4">
            <div v-if="isLoadingUsers" class="d-flex justify-center">
              <v-progress-circular indeterminate color="primary" size="24"></v-progress-circular>
            </div>
            <div v-else>{{ totalUsers }}</div>
          </v-card-subtitle>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="3">
        <v-card class="pa-4">
          <v-card-title>Total Products</v-card-title>
          <v-card-subtitle class="text-h4">
            <div v-if="isLoadingProducts" class="d-flex justify-center">
              <v-progress-circular indeterminate color="primary" size="24"></v-progress-circular>
            </div>
            <div v-else>{{ totalProducts }}</div>
          </v-card-subtitle>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="3">
        <v-card class="pa-4">
          <v-card-title>Total Orders</v-card-title>
          <v-card-subtitle class="text-h4">
            <div v-if="isLoadingOrders" class="d-flex justify-center">
              <v-progress-circular indeterminate color="primary" size="24"></v-progress-circular>
            </div>
            <div v-else>{{ totalOrders }}</div>
          </v-card-subtitle>
        </v-card>
      </v-col>
    </v-row>
  </v-main>
</template>

<script>
export default {
  data() {
    return {
      totalUsers: 0,
      totalProducts: 0,
      totalOrders: 0,
      isLoadingUsers: true,
      isLoadingProducts: true,
      isLoadingOrders: true,
    };
  },
  mounted() {
    this.fetchTotalUsers();
    this.fetchTotalProducts();
    this.fetchTotalOrders();
  },
  methods: {
    async fetchTotalUsers() {
      this.isLoadingUsers = true;
      try {
        const response = await fetch('https://ziedu-veikals.vercel.app/get_users', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.totalUsers = data.users.length;
      } catch (error) {
        console.error('Error fetching users:', error);
        this.totalUsers = 'Error';
      } finally {
        this.isLoadingUsers = false;
      }
    },
    async fetchTotalProducts() {
      this.isLoadingProducts = true;
      try {
        const response = await fetch('https://ziedu-veikals.vercel.app/products');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.totalProducts = data.products.length;
      } catch (error) {
        console.error('Error fetching products:', error);
        this.totalProducts = 'Error';
      } finally {
        this.isLoadingProducts = false;
      }
    },
    async fetchTotalOrders() {
      this.isLoadingOrders = true;
      try {
        const response = await fetch('https://ziedu-veikals.vercel.app/orders', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        this.totalOrders = data.orders.length;
      } catch (error) {
        console.error('Error fetching orders:', error);
        this.totalOrders = 'Error';
      } finally {
        this.isLoadingOrders = false;
      }
    },
  },
};
</script>

<style scoped>
/* Optional: Adjust the card padding and alignment */
.v-card {
  min-height: 150px;
}
</style>
