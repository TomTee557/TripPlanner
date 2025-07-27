<?php

require_once 'AppController.php';

class SecurityController extends AppController {

    public function login()
    {
        if (!$this->isPost()) {
            return $this->render('auth');
        }

        $login = $_POST['login'];
        $password = $_POST['password'];

        // Prosty mock (do zamiany na bazę danych)
        if ($login === 'admin' && $password === 'admin') {
            $url = "http://$_SERVER[HTTP_HOST]";
            header("Location: {$url}/?action=mainApp");
            exit;
        }

        $this->render('auth', ['messages' => ['Wrong login or password!']]);
    }
}
