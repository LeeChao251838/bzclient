var GameMsgDef = require("GameMsgDef");

cc.Class({
    extends: require("BaseModuleView"),

    properties: {
        _confirmId:null,
        _confirmInfo:null,
        _confirmType:null,
        tipQLabel:cc.Label,
        tipInfoLabel:cc.Label,
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
        
        game.addHandler(GameMsgDef.ID_SHOWCONFIRMSECONDVIEW_CTC, function(data){
            if(data && data.isShow == false){
                self.hidePanel();
            }
            else{
                self.showPanel(data);
            }
        });
        //初始化事件监听
        //解散按钮
        var btn=this.node.getChildByName("panel").getChildByName("btn");
        var sure = btn.getChildByName("sure");
        if(sure){
            cc.fy.utils.addClickEvent(sure, this.node, "ConfirmSecondView", "onSureClose");     
        }
       //加入按钮
        var cancel = btn.getChildByName("cancel");
        if(cancel){
        cc.fy.utils.addClickEvent(cancel, this.node, "ConfirmSecondView", "onCancelClose");
        }
    },

    

    initView:function(){
        // 作为弹框模式 不隐藏其它弹框
        this.setHideOther(false);

    },

    showPanel:function(data){
        this.node.active = true;
        var content=data.content;
        this._confirmId=content.id;
        this._confirmType=content.type
        this._confirmInfo=content.info;
        this.initInfo();       
    },

    hidePanel:function(){
        this.node.active = false;
    },
    initInfo(){
     
        this.tipQLabel.node.active=false;
        this.tipInfoLabel.node.active=false;
        switch(this._confirmType){
            case "memberRemove":
                this.memberRemoveInfo();
                break;
            case "memberLeave":
                this.memberLeaveInfo(); 
                break;
             case "delete_room":
                this.deleteRoomInfo();
                break;
            case "delete_group":
                this.deleteGroupInfo();
                break;
        }
      
    },
  
    //确定
    onSureClose: function(){
       
        switch(this._confirmType){
            case "memberRemove":
                this.memberRemoveBtn(this._confirmId);
                break;
            case "memberLeave":
                this.memberLeaveBtn(this._confirmId);
                break;
            case "delete_room":
                this.deleteRoomBtn();
                break;
            case "delete_group":
                this.deleteGroupBtn();
                break;
        }
        this.node.active = false;
        
        if(this._confirmId){
            this._confirmId =null;
        }
       
    },
     //取消
    onCancelClose: function(){
        this.node.active = false;
        this._confirmId = null;
    },
    //圈子请离玩家
    memberRemoveInfo(){
 
        this.tipQLabel.node.active=true;
        this.tipInfoLabel.node.active=true;
        this.tipQLabel.string='是否确定请离玩家';
        this.tipInfoLabel.string='['+this._confirmInfo.name+" ID:"+this._confirmId+"]";
    },
    memberRemoveBtn(userid){
        var clubid = cc.fy.guildMainMsg.getCurClub().clubInfo.clubid;
        var action=6;
        var msg = {userid, clubid,action};
        cc.fy.net.send("club_member_oper_request", msg);
    },
    // 设置里退出圈子
    memberLeaveInfo(){
        this.tipQLabel.node.active=true;
        this.tipInfoLabel.node.active=true;
        this.tipQLabel.string='当前退出牌友圈不需要圈主或者管理员审批。并且退出牌友圈后，将无法在此牌友圈游戏。';
        this.tipInfoLabel.string='是否确定退出？';
    },
    memberLeaveBtn(clubid){
         cc.fy.net.send("out_club", { clubid :clubid});
    },
    
    //解散房间
    deleteRoomInfo(){
        this.tipQLabel.node.active=true;
        this.tipQLabel.string='是否确定解散该房间';
        this.tipInfoLabel.node.active=true;
        this.tipInfoLabel.string='['+"房间号:"+this._confirmId+"]";
    },

    deleteRoomBtn(){
        cc.fy.net.send("club_room_del",{"roomId":this._confirmId});
    },

    //删除预设模板
    deleteGroupInfo(){
        this.tipQLabel.node.active=true;
        this.tipQLabel.string='是否确定删除该玩法';
    },

    deleteGroupBtn(){
        var curGuild =cc.fy.guildMainMsg.getCurClub();
        cc.fy.net.send("delete_group",{"level":curGuild.level,"clubId":curGuild.clubInfo.clubid,"groupId":this._confirmId});
    },
     

});
