<template>
  <div class="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
      <div
        class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        :class="iconColorClasses"
      >
        <span class="text-xl">{{ getIconEmoji(props.activity.icon) }}</span>
      </div>
    <div class="flex-1 min-w-0">
      <p class="text-sm text-gray-900">{{ activity.message }}</p>
      <p class="text-xs text-gray-500">{{ activity.timestamp }}</p>
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
    queue_created: 'bg-blue-100 text-blue-600',
    prediction_run: 'bg-green-100 text-green-600',
    report_submitted: 'bg-purple-100 text-purple-600',
    checkin_reserved: 'bg-orange-100 text-orange-600'
  }
  return typeColorMap[props.activity.type] || 'bg-gray-100 text-gray-600'
})
</script>
