<template>
  <div class="cyber-dashboard">
    <!-- Arrière-plan cyber animé -->
    <div class="dashboard-bg">
      <!-- Circuit board pattern -->
      <div class="circuit-pattern">
        <svg class="circuit-svg" viewBox="0 0 1920 1080">
          <defs>
            <pattern id="circuitPattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <path d="M50 50h100v100h-100z" stroke="var(--electric-blue)" stroke-width="1" fill="none" opacity="0.1"/>
              <circle cx="50" cy="50" r="3" fill="var(--electric-blue)" opacity="0.3"/>
              <circle cx="150" cy="50" r="3" fill="var(--neon-pink)" opacity="0.3"/>
              <circle cx="50" cy="150" r="3" fill="var(--acid-green)" opacity="0.3"/>
              <circle cx="150" cy="150" r="3" fill="var(--cyber-purple)" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuitPattern)"/>
        </svg>
      </div>
      
      <!-- Particules de données flottantes -->
      <div class="data-particles">
        <div v-for="i in 30" :key="i" class="data-particle" :style="getDataParticleStyle()">
          {{ getRandomDataSymbol() }}
        </div>
          </div>
        </div>
        
    <!-- Header cyber -->
    <header class="cyber-header">
      <div class="header-container">
        <div class="header-left">
          <router-link to="/" class="cyber-brand">
            <div class="brand-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
            <span class="brand-text">HomeDesign Pro</span>
          </router-link>
          
          <div class="project-selector">
            <select v-model="selectedProject" class="cyber-select">
              <option value="">Sélectionner un projet</option>
              <option v-for="project in projects" :key="project.id" :value="project.id">
                {{ project.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="header-right">
          <!-- Notifications -->
          <button class="cyber-icon-btn" @click="showNotifications = !showNotifications">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                </svg>
            <span class="notification-badge">3</span>
            </button>

          <!-- Profil utilisateur -->
          <div class="user-profile" @click="showUserMenu = !showUserMenu">
            <div class="avatar">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face" alt="Avatar" />
          </div>
            <div class="user-info">
              <span class="user-name">{{ authStore.user?.name || 'Utilisateur' }}</span>
              <span class="user-status">Designer Pro</span>
            </div>
            <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
        </div>
      </div>
    </header>

    <!-- Contenu principal -->
    <main class="dashboard-main">
      <!-- Sidebar cyber -->
      <aside class="cyber-sidebar">
        <nav class="sidebar-nav">
          <div class="nav-section">
            <h3 class="nav-title">Navigation</h3>
            <ul class="nav-list">
              <li class="nav-item">
                <a href="#" class="nav-link active">
                  <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 21l4-4 4 4"/>
                  </svg>
                  <span>Tableau de bord</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link">
                  <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                  <span>Mes Projets</span>
                  <span class="nav-badge">{{ projects.length }}</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link">
                  <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                  </svg>
                  <span>IA Générative</span>
                  <span class="nav-badge new">Nouveau</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link">
                  <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                  <span>Collaboration</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link">
                  <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                  <span>Analyses</span>
                </a>
              </li>
            </ul>
          </div>

          <div class="nav-section">
            <h3 class="nav-title">Bibliothèque</h3>
            <ul class="nav-list">
              <li class="nav-item">
                <a href="#" class="nav-link">
                  <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                  </svg>
                  <span>Modèles 3D</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link">
                  <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <span>Textures</span>
                </a>
              </li>
              <li class="nav-item">
                <a href="#" class="nav-link">
                  <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17v4a2 2 0 002 2h4M13 13h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4a2 2 0 012-2z"/>
                  </svg>
                  <span>Matériaux</span>
                </a>
              </li>
            </ul>
          </div>
        </nav>

        <!-- Quota d'utilisation -->
        <div class="usage-quota">
          <div class="quota-header">
            <h4>Utilisation IA</h4>
            <span class="quota-percentage">{{ usagePercentage }}%</span>
          </div>
          <div class="quota-bar">
            <div class="quota-fill" :style="{ width: usagePercentage + '%' }"></div>
          </div>
          <p class="quota-text">{{ usedCredits }}/{{ totalCredits }} crédits utilisés ce mois</p>
          <button class="upgrade-btn">Upgrader le plan</button>
        </div>
      </aside>

      <!-- Zone de contenu principale -->
      <div class="content-area">
        <!-- Métriques en temps réel -->
        <section class="metrics-section">
          <h2 class="section-title">Tableau de bord en temps réel</h2>
          <div class="metrics-grid">
            <div class="metric-card" v-for="metric in dashboardMetrics" :key="metric.id">
              <div class="metric-header">
                <div class="metric-icon" :style="{ background: metric.color }">
                  <component :is="metric.icon" />
                </div>
                <div class="metric-trend" :class="metric.trend > 0 ? 'positive' : 'negative'">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path v-if="metric.trend > 0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17l9.2-9.2M17 8v9h-9"/>
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 7l-9.2 9.2M8 16V7h9"/>
                  </svg>
                  <span>{{ Math.abs(metric.trend) }}%</span>
                </div>
              </div>
              <div class="metric-content">
                <h3 class="metric-value">{{ metric.value }}</h3>
                <p class="metric-label">{{ metric.label }}</p>
              </div>
              <div class="metric-chart">
                <div class="mini-chart" :style="{ background: `linear-gradient(90deg, ${metric.color}22, ${metric.color}88)` }"></div>
              </div>
            </div>
          </div>
        </section>

          <!-- Projets récents -->
          <section class="projects-section">
            <div class="section-header">
            <h2 class="section-title">Projets récents</h2>
            <button class="cyber-btn-secondary">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
              Nouveau projet
              </button>
            </div>

            <div class="projects-grid">
            <div class="project-card" v-for="project in recentProjects" :key="project.id">
              <div class="project-preview">
                <img :src="project.thumbnail" :alt="project.name" />
                <div class="project-overlay">
                  <button class="project-action">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>
                  <button class="project-action">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="project-info">
                <h3 class="project-name">{{ project.name }}</h3>
                <p class="project-description">{{ project.description }}</p>
                <div class="project-meta">
                  <span class="project-date">{{ formatDate(project.updatedAt) }}</span>
                  <div class="project-status" :class="project.status">{{ project.status }}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

            <!-- Activité récente -->
            <section class="activity-section">
          <h2 class="section-title">Activité récente</h2>
          <div class="activity-timeline">
            <div class="activity-item" v-for="activity in recentActivity" :key="activity.id">
              <div class="activity-avatar">
                <img :src="activity.user.avatar" :alt="activity.user.name" />
              </div>
                  <div class="activity-content">
                <div class="activity-header">
                  <span class="activity-user">{{ activity.user.name }}</span>
                  <span class="activity-action">{{ activity.action }}</span>
                  <span class="activity-target">{{ activity.target }}</span>
                  </div>
                <p class="activity-description">{{ activity.description }}</p>
                <span class="activity-time">{{ formatTime(activity.timestamp) }}</span>
                </div>
              <div class="activity-icon" :style="{ background: activity.iconColor }">
                <component :is="activity.icon" />
              </div>
                </div>
              </div>
            </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

// État réactif
const selectedProject = ref('')
const showNotifications = ref(false)
const showUserMenu = ref(false)

// Données du dashboard
const projects = reactive([
  { id: 1, name: 'Villa Moderne - Côte d\'Azur' },
  { id: 2, name: 'Loft Industriel - Paris' },
  { id: 3, name: 'Maison Écologique - Normandie' }
])

const usagePercentage = ref(67)
const usedCredits = ref(670)
const totalCredits = ref(1000)

const dashboardMetrics = reactive([
  {
    id: 1,
    label: 'Projets actifs',
    value: '12',
    trend: 15,
    color: 'var(--electric-blue)',
    icon: 'ProjectIcon'
  },
  {
    id: 2,
    label: 'Rendus générés',
    value: '284',
    trend: 23,
    color: 'var(--acid-green)',
    icon: 'RenderIcon'
  },
  {
    id: 3,
    label: 'Collaborateurs',
    value: '8',
    trend: 12,
    color: 'var(--neon-pink)',
    icon: 'TeamIcon'
  },
  {
    id: 4,
    label: 'Stockage utilisé',
    value: '45.2 GB',
    trend: -8,
    color: 'var(--cyber-purple)',
    icon: 'StorageIcon'
  }
])

const recentProjects = reactive([
  {
    id: 1,
    name: 'Villa Futuriste',
    description: 'Conception d\'une villa ultra-moderne avec domotique intégrée',
    thumbnail: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&h=200&fit=crop',
    status: 'active',
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 2,
    name: 'Loft Artistique',
    description: 'Rénovation d\'un ancien atelier en loft d\'artiste',
    thumbnail: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300&h=200&fit=crop',
    status: 'review',
    updatedAt: new Date('2024-01-14')
  },
  {
    id: 3,
    name: 'Maison Passive',
    description: 'Conception d\'une maison passive certifiée',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&h=200&fit=crop',
    status: 'completed',
    updatedAt: new Date('2024-01-12')
  }
])

const recentActivity = reactive([
  {
    id: 1,
    user: { name: 'Sophie Martin', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b332b6f2?w=40&h=40&fit=crop&crop=face' },
    action: 'a commenté',
    target: 'Villa Futuriste',
    description: 'Excellent travail sur les matériaux de façade !',
    timestamp: new Date('2024-01-15T14:30:00'),
    icon: 'CommentIcon',
    iconColor: 'var(--electric-blue)'
  },
  {
    id: 2,
    user: { name: 'Marc Dubois', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face' },
    action: 'a terminé',
    target: 'Rendu 3D cuisine',
    description: 'Le rendu photoréaliste de la cuisine est maintenant disponible',
    timestamp: new Date('2024-01-15T13:15:00'),
    icon: 'CheckIcon',
    iconColor: 'var(--acid-green)'
  },
  {
    id: 3,
    user: { name: 'Emma Rodriguez', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face' },
    action: 'a partagé',
    target: 'Loft Artistique',
    description: 'Le projet a été partagé avec l\'équipe design',
    timestamp: new Date('2024-01-15T11:45:00'),
    icon: 'ShareIcon',
    iconColor: 'var(--neon-pink)'
  }
])

// Méthodes
const getDataParticleStyle = () => {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 10}s`,
    animationDuration: `${10 + Math.random() * 20}s`
  }
}

const getRandomDataSymbol = () => {
  const symbols = ['📊', '🏗️', '📐', '🎨', '💡', '⚡', '🔧', '🏠', '🌟', '💎']
  return symbols[Math.floor(Math.random() * symbols.length)]
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'short' 
  })
}

const formatTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  
  if (hours < 1) {
    const minutes = Math.floor(diff / (1000 * 60))
    return `Il y a ${minutes} min`
  } else if (hours < 24) {
    return `Il y a ${hours}h`
  } else {
    const days = Math.floor(hours / 24)
    return `Il y a ${days}j`
  }
}

onMounted(() => {
  // Initialisation des animations
  console.log('Dashboard cyber chargé')
})
</script>

<style scoped>
/* Import des variables cyber */
@import url('../../assets/cyber-theme.css');

.cyber-dashboard {
  min-height: 100vh;
  background: var(--bg-gradient-main);
  color: var(--text-primary);
  position: relative;
}

/* Arrière-plan cyber */
.dashboard-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
}

.circuit-pattern {
  position: absolute;
  inset: 0;
  opacity: 0.03;
}

.circuit-svg {
  width: 100%;
  height: 100%;
}

.data-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.data-particle {
  position: absolute;
  font-size: 1.5rem;
  opacity: 0.1;
  animation: data-float linear infinite;
  filter: drop-shadow(0 0 5px var(--electric-blue));
}

@keyframes data-float {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.1;
  }
  90% {
    opacity: 0.1;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

/* Header cyber */
.cyber-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--navbar-gradient);
  backdrop-filter: blur(30px);
  border-bottom: 1px solid var(--card-border);
  padding: 1rem 0;
}

.header-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 3rem;
}

.cyber-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--text-white);
}

.brand-icon {
  width: 2.5rem;
  height: 2.5rem;
  background: var(--primary-gradient);
  border-radius: var(--border-radius-medium);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-neon-blue);
  animation: cyber-pulse 3s ease-in-out infinite;
}

.brand-icon svg {
  width: 1.25rem;
  height: 1.25rem;
  stroke: white;
}

.brand-text {
  font-size: 1.25rem;
  font-weight: 800;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.project-selector {
  position: relative;
}

.cyber-select {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--border-radius-medium);
  color: var(--text-primary);
  padding: 0.75rem 1.25rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: var(--transition-smooth);
  backdrop-filter: blur(15px);
  min-width: 250px;
}

.cyber-select:focus {
  outline: none;
  border-color: var(--electric-blue);
  box-shadow: 0 0 20px rgba(0, 229, 255, 0.3);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.cyber-icon-btn {
  position: relative;
  width: 2.5rem;
  height: 2.5rem;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--border-radius-medium);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-smooth);
  backdrop-filter: blur(15px);
}

.cyber-icon-btn:hover {
  background: var(--glass-bg-strong);
  border-color: var(--electric-blue);
  box-shadow: 0 0 15px rgba(0, 229, 255, 0.3);
}

.cyber-icon-btn svg {
  width: 1.25rem;
  height: 1.25rem;
  stroke: var(--text-secondary);
}

.notification-badge {
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
  background: var(--laser-red);
  color: white;
  border-radius: 50%;
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  font-weight: 600;
  box-shadow: 0 0 10px var(--laser-red);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--border-radius-medium);
  cursor: pointer;
  transition: var(--transition-smooth);
  backdrop-filter: blur(15px);
}

.user-profile:hover {
  background: var(--glass-bg-strong);
  border-color: var(--electric-blue);
}

.avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--electric-blue);
  box-shadow: 0 0 10px rgba(0, 229, 255, 0.4);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-white);
}

.user-status {
  font-size: 0.75rem;
  color: var(--electric-blue);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.chevron {
  width: 1rem;
  height: 1rem;
  stroke: var(--text-muted);
  transition: var(--transition-smooth);
}

.user-profile:hover .chevron {
  transform: rotate(180deg);
}

/* Main content */
.dashboard-main {
  display: grid;
  grid-template-columns: 280px 1fr;
  min-height: calc(100vh - 80px);
  position: relative;
  z-index: 10;
}

/* Sidebar cyber */
.cyber-sidebar {
  background: var(--bg-white);
  backdrop-filter: blur(30px);
  border-right: 1px solid var(--card-border);
  padding: 2rem;
  overflow-y: auto;
}

.sidebar-nav {
  margin-bottom: 2rem;
}

.nav-section {
  margin-bottom: 2rem;
}

.nav-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1rem;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin-bottom: 0.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: var(--border-radius-medium);
  transition: var(--transition-smooth);
  font-size: 0.875rem;
  position: relative;
}

.nav-link:hover,
.nav-link.active {
  background: var(--glass-bg-medium);
  color: var(--electric-blue);
  transform: translateX(5px);
}

.nav-link.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  background: var(--primary-gradient);
  border-radius: 2px;
  box-shadow: 0 0 10px var(--electric-blue);
}

.nav-icon {
  width: 1.25rem;
  height: 1.25rem;
  stroke: currentColor;
  flex-shrink: 0;
}

.nav-badge {
  margin-left: auto;
  background: var(--glass-bg-strong);
  color: var(--text-primary);
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.625rem;
  font-weight: 600;
}

.nav-badge.new {
  background: var(--primary-gradient);
  color: white;
  box-shadow: 0 0 10px rgba(0, 229, 255, 0.4);
}

/* Usage quota */
.usage-quota {
  background: var(--glass-bg-medium);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-large);
  padding: 1.5rem;
  backdrop-filter: blur(20px);
}

.quota-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.quota-header h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.quota-percentage {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--electric-blue);
}

.quota-bar {
  width: 100%;
  height: 6px;
  background: var(--glass-bg-strong);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.quota-fill {
  height: 100%;
  background: var(--primary-gradient);
  border-radius: 3px;
  transition: width 0.5s ease;
  box-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
}

.quota-text {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 0 0 1rem 0;
}

.upgrade-btn {
  width: 100%;
  padding: 0.625rem;
  background: var(--primary-gradient);
  border: none;
  border-radius: var(--border-radius-medium);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-smooth);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.upgrade-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-neon-blue);
}

/* Content area */
.content-area {
  padding: 2rem;
  overflow-y: auto;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 2rem;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.cyber-btn-secondary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: var(--glass-bg-medium);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-medium);
  color: var(--electric-blue);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-smooth);
  backdrop-filter: blur(15px);
}

.cyber-btn-secondary:hover {
  background: var(--glass-bg-strong);
  border-color: var(--electric-blue);
  box-shadow: 0 0 20px rgba(0, 229, 255, 0.3);
}

.cyber-btn-secondary svg {
  width: 1rem;
  height: 1rem;
  stroke: currentColor;
}

/* Metrics section */
.metrics-section {
  margin-bottom: 3rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.metric-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--border-radius-large);
  padding: 1.5rem;
  backdrop-filter: blur(20px);
  transition: var(--transition-smooth);
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-card);
}

.metric-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-hover);
  border-color: var(--card-border-hover);
  background: var(--card-bg-hover);
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.metric-icon {
  width: 3rem;
  height: 3rem;
  border-radius: var(--border-radius-medium);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(0, 229, 255, 0.3);
}

.metric-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.metric-trend.positive {
  color: var(--acid-green);
}

.metric-trend.negative {
  color: var(--laser-red);
}

.metric-trend svg {
  width: 1rem;
  height: 1rem;
  stroke: currentColor;
}

.metric-value {
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.metric-label {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin: 0;
}

.mini-chart {
  height: 40px;
  border-radius: var(--border-radius-small);
  margin-top: 1rem;
  opacity: 0.3;
}

/* Projects section */
.projects-section {
  margin-bottom: 3rem;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.project-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--border-radius-large);
  overflow: hidden;
  transition: var(--transition-smooth);
  backdrop-filter: blur(20px);
  box-shadow: var(--shadow-card);
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-hover);
  border-color: var(--card-border-hover);
  background: var(--card-bg-hover);
}

.project-preview {
  position: relative;
  aspect-ratio: 16/10;
  overflow: hidden;
}

.project-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: var(--transition-smooth);
}

.project-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.6) 0%, rgba(0, 229, 255, 0.2) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  opacity: 0;
  transition: var(--transition-smooth);
}

.project-card:hover .project-overlay {
  opacity: 1;
}

.project-action {
  width: 3rem;
  height: 3rem;
  background: var(--glass-bg-strong);
  border: 1px solid var(--glass-border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-smooth);
  backdrop-filter: blur(20px);
}

.project-action:hover {
  background: var(--electric-blue);
  color: white;
  box-shadow: 0 0 20px var(--electric-blue);
}

.project-action svg {
  width: 1.25rem;
  height: 1.25rem;
  stroke: currentColor;
}

.project-info {
  padding: 1.5rem;
}

.project-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.project-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0 0 1rem 0;
  line-height: 1.4;
}

.project-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.project-date {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.project-status {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.project-status.active {
  background: rgba(57, 255, 20, 0.2);
  color: var(--acid-green);
  border: 1px solid var(--acid-green);
}

.project-status.review {
  background: rgba(255, 107, 0, 0.2);
  color: var(--solar-orange);
  border: 1px solid var(--solar-orange);
}

.project-status.completed {
  background: rgba(0, 229, 255, 0.2);
  color: var(--electric-blue);
  border: 1px solid var(--electric-blue);
}

/* Activity section */
.activity-section {
  margin-bottom: 3rem;
}

.activity-timeline {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--border-radius-large);
  padding: 1.5rem;
  backdrop-filter: blur(20px);
  box-shadow: var(--shadow-card);
}

.activity-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--glass-border);
  position: relative;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--electric-blue);
  flex-shrink: 0;
}

.activity-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.activity-content {
  flex: 1;
}

.activity-header {
  margin-bottom: 0.5rem;
}

.activity-user {
  font-weight: 600;
  color: var(--text-primary);
}

.activity-action {
  color: var(--text-secondary);
  margin: 0 0.25rem;
}

.activity-target {
  color: var(--electric-blue);
  font-weight: 500;
}

.activity-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0 0 0.5rem 0;
}

.activity-time {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.activity-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* Responsive */
@media (max-width: 1200px) {
  .dashboard-main {
    grid-template-columns: 1fr;
  }
  
  .cyber-sidebar {
    display: none;
  }
}

@media (max-width: 768px) {
  .header-container {
    padding: 0 1rem;
  }
  
  .header-left {
    gap: 1rem;
  }
  
  .project-selector {
    display: none;
  }
  
  .content-area {
    padding: 1rem;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>
