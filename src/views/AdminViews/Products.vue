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
    <v-col v-for="user in filteredProducts" :key="user.name" cols="12" md="6" lg="3">
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
                <div class="text-caption">{{ user.quantity }} in stock</div>
            </v-col>
            </v-row>
        </v-card-subtitle>
        <v-card-actions>
            <v-btn outlined small>
            <v-icon left>mdi-pencil</v-icon>
            Edit
            </v-btn>
            <v-btn outlined small @click="handleDelete(user.id)">
            <v-icon left>mdi-delete</v-icon>
            Delete
            </v-btn>
        </v-card-actions>
        </v-card>
    </v-col>
    </v-row>
  </v-main>
</template>
  
<script lang="ts">
import axios from 'axios';

interface ProductOption {
  description: string;
  id: number;
  images: string[];
  name: string;
  type: 'COLOR' | 'SIZE' | 'MATERIAL'; 
}

interface Product {
  description: string;
  id: number;
  name: string;
  options: ProductOption[];
  photo: string;
  price: number;
  quantity: number;
  type: 'BOUQUET'; 
}

export default {
  data() {
  return {
    searchTerm: '',
    products: [] as Product[],
    filteredProducts: [] as Product[],
  }
},
  mounted() {
    this.fetchProducts();
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get('http://127.0.0.1:5000/products', {
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0IiwiZXhwIjoxNzI3MjYwMTU2fQ.giBISzLj9bvaLO7dys5p4EakeHuVFJ2PToSO9mDIBfk'
          }
        });
        this.products = response.data.products;
        this.filteredProducts = [...this.products];
      } catch (error) {
        console.error('Ошибка при загрузке продуктов:', error);

      }
    },
    handleSearch() {
      if (this.searchTerm.length > 0) {
        this.filteredProducts = this.products.filter(user => 
          user.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      } else {
        this.filteredProducts = [...this.products];
      }
    },
    async handleDelete(productId: number) {
      try {
        await axios.delete(`http://127.0.0.1:5000/product/${productId}`, {
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0IiwiZXhwIjoxNzI3MjYwMTU2fQ.giBISzLj9bvaLO7dys5p4EakeHuVFJ2PToSO9mDIBfk'
          }
        });
        this.filteredProducts = this.filteredProducts.filter(user => user.id !== productId);
        this.products = this.products.filter(user => user.id !== productId);
      } catch (error) {
        console.error('Ошибка при удалении продукта:', error);
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
  