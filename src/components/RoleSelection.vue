<template>
  <div class="role-selection-container">
    <div class="card">
      <div class="card-body">
        <h2 class="card-title text-center mb-4">Select Your Role</h2>
        <div class="d-grid gap-3">
          <button 
            class="btn btn-warning btn-lg" 
            @click="selectRole('admin')"
          >
            Admin
          </button>
          <button 
            class="btn btn-info btn-lg" 
            @click="selectRole('user')"
          >
            User
          </button>
          <button 
            class="btn btn-secondary btn-lg" 
            @click="selectRole('guest')"
          >
            Guest
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const selectRole = (role) => {
  localStorage.setItem('selectedRole', role);
  router.push('/freedom-wall');
};
</script>

<style scoped>
.role-selection-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.card {
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.card-body {
  padding: 2rem;
}

.btn {
  padding: 1rem;
  font-weight: 500;
}

.btn:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}
</style> 