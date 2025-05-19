#!/usr/bin/env bash

echo "🛠 Creando carpeta media..."
mkdir -p media

echo "📦 Instalando dependencias y recogiendo archivos estáticos..."
pip install -r requirements.txt

python manage.py collectstatic --noinput

echo "✅ Preparación completada"
