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
