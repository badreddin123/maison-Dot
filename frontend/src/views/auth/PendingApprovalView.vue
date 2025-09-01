<template>
  <div class="pending-approval">
    <!-- Arrière-plan animé -->
    <div class="cyber-bg">
      <div class="holographic-grid">
        <div v-for="i in 15" :key="i" class="grid-line" :style="getGridStyle(i)"></div>
      </div>
      
      <!-- Particules flottantes -->
      <div class="particles">
        <div v-for="i in 20" :key="i" class="particle" :style="getParticleStyle()"></div>
      </div>
    </div>

    <div class="pending-container">
      <div class="pending-card">
        <!-- Icône de statut -->
        <div class="status-icon">
          <div class="icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
          </div>
          <div class="status-rings">
            <div class="ring ring-1"></div>
            <div class="ring ring-2"></div>
            <div class="ring ring-3"></div>
          </div>
        </div>
        
        <!-- Contenu principal -->
        <div class="pending-content">
          <h1 class="pending-title">Compte en attente d'approbation</h1>
          <p class="pending-subtitle">
            Votre demande de compte Manager a été reçue avec succès
          </p>
          
          <div class="status-message">
            <div class="message-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="message-content">
              <h3>Demande en cours de traitement</h3>
              <p>Un administrateur examine actuellement votre demande. Vous recevrez une notification par email dès que votre compte sera activé.</p>
            </div>
          </div>
          
          <!-- Informations du compte -->
          <div class="account-info">
            <h3>Informations de votre compte</h3>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Nom complet</div>
                <div class="info-value">{{ authStore.userName }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Email</div>
                <div class="info-value">{{ authStore.userEmail }}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Type de compte</div>
                <div class="info-value">
                  <span class="role-badge manager">Manager de propriétés</span>
                </div>
              </div>
              <div class="info-item">
                <div class="info-label">Statut</div>
                <div class="info-value">
                  <span class="status-badge pending">
                    <div class="status-dot"></div>
                    En attente d'approbation
                  </span>
                </div>
              </div>
              <div v-if="authStore.userPhone" class="info-item">
                <div class="info-label">Téléphone</div>
                <div class="info-value">{{ authStore.userPhone }}</div>
              </div>
              <div v-if="authStore.userAddress" class="info-item">
                <div class="info-label">Adresse</div>
                <div class="info-value">{{ authStore.userAddress }}</div>
              </div>
            </div>
          </div>
          
          <!-- Prochaines étapes -->
          <div class="next-steps">
            <h3>Prochaines étapes</h3>
            <div class="steps-list">
              <div class="step-item completed">
                <div class="step-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div class="step-content">
                  <h4>Inscription terminée</h4>
                  <p>Votre compte a été créé avec succès</p>
                </div>
              </div>
              
              <div class="step-item active">
                <div class="step-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                </div>
                <div class="step-content">
                  <h4>Révision en cours</h4>
                  <p>Un administrateur examine votre demande</p>
                </div>
              </div>
              
              <div class="step-item">
                <div class="step-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 2.26a2 2 0 001.23 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div class="step-content">
                  <h4>Notification par email</h4>
                  <p>Vous recevrez un email de confirmation</p>
                </div>
              </div>
              
              <div class="step-item">
                <div class="step-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                </div>
                <div class="step-content">
                  <h4>Accès à votre dashboard</h4>
                  <p>Commencez à gérer vos propriétés</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Temps d'attente estimé -->
          <div class="estimated-time">
            <div class="time-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12,6 12,12 16,14"/>
              </svg>
            </div>
            <div class="time-content">
              <h4>Temps d'attente estimé</h4>
              <p>24-48 heures ouvrables</p>
              <span class="time-note">Les demandes sont traitées du lundi au vendredi</span>
            </div>
          </div>
          
          <!-- Actions disponibles -->
          <div class="available-actions">
            <h3>Que puis-je faire en attendant ?</h3>
            <div class="actions-grid">
              <div class="action-card">
                <div class="action-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                  </svg>
                </div>
                <h4>Documentation</h4>
                <p>Découvrez comment utiliser la plateforme</p>
                <a href="#" class="action-link">Lire le guide</a>
              </div>
              
              <div class="action-card">
                <div class="action-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <h4>Support</h4>
                <p>Besoin d'aide ? Contactez notre équipe</p>
                <a href="#" class="action-link">Contacter le support</a>
              </div>
              
              <div class="action-card">
                <div class="action-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                </div>
                <h4>Exemples</h4>
                <p>Voyez des exemples de propriétés bien présentées</p>
                <a href="#" class="action-link">Voir les exemples</a>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Actions de déconnexion -->
        <div class="logout-section">
          <p class="logout-text">Vous souhaitez vous déconnecter ?</p>
          <button @click="handleLogout" class="logout-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

// Méthodes pour les effets visuels
const getParticleStyle = () => {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${3 + Math.random() * 4}s`
  }
}

const getGridStyle = (index: number) => {
  const isVertical = index % 2 === 0
  return {
    [isVertical ? 'left' : 'top']: `${(index / 15) * 100}%`,
    animationDelay: `${index * 0.1}s`
  }
}

const handleLogout = () => {
  authStore.logout()
}
</script>

<style scoped>
@import url('../../assets/cyber-theme.css');

.pending-approval {
  min-height: 100vh;
  position: relative;
  background: var(--bg-gradient-main);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  overflow: hidden;
}

.pending-approval::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--hero-gradient);
  opacity: 0.8;
  pointer-events: none;
  animation: aurora-shift 30s linear infinite;
}

@keyframes aurora-shift {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(360deg); }
}

/* Arrière-plan cyber */
.cyber-bg {
  position: absolute;
  inset: 0;
}

.holographic-grid {
  position: absolute;
  inset: 0;
  opacity: 0.1;
}

.grid-line {
  position: absolute;
  background: var(--electric-blue);
  animation: grid-pulse 4s ease-in-out infinite;
}

.grid-line:nth-child(even) {
  width: 1px;
  height: 100%;
}

.grid-line:nth-child(odd) {
  width: 100%;
  height: 1px;
}

@keyframes grid-pulse {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.3; }
}

.particles {
  position: absolute;
  inset: 0;
}

.particle {
  position: absolute;
  width: 2px;
  height: 2px;
  background: var(--electric-blue);
  border-radius: 50%;
  animation: particle-float linear infinite;
  box-shadow: 0 0 6px var(--electric-blue);
}

.particle:nth-child(odd) {
  background: var(--neon-pink);
  box-shadow: 0 0 6px var(--neon-pink);
}

.particle:nth-child(3n) {
  background: var(--acid-green);
  box-shadow: 0 0 6px var(--acid-green);
}

@keyframes particle-float {
  0% {
    transform: translateY(100vh) translateX(0px) scale(0);
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  50% {
    transform: translateY(50vh) translateX(20px) scale(1);
    opacity: 0.8;
  }
  95% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) translateX(-10px) scale(0.3);
    opacity: 0;
  }
}

.pending-container {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 800px;
}

.pending-card {
  background: var(--glass-bg-medium);
  backdrop-filter: blur(30px);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-large);
  padding: 3rem;
  box-shadow: var(--shadow-cyber);
  animation: slide-in 1s ease-out;
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.status-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  width: 8rem;
  height: 8rem;
}

.icon-wrapper {
  width: 5rem;
  height: 5rem;
  background: var(--warning-gradient, linear-gradient(135deg, #f59e0b, #d97706));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
  animation: icon-pulse 2s ease-in-out infinite;
}

@keyframes icon-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.icon-wrapper svg {
  width: 2.5rem;
  height: 2.5rem;
  stroke: white;
}

.status-rings {
  position: absolute;
  inset: 0;
}

.ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid var(--solar-orange);
  opacity: 0.3;
  animation: ring-pulse 2s ease-in-out infinite;
}

.ring-1 {
  animation-delay: 0s;
}

.ring-2 {
  animation-delay: 0.7s;
  transform: scale(1.2);
}

.ring-3 {
  animation-delay: 1.4s;
  transform: scale(1.4);
}

@keyframes ring-pulse {
  0% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.1;
  }
  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}

.pending-content {
  text-align: center;
}

.pending-title {
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 1rem;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(0, 229, 255, 0.4);
}

.pending-subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: 3rem;
}

.status-message {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-large);
  margin-bottom: 3rem;
  text-align: left;
}

.message-icon {
  width: 3rem;
  height: 3rem;
  background: var(--success-gradient, linear-gradient(135deg, #10b981, #059669));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.message-icon svg {
  width: 1.5rem;
  height: 1.5rem;
  stroke: white;
}

.message-content h3 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.message-content p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0;
}

.account-info,
.next-steps,
.available-actions {
  margin-bottom: 3rem;
  text-align: left;
}

.account-info h3,
.next-steps h3,
.available-actions h3 {
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.info-item {
  padding: 1.5rem;
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-medium);
  transition: var(--transition-smooth);
}

.info-item:hover {
  background: var(--glass-bg-medium);
  transform: translateY(-2px);
}

.info-label {
  font-size: 0.875rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
}

.info-value {
  color: var(--text-primary);
  font-weight: 600;
  font-size: 1rem;
}

.role-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-small);
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
}

.role-badge.manager {
  background: rgba(59, 130, 246, 0.1);
  color: var(--electric-blue);
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius-small);
  font-size: 0.875rem;
  font-weight: 600;
}

.status-badge.pending {
  background: rgba(245, 158, 11, 0.1);
  color: var(--solar-orange);
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.status-dot {
  width: 0.5rem;
  height: 0.5rem;
  background: var(--solar-orange);
  border-radius: 50%;
  animation: status-pulse 2s ease-in-out infinite;
}

@keyframes status-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-medium);
  transition: var(--transition-smooth);
  position: relative;
}

.step-item.completed {
  border-color: var(--acid-green);
  background: rgba(16, 185, 129, 0.05);
}

.step-item.active {
  border-color: var(--solar-orange);
  background: rgba(245, 158, 11, 0.05);
  animation: step-glow 2s ease-in-out infinite alternate;
}

@keyframes step-glow {
  0% { box-shadow: 0 0 10px rgba(245, 158, 11, 0.3); }
  100% { box-shadow: 0 0 20px rgba(245, 158, 11, 0.5); }
}

.step-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.step-item.completed .step-icon {
  background: var(--success-gradient, linear-gradient(135deg, #10b981, #059669));
}

.step-item.active .step-icon {
  background: var(--warning-gradient, linear-gradient(135deg, #f59e0b, #d97706));
}

.step-item:not(.completed):not(.active) .step-icon {
  background: var(--glass-bg-medium);
  border: 2px solid var(--glass-border);
}

.step-icon svg {
  width: 1.5rem;
  height: 1.5rem;
  stroke: white;
}

.step-item:not(.completed):not(.active) .step-icon svg {
  stroke: var(--text-muted);
}

.step-content h4 {
  color: var(--text-primary);
  margin-bottom: 0.25rem;
  font-size: 1.125rem;
}

.step-content p {
  color: var(--text-secondary);
  margin: 0;
  font-size: 0.875rem;
}

.estimated-time {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-large);
  margin-bottom: 3rem;
}

.time-icon {
  width: 3rem;
  height: 3rem;
  background: var(--info-gradient, linear-gradient(135deg, #3b82f6, #2563eb));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.time-icon svg {
  width: 1.5rem;
  height: 1.5rem;
  stroke: white;
}

.time-content h4 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-size: 1.125rem;
}

.time-content p {
  color: var(--electric-blue);
  font-weight: 700;
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
}

.time-note {
  color: var(--text-muted);
  font-size: 0.875rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.action-card {
  padding: 2rem;
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: var(--border-radius-large);
  text-align: center;
  transition: var(--transition-smooth);
}

.action-card:hover {
  background: var(--glass-bg-medium);
  transform: translateY(-5px);
  box-shadow: var(--shadow-hover);
}

.action-icon {
  width: 3rem;
  height: 3rem;
  background: var(--primary-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.action-icon svg {
  width: 1.5rem;
  height: 1.5rem;
  stroke: white;
}

.action-card h4 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-size: 1.125rem;
}

.action-card p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}

.action-link {
  color: var(--electric-blue);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  transition: var(--transition-smooth);
}

.action-link:hover {
  color: var(--neon-cyan);
  text-shadow: 0 0 10px var(--neon-cyan);
}

.logout-section {
  text-align: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--glass-border);
}

.logout-text {
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.logout-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: var(--glass-bg-medium);
  border: 1px solid var(--laser-red);
  border-radius: var(--border-radius-medium);
  color: var(--laser-red);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-smooth);
}

.logout-btn:hover {
  background: rgba(255, 0, 64, 0.1);
  transform: translateY(-2px);
}

.logout-btn svg {
  width: 1.25rem;
  height: 1.25rem;
  stroke: currentColor;
}

/* Responsive */
@media (max-width: 768px) {
  .pending-approval {
    padding: 1rem;
  }
  
  .pending-card {
    padding: 2rem;
  }
  
  .pending-title {
    font-size: 2rem;
  }
  
  .status-message {
    flex-direction: column;
    text-align: center;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .estimated-time {
    flex-direction: column;
    text-align: center;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .step-item {
    flex-direction: column;
    text-align: center;
  }
}
</style>