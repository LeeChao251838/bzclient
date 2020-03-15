// import { PlayCardResultHint } from "../../../../modules/ddzgame/scripts/DDZPokerDef";

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
        dir: 1,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        // this.node.active = false
    },
    onEnable() {

    },
    PlayAni() {
        console.log('llllllllllllldd', this.dir)
        let act1 = cc.moveTo(0.5, 0, 0).clone()
        let act2 = cc.scaleTo(0.3, 3, 3).clone()
        let act3 = cc.delayTime(1.5).clone()
        let act4 = cc.scaleTo(0.2, 0, 0).clone()
        let act5 = cc.callFunc(function () { this.node.active = false }, this).clone()
        if (this.dir == 1) {
            //从左往右
            this.node.x = -1000
            this.node.y = 0
            this.node.runAction(cc.sequence(act1, act2, act3, act4).clone())
        } else if (this.dir == 2) {
            //从下往上
            this.node.y = -1000
            this.node.x = 0
            this.node.runAction(cc.sequence(act1, act2, act3, act4).clone())
        } else {

        }
    },
    // update (dt) {},
});
