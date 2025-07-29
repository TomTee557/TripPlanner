<?php

require_once 'AppController.php';
require_once 'src/models/User.php';

class SecurityController extends AppController {

    private function &getMockUsers() {
        if (!isset($_SESSION['mock_users'])) {
            $_SESSION['mock_users'] = [
                new User('Admin', 'Admin', 'admin', 'admin')
            ];
        }
        return $_SESSION['mock_users'];
    }

    public function login()
    {
        header('Content-Type: application/json');
        if (!$this->isPost()) {
            echo json_encode(['success' => false, 'message' => 'Invalid request']);
            return;
        }

        $login = $_POST['login'] ?? '';
        $password = $_POST['password'] ?? '';

        $users = $this->getMockUsers();
        foreach ($users as $user) {
            if ($user->login === $login && $user->password === $password) {
                echo json_encode(['success' => true]);
                return;
            }
        }

        echo json_encode(['success' => false, 'message' => 'Wrong username or password']);
    }

    public function register()
    {
        header('Content-Type: application/json');
        if (!$this->isPost()) {
            echo json_encode(['success' => false, 'message' => 'Invalid request']);
            return;
        }

        $name = trim($_POST['name'] ?? '');
        $surname = trim($_POST['surname'] ?? '');
        $login = trim($_POST['regLogin'] ?? '');
        $password = $_POST['regPassword'] ?? '';
        $confirm = $_POST['confirmPassword'] ?? '';

        $users = $this->getMockUsers();
        foreach ($users as $user) {
            if ($user->login === $login) {
                echo json_encode(['success' => false, 'message' => 'Login already exists', 'field' => 'regLogin']);
                return;
            }
        }

        // Dodaj użytkownika (walidacja była po stronie JS)
        $users[] = new User($name, $surname, $login, $password);
        $_SESSION['mock_users'] = $users;

        echo json_encode(['success' => true]);
    }
}
