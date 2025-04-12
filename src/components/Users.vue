<script>
import axios from "axios";

export default {
  data() {
    return {
      users: [
        { id: 1, firstName: "John", lastName: "John", role: "asdd", permissions: "asdd" },
        { id: 2, firstName: "asd", lastName: "cvbcvb", role: "cvbcvb", permissions: "cvbcvb" },
        { id: 3, firstName: "sdfsdf", lastName: "cvbcvb", role: "cvbcvb", permissions: "cvbcvb" },
        { id: 4, firstName: "sdfsdf", lastName: "fghfg", role: "fghfg", permissions: "fghfg" },
        { id: 5, firstName: "asdas", lastName: "fghfgh", role: "fghfgh", permissions: "fghfgh" },
        { id: 6, firstName: "asddf", lastName: "ssdfgfg", role: "ssdfgfg", permissions: "ssdfgfg" },
        { id: 7, firstName: "sdf", lastName: "cvbcb", role: "cvbcb", permissions: "cvbcb" },
        { id: 8, firstName: "sdfs", lastName: "cvbcvb", role: "cvbcvb", permissions: "cvbcvb" }
      ]
    };
  }
};
</script>

<template>
  <div class="users-container">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Users</h2>
      <button class="btn btn-success">Add Users</button>
    </div>
    <div class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-info">
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Role</th>
            <th>Permissions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.firstName }}</td>
            <td>{{ user.lastName }}</td>
            <td>{{ user.role }}</td>
            <td>{{ user.permissions }}</td>
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
</style> 