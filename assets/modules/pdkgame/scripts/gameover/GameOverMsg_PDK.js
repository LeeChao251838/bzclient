var GameMsgDef = require("GameMsgDef");
var ConstsDef = require('ConstsDef');

cc.Class({
    extends: require("BaseModuleMsg"),

    properties: {
        ///////////////////////
        resPanelUrl:"prefabs/pdkgame/gameover_pdk", // 预制体路径
        msgIdShowView:GameMsgDef.ID_SHOWGAMEOVERVIEW_PDK_CTC, // 显示ID
        isPreload:false, // 是否需要预加载，备注:常用组件需要预加载加快显示
        limitScene:ConstsDef.SCENE_NAME.GAME_PDK, // 限制场景，指定模块的场景，null是不限制 如:limitScene:ConstsDef.SCENE_NAME.GAME 游戏场景模块
        ///////////////////////
        gameOverData:null,
    },

    // 初始化数据函数
    init:function() {
    },
    
    // 消息分发函数
    messageDispatch:function(msg){
      
        switch (msg.msgId) {
            case GameMsgDef.ID_PDK_STC_GAMEOVER: // 游戏结束
                this.gameOverData = msg.data;
                if(cc.fy.gameNetMgr.seats != null && cc.fy.gameNetMgr.seats.length > 0){
                    let results=msg.data.results;
                    var haveGuan=false;
                    if(results!=null && results.length>0){
                        for(let i=0;i<results.length;i++){
                            if(results[i].isNoOutCard){
                                haveGuan=true;
                                break;
                            }
                        }
                    }
                    if(haveGuan){
                        setTimeout(function(){
                             cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWGAMEOVERVIEW_PDK_CTC, {isShow:true,data:msg.data});
                        },2000);
                    }else{
                         cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWGAMEOVERVIEW_PDK_CTC, {isShow:true,data:msg.data});
                    }
                }
            break;
        }
    },
});