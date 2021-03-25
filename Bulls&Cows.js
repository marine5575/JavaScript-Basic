const MAX_TRIAL = 5;
const MAX_STRIKE = 4;

var body = document.body;
var trialCnt = document.createElement('div');
body.appendChild(trialCnt);

var result = document.createElement('h1');
result.setAttribute('white-space', 'pre-line');
result.textContent = '겹치지 않는 숫자 4개를 입력하세요. (1 ~ 9에서 선택)';
body.appendChild(result);

var form = document.createElement('form');
body.appendChild(form);

var input = document.createElement('input');
input.setAttribute('minlength', '4');
input.setAttribute('maxlength', '4');
form.appendChild(input);

var button = document.createElement('button');
button.textContent = '입력';
form.appendChild(button);

var notice = document.createElement('div');
body.appendChild(notice);

var nums, ans;
var trial;

function init() {
    // 초기화 함수

    nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    ans = [];   // 정답이 될 숫자 4개
    trial = 0;  // 도전 횟수
    trialCnt.textContent = '도전횟수 : 0';

    for(var i = 0; i < MAX_STRIKE; i++) {
        // nums의 랜덤 위치에서 1개를 지운 후 지운 값 반환
        var tmp = nums.splice(Math.floor(Math.random() * (9 - i)), 1)[0];
        ans.push(tmp);
    }

    console.log(ans);
}

function setTitle(time) {
    // 1초 뒤에 표시할 것들

    setTimeout(function() {
        result.textContent = '겹치지 않는 숫자 4개를 입력하세요. (1 ~ 9에서 선택)';
        notice.textContent = '';
    }, time * 1000);
}

init();

form.addEventListener('submit', function (e) {
    e.preventDefault(); // 새로고침 방지

    var guess = input.value.split('');  // 입력 받은 값

    // 중복된 숫자 입력 시
    if(guess.length !== (new Set(guess)).size) {
        window.alert('겹치지 않는 숫자 4개를 입력하세요. (1 ~ 9에서 선택)');

        input.value = '';
        input.focus();
        return;
    }

    var strike = 0, ball = 0;   // 스트라이크 개수, 볼 개수
    
    trialCnt.textContent = '도전횟수 : ' + String(++trial);

    // 같은 숫자일 때
    if(ans.join() === guess.join()) {
        result.textContent = '홈~런~';
        init();
        setTitle(1);
    }
    // 다른 숫자일 때
    else {
        for(var i = 0; i < MAX_STRIKE; i++) {
            // 스트라이크일 때
            if(ans[i] === Number(guess[i])) strike++;
            // 볼일 때
            else if(ans.includes(Number(guess[i]))) ball++;
        }
    
        result.textContent = String(strike) + "스트라이크 " + String(ball) + "볼입니다.";
        
        // 기회 다 썼음
        if(trial === MAX_TRIAL) {
            result.textContent = '정답은 [' + String(ans.join(',')) + ']이었습니다.';
            notice.textContent = '기회를 모두 소진하셨습니다. 다음 게임하시죠.';
            init();
            setTitle(2); // 정답은 오래 보여줘야 돼서
        }
        // 아직 기회 남음
        else setTitle(1);
    }

    input.value = '';
    input.focus();
});