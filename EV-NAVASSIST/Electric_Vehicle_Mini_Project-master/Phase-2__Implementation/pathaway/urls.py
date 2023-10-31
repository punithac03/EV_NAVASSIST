from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('signup', views.signup, name='signup'),
    path('signin', views.signin, name='signin'),
    path('signout', views.signout, name='signout'),
    path('features', views.features, name='features'),
    path('routing', views.routing, name='routing'),
    path('calculateChargingStations', views.calculateStations, name='calculateChargingStations'),
]
