cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        _mima:null,
        _mimaIndex:0,
        _agreementChecked:true,

        btnDebug:cc.Node,
        serverList:cc.Node,
        
    },

    // use this for initialization
    onLoad: function () {
        if(!cc.fy){
            cc.director.loadScene("loading");
            return;
        }

        //首先它是测试服的，开着debug就让他先选择服务器
        if(cc.DEBUGBTN == true){
            this.btnDebug.active=true;
        }

        cc.fy.http.url = cc.fy.http.master_url;
        cc.fy.net.addHandler('push_need_create_role',function(){
            console.log("onLoad:push_need_create_role");
            cc.director.loadScene("createrole");
        });
        
        this.initVoice();
        this._mima = ["A","A","B","B","A","B","A","B","A","A","A","B","B","B"];

        var btn_yk = this.node.getChildByName("btn_yk");
        var btn_wx = this.node.getChildByName("btn_wx");
        
        if( (cc.sys.os == cc.sys.OS_IOS)  && cc.FREEVERSION)
        {
            btn_yk.active =true;
            btn_yk.y = btn_wx.y;
            btn_wx.active = false;
        }
        else
        { 
            btn_yk.active = true;
            // btn_yk.active = false;
            // btn_wx.y = btn_yk.y;
            btn_wx.active = true;
        }

        if(cc.fy.anysdkMgr.isWXAppInstalled() == 0 || cc.fy.anysdkMgr.isWXAppInstalled() == 1){
            btn_yk.active = false;
        }

        // if (cc.fy.anysdkMgr.isXianliaoInstalled() == "true") {
        //     cc.FREECHAT = true;
        // }

        if(cc.DEBUGBTN || !cc.sys.isNative || cc.sys.os == cc.sys.OS_WINDOWS){
           //测试用代码
            btn_yk.active = true;
            // btn_yk.y = -108;
            btn_wx.active = true;
            // btn_wx.y = -181;
        }
        
        if(cc.sys.os == cc.sys.OS_ANDROID && cc.DEBUGBTN == false){
            btn_yk.active = false;
        }

        if(cc.sys.os == cc.sys.OS_IOS && cc.DEBUGBTN == false){
            btn_yk.active = false;
        }


        
        let localGuide=cc.fy.localStorage.getItem('localGuide');
        if(localGuide){
            switch(localGuide){
                case '1':
                    cc.fy.localStorage.setItem("localGuide",'2');                   
                    break;
                case '2':
                    cc.fy.localStorage.setItem("localGuide",'3');               
                    break;
                case '3':
                    cc.fy.localStorage.setItem("localGuide",'4');               
                    break;
            }
        }else{
            cc.fy.localStorage.setItem("localGuide",'1');
        }
        
        cc.fy.localStorage.setItem("guildClick",'0');
        // btn_yk.active=true;
    },
    initVoice(){    
        var bgmVolume = cc.fy.localStorage.getItem("bgmVolume");  
        var sfxVolume = cc.fy.localStorage.getItem("sfxVolume");            
        if(bgmVolume==0){      
            cc.fy.audioMgr.setBGMVolume(0);      
        }else{
            cc.fy.audioMgr.playBGM("bgMain.mp3");   
            cc.fy.audioMgr.setBGMVolume(1);
        }
        if(sfxVolume==0){
            cc.fy.audioMgr.setSFXVolume(0);  
        }else{
            cc.fy.audioMgr.setSFXVolume(1);
        }
    },

    //新加调试包控制按钮
    start:function(){
        // if(cc.CHANGEIP){
        //     cc.fy.userMgr.weichatAuth();
        // }else{
        
        var account =  cc.fy.localStorage.getItem("wx_account");
        var sign = cc.fy.localStorage.getItem("wx_sign");
        if(account != null && sign != null){
            var ret = {
                errcode:0,
                account:account,
                sign:sign
            }
            cc.fy.loading.show("正在登录游戏");
            cc.fy.userMgr.onAuth(ret);
        }
        

            
       // }
    },
    
    onBtnQuickStartClicked:function(){
        if(cc.DEBUG_ACCOUNT_ID == null){
            cc.fy.userMgr.guestAuth();
        }
        else{
            // 搞事情
            var account = cc.DEBUG_ACCOUNT_ID;
            var sign = "asdfdddasdfasdfasdf";
            if(account != null && sign != null){
                var ret = {
                    errcode:0,
                    account:account,
                    sign:sign
                }
                cc.fy.userMgr.onAuth(ret);
            }
        }   
    },
    
    onBtnWeichatClicked:function(){

        
        var self = this;
        cc.find("Canvas/btn_wx").getComponent(cc.Button).interactable = false;
        this.schedule(function() {
            if(this._agreementChecked )
            {
                 cc.find("Canvas/btn_wx").getComponent(cc.Button).interactable = true;
            }     
        }, 5);
        cc.fy.anysdkMgr.login();
    },
    
    onBtnAgreement:function(){
        cc.sys.openURL("http://www.hy51v.com/tiaoli.shtml");
    },
    
    onCheckAgreement:function(toggle){
        this._agreementChecked = toggle.isChecked; 

        cc.find("Canvas/btn_yk").getComponent(cc.Button).interactable  = this._agreementChecked;  
        cc.find("Canvas/btn_wx").getComponent(cc.Button).interactable = this._agreementChecked;
    },
    
   

    onBtnYinsiMent:function(){
        cc.sys.openURL("http://fyweb.17dapai.net/game/userPrivacyTreaty.html");
    },


    onBtnMIMAClicked:function(event){
        if(this._mima[this._mimaIndex] == event.target.name){
            this._mimaIndex++;
            if(this._mimaIndex == this._mima.length){
                cc.find("Canvas/btn_yk").active = true;
            }
        }
        else{
            console.log("oh ho~~~");
            this._mimaIndex = 0;
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update:function (dt) {
    //     if(cc.fy && cc.fy.userMgr && cc.fy.userMgr.logintime >= 0)
    //     {
    //         cc.fy.userMgr.logintime += dt;
    //         if(cc.fy.userMgr.logintime > 30)
    //         {
    //             var ret = {
    //                 errcode:-1,
    //                 errmsg:"服务器连接超时，请重新登录！",
    //             }
    //             cc.fy.userMgr.onAuth(ret);
    //         }
    //     }
        
    // },


    onBtnDebug:function(){
        this.serverList.active=true;
    },

    onChooseServer:function(event){
        var name = event.target.name;
        cc.REALNAMEURL = "http://106.15.64.139:32101";
        //web域名
        cc.WEBURL = "http://hatest.d51v.com/";
        if(name == "ceshi"){
            cc.URL = "http://139.224.213.39:32100"; //苏州外网测试服
        }else if(name == "jianghan"){
            cc.URL =  "http://10.224.23.52:32100"; //江汉
        }else if(name == "ankl"){
            cc.URL =  "http://10.224.23.52:32100"; //安可灵
        }
        else if(name == "zhengshi"){
            // if(cc.fy.hintBox == null){
            //     var HintBox = require("HintBox");
            //     cc.fy.hintBox = new HintBox();
            // }
            // cc.fy.hintBox.show("暂时不让你瞎搞！！！！");
            // return; 
            cc.URL = "http://fygame.hy51v.com:32100";
            cc.REALNAMEURL = "http://fygame.hy51v.com:32101";//...
            //web域名
            cc.WEBURL="http://ha.bozhouyouxi.cn/";
            cc.DEBUGBTN = false;
        }else{

        }
        // 分享房间邀请链接 测试
        cc.InviteLink = cc.WEBURL + "activity/share/linkme?gameid=" + cc.GAMEID + "&link=" + "smq" + "://mylink?";
        // 网页活动 测试
        cc.WEBAPIURL = cc.WEBURL + "api";
        // 用户行为记录 测试
        cc.ACTIONAPIURL = cc.WEBURL + "api";
        //转换URL
        cc.CHANGEURL = cc.WEBURL + "api/tools";
        // 分享链接 测试
        cc.shareURL = cc.WEBURL + "activity/share/combat_winlose?";
        cc.SHAREWEBURL = cc.WEBURL + "activity/share/combat_winlose?room_id={0}&uuid={1}";
        // 第三方商城 测试
        cc.WebShopUrl = cc.WEBURL + "activity/share/info?user_id={0}&room_id={1}";
        
       
        this.serverList.active=false;
        this.linkServer();
    },

    //手动连接服务器
    linkServer:function(){
        var data ={
             channelid:cc.CHANNELID
        };
        cc.fy.http.url = cc.URL;
        cc.fy.http.master_url = cc.URL;
        cc.fy.http.sendRequest("/get_serverinfo",data,function(ret){
            
            if(ret.errcode != null && ret.errcode != 0){
                self._stateStr = "连接失败，请检查网络";
                console.log(ret.errmsg);
                if(cc.fy.hintBox == null){
                    var HintBox = require("HintBox");
                    cc.fy.hintBox = new HintBox();
                }
                if(ret.errmsg != null)
                {
                    cc.fy.hintBox.show(ret.errmsg);
                }
            }
            else{
                 if(cc.fy.hintBox == null){
                    var HintBox = require("HintBox");
                    cc.fy.hintBox = new HintBox();
                }
                cc.fy.hintBox.show("连接服务器成功:"+cc.URL+"手动登录吧!");
                cc.fy.SI = ret;
                cc.fy.userMgr.loadUrl(cc.fy.SI);
               
                if(ret.version < cc.VERSION && parseInt(cc.fy.SI.verify) == 0)
                {
                    cc.FREEVERSION = true;
                }else
                {
                    cc.FREEVERSION = false;
                }
            }
        });
    },
});
