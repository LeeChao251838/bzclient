var GameMsgDef = require("GameMsgDef");
cc.Class({
    extends: require("BaseModuleView"),

    properties: {
        nodPais:cc.Node,
    },

    onLoad(){
        this.initView();
        this.initEventHandlers();
    },

    initEventHandlers(){
        var self = this;
        var game = cc.fy.gameNetMgr;
        
        game.addHandler(GameMsgDef.ID_SHOWZHUAPAIVIEW_CTC, function(data){
            if(data && data.isShow == false){
                self.hidePanel();
            }
            else{
                self.showPanel(data);
            }
        });
    },

    initView(){
        // 作为弹框模式 不隐藏其它弹框
        this.setHideOther(false);
        // 确定
        var btnSure = this.node.getChildByName("btnSure");
        if(btnSure){
            cc.fy.utils.addClickEvent(btnSure, this.node, "ZhuapaiView", "onBtnSure");
        }
    },

    showPanel(data){
        this.node.active = true;
        this.refreshData(data.data);
    },

    hidePanel(){
        this.node.active = false;
    },

    onBtnSure(){
        if(cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.HZEMJ){
            cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWGAMEOVERVIEW_HZE_CTC, {isShow:true});
        }
        this.hidePanel();
    },

    refreshData(data){
        console.log("data ", data);
        for(var i = 0; i < this.nodPais.childrenCount; i++){
            this.nodPais.children[i].active = false;
        }
        for(var i = 0; i < data.length; i++){
            var nodPai = this.nodPais.children[i];
            nodPai.active = true;
            var sprMJ = nodPai.getComponent(cc.Sprite);
            var nodPlus1 = nodPai.getChildByName("plus1");
            nodPlus1.active = data[i].active;
            cc.fy.mahjongmgr.createMahjongNode("M_", data[i].card, sprMJ);
        }
    }
});
