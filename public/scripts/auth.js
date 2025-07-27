const mockUsers = [
  { login: 'admin', password: 'admin' }
];

const loginSection = document.getElementById('loginSection');
const registerSection = document.getElementById('registerSection');

const loginBtn = document.querySelector('.auth__button--login');
const registerBtn = document.querySelector('.auth__button--register');

const showLogin = document.getElementById('showLogin');
const showRegister = document.getElementById('showRegister');

const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

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

// -- LOGOWANIE
loginBtn?.addEventListener('click', () => {
  const loginInput = document.getElementById('login');
  const passInput = document.getElementById('password');

  loginInput.classList.remove('auth__input--error');
  passInput.classList.remove('auth__input--error');
  removeErrorMessage();

  const user = mockUsers.find(
    u => u.login === loginInput.value && u.password === passInput.value
  );

  if (user) {
    removeErrorMessage();
    alert('logged in successfully!'); // todo: replace with actual login logic
    loginInput.value = '';
    passInput.value = '';
  } else {
    loginInput.classList.add('auth__input--error');
    passInput.classList.add('auth__input--error');
    showErrorMessage('Wrong username or password', loginSection);
    loginInput.value = '';
    passInput.value = '';
  }
});

// -- REJESTRACJA
registerBtn?.addEventListener('click', () => {
  const name = document.getElementById('name');
  const surname = document.getElementById('surname');
  const login = document.getElementById('regLogin');
  const password = document.getElementById('regPassword');
  const confirm = document.getElementById('confirmPassword');

  const inputs = [name, surname, login, password, confirm];
  let valid = true;
  let errorMessage = '';

  removeErrorMessage();
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

  if (valid) {
    mockUsers.push({ login: login.value, password: password.value });
    alert('Registration successful! Now please log in.');
    showLogin.click();
  } else {
    if (!errorMessage) {
      errorMessage = 'Please fill in all fields correctly';
    }
    showErrorMessage(errorMessage, registerSection);
  }
});
