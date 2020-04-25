from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views
from rest_framework.urlpatterns import format_suffix_patterns

print(type(views.module_detail))

urlpatterns = [
    path('parts/', views.parts_list.as_view()),
    path('modules/', views.modules_list.as_view()),
    path('part_detail/<str:pk>/', views.part_detail.as_view()),
    path('module_detail/<str:pk>/', views.module_detail.as_view()),
    path('sub_part/', views.sub_part.as_view()),
    path('sub_module/', views.sub_module.as_view()),
    path('part_create/', views.part_create.as_view())
]

urlpatterns = format_suffix_patterns(urlpatterns)

if settings.DEBUG:
    urlpatterns+=static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)