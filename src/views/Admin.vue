<template>
    <v-app>
      <v-container fluid>
        <v-row no-gutters>
          <v-navigation-drawer
            app
            clipped
            class="d-none d-md-flex"
            width="256"
          >
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title class="text-lg font-weight-bold"> <v-icon>mdi-security</v-icon><v-list-item-content class="ml-4">Admin Panel</v-list-item-content></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item  to="/admin/dashboard">
                <v-list-item-icon>
                  <v-icon>mdi-home</v-icon>
                </v-list-item-icon>
                <v-list-item-content class="ml-4">Dashboard</v-list-item-content>
              </v-list-item>
              <v-list-item  to="/admin/users" >
                <v-list-item-icon >
                  <v-icon>mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-content class="ml-4">Users</v-list-item-content>
              </v-list-item>
              <v-list-item to="/admin/products">
                <v-list-item-icon>
                  <v-icon>mdi-package</v-icon>
                </v-list-item-icon>
                <v-list-item-content class="ml-4">Products</v-list-item-content>
              </v-list-item>
              <v-list-item to="/admin/orders">
                <v-list-item-icon>
                  <v-icon>mdi-cart</v-icon>
                </v-list-item-icon>
                <v-list-item-content class="ml-4">Orders</v-list-item-content>
              </v-list-item>
              <v-list-item to="/admin/promocodes">
                <v-list-item-icon>
                  <v-icon>mdi-qrcode-scan</v-icon>
                </v-list-item-icon>
                <v-list-item-content class="ml-4">Promocodes</v-list-item-content>
              </v-list-item>
             
            </v-list>
          </v-navigation-drawer>
  
        
            <router-view />
        </v-row>
      </v-container>
    </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
    };
  },
  mounted() {
    this.checkAdminAccess();
  },
  methods: {
    async checkAdminAccess() {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const response = await fetch('https://ziedu-veikals.vercel.app/is_admin', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          if (response.ok) {
            //this.$router.push('/login'); 
          }
        } catch (error) {
          this.$router.push('/login'); 
        }
      } else {
        this.$router.push('/login'); 
      }
    },
  },
};
</script>
