<template>
  <footer class="footer">
    <div class="footer-content">
      <p class="copyright">© 2010-2025 MoveMate</p>
      <p class="description">Promoting health and wellbeing through community sports</p>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.footer {
  background-color: #ff8400;
  border-top: 1px solid #000000;
  padding: 2rem 0;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto; /*always sit in mid*/
  padding: 0 2rem;
  text-align: center;
}

.copyright {
  color: #000000;
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
}

.description {
  color: #3a3a3a;
  padding: 10px;
  margin: 0;
  border-radius: 5px;
  font-size: 0.7rem;
}
</style>
