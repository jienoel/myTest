var Tetris;
(function (Tetris) {
    /**
     *
     * @author shaodw.li
     * 方块基础类
     */
    var Tetromino = (function (_super) {
        __extends(Tetromino, _super);
        function Tetromino() {
            _super.call(this);
            this.index = 1;
        }
        var d = __define,c=Tetromino,p=c.prototype;
        /**
         * 旋转,变形
         */
        p.rotateRight = function () {
            //取得变换的下个数据状态 states[n] 
            //取得当前轴的 row, col
            //旋转以后的数据=(row,col) + states[n] 
            var tetromino = this.cells; //当前方块
            var s = this.states[this.index % this.states.length]; //旋转状态
            var state = [s.col0, s.row0, s.col1, s.row1, s.col2, s.row2, s.col3, s.row3]; //转换成数组方便操作
            var basePoint = this.cells[0];
            //检查是否可以变形
            if (canRotate()) {
                //显示变形调整墙内坐标
                for (var i = 0; i < tetromino.length; i++) {
                    tetromino[i].x = basePoint.x + state[i * 2 + 1] * 25;
                    tetromino[i].y = basePoint.y + state[i * 2] * 25;
                    tetromino[i].col = basePoint.col + state[i * 2 + 1];
                    tetromino[i].row = basePoint.row + state[i * 2];
                }
                this.index++;
            }
            function canRotate() {
                for (var i = 0; i < tetromino.length; i++) {
                    var col = basePoint.col + state[i * 2 + 1];
                    var row = basePoint.row + state[i * 2];
                    if (col < 0 || col > Tetris.Tetris.wall[0].length - 1 || row < 0 || row >= Tetris.Tetris.wall.length - 1 || Tetris.Tetris.wall[row][col] !== null) {
                        return false;
                    }
                }
                return true;
            }
        };
        /**
         * 单步下落
         */
        p.OneStepDown = function () {
            var canDown = true;
            //判断每个格子是否可以下落
            for (var i in this.cells) {
                var next = this.cells[i].y + Tetris.Cell.height;
                var row = this.cells[i].row;
                var col = this.cells[i].col;
                //是否触底或者下一个墙内有格子
                if (row == Tetris.Tetris.wall.length - 1) {
                    canDown = false;
                    break;
                }
                if (Tetris.Tetris.wall[row + 1][col] !== null) {
                    canDown = false;
                    break;
                }
            }
            //通过检测后下落
            if (canDown) {
                for (var i in this.cells) {
                    this.cells[i].down();
                }
            }
            return canDown;
        };
        p.HardDropDown = function () {
            while (this.OneStepDown())
                ;
        };
        /**
         * 方块移动方法
         * @direction true:left || false:right
         */
        p.move = function (direction) {
            var canMove = true; //标记
            var position = direction == true ? -Tetris.Cell.height : Tetris.Cell.height;
            //判断每个格子是否都可以移动
            for (var i in this.cells) {
                var next;
                next = this.cells[i].x + position;
                if (direction) {
                    canMove = next < 0 || Tetris.Tetris.wall[this.cells[i].row][this.cells[i].col - 1] !== null ? false : true;
                    if (canMove == false) {
                        break;
                    }
                }
                else {
                    canMove = next >= 250 || Tetris.Tetris.wall[this.cells[i].row][this.cells[i].col + 1] !== null ? false : true;
                    if (canMove == false) {
                        break;
                    }
                }
            }
            //通过检验则移动
            if (canMove) {
                for (var i in this.cells) {
                    this.cells[i].move(direction);
                }
            }
            return canMove;
        };
        /**
         * 生成随机方块,返回实体方块
         */
        Tetromino.randomCell = function (name) {
            var cellName = ["I", "J", "L", "O", "S", "T", "Z"];
            var random;
            if (name) {
                for (var i = 0; i < cellName.length; i++) {
                    if (cellName[i] == name) {
                        random = i;
                        break;
                    }
                }
            }
            else {
                random = Math.round(Math.random() * 8);
            }
            var tetromino;
            switch (random) {
                case 0:
                    tetromino = new I();
                    break;
                case 1:
                    tetromino = new J();
                    break;
                case 2:
                    tetromino = new L();
                    break;
                case 3:
                    tetromino = new O();
                    break;
                case 4:
                    tetromino = new S();
                    break;
                case 5:
                    tetromino = new T();
                    break;
                case 6:
                    tetromino = new Z();
                    break;
                default:
                    tetromino = new I();
                    break;
            }
            return tetromino;
        };
        /**
         * 方块"打进"墙
         */
        Tetromino.putToWall = function (tetromino) {
            for (var i in tetromino) {
                tetromino[i].texture = RES.getRes("wall");
                Tetris.Tetris.wall[tetromino[i].y / Tetris.Cell.height][tetromino[i].x / Tetris.Cell.width] = tetromino[i];
            }
        };
        return Tetromino;
    })(egret.DisplayObject);
    Tetris.Tetromino = Tetromino;
    egret.registerClass(Tetromino,'Tetris.Tetromino');
    /**
     * 旋转状态类
     */
    var State = (function () {
        function State(row0, col0, row1, col1, row2, col2, row3, col3) {
            this.row0 = row0;
            this.col0 = col0;
            this.row1 = row1;
            this.col1 = col1;
            this.row2 = row2;
            this.col2 = col2;
            this.row3 = row3;
            this.col3 = col3;
        }
        var d = __define,c=State,p=c.prototype;
        return State;
    })();
    Tetris.State = State;
    egret.registerClass(State,'Tetris.State');
    //J方块
    var J = (function (_super) {
        __extends(J, _super);
        function J() {
            _super.call(this);
            this.cells = [new Tetris.Cell(4, 0, "J"), new Tetris.Cell(3, 0, "J"), new Tetris.Cell(5, 0, "J"), new Tetris.Cell(5, 1, "J")];
            this.states = [new State(0, 0, 0, 1, 0, -1, -1, 1),
                new State(0, 0, 1, 0, -1, 0, 1, 1),
                new State(0, 0, 0, -1, 0, 1, 1, -1),
                new State(0, 0, -1, 0, 1, 0, -1, -1)];
        }
        var d = __define,c=J,p=c.prototype;
        return J;
    })(Tetromino);
    Tetris.J = J;
    egret.registerClass(J,'Tetris.J');
    //I方块
    var I = (function (_super) {
        __extends(I, _super);
        function I() {
            _super.call(this);
            this.cells = [new Tetris.Cell(4, 0, "I"), new Tetris.Cell(3, 0, "I"), new Tetris.Cell(5, 0, "I"), new Tetris.Cell(6, 0, "I")];
            this.states = [new State(0, 0, 0, -1, 0, 1, 0, 2),
                new State(0, 0, -1, 0, 1, 0, 2, 0)];
        }
        var d = __define,c=I,p=c.prototype;
        return I;
    })(Tetromino);
    Tetris.I = I;
    egret.registerClass(I,'Tetris.I');
    //L方块
    var L = (function (_super) {
        __extends(L, _super);
        function L() {
            _super.call(this);
            this.cells = [new Tetris.Cell(4, 0, "L"), new Tetris.Cell(3, 0, "L"), new Tetris.Cell(5, 0, "L"), new Tetris.Cell(3, 1, "L")];
            this.states = [new State(0, 0, 0, 1, 0, -1, -1, -1),
                new State(0, 0, 1, 0, -1, 0, -1, 1),
                new State(0, 0, 0, -1, 0, 1, 1, 1),
                new State(0, 0, -1, 0, 1, 0, 1, -1)];
        }
        var d = __define,c=L,p=c.prototype;
        return L;
    })(Tetromino);
    Tetris.L = L;
    egret.registerClass(L,'Tetris.L');
    //O方块
    var O = (function (_super) {
        __extends(O, _super);
        function O() {
            _super.call(this);
            this.cells = [new Tetris.Cell(4, 0, "O"), new Tetris.Cell(5, 0, "O"), new Tetris.Cell(4, 1, "O"), new Tetris.Cell(5, 1, "O")];
            this.states = [new State(0, 0, 0, 1, 1, 0, 1, 1),
                new State(0, 0, 0, 1, 1, 0, 1, 1)];
        }
        var d = __define,c=O,p=c.prototype;
        return O;
    })(Tetromino);
    Tetris.O = O;
    egret.registerClass(O,'Tetris.O');
    //S方块
    var S = (function (_super) {
        __extends(S, _super);
        function S() {
            _super.call(this);
            this.cells = [new Tetris.Cell(4, 0, "S"), new Tetris.Cell(5, 0, "S"), new Tetris.Cell(3, 1, "S"), new Tetris.Cell(4, 1, "S")];
            this.states = [new State(0, 0, -1, -1, -1, 0, 0, 1),
                new State(0, 0, -1, 1, 0, 1, 1, 0)];
        }
        var d = __define,c=S,p=c.prototype;
        return S;
    })(Tetromino);
    Tetris.S = S;
    egret.registerClass(S,'Tetris.S');
    //T方块
    var T = (function (_super) {
        __extends(T, _super);
        function T() {
            _super.call(this);
            this.cells = [new Tetris.Cell(4, 0, "T"), new Tetris.Cell(3, 0, "T"), new Tetris.Cell(5, 0, "T"), new Tetris.Cell(4, 1, "T")];
            this.states = [new State(0, 0, 0, 1, -1, 0, 1, 0),
                new State(0, 0, 0, 1, 1, 0, 0, -1),
                new State(0, 0, -1, 0, 0, -1, 1, 0),
                new State(0, 0, 0, 1, -1, 0, 0, -1)];
        }
        var d = __define,c=T,p=c.prototype;
        return T;
    })(Tetromino);
    Tetris.T = T;
    egret.registerClass(T,'Tetris.T');
    //Z方块
    var Z = (function (_super) {
        __extends(Z, _super);
        function Z() {
            _super.call(this);
            this.cells = [new Tetris.Cell(4, 1, "Z"), new Tetris.Cell(3, 0, "Z"), new Tetris.Cell(4, 0, "Z"), new Tetris.Cell(5, 1, "Z")];
            this.states = [new State(0, 0, 0, 1, 1, -1, 1, 0),
                new State(0, 0, -1, 0, 1, 1, 0, 1)];
        }
        var d = __define,c=Z,p=c.prototype;
        return Z;
    })(Tetromino);
    Tetris.Z = Z;
    egret.registerClass(Z,'Tetris.Z');
})(Tetris || (Tetris = {}));
//# sourceMappingURL=Tetromino.js.map