<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
if (!isset($messages)) $messages = [];
if (!isset($formType)) $formType = null;
if (empty($messages) && !empty($_SESSION['messages'])) {
    $messages = $_SESSION['messages'];
    unset($_SESSION['messages']);
}
if (empty($formType) && !empty($_SESSION['formType'])) {
    $formType = $_SESSION['formType'];
    unset($_SESSION['formType']);
}
?><?php /** @var array $messages */ ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Trip Planner - Auth</title>
  <link rel="stylesheet" href="/public/styles/global.css" />
  <link rel="stylesheet" href="/public/styles/auth.css" />
  <!-- TODO api.js -->
<script src="/public/scripts/auth.js" defer></script>
</head>
<body class="auth">
  <div class="auth__background"></div>

  <div class="auth__column">
    <div class="auth__container">
      <img src="/public/assets/logo.png" alt="Trip Planner Logo" class="auth__logo"/>

      <!-- FORMULARZ LOGOWANIA -->
      <form class="auth__form" id="loginForm" method="POST" action="/login">
        <div class="auth__section" id="loginSection">
          <h2 class="auth__title">Log in</h2>
          <label for="email" class="auth__label">Email:</label>
          <input type="text" id="email" name="email" class="auth__input" required />

          <label for="password" class="auth__label">Password:</label>
          <input type="password" id="password" name="password" class="auth__input" required />

          <button type="submit" class="auth__button auth__button--login">Log in</button>
          <p class="auth__switch">Don’t have an account? <a href="#" id="showRegister">Register</a></p>
          <!-- Komunikaty logowania -->
          <div id="loginError" class="auth__message">
            <?php if (!empty($messages) && ($formType ?? '') === 'login'): ?>
              <?php foreach ($messages as $msg): ?>
                <?php
                  $successMessages = [
                    'Registration successful! Now please log in.',
                    'You have been successfully logged out.',
                    'You have been logged out due to inactivity.',
                    'You have been logged out.'
                  ];
                  $messageClass = in_array($msg, $successMessages) 
                    ? 'auth__message--success' 
                    : 'auth__message--error';
                ?>
                <p class="<?= $messageClass ?>"><?= $msg ?></p>
              <?php endforeach; ?>
            <?php endif; ?>
          </div>
        </div>
      </form>

      <!-- FORMULARZ REJESTRACJI -->
      <form class="auth__form auth__section--hidden" id="registerForm" method="POST" action="/register">
        <div class="auth__section" id="registerSection">
          <h2 class="auth__title">Register</h2>
          <label class="auth__label">Name:</label>
          <input type="text" id="name" name="name" class="auth__input" required />

          <label class="auth__label">Surname:</label>
          <input type="text" id="surname" name="surname" class="auth__input" required />

          <label class="auth__label">Email:</label>
          <input type="text" id="regEmail" name="regEmail" class="auth__input" required />

          <label class="auth__label">Password:</label>
          <input type="password" id="regPassword" name="regPassword" class="auth__input" required />

          <label class="auth__label">Confirm password:</label>
          <input type="password" id="confirmPassword" name="confirmPassword" class="auth__input" required />

          <button type="submit" class="auth__button auth__button--register">Register</button>
          <p class="auth__switch"><a href="#" id="showLogin">Back to log in</a></p>
          <!-- Komunikaty rejestracji -->
          <div id="registerError" class="auth__message">
            <?php if (!empty($messages) && ($formType ?? '') === 'register'): ?>
              <?php foreach ($messages as $msg): ?>
                <p class="auth__message--error"><?= $msg ?></p>
              <?php endforeach; ?>
            <?php endif; ?>
          </div>
        </div>
      </form>
    </div>
  </div>


  <script>
    document.addEventListener('DOMContentLoaded', function() {
      <?php if (($formType ?? '') === 'register'): ?>
        // Jeśli formType to 'register', pokaż formularz rejestracji
        document.getElementById('registerForm').classList.remove('auth__section--hidden');
        document.getElementById('loginForm').classList.add('auth__section--hidden');
      <?php endif; ?>
    });
  </script>
</body>
</html>
