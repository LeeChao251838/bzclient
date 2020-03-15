var ConstsDef = require("ConstsDef");
cc.Class({
    extends: require('Item'),

    properties: {
       
        imageNode:cc.Node,
        imageBg:cc.Node,
        nameNode:cc.Node,
        idNode:cc.Node,
        onlineLabel:cc.Node,
        online:cc.Node,
        gaming:cc.Node,
        btnOp:cc.Node,
        btnLabel:cc.Label,
        quanzhu:cc.Node,
        guanli:cc.Node,
        memberNode:cc.Node,
        _memberData:null,
    },

    updateItem:function(index, data){
        this._super(index, data);
        this.node.active = true;
        this._memberData=data;
        
        var imageloader =this.imageNode.getComponent("ImageLoader");
         //先初始化默认头像
        cc.fy.resMgr.setSpriteFrameByUrl(ConstsDef.URL_ATLAS_HEADIMG,this.imageNode.getComponent(cc.Sprite));
        if (data.headImg != null && data.headImg != "") {
            imageloader.setUrl(data.headImg);
        }
        var timestamp = Date.parse(new Date());       
       
        this.online.active=false;
        this.gaming.active=false;
        this.onlineLabel.active=false;
       let self="";
       let name=cc.fy.utils.subStringCN(data.userName, 12, true);
        if(data.isself==1){       
            this.online.active=true;        
            this.imageBg.color=new cc.Color(255,255,255);
            this.imageBg.getComponent(cc.Button).interactable=true;
            this.imageNode.color=new cc.Color(255,255,255);
            this.imageNode.getComponent(cc.Button).interactable=true;        
            this.nameNode.color=new cc.Color(116,29,17);
            this.idNode.color=new cc.Color(116,29,17);
            name=cc.fy.utils.subStringCN(data.userName, 10, true);
            self=" (我)";
        }else{
            //
            if(data.isplaying == 1){
                this.gaming.active=true;
                this.imageBg.color=new cc.Color(255,255,255);
                this.imageBg.getComponent(cc.Button).interactable=true;
                this.imageNode.color=new cc.Color(255,255,255);
                this.imageNode.getComponent(cc.Button).interactable=true;        
                this.nameNode.color=new cc.Color(116,29,17);
                this.idNode.color=new cc.Color(116,29,17);
            }else{
                if(data.offlineTime == 0){
                    this.online.active=true;
                    this.imageBg.color=new cc.Color(255,255,255);
                    this.imageBg.getComponent(cc.Button).interactable=true;
                    this.imageNode.color=new cc.Color(255,255,255);
                    this.imageNode.getComponent(cc.Button).interactable=true;        
                    this.nameNode.color=new cc.Color(116,29,17);
                    this.idNode.color=new cc.Color(116,29,17);
                }
                else{
                    var statestring = "";
                    this.onlineLabel.active=true;
                    statestring ='最近在线:'+ this.formatDuring(timestamp - data.offlineTime)+'前';
                    this.onlineLabel.getComponent(cc.Label).string = statestring;
                    this.imageBg.color=new cc.Color(99,99,99);
                    this.imageBg.getComponent(cc.Button).interactable=false;
                    this.imageNode.color=new cc.Color(99,99,99);
                    this.imageNode.getComponent(cc.Button).interactable=false;        
                    this.nameNode.color=new cc.Color(99,99,99);
                    this.idNode.color=new cc.Color(99,99,99);
    
                }
            }        
        }
        this.nameNode.getComponent(cc.Label).string = name+self;
        this.idNode.getComponent(cc.Label).string ='ID:'+ data.userId;
        
       
        this.quanzhu.active=false;
        this.guanli.active=false;
 
        if (data.level == 1) {
            this.quanzhu.active=true;
        }
        else if (data.level == 2) {
            this.guanli.active=true;
        }
      
        
      
        var curGuild=cc.fy.guildMainMsg.getCurClub();
        this.btnOp.active=false;
        let selfLevel=curGuild.level;


        if(selfLevel>=1&&data.userId!=cc.fy.userMgr.userId){
          
            // 会长
            if (selfLevel == 1) {
                this.btnOp.active=true;
                this.btnOp.idx = index;
                this.btnLabel.string="操作";
                this.btnOp.isRemove=false; 
               
               
            }else{
                //管理
                //被操作的是普通成员才能踢出
                if(data.level<1){  
                    this.btnOp.active=true;
                    this.btnOp.idx = index;
                    this.btnOp.isRemove=true;  
                    this.btnLabel.string="踢出";
                   
                }       
            }
          
        }
   
    },

   
    formatDuring:function (mss) {
        var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
        if (minutes == 0) {
            return  " 1分钟 ";
        }
        var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        if (hours == 0) {
            return  minutes + "分钟";
        }
        var days = parseInt(mss / (1000 * 60 * 60 * 24));
        if (days == 0) {
            return hours + "小时" + minutes + "分钟";
        }
        else if (days >= 7) {
            return "7天";
        }
        return days + "天";
    },
});
