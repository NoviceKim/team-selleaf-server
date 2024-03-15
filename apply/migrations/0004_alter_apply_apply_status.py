# Generated by Django 5.0.2 on 2024-03-15 13:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apply', '0003_apply_quantity'),
    ]

    operations = [
        migrations.AlterField(
            model_name='apply',
            name='apply_status',
            field=models.IntegerField(choices=[(-2, '바로 구매'), (-3, '장바구니'), (0, '신청 완료'), (-1, '신청 취소'), (1, '수업 완료')], default=0),
        ),
    ]