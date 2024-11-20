<template>
  <div class="my-10 w-full flex items-center justify-center">
    <div class="w-full max-w-md px-6 py-8 rounded-lg">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">
        {{ isLoginMode ? 'Ieiet' : isEmailVerificationMode ? 'Verificēt E-pastu' : 'Reģistrēties' }}
      </h2>

      <form v-if="isLoginMode" class="space-y-4" @submit.prevent="loginUser">
        <div>
          <label class="block text-sm font-medium text-gray-700" for="username">Lietotājvārds</label>
          <input
            id="username"
            v-model="username"
            class="mt-1 block w-full px-3 py-2 bg-white border border-black rounded-md"
            placeholder="Ievadiet lietotājvārdu"
            required
            type="text"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700" for="password">Parole</label>
          <input
            id="password"
            v-model="password"
            class="mt-1 block w-full px-3 py-2 bg-white border border-black rounded-md"
            placeholder="Ievadiet paroli"
            required
            type="password"
          />
        </div>
        <button
          class="w-full py-2 px-4 bg-[#ffc2c2] border-black rounded-md text-white"
          type="submit"
        >
          Ieiet
        </button>
        <p class="text-sm text-center mt-4">
          Nav konta?
          <span @click="toggleMode('emailVerification')" class="text-blue-600 cursor-pointer">
            Reģistrēties
          </span>
        </p>
      </form>

  
      <form v-if="isEmailVerificationMode" class="space-y-4" @submit.prevent="sendVerificationEmail">
        <div>
          <label class="block text-sm font-medium text-gray-700" for="email">E-pasts</label>
          <input
            id="email"
            v-model="email"
            class="mt-1 block w-full px-3 py-2 bg-white border border-black rounded-md"
            placeholder="Ievadiet savu e-pastu"
            required
            type="email"
          />
        </div>
        <button
          class="w-full py-2 px-4 bg-[#ffc2c2] border-black rounded-md text-white"
          :disabled="loading"
          type="submit"
        >
          {{ loading ? 'Nosūtam kodu...' : 'Nosūtīt Verifikācijas Kodu' }}
        </button>
        <p class="text-sm text-center mt-4">
          Jau ir konts?
          <span @click="toggleMode('login')" class="text-blue-600 cursor-pointer">
            Ieiet
          </span>
        </p>
      </form>

      <!-- Registration Form -->
      <form v-if="isRegisterMode" class="space-y-4" @submit.prevent="registerUser">
        <div>
          <label class="block text-sm font-medium text-gray-700" for="reg-username">Lietotājvārds</label>
          <input
            id="reg-username"
            v-model="username"
            class="mt-1 block w-full px-3 py-2 bg-white border border-black rounded-md"
            placeholder="Izvēlieties lietotājvārdu"
            required
            type="text"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700" for="reg-password">Parole</label>
          <input
            id="reg-password"
            v-model="password"
            class="mt-1 block w-full px-3 py-2 bg-white border border-black rounded-md"
            placeholder="Izvēlieties paroli"
            required
            type="password"
          />
        </div>
        <button
          class="w-full py-2 px-4 bg-[#ffc2c2] border-black rounded-md text-white"
          :disabled="loading"
          type="submit"
        >
          Reģistrēties
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isLoginMode: true,
      isEmailVerificationMode: false,
      isRegisterMode: false,
      email: '',
      username: '',
      password: '',
      token: '',
      loading: false,
    };
  },
  mounted() {
    const email = this.$route.query.email; 
    const token = this.$route.query.token;
    if (email && token) {
      console.log(`Email: ${email}, Code: ${token}`);
      this.email = email; 
      this.token = token;
      this.isLoginMode = false;
      this.isRegisterMode = true;
    }
  },
  methods: {
    toggleMode(mode) {
      this.isLoginMode = mode === 'login';
      this.isEmailVerificationMode = mode === 'emailVerification';
      this.isRegisterMode = mode === 'register';
    },
    async loginUser() {
      try {
        const response = await fetch('https://ziedu-veikals.vercel.app/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: this.username, password: this.password }),
        });

        const data = await response.json(); // Parse response to JSON
        if (response.ok && data.access_token) {
          const token = data.access_token; // Get access token from response
          localStorage.setItem('access_token', token); // Store token in localStorage
          alert('Veiksmīga pieteikšanās!');
          this.$router.push('/'); // Redirect to home page
        } else {
          alert(data.message || 'Nepareizi ievadīti dati.');
        }
      } catch (error) {
        console.error('Error during login:', error);
      }
    },
    async sendVerificationEmail() {
      this.loading = true;
      try {
        const response = await fetch('https://ziedu-veikals.vercel.app/send_email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: this.email }),
        });
        if (response.ok) {
          alert('Kods nosūtīts!');
        } else {
          console.log('Kļūda nosūtot verifikācijas e-pastu.');
        }
      } catch (error) {
        console.error('Error sending verification email:', error);
      } finally {
        this.loading = false;
      }
    },
    async registerUser() {
      this.loading = true;
      try {
        const response = await fetch('https://ziedu-veikals.vercel.app/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: this.username, 
            email: this.email,
            password: this.password,
            token: this.token
          }),
        });

        const data = await response.json(); // Parse response to JSON
        if (response.ok) {
          const token = data.access_token; // Get access token from response
          localStorage.setItem('access_token', token); // Store token in localStorage
          alert('Reģistrācija veiksmīga!');
          this.toggleMode('login');
          this.$router.push('/login');
        } else {
          alert(data.message || 'Kļūda reģistrējoties.');
        }
      } catch (error) {
        console.error('Error during registration:', error);
      } finally {
        this.loading = false;
      }
    },
    logout() {
      localStorage.removeItem('access_token'); // Remove token from localStorage
      alert('Jūs esat veiksmīgi izrakstījies.');
      this.$router.push('/login'); // Redirect to login page
    }
  },
};
</script>


