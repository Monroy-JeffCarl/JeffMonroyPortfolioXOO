import { createRouter, createWebHistory } from 'vue-router';
import AboutMe from './components/AboutMe.vue';
import Works from './components/Works.vue';
import Interests from './components/Interests.vue';
import Goals from './components/Goals.vue';
import FreedomWall from './components/FreedomWall.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: AboutMe },
    { path: '/works', component: Works },
    { path: '/interests', component: Interests },
    { path: '/goals', component: Goals },
    { path: '/freedom-wall', component: FreedomWall},
  ]
});

export default router;
