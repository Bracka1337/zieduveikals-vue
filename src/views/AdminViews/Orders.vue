<template>
  <v-main>
    <!-- App Bar -->
    <v-app-bar app clipped-left>
      <v-app-bar-nav-icon @click="drawer = !drawer" class="d-md-none"></v-app-bar-nav-icon>
      <v-toolbar-title>Orders</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-text-field
        solo
        placeholder="Search by Order ID or User"
        v-model="searchTerm"
        @input="handleSearchDebounced"
        class="mx-4"
        clearable
        hide-details
        outlined
        dense
      />
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app>
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Navigation Item</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <!-- Add more navigation items as needed -->
      </v-list>
    </v-navigation-drawer>

    <!-- Orders Table with Expandable Rows -->
    <v-container fluid>
      <v-card>
        <v-data-table
          :headers="headers"
          :items="displayedOrders"
          :search="searchTerm"
          class="elevation-1"
          :items-per-page="batchSize"
          :loading="loading"
          loading-text="Loading orders..."
          hide-default-footer
          show-expand
          :expanded.sync="expanded"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Order List</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="startDate"
                label="Start Date"
                type="date"
                @change="handleDateFilter"
                class="mx-2"
                outlined
                dense
              ></v-text-field>
              <v-text-field
                v-model="endDate"
                label="End Date"
                type="date"
                @change="handleDateFilter"
                class="mx-2"
                outlined
                dense
              ></v-text-field>
              <v-btn color="primary" @click="exportToExcel" class="ml-2">
                Export to Excel
              </v-btn>
            </v-toolbar>
          </template>

          <!-- Customize the Row to Include Expand/Collapse Button -->
          <template v-slot:item="{ item, toggleExpand, isExpanded }">
            <tr>
              <td>{{ item.id }}</td>
              <td>{{ item.status }}</td>
              <td>{{ formatDate(item.created_at) }}</td>
              <td>{{ item.user.username }}</td>
              <td>
                <v-btn icon small @click="toggleExpand(item)" aria-label="Expand or collapse order details">
                  <v-icon>{{ isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>

          <!-- Expanded Row Content -->
          <template v-slot:expanded-item="{ item }">
            <v-card flat>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6">
                    <h3>Order Details</h3>
                    <p><strong>Order ID:</strong> {{ item.id }}</p>
                    <p><strong>Status:</strong> {{ item.status }}</p>
                    <p><strong>Created At:</strong> {{ formatDate(item.created_at) }}</p>
                    <p v-if="item.promocode"><strong>Promocode:</strong> {{ item.promocode.code }} ({{ item.promocode.discount }}%)</p>
                  </v-col>
                  <v-col cols="12" md="6">
                    <h3>User Information</h3>
                    <p><strong>User ID:</strong> {{ item.user.id }}</p>
                    <p><strong>Username:</strong> {{ item.user.username }}</p>
                    <p><strong>Email:</strong> {{ item.user.email }}</p>
                    <p><strong>Role:</strong> {{ item.user.role }}</p>
                  </v-col>
                </v-row>
                <v-divider class="my-4"></v-divider>
                <h3>Items</h3>
                <v-simple-table>
                  <thead>
                    <tr>
                      <th class="text-left">Product</th>
                      <th class="text-left">Description</th>
                      <th class="text-left">Quantity</th>
                      <th class="text-left">Price</th>
                      <th class="text-left">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="itemDetail in item.items" :key="itemDetail.id">
                      <td>{{ itemDetail.product_name }}</td>
                      <td>{{ itemDetail.product_description || 'N/A' }}</td>
                      <td>{{ itemDetail.quantity }}</td>
                      <td>${{ itemDetail.price.toFixed(2) }}</td>
                      <td>${{ (itemDetail.price * itemDetail.quantity).toFixed(2) }}</td>
                    </tr>
                  </tbody>
                </v-simple-table>
                <v-divider class="my-4"></v-divider>
                <h3>Total Order Amount: ${{ calculateTotalOrderAmount(item).toFixed(2) }}</h3>
              </v-card-text>
            </v-card>
          </template>
        </v-data-table>
      </v-card>
    </v-container>

    <!-- Sentinel Element for Infinite Scroll -->
    <div ref="sentinel"></div>

    <!-- Loading Indicator for Infinite Scroll -->
    <v-progress-linear v-if="isLoadingMore" indeterminate color="primary" class="mt-2"></v-progress-linear>

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
import { defineComponent, ref, reactive, onMounted, onUnmounted, watch } from 'vue';
import axios from 'axios';
import { debounce } from 'lodash';
import * as XLSX from 'xlsx';

interface Promocode {
  id: number;
  code: string;
  discount: number;
  count_usage: number;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_description: string;
  product_photo: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  status: string;
  created_at: string;
  user: User;
  promocode: Promocode | null;
  items: OrderItem[];
}

export default defineComponent({
  name: 'OrdersList',
  setup() {
    const searchTerm = ref('');
    const orders = ref<Order[]>([]);
    const filteredOrders = ref<Order[]>([]);
    const displayedOrders = ref<Order[]>([]);
    const loading = ref(false);
    const isLoadingMore = ref(false);
    const snackbar = reactive({
      show: false,
      message: '',
      color: 'success',
    });
    const expanded = ref<string[]>([]);
    const sentinel = ref<HTMLElement | null>(null);
    const drawer = ref(false);

    // Date Filters
    const startDate = ref<string>('');
    const endDate = ref<string>('');

    // Replace with your actual Bearer token retrieval logic
    const AUTH_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0IiwiZXhwIjoxNzI4OTI0NzM0fQ.-vo6xnRxUdZuZo6BV2kEPxycFqol-2nyV1_I7eJZH-A';

    const headers = [
      { text: 'Order ID', value: 'id' },
      { text: 'Status', value: 'status' },
      { text: 'Created At', value: 'created_at' },
      { text: 'User', value: 'user.username' },
      { text: 'Actions', value: 'actions', sortable: false },
    ];

    const batchSize = ref<number>(20);

    const handleSearchDebounced = debounce(() => {
      handleSearch();
    }, 300);

    const fetchOrders = async () => {
      loading.value = true;
      try {
        const response = await axios.get('http://https://ziedu-veikals.vercel.app/orders', {
          headers: {
            Authorization: AUTH_TOKEN,
          },
        });
        orders.value = response.data.orders;
        filteredOrders.value = [...orders.value];
        displayedOrders.value = filteredOrders.value.slice(0, batchSize.value);
        initObserver();
      } catch (error) {
        console.error('Error fetching orders:', error);
        showSnackbar('Failed to load orders.', 'error');
      } finally {
        loading.value = false;
      }
    };

    const loadMore = () => {
      if (isLoadingMore.value) return;
      isLoadingMore.value = true;
      setTimeout(() => {
        const currentLength = displayedOrders.value.length;
        const more = filteredOrders.value.slice(currentLength, currentLength + batchSize.value);
        displayedOrders.value = displayedOrders.value.concat(more);
        isLoadingMore.value = false;
        if (displayedOrders.value.length < filteredOrders.value.length) {
          initObserver();
        }
      }, 500); // Simulate network delay
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && displayedOrders.value.length < filteredOrders.value.length) {
        loadMore();
      }
    };

    let observer: IntersectionObserver | null = null;

    const initObserver = () => {
      if (observer) observer.disconnect();
      observer = new IntersectionObserver(handleIntersect, {
        root: null,
        rootMargin: '0px',
        threshold: 1.0,
      });
      if (sentinel.value) {
        observer.observe(sentinel.value);
      }
    };

    onUnmounted(() => {
      if (observer) observer.disconnect();
    });

    watch(filteredOrders, () => {
      displayedOrders.value = filteredOrders.value.slice(0, batchSize.value);
      if (observer && sentinel.value) {
        observer.disconnect();
        observer = new IntersectionObserver(handleIntersect, {
          root: null,
          rootMargin: '0px',
          threshold: 1.0,
        });
        observer.observe(sentinel.value);
      }
    });

    onMounted(() => {
      fetchOrders();
    });

    const filterOrders = () => {
      let term = searchTerm.value.trim().toLowerCase();
      filteredOrders.value = orders.value.filter((order) => {
        const matchesSearch = term === '' || order.id.toString().includes(term) || order.user.username.toLowerCase().includes(term);
        const orderDate = new Date(order.created_at);
        const start = startDate.value ? new Date(startDate.value) : null;
        const end = endDate.value ? new Date(endDate.value) : null;
        const matchesDate = (!start || orderDate >= start) && (!end || orderDate <= end);
        return matchesSearch && matchesDate;
      });
    };

    const handleSearch = () => {
      filterOrders();
    };

    const handleDateFilter = () => {
      filterOrders();
    };

    watch([startDate, endDate], () => {
      filterOrders();
    });

    const showSnackbar = (message: string, color: string = 'success') => {
      snackbar.message = message;
      snackbar.color = color;
      snackbar.show = true;
    };

    const formatDate = (dateStr: string): string => {
      const date = new Date(dateStr);
      return date.toLocaleString();
    };

    const calculateTotalOrderAmount = (order: Order): number => {
      return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    const exportToExcel = () => {
      // Prepare data for Excel
      const data: any[] = [];

      filteredOrders.value.forEach(order => {
        // Calculate total order amount
        const totalOrderAmount = calculateTotalOrderAmount(order);
        // For each item in the order, create a row
        order.items.forEach((item, index) => {
          data.push({
            'Order ID': index === 0 ? order.id : '',
            'Status': index === 0 ? order.status : '',
            'Created At': index === 0 ? formatDate(order.created_at) : '',
            'User': index === 0 ? order.user.username : '',
            'Product': item.product_name,
            'Description': item.product_description || 'N/A',
            'Quantity': item.quantity,
            'Price per Item': item.price.toFixed(2),
            'Total Price': (item.price * item.quantity).toFixed(2),
          });
        });
        // Add a summary row for the order total
        data.push({
          'Order ID': '',
          'Status': '',
          'Created At': '',
          'User': '',
          'Product': '',
          'Description': '',
          'Quantity': '',
          'Price per Item': 'Total Order Amount:',
          'Total Price': totalOrderAmount.toFixed(2),
        });
        // Add an empty row for separation
        data.push({});
      });

      // Create worksheet and workbook
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');

      // Save to file
      XLSX.writeFile(workbook, 'orders.xlsx');
    };

    return {
      searchTerm,
      orders,
      filteredOrders,
      displayedOrders,
      headers,
      loading,
      isLoadingMore,
      snackbar,
      handleSearch,
      handleDateFilter,
      showSnackbar,
      formatDate,
      expanded,
      sentinel,
      drawer,
      batchSize,
      handleSearchDebounced,
      startDate,
      endDate,
      exportToExcel,
      calculateTotalOrderAmount,
      toggleExpand: (order: Order) => {
        const orderIdStr = order.id.toString();
        const index = expanded.value.indexOf(orderIdStr);
        if (index === -1) {
          expanded.value.push(orderIdStr);
        } else {
          expanded.value.splice(index, 1);
        }
      },
      isExpanded: (order: Order): boolean => {
        return expanded.value.includes(order.id.toString());
      },
    };
  },
});
</script>

<style scoped>
/* Ensure the data table occupies full width */
.v-data-table {
  width: 100%;
}

/* Styling for Order Cards */
.order-card {
  width: 100%;
  margin: 0 auto 16px auto; /* Center the card and add bottom margin */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Compact the card title layout */
.order-card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

/* Reduce padding inside the card text */
.v-card-text {
  padding: 16px;
}

/* Ensure table cells allow text to wrap */
.v-simple-table th,
.v-simple-table td {
  white-space: normal;
  word-wrap: break-word;
}

/* Adjust the size of the expand/collapse button */
.v-btn[icon] {
  padding: 4px;
}

/* Responsive Adjustments */
@media (max-width: 600px) {
  .order-card-title {
    flex-direction: column;
    align-items: flex-start;
  }

  .order-info {
    margin-bottom: 8px;
  }
}

/* Remove padding from sentinel element */
div[ref="sentinel"] {
  height: 1px;
}
</style>
