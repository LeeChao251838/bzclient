var GameMsgDef = require("GameMsgDef");
cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        var game = cc.fy.gameNetMgr;
        // 指定消息转发的结点 需要切换场景才需要加这句，作为界面的组件不需要这句
        game.eventTarget = this.node;

        this.initView();
    },

    initView: function () {
        
    },

    onButtonClick: function (event) {
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");   
        var name = event.target.name;
        if (name == "btn_gps") {
            cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWGPSALERTVIEW_CTC, { isShow: true, isForce: true });
        }
    }
});
