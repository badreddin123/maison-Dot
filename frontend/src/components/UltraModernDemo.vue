<template>
  <div class="ultra-modern-demo">
    <!-- Theme Toggle -->
    <ThemeToggle />
    
    <!-- Header avec gradient -->
    <header class="demo-header ultra-modern-card ultra-modern-animate-slide-up">
      <h1 class="ultra-modern-text-gradient">Thème Ultra Moderne HomeDesign Pro</h1>
      <p class="ultra-modern-text-secondary">
        Démonstration complète du nouveau design avec gradient #4300FF → #0065F8 → #00CAFF
      </p>
    </header>

    <!-- Section des cartes -->
    <section class="cards-section">
      <h2 class="section-title ultra-modern-text-primary">Cartes Ultra Modernes</h2>
      
      <div class="cards-grid">
        <!-- Carte standard -->
        <div class="ultra-modern-card ultra-modern-animate-fade-scale">
          <h3 class="ultra-modern-text-primary">Carte Standard</h3>
          <p class="ultra-modern-text-muted">
            Cette carte utilise le nouveau design ultra moderne avec glassmorphism et gradient subtil.
          </p>
          <button class="ultra-modern-btn ultra-modern-btn-primary">
            Action Principale
          </button>
        </div>

        <!-- Carte featured -->
        <div class="ultra-modern-card ultra-modern-card-featured ultra-modern-animate-fade-scale">
          <h3 class="ultra-modern-text-gradient">Carte Featured</h3>
          <p class="ultra-modern-text-muted">
            Une carte mise en évidence avec bordure gradient et effets visuels avancés.
          </p>
          <button class="ultra-modern-btn ultra-modern-btn-secondary">
            Action Secondaire
          </button>
        </div>

        <!-- Carte glassmorphism -->
        <div class="ultra-modern-card ultra-modern-card-glass ultra-modern-animate-fade-scale">
          <h3 class="ultra-modern-text-primary">Glassmorphism</h3>
          <p class="ultra-modern-text-muted">
            Effet glassmorphism avec transparence et blur pour un look futuriste.
          </p>
          <button class="ultra-modern-btn ultra-modern-btn-outline">
            Action Outline
          </button>
        </div>
      </div>
    </section>

    <!-- Section des boutons -->
    <section class="buttons-section">
      <h2 class="section-title ultra-modern-text-primary">Boutons Ultra Modernes</h2>
      
      <div class="buttons-demo">
        <button class="ultra-modern-btn ultra-modern-btn-primary">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
          </svg>
          Bouton Principal
        </button>
        
        <button class="ultra-modern-btn ultra-modern-btn-secondary">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
          Bouton Secondaire
        </button>
        
        <button class="ultra-modern-btn ultra-modern-btn-outline">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          Bouton Outline
        </button>
        
        <button class="ultra-modern-btn" style="background: linear-gradient(135deg, #10B981, #059669); color: white;">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          Succès
        </button>
        
        <button class="ultra-modern-btn" style="background: linear-gradient(135deg, #EF4444, #DC2626); color: white;">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          Danger
        </button>
      </div>
    </section>

    <!-- Section des formulaires -->
    <section class="forms-section">
      <h2 class="section-title ultra-modern-text-primary">Formulaires Ultra Modernes</h2>
      
      <div class="forms-demo ultra-modern-card">
        <div class="form-row">
          <div class="form-group">
            <label class="ultra-modern-label">Nom complet</label>
            <input type="text" class="ultra-modern-input" placeholder="Entrez votre nom complet" v-model="demoForm.name">
          </div>
          
          <div class="form-group">
            <label class="ultra-modern-label ultra-modern-label-gradient">Email professionnel</label>
            <input type="email" class="ultra-modern-input ultra-modern-input-gradient" placeholder="votre.email@entreprise.com" v-model="demoForm.email">
          </div>
        </div>
        
        <div class="form-group">
          <label class="ultra-modern-label">Message</label>
          <textarea class="ultra-modern-input" rows="4" placeholder="Décrivez votre projet..." v-model="demoForm.message"></textarea>
        </div>
        
        <div class="form-actions">
          <button class="ultra-modern-btn ultra-modern-btn-primary">
            Envoyer le message
          </button>
          <button class="ultra-modern-btn ultra-modern-btn-outline">
            Effacer
          </button>
        </div>
      </div>
    </section>

    <!-- Section des badges et alertes -->
    <section class="components-section">
      <h2 class="section-title ultra-modern-text-primary">Composants Avancés</h2>
      
      <div class="components-grid">
        <!-- Badges -->
        <div class="ultra-modern-card">
          <h3 class="ultra-modern-text-secondary">Badges</h3>
          <div class="badges-demo">
            <span class="ultra-modern-badge ultra-modern-badge-primary">Primary</span>
            <span class="ultra-modern-badge ultra-modern-badge-success">Success</span>
            <span class="ultra-modern-badge ultra-modern-badge-warning">Warning</span>
            <span class="ultra-modern-badge ultra-modern-badge-error">Error</span>
          </div>
        </div>

        <!-- Navigation -->
        <div class="ultra-modern-card">
          <h3 class="ultra-modern-text-secondary">Navigation</h3>
          <div class="nav-demo">
            <a href="#" class="ultra-modern-nav-link active">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4"/>
              </svg>
              Dashboard
            </a>
            <a href="#" class="ultra-modern-nav-link">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
              Propriétés
            </a>
            <a href="#" class="ultra-modern-nav-link">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.196-2.121L17 20zM9 6a3 3 0 106 0v1H9V6zM7 21h10a2 2 0 002-2V9a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              Utilisateurs
            </a>
          </div>
        </div>
      </div>

      <!-- Alertes -->
      <div class="alerts-demo">
        <div class="ultra-modern-alert ultra-modern-alert-success">
          <strong>Succès !</strong> Votre projet a été sauvegardé avec succès.
        </div>
        <div class="ultra-modern-alert ultra-modern-alert-warning">
          <strong>Attention !</strong> Certains champs nécessitent votre attention.
        </div>
        <div class="ultra-modern-alert ultra-modern-alert-error">
          <strong>Erreur !</strong> Une erreur s'est produite lors de la sauvegarde.
        </div>
        <div class="ultra-modern-alert ultra-modern-alert-info">
          <strong>Information :</strong> Nouvelles fonctionnalités disponibles dans cette version.
        </div>
      </div>
    </section>

    <!-- Section des effets spéciaux -->
    <section class="effects-section">
      <h2 class="section-title ultra-modern-text-primary">Effets Visuels Avancés</h2>
      
      <div class="effects-grid">
        <!-- Gradient animé -->
        <div class="effect-card ultra-modern-animate-fade-scale" style="background: linear-gradient(135deg, #4300FF 0%, #0065F8 50%, #00CAFF 100%); color: white;">
          <h3 class="ultra-modern-text-on-primary">Gradient Principal Animé</h3>
          <p class="ultra-modern-text-on-primary">Effet de gradient avec animation subtile</p>
        </div>

        <!-- Glassmorphism avancé -->
        <div class="effect-card ultra-modern-animate-slide-up" style="background: linear-gradient(135deg, rgba(67, 0, 255, 0.2) 0%, rgba(0, 202, 255, 0.1) 100%); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.18);">
          <h3 class="ultra-modern-text-primary">Glassmorphism Avancé</h3>
          <p class="ultra-modern-text-muted">Effet de verre avec blur et transparence</p>
        </div>

        <!-- Bordure gradient -->
        <div class="effect-card ultra-modern-animate-pulse ultra-modern-border-gradient">
          <h3 class="ultra-modern-text-primary">Bordure Gradient</h3>
          <p class="ultra-modern-text-muted">Bordure avec gradient ultra moderne</p>
        </div>

        <!-- Animation permanente -->
        <div class="effect-card ultra-modern-animate-float" style="background: linear-gradient(135deg, #00CAFF 0%, #00FFDE 100%); color: white;">
          <h3 class="ultra-modern-text-on-secondary">Animation Flottante</h3>
          <p class="ultra-modern-text-on-secondary">Animation continue et douce</p>
        </div>
      </div>
    </section>

    <!-- Section du tableau -->
    <section class="table-section">
      <h2 class="section-title ultra-modern-text-primary">Tableau Ultra Moderne</h2>
      
      <div class="table-container">
        <table class="ultra-modern-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Type</th>
              <th>Statut</th>
              <th>Prix</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="ultra-modern-text-primary">Villa Moderne</td>
              <td class="ultra-modern-text-secondary">Résidentiel</td>
              <td><span class="ultra-modern-badge ultra-modern-badge-success">Actif</span></td>
              <td class="ultra-modern-text-gradient">€ 1,250,000</td>
              <td>
                <button class="ultra-modern-btn ultra-modern-btn-outline" style="padding: 0.5rem;">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                  </svg>
                </button>
              </td>
            </tr>
            <tr>
              <td class="ultra-modern-text-primary">Appartement Design</td>
              <td class="ultra-modern-text-secondary">Moderne</td>
              <td><span class="ultra-modern-badge ultra-modern-badge-warning">En attente</span></td>
              <td class="ultra-modern-text-gradient">€ 850,000</td>
              <td>
                <button class="ultra-modern-btn ultra-modern-btn-outline" style="padding: 0.5rem;">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import ThemeToggle from './ThemeToggle.vue'

// Form demo data
const demoForm = reactive({
  name: '',
  email: '',
  message: ''
})
</script>

<style scoped>
@import '../assets/ultra-modern-theme.css';

.ultra-modern-demo {
  min-height: 100vh;
  background: var(--bg-main);
  padding: 2rem;
}

.demo-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 3rem;
}

.demo-header h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 800;
}

.demo-header p {
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
}

/* Cards Section */
.cards-section {
  margin-bottom: 4rem;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.cards-grid .ultra-modern-card {
  padding: 2rem;
  text-align: center;
}

.cards-grid h3 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.cards-grid p {
  margin-bottom: 2rem;
  line-height: 1.6;
}

/* Buttons Section */
.buttons-section {
  margin-bottom: 4rem;
}

.buttons-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  align-items: center;
}

/* Forms Section */
.forms-section {
  margin-bottom: 4rem;
}

.forms-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

/* Components Section */
.components-section {
  margin-bottom: 4rem;
}

.components-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.components-grid .ultra-modern-card {
  padding: 2rem;
}

.components-grid h3 {
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
}

.badges-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.nav-demo {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.alerts-demo {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Effects Section */
.effects-section {
  margin-bottom: 4rem;
}

.effects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.effect-card {
  padding: 2rem;
  border-radius: var(--radius-large);
  text-align: center;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.effect-card h3 {
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

/* Table Section */
.table-section {
  margin-bottom: 4rem;
}

.table-container {
  overflow-x: auto;
  border-radius: var(--radius-large);
  box-shadow: var(--shadow-card);
}

/* Responsive */
@media (max-width: 768px) {
  .ultra-modern-demo {
    padding: 1rem;
  }
  
  .demo-header h1 {
    font-size: 2rem;
  }
  
  .demo-header p {
    font-size: 1rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .buttons-demo {
    flex-direction: column;
    align-items: stretch;
  }
  
  .buttons-demo .ultra-modern-btn {
    width: 100%;
    justify-content: center;
  }
  
  .effects-grid {
    grid-template-columns: 1fr;
  }
}
</style>
