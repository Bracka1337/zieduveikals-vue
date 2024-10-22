<template>
  <div class="login-form">
    <h2 class="modal-title">Ieiet</h2>
    <form @submit.prevent="submitLogin">
      <div class="form-group">
        <label for="username">Lietotājvārds</label>
        <input v-model="username" class="input-box" required type="text">
      </div>
      <div class="form-group">
        <label for="password">Parole</label>
        <input v-model="password" class="input-box" required type="password">
      </div>
      <button class="btn" type="submit" :disabled="loading">
        {{ loading ? 'Apstrāde...' : 'Ieiet' }}
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
      password: '',
      loading: false,
      errorMessage: '',
      successMessage: ''
    };
  },
  methods: {
    async submitLogin() {
      this.errorMessage = '';
      this.successMessage = '';
      this.loading = true;

      const payload = {
        username: this.username,
        password: this.password
      };

      try {
        const response = await fetch('https://ziedu-veikals.vercel.app/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (response.ok) {
          this.successMessage = 'Pieteikšanās veiksmīga!';
          localStorage.setItem('access_token', data.access_token);
          this.$router.push('/');
        } else {
          this.errorMessage = data.message || 'Pieteikšanās neizdevās.';
        }
      } catch (error) {
        console.error('Kļūda pieteikšanās laikā:', error);
        this.errorMessage = 'Kļūda savienojumā ar serveri.';
      } finally {
        this.loading = false;
      }
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
  margin-top: 8px;
}

.success-message {
  color: green;
  font-size: 0.9rem;
  margin-top: 8px;
}
</style>