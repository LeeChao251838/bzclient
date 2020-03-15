var GameMsgDef = require("GameMsgDef");
cc.Class({
    extends: require("BaseModuleView"),

    properties: {
        textWelcome:cc.Node,
        text:cc.Label,
        spNodeWelcome:cc.Node,
        webWelcome:cc.WebView,
        _imageClickUrl:null,
        _msgs:Array,

        nodBtnList:cc.Node,
        btnItem:cc.Node,

        nullView:cc.Node,
        btn_activity_check:cc.Node,
        btn_notice_check:cc.Node,


       _currentTab:1,//1活动 2 公告

        _btnArr:[],   //页签数据
        _contentArr:[],//内容数据
        _typeArr:[],//类型
        __currentType:null,

        _data:null,//打开时传的参数
    },

    onLoad(){
        this.initEventHandlers();
        this.initView();
    },

    initEventHandlers(){
        var self = this;
        var game = cc.fy.gameNetMgr;
        
        game.addHandler(GameMsgDef.ID_SHOWPOPNOTICEVIEW_CTC, function(data){
            if(data.isShow == false){
                self.close();
            }
            else{
                console.log("ID_SHOWPOPNOTICEVIEW_CTC ---- ");
                self.show(data);
            }
        });
 
    },

    initView(){
       
    
    },
   
    show(data){
        this.node.active = true;
        //活动公告页签初始
        this._currentTab=1;
        this._data=data;
        this.showActivity();
       
        cc.fy.global.isforcenotice = false;
    },
 
    btnActivity(){
        this.changeTab(1);
    },
    btnNotice(){
        this.changeTab(2);
    },
    showActivity(){
        this.btn_activity_check.active=true;
        this.btn_notice_check.active=false;
        this.getActivityInfo();
       
    },
    getActivityInfo(){     
            if(cc.fy.global.msgActivity != null) {
                this.initButton(this._data);
                if(this._btnArr==null || this._btnArr.length==0){
                    
                    this.welcomeTypeByMsg(this._msgs.pop());
                }
            }else{
                var onGet = function(ret){
                    if(ret.errcode !== 0){
                        console.log(ret.errmsg);
                    }
                    else{
                        if(cc.fy.userMgr.welcome == null){
                            cc.fy.userMgr.welcome = {};
                        }
                        cc.fy.userMgr.welcome.version = ret.version;
                        cc.fy.userMgr.welcome.msg = ret.msg;
                        cc.fy.global.msgActivity = ret.msg;
                        this.initButton(this._data);
                        if(this._btnArr==null || this._btnArr.length==0){
                             
                            this.welcomeTypeByMsg(this._msgs.pop());
                        }
                    }
                };
                
                var data = {
                    account:cc.fy.userMgr.account,
                    sign:cc.fy.userMgr.sign,
                    type:"activity",
                };
                cc.fy.http.sendRequest("/get_message", data, onGet.bind(this));
            }
           
        
    },
    showNotice(){
        this.btn_activity_check.active=false;
        this.btn_notice_check.active=true;
 
        this.getWelcomeInfo();
    },
    getWelcomeInfo(){     
        if(cc.fy.global.msgWelcome != null) {
            this.initButton(this._data);
            if(this._btnArr==null || this._btnArr.length==0){
                
                this.welcomeTypeByMsg(this._msgs.pop());
            }
        }else{
            var onGet = function(ret){
                if(ret.errcode !== 0){
                    console.log(ret.errmsg);
                }
                else{
                    if(cc.fy.userMgr.welcome == null){
                        cc.fy.userMgr.welcome = {};
                    }
                    cc.fy.userMgr.welcome.version = ret.version;
                    cc.fy.userMgr.welcome.msg = ret.msg;
                    cc.fy.global.msgWelcome = ret.msg;
                    this.initButton(this._data);
                    if(this._btnArr==null || this._btnArr.length==0){
                        
                        this.welcomeTypeByMsg(this._msgs.pop());
                    }
                }
            };
            
            var data = {
                account:cc.fy.userMgr.account,
                sign:cc.fy.userMgr.sign,
                type:"welcome",
            };
            cc.fy.http.sendRequest("/get_message", data, onGet.bind(this));
        }
       
    
},
    initButton:function(data){
        let index=0;
        if(data.idx){
             index=data.idx
        }
       
         var buttons=this.nodBtnList.children;
         for(let i=0;i<buttons.length;i++){
             buttons[i].active=false;
         }
         console.log("msgwelcome",cc.fy.global.msgWelcome)
         console.log("msgactivity",cc.fy.global.msgActivity)
        var globalInfo=cc.fy.global.msgWelcome;
        this.nullView.active=false;
        //1活动
         if(this._currentTab==1){
            globalInfo=cc.fy.global.msgActivity;
            if(globalInfo == null || globalInfo==""){
                this.nullView.active=true;
            }
         }else{
            if(globalInfo == null || globalInfo==""){
                globalInfo= "暂无公告！";   
             }
         }
         
         if(globalInfo.indexOf("^^") == -1 ){
             this._msgs =globalInfo.split("|");
             return;
         }  
 
         
         var  strs =globalInfo.split("^^");
         this._btnArr = strs[0].split("|");
         this._typeArr = strs[1].split("|"); 
         this._contentArr = strs[2].split("|");
         console.log("strs",strs);
        
         for(let j=0;j<this._btnArr.length;j++){
             var button =buttons[j];
             if(!button){
                 button =cc.instantiate(this.btnItem);
                 this.nodBtnList.addChild(button);               
             }
             button.idx =j;
             button.active=true;
             button.getChildByName("Background").getChildByName("name").getComponent(cc.Label).string=this._btnArr[j];
             button.getChildByName("check").getChildByName("name").getComponent(cc.Label).string=this._btnArr[j];
        
             button.getComponent(cc.Toggle).isChecked=false;
             if(j==index){
                 button.getComponent(cc.Toggle).isChecked=true;
                 this._currentType=this._typeArr[index];
                 this.welcomeTypeByMsg(this._contentArr[index],this._btnArr[index]);
             }
         }   
     },
    changeTab(index){
       if(index==this._currentTab){
           return;
       }
       this._currentTab=index;
       cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
       if(index==1){
            this.showActivity()
       }else{
            this.showNotice()
       }
       
    },
 
    
    close(){
    
       
        var gonggaoTip=cc.find("Canvas/hallBg/right_set/btnNotice/icon_tishi");
        if(gonggaoTip){
            gonggaoTip.active=false;
        }
        this.node.active = false;
        
    },

    //页签点击事件
    onChangeView:function(event){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        var idx =event.target.idx;
        var contentstr =this._contentArr[idx];
        this._currentType=this._typeArr[idx];
        
        var title = this._btnArr[idx];
        this.welcomeTypeByMsg(contentstr,title);
    },

    welcomeTypeByMsg(msg,title){
       
        console.log(msg);
        // 截取点击链接
        var indexClick = msg.indexOf("&click=");
        if (indexClick > 0) {
            var msgArr = msg.split("&click=");
            if (msgArr != null && msgArr.length == 2) {
                msg = msgArr[0];
                let clickUrl = msgArr[1];

                if (clickUrl.indexOf('{room_id}') >= 0) {
                    clickUrl = clickUrl.replace(/\{room_id}/g, + cc.GAMEID);
                }
                if (clickUrl.indexOf('{guid}') >= 0) {
                    clickUrl = clickUrl.replace(/\{guid}/g, cc.fy.userMgr.userId);
                }
                if (clickUrl.indexOf('{union_id}') >= 0) {
                    clickUrl = clickUrl.replace(/\{union_id}/g, cc.fy.userMgr.unionid);
                }
                this._imageClickUrl = clickUrl;
            }
        }
        else {
            this._imageClickUrl = null;
        }

        this.textWelcome.active = false;
        this.spNodeWelcome.active = false;
        this.webWelcome.node.active = false;
        switch (this._currentType) {
           case 'text':
                this.textWelcome.active = true;
                this.initText(msg,title);
               break;
            case 'webview':
                this.webWelcome.node.active = true;
                this.webWelcome.url = msg;
               break;
            default:
                this.spNodeWelcome.active = true;
                if(this.imageLoader == null){
                    this.imageLoader = this.spNodeWelcome.getComponent("ImageLoader");
                }
                console.log("url:",msg);
                this.imageLoader.setUrl(msg);
                break;
       }
      
    },

    //初始化文字公告
    initText(msg,title){
        this.textWelcome.getChildByName("title").getComponent(cc.Label).string =title;
        this.text.string =msg;

    },
    onImageClick(){
        console.log("==>> PopNotice --> onImageClick");
        switch (this._currentType) {
            case 'url'://直接跳转链接
                if(this._imageClickUrl){
                     cc.sys.openURL(this._imageClickUrl);
                }
                break;
            case 'share':  //分享有礼      
                if(this._imageClickUrl){
                    cc.fy.shareMsg._shareLink=this._imageClickUrl;
                    cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWSHAREVIEW_CTC,{isShow:true,sharetype:2});
                }  
                break;
            case 'bindactivity':  //绑定有礼      
                this.getBindActivityURL();
                break;
        }
 
            // cc.sys.openURL("https://itunes.apple.com/us/app/%E9%A3%8E%E4%BA%91%E4%BA%B3%E5%B7%9E%E9%BA%BB%E5%B0%86-%E6%99%BA%E8%83%BD%E7%89%88/id1255171575");
            //cc.sys.openURL(this._imageClickUrl);
            //cc.fy.anysdkMgr.share("【乐百淮安麻将】", info,cc.SHAREWXBOOK); 
    },
    getBindActivityURL(){
        // cc.fy.loading.show();
        var _url = cc.WEBURL+"api";
        var data = {};
        if(cc.fy.userMgr.userId != 0 && cc.fy.userMgr.userId != null){
            var gameid = cc.GAMEID;
            var userid = cc.fy.userMgr.userId;
            data = {
                gameid:gameid,
                userid:userid,
            };
        } 
        var onCallBack = function(ret){
            console.log("获取活动的数据", JSON.stringify(ret));
            console.log(typeof ret);
            // cc.fy.loading.hide();
            if(ret!=null){
                if(ret.code==0){
                    var url =ret.data.url;
                    cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWWEBVIEWBOXVIEW_CTC, {isShow:true,url:url,type:'invite'});
                }else{
                    cc.fy.hintBox.show("暂无活动");
                }
            }
        };
            
        cc.fy.http.sendRequest("/game/activity_url", data, onCallBack, _url, 3, null, true);
    },

    onBtnClose(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.close();
        if(cc.fy.global.isforceZhaomu ){
            cc.fy.global.isforceZhaomu = false;
            cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWZHAOMUVIEW_CTC, {isShow:true});
        }
    },
  
});
