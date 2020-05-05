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
        fields = ['PartID','name']


class modules_serializer(serializers.ModelSerializer):

    class Meta:
        model = modules
        fields = '__all__'

class modules_autocomplete(serializers.ModelSerializer):

    class Meta:
        model = modules
        fields = ['designID','name']


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

class create_order_serializer(serializers.ModelSerializer):

    class Meta:
        model = orders
        fields = ('orderID','customerID','due','status','status_description')

class list_order_serializer(serializers.ModelSerializer):

    class Meta:
        model = orders
        fields = ('orderID','customerID','placed','due','due_date','status','status_description','Total_cost','product_count')


class sub_part_view_serializer(serializers.ModelSerializer):
    part_name = serializers.SerializerMethodField('get_name')
    part_cost = serializers.SerializerMethodField('get_cost')

    class Meta:
        model = part_list
        fields = ('designID','PartID','quantity','part_name','part_cost')

    

    def get_name(self,obj):
        return obj.PartID.name

    def get_cost(self,obj):
        return obj.PartID.cost

class sub_module_view_serializer(serializers.ModelSerializer):
    sub_name = serializers.SerializerMethodField('get_name')
    sub_cost = serializers.SerializerMethodField('get_cost')

    class Meta:
        model = sub_module_list
        fields = ('designID','subID','quantity','sub_name','sub_cost')

    def get_name(self,obj):
        return obj.subID.name

    def get_cost(self,obj):
        return obj.subID.Total_cost

class customer_serializer(serializers.ModelSerializer):

    class Meta:
        model = customer
        fields = '__all__'


class product_list_serializer(serializers.ModelSerializer):

    class Meta:
        model = product_list
        fields = ('productID', 'orderID', 'quantity')

class product_view_serializer(serializers.ModelSerializer):
    product_name = serializers.SerializerMethodField('get_name')
    product_cost = serializers.SerializerMethodField('get_cost')

    class Meta:
        model = product_list
        fields = ('productID', 'orderID', 'quantity','product_name','product_cost')

    def get_name(self,obj):
        return obj.productID.name

    def get_cost(self,obj):
        return obj.productID.Total_cost