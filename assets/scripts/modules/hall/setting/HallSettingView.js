var GameMsgDef = require("GameMsgDef");
cc.Class({
    extends: require("BaseModuleView"),

    properties: {
        yinyueClose:cc.Node,
        yinyueOpen:cc.Node,
        yinxiaoClose:cc.Node,
        yinxiaoOpen:cc.Node,
        putong:cc.Node,
        fangyan:cc.Node,
        version:cc.Label,
        btnUpdate:cc.Node
    },

    // use this for initialization
    onLoad(){
        this.initEventHandlers();
        this.initView();
    },

    initEventHandlers(){
        var self = this;
        var game = cc.fy.gameNetMgr;
        
        game.addHandler(GameMsgDef.ID_SHOWHALLSETTINGVIEW_CTC, function(data){
            if(data.isShow == false){
                self.close();
            }
            else{
                console.log("ID_SHOWHALLSETTINGVIEW_CTC ---- ");
                self.show();
            }
        });
    },

    initView(){
        if(cc.fy == null){
            return;
        }
     
   
        this.version.string = cc.HOTVERSION;
        
        this.initAudio();
        this.setLanguageCheck();
    },

    show(){
        this.node.active = true;
    },

    close(){
        this.node.active = false;
    },
    initAudio(){
            let bgmVolume= cc.fy.audioMgr.bgmVolume;
            let sfxVolume= cc.fy.audioMgr.sfxVolume;
            if(bgmVolume==1){
                this.yinyueClose.active=false;
                this.yinyueOpen.active=true;
            }else{
                this.yinyueClose.active=true;
                this.yinyueOpen.active=false;
            }
            if(sfxVolume==1){
                this.yinxiaoClose.active=false;
                this.yinxiaoOpen.active=true;
            }else{
                this.yinxiaoClose.active=true;
                this.yinxiaoOpen.active=false;
            }

    },
      // 设置语言
    setLanguageCheck(){
   
        if (cc.fy.audioMgr.languageType == 0) { // 方言
           this.fangyan.getChildByName('bg_radio_check').active=true;
           this.putong.getChildByName('bg_radio_check').active=true;
        } else {
           this.fangyan.getChildByName('bg_radio_check').active=true;
           this.putong.getChildByName('bg_radio_check').active=true;
        }
    },
    onToggleChanged(event){
        var toggle = event.target.name;
        //暂时禁用方言
        // cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        if(toggle == "putong"){
            // cc.fy.audioMgr.setLanguageType(1);
        }
        else if(toggle == "fangyan"){
            // cc.fy.audioMgr.setLanguageType(0);
            // cc.fy.hintBox.show("");
        }
    },
    onyinyueClick(event){   
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        if(this.yinyueOpen.active){
            this.yinyueOpen.active=false;
            this.yinyueClose.active=true;
            cc.fy.audioMgr.setBGMVolume(0);
        }
        else{
            this.yinyueOpen.active=true;
            this.yinyueClose.active=false;
            cc.fy.audioMgr.setBGMVolume(1);
        }     
    },
    onyinxiaoClick(event){   
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        if(this.yinxiaoOpen.active){
            this.yinxiaoOpen.active=false;
            this.yinxiaoClose.active=true;
            cc.fy.audioMgr.setSFXVolume(0);
        }
        else{
            this.yinxiaoOpen.active=true;
            this.yinxiaoClose.active=false;
            cc.fy.audioMgr.setSFXVolume(1);
        }     
    },
   
    
    onBtnClicked(event){
        var name = event.target.name;
        console.log("==>> name: ", name);
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        if(name == "btn_exitLogin"){
            cc.fy.alert.show("是否确定退出登录?", function(){
                cc.fy.userMgr.logOut(); 
            }, true);
        }
        else if(name == "icon_kefu"){
            cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWKEFUVIEW_CTC, {isShow:true});
        }
        else if(name == "icon_about"){
            cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWABOUTVIEW_CTC, {isShow:true});
        }
        else if(name == "icon_update"){
            this.btnUpdate.getComponent(cc.Button).interactable = false;
            cc.fy.userMgr.restart();
        }
        else if(name == "icon_realname") {  
            let _realnameInfo = cc.fy.localStorage.getItem("realname");       
            if(_realnameInfo != null){
                var realnameInfo = JSON.parse(_realnameInfo);
                if(realnameInfo.uid != cc.fy.userMgr.userId){
                    cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWREALNAMEVIEW_CTC, {isShow:true});
                }else{
                    cc.fy.hintBox.show("您已实名认证过！");
                }
            }
            else{
                cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWREALNAMEVIEW_CTC, {isShow:true});
            }                 
 
        }
    },
    onBtnClose(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.node.active = false;
    },
  

    // onBtnAdultCtrl(){
    //     cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWHEALTHVIEW_CTC, {isShow:true, type:1});
    // },

    // onBtnHealthCtrl(){
    //     cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWHEALTHVIEW_CTC, {isShow:true, type:0});
    // },
});
