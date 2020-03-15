var GameMsgDef = require("GameMsgDef");
cc.Class({
    extends: require("BaseModuleView"),

    properties: {
        webviewURL:cc.WebView,
        _type:null,
        _backNode:null,
        _inviteBackNode:null,
    },

    onLoad(){
        this.initEventHandlers();
        this.initView();
    },

    initEventHandlers(){
        var self = this;
        var game = cc.fy.gameNetMgr;
        
        game.addHandler(GameMsgDef.ID_SHOWWEBVIEWBOXVIEW_CTC, function(data){
            if(data.isShow == false){
                self.close();
            }
            else{
                console.log("ID_SHOWACTIVITYVIEW_CTC ---- ");
                self.show(data);
            }
        });
     
    },

    initView(){
        // webView
        this.webviewURL.node.on('loaded', this.callback, this);
        this._backNode = cc.find("/back",this.node);
        this._inviteBackNode  = cc.find("/inviteBack",this.node);
         var copy  = cc.find("/inviteBack/copy",this.node);
        var inviteBackNode  = cc.find("/inviteBack/invite",this.node);
        cc.fy.utils.addClickEvent(copy, this.node, "WebviewBoxView", "onBtnClickedCopy");
        cc.fy.utils.addClickEvent(inviteBackNode, this.node, "WebviewBoxView", "onBtnClickedInvite");
    },

    show(data){
        console.log("webviewurl："+data.url);
        this.node.active = true;
        this.webviewURL.node.active=true;
        //  cc.fy.loading.show();
        // this.webviewURL.node.active=false;
        //不要去设置，全面屏需要拉长
       // this.webviewURL.node.scale=0;
        this.webviewURL.url='';
        if(data.url){  
           this.webviewURL.url=data.url;
        } 
        this.type=null;  
        if(data.type){
            this.type=data.type;
        }
        this._backNode.active=false;
        this._inviteBackNode.active=false;
       switch (this.type) {
           case 'invite':
               this.initInvite();
               break;
       
           default:
            this._backNode.active=true;
               break;
       }
        

    },
    //邀请活动
    initInvite(){
        this._inviteBackNode.active=true;
        var code  = cc.find("/inviteBack/enterdi/code",this.node);
        var invitecode ="";
        if(cc.fy.userMgr.invitationcode){
             invitecode =  cc.fy.userMgr.invitationcode;
        }
       code.getComponent(cc.Label).string =invitecode;
    },
    callback(){
    //    cc.fy.loading.hide();
       var _this=this;
        // setTimeout(function(){
        //     _this.webviewURL.node.scale=1;
        // },500);
    },
    
    close(){
        this.webviewURL.url="";
        this.node.active = false;
    },

    onBtnClose(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.close();
    },
    //复制邀请码打开微信
    onBtnClickedCopy(){
        if(cc.fy.userMgr.invitationcode){
            cc.fy.anysdkMgr.copyAndJump(cc.fy.userMgr.invitationcode, true);
        }
    },
    //分享微信下载链接
    onBtnClickedInvite(){
        var shareLink=null;
        var title="【乐百苏州麻将】";
        var info = "集合当地多种玩法，一键开局，享受最流畅的当地棋牌，等你来开房!";
        shareLink=cc.InviteLink;
        cc.fy.anysdkMgr.share(title, info,shareLink,"1");
       // cc.fy.anysdkMgr.onShareRecord(1);
    }
    
});
