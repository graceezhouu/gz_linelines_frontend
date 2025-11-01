import { defineStore } from 'pinia'
import { virtualCheckInAPI } from '../services/api'

export const useCheckInStore = defineStore('checkin', {
  state: () => ({
    reservations: {}, // userID -> reservation data
    loading: false,
    error: null
  }),

  actions: {
    async reserveSpot(userID, queueID, queueInfo = null) {
      this.loading = true
      this.error = null
      try {
        const response = await virtualCheckInAPI.reserveSpot(userID, queueID)
        // Calculate check-in time based on queue wait time
        const now = new Date()
        const waitTimeMinutes = queueInfo?.estWaitTime || 15 // Default to 15 minutes if no queue info
        const checkInTime = new Date(now.getTime() + waitTimeMinutes * 60 * 1000)
        
        // Arrival window is check-in time ± 5 minutes
        const arrivalStart = new Date(checkInTime.getTime() - 5 * 60 * 1000)
        const arrivalEnd = new Date(checkInTime.getTime() + 5 * 60 * 1000)
        
        const reservation = {
          _id: response.reservationID || `temp-${Date.now()}`,
          queueID,
          userID,
          reservationTime: now.toISOString(), // When the reservation was made
          checkInTime: checkInTime.toISOString(), // When they should arrive
          arrivalWindow: [
            arrivalStart.toISOString(),
            arrivalEnd.toISOString()
          ],
          status: 'active'
        }
        this.reservations[userID] = reservation
        return { ...response, reservation }
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to reserve spot'
        throw error
      } finally {
        this.loading = false
      }
    },

    async cancelSpot(reservationID) {
      this.loading = true
      this.error = null
      try {
        await virtualCheckInAPI.cancelSpot(reservationID)
        // Update local state
        for (const userID in this.reservations) {
          if (this.reservations[userID]._id === reservationID) {
            this.reservations[userID].status = 'cancelled'
            break
          }
        }
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to cancel spot'
        throw error
      } finally {
        this.loading = false
      }
    },

    async expireReservations() {
      this.loading = true
      this.error = null
      try {
        await virtualCheckInAPI.expireReservations()
        // Update local state - mark expired reservations
        for (const userID in this.reservations) {
          const reservation = this.reservations[userID]
          const arrivalWindowEnd = new Date(reservation.arrivalWindow[1])
          if (reservation.status === 'active' && new Date() > arrivalWindowEnd) {
            reservation.status = 'expired'
          }
        }
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to expire reservations'
        throw error
      } finally {
        this.loading = false
      }
    },

    async getReservationDetails(reservationID) {
      this.loading = true
      this.error = null
      try {
        const response = await virtualCheckInAPI.getReservationDetails(reservationID)
        return response[0] // API returns array with single item
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to get reservation details'
        throw error
      } finally {
        this.loading = false
      }
    },

    async getUserActiveReservation(userID, queueID) {
      this.loading = true
      this.error = null
      try {
        const response = await virtualCheckInAPI.getUserActiveReservation(userID, queueID)
        return response[0] // API returns array with single item
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to get user reservation'
        throw error
      } finally {
        this.loading = false
      }
    },

    getReservationForUser(userID) {
      return this.reservations[userID] || null
    },

    clearError() {
      this.error = null
    }
  }
})
