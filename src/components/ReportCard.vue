<template>
  <div class="card">
    <div class="flex justify-between items-start mb-4">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">{{ report.queue }}</h3>
        <p class="text-sm text-gray-600">Reported by {{ report.user }}</p>
      </div>
      <div class="flex items-center space-x-2">
        <span
          :class="validationStatusClasses"
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
        >
          {{ report.validated ? 'Validated' : 'Pending' }}
        </span>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-4">
      <div v-if="report.estimatedPeopleInLine !== undefined">
        <p class="text-sm text-gray-500">People in Line</p>
        <p class="text-xl font-bold text-gray-900">{{ report.estimatedPeopleInLine }}</p>
      </div>
      <div v-if="report.currentWaitTime !== undefined">
        <p class="text-sm text-gray-500">Wait Time</p>
        <p class="text-xl font-bold text-gray-900">{{ report.currentWaitTime }} min</p>
      </div>
    </div>

    <div v-if="report.entryOutcome" class="mb-4">
      <p class="text-sm text-gray-500">Entry Outcome</p>
      <p class="text-sm font-medium" :class="outcomeClasses">
        {{ formatOutcome(report.entryOutcome) }}
      </p>
    </div>

    <div class="text-xs text-gray-500 mb-4">
      Submitted: {{ formatTime(report.timestamp) }}
    </div>

    <div class="flex space-x-2">
      <button
        @click="$emit('view', report)"
        class="flex-1 btn-secondary text-sm"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
        View
      </button>
      <button
        v-if="!report.validated"
        @click="$emit('validate', report._id, true)"
        class="flex-1 btn-primary text-sm"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
        Validate
      </button>
      <button
        v-else
        @click="$emit('validate', report._id, false)"
        class="flex-1 btn-danger text-sm"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        Invalidate
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  report: {
    type: Object,
    required: true
  }
})

defineEmits(['validate', 'view'])

const validationStatusClasses = computed(() => {
  return props.report.validated
    ? 'bg-green-100 text-green-800'
    : 'bg-yellow-100 text-yellow-800'
})

const outcomeClasses = computed(() => {
  const outcome = props.report.entryOutcome
  if (outcome === 'entered') return 'text-green-600'
  if (outcome === 'denied') return 'text-red-600'
  if (outcome === 'left') return 'text-gray-600'
  return 'text-gray-600'
})

const formatOutcome = (outcome) => {
  const outcomeMap = {
    entered: 'Entered',
    denied: 'Denied',
    left: 'Left'
  }
  return outcomeMap[outcome] || outcome
}

const formatTime = (timestamp) => {
  if (!timestamp) return 'Unknown'
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
  return date.toLocaleDateString()
}
</script>
