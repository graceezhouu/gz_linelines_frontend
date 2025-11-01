<template>
  <div class="card">
    <div class="flex justify-between items-start mb-4">
      <div>
        <h3 class="text-lg font-semibold text-gray-900">{{ reservation.queueID }}</h3>
        <p class="text-sm text-gray-600">Reservation #{{ reservation._id }}</p>
      </div>
      <div class="flex items-center space-x-2">
        <span
          :class="statusClasses"
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
        >
          {{ formatStatus(reservation.status) }}
        </span>
      </div>
    </div>

    <div class="space-y-4">
      <!-- Check-in Time -->
      <div class="text-center p-4 bg-blue-50 rounded-lg">
        <p class="text-sm text-blue-600 font-medium">Check-in Time</p>
        <p class="text-lg font-bold text-blue-900">
          {{ formatTime(reservation.checkInTime) }}
        </p>
      </div>

      <!-- Arrival Window -->
      <div class="text-center p-4 bg-green-50 rounded-lg">
        <p class="text-sm text-green-600 font-medium">Arrival Window</p>
        <p class="text-sm font-semibold text-green-900">
          {{ reservation.arrivalWindow ? `${formatTime(reservation.arrivalWindow[0])} - ${formatTime(reservation.arrivalWindow[1])}` : 'Unknown' }}
        </p>
      </div>

      <!-- Time Remaining -->
      <div v-if="reservation.status === 'active'" class="text-center p-4 bg-orange-50 rounded-lg">
        <p class="text-sm text-orange-600 font-medium">Time Remaining</p>
        <p class="text-lg font-bold text-orange-900">
          {{ getTimeRemaining() }}
        </p>
      </div>
    </div>

    <div class="flex space-x-2 mt-6">
      <button
        @click="$emit('view', reservation)"
        class="flex-1 btn-secondary text-sm"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
        View
      </button>
      <button
        v-if="reservation.status === 'active'"
        @click="$emit('cancel', reservation._id)"
        class="flex-1 btn-danger text-sm"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        Cancel
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  reservation: {
    type: Object,
    required: true
  }
})

defineEmits(['cancel', 'view'])

const statusClasses = computed(() => {
  const statusMap = {
    active: 'bg-green-100 text-green-800',
    used: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
    expired: 'bg-gray-100 text-gray-800'
  }
  return statusMap[props.reservation.status] || 'bg-gray-100 text-gray-800'
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
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const getTimeRemaining = () => {
  if (props.reservation.status !== 'active' || !props.reservation.arrivalWindow) return 'N/A'
  
  const now = new Date()
  const endTime = new Date(props.reservation.arrivalWindow[1])
  const diffMs = endTime - now
  
  if (diffMs <= 0) return 'Expired'
  
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 60) return `${diffMins}m`
  
  const diffHours = Math.floor(diffMins / 60)
  const remainingMins = diffMins % 60
  return `${diffHours}h ${remainingMins}m`
}
</script>
