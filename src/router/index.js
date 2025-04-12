import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/HomePage.vue'
import FreedomWallComponent from '../components/FreedomWall.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/freedom-wall',
    name: 'FreedomWall',
    component: FreedomWallComponent
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 