cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...

        _voice_settings : null,
        _game_settings : null,
        _btnUpdate : null,

        _checkLanguage:null,
    },

    // use this for initialization
    onLoad: function () {
        if(cc.fy == null){
            return;
        }
       
        this._voice_settings = this.node.getChildByName("voice_settings");
        this._game_settings = this.node.getChildByName("game_settings");
        var btn_close = this.node.getChildByName("btn_close");
        this.initButtonHandler(btn_close);
        var btn_exit = this.node.getChildByName("btn_exit");
        this.initButtonHandler(btn_exit);
        var btn_quit = this.node.getChildByName("btn_quit");

        this._btnUpdate = this.node.getChildByName("btnUpdate");

        this.initButtonHandler(btn_quit);
        if(btn_quit != null && btn_exit != null){
            if(cc.sys.os == cc.sys.OS_IOS){
                btn_quit.active = false;
                btn_exit.active = true;
                btn_exit.x = 0;
            }
            else{
                btn_quit.active = true;
                btn_exit.active = true;
                btn_exit.x = -100;
            }
        }

        let voiceSettingsNode = this.node.getChildByName("voice_settings");

        voiceSettingsNode.getChildByName("yinxiao").getChildByName("yinxiaoBox").getComponent("CheckBox").checked 
            = cc.fy.audioMgr.sfxVolume == 0 ? true : false;
        voiceSettingsNode.getChildByName("yinyue").getChildByName("yinyueBox").getComponent("CheckBox").checked 
            = cc.fy.audioMgr.bgmVolume == 0 ? true : false;

        var lblHotVersion = this.node.getChildByName("version").getComponent(cc.Label);
        console.log("cc.HOTVERSION",cc.HOTVERSION);
        if(lblHotVersion){
            lblHotVersion.string = cc.HOTVERSION;
        }

       
        let self = this;

        // 语言
        this._checkLanguage = [];
        var yuzhongBox = this.node.getChildByName("voice_settings").getChildByName("yuzhong");
        this._checkLanguage[0] = yuzhongBox.getChildByName("fangyan").getComponent("RadioButton");
        this._checkLanguage[1] = yuzhongBox.getChildByName("putong").getComponent("RadioButton");
        this.setLanguageCheck();

        // this.refreshVolume();
    },

    onClicked:function()
    {
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.node.active = false;
    },

    onToggleChanged:function(event){
        var toggle = event.target.name;
        if(toggle == "toggle1"){
            cc.fy.audioMgr.setLanguageType(1);
        }
        else if(toggle == "toggle2"){
            cc.fy.audioMgr.setLanguageType(0);
        }
    },
    
    onSoundClick:function(event){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        var isOpen = event.target.getComponent("CheckBox").checked ;
        if(event.target.parent.name == "yinxiao"){
            if (isOpen) {
                console.log("open yinxiao");
                cc.fy.audioMgr.setSFXVolume(1);
            }
            else{
                console.log("close yinxiao");
                cc.fy.audioMgr.setSFXVolume(0);
            }
        }
        else if(event.target.parent.name == "yinyue"){
            if (isOpen) {
                console.log("open yinyue");
                cc.fy.audioMgr.setBGMVolume(1);
            }
            else{
                console.log("close yinyue");
                cc.fy.audioMgr.setBGMVolume(0);
            }
        }
        else if(event.target.parent.name == "yuzhong"){
            if (isOpen) {
                cc.fy.audioMgr.setLanguageType(0);
            }
            else{
                cc.fy.audioMgr.setLanguageType(1);
            }
        }
        event.target.getComponent("CheckBox").checked = !event.target.getComponent("CheckBox").checked;
        event.target.getComponent("CheckBox").refresh();
        // this.refreshVolume();
    },

    initButtonHandler:function(btn){
        if(btn != null){
            cc.fy.utils.addClickEvent(btn,this.node,"HallSettings", "onBtnClicked");
        }   

    },

    refreshVolume:function(){
        var yx = this.node.getChildByName("yinxiao");
        var width = 323 * cc.fy.audioMgr.sfxVolume;
        var progress = yx.getChildByName("progress")
        progress.getComponent(cc.Slider).progress = cc.fy.audioMgr.sfxVolume;
        progress.getChildByName("progress").width = width;  
        //yx.getChildByName("btn_progress").x = progress.x + width;
        
        
        // this._btnYYClose.active = cc.fy.audioMgr.bgmVolume > 0;
        // this._btnYYOpen.active = !this._btnYYClose.active;
        var yy = this.node.getChildByName("yinyue");
        var width = 323 * cc.fy.audioMgr.bgmVolume;
        var progress = yy.getChildByName("progress");
        progress.getComponent(cc.Slider).progress = cc.fy.audioMgr.bgmVolume; 
        
        progress.getChildByName("progress").width = width;
        //yy.getChildByName("btn_progress").x = progress.x + width;
        // console.log("==>> xxxxxxx --> " + cc.fy.audioMgr.languageType);
        var toggle1 = this.node.getChildByName("toggleGroup").getChildByName("toggle1").getComponent(cc.Toggle);
        toggle1.isChecked = cc.fy.audioMgr.languageType == 0;
        var toggle2 = this.node.getChildByName("toggleGroup").getChildByName("toggle2").getComponent(cc.Toggle);
        toggle2.isChecked = cc.fy.audioMgr.languageType == 1;
    },
    
    onBtnClicked:function(event){
        if(event.target.name == "btn_close"){
            this.node.active = false;
        }
        else if(event.target.name == "btn_exit"){
            cc.fy.alert.show("是否退出？", function(){
                cc.fy.userMgr.logOut(); 
            }, true);
        }
        else if(event.target.name == "btn_exitLogin"){
            cc.fy.alert.show("是否退出？", function(){
                cc.fy.userMgr.logOut(); 
            }, true);
        }
        else if(event.target.name == "btn_yx_open"){
            cc.fy.audioMgr.setSFXVolume(1.0);
            this.refreshVolume(); 
        }
        else if(event.target.name == "btn_yx_close"){
            cc.fy.audioMgr.setSFXVolume(0);
            this.refreshVolume();
        }
        else if(event.target.name == "btn_yy_open"){
            cc.fy.audioMgr.setBGMVolume(1);
            this.refreshVolume();
        }
        else if(event.target.name == "btn_yy_close"){
            cc.fy.audioMgr.setBGMVolume(0);
            this.refreshVolume();
        }
        else if(event.target.name == "btn_quit"){
            this.node.active = false;
            cc.fy.alert.show("是否退出游戏？", function(){
                cc.director.end(); 
            }, true);
        }
        else if(event.target.name == "fangyan"){
            cc.fy.audioMgr.setLanguageType(0);
        }
        else if(event.target.name == "putong"){
            cc.fy.audioMgr.setLanguageType(1);
        }
        else if (event.target.name == "btnUpdate" ) {
            console.log("check update game");
            
            this._btnUpdate.getComponent(cc.Button).interactable = false;

            cc.fy.userMgr.restart();
          
        }
        // else if(event.target.name == "btn_sqjsfj"){
        //     cc.fy.net.send("dispress");
        // }
    },

    // 设置语言
    setLanguageCheck: function(){
        if (cc.fy.audioMgr.languageType == 0) { // 方言
            this._checkLanguage[0].check(true);
            this._checkLanguage[1].check(false);

        } else {
            this._checkLanguage[0].check(false);
            this._checkLanguage[1].check(true);
        }

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
