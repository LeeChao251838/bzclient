var GameMsgDef = require("GameMsgDef");

cc.Class({
    extends: require("BaseModuleMsg"),

    properties: {
        resPanelUrl:"prefabs/hall/HallSet/HallSet", // 预制体路径
        msgIdShowView:GameMsgDef.ID_SHOWHALLSETTINGVIEW_CTC, // 显示ID
    },

    messageDispatch:function(msg){
        
    },
});