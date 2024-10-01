<template>
  <header class="bg-white w-full">
    <nav class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
      <div class="flex lg:flex-1">
        <span class="text-2xl">Ziedi.lv</span>
      </div>
      <div class="hidden lg:flex absolute left-1/2 transform -translate-x-1/2">
        <div class="flex space-x-8">
          <button class="text-lg">Par mums</button>
          <button class="text-lg">Kontakti</button>
        </div>
      </div>
      <div class="hidden lg:flex items-center">
        <button class="rounded-md p-2 w-20 bg-black text-white text-sm">Ieiet</button>
      </div>
      <div class="lg:hidden">
        <button @click="toggleMobileMenu" class="text-gray-500 hover:text-black focus:outline-none focus:text-black">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>
    </nav>

    <div v-if="isMobileMenuOpen" class="lg:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <a href="#" class="block text-lg text-gray-700 hover:bg-gray-100">Par mums</a>
        <a href="#" class="block text-lg text-gray-700 hover:bg-gray-100">Kontakti</a>
        <a href="#" class="block text-lg text-white bg-black text-center rounded-md py-2 hover:bg-gray-800 mt-4">Ieiet</a>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  data() {
    return {
      isMobileMenuOpen: false,
    };
  },
  methods: {
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    }
  }
}
</script>
