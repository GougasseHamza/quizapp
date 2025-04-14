<template>
  <div id="app">
    <header>
      <h1>Quiz App</h1>
    </header>
    <main>
      <HomeView />
    </main>
  </div>
</template>

<script setup>
import HomeView from './views/HomeView.vue'
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

header {
  margin-bottom: 2rem;
}

main {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}
</style>
