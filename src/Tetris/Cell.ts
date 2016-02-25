module Tetris {
	/**
	 *
	 * @author shadow.li
	 * 格子
	 */
    export class Cell extends egret.Bitmap{
        public row:number;
        public col:number;
        public cellName: string;
        public static width = 25;
        public static height = 25;
        public constructor(col: number,row: number,cellName:string){
            super();
            this.row = row;
            this.col = col;
            this.cellName = cellName;
            this.texture = RES.getRes(cellName);
            this.x = col * Cell.width;
            this.y = row * Cell.height;
        }
        
        /**
         * 左右移动: true:left || false:right
         */ 
        public move(direction:Boolean) {
            //左移动
            if(direction) {
                this.x = this.x - Cell.width;
                this.col--;
            }
            else { 
                this.x = this.x + Cell.width;
                this.col++;
            }
            //右左移动
        }
        
        /**
         * 下落
         */ 
        public down():number { 
            this.y = this.y + Cell.height;
            this.row++;
            return this.y;
        }
    }
}
