module Tetris {
	/**
	 *
	 * @author shadow.li
	 *
	 */
	export class Tetris {
        public number: number = 0;
        public stageW: number;//舞台宽
        public stageH: number;//舞台高
        public bg: egret.Bitmap;//背景
        public static wall: Cell[][];//方块墙
        public game: egret.Sprite;//游戏显示区域
        public tips: egret.Sprite;//下一个方块提示
        public score: egret.TextField;//得分
        public scoreNumer: egret.TextField;//分数
        public controlPanel: egret.Bitmap;//左右控制
        public controlButton: egret.Bitmap;//快速下落

        //背景音乐
        public bgsound1X: egret.Sound;
        public bgsound2X: egret.Sound;
        public bgsoundMax: egret.Sound;
        public gameOver: egret.Sound;
        public static currentTetromino: Tetromino;//当前方块
        
        public constructor(stageW:number,stageH:number) {
            this.stageW = stageW;
            this.stageH = stageH;
            this.init();
		}
	    //初始化
        public static initWall() { 
            Tetris.wall = [];
            for(var i = 0;i < 20;i++) {
                Tetris.wall.push([null,null,null,null,null,null,null,null,null,null]);
            }
        }
        private init(){
            Tetris.initWall();
            
            this.bg = Util.createBitmapByName("background");
            this.game = new egret.Sprite();
            this.game.x = 60;
            this.game.y = 99;
            this.game.width = Cell.width * Tetris.wall[0].length;
            this.game.height = Cell.height * Tetris.wall.length;
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
            this.scoreNumer.text = " "+this.number;
            this.scoreNumer.textColor = 0x777777;
            //虚拟十字按键
            this.controlPanel = Util.createBitmapByName("control");
            this.controlPanel.x = 20;
            this.controlPanel.y = 600;
            this.controlPanel.touchEnabled = true;
            this.controlPanel.addEventListener(egret.TouchEvent.TOUCH_TAP,function(evt: egret.TouchEvent): void {
                var baseWidth = this.controlPanel.width / 2;
                var baseHeight = this.controlPanel.height / 2;
                //坐标系 x,y
                var currentX = evt.localX - baseWidth;
                var currentY = baseHeight - evt.localY;
                switch(Util.calculatePoint(currentX,currentY)) { 
                    case 1: Tetris.currentTetromino.rotateRight(); break;
                    case 2: Tetris.currentTetromino.move(true); break;
                    case 3: Tetris.currentTetromino.OneStepDown(); break;
                    case 4: Tetris.currentTetromino.move(false); break;
                }
                //Tetris.currentTetromino.move(false);
            },this);
        
            this.controlButton  = Util.createBitmapByName("button");
            this.controlButton.x = 245 + this.controlButton.width / 2;
            this.controlButton.y = 600 + this.controlButton.height / 2;
            this.controlButton.anchorOffsetX = this.controlButton.width / 2;
            this.controlButton.anchorOffsetY = this.controlButton.height / 2;
            this.controlButton.touchEnabled = true;
            this.controlButton.addEventListener(egret.TouchEvent.TOUCH_TAP,function(evt: egret.TouchEvent): void {
                Tetris.currentTetromino.HardDropDown();
            },this);
            
            //加载需要使用的背景音乐
            this.bgsound1X = RES.getRes("bgsound1X");
            this.bgsound2X = RES.getRes("bgsound2X");
            this.bgsoundMax = RES.getRes("bgsound3X");
            this.gameOver = RES.getRes("gameover");
        }
	}
}
