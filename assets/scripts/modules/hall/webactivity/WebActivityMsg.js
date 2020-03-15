var GameMsgDef = require("GameMsgDef");

cc.Class({
    extends: require("BaseModuleMsg"),

    properties: {
        resPanelUrl:"prefabs/WebActivity", // 预制体路径
        msgIdShowView:GameMsgDef.ID_SHOWACTIVITYVIEW_CTC, // 显示ID
        isPreload:false,

        
    },

    messageDispatch:function(msg){
        switch (msg.msgId) {
            case GameMsgDef.ID_LOADSCENEFINISH:    // 进入游戏场景
                // cc.fy.gameNetMgr.disPatchEvent(GameMsgDef.ID_GETWEBACTIVITYURL_CTC);
            break;
        }
    },
    
});