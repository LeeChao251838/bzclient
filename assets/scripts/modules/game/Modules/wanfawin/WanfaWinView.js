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
        
        game.addHandler(GameMsgDef.ID_SHOWWANFAWINVIEW_CTC, function(data){
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
        this.setHideOther(false);

        
    },

    showPanel:function(data){
        this.node.active = true;

        let infoData = cc.fy.wanfaWinMsg.getWanfaArr();
        let labRoomID = this.node.getChildByName("frame").getChildByName("labRoomID").getComponent(cc.Label);
        let labJuCount = this.node.getChildByName("frame").getChildByName("labJuCount").getComponent(cc.Label);
        let labPay = this.node.getChildByName("frame").getChildByName("labPay").getComponent(cc.Label);
        let labMod = this.node.getChildByName("frame").getChildByName("labMod").getComponent(cc.Label);
        let labScore = this.node.getChildByName("frame").getChildByName("labFen").getComponent(cc.Label);
        let labWanfa = this.node.getChildByName("frame").getChildByName("labWanfa").getComponent(cc.Label);
        let labSeatNum = this.node.getChildByName("frame").getChildByName("labSeatNum").getComponent(cc.Label);

        labRoomID.string = infoData.roomInfo;
        labJuCount.string = infoData.maxCount;
        labPay.string = infoData.aagems;
        labMod.string = infoData.modelInfo;
        labScore.string = infoData.baseScore;
        labWanfa.string = infoData.wanfaInfo;
        labSeatNum.string = infoData.seatNum;
    },

    hidePanel:function(){
        this.node.active = false;
    },
});
