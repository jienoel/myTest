var Tetris;
(function (Tetris) {
    /**
     *
     * @author
     *
     */
    var GameContainer = (function (_super) {
        __extends(GameContainer, _super);
        function GameContainer() {
            _super.call(this);
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
            Util.showLog("主方法实例化开始 constructor");
        }
        var d = __define,c=GameContainer,p=c.prototype;
        p.onAddToStage = function (event) {
            //设置加载进度界面
            //Config to load process interface
            this.loadingView = new LoadingUI();
            this.stage.addChild(this.loadingView);
            Util.showLog("设置加载进度界面 onAddToStage");
            //初始化Resource资源加载库
            //initiate Resource loading library
            RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
            RES.loadConfig("resource/default.res.json", "resource/");
            Util.showLog("加载配置文件");
        };
        /**
         * 配置文件加载完成,开始预加载preload资源组。
         * configuration file loading is completed, start to pre-load the preload resource group
         */
        p.onConfigComplete = function (event) {
            RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            Util.showLog("配置文件加载结束");
            RES.loadGroup("preload");
            RES.loadGroup("load");
            Util.showLog("加载资源组");
        };
        /**
         * preload资源组加载完成
         * Preload resource group is loaded
         */
        p.onResourceLoadComplete = function (event) {
            //去掉perload判断,保证所有资源加载完成,防止移动段(比如IOS)声音不播放的问题
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            Util.showLog(event.groupName + ":资源组加载完成");
            this.ready();
        };
        /**
         * 资源组加载出错
         *  The resource group loading failed
         */
        p.onItemLoadError = function (event) {
            console.warn("Url:" + event.resItem.url + " has failed to load");
        };
        /**
         * 资源组加载出错
         *  The resource group loading failed
         */
        p.onResourceLoadError = function (event) {
            console.warn("Group:" + event.groupName + " has failed to load");
            //忽略加载失败的项目
            //Ignore the loading failed projects
            this.onResourceLoadComplete(event);
        };
        /**
         * preload资源组加载进度
         * Loading process of preload resource group
         */
        p.onResourceProgress = function (event) {
            if (event.groupName == "preload") {
                this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
                Util.showLog("预加载资源:" + event.resItem.name);
            }
        };
        /**
         * 初始化界面
         */
        p.ready = function () {
            //背景界面
            var loadbg = Util.createBitmapByName("loadbg");
            this.addChild(loadbg);
            //生成准备界面
            var ready = new egret.TextField();
            ready.text = "开始游戏";
            ready.size = 66;
            ready.textColor = 0x777777;
            ready.x = this.stage.stageWidth / 2 - ready.width / 2;
            ready.y = this.stage.stageHeight / 2 - ready.height / 2;
            ready.touchEnabled = true;
            var self = this;
            //开始游戏按键
            ready.addEventListener(egret.TouchEvent.TOUCH_TAP, readyTouch, this);
            function readyTouch() {
                self.removeChild(ready);
                self.removeChild(loadbg);
                ready.removeEventListener(egret.TouchEvent.TOUCH_TAP, readyTouch, this);
                self.createGameScene();
            }
            ready.removeEventListener(egret.TouchEvent.TOUCH_END, readyTouch, this);
            this.addChild(ready);
        };
        /**
         * 开始游戏
         */
        p.createGameScene = function () {
            var self = this;
            var tips = this.tips;
            Util.showLog("游戏开始");
            //实例化对象
            var tetris = new Tetris.Tetris(this.stage.stageWidth, this.stage.stageHeight);
            //播放背景音乐
            var chanel = tetris.bgsound1X.play(0);
            this.addChild(tetris.bg);
            this.addChild(tetris.game);
            this.addChild(tetris.tips);
            this.addChild(tetris.score);
            this.addChild(tetris.scoreNumer);
            this.addChild(tetris.controlPanel);
            this.addChild(tetris.controlButton);
            //显示下一个方块
            tips = this.randomTip();
            drawTips(tips.cells, true);
            createNew();
            //新建方块
            function createNew() {
                var nextTetromino = Tetris.Tetromino.randomCell(tips.cells[0].cellName); //根据tips生成方块
                var currentObj = Tetris.Tetris.currentTetromino = nextTetromino; //获取下一个方块
                drawTips(tips.cells, false); //删除当前tips
                tips = self.randomTip(); //更新tips
                drawTips(tips.cells, true); //添加新tips
                var currentCells = currentObj.cells; //获取内部数组对象
                //判断游戏是否结束
                if (self.gameOver(currentCells)) {
                    Util.showLog("游戏结束");
                    //关闭定时器                    
                    egret.clearInterval(step);
                    //关闭音乐
                    chanel.stop();
                    //给出提示
                    var gameover = new egret.TextField();
                    gameover.text = "游戏结束! 您的得分为:" + tetris.number;
                    gameover.x = tetris.stageW / 2 - gameover.width / 2;
                    gameover.y = tetris.stageH / 2 - gameover.height / 2;
                    gameover.textColor = 0x777777;
                    gameover.touchEnabled = true;
                    //绑定事件点击重新开始
                    gameover.addEventListener(egret.TouchEvent.TOUCH_TAP, function () {
                        self.removeChildren();
                        self.createGameScene();
                    }, this);
                    self.addChild(gameover);
                    return;
                }
                drawTetromino(currentCells, true); //绘制方块
                //
                var timestamp = 800;
                if (tetris.number >= 200000) {
                    timestamp = 200;
                    chanel.stop;
                    chanel = tetris.bgsoundMax.play();
                }
                else if (tetris.number >= 100000) {
                    timestamp = 400;
                    chanel.stop;
                    chanel = tetris.bgsound2X.play();
                }
                else if (tetris.number >= 50000) {
                    timestamp = 600;
                }
                //开启定时器执行单步下落
                var step = egret.setInterval(function () {
                    var canDown = currentObj.OneStepDown(); //获取返回值,可以下落为true,否则为false
                    if (!canDown) {
                        egret.clearInterval(step); //关闭定时器
                        Tetris.Tetromino.putToWall(currentCells); //把方块"打进数组"
                        drawTetromino(currentCells, false);
                        tetris.number += drawWall();
                        tetris.scoreNumer.text = " " + tetris.number;
                        createNew(); //新建一个
                    }
                }, 0, timestamp);
            }
            //绘制方块,或者消去方块
            function drawTetromino(cells, isDraw) {
                if (isDraw) {
                    for (var i = 0; i < cells.length; i++) {
                        tetris.game.addChild(cells[i]);
                    }
                }
                else {
                    for (var i = 0; i < cells.length; i++) {
                        tetris.game.removeChild(cells[i]);
                    }
                }
            }
            //绘制提示区域
            function drawTips(cells, isDraw) {
                if (isDraw) {
                    for (var i = 0; i < cells.length; i++) {
                        cells[i].x -= Tetris.Cell.width * 4;
                        tetris.tips.addChild(cells[i]);
                    }
                }
                else {
                    for (var i = 0; i < cells.length; i++) {
                        tetris.tips.removeChild(cells[i]);
                    }
                }
            }
            //画墙计算得分 
            function drawWall() {
                var wall = Tetris.Tetris.wall;
                var index = 0; //倍数
                for (var row in wall) {
                    var fullLine = true; //当前行是否满
                    for (var col in wall[row]) {
                        if (wall[row][col] !== null) {
                            tetris.game.addChild(wall[row][col]);
                        }
                        else {
                            fullLine = false;
                        }
                    }
                    //上一层往下移动
                    if (fullLine) {
                        //清除显示
                        for (var tempCol = 0; tempCol < wall[row].length; tempCol++) {
                            if (wall[row][tempCol].parent)
                                ;
                            wall[row][tempCol].parent.removeChild(wall[row][tempCol]);
                        }
                        //当前行的每上一层下移,行内格子同步更新
                        for (var tempRow = row; tempRow > 0; tempRow--) {
                            for (var k = 0; k < wall[tempRow].length; k++) {
                                if (wall[tempRow - 1][k] !== null)
                                    wall[tempRow - 1][k].y += Tetris.Cell.height;
                            }
                            //先显示墙下移,然后操作墙数组
                            wall[tempRow] = wall[tempRow - 1];
                        }
                        wall[0] = [null, null, null, null, null, null, null, null, null, null];
                        index++;
                    }
                }
                //返回得分
                switch (index) {
                    case 0: return 0;
                    case 1: return 200;
                    case 2: return 600;
                    case 3: return 1200;
                    case 4: return 2000;
                }
            }
        };
        //游戏结束?
        p.gameOver = function (currentCells) {
            for (var i in currentCells) {
                if (Tetris.Tetris.wall[currentCells[i].row][currentCells[i].col] !== null) {
                    return true;
                }
            }
            return false;
        };
        //显示区域问题硬编码生成
        p.randomTip = function () {
            var random = Math.round(Math.random() * 7);
            var tetromino;
            switch (random) {
                case 0:
                    var I = new Tetris.Tetromino();
                    I.cells = [new Tetris.Cell(5.5, 1, "I"), new Tetris.Cell(5.5, 2, "I"), new Tetris.Cell(5.5, 3, "I"), new Tetris.Cell(5.5, 4, "I")];
                    tetromino = I;
                    break;
                case 1:
                    var J = new Tetris.Tetromino();
                    J.cells = [new Tetris.Cell(6, 1.5, "J"), new Tetris.Cell(6, 2.5, "J"), new Tetris.Cell(6, 3.5, "J"), new Tetris.Cell(5, 3.5, "J")];
                    tetromino = J;
                    break;
                case 2:
                    var L = new Tetris.Tetromino();
                    L.cells = [new Tetris.Cell(5, 1, "L"), new Tetris.Cell(5, 2, "L"), new Tetris.Cell(5, 3, "L"), new Tetris.Cell(6, 3, "L")];
                    tetromino = L;
                    break;
                case 3:
                    var O = new Tetris.Tetromino();
                    O.cells = [new Tetris.Cell(5, 2, "O"), new Tetris.Cell(5, 3, "O"), new Tetris.Cell(6, 2, "O"), new Tetris.Cell(6, 3, "O")];
                    tetromino = O;
                    break;
                case 4:
                    var S = new Tetris.Tetromino();
                    S.cells = [new Tetris.Cell(6.5, 2, "S"), new Tetris.Cell(5.5, 2, "S"), new Tetris.Cell(5.5, 3, "S"), new Tetris.Cell(4.5, 3, "S")];
                    tetromino = S;
                    break;
                case 5:
                    var T = new Tetris.Tetromino();
                    T.cells = [new Tetris.Cell(4.5, 2, "T"), new Tetris.Cell(5.5, 2, "T"), new Tetris.Cell(6.5, 2, "T"), new Tetris.Cell(5.5, 3, "T")];
                    tetromino = T;
                    break;
                case 6:
                    var Z = new Tetris.Tetromino();
                    Z.cells = [new Tetris.Cell(4.5, 2, "Z"), new Tetris.Cell(5.5, 2, "Z"), new Tetris.Cell(5.5, 3, "Z"), new Tetris.Cell(6.5, 3, "Z")];
                    tetromino = Z;
                    break;
                default:
                    var I = new Tetris.Tetromino();
                    I.cells = [new Tetris.Cell(5.5, 1, "I"), new Tetris.Cell(5.5, 2, "I"), new Tetris.Cell(5.5, 3, "I"), new Tetris.Cell(5.5, 4, "I")];
                    tetromino = I;
                    break;
            }
            return tetromino;
        };
        return GameContainer;
    })(egret.DisplayObjectContainer);
    Tetris.GameContainer = GameContainer;
    egret.registerClass(GameContainer,'Tetris.GameContainer');
})(Tetris || (Tetris = {}));
//# sourceMappingURL=GameContainer.js.map