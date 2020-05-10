from django.views.generic import View
from django.shortcuts import render
import requests

# Create your views here.
def create_design(request):
    return render(request, 'frontend/create_design.html',{})

def home(request):
    return render(request, 'frontend/home.html',{})

def parts_view(request):
    return render(request, 'frontend/view_parts.html', {})

def part_detail(request, id):
    context = requests.get('http://localhost:8000/bon/part_detail/'+id+'/?format=json').json()
    return render(request, 'frontend/part_detail.html',context)

def part_create(request):
    return render(request, 'frontend/part_create.html', {})

def module_view(request):
    return render(request, 'frontend/view_modules.html', {})

def module_detail(request, id):
    context = requests.get('http://localhost:8000/bon/module_detail/'+id+'/?format=json').json()
    return render(request, 'frontend/module_detail.html',context)

def order_create(request):
    return render(request, 'frontend/create_order.html',{})

def order_detail(request, id):
    context = requests.get('http://localhost:8000/bon/order_detail/'+id+'/?format=json').json()
    return render(request,'frontend/order_detail.html',context)

def order_view(request):
    return render(request,'frontend/view_orders.html',{})

