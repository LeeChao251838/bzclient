var GameMsgDef = require("GameMsgDef");
var ConstsDef = require("ConstsDef");

cc.Class({
    extends: require("BaseModuleMsg"),

    properties: {
        resPanelUrl:"prefabs/hall/zhaomu/zhaomu", // 预制体路径
        msgIdShowView:GameMsgDef.ID_SHOWZHAOMUVIEW_CTC, // 显示ID
        isPreload:false, // 是否需要预加载，ps:常用组件需要预加载加快显示
        limitScene:ConstsDef.SCENE_NAME.HALL, // 限制场景，指定模块的场景，null是不限制 如:limitScene:ConstsDef.SCENE_NAME.GAME 游戏场景模块
    },

    // messageDispatch:function(msg){
    //     switch (msg.msgId) {
    //         case GameMsgDef.ID_LOADSCENEFINISH:    // 进入游戏场景
    //             if(!cc.FREEVERSION){
    //                 this.forceOpen();
    //             }
    //         break;
    //     }
    // },
    // forceOpen(){

    //     if(cc.fy.global.isforceZhaomu ){
    //         cc.fy.global.isforceZhaomu = false;
    //         if(cc.fy.userMgr.roomData == null && cc.fy.gameNetMgr.roomId == null){
    //             cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWZHAOMUVIEW_CTC, {isShow:true});
    //         }   
    //     }
    // },
});