/* Create HTML markup for each book in given data array */
const createBook = (book) => {
  let buttonBuy = `<button class="button-buy button" id="buy-${book.id}" onclick="buyBtnHandler(event)">Buy</button>`;
  if (currentUser && currentUser.books.includes(book.id)) {
    buttonBuy = `<button class="button-own" disabled>Own</button>`
  }
  return `
    <div class="book">
      <h3 class="staff-picks">Staff Picks</h3>
      <hr class="staff-picks__underline">
      <h4 class="book__title">${book.title}</h4>
      <h5 class="book__author">By ${book.author}</h5>
      <p class="book__description">${book.description}</p>
      ${buttonBuy}
      <img class="book__cover" src="${book.cover}" alt="${book.title} by ${book.author} cover">
    </div>
  `
}

/* Render created books into corresponding seasons sections */
const createSeasonalBooks = (seasonId) => {
  const seasonalBooks = books.filter(books => books.season_id === seasonId);
  let container = document.querySelector(".books-" + seasonId);
  container.innerHTML = seasonalBooks.map(book => createBook(book)).join("");
}

createSeasonalBooks(1);
createSeasonalBooks(2);
createSeasonalBooks(3);
createSeasonalBooks(4);

const radioButtons = document.querySelectorAll("input[name='fav-season']");
const seasonalBooksAll = document.querySelectorAll('.books');

/* Seasonal books tabs */
radioButtons.forEach((radioButton, index) => {
  radioButton.addEventListener("change", () => {
    // Hide all seasons books
    seasonalBooksAll.forEach((seasonalBooks) => {
      seasonalBooks.classList.add("seasonal-books-hidden");
      seasonalBooks.classList.remove("seasonal-books-visible");
      setTimeout(function () {
        seasonalBooks.style.display = "none";
      }, 200);
    });

    // Show books for the selected season
    seasonalBooksAll[index].classList.add("seasonal-books-visible");
    seasonalBooksAll[index].classList.remove("seasonal-books-hidden");
    setTimeout(function () {
      seasonalBooksAll[index].style.display = "grid";
    }, 200);
  });
});

/* Handle Buy button click on different use cases */
const buyBtnHandler = async (event) => {
  if (!event) {
    console.error('Event is undefined');
    return;
  }

  event.stopPropagation();
  closeModal(modals);

  // If there's no logged in user -> open Sign In modal
  if (!currentUser) {
    openModal(modalSignIn);
  }
  // If the user is logged in but didn't purchase a card -> open Buy Card modal
  else if (currentUser && !currentUser.cardPurchased) {
    openModal(modalBuyCard);
  }
  // If user is logged in and purchased a card
  else if (currentUser && currentUser.cardPurchased) {
    // Get an ID of desired book
    let purchasedBook = event.target.id.split('-')[1];
    let bookId = Number(purchasedBook);

    console.log('Buying book:', bookId);

    // Push this book to user's purchased books array
    currentUser.books.push(bookId);

    // Update user in the users array
    const userIndex = users.findIndex(u => u.cardNumber === currentUser.cardNumber);
    if (userIndex !== -1) {
      users[userIndex] = currentUser;
    }

    localStorage.setItem('users-annsilin', JSON.stringify(users));
    console.log('Book added to localStorage');

    // Save to server
    try {
      const USER_SERVICE_URL = 'http://localhost:5007';
      const { isLoggedIn, ...userDataForServer } = currentUser;

      const response = await fetch(`${USER_SERVICE_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userDataForServer)
      });

      if (response.ok) {
        console.log('Book purchase saved to server');
      } else {
        console.error('Failed to save book purchase to server');
      }
    } catch (error) {
      console.error('Error saving book purchase to server:', error);
    }

    // Replace Buy button with Own button
    event.target.outerHTML = `<button class="button-own" disabled>Own</button>`;

    // Update info in profile modal and reader's card
    changeReadersCard(currentUser);
    updateProfileModal(currentUser);
  }
}

/* Make buyBtnHandler globally accessible */
window.buyBtnHandler = buyBtnHandler;