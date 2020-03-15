var GameMsgDef = require("GameMsgDef");
var ConstsDef = require('ConstsDef');

cc.Class({
    extends: require("BaseModuleMsg"),

    properties: {
        ///////////////////////
        resPanelUrl:"prefabs/guild/GuildSetting/GuildSetting", // 预制体路径
        msgIdShowView:GameMsgDef.ID_SHOWGUILDSETTINGVIEW_CTC, // 显示ID
        isPreload:false, // 是否需要预加载，备注:常用组件需要预加载加快显示
        limitScene:ConstsDef.SCENE_NAME.HALL, // 限制场景，指定模块的场景，null是不限制 如:limitScene:ConstsDef.SCENE_NAME.GAME 游戏场景模块
        ///////////////////////

    },

    // 初始化数据函数
    init:function() {
    },
    
    // 消息分发函数
    messageDispatch:function(msg){
        switch (msg.msgId) {
            case GameMsgDef.ID_LOADSCENEFINISH: // 进入游戏场景
                
            break;
        }
    },

    isAgree (clubid) {
        if(clubid==null){
            return 1;
        }
        let inviteClub = cc.fy.localStorage.getItem("inviteClub");

        if (inviteClub == null) {
           return 1;
        }
       
        var Clubs=JSON.parse(inviteClub);
        console.log("clubid:",clubid,Clubs);
        if(Clubs[clubid]==null){
            return 1;
        }
        return Clubs[clubid];
        
    },
});