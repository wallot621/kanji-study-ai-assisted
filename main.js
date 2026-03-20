let mode = "kanji";
let tempMode = null;
let index = 0;

let isDragging = false;

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
    let list = kanjiData[document.getElementById("grade").value];
    index = (index + 1) % list.length;
    tempMode = null;
    update();
}

function prevKanji(){
    let list = kanjiData[document.getElementById("grade").value];
    index = (index - 1 + list.length) % list.length;
    tempMode = null;
    update();
}

function update(){
    let list = kanjiData[document.getElementById("grade").value];
    let display = document.getElementById("display");

    let sliderThumb = document.getElementById("sliderThumb");

    if(!list || list.length === 0){
        display.innerText = "데이터 없음";
        return;
    }

    let item = list[index];

    /* ⭐ 슬라이더 위치 */
    const percent = index / (list.length - 1);
    sliderThumb.style.left = (percent * 100) + "%";

    if(tempMode === "meaning"){
        display.innerText = item.r;
        display.className = "display reading";
    }
    else if(tempMode === "kanji"){
        display.innerText = item.k;
        display.className = "display kanji";
    }
    else if(tempMode === "reading"){
        display.innerText =
            toHiragana(item.on) + "\n" + toHiragana(item.kun);
        display.className = "display reading";
    }
    else if(tempMode === "words"){
        display.innerHTML = `
            <div style="display:grid; grid-template-columns:repeat(2,120px); gap:10px;">
                <div>${item.words[0].w}</div>
                <div>${item.words[1].w}</div>
                <div style="color:#aaa;">(${item.words[0].y})</div>
                <div style="color:#aaa;">(${item.words[1].y})</div>
                <div>${item.words[0].m}</div>
                <div>${item.words[1].m}</div>
            </div>
        `;
        display.className = "display reading";
    }
    else {
        display.innerText = item.k;
        display.className = "display kanji";
    }

    document.getElementById("counter").innerText =
        (index + 1) + " / " + list.length;
}

/* ⭐ 슬라이더 로직 */
window.onload = () => {

    const wrap = document.getElementById("sliderWrap");
    const thumb = document.getElementById("sliderThumb");

    function move(clientX){
        const rect = wrap.getBoundingClientRect();

        let x = clientX - rect.left;
        x = Math.max(0, Math.min(x, rect.width));

        const percent = x / rect.width;

        let list = kanjiData[document.getElementById("grade").value];
        index = Math.round(percent * (list.length - 1));

        tempMode = null;
        update();
    }

    /* PC */
    thumb.addEventListener("mousedown", () => isDragging = true);

    document.addEventListener("mousemove", (e) => {
        if(!isDragging) return;
        move(e.clientX);
    });

    document.addEventListener("mouseup", () => isDragging = false);

    /* 모바일 */
    thumb.addEventListener("touchstart", () => isDragging = true);

    document.addEventListener("touchmove", (e) => {
        if(!isDragging) return;
        move(e.touches[0].clientX);
    });

    document.addEventListener("touchend", () => isDragging = false);

    document.getElementById("grade").addEventListener("change", () => {
        index = 0;
        update();
    });

    update();
};
