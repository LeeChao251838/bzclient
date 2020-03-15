
var ConstsDef = require("ConstsDef");
cc.Class({
    extends: require('Item'),

    properties: {
       
        imageNode:cc.Node,
      
        nameLabel:cc.Label,
        idLabel:cc.Label,
        timeLabel:cc.Label,
        opnameLabel:cc.Label,
        opidLabel:cc.Label,
        levelLabel:cc.Label, 
        op2Label:cc.Label,
        nameInfoLabel:cc.Label,
        opLabel:cc.Label,

        _Data:null,
    },

    updateItem:function(index, data){
        this._super(index, data);
        this.node.active = true;
        this._Data=data;
       
       


        var levelstr = "玩家";
        switch(data.level) {
            case 0:
                levelstr = "成员";
                break;
            case 1:
                levelstr = "圈主";
                break;
            case 2:
                levelstr = "管理员";
                break;
        }

        this.levelLabel.string = levelstr;
               
        let userName="";
        if (data.userName) {
            userName=data.userName;
        }
        let userId="";
        cc.fy.resMgr.setSpriteFrameByUrl(ConstsDef.URL_ATLAS_HEADIMG,this.imageNode.getComponent(cc.Sprite));
        if (data.userId) {
            userId=data.userId;
            var imageloader =this.imageNode.getComponent("ImageLoader");
            imageloader.setUserID(data.userId);
        }
     
        this.nameInfoLabel.string = userName;
        this.nameLabel.string =userName;
        this.idLabel.string = "ID:"+userId;

        this.opLabel.string =this.getActionStr(data.action);
        let operedUserName="";
        let operedUserId="";
        if(data.action != 2){ 
            if (data.operedUserName) {
               operedUserName= data.operedUserName ;
            }
            if (data.operedUserId) {
               operedUserId="(ID:"+ data.operedUserId+")" ;
            }
        } 
        this.opnameLabel.string= operedUserName;
        this.opidLabel.string =operedUserId;
         
        let op2="";
        if(data.action==10||data.level==11){
            op2="退出圈子";
        }
        this.op2Label.string=op2;
        
        let time='';
        if(data.time){
            time=this.timetrans(data.time)
        }
      
        this.timeLabel.string = time;
   
    },
   
    
    //时间戳转换成正常时间
    timetrans:function(date){
        var date = new Date(date);//如果date为13位不需要乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
        var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        var m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        var s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds());
        return Y+M+D+"   "+h+m+s;
    },

    //获取操作名称
    getActionStr:function(type){
        if (type == 0) {
            return "创建圈子";
        }
        else if (type == 1) {
            return "创建房间";
        }
        else if (type == 2) {
            return "删除房间";
        }
        else if (type == 3) {
            return "申请加入";
        }
        else if (type == 4) {
            return "接收成员";
        }
        else if (type == 5) {
            return "拒绝成员";
        }
        else if (type == 6) {
            return "开除成员";
        }
        else if (type == 7) {
            return "升职成员";
        }
        else if (type == 8) {
            return "降职成员";
        }
        else if (type == 9) {
            return "退出圈子";
        }
        else if (type == 10) {
            return "同意";
        }
        else if (type == 11) {
            return "拒绝";
        }

        // create_club: 0, //创建群
        // create_group: 1,//创建房间
        // delete_group: 2,//删除房间
        // apply: 3,       //申请
        // apply_yes: 4,   //通过申请
        // apply_no: 5,    //拒绝申请
        // remove: 6,      //开除
        // promote: 7,     //升职
        // demote: 8,      //降职
        // leave: 9,       //申请退出群
    },
   
});
