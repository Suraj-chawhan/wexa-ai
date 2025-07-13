from django.urls import path
from myapp import views

urlpatterns = [
  path('wheel-specification/', views.wheel_specification_api),
    path('wheel-specification/<int:id>/', views.wheel_specification_api),
    path('bogie-checksheet/', views.bogie_checksheet_api),
    path('bogie-checksheet/<int:id>/', views.bogie_checksheet_api),
]
