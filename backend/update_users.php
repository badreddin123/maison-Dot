<?php

require_once 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

echo "=== MISE À JOUR DES UTILISATEURS SELON LE GUIDE ===\n\n";

// Utilisateurs selon le guide
$targetUsers = [
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

// Mettre à jour ou créer chaque utilisateur
foreach ($targetUsers as $userData) {
    $user = User::where('email', $userData['email'])->first();
    
    if ($user) {
        // Mettre à jour l'utilisateur existant
        $user->update($userData);
        echo "✅ Utilisateur mis à jour: " . $user->name . " (" . $user->email . ")\n";
    } else {
        // Créer un nouvel utilisateur
        $user = User::create($userData);
        echo "🆕 Nouvel utilisateur créé: " . $user->name . " (" . $user->email . ")\n";
    }
}

// Supprimer les utilisateurs qui ne sont pas dans le guide (optionnel)
$targetEmails = collect($targetUsers)->pluck('email')->toArray();
$usersToDelete = User::whereNotIn('email', $targetEmails)->get();

if ($usersToDelete->count() > 0) {
    echo "\n=== UTILISATEURS SUPPLÉMENTAIRES TROUVÉS ===\n";
    foreach ($usersToDelete as $user) {
        echo "❓ Utilisateur supplémentaire: " . $user->name . " (" . $user->email . ")\n";
    }
    echo "Ces utilisateurs ont été conservés. Si vous voulez les supprimer, faites-le manuellement.\n";
}

echo "\n=== VÉRIFICATION DES MOTS DE PASSE ===\n\n";

// Vérifier que les mots de passe fonctionnent pour les utilisateurs du guide
foreach ($targetEmails as $email) {
    $user = User::where('email', $email)->first();
    if ($user) {
        $passwordCheck = Hash::check('password', $user->password);
        echo "Utilisateur: " . $user->email . " - Mot de passe 'password' fonctionne: " . ($passwordCheck ? '✅ OUI' : '❌ NON') . "\n";
    }
}

echo "\n=== RÉSUMÉ FINAL ===\n\n";
echo "Nombre total d'utilisateurs: " . User::count() . "\n";
echo "Administrateurs: " . User::where('role', 'admin')->count() . "\n";
echo "Managers: " . User::where('role', 'manager')->count() . "\n";
echo "Clients: " . User::where('role', 'client')->count() . "\n";

echo "\n=== COMPTES DE CONNEXION SELON LE GUIDE ===\n\n";
echo "🔐 TOUS LES COMPTES UTILISENT LE MOT DE PASSE: password\n\n";

echo "👑 ADMINISTRATEUR:\n";
echo "   Email: admin@projetvuelaravel.com\n";
echo "   Mot de passe: password\n\n";

echo "👨‍💼 MANAGERS:\n";
echo "   Email: manager@projetvuelaravel.com\n";
echo "   Email: jean.dupont@example.com\n";
echo "   Mot de passe: password\n\n";

echo "👥 CLIENTS:\n";
echo "   Email: client@projetvuelaravel.com\n";
echo "   Email: marie.martin@example.com\n";
echo "   Mot de passe: password\n\n";

echo "✅ Mise à jour terminée avec succès !\n";
echo "Vous pouvez maintenant vous connecter avec ces comptes.\n";
