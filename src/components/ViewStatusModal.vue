<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Queue Status</h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <!-- Queue Info -->
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 class="font-medium text-gray-900">{{ queue.queueID }}</h4>
          <p class="text-sm text-gray-600">
            {{ typeof queue.location === 'string' ? queue.location : 'Location: ' + queue.location.latitude + ', ' + queue.location.longitude }}
          </p>
        </div>

        <!-- Status Information -->
        <div v-if="status" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <p class="text-sm text-blue-600 font-medium">Wait Time</p>
              <p class="text-2xl font-bold text-blue-900">
                {{ status.estWaitTime ? status.estWaitTime + ' min' : 'N/A' }}
              </p>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <p class="text-sm text-green-600 font-medium">People in Line</p>
              <p class="text-2xl font-bold text-green-900">
                {{ status.estPplInLine || 'N/A' }}
              </p>
            </div>
          </div>

          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-600 font-medium">Last Updated</p>
            <p class="text-lg font-semibold text-gray-900">
              {{ formatTime(status.lastUpdated) }}
            </p>
          </div>
        </div>

        <!-- No Status Available -->
        <div v-else class="text-center py-8">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
          <p class="text-gray-600">No status information available for this queue</p>
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
defineProps({
  queue: {
    type: Object,
    required: true
  },
  status: {
    type: Object,
    default: null
  }
})

defineEmits(['close'])

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
