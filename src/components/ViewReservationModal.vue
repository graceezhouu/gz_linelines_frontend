<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Reservation Details</h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <!-- Reservation Information -->
        <div v-if="reservation" class="space-y-4">
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-medium text-gray-900">{{ reservation.queueID }}</h4>
            <p class="text-sm text-gray-600">Reservation #{{ reservation._id }}</p>
          </div>

          <div class="text-center p-4 bg-blue-50 rounded-lg">
            <p class="text-sm text-blue-600 font-medium">Check-in Time</p>
            <p class="text-lg font-bold text-blue-900">
              {{ formatTime(reservation.checkInTime) }}
            </p>
          </div>

          <div class="text-center p-4 bg-green-50 rounded-lg">
            <p class="text-sm text-green-600 font-medium">Arrival Window</p>
            <p class="text-sm font-semibold text-green-900">
              {{ formatTime(reservation.arrivalWindow[0]) }} - {{ formatTime(reservation.arrivalWindow[1]) }}
            </p>
          </div>

          <div class="text-center p-4 rounded-lg" :class="statusClasses">
            <p class="text-sm font-medium">Status</p>
            <p class="text-lg font-semibold">
              {{ formatStatus(reservation.status) }}
            </p>
          </div>

          <div v-if="reservation.status === 'active'" class="text-center p-4 bg-orange-50 rounded-lg">
            <p class="text-sm text-orange-600 font-medium">Time Remaining</p>
            <p class="text-lg font-bold text-orange-900">
              {{ getTimeRemaining() }}
            </p>
          </div>
        </div>

        <!-- No Reservation Available -->
        <div v-else class="text-center py-8">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
          <p class="text-gray-600">Reservation not found</p>
        </div>

        <!-- Actions -->
        <div class="flex justify-end pt-6">
          <button
            @click="$emit('close')"
            class="btn-primary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  reservation: {
    type: Object,
    default: null
  }
})

defineEmits(['close'])

const statusClasses = computed(() => {
  const statusMap = {
    active: 'bg-green-50 text-green-600',
    used: 'bg-blue-50 text-blue-600',
    cancelled: 'bg-red-50 text-red-600',
    expired: 'bg-gray-50 text-gray-600'
  }
  return statusMap[props.reservation?.status] || 'bg-gray-50 text-gray-600'
})

const formatStatus = (status) => {
  const statusMap = {
    active: 'Active',
    used: 'Used',
    cancelled: 'Cancelled',
    expired: 'Expired'
  }
  return statusMap[status] || status
}

const formatTime = (timestamp) => {
  if (!timestamp) return 'Unknown'
  const date = new Date(timestamp)
  return date.toLocaleString()
}

const getTimeRemaining = () => {
  if (props.reservation?.status !== 'active') return 'N/A'
  
  const now = new Date()
  const endTime = new Date(props.reservation.arrivalWindow[1])
  const diffMs = endTime - now
  
  if (diffMs <= 0) return 'Expired'
  
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 60) return `${diffMins} minutes`
  
  const diffHours = Math.floor(diffMins / 60)
  const remainingMins = diffMins % 60
  return `${diffHours}h ${remainingMins}m`
}
</script>
