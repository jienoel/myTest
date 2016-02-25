var Tetris;
(function (Tetris) {
    /**
     *
     * @author shadow.li
     * 格子
     */
    var Cell = (function (_super) {
        __extends(Cell, _super);
        function Cell(col, row, cellName) {
            _super.call(this);
            this.row = row;
            this.col = col;
            this.cellName = cellName;
            this.texture = RES.getRes(cellName);
            this.x = col * Cell.width;
            this.y = row * Cell.height;
        }
        var d = __define,c=Cell,p=c.prototype;
        /**
         * 左右移动: true:left || false:right
         */
        p.move = function (direction) {
            //左移动
            if (direction) {
                this.x = this.x - Cell.width;
                this.col--;
            }
            else {
                this.x = this.x + Cell.width;
                this.col++;
            }
            //右左移动
        };
        /**
         * 下落
         */
        p.down = function () {
            this.y = this.y + Cell.height;
            this.row++;
            return this.y;
        };
        Cell.width = 25;
        Cell.height = 25;
        return Cell;
    })(egret.Bitmap);
    Tetris.Cell = Cell;
    egret.registerClass(Cell,'Tetris.Cell');
})(Tetris || (Tetris = {}));
//# sourceMappingURL=Cell.js.map