from rest_framework import serializers
from .models import Project

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model=Project
        fields=('id', 'title', 'description', 'technology', 'created_ad')
        read_only_field=('created_ad', )