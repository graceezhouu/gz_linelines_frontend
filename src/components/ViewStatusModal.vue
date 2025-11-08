<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-10 mx-auto p-5 border w-4/5 max-w-4xl shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Queue Status</h3>
          <div class="flex items-center space-x-2">
            <button
              @click="refreshStatus"
              :disabled="loading"
              class="text-gray-400 hover:text-gray-600"
              title="Refresh Status"
            >
              <svg class="w-5 h-5" :class="{'animate-spin': loading}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
            <button
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <!-- Queue Info -->
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <h4 class="font-medium text-gray-900">{{ queue.queueID }}</h4>
          <p class="text-sm text-gray-600">
            {{ typeof queue.location === 'string' ? queue.location : 'Location: ' + queue.location.latitude + ', ' + queue.location.longitude }}
          </p>
        </div>

        <!-- Status Information -->
        <div v-if="currentStatus && !loading" class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="text-center p-4 bg-blue-50 rounded-lg">
              <p class="text-sm text-blue-600 font-medium">Wait Time</p>
              <p class="text-2xl font-bold text-blue-900">
                {{ displayData.waitTime !== 'N/A' ? displayData.waitTime + ' min' : 'N/A' }}
              </p>
            </div>
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <p class="text-sm text-green-600 font-medium">People in Line</p>
              <p class="text-2xl font-bold text-green-900">
                {{ displayData.peopleInLine || 'N/A' }}
              </p>
            </div>
          </div>

          <div class="text-center p-4 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-600 font-medium">Creation Time</p>
            <p class="text-lg font-semibold text-gray-900">
              {{ formatTime(currentStatus.lastUpdated) }}
            </p>
          </div>

          <!-- Real-time indicator -->
          <div class="flex items-center justify-center space-x-2 text-sm text-green-600">
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live status</span>
          </div>
        </div>

        <!-- User Reports Section -->
        <div v-if="!loading && !error" class="mt-8">
          <div class="flex items-center justify-between mb-4">
            <h4 class="text-lg font-semibold text-gray-900">User Reports ({{ queueReports.length }} found)</h4>
            <button
              @click="refreshReports"
              :disabled="loadingReports"
              class="text-sm text-blue-600 hover:text-blue-800"
            >
              <svg class="w-4 h-4 inline" :class="{'animate-spin': loadingReports}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Refresh Reports
            </button>
          </div>

          <!-- Reports List -->
          <div v-if="queueReports.length > 0" class="space-y-3 max-h-96 overflow-y-auto">
            <div
              v-for="report in queueReports"
              :key="report._id"
              class="bg-gray-50 rounded-lg p-4 border"
              :class="{
                'border-green-200 bg-green-50': report.validated === true,
                'border-yellow-200 bg-yellow-50': report.validated === false,
                'border-gray-200': report.validated === null
              }"
            >
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center space-x-4 mb-2">
                    <span class="text-sm font-medium text-gray-900">User: {{ report.user }}</span>
                    <span class="text-xs text-gray-500">{{ formatTime(report.timestamp) }}</span>
                    <span
                      v-if="report.validated === true"
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      ✓ Validated
                    </span>
                    <span
                      v-else-if="report.validated === false"
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                    >
                      ✗ Invalid
                    </span>
                    <span
                      v-else
                      class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                    >
                      ⏳ Pending
                    </span>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                    <div v-if="report.estimatedPeopleInLine">
                      <span class="font-medium">People in line:</span>
                      <span class="ml-1">{{ report.estimatedPeopleInLine }}</span>
                    </div>
                    <div v-if="report.currentWaitTime">
                      <span class="font-medium">Wait time:</span>
                      <span class="ml-1">{{ report.currentWaitTime }} min</span>
                    </div>
                    <div v-if="report.entryOutcome">
                      <span class="font-medium">Outcome:</span>
                      <span class="ml-1 capitalize">{{ report.entryOutcome }}</span>
                    </div>
                  </div>
                </div>

                <!-- Validation Buttons -->
                <div v-if="report.validated !== true" class="flex space-x-2 ml-4">
                  <button
                    @click="validateReport(report._id, true)"
                    :disabled="validatingReports"
                    class="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    Validate
                  </button>
                  <button
                    @click="validateReport(report._id, false)"
                    :disabled="validatingReports"
                    class="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    Mark Invalid
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- No Reports -->
          <div v-else-if="!loadingReports" class="text-center py-6 text-gray-500">
            <svg class="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <p>No user reports available for this queue</p>
          </div>

          <!-- Loading Reports -->
          <div v-else class="text-center py-6">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p class="text-gray-600 mt-2">Loading reports...</p>
          </div>
        </div>

        <!-- Loading State -->
        <div v-else-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p class="text-gray-600 mt-4">Loading latest status...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-8">
          <svg class="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
          <p class="text-red-600 mb-2">{{ error }}</p>
          <button @click="refreshStatus" class="btn-primary text-sm">Try Again</button>
        </div>

        <!-- Actions -->
        <div class="flex justify-end pt-6">
          <button
            @click="$emit('close')"
            class="btn-primary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useQueueStore } from '../stores/queueStore'
import { useReportStore } from '../stores/reportStore'

const props = defineProps({
  queue: {
    type: Object,
    required: true
  }
})

defineEmits(['close'])

const queueStore = useQueueStore()
const reportStore = useReportStore()

// Get display data that uses most recent user reports if available
const displayData = computed(() => queueStore.getQueueDisplayData(props.queue.queueID))

const currentStatus = ref(null)
const queueReports = ref([])
const loading = ref(false)
const loadingReports = ref(false)
const validatingReports = ref(false)
const error = ref('')

const refreshStatus = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const status = await queueStore.getQueueStatus(props.queue.queueID)
    currentStatus.value = status
    // Also refresh user reports to get the latest data for display
    await queueStore.getMostRecentUserReports()
  } catch (err) {
    error.value = 'Failed to load queue status'
    console.error('Error fetching queue status:', err)
  } finally {
    loading.value = false
  }
}

const refreshReports = async () => {
  loadingReports.value = true
  
  try {
    console.log('Fetching reports for queue:', props.queue.queueID)
    
    // Load all reports first
    await reportStore.loadAllReports()
    const allReports = reportStore.reports
    console.log('All reports from store:', allReports)
    
    // Filter reports for this specific queue
    const queueSpecificReports = allReports.filter(report => {
      console.log(`Comparing report queue "${report.queue}" with target queue "${props.queue.queueID}"`)
      return report.queue === props.queue.queueID
    })
    console.log('Queue specific reports:', queueSpecificReports)
    
    // Sort by timestamp (newest first)
    queueReports.value = queueSpecificReports.sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    )
    console.log('Final queueReports:', queueReports.value)
  } catch (err) {
    console.error('Error fetching reports:', err)
  } finally {
    loadingReports.value = false
  }
}

const validateReport = async (reportId, isValid) => {
  validatingReports.value = true
  
  try {
    await reportStore.setReportValidationStatus(reportId, isValid)
    // Update the local report's validation status immediately
    const report = queueReports.value.find(r => r._id === reportId)
    if (report) {
      report.validated = isValid
    }
    // Refresh reports to ensure consistency with backend
    await refreshReports()
    // Note: reportStore.setReportValidationStatus already triggers queueStore.getMostRecentUserReports()
    // so the displayData computed property will automatically update
  } catch (err) {
    console.error('Error validating report:', err)
  } finally {
    validatingReports.value = false
  }
}

// Load status and reports when component mounts
onMounted(() => {
  console.log('ViewStatusModal mounted with queue:', props.queue)
  if (!props.queue || !props.queue.queueID) {
    console.error('No valid queue provided to ViewStatusModal')
    error.value = 'No queue data available'
    return
  }
  
  refreshStatus()
  refreshReports()
  
  // Set up auto-refresh every 30 seconds for real-time updates
  const refreshInterval = setInterval(() => {
    refreshStatus()
    refreshReports()
  }, 30000)
  
  // Clean up interval on unmount
  onBeforeUnmount(() => {
    clearInterval(refreshInterval)
  })
})

const formatTime = (timestamp) => {
  if (!timestamp) return 'Never'
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>
