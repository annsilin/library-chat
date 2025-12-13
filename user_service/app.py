from flask import Flask, request, jsonify
from flask_cors import CORS
from .database import init_db, save_user, get_all_users, get_user_by_card
import logging

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:8000"}})

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

init_db()


@app.route('/users', methods=['POST'])
def create_user():
    """Save or update user data"""
    data = request.get_json()

    required_fields = ['cardNumber', 'email', 'firstName', 'lastName', 'password']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'Missing required field: {field}'}), 400

    try:
        save_user(
            card_number=data['cardNumber'],
            email=data['email'],
            first_name=data['firstName'],
            last_name=data['lastName'],
            password=data['password'],
            visits=data.get('visits', 1),
            books=data.get('books', []),
            card_purchased=data.get('cardPurchased', False),
            registration_date=data.get('registrationDate', ''),
            registration_timestamp=data.get('registrationTimestamp', 0),
            favorite_genres=data.get('favoriteGenres', []),
            about_me=data.get('aboutMe', '')
        )
        logger.info(f"User saved: {data['cardNumber']}")
        return jsonify({'message': 'User saved successfully'}), 201
    except Exception as e:
        logger.error(f"Error saving user: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/users', methods=['GET'])
def get_users():
    """Get all users (without passwords for security)"""
    try:
        users = get_all_users()
        return jsonify(users), 200
    except Exception as e:
        logger.error(f"Error fetching users: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/users/<card_number>', methods=['GET'])
def get_user(card_number):
    """Get specific user by card number"""
    try:
        user = get_user_by_card(card_number)
        if not user:
            return jsonify({'error': 'User not found'}), 404
        return jsonify(user), 200
    except Exception as e:
        logger.error(f"Error fetching user: {e}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5007, debug=False)