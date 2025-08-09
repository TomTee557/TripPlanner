<?php

require_once 'AppController.php';

class DefaultController extends AppController {

    public function auth()
    {
        // Dodaj inicjalizację sesji tutaj
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        $this->render('auth');
    }

    public function mainApp()
    {
        // Initialize session
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        // Check if user is logged in
        if (!isset($_SESSION['user_logged_in']) || $_SESSION['user_logged_in'] !== true) {
            // User is not logged in, redirect to auth
            header('Location: /auth');
            exit;
        }
        
        // Check session timeout (30 minutes = 1800 seconds)
        $sessionTimeout = 30 * 60; // 30 minutes
        
        if (isset($_SESSION['last_activity'])) {
            if (time() - $_SESSION['last_activity'] > $sessionTimeout) {
                // Session expired, logout user
                unset($_SESSION['user_logged_in']);
                unset($_SESSION['user_email']);
                unset($_SESSION['user_name']);
                unset($_SESSION['last_activity']);
                
                $_SESSION['messages'] = ['You have been logged out due to inactivity.'];
                $_SESSION['formType'] = 'login';
                header('Location: /auth');
                exit;
            }
        }
        
        // Update last activity time
        $_SESSION['last_activity'] = time();
        
        $this->render('mainApp');
    }
}
