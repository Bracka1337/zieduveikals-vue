<template>
  <v-main>
    <!-- App Bar -->
    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click="drawer = !drawer" class="d-md-none"></v-app-bar-nav-icon>
      <v-toolbar-title>Users</v-toolbar-title>
      <v-text-field
        solo
        placeholder="Search by name or email"
        v-model="searchTerm"
        @input="handleSearchDebounced"
        class="mx-4 search-bar"
        clearable
        hide-details
        outlined
        dense
      />

    </v-app-bar>

    <!-- Navigation Drawer (Optional) -->
    <v-navigation-drawer v-model="drawer" app>
      <!-- Drawer content goes here -->
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Navigation Item</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- Add more navigation items as needed -->
      </v-list>
    </v-navigation-drawer>

    <!-- Users Grid -->
    <v-container fluid>
      <v-row>
        <v-col
          v-for="user in filteredUsers"
          :key="user.email"
          cols="12"
          md="6"
          lg="3"
        >
          <v-card>
            <v-card-title>
              <v-spacer></v-spacer>
              <div>
                <div class="font-weight-bold">{{ user.username }}</div>
                <div class="text-caption">{{ user.email }}</div>
              </div>
            </v-card-title>
            <v-card-subtitle>
              <v-row>
                <v-col>
                  <div class="text-caption font-weight-medium">Role</div>
                  <div class="text-caption">{{ user.role }}</div>
                </v-col>
              </v-row>
            </v-card-subtitle>
            <v-card-actions>
              <v-btn color="secondary" @click="openEditDialog(user)">
                <v-icon left>mdi-pencil</v-icon>
                Edit
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Edit User Dialog -->
    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">Edit User</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="editForm" v-model="formValid">
            <v-text-field
              label="Username"
              v-model="editFormData.username"
              :rules="[v => !!v || 'Username is required']"
              required
            ></v-text-field>
            <v-text-field
              label="Email"
              v-model="editFormData.email"
              :rules="[v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'E-mail must be valid']"
              required
            ></v-text-field>
            <v-select
              label="Role"
              v-model="editFormData.role"
              :items="roles"
              :rules="[v => !!v || 'Role is required']"
              required
            ></v-select>
            <v-select
              label="Promocode"
              v-model="editFormData.promocode_id"
              :items="promocodes"
              item-text="code"
              item-value="id"
              clearable
              placeholder="Select a promocode"
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeEditDialog">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="submitEdit" :disabled="!formValid">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for Feedback Messages -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
      <v-btn @click="snackbar.show = false">Close</v-btn>
    </v-snackbar>
  </v-main>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import { debounce } from 'lodash';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  promocode_id: number | null;
  
}

interface Promocode {
  id: number;
  code: string;
}

export default defineComponent({
  name: 'UsersList',
  setup() {
    const searchTerm = ref('');
    const users = ref<User[]>([]);
    const filteredUsers = ref<User[]>([]);
    const drawer = ref(false);

    const editDialog = ref(false);
    const editFormData = reactive({
      id: 0,
      username: '',
      email: '',
      role: '',
      promocode_id: null as number | null,
    });
    const formValid = ref(false);
    const roles = ['ADMIN', 'USER', 'MODERATOR']; 
    const promocodes = ref<Promocode[]>([]);

    const snackbar = reactive({
      show: false,
      message: '',
      color: '',
    });


    const AUTH_TOKEN = localStorage.getItem('access_token');

    
    const handleSearchDebounced = debounce(() => {
      handleSearch();
    }, 300);

    
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://https://ziedu-veikals.vercel.app/get_users', {
          headers: {
            Authorization:
            AUTH_TOKEN, 
          },
        });
        users.value = response.data.users;
        filteredUsers.value = [...users.value];
      } catch (error) {
        console.error('Error loading users:', error);
        showSnackbar('Error loading users', 'error');
      }
    };

    
    const fetchPromocodes = async () => {
      try {
        const response = await axios.get('http://https://ziedu-veikals.vercel.app/get_promocodes', {
          headers: {
            Authorization:
            AUTH_TOKEN, 
          },
        });
        promocodes.value = response.data.promocodes;
      } catch (error) {
        console.error('Error loading users:', error);
        showSnackbar('Error loading users', 'error');
      }
    };

    
    const handleSearch = () => {
      const term = searchTerm.value.trim().toLowerCase();
      if (term.length > 0) {
        filteredUsers.value = users.value.filter(
          (user) =>
            user.username.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term)
        );
      } else {
        filteredUsers.value = [...users.value];
      }
    };

    
    const openEditDialog = (user: User) => {
      editFormData.id = user.id;
      editFormData.username = user.username;
      editFormData.email = user.email;
      editFormData.role = user.role;
      editFormData.promocode_id = user.promocode_id;
      editDialog.value = true;
    };

    
    const closeEditDialog = () => {
      editDialog.value = false;
    };

    
    const submitEdit = async () => {
      if (!formValid.value) return;

      try {
        const payload: any = {
          username: editFormData.username,
          email: editFormData.email,
          role: editFormData.role,
          promocode_id: editFormData.promocode_id,
        };

        const response = await axios.patch(
          `http://https://ziedu-veikals.vercel.app/user/${editFormData.id}`,
          payload,
          {
            headers: {
              Authorization:
              AUTH_TOKEN, 
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 200) {
          
          const index = users.value.findIndex((u) => u.id === editFormData.id);
          if (index !== -1) {
            users.value[index] = {
              ...users.value[index],
              username: editFormData.username,
              email: editFormData.email,
              role: editFormData.role,
              promocode_id: editFormData.promocode_id,
            };
            handleSearch(); 
          }
          showSnackbar('User updated successfully', 'success');
          closeEditDialog();
        }
      } catch (error: any) {
        console.error('Error updating user:', error);
        const message =
          error.response?.data?.message || 'An error occurred while updating the user.';
        showSnackbar(message, 'error');
      }
    };

    
    const showSnackbar = (message: string, color: string) => {
      snackbar.message = message;
      snackbar.color = color;
      snackbar.show = true;
    };

    
    const addUser = () => {
      
      console.log('Add User clicked');
      
    };

    
    const formatDate = (dateStr: string): string => {
      const date = new Date(dateStr);
      return date.toLocaleString();
    };

    
    onMounted(() => {
      fetchUsers();
      fetchPromocodes();
    });

    return {
      searchTerm,
      users,
      filteredUsers,
      drawer,
      handleSearchDebounced,
      handleSearch,
      addUser,
      
      openEditDialog,
      closeEditDialog,
      submitEdit,
      editDialog,
      editFormData,
      formValid,
      roles,
      promocodes,
      showSnackbar,
      snackbar,
      formatDate,
    };
  },
});
</script>

<style scoped>
/* Adjust the search bar width or margins if necessary */
.search-bar {
  max-width: 400px;
}

/* Style the Add User button for better visibility */
.v-btn {
  display: flex;
  align-items: center;
}

.v-btn .v-icon {
  margin-right: 4px;
}

/* Optional: Style the Edit Dialog */
.headline {
  font-weight: bold;
}
</style>
