<template>
  <div class="bg-white rounded-lg p-6 border border-gray-200">
    <div class="flex items-center">
      <div class="flex-shrink-0">
        <div
          class="w-8 h-8 rounded-lg flex items-center justify-center"
          :class="iconColorClasses"
        >
          <span class="text-xl">{{ getIconEmoji(props.icon) }}</span>
        </div>
      </div>
      <div class="ml-4">
        <p class="text-sm font-medium text-gray-500">{{ title }}</p>
        <p class="text-2xl font-semibold text-gray-900">{{ value }}</p>
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
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  }
  return colorMap[props.color] || 'bg-gray-100 text-gray-600'
})
</script>
