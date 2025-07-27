<?php

require_once 'AppController.php';

class DefaultController extends AppController {

    public function auth()
    {
        $this->render('auth');
    }

    public function mainApp()
    {
        $this->render('mainApp');
    }
}
