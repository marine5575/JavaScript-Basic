const CHOOSE_MAX = 6;
const MAX_NUM = 45;
const YELLOW = 10;
const BLUE = 20;
const RED = 30;
const BLACK = 40;
const GREEN = 45;

// 1 ~ MAX_NUM가 채워져 있는 배열
var nums = Array(MAX_NUM)
            .fill()
            .map(function(v, idx) {
                return idx + 1;
            });
var shuffle = [];   // nums를 섞어서 넣을 곳

// MAX_NUM 개를 랜덤으로 뽑아 shuffle에 넣음
while(nums.length > 0) {
    var tmp = nums.splice(Math.random() * nums.length, 1)[0];
    shuffle.push(tmp);
}

// 앞에서부터 6개를 뽑아 오름차순 정렬
var predAns = shuffle.slice(0, CHOOSE_MAX)
                    .sort(function (next, now) {
                        return next - now;
                    });
var bonus = shuffle[shuffle.length - 1];    // 맨 뒤의 숫자가 bonus

// console.log("당첨숫자: ", predAns, "\n보너스숫자: ", bonus);

var predSection = document.querySelector('#pred');  // 예상 당첨 숫자 구역

function colorBall(number, section) {
    // number를 공에 박고, 공을 section에 넣음

    var ball = document.createElement('div');   // 숫자가 적힌 공
    ball.textContent = number;
    ball.style.display = 'inline-block';
    ball.style.border = '1px solid black';
    ball.style.borderRadius = '10px';
    ball.style.height = '20px';
    ball.style.width = '20px';
    ball.style.textAlign = 'center';
    ball.style.marginRight = '5px';

    var bgColor;    // 공의 배경색

    if(number <= YELLOW) bgColor = 'yellow';
    else if(number <= BLUE) bgColor = 'skyblue';
    else if(number <= RED) bgColor = 'red';
    else if(number <= BLACK) bgColor = 'lightgrey';
    else bgColor = 'lightgreen';

    ball.style.background = bgColor;

    section.appendChild(ball);
}

for(var i = 0; i < CHOOSE_MAX; i++) {
    // 클로저 문제(동기 수행 -> 비동기 수행 으로 인해 원하는 동작이 안나오는 현상) 해결
    (function (j) {
        setTimeout(function() {
            colorBall(predAns[j], predSection)
        }, j * 1000);
    })(i);
}

var bonusSection = document.querySelector('.predBonus');    // 보너스 숫자 구역

setTimeout(function () {
    colorBall(bonus, bonusSection)
}, CHOOSE_MAX * 1000);