from flask import Flask, send_from_directory, redirect

app = Flask(__name__, static_folder='assets')

@app.route('/')
def serve_home():
    return send_from_directory('.', 'index.html')

@app.route('/chat')
def serve_chat():
    return send_from_directory('.', 'chat.html')

@app.route('/assets/<path:path>')
def serve_assets(path):
    return send_from_directory('assets', path)

if __name__ == '__main__':
    app.run(port=8000, debug=True)
