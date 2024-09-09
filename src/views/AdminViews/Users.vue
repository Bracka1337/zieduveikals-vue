<template>
    <v-main>
        <v-app-bar app clipped-left>
            <v-app-bar-nav-icon @click="drawer = !drawer" class="d-md-none"></v-app-bar-nav-icon>
            <v-toolbar-title>Users</v-toolbar-title>
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
    <v-col v-for="user in filteredUsers" :key="user.email" cols="12" md="6" lg="3">
        <v-card>
        <v-card-title>
            <v-avatar size="48">
            <img :src="user.avatar" alt="User avatar" />
            </v-avatar>
            <v-spacer></v-spacer>
            <div>
            <div class="font-weight-bold">{{ user.name }}</div>
            <div class="text-caption">{{ user.email }}</div>
            </div>
        </v-card-title>
        <v-card-subtitle>
            <v-row>
            <v-col>
                <div class="text-caption font-weight-medium">Role</div>
                <div class="text-caption">{{ user.role }}</div>
            </v-col>
            <v-col>
                <div class="text-caption font-weight-medium">Last Login</div>
                <div class="text-caption">{{ user.lastLogin }}</div>
            </v-col>
            <v-col>
                <div class="text-caption font-weight-medium">Orders</div>
                <div class="text-caption">{{ user.orders }}</div>
            </v-col>
            <v-col>
                <div class="text-caption font-weight-medium">Total Spent</div>
                <div class="text-caption">{{ user.totalSpent }}</div>
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
  let data = [
          {
            name: 'John Doe',
            email: 'john@example.com',
            avatar: 'https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?cs=srgb&dl=pexels-anjana-c-169994-674010.jpg&fm=jpg',
            role: 'Admin',
            lastLogin: '2 days ago',
            orders: 25,
            totalSpent: '$2,500'
          },
          {
            name: 'Jane Doe',
            email: 'jane@example.com',
            avatar: 'https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?cs=srgb&dl=pexels-anjana-c-169994-674010.jpg&fm=jpg',
            role: 'User',
            lastLogin: '1 week ago',
            orders: 12,
            totalSpent: '$1,200'
          },
          {
            name: 'Bob Smith',
            email: 'bob@example.com',
            avatar: 'https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?cs=srgb&dl=pexels-anjana-c-169994-674010.jpg&fm=jpg',
            role: 'User',
            lastLogin: '3 months ago',
            orders: 6,
            totalSpent: '$500'
          },
          {
            name: 'Alice Johnson',
            email: 'alice@example.com',
            avatar: 'https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?cs=srgb&dl=pexels-anjana-c-169994-674010.jpg&fm=jpg',
            role: 'User',
            lastLogin: '2 weeks ago',
            orders: 8,
            totalSpent: '$800'
          }
        ];
  export default {
    data() {
      return {
        searchTerm: '',
        users: data,
        filteredUsers: data
      }
    },
    methods: {
        handleSearch() {
            if (this.searchTerm.length > 0) {
                this.filteredUsers = this.users.filter(user => 
                user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
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
  