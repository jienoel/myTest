module Util {
	/**
	 *
	 * @author shadow.li
	 * @constant 根据名称新建bitmap
	 *
	 */
    export function createBitmapByName(name: string): egret.Bitmap {
        var result: egret.Bitmap = new egret.Bitmap();
        var texture: egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }
    

    /**
     * 播放音乐 
     * @author shadow.li
     * @sound sound 对象
     * @start 开始位置 
     * @loop  循环次数 -1为无限
     */
    export function playSound(sound:egret.Sound,start:number,loop:number):egret.SoundChannel{
        return sound.play(start,loop);
    }
    
    /**
     * 输出日志
     * @author shadow.li
     */ 
    export function showLog(msg:any):void{ 
        if(DEBUG) {
            egret.log(msg);
        }
    }
    
    /**
     * @废弃 通过叉乘法判定坐标点处于虚拟按键的哪一个区域
     * @按照 坐标点判断
     * @pointX 用户点击坐标X
     * @pointY 用户点击坐标Y
     * @return 返回1，2，3，4对应上左下右
     */ 
    export function calculatePoint(pointX:number,pointY:number):number{
        //两点的x、y值
        var x:number = pointX-0;
        var y:number= pointY-0;
        var hypotenuse: number = Math.sqrt(Math.pow(x, 2)+Math.pow(y, 2));
        //斜边长度
        var cos: number = x/hypotenuse;
        var radian: number = Math.acos(cos);
        //求出弧度
        var angle:number = 180/(Math.PI/radian);
        //用弧度算出角度       
        if (y<0) {
                angle = -angle;
        } else if ((y == 0) && (x<0)) {
                angle = 180;
        }
        console.log(angle);
        if(angle >= -135 && angle <= -45) {
            return 3;
        } else if(angle > -45 && angle <= 45) {
            return 4;
        } else if(angle > 45 && angle <= 135) {
            return 1;
        } else 
            return 2;
        }
}