<template>
  <header class="app-header">
    <div class="header-container">
      <!-- Logo et marque -->
      <router-link to="/" class="brand-link">
        <div class="logo-container">
          <div class="logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
          <span class="brand-text">Karya</span>
        </div>
      </router-link>

      <!-- Navigation principale -->
      <nav class="main-nav">
        <router-link to="/" class="nav-link">Accueil</router-link>
        <router-link to="/features" class="nav-link">Fonctionnalités</router-link>
        <router-link to="/pricing" class="nav-link">Tarifs</router-link>
        <router-link to="/gallery" class="nav-link">Galerie</router-link>
      </nav>

      <!-- Actions utilisateur -->
      <div class="user-actions">
        <template v-if="!authStore.isAuthenticated">
          <router-link to="/login" class="action-btn secondary">
            Se connecter
          </router-link>
          <router-link to="/register" class="action-btn primary">
            Créer un compte
          </router-link>
        </template>
        
        <template v-else>
          <router-link to="/dashboard" class="action-btn secondary">
            Dashboard
          </router-link>
          <button @click="logout" class="action-btn primary">
            Déconnexion
          </button>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

const logout = async () => {
  await authStore.logout()
}
</script>

<script lang="ts">
export default {
  name: 'AppHeader'
}
</script>

<style scoped>
/* Import du thème moderne */
@import url('../../assets/cyber-theme.css');

.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #4300FF 0%, #0065F8 50%, #00CAFF 100%);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
  padding: 1rem 0;
  box-shadow: 0 4px 20px rgba(67, 0, 255, 0.15);
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.brand-link {
  text-decoration: none;
  color: white;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.logo-icon svg {
  width: 1.5rem;
  height: 1.5rem;
  stroke: currentColor;
}

.brand-text {
  font-size: 1.5rem;
  font-weight: 800;
  color: white;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.main-nav {
  display: flex;
  gap: 2rem;
  flex: 1;
  justify-content: center;
}

.nav-link {
  text-decoration: none;
  color: white;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  opacity: 0.9;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: white;
  background: rgba(255, 255, 255, 0.2);
  opacity: 1;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(255, 255, 255, 0.1);
}

.user-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  font-size: 0.875rem;
}

.action-btn.primary {
  background: white;
  color: #4300FF;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.5);
  font-weight: 700;
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.4);
  background: #f8fafc;
  border-color: white;
  color: #4300FF;
}

.action-btn.secondary {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.action-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .main-nav {
    display: none;
  }
  
  .header-container {
    padding: 0 1rem;
  }
  
  .user-actions {
    gap: 0.5rem;
  }
  
  .action-btn {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
  }
}
</style>