<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Reserve Spot</h3>
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
              v-model="form.userID"
              type="text"
              required
              class="input-field"
              :placeholder="userId || 'e.g., user123'"
            />
          </div>

          <div>
            <label class="label">Queue ID</label>
            <select v-model="form.queueID" class="input-field">
              <option value="">Select a queue</option>
              <option v-for="queue in availableQueues" :key="queue" :value="queue">
                {{ queue }}
              </option>
            </select>
          </div>

          <!-- Information Box -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-blue-800">Important</h3>
                <p class="text-sm text-blue-700 mt-1">
                  You have 15 minutes to arrive after reserving your spot. 
                  Your reservation will expire if you don't arrive within this window.
                </p>
              </div>
            </div>
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
              {{ loading ? 'Reserving...' : 'Reserve Spot' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useCheckInStore } from '../stores/checkinStore'
const checkinStore = useCheckInStore()

const props = defineProps({
  userId: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close', 'reserved'])

const loading = ref(false)
const error = ref('')

const availableQueues = ref(['concert-hall-1', 'restaurant-1', 'museum-tour-1'])

const form = reactive({
  userID: '',
  queueID: ''
})

onMounted(() => {
  form.userID = props.userId
})

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await checkinStore.reserveSpot(form.userID, form.queueID)
    emit('reserved', form.userID, response)
  } catch (err) {
    error.value = err.message || 'Failed to reserve spot'
  } finally {
    loading.value = false
  }
}
</script>
