from django.views.generic import View
from django.shortcuts import render
import requests
from bon.models import (
    parts,
    orders,
    modules
)
from bon.serializers import (
    parts_serializer,
    list_order_serializer,
    modules_serializer
)

# Create your views here.
def create_design(request):
    return render(request, 'frontend/create_design.html',{})

def home(request):
    return render(request, 'frontend/home.html',{})

def parts_view(request):
    return render(request, 'frontend/view_parts.html', {})

def part_detail(request, id):
    #temp = part_detail(request=request._request).data
    data = parts.objects.get(pk=id)
    context = parts_serializer(data)
    print(context.data)
    #context = requests.get('http://localhost:8000/bon/part_detail/'+id+'/?format=json').json()
    return render(request, 'frontend/part_detail.html',context.data)

def part_create(request):
    return render(request, 'frontend/part_create.html', {})

def module_view(request):
    return render(request, 'frontend/view_modules.html', {})

def module_detail(request, id):
    data = modules.objects.get(pk=id)
    context = modules_serializer(data).data
    #context = requests.get('http://localhost:8000/bon/module_detail/'+id+'/?format=json').json()
    return render(request, 'frontend/module_detail.html',context)

def order_create(request):
    return render(request, 'frontend/create_order.html',{})

def order_detail(request, id):
    data = orders.objects.get(pk=id)
    context = list_order_serializer(data).data
    #context = requests.get('http://localhost:8000/bon/order_detail/'+id+'/?format=json').json()
    return render(request,'frontend/order_detail.html',context)

def order_view(request):
    return render(request,'frontend/view_orders.html',{})

