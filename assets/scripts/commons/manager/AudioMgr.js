var GameAudioConfig = require("GameAudioConfig");
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
        bgmVolume: 1.0,
        sfxVolume: 1.0,
        languageType: 1,// 语言，值为0时是方言，值为1时普通话
        sex: 0,// 用户的性别，值为1时是男性，值为0时是女性
        zhuobuType: 0,


        bgmAudioID: -1,
    },

    // use this for initialization
    init: function () {
        var t = cc.fy.localStorage.getItem("bgmVolume");
        if (t != null) {
            this.bgmVolume = parseFloat(t);
        }

        var t = cc.fy.localStorage.getItem("sfxVolume");
        if (t != null) {
            this.sfxVolume = parseFloat(t);
        }
        var t = cc.fy.localStorage.getItem("languageType_SZ");
        if (t != null) {
            
            this.languageType = parseInt(t);
            //苏州方言暂时不开放
            if(t==0){
                this.setLanguageType(1);
            }
        }
        var t = cc.fy.localStorage.getItem("shoudsex");
        if (t != null) {
            this.sex = parseInt(t);
        }

        var t = cc.fy.localStorage.getItem("zhuobuType");
        if (t != null) {
            this.zhuobuType = parseInt(t);
        }
        cc.game.on(cc.game.EVENT_HIDE, function () {
            console.log("cc.audioEngine.pauseAll");
            cc.audioEngine.pauseAll();
        });
        cc.game.on(cc.game.EVENT_SHOW, function () {
            console.log("cc.audioEngine.resumeAll");
            cc.audioEngine.resumeAll();
        });
    },

    getMainUrlByType: function (type) {
        let audioMainUrl = GameAudioConfig.getAudioMainUrl();
        if (audioMainUrl != null && type != null) {
            for (let key in audioMainUrl) {
                let typeList = audioMainUrl[key];
                if (cc.fy.utils.array_contain(typeList, type)) {
                    return key;
                }
            }
        }
        return GameAudioConfig.MainUrlYZ;
    },

    getPlayUrl: function (url) {
        return cc.url.raw(url);
    },

    getUrl: function (url, gameType, fl) {
        if (cc.fy.sceneMgr.isMJGameScene()) {
            if (url == 'click_return.mp3') {
                return cc.url.raw("resources/soundss/" + url);
            }
            return cc.url.raw("resources/soundsRes/" + url);
        }

        let manUrl = '';
        let ltype = this.languageType;
        if (fl != null) {
            ltype = fl;
        }
        if (cc.GAMEID == cc.GAMEIDCONFIG.LBHUAIAN_NEW && ltype == 0) {
            manUrl = this.getMainUrlByType(gameType);
        }
        else {
            manUrl = this.getMainUrlByType();
        }
        return this.getPlayUrl(manUrl + url);
    },

    getPDKUrl: function (url) {
        return this.getUrl("pdk/" + url);
    },

    getSexUrl: function (sex, url, gameType) {
        console.log(gameType);
        console.log(this.languageType);
        var _url = "";
        if (this.languageType == 0) {
            if (gameType == cc.GAMETYPE.GYCG || gameType == cc.GAMETYPE.GYPDZ) {
                _url = sex + "_gy/" + url;
            }
            else if (gameType == cc.GAMETYPE.YZDDH || gameType == cc.GAMETYPE.YZHZ
                || gameType == cc.GAMETYPE.YZER_YZ || gameType == cc.GAMETYPE.YZER) {
                _url = sex + "_yz/" + url;
            }
            else if (gameType == cc.GAMETYPE.JDMJ) {
                _url = sex + "_jd/" + url;
            }
            else if (gameType >= cc.GAMETYPE.SZTDH && gameType <= cc.GAMETYPE.HAMJ) {
                _url = sex + "_ha/" + url;
            }
        }
        else {
            if (gameType == cc.GAMETYPE.YZHZ || gameType == cc.GAMETYPE.YZER_YZ) {
                _url = sex + "_0/" + url;
            }
            else {
                _url = sex + "/" + url;
            }
        }
        if (gameType == cc.GAMETYPE.GD) {
            _url = sex + "_gd/" + url;
        }
        return _url;
    },

    getQuickChatSexUrl: function (sex, url, gameType) {
        var _url = "";
        if (cc.GAMEID == cc.GAMEIDCONFIG.LBHUAIAN_NEW) {
            return url;
        }
        if (this.languageType == 0) {
            //高邮话0
            if (gameType == cc.GAMETYPE.GYCG) {
                _url = sex + "_0/" + url;
            }
            //扬州话1
            else if (gameType == cc.GAMETYPE.YZDDH || gameType == cc.GAMETYPE.YZHZ
                || gameType == cc.GAMETYPE.YZER_YZ || gameType == cc.GAMETYPE.YZER) { // 邳州麻将都是方言
                _url = sex + "_1/" + url;
            }
            else if (gameType == cc.GAMETYPE.GYPDZ) {
                if (sex == "nan_chat") {
                    _url = sex + "_4/" + url;
                }
                else {
                    _url = sex + "_0/" + url;
                }
            }
            else if (gameType == cc.GAMETYPE.PDK) {
                _url = sex + "_2/" + url;
            }
            else {
                _url = sex + "_2/" + url;
            }
        }
        else {
            //普通话2
            _url = sex + "_2/" + url;
        }
        return _url;
    },

    //播放快捷语
    playChat(url, sex) {

        if (cc.fy.sceneMgr.isMJGameScene()) {
            //let url = this.getUrl(GameAudioConfig.MainUrlHA+url);

            var audioUrl = this.getUrl(url);// GameAudioConfig.MainUrlHA+url;
        } else {
            if (sex == 1) { //男
                url = "nan_chat_0/" + url;
            } else { //女
                url = "nv_chat_0/" + url;
            }
            //var audioUrl = GameAudioConfig.MainUrlYZ+url;
            var audioUrl = this.getUrl(url);
        }

        console.log('11111<>><><><<<<<<!!!!!!!!!', audioUrl)
        if (this.sfxVolume > 0) {
            var audioId = cc.audioEngine.play(audioUrl, false, this.sfxVolume);
        }
    },

    playBGM(url, type) {
        if (type == cc.GAMETYPE.PDK) {
            url = "pdk/" + url;
        }
        var audioUrl = this.getUrl(url);

        console.log(audioUrl);
        if (this.bgmAudioID >= 0) {
            cc.audioEngine.stop(this.bgmAudioID);
        }
        this.bgmAudioID = cc.audioEngine.play(audioUrl, true, this.bgmVolume);
    },

    playSFX(url, bType) {
        if (bType) {
            var type = 0;
            //获取本地语音类型
            if (cc.fy.localStorage.getItem("languageType_SZ") != null && cc.fy.localStorage.getItem("languageType_SZ") != "") {
                type = cc.fy.localStorage.getItem("languageType_SZ");
            }
            else {
                type = cc.fy.userMgr.sex;
                cc.fy.localStorage.setItem("languageType_SZ", cc.fy.userMgr.sex);
            }
            type = parseInt(type);
            if (type == 0) {
                url = "hahman/" + url;
            }
            else if (type == 1) {
                url = "pth/" + url;
            }
            else if (type == 2) {
                url = "pth/" + url;
            }
        }

        var audioUrl = this.getUrl(url);
        console.log('11111<>><><><<<<<<!!!!!!!!!', audioUrl)
        if (this.sfxVolume > 0) {
            var audioId = cc.audioEngine.play(audioUrl, false, this.sfxVolume);
        }
    },

    playBiuBiuBiu(url) {

        var audioUrl = this.getUrl(url);
        console.log('11111playBiuBiuBiu<<<<<!!!!!!!!!', audioUrl)
        if (this.sfxVolume > 0) {
            var audioId = cc.audioEngine.play(audioUrl, false, this.sfxVolume);
        }
    },


    playSFXBySex(url, seatData, gameType) {
        var sex = "nv";
        if (seatData != null) {
            if (seatData.sex == 1 || seatData.sex == "1") { // 用户的性别，值为1时是男性，值为2时是女性，值为0时是未知
                sex = "nan";
            }
        } else {
            if (this.sex == 1) { // 用户的性别，值为1时是男性，值为0时是女性
                sex = "nan";
            }
        }

        // url = this.getRandomAudioUrl(url, seatData);
        url = this.getSexUrl(sex, url, gameType);
        console.log(" url11 = " + url);
        var audioUrl = this.getUrl(url, gameType);
        console.log(" url = " + audioUrl);
        console.log(this.sfxVolume);
        if (this.sfxVolume > 0) {
            var audioId = cc.audioEngine.play(audioUrl + ".mp3", false, this.sfxVolume);
            console.log(audioUrl + ".mp3");
        }
    },

    playPDKSound: function (url, sex) {
        var _sex = "pdknv";
        if (sex != null) {
            if (sex == 1 || sex == "1") {
                _sex = "pdknan";
            }
        }

        url = _sex + "/" + url;
        var audioUrl = this.getUrl(url);

        console.log(" PDK Url = " + url);
        if (this.sfxVolume > 0) {
            var audioId = cc.audioEngine.play(audioUrl, false, this.sfxVolume);
        }
    },

    // playDDZPokerSound: function (url) {
    //     var audioUrl = this.getDDZUrl("poker_nv/" + url);

    //     console.log(" DDZ Url = " + url);
    //     if (this.sfxVolume > 0) {
    //         cc.audioEngine.play(audioUrl, false, this.sfxVolume);
    //     }
    // },

    playQuickChatBySex(url, seatData, gameType) {
        var sex = "nv_chat";
        if (seatData != null) {
            if (seatData.sex == 1 || seatData.sex == "1") { // 用户的性别，值为1时是男性，值为2时是女性，值为0时是未知
                sex = "nan_chat";
            }
        } else {
            if (this.sex == 1) { // 用户的性别，值为1时是男性，值为0时是女性
                sex = "nan_chat";
            }
        }
        url = this.getQuickChatSexUrl(sex, url, gameType);
        if (cc.GAMEID == cc.GAMEIDCONFIG.LBHUAIAN_NEW) {
            url = GameAudioConfig.MainUrlHA + url;
        }
        else {
            url = GameAudioConfig.MainUrlYZ + url;
        }

        var audioUrl = this.getPlayUrl(url);
        console.log(" url = " + audioUrl);
        if (this.sfxVolume > 0) {
            var audioId = cc.audioEngine.play(audioUrl + ".mp3", false, this.sfxVolume);
        }
    },

    // 获取随机声音路径
    getRandomAudioUrl: function (url, seatData) {
        var audioConfig = GameAudioConfig.gameAudioCountConfigWoman;
        if (seatData != null) {
            if (seatData.sex == 1 || seatData.sex == "1") { // 用户的性别，值为1时是男性，值为0时是女性，值为0时是未知
                audioConfig = GameAudioConfig.gameAudioCountConfigMan;
            }
        }
        if (audioConfig[url] == null || audioConfig[url] == 0) {
            return url;
        }
        var randomNum = Math.floor(Math.random() * audioConfig[url]) + 1;
        return url + "_" + randomNum;
    },

    setLanguageType: function (v) {
        if (this.languageType != v) {
            console.log("setlanguageType", v);
            cc.fy.localStorage.setItem("languageType_SZ", v);
            this.languageType = v;
        }
    },

    setzhuobuType: function (v) {
        if (this.zhuobuType != v) {
            cc.fy.localStorage.setItem("zhuobuType", v);
            this.zhuobuType = v;
        }
    },

    setSexType: function (v) {
        if (this.sex != v) {
            cc.fy.localStorage.setItem("shoudsex", v);
            this.sex = v;
        }
    },

    setSFXVolume: function (v) {
        if (this.sfxVolume != v) {
            cc.fy.localStorage.setItem("sfxVolume", v);
            this.sfxVolume = v;
        }
    },

    setBGMVolume: function (v) {
        if (this.bgmAudioID >= 0) {
            if (v > 0) {
                cc.audioEngine.resume(this.bgmAudioID);
            }
            else {
                cc.audioEngine.pause(this.bgmAudioID);
            }
            //cc.audioEngine.setVolume(this.bgmAudioID,this.bgmVolume);
        }
        if (this.bgmVolume != v) {
            cc.fy.localStorage.setItem("bgmVolume", v);
            this.bgmVolume = v;
            cc.audioEngine.setVolume(this.bgmAudioID, v);
        }
    },

    pauseAll: function () {
        cc.audioEngine.pauseAll();
    },

    resumeAll: function () {
        cc.audioEngine.resumeAll();
    },

    stopBGM: function () {
        if (this.bgmAudioID) {
            cc.audioEngine.stop(this.bgmAudioID);
        }
    },

    //播放音效
    // playDDZEffect: function (name) {
    //     var url = this.getDDZUrl("poker_nv/" + name);

    //     if (cc.fy.audioMgr.sfxVolume > 0) {
    //         cc.audioEngine.play(url, false, this.sfxVolume);
    //     }
    // },

    // getDDZUrl: function(url){
    //     return cc.url.raw("resources/soundss/ddzgame/sounds/" + url);
    // },

    stopAllAudio: function () {
        cc.audioEngine.stopAll();
    },
});
