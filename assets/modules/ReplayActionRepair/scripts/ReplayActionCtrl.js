import { networkInterfaces } from "os";

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        seats: [cc.Node],// 座位数组 0下 1右 2上 3左

    },

    // use this for initialization
    onLoad: function () {
        for (var i = 0; i < this.seats.length; i++) {
            this.seats[i].active = false;
        }

        if (cc.fy != null && cc.fy.replayMgr != null)
            cc.fy.replayMgr.replayAction = this;// 给脚本赋值

    },
    onEnable() {

    },

    // 处理动作数据 座位索引 可选动作组 最终动作
    setActionData: function (seatIndex, actions, finalActed) {
        console.log("setActionData--------------->>>>>>>分割");
        console.log("setActionData--------------->>>>>>>", seatIndex);
        console.log("setActionData--------------->>>>>>>", actions);
        console.log("setActionData--------------->>>>>>>", finalActed);
        // if (finalActed == 19) {
        //     return;
        // }
        if (actions == null || actions.length == 0) {
            console.log("setActionData--------------->>>>>>>");
            return;
        }
        this.hideAllAction();// 隐藏所有节点  
        var seatAction = this.seats[seatIndex].children[1];// 0是背景 1是动作组
        /**
         * 此处处理方法稍微笨重了点 ，主要用于隐藏当前显示动作节点 亮色节点和手指节点的组件
         */
        seatAction.children[0].children[1].active = false;
        seatAction.children[0].children[2].active = false;
        seatAction.children[1].children[1].active = false;
        seatAction.children[1].children[2].active = false;
        seatAction.children[2].children[1].active = false;
        seatAction.children[2].children[2].active = false;
        seatAction.children[3].children[1].active = false;
        seatAction.children[3].children[2].active = false;
        seatAction.children[4].children[1].active = false;
        seatAction.children[4].children[2].active = false;
        seatAction.children[5].children[1].active = false;
        seatAction.children[5].children[2].active = false;
        seatAction.children[6].children[1].active = false;
        seatAction.children[6].children[2].active = false;
        for (var i = 0; i < actions.length; i++) {
            if (actions[i] == 9) {
                // 吃
                seatAction.children[0].children[1].active = true;
                if (finalActed == 9) {// 如果最后执行的也是同样的那么就显示手指
                    seatAction.children[0].children[2].active = true;
                }
            } else if (actions[i] == 3) {
                // 碰
                seatAction.children[1].children[1].active = true;
                if (finalActed == 3) {// 如果最后执行的也是同样的那么就显示手指
                    seatAction.children[1].children[2].active = true;
                }
            } else if (actions[i] == 4) {
                // 杠
                seatAction.children[2].children[1].active = true;
                if (finalActed == 4) {// 如果最后执行的也是同样的那么就显示手指
                    seatAction.children[2].children[2].active = true;
                }
            } else if (actions[i] == 5 || actions[i] == 6) {
                // 胡
                seatAction.children[3].children[1].active = true;
                seatAction.children[6].children[1].active = true;
                if (finalActed == 5 || finalActed == 6) {// 如果最后执行的也是同样的那么就显示手指
                    seatAction.children[3].children[2].active = true;
                }
                if (finalActed == 19) {// 如果最后执行的也是同样的那么就显示手指
                    seatAction.children[6].children[2].active = true;
                }
            }
            else if (actions[i] == 11) {
                // 听
                seatAction.children[5].children[1].active = true;
                if (finalActed == 11) {// 如果最后执行的也是同样的那么就显示手指
                    seatAction.children[5].children[2].active = true;
                }
            } else if (actions[i] == 19) {
                // 加倍
                seatAction.children[3].children[1].active = true;
                seatAction.children[6].children[1].active = true;
                if (finalActed == 19) {// 如果最后执行的也是同样的那么就显示手指
                    seatAction.children[6].children[2].active = true;
                }
            }
            // 过 过是必现的所以不用判断
            seatAction.children[4].children[1].active = true;
            if (finalActed == 8) {// 如果最后执行的也是同样的那么就显示手指
                seatAction.children[4].children[2].active = true;
            }

        }

        this.seats[seatIndex].active = true;
    },

    // 隐藏所有节点
    hideAllAction: function () {
        for (var i = 0; i < this.seats.length; i++) {
            this.seats[i].active = false;
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

