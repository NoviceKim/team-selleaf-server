# Generated by Django 5.0.2 on 2024-03-06 13:25

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('lecture', '0003_remove_lecture_date_remove_lecture_time'),
        ('selleaf', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='date',
            name='lecture',
            field=models.ForeignKey(default=2, on_delete=django.db.models.deletion.PROTECT, to='lecture.lecture'),
            preserve_default=False,
        ),
    ]
