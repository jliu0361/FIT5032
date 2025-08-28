<template>
  <header class="header">
    <div class="header-content">
      <h1 class="brand-name">SportMate</h1>
      <nav class="navigation">
        <a href="#" class="nav-link">Join Activities</a>
        <a href="#" class="nav-link">Wellbeing&Support</a>
        <a href="#" class="nav-link">Activity Calender</a>
        <a href="#" class="nav-link">Help&Contact</a>
        <a href="#" class="nav-link">Account</a>
      </nav>
    </div>
  </header>
</template>

<script setup></script>

<style scoped>
.header {
  background-color: #ff8400;
  border-bottom: 1px solid #000000;
  padding: 1rem 0;
}

.header-content {
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.brand-name {
  font-size: 1.8rem;
  font-weight: bold;
  color: #000000;
  margin: 0;
  margin-left: 10rem;
}

.navigation {
  display: flex;
  gap: 2rem;
  margin-left: auto;
}

.nav-link {
  text-decoration: none;
  color: #000000;
  font-weight: 500;
  padding: 1px;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .brand-name {
    margin-right: 0;
  }

  .navigation {
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    margin-left: 0;
  }
}
</style>
