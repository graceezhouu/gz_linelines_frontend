<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Run AI Prediction</h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="label">Queue ID</label>
            <input
              v-model="form.queueID"
              type="text"
              required
              class="input-field"
              placeholder="e.g., concert-hall-1"
            />
          </div>

          <div>
            <label class="label">Model ID</label>
            <select v-model="form.modelID" class="input-field">
              <option value="default">Default Model</option>
              <option value="advanced">Advanced Model</option>
              <option value="premium">Premium Model</option>
            </select>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="text-red-600 text-sm">
            {{ error }}
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="$emit('close')"
              class="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
              {{ loading ? 'Running...' : 'Run Prediction' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { usePredictionStore } from '../stores/predictionStore'
const predictionStore = usePredictionStore()

const loading = ref(false)
const error = ref('')

const form = reactive({
  queueID: '',
  modelID: 'default'
})

const emit = defineEmits(['close', 'prediction-run'])

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    const prediction = await predictionStore.runPrediction(form.queueID, form.modelID)
    emit('prediction-run', form.queueID, prediction)
  } catch (err) {
    error.value = err.message || 'Failed to run prediction'
  } finally {
    loading.value = false
  }
}
</script>
