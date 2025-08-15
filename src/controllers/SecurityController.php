<?php

require_once 'AppController.php';
require_once 'src/models/User.php';

class SecurityController extends AppController {

    private function &getMockUsers() {
        if (!isset($_SESSION['mock_users'])) {
            $_SESSION['mock_users'] = [
                new User('Admin', 'Admin', 'admin@admin.com', 'admin')
            ];
        }
        return $_SESSION['mock_users'];
    }

    public function login()
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        if (!$this->isPost()) {
            return $this->render('auth');
        }

        $email = strtolower(trim($_POST['email'] ?? ''));
        $password = $_POST['password'] ?? '';

        $users = $this->getMockUsers();
        foreach ($users as $user) {
            if (strtolower($user->email) === $email && $user->password === $password) {
                // Set user session
                $_SESSION['user_logged_in'] = true;
                $_SESSION['user_email'] = $user->email;
                $_SESSION['user_name'] = $user->name;
                $_SESSION['last_activity'] = time(); // Set initial activity time
                
                // Redirect to mainApp instead of rendering directly
                header('Location: /mainApp');
                exit;
            }
        }

        // Login error – redirect with message
        $_SESSION['messages'] = ['Wrong email or password'];
        $_SESSION['formType'] = 'login';
        header('Location: /auth');
        exit;
    }

    public function register()
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        if (!$this->isPost()) {
            return $this->render('auth');
        }

        $email = trim($_POST['regEmail'] ?? '');
        $name = trim($_POST['name'] ?? '');
        $surname = trim($_POST['surname'] ?? '');
        $password = $_POST['regPassword'] ?? '';

        // email to lowercase before checking
        $emailLowerCase = strtolower($email);
        
        $users = $this->getMockUsers();
        foreach ($users as $user) {
            if (strtolower($user->email) === $emailLowerCase) {
                $_SESSION['messages'] = ['User with the specified email address already exists'];
                $_SESSION['formType'] = 'register';
                header('Location: /auth');
                exit;
            }
        }

        // Add user - save with original email
        $users[] = new User($name, $surname, $email, $password);
        $_SESSION['mock_users'] = $users;

        // After registration message on login panel
        $_SESSION['messages'] = ['Registration successful! Now please log in.'];
        $_SESSION['formType'] = 'login';
        header('Location: /auth');
        exit;
    }

    public function logout()
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        // Clear user session data
        unset($_SESSION['user_logged_in']);
        unset($_SESSION['user_email']);
        unset($_SESSION['user_name']);
        unset($_SESSION['last_activity']);
        
        // Set logout message based on reason
        $logoutReason = $_POST['logout_reason'] ?? 'manual';
        
        switch ($logoutReason) {
            case 'inactivity':
                $_SESSION['messages'] = ['You have been logged out due to inactivity.'];
                break;
            case 'browser_close':
                $_SESSION['messages'] = ['You have been logged out.'];
                break;
            default:
                $_SESSION['messages'] = ['You have been successfully logged out.'];
        }
        
        $_SESSION['formType'] = 'login';
        
        header('Location: /auth');
        exit;
    }
}
