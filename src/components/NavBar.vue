<script setup>
import { RouterLink, useRouter, useRoute } from "vue-router";
import logoImage from "/assets/jc-logo.png";

const router = useRouter();
const route = useRoute();

const scrollToSection = (sectionId, event) => {
  // Prevent default anchor behavior
  event.preventDefault();

  // Handle Freedom Wall navigation separately
  if (sectionId === 'freedom-wall') {
    // Clear any existing role selection
    localStorage.removeItem('selectedRole');
    router.push('/role-selection');
    return;
  }

  // If we're on the Freedom Wall page, navigate to home first
  if (route.path === '/freedom-wall') {
    router.push('/').then(() => {
      // Wait for navigation to complete before scrolling
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const elementTop = element.offsetTop - 80; // Account for navbar height
          window.scrollTo({
            top: elementTop,
            behavior: 'smooth'
          });
        }
      }, 100);
    });
    return;
  }

  // If we're already on the home page
  if (route.path === '/') {
    const element = document.getElementById(sectionId);
    if (element) {
      // Get current scroll position
      const currentScroll = window.scrollY;
      const elementTop = element.offsetTop - 80; // Account for navbar height
      
      // Only scroll if we're not already at that section
      if (Math.abs(currentScroll - elementTop) > 10) {
        window.scrollTo({
          top: elementTop,
          behavior: 'smooth'
        });
      }
    }
  }
};
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-dark navbar-dark fixed-top p-2">
    <div class="container">
      <RouterLink to="/" class="navbar-brand">
        <img :src="logoImage" alt="Logo" height="30" class="m-1" />
      </RouterLink>
      <button
        class="navbar-toggler rounded-2"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navmenu"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navmenu">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <a @click="(e) => scrollToSection('about-me', e)" class="nav-link" href="#">About</a>
          </li>
          <li class="nav-item">
            <a @click="(e) => scrollToSection('works', e)" class="nav-link" href="#">Works</a>
          </li>
          <li class="nav-item">
            <a @click="(e) => scrollToSection('interests', e)" class="nav-link" href="#">Interests</a>
          </li>
          <li class="nav-item">
            <a @click="(e) => scrollToSection('goals', e)" class="nav-link" href="#">Goals</a>
          </li>
        </ul>
        <ul class="navbar-nav">
          <li class="nav-item">
            <a @click="(e) => scrollToSection('freedom-wall', e)" class="nav-link" href="#">Freedom Wall</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.nav-link {
  cursor: pointer;
}

.nav-link:hover {
  color: #0dcaf0 !important;
}
</style>
