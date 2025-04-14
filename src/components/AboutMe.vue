<script setup>
import profileImage from "/assets/profile.png";

const downloadResume = () => {
  const link = document.createElement('a');
  link.href = '/Monroy_Resume.pdf';
  link.download = 'Monroy_Resume.pdf';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>

<template>
  <div class="d-flex align-items-center justify-content-between">
    <div class="about-text">
      <h1>
        <span class="text-dark">Hello, I am </span>
        <span class="text-info">Jeff</span>
        <span class="text-warning"> Carl</span>
      </h1>
      <p class="lead my-4">
        <span class="text-dark">
          <b>Jeff Carl Monroy</b> is a 4th-year IT student from PUP Taguig,
          an IT Intern in Xtreme Offshore Outsourcing Inc., and passionate
          digital artist. He specializes in illustration and graphic design,
          blending technology with creativity to bring ideas to life.
          Whether coding or creating digital art, Jeff is always exploring
          new ways to innovate.
        </span>
      </p>
      <h4 id="emailAddress">
        <a href="mailto:jeffcarlmmonroy@gmail.com" class="text-dark">
          jeffcarlmmonroy@gmail.com
        </a>
      </h4>
    </div>
    <img
      class="img-fluid d-block mx-auto"
      :src="profileImage"
      alt="Jeff Drawing"
      style="max-width: 40%"
    />
  </div>

  <div class="d-flex justify-content-center mt-5">   
    <a href="https://github.com/Monroy-JeffCarl" target="_blank" class="fw-bold btn btn-dark mx-2">
      GitHub
    </a>
    <a href="https://ph.linkedin.com/in/jeff-carl-monroy-b14a87152" target="_blank" class="fw-bold btn btn-primary mx-2">
      LinkedIn
    </a>
    <button @click="downloadResume" class="fw-bold btn btn-secondary mx-2">
      Resume
    </button>
  </div>
</template>

<style scoped>
#emailAddress a {
  transition: color 0.3s ease-in-out;
}

#emailAddress a:hover {
  color: #0dcaf0 !important;
}

.about-text {
  max-width: 60%;
}

@media (max-width: 768px) {
  .about-text {
    max-width: 100%;
  }
}
</style>
