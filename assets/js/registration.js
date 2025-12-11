const registrationForm = document.getElementById("registration-form");
const firstNameInput = document.getElementById("first-name");
const lastNameInput = document.getElementById("last-name");
const emailInput = document.getElementById("email-register");
const passwordInput = document.getElementById("password-register");
const loginForm = document.getElementById("login-form");
const loginUsernameInput = document.getElementById("email-login");
const loginPasswordInput = document.getElementById("password-login");
const logoutBtns = document.querySelectorAll(".log-out");
const btnEyeSignUp = document.getElementById("password-register-visibility");
const btnEyeSignIn = document.getElementById("password-login-visibility");

registrationForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value.trim();
  if (validateRegistration(firstName, lastName, email, password, users)) {
    const currentDate = new Date();
    const newUser = {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      isLoggedIn: true,
      visits: 1,
      books: [],
      cardNumber: assignCardNumber(users),
      cardPurchased: false,
      registrationTimestamp: currentDate.getTime(),
      registrationDate: currentDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      favoriteGenres: [],
      aboutMe: ''
    }
    logoutAllUsers(users);
    addUserToLocalStorage(newUser);
    closeModal([modalSignUp]);
    location.reload();
  }
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const username = loginUsernameInput.value.trim();
  const password = loginPasswordInput.value.trim();
  if (validateLogin(username, password, users)) {
    const foundUser = users.find(user =>
      (user.email && user.email.toLowerCase() === username.toLowerCase() ||
        user.cardNumber && user.cardNumber.toLowerCase() === username.toLowerCase()) &&
      user.password && user.password === password);
    logoutAllUsers(users);
    foundUser.isLoggedIn = true;
    foundUser.visits += 1;
    localStorage.setItem('users-annsilin', JSON.stringify(users));
    closeModal([modalSignIn]);
    location.reload();
  }
});

logoutBtns.forEach(logoutBtn =>
  logoutBtn.addEventListener("click", (e) => {
    if (currentUser) {
      currentUser.isLoggedIn = false;
      localStorage.setItem('users-annsilin', JSON.stringify(users));
      location.reload();
    }
  })
);

btnEyeSignUp.addEventListener("click", () => {
  passwordVisibility(passwordInput);
});

btnEyeSignIn.addEventListener("click", () => {
  passwordVisibility(loginPasswordInput);
});

/* Validate user inputs upon entering login credentials */
const validateLogin = (username, password, users) => {
  let valid = true;

  const userExists = username ? users.some(user =>
    user.email && user.email.toLowerCase() === username.toLowerCase() ||
    user.cardNumber && user.cardNumber.toLowerCase() === username.toLowerCase()) : false;

  const credentialsCorrect = username && password ? users.some(user =>
    (user.email && user.email.toLowerCase() === username.toLowerCase() ||
      user.cardNumber && user.cardNumber.toLowerCase() === username.toLowerCase()) &&
    user.password && user.password === password) : false;

  if (!username) {
    showError(loginUsernameInput, "Email or Card Number is required");
    valid = false;
  } else if (!userExists) {
    showError(loginUsernameInput, "User with this Email or Card Number doesn't exist");
    valid = false;
  } else {
    validInput(loginUsernameInput);
  }

  if (!password) {
    showError(loginPasswordInput, "Password is required");
    valid = false;
  } else if (password.length < 8) {
    showError(loginPasswordInput, "Password must be at least 8 characters");
    valid = false;
  } else if (userExists && !credentialsCorrect) {
    showError(loginPasswordInput, "Incorrect password");
    valid = false;
  } else {
    validInput(loginPasswordInput);
  }
  return valid;
}

/* Validate user inputs upon entering registration credentials */
const validateRegistration = (firstName, lastName, email, password, users) => {
  let valid = true;
  const userExists = users.some(user => user.email === email);

  if (!firstName) {
    showError(firstNameInput, "First name is required");
    valid = false;
  } else {
    validInput(firstNameInput);
  }
  if (!lastName) {
    showError(lastNameInput, "Last name is required");
    valid = false;
  } else {
    validInput(lastNameInput);
  }
  if (!email) {
    showError(emailInput, "Email is required");
    valid = false;
  } else if (!isValidEmail(email)) {
    showError(emailInput, "Email is not valid");
    valid = false;
  } else if (userExists) {
    showError(emailInput, "User with this email already exists");
    valid = false;
  } else {
    validInput(emailInput);
  }
  if (!password) {
    showError(passwordInput, "Password is required")
    valid = false;
  } else if (password.length < 8) {
    showError(passwordInput, "Password must be at least 8 characters")
    valid = false;
  } else {
    validInput(passwordInput);
  }

  return valid;
}

/* Function to show error for incorrect credentials */
const showError = (field, msg) => {
  const inputField = field.parentElement;
  const error = inputField.querySelector(".validation");
  error.innerText = msg;
  inputField.classList.add("error");
}

/* If credentials are correct make sure no error is shown */
const validInput = (field) => {
  const inputField = field.parentElement;
  const error = inputField.querySelector(".validation");
  error.innerText = "";
  inputField.classList.remove("error");
}

/* Check that email is entered correctly */
const isValidEmail = (email) => {
  const reg = /^[\w-.]+@([\w-]+\.)+[a-zA-Z]{2,}$/g;
  return reg.test(String(email));
}

/* Generate a random 9-digit hexadecimal card number (from 1 to FFFFFFFFF) */
const generateCardNumber = () => {
  const maxHex = parseInt('0xFFFFFFFFF', 16);
  const randomNumber = Math.floor((Math.random() * maxHex) + 1);
  return randomNumber.toString(16).toUpperCase().padStart(9, '0');
}

/* Make sure a generated card number doesn't already exist */
const isCardNumberUnique = (cardNumber, users) => {
  return !users.some(user => user.cardNumber === cardNumber);
}

/* Assign a generated card number to a new user */
const assignCardNumber = (users) => {
  let generatedCardNumber;
  do {
    generatedCardNumber = generateCardNumber();
  } while (!isCardNumberUnique(generatedCardNumber, users));

  return generatedCardNumber;
}

/* Add new user to local storage */
const addUserToLocalStorage = (newUser) => {
  users.push(newUser);
  localStorage.setItem('users-annsilin', JSON.stringify(users));
}

/* Logout all users in local storage */
const logoutAllUsers = (users) => {
  users.forEach(user => {
    user.isLoggedIn = false;
  });
  localStorage.setItem('users-annsilin', JSON.stringify(users));
};

const passwordVisibility = (passwordInput) => {
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
  let icons = passwordInput.nextElementSibling;
  icons.querySelector(".icon-eye").style.display = passwordInput.type === "password" ? 'block' : 'none';
  icons.querySelector(".icon-eye-slash").style.display = passwordInput.type === "password" ? 'none' : 'block';
}

const clearSignUpForm = () => {
  firstNameInput.value = "";
  lastNameInput.value = "";
  emailInput.value = "";
  passwordInput.value = "";
  validInput(firstNameInput);
  validInput(lastNameInput);
  validInput(emailInput);
  validInput(passwordInput);
  if (passwordInput.type === "text") {
    passwordVisibility(passwordInput);
  }
}

const clearSignInForm = () => {
  loginUsernameInput.value = "";
  loginPasswordInput.value = "";
  validInput(loginUsernameInput);
  validInput(loginPasswordInput);
  if (loginPasswordInput.type === "text") {
    passwordVisibility(loginPasswordInput);
  }
}
