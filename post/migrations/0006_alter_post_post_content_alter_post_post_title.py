# Generated by Django 5.0.2 on 2024-05-17 20:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0005_postreply_post_reply_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='post_content',
            field=models.CharField(max_length=3000),
        ),
        migrations.AlterField(
            model_name='post',
            name='post_title',
            field=models.CharField(max_length=80),
        ),
    ]