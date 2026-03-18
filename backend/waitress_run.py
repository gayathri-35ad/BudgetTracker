import os
from waitress import serve
from core.wsgi import application

if __name__ == "__main__":
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
    print("--- Starting Backend with Waitress (Stability Mode) ---")
    print("Listening on http://0.0.0.0:8888")
    serve(application, host='0.0.0.0', port=8888)

