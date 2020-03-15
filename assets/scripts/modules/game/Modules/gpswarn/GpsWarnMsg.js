var GameMsgDef = require("GameMsgDef");
var ConstsDef = require('ConstsDef');

cc.Class({
    extends: require("BaseModuleMsg"),

    properties: {
        ///////////////////////
        resPanelUrl:"prefabs/gpsWarn", // 预制体路径
        msgIdShowView:GameMsgDef.ID_SHOWGPSWARNVIEW_CTC, // 显示ID
        isPreload:false, // 是否需要预加载，ps:常用组件需要预加载加快显示
        limitScene:ConstsDef.SCENE_NAME.GAME, // 限制场景，指定模块的场景，null是不限制 如:limitScene:ConstsDef.SCENE_NAME.GAME 游戏场景模块
        ///////////////////////

    },

    // 初始化数据函数
    init:function() {

    },
    
    // 消息分发函数
    messageDispatch:function(msg){
        switch (msg.msgId) {
            case GameMsgDef.ID_LOADSCENEFINISH: // 进入游戏场景
                if(cc.fy.sceneMgr.isGameScene()){
                    this.initGPS();
                }
            break;
        }
    },
    initGPS:function(){
        if(cc.fy.sceneMgr.isPDKGameScene()){
            return;
        }
        var self = this;
        var eventTarget = cc.fy.gameNetMgr.eventTarget;
        //房间显示距离按钮
        var btnGps = eventTarget.getChildByName("btn_gps");
        if(cc.fy.gameNetMgr.seats.length <= 2){
            btnGps.active = false;
        }
        else{
            btnGps.active = true;
        }
    }
});