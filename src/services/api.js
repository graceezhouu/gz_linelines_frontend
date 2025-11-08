import axios from 'axios'

// Use environment variable for API base URL, fallback to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.baseURL}${config.url}`)
    console.log('API Base URL:', API_BASE_URL)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// QueueStatus API
export const queueStatusAPI = {
  createQueue: async (data) => {
    const response = await api.post('/QueueStatus/createQueue', data)
    return response.data
  },

  updateStatus: async (data) => {
    const response = await api.post('/QueueStatus/updateStatus', data)
    return response.data
  },

  viewStatus: async (queueID) => {
    const response = await api.post('/QueueStatus/_viewStatus', { queueID })
    return response.data
  },

  getAllQueues: async () => {
    console.log('🌐 API Configuration check:')
    console.log('- API_BASE_URL:', API_BASE_URL)
    console.log('- VITE_API_BASE_URL env var:', import.meta.env.VITE_API_BASE_URL)
    console.log('- All env vars:', import.meta.env)
    
    const response = await api.post('/QueueStatus/_getAllQueues', {})
    console.log('📡 Raw API response:')
    console.log('- Status:', response.status)
    console.log('- Headers:', response.headers)
    console.log('- Data type:', typeof response.data)
    console.log('- Data:', response.data)
    
    return response.data
  }
}

// Prediction API
export const predictionAPI = {
  runPrediction: async (queueID, modelID = 'default') => {
    const response = await api.post('/api/Prediction/runPrediction', { queueID, modelID })
    return response.data
  },

  getForecast: async (queueID) => {
    const response = await api.post('/api/Prediction/getForecast', { queueID })
    return response.data
  },

  cleanOldReports: async () => {
    const response = await api.post('/api/Prediction/cleanOldReports', {})
    return response.data
  }
}

// UserReport API
export const userReportAPI = {
  submitReport: async (data) => {
    const response = await api.post('/api/UserReport/submitReport', data)
    return response.data
  },

  setReportValidationStatus: async (reportID, isValid) => {
    const response = await api.post('/api/UserReport/setReportValidationStatus', {
      report: reportID,
      isValid
    })
    return response.data
  },

  getReport: async (reportID) => {
    const response = await api.post('/api/UserReport/_getReport', { report: reportID })
    return response.data
  },

  getValidatedReportsByQueue: async (queueID) => {
    const response = await api.post('/api/UserReport/_getValidatedReportsByQueue', { queue: queueID })
    return response.data
  },

  getAllReports: async () => {
    const response = await api.post('/api/UserReport/_getAllReports', {})
    return response.data
  }
}

// VirtualCheckIn API
export const virtualCheckInAPI = {
  reserveSpot: async (email, queueID, organizerEmail) => {
    const response = await api.post('/api/VirtualCheckIn/reserveSpot', { email, queueID, organizerEmail })  
    return response.data
  },

  cancelSpot: async (reservationID) => {
    const response = await api.post('/api/VirtualCheckIn/cancelSpot', { reservationID })
    return response.data
  },

  expireReservations: async () => {
    const response = await api.post('/api/VirtualCheckIn/expireReservations', {})
    return response.data
  },

  getReservationDetails: async (reservationID) => {
    const response = await api.post('/api/VirtualCheckIn/_getReservationDetails', { reservationID })
    return response.data
  },

  getUserActiveReservation: async (email, queueID) => {
    const response = await api.post('/api/VirtualCheckIn/_getUserActiveReservation', { email, queueID })
    return response.data
  }
}

export default api
