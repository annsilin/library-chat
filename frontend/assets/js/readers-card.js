const cardForm = document.getElementById("card-form");
const nameInput = document.getElementById("readers-name");
const cardNumberInput = document.getElementById("card-number");
let cardWrapper = document.querySelector('.card-form-wrapper');

cardForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const cardNumber = cardNumberInput.value.trim();
  const foundUser = users.find(user => user.cardNumber === cardNumber.toUpperCase());
  const name = nameInput.value.trim().replace(/\s/g, '').toLowerCase();

  if (foundUser) {
    if (name === foundUser.firstName.toLowerCase() + foundUser.lastName.toLowerCase()) {
      changeReadersCard(foundUser);
      cardWrapper.classList.toggle('switch');
      setTimeout(function() {
        cardWrapper.classList.toggle('switch');
        nameInput.value = "";
        cardNumberInput.value = "";
        document.querySelector(".card-subtitle").innerText = "Find your Library card";
      }, 10000);

    }
  }

});

const changeReadersCard = (user) => {
  document.querySelector(".card-input.filled.name").innerText = user.firstName + " " + user.lastName;
  document.querySelector(".card-input.filled.card").innerText = user.cardNumber;
  document.querySelector(".library-card-visits").innerText = user.visits;
  document.querySelector(".library-card-books").innerText = user.books.length;
  document.querySelector(".card-subtitle").innerText = "Your Library card";
}
