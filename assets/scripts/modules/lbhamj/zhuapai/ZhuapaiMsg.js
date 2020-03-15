var GameMsgDef = require("GameMsgDef");
var ConstsDef = require('ConstsDef');

cc.Class({
    extends: require("BaseModuleMsg"),

    properties: {
        ///////////////////////
        resPanelUrl:"lbhamj/prefabs/game_over_zhuapai", // 预制体路径
        msgIdShowView:GameMsgDef.ID_SHOWZHUAPAIVIEW_CTC, // 显示ID
        isPreload:true, // 是否需要预加载，ps:常用组件需要预加载加快显示
        limitScene:ConstsDef.SCENE_NAME.GAME_MJ, // 限制场景，指定模块的场景，null是不限制 如:limitScene:ConstsDef.SCENE_NAME.GAME 游戏场景模块
        ///////////////////////

        gameoverData:null,
    },
    
    // 消息分发函数
    messageDispatch:function(msg){
        switch (msg.msgId) {
            case GameMsgDef.ID_GAME_OVER_PUSH: // 游戏结束
                this.gameoverData = msg.data;
                var zhuapai = false;
                var results = this.gameoverData.results;
                console.log("results " , results);
                if(results == null){
                    return;
                }
                for(var i=0;i<results.length;i++){
                    if(results[i].hued){
                        zhuapai = true;
                        break;
                    }
                }
                if(zhuapai && this.isCanShow(cc.fy.gameNetMgr.conf.type)){
                    if(this.isCanShow(cc.fy.gameNetMgr.conf.type) && cc.fy.gameNetMgr.seats != null && cc.fy.gameNetMgr.seats.length > 0){
                        cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWZHUAPAIVIEW_CTC, {isShow:true, data:this.gameoverData.data});
                    }
                }
                else{
                    if(cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.HZEMJ){
                        cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWGAMEOVERVIEW_HZE_CTC, {isShow:true});
                    }
                }
            break;
        }
    },

    isCanShow:function(type) {
        let typeList = [];
        typeList.push(cc.GAMETYPE.HZEMJ);

        let isCan = false;
        for(let i=0;i<typeList.length;i++){
            if(typeList[i] == type){
                isCan = true;
                break;
            }
        }
        return isCan;
    }
});