<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer un utilisateur admin
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@projetvuelaravel.com',
            'password' => Hash::make('password'),
            'role' => User::ROLE_ADMIN,
            'status' => User::STATUS_ACTIVE,
        ]);

        // Créer un utilisateur de test
        User::create([
            'name' => 'Test User',
            'email' => 'test@projetvuelaravel.com',
            'password' => Hash::make('password'),
            'role' => User::ROLE_CLIENT,
            'status' => User::STATUS_ACTIVE,
        ]);

        // Créer quelques utilisateurs supplémentaires
        User::create([
            'name' => 'John Doe',
            'email' => 'john@projetvuelaravel.com',
            'password' => Hash::make('password123'),
            'role' => User::ROLE_CLIENT,
            'status' => User::STATUS_ACTIVE,
        ]);

        User::create([
            'name' => 'Jane Smith',
            'email' => 'jane@projetvuelaravel.com',
            'password' => Hash::make('password123'),
            'role' => User::ROLE_MANAGER,
            'status' => User::STATUS_ACTIVE,
        ]);

        // Créer un manager en attente
        User::create([
            'name' => 'Pending Manager',
            'email' => 'pending@projetvuelaravel.com',
            'password' => Hash::make('password123'),
            'role' => User::ROLE_MANAGER,
            'status' => User::STATUS_PENDING,
        ]);
    }
}
