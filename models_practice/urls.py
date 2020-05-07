"""models_practice URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from frontend import views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('', views.home, name='frontend_home'),
    path('view_modules/', views.module_view, name='view_modules'),
    path('create_design/', views.create_design, name='create_design'),
    path('view_parts/', views.parts_view, name='view_parts'),
    path('create_part/', views.part_create, name='create_part'),
    path('part_detail/<str:id>/', views.part_detail, name='part_detail'),
    path('module_detail/<str:id>/', views.module_detail, name='module_detail'),
    path('create_order/',views.order_create, name='create_order'),
    path('order_detail/<str:id>/', views.order_detail, name ='order_detail'),
    path('admin/', admin.site.urls),
    path('bon/', include('bon.urls'))
]
if settings.DEBUG:
    urlpatterns+=static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)