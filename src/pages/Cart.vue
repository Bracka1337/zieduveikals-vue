<template>
  <div class="container mx-auto p-4 md:p-8">
    <h2 class="text-2xl font-bold mb-4">Grozs</h2>
    
    <div v-if="notification" class="mb-4 p-4 rounded" :class="notificationClass">
      {{ notification }}
    </div>

    <div class="flex flex-col md:flex-row gap-8">
      <div class="w-full md:w-2/3">
        <template v-if="cartItems.length > 0">
          <div v-for="item in cartItems" :key="item.id" class="bg-white shadow-md rounded-lg mb-4 p-4 flex justify-between items-center">
            <div class="flex items-center space-x-4">
              <img :src="item.image" :alt="item.name" class="w-24 h-24 object-cover rounded" />
              <div class="text-left">
                <p class="font-bold">{{ item.name }}</p>
                <p class="text-sm text-gray-500">{{ item.price.toFixed(2) }} €</p>
                <p class="text-xs text-gray-400">{{ item.selected_option.name }}</p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <input
                type="number"
                v-model.number="item.quantity"
                @change="updateQuantity(item.id, item.quantity)"
                min="1"
                class="w-16 border rounded p-1 text-center"
              />
              <button
                @click="removeFromCart(item.id)"
                class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition duration-200"
              >
                Izdzēst
              </button>
            </div>
          </div>

          <div class="flex justify-between items-center mt-6">
            <p class="text-lg font-bold">Kopumā:</p>
            <p class="text-lg font-bold">{{ subtotal.toFixed(2) }} €</p>
          </div>

          <div v-if="orderInfo.customer_status === 'jur'" class="flex justify-between items-center mt-2">
            <p class="text-lg">PVN atlaide (21%):</p>
            <p class="text-lg">-{{ pvnDiscount.toFixed(2) }} €</p>
          </div>

          <div v-if="appliedPromocode" class="flex justify-between items-center mt-2">
            <p class="text-lg">Atlaide ({{ appliedPromocode.code }}):</p>
            <p class="text-lg">-{{ promocodeDiscount.toFixed(2) }} €</p>
          </div>

          <div class="flex justify-between items-center mt-2">
            <p class="text-xl font-bold">Gala summa:</p>
            <p class="text-xl font-bold">{{ totalPrice.toFixed(2) }} €</p>
          </div>

          <div class="mt-4">
            <label for="promocode" class="block text-sm font-medium text-gray-700">Atlaides kods</label>
            <div class="flex mt-1">
              <input
                id="promocode"
                v-model="promocode"
                type="text"
                placeholder="Ievadiet atlaides kodu"
                class="flex-grow mr-2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                @click="applyPromocode"
                class="bg-[#ffc2c2] text-white px-4 py-2 rounded hover:bg-[#ffb2b2] transition duration-200"
              >
                Pielietot
              </button>
            </div>
          </div>
        </template>
        <p v-else class="text-lg text-gray-500">Jūsu grozs ir tukšs.</p>
      </div>

      <div class="w-full md:w-1/3">
        <div class="bg-white shadow-md rounded-lg p-4">
          <h3 class="text-xl font-semibold mb-4">Pasūtījuma informācija</h3>
          <form @submit.prevent="initiateOrder" class="space-y-4">
            <div>
              <label for="customerStatus" class="block text-sm font-medium text-gray-700">Klienta statuss</label>
              <select
                id="customerStatus"
                v-model="orderInfo.customer_status"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="fiz">Fiziska persona</option>
                <option value="jur">Juridiska persona</option>
              </select>
            </div>
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Vārds</label>
              <input
                id="name"
                v-model="orderInfo.name"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label for="surname" class="block text-sm font-medium text-gray-700">Uzvārds</label>
              <input
                id="surname"
                v-model="orderInfo.surname"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label for="phoneNumber" class="block text-sm font-medium text-gray-700">Tālruņa numurs</label>
              <input
                id="phoneNumber"
                v-model="orderInfo.phone_number"
                type="tel"
                required
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label for="address" class="block text-sm font-medium text-gray-700">Adrese</label>
              <textarea
                id="address"
                v-model="orderInfo.address"
                required
                rows="3"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              ></textarea>
            </div>
            <button
              type="submit"
              class="w-full bg-[#ffc2c2] text-white px-4 py-2 rounded hover:bg-[#ffb2b2] transition duration-200"
              :disabled="isProcessing"
            >
              {{ isProcessing ? 'Apstrādā...' : 'Veikt pasūtījumu' }}
            </button>
          </form>
          <div v-if="paymentLink" class="mt-4">
            <a :href="paymentLink" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">Apmaksāt pasūtījumu</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const PVN_RATE = 0.21 // 21% VAT rate for Latvia

const cartItems = ref([])
const loading = ref(false)
const isProcessing = ref(false)
const paymentLink = ref('')
const promocode = ref('')
const appliedPromocode = ref(null)
const orderInfo = ref({
  customer_status: 'fiz',
  phone_number: '',
  address: '',
  name: '',
  surname: ''
})

const notification = ref('')
const notificationType = ref('')

const subtotal = computed(() => cartItems.value.reduce((total, item) => total + item.line_total, 0))
const pvnDiscount = computed(() => orderInfo.value.customer_status === 'jur' ? subtotal.value * PVN_RATE : 0)
const promocodeDiscount = computed(() => appliedPromocode.value ? (subtotal.value - pvnDiscount.value) * (appliedPromocode.value.discount / 100) : 0)
const totalPrice = computed(() => subtotal.value - pvnDiscount.value - promocodeDiscount.value)

const notificationClass = computed(() => {
  switch (notificationType.value) {
    case 'success':
      return 'bg-green-100 border border-green-400 text-green-700'
    case 'error':
      return 'bg-red-100 border border-red-400 text-red-700'
    default:
      return 'bg-blue-100 border border-blue-400 text-blue-700'
  }
})

onMounted(() => {
  fetchCartItems()
})

const showNotification = (message, type = 'info') => {
  notification.value = message
  notificationType.value = type
  setTimeout(() => {
    notification.value = ''
    notificationType.value = ''
  }, 5000)
}

const fetchCartItems = async () => {
  loading.value = true
  const accessToken = localStorage.getItem('access_token')

  if (!accessToken) {
    showNotification('Jums ir jāpiesakās, lai skatītu grozu.', 'error')
    loading.value = false
    return
  }

  try {
    const response = await fetch('https://ziedu-veikals.vercel.app/cart', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    if (response.ok) {
      const data = await response.json()
      cartItems.value = data.cart_items.map(item => ({
        ...item,
        price: item.price_per_unit * item.discount_factor,
        image: item.selected_option.images[0] || 'https://via.placeholder.com/150',
      }))

      if (data.promocode) {
        appliedPromocode.value = data.promocode;
        promocode.value = data.promocode.code;
      } else {
        appliedPromocode.value = null
      }
    } else {
      const errorData = await response.json()
      showNotification(errorData.message || 'Neizdevās iegūt groza preces.', 'error')
    }
  } catch (error) {
    console.error('Kļūda, iegūstot groza preces:', error)
    showNotification('Kļūda savienojumā ar serveri.', 'error')
  } finally {
    loading.value = false
  }
}


const removeFromCart = async (id) => {
  const accessToken = localStorage.getItem('access_token')
  try {
    const response = await fetch(`https://ziedu-veikals.vercel.app/cart/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    if (response.ok) {
      cartItems.value = cartItems.value.filter(item => item.id !== id)
      showNotification('Prece veiksmīgi izdzēsta no groza.', 'success')
    } else {
      const errorData = await response.json()
      showNotification(errorData.message || 'Neizdevās noņemt preci no groza.', 'error')
    }
  } catch (error) {
    console.error('Kļūda, noņemot preci no groza:', error)
    showNotification('Kļūda savienojumā ar serveri.', 'error')
  }
}

const updateQuantity = async (id, quantity) => {
  if (quantity < 1) {
    showNotification('Daudzumam jābūt vismaz 1.', 'error')
    return
  }

  const accessToken = localStorage.getItem('access_token')
  const item = cartItems.value.find(item => item.id === id)
  if (!item) return

  const previousQuantity = item.quantity

  try {
    const response = await fetch(`https://ziedu-veikals.vercel.app/cart/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ quantity }),
    })

    if (response.ok) {
      const data = await response.json()
      item.quantity = quantity
      item.line_total = quantity * item.price
      showNotification('Preces daudzums veiksmīgi atjaunināts.', 'success')
    } else {
      const errorData = await response.json()
      showNotification(errorData.message || 'Neizdevās atjaunināt preces daudzumu.', 'error')
      item.quantity = errorData.max
    }
  } catch (error) {
    console.error('Kļūda, atjauninot preces daudzumu:', error)
    showNotification('Kļūda savienojumā ar serveri.', 'error')
    item.quantity = previousQuantity
  }
}

const initiateOrder = async () => {
  isProcessing.value = true
  paymentLink.value = ''

  const accessToken = localStorage.getItem('access_token')

  try {
    const response = await fetch('https://ziedu-veikals.vercel.app/buy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        ...orderInfo.value,
        promocode: appliedPromocode.value?.code,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      paymentLink.value = data.payment_link
      showNotification('Jūsu pasūtījums ir veiksmīgi izveidots.', 'success')
    } else if (response.status === 400) {
      const errorData = await response.json()
      showNotification(errorData.message || 'Neizdevās izveidot pasūtījumu. Lūdzu, pārbaudiet ievadīto informāciju.', 'error')
    } else {
      throw new Error('Server error')
    }
  } catch (error) {
    
    console.error('Kļūda, veidojot pasūtījumu:', error)
    showNotification('Kļūda savienojumā ar serveri. Lūdzu, mēģiniet vēlreiz.', 'error')
  } finally {
    isProcessing.value = false
  }
}

const applyPromocode = async () => {
  const accessToken = localStorage.getItem('access_token')
  const response = await fetch(`https://ziedu-veikals.vercel.app/promocode/${promocode.value}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  })

  location.reload();
   
 
}

</script>