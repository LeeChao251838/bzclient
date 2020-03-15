var GameMsgDef = require("GameMsgDef");
var ConstsDef = require('ConstsDef');

cc.Class({
    extends: require("BaseModuleMsg"),

    properties: {
        ///////////////////////
        resPanelUrl:"prefabs/voice", // 预制体路径
        msgIdShowView:GameMsgDef.ID_SHOWVOICEVIEW_CTC, // 显示ID
        isPreload:false, // 是否需要预加载，ps:常用组件需要预加载加快显示
        limitScene:ConstsDef.SCENE_NAME.GAME, // 限制场景，指定模块的场景，null是不限制 如:limitScene:ConstsDef.SCENE_NAME.GAME 游戏场景模块
        ///////////////////////
        _lastTouchTime:-1,
        _islimit:false,

        isShowFailed:false,

        _btnVoice:null,
    },

    // 初始化数据函数
    init:function() {
        
    },
    
    // 消息分发函数
    messageDispatch:function(msg){
        switch (msg.msgId) {
            case GameMsgDef.ID_LOADSCENEFINISH: // 进入游戏场景
                if(cc.fy.sceneMgr.isGameScene()){
                    this.initVoice();
                }
            break;
        }
    },

    initVoice:function(){
        // if(this._btnVoice != null){
        //     return;
        // }
        var self = this;
        var eventTarget = cc.fy.gameNetMgr.eventTarget;
        var btnVoice = eventTarget.getChildByName("btn_voice");
        if(cc.fy.sceneMgr.isPDKGameScene()){
            btnVoice = cc.find("Canvas/gameMain/btnbox/btn_voice");
        }
        if(cc.fy.sceneMgr.isMJGameScene()){
            btnVoice = cc.find("Canvas/gameMain/btnbox/btn_voice");
        }
        this._btnVoice = btnVoice;
        if(btnVoice){
            btnVoice.active = cc.fy.replayMgr.isReplay() == false;
            if(!btnVoice.active){
                return;
            }

            btnVoice.on(cc.Node.EventType.TOUCH_START,function(){
                self.isShowFailed = false;
                if(self._lastTouchTime > 0 && Date.now() - self._lastTouchTime < 3000){
                    cc.fy.hintBox.show("操作过快，休息一下吧！");
                    self._islimit = true;
                }else{
                    self._islimit = false;
                    self._lastTouchTime = Date.now();
                    console.log("cc.Node.EventType.TOUCH_START");
                    self.showVoiceView(true);
                    cc.fy.voiceMgr.prepare("record.amr");
                }
            });

            btnVoice.on(cc.Node.EventType.TOUCH_MOVE,function(){
                console.log("cc.Node.EventType.TOUCH_MOVE");
            });
                        
            btnVoice.on(cc.Node.EventType.TOUCH_END,function(){
                self.isShowFailed = false;
                if(self._islimit == false){
                    console.log("cc.Node.EventType.TOUCH_END");
                    if(Date.now() - self._lastTouchTime < 1000){
                        self.isShowFailed = true;
                        cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWVOICEFAILEDVIEW_CTC);
                        cc.fy.voiceMgr.cancel();
                    }
                    else{
                        self.onVoiceOK();
                    }
                }
            });
            
            btnVoice.on(cc.Node.EventType.TOUCH_CANCEL,function(){
                console.log("cc.Node.EventType.TOUCH_CANCEL");
                cc.fy.voiceMgr.cancel();
                self.showVoiceView(false);
            });
        }
    },

    showVoiceView:function(bo){
        cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWVOICEVIEW_CTC, {isShow:bo});
    },

    onVoiceOK:function(){
        if(this._lastTouchTime > 0){
            cc.fy.voiceMgr.release();
            var time = Date.now() - this._lastTouchTime;
            var msg = cc.fy.voiceMgr.getVoiceData("record.amr");
            cc.fy.net.send("voice_msg",{msg:msg,time:time});
            this._lastTouchTime = -1;
        }
        this.showVoiceView(false);
    },
});