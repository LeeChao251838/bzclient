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
        // _btnYXOpen:null,
        // _btnYXClose:null,
        // _btnYYOpen:null,
        // _btnYYClose:null,
        _voice_settings : null,
        _game_settings : null,
        _btnUpdate : null,
        _PDK_set:null,

         //
        //  _lab3d2d : null,
         _nod3d2d : null,
 
         _nodCardbg : null,
 
         _nodCard: null,
 
         _nodbg : null,
         _checkLanguage:null,
    },

    // use this for initialization
    onLoad: function () {
        if(cc.fy == null){
            return;
        }
        // if(cc.fy.gameNetMgr.conf && cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.PDK){
        //     // this._PDK_set = this.node.getChildByName()
        //     var btn_close_pdk = this.node.getChildByName("btn_close");
        //     this.initButtonHandler(btn_close_pdk);
        //     // var btn_jqfj_pdk = this.node.getChildByName("btn_sqjsfj");
        //     // this.initButtonHandler(btn_jqfj_pdk);
        // }
        // else{
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
        // voiceSettingsNode.getChildByName("yuzhong").getChildByName("yuzhongBox").getComponent("CheckBox").checked 
        //     = cc.fy.audioMgr.languageType;
        voiceSettingsNode.getChildByName("yinxiao").getChildByName("yinxiaoBox").getComponent("CheckBox").checked 
            = cc.fy.audioMgr.sfxVolume == 0 ? true : false;
        voiceSettingsNode.getChildByName("yinyue").getChildByName("yinyueBox").getComponent("CheckBox").checked 
            = cc.fy.audioMgr.bgmVolume == 0 ? true : false;

        var lblHotVersion = this.node.getChildByName("version").getComponent(cc.Label);
        console.log("cc.HOTVERSION",cc.HOTVERSION);
        if(lblHotVersion){
            lblHotVersion.string = cc.HOTVERSION;
        }

        // if (cc.fy.sceneMgr.isMJGameScene() == false) {
        //     return;
        // }

        let self = this;
        if (cc.fy.sceneMgr.isGameScene() && this._game_settings != null ) {
            setTimeout(function(){
                var cardSetting = JSON.parse(cc.fy.localStorage.getItem('card_setting'));
                if(cc.fy.utils.check3D(cardSetting)){
                    cc.fy.radiogroupmgr.check(self._game_settings.getChildByName("game3D2D").children[0].getComponent("RadioButton"));
                    cc.fy.radiogroupmgr.check(self._game_settings.getChildByName("gamecardbg").children[0].getComponent("RadioButton"));
                    cc.fy.radiogroupmgr.check(self._game_settings.getChildByName("gamecard").children[0].getComponent("RadioButton"));
                    cc.fy.radiogroupmgr.check(self._game_settings.getChildByName("gamebg").children[0].getComponent("RadioButton"));
                }
                else{
                    if (cc.fy.sceneMgr.isMJGameScene() == true) {
                        cc.fy.radiogroupmgr.check(self._game_settings.getChildByName("game3D2D").children[1].getComponent("RadioButton"));    
                    }

                    cc.fy.radiogroupmgr.check(self._game_settings.getChildByName("gamecardbg").children[cardSetting.card_back].getComponent("RadioButton"));
                    cc.fy.radiogroupmgr.check(self._game_settings.getChildByName("gamecard").children[cardSetting.card_front].getComponent("RadioButton"));
                    cc.fy.radiogroupmgr.check(self._game_settings.getChildByName("gamebg").children[cardSetting.background].getComponent("RadioButton"));
                }
            });
        }

            // 语言
        this._checkLanguage = [];
        var yuzhongBox = this.node.getChildByName("voice_settings").getChildByName("yuzhong");
        this._checkLanguage[0] = yuzhongBox.getChildByName("fangyan").getComponent("RadioButton");
        this._checkLanguage[1] = yuzhongBox.getChildByName("putong").getComponent("RadioButton");
        this.setLanguageCheck();

        if( cc.fy.sceneMgr.isMJGameScene() == true && cc.fy.gameNetMgr.conf.type != cc.GAMETYPE.PDK && cc.fy.gameNetMgr.conf.type != cc.GAMETYPE.DDZ && cc.fy.gameNetMgr.conf.type != cc.GAMETYPE.GD){
            // 选项
            // 视角
            // this._lab3d2d = this._game_settings.getChildByName("lab3D2D");
            this._nod3d2d = this._game_settings.getChildByName("game3D2D").getChildByName("3D").getChildByName("wait");

            // 牌背颜色
            this._nodCardbg = this._game_settings.getChildByName("gamecardbg");

            //牌 大小
            this._nodCard = this._game_settings.getChildByName("gamecard");

            // 桌面颜色
            this._nodbg = this._game_settings.getChildByName("gamebg");
        }
        // }
        // this.refreshVolume();
    },

    onEnable: function(){
        this.settingUpdate();
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
            cc.fy.utils.addClickEvent(btn,this.node,"Settings", "onBtnClicked");
        }   

    },

    refreshVolume:function(){
        
        // this._btnYXClose.active = cc.fy.audioMgr.sfxVolume > 0;
        // this._btnYXOpen.active = !this._btnYXClose.active;
        
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
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
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
        else if(event.target.name == "nanshen"){
            cc.fy.audioMgr.setSexType(1);
        }
        else if(event.target.name == "nvshen"){
            cc.fy.audioMgr.setSexType(0);
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

    // 设置3d选项
    settingUpdate: function(){
        if ( cc.fy.sceneMgr.isMJGameScene() == false) {
            return;
        }

        var cardSetting = JSON.parse(cc.fy.localStorage.getItem('card_setting'));
        var b3D = cc.fy.utils.isOpen3D();
        if( b3D == true){ // 3D
            // this._lab3d2d.active = true;
            this._nod3d2d.active = false;
        }
        else{
            // this._lab3d2d.active = false;
            this._nod3d2d.active = true;
        }

        if (cardSetting.card_back == 2 ) {  // 3D
            this._nodCardbg.active = false;
            this._nodCard.active = false;
            this._nodbg.active = false;
            this.resetCheck();
        } else {
            this._nodCardbg.active = true;
            this._nodCard.active = true;
            this._nodbg.active = true;

        }
       
    },
  

    // 2D恢复默认设置
    resetCheck: function(){
        console.log("重置")
        // 牌背景
        var nodeCarBg = this._game_settings.getChildByName("gamecardbg");
        
        nodeCarBg.children[0].getComponent("RadioButton").check(true);
        nodeCarBg.children[1].getComponent("RadioButton").check(false);

        // 大小
        var nodFont = this._game_settings.getChildByName("gamecard");
        nodFont.children[0].getComponent("RadioButton").check(true);
        nodFont.children[1].getComponent("RadioButton").check(false);

        //桌面
        var nodBg = this._game_settings.getChildByName("gamebg");
        nodBg.children[0].getComponent("RadioButton").check(true);
        nodBg.children[1].getComponent("RadioButton").check(false);
        nodBg.children[2].getComponent("RadioButton").check(false);

    },


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
