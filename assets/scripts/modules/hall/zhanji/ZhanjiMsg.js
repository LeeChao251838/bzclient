var GameMsgDef = require("GameMsgDef");
var ConstsDef = require('ConstsDef');
cc.Class({
    extends: require("BaseModuleMsg"),

    properties: {
        resPanelUrl:"prefabs/zhanji/zhanji", // 预制体路径
        msgIdShowView:GameMsgDef.ID_SHOWZHANJIVIEW_CTC, // 显示ID

        _roomInfo:null,
        
    },
  
    messageDispatch:function(msg){
        
    },
});