<?php

require_once 'AppController.php';

class DefaultController extends AppController {

    public function auth()
    {
        // session initialization
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        $this->render('auth');
    }

    public function mainApp()
    {
        // Start session to access user data
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        $this->render('mainApp');
    }
}
