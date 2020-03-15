var GameMsgDef = require("GameMsgDef");

cc.Class({
    extends: require("BaseModuleMsg"),

    properties: {
        resPanelUrl:"prefabs/hall/About/About", // 预制体路径
        msgIdShowView:GameMsgDef.ID_SHOWABOUTVIEW_CTC, // 显示ID
    },

    messageDispatch:function(msg){
        
    },
});