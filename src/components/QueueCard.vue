<template>
  <div class="card">
    <div class="flex justify-between items-start mb-6">
      <div>
        <h3 class="heading-small mb-2">{{ queue.queueID }}</h3>
        <p class="text-lg font-semibold text-gray-700">
          📍 {{ typeof queue.location === 'string' ? queue.location : 'Location: ' + queue.location.latitude + ', ' + queue.location.longitude }}
        </p>
      </div>
      <div class="flex items-center space-x-2">
        <span
          v-if="queue.virtualCheckInEligible"
          class="inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold bg-gradient-to-r from-accent-green-500 to-accent-green-600 text-white shadow-bubble"
        >
          ✨ Virtual Check-in
        </span>
        <span
          v-else
          class="inline-flex items-center px-4 py-2 rounded-2xl text-sm font-bold bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-bubble"
        >
          🏪 In-person Only
        </span>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-6 mb-6">
      <div class="bg-gradient-to-br from-accent-blue-50 to-accent-blue-100 p-4 rounded-2xl border-2 border-accent-blue-200 text-center">
        <p class="text-lg font-bold text-accent-blue-800 mb-1">⏱️ Wait Time</p>
        <p class="text-3xl font-heading font-bold text-accent-blue-900">
          {{ queue.estWaitTime ? queue.estWaitTime + ' min' : 'N/A' }}
        </p>
      </div>
      <div class="bg-gradient-to-br from-accent-green-50 to-accent-green-100 p-4 rounded-2xl border-2 border-accent-green-200 text-center">
        <p class="text-lg font-bold text-accent-green-800 mb-1">👥 In Line</p>
        <p class="text-3xl font-heading font-bold text-accent-green-900">
          {{ queue.estPplInLine || 'N/A' }}
        </p>
      </div>
    </div>

    <div class="text-lg font-bold text-gray-600 mb-6 p-3 bg-gray-100 rounded-xl text-center">
      🕐 Creation Time: {{ formatTime(queue.lastUpdated) }}
    </div>

    <div class="flex space-x-3">
      <button
        @click="$emit('view-status', queue)"
        class="flex-1 btn-secondary flex items-center justify-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
        <span>View Status 👁️</span>
      </button>
      <button
        v-if="showUpdateButton"
        @click="$emit('update-status', queue)"
        class="flex-1 btn-primary flex items-center justify-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
        <span>Update 🔄</span>
      </button>
      <button
        v-if="showValidateButton"
        @click="$emit('validate', queue)"
        class="flex-1 bg-gradient-to-r from-accent-green-600 to-accent-green-700 hover:from-accent-green-700 hover:to-accent-green-800 text-white font-bold py-3 px-6 rounded-2xl shadow-bubble hover:shadow-bubble-hover transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
        <span>Validate ✅</span>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  queue: {
    type: Object,
    required: true
  },
  showUpdateButton: {
    type: Boolean,
    default: false
  },
  showValidateButton: {
    type: Boolean,
    default: false
  }
})

defineEmits(['view-status', 'update-status', 'validate'])

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
