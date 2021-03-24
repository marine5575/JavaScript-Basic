var num1, num2, ans;

function init() {
    // 구구단 초기 세팅

    num1 = Math.ceil(Math.random() * 9);
    num2 = Math.ceil(Math.random() * 9);
    ans = num1 * num2;

    question.textContent = String(num1) + ' x ' + String(num2) + '는?';
}

var body = document.body;
var question = document.createElement('div');

init();

body.appendChild(question);

var form = document.createElement('form');
body.appendChild(form);

var input = document.createElement('input');
form.appendChild(input);

var button = document.createElement('button');
button.textContent = '입력';
form.appendChild(button);

var result = document.createElement('div');
body.appendChild(result);

form.addEventListener('submit', function (e) {
    e.preventDefault(); // 제출 시 바로 새로고침되는 것 방지
    
    if(ans === Number(input.value)) {
        result.textContent = '정답!';

        setTimeout(function() {
            init();
            result.textContent = '';
        }, 500);
        
    }
    else {
        result.textContent = '땡!';

        setTimeout(function() {
            result.textContent = '';
        }, 500);
    }

    input.value = '';
    input.focus();
});