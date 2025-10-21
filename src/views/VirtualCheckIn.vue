<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Virtual Check-in</h1>
        <p class="text-gray-600 mt-2">Reserve your spot in line remotely</p>
      </div>
      <button
        @click="showReserveModal = true"
        class="btn-primary flex items-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        <span>Reserve Spot</span>
      </button>
    </div>

    <!-- Error Alert -->
    <div v-if="checkinStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error</h3>
          <p class="text-sm text-red-700 mt-1">{{ checkinStore.error }}</p>
        </div>
        <button
          @click="checkinStore.clearError()"
          class="ml-auto text-red-400 hover:text-red-600"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>

    <!-- User Input -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Your Information</h2>
      <div class="flex items-center space-x-4">
        <div class="flex-1">
          <label class="label">User ID</label>
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
          Load My Reservations
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
    <div v-if="Object.keys(userReservations).length === 0 && !checkinStore.loading" class="text-center py-12">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No reservations yet</h3>
      <p class="text-gray-600 mb-6">Reserve your first spot to get started</p>
      <button @click="showReserveModal = true" class="btn-primary">
        Reserve Spot
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="checkinStore.loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      <p class="text-gray-600 mt-4">Loading reservations...</p>
    </div>

    <!-- Reserve Spot Modal -->
    <ReserveSpotModal
      v-if="showReserveModal"
      :user-id="currentUserID"
      @close="showReserveModal = false"
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
import { ref, computed, onMounted } from 'vue'
import { useCheckInStore } from '../stores/checkinStore'
import ReservationCard from '../components/ReservationCard.vue'
import ReserveSpotModal from '../components/ReserveSpotModal.vue'
import ViewReservationModal from '../components/ViewReservationModal.vue'

const checkinStore = useCheckInStore()

const showReserveModal = ref(false)
const showViewModal = ref(false)
const selectedReservation = ref(null)
const currentUserID = ref('user123')

const userReservations = computed(() => {
  return checkinStore.reservations
})

const handleReservationCreated = (userID, reservation) => {
  showReserveModal.value = false
  // Reservation is already stored in the store
}

const handleCancelReservation = async (reservationID) => {
  try {
    await checkinStore.cancelSpot(reservationID)
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
}

onMounted(() => {
  // In a real app, you'd load user reservations from the API
  // For now, we'll use mock data
  checkinStore.reservations.set('user123', {
    _id: 'reservation-1',
    queueID: 'concert-hall-1',
    userID: 'user123',
    checkInTime: new Date().toISOString(),
    arrivalWindow: [
      new Date().toISOString(),
      new Date(Date.now() + 15 * 60 * 1000).toISOString()
    ],
    status: 'active'
  })
})
</script>
