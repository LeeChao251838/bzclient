var GameMsgDef = require("GameMsgDef");
var ConstsDef  = require("ConstsDef");
cc.Class({
    extends: require("BaseModuleView"),

    properties: {
        _groupId:null,
        _roomId:null,
        _roomState:null,
        _roomRule:null,
        _curtype: -1,               //当前玩法类型
        _playerNum:0,

        gamename:cc.Sprite,    //游戏名称
    

        conf:{
            type:cc.Node,
            default:[],
        },

        //这俩都用来调整y坐标， 配置只有一行时，上下间隔大一点
        nodState:cc.Node,
        nodConf:cc.Node,      
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
        
        game.addHandler(GameMsgDef.ID_SHOWGUILDDESKRULEVIEW_CTC, function(data){
            if(data && data.isShow == false){
                self.hidePanel();
            }
            else{
                self.showPanel(data);
            }
        });
        //初始化事件监听
         
    },

    

    initView:function(){
        // 作为弹框模式 不隐藏其它弹框
        this.setHideOther(false);
       
        //解散按钮
        var btn=this.node.getChildByName("btn");
        var jiesanbtn = btn.getChildByName("jiesanbtn");
        if(jiesanbtn){
            cc.fy.utils.addClickEvent(jiesanbtn, this.node, "GuildDeskRuleView", "onDeleteRoom");     
        }
       //加入按钮
        var joinbtn = btn.getChildByName("joinbtn");
        if(joinbtn){
        cc.fy.utils.addClickEvent(joinbtn, this.node, "GuildDeskRuleView", "onEnterRoom");
        }
        
       
    },

    showPanel:function(data){
        console.log("showpanel:",data);
        this.node.active = true;
        var content=data.content;
        this._groupId=content.groupId;
        this._roomId=content.roomId;
        this._roomRule=content.roomRule;
        this._roomState=content.roomState;
        this._curtype=content.curtype;
        this._playerNum=content.playerNum;

        this.initInfo();
        
    },

    hidePanel:function(){

        this.node.active = false;
    },
    initInfo(){
        
        var id=this.node.getChildByName('box').getChildByName('roomId').getChildByName("label").getComponent(cc.Label);
        id.string="房号："+this._roomId;
        // var state=this.node.getChildByName('state').getChildByName("label").getComponent(cc.Label);
        // state.string="状态："+ (this._roomState==1?'游戏中':'等待中');
       
        var jiesanbtn = this.node.getChildByName("btn").getChildByName("jiesanbtn");
        jiesanbtn.active=false;
        var curGuild =cc.fy.guildMainMsg.getCurClub();
        if(curGuild && curGuild.level==1 ){
            jiesanbtn.active=true;
        }
        if(curGuild && curGuild.level>1  && this._playerNum>0  ){
            jiesanbtn.active=true;
        }
         var joinbtn =this.node.getChildByName("btn").getChildByName("joinbtn");
         joinbtn.active = this._roomState!=1;
        
        this.initRule();  
    },
    initRule(){
        console.log("conf:",this._roomRule);
        console.log("url:"+ConstsDef.URL_ATLAS_GAMETYPENAME[cc.URL_ROOMCONFIG[this._curtype]]);
        cc.fy.resMgr.setSpriteFrameByUrl(ConstsDef.URL_ATLAS_GAMETYPENAME[cc.URL_ROOMCONFIG[this._curtype]],this.gamename);
        var wanfa=cc.fy.guildDeskRuleMsg.getWanfaArr(this._roomRule);
        for(let i=0;i<wanfa.length;i++){
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
        //调整Y坐标
        // if(wanfa.length<=4){
        //     this.nodState.y=90;
        //     this.nodConf.y=20;
        // }else{
        //     this.nodConf.y=82;
        //     this.nodState.y=115;
        // }
    },
      onSettingLeave () {
        console.log('setting leave',);
       
        var clubid =cc.fy.guildMainMsg.getCurClub().clubInfo.clubid;
         let content={
                id:clubid,
                type:"memberLeave",
                info:{
                    name:cc.fy.userMgr.username,
                }
            }
            cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWCONFIRMSECONDVIEW_CTC, { isShow: true,content:content});
        this.hidePanel();
    },
    //解散房间
    onDeleteRoom(event){
        console.log("state:"+this._roomState,this._playerNum);
        var oper="";
        var _id =0;
        if(this._roomState==1 ||this._playerNum>0 ){
            oper= "delete_room";
            _id= this._roomId;
            let content={
                id:_id,
                type:oper,
                info:{
                    name:cc.fy.userMgr.username,
                }
            }
            cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWCONFIRMSECONDVIEW_CTC, { isShow: true,content:content});
        }else{
            var curGuild =cc.fy.guildMainMsg.getCurClub();
            cc.fy.net.send("delete_group",{"level":curGuild.level,"clubId":curGuild.clubInfo.clubid,"groupId":this._groupId});
        }
        this.hidePanel();
    },
    onEnterRoom(event){
        cc.fy.userMgr.enterRoom(this._roomId);    
    },
    
    onBtnClose(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.node.active = false;
    },

});
