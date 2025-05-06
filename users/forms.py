from django import forms
from users.models import User, Message

class SignupForm(forms.ModelForm):

  confirm_password = forms.CharField(widget=forms.PasswordInput(attrs={
    'class': 'form-control',
    'id': 'psswordConfirm',
    'placeholder': 'Подтверждение пароля',
    'autocomplete': 'off',
    'required': True
  }))

  age = forms.IntegerField(widget=forms.NumberInput(attrs={
    'class': 'form-control',
    'id': 'age',
    'placeholder': 'Возраст',
    # 'required': False должно быть опредено снаружи виджета
  }),
    required=False,
    help_text="Укажите возраст, если не вводите дату рождения"
    )

  class Meta:
    model = User
    fields = ['first_name','birth_day', 'username' ,'avatar_pic','password'] #'age_now'
    widgets = {
      
      'first_name': forms.TextInput(attrs={
        'class': 'form-control',
        'id': 'firsName',
        'aria-label': 'Ваше имя',
        'placeholder': 'Ваше имя',
        'required': True,
      }),
      
      'username': forms.TextInput(attrs={
        'class': 'form-control',
        'id': 'UserName',
        'placeholder': 'Ваш Логин',
        'label': 'Логин пользователя',
        'required': True,
      }),

      'birth_day': forms.DateInput (attrs={
        'class': 'form-control',
        'id': 'birthDay',
        'placeholder': 'дата рождения (можно не указывать)',
        'required': False
      }),

      'avatar_pic': forms.FileInput(attrs={
        'class': 'form-control',
        'id': 'imageField',
        'arial-label': 'картинка на аватар (можно не ставить)',
        'placeholder': 'картинка на аватар (можно не ставить)',
        'required': False

      }),
      'password': forms.PasswordInput(attrs={
        'class': 'form-control',
        'id': 'pssword',
        'placeholder': 'Пароль',
        'required': True,
        
      }),
    }

  def clean(self):
    cleaned_data = super().clean()
    password = cleaned_data.get('password')
    confirm_password = cleaned_data.get('confirm_password')
    if password != confirm_password:
      raise forms.ValidationError('Пароли не совпадают!')
    return cleaned_data
  

 
      
