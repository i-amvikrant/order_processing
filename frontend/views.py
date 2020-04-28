from django.views.generic import View
from django.shortcuts import render

# Create your views here.
def create_design(request):
    return render(request, 'frontend/create_design.html',{})

def home(request):
    return render(request, 'frontend/home.html',{})