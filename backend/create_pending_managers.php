<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

echo "=== CRÉATION DE MANAGERS EN ATTENTE POUR TEST ===\n\n";

// Données des managers en attente
$pendingManagers = [
    [
        'name' => 'Sophie Delcroix',
        'email' => 'sophie.delcroix@testmanager.com',
        'password' => Hash::make('password'),
        'role' => 'manager',
        'status' => 'pending',
        'phone' => '+33123456701',
        'address' => '45 Rue de la Paix, 75001 Paris'
    ],
    [
        'name' => 'Marc Dubois',
        'email' => 'marc.dubois@testmanager.com',
        'password' => Hash::make('password'),
        'role' => 'manager',
        'status' => 'pending',
        'phone' => '+33123456702',
        'address' => '78 Avenue des Champs, 69000 Lyon'
    ],
    [
        'name' => 'Laura Martinez',
        'email' => 'laura.martinez@testmanager.com',
        'password' => Hash::make('password'),
        'role' => 'manager',
        'status' => 'pending',
        'phone' => '+33123456703',
        'address' => '23 Boulevard Saint-Michel, 13000 Marseille'
    ],
    [
        'name' => 'Thomas Bernard',
        'email' => 'thomas.bernard@testmanager.com',
        'password' => Hash::make('password'),
        'role' => 'manager',
        'status' => 'pending',
        'phone' => '+33123456704',
        'address' => '67 Rue Victor Hugo, 33000 Bordeaux'
    ],
    [
        'name' => 'Amélie Rousseau',
        'email' => 'amelie.rousseau@testmanager.com',
        'password' => Hash::make('password'),
        'role' => 'manager',
        'status' => 'pending',
        'phone' => '+33123456705',
        'address' => '12 Place de la République, 06000 Nice'
    ]
];

foreach ($pendingManagers as $managerData) {
    // Vérifier si l'utilisateur existe déjà
    $existingUser = User::where('email', $managerData['email'])->first();
    
    if ($existingUser) {
        // Mettre à jour le statut à 'pending'
        $existingUser->update(['status' => 'pending']);
        echo "✅ Statut mis à jour pour: " . $existingUser->name . " (" . $existingUser->email . ")\n";
    } else {
        // Créer un nouvel utilisateur
        $user = User::create($managerData);
        echo "🆕 Nouveau manager en attente créé: " . $user->name . " (" . $user->email . ")\n";
    }
}

echo "\n=== VÉRIFICATION DES MANAGERS EN ATTENTE ===\n\n";

$pendingCount = User::where('role', 'manager')->where('status', 'pending')->count();
$activeCount = User::where('role', 'manager')->where('status', 'active')->count();

echo "📊 Managers en attente: {$pendingCount}\n";
echo "📊 Managers actifs: {$activeCount}\n";

if ($pendingCount > 0) {
    echo "\n📋 Liste des managers en attente:\n";
    $pending = User::where('role', 'manager')->where('status', 'pending')->get();
    foreach ($pending as $manager) {
        echo "   - {$manager->name} ({$manager->email}) - Créé: {$manager->created_at}\n";
    }
    echo "\n✅ Les managers en attente sont maintenant disponibles pour le test.\n";
} else {
    echo "\n❌ Aucun manager en attente trouvé.\n";
}

echo "\n=== RÉSUMÉ ===\n";
echo "🎯 L'alerte du dashboard devrait maintenant afficher: {$pendingCount} demandes\n";
echo "🎯 La page /admin/pending-managers devrait afficher {$pendingCount} managers\n";
echo "🎯 Testez maintenant les fonctionnalités d'alerte dans le dashboard admin.\n";
