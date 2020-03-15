var GameMsgDef = require("GameMsgDef");

cc.Class({
    extends: require("BaseModuleMsg"),

    properties: {
        resPanelUrl:"prefabs/PopNotice", // 预制体路径
        msgIdShowView:GameMsgDef.ID_SHOWPOPNOTICEVIEW_CTC, // 显示ID
        isPreload:false,
    },

    messageDispatch:function(msg){
        switch (msg.msgId) {
            case GameMsgDef.ID_LOADSCENEFINISH:    // 进入游戏场景
                if(!cc.FREEVERSION){
                    this.refreshWelcome();
                }
            break;
        }
    },

    refreshWelcome(){
        if(cc.fy.global.msgWelcome != null) return;
        var onGet = function(ret){
            if(ret.errcode !== 0){
                console.log(ret.errmsg);
            }
            else{
                if(cc.fy.userMgr.welcome == null){
                    cc.fy.userMgr.welcome = {};
                }
                cc.fy.userMgr.welcome.version = ret.version;
                cc.fy.userMgr.welcome.msg = ret.msg;
                cc.fy.global.msgWelcome = ret.msg;
                if(cc.fy.global.isforcenotice && cc.fy.userMgr.roomData == null && cc.fy.gameNetMgr.roomId == null){
                    cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWPOPNOTICEVIEW_CTC, {isShow:true});
                }
            }
        };
        
        var data = {
            account:cc.fy.userMgr.account,
            sign:cc.fy.userMgr.sign,
            type:"welcome",
        };
        cc.fy.http.sendRequest("/get_message", data, onGet.bind(this));
    },
});