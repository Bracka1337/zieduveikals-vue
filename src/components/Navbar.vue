<template>
  <header class="bg-[#FFF9F9] w-full">
    <nav aria-label="Global" class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
      <div class="flex lg:flex-1">
        <a class="text-2xl" href="/">Ziedi.lv</a>
      </div>
      <div class="hidden lg:flex absolute left-1/2 transform -translate-x-1/2">
        <div class="flex space-x-8">
          <a class="text-lg" href="/catalog">Produkti</a>
          <a class="text-lg" href="/About">Par mums</a>
        </div>
      </div>
      <div class="hidden lg:flex items-center space-x-6">
        <a  v-if="accessToken" class="text-gray-500 hover:text-black" href="/Cart">
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M3 3h2l.4 2M7 13h10l1.25-5H6.75M16 21a2 2 0 100-4 2 2 0 000 4zM8 21a2 2 0 100-4 2 2 0 000 4zM5 3h14l-1.25 5H6.25L5 3z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
          </svg>
        </a>
        <a v-if="accessToken" class="text-gray-500 hover:text-black" href="/Profile">
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 14c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM12 14c-3.31 0-6 1.69-6 4v1h12v-1c0-2.31-2.69-4-6-4z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
          </svg>
        </a>
        <a v-if="!accessToken" class="rounded-md p-2 w-20 bg-[#e6b1b1] text-white hover:bg-[#ffc2c2] text-center text-xm" href="/Login">Ieiet</a>
      </div>
      <div class="lg:hidden flex items-center space-x-4">

        <a class="text-gray-500 hover:text-black" href="/Cart">
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M3 3h2l.4 2M7 13h10l1.25-5H6.75M16 21a2 2 0 100-4 2 2 0 000 4zM8 21a2 2 0 100-4 2 2 0 000 4zM5 3h14l-1.25 5H6.25L5 3z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
          </svg>
        </a>
        <a class="text-gray-500 hover:text-black" href="/Profile">
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 14c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zM12 14c-3.31 0-6 1.69-6 4v1h12v-1c0-2.31-2.69-4-6-4z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
          </svg>
        </a>
        <!-- Mobile menu button -->
        <button class="text-gray-500 hover:text-black focus:outline-none focus:text-black" @click="toggleMobileMenu">
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M4 6h16M4 12h16m-7 6h7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
          </svg>
        </button>
      </div>
    </nav>

    <div v-if="isMobileMenuOpen" class="lg:hidden">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <a class="block text-lg text-gray-700 hover:bg-gray-100" href="#">Par mums</a>
        <a class="block text-lg text-gray-700 hover:bg-gray-100" href="#">Kontakti</a>
        <a v-if="!accessToken" class="block text-lg bg-[#e6b1b1] text-white hover:bg-[#ffc2c2] text-center rounded-md py-2 mt-4 w-full" href="/Login">Ieiet</a>
      </div>
    </div>
  </header>
</template>

<script>
let ac = localStorage.getItem('access_token');
console.log(ac);
export default {
  data() {
    return {
      isMobileMenuOpen: false,
      accessToken: ac, 
    };
  },
  methods: {
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    },
  },
};
</script>
