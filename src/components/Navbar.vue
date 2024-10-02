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
        <button @click="openLoginModal" class="rounded-md p-2 w-20 bg-black text-white text-sm ieiet-button">Ieiet</button>
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
        <button @click="openLoginModal" class="block text-lg text-white bg-black text-center rounded-md py-2 hover:bg-gray-800 mt-4">Ieiet</button>
      </div>
    </div>

  
    <Modal v-if="showModal" :isVisible="showModal" @close="closeModal">
      <component :is="activeComponent"></component>
      <div class="switch-form">
        <p v-if="activeComponent === 'Login'">
          Neesi piereģistrējies? 
          <button @click="switchToRegister" class="switch-button">Reģistrēties</button>
        </p>
        <p v-if="activeComponent === 'Register'">
          Esi jau reģistrējies? 
          <button @click="openLoginModal" class="switch-button">Ieiet</button>
        </p>
      </div>
    </Modal>
  </header>
</template>

<script>
import Modal from './Modal.vue';
import Login from './Login.vue';
import Register from './Register.vue';

export default {
  components: {
    Modal,
    Login,
    Register
  },
  data() {
    return {
      isMobileMenuOpen: false,
      showModal: false,
      activeComponent: 'Login'
    };
  },
  methods: {
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    },
    openLoginModal() {
      this.activeComponent = 'Login';
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    switchToRegister() {
      this.activeComponent = 'Register';
    },
    switchToLogin() {
      this.activeComponent = 'Login';
    }
  }
};
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