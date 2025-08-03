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

        $email = strtolower(trim($_POST['email'] ?? '')); // Normalizacja do małych liter
        $password = $_POST['password'] ?? '';

        $users = $this->getMockUsers();
        foreach ($users as $user) {
            // Porównywanie bez uwzględniania wielkości liter
            if (strtolower($user->email) === $email && $user->password === $password) {
                return $this->render('mainApp');
            }
        }

        // Błąd logowania – przekierowanie z komunikatem
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

        // Normalizacja email do małych liter przed sprawdzeniem
        $emailLowerCase = strtolower($email);
        
        $users = $this->getMockUsers();
        foreach ($users as $user) {
            // Porównywanie bez uwzględniania wielkości liter
            if (strtolower($user->email) === $emailLowerCase) {
                $_SESSION['messages'] = ['User with the specified email address already exists'];
                $_SESSION['formType'] = 'register';
                header('Location: /auth');
                exit;
            }
        }

        // Dodaj użytkownika - zapis z oryginalnym emailem
        $users[] = new User($name, $surname, $email, $password);
        $_SESSION['mock_users'] = $users;

        // Po rejestracji komunikat na panelu logowania
        $_SESSION['messages'] = ['Registration successful! Now please log in.'];
        $_SESSION['formType'] = 'login';
        header('Location: /auth');
        exit;
    }
}
