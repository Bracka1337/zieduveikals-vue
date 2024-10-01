<template>
  <header class="header">
    <div class="logo">Ziedi.lv</div>
    <nav class="Navbar">
      <ul :class="['nav-links', { 'nav-active': isMenuActive }]">
        <li><router-link to="/">Produkti</router-link></li>
        <li><router-link to="/about">Par mums</router-link></li>
        <li><router-link to="/contact">Kontakti</router-link></li>
      </ul>
      <div class="auth-buttons">
        <router-link class="btn btn-login" to="/contact">Ieiet</router-link>
      </div>
      <div class="hamburger" :class="{ active: isMenuActive }" @click="toggleMenu">
        <span class="bar" />
        <span class="bar" />
        <span class="bar" />
      </div>
    </nav>
  </header>
</template>

<script>
  export default {
    name: 'Navbar',
    data () {
      return {
        isMenuActive: false,
      }
    },
    methods: {
      toggleMenu () {
        this.isMenuActive = !this.isMenuActive
      },
    },
  }
</script>

<style scoped>

.header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 10px 100px;
    background: white;
    color: #000;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 100;
}

.logo {
    font-size: 32px;
    color: #000000;
    text-decoration: none;
    font-weight: 700;
}

.Navbar {
    display: flex;
    align-items: center;
    flex-grow: 1;
    justify-content: center;
    margin-left: 30%;
}

.nav-links {
    display: flex;
    justify-content: center;
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.nav-links li {
    display: inline-block;
    margin-left: 40px;
}

.nav-links a {
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    font-size: 18px;
    color: #000000;
    font-weight: 500;
    text-decoration: none;
    transition: .3s;
}

.nav-links a::before {
    content: '';
    position: absolute;
    top: 100%;
    left: 0;
    width: 0;
    height: 2px;
    background: #000000;
    transition: width .3s;
}

.nav-links a:hover::before {
    width: 100%;
}

.hamburger {
    flex-direction: column;
    cursor: pointer;
}

.hamburger .bar {
    width: 25px;
    height: 2px;
    background-color: #000;
    margin: 3px 0;
    transition: opacity 0.3s ease;
}

.hamburger.active .bar {
    opacity: 0;
}

.auth-buttons {
    margin-left: auto;
}

.auth-buttons .btn {
    font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
    font-size: 16px;
    color: white;
    background-color: #000;
    padding: 10px 20px;
    text-decoration: none;
    border-radius: 5px;
    margin-left: 20px;
    transition: background-color 0.3s ease;
}

.auth-buttons .btn:hover {
    background-color: #444;
}

.btn-login {
    background-color: rgb(0, 0, 0);
}

@media (max-width: 767px) {
    .header {
        padding: 20px 20px;
        flex-direction: column;
        align-items: flex-start;
    }

    .Navbar {
        flex-direction: column;
        width: 100%;
    }

    .auth-buttons {
        margin-top: 20px;
        align-self: flex-end;
    }

    .nav-links {
        display: none;
        flex-direction: column;
        width: 100%;
    }

    .nav-active {
        display: flex;
        justify-content: center;
        width: 100%;
    }

    .nav-links li {
        margin-top: 20px;
        margin-left: 0;
    }

    .hamburger {
        display: flex;
        margin-left: 20px;
    }
}
</style>
