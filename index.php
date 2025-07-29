<?php

require_once 'Routing.php';

// Trasa do panelu logowania/rejestracji (auth.php)
Router::get('auth', 'DefaultController', 'auth');

// Trasa do głównej aplikacji (mainApp.php)
Router::get('mainApp', 'DefaultController', 'mainApp');

// Trasa POST do logowania - przy korzystaniu z formularza logowania
Router::post('login', 'SecurityController', 'login');

// Trasa POST do rejestracji - przy korzystaniu z formularza rejestracji
Router::post('register', 'SecurityController', 'register');

// (opcjonalnie) domyślna trasa na / przekierowuje na auth
Router::get('', 'DefaultController', 'auth');

$path = trim($_SERVER['REQUEST_URI'], '/');
$path = parse_url($path, PHP_URL_PATH);
Router::run($path);

