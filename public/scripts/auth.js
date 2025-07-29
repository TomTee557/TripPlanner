import { postForm } from './fetch.js';

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const showLogin = document.getElementById('showLogin');
const showRegister = document.getElementById('showRegister');
const loginSection = document.getElementById('loginSection');
const registerSection = document.getElementById('registerSection');

// -- Switch widoków
showLogin?.addEventListener('click', e => {
  e.preventDefault();
  registerForm.classList.add('auth__section--hidden');
  loginForm.classList.remove('auth__section--hidden');
  clearForm();
  removeErrorMessage();
});

showRegister?.addEventListener('click', e => {
  e.preventDefault();
  loginForm.classList.add('auth__section--hidden');
  registerForm.classList.remove('auth__section--hidden');
  clearForm();
  removeErrorMessage();
});

// -- Czyszczenie inputów i komunikatów
function clearForm() {
  document.querySelectorAll('.auth__input').forEach(input => {
    input.value = '';
    input.classList.remove('auth__input--error');
  });
}

function removeErrorMessage() {
  const existing = document.querySelector('#auth-error-message');
  if (existing) existing.remove();
}

function showErrorMessage(msg, container) {
  removeErrorMessage();
  const p = document.createElement('p');
  p.className = 'auth__message auth__message--error';
  p.id = 'auth-error-message';
  p.style.color = 'red';
  p.style.marginTop = '0.5rem';
  p.style.textAlign = 'center';
  p.textContent = msg;
  container.appendChild(p);
}

function isOnlyLetters(text) {
  return /^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+$/.test(text);
}

// --- LOGOWANIE ---
loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  removeErrorMessage();

  const loginInput = document.getElementById('login');
  const passInput = document.getElementById('password');
  loginInput.classList.remove('auth__input--error');
  passInput.classList.remove('auth__input--error');

  // Wstępna walidacja
  if (!loginInput.value.trim() || !passInput.value.trim()) {
    if (!loginInput.value.trim()) loginInput.classList.add('auth__input--error');
    if (!passInput.value.trim()) passInput.classList.add('auth__input--error');
    showErrorMessage('Please fill in all fields', loginSection);
    return;
  }

  // AJAX
  const res = await postForm('/login', {
    login: loginInput.value,
    password: passInput.value // todo: hasło powinno być hashowane na serwerze !!!
  });

  if (res.success) {
   window.location.href = '/mainApp';
  } else {
    loginInput.classList.add('auth__input--error');
    passInput.classList.add('auth__input--error');
    showErrorMessage(res.message || 'Wrong username or password', loginSection);
  }
});

// --- REJESTRACJA ---
registerForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  removeErrorMessage();

  const name = document.getElementById('name');
  const surname = document.getElementById('surname');
  const login = document.getElementById('regLogin');
  const password = document.getElementById('regPassword');
  const confirm = document.getElementById('confirmPassword');
  const inputs = [name, surname, login, password, confirm];

  let valid = true;
  let errorMessage = '';

  inputs.forEach(input => {
    input.classList.remove('auth__input--error');
    if (!input.value.trim()) {
      input.classList.add('auth__input--error');
      valid = false;
    }
  });

  if (name.value.trim() && !isOnlyLetters(name.value.trim())) {
    name.classList.add('auth__input--error');
    valid = false;
    errorMessage = 'Name must contain only letters';
  }

  if (surname.value.trim() && !isOnlyLetters(surname.value.trim())) {
    surname.classList.add('auth__input--error');
    valid = false;
    errorMessage = 'Surname must contain only letters';
  }

  if (password.value !== confirm.value) {
    confirm.classList.add('auth__input--error');
    valid = false;
    errorMessage = 'Passwords must be identical';
  }

  if (!valid) {
    if (!errorMessage) errorMessage = 'Please fill in all fields correctly';
    showErrorMessage(errorMessage, registerSection);
    return;
  }

  // AJAX
  const res = await postForm('/register', {
    name: name.value,
    surname: surname.value,
    regLogin: login.value,
    regPassword: password.value, // todo: hasło powinno być hashowane na serwerze !!!
    confirmPassword: confirm.value
  });

  if (res.success) {
    alert('Registration successful! Now please log in.');
    showLogin.click();
  } else {
    // Zaznacz błędne pola jeśli wiadomo które
    if (res.field) {
      const field = document.getElementById(res.field);
      if (field) field.classList.add('auth__input--error');
    }
    showErrorMessage(res.message || 'Registration failed', registerSection);
  }
});
