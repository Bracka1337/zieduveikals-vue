<template>
  <div class="register-form">
    <h2 class="modal-title">Reģistrēties</h2>
    <form @submit.prevent="submitRegister">
      <div class="form-group">
        <label for="email">E-pasts</label>
        <input type="email" v-model="email" required class="input-box" />
      </div>
      <div class="form-group">
        <label for="password">Parole</label>
        <input type="password" v-model="password" required class="input-box" />
      </div>
      <div class="form-group">
        <label for="confirmPassword">Apstiprināt paroli</label>
        <input type="password" v-model="confirmPassword" required class="input-box" />
      </div>
      <button type="submit" class="btn">Reģistrēties</button>
    </form>
  </div>
</template>
  
  <script>
  export default {
    data() {
      return {
        email: '',
        password: '',
        confirmPassword: ''
      };
    },
    methods: {
      submitRegister() {
        if (this.password === this.confirmPassword) {
          console.log('Registering with', this.email, this.password);
        } else {
          console.error('Passwords do not match');
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .register-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
  }
  
  .btn {
    background-color: #007bff;
    color: white;
    padding: 10px;
    border: none;
    cursor: pointer;
  }
  
  .btn:hover {
    background-color: #0056b3;
  }
  </style>