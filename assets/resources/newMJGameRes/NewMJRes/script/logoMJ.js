// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
       frame:[cc.SpriteFrame]
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    getSpriteFrame(id){

        if(id == 23){
            return this.frame[6]
        }
     
        let index = id
        if(id == 8){
            index = 5
        }
        if(id == 9){
            index = 6
        }
        if(id == 5 || id == 6 || id == 7){
            return
        }
        return this.frame[index]
    }
    // update (dt) {},
});
