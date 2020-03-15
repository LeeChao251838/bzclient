var GameMsgDef = require("GameMsgDef");

cc.Class({
    extends: require("BaseModuleMsg"),

    properties: {
        resPanelUrl:"prefabs/Help", // 预制体路径
        msgIdShowView:GameMsgDef.ID_SHOWHELPVIEW_CTC, // 显示ID
    },

    messageDispatch:function(msg){
        
    },
});