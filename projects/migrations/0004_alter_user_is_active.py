# Generated by Django 5.1.4 on 2025-01-02 11:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projects', '0003_category_order_orderitem_report_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='is_active',
            field=models.BooleanField(default=False),
        ),
    ]