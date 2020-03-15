var GameMsgDef = require("GameMsgDef");
var ConstsDef = require('ConstsDef');
cc.Class({
    extends: require("BaseModuleMsg"),

    properties: {
        ///////////////////////
        resPanelUrl:"prefabs/createroom/CreateRoom", // 预制体路径
        msgIdShowView:GameMsgDef.ID_SHOWCREATEROOMVIEW_CTC, // 显示ID
        isPreload:false, // 是否需要预加载，ps:常用组件需要预加载加快显示
        limitScene:ConstsDef.SCENE_NAME.HALL, // 限制场景，指定模块的场景
        ///////////////////////
    },

    
   
});