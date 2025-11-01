<template>
  <div id="app" class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
    <NavBar />
    <main class="container mx-auto px-4 py-12">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
</script>