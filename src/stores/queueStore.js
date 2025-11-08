// import { defineStore } from 'pinia'
// import { queueStatusAPI } from '../services/api'

// export const useQueueStore = defineStore('queue', {
//   state: () => ({
//     queues: [],
//     currentQueue: null,
//     loading: false,
//     error: null
//   }),

//   actions: {
//     async createQueue(queueData) {
//       this.loading = true
//       this.error = null
//       try {
//         await queueStatusAPI.createQueue(queueData)
//         // Refresh queues list after creation
//         await this.loadQueues()
//       } catch (error) {
//         this.error = error.response?.data?.error || 'Failed to create queue'
//         throw error
//       } finally {
//         this.loading = false
//       }
//     },

//     async updateQueueStatus(queueID, estPplInLine, estWaitTime) {
//       this.loading = true
//       this.error = null
//       try {
//         await queueStatusAPI.updateStatus({
//           queueID,
//           estPplInLine,
//           estWaitTime
//         })
//         // Update local state
//         const queue = this.queues.find(q => q.queueID === queueID)
//         if (queue) {
//           queue.estPplInLine = estPplInLine
//           queue.estWaitTime = estWaitTime
//           queue.lastUpdated = new Date().toISOString()
//         }
//       } catch (error) {
//         this.error = error.response?.data?.error || 'Failed to update queue status'
//         throw error
//       } finally {
//         this.loading = false
//       }
//     },

//     async getQueueStatus(queueID) {
//       this.loading = true
//       this.error = null
//       try {
//         const response = await queueStatusAPI.viewStatus(queueID)
//         console.log('getQueueStatus response:', response)
        
//         // Handle different response formats
//         if (Array.isArray(response) && response.length > 0) {
//           return response[0]
//         } else if (response && typeof response === 'object') {
//           return response
//         } else {
//           throw new Error('Invalid queue status response format')
//         }
//       } catch (error) {
//         this.error = error.response?.data?.error || 'Failed to get queue status'
//         console.error('Error getting queue status:', error)
//         throw error
//       } finally {
//         this.loading = false
//       }
//     },

//     async loadQueues() {
//       this.loading = true
//       this.error = null
//       try {
//         console.log('🔍 Starting loadQueues - Environment check:')
//         console.log('- VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL)
//         console.log('- import.meta.env:', import.meta.env)
        
//         const response = await queueStatusAPI.getAllQueues()
//         console.log('✅ getAllQueues response received:')
//         console.log('- Type:', typeof response)
//         console.log('- Is Array:', Array.isArray(response))
//         console.log('- Length:', response?.length)
//         console.log('- Response:', response)
        
//         // Handle different response formats
//         let queues = []
//         if (Array.isArray(response)) {
//           console.log('📋 Processing as array')
//           queues = response
//         } else if (response && Array.isArray(response.queues)) {
//           console.log('📋 Processing as object with queues array')
//           queues = response.queues
//         } else if (response && typeof response === 'object') {
//           console.log('📋 Processing as object, converting to array')
//           queues = Object.values(response)
//         } else {
//           console.warn('❌ Unexpected response format:', response)
//           console.warn('- Response type:', typeof response)
//           console.warn('- Response value:', response)
//           queues = []
//         }
        
//         console.log('🔧 Processed queues:', queues)
//         console.log('- Queues count:', queues.length)
        
//         // Ensure we have an array and sort by lastUpdated (most recent first)
//         this.queues = queues
//           .filter(queue => queue && typeof queue === 'object') // Filter out invalid items
//           .sort((a, b) => {
//             const aDate = new Date(a.lastUpdated || 0)
//             const bDate = new Date(b.lastUpdated || 0)
//             return bDate - aDate
//           })
        
//         console.log('✅ Final queues set:', this.queues.length, 'items')
        
//       } catch (error) {
//         this.error = error.response?.data?.error || 'Failed to load queues'
//         console.error('❌ Error loading queues:')
//         console.error('- Error type:', error.constructor.name)
//         console.error('- Error message:', error.message)
//         console.error('- Error response:', error.response)
//         console.error('- Full error:', error)
//         this.queues = [] // Ensure queues is always an array
//       } finally {
//         this.loading = false
//       }
//     },

//     setCurrentQueue(queue) {
//       this.currentQueue = queue
//     },

//     clearError() {
//       this.error = null
//     }
//   }
// })

// file: queueStore.js
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
        
        // 🎯 FALLBACK FIX: Introduce a small delay to resolve race conditions 
        // in deployed environments before fetching the new data.
        await new Promise(resolve => setTimeout(resolve, 500)) 
        
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
        console.log('🔍 Starting loadQueues - Environment check:')
        console.log('- VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL)
        console.log('- import.meta.env:', import.meta.env)
        
        const response = await queueStatusAPI.getAllQueues()
        console.log('✅ getAllQueues response received:')
        console.log('- Type:', typeof response)
        console.log('- Is Array:', Array.isArray(response))
        console.log('- Length:', response?.length)
        console.log('- Response:', response)
        
        // Handle different response formats
        let queues = []
        
        // 🎯 FIX: If response is an empty string for a 200 OK (Content-Length: 0), 
        // treat it as an empty array. This resolves the deployed environment issue.
        if (!response || (typeof response === 'string' && response.trim() === '')) {
          console.log('📋 Handling empty/null/string-empty response as empty array.')
          queues = []
        } else if (Array.isArray(response)) {
          console.log('📋 Processing as array')
          queues = response
        } else if (response && Array.isArray(response.queues)) {
          console.log('📋 Processing as object with queues array')
          queues = response.queues
        } else if (response && typeof response === 'object') {
          console.log('📋 Processing as object, converting to array')
          queues = Object.values(response)
        } else {
          console.warn('❌ Unexpected response format:', response)
          console.warn('- Response type:', typeof response)
          console.warn('- Response value:', response)
          queues = []
        }
        
        console.log('🔧 Processed queues:', queues)
        console.log('- Queues count:', queues.length)
        
        // Ensure we have an array and sort by lastUpdated (most recent first)
        this.queues = queues
          .filter(queue => queue && typeof queue === 'object') // Filter out invalid items
          .sort((a, b) => {
            const aDate = new Date(a.lastUpdated || 0)
            const bDate = new Date(b.lastUpdated || 0)
            return bDate - aDate
          })
        
        console.log('✅ Final queues set:', this.queues.length, 'items')
        
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to load queues'
        console.error('❌ Error loading queues:')
        console.error('- Error type:', error.constructor.name)
        console.error('- Error message:', error.message)
        console.error('- Error response:', error.response)
        console.error('- Full error:', error)
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
