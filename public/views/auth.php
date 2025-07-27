<?php /** @var array $messages */ ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Trip Planner - Auth</title>
  <link rel="stylesheet" href="/public/styles/global.css" />
  <link rel="stylesheet" href="/public/styles/auth.css" />
  <!-- TODO api.js -->
  <script src="/public/scripts/api.js" defer></script>
  <script src="/public/scripts/auth.js" defer></script>
</head>
<body class="auth">
  <div class="auth__background"></div>

  <div class="auth__column">
    <div class="auth__container">
      <img src="/public/assets/logo.png" alt="Trip Planner Logo" class="auth__logo"/>

      <?php if (!empty($messages)): ?>
        <div class="auth__message auth__message--error">
          <?php foreach ($messages as $msg): ?>
            <p><?= $msg ?></p>
          <?php endforeach; ?>
        </div>
      <?php endif; ?>

      <!-- FORMULARZ LOGOWANIA -->
      <form class="auth__form" id="loginForm" method="POST" action="/login">
        <div class="auth__section" id="loginSection">
          <h2 class="auth__title">Log in</h2>
          <label for="login" class="auth__label">Login:</label>
          <input type="text" id="login" name="login" class="auth__input" required />

          <label for="password" class="auth__label">Password:</label>
          <input type="password" id="password" name="password" class="auth__input" required />

          <button type="button" class="auth__button auth__button--login">Log in</button>
          <p class="auth__switch">Don’t have an account? <a href="#" id="showRegister">Register</a></p>
        <!-- MIEJSCE NA KOMUNIKAT O BŁĘDZIE -->
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

          <label class="auth__label">Login:</label>
          <input type="text" id="regLogin" name="regLogin" class="auth__input" required />

          <label class="auth__label">Password:</label>
          <input type="password" id="regPassword" name="regPassword" class="auth__input" required />

          <label class="auth__label">Confirm password:</label>
          <input type="password" id="confirmPassword" name="confirmPassword" class="auth__input" required />

          <button type="button" class="auth__button auth__button--register">Register</button>
          <p class="auth__switch"><a href="#" id="showLogin">Back to log in</a></p>
        </div>
      </form>
    </div>
  </div>
</body>
</html>
