from rest_framework.views import APIView
from django.shortcuts import render
from rest_framework import status
from django.http import Http404
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from bon.models import (
    parts, modules, part_list, 
    sub_module_list, vendor)
from .serializers import (
    parts_serializer, 
    modules_serializer, 
    sub_part_list_serializer, 
    sub_module_list_serializer,
    parts_autocomplete,
    modules_autocomplete,
    vendor_serializer)

from rest_framework import generics

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
        


class sub_part(generics.ListCreateAPIView):
    serializer_class = sub_part_list_serializer

    def get_queryset(self):
        queryset = part_list.objects.all()
        designID = self.request.query_params.get('designID',None)
        PartID = self.request.query_params.get('PartID',None)
        if designID is not None:
            queryset = queryset.filter(designID__exact=designID)
        if PartID is not None:
            queryset = queryset.filter(PartID__exact=PartID)
        return queryset


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
        return queryset

class vendor_list(generics.ListCreateAPIView):
    serializer_class = vendor_serializer

    def get_queryset(self):
        queryset = vendor.objects.all()
        return queryset