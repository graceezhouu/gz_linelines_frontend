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
      this.loading = true
      this.error = null
      try {
        const response = await queueStatusAPI.getAllQueues()
        // Sort by lastUpdated (most recent first)
        this.queues = response.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to load queues'
        console.error('Error loading queues:', error)
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
