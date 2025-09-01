<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Laravel\Sanctum\Sanctum;

class AuthTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    /**
     * Test user registration
     */
    public function test_user_can_register()
    {
        $userData = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $response = $this->postJson('/api/register', $userData);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'status',
                    'message',
                    'user' => [
                        'id',
                        'name',
                        'email',
                        'created_at',
                        'updated_at'
                    ],
                    'access_token',
                    'token_type'
                ]);

        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com',
            'name' => 'Test User'
        ]);
    }

    /**
     * Test user login
     */
    public function test_user_can_login()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password123')
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'test@example.com',
            'password' => 'password123'
        ]);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'status',
                    'message',
                    'user',
                    'access_token',
                    'token_type'
                ]);
    }

    /**
     * Test get user info
     */
    public function test_authenticated_user_can_get_info()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/login');

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'status',
                    'user'
                ]);
    }

    /**
     * Test update user
     */
    public function test_authenticated_user_can_update_info()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->putJson('/api/login', [
            'name' => 'Updated Name'
        ]);

        $response->assertStatus(200)
                ->assertJson([
                    'status' => 'success',
                    'message' => 'User updated successfully'
                ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Updated Name'
        ]);
    }

    /**
     * Test delete user
     */
    public function test_authenticated_user_can_delete_account()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->deleteJson('/api/login');

        $response->assertStatus(200)
                ->assertJson([
                    'status' => 'success',
                    'message' => 'User account deleted successfully'
                ]);

        $this->assertDatabaseMissing('users', [
            'id' => $user->id
        ]);
    }

    /**
     * Test logout
     */
    public function test_authenticated_user_can_logout()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/logout');

        $response->assertStatus(200)
                ->assertJson([
                    'status' => 'success',
                    'message' => 'User logged out successfully'
                ]);
    }

    /**
     * Test invalid login credentials
     */
    public function test_user_cannot_login_with_invalid_credentials()
    {
        $response = $this->postJson('/api/login', [
            'email' => 'invalid@example.com',
            'password' => 'wrongpassword'
        ]);

        $response->assertStatus(401)
                ->assertJson([
                    'status' => 'error',
                    'message' => 'Invalid login credentials'
                ]);
    }

    /**
     * Test validation errors
     */
    public function test_registration_requires_valid_data()
    {
        $response = $this->postJson('/api/register', [
            'email' => 'invalid-email',
            'password' => '123' // too short
        ]);

        $response->assertStatus(400)
                ->assertJsonStructure([
                    'status',
                    'errors'
                ]);
    }
}
