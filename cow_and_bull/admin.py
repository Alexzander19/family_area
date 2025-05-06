from django.contrib import admin

from users.models import Message, User,  MyGroup, MyStatus, UserInGroup

# Register your models here.

admin.site.register(User)
admin.site.register(Message)
admin.site.register(MyGroup)
admin.site.register(MyStatus)
admin.site.register(UserInGroup)