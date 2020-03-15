var GameMsgDef = require("GameMsgDef");

cc.Class({
    extends: require("BaseModuleMsg"),

    properties: {
        resPanelUrl:"prefabs/hall/HallShop/HallShop", // 预制体路径
        msgIdShowView:GameMsgDef.ID_SHOWHALLSHOPVIEW_CTC, // 显示ID
        isPreload:false,
    },

    messageDispatch:function(msg){
        
    },
});