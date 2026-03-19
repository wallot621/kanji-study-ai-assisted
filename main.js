let mode = "kanji";
let tempMode = null;
let index = 0;

// 카타카나 → 히라가나 변환
function toHiragana(str){
    if(!str) return "";
    return str.replace(/[\u30a1-\u30f6]/g, ch =>
        String.fromCharCode(ch.charCodeAt(0) - 0x60)
    );
}

function toggleMode(){
    mode = (mode === "kanji") ? "reading" : "kanji";
    tempMode = null;
    update();
}

function showMeaning(){
    if(tempMode === "meaning" || tempMode === "kanji"){
        tempMode = null;
    } else {
        tempMode = (mode === "kanji") ? "meaning" : "kanji";
    }
    update();
}

function showReading(){
    tempMode = (tempMode === "reading") ? null : "reading";
    update();
}

function showWords(){
    tempMode = (tempMode === "words") ? null : "words";
    update();
}

function nextKanji(){
    let grade = document.getElementById("grade").value;
    let list = kanjiData[grade];
    if(!list || list.length === 0) return;

    index = (index + 1) % list.length;
    tempMode = null;
    update();
}

function prevKanji(){
    let grade = document.getElementById("grade").value;
    let list = kanjiData[grade];
    if(!list || list.length === 0) return;

    index = (index - 1 + list.length) % list.length;
    tempMode = null;
    update();
}

function update(){
    let grade = document.getElementById("grade").value;
    let list = kanjiData[grade];
    let display = document.getElementById("display");

    let btnMeaning = document.getElementById("btnMeaning");
    let btnReading = document.getElementById("btnReading");
    let btnWords = document.getElementById("btnWords");

    let showMeaningChk = document.getElementById("showMeaningChk").checked;

    if(!list || list.length === 0){
        display.innerText = "데이터 없음";
        document.getElementById("counter").innerText = "0 / 0";
        document.getElementById("progress").style.width = "0%";
        return;
    }

    let item = list[index];

    // 버튼 초기화
    btnMeaning.classList.remove("active");
    btnReading.classList.remove("active");
    btnWords.classList.remove("active");

    btnMeaning.innerText = (mode === "kanji") ? "뜻" : "한자";

    /* ⭐ 1순위: 버튼 모드 */
    if(tempMode === "meaning"){
        display.innerText = item.r;
        display.className = "display reading";
        btnMeaning.classList.add("active");
    }
    else if(tempMode === "kanji"){
        display.innerText = item.k;
        display.className = "display kanji";
        btnMeaning.classList.add("active");
    }
    else if(tempMode === "reading"){
        display.innerText =
            toHiragana(item.on) + "\n" + toHiragana(item.kun);
        display.className = "display reading";
        btnReading.classList.add("active");
    }
    else if(tempMode === "words"){
        display.innerHTML = `
            <div style="
                display:grid;
                grid-template-columns: repeat(2, 120px);
                justify-content:center;
                column-gap:20px;
                row-gap:10px;
                text-align:center;
            ">
                <div style="font-weight:bold;">${item.words[0].w}</div>
                <div style="font-weight:bold;">${item.words[1].w}</div>

                <div style="font-size:4vw; color:#aaa;">(${item.words[0].y})</div>
                <div style="font-size:4vw; color:#aaa;">(${item.words[1].y})</div>

                <div style="color:#ddd;">${item.words[0].m}</div>
                <div style="color:#ddd;">${item.words[1].m}</div>
            </div>
        `;
        display.className = "display reading";
        btnWords.classList.add("active");
    }

    /* ⭐ 2순위: 같이보기 */
    else if(showMeaningChk){
        display.innerHTML = `
            <div style="text-align:center;">
                <div style="font-size:14vw; font-weight:bold;">
                    ${item.k}
                </div>
                <div style="font-size:5vw; color:#aaa; margin-top:2px; line-height:1.2;">
                    ${item.r}
                </div>
            </div>
        `;
        display.className = "display";
    }

    /* ⭐ 3순위: 기본 */
    else {
        if(mode === "kanji"){
            display.innerText = item.k;
            display.className = "display kanji";
        } else {
            display.innerText = item.r;
            display.className = "display reading";
        }
    }

    document.getElementById("counter").innerText =
        (index + 1) + " / " + list.length;

    let percent = ((index + 1) / list.length) * 100;
    document.getElementById("progress").style.width = percent + "%";
}

// 학년 변경 시 초기화
document.getElementById("grade").addEventListener("change", () => {
    index = 0;
    tempMode = null;
    update();
});

// ⭐ 체크박스 반영
document.getElementById("showMeaningChk").addEventListener("change", update);

// 첫 실행
window.onload = update;
