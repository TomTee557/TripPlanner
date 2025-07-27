<?php

require_once 'src/controllers/DefaultController.php';
require_once 'src/controllers/SecurityController.php';

class Router {

    public static $routes = [];

    public static function get($url, $controller, $method) {
        self::$routes['GET'][$url] = [$controller, $method];
    }

    public static function post($url, $controller, $method) {
        self::$routes['POST'][$url] = [$controller, $method];
    }

    public static function run($url) {
        $method = $_SERVER['REQUEST_METHOD'];
        $action = explode("/", $url)[0] ?: 'auth';

        if (!isset(self::$routes[$method][$action])) {
            die("404 Not Found");
        }

        list($controllerName, $methodName) = self::$routes[$method][$action];
        $controller = new $controllerName;
        $controller->$methodName();
    }
}
