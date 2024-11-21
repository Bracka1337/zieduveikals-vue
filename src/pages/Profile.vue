<template>
  <div class="container mx-auto p-4 space-y-6">
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-2">Profils</h2>
        <p class="text-gray-600 mb-4">Pārvaldiet savu kontu un apskatiet pasūtījumu vēsturi</p>

        <div class="flex flex-col sm:flex-row items-center gap-4" v-if="isLoggedIn">
          <div class="space-y-1 text-center sm:text-left">
            <h2 class="text-xl font-medium text-gray-800">Lietotājvārds: <span class="font-semibold">{{ user?.username }}</span></h2>
            <p class="text-md text-gray-600">E-pasts: <span class="font-normal">{{ user?.email }}</span></p>
          </div>
        </div>

        <div class="flex justify-end mt-4 space-x-2" v-if="isLoggedIn">
          <button @click="openChangePasswordDialog" class="px-4 py-2 bg-white text-gray-800 rounded border border-gray-300 hover:bg-gray-100">
            Mainīt paroli
          </button>
          <button @click="logout" class="px-4 py-2 bg-[#e6b1b1] text-white rounded hover:bg-[#ffc2c2]">
            Izrakstīties
          </button>
        </div>
      </div>
    </div>

    <!-- Purchase History Section -->
    <div class="bg-white shadow rounded-lg overflow-hidden" v-if="isLoggedIn && orders.length > 0">
      <div class="p-6">
        <h2 class="text-2xl font-bold mb-4">Pirkuma vēsture</h2>
        <div class="space-y-4">
          <div v-for="order in orders" :key="order.id" class="border border-gray-300 rounded-lg p-4">
            <h3 class="text-lg font-semibold text-gray-800">Pasūtījuma ID: {{ order.order_id }}</h3>
            <p class="text-sm text-gray-600">Izveidots: {{ new Date(order.created_at).toLocaleString() }}</p>
            <p class="text-sm text-gray-600">Statuss: {{ order.status }}</p>
            <div class="mt-3">
              <h4 class="font-medium text-gray-700">Preces:</h4>
              <ul class="space-y-2">
                <li v-for="item in order.items" :key="item.id" class="flex gap-4">
                  <img :src="item.product_photo" alt="Product Image" class="w-16 h-16 object-cover rounded border">
                  <div>
                    <p class="font-medium">{{ item.product_name }}</p>
                    <p class="text-sm text-gray-600">Daudzums: {{ item.quantity }}</p>
                    <p class="text-sm text-gray-600">Cena: {{ item.price.toFixed(2) }} €</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <teleport to="body">
      <div v-if="isChangePasswordDialogOpen" class="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Mainīt paroli</h3>
          <div class="space-y-4">
            <div>
              <label for="current" class="block text-sm font-medium text-gray-700">Pašreizējā parole</label>
              <input id="current" type="password" v-model="currentPassword" class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm" />
            </div>
            <div>
              <label for="new" class="block text-sm font-medium text-gray-700">Jaunā parole</label>
              <input id="new" type="password" v-model="newPassword" class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm" />
              <p class="text-sm text-red-500" v-if="newPassword && !isNewPasswordValid">
                Parolei jābūt vismaz 8 simbolu garai, jāietver 1 lielais burts un 1 īpašais simbols.
              </p>
            </div>
            <div>
              <label for="confirm" class="block text-sm font-medium text-gray-700">Apstipriniet jauno paroli</label>
              <input id="confirm" type="password" v-model="confirmPassword" class="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm" />
            </div>
          </div>
          <div class="mt-6 flex justify-end space-x-3">
            <button @click="closeChangePasswordDialog" class="px-4 py-2 bg-white text-gray-800 rounded border border-gray-300 hover:bg-gray-100">
              Atcelt
            </button>
            <button @click="changePassword" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" :disabled="!isPasswordChangeAllowed">
              Saglabāt izmaiņas
            </button>
          </div>
        </div>
      </div>
    </teleport>

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

const isLoggedIn = computed(() => !!localStorage.getItem('access_token'));

const isNewPasswordValid = computed(() => {
  const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+.])[A-Za-z\d!@#$%^&*()_+.]{8,}$/;
  return regex.test(newPassword.value);
});

const isPasswordChangeAllowed = computed(() => {
  return isNewPasswordValid.value && newPassword.value === confirmPassword.value;
});

const fetchUserData = async () => {
  const token = localStorage.getItem('access_token');

  if (!token) {
    showNotification('error', 'Autentifikācijas marķieris nav atrasts');
    return;
  }

  try {
    const response = await fetch('https://ziedu-veikals.vercel.app/orders', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) throw new Error('Neizdevās iegūt datus');

    const data = await response.json();
    orders.value = data.orders;
    user.value = data.user;
  } catch (error) {
    showNotification('error', `Kļūda: ${error.message}`);
  }
};

onMounted(fetchUserData);

const openChangePasswordDialog = () => (isChangePasswordDialogOpen.value = true);
const closeChangePasswordDialog = () => {
  isChangePasswordDialogOpen.value = false;
  currentPassword.value = '';
  newPassword.value = '';
  confirmPassword.value = '';
};

const changePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    showNotification('error', 'Jaunās paroles nesakrīt.');
    return;
  }

  if (!isNewPasswordValid.value) {
    showNotification(
      'error',
      'Parolei jābūt vismaz 8 simbolu garai, jāietver 1 lielais burts un 1 īpašais simbols.'
    );
    return;
  }

  const token = localStorage.getItem('access_token');
  if (!token) {
    showNotification('error', 'Autentifikācijas marķieris nav atrasts.');
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
      showNotification('error', errorData.message || 'Neizdevās mainīt paroli.');
      return;
    }

    const data = await response.json();
    showNotification('success', data.message);
    closeChangePasswordDialog();
  } catch (error) {
    showNotification('error', `Kļūda: ${error.message}`);
  }
};

const logout = () => {
  localStorage.clear('access_token');
  location.reload();
};

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
