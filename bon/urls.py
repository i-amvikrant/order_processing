from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path('modules_autocomplete/',views.modules_autocomplete_api.as_view(), name='api_module_autocomplete'),
    path('parts_autocomplete/',views.parts_autocomplete_api.as_view(), name='api_part_autocomplete'),
    path('parts/', views.parts_list.as_view(), name='api_part_list'),
    path('modules/', views.modules_list.as_view()),
    path('part_detail/<str:pk>/', views.part_detail.as_view(), name='api_part_detail'),
    path('module_detail/<str:pk>/', views.module_detail.as_view()),
    path('sub_part/', views.sub_part.as_view()),
    path('sub_module/', views.sub_module.as_view()),
    path('part_create/', views.part_create.as_view()),
    path('vendors/', views.vendor_list.as_view(), name='api_vendor_list'),
    path('order_create/',views.order_create.as_view(), name='api_create_order'),
    path('orders/', views.orders_list.as_view(), name='api_list_order'),
    path('order_detail/<str:pk>/', views.order_detail.as_view(), name='api_order_detail'),
]

urlpatterns = format_suffix_patterns(urlpatterns)

if settings.DEBUG:
    urlpatterns+=static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)