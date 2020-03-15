var GameMsgDef = require("GameMsgDef");
var ConstsDef = require('ConstsDef');

cc.Class({
    extends: require("BaseModuleMsg"),

    properties: {
        ///////////////////////
        resPanelUrl:"prefabs/pdkgame/pdkSettings", // 预制体路径
        msgIdShowView:GameMsgDef.ID_SHOWGAMESETTINGPDKVIEW_CTC, // 显示ID
        isPreload:false, // 是否需要预加载，ps:常用组件需要预加载加快显示
        limitScene:ConstsDef.SCENE_NAME.GAME_PDK, // 限制场景，指定模块的场景，null是不限制 如:limitScene:ConstsDef.SCENE_NAME.GAME 游戏场景模块
        ///////////////////////
    },
    
    // 消息分发函数
    messageDispatch:function(msg){
        switch (msg.msgId) {
            case GameMsgDef.ID_LOADSCENEFINISH: // 进入游戏场景
                if(cc.fy.sceneMgr.isPDKGameScene()){
                    //this.changeConfigBackground();
                    this.initVoice();
                }
            break;
        }
    },

    initVoice:function(){
        var bgmVolume = cc.fy.localStorage.getItem("bgmVolume");  
        var sfxVolume = cc.fy.localStorage.getItem("sfxVolume");  
            
        if(bgmVolume==0 ){           
            cc.fy.resMgr.setSpriteFrameByUrl("images/pdk/icon_voice_close",this.btn_volume); 
            cc.fy.audioMgr.setBGMVolume(0);
                     
        }else{
            cc.fy.audioMgr.setBGMVolume(1);
            cc.fy.resMgr.setSpriteFrameByUrl("images/pdk/icon_voice_open",this.btn_volume);
        }
        if(sfxVolume==0){           
            cc.fy.resMgr.setSpriteFrameByUrl("images/pdk/yinxiao_close",this.btn_yinxiao); 
            cc.fy.audioMgr.setSFXVolume(0);            
        }else{
            cc.fy.audioMgr.setSFXVolume(1);
            cc.fy.resMgr.setSpriteFrameByUrl("images/pdk/yinxiao_open",this.btn_yinxiao);
        }
        
    },
    // 修改背景代码
    // changeConfigBackground: function(){
    //     var cardSetting = JSON.parse(cc.fy.localStorage.getItem('card_setting'));
    //     if(cardSetting.card_back == 2){
    //         cardSetting.card_back = 0;
    //         cardSetting.card_front = 0;
    //         cardSetting.background = 0;
    //         cc.fy.localStorage.setItem('card_setting', JSON.stringify(cardSetting));
    //     }
    //     let backgroud = cardSetting.background;
    //     let url = ConstsDef.URL_ATLAS_PDKGAMEDESK[backgroud];
    //     if(url == null){
    //         ConstsDef.URL_ATLAS_PDKGAMEDESK[0];
    //     }

    //     var bg = cc.find("Canvas/bg/backgroud");
    //     if(bg){
    //         let bgSp = bg.getComponent(cc.Sprite);
    //         cc.fy.resMgr.setSpriteFrameByUrl(url, bgSp);
    //     }
    // },
});