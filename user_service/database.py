import sqlite3
import json
import logging

logger = logging.getLogger(__name__)


def init_db():
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS users
                      (
                          card_number
                          TEXT
                          PRIMARY
                          KEY,
                          email
                          TEXT
                          UNIQUE,
                          first_name
                          TEXT,
                          last_name
                          TEXT,
                          password
                          TEXT,
                          visits
                          INTEGER
                          DEFAULT
                          1,
                          books
                          TEXT,
                          card_purchased
                          BOOLEAN
                          DEFAULT
                          0,
                          registration_date
                          TEXT,
                          registration_timestamp
                          INTEGER,
                          favorite_genres
                          TEXT,
                          about_me
                          TEXT
                      )''')
    conn.commit()
    conn.close()
    logger.info("Users database initialized")


def save_user(card_number, email, first_name, last_name, password, visits=1,
              books=None, card_purchased=False, registration_date='',
              registration_timestamp=0, favorite_genres=None, about_me=''):
    if books is None:
        books = []
    if favorite_genres is None:
        favorite_genres = []

    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()

    # Insert or update user
    cursor.execute('''INSERT OR REPLACE INTO users 
                      (card_number, email, first_name, last_name, password, visits, 
                       books, card_purchased, registration_date, registration_timestamp,
                       favorite_genres, about_me)
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                   (card_number, email, first_name, last_name, password, visits,
                    json.dumps(books), card_purchased, registration_date,
                    registration_timestamp, json.dumps(favorite_genres), about_me))
    conn.commit()
    conn.close()


def get_all_users():
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute('''SELECT card_number,
                             email,
                             first_name,
                             last_name,
                             password,
                             visits,
                             books,
                             card_purchased,
                             registration_date,
                             registration_timestamp,
                             favorite_genres,
                             about_me
                      FROM users''')
    rows = cursor.fetchall()
    conn.close()

    users = []
    for row in rows:
        users.append({
            'cardNumber': row[0],
            'email': row[1],
            'firstName': row[2],
            'lastName': row[3],
            'password': row[4],
            'visits': row[5],
            'books': json.loads(row[6]) if row[6] else [],
            'cardPurchased': bool(row[7]),
            'registrationDate': row[8],
            'registrationTimestamp': row[9],
            'favoriteGenres': json.loads(row[10]) if row[10] else [],
            'aboutMe': row[11],
            'isLoggedIn': False  # Always false from server
        })
    return users


def get_user_by_card(card_number):
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute('''SELECT card_number,
                             email,
                             first_name,
                             last_name,
                             password,
                             visits,
                             books,
                             card_purchased,
                             registration_date,
                             registration_timestamp,
                             favorite_genres,
                             about_me
                      FROM users
                      WHERE card_number = ?''', (card_number,))
    row = cursor.fetchone()
    conn.close()

    if not row:
        return None

    return {
        'cardNumber': row[0],
        'email': row[1],
        'firstName': row[2],
        'lastName': row[3],
        'password': row[4],
        'visits': row[5],
        'books': json.loads(row[6]) if row[6] else [],
        'cardPurchased': bool(row[7]),
        'registrationDate': row[8],
        'registrationTimestamp': row[9],
        'favoriteGenres': json.loads(row[10]) if row[10] else [],
        'aboutMe': row[11],
        'isLoggedIn': False
    }