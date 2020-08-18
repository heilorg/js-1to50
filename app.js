class App{
    constructor(){
        this.game = new Game(this);

        this.DOM = {};
        this.DOM.startBtn = document.querySelector("#start-btn");
        this.DOM.board = document.querySelector("#board");
        this.DOM.timer = document.querySelector(".time");

        this.blocks = [];
    }

    init(){
        this.DOM.startBtn.addEventListener("click", () => {
            if(this.game.started){
                return false;
            }
            this.game.start();
        });
    }

    clearBoard(){
        this.DOM.board.innerHTML = "";
    }

    createBlock({left, top, data, type}){
        let block = document.createElement("div");
        block.classList.add("block");
        block.classList.add("type-"+type);
        block.innerHTML = `<div class="inner-block">${data}</div>`;
        block.style.left = left + "px";
        block.style.top = top + "px";

        this.blocks.push(block);
        this.DOM.board.append(block);
    }

    setBlockEvent(){
        this.blocks.forEach(block => {
            block.addEventListener("click", this.blockClick.bind(this));
        });
    }

    blockClick(event){
        if(event.target.classList.contains("inner-block")){
            let data = event.target.innerText;

            if(this.game.statusCheck(data)){
                this.blockPop(event.target.parentNode);
                this.game.nextStatus();
            }

            if(this.game.endChaek()){
                this.game.end();
            }
        }
    }

    blockPop(node){
        node.classList.add("end");
        setTimeout(() => {
            this.DOM.board.removeChild(node);
        }, 1000);
    }

    printTime(text){
        this.DOM.timer.innerText = text;
    }
}

class Game{
    constructor(app){
        this.started = false;
        this.app = app;

        this.blocks = [];

        this.status = 1;
        this.startTime = null;
        this.timer = null;
    }

    start(){
        this.app.clearBoard();
        this.clearBlcok();
        this.blockRender();
        this.status = 1;
        this.startTime = new Date();
        this.setTimer();
    }

    clearBlcok(){
        this.started = true;
        this.blocks = [];

        let arr1 = [];
        let arr2 = [];
        for(let i = 1; i <= 25; i++){
            arr1.push(i);
            arr2.push(i + 25);
        }

        for(let i = 0; i < 25; i++){
            let idx = Math.floor(Math.random() * (25 - i));
            this.blocks.push(arr1[idx]);
            arr1[idx] = arr1[25 - i - 1];
        }
        for(let i = 0; i < 25; i++){
            let idx = Math.floor(Math.random() * (25 - i));
            this.blocks.push(arr2[idx]);
            arr2[idx] = arr2[25 - i - 1];
        }
    }

    blockRender(){
        this.blocks.forEach((data, idx) => {
            let left = ((idx + 1) % 5) * 100;
            let top = (Math.floor((idx + 1) / 5) % 5) * 100;
            let type = Math.ceil((idx + 1) / 25);
            this.app.createBlock({left, top, data, type});
        });
        this.app.setBlockEvent();
    }

    statusCheck(data){
        if(data == this.status){
            return true;
        }else{
            return false;
        }
    }

    nextStatus(){
        this.status++;
    }

    endChaek(){
        if(this.status == 51){
            return true;
        }else{
            return false;
        }
    }

    end(){
        this.started = false;
        clearInterval(this.timer);
        this.app.printTime("");
        alert("게임 클리어 , 기록 : " + this.getTime());
    }

    setTimer(){
        this.timer = setInterval(() => {
            this.app.printTime(this.getTime());
        });
    }

    getTime(){
        let now = new Date();
        let temp = now - this.startTime;
        var m = Math.floor((temp % (1000 * 60 * 60)) / (1000 * 60));
        var s = Math.floor((temp % (1000 * 60)) / 1000);
        var ms = Math.floor(temp % (1000 * 60) % 1000);

        function intToTime(i){
            return i >= 10 ? i : "0" + i;
        }
        return intToTime(m)+":"+intToTime(s)+":"+ms;
    }
}

window.onload = () => {
    let app = new App();
    app.init();
}