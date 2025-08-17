<?php
// Test connection to PostgreSQL database

require_once 'src/repository/Database.php';

try {
    $db = Database::getInstance();
    echo "✅ Database connection successful!\n";
    
    // Test query
    $result = $db->query("SELECT current_timestamp as now");
    echo "✅ Database query successful!\n";
    echo "Current timestamp: " . $result[0]['now'] . "\n";
    
    // Test users table
    $users = $db->query("SELECT COUNT(*) as count FROM users");
    echo "✅ Users table accessible!\n";
    echo "Total users: " . $users[0]['count'] . "\n";
    
    // Test admin user
    $admin = $db->query("SELECT email, password FROM users WHERE email = 'admin@admin.com'");
    if (!empty($admin)) {
        echo "✅ Admin user found!\n";
        echo "Email: " . $admin[0]['email'] . "\n";
        echo "Password hash (first 30 chars): " . substr($admin[0]['password'], 0, 30) . "...\n";
        
        // Test password verification
        if (password_verify('admin', $admin[0]['password'])) {
            echo "✅ Password 'admin' verification successful!\n";
        } else {
            echo "❌ Password 'admin' verification failed!\n";
        }
    } else {
        echo "❌ Admin user not found!\n";
    }
    
} catch (Exception $e) {
    echo "❌ Database connection failed: " . $e->getMessage() . "\n";
    echo "Make sure PostgreSQL container is running.\n";
}
?>
