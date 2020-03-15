var GameMsgDef = require("GameMsgDef");
cc.Class({
    extends: require("BaseModuleView"),

    properties: {
        btnWeixin:cc.Node,
        btnPYQ:cc.Node,
        btnXL:cc.Node,
        btnMW:cc.Node,

        _sharetype:1,
        _shareresult:"",

       _limitclick:false,
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
        
        game.addHandler(GameMsgDef.ID_SHOWSHAREVIEW_CTC, function(data){
            if(data.isShow == false){
                console.log("hide")
                self.hidePanel();
            }
            else{
                self.showPanel(data);
            }
        });
    },

    showPanel:function(data){
        this.node.active = true;
        if(data && data.sharetype!=null){
            this._sharetype=data.sharetype;
        }

        this.btnPYQ.active=true;
        // this.btnXL.active=true; 
        this.btnMW.active=true;
        if(this._sharetype==3){
            
        }else if(this._sharetype==4){
             this.btnPYQ.active=false;
        }else if(this._sharetype==5){
            this.btnMW.active=false;
            this.btnPYQ.active=false;
            this._shareresult=data.result;
        }else{
            this.btnXL.active=false;
            this.btnMW.active=false;
        }
       
       
    },

    //微信分享
    onShareWeixin:function(){
        
        var shareLink=null;
        var title="【乐百苏州麻将】";
        var info = "集合当地多种玩法，一键开局，享受最流畅的地方棋牌，等你来开房!";
        if(this._sharetype==1){ //普通分享
            shareLink=cc.InviteLink;
        }else if(this._sharetype==2){//连接分享，文章
            info ="全新纪元！新乐百苏州麻将强势来袭";
            title="操作不顺，疯狂卡顿，难道我真的没救了吗？";
            shareLink=cc.fy.shareMsg._shareLink;
        }else if(this._sharetype==3){ //俱乐部
            this.onClubWeichatShare();
            this.hidePanel();
            return;
        }else if(this._sharetype==4){ //游戏结算
            this.hidePanel();
            cc.fy.anysdkMgr.shareResult(1);
            return;
        }else if(this._sharetype==5){ //文字结算
            cc.fy.anysdkMgr.copyAndJump(this._shareresult, true);
            this.hidePanel();
            return;
        }

        if(shareLink==null){
            shareLink=cc.InviteLink;
        }

        cc.fy.anysdkMgr.share(title, info,shareLink,"1");
        cc.fy.anysdkMgr.onShareRecord(this._sharetype);
        this.hidePanel();
    },

    //朋友圈
    onSharePyq:function(){

           
        var shareLink=null;
         var title="【乐百苏州麻将】";
        var info = "集合当地多种玩法，一键开局，享受最流畅的地方棋牌，等你来开房!";
        if(this._sharetype==1){ //普通分享
            shareLink=cc.InviteLink;
        }else if(this._sharetype==2){//连接分享，文章
             info ="全新纪元！新乐百苏州麻将强势来袭";
            title="操作流畅，画面精致，特效酷炫，新玩法！";
            shareLink=cc.fy.shareMsg._shareLink;
        }else if(this._sharetype==3){
            this.onClubPYQShare();
            this.hidePanel();
            return;
        }else if(this._sharetype==4){ //游戏结算
            this.hidePanel();
            return;
        }

        if(shareLink==null){
            shareLink=cc.InviteLink;
        }
        
        cc.fy.anysdkMgr.share("【乐百苏州麻将】", info,shareLink,"2");
        cc.fy.anysdkMgr.onShareRecord(this._sharetype);
         this.hidePanel();
    },

      //微信分享
    onClubWeichatShare: function(){
         var title = "【牌友圈ID:";
        
        var curGuild =cc.fy.guildMainMsg.getCurClub();
        var clubInfo =curGuild.clubInfo;
        
        // 淮安 1  苏州 2  如皋 3  连云港 5 泰兴 7
        var param =  cc.InviteLink + encodeURIComponent("openPage=club&inviteCode=" + clubInfo.promo_code);
        // var userNum = this.getRoomUserNum();
        // var queStr = "";
        // if(userNum > 0 && userNum < cc.fy.gameNetMgr.seats.length){
        //     queStr = userNum + "缺" + (cc.fy.gameNetMgr.seats.length - userNum);
        // }
        console.log("param:"+param);
         cc.fy.anysdkMgr.share(title+ clubInfo.promo_code+ "】", "点击链接自动进入牌友圈", param);
    },
    
      //微信朋友圈分享
    onClubPYQShare: function(){
         var title = "【牌友圈ID:";
        
        var curGuild =cc.fy.guildMainMsg.getCurClub();
        var clubInfo =curGuild.clubInfo;
        
        // 淮安 1  苏州 2  如皋 3  连云港 5 泰兴 7
        var param =  cc.InviteLink + encodeURIComponent("openPage=club&inviteCode=" + clubInfo.promo_code);
        // var userNum = this.getRoomUserNum();
        // var queStr = "";
        // if(userNum > 0 && userNum < cc.fy.gameNetMgr.seats.length){
        //     queStr = userNum + "缺" + (cc.fy.gameNetMgr.seats.length - userNum);
        // }
        console.log("param:"+param);
         cc.fy.anysdkMgr.share(title+ clubInfo.promo_code+ "】", "点击链接自动进入牌友圈", param,"2");
    },

    //闲聊分享
    onClubXianLiaoShare: function(){
        var title = "【牌友圈ID:";
        var curGuild =cc.fy.guildMainMsg.getCurClub();
        var clubInfo =curGuild.clubInfo;

        title=title+ clubInfo.promo_code+"】";
        // 淮安 1  苏州 2  如皋 3  连云港 5 泰兴 7
        var param = "http://fyweb.51v.cn/szmj/images/icon.png";
        // var param = "https://hyjgame.51v.cn/activity/share/linkme?gameid=" + cc.GAMEID +"&link=" + "lbhamj" + "://mylink?" + encodeURIComponent("openPage=club&inviteCode=" + clubInfo.promo_code);

        cc.fy.anysdkMgr.xianLiaoShareGame(clubInfo.promo_code,"club",title,"点击链接自动进入牌友圈",param);

    },

    //闲聊
    onShareXL:function(){
      
    
        if(this._sharetype==3){
            this.onClubXianLiaoShare();
        }else if(this._sharetype==4){
            this.hidePanel(); 
            cc.fy.anysdkMgr.xianLiaoShareDataImage();
            return ;
        }else if(this._sharetype==5){ //文字结算
            cc.fy.anysdkMgr.xianLiaoShareText(this._shareresult);
        }   
        this.hidePanel(); 
    },

    //默往分享
    onShareMoWang:function(){
        if(this._sharetype==3){
            this.onClubMoWangShare();
        }else if(this._sharetype==4){
            this.hidePanel();
            cc.fy.anysdkMgr.MoWangShareDataImage();
            return ;
        }
    },
    //默往分享相关
    onClubMoWangShare:function(){
         var title = "【牌友圈ID:";
        
        var curGuild =cc.fy.guildMainMsg.getCurClub();
        var clubInfo =curGuild.clubInfo;
        
        // 淮安 1  苏州 2  如皋 3  连云港 5 泰兴 7
        var param =  cc.InviteLink + encodeURIComponent("openPage=club&inviteCode=" + clubInfo.promo_code);
        // var userNum = this.getRoomUserNum();
        // var queStr = "";
        // if(userNum > 0 && userNum < cc.fy.gameNetMgr.seats.length){
        //     queStr = userNum + "缺" + (cc.fy.gameNetMgr.seats.length - userNum);
        // }
        console.log("param:"+param);
         cc.fy.anysdkMgr.MoWangShareLink(title+ clubInfo.promo_code+ "】", "点击链接自动进入牌友圈", param);
    },
   

    //隐藏
    hidePanel:function(){
        this._shareresult="";
        this.node.active = false;
    },
    initView:function(){
        this.setHideOther(false);

         cc.fy.utils.addClickEvent(this.btnWeixin, this.node, "ShareView", "onShareWeixin");
         cc.fy.utils.addClickEvent(this.btnPYQ, this.node, "ShareView", "onSharePyq");
        //   cc.fy.utils.addClickEvent(this.btnXL, this.node, "ShareView", "onShareXL");
          cc.fy.utils.addClickEvent(this.btnMW, this.node, "ShareView", "onShareMoWang");
        
    },

    onBtnClose:function(){
        cc.fy.audioMgr.playSFX("click_return.mp3");
        this.hidePanel();
    },

     
});
