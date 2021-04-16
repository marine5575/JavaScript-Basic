var imgPos = '-10px';
var scoreBoard = {
    '가위':0,
    '바위':1,
    '보':2,
};
var comPos = {
    '가위':'-170px',
    '바위':'-10px',
    '보':'190px',
};

function viewComputerSelect(pos) {
    // imgPos의 위치를 기반으로 컴퓨터가 현재 뭘 냈는지 반환

    return Object.entries(comPos).find(function (x) {
        // e.g., x == {'가위', '-170px'}
        return x[1] === pos;
    })[0];
}

function createInterval() {
    setInterval(function() {
        // 그림을 바꾸게 하기 위함
        if(imgPos === comPos['가위']) imgPos = comPos['바위'];
        else if(imgPos === comPos['바위']) imgPos = comPos['보'];
        else imgPos = comPos['가위'];

        document.querySelector('#computer').style.background =
        'url(https://image.shutterstock.com/image-vector/rock-scissors-paper-hand-gesture-260nw-689530327.jpg) ' + imgPos;
    }, 100);
};

createInterval();   // 클로저 문제 방지

document.querySelectorAll('.btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
        var select = this.textContent;  // 현재 내가 선택한 버튼에 써있는 단어
        var myScore = scoreBoard[select];   // 내 점수
        var comScore = scoreBoard[viewComputerSelect(imgPos)];  // 컴퓨터 점수

        var diff = myScore - comScore;  // 점수 차

        // 가위-가위, 바위-바위, 보-보
        if(!diff) alert('비겼습니다!')
        // 가위-보, 바위-가위, 보-바위
        else if(diff in [-2, 1]) alert('이겼습니다!');
        // 가위-바위, 바위-보, 보-가위
        else alert('졌습니다!');
    })
});