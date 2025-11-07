import { defineStore } from 'pinia'
import { predictionAPI } from '../services/api'

const STORAGE_KEY = 'linelens_predictions'

// Helper functions for localStorage persistence
const loadPredictionsFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return new Map(Object.entries(parsed))
    }
  } catch (error) {
    console.error('Failed to load predictions from storage:', error)
  }
  return new Map()
}

const savePredictionsToStorage = (predictions) => {
  try {
    const obj = Object.fromEntries(predictions)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj))
  } catch (error) {
    console.error('Failed to save predictions to storage:', error)
  }
}

export const usePredictionStore = defineStore('prediction', {
  state: () => ({
    predictions: loadPredictionsFromStorage(), // queueID -> prediction data
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
        savePredictionsToStorage(this.predictions)
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
        savePredictionsToStorage(this.predictions)
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
        // Clear all predictions from store and localStorage
        this.predictions.clear()
        localStorage.removeItem(STORAGE_KEY)
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

    clearAllPredictions() {
      this.predictions.clear()
      localStorage.removeItem(STORAGE_KEY)
    },

    clearError() {
      this.error = null
    }
  }
})
