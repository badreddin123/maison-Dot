# Guide de démarrage rapide - API d'authentification

## Prérequis
- PHP 8.1 ou supérieur
- Composer
- Laravel (déjà installé dans ce projet)
- Base de données (MySQL, PostgreSQL, SQLite, etc.)

## Installation et configuration

### 1. Configuration de l'environnement
```bash
# Copiez le fichier .env.example vers .env (si pas déjà fait)
cp .env.example .env

# Générez la clé d'application Laravel
php artisan key:generate
```

### 2. Configuration de la base de données
Éditez le fichier `.env` et configurez votre base de données :
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=votre_base_de_donnees
DB_USERNAME=votre_utilisateur
DB_PASSWORD=votre_mot_de_passe
```

### 3. Exécution des migrations
```bash
# Exécutez les migrations pour créer les tables
php artisan migrate

# Optionnel : Seedez la base avec des données de test
php artisan db:seed
```

### 4. Installation des dépendances (si nécessaire)
```bash
# Si Sanctum n'est pas installé
composer require laravel/sanctum

# Publiez les migrations de Sanctum (si nécessaire)
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

### 5. Démarrage du serveur
```bash
# Démarrez le serveur de développement Laravel
php artisan serve

# Le serveur sera accessible à : http://localhost:8000
```

## Test des API

### Avec PowerShell (Windows)
```powershell
# Test d'inscription
$registerData = @{
    name = "Test User"
    email = "test@example.com"
    password = "password123"
    password_confirmation = "password123"
} | ConvertTo-Json

$registerResponse = Invoke-RestMethod -Uri "http://localhost:8000/api/register" -Method POST -Body $registerData -ContentType "application/json"
Write-Host "Register Response:" $registerResponse

# Test de connexion
$loginData = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:8000/api/login" -Method POST -Body $loginData -ContentType "application/json"
$token = $loginResponse.access_token
Write-Host "Login Token:" $token

# Test de récupération des informations utilisateur
$headers = @{ Authorization = "Bearer $token" }
$userInfo = Invoke-RestMethod -Uri "http://localhost:8000/api/login" -Method GET -Headers $headers -ContentType "application/json"
Write-Host "User Info:" $userInfo
```

### Avec curl (Linux/Mac/Windows avec WSL)
```bash
# Test d'inscription
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","password_confirmation":"password123"}'

# Test de connexion
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Endpoints disponibles

### Routes publiques
- `POST /api/register` - Inscription
- `POST /api/login` - Connexion

### Routes protégées (nécessitent un token)
- `GET /api/login` - Informations utilisateur
- `PUT /api/login` - Mise à jour utilisateur  
- `DELETE /api/login` - Suppression utilisateur
- `GET /api/register` - Informations utilisateur
- `PUT /api/register` - Mise à jour utilisateur
- `DELETE /api/register` - Suppression utilisateur
- `POST /api/logout` - Déconnexion (appareil actuel)
- `POST /api/logout-all` - Déconnexion (tous appareils)

## Tests automatiques
```bash
# Exécutez les tests
php artisan test

# Exécutez seulement les tests d'authentification
php artisan test tests/Feature/AuthTest.php
```

## Structure des fichiers créés
```
backend/
├── app/Http/Controllers/AuthController.php  # Contrôleur principal
├── app/Http/Middleware/ApiAuthenticate.php  # Middleware personnalisé
├── routes/api.php                           # Routes API modifiées
├── tests/Feature/AuthTest.php              # Tests automatiques
├── API_DOCUMENTATION.md                    # Documentation complète
├── CURL_EXAMPLES.md                        # Exemples cURL
└── QUICK_START.md                          # Ce guide
```

## Troubleshooting

### Erreur de token
Si vous recevez une erreur "Unauthenticated", vérifiez que :
1. Le token est correct
2. Le header Authorization est bien formaté : `Bearer YOUR_TOKEN`
3. Le token n'a pas expiré

### Erreur CORS
Si vous avez des problèmes CORS depuis le frontend :
1. Vérifiez la configuration dans `config/cors.php`
2. Assurez-vous que votre domaine frontend est autorisé

### Erreur de base de données
1. Vérifiez la configuration dans `.env`
2. Assurez-vous que la base de données existe
3. Exécutez `php artisan migrate` pour créer les tables
