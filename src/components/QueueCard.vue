<template>
  <div class="card">
    <div class="flex justify-between items-start mb-4">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">{{ queue.queueID }}</h3>
        <p class="text-sm text-gray-600">
          {{ typeof queue.location === 'string' ? queue.location : 'Location: ' + queue.location.latitude + ', ' + queue.location.longitude }}
        </p>
      </div>
      <div class="flex items-center space-x-2">
        <span
          v-if="queue.virtualCheckInEligible"
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
        >
          Virtual Check-in
        </span>
        <span
          v-else
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
        >
          In-person Only
        </span>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-4">
      <div>
        <p class="text-sm text-gray-500">Estimated Wait Time</p>
        <p class="text-2xl font-bold text-gray-900">
          {{ queue.estWaitTime ? queue.estWaitTime + ' min' : 'N/A' }}
        </p>
      </div>
      <div>
        <p class="text-sm text-gray-500">People in Line</p>
        <p class="text-2xl font-bold text-gray-900">
          {{ queue.estPplInLine || 'N/A' }}
        </p>
      </div>
    </div>

    <div class="text-xs text-gray-500 mb-4">
      Last updated: {{ formatTime(queue.lastUpdated) }}
    </div>

    <div class="flex space-x-2">
      <button
        @click="$emit('view-status', queue)"
        class="flex-1 btn-secondary text-sm"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
        View Status
      </button>
      <button
        @click="$emit('update-status', queue)"
        class="flex-1 btn-primary text-sm"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
        Update
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  queue: {
    type: Object,
    required: true
  }
})

defineEmits(['view-status', 'update-status'])

const formatTime = (timestamp) => {
  if (!timestamp) return 'Never'
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
