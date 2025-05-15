
// ФУНКЦИИ ДЛЯ РАБОТЫ С СООБЩЕНИЯМИ


// ПРЕДПРОСМОТР ОТПРАВЛЯЕМОГО ИЗОБРАЖЕНИЯ
// При нажатии на иконку загрузить фото, вызывает окно выбора изображения
// и размещает фото сверху над вводом сообщения (выше span сообщение для)
//<img onclick ="upload_image()">

let GROUP_NAME = null;






function upload_image(){

  document.getElementById('fileInput').click();
  // Вызывает previewImage(this) (inpit id = fileInput).onchange

}

function previewImage(input) {
  if (input.files && input.files[0]) {
    reader = new FileReader();
    reader.onload = function(e) {
        preview = document.getElementById('preview');
        preview.src = e.target.result;
        preview.style.display = 'block';
    }
    reader.readAsDataURL(input.files[0]);
  }
}



function message_to_user_set(send_to_username) {
    
  let message_to_username = document.getElementById('message-to-username');
  let unset_message_to_username = document.getElementById('unset-message-to-username');
  let input = document.getElementById('input-message-to-username');
  
  message_to_username.textContent = "для " + send_to_username;
  unset_message_to_username.textContent = " отменить";
  input.value = send_to_username; // это для пердачи в БД. Сам инпут в HTML скрыт.
  return false;
}

function message_to_user_unset() {
    
    let message_to_username = document.getElementById('message-to-username');
    let unset_message_to_username = document.getElementById('unset-message-to-username');
    let input = document.getElementById('input-message-to-username');
    
    message_to_username.textContent = "";
    unset_message_to_username.textContent = "";
    input.value = ""; //Инпут, хоть и не видим на страничке, но в БД передается именно его значение


    return false;
}


// Вслывающее окно с меню ОТВЕТИТЬ УДАЛИТЬ при нажатии на сообщение

function showContextMenu(event, menuId) {
  // Скрыть все меню
  document.querySelectorAll('.message-context-menu').forEach(menu => {
      menu.style.display = 'none';
  });
  
  // Показать текущее меню
  const menu = document.getElementById(menuId);
  if(menu) {
      menu.style.display = 'block';
      menu.style.left = `${event.pageX}px`;
      menu.style.top = `${event.pageY}px`;
      event.stopPropagation();
  }
}


function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}



function deleteMessage(messageId) {

  const csrftoken = getCookie('csrftoken');

  // Отправка запроса на удаление 
  if(confirm('Вы уверены что хотите удалить сообщение?')) {
                
    let str = '/users/delete-message/' + messageId+'/';
    fetch(str, {
        method: 'POST',
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": csrftoken,
        }
    }).then(response => {
        if(response.ok) {
          
            // location.reload(); НЕ НУЖНО ОБНОВЛЯТЬ СТРАНИЧКУ
            let selector_string = `[div-message-id="${messageId}"]`;
            console.log(selector_string);
            const messageElement = document.querySelector(selector_string);
            if(messageElement) {
            
                messageElement.innerHTML = "Удалено";
            }
        } 
        
        else {
            alert('Ошибка при удалении сообщения');
        }
        
    }).catch(error => {
        console.error('Error:', error);
    });
  }
}

// window.addEventListener('load', function() {
//   document.getElementById('chatForm').addEventListener('submit', function(e) {

// Фунуция отправки сообщения.
window.addEventListener('load', function() { 
  document.getElementById('chatForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const formData = new FormData(this);
    const csrftoken = getCookie('csrftoken');
    // const group_name = this.dataset.customArg;
    // const group_name = e.submitter.dataset.arg;
    let group_name = document.getElementById('group_name').value


    try {
      const response = await fetch("/users/send_message/" + group_name + '/', {
        method: 'POST',
        headers: {
            "X-CSRFToken": csrftoken
        },
        body: formData
      });

      if(response.ok) {
        // Очистка формы
        this.reset();
        document.getElementById('preview').style.display = 'none';
        document.getElementById('message-to-username').textContent = '';

        // Динамическое добавление сообщения
        const data = await response.json();
        // addNewMessage(data);
        // updateAllChat(data); // переписываем все сообщения чата
        refreshMessages();
      } else {
          alert('Ошибка при отправке сообщения');
      }
    } catch(error) {
        console.error('Error:', error);
    }
  });
});

function refreshMessages() {
  fetch('/users/get-messages-html/')
    .then(response => response.text())
    .then(html => {
        const container = document.getElementById('div-all-messages-in-chat');
        container.innerHTML = html;
    })
    .catch(error => console.error('Error:', error));

  // Сохранение в глобальной переменной GROUP_NAME
  // значения - имени текущей группы

}

function replyToMessage(username) {

  document.getElementById('message-to-username').textContent = "на сообщение от " + username;
  document.getElementById('unset-message-to-username').textContent = " отменить";
  document.querySelector('[name="message_to"]').value = username;
  document.querySelector('[name="message"]').focus();
}

// Скрывать меню при клике вне его
document.addEventListener('click', () => {
  document.querySelectorAll('.message-context-menu').forEach(menu => {
      menu.style.display = 'none';
  });
});

function set_global_group_name(group_name) {
  
  GROUP_NAME = group_name;
  console.log('GROUP_NAME УСТАНОВЛЕНА В ', GROUP_NAME)

}







refreshMessages()
//Обновлять сообщения каждые 5 секунд
// setInterval(refreshMessages, 5000);


