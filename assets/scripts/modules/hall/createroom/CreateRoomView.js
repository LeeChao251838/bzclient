var GameMsgDef = require("GameMsgDef");
var ConstsDef = require("ConstsDef");
const Buffer = require('buffer').Buffer;
cc.Class({
    extends: require("BaseModuleView"),

    properties: {
        nodGameType: cc.Node,
        nodContent: cc.Node,

        _curContent: null,
        _isClub: false,

        _refreshtime: 0,
    },

    onLoad() {
        this.initEventHandlers();
        this.initView();
    },

    initEventHandlers() {
        var self = this;
        var game = cc.fy.gameNetMgr;

        game.addHandler(GameMsgDef.ID_SHOWCREATEROOMVIEW_CTC, function (data) {
            if (data.isShow == false) {
                self.close();
            }
            else {
                if (data.isClub) {
                    self.show(data.isClub);
                }
                else {
                    self.show(false);
                }
            }
        });
    },

    initView() {
        // 作为弹框模式 不隐藏其它弹框
        this.setHideOther(false);
        this.loadCreateInfo();
        this.refreshGameType();
    },

    show(isClub) {
        this._isClub = isClub;
        this.node.active = true;
        for (var i = 0; i < this.nodGameType.childrenCount; i++) {
            var nodType = this.nodGameType.children[i];
            var compRadioButton = nodType.getComponent("RadioButton");
            if (compRadioButton && compRadioButton.checked) {
                var type = parseInt(nodType.name.split("_")[1]);
                this.setContentByType(type, true);

            }
        }
        this.loadCreateInfo();
    },

    close() {
        this._isClub = false;
        this.node.active = false;
    },

    //检查该玩法是否限免
    checkIsFree: function (gametype) {
        var freedata = cc.fy.global.cardFree;
        if (freedata == null || freedata.length == 0) {
            return false;
        }
        var isFree = false;
        for (let i = 0; i < freedata.length; i++) {
            var type = freedata[i].main_type;
            if (type != gametype) {
                continue;
            }
            var time = freedata[i].time;
            time = JSON.parse(time);
            var timenow = (new Date()).getTime();

            for (let j = 0; j < time.length; j++) {
                if (timenow > time[j].starttime && timenow < time[j].endtime) {
                    isFree = true;
                    break;
                }
            }
        }
        return isFree;
    },

    refreshGameType() {
        for (var i = 0; i < this.nodGameType.childrenCount; i++) {
            var nodGameType = this.nodGameType.children[i];
            var gameType = parseInt(nodGameType.name.split("_")[1]);
            nodGameType.active = cc.XConfig[gameType];

            var icon = nodGameType.getChildByName("icon");
            icon.active = true;
            if (cc.fy.global.cardFree != null && this.checkIsFree(gameType)) {
                cc.fy.resMgr.setSpriteFrameByUrl(ConstsDef.URL_ATLAS_CREATEROOM_ICON[2], icon.getComponent(cc.Sprite));//限免
            } else {
                if (gameType == cc.GAMETYPE.PDK) {
                    cc.fy.resMgr.setSpriteFrameByUrl(ConstsDef.URL_ATLAS_CREATEROOM_ICON[3], icon.getComponent(cc.Sprite));//新玩法
                } else if (gameType == cc.GAMETYPE.SZCT || gameType == cc.GAMETYPE.SZHD) {
                    cc.fy.resMgr.setSpriteFrameByUrl(ConstsDef.URL_ATLAS_CREATEROOM_ICON[1], icon.getComponent(cc.Sprite));//热门
                } else {
                    cc.fy.resMgr.setSpriteFrameByUrl(ConstsDef.URL_ATLAS_CREATEROOM_ICON[0], icon.getComponent(cc.Sprite));//新版
                    // icon.active = false;
                }
            }
        }
    },

    update(dt) {
        this._refreshtime += dt;
        if (this._refreshtime >= 5) {
            this.refreshGameType();
            this._refreshtime = 0;
        }
    },
    onBtnOK(event) {
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        var name = event.target.name;
        this.createRoom(0, name);
    },

    onBtnForOther(event) {
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        var self = this;
        this.node.getChildByName("btn_other").getComponent(cc.Button).interactable = false;
        setTimeout(function () {
            self.node.getChildByName("btn_other").getComponent(cc.Button).interactable = true;
        }, 1000);
        this.node.active = false;
        var name = event.target.name;
        this.createRoom(1, name);
    },

    onTypeButtonClicked(event) {
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        var typeName = event.target.name;
        var type = parseInt(typeName.split("_")[1]);
        this.setContentByType(type, true);
    },

    setGameTypeByType(type) {
        for (var i = 0; i < this.nodGameType.childrenCount; i++) {
            var nodType = this.nodGameType.children[i];
            var tmpType = parseInt(nodType.name.split("_")[1]);
            nodType.getComponent(cc.Toggle).isChecked = tmpType == type;
        }
    },

    setContentByType(id, needRefresh, conf) {
        this._curType = id;
        var isExist = false;
        for (var i = 0; i < this.nodContent.childrenCount; i++) {
            var content = this.nodContent.children[i];
            if (content != null) {
                var contentName = content.name;
                var contentType = contentName.split("_")[1];
                var compName = "RoomConfigItem_" + contentType;
                var compRoomConfigItem = content.getComponent(compName);
                if (compRoomConfigItem != null) {
                    var type = compRoomConfigItem.type;
                    if (parseInt(this._curType) == parseInt(type)) {
                        isExist = true;
                    } else {
                        this.nodContent.children[i].active = false;
                    }
                }
            }
        }
        if (isExist) {
            for (var i = 0; i < this.nodContent.childrenCount; i++) {
                var content = this.nodContent.children[i];
                var contentName = content.name;
                var contentType = contentName.split("_")[1];
                var compName = "RoomConfigItem_" + contentType;
                var compRoomConfigItem = content.getComponent(compName);
                if (compRoomConfigItem != null) {
                    var type = compRoomConfigItem.type;
                    if (parseInt(this._curType) == parseInt(type)) {
                        this.nodContent.children[i].active = true;
                        this._curContent = this.nodContent.children[i];
                        if (needRefresh) {
                            if (conf != null) {
                                compRoomConfigItem.loadCreateInfo(conf);
                            }
                            compRoomConfigItem.refreshState(this._isClub);
                        }
                        break;
                    }
                }
            }
        } else {
            var prefRoomConfig = null;
            prefRoomConfig = cc.fy.resMgr.getRes(ConstsDef.URL_ROOMCONFIG[cc.URL_ROOMCONFIG[this._curType]]);
            if (prefRoomConfig) {
                var nodRoomConfig = cc.instantiate(prefRoomConfig);
                this.nodContent.addChild(nodRoomConfig);
                nodRoomConfig.active = true;
                this._curContent = nodRoomConfig;
                if (needRefresh) {
                    var compName = "RoomConfigItem_" + this._curType;
                    var compRoomConfigItem = nodRoomConfig.getComponent(compName);
                    if (compRoomConfigItem) {
                        if (conf != null) {
                            compRoomConfigItem.loadCreateInfo(conf);
                        }
                        compRoomConfigItem.refreshState(this._isClub);
                    }
                }
            }
        }
    },

    createRoom () {
        var onCreate = function (ret) {
            console.log("----------->>", ret);
            let confStr = cc.fy.localStorage.getItem("createroom_sz");
            if (confStr != null) {
                confStr = JSON.parse(confStr);
            }
            cc.fy.loading.hide();
            if (ret.errcode !== 0) {

                if (ret.errcode == 2222) {
                    cc.fy.alert.show("创建房间失败, 房卡不足！");
                }
                else if (ret.errcode == -1) {
                    if (ret.roomid) {
                        cc.fy.userMgr.enterRoom(ret.roomid);
                    } else {
                        cc.fy.alert.show("创建房间失败, (" + ret.errcode + ")" + ret.errmsg);
                    }
                }
                else {
                    if (ret.errmsg != null) {
                        var index = ret.errmsg.indexOf("已经在游戏中");
                        if (index >= 0) {
                            cc.fy.alert.show("创建房间失败, " + ret.errmsg, function () {
                                cc.game.restart();
                            });
                        } else {
                            cc.fy.alert.show("创建房间失败, " + ret.errmsg);
                        }
                    }
                }
            }
            else {
                cc.fy.gameNetMgr.connectGameServer(ret, function (ecode) {
                    if (ecode == -111) { // 超时了
                        cc.fy.alert.show("连接服务器超时，请检查网络连接！", function () {
                            cc.fy.userMgr.logOut();
                        });
                    }
                });
            }
        };

        let type = this._curType;
        let xuanzejushu = 0;
        let aagems = 0;
        let renshuIndex = 0;
        let maxCntOfPlayers = 0;
        let difen = 0;
        let wanfa = [];
        let CType = 0;

        //所有wanfa通用
        var isGps = 0;
        var curRoomConfig = this._curContent.getComponent("RoomConfigItem_" + this._curType);
        var nodRound = curRoomConfig.nodRound;
        for (var i = 0; i < nodRound.length; ++i) {
            var compRadioButton = nodRound[i].getComponent("RadioButton");
            if (compRadioButton.checked) {
                xuanzejushu = i;
                break;
            }
        }

        var nodCost = curRoomConfig.nodCost;
        for (var i = 0; i < nodCost.length; ++i) {
            var compRadioButton = nodCost[i].getComponent("RadioButton");
            if (compRadioButton && compRadioButton.checked) {
                aagems = i;
                if (i == 2) {
                    aagems = 3;
                }
                break;
            }
        }
        var nodBaseScore = curRoomConfig.nodBaseScore;
        for (var i = 0; i < nodBaseScore.length; ++i) {
            var compRadioButton = nodBaseScore[i].getComponent("RadioButton");
            if (compRadioButton && compRadioButton.checked) {
                difen = i;
                break;
            }
        }

        var nodPlayer = curRoomConfig.nodPlayer;
        for (var i = 0; i < nodPlayer.length; ++i) {
            var compRadioButton = nodPlayer[i].getComponent("RadioButton");
            if (compRadioButton && compRadioButton.checked) {
                renshuIndex = i;
                break;
            }
        }

        var nodGps = curRoomConfig.nodGps;
        if (nodGps) {
            var compBox = nodGps.getComponent(cc.Toggle);
            if (compBox) {
                isGps = compBox.isChecked;
            }
        }

        
        if (type == cc.GAMETYPE.SZCT) {    // 1 
            //根据设置改变 
            var compCheckBox = curRoomConfig.nodRule[0].getComponent(cc.Toggle);
            compCheckBox && wanfa.push(1);
        } else if (type == cc.GAMETYPE.SZHD){
            var compCheckBox = curRoomConfig.nodRule[0].getComponent(cc.Toggle);
            compCheckBox && wanfa.push(1);
        }
        
        maxCntOfPlayers = 4 - renshuIndex;
        // 大赢家付费
        aagems = (aagems == 2) ? 3 : aagems;
        var _conf = {
            type: type,                                  // 玩法类型
            xuanzejushu: xuanzejushu,                    // 局数
            aagems: aagems,                             // 房卡支付类型
            renshu:renshuIndex,
            maxCntOfPlayers: maxCntOfPlayers,
            auto_create: 0,                             //俱乐部 自动创建的房间发 1
            version: cc.VERSION,
            channelid: cc.CHANNELID,
        };

        if (type == cc.GAMETYPE.SZCT) { 
            _conf['wanfa'] = wanfa;
            _conf['difen'] = difen;
        } else if(type == cc.GAMETYPE.SZHD){
            _conf['wanfa'] = wanfa;
            delete _conf['renshu'];
        }
        let confStr = JSON.stringify(_conf);
        console.log("=======>>", confStr);
        if (this._isClub) {
            let currentGuild = cc.fy.guildMainMsg.getCurClub();
            let clubInfo = currentGuild.clubInfo;
            _conf.isClubRoom = true;
            _conf.clubId = clubInfo.clubid;
            _conf.groupId = 0;
            _conf.auto_create = 1;
            _conf.isGps = _conf.maxCntOfPlayers>2?isGps:0;
            confStr = JSON.stringify(_conf);
            let gamename = cc.fy.gameNetMgr.getGameTitle(_conf.type);
            let data = {
                clubId: clubInfo.clubid,
                conf: confStr,
                name: gamename,
                level: currentGuild.level,
                account: cc.fy.userMgr.account,
                sign: cc.fy.userMgr.sign,
            };
            cc.fy.net.send("create_group", data);
            this.close();
        } else {
            var _location = JSON.stringify(cc.fy.userMgr.geolocation);
            var newlocation = encodeURIComponent(new Buffer(_location).toString('base64'));
            let data = {
                account: cc.fy.userMgr.account,
                create_type: CType,
                sign: cc.fy.userMgr.sign,
                conf: confStr,
                location: newlocation,
                ip: cc.fy.userMgr.ip,
            };
            cc.fy.loading.show("正在创建房间");
            cc.fy.http.sendRequest("/create_private_room", data, onCreate, null, 0);
        }

        if (cc.isMJ(type)) {
            var temp = JSON.parse(confStr);
            temp.wanfa = wanfa;
            confStr = JSON.stringify(temp);
        }
        this.saveCreateInfo(confStr);
    },

    saveCreateInfo(conf) {
        // 把配置以字符串的形式保存
        if (conf != null) {
            cc.fy.localStorage.setItem("createroom_sz", conf);
        }
    },

    loadCreateInfo() {
        var confStr = cc.fy.localStorage.getItem("createroom_sz");
        if (confStr != null) {
            var conf = JSON.parse(confStr);
            this.setContentByType(conf.type, true, conf);
            this.setGameTypeByType(conf.type);
        }
        else {
            this.setContentByType(cc.GAMETYPE.PDK, true);
            this.setGameTypeByType(cc.GAMETYPE.PDK);
        }
    },
    onBtnBack() {
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this._isClub = false;
        this.node.active = false;
    },
});