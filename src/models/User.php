<?php

class User {
    public $name;
    public $surname;
    public $login;
    public $password;

    public function __construct($name, $surname, $login, $password) {
        $this->name = $name;
        $this->surname = $surname;
        $this->login = $login;
        $this->password = $password;
    }
}