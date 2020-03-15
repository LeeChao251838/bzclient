var GameMsgDef = require("GameMsgDef");
var ConstsDef = require("ConstsDef");

cc.Class({
    extends: require("BaseModuleMsg"),

    properties: {
        resPanelUrl:"prefabs/JoinGame", // 预制体路径
        msgIdShowView:GameMsgDef.ID_SHOWJOINGAMEVIEW_CTC, // 显示ID
        isPreload:true, // 是否需要预加载，ps:常用组件需要预加载加快显示
        limitScene:ConstsDef.SCENE_NAME.HALL, // 限制场景，指定模块的场景，null是不限制 如:limitScene:ConstsDef.SCENE_NAME.GAME 游戏场景模块
    },

    messageDispatch:function(msg){
        
    },
});