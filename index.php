<?php

// Configure session settings
ini_set('session.cookie_lifetime', 0); // Session cookie expires when browser closes
ini_set('session.gc_maxlifetime', 1800); // 30 minutes server-side cleanup
ini_set('session.cookie_httponly', 1); // HTTP only cookies for security
ini_set('session.cookie_secure', 0); // Set to 1 if using HTTPS
ini_set('session.use_strict_mode', 1); // Strict session ID handling

require_once 'Routing.php';

// Trasa do panelu logowania/rejestracji (auth.php)
Router::get('auth', 'DefaultController', 'auth');

// Trasa do głównej aplikacji (mainApp.php)
Router::get('mainApp', 'DefaultController', 'mainApp');

// Trasa POST do logowania - przy korzystaniu z formularza logowania
Router::post('login', 'SecurityController', 'login');

// Trasa POST do rejestracji - przy korzystaniu z formularza rejestracji
Router::post('register', 'SecurityController', 'register');

// Trasa POST do wylogowania
Router::post('logout', 'SecurityController', 'logout');

// (opcjonalnie) domyślna trasa na / przekierowuje na auth
Router::get('', 'DefaultController', 'auth');

$path = trim($_SERVER['REQUEST_URI'], '/');
$path = parse_url($path, PHP_URL_PATH);
Router::run($path);

