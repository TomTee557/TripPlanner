<?php

class User {
    public $id;
    public $name;
    public $surname;
    public $email;
    public $password;

    public function __construct($name, $surname, $email, $password, $id = null) {
        $this->id = $id;
        $this->name = $name;
        $this->surname = $surname;
        $this->email = $email;
        $this->password = $password;
    }
}