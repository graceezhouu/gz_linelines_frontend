<template>
  <div
    class="card cursor-pointer hover:shadow-lg transition-shadow duration-200 group"
    @click="$emit('click')"
  >
    <div class="flex items-center space-x-4">
      <div
        class="w-12 h-12 rounded-lg flex items-center justify-center"
        :class="iconColorClasses"
      >
        <span class="text-2xl">{{ getIconEmoji(props.feature.icon) }}</span>
      </div>
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
          {{ feature.name }}
        </h3>
        <p class="text-sm text-gray-600 mt-1">
          {{ feature.description }}
        </p>
      </div>
      <div class="text-gray-400 group-hover:text-primary-500 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  feature: {
    type: Object,
    required: true
  }
})

defineEmits(['click'])

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
  const colorMap = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  }
  return colorMap[props.feature.color] || 'bg-gray-100 text-gray-600'
})
</script>
