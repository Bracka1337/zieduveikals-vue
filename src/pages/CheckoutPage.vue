<template>
  <div class="min-h-screen flex flex-col justify-center px-8">
    <form class="space-y-8 w-full max-w-lg mx-auto">



      <div>
        <h2 class="text-xl font-semibold mb-4">Jūsu dati</h2>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700">Vārds</label>
            <input type="text" id="firstName" class="bg-white mt-1 block w-full border border-black rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" v-model="customer.firstName" />
          </div>
          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700">Uzvārds</label>
            <input type="text" id="lastName" class="bg-white mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" v-model="customer.lastName" />
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">E-pasts</label>
            <input type="email" id="email" class="bg-white mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" v-model="customer.email" />
          </div>
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">Numurs</label>
            <input type="text" id="phone" class="bg-white mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" v-model="customer.phone" />
          </div>
        </div>
      </div>


      <div>
        <h2 class="text-xl font-semibold mb-4">Adrese</h2>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="address" class="block text-sm font-medium text-gray-700">Adrese</label>
            <input type="text" id="address" class="bg-white mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" v-model="shipping.address" />
          </div>
          <div>
            <label for="city" class="block text-sm font-medium text-gray-700">Pilsēta</label>
            <input type="text" id="city" class="bg-white mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" v-model="shipping.city" />
          </div>
          <div>
            <label for="zip" class="block text-sm font-medium text-gray-700">Pasta indeks</label>
            <input type="text" id="zip" class="bg-white mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" v-model="shipping.zip" />
          </div>
        </div>
      </div>
      <div>
        <h2 class="text-xl font-semibold mb-4">Kāda persona jūs esat?</h2>
        <div class="flex items-center mb-4">
          <input type="radio" id="individual" value="individual" v-model="userType" class="mr-2" />
          <label for="individual" class="text-sm font-medium text-gray-700">Fiziskā persona</label>
        </div>
        <div class="flex items-center mb-4">
          <input type="radio" id="company" value="company" v-model="userType" class="mr-2" />
          <label for="company" class="text-sm font-medium text-gray-700">Juridiskā persona</label>
        </div>
      </div>

      <div>
        <button type="submit" class="w-full bg-[#399918] text-white py-3 px-4 rounded-md" @click.prevent="handleSubmit">
          Pasūtīt
        </button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userType: 'individual', 
      customer: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      },
      shipping: {
        address: "",
        city: "",
        state: "",
        zip: "",
      },
    };
  },
};
</script>


