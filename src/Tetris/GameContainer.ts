module Tetris {
	/**
	 *
	 * @author 
	 *
	 */
	export class GameContainer extends egret.DisplayObjectContainer{
        private loadingView: LoadingUI;
        private tips: Tetromino;
        private nextTetromino: Tetromino;
        public constructor() {
            super();
            this.addEventListener(egret.Event.ADDED_TO_STAGE,this.onAddToStage,this);
            Util.showLog("主方法实例化开始 constructor");
        }

        private onAddToStage(event: egret.Event) {
            //设置加载进度界面
            //Config to load process interface
            this.loadingView = new LoadingUI();
            this.stage.addChild(this.loadingView);
            Util.showLog("设置加载进度界面 onAddToStage");
            //初始化Resource资源加载库
            //initiate Resource loading library
            RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE,this.onConfigComplete,this);
            RES.loadConfig("resource/default.res.json","resource/");
            Util.showLog("加载配置文件");
        }

        /**
         * 配置文件加载完成,开始预加载preload资源组。
         * configuration file loading is completed, start to pre-load the preload resource group
         */
        private onConfigComplete(event: RES.ResourceEvent): void {
            RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE,this.onConfigComplete,this);
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this);
            RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR,this.onResourceLoadError,this);
            RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS,this.onResourceProgress,this);
            RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR,this.onItemLoadError,this);
            Util.showLog("配置文件加载结束");
            RES.loadGroup("preload");
            RES.loadGroup("load");
            Util.showLog("加载资源组");
        }

        /**
         * preload资源组加载完成
         * Preload resource group is loaded
         */
        private onResourceLoadComplete(event: RES.ResourceEvent): void {
            //去掉perload判断,保证所有资源加载完成,防止移动段(比如IOS)声音不播放的问题
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR,this.onResourceLoadError,this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS,this.onResourceProgress,this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR,this.onItemLoadError,this);
            Util.showLog(event.groupName+":资源组加载完成");
            this.ready();
        }

        /**
         * 资源组加载出错
         *  The resource group loading failed
         */
        private onItemLoadError(event: RES.ResourceEvent): void {
            console.warn("Url:" + event.resItem.url + " has failed to load");
        }

        /**
         * 资源组加载出错
         *  The resource group loading failed
         */
        private onResourceLoadError(event: RES.ResourceEvent): void {
            console.warn("Group:" + event.groupName + " has failed to load");
            //忽略加载失败的项目
            //Ignore the loading failed projects
            this.onResourceLoadComplete(event);
        }

        /**
         * preload资源组加载进度
         * Loading process of preload resource group
         */
        private onResourceProgress(event: RES.ResourceEvent): void {
            if(event.groupName == "preload") { 
                this.loadingView.setProgress(event.itemsLoaded,event.itemsTotal);
                Util.showLog("预加载资源:" + event.resItem.name);
            }
            
        }
        /**
         * 初始化界面
         */
        private ready(): void {
            //背景界面
            var loadbg: egret.Bitmap = Util.createBitmapByName("loadbg");
            this.addChild(loadbg);
            //生成准备界面
            var ready: egret.TextField = new egret.TextField();
            ready.text = "开始游戏";
            ready.size = 66;
            ready.textColor = 0x777777;
            ready.x = this.stage.stageWidth / 2 - ready.width / 2;
            ready.y = this.stage.stageHeight / 2 - ready.height / 2;
            ready.touchEnabled = true;
            var self = this;
            //开始游戏按键
            ready.addEventListener(egret.TouchEvent.TOUCH_TAP,readyTouch,this);
            function readyTouch(): void {
                self.removeChild(ready);
                self.removeChild(loadbg);
                ready.removeEventListener(egret.TouchEvent.TOUCH_TAP,readyTouch,this);
                self.createGameScene();
            }
            ready.removeEventListener(egret.TouchEvent.TOUCH_END,readyTouch,this);
            this.addChild(ready);
        }

        /**
         * 开始游戏
         */
        private createGameScene(): void {
            var self = this;
            var tips = this.tips;
            Util.showLog("游戏开始");
            //实例化对象
            var tetris: Tetris.Tetris = new Tetris(this.stage.stageWidth,this.stage.stageHeight);
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
            drawTips(tips.cells,true);
            createNew();
            
            //新建方块
            function createNew():void {
                
                var nextTetromino = Tetromino.randomCell(tips.cells[0].cellName);//根据tips生成方块
                var currentObj = Tetris.currentTetromino = nextTetromino;//获取下一个方块
                
                drawTips(tips.cells,false)//删除当前tips
                tips = self.randomTip();//更新tips
                drawTips(tips.cells,true);//添加新tips
                var currentCells = currentObj.cells;//获取内部数组对象
                
                //判断游戏是否结束
                if(self.gameOver(currentCells)) { 
                    Util.showLog("游戏结束");
                    //关闭定时器                    
                    egret.clearInterval(step);
                    //关闭音乐
                    chanel.stop();
                    //给出提示
                    var gameover: egret.TextField = new egret.TextField();
                    gameover.text = "游戏结束! 您的得分为:" + tetris.number;
                    gameover.x = tetris.stageW / 2 - gameover.width / 2;
                    gameover.y = tetris.stageH / 2 - gameover.height / 2;
                    gameover.textColor = 0x777777;
                    gameover.touchEnabled = true;
                    //绑定事件点击重新开始
                    gameover.addEventListener(egret.TouchEvent.TOUCH_TAP,function() {
                        self.removeChildren();
                        self.createGameScene();
                    },this);
                    self.addChild(gameover);
                    return;
                }
                
                drawTetromino(currentCells,true);//绘制方块
                //
                var timestamp: number = 800;
                if(tetris.number >= 200000) {
                    timestamp = 200;
                    chanel.stop;
                    chanel = tetris.bgsoundMax.play();
                } else if(tetris.number >= 100000) {
                    timestamp = 400;
                    chanel.stop;
                    chanel = tetris.bgsound2X.play();
                } else if(tetris.number >= 50000){ 
                    timestamp = 600;
                }
                
                //开启定时器执行单步下落
                var step = egret.setInterval(function() {
                    var canDown: Boolean = currentObj.OneStepDown();//获取返回值,可以下落为true,否则为false
                    if(!canDown) { 
                        egret.clearInterval(step);//关闭定时器
                        Tetromino.putToWall(currentCells);//把方块"打进数组"
                        drawTetromino(currentCells,false);
                        tetris.number += drawWall();
                        tetris.scoreNumer.text = " " + tetris.number;
                        createNew();//新建一个
                    }
                },0,timestamp);
                
            }
            
            //绘制方块,或者消去方块
            function drawTetromino(cells: Cell[],isDraw:Boolean): void {
                if(isDraw) {
                    for(var i = 0;i < cells.length;i++) {
                        tetris.game.addChild(cells[i]);
                    }
                } else { 
                    for(var i = 0;i < cells.length;i++) {
                        tetris.game.removeChild(cells[i]);
                    }
                }
            }
            
            //绘制提示区域
            function drawTips(cells: Cell[],isDraw: Boolean){ 
                if(isDraw) {
                    for(var i = 0;i < cells.length;i++) {
                        cells[i].x -= Cell.width * 4;
                        tetris.tips.addChild(cells[i]);
                    }
                } else {
                    for(var i = 0;i < cells.length;i++) {
                        tetris.tips.removeChild(cells[i]);
                    }
                }
            }
            
            //画墙计算得分 
            function drawWall(){
                var wall = Tetris.wall;
                var index = 0;//倍数
                for(var row in wall){ 
                    var fullLine = true;//当前行是否满
                    for(var col in wall[row]){ 
                        if(wall[row][col] !== null) {
                            tetris.game.addChild(wall[row][col]);
                        } else { 
                            fullLine = false;
                        }
                    }
                    //上一层往下移动
                    if(fullLine){
                        //清除显示
                        for(var tempCol = 0;tempCol < wall[row].length;tempCol++) { 
                            if(wall[row][tempCol].parent);
                            wall[row][tempCol].parent.removeChild(wall[row][tempCol]);
                        }
                        //当前行的每上一层下移,行内格子同步更新
                        for(var tempRow = row;tempRow > 0;tempRow--) {
                            for(var k = 0;k < wall[tempRow].length;k++) {
                                if(wall[tempRow - 1][k] !== null)
                                    wall[tempRow - 1][k].y += Cell.height;
                            }
                            //先显示墙下移,然后操作墙数组
                            wall[tempRow] = wall[tempRow - 1];
                        }
                        wall[0] = [null,null,null,null,null,null,null,null,null,null];
                        index++;
                    }                    
                }
                //返回得分
                switch(index) { 
                    case 0: return 0;
                    case 1: return 200;
                    case 2: return 600;
                    case 3: return 1200;
                    case 4: return 2000;
                }
            }
        }
        //游戏结束?
        private gameOver(currentCells: Cell[]): Boolean {
        for(var i in currentCells) {
            if(Tetris.wall[currentCells[i].row][currentCells[i].col] !== null) {
                return true;
            }
        }
        return false;
    }
        
        //显示区域问题硬编码生成
        private randomTip():Tetromino{
            var random: number = Math.round(Math.random() * 7);
            var tetromino: Tetromino;
            switch(random) {
                case 0: var I = new Tetromino(); 
                        I.cells = [new Cell(5.5,1,"I"),new Cell(5.5,2,"I"),new Cell(5.5,3,"I"),new Cell(5.5,4,"I")];
                        tetromino = I;
                        break;
                case 1: var J = new Tetromino();
                        J.cells = [new Cell(6,1.5,"J"),new Cell(6,2.5,"J"),new Cell(6,3.5,"J"),new Cell(5,3.5,"J")];
                        tetromino = J;
                        break;
                case 2: var L = new Tetromino();
                        L.cells = [new Cell(5,1,"L"),new Cell(5,2,"L"),new Cell(5,3,"L"),new Cell(6,3,"L")];
                        tetromino = L;
                        break;
                case 3: var O = new Tetromino();
                        O.cells = [new Cell(5,2,"O"),new Cell(5,3,"O"),new Cell(6,2,"O"),new Cell(6,3,"O")];
                        tetromino = O;
                        break;
                case 4: var S = new Tetromino();
                        S.cells = [new Cell(6.5,2,"S"),new Cell(5.5,2,"S"),new Cell(5.5,3,"S"),new Cell(4.5,3,"S")];
                        tetromino = S;
                        break;
                case 5: var T = new Tetromino();
                        T.cells = [new Cell(4.5,2,"T"),new Cell(5.5,2,"T"),new Cell(6.5,2,"T"),new Cell(5.5,3,"T")];
                        tetromino = T;
                        break;
                case 6: var Z = new Tetromino();
                        Z.cells = [new Cell(4.5,2,"Z"),new Cell(5.5,2,"Z"),new Cell(5.5,3,"Z"),new Cell(6.5,3,"Z")];
                        tetromino = Z;
                        break;
                default: var I = new Tetromino();
                        I.cells = [new Cell(5.5,1,"I"),new Cell(5.5,2,"I"),new Cell(5.5,3,"I"),new Cell(5.5,4,"I")];
                        tetromino = I;
                        break;
            }
            return tetromino;
        }
	}
	
}
