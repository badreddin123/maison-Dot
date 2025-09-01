<template>
  <div class="login-pro ultra-modern-layout">
    <!-- Arrière-plan animé -->
    <div class="login-bg ultra-modern-bg-gradient">
      <div class="bg-shapes">
        <div class="shape shape-1 ultra-modern-animate-float"></div>
        <div class="shape shape-2 ultra-modern-animate-fade-scale"></div>
        <div class="shape shape-3 ultra-modern-animate-pulse"></div>
      </div>
      
      <!-- Particules flottantes -->
      <div class="particles">
        <div v-for="i in 15" :key="i" class="particle ultra-modern-animate-float" :style="getParticleStyle()"></div>
      </div>
    </div>

    <div class="login-container">
      <!-- Panneau gauche - Branding -->
      <div class="branding-panel">
        <div class="branding-content">
          <router-link to="/" class="logo-link">
            <div class="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
            <span class="logo-text">Karya</span>
          </router-link>
          
          <div class="branding-hero">
            <h1 class="branding-title ultra-modern-text-gradient">
              Bienvenue dans l'avenir du design architectural
            </h1>
            <p class="branding-subtitle ultra-modern-text-secondary">
              Connectez-vous pour accéder à vos projets et continuer à créer des espaces extraordinaires.
            </p>
          </div>
          
          <!-- Statistiques impressionnantes -->
          <div class="branding-stats">
            <div class="stat-item">
              <div class="stat-number">50K+</div>
              <div class="stat-label">Designers actifs</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">1M+</div>
              <div class="stat-label">Projets créés</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">99.9%</div>
              <div class="stat-label">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Panneau droit - Formulaire -->
      <div class="form-panel">
        <div class="form-content">
          <div class="form-header">
            <h2 class="form-title">Connexion</h2>
            <p class="form-subtitle">Accédez à votre espace de création</p>
          </div>

          <form @submit.prevent="handleLogin" class="login-form">
            <!-- Champ Email -->
            <div class="form-group">
              <label for="email" class="form-label">Adresse email</label>
              <div class="input-container">
                <div class="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                  </svg>
                </div>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  class="form-input"
                  :class="{ 'error': emailError }"
                  placeholder="votre@email.com"
                />
              </div>
              <div v-if="emailError" class="error-message">{{ emailError }}</div>
            </div>

            <!-- Champ Mot de passe -->
            <div class="form-group">
              <label for="password" class="form-label">Mot de passe</label>
              <div class="input-container">
                <div class="input-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <input
                  id="password"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  required
                  class="form-input"
                  :class="{ 'error': passwordError }"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="password-toggle"
                >
                  <svg v-if="showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </button>
              </div>
              <div v-if="passwordError" class="error-message">{{ passwordError }}</div>
            </div>

            <!-- Options -->
            <div class="form-options">
              <label class="checkbox-container">
                <input v-model="form.remember" type="checkbox" class="checkbox">
                <span class="checkmark"></span>
                <span class="checkbox-label">Se souvenir de moi</span>
              </label>
              <a href="#" class="forgot-link">Mot de passe oublié ?</a>
            </div>

            <!-- Message d'erreur -->
            <div v-if="authStore.error" class="alert alert-error">
              <svg class="alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>{{ authStore.error }}</span>
            </div>

            <!-- Bouton de connexion -->
            <button
              type="submit"
              :disabled="authStore.isLoading"
              class="submit-btn"
            >
              <span v-if="!authStore.isLoading" class="btn-text">Se connecter</span>
              <div v-if="authStore.isLoading" class="btn-loading">
                <div class="spinner"></div>
                <span>Connexion...</span>
              </div>
              <div class="btn-glow"></div>
            </button>
          </form>

          <!-- Séparateur -->
          <div class="divider">
            <span class="divider-text">Ou continuer avec</span>
          </div>

          <!-- Connexion sociale -->
          <div class="social-buttons">
            <button class="social-btn google-btn">
              <svg class="social-icon" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Google</span>
            </button>
            
            <button class="social-btn microsoft-btn">
              <svg class="social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
              </svg>
              <span>Microsoft</span>
            </button>
          </div>

          <!-- Lien d'inscription -->
          <div class="signup-link">
            <span>Pas encore de compte ?</span>
            <router-link to="/register" class="signup-btn">Créer un compte</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

// État du formulaire
const form = reactive({
  email: '',
  password: '',
  remember: false
})

const showPassword = ref(false)
const emailError = ref('')
const passwordError = ref('')

// Méthodes
const getParticleStyle = () => {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${3 + Math.random() * 4}s`
  }
}

const validateForm = () => {
  emailError.value = ''
  passwordError.value = ''

  if (!form.email) {
    emailError.value = 'L\'adresse email est requise'
    return false
  }

  if (!/\S+@\S+\.\S+/.test(form.email)) {
    emailError.value = 'L\'adresse email n\'est pas valide'
    return false
  }

  if (!form.password) {
    passwordError.value = 'Le mot de passe est requis'
    return false
  }

  if (form.password.length < 6) {
    passwordError.value = 'Le mot de passe doit contenir au moins 6 caractères'
    return false
  }

  return true
}

const handleLogin = async () => {
  if (!validateForm()) return

  try {
    const result = await authStore.login({
      email: form.email,
      password: form.password
    })
    
    if (result?.success) {
      // Connexion réussie, redirection automatique via le store
      console.log('Connexion réussie')
    }
  } catch (error) {
    console.error('Erreur de connexion:', error)
  }
}
</script>

<style scoped>
/* Import des variables cyber */
@import url('../../assets/cyber-theme.css');

.login-pro {
  min-height: 100vh;
  position: relative;
  background: var(--bg-gradient-main);
  overflow: hidden;
}

.login-pro::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--hero-gradient);
  opacity: 0.8;
  pointer-events: none;
  animation: aurora-shift 25s linear infinite;
}

@keyframes aurora-shift {
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(360deg); }
}

.login-bg {
  position: absolute;
  inset: 0;
}

.bg-shapes {
  position: absolute;
  inset: 0;
}

.shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.4;
}

.shape-1 {
  width: 400px;
  height: 400px;
  background: var(--primary-gradient);
  top: -200px;
  right: -200px;
  animation: cyber-float-1 12s ease-in-out infinite;
  filter: blur(80px);
}

.shape-2 {
  width: 300px;
  height: 300px;
  background: var(--cyber-gradient);
  bottom: -150px;
  left: -150px;
  animation: cyber-float-2 15s ease-in-out infinite reverse;
  filter: blur(70px);
}

.shape-3 {
  width: 250px;
  height: 250px;
  background: var(--secondary-gradient);
  top: 60%;
  left: 15%;
  animation: cyber-float-3 10s ease-in-out infinite;
  filter: blur(60px);
}

@keyframes cyber-float-1 {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg) scale(1);
    opacity: 0.4;
  }
  25% { 
    transform: translateY(-40px) rotate(90deg) scale(1.1);
    opacity: 0.6;
  }
  50% { 
    transform: translateY(-20px) rotate(180deg) scale(0.9);
    opacity: 0.3;
  }
  75% { 
    transform: translateY(-60px) rotate(270deg) scale(1.2);
    opacity: 0.5;
  }
}

@keyframes cyber-float-2 {
  0%, 100% { 
    transform: translateX(0px) translateY(0px) rotate(0deg);
    opacity: 0.3;
  }
  33% { 
    transform: translateX(30px) translateY(-20px) rotate(120deg);
    opacity: 0.5;
  }
  66% { 
    transform: translateX(-20px) translateY(-40px) rotate(240deg);
    opacity: 0.4;
  }
}

@keyframes cyber-float-3 {
  0%, 100% { 
    transform: translateY(0px) scale(1);
    opacity: 0.35;
  }
  50% { 
    transform: translateY(-50px) scale(1.15);
    opacity: 0.6;
  }
}

@keyframes float-shape {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-30px) rotate(5deg); }
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
  animation: cyber-particle-float linear infinite;
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

@keyframes cyber-particle-float {
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
    transform: translateY(-100px) translateX(-10px) scale(0.5);
    opacity: 0;
  }
}

.login-container {
  position: relative;
  z-index: 10;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr;
  background: linear-gradient(135deg, #4300FF 0%, #0065F8 33%, #00CAFF 66%, #00FFDE 100%);
}

@media (min-width: 1024px) {
  .login-container {
    grid-template-columns: 1fr 1fr;
  }
}

/* Panneau de branding */
.branding-panel {
  display: none;
  background: var(--navbar-gradient);
  backdrop-filter: blur(30px);
  border-right: 1px solid var(--card-border);
  position: relative;
  overflow: hidden;
}

.branding-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--hologram-gradient);
  opacity: 0.03;
  animation: hologram-shift 20s linear infinite;
}

@keyframes hologram-shift {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@media (min-width: 1024px) {
  .branding-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem;
  }
}

.branding-content {
  max-width: 500px;
  color: var(--text-white);
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  color: var(--text-white);
  margin-bottom: 3rem;
}

.logo-icon {
  width: 3rem;
  height: 3rem;
  background: var(--primary-gradient);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-neon-blue);
  animation: logo-pulse 3s ease-in-out infinite;
}

@keyframes logo-pulse {
  0%, 100% { 
    box-shadow: var(--shadow-neon-blue);
    transform: scale(1);
  }
  50% { 
    box-shadow: var(--shadow-cyber);
    transform: scale(1.05);
  }
}

.logo-icon svg {
  width: 1.5rem;
  height: 1.5rem;
  stroke: white;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 800;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.branding-title {
  font-size: 2.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #cbd5e1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 8px rgba(6, 101, 248, 0.1);
}

.branding-subtitle {
  font-size: 1.125rem;
  color: #e5e7eb;
  line-height: 1.6;
  margin-bottom: 3rem;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.branding-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.stat-label {
  font-size: 0.875rem;
  color: #d1d5db;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Panneau de formulaire */
.form-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--bg-white);
  backdrop-filter: blur(25px);
  position: relative;
}

.form-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--matrix-gradient);
  opacity: 0.02;
  animation: matrix-rain 15s linear infinite;
}

@keyframes matrix-rain {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100%); }
}

.form-content {
  width: 100%;
  max-width: 400px;
  color: var(--text-primary);
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-title {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: #000000;
}

.form-subtitle {
  color: #0065F8;
  font-size: 1rem;
}

.login-form {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #000000;
  font-size: 0.875rem;
}

.input-container {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: #9ca3af;
  z-index: 2;
}

.input-icon svg {
  width: 100%;
  height: 100%;
  stroke: currentColor;
}

.form-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--border-radius-medium);
  color: var(--text-primary);
  font-size: 1rem;
  transition: var(--transition-smooth);
  backdrop-filter: blur(15px);
  box-shadow: var(--shadow-card);
}

.form-input:focus {
  outline: none;
  border-color: var(--electric-blue);
  background: var(--card-bg-hover);
  box-shadow: var(--shadow-hover);
  color: var(--text-primary);
}

.form-input.error {
  border-color: var(--laser-red);
}

.form-input::placeholder {
  color: #9ca3af;
}

.password-toggle {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  width: 1.25rem;
  height: 1.25rem;
  transition: color 0.3s ease;
}

.password-toggle:hover {
  color: #6b7280;
}

.password-toggle svg {
  width: 100%;
  height: 100%;
  stroke: currentColor;
}

.error-message {
  margin-top: 0.5rem;
  color: #ef4444;
  font-size: 0.875rem;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.checkbox {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  width: 1.25rem;
  height: 1.25rem;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 0.25rem;
  margin-right: 0.75rem;
  position: relative;
  transition: all 0.3s ease;
}

.checkbox:checked ~ .checkmark {
  background: linear-gradient(135deg, #0065F8 0%, #4300FF 100%);
  border-color: #0065F8;
}

.checkbox:checked ~ .checkmark::after {
  content: '';
  position: absolute;
  left: 0.25rem;
  top: 0.125rem;
  width: 0.25rem;
  height: 0.5rem;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-label {
  font-size: 0.875rem;
  color: #000000;
}

.forgot-link {
  color: #0065F8;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: #4300FF;
}

.alert {
  padding: 1rem;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.alert-error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #fca5a5;
}

.alert-icon {
  width: 1.25rem;
  height: 1.25rem;
  stroke: currentColor;
  flex-shrink: 0;
}

.submit-btn {
  position: relative;
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #0065F8 0%, #4300FF 100%);
  border: none;
  border-radius: var(--border-radius-medium);
  color: white;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: var(--transition-smooth);
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(6, 101, 248, 0.3);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 25px rgba(6, 101, 248, 0.4);
  background: linear-gradient(135deg, #4300FF 0%, #0065F8 100%);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-text {
  position: relative;
  z-index: 2;
}

.btn-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  position: relative;
  z-index: 2;
}

.spinner {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.btn-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s;
}

.submit-btn:hover .btn-glow {
  transform: translateX(100%);
}

.divider {
  position: relative;
  text-align: center;
  margin: 2rem 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.divider-text {
  background: white;
  padding: 0 1rem;
  color: #000000;
  font-size: 0.875rem;
  position: relative;
}

.social-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.875rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  color: #000000;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.social-btn:hover {
  background: #f9fafb;
  border-color: #0065F8;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(6, 101, 248, 0.15);
}

.social-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.signup-link {
  text-align: center;
  color: #000000;
  font-size: 0.875rem;
}

.signup-btn {
  color: #0065F8;
  text-decoration: none;
  font-weight: 600;
  margin-left: 0.5rem;
  transition: color 0.3s ease;
}

.signup-btn:hover {
  color: #4f46e5;
}

/* Responsive */
@media (max-width: 1023px) {
  .form-panel {
    min-height: 100vh;
  }
  
  .form-content {
    max-width: 500px;
  }
}
</style>
