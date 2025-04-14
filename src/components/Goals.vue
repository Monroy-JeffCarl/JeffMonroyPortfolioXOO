<script>
import NavBarComponent from "./NavBar.vue";

export default {
  components: {
    NavBarComponent,
  },
};
</script>

<script setup>
const goals = [
{
    id: 1,
    title: "Get a Degree",
    color: "text-warning",
    description: "Complete your studies and earn a degree in your chosen field.",
  },
  {
    id: 2,
    title: "Earn More Money",
    color: "text-info",
    description: "Increase your income through better job opportunities or side hustles.",
  },
  {
    id: 3,
    title: "Travel",
    color: "text-warning",
    description: "Explore new places, experience different cultures, and broaden your perspective.",
  },
  {
    id: 4,
    title: "Pursue Multimedia Arts",
    color: "text-info",
    description: "Develop your creative skills and build a career in multimedia arts.",
  },
  {
    id: 5,
    title: "Improve Oneself",
    color: "text-warning",
    description: "Focus on personal growth, mental health, and self-improvement.",
  },
  {
    id: 6,
    title: "Live Happily",
    color: "text-info",
    description: "Achieve a fulfilling and joyful life by following your passions and values.",
  },
];
</script>

<template>
  <NavBarComponent />
  <section>
    <div class="container d-flex flex-column justify-content-center">
      <h2 class="fw-bold text-center mb-4">Goals</h2>
      <div class="row justify-content-center">
        <div
          v-for="goal in goals"
          :key="goal.id"
          class="col-md-4 col-sm-6 mb-3 d-flex justify-content-center"
        >
          <div class="card p-0" style="width: 300px">
            <div class="card-header bg-dark" :class="goal.color">
              Goal {{ goal.id }}
            </div>
            <div class="card-body bg-light text-dark p-3">
              <h5 class="card-title">{{ goal.title }}</h5>
              <p class="card-text">
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.goals-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.row {
  margin-right: -15px;
  margin-left: -15px;
}

@media (min-width: 768px) {
  .goals-container {
    padding: 2rem;
  }
}
</style>
