# Create your models here.

import datetime
from django.db import models
from django.contrib.auth.models import AbstractUser
from cow_and_bull.models import Game


# Какая-либо группа созданная пользователем, для включения в нее других пользователей
class MyGroup(models.Model):
  name = models.CharField(max_length=100, unique=True)
  about = models.TextField()
  # Данные группы доступны всем пользователям.
  is_open = models.BooleanField(default=False)

  def __str__(self):
    return self.name

class MyStatus(models.Model):
  name = models.CharField(max_length=15)

  def __str__(self):
    return self.name




class User(AbstractUser):
  # встроенный first_name не может повторяться- это исключительный никнейм
  # my_name = models.CharField(max_length=100) # Настоящее имя пользователя
  # age_now = models.PositiveSmallIntegerField(null=True,blank=True) #Возраст на момент регистрации. далее высчитываем относительно даты регистрации. можно не указывать
  # это поле не нужно хранить в БД, оно нужно для вычисления примерной даты рождения.

  # birth_day не обязательное для заполгнения поле
  # Если пользователь укажет лишь свой возраст сейчас, то поле должно автоматически пересчитсяться. 
  birth_day = models.DateField(null=True, blank=True)
  # rating_in_game = models.ForeignKey(InGameRating,null=True,blank=True,on_delete=models.CASCADE)
  # date_of_register = models.DateField(auto_now_add=True) не используем. Вместо него встроенный Date_joined
  
  # rating_active = models.PositiveSmallIntegerField(default=1)

  # Рейтинг пользователя. Рейтинг значения его сообщений и комментариев. ТАкже включает рейтинг в каждой игре.
  # rating = models.OneToOneField(UserRating, on_delete=models.CASCADE)  # Удаляет UserRating при удалении пользователя
  
  avatar_pic = models.ImageField(upload_to='img/avatar',default='img/avatar/none.bmp')
  little_about = models.TextField(max_length=500) # Коротко о себе
  status_now = models.CharField(max_length=20,default="") # Статус  - заметка о себе сейчас

  @property
  def age_now(self):
    if self.birth_day == None: # День рождения или возраст пользователь может не указывать
      return None
    
    today = datetime.date.today()
    age = today.year - self.birth_day.year
    # Проверяем, был ли уже день рождения в текущем году
    if (today.month, today.day) < (self.birth_day.month, self.birth_day.day):
        age -= 1
    return age
 

  def __str__(self):

    age = ""
    if self.age_now != None:
      age = str(self.age_now) + ' лет'

    return self.first_name + ' ' + age
  

class UserInGroup(models.Model):
  user = models.ForeignKey(User,on_delete=models.CASCADE)
  group = models.ForeignKey(MyGroup,on_delete=models.CASCADE)
  # # Запрет удаления Статуса, пока есть группы с этим статусом
  status = models.ForeignKey(MyStatus,on_delete=models.PROTECT)

  def __str__(self):
    return f" {self.user} in {self.group} is {self.status} "


# Рейтинг пользователя в играх
class InGameRating(models.Model):

  time_spent = models.PositiveIntegerField(default=0) # Суммарное время проведенное за игрой (минут)
  played_games = models.PositiveIntegerField(default=0) # Сколько раз играл в игру (с сумарным временем найдется среднее)
  min_time = models.PositiveIntegerField(default=0) # Самое минимальное время до победы. (секунд)
  max_time = models.PositiveIntegerField(default=0) # Самое большое время до победы.(секунд)

  # Игра возвращает количесвто заработанных очков в каждой игре,
  # мы их суммируем.
  number_of_points = models.PositiveIntegerField(default=0) # Количество очков в игре
  
  # Скрин наиболее интересной игры
  picture = models.ImageField(upload_to='img/gamescreens',null=True,blank=True, default="")
  # game = models.OneToOneField(Game,on_delete=models.CASCADE) # Сама игра на которую составлен рейтинг
  # Рейтинг может быть составлен на несколько игр для разных пользователей.
  game = models.ForeignKey(Game,on_delete=models.CASCADE) # Сама игра на которую составлен рейтинг
  # Рейтинг пользователя в играх 
  user = models.ForeignKey(User,on_delete=models.CASCADE)
  

  
# Рейтинг пользователя. Нужен для оценки его мнения (если высокий рейтинг, то и высокое значение мнения)

class UserRating(models.Model):

  number_of_likes = models.PositiveIntegerField(default=0) # подсчет лайков, которые пользователь получате за свои сообщения
  number_of_dislikes = models.PositiveIntegerField(default=0) # подсчет дизлайков, которые пользователь получате за свои сообщения
  # Рейтинг пользователя в определенной игре. БУДЕТ ОБЪЯВЛЕН В InGameRating так как игр и рейтингв в них несколько
  # in_game_rating = models.ForeignKey(InGameRating,on_delete=models.CASCADE,related_name='in_game_rating')
  user = models.OneToOneField(User,on_delete=models.CASCADE)
  
  # Вывад лайков и дизлайков временно. Скорее нужна какая-то функция, которая выводит рейтинг на основании общих
  # рейтингов и с учетом лайков и дизлайков.
  def __str__(self):
    return 'Рейтинг: ' + str(self.number_of_likes) + ' л. / ' + str(self.number_of_dislikes) + ' д.л.'


class Message(models.Model):
  message = models.TextField()
  from_user = models.ForeignKey(User, related_name='from_user', on_delete=models.CASCADE)
  to_user = models.ForeignKey(User, related_name='to_user', on_delete=models.CASCADE,null=True,blank=True)
  picture = models.ImageField(upload_to='img/message',null=True,blank=True, default="")

  # null=True — разрешает хранить NULL в базе данных.
  # blank=True — позволяет оставлять поле пустым в формах и админке.
  time_send = models.DateTimeField(auto_now_add=True)
  
  is_anonim = models.BooleanField(default=False)

  # Сообщения отправляются в группах и читать их можно,только если в группе состоишь
  group = models.ForeignKey(MyGroup, on_delete=models.CASCADE, null=True, blank=True,default=None)
  
  def __str__(self):
    return self.message



# Лист желаний и прочее. Что пользователь хочет, что не хочет


# Лист Желаний.
# У каждого пользователя есть возможность вести список желаний(подарков - вещей или событий)
# Которые сохраняются, помогают оценить человеку насколько он успешен в их достижении
# содержит картинку

# Лист Нежеланий.
# События и вещи, которые не хочется встретить в своей жизни.
# не содержит картинку

# Лист Стремлений.
# Чего хочет добиться пользователь своими силами.
# содержит картинку

# Лист Достижений.
# ЛИбо само достижение,
# либо как продолжение листа желаний или стремлений, а может даже нежеланий, которые перевоплотились в достижения
# содержит картинку

# Лист Неудач.
# К сожалению это могут быть как результаты всего перечисленного выше, так и сами по себе события.
# не содержит картинку

# Везде семья может поддержать  за неудачи, как порадоваться за успехи.

# ДОСТУП К ЛИСТАМ ОГРАНИЧЕН КРУГОМ СЕМЬИ И МОЖЕТ БЫТЬ В НЕСКОЛЬКО СТУПЕНЕЙ (ПРОСМОТР, КОММЕНТАРИИ)
# А ТАКЖЕ ВИДЕН В БЛИЖАЙШЕМ КРУГУ СЕМЬИ, СЕМЬИ ВЫШЕ И ТАК ДАЛЕЕ (Папа, Мама,дети, а выше Родственники по Бабушке с Дедушкой и т.д.)

class BaseList(models.Model):

  # Мое желание./ нежелание
  text = models.TextField()
  # Может быть доступно к просмотру семейным кругом
  visible_for_family = models.BooleanField(default=False)
  # Почему этого хочу/ не хочу
  why = models.TextField(default="")
  # Мои личные комментарии
  comments = models.TextField(default="")
  # модель ссылается на пользователя, так как у каждого пользователя может быть нескоько Wish
  user  = models.ForeignKey(User, on_delete=models.CASCADE)
  # Дата создания записи
  date_create = models.DateField(auto_now_add=True)
  # Как давно я этого хочу/не хочу в месяцах. Создал сегодня, а хочет уже 12 месяцев
  how_long = models.PositiveSmallIntegerField(default=0)
  # Если есть дата, к которой хочется / не хочется исполнения этого желания
  when = models.DateField(null=True,blank=True, default=None)
  # Буду ли я этого хотеть / не хотеть после этой даты
  still = models.BooleanField(default=True)
  # Это вещь? (TRUE) или событие(FALSE)
  its_a_thing = models.BooleanField(default=True)
  # Это зависит только от меня или от кого-то еще или от случая
  only_me = models.BooleanField(default=True)
  # Сбылось! Произошло!
  it_came_true = models.DateField(null=True,blank=True, default=None)
  # Уже не хочу или уже не боюсь этого
  i_changed_my_mind = models.BooleanField(default=False)

  def __str__(self):
    str = f"{self.text[:20]}... от {self.date_create}" if len(self.text) > 20 else f"{self.text} от {self.date_create}"
    return str
  
  class Meta:
    abstract = True


class WishList(BaseList):
  # Визуализация желания
  picture = models.ImageField(upload_to='img/wishes',null=True,blank=True, default="")
  

class AvoidanceList(BaseList):
  # Что делать, чтобы этого не произошло.
  what_to_do = models.TextField()


