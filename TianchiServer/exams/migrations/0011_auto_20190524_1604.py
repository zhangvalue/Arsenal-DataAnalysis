# Generated by Django 2.1.7 on 2019-05-24 16:04
import math

from django.db import migrations, models
from progress.bar import Bar

from classes.constants import Grade, Campus


def get_t_z_score(apps, schema_editor):
    ClassExamRecord = apps.get_model('exams', 'ClassExamRecord')
    SubExam = apps.get_model('exams', 'SubExam')
    bar = Bar('Processing', max=SubExam.objects.all().count())
    ClassExamRecord.objects.filter(stu_class__isnull=True).delete()
    for sub_exam in SubExam.objects.all():
        bar.next()
        for grade in [Grade.One, Grade.Two, Grade.Three]:
            for campus in [Campus.New, Campus.Old]:
                records = ClassExamRecord.objects.exclude(
                    stu_class__isnull=True
                ).filter(
                    sub_exam=sub_exam,
                    stu_class__grade_name=grade,
                    stu_class__campus_name=campus
                ).values_list('id', 'attend_count', 'total_score', 'sub_exam__course_id')
                if not records:
                    continue
                formatted_records = []
                for record in records:
                    avg = 0
                    if record[3] == 60 and record[1]:
                        avg = record[2]
                    if record[3] != 60 and record[1]:
                        avg = (record[2] / record[1])
                    formatted_records.append({
                        'id': record[0],
                        'avg': avg
                    })

                if len(formatted_records) < 2:
                    print('skip: {}'.format(sub_exam.id))
                    continue

                # get avg
                avg_sum = 0
                class_num = 0
                for record in formatted_records:
                    avg_sum += record['avg']
                    class_num += 1

                avg = avg_sum / class_num

                # get standard
                standard = 0.0
                for record in formatted_records:
                    standard += math.pow(record['avg'] - avg, 2)

                if not standard:
                    print('zero: {}'.format(sub_exam.id))
                    continue
                standard = math.pow(standard / (class_num - 1), 1 / 2)

                bar.max += len(formatted_records)
                # get z/t
                for record in formatted_records:
                    bar.next()
                    rec_id = record['id']
                    z_score = (record['avg'] - avg) / standard
                    t_score = z_score * 8 + 80

                    ClassExamRecord.objects.filter(id=rec_id).update(
                        z_score=z_score,
                        t_score=t_score
                    )
    bar.finish()


class Migration(migrations.Migration):
    dependencies = [
        ('exams', '0010_recalcu_classexamrecord_order'),
    ]

    operations = [
        migrations.AddField(
            model_name='classexamrecord',
            name='t_score',
            field=models.FloatField(default=80.0),
        ),
        migrations.AddField(
            model_name='classexamrecord',
            name='z_score',
            field=models.FloatField(default=0.0),
        ),
        migrations.RunPython(get_t_z_score, reverse_code=migrations.RunPython.noop),
    ]
