<script setup>
import { RouterLink, useRouter, useRoute } from "vue-router";
import logoImage from "/assets/jc-logo.png";

const router = useRouter();
const route = useRoute();

const scrollToSection = (sectionId, event) => {
  event.preventDefault();

  if (sectionId === 'freedom-wall') {
    localStorage.removeItem('selectedRole');
    router.push('/role-selection');
    return;
  }

  if (route.path === '/freedom-wall') {
    router.push('/').then(() => {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const elementTop = element.offsetTop - 80;
          window.scrollTo({
            top: elementTop,
            behavior: 'smooth'
          });
        }
      }, 100);
    });
    return;
  }

  if (route.path === '/') {
    const element = document.getElementById(sectionId);
    if (element) {
      const currentScroll = window.scrollY;
      const elementTop = element.offsetTop - 80; 

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
