from rest_framework.views import APIView
from django.shortcuts import render
from rest_framework import status
from django.http import Http404
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from bon.models import (
    parts, modules, part_list, 
    sub_module_list, vendor, orders)
from .serializers import (
    parts_serializer, 
    modules_serializer, 
    sub_part_list_serializer, 
    sub_module_list_serializer,
    parts_autocomplete,
    modules_autocomplete,
    vendor_serializer,
    create_order_serializer,
    list_order_serializer)

from rest_framework import generics, status
from rest_framework.pagination import LimitOffsetPagination

# Create your views here.
'''
@api_view(['GET'])
def parts_list(request, format=None):
    if request.method == 'GET':
        pl = parts.objects.all()
        serializer = parts_serializer(pl, many=True)
        return Response(serializer.data)
'''

class parts_list(generics.ListCreateAPIView):
    queryset = parts.objects.all()
    serializer_class = parts_serializer
    pagination_class = LimitOffsetPagination

class parts_autocomplete_api(generics.ListAPIView):
    queryset = parts.objects.only('PartID')
    serializer_class = parts_autocomplete


class modules_list(generics.ListCreateAPIView):
    queryset = modules.objects.all()
    serializer_class = modules_serializer
    pagination_class = LimitOffsetPagination

    def perform_create(self, serializer):
        dfee = int(self.request.data['design_fee'])
        afee = int(self.request.data['assembly_fee'])
        serializer.save(Total_cost=dfee+afee)

class modules_autocomplete_api(generics.ListAPIView):
    queryset = modules.objects.only('designID')
    serializer_class = modules_autocomplete

class module_detail(generics.RetrieveUpdateDestroyAPIView):
    queryset = modules.objects.all()
    serializer_class = modules_serializer

class part_create(generics.CreateAPIView):
    queryset = parts.objects.all()
    serializer_class = parts_serializer

class part_detail(generics.RetrieveUpdateDestroyAPIView):
    queryset = parts.objects.all()
    serializer_class = parts_serializer
        


class sub_part(APIView):

    def get(self, request, format=None):

        #ready queryset
        queryset = part_list.objects.all()
        designID = request.query_params.get('designID',None)
        PartID = request.query_params.get('PartID',None)
        if designID is not None:
            queryset = queryset.filter(designID__exact=designID)
        if PartID is not None:
            queryset = queryset.filter(PartID__exact=PartID)
        
        #serialize
        serialized = sub_part_list_serializer(queryset, many=True)
        return Response(serialized.data)

    def post(self, request, format=None):
        
        req_data = request.data
        serialized = sub_part_list_serializer(data=req_data)
        if serialized.is_valid():

            designID = req_data['designID']
            PartID = req_data['PartID']
            quantity = int(req_data['quantity'])
            part_instance = parts.objects.get(pk=PartID)
            design_instance = modules.objects.get(pk=designID)
            design_instance.Total_cost += part_instance.cost*quantity
            design_instance.parts += quantity
            design_instance.save()
            serialized.save()
            return Response(serialized.data, status=status.HTTP_201_CREATED)
        return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)


class sub_module(APIView):
    
    def get(self, request, format=None):

        #ready queryset
        queryset = sub_module_list.objects.all()
        designID = request.query_params.get('designID',None)
        subID = request.query_params.get('subID',None)
        if designID is not None:
            queryset = queryset.filter(designID__exact=designID)
        if subID is not None:
            queryset = queryset.filter(subID__exact=subID)
        
        #serialize
        serialized = sub_module_list_serializer(queryset, many=True)
        return Response(serialized.data)

    def post(self, request, format=None):
        
        req_data = request.data
        serialized = sub_module_list_serializer(data=req_data)
        if serialized.is_valid():

            designID = req_data['designID']
            subID = req_data['subID']
            quantity = int(req_data['quantity'])
            module_instance = modules.objects.get(pk=subID)
            design_instance = modules.objects.get(pk=designID)
            design_instance.Total_cost += module_instance.Total_cost*quantity
            design_instance.Sub_modules += quantity
            design_instance.save()
            serialized.save()
            return Response(serialized.data, status=status.HTTP_201_CREATED)
        return Response(serialized.errors, status=status.HTTP_400_BAD_REQUEST)



'''
class sub_module(generics.ListCreateAPIView):
    serializer_class = sub_module_list_serializer

    def get_queryset(self):
        queryset = sub_module_list.objects.all()
        designID = self.request.query_params.get('designID',None)
        subID = self.request.query_params.get('subID',None)
        if designID is not None:
            queryset = queryset.filter(designID__exact=designID)
        if subID is not None:
            queryset = queryset.filter(subID__exact=subID)
        return queryset'''


class vendor_list(generics.ListCreateAPIView):
    serializer_class = vendor_serializer
    pagination_class = LimitOffsetPagination

    def get_queryset(self):
        queryset = vendor.objects.all()
        return queryset

class orders_list(generics.ListAPIView):
    serializer_class = list_order_serializer
    pagination_class = LimitOffsetPagination

    def get_queryset(self):
        queryset = orders.objects.all()
        return queryset

class order_create(generics.CreateAPIView):
    queryset = orders.objects.all()
    serializer_class = create_order_serializer

class order_detail(generics.RetrieveUpdateDestroyAPIView):
    queryset = orders.objects.all()
    serializer_class = create_order_serializer

