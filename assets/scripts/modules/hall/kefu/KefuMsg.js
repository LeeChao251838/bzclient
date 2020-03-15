var GameMsgDef = require("GameMsgDef");

cc.Class({
    extends: require("BaseModuleMsg"),

    properties: {
        resPanelUrl:"prefabs/hall/Kefu/Kefu", // 预制体路径
        msgIdShowView:GameMsgDef.ID_SHOWKEFUVIEW_CTC, // 显示ID
    },

    messageDispatch:function(msg){
        
    },
});