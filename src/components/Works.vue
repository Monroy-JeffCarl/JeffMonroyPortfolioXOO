<script>
import { Modal } from "bootstrap";
import { ref, onMounted } from "vue";
import NavBarComponent from "./NavBar.vue";
import projImg1 from "/assets/it-proj01.png";
import projImg2 from "/assets/it-proj02.png";
import projImg3 from "/assets/it-proj03.png";

export default {
  components: {
    NavBarComponent,
  },
  setup() {
    const projects = ref([
      {
        title: "Likha",
        image: projImg1,
        description: "Lorem Ipsum",
        contributors: "Ayacocho, Castro, Monroy, Pascual, Valerio, Villaruel",
      },
      {
        title: "Dreaming",
        image: projImg2,
        description: "Lorem Ipsum",
        contributors: "Ayacocho, Castro, Cruz, Monroy, Pascual, Valerio",
      },
      {
        title: "KAJAS",
        image: projImg3,
        description: "Lorem Ipsum",
        contributors: "Ayacocho, Castro, Monroy, Pascual, Valerio",
      },
    ]);

    const selectedProject = ref({});
    const detailsModal = ref(null);
    let modalInstance = null;

    onMounted(() => {
      modalInstance = new Modal(detailsModal.value);
    });

    const openModal = (project) => {
      selectedProject.value = project;
      modalInstance.show();
    };

    return { projects, selectedProject, detailsModal, openModal };
  },
};
</script>

<template>
  <NavBarComponent />
  <section id="it-projects">
    <div class="container d-flex flex-column justify-content-center">
      <h3 class="text-center mb-4">IT Projects</h3>

      <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 justify-content-center">
        <div
          v-for="(project, index) in projects"
          :key="index"
          class="col d-flex justify-content-center"
        >
          <div class="card small-card mb-4 m-0">
            <div class="card-body text-center mb-2">
              <img
                :src="project.image"
                class="card-img-top"
                :alt="project.title"
              />
              <h4 class="card-title text-dark pt-2">{{ project.title }}</h4>
              <button class="btn btn-warning" @click="openModal(project)">
                Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <div
    class="modal fade"
    ref="detailsModal"
    tabindex="-1"
    aria-labelledby="detailsModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="detailsModalLabel">
            {{ selectedProject.title }}
          </h5>
        </div>
        <div class="modal-body d-flex">
          <img
            :src="selectedProject.image"
            alt="Artwork"
            class="img-fluid me-3"
            style="width: 150px; height: auto"
          />
          <div>
            <p>{{ selectedProject.description }}</p>
            <p>
              <strong>Contributors: </strong>
              <em>{{ selectedProject.contributors }}</em>
            </p>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-warning" data-bs-dismiss="modal">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.small-card {
  width: 18rem;
}

#it-projects {
  padding: 2rem 0;
}
</style>
