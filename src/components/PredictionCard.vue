<template>
  <div class="card">
    <div class="flex justify-between items-start mb-4">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">{{ queueID }}</h3>
        <p class="text-sm text-gray-600">AI Prediction</p>
      </div>
      <div class="flex items-center space-x-2">
        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Active
        </span>
      </div>
    </div>

    <div class="space-y-4">
      <!-- Wait Time Prediction -->
      <div class="text-center p-4 bg-blue-50 rounded-lg">
        <p class="text-sm text-blue-600 font-medium">Predicted Wait Time</p>
        <p class="text-3xl font-bold text-blue-900">
          {{ prediction.estWaitTime }} min
        </p>
        <p class="text-xs text-blue-600 mt-1">
          Confidence: {{ prediction.confidenceInterval[0] }}-{{ prediction.confidenceInterval[1] }} min
        </p>
      </div>

      <!-- Entry Probability -->
      <div class="text-center p-4 bg-green-50 rounded-lg">
        <p class="text-sm text-green-600 font-medium">Entry Probability</p>
        <p class="text-3xl font-bold text-green-900">
          {{ Math.round(prediction.entryProbability * 100) }}%
        </p>
        <div class="w-full bg-green-200 rounded-full h-2 mt-2">
          <div
            class="bg-green-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: prediction.entryProbability * 100 + '%' }"
          ></div>
        </div>
      </div>

      <!-- Last Run Time -->
      <div class="text-center p-3 bg-gray-50 rounded-lg">
        <p class="text-xs text-gray-600 font-medium">Last Updated</p>
        <p class="text-sm font-semibold text-gray-900">
          {{ formatTime(prediction.lastRun) }}
        </p>
      </div>
    </div>

    <div class="flex space-x-2 mt-6">
      <button
        @click="$emit('get-forecast', queueID)"
        class="flex-1 btn-secondary text-sm"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        Refresh
      </button>
      <button
        @click="viewDetails"
        class="flex-1 btn-primary text-sm"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
        Details
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  queueID: {
    type: String,
    required: true
  },
  prediction: {
    type: Object,
    required: true
  }
})

defineEmits(['get-forecast'])

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

const viewDetails = () => {
  // In a real app, you might open a detailed view modal
  alert(`Prediction details for ${props.queueID}:\nWait Time: ${props.prediction.estWaitTime} min\nEntry Probability: ${Math.round(props.prediction.entryProbability * 100)}%`)
}
</script>
