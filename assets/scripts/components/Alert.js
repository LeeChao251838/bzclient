var GameMsgDef = require('GameMsgDef');
cc.Class({
    extends: cc.Component,

    properties: {
        _alertClone:null,
        _alert:null,
        _btnOK:null,
        _btnCancel:null,
        _title:null,
        _labContent:null,
        _imgMask:null,
        _onok:null,
        _content:"",
        _needcancel:false,

        _isLoading:false,
    },
    
    onBtnClicked:function(event){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        var self = cc.fy.alert;
        if(event.target.name == "btnOK"){
            if(self._onok){
                self._onok();
            }
        }
        self.hide();
    },
    
    show:function(content,onok,needcancel, fk){

        if( cc.fy.gameNetMgr){
            cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWWEBVIEWBOXVIEW_CTC,{isShow:false});//关闭webview
        }
        
        var self = cc.fy.alert;
        self._content = content;
        self._onok = onok;
        self._needcancel = needcancel;

        if(self._alert != null){
            self._alert.destroy();
            self._alert = null;
        }
        
        if(self._isLoading == true){
            // 正在加载预制体中
            return;
        }

        if(self._alertClone == null){
            self._isLoading = true;
            cc.fy.resMgr.loadRes("prefabs/alert", function(prefab){
                self._alertClone = prefab;
                self._isLoading = false;
                self.initView(fk);
            });
        }
        else{
            self.initView(fk);
        }
    },

    initView:function(fk){
        var self = cc.fy.alert;
        var scene = cc.director.getScene();
        if(scene == null){
            return;
        }
        var canvas = scene.getChildByName("Canvas");
        if(canvas == null){
            return;
        }
        if(self._alert == null)
        {
            self._alert = cc.instantiate(self._alertClone);
            let content=self._alert.getChildByName("content");
            
            self._alert.parent = canvas;
            self._alert.x = 0;
            self._alert.y = 0;

            self._labContent = content.getChildByName("labContent").getComponent(cc.Label);
            self._btnOK = content.getChildByName("btnOK");
            self._btnCancel = content.getChildByName("btnCancel");
    
            self._imgMask = content.getChildByName("mask");
            self._fk0 = content.getChildByName("fk0");
            self._fk1 = content.getChildByName("fk1");
         
            self._btnOK.on('click', function(event){
                self.onBtnClicked(event);
            });
            self._btnCancel.on('click', function(event){
                self.onBtnClicked(event);
            });
        
        }
        self._alert.zIndex = cc.fy.global.zIndex + 160;
        self._alert.active = true;
        self._labContent.string = self._content;
        if(self._needcancel){
            self._btnCancel.active = true;
            self._btnOK.x = -137;
        }
        else{
            self._btnCancel.active = false;
            self._btnOK.x = 3;
        }
        self._fk0.active = false;
        self._fk1.active = false;
        if(fk != null){
            if(fk == 0){
                if(self._fk0){
                    self._fk0.active = true;
                    self._fk1.active = false;
                }
            }
            else if(fk == 1){
                if(self._fk1){
                    self._fk0.active = false;
                    self._fk1.active = true;
                }
            }
        }
    },

    hide:function(){
        if(cc.fy.alert._alert == null){
            return;
        }
        cc.fy.alert._alert.destroy();
        cc.fy.alert._alert = null;
        cc.fy.alert._onok = null;
        cc.fy.alert._isLoading = false;
        
    },

    // 带房卡图片的相关的提示
    // 0 提示：解散房间不扣房卡，是否解散
    // 1 提示：房卡不足
    showFK:function(type,onok,needcancel){
        cc.fy.alert.show("", onok,needcancel, type);
    },

    onDestroy:function(){
        cc.fy.alert._alert = null;
        cc.fy.alert._onok = null;
        cc.fy.alert._isLoading = false;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});