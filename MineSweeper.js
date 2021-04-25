var dataset = [];   // 코드 입력할 맵
var code = {
    mine : -1,  // 지뢰
    blank_open : 0, // 빈칸이었는데 연 칸
    mine_flag : 1,  // 지뢰인데 깃발
    blank_flag : 2, // 빈칸인데 깃발
    mine_question : 3,  // 지뢰인데 물음표
    blank_question : 4, // 빈칸인데 물음표
};

var totOpen = 0;    // 현재 열려있는 칸의 총 개수
var endFlag = false;    // 게임 종료 여부

var tbody = document.querySelector("#table tbody");

// 실행하기 버튼 클릭
document.querySelector("#exec").addEventListener('click', function() {
    tbody.innerHTML = '';
    dataset = [];
    totOpen = 0;
    endFlag = false;

    var hor = parseInt(document.querySelector("#hor").value);
    var ver = parseInt(document.querySelector("#ver").value);
    var mine = parseInt(document.querySelector("#mine").value);

    // 지뢰 개수가 지도 칸 수 넘을 때
    if(mine > hor * ver) {
        alert('지뢰 개수는 지도 칸 수를 넘을 수 없습니다. (최대 개수: ' + hor * ver + ')');
        return;
    }

    for(var i = 0; i < hor; i++) {
        var tr = document.createElement('tr');  // 가로
        var arr = [];
        dataset.push(arr);

        for(var j = 0; j < ver; j++) {
            var td = document.createElement('td');  // 칸
            arr.push('');

            // 칸을 클릭했을 때
            td.addEventListener('click', function (e) {
                // 이미 게임이 끝나있는가?
                if(endFlag) return;
                
                var curHor = e.currentTarget.parentNode;    // 현재 행
                var curBody = curHor.parentNode;    // 현재 테이블

                var horPos = Array.prototype.indexOf.call(curBody.children, curHor);    // 행의 위치
                var verPos = Array.prototype.indexOf.call(curHor.children, e.currentTarget);    // 열의 위치
                var curVal = dataset[horPos][verPos];   // 현재 위치에 있는 코드

                // 현재 빈칸일 때
                if(curVal === '') dataset[horPos][verPos] = code.blank_open;
                // 빈칸 아님 && 지뢰도 아님 -> 열려있거나 뭔가 표시 해놨음
                else if(curVal !== code.mine) return;
                // 지뢰칸일 때
                else {
                    e.currentTarget.textContent = '펑';
                    e.currentTarget.classList.add('gameover');
                    alert('졌습니다!');
                    endFlag = true;
                    return;
                }

                e.currentTarget.classList.add('opened');

                // 지뢰 빼고 모든 칸을 열었을 때
                if(++totOpen >= hor * ver - mine) {
                    alert('이겼습니다!');
                    endFlag = true;
                }

                var dx = [-1, 0, 1, 0, -1, -1, 1, 1];   // left, down, right, up, 좌상, 좌하, 우상, 우하
                var dy = [0, -1, 0, 1, -1, 1, -1, 1];
                var mineCnt = 0;    // 주위의 지뢰 개수

                // 사방팔방 다 살펴봄
                for(var i = 0; i < 8; i++) {
                    var x = horPos + dx[i]; // 살펴볼 곳의 행 좌표
                    var y = verPos + dy[i]; // 살펴볼 곳의 열 좌표

                    // 범위 체크
                    if(x < 0 || x >= hor || y < 0 || y >= ver) continue;
                    // 알고보니 지뢰 자리였을 때
                    if(dataset[x][y] === code.mine) mineCnt++;
                }

                // 주위에 지뢰가 있을 때
                if(mineCnt) {
                    e.currentTarget.textContent = mineCnt;
                    return;
                }
                // 이미 모든 칸을 열었을 때
                if(totOpen >= hor * ver - mine) return;

                // 사방팔방 다 살펴보기
                for(var i = 0; i < 8; i++) {
                    var x = horPos + dx[i]; // 살펴볼 칸의 행 좌표
                    var y = verPos + dy[i]; // 살펴볼 칸의 열 좌표

                    // 범위 체크
                    if(x < 0 || x >= hor || y < 0 || y >= ver) continue;
                    
                    var next = tbody.children[x].children[y];   // 살펴볼 칸

                    // 그 칸이 아직 안열려있을 때
                    if(next.textContent === '') next.click();
                }
            });

            // 칸에 오른쪽 클릭했을 때
            td.addEventListener('contextmenu', function(e) {
                e.preventDefault(); // context menu 기본 동작 방지
                
                // 이미 게임 끝났나?
                if(endFlag) return;

                var curHor = e.currentTarget.parentNode;    // 현재 행
                var curBody = curHor.parentNode;    // 현재 테이블

                var horPos = Array.prototype.indexOf.call(curBody.children, curHor);    // 현재 행 좌표
                var verPos = Array.prototype.indexOf.call(curHor.children, e.currentTarget);    // 현재 열 좌표
                var curVal = dataset[horPos][verPos];   // 현재 위치에 있는 코드
                var curSig = e.currentTarget.textContent;   // 현재 위치에 있는 보여지는 값

                // 비어있거나 지뢰일 때 -> 아직 안열림
                if(curVal === '' || curVal === code.mine) {
                    e.currentTarget.textContent = '!';
                    e.currentTarget.classList.add('flag');

                    // 빈칸일 때
                    if(curVal === '') dataset[horPos][verPos] = code.blank_flag;
                    // 지뢰칸일 때
                    else dataset[horPos][verPos] = code.mine_flag;
                }
                // 깃발칸일 때
                else if(curSig === '!') {
                    e.currentTarget.textContent = '?';
                    e.currentTarget.classList.remove('flag');
                    e.currentTarget.classList.add('question');
                    
                    // 빈칸에 깃발 꼽았던 것일 때
                    if(curVal === code.blank_flag) dataset[horPos][verPos] = code.blank_question;
                    // 지뢰칸에 깃발 꼽았던 것일 때
                    else dataset[horPos][verPos] = code.mine_question;
                }
                // 빈칸에 물음표 표시 해놨던 것일 때
                else if(curVal === code.blank_question) {
                    e.currentTarget.textContent = '';
                    dataset[horPos][verPos] = '';
                    e.currentTarget.classList.remove('question');
                }
                // 지뢰칸에 물음표 표시 해놨던 것일 때
                else if(curVal === code.mine_question) {
                    e.currentTarget.textContent = 'X';
                    dataset[horPos][verPos] = code.mine;
                }
            });

            tr.appendChild(td);
        }

        tbody.appendChild(tr);
    }

    putMine(hor, ver, mine);    // 지뢰 깔기
});


function putMine(hor, ver, mine) {
    // 지도에 지뢰 심기

    var basket = Array(hor * ver)
                .fill()
                .map(function (value, idx) {
                    return idx;
                }); // 후보 숫자들

    var shuffle = [];   // 후보 랜덤으로 뽑은 것들을 넣을 바구니

    // 지뢰 개수만큼 뽑기
    while(shuffle.length < mine) {
        var tmp = basket.splice(Math.random() * basket.length, 1)[0];
        shuffle.push(tmp);
    }

    // 랜덤으로 지뢰에 심기
    shuffle.forEach(function (val) {
        var horPos = Math.floor(val / ver); // 행 좌표
        var verPos = val % ver; // 열 좌표

        tbody.children[horPos].children[verPos].textContent = 'X';
        dataset[horPos][verPos] = code.mine;
    });
}