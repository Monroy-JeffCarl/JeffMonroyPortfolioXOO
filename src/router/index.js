import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../components/HomePage.vue'
import FreedomWallComponent from '../components/FreedomWall.vue'
import RoleSelection from '../components/RoleSelection.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/freedom-wall',
    name: 'FreedomWall',
    component: FreedomWallComponent,
    beforeEnter: (to, from, next) => {
      const selectedRole = localStorage.getItem('selectedRole');
      if (!selectedRole) {
        next('/role-selection');
      } else {
        next();
      }
    }
  },
  {
    path: '/role-selection',
    name: 'RoleSelection',
    component: RoleSelection
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 