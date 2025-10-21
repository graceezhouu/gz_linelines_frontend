<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Update Queue Status</h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <!-- Queue Info -->
        <div class="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 class="font-medium text-gray-900">{{ queue.queueID }}</h4>
          <p class="text-sm text-gray-600">
            {{ typeof queue.location === 'string' ? queue.location : 'Location: ' + queue.location.latitude + ', ' + queue.location.longitude }}
          </p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label class="label">Estimated Wait Time (minutes)</label>
            <input
              v-model.number="form.estWaitTime"
              type="number"
              min="0"
              required
              class="input-field"
              placeholder="Enter wait time in minutes"
            />
          </div>

          <div>
            <label class="label">People in Line</label>
            <input
              v-model.number="form.estPplInLine"
              type="number"
              min="0"
              required
              class="input-field"
              placeholder="Enter number of people"
            />
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
              {{ loading ? 'Updating...' : 'Update Status' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useQueueStore } from '../stores/queueStore'
const queueStore = useQueueStore()

const props = defineProps({
  queue: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'updated'])

const loading = ref(false)
const error = ref('')

const form = reactive({
  estWaitTime: 0,
  estPplInLine: 0
})

onMounted(() => {
  // Pre-fill form with current values
  form.estWaitTime = props.queue.estWaitTime || 0
  form.estPplInLine = props.queue.estPplInLine || 0
})

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    await queueStore.updateQueueStatus(
      props.queue.queueID,
      form.estPplInLine,
      form.estWaitTime
    )
    
    // Return updated queue data
    const updatedQueue = {
      ...props.queue,
      estWaitTime: form.estWaitTime,
      estPplInLine: form.estPplInLine,
      lastUpdated: new Date().toISOString()
    }

    emit('updated', updatedQueue)
  } catch (err) {
    error.value = err.message || 'Failed to update queue status'
  } finally {
    loading.value = false
  }
}
</script>
