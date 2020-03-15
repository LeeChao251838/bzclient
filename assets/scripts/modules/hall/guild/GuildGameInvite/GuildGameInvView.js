var GameMsgDef = require("GameMsgDef");
cc.Class({
    extends: require("BaseModuleView"),

    properties: {
        inviteInfo:cc.Label,
        roomInfo:cc.Label,
       
        conf:{
            type:cc.Node,
            default:[],
        },

        _beInvRoomId:null,
    },

    onLoad: function () {
        this.initEventHandlers();
        this.initView();
    },

    start:function(){
        
    },

    initEventHandlers:function(){
        var self = this;
        var game = cc.fy.gameNetMgr;
        
        game.addHandler(GameMsgDef.ID_SHOWGUILDGAMEINVALERTVIEW_CTC, function(data){
            if(data && data.isShow == false){
                self.hidePanel();
            }
            else{
                self.showPanel(data);
            }
        });

        game.addHandler()
    },

    initView:function(){
        // 作为弹框模式 不隐藏其它弹框
        this.setHideOther(false);
   
    },

    showPanel:function(data){
        let _data = data.data;
        if (_data.errcode != 0) {
            cc.fy.hintBox.show(_data.msg);
        }
        else{
            // let agree = cc.fy.guildSettingMsg.isAgree();
            // if (!agree) {
            //     return;
            // }
            this.node.active = true;
            this.showGuildGameInvAlert(_data);
        }
    },

    hidePanel:function(){
        this.node.active = false;
    },

    showGuildGameInvAlert:function(ret){
        let data = ret.data;
        console.log(data);
        this._beInvRoomId = data.roomid;
        this.inviteInfo.string = "我是圈(" + data.clubname + ")的" + data.username + "\n一起来玩吧!" ;
       
        var  conf =JSON.parse(data.conf);
        
        this.roomInfo.string = cc.GAMETYPENAME[conf.type] + " 房间号："+data.roomid;
        this.initRule(conf);
        if (ret.promocode != null) {
            cc.fy.promoCode = ret.promocode;
        }
    },

    initRule(conf){
        console.log("conf:",conf);
       
        var wanfa=cc.fy.guildDeskRuleMsg.getWanfaArr(conf);
        console.log("玩法",wanfa);
        for(let i=0;i<wanfa.length;i++){
            console.log(wanfa[i]+"   "+i);
            this.conf[i].active=true;
            var label=this.conf[i].getChildByName("label").getComponent(cc.Label);
            label.string=wanfa[i];
            this.conf[i].width= label.node.width+36;
            if(this.conf[i].width>131){
                this.conf[i].width=262;
            }else{
                this.conf[i].width=131;
            }
        }    
        for(let i=wanfa.length;i<this.conf.length;i++){
            this.conf[i].active=false;
        }
    },

    enterInvRoom:function(){
        if (this._beInvRoomId != null) {
            cc.fy.userMgr.enterRoom(this._beInvRoomId);
        }
        cc.fy.promoCode = null;
        this.hidePanel();
        this._beInvRoomId = null;
    },

    closeGuildGameInvAlert:function(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        cc.fy.promoCode = null;
        this.hidePanel();
    },
});
