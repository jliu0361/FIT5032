<template>
  <div class="movemate-app">
    <Header />
    
    <main class="contact-content">
      <div class="content-container">
        <div class="form-section">
          <h1 class="main-title">Contact Us</h1>
          <p class="subtitle">This page is still developing just a sec :) </p>
        </div>
      </div>
    </main>
    
    <Footer />
  </div>
</template>

<script setup>
import Header from './HeaderPage.vue'
import Footer from './FooterPage.vue'
</script>

<style scoped>
.contact-content {
  flex: 1;
  padding: 2rem 0;
  background: linear-gradient(to bottom, #fff4e6, #f8f9fa);
}

.content-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.main-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #000000;
  text-align: center;
}

.subtitle {
  font-size: 1.1rem;
  color: #505050;
  margin-bottom: 3rem;
  text-align: center;
}

</style>
