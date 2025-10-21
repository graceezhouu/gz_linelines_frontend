<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Queue Management</h1>
        <p class="text-gray-600 mt-2">Create and manage queues for events and venues</p>
      </div>
      <button
        @click="showCreateModal = true"
        class="btn-primary flex items-center space-x-2"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
        <span>Create Queue</span>
      </button>
    </div>

    <!-- Error Alert -->
    <div v-if="queueStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4">
      <div class="flex">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error</h3>
          <p class="text-sm text-red-700 mt-1">{{ queueStore.error }}</p>
        </div>
        <button
          @click="queueStore.clearError()"
          class="ml-auto text-red-400 hover:text-red-600"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>

    <!-- Queues List -->
    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <QueueCard
        v-for="queue in queueStore.queues"
        :key="queue.queueID"
        :queue="queue"
        @update-status="handleUpdateStatus"
        @view-status="handleViewStatus"
      />
    </div>

    <!-- Empty State -->
    <div v-if="queueStore.queues.length === 0 && !queueStore.loading" class="text-center py-12">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No queues yet</h3>
      <p class="text-gray-600 mb-6">Create your first queue to get started</p>
      <button @click="showCreateModal = true" class="btn-primary">
        Create Queue
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="queueStore.loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      <p class="text-gray-600 mt-4">Loading queues...</p>
    </div>

    <!-- Create Queue Modal -->
    <CreateQueueModal
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @created="handleQueueCreated"
    />

    <!-- Update Status Modal -->
    <UpdateStatusModal
      v-if="showUpdateModal"
      :queue="selectedQueue"
      @close="showUpdateModal = false"
      @updated="handleStatusUpdated"
    />

    <!-- View Status Modal -->
    <ViewStatusModal
      v-if="showViewModal"
      :queue="selectedQueue"
      :status="queueStatus"
      @close="showViewModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQueueStore } from '../stores/queueStore'
import QueueCard from '../components/QueueCard.vue'
import CreateQueueModal from '../components/CreateQueueModal.vue'
import UpdateStatusModal from '../components/UpdateStatusModal.vue'
import ViewStatusModal from '../components/ViewStatusModal.vue'

const queueStore = useQueueStore()

const showCreateModal = ref(false)
const showUpdateModal = ref(false)
const showViewModal = ref(false)
const selectedQueue = ref(null)
const queueStatus = ref(null)

const handleQueueCreated = async (newQueue) => {
  showCreateModal.value = false
  // Reload queues to show the new queue
  await queueStore.loadQueues()
}

const handleUpdateStatus = (queue) => {
  selectedQueue.value = queue
  showUpdateModal.value = true
}

const handleStatusUpdated = async (updatedQueue) => {
  showUpdateModal.value = false
  // Reload queues to show updated status
  await queueStore.loadQueues()
}

const handleViewStatus = async (queue) => {
  selectedQueue.value = queue
  try {
    queueStatus.value = await queueStore.getQueueStatus(queue.queueID)
    showViewModal.value = true
  } catch (error) {
    console.error('Failed to get queue status:', error)
  }
}

onMounted(async () => {
  await queueStore.loadQueues()
})
</script>
