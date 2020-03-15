var GameMsgDef = require("GameMsgDef");
cc.Class({
    extends: require("BaseModuleView"),

    properties: {
       
    },

    // use this for initialization
    onLoad(){
        this.initEventHandlers();
        this.initView();
    },

    initEventHandlers(){
        var self = this;
        var game = cc.fy.gameNetMgr;
        
        game.addHandler(GameMsgDef.ID_SHOWABOUTVIEW_CTC, function(data){
            if(data.isShow == false){
                self.close();
            }
            else{
                console.log("ID_SHOWKEFUVIEW_CTC ---- ");
                self.show();
            }
        });
    },

    initView(){
       
    },

    close(){
        this.node.active = false;
    },

    show(){
        this.node.active = true;
        this.getAdultctrlUrl();
       this.getFangchenmiUrl();
       this.getHealthnoticeUrl();
    },
    getAdultctrlUrl(){
        //获取url
        if(!cc.fy.global.fangchenmiUrl) {
            var onGet = function(ret){
                if(ret.errcode !== 0){
                    console.log(ret.errmsg);
                }
                else{             
                    cc.fy.global.fangchenmiUrl = ret.msg;               
                }
            };      
            var data = {
                account:cc.fy.userMgr.account,
                sign:cc.fy.userMgr.sign,
                type:"fangchenmi",
            };
            cc.fy.http.sendRequest("/get_message", data, onGet.bind(this));
        }

    },
    getHealthnoticeUrl(){
        //获取url
        if(!cc.fy.global.healthnoticeUrl) {
            var onGet = function(ret){
                if(ret.errcode !== 0){
                    console.log(ret.errmsg);
                }
                else{             
                    cc.fy.global.healthnoticeUrl = ret.msg;               
                }
            };      
            var data = {
                account:cc.fy.userMgr.account,
                sign:cc.fy.userMgr.sign,
                type:"healthnotice",
            };
            cc.fy.http.sendRequest("/get_message", data, onGet.bind(this));
        }
    },
    getFangchenmiUrl(){
        //获取url
        if(!cc.fy.global.adultctrlUrl) {
            var onGet = function(ret){
                if(ret.errcode !== 0){
                    console.log(ret.errmsg);
                }
                else{             
                    cc.fy.global.adultctrlUrl = ret.msg;               
                }
            };      
            var data = {
                account:cc.fy.userMgr.account,
                sign:cc.fy.userMgr.sign,
                type:"adultctrl",
            };
            cc.fy.http.sendRequest("/get_message", data, onGet.bind(this));
        }
    },
    onBtnClicked1(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        //防沉迷
        // var shopUrl = cc.WebShopUrl.format(cc.fy.userMgr.userId, cc.GAMEID);
        // cc.sys.openURL(shopUrl);
        let url= cc.fy.global.fangchenmiUrl ;
        if(url){
            cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWWEBVIEWBOXVIEW_CTC, {isShow:true,url:url});
        }
    },
    onBtnClicked2(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
         //健康游戏声明
         let url= cc.fy.global.healthnoticeUrl;
         if(url){
            cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWWEBVIEWBOXVIEW_CTC, {isShow:true,url:url});
        }
        
    },
    onBtnClicked3(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        //家长监护工程
        let url= cc.fy.global.adultctrlUrl ;
        if(url){
            cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWWEBVIEWBOXVIEW_CTC, {isShow:true,url:url});
        }
    },
    onBtnClose(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.node.active = false;
    },
});