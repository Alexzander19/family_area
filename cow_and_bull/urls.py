from django.contrib import admin
from django.urls import include, path

from . import views

urlpatterns = [
    path('game/', views.game_cab,name='game'),
    
    
]