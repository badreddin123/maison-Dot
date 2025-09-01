-- Script SQL complet pour créer la base de données de la plateforme immobilière
-- Plateforme de réservation immobilière avec 3 acteurs : Clients, Managers, Administrateurs
-- Exécutez ce script dans phpMyAdmin ou dans la console MySQL

-- =================================================================================
-- CRÉATION DE LA BASE DE DONNÉES
-- =================================================================================

-- Supprimer la base de données si elle existe (attention : supprime toutes les données)
-- DROP DATABASE IF EXISTS `projetvuelaravel`;

-- Créer la base de données
CREATE DATABASE IF NOT EXISTS `projetvuelaravel` 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Utiliser la base de données
USE `projetvuelaravel`;

-- =================================================================================
-- TABLES SYSTÈME (Laravel/Sanctum)
-- =================================================================================

-- Table des migrations Laravel
CREATE TABLE IF NOT EXISTS `migrations` (
    `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `batch` int(11) NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des tokens d'accès personnel (Laravel Sanctum)
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
    `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `tokenable_id` bigint(20) UNSIGNED NOT NULL,
    `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
    `abilities` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `last_used_at` timestamp NULL DEFAULT NULL,
    `expires_at` timestamp NULL DEFAULT NULL,
    `created_at` timestamp NULL DEFAULT NULL,
    `updated_at` timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
    KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des réinitialisations de mot de passe
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
    `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `created_at` timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des tâches échouées
CREATE TABLE IF NOT EXISTS `failed_jobs` (
    `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
    `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
    `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
    `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
    `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
    PRIMARY KEY (`id`),
    UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =================================================================================
-- TABLES MÉTIER (Plateforme Immobilière)
-- =================================================================================

-- Table des utilisateurs (Clients, Managers, Administrateurs)
CREATE TABLE IF NOT EXISTS `users` (
    `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `email_verified_at` timestamp NULL DEFAULT NULL,
    `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `role` enum('client', 'manager', 'admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'client',
    `status` enum('pending', 'active', 'suspended') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
    `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `address` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `profile_picture` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `created_at` timestamp NULL DEFAULT NULL,
    `updated_at` timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `users_email_unique` (`email`),
    KEY `users_role_index` (`role`),
    KEY `users_status_index` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des propriétés (Maisons, Appartements, Bureaux)
CREATE TABLE IF NOT EXISTS `properties` (
    `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    `manager_id` bigint(20) UNSIGNED NOT NULL,
    `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `description` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `type` enum('house', 'apartment', 'office') COLLATE utf8mb4_unicode_ci NOT NULL,
    `price_per_night` decimal(10,2) NOT NULL,
    `address` text COLLATE utf8mb4_unicode_ci NOT NULL,
    `latitude` decimal(10,8) DEFAULT NULL,
    `longitude` decimal(11,8) DEFAULT NULL,
    `bedrooms` int(11) NOT NULL DEFAULT 1,
    `bathrooms` int(11) NOT NULL DEFAULT 1,
    `area` decimal(8,2) DEFAULT NULL COMMENT 'Surface en m²',
    `guests` int(11) NOT NULL DEFAULT 2,
    `amenities` json DEFAULT NULL COMMENT 'Équipements (wifi, parking, etc.)',
    `images` json DEFAULT NULL COMMENT 'URLs des images',
    `status` enum('available', 'occupied', 'maintenance') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'available',
    `rating` decimal(3,2) DEFAULT NULL COMMENT 'Note moyenne (0-5)',
    `reviews_count` int(11) NOT NULL DEFAULT 0,
    `featured` boolean NOT NULL DEFAULT FALSE,
    `created_at` timestamp NULL DEFAULT NULL,
    `updated_at` timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `properties_manager_id_foreign` (`manager_id`),
    KEY `properties_type_index` (`type`),
    KEY `properties_status_index` (`status`),
    KEY `properties_price_index` (`price_per_night`),
    KEY `properties_featured_index` (`featured`),
    CONSTRAINT `properties_manager_id_foreign` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des réservations
CREATE TABLE IF NOT EXISTS `bookings` (
    `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    `property_id` bigint(20) UNSIGNED NOT NULL,
    `client_id` bigint(20) UNSIGNED NOT NULL,
    `start_date` date NOT NULL,
    `end_date` date NOT NULL,
    `total_price` decimal(10,2) NOT NULL,
    `guests` int(11) NOT NULL DEFAULT 2,
    `status` enum('pending', 'confirmed', 'completed', 'cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
    `special_requests` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `cancellation_reason` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `created_at` timestamp NULL DEFAULT NULL,
    `updated_at` timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `bookings_property_id_foreign` (`property_id`),
    KEY `bookings_client_id_foreign` (`client_id`),
    KEY `bookings_status_index` (`status`),
    KEY `bookings_dates_index` (`start_date`, `end_date`),
    CONSTRAINT `bookings_property_id_foreign` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
    CONSTRAINT `bookings_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des factures
CREATE TABLE IF NOT EXISTS `invoices` (
    `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    `booking_id` bigint(20) UNSIGNED NOT NULL,
    `invoice_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
    `amount` decimal(10,2) NOT NULL,
    `tax_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
    `total_amount` decimal(10,2) NOT NULL,
    `status` enum('pending', 'paid', 'overdue', 'cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
    `due_date` date NOT NULL,
    `paid_at` timestamp NULL DEFAULT NULL,
    `payment_method` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `payment_reference` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `created_at` timestamp NULL DEFAULT NULL,
    `updated_at` timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `invoices_invoice_number_unique` (`invoice_number`),
    KEY `invoices_booking_id_foreign` (`booking_id`),
    KEY `invoices_status_index` (`status`),
    KEY `invoices_due_date_index` (`due_date`),
    CONSTRAINT `invoices_booking_id_foreign` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des avis/évaluations
CREATE TABLE IF NOT EXISTS `reviews` (
    `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    `booking_id` bigint(20) UNSIGNED NOT NULL,
    `property_id` bigint(20) UNSIGNED NOT NULL,
    `client_id` bigint(20) UNSIGNED NOT NULL,
    `rating` int(11) NOT NULL CHECK (`rating` >= 1 AND `rating` <= 5),
    `comment` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `response` text COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Réponse du manager',
    `response_at` timestamp NULL DEFAULT NULL,
    `created_at` timestamp NULL DEFAULT NULL,
    `updated_at` timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `reviews_booking_id_unique` (`booking_id`),
    KEY `reviews_property_id_foreign` (`property_id`),
    KEY `reviews_client_id_foreign` (`client_id`),
    KEY `reviews_rating_index` (`rating`),
    CONSTRAINT `reviews_booking_id_foreign` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`) ON DELETE CASCADE,
    CONSTRAINT `reviews_property_id_foreign` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
    CONSTRAINT `reviews_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des notifications
CREATE TABLE IF NOT EXISTS `notifications` (
    `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` bigint(20) UNSIGNED NOT NULL,
    `type` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
    `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
    `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
    `data` json DEFAULT NULL COMMENT 'Données supplémentaires',
    `read_at` timestamp NULL DEFAULT NULL,
    `created_at` timestamp NULL DEFAULT NULL,
    `updated_at` timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `notifications_user_id_foreign` (`user_id`),
    KEY `notifications_type_index` (`type`),
    KEY `notifications_read_at_index` (`read_at`),
    CONSTRAINT `notifications_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table des logs d'activité (pour l'audit)
CREATE TABLE IF NOT EXISTS `activity_logs` (
    `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` bigint(20) UNSIGNED DEFAULT NULL,
    `action` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
    `resource_type` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `resource_id` bigint(20) UNSIGNED DEFAULT NULL,
    `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
    `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `user_agent` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
    `created_at` timestamp NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `activity_logs_user_id_foreign` (`user_id`),
    KEY `activity_logs_action_index` (`action`),
    KEY `activity_logs_resource_index` (`resource_type`, `resource_id`),
    CONSTRAINT `activity_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =================================================================================
-- DONNÉES DE TEST
-- =================================================================================

-- Insérer les utilisateurs administrateur et de test
INSERT INTO `users` (`name`, `email`, `password`, `role`, `status`, `phone`, `address`, `created_at`, `updated_at`) VALUES
-- Mot de passe: password (hashé avec bcrypt)
('Administrateur Principal', 'admin@projetvuelaravel.com', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'active', '+33123456789', '123 Rue de l\'Administration, 75001 Paris', NOW(), NOW()),

-- Managers de test
('Pierre Martin', 'pierre.martin@property.com', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'manager', 'active', '+33987654321', '45 Avenue des Propriétaires, 75008 Paris', NOW(), NOW()),
('Sophie Dubois', 'sophie.dubois@immobilier.com', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'manager', 'active', '+33456789123', '78 Boulevard des Managers, 69001 Lyon', NOW(), NOW()),
('Manager en Attente', 'manager.pending@test.com', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'manager', 'pending', '+33789123456', '90 Rue de l\'Attente, 13001 Marseille', NOW(), NOW()),

-- Clients de test
('Marie Leblanc', 'marie.leblanc@client.com', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'client', 'active', '+33321654987', '12 Rue des Clients, 33000 Bordeaux', NOW(), NOW()),
('Jean Durand', 'jean.durand@email.com', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'client', 'active', '+33654987321', '34 Avenue des Voyageurs, 06000 Nice', NOW(), NOW()),
('Test Client', 'test@client.com', '$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'client', 'active', '+33147258369', '56 Place des Tests, 75010 Paris', NOW(), NOW());

-- Insérer des propriétés de test
INSERT INTO `properties` (`manager_id`, `title`, `description`, `type`, `price_per_night`, `address`, `latitude`, `longitude`, `bedrooms`, `bathrooms`, `area`, `guests`, `amenities`, `images`, `status`, `rating`, `reviews_count`, `featured`, `created_at`, `updated_at`) VALUES
-- Propriétés de Pierre Martin (ID: 2)
(2, 'Appartement Luxueux Centre-Ville Paris', 'Magnifique appartement au cœur de Paris avec vue sur les Champs-Élysées. Entièrement rénové avec des finitions haut de gamme.', 'apartment', 250.00, '123 Avenue des Champs-Élysées, 75008 Paris', 48.8566, 2.3522, 3, 2, 85.50, 6, '["wifi", "parking", "kitchen", "tv", "washing_machine", "air_conditioning", "elevator"]', '["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"]', 'available', 4.8, 12, TRUE, NOW(), NOW()),

(2, 'Maison de Charme Montmartre', 'Charmante maison traditionnelle dans le quartier artistique de Montmartre. Idéale pour découvrir le Paris authentique.', 'house', 180.00, '45 Rue des Abbesses, 75018 Paris', 48.8867, 2.3431, 4, 3, 120.00, 8, '["wifi", "kitchen", "tv", "washing_machine", "garden", "balcony"]', '["https://images.unsplash.com/photo-1564013799919-ab600027ffc6", "https://images.unsplash.com/photo-1513694203232-719a280e022f"]', 'available', 4.6, 8, FALSE, NOW(), NOW()),

-- Propriétés de Sophie Dubois (ID: 3)
(3, 'Bureau Moderne Lyon Part-Dieu', 'Espace de bureau moderne et équipé dans le quartier d\'affaires de Lyon. Parfait pour les entreprises en déplacement.', 'office', 120.00, '89 Rue de la République, 69002 Lyon', 45.7640, 4.8357, 0, 2, 75.00, 10, '["wifi", "parking", "air_conditioning", "elevator"]', '["https://images.unsplash.com/photo-1497366754035-f200968a6e72", "https://images.unsplash.com/photo-1497366858526-0766cadbe8fa"]', 'available', 4.5, 5, FALSE, NOW(), NOW()),

(3, 'Appartement Standing Lyon Bellecour', 'Appartement de standing avec vue sur la Place Bellecour. Décoré avec goût et entièrement équipé.', 'apartment', 150.00, '12 Place Bellecour, 69002 Lyon', 45.7578, 4.8320, 2, 1, 60.00, 4, '["wifi", "kitchen", "tv", "washing_machine", "balcony"]', '["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267", "https://images.unsplash.com/photo-1484154218962-a197022b5858"]', 'available', 4.7, 9, TRUE, NOW(), NOW()),

(2, 'Studio Moderne République', 'Studio moderne et fonctionnel près de la Place de la République. Idéal pour un séjour court en solo ou en couple.', 'apartment', 85.00, '67 Boulevard de Magenta, 75010 Paris', 48.8709, 2.3550, 1, 1, 35.00, 2, '["wifi", "kitchen", "tv", "elevator"]', '["https://images.unsplash.com/photo-1551776235-dde6d482980b", "https://images.unsplash.com/photo-1551836022-deb4988cc6c0"]', 'available', 4.3, 6, FALSE, NOW(), NOW());

-- Insérer quelques réservations de test
INSERT INTO `bookings` (`property_id`, `client_id`, `start_date`, `end_date`, `total_price`, `guests`, `status`, `special_requests`, `created_at`, `updated_at`) VALUES
-- Réservations pour Marie Leblanc (ID: 5)
(1, 5, '2024-02-15', '2024-02-20', 1250.00, 4, 'confirmed', 'Arrivée tardive souhaitée vers 22h', NOW(), NOW()),
(4, 5, '2024-03-10', '2024-03-15', 750.00, 2, 'pending', NULL, NOW(), NOW()),

-- Réservations pour Jean Durand (ID: 6)
(2, 6, '2024-02-01', '2024-02-07', 1080.00, 6, 'completed', 'Besoin d\'un lit bébé', NOW(), NOW()),
(5, 6, '2024-04-01', '2024-04-03', 170.00, 1, 'confirmed', NULL, NOW(), NOW()),

-- Réservations pour Test Client (ID: 7)
(3, 7, '2024-03-01', '2024-03-05', 480.00, 8, 'pending', 'Réunion d\'entreprise', NOW(), NOW());

-- Insérer des factures pour les réservations confirmées/complétées
INSERT INTO `invoices` (`booking_id`, `invoice_number`, `amount`, `tax_amount`, `total_amount`, `status`, `due_date`, `paid_at`, `payment_method`, `created_at`, `updated_at`) VALUES
(1, 'INV-2024-001', 1250.00, 250.00, 1500.00, 'paid', '2024-02-10', '2024-02-08 14:30:00', 'credit_card', NOW(), NOW()),
(2, 'INV-2024-002', 1080.00, 216.00, 1296.00, 'paid', '2024-01-25', '2024-01-23 09:15:00', 'paypal', NOW(), NOW()),
(4, 'INV-2024-003', 170.00, 34.00, 204.00, 'pending', '2024-03-25', NULL, NULL, NOW(), NOW());

-- Insérer quelques avis
INSERT INTO `reviews` (`booking_id`, `property_id`, `client_id`, `rating`, `comment`, `created_at`, `updated_at`) VALUES
(2, 2, 6, 5, 'Séjour absolument parfait ! La maison était magnifique, très bien située et impeccablement propre. Pierre a été un hôte exceptionnel, très réactif et aux petits soins. Je recommande vivement !', NOW(), NOW()),
(1, 1, 5, 5, 'Appartement de rêve avec une vue imprenable ! Tout était parfait, de l\'accueil à l\'emplacement. Nous reviendrons sans hésiter.', NOW(), NOW());

-- Insérer quelques notifications
INSERT INTO `notifications` (`user_id`, `type`, `title`, `message`, `data`, `created_at`, `updated_at`) VALUES
(1, 'manager_approval', 'Nouvelle demande manager', 'Un nouvel utilisateur demande l\'approbation de son compte manager', '{"user_id": 4, "user_name": "Manager en Attente"}', NOW(), NOW()),
(2, 'booking_created', 'Nouvelle réservation', 'Une nouvelle réservation a été effectuée pour votre propriété "Appartement Luxueux Centre-Ville Paris"', '{"booking_id": 1, "property_id": 1}', NOW(), NOW()),
(5, 'booking_confirmed', 'Réservation confirmée', 'Votre réservation pour "Appartement Luxueux Centre-Ville Paris" a été confirmée', '{"booking_id": 1, "property_id": 1}', NOW(), NOW());

-- =================================================================================
-- INDEXES ET OPTIMISATIONS
-- =================================================================================

-- Index pour les recherches de propriétés
CREATE INDEX idx_properties_search ON properties (type, status, price_per_night, featured);
CREATE INDEX idx_properties_location ON properties (latitude, longitude);

-- Index pour les réservations par dates
CREATE INDEX idx_bookings_availability ON bookings (property_id, start_date, end_date, status);

-- Index pour les performances des requêtes utilisateur
CREATE INDEX idx_users_role_status ON users (role, status);

-- =================================================================================
-- VUES POUR LES RAPPORTS
-- =================================================================================

-- Vue pour les statistiques des propriétés
CREATE OR REPLACE VIEW property_stats AS
SELECT 
    p.id,
    p.title,
    p.type,
    p.manager_id,
    u.name as manager_name,
    COUNT(b.id) as total_bookings,
    COUNT(CASE WHEN b.status = 'confirmed' THEN 1 END) as confirmed_bookings,
    COUNT(CASE WHEN b.status = 'completed' THEN 1 END) as completed_bookings,
    COALESCE(SUM(CASE WHEN b.status IN ('confirmed', 'completed') THEN b.total_price END), 0) as total_revenue,
    COALESCE(AVG(r.rating), 0) as average_rating,
    COUNT(r.id) as review_count
FROM properties p
LEFT JOIN users u ON p.manager_id = u.id
LEFT JOIN bookings b ON p.id = b.property_id
LEFT JOIN reviews r ON p.id = r.property_id
GROUP BY p.id, p.title, p.type, p.manager_id, u.name;

-- Vue pour les revenus par manager
CREATE OR REPLACE VIEW manager_revenue AS
SELECT 
    u.id as manager_id,
    u.name as manager_name,
    COUNT(DISTINCT p.id) as total_properties,
    COUNT(b.id) as total_bookings,
    COALESCE(SUM(CASE WHEN b.status IN ('confirmed', 'completed') THEN b.total_price END), 0) as total_revenue,
    COALESCE(AVG(r.rating), 0) as average_rating
FROM users u
LEFT JOIN properties p ON u.id = p.manager_id
LEFT JOIN bookings b ON p.id = b.property_id
LEFT JOIN reviews r ON p.id = r.property_id
WHERE u.role = 'manager' AND u.status = 'active'
GROUP BY u.id, u.name;

-- =================================================================================
-- TRIGGERS POUR L'INTÉGRITÉ DES DONNÉES
-- =================================================================================

-- Trigger pour mettre à jour la note moyenne des propriétés
DELIMITER $$
CREATE TRIGGER update_property_rating_after_review
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    UPDATE properties 
    SET rating = (
        SELECT AVG(rating) 
        FROM reviews 
        WHERE property_id = NEW.property_id
    ),
    reviews_count = (
        SELECT COUNT(*) 
        FROM reviews 
        WHERE property_id = NEW.property_id
    )
    WHERE id = NEW.property_id;
END$$
DELIMITER ;

-- Trigger pour vérifier la disponibilité avant réservation
DELIMITER $$
CREATE TRIGGER check_availability_before_booking
BEFORE INSERT ON bookings
FOR EACH ROW
BEGIN
    DECLARE conflict_count INT DEFAULT 0;
    
    SELECT COUNT(*) INTO conflict_count
    FROM bookings 
    WHERE property_id = NEW.property_id
    AND status IN ('confirmed', 'pending')
    AND NOT (NEW.end_date <= start_date OR NEW.start_date >= end_date);
    
    IF conflict_count > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Propriété non disponible pour ces dates';
    END IF;
END$$
DELIMITER ;

-- =================================================================================
-- PROCÉDURES STOCKÉES UTILES
-- =================================================================================

-- Procédure pour générer un numéro de facture unique
DELIMITER $$
CREATE PROCEDURE GenerateInvoiceNumber(OUT invoice_num VARCHAR(50))
BEGIN
    DECLARE year_month VARCHAR(7);
    DECLARE next_number INT;
    
    SET year_month = DATE_FORMAT(NOW(), '%Y-%m');
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number, -3) AS UNSIGNED)), 0) + 1
    INTO next_number
    FROM invoices 
    WHERE invoice_number LIKE CONCAT('INV-', year_month, '-%');
    
    SET invoice_num = CONCAT('INV-', year_month, '-', LPAD(next_number, 3, '0'));
END$$
DELIMITER ;

-- =================================================================================
-- FINALISATION
-- =================================================================================

-- Afficher les informations de la base créée
SELECT 'Base de données créée avec succès !' as message;

-- Afficher les tables créées
SHOW TABLES;

-- Afficher quelques statistiques
SELECT 
    (SELECT COUNT(*) FROM users WHERE role = 'client') as clients,
    (SELECT COUNT(*) FROM users WHERE role = 'manager' AND status = 'active') as managers_actifs,
    (SELECT COUNT(*) FROM users WHERE role = 'manager' AND status = 'pending') as managers_en_attente,
    (SELECT COUNT(*) FROM users WHERE role = 'admin') as administrateurs,
    (SELECT COUNT(*) FROM properties) as proprietes,
    (SELECT COUNT(*) FROM bookings) as reservations,
    (SELECT COUNT(*) FROM reviews) as avis;

-- Instructions pour l'utilisateur
SELECT 'Comptes de test créés:' as info;
SELECT 'Admin: admin@projetvuelaravel.com / password' as compte_admin;
SELECT 'Manager: pierre.martin@property.com / password' as compte_manager;
SELECT 'Client: marie.leblanc@client.com / password' as compte_client;
SELECT 'Note: Tous les mots de passe sont "password"' as note;
