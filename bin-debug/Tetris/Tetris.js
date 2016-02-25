var Tetris;
(function (Tetris_1) {
    /**
     *
     * @author shadow.li
     *
     */
    var Tetris = (function () {
        function Tetris(stageW, stageH) {
            this.number = 0;
            this.stageW = stageW;
            this.stageH = stageH;
            this.init();
        }
        var d = __define,c=Tetris,p=c.prototype;
        //初始化
        Tetris.initWall = function () {
            Tetris.wall = [];
            for (var i = 0; i < 20; i++) {
                Tetris.wall.push([null, null, null, null, null, null, null, null, null, null]);
            }
        };
        p.init = function () {
            Tetris.initWall();
            this.bg = Util.createBitmapByName("background");
            this.game = new egret.Sprite();
            this.game.x = 60;
            this.game.y = 99;
            this.game.width = Tetris_1.Cell.width * Tetris.wall[0].length;
            this.game.height = Tetris_1.Cell.height * Tetris.wall.length;
            //this.game.graphics.beginFill(0x000000);
            //this.game.graphics.drawRect(0,0,this.game.width,this.game.height);
            //this.game.graphics.endFill();
            this.tips = new egret.Sprite();
            this.tips.x = 350;
            this.tips.y = 99;
            this.tips.width = 100;
            this.tips.height = 150;
            //this.tips.graphics.beginFill(0x000000);
            //this.tips.graphics.drawRect(0,0,100,150);
            //this.tips.graphics.endFill();
            this.score = new egret.TextField();
            this.score.x = this.tips.x;
            this.score.y = this.tips.y + 200;
            this.score.text = " SCORE";
            this.score.textColor = 0x777777;
            this.scoreNumer = new egret.TextField();
            this.scoreNumer.x = this.score.x;
            this.scoreNumer.y = this.score.y + 50;
            this.scoreNumer.text = " " + this.number;
            this.scoreNumer.textColor = 0x777777;
            //虚拟十字按键
            this.controlPanel = Util.createBitmapByName("control");
            this.controlPanel.x = 20;
            this.controlPanel.y = 600;
            this.controlPanel.touchEnabled = true;
            this.controlPanel.addEventListener(egret.TouchEvent.TOUCH_TAP, function (evt) {
                var baseWidth = this.controlPanel.width / 2;
                var baseHeight = this.controlPanel.height / 2;
                //坐标系 x,y
                var currentX = evt.localX - baseWidth;
                var currentY = baseHeight - evt.localY;
                switch (Util.calculatePoint(currentX, currentY)) {
                    case 1:
                        Tetris.currentTetromino.rotateRight();
                        break;
                    case 2:
                        Tetris.currentTetromino.move(true);
                        break;
                    case 3:
                        Tetris.currentTetromino.OneStepDown();
                        break;
                    case 4:
                        Tetris.currentTetromino.move(false);
                        break;
                }
                //Tetris.currentTetromino.move(false);
            }, this);
            this.controlButton = Util.createBitmapByName("button");
            this.controlButton.x = 245 + this.controlButton.width / 2;
            this.controlButton.y = 600 + this.controlButton.height / 2;
            this.controlButton.anchorOffsetX = this.controlButton.width / 2;
            this.controlButton.anchorOffsetY = this.controlButton.height / 2;
            this.controlButton.touchEnabled = true;
            this.controlButton.addEventListener(egret.TouchEvent.TOUCH_TAP, function (evt) {
                Tetris.currentTetromino.HardDropDown();
            }, this);
            //加载需要使用的背景音乐
            this.bgsound1X = RES.getRes("bgsound1X");
            this.bgsound2X = RES.getRes("bgsound2X");
            this.bgsoundMax = RES.getRes("bgsound3X");
            this.gameOver = RES.getRes("gameover");
        };
        return Tetris;
    })();
    Tetris_1.Tetris = Tetris;
    egret.registerClass(Tetris,'Tetris.Tetris');
})(Tetris || (Tetris = {}));
//# sourceMappingURL=Tetris.js.map