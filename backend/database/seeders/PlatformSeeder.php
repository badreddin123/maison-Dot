<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class PlatformSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Nettoyer les tables dans l'ordre inverse des dépendances
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('activity_logs')->truncate();
        DB::table('notifications')->truncate();
        DB::table('reviews')->truncate();
        DB::table('invoices')->truncate();
        DB::table('bookings')->truncate();
        DB::table('properties')->truncate();
        DB::table('users')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Créer les utilisateurs
        $users = [
            [
                'id' => 1,
                'name' => 'Administrateur Principal',
                'email' => 'admin@projetvuelaravel.com',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'status' => 'active',
                'phone' => '+33123456789',
                'address' => '123 Rue de l\'Administration, 75001 Paris',
                'email_verified_at' => Carbon::now(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => 2,
                'name' => 'Pierre Martin',
                'email' => 'pierre.martin@property.com',
                'password' => Hash::make('password'),
                'role' => 'manager',
                'status' => 'active',
                'phone' => '+33987654321',
                'address' => '45 Avenue des Propriétaires, 75008 Paris',
                'email_verified_at' => Carbon::now(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => 3,
                'name' => 'Sophie Dubois',
                'email' => 'sophie.dubois@immobilier.com',
                'password' => Hash::make('password'),
                'role' => 'manager',
                'status' => 'active',
                'phone' => '+33456789123',
                'address' => '78 Boulevard des Managers, 69001 Lyon',
                'email_verified_at' => Carbon::now(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => 4,
                'name' => 'Manager en Attente',
                'email' => 'manager.pending@test.com',
                'password' => Hash::make('password'),
                'role' => 'manager',
                'status' => 'pending',
                'phone' => '+33789123456',
                'address' => '90 Rue de l\'Attente, 13001 Marseille',
                'email_verified_at' => Carbon::now(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => 5,
                'name' => 'Marie Leblanc',
                'email' => 'marie.leblanc@client.com',
                'password' => Hash::make('password'),
                'role' => 'client',
                'status' => 'active',
                'phone' => '+33321654987',
                'address' => '12 Rue des Clients, 33000 Bordeaux',
                'email_verified_at' => Carbon::now(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => 6,
                'name' => 'Jean Durand',
                'email' => 'jean.durand@email.com',
                'password' => Hash::make('password'),
                'role' => 'client',
                'status' => 'active',
                'phone' => '+33654987321',
                'address' => '34 Avenue des Voyageurs, 06000 Nice',
                'email_verified_at' => Carbon::now(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => 7,
                'name' => 'Test Client',
                'email' => 'test@client.com',
                'password' => Hash::make('password'),
                'role' => 'client',
                'status' => 'active',
                'phone' => '+33147258369',
                'address' => '56 Place des Tests, 75010 Paris',
                'email_verified_at' => Carbon::now(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        DB::table('users')->insert($users);

        // Créer les propriétés
        $properties = [
            [
                'id' => 1,
                'manager_id' => 2,
                'title' => 'Appartement Luxueux Centre-Ville Paris',
                'description' => 'Magnifique appartement au cœur de Paris avec vue sur les Champs-Élysées. Entièrement rénové avec des finitions haut de gamme.',
                'type' => 'apartment',
                'price_per_night' => 250.00,
                'address' => '123 Avenue des Champs-Élysées, 75008 Paris',
                'latitude' => 48.8566,
                'longitude' => 2.3522,
                'bedrooms' => 3,
                'bathrooms' => 2,
                'area' => 85.50,
                'guests' => 6,
                'amenities' => json_encode(['wifi', 'parking', 'kitchen', 'tv', 'washing_machine', 'air_conditioning', 'elevator']),
                'images' => json_encode([
                    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
                    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
                    'https://images.unsplash.com/photo-1560449752-5852b5e36e16?w=800'
                ]),
                'status' => 'available',
                'rating' => 4.8,
                'reviews_count' => 12,
                'featured' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => 2,
                'manager_id' => 2,
                'title' => 'Maison de Charme Montmartre',
                'description' => 'Charmante maison traditionnelle dans le quartier artistique de Montmartre. Idéale pour découvrir le Paris authentique.',
                'type' => 'house',
                'price_per_night' => 180.00,
                'address' => '45 Rue des Abbesses, 75018 Paris',
                'latitude' => 48.8867,
                'longitude' => 2.3431,
                'bedrooms' => 4,
                'bathrooms' => 3,
                'area' => 120.00,
                'guests' => 8,
                'amenities' => json_encode(['wifi', 'kitchen', 'tv', 'washing_machine', 'garden', 'balcony']),
                'images' => json_encode([
                    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
                    'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800'
                ]),
                'status' => 'available',
                'rating' => 4.6,
                'reviews_count' => 8,
                'featured' => false,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => 3,
                'manager_id' => 3,
                'title' => 'Bureau Moderne Lyon Part-Dieu',
                'description' => 'Espace de bureau moderne et équipé dans le quartier d\'affaires de Lyon. Parfait pour les entreprises en déplacement.',
                'type' => 'office',
                'price_per_night' => 120.00,
                'address' => '89 Rue de la République, 69002 Lyon',
                'latitude' => 45.7640,
                'longitude' => 4.8357,
                'bedrooms' => 0,
                'bathrooms' => 2,
                'area' => 75.00,
                'guests' => 10,
                'amenities' => json_encode(['wifi', 'parking', 'air_conditioning', 'elevator']),
                'images' => json_encode([
                    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800',
                    'https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?w=800'
                ]),
                'status' => 'available',
                'rating' => 4.5,
                'reviews_count' => 5,
                'featured' => false,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => 4,
                'manager_id' => 3,
                'title' => 'Appartement Standing Lyon Bellecour',
                'description' => 'Appartement de standing avec vue sur la Place Bellecour. Décoré avec goût et entièrement équipé.',
                'type' => 'apartment',
                'price_per_night' => 150.00,
                'address' => '12 Place Bellecour, 69002 Lyon',
                'latitude' => 45.7578,
                'longitude' => 4.8320,
                'bedrooms' => 2,
                'bathrooms' => 1,
                'area' => 60.00,
                'guests' => 4,
                'amenities' => json_encode(['wifi', 'kitchen', 'tv', 'washing_machine', 'balcony']),
                'images' => json_encode([
                    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
                    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800'
                ]),
                'status' => 'available',
                'rating' => 4.7,
                'reviews_count' => 9,
                'featured' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => 5,
                'manager_id' => 2,
                'title' => 'Studio Moderne République',
                'description' => 'Studio moderne et fonctionnel près de la Place de la République. Idéal pour un séjour court en solo ou en couple.',
                'type' => 'apartment',
                'price_per_night' => 85.00,
                'address' => '67 Boulevard de Magenta, 75010 Paris',
                'latitude' => 48.8709,
                'longitude' => 2.3550,
                'bedrooms' => 1,
                'bathrooms' => 1,
                'area' => 35.00,
                'guests' => 2,
                'amenities' => json_encode(['wifi', 'kitchen', 'tv', 'elevator']),
                'images' => json_encode([
                    'https://images.unsplash.com/photo-1551776235-dde6d482980b?w=800',
                    'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800'
                ]),
                'status' => 'available',
                'rating' => 4.3,
                'reviews_count' => 6,
                'featured' => false,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        DB::table('properties')->insert($properties);

        // Créer les réservations
        $bookings = [
            [
                'id' => 1,
                'property_id' => 1,
                'client_id' => 5,
                'start_date' => '2024-02-15',
                'end_date' => '2024-02-20',
                'total_price' => 1250.00,
                'guests' => 4,
                'status' => 'confirmed',
                'special_requests' => 'Arrivée tardive souhaitée vers 22h',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => 2,
                'property_id' => 2,
                'client_id' => 6,
                'start_date' => '2024-02-01',
                'end_date' => '2024-02-07',
                'total_price' => 1080.00,
                'guests' => 6,
                'status' => 'completed',
                'special_requests' => 'Besoin d\'un lit bébé',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => 3,
                'property_id' => 4,
                'client_id' => 5,
                'start_date' => '2024-03-10',
                'end_date' => '2024-03-15',
                'total_price' => 750.00,
                'guests' => 2,
                'status' => 'pending',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => 4,
                'property_id' => 5,
                'client_id' => 6,
                'start_date' => '2024-04-01',
                'end_date' => '2024-04-03',
                'total_price' => 170.00,
                'guests' => 1,
                'status' => 'confirmed',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'id' => 5,
                'property_id' => 3,
                'client_id' => 7,
                'start_date' => '2024-03-01',
                'end_date' => '2024-03-05',
                'total_price' => 480.00,
                'guests' => 8,
                'status' => 'pending',
                'special_requests' => 'Réunion d\'entreprise',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        DB::table('bookings')->insert($bookings);

        // Créer les factures
        $invoices = [
            [
                'booking_id' => 1,
                'invoice_number' => 'INV-2024-001',
                'amount' => 1250.00,
                'tax_amount' => 250.00,
                'total_amount' => 1500.00,
                'status' => 'paid',
                'due_date' => '2024-02-10',
                'paid_at' => Carbon::parse('2024-02-08 14:30:00'),
                'payment_method' => 'credit_card',
                'payment_reference' => 'CC_2024_001',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'booking_id' => 2,
                'invoice_number' => 'INV-2024-002',
                'amount' => 1080.00,
                'tax_amount' => 216.00,
                'total_amount' => 1296.00,
                'status' => 'paid',
                'due_date' => '2024-01-25',
                'paid_at' => Carbon::parse('2024-01-23 09:15:00'),
                'payment_method' => 'paypal',
                'payment_reference' => 'PP_2024_002',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'booking_id' => 4,
                'invoice_number' => 'INV-2024-003',
                'amount' => 170.00,
                'tax_amount' => 34.00,
                'total_amount' => 204.00,
                'status' => 'pending',
                'due_date' => '2024-03-25',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        DB::table('invoices')->insert($invoices);

        // Créer les avis
        $reviews = [
            [
                'booking_id' => 2,
                'property_id' => 2,
                'client_id' => 6,
                'rating' => 5,
                'comment' => 'Séjour absolument parfait ! La maison était magnifique, très bien située et impeccablement propre. Pierre a été un hôte exceptionnel, très réactif et aux petits soins. Je recommande vivement !',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'booking_id' => 1,
                'property_id' => 1,
                'client_id' => 5,
                'rating' => 5,
                'comment' => 'Appartement de rêve avec une vue imprenable ! Tout était parfait, de l\'accueil à l\'emplacement. Nous reviendrons sans hésiter.',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        DB::table('reviews')->insert($reviews);

        // Créer les notifications
        $notifications = [
            [
                'user_id' => 1,
                'type' => 'manager_approval',
                'title' => 'Nouvelle demande manager',
                'message' => 'Un nouvel utilisateur demande l\'approbation de son compte manager',
                'data' => json_encode(['user_id' => 4, 'user_name' => 'Manager en Attente']),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'user_id' => 2,
                'type' => 'booking_created',
                'title' => 'Nouvelle réservation',
                'message' => 'Une nouvelle réservation a été effectuée pour votre propriété "Appartement Luxueux Centre-Ville Paris"',
                'data' => json_encode(['booking_id' => 1, 'property_id' => 1]),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'user_id' => 5,
                'type' => 'booking_confirmed',
                'title' => 'Réservation confirmée',
                'message' => 'Votre réservation pour "Appartement Luxueux Centre-Ville Paris" a été confirmée',
                'data' => json_encode(['booking_id' => 1, 'property_id' => 1]),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        DB::table('notifications')->insert($notifications);

        // Créer quelques logs d'activité
        $activityLogs = [
            [
                'user_id' => 1,
                'action' => 'user_login',
                'description' => 'Connexion de l\'administrateur',
                'ip_address' => '127.0.0.1',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'created_at' => Carbon::now(),
            ],
            [
                'user_id' => 2,
                'action' => 'property_created',
                'resource_type' => 'Property',
                'resource_id' => 1,
                'description' => 'Création de la propriété "Appartement Luxueux Centre-Ville Paris"',
                'ip_address' => '192.168.1.100',
                'user_agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                'created_at' => Carbon::now(),
            ],
            [
                'user_id' => 5,
                'action' => 'booking_created',
                'resource_type' => 'Booking',
                'resource_id' => 1,
                'description' => 'Création d\'une réservation pour la propriété #1',
                'ip_address' => '10.0.0.15',
                'user_agent' => 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15',
                'created_at' => Carbon::now(),
            ],
        ];

        DB::table('activity_logs')->insert($activityLogs);

        $this->command->info('✅ Base de données peuplée avec succès !');
        $this->command->info('📊 Données créées :');
        $this->command->info('   - 7 utilisateurs (1 admin, 3 managers, 3 clients)');
        $this->command->info('   - 5 propriétés');
        $this->command->info('   - 5 réservations');
        $this->command->info('   - 3 factures');
        $this->command->info('   - 2 avis');
        $this->command->info('   - 3 notifications');
        $this->command->info('   - 3 logs d\'activité');
        $this->command->info('');
        $this->command->info('🔑 Comptes de test :');
        $this->command->info('   Admin: admin@projetvuelaravel.com / password');
        $this->command->info('   Manager: pierre.martin@property.com / password');
        $this->command->info('   Client: marie.leblanc@client.com / password');
    }
}
