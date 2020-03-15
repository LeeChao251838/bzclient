var GameMsgDef = require("GameMsgDef");
var ConstsDef = require('ConstsDef');

cc.Class({
    extends: require("BaseModuleMsg"),

    properties: {
        ///////////////////////
        resPanelUrl:"prefabs/guild/GuildGameInvAlert/GuildGameInvAlert", 
        msgIdShowView:GameMsgDef.ID_SHOWGUILDGAMEINVALERTVIEW_CTC, // 显示ID
        isPreload:false, // 是否需要预加载，备注:常用组件需要预加载加快显示
        limitScene:ConstsDef.SCENE_NAME.HALL, // 限制场景，指定模块的场景，null是不限制 如:limitScene:ConstsDef.SCENE_NAME.GAME 游戏场景模块
        ///////////////////////
    },

    // 初始化数据函数
    init:function() {
        console.log("game invite");
    },
    
    // 消息分发函数
    messageDispatch:function(msg){
       
      switch (msg.msgId) {
            case GameMsgDef.ID_BE_INVITED_TO_PLAY: // 俱乐部游戏邀请
                var data =msg.data.data;
                var clubid=null;
                if(data){
                    clubid = data.clubId;
                } 
               let agree = cc.fy.guildSettingMsg.isAgree(clubid);
                if(agree){
                     cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWWEBVIEWBOXVIEW_CTC,{isShow:false});//关闭webview
                    cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWGUILDGAMEINVALERTVIEW_CTC, {isShow:true, data:msg.data});
                }
            break;
        }
        
    },
});