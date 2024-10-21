<template> 
  <div class="profile-page">
    <h2 class="profile-title">Profils</h2>

    <div class="profile-content">
      <div class="profile-info">
        <p><strong>E-pasts:</strong> {{ email }}</p>
      </div>

      <div class="password-section">
        <button @click="togglePasswordFields" class="btn">
          {{ showPasswordFields ? 'Atcelt' : 'Mainīt paroli' }}
        </button>

        <div v-if="showPasswordFields" class="password-fields">
          <div class="form-group">
            <label for="currentPassword">Pašreizējā parole:</label>
            <input
              v-model="currentPassword"
              type="password"
              class="input-box"
              placeholder="Pašreizējā parole"
            />
          </div>
          <div class="form-group">
            <label for="newPassword">Jaunā parole:</label>
            <input
              v-model="newPassword"
              type="password"
              class="input-box"
              placeholder="Jaunā parole"
            />
          </div>
          <div class="form-group">
            <label for="confirmNewPassword">Apstiprināt jauno paroli:</label>
            <input
              v-model="confirmNewPassword"
              type="password"
              class="input-box"
              placeholder="Apstiprināt jauno paroli"
            />
            <div
              v-if="newPassword !== confirmNewPassword && confirmNewPassword.length > 0"
              class="error-message"
            >
              Paroles nesakrīt
            </div>
          </div>
          <button
            @click="changePassword"
            class="btn"
            :disabled="newPassword !== confirmNewPassword"
          >
            Saglabāt paroli
          </button>
        </div>
      </div>
      
      <div class="orders-section">
        <h3>Mani pasūtījumi</h3>
        <ul> 
          <li>Pasūtījums #12345 - Rozes - $40</li> 
          <li>Pasūtījums #12346 - Tulpes - $35</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '', /* backend ?!?! */
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      showPasswordFields: false,
    };
  },
  methods: {
    togglePasswordFields() {
      this.showPasswordFields = !this.showPasswordFields;
    },
    changePassword() {
      if (this.newPassword === this.confirmNewPassword) {
        console.log('Mainot paroli uz:', this.newPassword);
        this.showPasswordFields = false;
        /* Logic */
      }
    },
  },
};
</script>

<style scoped>
.profile-page {
  max-width: 800px;
  margin: auto;
  padding: 40px 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-top: 100px; 
}

.profile-title {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 1rem;
  color: #333;
}

.profile-content {
  display: flex; 
  justify-content: space-between; 
  gap: 20px; 
  flex-wrap: wrap; 
}

.profile-info,
.password-section,
.orders-section {
  flex: 1; 
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background-color: #fff;
  min-width: 250px; 
}

.profile-info p {
  margin: 0;
}

.password-fields {
  margin-top: 10px; 
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.input-box {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  margin-top: 5px;
}

.btn {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  margin-top: 10px;
  border-radius: 4px;
  font-weight: bold;
  width: 100%;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  font-size: 0.9rem;
  margin-top: 5px;
}

h3 {
  margin-bottom: 1rem;
  color: #007bff;
}
</style>
