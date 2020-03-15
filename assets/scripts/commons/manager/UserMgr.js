var ConstsDef = require("ConstsDef");
var GameMsgDef = require('GameMsgDef');
const Buffer = require('buffer').Buffer;
cc.Class({
    extends: cc.Component,
    properties: {
        account: null,
        userId: null,
        userName: null,
        lv: 0,
        proid: null,
        exp: 0,
        coins: 0,
        gems: 0,
        sign: 0,
        ip: "",
        unionid: null,
        geolocation: null,
        sex: 0,
        roomData: null,
        isMaster: 0,

        invitationcode: 0,
        bindcode: 0,

        oldRoomId: null,
        logintime: -1,

        isInRoom: false,
    },

    init: function () {
        cc.eventManager.addCustomListener('setGeoLocation', this.setGeoLocation);
    },

    guestAuth: function () {
        cc.fy.http.url = cc.fy.http.master_url;
        var account = cc.args["account"];
        if (account == null) {
            account = cc.fy.localStorage.getItem("account");
        }

        if (account == null) {
            account = Date.now();
            cc.fy.localStorage.setItem("account", account);
        }
        if (cc.fy.loading) {
            cc.fy.loading.show("正在登录游戏");
        }
        console.log("account" + account);
        cc.fy.http.sendRequest("/guest", { account: account }, this.onAuth);
    },

    weichatAuth: function (account) {
        cc.fy.http.url = cc.fy.http.master_url;
        if (account == null) {
            account = cc.fy.localStorage.getItem("wx_account");
        }
        if (account != null) {
            if (cc.fy.loading) {
                cc.fy.loading.show("正在登录游戏");
            }
            cc.fy.http.sendRequest("/auth", { account: account }, this.onAuth);
        }
    },

    onAuth: function (ret) {
        cc.fy.http.url = cc.fy.http.master_url;
        var self = cc.fy.userMgr;
        if (ret.errcode != 0) {
            self.logintime = -1;
            console.log(ret.errmsg);
            if (cc.fy.loading) {
                cc.fy.loading.hide();
            }

            if (cc.fy.hintBox == null) {
                var HintBox = require("HintBox");
                cc.fy.hintBox = new HintBox();
            }
            if (ret.errmsg != null) {
                cc.fy.hintBox.show(ret.errmsg);
            }
            else {
                cc.fy.hintBox.show("服务器连接超时！");
            }
            cc.fy.sceneMgr.loadScene("login");
        }
        else {
            self.account = ret.account;
            self.sign = ret.sign;
            self.loadNewUrl(ret);

            self.login();
            self.logintime = 0;
        }
    },

    login: function () {
        var self = this;
        var onLogin = function (ret) {
            self.logintime = -1;
            if (ret.errcode != 0) {
                console.log(ret.errmsg);

                if (cc.fy.hintBox == null) {
                    var HintBox = require("HintBox");
                    cc.fy.hintBox = new HintBox();
                }
                if (ret.errmsg) {
                    cc.fy.hintBox.show(ret.errmsg);
                }
                else {
                    cc.fy.hintBox.show("服务器连接超时！");
                }
                cc.fy.sceneMgr.loadScene("login");
            }
            else {
                if (!ret.userid) {
                    //jump to register user info.
                    var account = cc.fy.localStorage.getItem("wx_account");
                    if (account == null) {
                        cc.fy.sceneMgr.loadScene("createrole");
                    }
                    else {
                        cc.fy.localStorage.removeItem("wx_account");
                        cc.fy.localStorage.removeItem("wx_sign");
                    }
                }
                else {
                    if (ret.lv == 2 || ret.lv == "2") {
                        if (cc.fy.alert) {
                            cc.fy.alert.show("您的帐号已经被冻结！\n\n如需解封请联系客服微信：yzmj901");
                        }
                        else {
                            if (cc.fy.hintBox == null) {
                                var HintBox = require("HintBox");
                                cc.fy.hintBox = new HintBox();
                                cc.fy.hintBox.show("您的帐号已经被冻结！\n\n如需解封请联系客服微信：yzmj901");
                            }
                        }

                        return;
                    }
                    self.account = ret.account;
                    self.userId = ret.userid;
                    self.userName = ret.name;
                    self.lv = ret.lv;
                    self.exp = ret.exp;
                    self.coins = ret.coins;
                    self.gems = ret.gems;
                    self.roomData = ret.roomid;
                    self.sex = ret.sex;
                    self.ip = ret.ip;
                    self.isMaster = ret.isMaster;
                    self.bindcode = ret.bindcode;
                    self.invitationcode = ret.invitationcode;
                    if (cc.sys.os == cc.sys.OS_ANDROID) {
                        jsb.reflection.callStaticMethod("com/javgame/smq/SYSAPI", "setUserid", "(Ljava/lang/String;)V", self.userId);
                    }
                    else if (cc.sys.os == cc.sys.OS_IOS) {
                        // jsb.reflection.callStaticMethod("AppController", "setUserid:",self.userId+"");
                    }
                    if (cc.DEBUG_ACCOUNT_ID != null) {
                        console.log("login hall");
                        cc.fy.sceneMgr.loadScene("hall");
                    }
                    else if (self.roomData != null) {
                        cc.fy.userMgr.enterRoom(self.roomData);
                        self.roomData = null;
                    }
                    else {
                        // 连接俱乐部
                        // cc.fy.guildMsg.reqGuildLoginInfo();
                        cc.fy.guildMainMsg.reqGuildLoginInfo();
                        // cc.fy.sceneMgr.loadScene("hall");
                    }

                    // 登录成功弹出公告
                    // cc.fy.anysdkMgr.onShareMomentWebActive(2);先注释掉，web压力过大
                    cc.fy.global.isforcenotice = true;
                    cc.fy.global.isforceZhaomu = true;
                    cc.fy.gameNetMgr.isDispress = false;
                    cc.fy.anysdkMgr.getGeoLocation(); // 获取地理位置
                    self.getPoint();

                }
            }
        };

        cc.fy.loading.show("正在登录游戏");
        var locationData = {
            account: this.account,
            sign: this.sign,
            // ip:cc.fy.userMgr.ip,
             channelid:cc.CHANNELID,
             hotversion:cc.HOTVERSION,
        };

        cc.fy.http.sendRequest("/login", locationData, onLogin);

    },

    create: function (name) {
        var self = this;
        var onCreate = function (ret) {
            if (ret.errcode !== 0) {
                console.log(ret.errmsg);
                if (cc.fy.hintBox == null) {
                    var HintBox = require("HintBox");
                    cc.fy.hintBox = new HintBox();
                }
                if (ret.errmsg != null) {
                    cc.fy.hintBox.show(ret.errmsg);
                }
            }
            else {
                self.login();
            }
        };

        var data = {
            account: this.account,
            sign: this.sign,
            name: name
        };
        cc.fy.http.sendRequest("/create_user", data, onCreate);
    },

    enterRoom: function (roomId, callback, dt) {
        var self = this;

        // if(cc.fy.userMgr.account.indexOf("guest_")!=-1 && cc.DEBUGBTN == false){
        //    cc.fy.hintBox.show("请先实名认证,然后重新登录");
        //    return;
        // }
        var onEnter = function (ret) {

            console.log("onEnter:", ret);
            if (ret.errcode != 0) {
                // if(ret.errcode == -1){
                //     setTimeout(function(){
                //         self.enterRoom(roomId,callback);
                //     },5000);
                // }
                // else{
                //     cc.fy.loading.hide();
                //     if(callback != null){
                //         callback(ret);
                //     }
                // }
                cc.fy.loading.hide();
                if (ret.errcode == -111) {
                    cc.fy.alert.show("进入房间超时，请检查网络连接！", function () {
                        // cc.fy.sceneMgr.loadScene("login");
                        // self.restart();
                        cc.fy.userMgr.logOut();
                    });
                    if (callback != null) {
                        callback(ret);
                    }
                }
                else if (ret.errcode == 4 && ret.errmsg == null) {
                    cc.fy.alert.show("房间已满,请刷新！");
                    if (callback != null) {
                        callback(ret);
                    }
                }
                else if (ret.errcode == 5) {
                    cc.fy.alert.show("房卡不足");
                    if (callback != null) {
                        callback(ret);
                    }
                }
                else if (ret.errcode == -2 && ret.errmsg == null) {
                    cc.fy.alert.show("该房间不存在！");
                    if (callback != null) {
                        callback(ret);
                    }
                }
                else if (ret.errcode == -1 && ret.errmsg == null) {
                    cc.fy.alert.show("该房间不存在或已解散！", function () {
                        cc.fy.gameNetMgr.roomId = null;
                        cc.fy.gameNetMgr.isOver = true;
                        cc.fy.gameNetMgr.isReturn = false;
                        cc.fy.sceneMgr.loadScene("hall");
                    });
                    if (callback != null) {
                        callback(ret);
                    }
                }
                else if (ret.errcode == 6) {
                    cc.fy.alert.show("您已被踢出该房间，无法再次进入！");
                    if (callback != null) {
                        callback(ret);
                    }
                }
                else if (ret.errcode == 7) {
                    cc.fy.alert.show("您不是圈子成员，无法进入!");
                    if (callback != null) {
                        callback(ret);
                    }
                } else if (ret.errcode == 8 || ret.errcode == 9 || ret.errcode == 10 || ret.errcode == 11 || ret.errcode == 12) {
                    if (ret.errcode == 9) {
                        cc.fy.alert.show("您与牌桌上的玩家GPS距离过近，无法进入牌桌");
                        // cc.fy.hintBox.show("您与牌桌上的玩家GPS距离过近，无法进入牌桌");
                    } else if (ret.errcode == 8) {
                        cc.fy.alert.show("您与牌桌上的玩家IP相同，无法进入牌桌");
                    } else if (ret.errcode == 10) {
                        cc.fy.alert.show("您的定位不成功，该房间需要您授权GPS定位");
                    } else if (ret.errcode = 11) {
                        cc.fy.alert.show("您的IP获取不成功，该房间需要您的IP地址");
                    } else {
                        cc.fy.alert.show("您的版本过低，请先更新");
                    }
                    if (callback) {
                        callback(ret);
                    }
                }
                else {
                    if (callback != null) {
                        callback(ret);
                    }
                    else {
                        var inroom = false;
                        if (ret.errmsg) {
                            var index = content.indexOf("已经在其他房间");
                            if (index >= 0) {
                                inroom = true;
                            }
                        }

                        if (inroom == false) {
                            cc.fy.userMgr.oldRoomId = null;
                            cc.fy.gameNetMgr.isDispress = false;
                            cc.fy.gameNetMgr.isOver = true;
                            cc.fy.gameNetMgr.reset();
                            cc.fy.gameNetMgr.clear();
                        }
                        console.log("enterRoom loadScene hall");
                        cc.fy.sceneMgr.loadScene("hall");
                    }
                }
            }
            else {
                let reqTime = dt == -1 ? 0 : null;
                cc.fy.gameNetMgr.connectGameServer(ret, function (ecode) {
                    if (dt == -1) {
                        if (ecode == 0) {
                            if (callback != null) {
                                callback(ret);
                            }
                        }
                    }
                    else if (ecode == -111) {
                        cc.fy.alert.show("进入房间超时，请检查网络连接！", function () {
                            cc.fy.userMgr.logOut();
                        });
                        ret.errcode = ecode;
                        ret.errmsg = '进入房间超时，请检查网络连接！';
                        if (callback != null) {
                            callback(ret);
                        }
                    }
                }, reqTime);
            }
        };

        var _location=JSON.stringify(cc.fy.userMgr.geolocation);

        var newlocation=encodeURIComponent(new Buffer(_location).toString('base64'));
        var data = {
            account: cc.fy.userMgr.account,
            sign: cc.fy.userMgr.sign,
            roomid: roomId,
            location:newlocation,
            ip:cc.fy.userMgr.ip,
        };

        cc.fy.loading.show("正在进入房间", dt);

        console.log("enter_private_room", data);
        cc.fy.http.sendRequest("/enter_private_room", data, onEnter, null, 2);
    },


    getUserPlayRecord: function (callback) {
        var self = this;
        var onGet = function (ret) {
            console.log("获取对局记录，胜率", ret);
            if (callback) {
                callback(ret);
            }
        };
        var data = { userid: this.userId };
        cc.fy.http.sendRequest("/usergains", data, onGet);
    },

    getUserStatus: function (callback) {
        var self = this;
        var onGet = function (ret) {
            if (ret.errcode == 0) {
                if (ret.gems != null && !isNaN(ret.gems)) {
                    self.gems = ret.gems;
                }
            }
            if (callback) {
                callback(ret);
            }
        };

        var data = {
            account: cc.fy.userMgr.account,
            sign: cc.fy.userMgr.sign,
        };
        cc.fy.http.sendRequest("/get_user_status", data, onGet);
    },

    getHistoryList: function (callback) {
        var onGet = function (ret) {
            if (ret.errcode !== 0) {
                console.log(ret.errmsg);
                if (cc.fy.hintBox == null) {
                    var HintBox = require("HintBox");
                    cc.fy.hintBox = new HintBox();
                }
                if (ret.errmsg != null) {
                    cc.fy.hintBox.show(ret.errmsg);
                }
            }
            else {
                console.log(ret.history);
                if (callback != null) {
                    callback(ret.history);
                }
            }
        };

        var data = {
            account: cc.fy.userMgr.account,
            sign: cc.fy.userMgr.sign,
        };
        cc.fy.http.sendRequest("/get_history_list", data, onGet);
    },
    getGamesOfRoom: function (uuid, callback) {
        var onGet = function (ret) {
            if (ret.errcode !== 0) {
                console.log(ret.errmsg);
                if (cc.fy.hintBox == null) {
                    var HintBox = require("HintBox");
                    cc.fy.hintBox = new HintBox();
                }
                if (ret.errmsg != null) {
                    cc.fy.hintBox.show(ret.errmsg);
                }
            }
            else {
                console.log(ret.data);
                callback(ret.data);
            }
        };

        var data = {
            account: cc.fy.userMgr.account,
            sign: cc.fy.userMgr.sign,
            uuid: uuid,
        };
        console.log("get_games_of_room uuid = " + uuid);
        cc.fy.http.sendRequest("/get_games_of_room", data, onGet);
    },

    getDetailOfGame: function (uuid, index, callback) {
        var self = this;
        var onGet = function (ret) {
            if (ret.errcode !== 0) {
                console.log(ret.errmsg);
                if (cc.fy.hintBox == null) {
                    var HintBox = require("HintBox");
                    cc.fy.hintBox = new HintBox();
                }
                if (ret.errmsg != null) {
                    cc.fy.hintBox.show(ret.errmsg);
                }
            }
            else {
                console.log(ret.data);
                callback(ret.data);
            }
        };
        if (index == null) {
            index = 0;
        }
        var data = {
            account: cc.fy.userMgr.account,
            sign: cc.fy.userMgr.sign,
            uuid: uuid,
            index: index,
        };
        cc.fy.http.sendRequest("/get_detail_of_game", data, onGet);
    },


    //根据userid获取
    getBaseInfo: function (userid, callback) {
        if (cc.fy.baseInfoMap == null) {
            cc.fy.baseInfoMap = {};
        }

        if (cc.fy.baseInfoMap[userid] != null) {
            callback(userid, cc.fy.baseInfoMap[userid]);
        }
        else {
            cc.fy.http.sendRequest('/base_info', { userid: userid, roomid: cc.fy.gameNetMgr.roomId }, function (ret) {
                var url = null;
                if (ret.headimgurl) {
                    url = ret.headimgurl;
                }
                var info = {
                    name: ret.name,
                    sex: ret.sex,
                    url: url,
                }
                cc.fy.baseInfoMap[userid] = info;
                callback(userid, info);
            }, cc.fy.http.master_url);
        }
    },

    getSharecode: function (uuid, index, callback) {
        var onGet = function (ret) {
            if (ret.errcode !== 0) {
                console.log(ret.errmsg);
                if (cc.fy.hintBox == null) {
                    var HintBox = require("HintBox");
                    cc.fy.hintBox = new HintBox();
                }
                if (ret.errmsg != null) {
                    cc.fy.hintBox.show(ret.errmsg);
                }
            }
            else {
                console.log(ret);
                callback(ret);
            }
        };

        var data = {
            userid: cc.fy.userMgr.userId,
            uuid: uuid,
            index: index,
        };
        console.log("getSharecode  /get_share_code");
        cc.fy.http.sendRequest("/get_share_code", data, onGet);
    },

    getDetailOfGameSharecode: function (share_code, callback) {
        var onGet = function (ret) {
            if (ret.errcode !== 0) {
                console.log(ret.errmsg);
                if (cc.fy.hintBox == null) {
                    var HintBox = require("HintBox");
                    cc.fy.hintBox = new HintBox();
                }
                if (ret.errmsg != null) {
                    cc.fy.hintBox.show(ret.errmsg);
                }
            }
            else {
                console.log(ret);
                callback(ret);
            }
        };

        var data = {
            share_code: share_code,
        };
        console.log("getDetailOfGameSharecode  /get_detail_of_game_sharecode");

        cc.fy.http.sendRequest("/get_detail_of_game_sharecode", data, onGet);
    },

    getGameResult: function (uuid, callback) {
        var onGet = function (ret) {
            if (ret.errcode !== 0) {
                console.log(ret.errmsg);
                if (cc.fy.hintBox == null) {
                    var HintBox = require("HintBox");
                    cc.fy.hintBox = new HintBox();
                }
                if (ret.errmsg != null) {
                    cc.fy.hintBox.show(ret.errmsg);
                }
            }
            else {
                console.log(ret);
                callback(ret);
            }
        };

        var data = {
            uuid: uuid,
        };
        cc.fy.http.sendRequest("/get_games_result", data, onGet);
    },

    setGeoLocation: function (data) {
        // var data = event.getUserData();
        if (data) {
            cc.fy.userMgr.geolocation = data;
            // if(cc.fy.gameNetMgr.gamestate != null && cc.fy.gameNetMgr.gamestate != ""){
            cc.fy.anticheatingMgr.sendGeo();
            // }
            // if(cc.fy.userinfoShow){
            // cc.fy.userinfoShow.refreshGeo(cc.fy.userMgr.geolocation, cc.fy.userMgr.userId);
            // }
            var geoData = {
                location: cc.fy.userMgr.geolocation,
                id: cc.fy.userMgr.userId
            };
            cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_REFRESHGEO_CTC, geoData);
        }
    },

    refreshGeo: function (forceWarn) {
        cc.fy.anticheatingMgr.isForceShowWarn = forceWarn;
        cc.fy.anysdkMgr.getGeoLocation(); // 获取地理位置
        if (cc.fy.userMgr.geolocation != null) {
            console.log("sendGeo");
            cc.fy.anticheatingMgr.sendGeo();
        }
    },

    // 退出登录
    logOut: function (re) {
        if (re != true) {
            cc.fy.localStorage.removeItem("wx_account");
            cc.fy.localStorage.removeItem("wx_sign");
        }
        cc.fy.sceneMgr.loadScene(ConstsDef.SCENE_NAME.LOGIN, true);
        cc.fy.net.disconnect();
        cc.fy.gameNetMgr.resetAll();
    },

    // 游戏更新 重启
    restart: function () {
        console.log("restart update");
        cc.fy.loading.show();
        cc.fy.audioMgr.stopAllAudio();

        setTimeout(function () {
            cc.game.restart();
            // cc.fy.net.disconnect();
            cc.fy.gameNetMgr.resetAll();
        }, 100);
    },

    reLogin: function () {
        console.log("reLogin");
        cc.fy.http.url = cc.fy.http.master_url;
        var account = cc.fy.localStorage.getItem("wx_account");
        var sign = cc.fy.localStorage.getItem("wx_sign");
        if (account != null && sign != null) {
            var ret = {
                errcode: 0,
                account: account,
                sign: sign
            }
            this.onAuth(ret);
        }
        else {
            this.guestAuth();
        }
    },

    getPoint: function () {
        // this._url = "http://106.15.58.131:32101";
        this._url = cc.REALNAMEURL;
        var self = this;
        var data = {
            userId: self.userId
        };
        var onRec = function (ret) {
            console.log(ret);
            cc.fy.userMgr.ip = ret.errmsg.ip;
            cc.fy.userMgr.localIP = ret.errmsg.ip;
        };

        cc.fy.http.sendRequest("/get_ip", data, onRec/*.bind(this)*/, this._url);
    },

    loadNewUrl: function (ret) {
        if (!cc.CHANGEIP) {
            cc.fy.http.url = "http://" + cc.fy.SI.hall;
            return;
        }
        if (ret.halladdr != null) {
            cc.fy.http.url = "http://" + ret.halladdr;
            cc.fy.SI.hall = ret.halladdr;
        } else {
            cc.fy.http.url = "http://" + cc.fy.SI.hall;
        }
        if (ret.accaddr != null && ret.clubhttpaddr != null && ret.clubsocketaddr != null) {
            cc.fy.SI.accAddr = ret.accaddr;
            cc.fy.http.master_url = "http://" + ret.accaddr;
            cc.fy.SI.clubHttpAddr = ret.clubhttpaddr;
            cc.fy.SI.clubSocketAddr = ret.clubsocketaddr;
            this.saveUrl(cc.fy.SI);
        }
        else {
            cc.fy.localStorage.removeItem("fy_ipconfig");
        }
    },

    // 把url保存到本地
    saveUrl: function (ret) {
        var urlData = {
            accAddr: ret.accAddr,
            hall: ret.hall,
            clubHttpAddr: ret.clubHttpAddr,
            clubSocketAddr: ret.clubSocketAddr,
        }
        cc.fy.localStorage.setItem('fy_ipconfig', JSON.stringify(urlData));
    },

    // 加载本地的url
    loadUrl: function (ret) {
        if (!cc.CHANGEIP) {
            cc.fy.localStorage.removeItem("fy_ipconfig");
            return;
        }
        var urlDataStr = cc.fy.localStorage.getItem('fy_ipconfig');
        if (urlDataStr == null) {
            return;
        }
        var urlData = JSON.parse(urlDataStr);
        console.log("urlData ", urlData);
        if (ret) {
            ret.hall = urlData.hall;
            ret.clubHttpAddr = urlData.clubHttpAddr;
            ret.clubSocketAddr = urlData.clubSocketAddr;
        }
        if (urlData.accAddr) {
            cc.fy.http.master_url = "http://" + urlData.accAddr;
            cc.fy.http.url = "http://" + urlData.accAddr;
        }
    },
});
