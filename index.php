<?php

// Configure session settings
ini_set('session.cookie_lifetime', 0); // Session cookie expires when browser closes
ini_set('session.gc_maxlifetime', 1800); // 30 minutes server-side cleanup
ini_set('session.cookie_httponly', 1); // HTTP only cookies for security
ini_set('session.cookie_secure', 0); // Set to 1 if using HTTPS
ini_set('session.use_strict_mode', 1); // Strict session ID handling

require_once 'Routing.php';

// Route to login/registration panel (auth.php)
Router::get('auth', 'DefaultController', 'auth');

// Route to main application (mainApp.php)
Router::get('mainApp', 'DefaultController', 'mainApp');

// POST route for login - when using login form
Router::post('login', 'SecurityController', 'login');

// POST route for registration - when using registration form
Router::post('register', 'SecurityController', 'register');

// POST route for logout
Router::post('logout', 'SecurityController', 'logout');

// API endpoints - require session verification
Router::get('api/trips', 'ApiController', 'getTrips');
Router::post('api/trips', 'ApiController', 'addTrip');
Router::post('api/trips/delete', 'ApiController', 'deleteTrip');

// (opcjonalnie) domyślna trasa na / przekierowuje na auth
Router::get('', 'DefaultController', 'auth');

$path = trim($_SERVER['REQUEST_URI'], '/');
$path = parse_url($path, PHP_URL_PATH);
Router::run($path);

