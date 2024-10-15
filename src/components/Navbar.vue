<template>
  <header class="bg-white w-full">
    <nav aria-label="Global" class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
      <div class="flex lg:flex-1">
        <a href="/" class="text-2xl">Ziedi.lv</a>
      </div>
      <div class="hidden lg:flex absolute left-1/2 transform -translate-x-1/2">
        <div class="flex space-x-8">
          <a href="/" class="text-lg">Produkti</a>
          <a href="/About" class="text-lg">Par mums</a>
        </div>
      </div>
      <div class="hidden lg:flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg"></svg>
        <button class="rounded-md p-2 w-20 bg-black text-white text-sm ieiet-button" @click="openLoginModal">Ieiet</button>
      </div>
      <div class="lg:hidden">
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
        <button class="block text-lg text-white bg-black text-center rounded-md py-2 hover:bg-gray-800 mt-4 w-full" @click="openLoginModal">Ieiet</button>
      </div>
    </div>

    <Modal v-if="showModal" :is-visible="showModal" @close="closeModal">
      <component :is="activeComponent" />
      <div class="switch-form">
        <p v-if="activeComponent === 'Login'">
          Neesi piereģistrējies?
          <button class="switch-button" @click="switchToRegister">Reģistrēties</button>
        </p>
        <p v-if="activeComponent === 'Register'">
          Esi jau reģistrējies?
          <button class="switch-button" @click="openLoginModal">Ieiet</button>
        </p>
      </div>
    </Modal>
  </header>
</template>

<script>
  import Modal from './Modal.vue'
  import Login from './Login.vue'
  import Register from './Register.vue'

  export default {
    components: {
      Modal,
      Login,
      Register,
    },
    data () {
      return {
        isMobileMenuOpen: false,
        showModal: false,
        activeComponent: 'Login',
      }
    },
    methods: {
      toggleMobileMenu () {
        this.isMobileMenuOpen = !this.isMobileMenuOpen
      },
      openLoginModal () {
        this.activeComponent = 'Login'
        this.showModal = true
      },
      closeModal () {
        this.showModal = false
      },
      switchToRegister () {
        this.activeComponent = 'Register'
      },
      switchToLogin () {
        this.activeComponent = 'Login'
      },
    },
  }
</script>

<style scoped>
.switch-form {
  text-align: center;
  margin-top: 10px;
}

.ieiet-button {
  background-color: #007bff;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.switch-button {
  color: #007bff;
}
</style>
