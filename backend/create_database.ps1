# Script PowerShell pour créer la base de données projetvuelaravel
# Auteur: GitHub Copilot Assistant
# Date: 2025-08-14
# Compatible avec XAMPP, WAMP, MAMP et installations MySQL autonomes

Write-Host "=== CRÉATION DE LA BASE DE DONNÉES PROJETVUELARAVEL ===" -ForegroundColor Green

# Configuration
$databaseName = "projetvuelaravel"
$sqlFile = "database\create_database.sql"
$username = "root"
$password = ""

# Chemins possibles pour MySQL
$mysqlPaths = @(
    "C:\xampp\mysql\bin\mysql.exe",           # XAMPP
    "C:\wamp64\bin\mysql\mysql8.0.31\bin\mysql.exe", # WAMP (ajustez la version)
    "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe", # MySQL autonome
    "mysql"  # MySQL dans le PATH
)

# Fonction pour tester la connexion MySQL
function Test-MySQLConnection {
    param($mysqlPath, $user, $pass)
    
    try {
        if ($pass -eq "") {
            $testQuery = "SELECT 1;"
            $result = $testQuery | & $mysqlPath -u $user --silent 2>$null
        } else {
            $testQuery = "SELECT 1;"
            $result = $testQuery | & $mysqlPath -u $user -p$pass --silent 2>$null
        }
        return $LASTEXITCODE -eq 0
    } catch {
        return $false
    }
}

# Chercher MySQL
$mysqlExecutable = $null
foreach ($path in $mysqlPaths) {
    if ($path -eq "mysql") {
        # Tester si mysql est dans le PATH
        try {
            mysql --version 2>$null
            if ($LASTEXITCODE -eq 0) {
                $mysqlExecutable = "mysql"
                Write-Host "✅ MySQL trouvé dans le PATH système" -ForegroundColor Green
                break
            }
        } catch { continue }
    } elseif (Test-Path $path) {
        $mysqlExecutable = $path
        Write-Host "✅ MySQL trouvé: $path" -ForegroundColor Green
        break
    }
}

if (-not $mysqlExecutable) {
    Write-Host "❌ MySQL non trouvé!" -ForegroundColor Red
    Write-Host "Vérifiez que l'un de ces services est installé et démarré:" -ForegroundColor Yellow
    Write-Host "- XAMPP (https://www.apachefriends.org/)" -ForegroundColor Gray
    Write-Host "- WAMP (https://www.wampserver.com/)" -ForegroundColor Gray
    Write-Host "- MySQL autonome (https://dev.mysql.com/downloads/)" -ForegroundColor Gray
    Write-Host "`nOu utilisez phpMyAdmin: http://localhost/phpmyadmin" -ForegroundColor Cyan
    exit 1
}

# Tester la connexion
Write-Host "🔄 Test de la connexion à MySQL..." -ForegroundColor Yellow
if (-not (Test-MySQLConnection $mysqlExecutable $username $password)) {
    Write-Host "❌ Impossible de se connecter à MySQL!" -ForegroundColor Red
    Write-Host "Vérifiez que:" -ForegroundColor Yellow
    Write-Host "- Le service MySQL est démarré" -ForegroundColor Gray
    Write-Host "- Les identifiants sont corrects (utilisateur: $username)" -ForegroundColor Gray
    Write-Host "- Aucun mot de passe root n'est défini" -ForegroundColor Gray
    exit 1
}

Write-Host "✅ Connexion MySQL réussie!" -ForegroundColor Green

# Vérifier que le fichier SQL existe
if (-not (Test-Path $sqlFile)) {
    Write-Host "❌ Fichier SQL non trouvé: $sqlFile" -ForegroundColor Red
    exit 1
}

Write-Host "🔄 Exécution du script SQL..." -ForegroundColor Yellow

# Exécuter le script SQL
try {
    if ($password -eq "") {
        Get-Content $sqlFile | & $mysqlExecutable -u $username
    } else {
        Get-Content $sqlFile | & $mysqlExecutable -u $username -p$password
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Base de données créée avec succès!" -ForegroundColor Green
        
        # Afficher un résumé
        Write-Host "`n=== RÉSUMÉ DE LA CRÉATION ===" -ForegroundColor Cyan
        Write-Host "📊 Base de données: $databaseName" -ForegroundColor White
        Write-Host "📋 Tables créées: users, properties, bookings, invoices, subscriptions" -ForegroundColor White
        Write-Host "👥 Utilisateurs de test: 5 comptes créés" -ForegroundColor White
        Write-Host "🏠 Propriétés de test: 5 propriétés créées" -ForegroundColor White
        Write-Host "📅 Réservations de test: 4 réservations créées" -ForegroundColor White
        
        Write-Host "`n=== COMPTES DE TEST ===" -ForegroundColor Cyan
        Write-Host "🔐 Admin: admin@projetvuelaravel.com" -ForegroundColor White
        Write-Host "🏢 Manager: manager@projetvuelaravel.com" -ForegroundColor White
        Write-Host "👤 Client: client@projetvuelaravel.com" -ForegroundColor White
        Write-Host "🔑 Mot de passe pour tous: password" -ForegroundColor Yellow
        
        Write-Host "`n=== PROCHAINES ÉTAPES ===" -ForegroundColor Cyan
        Write-Host "1. Démarrer le serveur Laravel:" -ForegroundColor White
        Write-Host "   php artisan serve" -ForegroundColor Gray
        Write-Host "2. Démarrer le serveur Vue.js:" -ForegroundColor White
        Write-Host "   cd frontend && npm run dev" -ForegroundColor Gray
        Write-Host "3. Tester l'application sur:" -ForegroundColor White
        Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Gray
        Write-Host "   Backend API: http://localhost:8000" -ForegroundColor Gray
        
    } else {
        Write-Host "❌ Erreur lors de l'exécution du script SQL" -ForegroundColor Red
        Write-Host "Code d'erreur: $LASTEXITCODE" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "❌ Erreur inattendue: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== ALTERNATIVES ===" -ForegroundColor Cyan
Write-Host "Si ce script ne fonctionne pas, vous pouvez:" -ForegroundColor White
Write-Host "1. Utiliser phpMyAdmin:" -ForegroundColor Gray
Write-Host "   - Ouvrir: http://localhost/phpmyadmin" -ForegroundColor Gray
Write-Host "   - Cliquer sur 'Importer'" -ForegroundColor Gray
Write-Host "   - Sélectionner: database/create_database.sql" -ForegroundColor Gray
Write-Host "   - Cliquer sur 'Exécuter'" -ForegroundColor Gray
Write-Host "2. Utiliser les migrations Laravel:" -ForegroundColor Gray
Write-Host "   - php artisan migrate:fresh --seed" -ForegroundColor Gray

Write-Host "Script terminé." -ForegroundColor Green
