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
        console.log('getQueueStatus response:', response)
        
        // Handle different response formats
        if (Array.isArray(response) && response.length > 0) {
          return response[0]
        } else if (response && typeof response === 'object') {
          return response
        } else {
          throw new Error('Invalid queue status response format')
        }
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to get queue status'
        console.error('Error getting queue status:', error)
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
        console.log('getAllQueues response:', response)
        
        // Handle different response formats
        let queues = []
        if (Array.isArray(response)) {
          queues = response
        } else if (response && Array.isArray(response.queues)) {
          queues = response.queues
        } else if (response && typeof response === 'object') {
          // If response is an object, convert to array
          queues = Object.values(response)
        } else {
          console.warn('Unexpected response format:', response)
          queues = []
        }
        
        // Ensure we have an array and sort by lastUpdated (most recent first)
        this.queues = queues
          .filter(queue => queue && typeof queue === 'object') // Filter out invalid items
          .sort((a, b) => {
            const aDate = new Date(a.lastUpdated || 0)
            const bDate = new Date(b.lastUpdated || 0)
            return bDate - aDate
          })
        
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to load queues'
        console.error('Error loading queues:', error)
        this.queues = [] // Ensure queues is always an array
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
