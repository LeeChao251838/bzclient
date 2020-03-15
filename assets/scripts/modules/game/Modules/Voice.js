cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        _lastTouchTime:null,
        _voice:null,
        _volume:null,
        _voice_failed:null,
        _lastCheckTime:-1,
        _timeBar:null,
        MAX_TIME:15000,

        _limitTouchTime:-1,
        _islimit:false,
    },

    // use this for initialization
    onLoad: function () {
        
        this._voice = this.node.getChildByName("voice");
        this._voice.active = false;
        
        this._voice_failed = this._voice.getChildByName("voice_failed");
        this._voice_failed.active = false;
        
        this._timeBar = this._voice.getChildByName("time");
        this._timeBar.scaleX = 0.0;
        
        this._volume = this._voice.getChildByName("volume");
        for(var i = 1; i < this._volume.children.length; ++i){
            this._volume.children[i].active = false;
        }
        
        var btnVoice = this._voice_failed.getChildByName("btn_ok");
        if(btnVoice){
            cc.fy.utils.addClickEvent(btnVoice,this.node,"Voice","onBtnOKClicked");
        }
        
        var self = this;
        var btnVoice = this.node.getChildByName("btn_voice");
        if(btnVoice == null){
            btnVoice = cc.find("btnbox/btn_voice", this.node);
        }
        if(btnVoice){
            btnVoice.on(cc.Node.EventType.TOUCH_START,function(){
                if(self._limitTouchTime != -1 && Date.now() - self._limitTouchTime < 3000){
                    if(cc.fy.hintBox == null){
                        var HintBox = require("HintBox");
                        cc.fy.hintBox = new HintBox();
                    }
                    cc.fy.hintBox.show("操作过快，休息一下吧！");
                    self._islimit = true;
                }else{
                    self._islimit = false;
                }
                self._limitTouchTime = Date.now();
                if(self._islimit == false){
                    console.log("cc.Node.EventType.TOUCH_START");
                    cc.fy.voiceMgr.prepare("record.amr");
                    self._lastTouchTime = Date.now();
                    self._voice.active = true;
                    self._voice_failed.active = false;
                }
            });

            btnVoice.on(cc.Node.EventType.TOUCH_MOVE,function(){
                console.log("cc.Node.EventType.TOUCH_MOVE");
            });
                        
            btnVoice.on(cc.Node.EventType.TOUCH_END,function(){
                if(self._islimit == false){
                    console.log("cc.Node.EventType.TOUCH_END");
                    if(Date.now() - self._lastTouchTime < 1000){
                        self._voice_failed.active = true;
                        cc.fy.voiceMgr.cancel();
                    }
                    else{
                        self.onVoiceOK();
                    }
                }
                self._lastTouchTime = null;
            });
            
            btnVoice.on(cc.Node.EventType.TOUCH_CANCEL,function(){
                console.log("cc.Node.EventType.TOUCH_CANCEL");
                self._lastTouchTime = null;
                self._voice.active = false;
                cc.fy.voiceMgr.cancel();
            });

            btnVoice.active = cc.fy.replayMgr.isReplay() == false;
            // btnVoice.active = false;
        }
    },
    
    onVoiceOK:function(){
        if(this._lastTouchTime != null){
            cc.fy.voiceMgr.release();
            var time = Date.now() - this._lastTouchTime;
            var msg = cc.fy.voiceMgr.getVoiceData("record.amr");
            cc.fy.net.send("voice_msg",{msg:msg,time:time});
        }
        this._voice.active = false;
    },
    
    onBtnOKClicked:function(){
        this._voice.active = false;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this._voice.active == true && this._voice_failed.active == false){
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
        
        if(this._lastTouchTime){
            var time = Date.now() - this._lastTouchTime;
            if(time >= this.MAX_TIME){
                this.onVoiceOK();
                this._lastTouchTime = null;
            }
            else{
                var percent = time / this.MAX_TIME;
                this._timeBar.scaleX = 1 - percent;
            }
        }
    },
});
