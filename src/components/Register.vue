<template>
  <div class="register-form">
    <h2 class="modal-title">Reģistrēties</h2>
    <form @submit.prevent="submitRegister">
      <div class="form-group">
        <label for="email">E-pasts</label>
        <input type="email" v-model="email" required class="input-box" />
        <div v-if="!isValidEmail(email) && email.length > 0" class="error-message">
          Ievadiet derīgu e-pastu
        </div>
      </div>
      <div class="form-group">
        <label for="password">Parole</label>
        <input type="password" v-model="password" required class="input-box" />
      </div>
      <div class="form-group">
        <label for="confirmPassword">Apstiprināt paroli</label>
        <input type="password" v-model="confirmPassword" required class="input-box" />
        <div v-if="password !== confirmPassword && confirmPassword.length > 0" class="error-message">
          Paroles nesakrīt
        </div>
      </div>
      <button type="submit" class="btn" :disabled="loading">
        {{ loading ? 'Processing...' : 'Reģistrēties' }}
      </button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      confirmPassword: '',
      loading: false
    };
  },
  methods: {
    isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    submitRegister() {
      if (this.password === this.confirmPassword) {
        this.loading = true;
        setTimeout(() => {
          console.log('Registering with', this.email, this.password);
          this.loading = false;
        }, 2000);
      } else {
        console.error('Passwords do not match');
      }
    }
  }
};
</script>

<style scoped>
.register-form {
  margin: auto;
  padding: 20px;
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
  margin-top: -8px;
  margin-bottom: 8px;
}
</style>