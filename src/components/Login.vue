<template>
  <div class="login-form">
    <h2 class="modal-title">Login</h2>
    <form @submit.prevent="submitLogin">
      <div class="form-group">
        <label for="email">E-pasts</label>
        <input v-model="email" class="input-box" required type="email">
        <div v-if="!isValidEmail(email) && email.length > 0" class="error-message">
          Ievadiet derīgu e-pastu
        </div>
      </div>
      <div class="form-group">
        <label for="password">Parole</label>
        <input v-model="password" class="input-box" required type="password">
      </div>
      <button class="btn" type="submit">Ieiet</button>
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
    isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    submitLogin() {
      console.log('Logging in with', this.email, this.password);
    }
  }
};
</script>

<style scoped>
.login-form {
  max-width: 100%;
  padding: 20px;
  background-color: #fff;
}

.form-group {
  margin-bottom: 15px;
}

.input-box {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}

.btn {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  margin-top: 10px;
  border-radius: 4px;
  font-weight: bold;
}

.btn:hover {
  background-color: #0056b3;
}

.modal-title {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.error-message {
  color: red;
  font-size: 0.9rem;
  margin-bottom: 8px;
}
</style>