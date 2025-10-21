<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Submit Report</h3>
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
            <label class="label">User ID</label>
            <input
              v-model="form.user"
              type="text"
              required
              class="input-field"
              placeholder="e.g., user123"
            />
          </div>

          <div>
            <label class="label">Queue ID</label>
            <select v-model="form.queue" class="input-field">
              <option value="">Select a queue</option>
              <option v-for="queue in availableQueues" :key="queue" :value="queue">
                {{ queue }}
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="label">People in Line</label>
              <input
                v-model.number="form.estimatedPeopleInLine"
                type="number"
                min="0"
                class="input-field"
                placeholder="Optional"
              />
            </div>
            <div>
              <label class="label">Wait Time (min)</label>
              <input
                v-model.number="form.currentWaitTime"
                type="number"
                min="0"
                class="input-field"
                placeholder="Optional"
              />
            </div>
          </div>

          <div>
            <label class="label">Entry Outcome</label>
            <select v-model="form.entryOutcome" class="input-field">
              <option value="">Select outcome</option>
              <option value="entered">Entered</option>
              <option value="denied">Denied</option>
              <option value="left">Left</option>
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
              {{ loading ? 'Submitting...' : 'Submit Report' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useReportStore } from '../stores/reportStore'
const reportStore = useReportStore()

const loading = ref(false)
const error = ref('')

const availableQueues = ref(['concert-hall-1', 'restaurant-1', 'museum-tour-1'])

const form = reactive({
  user: '',
  queue: '',
  estimatedPeopleInLine: null,
  currentWaitTime: null,
  entryOutcome: ''
})

const emit = defineEmits(['close', 'submitted'])

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    const reportData = {
      user: form.user,
      queue: form.queue,
      estimatedPeopleInLine: form.estimatedPeopleInLine || undefined,
      currentWaitTime: form.currentWaitTime || undefined,
      entryOutcome: form.entryOutcome || undefined
    }

    const response = await reportStore.submitReport(reportData)
    emit('submitted', response)
  } catch (err) {
    error.value = err.message || 'Failed to submit report'
  } finally {
    loading.value = false
  }
}
</script>
