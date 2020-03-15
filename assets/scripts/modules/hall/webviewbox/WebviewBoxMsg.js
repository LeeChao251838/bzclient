var GameMsgDef = require("GameMsgDef");

cc.Class({
    extends: require("BaseModuleMsg"),

    properties: {
        resPanelUrl:"prefabs/WebviewBox", // 预制体路径
        msgIdShowView:GameMsgDef.ID_SHOWWEBVIEWBOXVIEW_CTC, // 显示ID
        isPreload:false,

        
    },

    messageDispatch:function(msg){
        
    },
    
});