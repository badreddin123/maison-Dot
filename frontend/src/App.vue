<template>
  <div id="app" class="app-container">
    <!-- Navigation Header -->
    <AppHeader v-if="!isAuthPage" />
    
    <!-- Main Content -->
    <main class="main-content" :class="mainContentClass">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <!-- Footer -->
    <AppFooter v-if="!isAuthPage" />
    
    <!-- Loading Overlay -->
    <transition name="fade">
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-content">
          <div class="spinner"></div>
          <span>Chargement...</span>
        </div>
      </div>
    </transition>
    
    <!-- Debug Panel (développement uniquement) -->
    <DebugPanel />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from './stores/auth'
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import DebugPanel from './components/DebugPanel.vue'

const route = useRoute()
const authStore = useAuthStore()

// Computed properties
const isAuthPage = computed(() => {
  return ['login', 'register'].includes(route.name as string)
})

const mainContentClass = computed(() => {
  if (isAuthPage.value) {
    return 'full-height'
  }
  return 'with-header-footer'
})

const isLoading = computed(() => authStore.isLoading)

// Initialize app
onMounted(() => {
  // Check if user is already authenticated
  authStore.checkAuth()
})
</script>

<style scoped>
/* Import du thème moderne */
@import url('./assets/cyber-theme.css');

.app-container {
  min-height: 100vh;
  background: var(--bg-gradient-main);
}

.main-content {
  transition: all 0.3s ease-in-out;
}

.full-height {
  min-height: 100vh;
}

.with-header-footer {
  padding-top: 4rem;
  padding-bottom: 5rem;
}

/* Page transitions */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s ease-in-out;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Loading overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  background: var(--card-bg);
  border-radius: var(--border-radius-medium);
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: var(--shadow-card);
  border: 1px solid var(--card-border);
  color: var(--text-primary);
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid var(--bg-gray-100);
  border-top: 3px solid var(--electric-blue);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Custom scrollbar */
:deep(::-webkit-scrollbar) {
  width: 8px;
}

:deep(::-webkit-scrollbar-track) {
  background: #f1f1f1;
  border-radius: 4px;
}

:deep(::-webkit-scrollbar-thumb) {
  background: #c1c1c1;
  border-radius: 4px;
}

:deep(::-webkit-scrollbar-thumb:hover) {
  background: #a8a8a8;
}
</style>