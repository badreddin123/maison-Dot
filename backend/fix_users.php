<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

echo "=== MISE À JOUR DES UTILISATEURS SELON LE GUIDE ===\n\n";

// Supprimer tous les utilisateurs existants
User::truncate();
echo "Tous les utilisateurs existants ont été supprimés.\n\n";

// Créer les utilisateurs selon le guide
$usersData = [
    [
        'name' => 'Administrateur Principal',
        'email' => 'admin@projetvuelaravel.com',
        'password' => Hash::make('password'),
        'role' => 'admin',
        'status' => 'active',
        'phone' => '+33123456789',
        'address' => '123 Rue de l\'Administration, 75001 Paris'
    ],
    [
        'name' => 'Manager Principal',
        'email' => 'manager@projetvuelaravel.com',
        'password' => Hash::make('password'),
        'role' => 'manager',
        'status' => 'active',
        'phone' => '+33987654321',
        'address' => '45 Avenue des Managers, 75008 Paris'
    ],
    [
        'name' => 'Client Principal',
        'email' => 'client@projetvuelaravel.com',
        'password' => Hash::make('password'),
        'role' => 'client',
        'status' => 'active',
        'phone' => '+33456789123',
        'address' => '67 Rue des Clients, 75009 Paris'
    ],
    [
        'name' => 'Jean Dupont',
        'email' => 'jean.dupont@example.com',
        'password' => Hash::make('password'),
        'role' => 'manager',
        'status' => 'active',
        'phone' => '+33234567890',
        'address' => '89 Boulevard Jean Dupont, 69001 Lyon'
    ],
    [
        'name' => 'Marie Martin',
        'email' => 'marie.martin@example.com',
        'password' => Hash::make('password'),
        'role' => 'client',
        'status' => 'active',
        'phone' => '+33345678901',
        'address' => '12 Avenue Marie Martin, 13001 Marseille'
    ]
];

foreach ($usersData as $userData) {
    $user = User::create($userData);
    echo "Utilisateur créé: " . $user->name . " (" . $user->email . ") - Rôle: " . $user->role . "\n";
}

echo "\n=== VÉRIFICATION DES MOTS DE PASSE ===\n\n";

// Vérifier que les mots de passe fonctionnent
foreach (User::all() as $user) {
    $passwordCheck = Hash::check('password', $user->password);
    echo "Utilisateur: " . $user->email . " - Mot de passe 'password' fonctionne: " . ($passwordCheck ? 'OUI' : 'NON') . "\n";
}

echo "\n=== RÉSUMÉ FINAL ===\n\n";
echo "Nombre total d'utilisateurs: " . User::count() . "\n";
echo "Administrateurs: " . User::where('role', 'admin')->count() . "\n";
echo "Managers: " . User::where('role', 'manager')->count() . "\n";
echo "Clients: " . User::where('role', 'client')->count() . "\n";

echo "\n=== COMPTES DE CONNEXION ===\n\n";
echo "🔐 TOUS LES COMPTES UTILISENT LE MOT DE PASSE: password\n\n";

echo "👑 ADMINISTRATEUR:\n";
echo "Email: admin@projetvuelaravel.com\n";
echo "Mot de passe: password\n\n";

echo "👨‍💼 MANAGERS:\n";
echo "Email: manager@projetvuelaravel.com\n";
echo "Email: jean.dupont@example.com\n";
echo "Mot de passe: password\n\n";

echo "👥 CLIENTS:\n";
echo "Email: client@projetvuelaravel.com\n";
echo "Email: marie.martin@example.com\n";
echo "Mot de passe: password\n\n";

echo "✅ Mise à jour terminée avec succès !\n";
