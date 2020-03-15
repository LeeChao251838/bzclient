var GameMsgDef = require("GameMsgDef");

cc.Class({
    extends: require("BaseModuleMsg"),

    properties: {
        ///////////////////////
        resPanelUrl:"lbhamj/prefabs/mjgame/gameGuize", // 预制体路径
        msgIdShowView:GameMsgDef.ID_SHOWGAMEVIEW_MJPEIZHI_CTC, // 显示ID
        isPreload:true, // 是否需要预加载，ps:常用组件需要预加载加快显示
        ///////////////////////
    },

    messageDispatch:function(msg){
        
    },
});