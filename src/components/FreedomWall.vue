<script>
import { Modal, Dropdown } from "bootstrap";
import axios from "axios";
import NavBarComponent from "./NavBar.vue";
import UsersComponent from "./Users.vue";
import RolesComponent from "./Roles.vue";

const API_URL = "http://localhost:6408";

export default {
  components: { NavBarComponent, UsersComponent, RolesComponent },
  data() {
    return {
      currentView: "notes",
      notes: [],
      nickName: "",
      note: "",
      noteColor: "#f8f9fa",
      editingIndex: -1,
      modalTitle: "Create a ",
      saveButtonText: "Create Note",
      colors: [
        "#f8f9fa",
        "#e8f5e9",
        "#fff3e0",
        "#fce4ec",
        "#e1f5fe",
        "#ede7f6",
        "#fffde7",
        "#8ACE00",
      ],
      showNoteModal: false,
      showDeleteModal: false,
      showSuccessModal: false,
      noteToDelete: { id: null, index: null },
      successMessage: "",
      errors: {
        nickName: false,
        note: false,
      },
      sidebarOpen: false,
      availableNicknames: [],
    };
  },
  computed: {
    isFormInvalid() {
      return !this.nickName.trim() || !this.note.trim();
    },
  },
  mounted() {
    this.fetchNotes();
    this.fetchNicknames();

    this.$nextTick(() => {
      document.querySelectorAll(".dropdown-toggle").forEach((el) => {
        new Dropdown(el);
      });
    });

    document.addEventListener("click", this.handleClickOutside);
  },
  watch: {
    currentView(newView) {
      if (newView === 'notes') {
        this.fetchNicknames();
      }
    }
  },
  methods: {
    setView(view) {
      this.currentView = view;
      this.sidebarOpen = false;
    },
    async fetchNotes() {
      try {
        const response = await axios.get(`${API_URL}/notes`);
        this.notes = response.data.map((note) => ({
          ...note,
          formattedDate:
            new Date(note.createdAt).toLocaleDateString() +
            " " +
            new Date(note.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
        }));
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    },
    async fetchNicknames() {
      try {
        const response = await axios.get(`${API_URL}/users`);
        this.availableNicknames = response.data.map(user => user.nickname);
      } catch (error) {
        console.error("Error fetching nicknames:", error);
      }
    },
    selectColor(color) {
      this.noteColor = color;
    },
    async saveNote() {
      // Validate both fields before saving
      const isNicknameValid = this.validateNickName();
      const isNoteValid = this.validateNote();

      if (!isNicknameValid || !isNoteValid) {
        return;
      }

      try {
        const newNote = {
          nickName: this.nickName.trim(),
          note: this.note.trim(),
          noteColor: this.noteColor,
        };

        if (this.editingIndex !== -1) {
          await axios.put(
            `${API_URL}/notes/${this.notes[this.editingIndex].id}`,
            newNote
          );
          this.notes[this.editingIndex] = {
            ...this.notes[this.editingIndex],
            ...newNote,
          };
          this.editingIndex = -1;
          this.modalTitle = "Create a ";
          this.saveButtonText = "Create Note";
          this.successMessage = "Note updated successfully!";
          this.showSuccessModal = true;
        } else {
          const response = await axios.post(`${API_URL}/notes`, newNote);
          this.notes.push(response.data);
        }

        this.closeModal();
        this.resetForm();
        setTimeout(() => this.fetchNotes(), 300);
      } catch (error) {
        console.error("Error saving note:", error);
      }
    },
    editNote(index) {
      const note = this.notes[index];
      this.nickName = note.nickName;
      this.note = note.note;
      this.noteColor = note.noteColor;
      this.editingIndex = index;
      this.modalTitle = "Edit ";
      this.saveButtonText = "Update Note";
      this.showNoteModal = true;
    },
    validateNickName() {
      this.errors.nickName = !this.nickName.trim();
      return !this.errors.nickName;
    },
    validateNote() {
      this.errors.note = !this.note.trim();
      return !this.errors.note;
    },
    showDeleteModal(index, id) {
      this.noteToDelete = { index, id };
      this.showDeleteModal = true;
    },
    async confirmDelete() {
      try {
        await axios.delete(`${API_URL}/notes/${this.noteToDelete.id}`);
        this.notes.splice(this.noteToDelete.index, 1);
        this.showDeleteModal = false;
        this.successMessage = "Note deleted successfully!";
        this.showSuccessModal = true;
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    },
    closeModal() {
      this.showNoteModal = false;
      this.showDeleteModal = false;
      this.showSuccessModal = false;
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    },
    resetForm() {
      this.nickName = "";
      this.note = "";
      this.noteColor = "#f8f9fa";
      this.editingIndex = -1;
    },
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    handleClickOutside(event) {
      const sidebar = document.getElementById("sidebar");
      const toggleBtn = document.querySelector(".sidebar-toggle");
      if (
        this.sidebarOpen &&
        !sidebar.contains(event.target) &&
        !toggleBtn.contains(event.target)
      ) {
        this.sidebarOpen = false;
      }
    },
  },
  beforeUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  },
};
</script>

<template>
  <div class="app-container">
    <NavBarComponent class="navbar-fixed" />

    <div class="main-container">
      <!-- Sidebar Toggle Button -->
      <button
        class="btn sidebar-toggle d-lg-none"
        type="button"
        @click="toggleSidebar"
        :class="{ active: sidebarOpen }"
      >
        <i class="fas fa-bars"></i>
      </button>

      <!-- Sidebar -->
      <div
        class="sidebar mx-3"
        id="sidebar"
        :class="{ show: sidebarOpen, 'd-none d-lg-block': !sidebarOpen }"
      >
        <div class="list-group list-group-flush">
          <button
            class="list-group-item list-group-item-action bg-light"
            :class="{ active: currentView === 'users' }"
            @click="setView('users')"
            data-view="users"
          >
            Users
          </button>
          <button
            class="list-group-item list-group-item-action bg-light"
            :class="{ active: currentView === 'roles' }"
            @click="setView('roles')"
            data-view="roles"
          >
            Roles
          </button>
          <button
            class="list-group-item list-group-item-action bg-light"
            :class="{ active: currentView === 'notes' }"
            @click="setView('notes')"
            data-view="notes"
          >
            Notes
          </button>
        </div>
      </div>

      <!-- Content Area -->
      <div class="content-area">
        <!-- Users View -->
        <div v-if="currentView === 'users'" class="content-wrapper">
          <UsersComponent />
        </div>

        <!-- Roles View -->
        <div v-if="currentView === 'roles'" class="content-wrapper">
          <RolesComponent />
        </div>

        <!-- Notes View -->
        <div v-if="currentView === 'notes'" class="content-wrapper">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>Freedom Wall</h2>
            <button
              type="button"
              class="btn btn-info"
              @click="showNoteModal = true"
            >
              Create a Note
            </button>
          </div>

          <div class="notes-container">
            <div class="notes-grid">
              <div
                v-if="notes.length > 0"
                v-for="(note, index) in notes"
                :key="index"
                class="card"
                :style="{
                  backgroundColor: note.noteColor,
                }"
              >
                <div class="card-body">
                  <h6 class="card-title">From: {{ note.nickName }}</h6>
                  <p class="card-text">{{ note.note }}</p>
                  <small class="text-muted">{{ note.formattedDate }}</small>
                </div>
                <div class="position-absolute top-0 end-0 m-2">
                  <div class="dropdown">
                    <button
                      class="btn btn-sm"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i class="fas fa-ellipsis-v"></i>
                    </button>
                    <ul class="dropdown-menu">
                      <li>
                        <a
                          class="dropdown-item"
                          href="#"
                          @click.prevent="editNote(index)"
                          >Edit</a
                        >
                      </li>
                      <li>
                        <a
                          class="dropdown-item"
                          href="#"
                          @click.prevent="showDeleteModal(index, note.id)"
                          >Delete</a
                        >
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <p v-else>No notes available.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Container with Backdrop -->
    <div
      v-if="showNoteModal || showDeleteModal || showSuccessModal"
      class="modal-container"
    >
      <!-- Note Modal -->
      <div v-if="showNoteModal" class="modal-wrapper">
        <div class="modal-content">
          <div class="modal-header bg-dark text-light">
            <h5 class="modal-title">
              {{ modalTitle }} <span class="text-warning">Note</span>
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveNote">
              <div class="mb-3">
                <label for="nickName" class="form-label">Nickname</label>
                <select 
                  class="form-select" 
                  id="nickName" 
                  v-model="nickName"
                  :class="{ 'is-invalid': errors.nickName }"
                  @change="validateNickName"
                >
                  <option value="">Select a nickname</option>
                  <option v-for="nick in availableNicknames" :key="nick" :value="nick">
                    {{ nick }}
                  </option>
                </select>
                <div class="invalid-feedback" v-if="errors.nickName">
                  Please select a nickname
                </div>
              </div>

              <div class="mb-3">
                <label for="noteText" class="form-label"
                  >Your Note (Max 200 characters)</label
                >
                <textarea
                  class="form-control"
                  id="noteText"
                  v-model.trim="note"
                  rows="4"
                  maxlength="200"
                  @blur="validateNote"
                  @input="validateNote"
                  :class="{ 'is-invalid': errors.note }"
                  required
                ></textarea>
                <div v-if="errors.note" class="invalid-feedback d-block">
                  Note cannot be empty.
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Note Color</label>
                <div class="d-flex flex-wrap">
                  <button
                    v-for="color in colors"
                    :key="color"
                    type="button"
                    class="btn m-1 color-option"
                    :style="{
                      backgroundColor: color,
                      width: '30px',
                      height: '30px',
                      border: '1px solid #ddd',
                      boxShadow:
                        noteColor === color ? '0 0 0 2px #007bff' : 'none',
                    }"
                    @click="selectColor(color)"
                  ></button>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Close
            </button>
            <button
              type="button"
              class="btn btn-warning"
              @click="saveNote"
              :disabled="isFormInvalid"
            >
              {{ saveButtonText }}
            </button>
          </div>
        </div>
      </div>

      <!-- Delete Modal -->
      <div v-if="showDeleteModal" class="modal-wrapper">
        <div class="modal-content">
          <div class="modal-header bg-dark text-light">
            <h5 class="modal-title">
              Confirm <span class="text-danger">Deletion</span>
            </h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body">
            Are you sure you want to delete this note?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Cancel
            </button>
            <button type="button" class="btn btn-danger" @click="confirmDelete">
              Delete
            </button>
          </div>
        </div>
      </div>

      <!-- Success Modal -->
      <div v-if="showSuccessModal" class="modal-wrapper">
        <div class="modal-content">
          <div class="modal-header bg-success text-light">
            <h5 class="modal-title">Success</h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body">
            {{ successMessage }}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  width: 100%;
}

.navbar-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1030;
}

.main-container {
  display: flex;
  height: calc(100vh - 56px);
  margin-top: 56px;
  width: 100%;
  overflow: hidden;
}

.sidebar-toggle {
  position: fixed;
  top: 70px;
  left: 10px;
  z-index: 1020;
  width: 40px;
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #212529;
  border-radius: 4px;
  border: none;
  color: white;
}

.sidebar-toggle:hover {
  background-color: #343a40;
}

.sidebar {
  width: 200px;
  min-width: 200px;
  position: sticky;
  top: 56px;
  height: fit-content;
  background: white;
  transition: transform 0.3s ease;
}

.list-group {
  border-radius: 0;
  background: white;
}

.list-group-item {
  border: none;
  padding: 12px 20px;
  background: transparent;
  transition: all 0.2s ease;
  margin-bottom: 2px;
}

.list-group-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.list-group-item.active {
  background-color: #ffd700 !important;
  color: #000 !important;
  border: none;
}

.content-area {
  flex: 1;
  width: calc(100% - 200px);
  margin-left: 0;
  overflow: hidden;
}

.content-wrapper {
  padding: 24px;
  height: 100%;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.notes-container {
  flex: 1;
  overflow: auto;
  margin-top: 1rem;
}

.notes-grid {
  column-count: 3;
  column-gap: 1rem;
  padding: 0 1rem;
  width: 100%;
}

.card {
  break-inside: avoid;
  page-break-inside: avoid;
  margin-bottom: 1rem;
  width: 100%;
  display: inline-block;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;
  padding: 0.75rem;
}

.card .card-body {
  padding: 0 !important;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card .card-title {
  margin-bottom: 0.5rem;
  text-align: left;
  font-size: 0.9rem;
  color: #666;
}

.card .card-text {
  margin: 0;
  text-align: center;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}

.card p.card-text {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.card .text-muted {
  font-size: 0.75rem;
  margin: 0.25rem 0 0 0;
  padding: 0;
  line-height: 1;
}

/* Table styles for Users and Roles views */
.table-container {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
}

/* Responsive breakpoints */
@media (max-width: 1199px) {
  .notes-grid {
    column-count: 2;
  }
}

@media (max-width: 991px) {
  .content-area {
    width: 100%;
    margin-left: 0;
  }

  .notes-container {
    height: calc(100vh - 200px);
  }
}

@media (max-width: 767px) {
  .content-wrapper {
    padding: 16px;
  }

  .notes-grid {
    column-count: 1;
  }
}

/* Ensure modals appear above everything */
.modal {
  z-index: 1050;
}

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

@media (max-width: 576px) {
  .modal-wrapper {
    margin: 0.5rem;
  }
}
</style>
