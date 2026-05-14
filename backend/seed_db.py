import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.db import connection

sql_file = r"F:\poryecto universidad\shark_tank\datos.sql"

with open(sql_file, 'r', encoding='utf-8') as f:
    sql_script = f.read()

sql_script = sql_script.replace('INSERT INTO', 'INSERT IGNORE INTO')

statements = sql_script.split(';\n')

with connection.cursor() as cursor:
    for stmt in statements:
        if stmt.strip():
            cursor.execute(stmt)

print("Datos insertados correctamente.")
