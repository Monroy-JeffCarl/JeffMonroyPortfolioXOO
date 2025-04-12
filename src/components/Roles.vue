<script>
import axios from "axios";

export default {
  data() {
    return {
      roles: [
        { id: 1, name: "Admin", description: "Full system access" },
        { id: 2, name: "User", description: "Limited access" },
        { id: 3, name: "Guest", description: "View only access" }
      ]
    };
  }
};
</script>

<template>
  <div class="roles-container">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Roles</h2>
      <button class="btn btn-success">Add Role</button>
    </div>
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-info">
          <tr>
            <th>ID</th>
            <th>Role Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="role in roles" :key="role.id">
            <td>{{ role.id }}</td>
            <td>{{ role.name }}</td>
            <td>{{ role.description }}</td>
            <td>
              <button class="btn btn-sm btn-primary me-2">Edit</button>
              <button class="btn btn-sm btn-danger">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.roles-container {
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
</style> 