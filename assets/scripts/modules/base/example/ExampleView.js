var GameMsgDef = require("GameMsgDef");
cc.Class({
    extends: require("BaseModuleView"),

    properties: {
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
        
        game.addHandler(GameMsgDef.ID_SHOWEXAMPLEVIEW_CTC, function(data){
            if(data && data.isShow == false){
                self.hidePanel();
            }
            else{
                self.showPanel(data);
            }
        });
    },

    initView:function(){
        // 作为弹框模式 不隐藏其它弹框
        // this.setHideOther(false);
    },

    showPanel:function(data){
        this.node.active = true;
    },

    hidePanel:function(){
        this.node.active = false;
    },
});
