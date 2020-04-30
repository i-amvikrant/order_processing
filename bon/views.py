from rest_framework.views import APIView
from django.shortcuts import render
from rest_framework import status
from django.http import Http404
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from bon.models import parts, modules, part_list, sub_module_list
from .serializers import (
    parts_serializer, 
    modules_serializer, 
    sub_part_list_serializer, 
    sub_module_list_serializer,
    parts_autocomplete)

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
        if designID is not None:
            queryset = queryset.filter(designID__exact=designID)
        return queryset


class sub_module(generics.ListCreateAPIView):
    serializer_class = sub_module_list_serializer

    def get_queryset(self):
        queryset = sub_module_list.objects.all()
        designID = self.request.query_params.get('design',None)
        if designID is not None:
            queryset = queryset.filter(designID__exact=designID)
        return queryset


'''
class PassengerList(generics.ListCreateAPIView):
    model = Passenger
    serializer_class = PassengerSerializer

    # Show all of the PASSENGERS in particular WORKSPACE
    # or all of the PASSENGERS in particular AIRLINE
    def get_queryset(self):
        queryset = Passenger.objects.all()
        workspace = self.request.query_params.get('workspace')
        airline = self.request.query_params.get('airline')

        if workspace:
            queryset = queryset.filter(workspace_id=workspace)
        elif airline:
            queryset = queryset.filter(workspace__airline_id=airline)

        return queryset
'''