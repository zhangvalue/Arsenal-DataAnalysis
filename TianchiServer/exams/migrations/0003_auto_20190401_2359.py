# Generated by Django 2.1.7 on 2019-04-01 15:59

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('exams', '0002_auto_20190401_2228'),
    ]

    operations = [
        migrations.AlterField(
            model_name='classexamrecord',
            name='stu_class',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='classes.Class'),
        ),
        migrations.AlterField(
            model_name='classexamrecord',
            name='sub_exam',
            field=models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='exams.SubExam'),
        ),
    ]
