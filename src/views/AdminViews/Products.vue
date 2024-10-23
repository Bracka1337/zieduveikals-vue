<template>
  <v-main>
    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click="drawer = !drawer" class="d-md-none"></v-app-bar-nav-icon>
      <v-toolbar-title>Products</v-toolbar-title>
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
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="openAddProductModal">
        <v-icon left>mdi-plus</v-icon>
        Add Product
      </v-btn>
    </v-app-bar>

    <!-- Loading Animation -->
    <v-container fluid v-if="isLoading" class="d-flex justify-center align-center" style="height: 80vh;">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </v-container>

    <!-- Product Grid -->
    <v-container fluid v-else>
      <v-row>
        <v-col 
          v-for="product in filteredProducts" 
          :key="product.id" 
          cols="12" 
          sm="6" 
          md="4" 
          lg="3"
        >
          <v-card class="product-card">
            <!-- Product Image -->
            <v-img 
              :src="getProductImage(product)" 
              class="product-image" 
              contain 
            >
              <!-- Overlayed Product Name -->
              <v-card-title class="product-title">{{ product.name }}</v-card-title>
            </v-img>
            
            <!-- Product Details -->
            <v-card-subtitle>
              <v-row>
                <v-col>
                  <div class="text-caption font-weight-medium">Price</div>
                  <div class="text-body-1">
                    ${{ getDefaultOption(product)?.price?.toFixed(2) || 'N/A' }}
                  </div>
                </v-col>
                <v-col>
                  <div class="text-caption font-weight-medium">Inventory</div>
                  <div class="text-body-1">
                    {{ getDefaultOption(product)?.quantity || 'N/A' }} in stock
                  </div>
                </v-col>
              </v-row>
            </v-card-subtitle>
            
            <!-- Product Actions -->
            <v-card-actions>
              <v-btn color="primary" @click="openEditProductModal(product)">
                <v-icon left>mdi-pencil</v-icon>
                Edit
              </v-btn>
              <v-btn color="error" @click="handleDelete(product.id)">
                <v-icon left>mdi-delete</v-icon>
                Delete
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Add/Edit Product Dialog -->
    <v-dialog v-model="isModalOpen" max-width="800px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ isEditing ? 'Edit Product' : 'Add New Product' }}</span>
        </v-card-title>
        <v-card-text>
          <v-form ref="productForm" v-model="formValid">
            <!-- Form Fields -->
            <v-text-field
              label="Product Name"
              v-model="selectedProduct.name"
              :rules="[v => !!v || 'Name is required']"
              required
            ></v-text-field>
            <v-text-field
              label="Short Description"
              v-model="selectedProduct.short_description"
              auto-grow
            ></v-text-field>
            <v-select
              label="Type"
              v-model="selectedProduct.type"
              :items="productTypes"
              :rules="[v => !!v || 'Type is required']"
              required
            ></v-select>
            <v-text-field
              label="Discount (%)"
              v-model.number="selectedProduct.discount"
              type="number"
              min="0"
              max="100"
            ></v-text-field>
            <v-checkbox
              label="Featured Product"
              v-model="selectedProduct.is_featured"
            ></v-checkbox>

            <!-- Options Section -->
            <v-divider class="my-4"></v-divider>
            <div class="d-flex justify-space-between align-center mb-2">
              <span class="font-weight-medium">Options</span>
              <v-btn small color="primary" @click="addOption" :disabled="hasDefaultOption && !canAddOptionType('DEFAULT')">
                <v-icon left>mdi-plus</v-icon>
                Add Option
              </v-btn>
            </div>
            <v-card
              v-for="(option, index) in selectedProduct.options"
              :key="option.id || index" 
              class="mb-4 option-card"
              outlined
            >
              <v-card-title>
                <span>Option {{ index + 1 }}</span>
                <v-spacer></v-spacer>
                <v-btn icon @click="removeOption(index)">
                  <v-icon color="error">mdi-delete</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text>
                <v-text-field
                  label="Option Name"
                  v-model="option.name"
                  :rules="[v => !!v || 'Option name is required']"
                  required
                ></v-text-field>
                <v-select
                  label="Option Type"
                  v-model="option.type"
                  :items="optionTypes"
                  :rules="[v => !!v || 'Option type is required']"
                  :disabled="option.type === 'DEFAULT' ? true : false"
                  required
                  @change="handleOptionTypeChange(option)"
                ></v-select>
                <v-textarea
                  label="Description"
                  v-model="option.description"
                  auto-grow
                ></v-textarea>
                <v-file-input
                  label="Images"
                  v-model="option.newImages"
                  multiple
                  show-size
                  hint="Upload new images or provide image URLs"
                  prepend-icon="mdi-image"
                  @change="handleImageUpload(option)"
                  :loading="option.uploadingImages"
                ></v-file-input>
                <v-row>
                  <v-col
                    v-for="(img, imgIndex) in option.images"
                    :key="imgIndex"
                    cols="4"
                    class="d-flex justify-center align-center"
                  >
                    <v-img :src="img" height="100px" class="mr-2"></v-img>
                    <v-btn icon color="error" @click="removeImage(option, imgIndex)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>
                <!-- Loading Spinner for Image Upload -->
                <v-progress-linear v-if="option.uploadingImages" indeterminate color="primary" class="mt-2"></v-progress-linear>
                
                <!-- Conditional Price Field for Default Option -->
                <v-text-field
                  v-if="option.type === 'DEFAULT'"
                  label="Price"
                  v-model.number="option.price"
                  type="number"
                  :rules="[v => v > 0 || 'Price must be positive']"
                  required
                ></v-text-field>
                <v-text-field
                  v-else
                  label="Price"
                  v-model.number="option.price"
                  type="number"
                  min="0"
                  :rules="[v => v >= 0 || 'Price cannot be negative']"
                ></v-text-field>
                <v-text-field
                  label="Quantity"
                  v-model.number="option.quantity"
                  type="number"
                  :rules="[v => v >= 0 || 'Quantity cannot be negative']"
                  required
                ></v-text-field>
              </v-card-text>
            </v-card>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="closeModal">Cancel</v-btn>
          <v-btn color="primary" :disabled="!formValid || isSaving || !hasDefaultOption" @click="saveProduct">
            <v-icon left v-if="isSaving">mdi-loading</v-icon>
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
import { defineComponent, ref, reactive, onMounted, computed, watch } from 'vue';
import axios from 'axios';

interface ProductOption {
  description: string;
  id?: number; 
  images: string[]; 
  name: string;
  type: 'COLOR' | 'SIZE' | 'MATERIAL' | 'DEFAULT';
  price?: number; 
  quantity: number;
  newImages?: File[]; 
  uploadingImages?: boolean; 
}

interface Product {
  discount?: number;
  id?: number; 
  is_featured?: boolean | null;
  name: string;
  options: ProductOption[];
  type: 'BOUQUET' | 'FLOWER'; 
  short_description?: string;
}

export default defineComponent({
  name: 'ProductList',
  setup() {
    const searchTerm = ref('');
    const products = ref<Product[]>([]);
    const filteredProducts = ref<Product[]>([]);
    const isModalOpen = ref(false);
    const isEditing = ref(false);
    const isSaving = ref(false);
    const selectedProduct = reactive<Product>({
      id: 0,
      name: '',
      type: 'BOUQUET',
      options: [],
      short_description: '',
    });
    const productTypes = ['BOUQUET', 'FLOWER'];
    const optionTypes = ['COLOR', 'SIZE', 'MATERIAL', 'DEFAULT'];
    const formValid = ref(false);
    const snackbar = reactive({
      show: false,
      message: '',
      color: 'success',
    });
    const isLoading = ref(true); // Added loading state
    const productForm = ref<InstanceType<typeof import('vue').ComponentPublicInstance>>();

    const AUTH_TOKEN = 'Bearer ' + localStorage.getItem('access_token');

    const optionsToDelete = ref<number[]>([]);

    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://ziedu-veikals.vercel.app/products', {
          headers: {
            Authorization: AUTH_TOKEN,
          },
        });
        products.value = response.data.products;
        filteredProducts.value = [...products.value];
      } catch (error) {
        console.error('Error fetching products:', error);
        showSnackbar('Failed to load products.', 'error');
      } finally {
        isLoading.value = false; // Set loading to false after data is fetched
      }
    };

    onMounted(() => {
      isLoading.value = true; // Ensure loading is true before fetching data
      fetchProducts();
    });

    const handleSearch = () => {
      if (searchTerm.value.trim().length > 0) {
        const term = searchTerm.value.toLowerCase();
        filteredProducts.value = products.value.filter((product) =>
          product.name.toLowerCase().includes(term)
        );
      } else {
        filteredProducts.value = [...products.value];
      }
    };

    const handleDelete = async (productId: number) => {
      if (!confirm('Are you sure you want to delete this product?')) return;

      try {
        await axios.delete(`https://ziedu-veikals.vercel.app/products/${productId}`, {
          headers: {
            Authorization: AUTH_TOKEN,
          },
        });
        products.value = products.value.filter((product) => product.id !== productId);
        filteredProducts.value = filteredProducts.value.filter((product) => product.id !== productId);
        showSnackbar('Product deleted successfully.', 'success');
      } catch (error) {
        console.error('Error deleting product:', error);
        showSnackbar('Failed to delete product.', 'error');
      }
    };

    const openEditProductModal = (product: Product) => {
      isEditing.value = true;
      Object.assign(selectedProduct, JSON.parse(JSON.stringify(product)));
      optionsToDelete.value = [];
      isModalOpen.value = true;
    };

    const openAddProductModal = () => {
      isEditing.value = false;
      Object.assign(selectedProduct, {
        id: 0,
        name: '',
        type: 'BOUQUET',
        options: [
          {
            name: 'Default',
            description: 'default',
            type: 'DEFAULT',
            images: [],
            price: 0, 
            quantity: 0,
          }
        ],
        short_description: '',
      });
      optionsToDelete.value = [];
      isModalOpen.value = true;
    };

    const closeModal = () => {
      if (productForm.value) {
        productForm.value.resetValidation();
      }
      formValid.value = false; 
      Object.assign(selectedProduct, {
        id: 0,
        name: '',
        type: 'BOUQUET',
        options: [],
        short_description: '',
      });
      optionsToDelete.value = [];
      isModalOpen.value = false;
    };

    const addOption = () => {
      selectedProduct.options.push({
        name: '',
        type: 'COLOR',
        description: '',
        images: [],
        quantity: 0,
        newImages: [],
        uploadingImages: false,
      });
    };

    const removeOption = (index: number) => {
      const option = selectedProduct.options[index];
      if (option.id) {
        optionsToDelete.value.push(option.id);
      }
      selectedProduct.options.splice(index, 1);
    };

    const handleOptionTypeChange = (option: ProductOption) => {
      if (option.type === 'DEFAULT') {
        selectedProduct.options.forEach((opt) => {
          if (opt !== option && opt.type === 'DEFAULT') {
            opt.type = 'COLOR'; 
          }
        });
      }
    };

    const handleImageUpload = async (option: ProductOption) => {
      if (option.newImages && option.newImages.length > 0) {
        option.uploadingImages = true; 

        for (const file of option.newImages) {
          try {
            const formData = new FormData();
            formData.append('file', file);

            const uploadResponse = await axios.post('https://gachi.gay/api/upload', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });

            const { link } = uploadResponse.data;

            if (link) {
              option.images.push(link);
            } else {
              throw new Error('Server response does not contain an image link.');
            }
          } catch (error) {
            console.error('Error uploading image:', error);
            showSnackbar(`Failed to upload image: ${file.name}`, 'error');
          }
        }

        option.newImages = []; 
        option.uploadingImages = false; 
      }
    };

    const removeImage = (option: ProductOption, imgIndex: number) => {
      if (confirm('Are you sure you want to remove this image?')) {
        option.images.splice(imgIndex, 1);
      }
    };

    const saveProduct = async () => {
      if (!formValid.value) {
        showSnackbar('Please correct the errors in the form.', 'error');
        return;
      }

      const defaultOptions = selectedProduct.options.filter(opt => opt.type === 'DEFAULT');
      if (defaultOptions.length !== 1) {
        showSnackbar('There must be exactly one default option.', 'error');
        return;
      }

      isSaving.value = true;

      try {
        let response;
        if (isEditing.value) {
          response = await axios.patch(
            `https://ziedu-veikals.vercel.app/products/${selectedProduct.id}`,
            preparePatchData(),
            {
              headers: {
                Authorization: AUTH_TOKEN,
                'Content-Type': 'application/json',
              },
            }
          );

          const updatedProduct: Product = response.data.product;

          const index = products.value.findIndex((p) => p.id === selectedProduct.id);
          if (index !== -1) {
            products.value[index] = updatedProduct;
            handleSearch(); 
            showSnackbar('Product updated successfully.', 'success');
          } else {
            throw new Error('Product not found in the local list.');
          }
        } else {
          response = await axios.post(
            'https://ziedu-veikals.vercel.app/products',
            preparePostData(),
            {
              headers: {
                Authorization: AUTH_TOKEN,
                'Content-Type': 'application/json',
              },
            }
          );

          const newProduct: Product = response.data.product;

          if (newProduct && newProduct.id) {
            products.value.push(newProduct);
            handleSearch();
            showSnackbar('Product added successfully.', 'success');
          } else {
            throw new Error('Incomplete product data received from server.');
          }
        }
        closeModal(); 
      } catch (error) {
        console.error('Error saving product:', error);
        const errorMessage =
          error.response?.data?.message || 'Failed to save product.';
        showSnackbar(errorMessage, 'error');
      } finally {
        isSaving.value = false;
      }
    };

    const preparePostData = (): any => {
      const productData: any = {
        name: selectedProduct.name,
        type: selectedProduct.type,
        short_description: selectedProduct.short_description,
        discount: selectedProduct.discount,
        is_featured: selectedProduct.is_featured,
        options: selectedProduct.options.map((option) => ({
          name: option.name,
          type: option.type,
          description: option.description,
          images: option.images, 
          price: option.type === 'DEFAULT' ? option.price : undefined,
          quantity: option.quantity,
        })),
      };
      return productData;
    };

    const preparePatchData = (): any => {
      const patchData: any = {
        name: selectedProduct.name,
        type: selectedProduct.type,
        short_description: selectedProduct.short_description,
        discount: selectedProduct.discount,
        is_featured: selectedProduct.is_featured,
        options_to_delete: optionsToDelete.value,
        options: selectedProduct.options.map((option) => ({
          ...(option.id && { id: option.id }), 
          name: option.name,
          type: option.type,
          description: option.description,
          images: option.images, 
          price: option.type === 'DEFAULT' ? option.price : undefined,
          quantity: option.quantity,
        })),
      };
      
      return patchData;
    };

    const getProductImage = (product: Product): string => {
      const defaultOption = getDefaultOption(product);
      if (defaultOption && defaultOption.images.length > 0) {
        return defaultOption.images[0];
      }
      return 'https://via.placeholder.com/300x200?text=No+Image';
    };

    const getDefaultOption = (product: Product): ProductOption | undefined => {
      return product.options.find(opt => opt.type === 'DEFAULT');
    };

    const showSnackbar = (message: string, color: string = 'success') => {
      snackbar.message = message;
      snackbar.color = color;
      snackbar.show = true;
    };

    const hasDefaultOption = computed(() => {
      return selectedProduct.options.some(opt => opt.type === 'DEFAULT');
    });

    const canAddOptionType = (type: string) => {
      if (type === 'DEFAULT') {
        return !hasDefaultOption.value;
      }
      return true;
    };

    watch(() => selectedProduct.options, (newOptions) => {
      const defaultOptions = newOptions.filter(opt => opt.type === 'DEFAULT');
      if (defaultOptions.length > 1) {
        defaultOptions.slice(1).forEach(opt => {
          opt.type = 'COLOR'; 
        });
        showSnackbar('Only one default option is allowed per product.', 'error');
      }
    }, { deep: true });

    return {
      searchTerm,
      products,
      filteredProducts,
      isModalOpen,
      isEditing,
      selectedProduct,
      productTypes,
      optionTypes,
      formValid,
      handleSearch,
      handleDelete,
      openEditProductModal,
      openAddProductModal,
      closeModal,
      addOption,
      removeOption,
      saveProduct,
      preparePostData,
      preparePatchData,
      getProductImage,
      getDefaultOption,
      productForm,
      handleImageUpload,
      removeImage,
      snackbar,
      showSnackbar,
      isSaving,
      hasDefaultOption,
      canAddOptionType,
      handleOptionTypeChange,
      isLoading, // Return the loading state
    };
  },
});
</script>

<style scoped>
/* Remove padding from product cards to allow images to span full width */
.product-card {
  padding: 0;
}

/* Ensure images take full width and cover the area without distortion */
.product-image {
  width: 100%;
  height: 200px; /* Set a desired height */
  object-fit: cover; /* Ensures the image covers the area */
  position: relative; /* To position the title overlay */
}

/* Style for the overlayed product title */
.product-title {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  color: white;
  padding: 8px;
  box-sizing: border-box;
}

/* Limit the search bar width and make it responsive */
.search-bar {
  max-width: 400px;
}

@media (max-width: 600px) {
  .search-bar {
    max-width: 250px;
  }
}

/* Optional: Style for option cards */
.option-card {
  padding: 16px;
}

/* Center align images and delete button in options */
.d-flex.justify-center.align-center {
  align-items: center;
}

/* Optional: Style the Loading Container */
.d-flex.justify-center.align-center {
  min-height: 50vh;
}
</style>
