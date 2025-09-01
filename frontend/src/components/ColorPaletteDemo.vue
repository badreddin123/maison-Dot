<template>
  <div class="color-palette-demo ultra-modern-layout">
    <!-- Theme Toggle -->
    <ThemeToggle />
    
    <div class="demo-container">
      <!-- Header -->
      <div class="demo-header ultra-modern-card">
        <h1 class="ultra-modern-text-gradient">Palette de Couleurs Ultra Professionnelle</h1>
        <p class="ultra-modern-text-secondary">Design ultra moderne avec gradient #4300FF → #0065F8 → #00CAFF pour HomeDesign Pro</p>
      </div>

      <!-- Couleurs Primaires -->
      <section class="color-section">
        <h2 class="section-title ultra-modern-text-gradient">Couleurs Ultra Modernes</h2>
        <div class="color-grid">
          <div class="color-card ultra-modern-card">
            <div class="color-swatch" style="background: #4300FF"></div>
            <div class="color-info">
              <h3>Violet Électrique</h3>
              <p>#4300FF</p>
              <small>Couleur primaire - Éléments principaux</small>
            </div>
          </div>
          <div class="color-card ultra-modern-card">
            <div class="color-swatch" style="background: #0065F8"></div>
            <div class="color-info">
              <h3>Bleu Royal</h3>
              <p>#0065F8</p>
              <small>Couleur secondaire - Accents</small>
            </div>
          </div>
          <div class="color-card ultra-modern-card">
            <div class="color-swatch" style="background: #00CAFF"></div>
            <div class="color-info">
              <h3>Cyan Moderne</h3>
              <p>#00CAFF</p>
              <small>Couleur tertiaire - Highlights</small>
            </div>
          </div>
        </div>
      </section>

      <!-- Gradients Ultra Modernes -->
      <section class="color-section">
        <h2 class="section-title ultra-modern-text-gradient">Gradients Ultra Modernes</h2>
        <div class="color-grid">
          <div class="color-card ultra-modern-card">
            <div class="color-swatch" style="background: linear-gradient(135deg, #4300FF 0%, #0065F8 50%, #00CAFF 100%)"></div>
            <div class="color-info">
              <h3>Gradient Principal</h3>
              <p>#4300FF → #0065F8 → #00CAFF</p>
              <small>Boutons primaires et éléments CTA</small>
            </div>
          </div>
          <div class="color-card ultra-modern-card">
            <div class="color-swatch" style="background: linear-gradient(135deg, #0065F8 0%, #00CAFF 100%)"></div>
            <div class="color-info">
              <h3>Gradient Secondaire</h3>
              <p>#0065F8 → #00CAFF</p>
              <small>Accents et highlights</small>
            </div>
          </div>
          <div class="color-card ultra-modern-card">
            <div class="color-swatch" style="background: linear-gradient(135deg, rgba(67, 0, 255, 0.1) 0%, rgba(0, 101, 248, 0.05) 50%, rgba(0, 202, 255, 0.03) 100%)"></div>
            <div class="color-info">
              <h3>Gradient Soft</h3>
              <p>Transparence douce</p>
              <small>Arrière-plans subtils</small>
            </div>
          </div>
        </div>
      </section>

      <!-- Couleurs d'Accentuation -->
      <section class="color-section">
        <h2 class="section-title professional-text-green">Couleurs d'Accentuation</h2>
        <div class="color-grid">
          <div class="color-card">
            <div class="color-swatch" style="background: var(--emerald-green)"></div>
            <div class="color-info">
              <h3>Vert Émeraude</h3>
              <p>#10B981</p>
              <small>Indicateurs positifs</small>
            </div>
          </div>
          <div class="color-card">
            <div class="color-swatch" style="background: var(--coral-red)"></div>
            <div class="color-info">
              <h3>Rouge Coral</h3>
              <p>#EF4444</p>
              <small>Alertes importantes</small>
            </div>
          </div>
          <div class="color-card">
            <div class="color-swatch" style="background: var(--golden-yellow)"></div>
            <div class="color-info">
              <h3>Jaune Doré</h3>
              <p>#F59E0B</p>
              <small>Propriétés en vedette</small>
            </div>
          </div>
        </div>
      </section>

      <!-- Démonstration des Boutons -->
      <section class="demo-section">
        <h2 class="section-title ultra-modern-text-gradient">Boutons Ultra Modernes</h2>
        <div class="buttons-demo">
          <button class="ultra-modern-btn ultra-modern-btn-primary">Bouton Principal</button>
          <button class="ultra-modern-btn ultra-modern-btn-secondary">Bouton Secondaire</button>
          <button class="ultra-modern-btn ultra-modern-btn-outline">Bouton Outline</button>
          <button class="ultra-modern-btn" style="background: linear-gradient(135deg, #10B981, #059669); color: white;">Succès</button>
          <button class="ultra-modern-btn" style="background: linear-gradient(135deg, #F59E0B, #D97706); color: white;">Attention</button>
          <button class="ultra-modern-btn" style="background: linear-gradient(135deg, #EF4444, #DC2626); color: white;">Danger</button>
        </div>
      </section>

      <!-- Démonstration des Cartes -->
      <section class="demo-section">
        <h2 class="section-title ultra-modern-text-gradient">Cartes Ultra Modernes</h2>
        <div class="cards-demo">
          <div class="ultra-modern-card">
            <h3 class="ultra-modern-text-primary">Carte Standard</h3>
            <p class="ultra-modern-text-muted">Une carte avec le style ultra moderne par défaut.</p>
            <button class="ultra-modern-btn ultra-modern-btn-primary">Action</button>
          </div>
          <div class="ultra-modern-card ultra-modern-card-featured">
            <h3 class="ultra-modern-text-gradient">Carte En Vedette</h3>
            <p class="ultra-modern-text-muted">Une carte mise en évidence avec gradient moderne.</p>
            <button class="ultra-modern-btn ultra-modern-btn-secondary">Voir Plus</button>
          </div>
          <div class="ultra-modern-card ultra-modern-card-glass">
            <h3 style="color: #10B981;">Carte Glassmorphism</h3>
            <p class="ultra-modern-text-muted">Une variante avec effet glassmorphism.</p>
            <button class="ultra-modern-btn ultra-modern-btn-outline">Découvrir</button>
          </div>
        </div>
      </section>

      <!-- Démonstration des Inputs -->
      <section class="demo-section">
        <h2 class="section-title ultra-modern-text-gradient">Champs de Saisie Ultra Modernes</h2>
        <div class="inputs-demo">
          <div class="input-group">
            <label class="ultra-modern-label">Nom complet</label>
            <input type="text" class="ultra-modern-input" placeholder="Entrez votre nom">
          </div>
          <div class="input-group">
            <label class="ultra-modern-label ultra-modern-label-gradient">Email</label>
            <input type="email" class="ultra-modern-input ultra-modern-input-gradient" placeholder="votre.email@exemple.com">
          </div>
          <div class="input-group">
            <label class="ultra-modern-label">Message</label>
            <textarea class="ultra-modern-input" rows="4" placeholder="Votre message..."></textarea>
          </div>
        </div>
      </section>

      <!-- Nouveaux Effets -->
      <section class="demo-section">
        <h2 class="section-title ultra-modern-text-gradient">Effets Ultra Modernes</h2>
        <div class="gradients-demo">
          <div class="gradient-card ultra-modern-animate-fade-scale" style="background: linear-gradient(135deg, #4300FF 0%, #0065F8 50%, #00CAFF 100%); color: white;">
            <h3>Gradient Principal Animé</h3>
          </div>
          <div class="gradient-card ultra-modern-animate-slide-up" style="background: linear-gradient(135deg, #0065F8 0%, #00CAFF 100%); color: white;">
            <h3>Gradient Secondaire</h3>
          </div>
          <div class="gradient-card ultra-modern-animate-pulse" style="background: linear-gradient(135deg, rgba(67, 0, 255, 0.2) 0%, rgba(0, 202, 255, 0.1) 100%); backdrop-filter: blur(20px); color: var(--text-primary);">
            <h3>Effet Glassmorphism</h3>
          </div>
          <div class="gradient-card" style="background: var(--ultra-light-gray); border: 2px solid transparent; background-clip: padding-box; background-image: linear-gradient(white, white), linear-gradient(135deg, #4300FF, #00CAFF); color: var(--text-primary);">
            <h3>Bordure Gradient</h3>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import ThemeToggle from './ThemeToggle.vue'
// Composant de démonstration des couleurs
</script>

<style scoped>
@import url('../assets/cyber-theme.css');

.color-palette-demo {
  min-height: 100vh;
  background: var(--hero-gradient);
  padding: 2rem;
}

.demo-container {
  max-width: 1200px;
  margin: 0 auto;
}

.demo-header {
  text-align: center;
  margin-bottom: 3rem;
}

.demo-header h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.demo-header p {
  font-size: 1.2rem;
}

.color-section {
  margin-bottom: 3rem;
}

.demo-section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.color-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--border-radius-large);
  padding: 1.5rem;
  box-shadow: var(--shadow-card);
  transition: var(--transition-smooth);
}

.color-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-hover);
}

.color-swatch {
  width: 100%;
  height: 80px;
  border-radius: var(--border-radius-medium);
  margin-bottom: 1rem;
}

.color-info h3 {
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.color-info p {
  color: var(--text-blue);
  font-family: monospace;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.color-info small {
  color: var(--text-muted);
  font-style: italic;
}

.buttons-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.cards-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.inputs-demo {
  max-width: 600px;
  margin: 0 auto;
}

.input-group {
  margin-bottom: 1.5rem;
}

.gradients-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.gradient-card {
  padding: 2rem;
  border-radius: var(--border-radius-large);
  text-align: center;
  color: white;
  font-weight: 600;
  box-shadow: var(--shadow-card);
  transition: var(--transition-smooth);
}

.gradient-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-elevated);
}

.gradient-card h3 {
  margin: 0;
  font-size: 1.25rem;
}

/* Responsive */
@media (max-width: 768px) {
  .demo-header h1 {
    font-size: 2rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .color-grid {
    grid-template-columns: 1fr;
  }
  
  .cards-demo {
    grid-template-columns: 1fr;
  }
  
  .buttons-demo {
    flex-direction: column;
    align-items: center;
  }
  
  .gradients-demo {
    grid-template-columns: 1fr;
  }
}
</style>
