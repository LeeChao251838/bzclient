String.prototype.format = function (args) {
    if (arguments.length > 0) {
        var result = this;
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                var reg = new RegExp("({" + key + "})", "g");
                result = result.replace(reg, args[key]);
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] == undefined) {
                    return "";
                }
                else {
                    var reg = new RegExp("({[" + i + "]})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
        return result;
    }
    else {
        return this;
    }
};
// var baseButton = require('BaseButton');
cc.Class({
    extends: cc.Component,

    // use this for initialization
    onLoad: function () {
        this.initMgr();
    },

    initMgr: function () {
        if (cc.fy == null) {
            cc.fy = {};
        }
        if (cc.fy.gameNetMgr != null) {
            return;
        }
        var gameConfig = require("GameConfig");
        var AnysdkMgr = require("AnysdkMgr");
        cc.fy.anysdkMgr = new AnysdkMgr();
        cc.fy.anysdkMgr.init();

        var config = require("Config");
        cc.fy.localStorage = require("LocalStorage");
        cc.fy.localStorage.init();

        var LogMgr = require("LogMgr");
        cc.logMgr = new LogMgr();

        var activityConfig = require("ActivityConfig");
        cc.fy.actConfig = new activityConfig();

        cc.fy.http = require("HTTP");
        cc.fy.global = require("Global");
        cc.fy.net = require("Net");

        var ResMgr = require("ResMgr");
        cc.fy.resMgr = new ResMgr();

        var SceneMgr = require("SceneMgr");
        cc.fy.sceneMgr = new SceneMgr();

        var AnticheatingMgr = require("AnticheatingMgr");
        cc.fy.anticheatingMgr = new AnticheatingMgr();
        cc.fy.anticheatingMgr.initHandlers();

        var UserMgr = require("UserMgr");
        cc.fy.userMgr = new UserMgr();
        cc.fy.userMgr.init();

        var ReplayMgr = require("ReplayMgr");
        cc.fy.replayMgr = new ReplayMgr();

        var GameNetMgr = require("GameNetMgr");
        cc.fy.gameNetMgr = new GameNetMgr();



        var VoiceMgr = require("VoiceMgr");
        cc.fy.voiceMgr = new VoiceMgr();
        cc.fy.voiceMgr.init();

        var AudioMgr = require("AudioMgr");
        cc.fy.audioMgr = new AudioMgr();
        cc.fy.audioMgr.init();

        var Utils = require("Utils");
        cc.fy.utils = new Utils();

        var HintBox = require("HintBox");
        cc.fy.hintBox = new HintBox();

        var Alert = require("Alert");
        cc.fy.alert = new Alert();

        var Loading = require("Loading");
        cc.fy.loading = new Loading();

        // 游戏模块
        var GameModules = require("GameModules");
        GameModules.init();

        cc.args = this.urlParse();

        // if(cc.sys.os == cc.sys.OS_IOS){
        cc.fy.anysdkMgr.startGeoLocation();    // 启动定位
        // }
    },

    urlParse: function () {
        var params = {};
        if (window.location == null) {
            return params;
        }
        var name, value;
        var str = window.location.href; //取得整个地址栏
        var num = str.indexOf("?")
        str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]

        var arr = str.split("&"); //各个参数放到数组里
        for (var i = 0; i < arr.length; i++) {
            num = arr[i].indexOf("=");
            if (num > 0) {
                name = arr[i].substring(0, num);
                value = arr[i].substr(num + 1);
                params[name] = value;
            }
        }
        return params;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
