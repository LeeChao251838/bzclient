var GameMsgDef = require("GameMsgDef");

cc.Class({
    extends: require("BaseModuleMsg"),

    properties: {
        resPanelUrl:"prefabs/hall/UserInfo/UserInfo", // 预制体路径
        msgIdShowView:GameMsgDef.ID_SHOWUSERINFOVIEW_CTC, // 显示ID
    },

    messageDispatch:function(msg){
        
    },
});