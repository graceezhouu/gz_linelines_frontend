<template>
  <div class="fixed inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full z-50 backdrop-blur-sm">
    <div class="relative top-20 mx-auto p-8 border-2 border-accent-blue-200 w-[600px] shadow-bubble rounded-3xl bg-gradient-to-br from-white to-gray-50">
      <div class="mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="heading-medium">Reserve Spot 🎯</h3>
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
            <label class="label">User ID</label>
            <input
              v-model="form.userID"
              type="text"
              required
              class="input-field"
              placeholder="Enter your user ID"
            />
          </div>

          <div>
            <label class="label">Queue</label>
            <select v-model="form.queueID" required class="input-field">
              <option value="">Select a queue</option>
              <option v-for="queue in queueStore.queues.filter(q => q.virtualCheckInEligible)" :key="queue.queueID" :value="queue.queueID">
                {{ queue.queueID }} - {{ typeof queue.location === 'string' ? queue.location : 'Coordinates' }}
              </option>
            </select>
          </div>

          <!-- Information Box -->
          <div class="bg-gradient-to-r from-accent-blue-50 to-accent-blue-100 border-2 border-accent-blue-300 rounded-2xl p-6">
            <div class="flex">
              <svg class="w-6 h-6 text-accent-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <div class="ml-4">
                <h3 class="text-lg font-bold text-accent-blue-800">⚠️ Important Information</h3>
                <p class="text-lg font-semibold text-accent-blue-700 mt-2">
                  You have 15 minutes to arrive after reserving your spot. 
                  Your reservation will expire if you don't arrive within this window. ⏰
                </p>
              </div>
            </div>
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
              {{ loading ? 'Reserving... ⏳' : 'Reserve Spot 🎯' }}
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
import { useQueueStore } from '../stores/queueStore'

const checkinStore = useCheckInStore()
const queueStore = useQueueStore()

const props = defineProps({
  userId: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close', 'reserved'])

const loading = ref(false)
const error = ref('')

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
    // Find the selected queue info for wait time calculation
    const selectedQueue = queueStore.queues.find(q => q.queueID === form.queueID)
    
    const response = await checkinStore.reserveSpot(form.userID, form.queueID, selectedQueue)
    
    // Use the reservation object returned from the store
    const reservation = response.reservation || checkinStore.getReservationForUser(form.userID)
    
    // Emit reserved event and close modal
    emit('reserved', form.userID, reservation)
    emit('close')
    
  } catch (err) {
    console.error('Reservation failed:', err)
    error.value = err.message || 'Failed to reserve spot'
  } finally {
    loading.value = false
  }
}
</script>
