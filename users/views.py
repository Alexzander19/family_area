from django.shortcuts import render

# Create your views here.

from django.shortcuts import redirect, render
from django.http import JsonResponse

from users.models import User, Message
from users.forms import SignupForm

# для функции get_messages_html
from django.http import HttpResponse
from django.template.loader import render_to_string

# Create your views here.

def signup(request):
  if request.method == 'POST':
    form = SignupForm(request.POST, request.FILES)

    if form.is_valid():
      user = form.save(commit=False)
      user.set_password(form.cleaned_data['password'])  # Хэшируем пароль
      
      if form.cleaned_data['avatar_pic']:# Проверяем что картинка- картинка
        user.avatar_pic = form.cleaned_data['avatar_pic']

      user.save()
      return redirect('signin')
  else:
    form = SignupForm()
  return render(request, 'users/signup.html', {'form': form})


def userlist(request):
  users=User.objects.all()

  return render(request,'users/userslist.html',{'users': users})

def messages(request):
  messages = Message.objects.all()




def send_message(request):
    if request.method == 'POST' and request.user.is_authenticated:
        try:
            user = request.user
            message = request.POST.get('message', '')
            to_user_input = request.POST.get('message_to', '')
            is_anonim = request.POST.get('is_anonim', 'false') == 'true'
            picture = request.FILES.get('image')

            if to_user_input != "" and to_user_input != 'Инкогнито':
              to_user = User.objects.get(username=to_user_input)
            else:
              to_user = None

            new_message = Message.objects.create(
                message=message,
                from_user=user,
                to_user=to_user,
                is_anonim=is_anonim,
                picture=picture
            )

           

            return JsonResponse({
               
                'status': 'success',
                # Так как сообщения печатаются все заново, то данные ниже не используются
                'message': new_message.message,
                'time': new_message.time_send.strftime('%H:%M'),
                'username': 'Инкогнито' if new_message.is_anonim else new_message.from_user.username,
                'avatar': new_message.from_user.avatar_pic.url if not new_message.is_anonim else '/static/img/avatar/anonim.png',
                'picture': new_message.picture.url if new_message.picture else '',
                'is_owner': request.user == new_message.from_user
            })
            
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    
    return JsonResponse({'status': 'error', 'message': 'Unauthorized'}, status=403)





  

def delete_message(request, message_id):
    if request.method == 'POST' and request.user.is_authenticated:
        try:
            message = Message.objects.get(id=message_id, from_user=request.user)
            message.delete()
            return JsonResponse({'status': 'success'})
        except Message.DoesNotExist:
            return JsonResponse({'status': 'error'}, status=404)
    return JsonResponse({'status': 'error'}, status=403)
  



# рендерит HTML с использованием шаблона messages_partial.html

def get_messages_html(request):
    messages = Message.objects.all()
    context = {'messages': messages}
    html = render_to_string('partials/messages_partial.html', context, request=request)
    return HttpResponse(html)