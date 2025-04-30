from django.dispatch import receiver
from django.core.mail import send_mail
from django.urls import reverse
from django_rest_passwordreset.signals import reset_password_token_created

@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    # Construye la URL de restablecimiento de contraseña
    reset_password_url = "http://localhost:5173/password-reset-confirm/?token={}".format(reset_password_token.key)


    email_plaintext_message = "Para restablecer tu contraseña, haz clic en el siguiente enlace:\n{}".format(reset_password_url)

    send_mail(
        # Título:
        "Restablecimiento de contraseña para {title}".format(title="Tu sitio"),
        # Mensaje:
        email_plaintext_message,
        # From:
        "pabloalosno@gmail.com",
        # To:
        [reset_password_token.user.email]
    )
