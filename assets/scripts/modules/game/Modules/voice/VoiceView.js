var GameMsgDef = require("GameMsgDef");
cc.Class({
    extends: require("BaseModuleView"),

    properties: {
        _volume:null,
        _voice_failed:null,
        _lastCheckTime:-1,
        _timeBar:null,
        MAX_TIME:15000,
    },

    onLoad: function () {
        this.initView();
        this.initEventHandlers();
    },

    start:function(){
        
    },

    initEventHandlers:function(){
        var self = this;
        var game = cc.fy.gameNetMgr;
        
        game.addHandler(GameMsgDef.ID_SHOWVOICEVIEW_CTC, function(data){
            if(data && data.isShow == false){
                self.hidePanel();
            }
            else{
                self.showPanel(data);
            }
        });
        game.addHandler(GameMsgDef.ID_SHOWVOICEFAILEDVIEW_CTC, function(data){
            self._voice_failed.active = true;
        });
    },

    initView:function(){
        // 作为弹框模式 不隐藏其它弹框
        this.setHideOther(false);
        
        this._voice_failed = this.node.getChildByName("voice_failed");
        this._voice_failed.active = false;
        
        this._timeBar = this.node.getChildByName("time");
        this._timeBar.scaleX = 0.0;
        
        this._volume = this.node.getChildByName("volume");
        for(var i = 1; i < this._volume.children.length; ++i){
            this._volume.children[i].active = false;
        }
    },

    showPanel:function(data){
        this.node.active = true;
        if(cc.fy.voiceMsg.isShowFailed){
            this._voice_failed.active = true;
            cc.fy.voiceMsg.isShowFailed = false;
        }
        else{
            this._voice_failed.active = false;
        }
    },

    hidePanel:function(){
        this.node.active = false;
    },

    onBtnOKClicked:function(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.hidePanel();
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.node.active == true && this._voice_failed.active == false){
            if(Date.now() - this._lastCheckTime > 300){
                for(var i = 0; i < this._volume.children.length; ++i){
                    this._volume.children[i].active = false;
                }
                var v = cc.fy.voiceMgr.getVoiceLevel(7);
                if(v >= 1 && v <= 7){
                    this._volume.children[v-1].active = true;   
                }
                this._lastCheckTime = Date.now();
            }
        }
        
        if(cc.fy.voiceMsg._lastTouchTime > 0){
            var time = Date.now() - cc.fy.voiceMsg._lastTouchTime;
            if(time >= this.MAX_TIME){
                cc.fy.voiceMsg.onVoiceOK();
            }
            else{
                var percent = time / this.MAX_TIME;
                this._timeBar.scaleX = 1 - percent;
            }
        }
    },
});
