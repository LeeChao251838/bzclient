var GameMsgDef = require("GameMsgDef");
var ConstsDef = require('ConstsDef');

cc.Class({
    extends: require("BaseModuleMsg"),

    properties: {
        ///////////////////////
        resPanelUrl:"prefabs/pdkgame/btnchat_open", // 预制体路径
        msgIdShowView:GameMsgDef.ID_SHOWCHATBAGVIEW_CTC, // 显示ID
        isPreload:false, // 是否需要预加载，ps:常用组件需要预加载加快显示
        limitScene:ConstsDef.SCENE_NAME.GAME, // 限制场景，指定模块的场景，null是不限制 如:limitScene:ConstsDef.SCENE_NAME.GAME 游戏场景模块
        ///////////////////////

        _quickChatInfo:null,
    },
   
    init:function(){
        console.log("预制-------------ChatBagMsg");
    },

    // // 消息分发函数
    // messageDispatch:function(msg){
    //     switch (msg.msgId) {
    //         case GameMsgDef.ID_LOADSCENEFINISH: // 进入游戏场景
    //             if(cc.fy.sceneMgr.isPDKGameScene()){
    //                 this.initChat();
    //             }
    //         break;
    //     }
    // },
    initChat:function(){
        var self = this;
        
        //房间显示距离按钮
       
    },

    

    getQuickChatInfo(index){
       
            this.initInfo();
       
        var key = "item" + index;
        return this._quickChatInfo[key];   
    },
    initInfo:function(){
        this._quickChatInfo = {};
            if(cc.fy.gameNetMgr.conf.type ==  cc.GAMETYPE.PDK || cc.fy.gameNetMgr.conf.type ==  cc.GAMETYPE.GD){
                this._quickChatInfo["item0"] = {index:0,content:"老铁,扎心了!",content2:"老铁,扎心了!",sound:"speech_0.mp3"};
                this._quickChatInfo["item1"] = {index:1,content:"这牌,我也是醉了!",content2:"这牌我也是醉了!",sound:"speech_1.mp3"};
                this._quickChatInfo["item2"] = {index:2,content:"来啊,互相伤害!",content2:"来啊,互相伤害!",sound:"speech_2.mp3"};
                this._quickChatInfo["item3"] = {index:3,content:"出牌这么慢,你属乌龟的吗?",content2:"出牌这么慢,你属乌龟的吗?",sound:"speech_3.mp3"};
                this._quickChatInfo["item4"] = {index:4,content:"厉害了,我的哥!",content2:"厉害了,我的哥!",sound:"speech_4.mp3"};
            }
            else{
                this._quickChatInfo["item0"] = {index:0,content:"大家好，一起打牌很开心！",sound:"mj_fix_msg_1.mp3"};
                this._quickChatInfo["item1"] = {index:1,content:"快点吧，等得头发都白了！",sound:"mj_fix_msg_2.mp3"};
                this._quickChatInfo["item2"] = {index:2,content:"天哪，这牌怎么这么差啊！",sound:"mj_fix_msg_3.mp3"};
                this._quickChatInfo["item3"] = {index:3,content:"先胡末庄，后胡金庄！",sound:"mj_fix_msg_4.mp3"};
                this._quickChatInfo["item4"] = {index:4,content:"来个牌碰一下吧！",sound:"mj_fix_msg_5.mp3"};
                this._quickChatInfo["item5"] = {index:5,content:"哎呀，打错牌啦！",sound:"mj_fix_msg_6.mp3"};
                this._quickChatInfo["item6"] = {index:6,content:"上碰下自摸，自摸杠开啦！",sound:"mj_fix_msg_7.mp3"};
                this._quickChatInfo["item7"] = {index:7,content:"你们门槛真精明！",sound:"mj_fix_msg_8.mp3"};
                this._quickChatInfo["item8"] = {index:8,content:"老板，留条活路吧！",sound:"mj_fix_msg_9.mp3"};
                this._quickChatInfo["item9"] = {index:9,content:"你打的牌打得太好了！",sound:"mj_fix_msg_10.mp3"};
                this._quickChatInfo["item10"] = {index:10,content:"不好意思，稍微离开一会。",sound:"mj_fix_msg_11.mp3"};
            }
    },
});
