<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Create New Queue</h3>
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
            <label class="label">Location Type</label>
            <select v-model="locationType" class="input-field">
              <option value="coordinates">Coordinates</option>
              <option value="address">Address</option>
            </select>
          </div>

          <div v-if="locationType === 'coordinates'">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="label">Latitude</label>
                <input
                  v-model.number="form.location.latitude"
                  type="number"
                  step="any"
                  required
                  class="input-field"
                  placeholder="40.7128"
                />
              </div>
              <div>
                <label class="label">Longitude</label>
                <input
                  v-model.number="form.location.longitude"
                  type="number"
                  step="any"
                  required
                  class="input-field"
                  placeholder="-74.0060"
                />
              </div>
            </div>
          </div>

          <div v-else>
            <label class="label">Address</label>
            <input
              v-model="form.location"
              type="text"
              required
              class="input-field"
              placeholder="e.g., Downtown Restaurant"
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="label">Estimated Wait Time (min)</label>
              <input
                v-model.number="form.estWaitTime"
                type="number"
                min="0"
                class="input-field"
                placeholder="Optional"
              />
            </div>
            <div>
              <label class="label">People in Line</label>
              <input
                v-model.number="form.estPplInLine"
                type="number"
                min="0"
                class="input-field"
                placeholder="Optional"
              />
            </div>
          </div>

          <div class="flex items-center">
            <input
              v-model="form.virtualCheckInEligible"
              type="checkbox"
              class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label class="ml-2 block text-sm text-gray-900">
              Enable Virtual Check-in
            </label>
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
              {{ loading ? 'Creating...' : 'Create Queue' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useQueueStore } from '../stores/queueStore'
const queueStore = useQueueStore()

const locationType = ref('coordinates')
const loading = ref(false)
const error = ref('')

const form = reactive({
  queueID: '',
  location: { latitude: null, longitude: null },
  estWaitTime: null,
  estPplInLine: null,
  virtualCheckInEligible: false
})

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    const queueData = {
      queueID: form.queueID,
      location: locationType.value === 'coordinates' 
        ? form.location 
        : form.location,
      estWaitTime: form.estWaitTime || null,
      estPplInLine: form.estPplInLine || null,
      virtualCheckInEligible: form.virtualCheckInEligible
    }

    await queueStore.createQueue(queueData)
    
    // Create the queue object for the parent component
    const newQueue = {
      queueID: form.queueID,
      location: queueData.location,
      estWaitTime: form.estWaitTime,
      estPplInLine: form.estPplInLine,
      virtualCheckInEligible: form.virtualCheckInEligible,
      lastUpdated: new Date().toISOString()
    }

    emit('created', newQueue)
  } catch (err) {
    error.value = err.message || 'Failed to create queue'
  } finally {
    loading.value = false
  }
}

const emit = defineEmits(['close', 'created'])
</script>
