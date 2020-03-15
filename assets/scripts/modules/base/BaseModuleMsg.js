var EventDispatcher = require('EventDispatcher');
var GameMsgDef = require('GameMsgDef');
var ConstsDef = require('ConstsDef');

cc.Class({
    properties: {
        parentTarget:null,

        _viewInstantiate:null,
        _isAlowAllMsg:true,
        _baseShowData:null,
    },

    ctor: function () {
        // 主场景 消息
        EventDispatcher.listen(GameMsgDef.MSGID, this.baseMessageDispatch.bind(this));
        if(this.isPreload){
            cc.fy.resMgr.addRes(this.resPanelUrl);
        }
        if(this.init != null){
            this.init();
        }
    },

    baseMessageDispatch:function(msg){
        switch (msg.msgId) {
            case GameMsgDef.ID_LOADSCENEFINISH: // 进入游戏场景
                this.initPanel();
            break;
        }

        if(this.messageDispatch != null && (this._isAlowAllMsg || (this._viewInstantiate != null && this._viewInstantiate.active))){
            this.messageDispatch(msg);
        }
    },

    initPanel:function() {
        this._viewInstantiate = null;
        var game = cc.fy.gameNetMgr;
        var self = this;
        if(self.limitScene != null && !cc.fy.sceneMgr.isTargetScene(self.limitScene)){
            return;
        }
        // console.log(" Base addHandler " , self.msgIdShowView);
        game.addHandler(self.msgIdShowView, function(data){
            self._baseShowData = data;
            if(self._viewInstantiate == null && (data == null || (data && data.isShow != false))){
                // 创建UI界面
                if(self._isLoadingNodeRes){
                    return;
                }
                self._isLoadingNodeRes = true;
                cc.fy.resMgr.loadRes(self.resPanelUrl, function(prefab){
                    if(prefab){
                        
                        var canvas = cc.fy.gameNetMgr.eventTarget;
                        var ndPanel = cc.instantiate(prefab);
                        if(self.parentTarget){
                            canvas = self.parentTarget;
                        }
                        ndPanel.parent = canvas;
                        self._viewInstantiate = ndPanel;
                        cc.fy.gameNetMgr.dispatchEvent(self.msgIdShowView, self._baseShowData);
                        console.log(" Base clone " , self.msgIdShowView);
                        self._isLoadingNodeRes = false;
                    }
                });
            }
            if(self._viewInstantiate){
                self._viewInstantiate.emit("baseshow");
            }
        });
    },
});
