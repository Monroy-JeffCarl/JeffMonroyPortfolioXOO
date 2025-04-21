<script>
import { Modal } from 'bootstrap';

const API_URL = import.meta.env.VITE_API_URL;

export default {
  data() {
    return {
      roles: [],
      permissions: [],
      selectedRole: null,
      selectedPermissions: [],
      modal: null,
      permissionOrder: [
        'view_note',
        'create_note',
        'update_note',
        'delete_note',
        'manage_users',
        'manage_roles'
      ]
    };
  },
  computed: {
    sortedPermissions() {
      return [...this.permissions].sort((a, b) => {
        const indexA = this.permissionOrder.indexOf(a.permission_title);
        const indexB = this.permissionOrder.indexOf(b.permission_title);
        return indexA - indexB;
      });
    }
  },
  async created() {
    await this.fetchRoles();
    await this.fetchPermissions();
  },
  methods: {
    async fetchRoles() {
      try {
        const response = await fetch(`${API_URL}/roles`);
        const data = await response.json();
        this.roles = data;
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    },
    async fetchPermissions() {
      try {
        const response = await fetch(`${API_URL}/roles/permissions`);
        const data = await response.json();
        this.permissions = data;
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    },
    getRoleDescription(roleTitle) {
      const descriptions = {
        'Admin': 'Full system access',
        'User': 'Limited access',
        'Guest': 'View only access'
      };
      return descriptions[roleTitle] || roleTitle;
    },
    formatPermissionTitle(permission) {
      const labels = {
        'create_note': 'Create Note',
        'view_note': 'View Note',
        'update_note': 'Edit Note',
        'delete_note': 'Delete Note',
        'manage_users': 'Manage Users',
        'manage_roles': 'Manage Roles'
      };
      return labels[permission] || permission.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    },
    async editRole(role) {
      this.selectedRole = role;
      try {
        const response = await fetch(`${API_URL}/roles/${role.id}/permissions`);
        const data = await response.json();
        this.selectedPermissions = data.map(p => p.id);
        this.modal = new Modal(this.$refs.editModal);
        this.modal.show();
      } catch (error) {
        console.error('Error fetching role permissions:', error);
      }
    },
    closeModal() {
      if (this.modal) {
        this.modal.hide();
        this.selectedRole = null;
        this.selectedPermissions = [];
      }
    },
    async savePermissions() {
      try {
        console.log('Saving permissions:', {
          roleId: this.selectedRole.id,
          permissions: this.selectedPermissions
        });
        
        const response = await fetch(`${API_URL}/roles/${this.selectedRole.id}/permissions`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            permissions: this.selectedPermissions
          })
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to update permissions');
        }

        const data = await response.json();
        console.log('Save response:', data);
        this.closeModal();
        await this.fetchRoles();
      } catch (error) {
        console.error('Error updating permissions:', {
          error: error.message,
          roleId: this.selectedRole?.id,
          permissions: this.selectedPermissions
        });
      }
    }
  }
};
</script>

<template>
  <div class="roles-container">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Roles</h2>
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
            <td>{{ role.role_title }}</td>
            <td>{{ getRoleDescription(role.role_title) }}</td>
            <td>
              <button class="btn btn-sm btn-primary" @click="editRole(role)">Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Edit Role Modal -->
    <div class="modal fade" id="editRoleModal" tabindex="-1" ref="editModal">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title">Edit Role: {{ selectedRole?.role_title }}</h5>
          </div>
          <div class="modal-body">
            <p class="mb-3"><strong>{{ selectedRole?.role_title }}</strong> can do the following:</p>
            <div class="permission-list">
              <div class="form-check mb-2" v-for="permission in sortedPermissions" :key="permission.id">
                <input 
                  class="form-check-input"
                  type="checkbox"
                  :id="'perm_' + permission.id"
                  v-model="selectedPermissions"
                  :value="permission.id"
                >
                <label class="form-check-label" :for="'perm_' + permission.id">
                  {{ formatPermissionTitle(permission.permission_title) }}
                </label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
            <button type="button" class="btn btn-primary" @click="savePermissions">Save</button>
          </div>
        </div>
      </div>
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

.modal-body {
  max-height: 70vh;
  overflow-y: auto;
}

.permission-list {
  padding: 0.5rem;
}

.form-check {
  padding: 0.75rem 1.75rem;
  margin-bottom: 0.5rem;
  border-radius: 0.25rem;
  background-color: #f8f9fa;
  transition: background-color 0.2s;
}

.form-check:hover {
  background-color: #e9ecef;
}

.form-check-input {
  margin-top: 0.25rem;
}

.form-check-label {
  font-size: 1rem;
  margin-left: 0.5rem;
}

/* Modal styling to match other modals */
.modal-content {
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.modal-header {
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  padding: 1rem 1.5rem;
}

.modal-footer {
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  padding: 1rem 1.5rem;
}

.btn-close-white {
  filter: brightness(0) invert(1);
}
</style> 