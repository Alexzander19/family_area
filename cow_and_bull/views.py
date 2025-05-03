from django.shortcuts import render

# Create your views here.
from django.shortcuts import render

from users.models import User, Message

# Create your views here.

def game_cab(request):

    users=User.objects.all()
    messages=Message.objects.all()
    return render(request,'mastermind/cowandbull.html/',{'users': users, 'messages': messages})