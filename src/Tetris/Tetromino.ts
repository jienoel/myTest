module Tetris {
	/**
	 *
	 * @author shaodw.li
	 * 方块基础类
	 */
    export class Tetromino extends egret.DisplayObject{
        public cells: Tetris.Cell[];//初始位置
        protected states: Tetris.State[];//旋转状态
        protected index: number = 1;
        
        public constructor(){
            super();
        }
        
        
        /**
         * 旋转,变形
         */ 
        public rotateRight(): void {
            //取得变换的下个数据状态 states[n] 
            //取得当前轴的 row, col
            //旋转以后的数据=(row,col) + states[n] 
            var tetromino:Cell[] = this.cells;//当前方块
            var s: Tetris.State = this.states[this.index % this.states.length];//旋转状态
            var state: number[] = [s.col0,s.row0,s.col1,s.row1,s.col2,s.row2,s.col3,s.row3];//转换成数组方便操作
            var basePoint: Cell = this.cells[0];
            //检查是否可以变形
            if(canRotate()) { 
                //显示变形调整墙内坐标
                for(var i = 0;i < tetromino.length;i++){ 
                    tetromino[i].x = basePoint.x + state[i*2 + 1]*25;
                    tetromino[i].y = basePoint.y + state[i*2]*25;
                    tetromino[i].col = basePoint.col + state[i*2 + 1];
                    tetromino[i].row = basePoint.row + state[i*2];
                }
                this.index++;
            }
            
            function canRotate(): Boolean { 
                for(var i = 0;i < tetromino.length;i++) {
                    var col = basePoint.col + state[i * 2 + 1];
                    var row = basePoint.row + state[i * 2];
                    if(col < 0 || col > Tetris.wall[0].length - 1 || row < 0 || row >= Tetris.wall.length-1 || Tetris.wall[row][col] !== null){
                        return false;
                    }
                }
                return true;
            }
        }
        
        
        /**
         * 单步下落
         */ 
        public OneStepDown(): Boolean {
            var canDown: Boolean = true;
            //判断每个格子是否可以下落
            for(var i in this.cells) {
                var next: number = this.cells[i].y + Cell.height;
                var row = this.cells[i].row;
                var col = this.cells[i].col;
                //是否触底或者下一个墙内有格子
                if(row == Tetris.wall.length -1) {
                    canDown=false;
                    break;
                }
                if(Tetris.wall[row + 1][col] !== null){ 
                    canDown = false;
                    break;
                }
            }
            //通过检测后下落
            if(canDown) { 
                for(var i in this.cells) { 
                    this.cells[i].down();
                }
            }
            return canDown;
        }
        
        public HardDropDown():void {
            while(this.OneStepDown());
        }
        
        
        /**
         * 方块移动方法
         * @direction true:left || false:right
         */ 
        public move(direction:Boolean): Boolean { 
            var canMove: Boolean = true;//标记
            var position: number = direction == true ? -Cell.height : Cell.height;
            //判断每个格子是否都可以移动
            for(var i in this.cells) {
                var next: number;
                next = this.cells[i].x + position;
                if(direction) {
                    canMove = next < 0 || Tetris.wall[this.cells[i].row][this.cells[i].col-1] !==null ? false : true;
                    if(canMove == false) { break}
                } else { 
                    canMove = next >= 250 || Tetris.wall[this.cells[i].row][this.cells[i].col + 1] !== null? false : true;
                    if(canMove == false) { break }
                }
            }
            //通过检验则移动
            if(canMove){ 
                for(var i in this.cells) {
                    this.cells[i].move(direction);
                }
            }
            return canMove;
        }
        
        /**
         * 生成随机方块,返回实体方块
         */ 
        public static randomCell(name?:string): Tetromino {
        var cellName: string[] = ["I","J","L","O","S","T","Z"];
        var random: number;
        if(name) {
            for(var i = 0;i < cellName.length;i++) {
                if(cellName[i] == name) { 
                    random = i;
                    break;
                    }
                }
        } else { 
            random = Math.round(Math.random() * 8);
        }
        
        var tetromino: Tetromino;
        switch(random) {
            case 0: tetromino = new I(); break;
            case 1: tetromino = new J(); break;
            case 2: tetromino = new L(); break;
            case 3: tetromino = new O(); break;
            case 4: tetromino = new S(); break;
            case 5: tetromino = new T(); break;
            case 6: tetromino = new Z(); break;
            default: tetromino = new I(); break;
        }
        return tetromino;
        } 
        
        /**
         * 方块"打进"墙
         */ 
        public static putToWall(tetromino:Cell[]):void{
            for(var i in tetromino){ 
                tetromino[i].texture = RES.getRes("wall");
                Tetris.wall[tetromino[i].y / Cell.height][tetromino[i].x / Cell.width] = tetromino[i];
            }
        }
    }
    /**
     * 旋转状态类
     */ 
    export class State {
        public row0; col0; row1; col1; row2; col2; row3; col3;
        public constructor(row0:number,col0:number,row1:number,col1:number,row2:number,col2:number,row3:number,col3:number) { 
            this.row0 = row0; this.col0 = col0;
            this.row1 = row1; this.col1 = col1;
            this.row2 = row2; this.col2 = col2;
            this.row3 = row3; this.col3 = col3;
        }
    }
    //J方块
    export class J extends Tetromino{
        public constructor() { 
            super();
            this.cells = [new Cell(4,0,"J"),new Cell(3,0,"J"),new Cell(5,0,"J"),new Cell(5,1,"J")];
            this.states = [new State(0,0,0,1,0,-1,-1,1),
                           new State(0,0,1,0,-1,0,1,1),
                           new State(0,0,0,-1,0,1,1,-1),
                           new State(0,0,-1,0,1,0,-1,-1)];
        }
    }
    //I方块
    export class I extends Tetromino {
        public constructor() {
            super();
            this.cells = [new Cell(4,0,"I"),new Cell(3,0,"I"),new Cell(5,0,"I"),new Cell(6,0,"I")];
            this.states = [new State(0,0,0,-1,0,1,0,2),
                           new State(0,0,-1,0,1,0,2,0)];
        }
    }
    //L方块
    export class L extends Tetromino {
        public constructor() {
            super();
            this.cells = [new Cell(4,0,"L"),new Cell(3,0,"L"),new Cell(5,0,"L"),new Cell(3,1,"L")];
            this.states = [new State(0,0,0,1,0,-1,-1,-1),
                            new State(0,0,1,0,-1,0,-1,1),
                            new State(0,0,0,-1,0,1,1,1),
                            new State(0,0,-1,0,1,0,1,-1)];
        }
    }
    //O方块
    export class O extends Tetromino {
        public constructor() {
            super();
            this.cells = [new Cell(4,0,"O"),new Cell(5,0,"O"),new Cell(4,1,"O"),new Cell(5,1,"O")];
            this.states = [new State(0,0,0,1,1,0,1,1),
                           new State(0,0,0,1,1,0,1,1)];
        }
    }
    //S方块
    export class S extends Tetromino {
        public constructor() {
            super();
            this.cells = [new Cell(4,0,"S"),new Cell(5,0,"S"),new Cell(3,1,"S"),new Cell(4,1,"S")];
            this.states = [new State(0,0,-1,-1,-1,0,0,1),
                new State(0,0,-1,1,0,1,1,0)];
        }
    }
    //T方块
    export class T extends Tetromino {
        public constructor() {
            super();
            this.cells = [new Cell(4,0,"T"),new Cell(3,0,"T"),new Cell(5,0,"T"),new Cell(4,1,"T")];
            this.states = [new State(0,0,0,1,-1,0,1,0),
                           new State(0,0,0,1,1,0,0,-1),
                           new State(0,0,-1,0,0,-1,1,0),
                           new State(0,0,0,1,-1,0,0,-1)];
        }
    }
    //Z方块
    export class Z extends Tetromino {
        public constructor() {
            super();
            this.cells = [new Cell(4,1,"Z"),new Cell(3,0,"Z"),new Cell(4,0,"Z"),new Cell(5,1,"Z")];
            this.states = [new State(0,0,0,1,1,-1,1,0),
                new State(0,0,-1,0,1,1,0,1)];
        }
    }
}
