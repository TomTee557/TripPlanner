<?php

require_once 'AppController.php';
require_once 'src/repository/TripRepository.php';
require_once 'src/repository/UserRepository.php';

class ApiController extends AppController {

    private $tripRepository;
    private $userRepository;
    
    public function __construct() {
        $this->tripRepository = new TripRepository();
        $this->userRepository = new UserRepository();
    }

    /**
     * Sprawdza czy użytkownik jest zalogowany
     * Zwraca dane dla JavaScript do obsługi
     */
    private function checkAuth() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        // Sprawdzenie sesji
        if (!isset($_SESSION['user_logged_in']) || $_SESSION['user_logged_in'] !== true) {
            http_response_code(401);
            header('Content-Type: application/json');
            echo json_encode([
                'error' => 'Not authenticated',
                'message' => 'Your session has expired. Please log in again.',
                'action' => 'show_login_popup' // Sygnał dla JavaScript
            ]);
            exit;
        }
        
        // Sprawdź timeout sesji
        $sessionTimeout = 30 * 60; // 30 minutes
        if (isset($_SESSION['last_activity'])) {
            if (time() - $_SESSION['last_activity'] > $sessionTimeout) {
                // Session expired - wyczyść sesję
                unset($_SESSION['user_logged_in']);
                unset($_SESSION['user_email']);
                unset($_SESSION['user_name']);
                unset($_SESSION['last_activity']);
                
                http_response_code(401);
                header('Content-Type: application/json');
                echo json_encode([
                    'error' => 'Session expired',
                    'message' => 'Your session has expired due to inactivity. Please log in again.',
                    'action' => 'show_login_popup' // Sygnał dla JavaScript
                ]);
                exit;
            }
        }
        
        // Update last activity
        $_SESSION['last_activity'] = time();
        
        return $_SESSION['user_email'];
    }

    /**
     * GET /api/trips - pobierz trips użytkownika
     */
    public function getTrips() {
        $userEmail = $this->checkAuth(); // Zwraca email lub kończy z 401
        
        try {
            $trips = $this->tripRepository->findByUserEmail($userEmail);
            
            header('Content-Type: application/json');
            echo json_encode([
                'success' => true,
                'data' => $trips,
                'user' => $userEmail,
                'count' => count($trips)
            ]);
            
        } catch (Exception $e) {
            error_log("Error fetching trips: " . $e->getMessage());
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'error' => 'Database error',
                'message' => 'Unable to fetch trips. Please try again later.'
            ]);
        }
    }

    /**
     * POST /api/trips - dodaj nowy trip
     */
    public function addTrip() {
        $userEmail = $this->checkAuth(); // Zwraca email lub kończy z 401
        
        if (!$this->isPost()) {
            http_response_code(405);
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Method not allowed']);
            exit;
        }
        
        try {
            // Pobierz dane z POST
            $input = json_decode(file_get_contents('php://input'), true);
            
            // Znajdź user_id
            $user = $this->userRepository->findByEmail($userEmail);
            if (!$user) {
                throw new Exception("User not found");
            }
            
            // Dodaj trip do bazy
            $tripId = $this->tripRepository->save($user->id, $input);
            
            header('Content-Type: application/json');
            echo json_encode([
                'success' => true,
                'message' => 'Trip added successfully',
                'tripId' => $tripId,
                'user' => $userEmail
            ]);
            
        } catch (Exception $e) {
            error_log("Error adding trip: " . $e->getMessage());
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'error' => 'Database error', 
                'message' => 'Unable to add trip. Please try again later.'
            ]);
        }
    }

    /**
     * POST /api/trips/delete - usuń trip
     */
    public function deleteTrip() {
        $userEmail = $this->checkAuth(); // Zwraca email lub kończy z 401
        
        if (!$this->isPost()) {
            http_response_code(405);
            header('Content-Type: application/json');
            echo json_encode(['error' => 'Method not allowed']);
            exit;
        }
        
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            $tripId = $input['id'] ?? null;
            
            if (!$tripId) {
                throw new Exception("Trip ID is required");
            }
            
            // Znajdź user_id
            $user = $this->userRepository->findByEmail($userEmail);
            if (!$user) {
                throw new Exception("User not found");
            }
            
            // Usuń trip (tylko jeśli należy do użytkownika)
            $deleted = $this->tripRepository->deleteById($tripId, $user->id);
            
            header('Content-Type: application/json');
            echo json_encode([
                'success' => true,
                'message' => 'Trip deleted successfully',
                'deleted' => $deleted
            ]);
            
        } catch (Exception $e) {
            error_log("Error deleting trip: " . $e->getMessage());
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'error' => 'Database error',
                'message' => 'Unable to delete trip. Please try again later.'
            ]);
        }
    }
}
