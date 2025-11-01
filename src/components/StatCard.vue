<template>
  <div class="stat-card">
    <div class="flex flex-col items-center space-y-4">
      <div class="flex-shrink-0">
        <div
          class="w-16 h-16 rounded-2xl flex items-center justify-center shadow-bubble transform hover:rotate-12 transition-all duration-300"
          :class="iconColorClasses"
        >
          <span class="text-3xl">{{ getIconEmoji(props.icon) }}</span>
        </div>
      </div>
      <div class="text-center">
        <p class="text-lg font-bold text-gray-600 mb-2">{{ title }}</p>
        <p class="text-4xl font-heading font-bold text-accent-blue-800">{{ value }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'blue'
  }
})

const getIconEmoji = (icon) => {
  const iconMap = {
    Queue: '📋',
    TrendingUp: '📈',
    FileText: '📄',
    Calendar: '📅'
  }
  return iconMap[icon] || '📋'
}

const iconColorClasses = computed(() => {
  const colorMap = {
    blue: 'bg-gradient-to-br from-accent-blue-400 to-accent-blue-600 text-white',
    green: 'bg-gradient-to-br from-accent-green-400 to-accent-green-600 text-white',
    purple: 'bg-gradient-to-br from-purple-400 to-purple-600 text-white',
    orange: 'bg-gradient-to-br from-orange-400 to-orange-600 text-white'
  }
  return colorMap[props.color] || 'bg-gradient-to-br from-gray-400 to-gray-600 text-white'
})
</script>
