<template>
  <Transition name="toast" appear>
    <div 
      v-if="show"
      class="toast-notification"
      :class="[type, { 'toast-closing': isClosing }]"
    >
      <div class="toast-icon">
        <svg v-if="type === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <svg v-else-if="type === 'error'" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        <svg v-else-if="type === 'warning'" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 16v-4M12 8h.01"/>
        </svg>
      </div>
      
      <div class="toast-content">
        <div class="toast-title">{{ title }}</div>
        <div v-if="message" class="toast-message">{{ message }}</div>
      </div>
      
      <button 
        @click="close"
        class="toast-close"
        aria-label="Fermer la notification"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Props
const props = defineProps<{
  show: boolean
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  autoClose?: boolean
}>()

// Emits
const emit = defineEmits<{
  close: []
}>()

// État local
const isClosing = ref(false)
let autoCloseTimer: NodeJS.Timeout | null = null

// Méthodes
const close = () => {
  isClosing.value = true
  setTimeout(() => {
    emit('close')
  }, 300) // Temps de l'animation de fermeture
}

const setupAutoClose = () => {
  if (props.autoClose !== false && props.duration) {
    autoCloseTimer = setTimeout(() => {
      close()
    }, props.duration)
  }
}

const clearAutoClose = () => {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer)
    autoCloseTimer = null
  }
}

// Lifecycle
onMounted(() => {
  if (props.show) {
    setupAutoClose()
  }
})

onUnmounted(() => {
  clearAutoClose()
})
</script>

<style scoped>
@import url('../assets/cyber-theme.css');

.toast-notification {
  position: fixed;
  top: 2rem;
  right: 2rem;
  z-index: 9999;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  min-width: 320px;
  max-width: 500px;
  padding: 1rem 1.25rem;
  background: var(--glass-bg-medium);
  backdrop-filter: blur(30px);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-large);
  box-shadow: var(--shadow-cyber);
  overflow: hidden;
  position: relative;
}

.toast-notification::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--accent-color);
}

.toast-notification.success {
  --accent-color: var(--acid-green);
}

.toast-notification.success::before {
  background: var(--acid-green);
  box-shadow: 0 0 10px var(--acid-green);
}

.toast-notification.error {
  --accent-color: var(--laser-red);
}

.toast-notification.error::before {
  background: var(--laser-red);
  box-shadow: 0 0 10px var(--laser-red);
}

.toast-notification.warning {
  --accent-color: var(--solar-orange);
}

.toast-notification.warning::before {
  background: var(--solar-orange);
  box-shadow: 0 0 10px var(--solar-orange);
}

.toast-notification.info {
  --accent-color: var(--electric-blue);
}

.toast-notification.info::before {
  background: var(--electric-blue);
  box-shadow: 0 0 10px var(--electric-blue);
}

.toast-icon {
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
  color: var(--accent-color);
  margin-top: 0.125rem;
}

.toast-icon svg {
  width: 100%;
  height: 100%;
  stroke: currentColor;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
  line-height: 1.4;
}

.toast-message {
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.4;
  word-wrap: break-word;
}

.toast-close {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  padding: 0;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  border-radius: var(--border-radius-small);
  transition: var(--transition-smooth);
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-close:hover {
  color: var(--text-primary);
  background: var(--glass-bg-light);
}

.toast-close svg {
  width: 0.875rem;
  height: 0.875rem;
  stroke: currentColor;
}

/* Animations */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.toast-enter-to {
  opacity: 1;
  transform: translateX(0) scale(1);
}

.toast-leave-from {
  opacity: 1;
  transform: translateX(0) scale(1);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.toast-closing {
  animation: toast-slide-out 0.3s ease forwards;
}

@keyframes toast-slide-out {
  from {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateX(100%) scale(0.95);
  }
}

/* Responsive */
@media (max-width: 640px) {
  .toast-notification {
    top: 1rem;
    right: 1rem;
    left: 1rem;
    min-width: auto;
    max-width: none;
  }
  
  .toast-enter-from,
  .toast-leave-to {
    transform: translateY(-100%) scale(0.95);
  }
  
  .toast-enter-to,
  .toast-leave-from {
    transform: translateY(0) scale(1);
  }
}

/* Interactions au survol */
.toast-notification:hover::before {
  width: 6px;
  transition: width 0.2s ease;
}

.toast-notification:hover {
  transform: translateX(-2px);
  box-shadow: var(--shadow-cyber), 0 0 30px rgba(var(--accent-color-rgb), 0.3);
  transition: all 0.2s ease;
}

/* États de luminosité selon le thème */
@media (prefers-color-scheme: light) {
  .toast-notification {
    background: rgba(255, 255, 255, 0.95);
    border-color: rgba(0, 0, 0, 0.1);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }
}

/* Variante compacte pour les notifications multiples */
.toast-notification.compact {
  min-width: 280px;
  padding: 0.75rem 1rem;
}

.toast-notification.compact .toast-title {
  font-size: 0.8rem;
}

.toast-notification.compact .toast-message {
  font-size: 0.75rem;
}

.toast-notification.compact .toast-icon {
  width: 1.25rem;
  height: 1.25rem;
}
</style>
