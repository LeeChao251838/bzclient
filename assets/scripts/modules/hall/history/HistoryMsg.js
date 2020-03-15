var GameMsgDef = require("GameMsgDef");

cc.Class({
    extends: require("BaseModuleMsg"),

    properties: {
        resPanelUrl:"prefabs/History", // 预制体路径
        msgIdShowView:GameMsgDef.ID_SHOWHISTORYVIEW_CTC, // 显示ID
    },

    messageDispatch:function(msg){
        
    },
});