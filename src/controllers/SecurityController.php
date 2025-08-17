<?php

require_once 'AppController.php';
require_once 'src/models/User.php';
require_once 'src/repository/UserRepository.php';
require_once 'src/helpers/PasswordHelper.php';

class SecurityController extends AppController {

    private $userRepository;
    
    public function __construct() {
        $this->userRepository = new UserRepository();
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

        try {
            $user = $this->userRepository->findByEmail($email);
            
            if ($user && PasswordHelper::verify($password, $user->password)) {
                // Set user session
                $_SESSION['user_logged_in'] = true;
                $_SESSION['user_email'] = $user->email;
                $_SESSION['user_name'] = $user->name;
                $_SESSION['last_activity'] = time();
                
                header('Location: /mainApp');
                exit;
            }
        } catch (Exception $e) {
            error_log("Database error during login: " . $e->getMessage());
            $_SESSION['messages'] = ['Database connection error. Please try again later.'];
            $_SESSION['formType'] = 'login';
            header('Location: /auth');
            exit;
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

        // Hash password before saving to database
        $hashedPassword = PasswordHelper::hash($password);

        try {
            $newUser = new User($name, $surname, $email, $hashedPassword);
            $this->userRepository->save($newUser);
            
            // After registration message on login panel
            $_SESSION['messages'] = ['Registration successful! Now please log in.'];
            $_SESSION['formType'] = 'login';
            header('Location: /auth');
            exit;
            
        } catch (Exception $e) {
            if (strpos($e->getMessage(), 'already exists') !== false) {
                $_SESSION['messages'] = ['User with the specified email address already exists'];
            } else {
                error_log("Database error during registration: " . $e->getMessage());
                $_SESSION['messages'] = ['Database connection error. Please try again later.'];
            }
            $_SESSION['formType'] = 'register';
            header('Location: /auth');
            exit;
        }
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
