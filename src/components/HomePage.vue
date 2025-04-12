<template>
  <div class="home-page">
    <NavBarComponent />
    
    <div class="sections-container">
      <section id="about-me" class="section">
        <div class="bg-warning-bg-subtle text-center text-sm-start">
          <div class="container my-5">
            <AboutMeComponent />
          </div>
        </div>
      </section>

      <section id="works" class="section">
        <div class="container my-5">
          <WorksComponent />
        </div>
        <div class="section-divider"></div>
      </section>

      <section id="interests" class="section">
        <div class="container my-5">
          <InterestsComponent />
        </div>
        <div class="section-divider"></div>
      </section>

      <section id="goals" class="section">
        <div class="container my-5">
          <GoalsComponent />
        </div>
        <div class="section-divider"></div>
      </section>
    </div>
  </div>
</template>

<script>
import NavBarComponent from './NavBar.vue'
import AboutMeComponent from './AboutMe.vue'
import GoalsComponent from './Goals.vue'
import InterestsComponent from './Interests.vue'
import WorksComponent from './Works.vue'

export default {
  name: 'HomePage',
  components: {
    NavBarComponent,
    AboutMeComponent,
    GoalsComponent,
    InterestsComponent,
    WorksComponent
  }
}
</script>

<style scoped>
.home-page {
  width: 100%;
}



.section {
  min-height: 100vh; /* Adjust based on your navbar height */
  display: flex;
  flex-direction: column;
  position: relative;
}

.section > div {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.section-divider {
  height: 20px;
  background: #ffc107;
  margin: 0;
  width: 100%;
  position: absolute;
  border: none;
}

/* Remove extra margin from container */
.container {
  margin: 0 !important;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style> 