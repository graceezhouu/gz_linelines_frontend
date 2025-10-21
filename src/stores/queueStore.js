import { defineStore } from 'pinia'
import { queueStatusAPI } from '../services/api'

export const useQueueStore = defineStore('queue', {
  state: () => ({
    queues: [],
    currentQueue: null,
    loading: false,
    error: null
  }),

  actions: {
    async createQueue(queueData) {
      this.loading = true
      this.error = null
      try {
        await queueStatusAPI.createQueue(queueData)
        // Refresh queues list after creation
        await this.loadQueues()
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to create queue'
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateQueueStatus(queueID, estPplInLine, estWaitTime) {
      this.loading = true
      this.error = null
      try {
        await queueStatusAPI.updateStatus({
          queueID,
          estPplInLine,
          estWaitTime
        })
        // Update local state
        const queue = this.queues.find(q => q.queueID === queueID)
        if (queue) {
          queue.estPplInLine = estPplInLine
          queue.estWaitTime = estWaitTime
          queue.lastUpdated = new Date().toISOString()
        }
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to update queue status'
        throw error
      } finally {
        this.loading = false
      }
    },

    async getQueueStatus(queueID) {
      this.loading = true
      this.error = null
      try {
        const response = await queueStatusAPI.viewStatus(queueID)
        return response[0] // API returns array with single item
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to get queue status'
        throw error
      } finally {
        this.loading = false
      }
    },

    async loadQueues() {
      // This would typically load from a list endpoint
      // For now, we'll manage queues locally
      this.loading = true
      try {
        // In a real app, you'd have an endpoint to list all queues
        // For now, we'll just clear the error
        this.error = null
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to load queues'
      } finally {
        this.loading = false
      }
    },

    setCurrentQueue(queue) {
      this.currentQueue = queue
    },

    clearError() {
      this.error = null
    }
  }
})
