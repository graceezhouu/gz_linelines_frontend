import { defineStore } from 'pinia'
import { predictionAPI } from '../services/api'

export const usePredictionStore = defineStore('prediction', {
  state: () => ({
    predictions: new Map(), // queueID -> prediction data
    loading: false,
    error: null
  }),

  actions: {
    async runPrediction(queueID, modelID = 'default') {
      this.loading = true
      this.error = null
      try {
        const prediction = await predictionAPI.runPrediction(queueID, modelID)
        this.predictions.set(queueID, {
          ...prediction,
          lastRun: new Date().toISOString()
        })
        return prediction
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to run prediction'
        throw error
      } finally {
        this.loading = false
      }
    },

    async getForecast(queueID) {
      this.loading = true
      this.error = null
      try {
        const forecast = await predictionAPI.getForecast(queueID)
        this.predictions.set(queueID, forecast)
        return forecast
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to get forecast'
        throw error
      } finally {
        this.loading = false
      }
    },

    async cleanOldReports() {
      this.loading = true
      this.error = null
      try {
        await predictionAPI.cleanOldReports()
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to clean old reports'
        throw error
      } finally {
        this.loading = false
      }
    },

    getPredictionForQueue(queueID) {
      return this.predictions.get(queueID) || null
    },

    clearError() {
      this.error = null
    }
  }
})
