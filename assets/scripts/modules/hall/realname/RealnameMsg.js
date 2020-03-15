var GameMsgDef = require("GameMsgDef");

cc.Class({
    extends: require("BaseModuleMsg"),

    properties: {
        resPanelUrl:"prefabs/hall/RealName/RealName", // 预制体路径
        msgIdShowView:GameMsgDef.ID_SHOWREALNAMEVIEW_CTC, // 显示ID
        isPreload:false,
    },

    messageDispatch:function(msg){
        
    },
});