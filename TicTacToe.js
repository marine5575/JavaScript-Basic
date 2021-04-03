var body = document.body;

var aloneButton = document.createElement('button');
aloneButton.textContent = 'w/ COMPUTER';
body.appendChild(aloneButton);

var togetherButton = document.createElement('button');
togetherButton.textContent = 'w/ FRIEND';
body.appendChild(togetherButton);

var table = document.createElement('table');
body.appendChild(table);

var retry = document.createElement('button');
retry.textContent = '다시하기';
body.appendChild(retry);

var rows = [];  // tr 모음
var cols = [];  // [[td, td, td], ...]
var visited = [0, 1, 2, 3, 4, 5, 6, 7, 8];  // 아직 사용하지 않은 칸
var putCnt = 0; // 채워진 칸 수
var marker = ['X', 'O'];    // 표시 종류
var markerPos = 0;  // 표시할 것 위치 -> marker의 index가 될 것
var aloneFlag = false;  // 혼자하는 게임 여부
var buttonClick_flag = false;   // 게임 종류 선택 여부


function init() {
    // 초기화 함수

    // 각 칸의 표시(O, X) 제거 및 배경 제거
    cols.forEach(function (v, idx) {
        cols[idx].forEach(function (v, idx) {
            v.textContent = '';
            v.removeAttribute('style');
        });
    });
    putCnt = markerPos = 0;
    aloneFlag = buttonClick_flag = false;
    visited = [0, 1, 2, 3, 4, 5, 6, 7, 8];
}

function checkBingo(rowPos, colPos) {
    // cols[rowPos][colPos]에 놓았을 때 한 줄 빙고가 이루어졌는지 확인 후 빙고 여부 반환

    var bingo = false;  // 빙고 여부

    // 가로 빙고
    if(
        cols[rowPos][0].textContent === cols[rowPos][1].textContent
        && cols[rowPos][1].textContent === cols[rowPos][2].textContent
    ) {
        cols[rowPos][0].style.background 
        = cols[rowPos][1].style.background
        = cols[rowPos][2].style.background 
        = 'yellow';

        bingo = true;
    }
    // 세로 빙고
    else if(
        cols[0][colPos].textContent === cols[1][colPos].textContent
        && cols[1][colPos].textContent === cols[2][colPos].textContent
    ) {
        cols[0][colPos].style.background 
        = cols[1][colPos].style.background
        = cols[2][colPos].style.background 
        = 'yellow';

        bingo = true;
    }

    // 우상향 대각선 위치에 놓았을 때
    if(rowPos === colPos) {
        // ↘ 빙고
        if(
            cols[0][0].textContent === cols[1][1].textContent
            && cols[1][1].textContent === cols[2][2].textContent
        ) {
            cols[0][0].style.background 
            = cols[1][1].style.background
            = cols[2][2].style.background 
            = 'yellow';

            bingo = true;
        }
        // ↗ 빙고
        else if(
            cols[0][2].textContent === marker[markerPos]
            && cols[1][1].textContent === marker[markerPos]
            && cols[2][0].textContent === marker[markerPos]
        ) {
            cols[0][2].style.background 
            = cols[1][1].style.background
            = cols[2][0].style.background 
            = 'yellow';

            bingo = true;
        }
    }
    // ↗ 위치에 놓았을 때
    else if(Math.abs(rowPos - colPos) === 2) {
        // ↗ 빙고
        if(
            cols[0][2].textContent === cols[1][1].textContent
            && cols[1][1].textContent === cols[2][0].textContent
        ) {
            cols[0][2].style.background 
            = cols[1][1].style.background
            = cols[2][0].style.background 
            = 'yellow';

            bingo = true;
        }
    }

    return bingo;
}

function computerTurn() {
    // 컴퓨터가 빈 자리에 놓는 함수

    // 무승부로 끝났을 때는 어쨌든 게임 끝난 것이므로
    if(putCnt === 0) return;

    var where = visited.splice(Math.random() * visited.length, 1);  // 빈칸의 위치
    var rowPos = parseInt(where / 3), colPos = where % 3;   // 빈칸의 좌표

    putCnt++;
    cols[rowPos][colPos].textContent = marker[markerPos];

    var bingo = checkBingo(rowPos, colPos); // 빙고 여부

    // 빙고일 때
    if(bingo) {
        setTimeout(function() {
            window.alert(marker[markerPos] + ' 님이 승리했습니다!');
            init();
        }, 20);
    }
    // 빙고 아닐 때 -> 게임 계속 해야 됨
    else markerPos ^= 1;
}

function clickEvent(e) {
    // 표를 클릭했을 때 작동하는 함수

    // 아직 게임 방식 결정하지 않았을 때
    if(!buttonClick_flag) {
        window.alert('플레이 방식을 선택해주세요!');
        return;
    }

    var rowPos = rows.indexOf(e.currentTarget.parentNode);  // 가로 좌표
    var colPos = cols[rowPos].indexOf(e.currentTarget); // 세로 좌표

    // 이미 차있을 때
    if(cols[rowPos][colPos].textContent !== '') {
        console.log('Already filled!');
    }
    // 빈 칸일 때
    else {
        putCnt++;
        cols[rowPos][colPos].textContent = marker[markerPos];
        visited.splice(visited.indexOf(rowPos * 3 + colPos), 1);    // 방문한 칸은 빼버림

        var bingo = checkBingo(rowPos, colPos); // 빙고 여부

        // 빙고일 때
        if(bingo) {
            setTimeout(function() {
                window.alert(marker[markerPos] + ' 님이 승리했습니다!');
                init();
            }, 20);

            return;
        }
        // 방고 아닐 때
        else {
            markerPos ^= 1;
            
            // 컴퓨터와 하고 있을 때
            if(aloneFlag) setTimeout(computerTurn, 500);
        }

        // 칸이 꽉 찼을 때 -> 게임 종료
        if(putCnt === 9) {
            setTimeout(function() {
                window.alert('무승부입니다!');
                init();
            }, 20);
        }
    }
}

for(var i = 0; i < 3; i++) {
    var tr = document.createElement('tr');  // 표의 행 하나
    table.appendChild(tr);
    rows.push(tr);
    cols.push([]);

    for(var j = 0; j < 3; j++) {
        var td = document.createElement('td');  // 표의 칸 하나
        tr.appendChild(td);
        cols[i].push(td);

        td.addEventListener('click', clickEvent);
    }
}

aloneButton.addEventListener('click', function() {
    // 컴퓨터와 하기 버튼 클릭했을 때

    aloneFlag = buttonClick_flag = true;
});

togetherButton.addEventListener('click', function() {
    // 친구와 같이 하기 버튼 클릭했을 때

    buttonClick_flag = true;
});

retry.addEventListener('click', function() {
    // 다시하기 버튼 클릭했을 때

    init();
});