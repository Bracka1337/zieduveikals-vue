<template>
  <div class="min-h-screen bg-transparent flex items-center justify-center p-4">
    <!-- Success Card -->
    <div class="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
      <div class="p-6">
        <!-- Icon and Title -->
        <div class="flex items-center justify-center mb-4">
          <!-- SVG Circle Check Icon -->
          <svg
            class="w-12 h-12 text-green-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" class="text-green-500" />
            <path
              d="M9.5 12.75l1.75 1.75L15 10.5"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-center text-gray-800">Paldies par pirkumu!</h2>
        <p class="text-center text-gray-600">
          Paldies par pirkumu. Jūsu pasūtījums ir veiksmīgi apstrādāts.
        </p>
      </div>

      <div class="px-6 py-4">
        <p class="text-center text-lg font-semibold text-gray-800">
          Pasūtījumu numurs: <span class="text-rose-500">{{ orderNumber }}</span>
        </p>
      </div>

      <div class="flex justify-center p-4">
        <router-link to="/">
          <button class="bg-[#ffb0b0] hover:bg-[#ffc2c2] text-white px-4 py-2 rounded">
            Atpakaļ uz katalogu
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const orderNumber = route.query.order_number

const windowSize = ref({ width: 0, height: 0 })

const updateWindowSize = () => {
  windowSize.value.width = window.innerWidth
  windowSize.value.height = window.innerHeight
}

onMounted(() => {
  updateWindowSize()
  window.addEventListener('resize', updateWindowSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowSize)
})
</script>
