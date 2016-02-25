var Util;
(function (Util) {
    /**
     *
     * @author shadow.li
     * @constant 根据名称新建bitmap
     *
     */
    function createBitmapByName(name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
    Util.createBitmapByName = createBitmapByName;
    /**
     * 播放音乐
     * @author shadow.li
     * @sound sound 对象
     * @start 开始位置
     * @loop  循环次数 -1为无限
     */
    function playSound(sound, start, loop) {
        return sound.play(start, loop);
    }
    Util.playSound = playSound;
    /**
     * 输出日志
     * @author shadow.li
     */
    function showLog(msg) {
        if (DEBUG) {
            egret.log(msg);
        }
    }
    Util.showLog = showLog;
    /**
     * @废弃 通过叉乘法判定坐标点处于虚拟按键的哪一个区域
     * @按照 坐标点判断
     * @pointX 用户点击坐标X
     * @pointY 用户点击坐标Y
     * @return 返回1，2，3，4对应上左下右
     */
    function calculatePoint(pointX, pointY) {
        //两点的x、y值
        var x = pointX - 0;
        var y = pointY - 0;
        var hypotenuse = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
        //斜边长度
        var cos = x / hypotenuse;
        var radian = Math.acos(cos);
        //求出弧度
        var angle = 180 / (Math.PI / radian);
        //用弧度算出角度       
        if (y < 0) {
            angle = -angle;
        }
        else if ((y == 0) && (x < 0)) {
            angle = 180;
        }
        console.log(angle);
        if (angle >= -135 && angle <= -45) {
            return 3;
        }
        else if (angle > -45 && angle <= 45) {
            return 4;
        }
        else if (angle > 45 && angle <= 135) {
            return 1;
        }
        else
            return 2;
    }
    Util.calculatePoint = calculatePoint;
})(Util || (Util = {}));
//# sourceMappingURL=Util.js.map