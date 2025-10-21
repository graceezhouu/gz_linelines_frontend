<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Welcome to LineLens</h1>
      <p class="text-xl text-gray-600 max-w-2xl mx-auto">
        Smart queue management and prediction system for events and venues
      </p>
    </div>

    <!-- Feature Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div
        v-for="feature in features"
        :key="feature.name"
        class="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
        @click="navigateToFeature(feature.path)"
      >
        <div class="flex items-center space-x-4">
          <div
            class="w-12 h-12 rounded-lg flex items-center justify-center"
            :class="getIconColorClasses(feature.color)"
          >
            <span class="text-2xl">{{ getIconEmoji(feature.icon) }}</span>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900">{{ feature.name }}</h3>
            <p class="text-sm text-gray-600 mt-1">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">System Overview</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Active Queues"
          :value="stats.activeQueues"
          icon="Queue"
          color="blue"
        />
        <StatCard
          title="Predictions Today"
          :value="stats.predictionsToday"
          icon="TrendingUp"
          color="green"
        />
        <StatCard
          title="User Reports"
          :value="stats.userReports"
          icon="FileText"
          color="purple"
        />
        <StatCard
          title="Virtual Check-ins"
          :value="stats.virtualCheckins"
          icon="Calendar"
          color="orange"
        />
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
      <div class="space-y-4">
        <ActivityItem
          v-for="activity in recentActivity"
          :key="activity.id"
          :activity="activity"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import StatCard from '../components/StatCard.vue'
import ActivityItem from '../components/ActivityItem.vue'

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
    name: 'AI Predictions',
    description: 'Get intelligent wait time and entry predictions',
    icon: 'Brain',
    path: '/predictions',
    color: 'green'
  },
  {
    name: 'User Reports',
    description: 'Submit and manage real-time queue reports',
    icon: 'FileText',
    path: '/reports',
    color: 'purple'
  },
  {
    name: 'Virtual Check-in',
    description: 'Reserve your spot in line remotely',
    icon: 'Calendar',
    path: '/checkin',
    color: 'orange'
  }
])

const stats = ref({
  activeQueues: 0,
  predictionsToday: 0,
  userReports: 0,
  virtualCheckins: 0
})

const recentActivity = ref([
  {
    id: 1,
    type: 'queue_created',
    message: 'New queue created for "Concert Hall Event"',
    timestamp: '2 minutes ago',
    icon: 'Queue'
  },
  {
    id: 2,
    type: 'prediction_run',
    message: 'AI prediction completed for "Restaurant Queue"',
    timestamp: '5 minutes ago',
    icon: 'Brain'
  },
  {
    id: 3,
    type: 'report_submitted',
    message: 'User report submitted for "Coffee Shop Line"',
    timestamp: '8 minutes ago',
    icon: 'FileText'
  },
  {
    id: 4,
    type: 'checkin_reserved',
    message: 'Virtual check-in reserved for "Museum Tour"',
    timestamp: '12 minutes ago',
    icon: 'Calendar'
  }
])

const navigateToFeature = (path) => {
  router.push(path)
}

const getIconColorClasses = (color) => {
  const colorMap = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  }
  return colorMap[color] || 'bg-gray-100 text-gray-600'
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

onMounted(() => {
  // In a real app, you'd load actual stats from the API
  // For now, we'll use mock data
  stats.value = {
    activeQueues: 12,
    predictionsToday: 45,
    userReports: 128,
    virtualCheckins: 23
  }
})
</script>