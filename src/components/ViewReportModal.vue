<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Report Details</h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <!-- Report Information -->
        <div v-if="report" class="space-y-4">
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-medium text-gray-900">{{ report.queue }}</h4>
            <p class="text-sm text-gray-600">Reported by {{ report.user }}</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div v-if="report.estimatedPeopleInLine !== undefined" class="text-center p-4 bg-blue-50 rounded-lg">
              <p class="text-sm text-blue-600 font-medium">People in Line</p>
              <p class="text-2xl font-bold text-blue-900">{{ report.estimatedPeopleInLine }}</p>
            </div>
            <div v-if="report.currentWaitTime !== undefined" class="text-center p-4 bg-green-50 rounded-lg">
              <p class="text-sm text-green-600 font-medium">Wait Time</p>
              <p class="text-2xl font-bold text-green-900">{{ report.currentWaitTime }} min</p>
            </div>
          </div>

          <div v-if="report.entryOutcome" class="text-center p-4 bg-purple-50 rounded-lg">
            <p class="text-sm text-purple-600 font-medium">Entry Outcome</p>
            <p class="text-lg font-semibold" :class="outcomeClasses">
              {{ formatOutcome(report.entryOutcome) }}
            </p>
          </div>

          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-600 font-medium">Submitted</p>
            <p class="text-lg font-semibold text-gray-900">
              {{ formatTime(report.timestamp) }}
            </p>
          </div>

          <div class="text-center p-4 rounded-lg" :class="validationClasses">
            <p class="text-sm font-medium">Validation Status</p>
            <p class="text-lg font-semibold">
              {{ report.validated ? 'Validated' : 'Pending' }}
            </p>
          </div>
        </div>

        <!-- No Report Available -->
        <div v-else class="text-center py-8">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
          <p class="text-gray-600">Report not found</p>
        </div>

        <!-- Actions -->
        <div class="flex justify-end pt-6">
          <button
            @click="$emit('close')"
            class="btn-primary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  report: {
    type: Object,
    default: null
  }
})

defineEmits(['close'])

const outcomeClasses = computed(() => {
  const outcome = props.report?.entryOutcome
  if (outcome === 'entered') return 'text-green-600'
  if (outcome === 'denied') return 'text-red-600'
  if (outcome === 'left') return 'text-gray-600'
  return 'text-gray-600'
})

const validationClasses = computed(() => {
  return props.report?.validated
    ? 'bg-green-50 text-green-600'
    : 'bg-yellow-50 text-yellow-600'
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
