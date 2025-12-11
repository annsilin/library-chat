const buyCardForm = document.getElementById("buy-card-form");
const creditCardNumberInput = document.getElementById("bank-card-number");
const expirationDateMonthInput = document.getElementById("expiration-date-month");
const expirationDateYearInput = document.getElementById("expiration-date-year");
const expirationDate = document.querySelector(".expiration-date");
const cvcInput = document.getElementById("bank-card-cvc");
const cardholderNameInput = document.getElementById("cardholder-name");
const postalCodeInput = document.getElementById("postal-code");
const cityInput = document.getElementById("city-town");
let submitBtn = buyCardForm.querySelector('button[type="submit"]');

const buyCardInputs = [creditCardNumberInput, expirationDateMonthInput, expirationDateYearInput, cvcInput, cardholderNameInput, postalCodeInput, cityInput];

/* If all input fields aren't empty -> make Buy button working */
buyCardInputs.forEach(input => {
  input.addEventListener('input', () => {
    submitBtn.disabled = !allFieldsFilled(buyCardInputs);
  })
});

buyCardForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const creditCardNumber = creditCardNumberInput.value.trim();
  const expirationDateMonth = expirationDateMonthInput.value.trim();
  const expirationDateYear = expirationDateYearInput.value.trim();
  const cvc = cvcInput.value.trim();
  const cardholderName = cardholderNameInput.value.trim();
  const postalCode = postalCodeInput.value.trim();
  const city = cityInput.value.trim();

  if (validateCreditCard(creditCardNumber, expirationDateMonth, expirationDateYear, cvc, cardholderName, postalCode,
    city)) {
    currentUser.cardPurchased = true;
    localStorage.setItem('users-annsilin', JSON.stringify(users));
    closeModal([modalBuyCard]);
  }
});

/* Validate user inputs upon entering credit card credentials */
const validateCreditCard = (creditCardNumber, expirationDateMonth, expirationDateYear, cvc, cardholderName, postalCode,
                            city) => {
  let valid = true;

  if (!creditCardNumber) {
    showError(creditCardNumberInput, "Card number is required");
    valid = false;
  } else if (hasLetters(creditCardNumber)) {
    showError(creditCardNumberInput, "Card number should only contain digits");
    valid = false;
  } else if (creditCardNumber.replace(/\s/g, '').length !== 16) {
    showError(creditCardNumberInput, "Card number should contain 16 digits");
    valid = false;
  } else {
    validInput(creditCardNumberInput);
  }

  if (!expirationDateYear) {
    showError(expirationDate, "Expiration year is required");
    valid = false;
  } else if (hasLetters(expirationDateYear)) {
    showError(expirationDate, "Expiration year should only contain digits");
    valid = false;
  } else if (expirationDateYear.length !== 2 || expirationDateMonth.length !== 2) {
    showError(expirationDate, "Each field should contain exactly 2 digits");
    valid = false;
  } else {
    validInput(expirationDate);
  }

  if (!expirationDateMonth) {
    showError(expirationDate, "Expiration month is required");
    valid = false;
  } else if (hasLetters(expirationDateMonth)) {
    showError(expirationDate, "Expiration month should only contain digits");
    valid = false;
  } else if (expirationDateMonth.length !== 2 || expirationDateYear.length !== 2) {
    showError(expirationDate, "Each field should contain exactly 2 digits");
    valid = false;
  } else if (!(Number(expirationDateMonth) >= 1 && Number(expirationDateMonth) <= 12)) {
    showError(expirationDate, "Expiration month should be in range of 01 to 12");
    valid = false;
  } else {
    validInput(expirationDate);
  }

  if (!cvc) {
    showError(cvcInput, "CVC is required");
    valid = false;
  } else if (hasLetters(cvc)) {
    showError(cvcInput, "CVC should only contain digits");
    valid = false;
  } else if (cvc.replace(/\s/g, '').length !== 3) {
    showError(cvcInput, "CVC should contain exactly 3 digits");
    valid = false;
  } else {
    validInput(cvcInput);
  }

  if (!cardholderName) {
    showError(cardholderNameInput, "Cardholder name is required");
    valid = false;
  } else {
    validInput(cardholderNameInput);
  }

  if (!postalCode) {
    showError(postalCodeInput, "Postal code is required");
    valid = false;
  } else {
    validInput(postalCodeInput);
  }

  if (!city) {
    showError(cityInput, "City &#47; Town is required");
    valid = false;
  } else {
    validInput(cityInput);
  }

  return valid;
}

/* Helper function to check whether a variable has any characters except digits */
const hasLetters = (input) => {
  const reg = /^\s*\d+\s*$/;
  return !reg.test(String(input.replace(/\s/g, '')));
};

/* Helper function to check whether all input fiels aren't empty */
const allFieldsFilled = (inputs) => {
  return inputs.every(input => input.value.length !== 0);
}

const clearBuyCardForm = () => {
  buyCardInputs.forEach(input => {
    input.value = "";
  })

  validInput(expirationDate);
  validInput(creditCardNumberInput);
  validInput(cvcInput);
  validInput(cardholderNameInput);
  validInput(postalCodeInput);
  validInput(cityInput);
};
