<template>
  <div class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-10 mx-auto p-5 border w-4/5 max-w-4xl shadow-lg rounded-md bg-white">
      <div class="mt-3">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Queue Status History</h3>
          <div class="flex items-center space-x-2">
            <button
              @click="refreshReports"
              :disabled="loading"
              class="text-gray-400 hover:text-gray-600"
              title="Refresh Reports"
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
          <h4 class="font-medium text-gray-900">{{ queueID }}</h4>
          <p class="text-sm text-gray-600">Historical user reports for this queue</p>
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
              <div class="flex space-x-2 ml-4">
                <button
                  @click="validateReport(report._id, !report.validated)"
                  :disabled="validatingReports"
                  class="px-3 py-1 text-xs rounded transition-colors disabled:opacity-50"
                  :class="report.validated ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-green-600 text-white hover:bg-green-700'"
                >
                  {{ report.validated ? 'Invalidate' : 'Validate' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- No Reports -->
        <div v-else-if="!loading" class="text-center py-6 text-gray-500">
          <svg class="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          <p>No user reports available for this queue</p>
        </div>

        <!-- Loading Reports -->
        <div v-else class="text-center py-6">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p class="text-gray-600 mt-2">Loading reports...</p>
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
import { ref, onMounted } from 'vue'
import { useReportStore } from '../stores/reportStore'

const props = defineProps({
  queueID: {
    type: String,
    required: true
  }
})

defineEmits(['close'])

const reportStore = useReportStore()

const queueReports = ref([])
const loading = ref(false)
const validatingReports = ref(false)

const refreshReports = async () => {
  loading.value = true
  
  try {
    console.log('Fetching reports for queue:', props.queueID)
    
    // Load all reports first
    await reportStore.loadAllReports()
    const allReports = reportStore.reports
    console.log('All reports from store:', allReports)
    
    // Filter reports for this specific queue
    const queueSpecificReports = allReports.filter(report => {
      console.log(`Comparing report queue "${report.queue}" with target queue "${props.queueID}"`)
      return report.queue === props.queueID
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
    loading.value = false
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
  } catch (err) {
    console.error('Error validating report:', err)
  } finally {
    validatingReports.value = false
  }
}

// Load reports when component mounts
onMounted(() => {
  console.log('ViewQueueStatusModal mounted with queue:', props.queueID)
  if (!props.queueID) {
    console.error('No valid queue ID provided to ViewQueueStatusModal')
    return
  }
  
  refreshReports()
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
