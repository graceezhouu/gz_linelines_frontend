import { defineStore } from 'pinia'
import { virtualCheckInAPI } from '../services/api'

export const useCheckInStore = defineStore('checkin', {
  state: () => ({
    reservations: new Map(), // userID -> reservation data
    loading: false,
    error: null
  }),

  actions: {
    async reserveSpot(userID, queueID) {
      this.loading = true
      this.error = null
      try {
        const response = await virtualCheckInAPI.reserveSpot(userID, queueID)
        const reservation = {
          _id: response.reservationID,
          queueID,
          userID,
          checkInTime: new Date().toISOString(),
          arrivalWindow: [
            new Date().toISOString(),
            new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 minutes from now
          ],
          status: 'active'
        }
        this.reservations.set(userID, reservation)
        return response
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
        for (const [userID, reservation] of this.reservations.entries()) {
          if (reservation._id === reservationID) {
            reservation.status = 'cancelled'
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
        for (const [userID, reservation] of this.reservations.entries()) {
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
      return this.reservations.get(userID) || null
    },

    clearError() {
      this.error = null
    }
  }
})
