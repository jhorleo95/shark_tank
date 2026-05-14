import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User

username = 'admin'
password = '123'

try:
    user, created = User.objects.get_or_create(username=username)
    user.set_password(password)
    user.is_superuser = True
    user.is_staff = True
    user.save()

    if created:
        print(f"Nuevo usuario administrador '{username}' creado. Contraseña: '{password}'")
    else:
        print(f"La contraseña del usuario '{username}' ha sido restablecida a '{password}'")
except Exception as e:
    print(f"Error al crear el administrador: {e}")
