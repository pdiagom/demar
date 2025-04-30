from django.apps import AppConfig

class DemarappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'demarapp'

    def ready(self):
        import demarapp.signals  # Importa los signals cuando la app esté lista
