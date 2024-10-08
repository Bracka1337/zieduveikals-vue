<template>
    <div class="login-form">
      <h2 class="modal-title">Login</h2>
      <form @submit.prevent="submitLogin">
        <div class="form-group">
          <label for="email">E-pasts</label>
          <input type="email" v-model="email" required class="input-box" />
        </div>
        <div class="form-group">
          <label for="password">Parole</label>
          <input type="password" v-model="password" required class="input-box" />
        </div>
        <button type="submit" class="btn">Ieiet</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        email: '',
        password: ''
      };
    },
    methods: {
      submitLogin() {
       
        console.log('Logging in with', this.email, this.password);
      }
    }
  };
  </script>
  
  <style scoped>
  .login-form {
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