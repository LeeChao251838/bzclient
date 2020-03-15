var GameMsgDef = require("GameMsgDef");
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
        
        ndLoadingClone:null,
        ndLoading:null,

        isLoading:false,
        _isShow:false,

        _reqMsgId:null,
        connectCount:0,

        _labContent:null,

        _defMaxTime:15,
        _maxTime:15,
    },
    
    show:function(strContent, mt){
        var self = cc.fy.loading;
        // self._reqMsgId = msgId;
        self._maxTime = mt == null ? self._defMaxTime : mt;
        self._isShow = true;
        if(self.isLoading == true){
            // 正在加载预制体中
            return;
        }
        
        
        if(self.ndLoadingClone == null){
            self.isLoading = true;
            cc.fy.resMgr.loadRes("prefabs/loading", function(prefab){
                self.ndLoadingClone = prefab;
                self.isLoading = false;
                self.initView(strContent);
            });
        }
        else{
            self.initView(strContent);
        }
        self.connectCount = 0;
        // console.log("loading show -================= >>>>>");
    },

    initView:function(strContent){
        var self = cc.fy.loading;
        if(self.ndLoading && self.ndLoading.active){
            return;
        }
        var scene = cc.director.getScene();
        if(scene == null){
            return;
        }
        var canvas = scene.getChildByName("Canvas");
        if(canvas == null){
            return;
        }
        if(self.ndLoading == null)
        {
            self.ndLoading = cc.instantiate(self.ndLoadingClone);
            self.ndLoading.parent = canvas;
            self._labContent = self.ndLoading.getChildByName("label").getComponent(cc.Label);
            self.ndLoading.x = 0;
            self.ndLoading.y = 0;
            self.ndLoading.addComponent("Loading");

        }
        self.ndLoading.zIndex = cc.fy.global.zIndex + 159;
        self.ndLoading.active = self._isShow;
        self._labContent.string = strContent == null ? "":strContent;
    },

    hide:function(msgId){
        setTimeout(function(){
            var self = cc.fy.loading;
            if(self._reqMsgId == null || msgId == null ||
            self._reqMsgId == msgId || msgId == GameMsgDef.ID_ERROR_NOTICE_S2C){
                self._isShow = false;
                if(self.ndLoading != null){
                    self.ndLoading.active = false;
                }
            }
            self.connectCount = 0;
        },500);

        // console.log("loading hide -================= >>>>>");
    },

    onDestroy:function(){
        cc.fy.loading.ndLoading = null;
        cc.fy.loading.isLoading = false;
    },

    reset:function(){
        cc.fy.loading.ndLoading = null;
        cc.fy.loading.isLoading = false;
    },


    update: function (dt) {
        var self = cc.fy.loading;
        if(self._maxTime != -1){
            self.connectCount += dt;
            if(self.connectCount > self._maxTime)
            {
                self.connectCount = 0;
                cc.fy.hintBox.show("网络连接超时！");
                self.hide();
            }
        }
    },
});
