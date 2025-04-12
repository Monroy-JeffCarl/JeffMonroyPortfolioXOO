<script setup>
import NavBarComponent from "./NavBar.vue";
import { computed, ref } from "vue";

const interests = [
  {
    id: "collapseOne",
    title: "Music",
    content:
      "This is the first item's accordion body. It is shown by default, until the collapse plugin adds the appropriate classes that we use to style each element.",
  },
  { id: "collapseTwo", title: "Arts", content: "" },
  {
    id: "collapseThree",
    title: "Video Games",
    content:
      "This is the third item's accordion body. It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element.",
  },
];

const artworks = ref([
  {
    title: "Moon will Cradle Me Home",
    image: new URL("/assets/work01.png", import.meta.url).href,
    category: "Illustration",
  },
  {
    title: "Warm Greeting",
    image: new URL("/assets/work03.png", import.meta.url).href,
    category: "Illustration",
  },
  {
    title: "I am a Star",
    image: new URL("/assets/work05.png", import.meta.url).href,
    category: "Illustration",
  },
  {
    title: "Lily Chou-Chou",
    image: new URL("/assets/work06.png", import.meta.url).href,
    category: "Illustration",
  },
  {
    title: "BGC Stroll",
    image: new URL("/assets/work12.png", import.meta.url).href,
    category: "Illustration",
  },
  {
    title: "DiscoverKnights: Angularventures",
    image: new URL("/assets/work04.png", import.meta.url).href,
    category: "Design",
  },
  {
    title: "Knights of Honor 2024",
    image: new URL("/assets/work08.png", import.meta.url).href,
    category: "Design",
  },
  {
    title: "SPADE 2024",
    image: new URL("/assets/work09.png", import.meta.url).href,
    category: "Design",
  },
]);

const illustrations = computed(() =>
  artworks.value.filter((art) => art.category === "Illustration")
);
const designs = computed(() =>
  artworks.value.filter((art) => art.category === "Design")
);
</script>

<template>
  <NavBarComponent />
  <section class="d-flex justify-content-center align-items-center">
    <main class="w-100">
      <h2 class="text-center mb-4">Interests</h2>
      <div class="accordion" id="interestsAccordion">
        <div
          v-for="interest in interests"
          :key="interest.id"
          class="accordion-item"
        >
          <h2 class="accordion-header">
            <button
              class="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              :data-bs-target="'#' + interest.id"
              aria-expanded="false"
              :aria-controls="interest.id"
            >
              {{ interest.title }}
            </button>
          </h2>
          <div
            class="accordion-collapse collapse"
            :id="interest.id"
            data-bs-parent="#interestsAccordion"
          >
            <div class="accordion-body">
              <template v-if="interest.id !== 'collapseTwo'">
                <strong>{{ interest.content }}</strong>
              </template>
              <template v-else>
                <section id="creativeWorks">
                  <div class="container-fluid p-0">
                    <div class="row g-4">
                      <!-- Digital Illustrations Carousel -->
                      <div class="col-12 col-md-6">
                        <h5 class="mb-2 text-center pb-3">
                          Digital Illustrations
                        </h5>
                        <div
                          id="illustrationsCarousel"
                          class="carousel slide"
                          data-bs-ride="carousel"
                        >
                          <div class="carousel-inner">
                            <div
                              v-for="(art, index) in illustrations"
                              :key="art.title"
                              class="carousel-item"
                              :class="{ active: index === 0 }"
                            >
                              <img
                                :src="art.image"
                                class="d-block w-100"
                                :alt="art.title"
                                style="height: 300px; object-fit: cover"
                              />
                              <div class="carousel-caption d-none d-md-block">
                                <h5>{{ art.title }}</h5>
                              </div>
                            </div>
                          </div>
                          <button
                            class="carousel-control-prev"
                            type="button"
                            data-bs-target="#illustrationsCarousel"
                            data-bs-slide="prev"
                          >
                            <span class="carousel-control-prev-icon"></span>
                          </button>
                          <button
                            class="carousel-control-next"
                            type="button"
                            data-bs-target="#illustrationsCarousel"
                            data-bs-slide="next"
                          >
                            <span class="carousel-control-next-icon"></span>
                          </button>
                        </div>
                      </div>

                      <!-- Digital Design Carousel -->
                      <div class="col-12 col-md-6">
                        <h5 class="mb-2 text-center pb-3">Digital Design</h5>
                        <div
                          id="designsCarousel"
                          class="carousel slide"
                          data-bs-ride="carousel"
                        >
                          <div class="carousel-inner">
                            <div
                              v-for="(art, index) in designs"
                              :key="art.title"
                              class="carousel-item"
                              :class="{ active: index === 0 }"
                            >
                              <img
                                :src="art.image"
                                class="d-block w-100"
                                :alt="art.title"
                                style="height: 300px; object-fit: cover"
                              />
                              <div class="carousel-caption d-none d-md-block">
                                <h5>{{ art.title }}</h5>
                              </div>
                            </div>
                          </div>
                          <button
                            class="carousel-control-prev"
                            type="button"
                            data-bs-target="#designsCarousel"
                            data-bs-slide="prev"
                          >
                            <span class="carousel-control-prev-icon"></span>
                          </button>
                          <button
                            class="carousel-control-next"
                            type="button"
                            data-bs-target="#designsCarousel"
                            data-bs-slide="next"
                          >
                            <span class="carousel-control-next-icon"></span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </template>
            </div>
          </div>
        </div>
      </div>
    </main>
  </section>
</template>

<style scoped>
.accordion {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.accordion-item {
  width: 100%;
}

.accordion-body {
  max-height: 70vh;
  overflow-y: auto;
}

.carousel {
  width: 100%;
}

.carousel-inner {
  width: 100%;
}

.carousel-item {
  width: 100%;
}

.carousel-item img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

@media (max-width: 768px) {
  .accordion-body {
    max-height: 60vh;
  }
  
  .carousel-item img {
    height: 250px;
  }
}
</style>
