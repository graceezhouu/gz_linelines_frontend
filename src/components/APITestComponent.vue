<template>
  <div class="bg-white rounded-lg shadow-md p-6 mb-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">API Test</h3>
    <div class="flex space-x-4">
      <button @click="testAPI" class="btn-primary">Test API Connection</button>
      <button @click="testCreateQueue" class="btn-secondary">Test Create Queue</button>
    </div>
    <div v-if="result" class="mt-4 p-4 bg-gray-50 rounded-lg">
      <h4 class="font-medium text-gray-900">API Response:</h4>
      <pre class="text-sm text-gray-700 mt-2">{{ result }}</pre>
    </div>
    <div v-if="error" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
      <h4 class="font-medium text-red-800">Error:</h4>
      <p class="text-sm text-red-700 mt-2">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { userReportAPI, queueStatusAPI } from '../services/api'

const result = ref('')
const error = ref('')

const testAPI = async () => {
  result.value = ''
  error.value = ''
  try {
    const response = await userReportAPI.getAllReports()
    result.value = JSON.stringify(response, null, 2)
  } catch (err) {
    error.value = err.message || 'API test failed'
    console.error('API test error:', err)
  }
}

const testCreateQueue = async () => {
  result.value = ''
  error.value = ''
  try {
    const queueData = {
      queueID: 'test-queue-' + Date.now(),
      location: 'Test Location',
      estWaitTime: 10,
      estPplInLine: 5,
      virtualCheckInEligible: true
    }
    const response = await queueStatusAPI.createQueue(queueData)
    result.value = JSON.stringify(response, null, 2)
  } catch (err) {
    error.value = err.message || 'Create queue test failed'
    console.error('Create queue test error:', err)
  }
}
</script>
