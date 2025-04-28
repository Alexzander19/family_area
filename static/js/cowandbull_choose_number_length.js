// Функция для извлечения параметра из URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Функция для отображения числа
function displayNumber() {
    const number = getQueryParam('count_numbers');
    const displayElement = document.getElementById('selectedNumber');

    if (number !== null) {
        // Проверяем, что число находится в диапазоне от 3 до 6
        const num = parseInt(number, 10);
        if (num >= 3 && num <= 6) {
            displayElement.textContent = num;
        } else {
            displayElement.textContent = 'Число вне допустимого диапазона';
        }
    } else {
        displayElement.textContent = 'Число не выбрано';
    }
}

// Вызываем функцию при загрузке страницы
document.addEventListener('DOMContentLoaded', displayNumber);

//  Всплывающее (модальное) окно - выбор количества цифр в загадываемом числе
document.addEventListener('DOMContentLoaded', function() {
    const modalElement = document.getElementById('numberModal');
    const modal = new bootstrap.Modal(modalElement);
    const openModalButton = document.getElementById('openModalButton');
    const decreaseButton = document.getElementById('decreaseButton');
    const increaseButton = document.getElementById('increaseButton');
    const numberDisplay = document.getElementById('numberDisplay');
    const confirmButton = document.getElementById('confirmButton');

    let currentNumber = 4;

    function updateNumberDisplay() {
        numberDisplay.textContent = currentNumber;
    }

   

    openModalButton.addEventListener('click', function() {
        currentNumber = 4; // Сбрасываем число при открытии
        updateNumberDisplay();
        modal.show();
    });

    decreaseButton.addEventListener('click', function() {
        if (currentNumber > 3) {
            currentNumber--;
            updateNumberDisplay();
        }
    });

    increaseButton.addEventListener('click', function() {
        if (currentNumber < 6) {
            currentNumber++;
            updateNumberDisplay();
        }
    });

    confirmButton.addEventListener('click', function() {
        // alert('Вы выбрали число: ' + currentNumber);
        // modal.hide();
        // Перенаправляем на целевую страницу с параметром
        window.location.href = `/deep?count_numbers=${currentNumber}`;
    });
});



 // Инициализация фейерверка
 


