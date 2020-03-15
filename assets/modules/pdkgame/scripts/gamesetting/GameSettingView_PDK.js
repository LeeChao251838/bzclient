var GameMsgDef = require("GameMsgDef");
cc.Class({
    extends: require("BaseModuleView"),

    properties: {
        content:cc.Node,
        btn_volume: cc.Sprite,
        btn_yinxiao: cc.Sprite,
        _btnDissolve:null,
        _btnExit:null,
        _isClick:true,
    },

    onLoad: function () {
        this.initView();
        this.initEventHandlers();
        this.initButton();
    },

    initView(){
        this._btnDissolve=this.content.getChildByName("btn_jiesan");
        this._btnExit=this.content.getChildByName("btn_exit");

        cc.fy.utils.addClickEvent(this._btnDissolve, this.node, "GameSettingView_PDK", "jiesanRommClicked");
        cc.fy.utils.addClickEvent(this._btnExit, this.node, "GameSettingView_PDK", "onBtnExit");

        var btnVolume =this.content.getChildByName("btn_volume");
        if(btnVolume){
            cc.fy.utils.addClickEvent(btnVolume, this.node, "GameSettingView_PDK", "changeVoiceClicked");
        }
        var btnYinxiao =this.content.getChildByName("btn_yinxiao");
        if(btnYinxiao){
            cc.fy.utils.addClickEvent(btnYinxiao, this.node, "GameSettingView_PDK", "changeYinxiaoClicked");
        }
        var btnSkin =this.content.getChildByName("btn_changeSkin");
        if(btnSkin){
            cc.fy.utils.addClickEvent(btnSkin, this.node, "GameSettingView_PDK", "changeSkinClicked");
        }

        var btnrule =this.content.getChildByName("btn_rule");
        if(btnrule){
            cc.fy.utils.addClickEvent(btnrule, this.node, "GameSettingView_PDK", "ruleClicked");
        }

       
        
    },

    initEventHandlers:function(){
        var self = this;
        var game = cc.fy.gameNetMgr;
        
        game.addHandler(GameMsgDef.ID_SHOWGAMESETTINGPDKVIEW_CTC, function(data){
            if(data && data.isShow == false){
                self.hidePanel();
            }
            else{
                self.showPanel(data);
            }
        });
    },

    showPanel(){
        //先隐藏
        var _this=this;
        if(this._isClick){        
            this._isClick=false;
            console.log(this.node);
            this.node.active = true;
            cc.find("Canvas/gameMain/btnbox").active=false;
            this.initButton();
            var actionBy = cc.moveBy(0.2, -200, 0);          
            var seq=  cc.sequence(actionBy,cc.callFunc(function(){
                _this._isClick=true;
            }))
            this.content.runAction(seq);
        }
    },

    hidePanel:function(){
        var _this=this;
        if(this._isClick){
            this._isClick=false;
            var actionBy = cc.moveBy(0.2,200, 0);
            var seq=  cc.sequence(actionBy,cc.callFunc(function(){
                _this._isClick=true;
                _this.node.active = false;
                cc.find("Canvas/gameMain/btnbox").active=true;
            }))
            this.content.runAction(seq);
        }     
    },


    initButton(){
        if((cc.fy.gameNetMgr.gamestate == "" && cc.fy.gameNetMgr.numOfGames < 1) )//对局未开始
        {
            if (cc.fy.gameNetMgr.conf.isClubRoom) { //俱乐部都显示离开房间
                this._btnExit.active = true;
                this._btnDissolve.active = false;
            }
            else{
                if(cc.fy.gameNetMgr.isOwner()){ //房主显示解散房间
                    this._btnDissolve.active = true;
                    this._btnExit.active = false;
                }
                else{                           //普通玩家离开房间
                    this._btnExit.active = true;
                    this._btnDissolve.active = false;
                } 
            } 
        }
        else                                    //对局已开始，都为解散房间
        {
            this._btnDissolve.active = true;
            this._btnExit.active = false;
        }
        //声音控制按键
        var sfxVolume = cc.fy.localStorage.getItem("sfxVolume");  
        var bgmVolume = cc.fy.localStorage.getItem("bgmVolume");
        if(bgmVolume==0 ){          
            cc.fy.resMgr.setSpriteFrameByUrl("images/pdk/icon_voice_close",this.btn_volume);
        }else{
            cc.fy.resMgr.setSpriteFrameByUrl("images/pdk/icon_voice_open",this.btn_volume);
        }
        if(sfxVolume==0 ){          
            cc.fy.resMgr.setSpriteFrameByUrl("images/pdk/yinxiao_close",this.btn_yinxiao);
        }else{
            cc.fy.resMgr.setSpriteFrameByUrl("images/pdk/yinxiao_open",this.btn_yinxiao);
        }
    },

    
    
   
    //离开房间
    onBtnExit:function(){
        cc.fy.net.send("exit"); 
        this.hidePanel();
    },

    jiesanRommClicked: function() { 
        console.log("解散房间");
        if(cc.fy.gameNetMgr.gamestate == "" && cc.fy.gameNetMgr.numOfGames < 1 && cc.fy.gameNetMgr.isOwner()){ //对局未开始房主解散房间
            if (cc.FREEVERSION == true) {
                cc.fy.alert.show("是否确定解散房间？", function () {
                    cc.fy.net.send("dispress");
                }, true);
            } else {
                cc.fy.alert.showFK(0, function () {
                    cc.fy.net.send("dispress");
                }, true);
            }
        }else{ //对局已开始，申请解散房间
            cc.fy.net.send("dissolve_request"); 
        }   


        this.hidePanel();
    },
    closeBoxClicked: function() { 
        this.hidePanel();
    },
    changeVoiceClicked: function () {        
        var bgmVolume = cc.fy.localStorage.getItem("bgmVolume");  
        console.log(bgmVolume);          
        if(bgmVolume==0){          
            cc.fy.resMgr.setSpriteFrameByUrl("images/pdk/icon_voice_open",this.btn_volume);
            cc.fy.audioMgr.setBGMVolume(1);          
        }else{
            cc.fy.resMgr.setSpriteFrameByUrl("images/pdk/icon_voice_close",this.btn_volume);
            cc.fy.audioMgr.setBGMVolume(0);
        }
    },
    changeYinxiaoClicked: function () {        
    
        var sfxVolume = cc.fy.localStorage.getItem("sfxVolume");  
        console.log(sfxVolume);          
        if(sfxVolume==0){          
            cc.fy.resMgr.setSpriteFrameByUrl("images/pdk/yinxiao_open",this.btn_yinxiao);
            cc.fy.audioMgr.setSFXVolume(1);            
        }else{
            cc.fy.resMgr.setSpriteFrameByUrl("images/pdk/yinxiao_close",this.btn_yinxiao);
            cc.fy.audioMgr.setSFXVolume(0);
        }
    },
    changeSkinClicked: function() { 
        cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWCHANGESKIN_CTC, {isShow:true});  
        this.hidePanel();
    },
    ruleClicked: function() { 
        cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWHELPVIEW_CTC, { isShow: true, content: cc.fy.gameNetMgr.conf.type });
        this.hidePanel();
    },
 
});
