<script>
import axios from "axios";

const API_URL = "http://localhost:6408";

export default {
  data() {
    return {
      users: [],
      showAddUserModal: false,
      newUser: {
        nickname: "",
        role: "User"
      },
      errors: {
        nickname: false
      }
    };
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get(`${API_URL}/notes`);
        // Get unique nicknames from notes
        const uniqueNicknames = [...new Set(response.data.map(note => note.nickName))];
        
        // Create users array with unique nicknames
        this.users = uniqueNicknames.map((nickname, index) => ({
          id: index + 1,
          nickname: nickname,
          role: "User" // Default role
        }));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    openAddUserModal() {
      this.showAddUserModal = true;
    },
    closeAddUserModal() {
      this.showAddUserModal = false;
      this.newUser = {
        nickname: "",
        role: "User"
      };
      this.errors.nickname = false;
    },
    validateNickname() {
      this.errors.nickname = !this.newUser.nickname.trim();
      return !this.errors.nickname;
    },
    async addUser() {
      if (!this.validateNickname()) {
        return;
      }

      try {
        // Check if nickname already exists
        if (this.users.some(user => user.nickname.toLowerCase() === this.newUser.nickname.toLowerCase())) {
          alert("This nickname already exists!");
          return;
        }

        // Add the new user to the database
        await axios.post(`${API_URL}/users`, {
          nickname: this.newUser.nickname.trim(),
          role: this.newUser.role
        });

        // Refresh the users list
        await this.fetchUsers();
        this.closeAddUserModal();
      } catch (error) {
        console.error("Error adding user:", error);
        alert("Failed to add user. Please try again.");
      }
    }
  },
  mounted() {
    this.fetchUsers();
  }
};
</script>

<template>
  <div class="users-container">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Users</h2>
      <button class="btn btn-success" @click="openAddUserModal">Add Users</button>
    </div>
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-info">
          <tr>
            <th>ID</th>
            <th>Nickname</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.nickname }}</td>
            <td>{{ user.role }}</td>
            <td>
              <button class="btn btn-sm btn-primary me-2">Edit</button>
              <button class="btn btn-sm btn-danger">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add User Modal -->
    <div v-if="showAddUserModal" class="modal-container">
      <div class="modal-wrapper">
        <div class="modal-content">
          <div class="modal-header bg-dark text-light">
            <h5 class="modal-title">Add New User</h5>
            <button type="button" class="btn-close btn-close-white" @click="closeAddUserModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addUser">
              <div class="mb-3">
                <label for="nickname" class="form-label">Nickname</label>
                <input
                  type="text"
                  class="form-control"
                  id="nickname"
                  v-model.trim="newUser.nickname"
                  :class="{ 'is-invalid': errors.nickname }"
                  @blur="validateNickname"
                  required
                />
                <div class="invalid-feedback" v-if="errors.nickname">
                  Nickname cannot be empty
                </div>
              </div>
              <div class="mb-3">
                <label for="role" class="form-label">Role</label>
                <select class="form-select" id="role" v-model="newUser.role">
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                  <option value="Moderator">Moderator</option>
                </select>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeAddUserModal">Close</button>
            <button type="button" class="btn btn-success" @click="addUser">Add User</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.users-container {
  height: 100%;
  width: 100%;
}

.table {
  margin-bottom: 0;
  width: 100%;
}

.table-responsive {
  max-height: calc(100vh - 180px);
  overflow-y: auto;
  width: 100%;
  background: white;
}

/* Make header sticky */
thead {
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 1;
}

/* Ensure consistent column widths */
th, td {
  white-space: nowrap;
  padding: 12px 16px;
}

/* Distribute table columns evenly */
table {
  table-layout: fixed;
}

th:first-child, 
td:first-child {
  width: 80px;
}

th:last-child,
td:last-child {
  width: 150px;
}

th:not(:first-child):not(:last-child),
td:not(:first-child):not(:last-child) {
  width: auto;
}

/* Modal styles */
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-wrapper {
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 1.75rem auto;
  pointer-events: auto;
}

.modal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.3rem;
  outline: 0;
  pointer-events: auto;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  border-top-left-radius: calc(0.3rem - 1px);
  border-top-right-radius: calc(0.3rem - 1px);
}

.modal-body {
  position: relative;
  flex: 1 1 auto;
  padding: 1rem;
}

.modal-footer {
  display: flex;
  flex-wrap: wrap;
  flex-shrink: 0;
  align-items: center;
  justify-content: flex-end;
  padding: 0.75rem;
  border-top: 1px solid #dee2e6;
  border-bottom-right-radius: calc(0.3rem - 1px);
  border-bottom-left-radius: calc(0.3rem - 1px);
  gap: 0.5rem;
}

.btn-close {
  box-sizing: content-box;
  padding: 0.25em;
  color: #fff;
  border: 0;
  border-radius: 0.25rem;
  opacity: 0.75;
  background: transparent
    url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23fff'%3e%3cpath d='M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z'/%3e%3c/svg%3e")
    center/1em auto no-repeat;
}

.btn-close:hover {
  opacity: 1;
}

.modal-title {
  margin: 0;
  line-height: 1.5;
}

.form-label {
  margin-bottom: 0.5rem;
}

.form-control {
  display: block;
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus {
  color: #212529;
  background-color: #fff;
  border-color: #86b7fe;
  outline: 0;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

.is-invalid {
  border-color: #dc3545;
}

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: #dc3545;
}
</style> 