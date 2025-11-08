<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="text-center">
      <h1 class="heading-large mb-6 animate-pulse">Welcome to LineLens! 🎯</h1>
      <p class="text-2xl font-bold text-gray-700 max-w-3xl mx-auto leading-relaxed">
        Smart queue management and prediction system for events and venues ✨
      </p>
    </div>

    <!-- Feature Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      <div
        v-for="feature in features"
        :key="feature.name"
        class="feature-card"
        @click="navigateToFeature(feature.path)"
      >
        <div class="flex flex-col items-center space-y-4 text-center">
          <div
            class="w-16 h-16 rounded-3xl flex items-center justify-center shadow-bubble transform hover:rotate-12 transition-all duration-300"
            :class="getIconColorClasses(feature.color)"
          >
            <span class="text-3xl">{{ getIconEmoji(feature.icon) }}</span>
          </div>
          <div class="flex-1">
            <h3 class="heading-small mb-2">{{ feature.name }}</h3>
            <p class="text-lg font-semibold text-gray-700">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const features = ref([
  {
    name: 'Queue Management',
    description: 'Create and manage queues for events and venues',
    icon: 'Queue',
    path: '/queues',
    color: 'blue'
  },
  {
    name: 'User Reports',
    description: 'Submit and manage real-time queue reports.',
    icon: 'FileText',
    path: '/reports',
    color: 'purple'
  },
  {
    name: 'AI Predictions',
    description: 'Get intelligent wait time and entry predictions',
    icon: 'Brain',
    path: '/predictions',
    color: 'green'
  },
  {
    name: 'Virtual Check-in',
    description: 'Reserve your spot in line remotely',
    icon: 'Calendar',
    path: '/checkin',
    color: 'orange'
  }
])

const navigateToFeature = (path) => {
  router.push(path)
}

const getIconColorClasses = (color) => {
  const colorMap = {
    blue: 'bg-gradient-to-br from-accent-blue-400 to-accent-blue-600 text-white',
    green: 'bg-gradient-to-br from-accent-green-400 to-accent-green-600 text-white',
    purple: 'bg-gradient-to-br from-purple-400 to-purple-600 text-white',
    orange: 'bg-gradient-to-br from-orange-400 to-orange-600 text-white'
  }
  return colorMap[color] || 'bg-gradient-to-br from-gray-400 to-gray-600 text-white'
}

const getIconEmoji = (icon) => {
  const iconMap = {
    Queue: '📋',
    Brain: '🧠',
    FileText: '📄',
    Calendar: '📅'
  }
  return iconMap[icon] || '📋'
}
</script>