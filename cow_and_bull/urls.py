from django.contrib import admin
from django.urls import include, path

from . import views

urlpatterns = [
    path('', views.game_cab,name='game'),
    path('game/',views.game_cab,name='game-too')
    
    
]