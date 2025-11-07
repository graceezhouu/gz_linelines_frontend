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

    <!-- Search -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center space-x-2 flex-1">
          <label class="text-sm font-medium text-gray-700">Search by Queue Name:</label>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Enter queue name..."
            class="input-field flex-1 max-w-md"
            @keyup.enter="handleSearch"
          />
        </div>
        <button
          @click="handleSearch"
          class="btn-primary flex items-center space-x-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <span>Search</span>
        </button>
        <button
          @click="clearSearch"
          class="btn-secondary flex items-center space-x-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          <span>Clear</span>
        </button>
      </div>
    </div>

    <!-- Search Results Info -->
    <div v-if="isSearchActive" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <span class="text-sm font-medium text-blue-800">
            Search results for "{{ searchQuery }}" ({{ filteredReports.length }} {{ filteredReports.length === 1 ? 'report' : 'reports' }} found)
          </span>
        </div>
        <button
          @click="clearSearch"
          class="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Clear Search
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
        @view-status="handleViewStatus"
        @update="handleUpdate"
      />
    </div>

    <!-- Empty State -->
    <div v-if="filteredReports.length === 0 && !reportStore.loading" class="text-center py-12">
      <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        {{ isSearchActive ? 'No reports found for this search' : 'No reports found' }}
      </h3>
      <p class="text-gray-600 mb-6">
        {{ isSearchActive ? 'Try a different search term or clear your search' : 'Submit your first report to get started' }}
      </p>
      <div class="space-x-4">
        <button v-if="isSearchActive" @click="clearSearch" class="btn-secondary">
          Clear Search
        </button>
        <button @click="showSubmitModal = true" class="btn-primary">
          Submit Report
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="reportStore.loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      <p class="text-gray-600 mt-4">Loading reports...</p>
    </div>

    <!-- Submit Report Modal -->
    <SubmitReportModal
      v-if="showSubmitModal"
      :pre-populated-queue="prePopulatedQueue"
      @close="showSubmitModal = false"
      @submitted="handleReportSubmitted"
    />

    <!-- View Queue Status Modal -->
    <ViewQueueStatusModal
      v-if="showViewStatusModal"
      :queue-i-d="selectedQueueForStatus"
      @close="showViewStatusModal = false"
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
import { useQueueStore } from '../stores/queueStore'
import ReportCard from '../components/ReportCard.vue'
import SubmitReportModal from '../components/SubmitReportModal.vue'
import ViewReportModal from '../components/ViewReportModal.vue'
import ViewQueueStatusModal from '../components/ViewQueueStatusModal.vue'

const reportStore = useReportStore()
const queueStore = useQueueStore()

const showSubmitModal = ref(false)
const showViewModal = ref(false)
const showViewStatusModal = ref(false)
const selectedReport = ref(null)
const selectedQueueForStatus = ref('')
const prePopulatedQueue = ref('')
const searchQuery = ref('')
const searchResults = ref([])
const isSearchActive = ref(false)

const filteredReports = computed(() => {
  let reports = isSearchActive.value ? searchResults.value : [...reportStore.reports]
  
  // Sort reports by timestamp (most recent first)
  return reports.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
})

const handleSearch = () => {
  console.log('handleSearch called with query:', searchQuery.value)
  console.log('Total reports in store:', reportStore.reports.length)
  console.log('Sample reports:', reportStore.reports.slice(0, 3))
  
  if (!searchQuery.value.trim()) {
    // If search query is empty, show all reports
    clearSearch()
    return
  }

  // Search through all reports and filter by queue name containing the search query
  const query = searchQuery.value.toLowerCase().trim()
  console.log('Searching for:', query)
  
  searchResults.value = reportStore.reports.filter(report => {
    const queueName = report.queue ? report.queue.toLowerCase() : ''
    const matches = queueName.includes(query)
    console.log(`Report queue: "${report.queue}" matches "${query}":`, matches)
    return matches
  })
  
  console.log('Search results:', searchResults.value.length, searchResults.value)
  isSearchActive.value = true
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  isSearchActive.value = false
}

const handleReportSubmitted = (report) => {
  showSubmitModal.value = false
  prePopulatedQueue.value = '' // Clear pre-populated queue
  // Report is already added to the store
}

const handleValidate = async (reportID, isValid) => {
  try {
    await reportStore.setReportValidationStatus(reportID, isValid)
  } catch (error) {
    console.error('Failed to validate report:', error)
  }
}

const handleViewStatus = (report) => {
  selectedQueueForStatus.value = report.queue
  showViewStatusModal.value = true
}

const handleUpdate = (report) => {
  prePopulatedQueue.value = report.queue
  showSubmitModal.value = true
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

onMounted(async () => {
  // Load both queues and reports
  await Promise.all([
    queueStore.loadQueues(),
    loadReports()
  ])
})
</script>
