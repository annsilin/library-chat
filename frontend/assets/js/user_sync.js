/* User synchronization with server */
const USER_SERVICE_URL = 'http://localhost:5007';

/* Sync users from server to localStorage */
const syncUsersFromServer = async () => {
    try {
        const response = await fetch(`${USER_SERVICE_URL}/users`);
        if (!response.ok) {
            console.warn('Failed to sync users from server');
            return;
        }

        const serverUsers = await response.json();
        let localUsers = JSON.parse(localStorage.getItem('users-annsilin')) || [];

        // Remember current logged in user
        const currentLoggedInUser = localUsers.find(u => u.isLoggedIn === true);

        // Create a map of local users by card number for quick lookup
        const localUsersMap = new Map();
        localUsers.forEach(user => {
            localUsersMap.set(user.cardNumber, user);
        });

        // Merge server users with local users
        serverUsers.forEach(serverUser => {
            const localUser = localUsersMap.get(serverUser.cardNumber);

            if (!localUser) {
                // User doesn't exist locally - add them with isLoggedIn: false
                serverUser.isLoggedIn = false;
                localUsersMap.set(serverUser.cardNumber, serverUser);
            } else {
                // User exists - update their data but preserve isLoggedIn status
                const isLoggedIn = localUser.isLoggedIn;
                localUsersMap.set(serverUser.cardNumber, {
                    ...serverUser,
                    isLoggedIn: isLoggedIn
                });
            }
        });

        // Convert map back to array
        localUsers = Array.from(localUsersMap.values());

        // Ensure only one user is logged in (the one who was logged in before sync)
        if (currentLoggedInUser) {
            localUsers = localUsers.map(user => ({
                ...user,
                isLoggedIn: user.cardNumber === currentLoggedInUser.cardNumber
            }));
        }

        // Save merged users back to localStorage
        localStorage.setItem('users-annsilin', JSON.stringify(localUsers));
        console.log('Users synced from server:', localUsers.length);

    } catch (error) {
        console.error('Error syncing users from server:', error);
    }
};

/* Sync users on page load */
document.addEventListener('DOMContentLoaded', async () => {
    await syncUsersFromServer();

    // Reload user data after sync
    users = JSON.parse(localStorage.getItem('users-annsilin')) || [];
    currentUser = users.find(u => u.isLoggedIn === true);

    // If there's a logged in user, update UI
    if (currentUser && typeof updateUI === 'function') {
        updateUI();
    }
});

/* Override addUserToLocalStorage to also save to server */
const originalAddUserToLocalStorage = window.addUserToLocalStorage;
window.addUserToLocalStorage = function(newUser) {
    // Call original function
    if (originalAddUserToLocalStorage) {
        originalAddUserToLocalStorage(newUser);
    } else {
        // Fallback if original doesn't exist
        users.push(newUser);
        localStorage.setItem('users-annsilin', JSON.stringify(users));
    }

    // Also save to server
    saveUserToServer(newUser);
};