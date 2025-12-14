let userId = null;
let roomId = null;
let roomName = null;
let lastNotificationId = 0;
let isOnline = false;

/* Generate a random UUID for anonymous users */
const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

/* Initialize user ID based on authentication status */
const initializeUserId = () => {
    if (currentUser && currentUser.cardNumber) {
        userId = currentUser.cardNumber;
        localStorage.setItem('userId', userId);
        localStorage.setItem('userIsAuthenticated', 'true');
        localStorage.setItem('userFirstName', currentUser.firstName);
        localStorage.setItem('userLastName', currentUser.lastName);
    } else {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId && localStorage.getItem('userIsAuthenticated') === 'false') {
            userId = storedUserId;
        } else {
            userId = generateUUID();
            localStorage.setItem('userId', userId);
            localStorage.setItem('userIsAuthenticated', 'false');
        }
    }
};

/* Get user display name for chat */
const getUserDisplayName = () => {
    if (currentUser && currentUser.cardNumber === userId) {
        return `${currentUser.firstName} ${currentUser.lastName}`;
    } else if (localStorage.getItem('userIsAuthenticated') === 'true') {
        const firstName = localStorage.getItem('userFirstName') || 'User';
        const lastName = localStorage.getItem('userLastName') || 'Anonymous';
        return `${firstName} ${lastName}`;
    } else {
        return `User_${userId.slice(0, 4)}`;
    }
};

/* Check if current user is authenticated */
const isUserAuthenticated = () => {
    return currentUser && currentUser.cardNumber && userId === currentUser.cardNumber;
};

/* Get user profile URL if authenticated */
const getUserProfileUrl = (userCardNumber) => {
    if (userCardNumber) {
        return `/profile.html?card=${userCardNumber}`;
    }
    return null;
};

/* Update user ID when authentication status changes */
const updateUserIdOnAuthChange = () => {
    const previousUserId = userId;
    initializeUserId();

    if (previousUserId !== userId && roomId) {
        if (previousUserId) {
            fetch(`http://localhost:5004/presence/${previousUserId}`, {
                method: 'DELETE'
            }).catch(err => console.error('Error removing previous user presence:', err));
        }

        if (isUserAuthenticated() && isOnline) {
            fetch(`http://localhost:5004/presence/${userId}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({status: 'online'})
            }).catch(err => console.error('Error adding new user presence:', err));
        }
    }
};

/* Check presence status on server */
const checkPresence = async () => {
    try {
        const response = await fetch(`http://localhost:5004/presence/${userId}`);
        if (response.ok) {
            const presence = await response.json();
            isOnline = presence.status === 'online';
            updateStatusButton();
        } else {
            isOnline = false;
            updateStatusButton();
        }
    } catch (error) {
        console.error('Error checking presence:', error);
        isOnline = false;
        updateStatusButton();
    }
};

/* Update status button text based on current status */
const updateStatusButton = () => {
    const button = document.getElementById('statusToggle');
    if (button) {
        button.innerText = isOnline ? 'Go Offline' : 'Go Online';
        button.disabled = !isUserAuthenticated();
    }
};

/* Toggle user online/offline status */
const toggleStatus = async () => {
    if (!isUserAuthenticated()) {
        alert('Please sign in to set your online status.');
        return;
    }

    try {
        if (isOnline) {
            const response = await fetch(`http://localhost:5004/presence/${userId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error(`Failed to set offline: ${response.status} ${response.statusText}`);
            }
            isOnline = false;
            console.log('User set to offline');
        } else {
            const response = await fetch(`http://localhost:5004/presence/${userId}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({status: 'online'})
            });
            if (!response.ok) {
                throw new Error(`Failed to set online: ${response.status} ${response.statusText}`);
            }
            isOnline = true;
            console.log('User set to online');
        }
        updateStatusButton();
    } catch (error) {
        console.error('Error toggling status:', error);
    }
};

/* Join a chat room */
const joinRoom = async () => {
    const name = document.getElementById('roomName').value;
    console.log('Attempting to join room with name:', name);

    if (!name) {
        console.error('Room name is empty');
        return;
    }

    try {
        const response = await fetch('http://localhost:5003/rooms', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name})
        });

        if (!response.ok) {
            throw new Error(`Failed to join room: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Server response:', result);

        roomId = result.room_id;
        roomName = result.name;

        console.log('Set roomId to:', roomId);
        console.log('Set roomName to:', roomName);

        document.getElementById('chatSection').classList.remove('hidden');
        updateRoomTitle();

        if (isUserAuthenticated()) {
            await fetch(`http://localhost:5004/presence/${userId}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({status: 'online'})
            });
            isOnline = true;
            updateStatusButton();
        }

        pollMessages();
    } catch (error) {
        console.error('Error joining room:', error);
    }
};

/* Update room title in the UI */
const updateRoomTitle = () => {
    const roomTitle = document.getElementById('roomTitle');
    if (roomTitle && roomName) {
        roomTitle.textContent = `Room: ${roomName}`;
    }
};

/* Send message to chat room */
const sendMessage = async () => {
    const content = document.getElementById('message').value;
    console.log('Attempting to send message with roomId:', roomId, 'content:', content);

    if (!roomId || !content) {
        console.error('Cannot send message: Missing roomId or content', {roomId, content});
        return;
    }

    try {
        const userName = getUserDisplayName();
        console.log('Sending message to:', `http://localhost:5003/rooms/${roomId}/messages`);
        const response = await fetch(`http://localhost:5003/rooms/${roomId}/messages`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                user_id: userId,
                content: content,
                user_name: userName
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to send message: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Message sent successfully:', result);
        document.getElementById('message').value = '';
    } catch (error) {
        console.error('Error sending message:', error);
    }
};

/* Display a message in chat with appropriate formatting */
const displayMessage = (msg) => {
    const chat = document.getElementById('chat');
    if (!chat) return;

    let userDisplayName = `User_${msg.user_id.slice(0, 4)}`;
    let userProfileUrl = null;
    let isClickable = false;

    const isCurrentUser = msg.user_id === userId;
    const isCardNumber = /^[0-9A-F]{9}$/i.test(msg.user_id);

    // Check if message has user_name stored
    if (msg.user_name && msg.user_name.trim() !== '') {
        userDisplayName = msg.user_name;
        if (isCardNumber) {
            userProfileUrl = getUserProfileUrl(msg.user_id);
            isClickable = true;
        }
    } else if (isCardNumber) {
        userDisplayName = `User_${msg.user_id.slice(0, 4)}`;
        userProfileUrl = getUserProfileUrl(msg.user_id);
        isClickable = true;

        if (isCurrentUser && isUserAuthenticated()) {
            userDisplayName = getUserDisplayName();
        }
    } else if (isCurrentUser) {
        userDisplayName = getUserDisplayName();
    }

    let timestampDisplay = '';
    if (msg.created_at) {
        const timestamp = new Date(msg.created_at);
        timestampDisplay = timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }

    const messageElement = document.createElement('div');
    messageElement.className = 'chat-message';
    messageElement.setAttribute('data-message-id', msg.id);

    const usernameElement = document.createElement('span');
    usernameElement.className = 'chat-username';

    if (isClickable && userProfileUrl) {
        const usernameLink = document.createElement('a');
        usernameLink.href = userProfileUrl;
        usernameLink.target = '_blank';
        usernameLink.className = 'chat-username-link';
        usernameLink.textContent = userDisplayName;
        usernameElement.appendChild(usernameLink);
    } else {
        usernameElement.textContent = userDisplayName;
    }

    const contentElement = document.createElement('span');
    contentElement.className = 'chat-content';
    contentElement.textContent = `: ${msg.content}`;

    if (timestampDisplay) {
        const timestampElement = document.createElement('span');
        timestampElement.className = 'chat-timestamp';
        timestampElement.textContent = ` [${timestampDisplay}]`;
        contentElement.appendChild(timestampElement);
    }

    messageElement.appendChild(usernameElement);
    messageElement.appendChild(contentElement);

    chat.appendChild(messageElement);
};

/* Poll for new messages and notifications */
const pollMessages = async () => {
    if (!roomId) {
        console.error('Cannot poll messages: Missing roomId');
        return;
    }

    try {
        const [messagesResponse, notificationsResponse] = await Promise.all([
            fetch(`http://localhost:5003/rooms/${roomId}/messages`),
            fetch(`http://localhost:5006/notifications/${userId}`)
        ]);

        if (!messagesResponse.ok) {
            throw new Error(`Failed to fetch messages: ${messagesResponse.status} ${messagesResponse.statusText}`);
        }

        if (!notificationsResponse.ok) {
            throw new Error(`Failed to fetch notifications: ${notificationsResponse.status} ${notificationsResponse.statusText}`);
        }

        const messages = await messagesResponse.json();
        const notifications = await notificationsResponse.json();

        const chat = document.getElementById('chat');
        const wasScrolledToBottom = chat.scrollHeight - chat.clientHeight <= chat.scrollTop + 50;
        const previousScrollTop = chat.scrollTop;
        const previousScrollHeight = chat.scrollHeight;

        const existingMessageIds = new Set();
        const existingMessageElements = chat.querySelectorAll('.chat-message');
        existingMessageElements.forEach(msg => {
            const msgId = msg.getAttribute('data-message-id');
            if (msgId) existingMessageIds.add(msgId);
        });

        let newMessagesAdded = false;
        messages.forEach(msg => {
            if (!existingMessageIds.has(msg.id.toString())) {
                existingMessageIds.add(msg.id.toString());
                displayMessage(msg);
                newMessagesAdded = true;
            }
        });

        const newNotifications = notifications.filter(notif => notif.id > lastNotificationId);
        if (newNotifications.length > 0) {
            lastNotificationId = Math.max(...newNotifications.map(notif => notif.id));

            if (Notification.permission !== 'granted') {
                await Notification.requestPermission();
            }

            const audio = new Audio('/assets/sounds/notification.mp3');
            audio.play().catch(err => console.error('Error playing sound:', err));

            newNotifications.forEach(notif => {
                const notificationMessage = notif.message;

                if (Notification.permission === 'granted') {
                    new Notification('Library Chat', {
                        body: notificationMessage,
                    });
                }

                const notificationElement = document.createElement('div');
                notificationElement.className = 'chat-notification';
                notificationElement.setAttribute('data-notification-id', notif.id);

                let notifTimestamp = '';
                if (notif.created_at) {
                    const timestamp = new Date(notif.created_at);
                    notifTimestamp = timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    });
                }

                notificationElement.textContent = `[Notification] ${notificationMessage} (${notifTimestamp})`;
                chat.appendChild(notificationElement);
                markNotificationDelivered(notif.id);
            });

            newMessagesAdded = true;
        }

        if (newMessagesAdded) {
            requestAnimationFrame(() => {
                if (wasScrolledToBottom) {
                    chat.scrollTop = chat.scrollHeight;
                } else {
                    const newScrollHeight = chat.scrollHeight;
                    const heightDifference = newScrollHeight - previousScrollHeight;
                    chat.scrollTop = previousScrollTop + heightDifference;
                }
            });
        }

    } catch (error) {
        console.error('Error polling messages or notifications:', error);
    }

    setTimeout(pollMessages, 1500);
};

/* Mark notification as delivered */
const markNotificationDelivered = async (notificationId) => {
    try {
        await fetch(`http://localhost:5006/notifications/${notificationId}/delivered`, {
            method: 'POST'
        });
    } catch (err) {
        console.error('Error marking notification as delivered:', err);
    }
};

/* Initialize chat when DOM is loaded */
document.addEventListener('DOMContentLoaded', () => {
    initializeUserId();

    const statusToggleBtn = document.getElementById('statusToggle');
    const joinRoomBtn = document.getElementById('joinRoom');
    const sendMessageBtn = document.getElementById('sendMessage');
    const messageInput = document.getElementById('message');

    if (statusToggleBtn) {
        statusToggleBtn.addEventListener('click', toggleStatus);
    }

    if (joinRoomBtn) {
        joinRoomBtn.addEventListener('click', joinRoom);
    }

    if (sendMessageBtn) {
        sendMessageBtn.addEventListener('click', sendMessage);
    }

    if (messageInput) {
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    checkPresence();
    updateStatusButton();
});

/* Update user ID when authentication status changes */
const updateChatAuthStatus = () => {
    updateUserIdOnAuthChange();
    updateStatusButton();

    if (roomId) {
        pollMessages();
    }
};

/* Set user to offline when leaving the page */
window.addEventListener('beforeunload', async () => {
    if (userId) {
        await fetch(`http://localhost:5004/presence/${userId}`, {
            method: 'DELETE'
        }).catch(err => console.error('Error removing presence on page unload:', err));
    }
});