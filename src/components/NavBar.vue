<template>
  <nav class="bg-white shadow-lg border-b border-gray-200">
    <div class="container mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <!-- Logo and Brand -->
        <div class="flex items-center space-x-4">
          <router-link to="/" class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">L</span>
            </div>
            <span class="text-xl font-bold text-gray-800">LineLens</span>
          </router-link>
        </div>

        <!-- Navigation Links -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link
            v-for="item in navigationItems"
            :key="item.name"
            :to="item.path"
            class="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            :class="{ 'text-primary-600 bg-primary-50': $route.name === item.routeName }"
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
        <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
          <router-link
            v-for="item in navigationItems"
            :key="item.name"
            :to="item.path"
            @click="closeMobileMenu"
            class="text-gray-600 hover:text-primary-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
            :class="{ 'text-primary-600 bg-primary-50': $route.name === item.routeName }"
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
  { name: 'Check-in', path: '/checkin', routeName: 'VirtualCheckIn' }
]

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}
</script>