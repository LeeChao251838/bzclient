var ConstsDef = require("ConstsDef");
cc.Class({
    extends: require('Item'),

    properties: {
       
        typeLabel:cc.Label,
        nameLabel:cc.Label,
        idLabel:cc.Label,
        imageNode:cc.Node,

        btnAgree:cc.Node,
        btnRefuse:cc.Node,
     
        _joinData:null,
    },

    updateItem:function(index, data){
        this._super(index, data);
        this.node.active = true;
        this._joinData=data;
      
        var stateStr = data.status == 0 ? "申请加入" : "申请退出";
        this.typeLabel.string = stateStr;
        this.nameLabel.string= cc.fy.utils.subStringCN(data.name, 12, true);
        this.idLabel.string="ID:"+data.userid;
      
        var imageloader = this.imageNode.getComponent("ImageLoader");
        //先初始化默认头像
        cc.fy.resMgr.setSpriteFrameByUrl(ConstsDef.URL_ATLAS_HEADIMG,this.imageNode.getComponent(cc.Sprite));
        if (data.headimg != null && data.headimg != "") {
            imageloader.setUrl(data.headimg);
        }
      
        this.btnAgree.idx = data.userid;
        this.btnAgree.status = data.status;
        if (this.btnAgree) {
            cc.fy.utils.addClickEvent(this.btnAgree, this.node, "GuildMemberJoinItem", "ctrlJoinList");
        }
  
        this.btnRefuse.idx =  data.userid;
        this.btnRefuse.status = data.status;
        if (this.btnRefuse) {
            cc.fy.utils.addClickEvent(this.btnRefuse, this.node, "GuildMemberJoinItem", "ctrlJoinList");
        }
   
    },
   
    
    //是否同意申请操作
    ctrlJoinList:function(event){
        var  curNode = event.target;
        if (curNode.idx == null ) {
            return;
        }
        if (curNode.status == null ) {
            return;
        }
        if (this._joinData == null) {
            return;
        }
    
        var agreeState = curNode.name == "btnAgree" ? true : false;
        var curGuild = cc.fy.guildMainMsg.getCurClub().clubInfo;
        var info = {
            agree:agreeState,
            userId:curNode.idx,
            clubId:curGuild.clubid,
            status:curNode.status,
        };
        console.log(info);
        cc.fy.net.send("club_apply_join_oper",info);
    },

});
