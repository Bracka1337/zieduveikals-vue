<template>
  <div class="register-form">
    <h2 class="modal-title">Reģistrēties</h2>
    <form @submit.prevent="submitRegister">
      <div class="form-group">
        <label for="username">Lietotājvārds</label>
        <input type="text" v-model="username" required class="input-box" />
      </div>
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
        {{ loading ? 'Apstrāde...' : 'Reģistrēties' }}
      </button>
    </form>
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      loading: false,
      errorMessage: '',
      successMessage: ''
    };
  },
  methods: {
    isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    async submitRegister() {
      this.errorMessage = '';
      this.successMessage = '';

      if (this.password !== this.confirmPassword) {
        this.errorMessage = 'Paroles nesakrīt';
        return;
      }

      if (!this.isValidEmail(this.email)) {
        this.errorMessage = 'Ievadiet derīgu e-pastu';
        return;
      }

      this.loading = true;

      const payload = {
        username: this.username,
        email: this.email,
        password: this.password
      };

      try {
        const response = await fetch('https://ziedu-veikals.vercel.app/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
          this.successMessage = 'Reģistrācija veiksmīga!';
        } else {
          this.errorMessage = data.message || 'Reģistrācija neizdevās.';
        }
      } catch (error) {
        console.error('Kļūda reģistrācijas laikā:', error);
        this.errorMessage = 'Kļūda savienojumā ar serveri.';
      } finally {
        this.loading = false;
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
  margin-bottom: 8px;
}

.success-message {
  color: green;
  font-size: 0.9rem;
  margin-bottom: 8px;
}
</style>