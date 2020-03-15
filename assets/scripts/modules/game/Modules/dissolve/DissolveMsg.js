var GameMsgDef = require("GameMsgDef");
var ConstsDef = require('ConstsDef');

cc.Class({
    extends: require("BaseModuleMsg"),

    properties: {
        ///////////////////////
        resPanelUrl:"prefabs/dissolve_notice", // 预制体路径
        msgIdShowView:GameMsgDef.ID_SHOWDISSOLVEVIEW_CTC, // 显示ID
        isPreload:false, // 是否需要预加载，ps:常用组件需要预加载加快显示
        limitScene:ConstsDef.SCENE_NAME.GAME, // 限制场景，指定模块的场景，null是不限制 如:limitScene:ConstsDef.SCENE_NAME.GAME 游戏场景模块
        ///////////////////////

        dissolveData:null,
    },
    
    // 消息分发函数
    messageDispatch:function(msg){
        switch (msg.msgId) {
            case GameMsgDef.ID_LOADSCENEFINISH: // 进入游戏场景

                if(this.dissolveData){
                    //进入游戏场景有信息清除延迟
                    if(this.setTimeout){
                        clearTimeout(this.setTimeout);
                    }
                    
                    console.log(" this.dissolveData) ", this.dissolveData);
                    cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWDISSOLVEVIEW_CTC, {isShow:true, data:this.dissolveData});
                    this.dissolveData = null;
                }
            break;
            case GameMsgDef.ID_DISSOLVE_NOTICE_PUSH: // 解散房间
                this.dissolveData = msg.data;
                cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWDISSOLVEVIEW_CTC, {isShow:true});
            break;
            case GameMsgDef.ID_LOGIN_RESULT: // 登录成功清理掉数据，后面有解散数据会返回ID_DISSOLVE_NOTICE_PUSH
                this.dissolveData = null;
            break;
            case GameMsgDef.ID_DISSOLVE_CANCEL_PUSH: // 取消解散房间
                this.dissolveData = null;
                var self = this;
                this.setTimeout=  setTimeout(function(){
                    //无信息才隐藏
                    if(!self.dissolveData){
                        cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWDISSOLVEVIEW_CTC, {isShow:false});
                    }
                },2000);
               
            break;
            case GameMsgDef.ID_GAME_OVER_PUSH: // 取消解散房间
                this.dissolveData = null;
                cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWDISSOLVEVIEW_CTC, {isShow:false});
            break;
            // case GameMsgDef.ID_PDK_STC_GAMEOVER: // 取消解散房间
            //     this.dissolveData = null;
            //     cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWDISSOLVEVIEW_CTC, {isShow:false});
            // break;
        }
    },
});