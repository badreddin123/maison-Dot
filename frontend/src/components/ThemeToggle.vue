<template>
  <button 
    @click="toggleTheme" 
    class="theme-toggle ultra-modern-btn ultra-modern-btn-primary"
    :title="isDark ? 'Mode clair' : 'Mode sombre'"
  >
    <svg v-if="isDark" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
    <svg v-else width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isDark = ref(false)

const toggleTheme = () => {
  isDark.value = !isDark.value
  const root = document.documentElement
  
  if (isDark.value) {
    root.setAttribute('data-theme', 'dark')
    localStorage.setItem('theme', 'dark')
  } else {
    root.removeAttribute('data-theme')
    localStorage.setItem('theme', 'light')
  }
}

onMounted(() => {
  // Charger le thème sauvegardé
  const savedTheme = localStorage.getItem('theme')
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    isDark.value = true
    document.documentElement.setAttribute('data-theme', 'dark')
  }
})
</script>

<style scoped>
.theme-toggle {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-elevated);
  transition: var(--transition-ultra-smooth);
}

.theme-toggle:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-neon);
}

@media (max-width: 768px) {
  .theme-toggle {
    width: 2.5rem;
    height: 2.5rem;
    top: 0.5rem;
    right: 0.5rem;
  }
  
  .theme-toggle svg {
    width: 16px;
    height: 16px;
  }
}
</style>
