var GameMsgDef = require("GameMsgDef");

cc.Class({
    extends: require("BaseModuleMsg"),

    properties: {
        resPanelUrl:"prefabs/HistoryCode", // 预制体路径
        msgIdShowView:GameMsgDef.ID_SHOWHISTORYCODEVIEW_CTC, // 显示ID
    },

    messageDispatch:function(msg){
        
    },
});