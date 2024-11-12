<template>
  <div class="my-10 w-full flex items-center justify-center">
    <div class="w-full max-w-md px-6 py-8 rounded-lg ">

      <h2 class="text-3xl font-bold text-center text-gray-800 mb-8">
        {{ isLoginMode ? 'Ieiet' : 'Reģistrēties' }}
      </h2>

      <form class="space-y-4" @submit.prevent="isLoginMode ? submitLogin() : submitRegister()">
        <div>
          <label class="block text-sm font-medium text-gray-700" for="username">Lietotājvārds</label>
          <input
            id="username"
            v-model="username"
            class="mt-1 block w-full px-3 py-2 bg-white border border-black rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="Ievadiet savu lietotājvārdu"
            required
            type="text"
          >
        </div>

        <div v-if="!isLoginMode">
          <label class="block text-sm font-medium text-gray-700" for="email">E-pasts</label>
          <input
            id="email"
            v-model="email"
            class="mt-1 block w-full px-3 py-2 bg-white border border-black rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="Ievadiet savu e-pastu"
            required
            type="email"
          >
          <p v-if="!isValidEmail(email) && email.length > 0" class="mt-1 text-sm text-red-600">
            Ievadiet derīgu e-pastu
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700" for="password">Parole</label>
          <input
            id="password"
            v-model="password"
            class="mt-1 block w-full px-3 py-2 bg-white border border-black rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="Ievadiet savu paroli"
            required
            type="password"
          >
        </div>

 
        <div v-if="!isLoginMode">
          <label class="block text-sm font-medium text-gray-700" for="confirmPassword">Apstiprināt paroli</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            class="mt-1 block w-full px-3 py-2 bg-white border border-black rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="Atkārtoti ievadiet savu paroli"
            required
            type="password"
          >
          <p v-if="password !== confirmPassword && confirmPassword.length > 0" class="mt-1 text-sm text-red-600">
            Paroles nesakrīt
          </p>
        </div>

        <div>
          <button
            class="w-full flex justify-center py-2 px-4 bg-[#ffc2c2] border-black rounded-md shadow-sm text-sm font-medium text-white"
            :disabled="loading || (!isLoginMode && !isFormValid)"
            type="submit"
          >
            <svg
              v-if="loading"
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path class="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor" />
            </svg>
            {{ loading ? 'Apstrāde...' : (isLoginMode ? 'Ieiet' : 'Reģistrēties') }}
          </button>
        </div>
      </form>

      <div v-if="errorMessage" class="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span class="block sm:inline">{{ errorMessage }}</span>
      </div>
      <div v-if="successMessage" class="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
        <span class="block sm:inline">{{ successMessage }}</span>
      </div>

      <div class="text-center mt-4">
        <button class="text-sm text-black hover:underline" @click="toggleMode">
          {{ isLoginMode ? 'Nav konta? Reģistrējieties' : 'Jums jau ir konts? Ieiet' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'

  const isLoginMode = ref(true)
  const username = ref('')
  const email = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  const loading = ref(false)
  const errorMessage = ref('')
  const successMessage = ref('')
  const router = useRouter()

  const isValidEmail = email => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const isFormValid = computed(() => {
    return username.value.length > 0 &&
      isValidEmail(email.value) &&
      password.value.length > 0 &&
      password.value === confirmPassword.value
  })

  const toggleMode = () => {
    isLoginMode.value = !isLoginMode.value
    resetForm()
  }

  const resetForm = () => {
    username.value = ''
    email.value = ''
    password.value = ''
    confirmPassword.value = ''
    errorMessage.value = ''
    successMessage.value = ''
  }

  const submitRegister = async () => {
    errorMessage.value = ''
    successMessage.value = ''

    if (!isFormValid.value) {
      errorMessage.value = 'Lūdzu, aizpildiet visus laukus pareizi.'
      return
    }

    loading.value = true

    const payload = {
      username: username.value,
      email: email.value,
      password: password.value,
    }

    try {
      const response = await fetch('https://ziedu-veikals.vercel.app/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        successMessage.value = 'Reģistrācija veiksmīga!'
        resetForm()
      } else {
        errorMessage.value = data.message || 'Reģistrācija neizdevās.'
      }
    } catch (error) {
      console.error('Kļūda reģistrācijas laikā:', error)
      errorMessage.value = 'Kļūda savienojumā ar serveri.'
    } finally {
      loading.value = false
    }
  }

  const submitLogin = async () => {
    errorMessage.value = ''
    successMessage.value = ''
    loading.value = true

    const payload = {
      username: username.value,
      password: password.value,
    }

    try {
      const response = await fetch('https://ziedu-veikals.vercel.app/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        successMessage.value = 'Pieteikšanās veiksmīga!'

        localStorage.setItem('access_token', data.access_token)
        const response2 = await fetch('https://ziedu-veikals.vercel.app/is_admin', {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${data.access_token}` },
        })

        const data2 = await response2.json()

        if (response2.ok) {
          router.push('/admin/dashboard')
        } else {
          router.push('/')
        }
      } else {
        errorMessage.value = data.message || 'Pieteikšanās neizdevās.'
      }
    } catch (error) {
      console.error('Kļūda pieteikšanās laikā:', error)
      errorMessage.value = 'Kļūda savienojumā ar serveri.'
    } finally {
      loading.value = false
    }
  }
</script>
