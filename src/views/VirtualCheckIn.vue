<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="heading-large">Virtual Check-in 📱</h1>
        <p class="text-xl font-bold text-gray-700 mt-4">Reserve your spot in line remotely ✨</p>
      </div>
      <button
        @click="showReserveModal = true"
        class="btn-primary flex items-center space-x-3"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        <span>Reserve Spot 🎯</span>
      </button>
    </div>

    <!-- Success Alert -->
    <div v-if="successMessage" class="card bg-gradient-to-r from-accent-green-100 to-accent-green-50 border-2 border-accent-green-300">
      <div class="flex">
        <svg class="w-6 h-6 text-accent-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <div class="ml-4 flex-1">
          <h3 class="text-lg font-bold text-accent-green-800">✅ Success!</h3>
          <p class="text-lg font-semibold text-accent-green-700 mt-1">{{ successMessage }}</p>
          <div v-if="activeReservation" class="mt-4 p-4 bg-white rounded-2xl border-2 border-accent-green-200">
            <h4 class="text-xl font-heading font-bold text-accent-green-800 mb-2">⏰ Countdown Timer</h4>
            <p class="text-sm font-semibold text-gray-600 mb-2">You must arrive within:</p>
            <div class="text-3xl font-heading font-bold text-accent-red-600 bg-gradient-to-r from-accent-red-100 to-accent-red-50 p-3 rounded-xl text-center">
              {{ timeRemaining }}
            </div>
            <p class="text-sm font-semibold text-gray-600 mt-2">Reservation will expire at {{ new Date(activeReservation.arrivalWindow[1]).toLocaleTimeString() }}</p>
          </div>
        </div>
        <button
          @click="clearSuccessMessage()"
          class="ml-auto text-accent-green-500 hover:text-accent-green-700 p-2 rounded-xl hover:bg-accent-green-200 transition-all duration-200 transform hover:scale-110"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>

    <!-- Error Alert -->
    <div v-if="checkinStore.error" class="p-6 bg-gradient-to-r from-accent-red-100 to-accent-red-50 border-2 border-accent-red-300 rounded-2xl shadow-bubble">
      <div class="flex">
        <svg class="w-6 h-6 text-accent-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
        <div class="ml-4">
          <h3 class="text-lg font-bold text-accent-red-800">Error ⚠️</h3>
          <p class="text-lg font-semibold text-accent-red-700 mt-1">{{ checkinStore.error }}</p>
        </div>
        <button
          @click="checkinStore.clearError()"
          class="ml-auto text-accent-red-500 hover:text-accent-red-700 p-2 rounded-xl hover:bg-accent-red-200 transition-all duration-200 transform hover:scale-110"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>

    <!-- User Input -->
    <div class="card">
      <h2 class="heading-medium mb-6">Your Information 👤</h2>
      <div class="flex items-center space-x-6">
        <div class="flex-1">
          <label class="label">User ID 🆔</label>
          <input
            v-model="currentUserID"
            type="text"
            class="input-field"
            placeholder="Enter your user ID"
          />
        </div>
        <button
          @click="loadUserReservations"
          class="btn-secondary"
        >
          Load My Reservations 📋
        </button>
      </div>
    </div>

    <!-- Reservations List -->
    <div class="space-y-4">
      <ReservationCard
        v-for="(reservation, userID) in userReservations"
        :key="reservation._id"
        :reservation="reservation"
        @cancel="handleCancelReservation"
        @view="handleViewReservation"
      />
    </div>

    <!-- Empty State -->
    <div v-if="Object.keys(userReservations).length === 0 && !checkinStore.loading && !successMessage" class="text-center py-16">
      <div class="w-24 h-24 bg-gradient-to-br from-accent-blue-400 to-accent-green-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-bubble transform hover:rotate-12 transition-all duration-300">
        <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
      </div>
      <h3 class="heading-medium mb-4">No reservations yet! 📱</h3>
      <p class="text-xl font-bold text-gray-700 mb-8">Reserve your first spot to get started ✨</p>
      <button @click="showReserveModal = true" class="btn-primary">
        Reserve Your First Spot 🚀
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="checkinStore.loading" class="text-center py-16">
      <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-accent-blue-600 mx-auto shadow-bubble"></div>
      <p class="text-xl font-bold text-gray-700 mt-6">Loading reservations... ⏳</p>
    </div>

    <!-- Reserve Spot Modal -->
    <ReserveSpotModal
      v-if="showReserveModal"
      :user-id="currentUserID"
      @close="handleModalClose"
      @reserved="handleReservationCreated"
    />

    <!-- View Reservation Modal -->
    <ViewReservationModal
      v-if="showViewModal"
      :reservation="selectedReservation"
      @close="showViewModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useCheckInStore } from '../stores/checkinStore'
import { useQueueStore } from '../stores/queueStore'
import ReservationCard from '../components/ReservationCard.vue'
import ReserveSpotModal from '../components/ReserveSpotModal.vue'
import ViewReservationModal from '../components/ViewReservationModal.vue'

const checkinStore = useCheckInStore()
const queueStore = useQueueStore()

const showReserveModal = ref(false)
const showViewModal = ref(false)
const selectedReservation = ref(null)
const currentUserID = ref('user123')
const successMessage = ref('')
const timeRemaining = ref('')
const countdownInterval = ref(null)

const userReservations = computed(() => {
  return checkinStore.reservations
})

const activeReservation = computed(() => {
  const reservation = checkinStore.getReservationForUser(currentUserID.value)
  return reservation && reservation.status === 'active' ? reservation : null
})

const updateCountdown = () => {
  if (!activeReservation.value) {
    timeRemaining.value = ''
    return
  }

  const now = new Date()
  const expiryTime = new Date(activeReservation.value.arrivalWindow[1])
  const timeDiff = expiryTime - now

  if (timeDiff <= 0) {
    timeRemaining.value = 'EXPIRED'
    if (countdownInterval.value) {
      clearInterval(countdownInterval.value)
      countdownInterval.value = null
    }
    // Mark reservation as expired in the store
    activeReservation.value.status = 'expired'
    successMessage.value = ''
    return
  }

  const minutes = Math.floor(timeDiff / 60000)
  const seconds = Math.floor((timeDiff % 60000) / 1000)
  timeRemaining.value = `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const startCountdown = () => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
  }
  
  updateCountdown()
  countdownInterval.value = setInterval(updateCountdown, 1000)
}

const handleModalClose = () => {
  showReserveModal.value = false
}

const handleReservationCreated = (userID, reservation) => {
  // Find the queue info for the success message
  const queue = queueStore.queues.find(q => q.queueID === reservation.queueID)
  const queueName = queue ? queue.queueID : reservation.queueID
  
  successMessage.value = `Successfully reserved spot in queue "${queueName}"! You have 15 minutes to arrive.`
  
  // Start the countdown timer
  startCountdown()
}

const clearSuccessMessage = () => {
  successMessage.value = ''
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
    countdownInterval.value = null
  }
}

const handleCancelReservation = async (reservationID) => {
  try {
    await checkinStore.cancelSpot(reservationID)
    clearSuccessMessage()
  } catch (error) {
    console.error('Failed to cancel reservation:', error)
  }
}

const handleViewReservation = (reservation) => {
  selectedReservation.value = reservation
  showViewModal.value = true
}

const loadUserReservations = () => {
  // In a real app, you'd load reservations for the specific user
  // For now, we'll just show all reservations
  
  // If user has an active reservation, start the countdown
  if (activeReservation.value) {
    startCountdown()
  }
}

onMounted(() => {
  // Load queues to ensure consistency
  queueStore.loadQueues()
  
  // If user already has an active reservation, start the countdown
  if (activeReservation.value) {
    const queue = queueStore.queues.find(q => q.queueID === activeReservation.value.queueID)
    const queueName = queue ? queue.queueID : activeReservation.value.queueID
    successMessage.value = `You have an active reservation in queue "${queueName}"`
    startCountdown()
  }
})

onUnmounted(() => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
  }
})
</script>
