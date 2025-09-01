# Script PowerShell pour créer la base de données projetvuelaravel
# Compatible avec XAMPP, WAMP, et MySQL autonome

Write-Host "=== CREATION DE LA BASE DE DONNEES PROJETVUELARAVEL ===" -ForegroundColor Green

# Configuration
$databaseName = "projetvuelaravel"
$sqlFile = "database\create_database.sql"
$username = "root"
$password = ""

# Chemins possibles pour MySQL
$mysqlPaths = @(
    "C:\xampp\mysql\bin\mysql.exe",
    "C:\wamp64\bin\mysql\mysql8.0.31\bin\mysql.exe",
    "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe",
    "mysql"
)

# Chercher MySQL
$mysqlExecutable = $null
foreach ($path in $mysqlPaths) {
    if ($path -eq "mysql") {
        try {
            mysql --version 2>$null
            if ($LASTEXITCODE -eq 0) {
                $mysqlExecutable = "mysql"
                Write-Host "MySQL trouvé dans le PATH système" -ForegroundColor Green
                break
            }
        } catch { continue }
    } elseif (Test-Path $path) {
        $mysqlExecutable = $path
        Write-Host "MySQL trouvé: $path" -ForegroundColor Green
        break
    }
}

if (-not $mysqlExecutable) {
    Write-Host "MySQL non trouvé!" -ForegroundColor Red
    Write-Host "Vérifiez que XAMPP/WAMP/MySQL est installé et démarré" -ForegroundColor Yellow
    Write-Host "Ou utilisez phpMyAdmin: http://localhost/phpmyadmin" -ForegroundColor Cyan
    exit 1
}

# Vérifier que le fichier SQL existe
if (-not (Test-Path $sqlFile)) {
    Write-Host "Fichier SQL non trouvé: $sqlFile" -ForegroundColor Red
    exit 1
}

Write-Host "Exécution du script SQL..." -ForegroundColor Yellow

# Exécuter le script SQL
try {
    $result = Get-Content $sqlFile | & $mysqlExecutable -u $username 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Base de données créée avec succès!" -ForegroundColor Green
        
        Write-Host ""
        Write-Host "=== RESUME DE LA CREATION ===" -ForegroundColor Cyan
        Write-Host "Base de données: $databaseName" -ForegroundColor White
        Write-Host "Tables créées: users, properties, bookings, invoices, subscriptions" -ForegroundColor White
        Write-Host "Utilisateurs de test: 5 comptes créés" -ForegroundColor White
        Write-Host "Propriétés de test: 5 propriétés créées" -ForegroundColor White
        
        Write-Host ""
        Write-Host "=== COMPTES DE TEST ===" -ForegroundColor Cyan
        Write-Host "Admin: admin@projetvuelaravel.com" -ForegroundColor White
        Write-Host "Manager: manager@projetvuelaravel.com" -ForegroundColor White
        Write-Host "Client: client@projetvuelaravel.com" -ForegroundColor White
        Write-Host "Mot de passe pour tous: password" -ForegroundColor Yellow
        
        Write-Host ""
        Write-Host "=== PROCHAINES ETAPES ===" -ForegroundColor Cyan
        Write-Host "1. Démarrer Laravel: php artisan serve" -ForegroundColor White
        Write-Host "2. Démarrer Vue.js: cd frontend && npm run dev" -ForegroundColor White
        Write-Host "3. Tester sur: http://localhost:3000" -ForegroundColor White
        
    } else {
        Write-Host "Erreur lors de l'exécution du script SQL" -ForegroundColor Red
        Write-Host "Résultat: $result" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "Erreur inattendue: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== ALTERNATIVES ===" -ForegroundColor Cyan
Write-Host "Si ce script ne fonctionne pas:" -ForegroundColor White
Write-Host "1. Utilisez phpMyAdmin: http://localhost/phpmyadmin" -ForegroundColor Gray
Write-Host "2. Importez le fichier: database/create_database.sql" -ForegroundColor Gray
Write-Host "3. Ou utilisez les migrations: php artisan migrate:fresh" -ForegroundColor Gray

Write-Host ""
Write-Host "Script terminé." -ForegroundColor Green
