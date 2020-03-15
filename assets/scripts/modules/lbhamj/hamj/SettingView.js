// "use strict";
// cc._RFpush(module, '4c04fyd89JAZY7qGjvubi+f', 'Settings');
// scripts\components\Settings.js
var GameMsgDef = require("GameMsgDef");
var ConstsDef = require('ConstsDef');
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
        languageType: cc.Node,
        _bgArr: null,
        _chooseBG: null,
        _bgType: null,
        _typeChoose: null,
        _showType: null,
        _gameGuize: null,
        CurSpriteFrame: [cc.SpriteFrame]
    },

    // use this for initialization
    onLoad: function onLoad() {
        if (cc.fy == null) {
            return;
        }
        this.initView();
        this.initEventHandlers();



    },

    onEnable() {

    },

    initEventHandlers: function () {
        var self = this;
        var game = cc.fy.gameNetMgr;

        game.addHandler(GameMsgDef.ID_SHOWMJGAMESETTINGVIEW_CTC, function (data) {
            if (data.isShow == false) {
                console.log("hide")
                self.hidePanel();
            }
            else {
                self.showPanel(data);
            }
        });
    },

    showPanel: function (data) {
        this.node.active = true
        this.node.x = cc.director.getWinSize().width / 2 + 100

        let act1 = cc.moveBy(0.3, cc.p(-450, 0)).easing(cc.easeBackOut())
        this.node.runAction(act1)
        if ((cc.fy.gameNetMgr.gamestate == "" && cc.fy.gameNetMgr.numOfGames < 1) || cc.fy.replayMgr.isReplay()) {// || cc.fy.gameNetMgr.conf.isGolds) {

            if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.GD || cc.fy.gameNetMgr.conf.type == cc.DDZ || cc.fy.gameNetMgr.conf.type == cc.PDK) {
            }
            else {
                if (cc.fy.gameNetMgr.conf.isClubRoom) {
                    this.node.getChildByName("btn_exitMJ").active = true;
                    this.node.getChildByName("btn_sqjsfj").active = false;
                }
                else {
                    if (cc.fy.gameNetMgr.isOwner()) {
                        this.node.getChildByName("btn_sqjsfj").active = true;
                        this.node.getChildByName("btn_exitMJ").active = false;
                        this.node.getChildByName("btn_sqjsfj").getChildByName('label').getComponent(cc.Sprite).spriteFrame = this.CurSpriteFrame[0]
                    }
                    else {
                        this.node.getChildByName("btn_exitMJ").active = true;
                        this.node.getChildByName("btn_sqjsfj").active = false;
                    }
                }
            }

        }
        else {
            this.node.getChildByName("btn_sqjsfj").active = true;
            this.node.getChildByName("btn_sqjsfj").getChildByName('label').getComponent(cc.Sprite).spriteFrame = this.CurSpriteFrame[1]
            this.node.getChildByName("btn_exitMJ").active = false;


        }
    },

    hidePanel: function () {
        // cc.fy.audioMgr.playSFX("click_return.mp3");
        this.node.active = false
    },

    initView: function () {
        // 作为弹框模式 不隐藏其它弹框
        // this.setHideOther(false);
        this.initButtonHandler(this.node.getChildByName("btn_exitMJ"));
        this.initButtonHandler(this.node.getChildByName("btn_sqjsfj"));
        this.initButtonHandler(this.node.getChildByName("btn_close"));
        this.initButtonHandler(this.node.getChildByName("checkVersion"));
        var slider = this.node.getChildByName("yinxiao").getChildByName("progress");
        cc.fy.utils.addSlideEvent(slider, this.node, "SettingView", "onSlided");
        var slider = this.node.getChildByName("yinyue").getChildByName("progress");
        cc.fy.utils.addSlideEvent(slider, this.node, "SettingView", "onSlided");
        var type = cc.fy.localStorage.getItem("languageType_SZ");
        if (!type) {
            type = 1;
        }
        if (type == 0) {
            this.languageType.getChildByName("Type0").getComponent("RadioButton").checked = true;
        } else if (type == 1) {
            this.languageType.getChildByName("Type2").getComponent("RadioButton").checked = true;
        }
        // } else if (type == 2) {
        //     this.languageType.getChildByName("Type2").getComponent("RadioButton").checked = true;
        // }
        this.lblColorControl(type);





        this._bgArr = [];
        var bg = cc.find("Canvas/bg");
        if (bg) {
            for (var i = 0; i < bg.childrenCount; ++i) {
                var temp = bg.children[i];
                if (temp) {
                    this._bgArr.push(temp);
                }
            }
        }
        // 背景显示类型按钮设置
        this._chooseBG = this.node.getChildByName("bgchoose");
        this._bgType = [];
        for (var i = 0; i < this._chooseBG.childrenCount; ++i) {
            var n = this._chooseBG.children[i].getComponent("RadioButton");
            if (n != null) {
                this._bgType.push(n);
            }
        }
        if (this._bgArr.length > 0) {
            this.refreshBG();
            this.setBG();
        }
        this.refreshVolume();
        if (cc.fy.sceneMgr.currentScene == "hall") {
            this.node.getChildByName("version").getComponent(cc.Label).string = cc.HOTVERSION;
            var checkVersion = this.node.getChildByName("checkVersion");
            cc.fy.utils.addClickEvent(checkVersion, this.node, "SettingView", "onBtnVersion");
        }
        // 碰杠牌型显示类型按钮设置
        if (cc.fy.sceneMgr.currentScene == "mjgame") {
            this._typeChoose = this.node.getChildByName("typeChoose");
            this._showType = [];
            for (var i = 0; i < this._typeChoose.childrenCount; ++i) {
                var n = this._typeChoose.children[i].getComponent("RadioButton");
                if (n != null) this._showType.push(n);
            }
            this.refreshShowType();

        }
    },
    onBtnVersion: function () {
        cc.game.restart();
    },
    onOpenGuize() {
        cc.fy.audioMgr.playSFX("click_return.mp3");
        // this.help.active = true;
        this.node.active = false
        // this.help.getComponent('HelpRuleView').showContent(cc.fy.gameNetMgr.conf.type)
        // this.help.getComponent('HelpRuleView').upBtnState(cc.fy.gameNetMgr.conf.type)
        cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWHELPVIEW_CTC, { isShow: true, content: cc.fy.gameNetMgr.conf.type });
    },
    refreshShowType: function () {
        var temp = cc.fy.localStorage.getItem("showType");
        if (temp != null) {
            for (var i = 0; i < this._showType.length; ++i) {
                this._showType[i].checked = i == temp;
                this._showType[i].refresh();
                this._showType[i].node.getChildByName("button").getChildByName("spr").active = i == temp;
            }
        }
        else {
            for (var i = 0; i < this._showType.length; ++i) {
                this._showType[i].checked = i == 0;
                this._showType[i].refresh();
                this._showType[i].node.getChildByName("button").getChildByName("spr").active = i == 0;
            }
            cc.fy.localStorage.setItem("showType", 0);
        }
    },


    refreshBG: function () {
        var temp = cc.fy.localStorage.getItem("bgtypeMJ");
        if (temp != null) {
            for (var i = 0; i < this._bgType.length; ++i) {
                this._bgArr[i].active = i == temp;
                this._bgType[i].checked = i == temp;
                this._bgType[i].refresh();
            }
        }
        else {
            this._bgArr[1].active = true;
            this._bgType[1].checked = true;
            this._bgType[1].refresh();
        }
    },

    setBG: function () {
        this._bgType = [];
        for (var i = 0; i < this._chooseBG.childrenCount; ++i) {
            var n = this._chooseBG.children[i].getComponent("RadioButton");
            if (n != null) {
                this._bgType.push(n);
            }
        }

        var type = 0;
        for (var i = 0; i < this._bgType.length; ++i) {
            if (this._bgType[i].checked) {
                type = i;
                break;
            }
        }

        for (var i = 0; i < this._bgArr.length; ++i) {
            if (i == type) {
                this._bgArr[i].active = true;
                this._bgType[i].node.getChildByName("button").getChildByName("spr").active = true;
            }
            else {
                this._bgArr[i].active = false;
                this._bgType[i].node.getChildByName("button").getChildByName("spr").active = false;
            }
        }
        var temp = cc.fy.localStorage.getItem("bgtypeMJ");
        if (temp == null) {
            cc.fy.localStorage.setItem("bgtypeMJ", type);
        }
    },

    onBtnBGTypeClickEvent: function (event) {
        var name = event.target.parent.name;
        var i = 0;

        if (name == "zuilv") {
            i = 0;
        }
        else if (name == "molv") {
            i = 1;
        }
        else if (name == "hui") {
            i = 2;
        }
        for (var k = 0; k < this._bgType.length; ++k) {
            if (k == i) {
                this._bgArr[k].active = true;
                this._bgType[k].node.getChildByName("button").getChildByName("spr").active = true;
            }
            else {
                this._bgArr[k].active = false;
                this._bgType[k].node.getChildByName("button").getChildByName("spr").active = false;
            }
        }
        cc.fy.localStorage.setItem("bgtypeMJ", i);
    },

    onBtnShowTypeClickEvent: function (event) {

        var name = event.target.parent.name;
        var i = 0;

        if (name == "type_0") {
            i = 0;
        }
        else if (name == "type_1") {
            i = 1;
        }
        for (var k = 0; k < this._showType.length; ++k) {
            this._showType[k].node.getChildByName("button").getChildByName("spr").active = k == i;
        }
        cc.fy.localStorage.setItem("showType", i);
        cc.fy.gameNetMgr.dispatchEvent("changShowType", { showType: i });
    },


    onClicked: function onClicked() {
        // cc.fy.audioMgr.playSFX("click_return.mp3");
        var type = cc.fy.localStorage.getItem("languageType_SZ");
        if (type == 0) {
            this.languageType.getChildByName("Type0").getComponent("RadioButton").checked = true;
        } else if (type == 1) {
            this.languageType.getChildByName("Type2").getComponent("RadioButton").checked = true;
        }
        //  else if (type == 2) {
        //     this.languageType.getChildByName("Type2").getComponent("RadioButton").checked = true;
        // }
        this.lblColorControl(type);

        let act1 = cc.moveBy(0.3, cc.p(1074, 0)).easing(cc.easeBackIn())
        this.node.runAction(cc.sequence(act1, cc.callFunc(function () { this.node.active = false; }, this)))
    },

    onSlided: function onSlided(slider) {
        if (slider.node.parent.name == "yinxiao") {
            cc.fy.audioMgr.setSFXVolume(slider.progress);
        } else if (slider.node.parent.name == "yinyue") {
            cc.fy.audioMgr.setBGMVolume(slider.progress);
        }
        this.refreshVolume();
    },
    audioBtn(eve, data) {
        cc.fy.audioMgr.playSFX("click_return.mp3");
        if (data == '1') {
            if (eve.target.parent.getComponent('RadioButton').checked) {
                cc.fy.audioMgr.setBGMVolume(1);
            } else {
                cc.fy.audioMgr.setBGMVolume(0);
            }
        } else {
            if (eve.target.parent.getComponent('RadioButton').checked) {
                cc.fy.audioMgr.setSFXVolume(1);
            } else {
                cc.fy.audioMgr.setSFXVolume(0);
            }
        }
    },

    initButtonHandler: function initButtonHandler(btn) {
        cc.fy.utils.addClickEvent(btn, this.node, "SettingView", "onBtnClicked");
    },

    refreshVolume: function refreshVolume() {

        // var yx = this.node.getChildByName("yinxiao");
        // var width = 323 * cc.fy.audioMgr.sfxVolume;
        // var progress = yx.getChildByName("progress");
        // progress.getComponent(cc.Slider).progress = cc.fy.audioMgr.sfxVolume;
        // progress.getChildByName("progress").width = width;

        // var yy = this.node.getChildByName("yinyue");
        // var width = 323 * cc.fy.audioMgr.bgmVolume;
        // var progress = yy.getChildByName("progress");
        // progress.getComponent(cc.Slider).progress = cc.fy.audioMgr.bgmVolume;
        // progress.getChildByName("progress").width = width;
        ///yy.getChildByName("btn_progress").x = progress.x + width;
        this.node.getChildByName("yinxiao").getComponent("RadioButton").check(cc.fy.audioMgr.sfxVolume)

        let checked = this.node.getChildByName("yinxiao").getComponent("RadioButton").checked
        if (checked) {
            this.node.getChildByName("yinxiao").getChildByName('voiceBtn').x = 74
        } else {
            this.node.getChildByName("yinxiao").getChildByName('voiceBtn').x = 50
        }
        this.node.getChildByName("yinyue").getComponent("RadioButton").check(cc.fy.audioMgr.bgmVolume)
        let checked1 = this.node.getChildByName("yinyue").getComponent("RadioButton").checked
        if (checked1) {
            this.node.getChildByName("yinyue").getChildByName('audioBtnclose').x = 74
        } else {
            this.node.getChildByName("yinyue").getChildByName('audioBtnclose').x = 50
        }
    },

    onBtnClicked: function onBtnClicked(event) {

        if (event.target.name == "btn_close") {
            cc.fy.audioMgr.playSFX("click_return.mp3");
            // cc.fy.audioMgr.playSFX("click_return.mp3");
            let act1 = cc.moveBy(0.5, cc.p(1074, 0)).easing(cc.easeBackIn())
            this.node.runAction(cc.sequence(act1, cc.callFunc(function () { this.node.active = false; }, this)))
        } else if (event.target.name == "btn_yx_open") {
            cc.fy.audioMgr.setSFXVolume(1.0);
            this.refreshVolume();
        } else if (event.target.name == "btn_yx_close") {
            cc.fy.audioMgr.setSFXVolume(0);
            this.refreshVolume();
        } else if (event.target.name == "btn_yy_open") {
            cc.fy.audioMgr.setBGMVolume(1);
            this.refreshVolume();
        } else if (event.target.name == "btn_yy_close") {
            cc.fy.audioMgr.setBGMVolume(0);
            this.refreshVolume();
        }
        else if (event.target.name == "btn_exit") {
            cc.fy.audioMgr.playSFX("click_return.mp3");
            cc.fy.alert.show("点击确定按钮退出到登录界面", function () {
                cc.fy.userMgr.logOut();
            }, true);
        }
        else if (event.target.name == "checkVersion") {
            cc.fy.userMgr.restart();
        } else if (event.target.name == "btn_sqjsfj") {
            if (((cc.fy.gameNetMgr.gamestate == "" && cc.fy.gameNetMgr.numOfGames < 1) || cc.fy.replayMgr.isReplay())) {//  || cc.fy.gameNetMgr.conf.isGolds)) {
                this.node.active = false
                cc.fy.alert.show("是否确定解散房间？", function () {
                    cc.fy.net.send("dispress");
                }, true);
            }
            else {
                // if(this._clickTime != null){
                //     if(Date.now() - this._clickTime < 5000){
                //         return;
                //     }
                // }
                this.node.active = false;
                // this._clickTime = Date.now();
                console.log('dissolve_request')
                cc.fy.net.send("dissolve_request");
            }


        }
        else if (event.target.name == "btn_exitMJ") {
            // cc.fy.audioMgr.playSFX("click_return.mp3");
            this.node.active = false
            if (cc.fy.gameNetMgr.conf.isClubRoom) {
                cc.fy.net.send("exit")
            } else {
                cc.fy.alert.show("返回大厅房间仍会保留！", function () {
                    cc.fy.net.send("exit");
                }, true);
            }
        }
    },

    onbtnVoiceMan: function onbtnVoiceMan() {
        cc.fy.audioMgr.playSFX("click_return.mp3");
        var i = 0;
        cc.fy.localStorage.setItem("languageType_SZ", i);
        this.lblColorControl(i);
    },

    onBtnVoiceWoman: function onBtnVoiceWoman() {
        cc.fy.audioMgr.playSFX("click_return.mp3");
        var i = 1;
        cc.fy.localStorage.setItem("languageType_SZ", i);
        this.lblColorControl(i);
    },

    onBtnVoicePTH: function onBtnVoicePTH() {
        cc.fy.audioMgr.playSFX("click_return.mp3");
        var i = 1;
        cc.fy.localStorage.setItem("languageType_SZ", i);
        this.lblColorControl(i);
    },

    lblColorControl: function (type) {
        if (type == 1) {
            this.languageType.children[0].getChildByName("title").color = new cc.Color(255, 255, 255);
            this.languageType.children[2].getChildByName("title").color = new cc.Color(255, 189, 22);
        } else {
            this.languageType.children[2].getChildByName("title").color = new cc.Color(255, 255, 255);
            this.languageType.children[0].getChildByName("title").color = new cc.Color(255, 189, 22);
        }

    },
});
// called every frame, uncomment this function to activate update callback
// update: function (dt) {

// },

// cc._RFpop();