import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import QueueManagement from '../views/QueueManagement.vue'
import Predictions from '../views/Predictions.vue'
import UserReports from '../views/UserReports.vue'
import VirtualCheckIn from '../views/VirtualCheckIn.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/queues',
    name: 'QueueManagement',
    component: QueueManagement
  },
  {
    path: '/predictions',
    name: 'Predictions',
    component: Predictions
  },
  {
    path: '/reports',
    name: 'UserReports',
    component: UserReports
  },
  {
    path: '/checkin',
    name: 'VirtualCheckIn',
    component: VirtualCheckIn
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
