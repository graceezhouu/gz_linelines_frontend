<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="heading-large">Virtual Check-in 📱</h1>
        <p class="text-xl font-bold text-gray-700 mt-4">Reserve your spot in line remotely for authorized events ✨</p>
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



    <!-- Current User Reservation -->
    <div v-if="currentUserReservation" class="space-y-4">
      <h2 class="text-xl font-bold text-gray-900">Your Reservation</h2>
      <ReservationCard
        :reservation="currentUserReservation"
        @cancel="handleCancelReservation"
      />
    </div>

    <!-- Empty State -->
    <div v-if="!currentUserReservation && !checkinStore.loading && !successMessage" class="text-center py-16">
      <div class="w-24 h-24 bg-gradient-to-br from-accent-blue-400 to-accent-green-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-bubble transform hover:rotate-12 transition-all duration-300">
        <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
      </div>
      <h3 class="heading-medium mb-4">No reservations yet! 📱</h3>
      <p class="text-xl font-bold text-gray-700 mb-8">Use the "Reserve Spot" button above to get started ✨</p>
    </div>

    <!-- Loading State -->
    <div v-if="checkinStore.loading" class="text-center py-16">
      <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-accent-blue-600 mx-auto shadow-bubble"></div>
      <p class="text-xl font-bold text-gray-700 mt-6">Loading reservations... ⏳</p>
    </div>

    <!-- Reserve Spot Modal -->
    <ReserveSpotModal
      v-if="showReserveModal"
      @close="handleModalClose"
      @reserved="handleReservationCreated"
    />


  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useCheckInStore } from '../stores/checkinStore'
import { useQueueStore } from '../stores/queueStore'
import ReservationCard from '../components/ReservationCard.vue'
import ReserveSpotModal from '../components/ReserveSpotModal.vue'

const checkinStore = useCheckInStore()
const queueStore = useQueueStore()

const showReserveModal = ref(false)
const currentUserEmail = ref('')
const successMessage = ref('')
const timeRemaining = ref('')
const countdownInterval = ref(null)

const currentUserReservation = computed(() => {
  if (!currentUserEmail.value) return null
  return checkinStore.getReservationForUser(currentUserEmail.value)
})

const activeReservation = computed(() => {
  const reservation = checkinStore.getReservationForUser(currentUserEmail.value)
  return reservation && reservation.status === 'active' ? reservation : null
})

const updateCountdown = () => {
  if (!activeReservation.value) {
    timeRemaining.value = ''
    return
  }

  const now = new Date()
  const checkInTime = new Date(activeReservation.value.checkInTime)
  const timeDiff = checkInTime - now

  if (timeDiff <= 0) {
    timeRemaining.value = 'TIME TO CHECK IN!'
    if (countdownInterval.value) {
      clearInterval(countdownInterval.value)
      countdownInterval.value = null
    }
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

const formatTime = (timestamp) => {
  if (!timestamp) return 'Unknown'
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const handleReservationCreated = (email, reservation) => {
  currentUserEmail.value = email
  
  // Find the queue info for the success message
  const queue = queueStore.queues.find(q => q.queueID === reservation.queueID)
  const queueName = queue ? queue.queueID : reservation.queueID
  
  // Calculate wait time from now to check-in time
  const now = new Date()
  const checkInTime = new Date(reservation.checkInTime)
  const waitMinutes = Math.ceil((checkInTime - now) / 60000)
  
  successMessage.value = `Successfully reserved spot in queue "${queueName}"! Check-in details have been sent to your email. Check in at ${formatTime(reservation.checkInTime)} (in ${waitMinutes} minutes).`
  
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
