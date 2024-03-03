# Generated by Django 5.0.2 on 2024-03-03 18:13

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Notice',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('updated_date', models.DateTimeField(default=django.utils.timezone.now)),
                ('notice_title', models.CharField(max_length=255)),
                ('notice_content', models.CharField(max_length=255)),
                ('notice_status', models.BooleanField(default=True)),
            ],
            options={
                'db_table': 'tbl_notice',
                'ordering': ['-id'],
            },
        ),
    ]
