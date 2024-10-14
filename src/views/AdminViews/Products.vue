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

    <!-- Product Grid -->
    <v-container fluid>
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
                  <div class="text-body-1">${{ product.price.toFixed(2) }}</div>
                </v-col>
                <v-col>
                  <div class="text-caption font-weight-medium">Inventory</div>
                  <div class="text-body-1">{{ product.quantity }} in stock</div>
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
              label="Price"
              v-model.number="selectedProduct.price"
              type="number"
              :rules="[v => v > 0 || 'Price must be positive']"
              required
            ></v-text-field>
            <v-text-field
              label="Quantity"
              v-model.number="selectedProduct.quantity"
              type="number"
              :rules="[v => v >= 0 || 'Quantity cannot be negative']"
              required
            ></v-text-field>
            <v-select
              label="Type"
              v-model="selectedProduct.type"
              :items="productTypes"
              :rules="[v => !!v || 'Type is required']"
              required
            ></v-select>
            <v-textarea
              label="Short Description"
              v-model="selectedProduct.short_description"
              auto-grow
            ></v-textarea>

            <!-- Options Section -->
            <v-divider class="my-4"></v-divider>
            <div class="d-flex justify-space-between align-center mb-2">
              <span class="font-weight-medium">Options</span>
              <v-btn small color="primary" @click="addOption">
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
                  required
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
              </v-card-text>
            </v-card>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeModal">Cancel</v-btn>
          <v-btn color="primary" :disabled="!formValid || isSaving" @click="saveProduct">
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
import { defineComponent, ref, reactive, onMounted } from 'vue';
import axios from 'axios';

interface ProductOption {
  description: string;
  id?: number; // Optional for existing options
  images: string[]; // Stores image URLs
  name: string;
  type: 'COLOR' | 'SIZE' | 'MATERIAL' | 'DEFAULT';
  newImages?: File[]; 
  uploadingImages?: boolean; // To track upload state
}

interface Product {
  discount?: number;
  id?: number; // Made optional for new products
  is_featured?: boolean | null;
  name: string;
  options: ProductOption[];
  price: number;
  quantity: number;
  short_description?: string;
  type: 'BOUQUET' | 'FLOWER'; 
}

export default defineComponent({
  name: 'ProductList',
  setup() {
    
    const searchTerm = ref('');
    const products = ref<Product[]>([]);
    const filteredProducts = ref<Product[]>([]);
    const isModalOpen = ref(false);
    const isEditing = ref(false);
    const isSaving = ref(false); // To track saving state
    const selectedProduct = reactive<Product>({
      id: 0,
      name: '',
      price: 0,
      quantity: 0,
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
    
    const productForm = ref<InstanceType<typeof import('vue').ComponentPublicInstance>>();

    // Replace with your actual JWT token or use environment variables
    const AUTH_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0IiwiZXhwIjoxNzI4OTIxNTUzfQ.XGvf8hvOBcjTPcYQkYFXt64tITjixU0tucm7w0RjLnU';

    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/products', {
          headers: {
            Authorization: AUTH_TOKEN,
          },
        });
        products.value = response.data.products;
        filteredProducts.value = [...products.value];
      } catch (error) {
        console.error('Error fetching products:', error);
        showSnackbar('Failed to load products.', 'error');
      }
    };

    onMounted(() => {
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
        await axios.delete(`http://127.0.0.1:5000/product/${productId}`, {
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
      // Deep clone to prevent mutating the original product object
      Object.assign(selectedProduct, JSON.parse(JSON.stringify(product)));
      isModalOpen.value = true;
    };

    const openAddProductModal = () => {
      isEditing.value = false;
      Object.assign(selectedProduct, {
        id: 0,
        name: '',
        price: 0,
        quantity: 0,
        type: 'BOUQUET',
        options: [],
        short_description: '',
      });
      isModalOpen.value = true;
    };

    const closeModal = () => {
      if (productForm.value) {
        productForm.value.resetValidation();
      }
      formValid.value = false; // Reset form validity
      Object.assign(selectedProduct, {
        id: 0,
        name: '',
        price: 0,
        quantity: 0,
        type: 'BOUQUET',
        options: [],
        short_description: '',
      });
      isModalOpen.value = false;
    };

    const addOption = () => {
      selectedProduct.options.push({
        name: '',
        type: 'COLOR',
        description: '',
        images: [],
        newImages: [],
        uploadingImages: false,
      });
    };

    const removeOption = (index: number) => {
      if (confirm('Are you sure you want to remove this option?')) {
        selectedProduct.options.splice(index, 1);
      }
    };

    const handleImageUpload = async (option: ProductOption) => {
      if (option.newImages && option.newImages.length > 0) {
        option.uploadingImages = true; // Start loading

        for (const file of option.newImages) {
          try {
            const formData = new FormData();
            formData.append('file', file);

            const uploadResponse = await axios.post('https://gachi.gay/api/upload', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });

            // Assuming the response has a structure similar to your curl example
            const { link } = uploadResponse.data;

            if (link) {
              option.images.push(link);
            } else {
              throw new Error('Upload response does not contain a link.');
            }
          } catch (error) {
            console.error('Error uploading image:', error);
            showSnackbar(`Failed to upload image: ${file.name}`, 'error');
          }
        }

        option.newImages = []; // Clear the file input
        option.uploadingImages = false; // Stop loading
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

      isSaving.value = true;

      try {
        let response;
        if (isEditing.value) {
          // Editing existing product
          response = await axios.patch(
            `http://127.0.0.1:5000/product/${selectedProduct.id}`,
            preparePatchData(),
            {
              headers: {
                Authorization: AUTH_TOKEN,
                'Content-Type': 'application/json',
              },
            }
          );

          // Extract the product data from the response
          const updatedProduct: Product = response.data.product;

          // Update the local products list
          const index = products.value.findIndex((p) => p.id === selectedProduct.id);
          if (index !== -1) {
            products.value[index] = updatedProduct;
            handleSearch(); // Re-apply search to update filteredProducts
            showSnackbar('Product updated successfully.', 'success');
          } else {
            throw new Error('Product not found in the local list.');
          }
        } else {
          // Creating new product
          response = await axios.post(
            'http://127.0.0.1:5000/products',
            preparePostData(),
            {
              headers: {
                Authorization: AUTH_TOKEN,
                'Content-Type': 'application/json',
              },
            }
          );

          // Extract the product data from the response
          const newProduct: Product = response.data.product;

          // Ensure the response contains the necessary fields
          if (newProduct && newProduct.id) {
            products.value.push(newProduct);
            handleSearch(); // Re-apply search to update filteredProducts
            showSnackbar('Product added successfully.', 'success');
          } else {
            throw new Error('Incomplete product data received from server.');
          }
        }
        closeModal(); // Close modal only after successful API call
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
        price: selectedProduct.price,
        quantity: selectedProduct.quantity,
        type: selectedProduct.type,
        short_description: selectedProduct.short_description,
        options: selectedProduct.options.map((option) => ({
          name: option.name,
          type: option.type,
          description: option.description,
          images: option.images, // Contains image URLs
        })),
      };
      if (selectedProduct.discount !== undefined) {
        productData.discount = selectedProduct.discount;
      }
      if (selectedProduct.is_featured !== undefined) {
        productData.is_featured = selectedProduct.is_featured;
      }
      return productData;
    };

    const preparePatchData = (): any => {
      const patchData: any = {
        name: selectedProduct.name,
        price: selectedProduct.price,
        quantity: selectedProduct.quantity,
        type: selectedProduct.type,
        short_description: selectedProduct.short_description,
        options: selectedProduct.options.map((option) => ({
          ...(option.id && { id: option.id }), // Include `id` if it exists
          name: option.name,
          type: option.type,
          description: option.description,
          images: option.images, // Contains image URLs
        })),
      };
      
      if (selectedProduct.discount !== undefined) {
        patchData.discount = selectedProduct.discount;
      }
      if (selectedProduct.is_featured !== undefined) {
        patchData.is_featured = selectedProduct.is_featured;
      }
      return patchData;
    };

    const getProductImage = (product: Product): string => {
      if (product.options.length > 0 && product.options[0].images.length > 0) {
        return product.options[0].images[0];
      }
      return 'https://via.placeholder.com/300x200?text=No+Image';
    };

    const showSnackbar = (message: string, color: string = 'success') => {
      snackbar.message = message;
      snackbar.color = color;
      snackbar.show = true;
    };

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
      productForm,
      handleImageUpload,
      removeImage,
      snackbar,
      showSnackbar,
      isSaving, // Expose isSaving to the template
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
</style>
