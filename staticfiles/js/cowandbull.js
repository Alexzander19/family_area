// Функции игры КОРОВ БЫКОВ

// Игра в Коров и Быков

// цифры в звгаданном числе не должны повторяться


//  number - это количество цифр в загаданном компьютере числе
// определяется в сплывающем окне при нажатии кнопки "начать новую игру"
const count_numbers = getQueryParam('count_numbers');

let tempInput;

let userInput = document.getElementById('userInput')


// let computerNUM = [-10,-10,-10,-10]

let computerNUM = []; // число, которое нужно найти, создается компьютером случайным(псевдо) образом
    
    for (let i = 0; i <= count_numbers; i++) {
        computerNUM.push(-10);
    }
    

let timeStart = performance.now();

let step = 0;
let cow = 0; // корова, если такая цифра есть, но стоит не на месте
let bull = 0; // бык, если цифра стоит на своем месте
let cowBull = [];
let bullInUserNUM = 0;
let cowInUserNUM = 0;
// Фейерверк
let fireworksActive = false;





function startGame() {

    
    // Очищаем таблицу точнее раздел tbody           
    // let tbody = document.getElementById("myTable").getElementsByTagName("tbody")[0]
    // tbody.innerHTML = ''; 
    
    // Обнуляем все глобальные переменные

    timeStart = performance.now();

    step = 0;
    cow = 0; // корова, если такая цифра есть, но стоит не на месте
    bull = 0; // бык, если цифра стоит на своем месте
    cowBull = [];
    bullInUserNUM = 0;
    cowInUserNUM = 0;
    
    computerNUM = [];
    // Длина computerNUM такая, как выбрал пользватель при нажатии клавиши начать новую игру
    // с указанием длины числа (number)

    for (let i = 0; i < count_numbers; i++) {
        computerNUM.push(-10);
    }

    // computerNUM - это массив чисел -10 (можно любые отрицательные), функция generateWithBut
    // сгенерирует стоолько цифр от 0 до 9 в  чиселе  (если не заданы исключения - массив But), 
    // сколько чисел в массиве computerNUM, то есть равной его длине.
    computerNUM = generateWithBut( computerNUM,[]) 

    console.log('Сгенерированное число: '+ computerNUM)

    let inputSize = document.getElementById("userInput")

        // Задаем длину поля ввода числа пользователем.
        // Имя класса, который отвечает за длинну поля ввода в зависимости от number - количества цифр
    inputSize.className += " user-input-naum-width-" + count_numbers
    
}

startGame()



// Функция считает коров и быков
//NUM1 число загаданное
//NUM2  число проверяемое на соответствие загаданному
// хотя нет разницы какое из них какое число

function countCowBull(NUM1,NUM2){

let cow = 0;
let bull = 0;


for(let i = 0; i < NUM1.length; i++ ){
	for(let j = 0; j < NUM2.length; j++){
		if(NUM1[i] == NUM2[j]){
			if(i != j)
					cow ++;
			else
					bull ++;
		}
	}
		
}

// Если количество быков = количеству цифр в загаданном числе,
// то есть отгадано число
if(NUM1.length == bull){

		console.log('ВЫ ОТГАДАЛИ ЧИСЛО. ЗАПУСКАЕМ ФЕЙЕРВЕРК!!!');

		// Создаем контейнер
		const container = document.createElement('div');
		container.id = 'fireworks-container';
		document.body.appendChild(container);
				
		const fireworks = new Fireworks.default(container, {
				speed: 2,
				acceleration: 1.05,
				friction: 0.98,
				gravity: 1.5,
				particles: 50,
				explosion: 5,
				boundaries: {
						x: 0,
						y: 0,
						width: window.innerWidth,
						height: window.innerHeight
				},
				
				mouse: {
						click: false,
						move: false,
						max: 1
				}
		});
	 

		fireworks.start();

		container.style.display = 'block'; // показать контейнер
}
		

return [cow,bull]
}

// Функция генерирует массив - число, с заданными цифрами на своих позициях (Массив withNum, но не предлагает числа из массива but
// x - на это место или любое другое, где в массиве withNum не число от 0 до 9

function generateWithBut( withNum,but /* повтор да или нет*/ ){

		// исклюяаем повтор чисел, которые есть в withNum
		for(let i = 0; i < withNum.length; i++)
				if(withNum[i] >= 0 && withNum[i] <= 9)
						but.push(withNum[i]) // если числа в but будут дублироваться- это допустимо
		

		for(let iii = 0 ; iii < withNum.length; iii++){

				// генерируем число от 0 до 9
				let randNum;
				
				let i = 0;
				let repeatFind = false;
				
				while( i < 100){// если более 100 раз прошоли цикл - значит подберем 'вручную' (наверное массив but состоит из 9 цифр из 10)
						
						repeatFind = false; 
						randNum = Math.round(Math.random()*9)
						
						// проверяем не совпадает ли случайное число с запрещенными (массив but)
				
						for(let j = 0; j < but.length; j++){
								if(randNum == but[j])
										repeatFind = true;

						}


						// если совпадает - снова генерируем
						if(!repeatFind){
								but.push(randNum) // исключаем повтор сгенерированных цифр
								break; // если прошли цикл и ненашли совпадения, то значит нашли нужную цифру 
						}


						// если более 100 раз прошоли цикл - значит подберем 'вручную' (наверное массив but состоит из 9 цифр из 10)
						i += 1; 

				}


				if(i >= 100){

						for(randNum = 0; randNum < 10; randNum++){
								repeatFind = false;
								for(let k = 0; k < but.length; k ++){
										if(randNum == but[k]){
												repeatFind = true;
												break; // переходим к следующему (randNum += 1)
										}
										
								}

								if(!repeatFind){ // если repeatFind == false, то значит мы нашли randNum
										console.log('Внимание! Случайное чило : '+ randNum + ' не случайное! Подобрали по возрастанию от 0')
										break;
								}


						}

						if(randNum >= 10){
								alert('ВНИМАНИЕ! ОГАРНИЧЕНИЕ В ВЫБОРЕ ЧИСЕЛ НЕ ДАЕТ ПОДОБРАТЬ ЧИСЛО')
								randNum = 0;

						}



				}




				// ставим сгенерированное число в массив, где не число от 0 до 9
				console.log(randNum)
				if(withNum[iii] < 0 || withNum[iii] > 9){ // если не число от 9 дл 9
						withNum[iii] = randNum;
						console.log('withNum['+ iii +'] = ' + withNum[iii] )
						// поставили сгенерированное число в итоговый массив и переходим к генерации следующего

				}
		}

		return withNum; 
// Нужно исключить совпадение с числами из массива withNum

}

function cowBullUserTry(){

		let userNUM = document.getElementById('userInput')
				console.log(userNUM.value)

		if(userNUM.value.length != computerNUM.length)
				return false;
		
		cowBull = countCowBull(userNUM.value,computerNUM)
		
		step +=1;
	 
		addRow('myTable',userNUM.value, cowBull);
		
		let inputText = document.getElementById('userInput')
		console.log(inputText.value)
		inputText.value = ''

		}



function addRow(id,userNUM, cowBull){

								// <div id = "div-table-interactive" >
								//   <div class="table-row">
								//     <div class="table-col">ЧИСЛО</div>
								//     <div class="table-col">КОР / БЫК</div>
								//     <div class="table-col">ШАГ</div>
								//   </div>
								//   <div class="table-row" >
								//     <div class="table-col">1234</div>
								//     <div class="table-col">1 / 2</div>
								//     <div class="table-col">1</div>
								//   </div>

		// Создаем элемент <img> для замены "кор"
		let cowImage = document.createElement("img");
		cowImage.src = '/static/img/system/cow.png'; 
		cowImage.alt = "Кор";
		cowImage.className = "cow-bull-image";
		

		
		// Создаем элемент <img> для замены "бык"
		let bullImage1 = document.createElement("img");
		bullImage1.src = '/static/img/system/bull.png'; 
		bullImage1.alt = "Бык";
		bullImage1.className = "cow-bull-image";
		

								
		let divTableInteractive = document.getElementById("div-table-interactive")

		let divRow = document.createElement("div")
		divRow.className = "table-row"

		let divCol_1 = document.createElement("div")
		divCol_1.className = "table-col bigger-font"
		divCol_1.textContent = userNUM // userNUM
		
		
		let divCol_2 = document.createElement("div")
		divCol_2.className = "table-col bigger-font"
	 
		divCol_2.textContent = cowBull[0] + " / " + cowBull[1]

		let divCol_3 = document.createElement("div")
		divCol_3.className = "table-col bigger-font"
		divCol_3.textContent = step // step

		divRow.appendChild(divCol_1)
		divRow.appendChild(divCol_2)
		divRow.appendChild(divCol_3)

		// divTableInteractive.appendChild(divRow)

		divTableInteractive.insertAdjacentElement('beforebegin', divRow);


		let timeSpend = document.getElementById('time')

		//console.log(timeStart)
		timeSpend.innerHTML = Math.floor(((performance.now() - timeStart) / 1000 / 60 )) + 'м.' + Math.round((((performance.now() - timeStart) / 1000) % 60)) + 'c.';

		
}


// Контроль ввода. Вызывается отдельными событиями для мобилки или ПК 
function inputContol(e){

console.log("Клавиша нажата:", e.key);


	let indexOfCopy;
	
	let indexOfInputChar = e.target.selectionStart; // индекс введенного символа
	
	let newString = userInput.value.slice(0,indexOfInputChar) + e.key +  userInput.value.slice( (indexOfInputChar)); // запоминаем введенную строку добавляя новый символ на свое место

	e.preventDefault() // возвращаем строку в состояние до нажатия клавиши

	let res = ''; 
	
	console.log('Индекс введенного числа: '+ indexOfInputChar)
	console.log('было до нажатия: ' + userInput.value)
	console.log('стало после нажатия: ' + newString)

	//console.log(e)


	if(e.key >= 0 && e.key != ' '){ // если цифра

			indexOfCopy = userInput.value.indexOf(e.key)
			console.log('indexOfCopy = ' + indexOfCopy)


			if(indexOfCopy > -1 ){ // если цифра повторяется создаем переменную res

				 if((indexOfCopy == indexOfInputChar) || (indexOfInputChar - indexOfCopy == 1))
							res = userInput.value // попытка ввести одинаковую цифру слева или справа от копии - ничего не вводим
					else if(indexOfCopy < indexOfInputChar)
							res = userInput.value.slice(0,indexOfCopy) + userInput.value.slice(indexOfCopy+1, indexOfInputChar) + e.key + userInput.value.slice(indexOfInputChar)
					else 
							res = userInput.value.slice(0,indexOfInputChar) + e.key + userInput.value.slice(indexOfInputChar, indexOfCopy)  + userInput.value.slice(indexOfCopy+1)

					newString = res // далее проверим ее длинну
			}
			
			
			
			if(newString.length > computerNUM.length ){ // /Если цифра не повторяется, еще если длина больше нужной, 
					
					if (indexOfInputChar != computerNUM.length)//то удаляем крайнюю правую цифру
							userInput.value = newString.slice(0,computerNUM.length) // так удобней, если хочешь переделать ввод, не нужно ходить удалять крайнюю правую
					else
							userInput.value = newString.slice(1) // но если вводится крайняя правая, то удаляем первую!

					}
			else 
					userInput.value = newString // если введено не число

					
	}
 // else
		 // e.preventDefault()


}



// устаревшее. не во всех браузерах поддерживается. userInput.onkeypress = function(e){ // срабатывает только для символьных клавиш прм нажатии, пока держим
// Для мобильных
userInput.addEventListener("input", function(e) {

	inputContol(e)
	
			
});
// для ПК
userInput.addEventListener("keydown", function(e) {

	inputContol(e)
			
});






