<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">AI Predictions</h1>
        <p class="text-gray-600 mt-2">Get intelligent wait time and entry predictions</p>
      </div>
      <div class="flex space-x-3">
        <button
          @click="cleanOldReports"
          :disabled="predictionStore.loading"
          class="btn-secondary flex items-center space-x-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          <span>Clean Old Reports</span>
        </button>
        <button
          @click="showRunPredictionModal = true"
          class="btn-primary flex items-center space-x-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
          <span>Run Prediction</span>
        </button>
      </div>
    </div>

    <!-- Error Alert -->
    <div v-if="predictionStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error</h3>
          <p class="text-sm text-red-700 mt-1">{{ predictionStore.error }}</p>
        </div>
        <button
          @click="predictionStore.clearError()"
          class="ml-auto text-red-400 hover:text-red-600"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>

    <!-- Predictions List -->
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <PredictionCard
        v-for="(prediction, queueID) in predictionsArray"
        :key="queueID"
        :queueID="queueID"
        :prediction="prediction"
        @get-forecast="handleGetForecast"
      />
    </div>

    <!-- Empty State -->
    <div v-if="predictionsArray.length === 0 && !predictionStore.loading" class="text-center py-12">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No predictions yet</h3>
      <p class="text-gray-600 mb-6">Run your first prediction to get started</p>
      <button @click="showRunPredictionModal = true" class="btn-primary">
        Run Prediction
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="predictionStore.loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      <p class="text-gray-600 mt-4">Loading predictions...</p>
    </div>

    <!-- Run Prediction Modal -->
    <RunPredictionModal
      v-if="showRunPredictionModal"
      @close="showRunPredictionModal = false"
      @prediction-run="handlePredictionRun"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { usePredictionStore } from '../stores/predictionStore'
import PredictionCard from '../components/PredictionCard.vue'
import RunPredictionModal from '../components/RunPredictionModal.vue'

const predictionStore = usePredictionStore()

const showRunPredictionModal = ref(false)

const predictions = computed(() => {
  return predictionStore.predictions
})

const predictionsArray = computed(() => {
  return Array.from(predictions.value.entries()).map(([queueID, prediction]) => ({
    queueID,
    prediction
  }))
})

const handlePredictionRun = (queueID, prediction) => {
  showRunPredictionModal.value = false
  // The prediction is already stored in the store
}

const handleGetForecast = async (queueID) => {
  try {
    await predictionStore.getForecast(queueID)
  } catch (error) {
    console.error('Failed to get forecast:', error)
  }
}

const cleanOldReports = async () => {
  try {
    await predictionStore.cleanOldReports()
    // Show success message
    alert('Old reports cleaned successfully')
  } catch (error) {
    console.error('Failed to clean old reports:', error)
  }
}

onMounted(() => {
  // In a real app, you'd load existing predictions from the API
  // For now, we'll use mock data
  const mockPredictions = new Map()
  mockPredictions.set('concert-hall-1', {
    queueID: 'concert-hall-1',
    estWaitTime: 15,
    entryProbability: 0.85,
    confidenceInterval: [10, 20],
    lastRun: new Date().toISOString()
  })
  
  mockPredictions.set('restaurant-1', {
    queueID: 'restaurant-1',
    estWaitTime: 30,
    entryProbability: 0.65,
    confidenceInterval: [25, 35],
    lastRun: new Date(Date.now() - 300000).toISOString()
  })
  
  // Update the store's predictions
  predictionStore.predictions = mockPredictions
})
</script>
