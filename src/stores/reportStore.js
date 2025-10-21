import { defineStore } from 'pinia'
import { userReportAPI } from '../services/api'

export const useReportStore = defineStore('report', {
  state: () => ({
    reports: [],
    loading: false,
    error: null
  }),

  actions: {
    async submitReport(reportData) {
      this.loading = true
      this.error = null
      try {
        const response = await userReportAPI.submitReport(reportData)
        // Add to local reports list
        this.reports.unshift({
          _id: response.report,
          ...reportData,
          timestamp: new Date().toISOString(),
          validated: false
        })
        return response
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to submit report'
        throw error
      } finally {
        this.loading = false
      }
    },

    async setReportValidationStatus(reportID, isValid) {
      this.loading = true
      this.error = null
      try {
        await userReportAPI.setReportValidationStatus(reportID, isValid)
        // Update local state
        const report = this.reports.find(r => r._id === reportID)
        if (report) {
          report.validated = isValid
        }
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to update validation status'
        throw error
      } finally {
        this.loading = false
      }
    },

    async getReport(reportID) {
      this.loading = true
      this.error = null
      try {
        const response = await userReportAPI.getReport(reportID)
        return response[0] // API returns array with single item
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to get report'
        throw error
      } finally {
        this.loading = false
      }
    },

    async getValidatedReportsByQueue(queueID) {
      this.loading = true
      this.error = null
      try {
        const response = await userReportAPI.getValidatedReportsByQueue(queueID)
        return response
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to get validated reports'
        throw error
      } finally {
        this.loading = false
      }
    },

    async loadAllReports() {
      this.loading = true
      this.error = null
      try {
        const response = await userReportAPI.getAllReports()
        this.reports = response
      } catch (error) {
        this.error = error.response?.data?.error || 'Failed to load reports'
        throw error
      } finally {
        this.loading = false
      }
    },

    clearError() {
      this.error = null
    }
  }
})
