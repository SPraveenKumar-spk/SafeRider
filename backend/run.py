from app import create_app
from config import Config

app = create_app(config_class=Config)

if __name__ == '__main__':
    print("🚀 SafeRider Backend is running on http://127.0.0.1:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
