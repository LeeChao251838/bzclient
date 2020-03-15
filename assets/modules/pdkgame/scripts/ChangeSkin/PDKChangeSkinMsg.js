var GameMsgDef = require("GameMsgDef");
var ConstsDef = require('ConstsDef');

cc.Class({
    extends: require("BaseModuleMsg"),

    properties: {
        ///////////////////////
        resPanelUrl:"prefabs/pdkgame/change_skin", // 预制体路径
        msgIdShowView:GameMsgDef.ID_SHOWCHANGESKIN_CTC, // 显示ID
        isPreload:false, // 是否需要预加载，ps:常用组件需要预加载加快显示
        limitScene:ConstsDef.SCENE_NAME.GAME_PDK, // 限制场景，指定PDK模块的场景，null是不限制 如:limitScene:ConstsDef.SCENE_NAME.GAME 游戏场景模块
        ///////////////////////

      
    },
    
    messageDispatch:function(msg){
     
        switch (msg.msgId) {
            case GameMsgDef.ID_LOADSCENEFINISH: // 进入游戏场景
                if(cc.fy.sceneMgr.isPDKGameScene()){
                    this.setZhuobu();
                }
            break;
        }
    },
    init:function(){
        console.log("change_skin 预制件");
    },

     //桌布设置
    setZhuobu:function(){
        
        console.log("PDK set bgbackgroud")
        var showbgtype = cc.fy.localStorage.getItem("bgtype");
        var zhuobuBg = cc.find("Canvas/bg/zhuobuBg");
        var bgTitle = cc.find("Canvas/bg/bgTitle");
        if(Number(showbgtype)>=1){
            cc.fy.resMgr.setSpriteFrameByUrl("images/pdk/bg"+showbgtype,zhuobuBg.getComponent(cc.Sprite));
            cc.fy.resMgr.setSpriteFrameByUrl("images/pdk/bg_title"+showbgtype,bgTitle.getComponent(cc.Sprite));
        }else{
            cc.fy.localStorage.setItem("bgtype","1");
            cc.fy.resMgr.setSpriteFrameByUrl("images/pdk/bg1",zhuobuBg.getComponent(cc.Sprite));
            cc.fy.resMgr.setSpriteFrameByUrl("images/pdk/bg_title1",bgTitle.getComponent(cc.Sprite));   
        }
    },

});
