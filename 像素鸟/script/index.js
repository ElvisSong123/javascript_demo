var game = {
    width: 800,
    height: 600,
    dom: document.querySelector("#game"),
    isOver: false
};

var bg = {
    left: 0,
    timer: null,
    dom: document.querySelector("#game .bg"),
    domLand: document.querySelector("#game .bgland"),
    show() {
        this.dom.style.marginLeft = this.left + "px";
        this.domLand.style.left = this.left + "px";
    },
    start() {
        if (!this.timer) {
            var that = this;
            this.timer = setInterval(function () {
                that.left -= 2;
                if (that.left === -game.width) {
                    that.left = 0;
                }
                that.show();
            }, 20);
        }
    },
    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
};
bg.show();

var bird = {
    left: 200,
    top: 150,
    width: 33,
    height: 26,
    dom: document.querySelector("#game .bird"),
    wingIndex: 0,
    show: function () {
        this.dom.style.backgroundPosition = `-${52 * this.wingIndex}px 0`;
        this.dom.style.left = this.left + "px";
        this.dom.style.top = this.top + "px";
    },
    wingTimer: null,
    startWing() {
        if (!this.wingTimer) {
            var that = this;
            this.wingTimer = setInterval(function () {
                that.wingIndex = ++that.wingIndex % 3;
                that.show();
            }, 200)
        }
    },
    stopWing() {
        if (this.wingTimer) {
            clearInterval(this.wingTimer);
            this.wingTimer = null;
        }
    },
    start() {
        this.startWing();
        this.startDrop();
    },
    stop() {
        this.stopWing();
        this.stopDrop();
    },
    setTop(newTop) {
        if (newTop < 0) {
            newTop = 0;
        }
        else if (newTop > game.height - 112 - 36) {
            newTop = game.height - 112 - 36;
        }
        this.top = newTop;
    },
    dropTimer: null,
    speed: 0,
    startDrop() {
        if (!this.dropTimer) {
            var that = this;
            var t = 16, g = 0.002;
            this.dropTimer = setInterval(function () {
                //计算运动距离：S=V0t+1/2at²
                var s = that.speed * t + 0.5 * g * t * t;
                that.speed = that.speed + g * t;
                that.setTop(that.top + s);
                that.show();
            }, t)
        }
    },
    stopDrop() {
        if (this.dropTimer) {
            clearInterval(this.dropTimer);
            this.dropTimer = null;
        }
    },
    toUp() {
        this.speed = -0.5;
    }
}
bird.show();

var pipes = {
    width: 52,
    doms: [],
    createPipePair() {
        var panelHeight = game.height - 112;
        var minHeight = 60, gap = 120, maxHeight = panelHeight - gap - minHeight;
        //得到第一个柱子高度
        var h1 = this.getRandom(minHeight, maxHeight);
        var h2 = panelHeight - gap - h1;

        var pipeUpDiv = document.createElement("div");
        pipeUpDiv.className = "pipeup";
        pipeUpDiv.style.height = h1 + "px";
        pipeUpDiv.style.left = game.width + 52 + "px";

        this.doms.push({
            left: game.width + 52,
            top: 0,
            height: h1,
            dom: pipeUpDiv
        });
        var pipeDownDiv = document.createElement("div");
        pipeDownDiv.className = "pipedown";
        pipeDownDiv.style.height = h2 + "px";
        pipeDownDiv.style.left = game.width + 52 + "px";
        game.dom.appendChild(pipeDownDiv);
        game.dom.appendChild(pipeUpDiv);
        this.doms.push({
            left: game.width + 52,
            top: h1 + gap,
            height: h2,
            dom: pipeDownDiv
        });
    },
    getRandom(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    },
    moveTimer: null,
    startMove() {
        if (!this.moveTimer) {
            this.moveTimer = setInterval(() => {
                this.doms.forEach(d => {
                    d.left -= 2;
                    d.dom.style.left = d.left + "px";
                    if (d.left < -52) {
                        d.dom.remove();
                    }
                });
                // this.doms = this.doms.filter(it => it.left >= -52);
                if (isDead()) {
                    stop();
                    document.querySelector("#game .gameover").style.display = "block";
                    game.isOver = true;
                }
            }, 20)
        }
    },
    stopMove() {
        if (this.moveTimer) {
            clearInterval(this.moveTimer);
            this.moveTimer = null;
        }
    },
    produceTimer: null,
    startProduce() {
        if (!this.produceTimer) {
            this.produceTimer = setInterval(() => {
                this.createPipePair();
            }, 3000)
        }
    },
    stopProduce() {
        if (this.produceTimer) {
            clearInterval(this.produceTimer);
            this.produceTimer = null;
        }
    },
    start() {
        this.startMove();
        this.startProduce();
    },
    stop() {
        this.stopMove();
        this.stopProduce();
    }
}

pipes.createPipePair()

function isDead() {
    if (bird.top >= game.height - 112 - 36) {
        return true;
    }
    for (const d of pipes.doms) {
        if (Math.abs(d.left + pipes.width / 2 - (bird.left + bird.width / 2)) <= (pipes.width + bird.width) / 2 &&
            Math.abs(d.top + d.height / 2 - (bird.top + bird.height / 2)) <= (d.height + bird.height) / 2) {
            return true;
        }
    }

    return false;
}

function start() {
    if (game.isOver) {
        location.reload();
    }
    else {
        bg.start();
        bird.start();
        pipes.start();
    }

}

function stop() {
    bg.stop();
    bird.stop();
    pipes.stop();
}

document.documentElement.onkeydown = function (e) {

    if (e.key === " ") {
        bird.toUp();
    }
    else if (e.key === "Enter") {
        start();
    }
}