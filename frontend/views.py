from django.views.generic import View
from django.shortcuts import render

# Create your views here.
def home(request):
    return render(request, 'frontend/home.html',{})