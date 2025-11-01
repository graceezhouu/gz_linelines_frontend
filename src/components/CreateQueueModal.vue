<template>
  <div class="fixed inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full z-50 backdrop-blur-sm">
    <div class="relative top-20 mx-auto p-8 border-2 border-accent-blue-200 w-[600px] shadow-bubble rounded-3xl bg-gradient-to-br from-white to-gray-50">
      <div class="mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="heading-medium">Create New Queue 🎯</h3>
          <button
            @click="$emit('close')"
            class="text-gray-500 hover:text-accent-red-600 p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 transform hover:scale-110"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" /></svg>
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
              v-model="form.locationString"
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

          <div class="flex items-center p-4 bg-gradient-to-r from-accent-blue-50 to-accent-green-50 rounded-2xl border-2 border-accent-blue-200">
            <input
              v-model="form.virtualCheckInEligible"
              type="checkbox"
              class="h-5 w-5 text-accent-blue-600 focus:ring-accent-blue-500 border-gray-400 rounded-lg transform scale-125"
            />
            <label class="ml-3 block text-lg font-bold text-gray-800">
              Enable Virtual Check-in ✨
            </label>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="p-4 bg-gradient-to-r from-accent-red-100 to-accent-red-50 border-2 border-accent-red-300 rounded-2xl">
            <p class="text-accent-red-800 text-lg font-bold">⚠️ {{ error }}</p>
          </div>

          <!-- Actions -->
          <div class="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              @click="$emit('close')"
              class="btn-secondary"
            >
              Cancel ❌
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="loading" class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
              {{ loading ? 'Creating... ⏳' : 'Create Queue 🚀' }}
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

const locationType = ref('address')
const loading = ref(false)
const error = ref('')

const form = reactive({
  queueID: '',
  location: { latitude: null, longitude: null },
  locationString: '',
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
        : form.locationString,
      estWaitTime: form.estWaitTime || null,
      estPplInLine: form.estPplInLine || null,
      virtualCheckInEligible: form.virtualCheckInEligible
    }

    await queueStore.createQueue(queueData)
    
    emit('created')
  } catch (err) {
    error.value = err.message || 'Failed to create queue'
  } finally {
    loading.value = false
  }
}

const emit = defineEmits(['close', 'created'])
</script>
