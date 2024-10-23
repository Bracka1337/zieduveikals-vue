<template>
  <v-main>
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
      </v-list>
    </v-navigation-drawer>

    <v-container fluid>
      <v-card>
        <v-card-title>
          <v-row align="center">
            <v-col cols="8">
              <v-toolbar-title>Order List</v-toolbar-title>
            </v-col>
            <v-col cols="4" class="text-right">
              <v-btn color="primary" @click="exportToExcel">
                Export to Excel
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="displayedOrders"
          :search="searchTerm"
          :loading="loading"
          loading-text="Loading orders..."
          class="elevation-1"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.id }}</td>
              <td>
                <v-chip :color="getStatusColor(item.status)" small>
                  {{ item.status }}
                </v-chip>
              </td>
              <td>{{ formatDate(item.created_at) }}</td>
              <td>{{ item.user.username }}</td>
              <td>
                <v-btn
                  color="primary"
                  small
                  @click="openOrderDetails(item)"
                >
                  View Details
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
    </v-container>

    <v-dialog v-model="orderDetailsDialog" max-width="800px">
      <v-card v-if="selectedOrder">
        <v-card-title class="pb-4">
          <span class="headline">Order Details</span>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6">
              <p><strong>Order ID:</strong> {{ selectedOrder.id }}</p>
              <p><strong>Status:</strong> {{ selectedOrder.status }}</p>
              <p><strong>Created At:</strong> {{ formatDate(selectedOrder.created_at) }}</p>
              <p><strong>Address:</strong> {{ selectedOrder.address }}</p>
              <p><strong>Phone Number:</strong> {{ selectedOrder.phone_number }}</p>
            </v-col>
            <v-col cols="12" sm="6">
              <p><strong>User:</strong> {{ selectedOrder.user.username }}</p>
              <p><strong>Email:</strong> {{ selectedOrder.user.email }}</p>
              <p><strong>Role:</strong> {{ selectedOrder.user.role }}</p>
            </v-col>
          </v-row>
          <v-divider class="my-4"></v-divider>
          <h3>Order Items</h3>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in selectedOrder.items" :key="item.id">
                  <td>{{ item.product_name }}</td>
                  <td>{{ item.product_description }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>${{ item.price.toFixed(2) }}</td>
                  <td>${{ (item.quantity * item.price).toFixed(2) }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
          <v-divider class="my-4"></v-divider>
          <p class="text-h6"><strong>Total Order Amount:</strong> ${{ calculateTotalOrderAmount(selectedOrder).toFixed(2) }}</p>
          <p v-if="selectedOrder.promocode">
            <strong>Promocode:</strong> {{ selectedOrder.promocode.code }} ({{ selectedOrder.promocode.discount }}% discount)
          </p>
          <p v-else><strong>Promocode:</strong> No promocode used</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="orderDetailsDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div ref="sentinel"></div>

    <v-progress-linear
      v-if="isLoadingMore"
      indeterminate
      color="primary"
      class="mt-2"
    ></v-progress-linear>

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
  id: string;
  status: string;
  created_at: string;
  user: User;
  promocode: Promocode | null;
  items: OrderItem[];
  address: string;
  phone_number: string;
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

    const startDate = ref<string>('');
    const endDate = ref<string>('');

    const AUTH_TOKEN = 'Bearer ' + localStorage.getItem('access_token');

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
        const response = await axios.get('https://ziedu-veikals.vercel.app/orders', {
          headers: {
            Authorization: AUTH_TOKEN,
          },
        });

        orders.value = response.data.orders.map((order: any) => ({
          ...order,
          id: order.id.toString(),
        }));

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
      }, 500);
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
        const matchesSearch =
          term === '' ||
          order.id.toString().includes(term) ||
          order.user.username.toLowerCase().includes(term);
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
      const data: any[] = [];

      filteredOrders.value.forEach((order) => {
        const totalOrderAmount = calculateTotalOrderAmount(order);

        order.items.forEach((item, index) => {
          data.push({
            'Order ID': index === 0 ? order.id : '',
            Status: index === 0 ? order.status : '',
            'Created At': index === 0 ? formatDate(order.created_at) : '',
            User: index === 0 ? order.user.username : '',
            Product: item.product_name,
            Description: item.product_description || 'N/A',
            Quantity: item.quantity,
            'Price per Item': item.price.toFixed(2),
            'Total Price': (item.price * item.quantity).toFixed(2),
          });
        });

        data.push({
          'Order ID': '',
          Status: '',
          'Created At': '',
          User: '',
          Product: '',
          Description: '',
          Quantity: '',
          'Price per Item': 'Total Order Amount:',
          'Total Price': totalOrderAmount.toFixed(2),
        });

        data.push({});
      });

      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');

      XLSX.writeFile(workbook, 'orders.xlsx');
    };


    const selectedOrder = ref(null);
    const orderDetailsDialog = ref(false);

    const openOrderDetails = (order) => {
      selectedOrder.value = order;
      orderDetailsDialog.value = true;
    };

    const getStatusColor = (status) => {
      switch (status) {
        case 'PENDING':
          return 'warning';
        case 'COMPLETED':
          return 'success';
        case 'CANCELLED':
          return 'error';
        default:
          return 'primary';
      }
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
      selectedOrder,
      orderDetailsDialog,
      openOrderDetails,
      getStatusColor,
    };
  },
});
</script>

<style scoped>
.v-data-table {
  width: 100%;
}

.order-card {
  width: 100%;
  margin: 0 auto 16px auto; 
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.order-card-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

.v-card-text {
  padding: 16px;
}

.v-simple-table th,
.v-simple-table td {
  white-space: normal;
  word-wrap: break-word;
}

.v-btn[icon] {
  padding: 4px;
}

@media (max-width: 600px) {
  .order-card-title {
    flex-direction: column;
    align-items: flex-start;
  }

  .order-info {
    margin-bottom: 8px;
  }
}

div[ref='sentinel'] {
  height: 1px;
}
</style>