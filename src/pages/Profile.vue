<template>
  <div class="container mx-auto p-4 space-y-6">
    <!-- Profile Section -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-2">Profile</h2>
        <p class="text-gray-600 mb-4">Manage your account and view your order history</p>
        <div class="flex flex-col sm:flex-row items-center gap-4">
          <div class="space-y-1 text-center sm:text-left">
            <h2 class="text-2xl font-bold">{{ user?.username }}</h2>
            <p class="text-gray-600">{{ user?.email }}</p>
          </div>
        </div>
        <div class="flex justify-end mt-4 space-x-2">
          <button @click="openChangePasswordDialog" class="px-4 py-2 bg-white text-gray-800 rounded border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition">
            Change Password
          </button>
          <button @click="logout" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition">
            Logout
          </button>
        </div>
      </div>
    </div>

    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-2">Previous Orders</h2>
        <p class="text-gray-600 mb-4">Your order history</p>
        <div class="space-y-4">
          <div v-for="order in orders" :key="order.id" class="flex items-center justify-between border-b pb-4 last:border-b-0">
            <div class="flex items-center space-x-4">
              <div class="p-2 bg-primary-100 rounded-full">
                <img :src="order.items[0].product_photo" class="w-6 h-6 rounded-full" alt="Product Image"/>
              </div>
              <div>
                <p class="font-medium">{{ order.id }}</p>
                <p class="text-sm text-gray-500" v-for="item in order.items">{{ item.product_name }} x {{ item.quantity }} ({{ item.quantity * item.price }})</p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <span :class="['px-2 py-1 text-xs font-semibold rounded-full', order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800']">
                {{ order.status }}
              </span>
              <p class="font-medium">{{ order.items.reduce((total, item) => total + (item.quantity * item.price), 0) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <teleport to="body">
      <div v-if="isChangePasswordDialogOpen" class="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Change Password</h3>
          <div class="space-y-4">
            <div>
              <label for="current" class="block text-sm font-medium text-gray-700">Current Password</label>
              <input id="current" type="password" v-model="currentPassword" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label for="new" class="block text-sm font-medium text-gray-700">New Password</label>
              <input id="new" type="password" v-model="newPassword" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label for="confirm" class="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input id="confirm" type="password" v-model="confirmPassword" class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" />
            </div>
          </div>
          <div class="mt-6 flex justify-end space-x-3">
            <button @click="closeChangePasswordDialog" class="px-4 py-2 bg-white text-gray-800 rounded border border-gray-300 hover:bg-gray-100">
              Cancel
            </button>
            <button @click="changePassword" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" :disabled="!isPasswordValid">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const user = ref(null)
const orders = ref([])
const isChangePasswordDialogOpen = ref(false)
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const isPasswordValid = computed(() => {
  return newPassword.value && newPassword.value === confirmPassword.value
})

const fetchUserData = async () => {
  const token = localStorage.getItem('access_token')

  if (!token) {
    console.error('No token found')
    return
  }

  try {
    const response = await fetch('https://ziedu-veikals.vercel.app/orders', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }

    const data = await response.json()
    orders.value = data.orders
    user.value = data.user
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

onMounted(() => {
  fetchUserData()
})

const openChangePasswordDialog = () => {
  isChangePasswordDialogOpen.value = true
}

const closeChangePasswordDialog = () => {
  isChangePasswordDialogOpen.value = false
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
}

const changePassword = async () => {
  if (isPasswordValid.value) {
    const token = localStorage.getItem('access_token')

    if (!token) {
      console.error('No token found')
      return
    }

    try {
      const response = await fetch('https://ziedu-veikals.vercel.app/change_password', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          old_password: currentPassword.value,
          new_password: newPassword.value
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to change password')
      }

      const data = await response.json()
      alert(data.message)  // Success message
      closeChangePasswordDialog()
    } catch (error) {
      console.error('Error changing password:', error)
      alert(error.message)
    }
  } else {
    alert("Passwords do not match.")
  }
}

const logout = () => {
  localStorage.clear('access_token');
  location.reload();
}
</script>
