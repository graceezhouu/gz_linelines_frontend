<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">User Reports</h1>
        <p class="text-gray-600 mt-2">Submit and manage real-time queue reports</p>
      </div>
      <button
        @click="showSubmitModal = true"
        class="btn-primary flex items-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        <span>Submit Report</span>
      </button>
    </div>

    <!-- Error Alert -->
    <div v-if="reportStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error</h3>
          <p class="text-sm text-red-700 mt-1">{{ reportStore.error }}</p>
        </div>
        <button
          @click="reportStore.clearError()"
          class="ml-auto text-red-400 hover:text-red-600"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center space-x-2">
          <label class="text-sm font-medium text-gray-700">Filter by Queue:</label>
          <select v-model="selectedQueue" class="input-field w-48">
            <option value="">All Queues</option>
            <option v-for="queue in availableQueues" :key="queue" :value="queue">
              {{ queue }}
            </option>
          </select>
        </div>
        <div class="flex items-center space-x-2">
          <label class="text-sm font-medium text-gray-700">Status:</label>
          <select v-model="statusFilter" class="input-field w-32">
            <option value="">All</option>
            <option value="validated">Validated</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <button
          @click="loadReports"
          class="btn-secondary flex items-center space-x-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          <span>Refresh</span>
        </button>
      </div>
    </div>

    <!-- Reports List -->
    <div class="space-y-4">
      <ReportCard
        v-for="report in filteredReports"
        :key="report._id"
        :report="report"
        @validate="handleValidate"
        @view="handleViewReport"
      />
    </div>

    <!-- Empty State -->
    <div v-if="filteredReports.length === 0 && !reportStore.loading" class="text-center py-12">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
      <p class="text-gray-600 mb-6">Submit your first report or adjust your filters</p>
      <button @click="showSubmitModal = true" class="btn-primary">
        Submit Report
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="reportStore.loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      <p class="text-gray-600 mt-4">Loading reports...</p>
    </div>

    <!-- Submit Report Modal -->
    <SubmitReportModal
      v-if="showSubmitModal"
      @close="showSubmitModal = false"
      @submitted="handleReportSubmitted"
    />

    <!-- View Report Modal -->
    <ViewReportModal
      v-if="showViewModal"
      :report="selectedReport"
      @close="showViewModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useReportStore } from '../stores/reportStore'
import ReportCard from '../components/ReportCard.vue'
import SubmitReportModal from '../components/SubmitReportModal.vue'
import ViewReportModal from '../components/ViewReportModal.vue'

const reportStore = useReportStore()

const showSubmitModal = ref(false)
const showViewModal = ref(false)
const selectedReport = ref(null)
const selectedQueue = ref('')
const statusFilter = ref('')

const availableQueues = ref(['concert-hall-1', 'restaurant-1', 'museum-tour-1'])

const filteredReports = computed(() => {
  let reports = reportStore.reports

  if (selectedQueue.value) {
    reports = reports.filter(report => report.queue === selectedQueue.value)
  }

  if (statusFilter.value) {
    const isValid = statusFilter.value === 'validated'
    reports = reports.filter(report => report.validated === isValid)
  }

  return reports
})

const handleReportSubmitted = (report) => {
  showSubmitModal.value = false
  // Report is already added to the store
}

const handleValidate = async (reportID, isValid) => {
  try {
    await reportStore.setReportValidationStatus(reportID, isValid)
  } catch (error) {
    console.error('Failed to validate report:', error)
  }
}

const handleViewReport = (report) => {
  selectedReport.value = report
  showViewModal.value = true
}

const loadReports = async () => {
  try {
    await reportStore.loadAllReports()
  } catch (error) {
    console.error('Failed to load reports:', error)
  }
}

onMounted(() => {
  loadReports()
})
</script>
