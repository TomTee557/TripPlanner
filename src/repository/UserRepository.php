<?php

require_once 'Database.php';
require_once 'src/models/User.php';

class UserRepository {
    private $database;
    
    public function __construct() {
        $this->database = Database::getInstance();
    }
    
    public function findByEmail($email) {
        $sql = "SELECT * FROM users WHERE LOWER(email) = LOWER(?)";
        $result = $this->database->query($sql, [$email]);
        
        if (empty($result)) {
            return null;
        }
        
        $userData = $result[0];
        return new User(
            $userData['name'],
            $userData['surname'],
            $userData['email'],
            $userData['password'],
            $userData['id']
        );
    }
    
    public function save(User $user) {
        // Check if user already exists
        $existingUser = $this->findByEmail($user->email);
        if ($existingUser) {
            throw new Exception("User with this email already exists");
        }
        
        $sql = "INSERT INTO users (name, surname, email, password) VALUES (?, ?, ?, ?)";
        return $this->database->execute($sql, [
            $user->name,
            $user->surname, 
            $user->email,
            $user->password
        ]);
    }
    
    public function findAll() {
        $sql = "SELECT * FROM users ORDER BY email";
        $results = $this->database->query($sql);
        
        $users = [];
        foreach ($results as $userData) {
            $users[] = new User(
                $userData['name'],
                $userData['surname'],
                $userData['email'],
                $userData['password'],
                $userData['id']
            );
        }
        
        return $users;
    }
    
    public function deleteByEmail($email) {
        $sql = "DELETE FROM users WHERE LOWER(email) = LOWER(?)";
        return $this->database->execute($sql, [$email]);
    }
}
