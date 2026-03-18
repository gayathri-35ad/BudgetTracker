import os
import sys
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

import django
django.setup()

from users.models import User

# Check if test user already exists
if User.objects.filter(email='test@example.com').exists():
    print('Test user already exists!')
else:
    user = User.objects.create_user(
        username='testuser',
        email='test@example.com',
        password='Test@1234'
    )
    print(f'User created successfully!')
    print(f'  Email: test@example.com')
    print(f'  Password: Test@1234')

print('\nAll users in database:')
for u in User.objects.all():
    print(f'  - {u.email} ({u.username})')
