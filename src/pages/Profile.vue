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
          <button @click="openChangePasswordDialog" class="px-4 py-2 bg-white text-gray-800 rounded border border-gray-300 hover:bg-gray-100">
            Change Password
          </button>
          <button @click="logout" class="px-4 py-2 bg-[#e6b1b1] text-white rounded hover:bg-[#ffc2c2]">
            Logout
          </button>
        </div>
      </div>
    </div>

    <!-- Change Password Dialog -->
    <teleport to="body">
      <div v-if="isChangePasswordDialogOpen" class="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Change Password</h3>
          <div class="space-y-4">
            <div>
              <label for="current" class="block text-sm font-medium text-gray-700">Current Password</label>
              <input id="current" type="password" v-model="currentPassword" class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm" />
            </div>
            <div>
              <label for="new" class="block text-sm font-medium text-gray-700">New Password</label>
              <input id="new" type="password" v-model="newPassword" class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm" />
              <p class="text-sm text-red-500" v-if="newPassword && !isNewPasswordValid">
                Password must be at least 8 characters long, include 1 uppercase letter, and 1 special character.
              </p>
            </div>
            <div>
              <label for="confirm" class="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input id="confirm" type="password" v-model="confirmPassword" class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm" />
            </div>
          </div>
          <div class="mt-6 flex justify-end space-x-3">
            <button @click="closeChangePasswordDialog" class="px-4 py-2 bg-white text-gray-800 rounded border border-gray-300 hover:bg-gray-100">
              Cancel
            </button>
            <button @click="changePassword" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" :disabled="!isPasswordChangeAllowed">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- Notifications -->
    <teleport to="body">
      <div class="fixed top-4 right-4 space-y-4" v-if="notifications.length">
        <div
          v-for="(notification, index) in notifications"
          :key="index"
          :class="`alert ${notification.type}`"
          class="transition-opacity duration-300 animate-slide-down bg-opacity-80 px-4 py-3 rounded shadow"
          @animationend="removeNotification(index)"
        >
          {{ notification.message }}
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const user = ref(null);
const orders = ref([]);
const isChangePasswordDialogOpen = ref(false);
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const notifications = ref([]);

// Password Validation
const isNewPasswordValid = computed(() => {
  const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+.])[A-Za-z\d!@#$%^&*()_+.]{8,}$/;
  return regex.test(newPassword.value);
});

const isPasswordChangeAllowed = computed(() => {
  return isNewPasswordValid.value && newPassword.value === confirmPassword.value;
});

// Fetch User Data
const fetchUserData = async () => {
  const token = localStorage.getItem('access_token');

  if (!token) {
    showNotification('error', 'No token found');
    return;
  }

  try {
    const response = await fetch('https://ziedu-veikals.vercel.app/orders', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error('Failed to fetch data');

    const data = await response.json();
    orders.value = data.orders;
    user.value = data.user;
  } catch (error) {
    showNotification('error', `Error: ${error.message}`);
  }
};

onMounted(fetchUserData);

// Dialog Controls
const openChangePasswordDialog = () => (isChangePasswordDialogOpen.value = true);
const closeChangePasswordDialog = () => {
  isChangePasswordDialogOpen.value = false;
  currentPassword.value = '';
  newPassword.value = '';
  confirmPassword.value = '';
};

const changePassword = async () => {
  // Check if new password and confirm password do not match
  if (newPassword.value !== confirmPassword.value) {
    showNotification('error', 'New passwords do not match.');
    return;
  }

  const token = localStorage.getItem('access_token');
  if (!token) {
    showNotification('error', 'No token found.');
    return;
  }

  try {
    const response = await fetch('https://ziedu-veikals.vercel.app/change_password', {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        old_password: currentPassword.value,
        new_password: newPassword.value,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      showNotification('error', errorData.message || 'Failed to change password.');
      return;
    }

    const data = await response.json();
    showNotification('success', data.message);
    closeChangePasswordDialog();
  } catch (error) {
    showNotification('error', `Error: ${error.message}`);
  }
};


// Logout
const logout = () => {
  localStorage.clear('access_token');
  location.reload();
};

// Notifications
const showNotification = (type, message) => {
  notifications.value.push({ type, message });
};

const removeNotification = (index) => {
  notifications.value.splice(index, 1);
};
</script>

<style>
.alert {
  opacity: 0;
  animation: fadeInOut 3s forwards;
}
.alert.success {
  background-color: #4caf50;
  color: white;
}
.alert.error {
  background-color: #f44336;
  color: white;
}
@keyframes fadeInOut {
  0%, 90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
