var dataset = [];
var code = {
    mine : -1,
    blank_open : 0,
    mine_flag : 1,
    blank_flag : 2,
    mine_question : 3,
    blank_question : 4,
};

tbody = document.querySelector("#table tbody");

document.querySelector("#exec").addEventListener('click', function() {
    tbody.innerHTML = '';
    dataset = [];

    var hor = parseInt(document.querySelector("#hor").value);
    var ver = parseInt(document.querySelector("#ver").value);
    var mine = parseInt(document.querySelector("#mine").value);

    if(mine > hor * ver) {
        alert('지뢰 개수는 지도 칸 수를 넘을 수 없습니다. (최대 개수: ' + hor * ver + ')');
        return;
    }

    for(var i = 0; i < hor; i++) {
        var tr = document.createElement('tr');
        var arr = [];
        dataset.push(arr);

        for(var j = 0; j < ver; j++) {
            var td = document.createElement('td');
            arr.push('');

            td.addEventListener('click', function (e) {
                var curHor = e.currentTarget.parentNode;
                var curBody = curHor.parentNode;

                var horPos = Array.prototype.indexOf.call(curBody.children, curHor);
                var verPos = Array.prototype.indexOf.call(curHor.children, e.currentTarget);
                var curVal = dataset[horPos][verPos];

                if(curVal === '') dataset[horPos][verPos] = code.blank_open;
                else if(curVal !== code.mine) return;
                else {
                    e.currentTarget.textContent = '펑';
                    alert('졌습니다!');
                    return;
                }

                e.currentTarget.textContent = 'O';
            });

            td.addEventListener('contextmenu', function(e) {
                e.preventDefault();

                var curHor = e.currentTarget.parentNode;
                var curBody = curHor.parentNode;

                var horPos = Array.prototype.indexOf.call(curBody.children, curHor);
                var verPos = Array.prototype.indexOf.call(curHor.children, e.currentTarget);
                var curVal = dataset[horPos][verPos];
                var curSig = e.currentTarget.textContent;

                if(curSig === '' || curSig === 'X') {
                    e.currentTarget.textContent = '!';

                    if(curSig === '') dataset[horPos][verPos] = code.blank_flag;
                    else dataset[horPos][verPos] = code.mine_flag;
                }
                else if(curSig === '!') {
                    e.currentTarget.textContent = '?';
                    
                    if(curVal === code.blank_flag) dataset[horPos][verPos] = code.blank_question;
                    else dataset[horPos][verPos] = code.mine_question;
                }
                else if(curVal === code.blank_question) {
                    e.currentTarget.textContent = '';
                    dataset[horPos][verPos] = '';
                }
                else if(curVal === code.mine_question) {
                    e.currentTarget.textContent = 'X';
                    dataset[horPos][verPos] = code.mine;
                }
            });

            tr.appendChild(td);
        }

        tbody.appendChild(tr);
    }

    putMine(hor, ver, mine);
});


function putMine(hor, ver, mine) {
    // 지도에 지뢰 심기

    var basket = Array(hor * ver)
                .fill()
                .map(function (value, idx) {
                    return idx;
                });

    var shuffle = [];

    while(basket.length > hor * ver - mine) {
        var tmp = basket.splice(Math.random() * basket.length, 1)[0];
        shuffle.push(tmp);
    }

    for(var i = 0; i < shuffle.length; i++) {
        var horPos = Math.floor(shuffle[i] / ver);
        var verPos = shuffle[i] % ver;

        tbody.children[horPos].children[verPos].textContent = 'X';
        dataset[horPos][verPos] = code.mine;
    }
}