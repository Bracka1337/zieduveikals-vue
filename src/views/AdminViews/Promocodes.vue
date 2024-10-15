<template>
    <v-main>
      <v-app-bar app clipped-left>
        <v-app-bar-nav-icon @click="drawer = !drawer" class="d-md-none"></v-app-bar-nav-icon>
        <v-toolbar-title>Promocodes</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          solo
          placeholder="Search by name"
          v-model="searchTerm"
          @input="handleSearch"
          class="mx-4 search-bar"
          clearable
          hide-details
          outlined
          dense
        />
        <v-btn color="primary" @click="openAddPromocodeModal">
          <v-icon left>mdi-plus</v-icon>
          Add Promocode
        </v-btn>
      </v-app-bar>
  
      <v-container fluid>
        <v-row>
          <v-col
            v-for="promocode in filteredPromocodes"
            :key="promocode.code"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card>
              <v-card-title>{{ promocode.code }}</v-card-title>
              <v-card-subtitle>
                <v-row>
                  <v-col>
                    <div class="text-caption font-weight-medium">Discount</div>
                    <div class="text-body-1">{{ promocode.discount }}%</div>
                  </v-col>
                  <v-col>
                    <div class="text-caption font-weight-medium">Usage Left</div>
                    <div class="text-body-1">{{ promocode.count_usage }}</div>
                  </v-col>
                </v-row>
              </v-card-subtitle>
              <v-card-actions>
                <v-btn color="primary" @click="openEditPromocodeModal(promocode)">
                  <v-icon left>mdi-pencil</v-icon>
                  Edit
                </v-btn>
                <v-btn color="error" @click="handleDelete(promocode.code)">
                  <v-icon left>mdi-delete</v-icon>
                  Delete
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
  
      <!-- Add/Edit Promocode Modal -->
      <v-dialog v-model="isModalOpen" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="text-h5">{{ isEditing ? 'Edit Promocode' : 'Add New Promocode' }}</span>
          </v-card-title>
          <v-card-text>
            <v-form ref="promocodeForm" v-model="formValid">
              <v-text-field
                label="Code"
                v-model="selectedPromocode.code"
                :rules="[v => !!v || 'Code is required']"
                required
                :disabled="isEditing" 
              ></v-text-field>
              <v-text-field
                label="Discount (%)"
                v-model.number="selectedPromocode.discount"
                type="number"
                :rules="[v => v > 0 || 'Discount must be positive']"
                required
              ></v-text-field>
              <v-text-field
                label="Usage Count"
                v-model.number="selectedPromocode.count_usage"
                type="number"
                :rules="[v => v >= 0 || 'Usage count cannot be negative']"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn  @click="closeModal">Cancel</v-btn>
            <v-btn color="primary" :disabled="!formValid" @click="savePromocode">
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
  
      <!-- Snackbar for Notifications -->
      <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
        {{ snackbar.message }}
        <template v-slot:action="{ attrs }">
          <v-btn text v-bind="attrs" @click="snackbar.show = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-main>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, reactive, onMounted } from 'vue';
  import axios from 'axios';
  
  interface Promocode {
    id?: number; // Made optional
    code: string;
    discount: number;
    count_usage: number;
  }
  
  export default defineComponent({
    name: 'PromocodeList',
    setup() {
      const searchTerm = ref('');
      const promocodes = ref<Promocode[]>([]);
      const filteredPromocodes = ref<Promocode[]>([]);
      const isModalOpen = ref(false);
      const isEditing = ref(false);
      const selectedPromocode = reactive<Promocode>({
        code: '',
        discount: 0,
        count_usage: 0,
      });
      const formValid = ref(false);
      const snackbar = reactive({
        show: false,
        message: '',
        color: 'success',
      });
  
      const promocodeForm = ref<InstanceType<typeof import('vue').ComponentPublicInstance>>();
  
      // Replace with your actual Bearer token retrieval logic
      const AUTH_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0IiwiZXhwIjoxNzI4OTIzNjY3fQ._mokgzzugFhnU5_iXA6yGCFy-p-Zw9cYQkAKwxY58LA';
  
      const fetchPromocodes = async () => {
        try {
          const response = await axios.get('http://127.0.0.1:5000/promocodes', {
            headers: {
              Authorization: AUTH_TOKEN,
            },
          });
          promocodes.value = response.data.promocodes;
          filteredPromocodes.value = [...promocodes.value];
        } catch (error) {
          console.error('Error fetching promocodes:', error);
          showSnackbar('Failed to load promocodes.', 'error');
        }
      };
  
      onMounted(() => {
        fetchPromocodes();
      });
  
      const handleSearch = () => {
        if (searchTerm.value.trim().length > 0) {
          const term = searchTerm.value.toLowerCase();
          filteredPromocodes.value = promocodes.value.filter((promocode) =>
            promocode.code.toLowerCase().includes(term)
          );
        } else {
          filteredPromocodes.value = [...promocodes.value];
        }
      };
  
      const handleDelete = async (promocodeCode: string) => {
        if (!confirm(`Are you sure you want to delete the promocode "${promocodeCode}"?`)) return;
  
        try {
          await axios.delete(`http://127.0.0.1:5000/promocode/${encodeURIComponent(promocodeCode)}`, {
            headers: {
              Authorization: AUTH_TOKEN,
            },
          });
          promocodes.value = promocodes.value.filter((p) => p.code !== promocodeCode);
          filteredPromocodes.value = filteredPromocodes.value.filter((p) => p.code !== promocodeCode);
          showSnackbar('Promocode deleted successfully.', 'success');
        } catch (error) {
          console.error('Error deleting promocode:', error);
          const errorMessage =
            error.response?.data?.message || 'Failed to delete promocode.';
          showSnackbar(errorMessage, 'error');
        }
      };
  
      const openEditPromocodeModal = (promocode: Promocode) => {
        isEditing.value = true;
        Object.assign(selectedPromocode, { ...promocode });
        isModalOpen.value = true;
      };
  
      const openAddPromocodeModal = () => {
        isEditing.value = false;
        Object.assign(selectedPromocode, {
          code: '',
          discount: 0,
          count_usage: 0,
        });
        isModalOpen.value = true;
      };
  
      const closeModal = () => {
        if (promocodeForm.value) {
          promocodeForm.value.resetValidation();
        }
        formValid.value = false; // Reset form validity
        Object.assign(selectedPromocode, {
          code: '',
          discount: 0,
          count_usage: 0,
        });
        isModalOpen.value = false;
      };
  
      const savePromocode = async () => {
        if (!formValid.value) {
          showSnackbar('Please correct the errors in the form.', 'error');
          return;
        }
  
        try {
          let response;
          if (isEditing.value) {
            // Editing existing promocode using the code as identifier
            response = await axios.patch(
              `http://127.0.0.1:5000/promocode/${encodeURIComponent(selectedPromocode.code)}`,
              {
                discount: selectedPromocode.discount,
                count_usage: selectedPromocode.count_usage,
              },
              {
                headers: {
                  Authorization: AUTH_TOKEN,
                  'Content-Type': 'application/json',
                },
              }
            );
            // Update the local promocodes list
            const index = promocodes.value.findIndex((p) => p.code === selectedPromocode.code);
            if (index !== -1) {
              promocodes.value[index] = response.data;
              handleSearch();
              showSnackbar('Promocode updated successfully.', 'success');
            }
          } else {
            // Creating new promocode
            response = await axios.post(
              'http://127.0.0.1:5000/promocodes',
              {
                code: selectedPromocode.code,
                discount: selectedPromocode.discount,
                count_usage: selectedPromocode.count_usage,
              },
              {
                headers: {
                  Authorization: AUTH_TOKEN,
                  'Content-Type': 'application/json',
                },
              }
            );
            // Ensure the response contains the necessary fields
            if (response.data && response.data.code) {
              promocodes.value.push(response.data);
              handleSearch();
              showSnackbar('Promocode added successfully.', 'success');
            } else {
              throw new Error('Incomplete promocode data received from server.');
            }
          }
          closeModal(); // Close modal only after successful API call
        } catch (error) {
          console.error('Error saving promocode:', error);
          const errorMessage =
            error.response?.data?.message || 'Failed to save promocode.';
          showSnackbar(errorMessage, 'error');
        }
      };
  
      const showSnackbar = (message: string, color: string = 'success') => {
        snackbar.message = message;
        snackbar.color = color;
        snackbar.show = true;
      };
  
      return {
        searchTerm,
        promocodes,
        filteredPromocodes,
        isModalOpen,
        isEditing,
        selectedPromocode,
        formValid,
        handleSearch,
        handleDelete,
        openEditPromocodeModal,
        openAddPromocodeModal,
        closeModal,
        savePromocode,
        promocodeForm,
        snackbar,
        showSnackbar,
      };
    },
  });
  </script>
  
  <style scoped>
  .v-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  </style>
  