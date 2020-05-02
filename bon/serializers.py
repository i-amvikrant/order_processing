from .models import (
    parts, modules, part_list, 
    vendor, sub_module_list, 
    orders, customer, product_list)


from rest_framework import serializers


class parts_serializer(serializers.ModelSerializer):

    class Meta:
        model = parts
        fields = '__all__'

class parts_autocomplete(serializers.ModelSerializer):

    class Meta:
        model = parts
        fields = ['PartID']


class modules_serializer(serializers.ModelSerializer):

    class Meta:
        model = modules
        fields = '__all__'

class modules_autocomplete(serializers.ModelSerializer):

    class Meta:
        model = modules
        fields = ['designID']


class sub_part_list_serializer(serializers.ModelSerializer):

    class Meta:
        model = part_list
        fields = ('designID', 'PartID', 'quantity')

class sub_module_list_serializer(serializers.ModelSerializer):

    class Meta:
        model = sub_module_list
        fields = ('designID','subID','quantity')


class vendor_serializer(serializers.ModelSerializer):

    class Meta:
        model = vendor
        fields = '__all__'
    