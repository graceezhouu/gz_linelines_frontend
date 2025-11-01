<template>
  <div class="flex items-center space-x-6 p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border-2 border-gray-100 hover:border-accent-blue-200 hover:shadow-bubble transition-all duration-300 transform hover:-translate-y-1">
      <div
        class="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-bubble transform hover:rotate-12 transition-all duration-300"
        :class="iconColorClasses"
      >
        <span class="text-2xl">{{ getIconEmoji(props.activity.icon) }}</span>
      </div>
    <div class="flex-1 min-w-0">
      <p class="text-lg font-bold text-gray-800 mb-1">{{ activity.message }}</p>
      <p class="text-md font-semibold text-accent-blue-600">{{ activity.timestamp }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  activity: {
    type: Object,
    required: true
  }
})

const getIconEmoji = (icon) => {
  const iconMap = {
    Queue: '📋',
    Brain: '🧠',
    FileText: '📄',
    Calendar: '📅'
  }
  return iconMap[icon] || '📋'
}

const iconColorClasses = computed(() => {
  const typeColorMap = {
    queue_created: 'bg-gradient-to-br from-accent-blue-400 to-accent-blue-600 text-white',
    prediction_run: 'bg-gradient-to-br from-accent-green-400 to-accent-green-600 text-white',
    report_submitted: 'bg-gradient-to-br from-purple-400 to-purple-600 text-white',
    checkin_reserved: 'bg-gradient-to-br from-orange-400 to-orange-600 text-white'
  }
  return typeColorMap[props.activity.type] || 'bg-gradient-to-br from-gray-400 to-gray-600 text-white'
})
</script>
