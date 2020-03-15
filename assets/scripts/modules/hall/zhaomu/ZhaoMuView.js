var GameMsgDef = require("GameMsgDef");
cc.Class({
    extends: require("BaseModuleView"),

    properties: {
        labKefu:cc.Label,
        _weixin:null,
    },

    // use this for initialization
    onLoad(){
        this.initEventHandlers();
        this.initView();
    },

    initEventHandlers(){
        var self = this;
        var game = cc.fy.gameNetMgr;
        
        game.addHandler(GameMsgDef.ID_SHOWZHAOMUVIEW_CTC, function(data){
            if(data.isShow == false){
                self.close();
            }
            else{
                console.log("ID_SHOWZHAOMUVIEW_CTC ---- ");
                self.show();
            }
        });
    },

    initView(){
        var kefu =cc.fy.SI.officialwx.toString();
        this._weixin =kefu;
        this.labKefu.string = this._weixin;
    },

    close(){
        this.node.active = false;
    },

    show(){
        this.node.active = true;
       
    },

    onBtnCopyKF(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        cc.fy.anysdkMgr.copyAndJump(this._weixin, true);
    },
    onBtnClose(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.node.active = false;
    },
});