const buyCardForm = document.getElementById("buy-card-form");
const creditCardNumberInput = document.getElementById("bank-card-number");
const expirationDateMonthInput = document.getElementById("expiration-date-month");
const expirationDateYearInput = document.getElementById("expiration-date-year");
const expirationDate = document.querySelector(".expiration-date");
const cvcInput = document.getElementById("bank-card-cvc");
const cardholderNameInput = document.getElementById("cardholder-name");
const postalCodeInput = document.getElementById("postal-code");
const cityInput = document.getElementById("city-town");
let submitBtn = buyCardForm ? buyCardForm.querySelector('button[type="submit"]') : null;

const buyCardInputs = [creditCardNumberInput, expirationDateMonthInput, expirationDateYearInput, cvcInput, cardholderNameInput, postalCodeInput, cityInput].filter(Boolean);

/* If all input fields aren't empty -> make Buy button working */
if (buyCardInputs.length > 0 && submitBtn) {
    buyCardInputs.forEach(input => {
        input.addEventListener('input', () => {
            submitBtn.disabled = !allFieldsFilled(buyCardInputs);
        });
    });
}

if (buyCardForm) {
    buyCardForm.addEventListener("submit", async (e) => {
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

            // Update user in the users array
            const userIndex = users.findIndex(u => u.cardNumber === currentUser.cardNumber);
            if (userIndex !== -1) {
                users[userIndex] = currentUser;
            }

            localStorage.setItem('users-annsilin', JSON.stringify(users));

            // Save to server
            try {
                const USER_SERVICE_URL = 'http://localhost:5007';
                const {isLoggedIn, ...userDataForServer} = currentUser;

                await fetch(`${USER_SERVICE_URL}/users`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(userDataForServer)
                });
                console.log('Card purchase saved to server');
            } catch (error) {
                console.error('Error saving card purchase to server:', error);
            }

            closeModal([modalBuyCard]);
        }
    });
}

/* Validate user inputs upon entering credit card credentials */
const validateCreditCard = (creditCardNumber, expirationDateMonth, expirationDateYear, cvc, cardholderName, postalCode,
                            city) => {
    let valid = true;

    // Use global validation functions
    const showErrorFn = window.showError;
    const validInputFn = window.validInput;

    if (!showErrorFn || !validInputFn) {
        console.error('Validation functions not available. Make sure registration.js is loaded first.');
        return false;
    }

    if (!creditCardNumber) {
        showErrorFn(creditCardNumberInput, "Card number is required");
        valid = false;
    } else if (hasLetters(creditCardNumber)) {
        showErrorFn(creditCardNumberInput, "Card number should only contain digits");
        valid = false;
    } else if (creditCardNumber.replace(/\s/g, '').length !== 16) {
        showErrorFn(creditCardNumberInput, "Card number should contain 16 digits");
        valid = false;
    } else {
        validInputFn(creditCardNumberInput);
    }

    if (!expirationDateYear) {
        showErrorFn(expirationDate, "Expiration year is required");
        valid = false;
    } else if (hasLetters(expirationDateYear)) {
        showErrorFn(expirationDate, "Expiration year should only contain digits");
        valid = false;
    } else if (expirationDateYear.length !== 2 || expirationDateMonth.length !== 2) {
        showErrorFn(expirationDate, "Each field should contain exactly 2 digits");
        valid = false;
    } else {
        validInputFn(expirationDate);
    }

    if (!expirationDateMonth) {
        showErrorFn(expirationDate, "Expiration month is required");
        valid = false;
    } else if (hasLetters(expirationDateMonth)) {
        showErrorFn(expirationDate, "Expiration month should only contain digits");
        valid = false;
    } else if (expirationDateMonth.length !== 2 || expirationDateYear.length !== 2) {
        showErrorFn(expirationDate, "Each field should contain exactly 2 digits");
        valid = false;
    } else if (!(Number(expirationDateMonth) >= 1 && Number(expirationDateMonth) <= 12)) {
        showErrorFn(expirationDate, "Expiration month should be in range of 01 to 12");
        valid = false;
    } else {
        validInputFn(expirationDate);
    }

    if (!cvc) {
        showErrorFn(cvcInput, "CVC is required");
        valid = false;
    } else if (hasLetters(cvc)) {
        showErrorFn(cvcInput, "CVC should only contain digits");
        valid = false;
    } else if (cvc.replace(/\s/g, '').length !== 3) {
        showErrorFn(cvcInput, "CVC should contain exactly 3 digits");
        valid = false;
    } else {
        validInputFn(cvcInput);
    }

    if (!cardholderName) {
        showErrorFn(cardholderNameInput, "Cardholder name is required");
        valid = false;
    } else {
        validInputFn(cardholderNameInput);
    }

    if (!postalCode) {
        showErrorFn(postalCodeInput, "Postal code is required");
        valid = false;
    } else {
        validInputFn(postalCodeInput);
    }

    if (!city) {
        showErrorFn(cityInput, "City &#47; Town is required");
        valid = false;
    } else {
        validInputFn(cityInput);
    }

    return valid;
};

/* Helper function to check whether a variable has any characters except digits */
const hasLetters = (input) => {
    const reg = /^\s*\d+\s*$/;
    return !reg.test(String(input.replace(/\s/g, '')));
};

/* Helper function to check whether all input fields aren't empty */
const allFieldsFilled = (inputs) => {
    return inputs.every(input => input.value.length !== 0);
};

/* Make clearBuyCardForm globally accessible */
window.clearBuyCardForm = function () {
    if (buyCardInputs.length === 0) return;

    buyCardInputs.forEach(input => {
        if (input) input.value = "";
    });

    // Use global validInput if available
    const validInputFn = window.validInput;

    if (validInputFn) {
        if (expirationDate) validInputFn(expirationDate);
        if (creditCardNumberInput) validInputFn(creditCardNumberInput);
        if (cvcInput) validInputFn(cvcInput);
        if (cardholderNameInput) validInputFn(cardholderNameInput);
        if (postalCodeInput) validInputFn(postalCodeInput);
        if (cityInput) validInputFn(cityInput);
    }
};