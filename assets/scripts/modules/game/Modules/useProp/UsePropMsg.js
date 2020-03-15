var GameMsgDef = require("GameMsgDef");
var ConstsDef = require('ConstsDef');

cc.Class({
    extends: require("BaseModuleMsg"),

    properties: {
        ///////////////////////
        resPanelUrl:"prefabs/pdkgame/useProp", // 预制体路径
        msgIdShowView:GameMsgDef.ID_SHOWUSEPROPVIEW_CTC, // 显示ID
        isPreload:true, // 是否需要预加载，ps:常用组件需要预加载加快显示
        limitScene:ConstsDef.SCENE_NAME.GAME, // 限制场景，指定模块的场景，null是不限制 如:limitScene:ConstsDef.SCENE_NAME.GAME 游戏场景模块
        ///////////////////////

        
    },
    init:function(){
        console.log("预制-------------UserInfoMsg");
    },

     // 消息分发函数
    messageDispatch:function(msg){
        switch (msg.msgId) {
            case GameMsgDef.ID_LOADSCENEFINISH: // 进入游戏场景
             cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWUSEPROPVIEW_CTC,{isShow:true,isFlash:true});
            break;
        }
    }


});
