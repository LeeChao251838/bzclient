var GameMsgDef = require("GameMsgDef");
var ConstsDef = require('ConstsDef');

cc.Class({
    extends: require("BaseModuleMsg"),

    properties: {
        ///////////////////////
        resPanelUrl:"newMJGameRes/NewMJRes/prefabs/settings", // 预制体路径
        msgIdShowView:GameMsgDef.ID_SHOWMJGAMESETTINGVIEW_CTC, // 显示ID
        isPreload:false, // 是否需要预加载，ps:常用组件需要预加载加快显示
        limitScene:ConstsDef.SCENE_NAME.GAME_MJ, // 限制场景，指定模块的场景，null是不限制 如:limitScene:ConstsDef.SCENE_NAME.GAME 游戏场景模块
        ///////////////////////
    },
    
    // 消息分发函数
    messageDispatch:function(msg){
        switch (msg.msgId) {
            case GameMsgDef.ID_LOADSCENEFINISH: // 进入游戏场景
            if(cc.fy.sceneMgr.isMJGameScene()){
               // this.changeConfigBackground();
            }
            break;
        }
    },

    // 修改背景代码
    changeConfigBackground: function(){
        var cardSetting = JSON.parse(cc.fy.localStorage.getItem('card_setting'));
        var is3D = cc.fy.utils.check3D(cardSetting);
        if(cardSetting.card_back == 2 && !is3D){
            cardSetting.background = 0;
        }
        if (is3D) {
            cc.find("Canvas/bg/Z_3Dbackgroud").active = true;
            cc.find("Canvas/bg/Z_backgroud").active = false;
        } else {
            if(cardSetting.background >= 3){
                cardSetting.background = 0;
            }
            let bgSprite = cc.find("Canvas/bg/Z_backgroud").getComponent(cc.Sprite);
            cc.fy.resMgr.setSpriteFrameByUrl(ConstsDef.URL_ATLAS_GAMEDESK[cardSetting.background], bgSprite);
            cc.find("Canvas/bg/Z_3Dbackgroud").active = false;
            cc.find("Canvas/bg/Z_backgroud").active = true;
        }
    },
});