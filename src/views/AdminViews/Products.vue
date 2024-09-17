<template>
    <v-main>
        <v-app-bar app clipped-left>
            <v-app-bar-nav-icon @click="drawer = !drawer" class="d-md-none"></v-app-bar-nav-icon>
            <v-toolbar-title>Products</v-toolbar-title>
                <v-text-field
                solo
                placeholder="Search by name or email"
                v-model="searchTerm"
                @input="handleSearch"
                />
                <v-col class="d-flex" cols="auto">
                    <v-btn>
                    <v-icon left>mdi-plus</v-icon>
                    Add User
                    </v-btn>
                </v-col>
        </v-app-bar>
        <v-row>
    <v-col v-for="user in filteredUsers" :key="user.name" cols="12" md="6" lg="3">
        <v-card>
        <v-card-title>
            <v-avatar size="48">
                <img :src="user.image" alt="User avatar" />
            </v-avatar>
            <v-spacer></v-spacer>
            <div>
            <div class="font-weight-bold">{{ user.name }}</div>
            <div class="text-caption">{{ user.category }}</div>
            </div>
        </v-card-title>
        <v-card-subtitle>
            <v-row>
            <v-col>
                <div class="text-caption font-weight-medium">Description</div>
                <div class="text-caption">{{ user.description }}</div>
            </v-col>
            <v-col>
                <div class="text-caption font-weight-medium">Price</div>
                <div class="text-caption">{{ user.price }}</div>
            </v-col>
            <v-col>
                <div class="text-caption font-weight-medium">Inventory</div>
                <div class="text-caption">{{ user.stock }} in stock</div>
            </v-col>
            </v-row>
        </v-card-subtitle>
        <v-card-actions>
            <v-btn outlined small>
            <v-icon left>mdi-pencil</v-icon>
            Edit
            </v-btn>
            <v-btn outlined small>
            <v-icon left>mdi-delete</v-icon>
            Delete
            </v-btn>
        </v-card-actions>
        </v-card>
    </v-col>
    </v-row>
  </v-main>
</template>
  
<script>
import axios from 'axios';

export default {
  data() {
    return {
      searchTerm: '',
      users: [],
      filteredUsers: []
    }
  },
  mounted() {
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get('https://ziedu-veikals.vercel.app/products', {
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJyb2JlcnQiLCJleHAiOjE3MjY1OTcyNzV9.VfQCxBsPpSeGqU4C78juZvtAZbIT6hCTQ6qUVM0gudI' // Замените YOUR_ACCESS_TOKEN на ваш реальный токен
          }
        });
        this.users = response.data.products;
        this.filteredUsers = [...this.users];
      } catch (error) {
        console.error('Ошибка при загрузке продуктов:', error);
        // Вы можете также обновить UI, чтобы отобразить сообщение об ошибке
      }
    },
    handleSearch() {
      if (this.searchTerm.length > 0) {
        this.filteredUsers = this.users.filter(user => 
          user.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      } else {
        this.filteredUsers = [...this.users];
      }
    }
  }
}
</script>


  
<style scoped>
.v-avatar img {
width: 100%;
height: 100%;
object-fit: cover;
}
</style>
  