import os
import django
from django.core.management import call_command

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

def run_fix():
    print("--- Starting Backend Iterative Run ---")
    
    db_path = 'db.sqlite3'

    
    # Run migrations
    try:
        # print("Running migrations...")
        # call_command('migrate', interactive=False)
        print("Migrations skipped (assuming done).")
    except Exception as e:

        print(f"Migration error: {e}")
        return

    # Start server
    try:
        print("Starting server...")
        call_command('runserver', '0.0.0.0:8000', use_reloader=False, use_threading=False)
    except Exception as e:
        print(f"Server error: {e}")

if __name__ == "__main__":
    import faulthandler
    faulthandler.enable()
    run_fix()
