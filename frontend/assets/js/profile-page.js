/* Initialize profile page and render user profile data */
const initProfilePage = () => {
    // Get user from URL parameter or use current logged in user
    const urlParams = new URLSearchParams(window.location.search);
    const cardNumberFromURL = urlParams.get('card');
    let profileUser = null;

    if (cardNumberFromURL) {
        // Find user by card number from URL parameter
        profileUser = users.find(user => user.cardNumber &&
            user.cardNumber.toUpperCase() === cardNumberFromURL.toUpperCase());
    } else if (currentUser) {
        // Show current user's profile
        profileUser = currentUser;
    }

    const isOwnProfile = currentUser && profileUser &&
        currentUser.cardNumber === profileUser.cardNumber;

    const profileContent = document.getElementById('profile-content');

    // Handle cases when user is not found or not logged in
    if (!profileUser) {
        if (cardNumberFromURL) {
            profileContent.innerHTML = `
        <div class="profile-unauthorized">
          <h2 class="profile-header__title">User Not Found</h2>
          <p class="profile-unauthorized__message">User with card number "${cardNumberFromURL}" not found.</p>
          ${currentUser ? `
            <a href="profile.html" class="profile-action-btn profile-action-btn--primary">Go to My Profile</a>
          ` : `
            <a href="index.html" class="profile-action-btn profile-action-btn--primary">Go to Home Page</a>
          `}
        </div>
      `;
        } else if (!currentUser) {
            profileContent.innerHTML = `
        <div class="profile-unauthorized">
          <h2 class="profile-header__title">Profile Access</h2>
          <p class="profile-unauthorized__message">Please log in to view your profile.</p>
          <div class="profile-actions" style="justify-content: center;">
            <button class="profile-action-btn profile-action-btn--primary log-in">Log In</button>
            <button class="profile-action-btn profile-action-btn--outline sign-up">Sign Up</button>
          </div>
        </div>
      `;
            addAuthButtonHandlers();
        }
        return;
    }

    // Format registration date for display
    const formatRegistrationDate = (user) => {
        if (user.registrationDate) {
            return user.registrationDate;
        } else if (user.registrationTimestamp) {
            const date = new Date(user.registrationTimestamp);
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }
        return 'Not specified';
    };

    // Get user's books with complete information
    const getUserBooksWithInfo = () => {
        if (!profileUser.books || !Array.isArray(profileUser.books)) {
            return [];
        }

        return profileUser.books.map(bookId => {
            const book = books.find(b => b.id === bookId);
            return book || {
                id: bookId,
                title: 'Unknown Book',
                author: 'Unknown Author',
                cover: 'assets/img/book-covers/default.png'
            };
        });
    };

    // Generate HTML for user's borrowed books
    const generateBooksHTML = (userBooks) => {
        if (userBooks.length === 0) {
            return `
        <div class="profile-empty-state">
          <h3 class="profile-empty-state__title">No Books Currently Borrowed</h3>
          <p class="profile-empty-state__description">
            ${isOwnProfile ? 'Visit our library or browse our online catalog to borrow your next favorite book.' :
                'This user has no borrowed books at the moment.'}
          </p>
          ${isOwnProfile ? `
            <button class="profile-action-btn profile-action-btn--primary" onclick="window.location.href='index.html#favorites'">
              Browse Books
            </button>
          ` : ''}
        </div>`;
        }

        return userBooks.map(book => `
      <div class="profile-book-card" data-book-id="${book.id}">
        <img src="${book.cover}" alt="${book.title}" class="profile-book-card__cover">
        <div class="profile-book-card__info">
          <h4 class="profile-book-card__title">${book.title}</h4>
          <p class="profile-book-card__author">${book.author}</p>
        </div>
        ${isOwnProfile ? `
          <button class="btn-return-book" title="Return Book" onclick="returnBook(${book.id})">
            &#10008;
          </button>
        ` : ''}
      </div>
    `).join('');
    };

    const userBooks = getUserBooksWithInfo();

    // Render profile HTML
    profileContent.innerHTML = `
    <div class="profile-header">
      <h1 class="profile-header__title">${isOwnProfile ? 'My Profile' : `${profileUser.firstName}'s Profile`}</h1>
      <a href="index.html" class="profile-header__back-link">
        <svg width="20px" height="20px" style="transform: rotate(180deg);">
          <use href="assets/svg/icons.svg#icon-right-arrow"></use>
        </svg>
        Back to Home
      </a>
    </div>

    <section class="profile-section">
      <h2 class="profile-section__title">Reading Statistics</h2>
      <div class="profile-section__title-underline"></div>

      <div class="profile-stats">
        <div class="profile-stat-card">
          <svg class="profile-stat-card__icon" width="20px" height="21px">
            <use href="assets/svg/icons.svg#icon-visits"></use>
          </svg>
          <h3 class="profile-stat-card__value">${profileUser.visits || 0}</h3>
          <p class="profile-stat-card__label">Library Visits</p>
        </div>

        <div class="profile-stat-card">
          <svg class="profile-stat-card__icon" width="20px" height="21px">
            <use href="assets/svg/icons.svg#icon-books"></use>
          </svg>
          <h3 class="profile-stat-card__value">${userBooks.length}</h3>
          <p class="profile-stat-card__label">Books Owned</p>
        </div>

        <div class="profile-stat-card">
          <svg class="profile-stat-card__icon" width="20px" height="21px">
            <use href="assets/svg/icons.svg#icon-bonuses"></use>
          </svg>
          <h3 class="profile-stat-card__value">${profileUser.bonuses || 1240}</h3>
          <p class="profile-stat-card__label">Bonus Points</p>
        </div>

        <div class="profile-stat-card">
          <svg class="profile-stat-card__icon" width="28px" height="28px">
            <use href="assets/svg/icons.svg#icon-profile"></use>
          </svg>
          <h3 class="profile-stat-card__value">${profileUser.cardPurchased ? 'Premium' : 'Basic'}</h3>
          <p class="profile-stat-card__label">Member Level</p>
        </div>
      </div>
    </section>

    <section class="profile-section">
      <h2 class="profile-section__title">Library Membership</h2>
      <div class="profile-section__title-underline"></div>

      <div class="profile-membership">
        <div class="profile-membership__badge">
          ${profileUser.firstName[0].toUpperCase()}${profileUser.lastName[0].toUpperCase()}
        </div>
        <div class="profile-membership__info">
          <h3 class="profile-membership__title">${profileUser.cardPurchased ? 'Premium' : 'Basic'} Member</h3>
          <p class="profile-membership__number">Card Number: ${profileUser.cardNumber}</p>
          <p class="profile-membership__expiry">Member since: ${formatRegistrationDate(profileUser)}</p>
        </div>
      </div>
    </section>

    <section class="profile-section">
      <h2 class="profile-section__title">Personal Information</h2>
      <div class="profile-section__title-underline"></div>

      <div class="profile-info-grid">
        <div class="profile-info-card">
          <h3 class="profile-info-card__title">Basic Info</h3>

          <div class="profile-info-item">
            <span class="profile-info-item__label">Full Name</span>
            <div class="profile-info-item__value" id="name-value">
              ${profileUser.firstName} ${profileUser.lastName}
            </div>
            ${isOwnProfile ? `
              <div class="profile-form" id="name-form">
                <input type="text" class="profile-input" value="${profileUser.firstName}" id="first-name-input" placeholder="First Name">
                <input type="text" class="profile-input" value="${profileUser.lastName}" id="last-name-input" placeholder="Last Name" style="margin-top: 10px;">
                <div class="profile-form-buttons">
                  <button class="profile-action-btn profile-action-btn--primary" onclick="saveProfileField('name')">Save</button>
                  <button class="profile-action-btn profile-action-btn--outline" onclick="cancelProfileEdit('name')">Cancel</button>
                </div>
              </div>
            ` : ''}
          </div>

          <div class="profile-info-item">
            <span class="profile-info-item__label">Email Address</span>
            <div class="profile-info-item__value" id="email-value">
              ${profileUser.email}
            </div>
          </div>

          <div class="profile-info-item">
            <span class="profile-info-item__label">Card Purchased</span>
            <div class="profile-info-item__value">
              ${profileUser.cardPurchased ? 'Yes' : 'No'}
            </div>
          </div>
        </div>

        <div class="profile-info-card">
          <h3 class="profile-info-card__title">Account Details</h3>

          <div class="profile-info-item">
            <span class="profile-info-item__label">Member Since</span>
            <div class="profile-info-item__value">
              ${formatRegistrationDate(profileUser)}
            </div>
          </div>

          <div class="profile-info-item">
            <span class="profile-info-item__label">Favorite Genres</span>
            <div class="profile-info-item__value" id="genres-value">
              ${profileUser.favoriteGenres ? profileUser.favoriteGenres.join(', ') : 'Not specified'}
            </div>
            ${isOwnProfile ? `
              <div class="profile-form" id="genres-form">
                <select multiple class="profile-input" id="genres-input" style="height: 120px;">
                  <option value="Fiction" ${profileUser.favoriteGenres && profileUser.favoriteGenres.includes('Fiction') ? 'selected' : ''}>Fiction</option>
                  <option value="Non-Fiction" ${profileUser.favoriteGenres && profileUser.favoriteGenres.includes('Non-Fiction') ? 'selected' : ''}>Non-Fiction</option>
                  <option value="Science Fiction" ${profileUser.favoriteGenres && profileUser.favoriteGenres.includes('Science Fiction') ? 'selected' : ''}>Science Fiction</option>
                  <option value="Fantasy" ${profileUser.favoriteGenres && profileUser.favoriteGenres.includes('Fantasy') ? 'selected' : ''}>Fantasy</option>
                  <option value="Mystery" ${profileUser.favoriteGenres && profileUser.favoriteGenres.includes('Mystery') ? 'selected' : ''}>Mystery</option>
                  <option value="Romance" ${profileUser.favoriteGenres && profileUser.favoriteGenres.includes('Romance') ? 'selected' : ''}>Romance</option>
                  <option value="Biography" ${profileUser.favoriteGenres && profileUser.favoriteGenres.includes('Biography') ? 'selected' : ''}>Biography</option>
                  <option value="History" ${profileUser.favoriteGenres && profileUser.favoriteGenres.includes('History') ? 'selected' : ''}>History</option>
                  <option value="Poetry" ${profileUser.favoriteGenres && profileUser.favoriteGenres.includes('Poetry') ? 'selected' : ''}>Poetry</option>
                  <option value="Drama" ${profileUser.favoriteGenres && profileUser.favoriteGenres.includes('Drama') ? 'selected' : ''}>Drama</option>
                </select>
                <small style="display: block; margin-top: 5px; color: #666; font-size: 12px;">Hold Ctrl/Cmd to select multiple genres</small>
                <div class="profile-form-buttons">
                  <button class="profile-action-btn profile-action-btn--primary" onclick="saveProfileField('genres')">Save</button>
                  <button class="profile-action-btn profile-action-btn--outline" onclick="cancelProfileEdit('genres')">Cancel</button>
                </div>
              </div>
            ` : ''}
          </div>

          <div class="profile-info-item">
            <span class="profile-info-item__label">About Me</span>
            <div class="profile-info-item__value" id="about-value" style="min-height: 80px; max-height: 200px;">
              ${profileUser.aboutMe || 'No information provided'}
            </div>
            ${isOwnProfile ? `
              <div class="profile-form" id="about-form">
                <textarea class="profile-input" id="about-input" rows="4" placeholder="Tell us about yourself...">${profileUser.aboutMe || ''}</textarea>
                <div class="profile-form-buttons">
                  <button class="profile-action-btn profile-action-btn--primary" onclick="saveProfileField('about')">Save</button>
                  <button class="profile-action-btn profile-action-btn--outline" onclick="cancelProfileEdit('about')">Cancel</button>
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      </div>

      ${isOwnProfile ? `
        <div class="profile-actions">
          <button class="profile-action-btn profile-action-btn--outline" onclick="changePassword()">
            Change Password
          </button>
        </div>
      ` : ''}
    </section>

    <section class="profile-section">
      <h2 class="profile-section__title">Currently Borrowed Books</h2>
      <div class="profile-section__title-underline"></div>

      <div class="profile-bookshelf" id="current-books">
        ${generateBooksHTML(userBooks)}
      </div>
    </section>
  `;

    // Add edit handlers for profile fields (only for own profile)
    if (isOwnProfile) {
        addProfileEditHandlers();
        addAuthButtonHandlers();
    }
};

/* Add click handlers for editable profile fields */
const addProfileEditHandlers = () => {
    document.querySelectorAll('.profile-info-item__value').forEach(field => {
        if (field.id && field.id.includes('-value') &&
            ['name', 'genres', 'about'].includes(field.id.replace('-value', ''))) {
            field.addEventListener('click', function () {
                const fieldName = this.id.replace('-value', '');
                startProfileFieldEdit(fieldName);
            });
        }
    });
};

/* Start editing a profile field */
let currentEditField = null;

const startProfileFieldEdit = (fieldName) => {
    if (currentEditField) {
        cancelProfileEdit(currentEditField);
    }

    currentEditField = fieldName;
    const valueElement = document.getElementById(`${fieldName}-value`);
    const formElement = document.getElementById(`${fieldName}-form`);

    if (valueElement && formElement) {
        valueElement.style.display = 'none';
        formElement.classList.add('active');

        // Focus on first input field
        if (fieldName === 'name') {
            const firstNameInput = formElement.querySelector('#first-name-input');
            if (firstNameInput) {
                firstNameInput.focus();
                firstNameInput.select();
            }
        } else if (fieldName === 'about') {
            const aboutInput = formElement.querySelector('#about-input');
            if (aboutInput) {
                aboutInput.focus();
            }
        }
    }
};

/* Save edited profile field to localStorage and server */
const saveProfileField = (fieldName) => {
    if (!currentUser) return;

    const userIndex = users.findIndex(user => user.cardNumber === currentUser.cardNumber);
    if (userIndex === -1) return;

    const formElement = document.getElementById(`${fieldName}-form`);
    const valueElement = document.getElementById(`${fieldName}-value`);

    if (!formElement || !valueElement) return;

    let newValue = '';

    if (fieldName === 'name') {
        const firstName = document.getElementById('first-name-input').value.trim();
        const lastName = document.getElementById('last-name-input').value.trim();

        if (!firstName || !lastName) {
            alert('Both first name and last name are required');
            return;
        }

        newValue = `${firstName} ${lastName}`;
        users[userIndex].firstName = firstName;
        users[userIndex].lastName = lastName;
    } else if (fieldName === 'genres') {
        const selectElement = document.getElementById('genres-input');
        const selectedOptions = Array.from(selectElement.selectedOptions).map(option => option.value);
        newValue = selectedOptions.length > 0 ? selectedOptions.join(', ') : 'Not specified';
        users[userIndex].favoriteGenres = selectedOptions;
    } else if (fieldName === 'about') {
        const aboutInput = document.getElementById('about-input');
        newValue = aboutInput.value.trim() || 'No information provided';
        users[userIndex].aboutMe = aboutInput.value.trim();
    }

    // Save to localStorage
    localStorage.setItem('users-annsilin', JSON.stringify(users));

    // Update currentUser reference
    currentUser = users[userIndex];

    // Save to server
    if (typeof saveUserToServer === 'function') {
        saveUserToServer(currentUser);
    } else {
        // Fallback if function not available
        fetch('http://localhost:5007/users', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                cardNumber: currentUser.cardNumber,
                email: currentUser.email,
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
                password: currentUser.password,
                visits: currentUser.visits,
                books: currentUser.books,
                cardPurchased: currentUser.cardPurchased,
                registrationDate: currentUser.registrationDate,
                registrationTimestamp: currentUser.registrationTimestamp,
                favoriteGenres: currentUser.favoriteGenres,
                aboutMe: currentUser.aboutMe
            })
        }).catch(err => console.error('Error saving to server:', err));
    }

    valueElement.textContent = newValue;
    valueElement.style.display = 'flex';
    formElement.classList.remove('active');
    currentEditField = null;

    showProfileNotification(`${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} updated successfully!`);

    // Update UI in header
    if (typeof updateUI === 'function') {
        updateUI();
    }
};

/* Cancel editing a profile field */
const cancelProfileEdit = (fieldName) => {
    const valueElement = document.getElementById(`${fieldName}-value`);
    const formElement = document.getElementById(`${fieldName}-form`);

    if (valueElement && formElement) {
        valueElement.style.display = 'flex';
        formElement.classList.remove('active');
        currentEditField = null;
    }
};

/* Handle password change */
const changePassword = () => {
    if (!currentUser) return;

    const oldPassword = prompt('Enter current password:');
    if (!oldPassword) return;

    if (oldPassword !== currentUser.password) {
        alert('Incorrect current password');
        return;
    }

    const newPassword = prompt('Enter new password (min 8 characters):');
    if (!newPassword || newPassword.length < 8) {
        alert('New password must be at least 8 characters long');
        return;
    }

    const confirmPassword = prompt('Confirm new password:');
    if (newPassword !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    const userIndex = users.findIndex(user => user.cardNumber === currentUser.cardNumber);
    if (userIndex !== -1) {
        users[userIndex].password = newPassword;
        localStorage.setItem('users-annsilin', JSON.stringify(users));
        currentUser = users[userIndex];
        showProfileNotification('Password changed successfully!');
    }
};

/* Return a borrowed book */
const returnBook = async (bookId) => {
    if (!bookId || !currentUser || !confirm('Return this book to the library?')) return;

    console.log('Returning book:', bookId);

    const userIndex = users.findIndex(user => user.cardNumber === currentUser.cardNumber);
    if (userIndex === -1) {
        console.error('User not found in users array');
        return;
    }

    // Remove book from user's books array
    users[userIndex].books = users[userIndex].books.filter(id => id !== bookId);

    // Update currentUser reference
    currentUser = users[userIndex];

    // Save to localStorage
    localStorage.setItem('users-annsilin', JSON.stringify(users));
    console.log('Book removed from localStorage');

    // Save to server
    try {
        const USER_SERVICE_URL = 'http://localhost:5007';
        const {isLoggedIn, ...userDataForServer} = currentUser;

        const response = await fetch(`${USER_SERVICE_URL}/users`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(userDataForServer)
        });

        if (response.ok) {
            console.log('Book return saved to server');
        } else {
            console.error('Failed to save book return to server');
        }
    } catch (error) {
        console.error('Error saving book return to server:', error);
    }

    // Refresh profile page
    initProfilePage();
    showProfileNotification('Book returned successfully!');

    // Update readers card if on main page
    if (typeof changeReadersCard === 'function') {
        changeReadersCard(currentUser);
    }

    // Update profile modal if exists
    if (typeof updateProfileModal === 'function') {
        updateProfileModal(currentUser);
    }
};

/* Make returnBook globally accessible */
window.returnBook = returnBook;

/* Show notification message */
const showProfileNotification = (message) => {
    const notification = document.createElement('div');
    notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #BB945F;
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    font-family: Inter, sans-serif;
    font-size: 16px;
    z-index: 1000;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    animation: slideIn 0.3s ease-out;
  `;

    notification.textContent = message;
    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
};

/* Add handlers for auth buttons (Log In / Sign Up) */
const addAuthButtonHandlers = () => {
    document.querySelectorAll('.log-in').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            if (typeof openModal === 'function' && typeof modalSignIn !== 'undefined') {
                openModal(modalSignIn);
            } else {
                window.location.href = 'index.html#library-card';
            }
        });
    });

    document.querySelectorAll('.sign-up').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            if (typeof openModal === 'function' && typeof modalSignUp !== 'undefined') {
                openModal(modalSignUp);
            } else {
                window.location.href = 'index.html#library-card';
            }
        });
    });
};

/* Initialize profile page when DOM is loaded */
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other scripts to load (especially books_data.js)
    setTimeout(() => {
        initProfilePage();
    }, 100);
});