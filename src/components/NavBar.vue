<template>
  <nav class="bg-gradient-to-r from-white via-gray-50 to-white shadow-bubble border-b-4 border-accent-blue-200">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-20">
        <!-- Logo and Brand -->
        <div class="flex items-center space-x-4">
          <router-link to="/" class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-gradient-to-r from-accent-blue-600 to-accent-green-600 rounded-2xl flex items-center justify-center shadow-bubble transform hover:scale-110 transition-all duration-300">
              <span class="text-white font-bold text-2xl font-heading">L</span>
            </div>
            <span class="text-3xl font-heading font-bold bg-gradient-to-r from-accent-blue-600 to-accent-green-600 bg-clip-text text-transparent">LineLens</span>
          </router-link>
        </div>

        <!-- Navigation Links -->
        <div class="hidden md:flex items-center space-x-2">
          <router-link
            v-for="item in navigationItems"
            :key="item.name"
            :to="item.path"
            class="nav-link"
            :class="{ 'nav-link-active': $route.name === item.routeName }"
          >
            {{ item.name }}
          </router-link>
        </div>

        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button
            @click="toggleMobileMenu"
            class="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                v-if="!mobileMenuOpen"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
              <path
                v-else
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="md:hidden">
        <div class="px-4 pt-4 pb-6 space-y-2 sm:px-6 border-t-2 border-accent-blue-200 bg-gradient-to-b from-white to-gray-50">
          <router-link
            v-for="item in navigationItems"
            :key="item.name"
            :to="item.path"
            @click="closeMobileMenu"
            class="nav-link block w-full text-center"
            :class="{ 'nav-link-active': $route.name === item.routeName }"
          >
            {{ item.name }}
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const mobileMenuOpen = ref(false)

const navigationItems = [
  { name: 'Dashboard', path: '/', routeName: 'Dashboard' },
  { name: 'Queues', path: '/queues', routeName: 'QueueManagement' },
  { name: 'Predictions', path: '/predictions', routeName: 'Predictions' },
  { name: 'Reports', path: '/reports', routeName: 'UserReports' },
  { name: 'Virtual Check-in', path: '/checkin', routeName: 'VirtualCheckIn' }
]

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}
</script>