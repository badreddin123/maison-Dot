<template>
  <div class="toast-container">
    <ToastNotification
      v-for="toast in toasts"
      :key="toast.id"
      :show="toast.show"
      :type="toast.type"
      :title="toast.title"
      :message="toast.message"
      :duration="toast.duration"
      :autoClose="toast.autoClose"
      @close="remove(toast.id)"
    />
  </div>
</template>

<script setup lang="ts">
import { useToast } from '../composables/useToast'
import ToastNotification from './ToastNotification.vue'

const { toasts, remove } = useToast()
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 10000;
  pointer-events: none;
}

.toast-container > * {
  pointer-events: auto;
  margin-bottom: 0.5rem;
}

@media (max-width: 640px) {
  .toast-container {
    top: 0;
    left: 0;
    right: 0;
  }
}
</style>
