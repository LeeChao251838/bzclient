var EventDispatcher = require('EventDispatcher');
var GameMsgDef = require('GameMsgDef');
var ConstsDef = require("ConstsDef");
cc._isRefreshTingData = true;

cc.Class({
    extends: cc.Component,

    properties: {
        eventTarget: {
            set: function (value) {
                this._eventTarget = value;
                if (value) {
                    this.loadSceneFinish();
                }
            },
            get: function () {
                return this._eventTarget;
            },
        },
        roomId: null,
        maxNumOfGames: 0,
        aagems: 0,
        numOfGames: 0,
        cntOfGames: 0,
        maxTypeOfGames: "局",
        numOfMJ: 0,
        numOfDouble: 0,
        seatIndex: -1,
        seats: [],
        turn: -1,
        lastTurn: -1,
        button: -1,
        dingque: -1,
        chupai: -1,
        fanbaida: -1,
        huangzhuangNum: 0,
        baida: -1,
        isDingQueing: false,
        isHuanSanZhang: false,
        gamestate: "",
        isOver: false,
        dissoveData: null,
        piaohuaData: null,
        lazhuangData: null,
        dingzhuangData: null,
        tingData: null,
        zhishaizinum: null,
        // shaizinum:null,
        isShowPiaohua: false,
        isShowLazhuang: false,
        isShowDingzhuang: false,
        isZhishaizi: false,
        isReturn: false,
        isDispress: false,
        isClickChupai: false,
        isSameAccount: false,
        isExitRoom: false,
        isHuPai: false,
        isDispressed: false,
        game_over_data: null,
        baoting: [],
        limitOutCard: false,
        tingData: null,
        clubName: null,
        tings_data: null,
        ////////////////////////////////////////////
        isHuangZhuang: false,
        maimapais: [],
        zhongmapais: [],
        // xuanze: [],
        logindata: null,
        loginaward: null,
        warnStr: "",

        dice: null,
        chupais: null,
        // singleScore:[],

        _taskData: null,
        _actionid: null,
        _huData: null,
        _tingList: null,

        //涟水天听处理数据
        _tianting: null,

        _isShare: false, // 战绩分享链接
        _reStart: false,
        roomuuid: "",     //房间uuid
        _mopaitime: 0,
        gameTing: null,
    },

    reset: function () {
        console.log("gamenetmgr reset");
        this.lastTurn = -1;
        this.turn = -1;
        this.chupai = -1,
            this.dingque = -1;
        this.button = -1;
        this.gamestate = "";
        this.dingque = -1;
        cc._isRefreshTingData = true;
        this.numOfMJ = 0;

        //// 
        this.fanbaida = -1;
        this.baida = -1;

        //涟水天听处理
        this._tianting = -1;
        this.isDingQueing = false;
        this.isHuanSanZhang = false;
        this.curaction = null;
        this.piaohuaData = null;


        this.zhishaizinum = null;
        this.dice = null;
        // this.shaizinum = null; 
        this.lazhuangData = null;
        this.dingzhuangData = null;
        this.tingData = null;
        this.isShowPiaohua = false;
        this.isShowLazhuang = false;
        this.isShowDingzhuang = false;
        this.isZhishaizi = false;
        this.dissoveData = null;
        this._huData = null;
        this._tingList = null;
        this.isClickChupai = false;
        this.limitOutCard = false;
        this.isHuPai = false;
        this.isDispressed = false;
        this.game_over_data = null;
        this.baoting = [null, null, null, null];
        this.huangzhuangNum = 0;
        this.tings_data = null;

        this.isHuangZhuang = false;
        this.maimapais = [];
        this.zhongmapais = [];
        // this.xuanze = [];
        this._reStart = false;

        this.loginaward = "";
        this.logindata = "";
        if (this.seats != null) {
            for (var i = 0; i < this.seats.length; ++i) {
                this.seats[i].holds = [];
                this.seats[i].folds = [];
                this.seats[i].pengs = [];
                this.seats[i].angangs = [];
                this.seats[i].diangangs = [];
                this.seats[i].wangangs = [];
                this.seats[i].chipais = [];
                this.seats[i].flowers = [];
                this.seats[i].jiating = [];
                this.seats[i].bdguserid = [];
                this.seats[i].bwguserid = [];
                this.seats[i].psign = [];
                ///////////////////////////////////
                this.seats[i].dingque = -1;
                this.seats[i].dingzhuang = -1;
                this.seats[i].lazhuang = -1;
                this.seats[i].tingState = 0;
                //涟水天听
                this.seats[i].tiantingstate = false;
                this.seats[i].ready = false;
                this.seats[i].hued = false;
                this.seats[i].double = 0;
                this.seats[i].huanpais = null;
                this.seats[i].piaohua = -1;
                //this.seats[i].flowers = null;
                this.seats[i].isbaoting = false;
                this.seats[i].tings = [];
                // this.seats[i].lazhuang = null;
                this.seats[i].dingzhuang = null;
                this.seats[i].tianting = 0;
                this.huanpaimethod = -1;
                this.seats[i].tingState = 0;


            }
        }

        if (cc.fy.gameMsg) {
            cc.fy.gameMsg.reset();
        }
    },

    clear: function () {
        console.log("gameNetMgr clear");
        this.isSameAccount = false;
        if (this.isOver == true) {
            this.roomId = null;
            this.roomUuid = null;
            this.maxNumOfGames = 0;
            this.maxTypeOfGames = "局"
            this.numOfGames = 0;
            this.cntOfGames = 0;
            this.numOfDouble = 0;
            this.seats = [];
            if (this.conf != null) {
                this.conf.huangCnt = 0;
            }
            cc.fy.anticheatingMgr.reset();
            cc.fy.net.close();
        }
    },

    loadSceneFinish: function () {
        console.log("loadSceneFinish");
        let msg = GameMsgDef.getMsg(GameMsgDef.ID_LOADSCENEFINISH);
        msg.scene = cc.fy.sceneMgr.currentScene;
        EventDispatcher.dispatch(GameMsgDef.MSGID, msg);
    },

    dispatchEvent: function (event, data) {
        if (this.eventTarget) {
            this.eventTarget.emit(event, data);
        }
    },

    dispatchNetEvent: function (event, data) {
        EventDispatcher.dispatch(GameMsgDef.MSGID, GameMsgDef.packagMsg(event, data));
    },

    getSeatIndexByID: function (userId) {
        if (this.seats != null) {
            for (var i = 0; i < this.seats.length; ++i) {
                var s = this.seats[i];
                if (s.userid == userId) {
                    return i;
                }
            }
        }
        return -1;
    },

    getIDBySeatIndex: function (seatIndex) {
        if (this.seats != null) {
            for (var i = 0; i < this.seats.length; ++i) {
                var s = this.seats[i];
                if (i == seatIndex) {
                    return s.userid;
                }
            }
        }
        return null;
    },

    isOwner: function () {
        return this.seatIndex == 0 && this.conf.createtype != 1
    },

    getSeatByID: function (userId) {
        var seatIndex = this.getSeatIndexByID(userId);
        if (seatIndex == -1) {
            return null;
        }
        var seat = this.seats[seatIndex];
        return seat;
    },



    getSelfData: function () {
        return this.seats[this.seatIndex];
    },

    //获取上家座位号
    getUpSeatIndexBySeatIndex: function (seatIndex) {
        var seats = this.seats,
            len,
            ret;
        if (seats == null) {
            return 0;
        }
        len = seats.length;
        if (seatIndex - 1) {

        }
        ret = seatIndex - 1 < 0 ? len - 1 : seatIndex - 1;
        return ret;
    },

    getLocalIndex: function (index) {
        var seats = this.seats,
            len,
            ret;
        if (seats == null) {
            return 0;
        }
        len = seats.length;
        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.PDK) {
            if (this.seats.length == 3) {
                ret = (index - this.seatIndex + 3) % 3;
            }
            else {
                ret = (index - this.seatIndex + 2) % 2;
            }
        } else if (cc.isMJ(cc.fy.gameNetMgr.conf.type)) {
            var length = this.seats.length;
            var ret = (index - this.seatIndex + length) % length;
        } else {
            ret = (index - this.seatIndex + len) % len;
            if (len == 3) {
                ret = ret == 2 ? 3 : ret;
            } else if (len == 2) {
                ret = ret == 1 ? 2 : ret;
            }
        }
        return ret;
    },

    prepareReplay: function (roomInfo, detailOfGame) {
        console.log("==================prepareReplay>>>>>>>>>>>>", roomInfo, detailOfGame);
        this.roomId = roomInfo.id;
        this.roomUuid = roomInfo.uuid;
        this.seats = roomInfo.seats;
        this.turn = detailOfGame.base_info.button;
        this.button = detailOfGame.base_info.button;
        this.lastTurn = this.turn;
        this.numOfDouble = 0;
        var baseInfo = detailOfGame.base_info;
        this.numOfGames = 0;
        if (roomInfo.idx != null) {
            this.numOfGames = roomInfo.idx + 1;
        }
        else {
            this.numOfGames = baseInfo.index + 1;
        }
        // this.maxNumOfGames = roomInfo.maxGame;
        // this.cntOfGames = roomInfo.circleCnt+1; 
        this.seatIndex = 0;
        for (var i = 0; i < this.seats.length; ++i) {
            var s = this.seats[i];
            s.seatindex = i;
            s.score = null;
            s.holds = baseInfo.game_seats ? baseInfo.game_seats[i] : [];
            s.pengs = [];
            s.angangs = [];
            s.diangangs = [];
            s.wangangs = [];
            ////////////////////////////////////
            s.bdguserid = [];
            s.bwguserid = [];
            s.psign = [];
            ///////////////////////////////////
            s.chipais = [];
            s.folds = [];
            s.flowers = [];

            s.double = 0;
            s.online = true;
            if (cc.fy.userMgr.userId == s.userid) {
                this.seatIndex = i;
            }
            if (this.seatIndex == -1) {
                this.seatIndex = 0;
            }

            if (this.seats.length == 2 && (this.seatIndex == 2 || this.seatIndex == 3)) {
                this.seatIndex = 0;
            }
            else if (this.seats.length == 3 && this.seatIndex == 3) {
                this.seatIndex = 0;
            }
        }
        if (baseInfo.conf != null) {
            this.conf = baseInfo.conf;

        } else if (roomInfo.conf != null) {
            this.conf = roomInfo.conf;
        } else {
            this.conf = {
                type: baseInfo.type,
                type: baseInfo.type,
                maxGames: baseInfo.maxGames,
                baseScore: baseInfo.baseScore,
                wanfa: baseInfo.wanfa,
                huangCnt: baseInfo.huangCnt,
                aagems: baseInfo.aagems,
            }
        }
        if (this.conf.type == null) {
            this.conf.type = 0;
        }
        if (baseInfo.fanbaida != null) {
            this.fanbaida = baseInfo.fanbaida;
        }
        if (baseInfo.banzi != null) {
            this.fanbaida = baseInfo.banzi;
        }
        if (baseInfo.baida != null) {
            this.baida = baseInfo.baida;
        }

        if (cc.fy.gameMsg) {
            cc.fy.gameMsg.prepareReplay(roomInfo, detailOfGame);
        }
    },


    getWanfa: function (_conf, isClub) {
        let strArr = this.getWanfaArray(_conf, isClub);
        let str = "";
        if (strArr) {
            if (strArr.length > 0) {
                str = strArr.join(" ");
            }
        }
        return str;
    },

    //玩法信息
    getWanfaArray(_conf, isClub) {
        var conf = this.conf;
        if (_conf != null) {
            conf = _conf;
        }
        console.log('_conf: ', conf);
        if (conf.aagems == null) {
            conf.aagems = _conf.aagems;
        }
        if (conf.type == null) {
            conf.type = _conf.type;
        }
        // cc.fy.localStorage.setItem("createroom_sz", JSON.stringify(conf));
        if (conf && conf.type != null) {
            var strArr = [];
            // 玩法 
            if (conf.type == cc.GAMETYPE.PDK) {
                if (isClub == false) {
                    strArr.push(this.getGameTitle(conf.type));
                }
                if (conf.aagems != null) {
                    if (conf.aagems == 0) {
                        strArr.push("房主付费");
                    }
                    else if (conf.aagems == 1) {
                        strArr.push("AA付费");
                    }
                    else if (conf.aagems == 3) {
                        strArr.push("大赢家付费");
                    }
                    else {
                        strArr.push("圈主开房");
                    }
                }
                // if(conf.maxCntOfPlayers != null){
                //     if (conf.maxCntOfPlayers == 3) {
                //         strArr.push("三人");
                //     }
                //     else if(conf.maxCntOfPlayers == 2){
                //         strArr.push("二人");
                //     }
                // }
                //局数
                if (conf.maxGames != null) {
                    strArr.push("共" + conf.maxGames + "局");
                }
                if (conf.baseScore != null) {
                    strArr.push("底分:" + conf.baseScore);
                }
                let wanfaArr = this.getWanfaArr(conf, isClub);
                strArr = strArr.concat(wanfaArr);


            } else if (conf.type == cc.GAMETYPE.SZER) {
                if (isClub == false) {
                    strArr.push(this.getGameTitle(conf.type));
                }

                if (conf.aagems != null) {
                    if (conf.aagems == 0) {
                        strArr.push("房主付费");
                    }
                    else if (conf.aagems == 1) {
                        strArr.push("AA付费");
                    }
                    else if (conf.aagems == 3) {
                        strArr.push("大赢家付费");
                    }
                    else {
                        strArr.push("圈主开房");
                    }
                }
                if (conf.maxGames != null) {
                    strArr.push("共" + conf.maxGames + "局");
                } else if (cc.fy.gameNetMgr.maxNumOfGames != null) {
                    strArr.push("共" + cc.fy.gameNetMgr.maxNumOfGames + "局");
                }

                let wanfaArr = this.getWanfaArr(conf, isClub);
                strArr = strArr.concat(wanfaArr);

            }
            else if (conf.type == cc.GAMETYPE.SZTDH) {
                if (isClub == false) {
                    strArr.push(this.getGameTitle(conf.type));
                }
                if (conf.aagems != null) {
                    if (conf.aagems == 0) {
                        strArr.push("房主付费");
                    }
                    else if (conf.aagems == 1) {
                        strArr.push("AA付费");
                    }
                    else if (conf.aagems == 3) {
                        strArr.push("大赢家付费");
                    }
                    else {
                        strArr.push("圈主开房");
                    }
                }
                if (conf.maxGames != null) {
                    strArr.push("共" + conf.maxGames + "局");
                } else if (cc.fy.gameNetMgr.maxNumOfGames != null) {
                    strArr.push("共" + cc.fy.gameNetMgr.maxNumOfGames + "局");

                }
                let wanfaArr = this.getWanfaArr(conf, isClub);
                strArr = strArr.concat(wanfaArr);
            }
            else if (conf.type == cc.GAMETYPE.SZBD) {
                if (isClub == false) {
                    strArr.push(this.getGameTitle(conf.type));
                }

                if (conf.aagems != null) {
                    if (conf.aagems == 0) {
                        strArr.push("房主付费");
                    }
                    else if (conf.aagems == 1) {
                        strArr.push("AA付费");
                    }
                    else if (conf.aagems == 3) {
                        strArr.push("大赢家付费");
                    }
                    else {
                        strArr.push("圈主开房");
                    }
                }
                if (conf.maxGames != null) {
                    strArr.push("共" + conf.maxGames + "局");
                } else if (cc.fy.gameNetMgr.maxNumOfGames != null) {
                    strArr.push("共" + cc.fy.gameNetMgr.maxNumOfGames + "局");

                }
                let wanfaArr = this.getWanfaArr(conf, isClub);
                strArr = strArr.concat(wanfaArr);

            }
            else if (conf.type == cc.GAMETYPE.SZCT) {
                if (isClub == false) {
                    strArr.push(this.getGameTitle(conf.type));
                }

                if (conf.aagems != null) {
                    if (conf.aagems == 0) {
                        strArr.push("房主付费");
                    }
                    else if (conf.aagems == 1) {
                        strArr.push("AA付费");
                    }
                    else if (conf.aagems == 3) {
                        strArr.push("大赢家付费");
                    }
                    else {
                        strArr.push("圈主开房");
                    }
                }

                if (conf.maxGames != null) {
                    strArr.push("共" + conf.maxGames + "局");
                } else if (cc.fy.gameNetMgr.maxNumOfGames != null) {
                    strArr.push("共" + cc.fy.gameNetMgr.maxNumOfGames + "局");

                }
                let wanfaArr = this.getWanfaArr(conf, isClub);
                strArr = strArr.concat(wanfaArr);
            } else if (conf.type == cc.GAMETYPE.SZHD) {
                if (isClub == false) {
                    strArr.push(this.getGameTitle(conf.type));
                }
                if (conf.aagems != null) {
                    if (conf.aagems == 0) {
                        strArr.push("房主付费");
                    }
                    else if (conf.aagems == 1) {
                        strArr.push("AA付费");
                    }
                    else if (conf.aagems == 3) {
                        strArr.push("大赢家付费");
                    }
                    else {
                        strArr.push("圈主开房");
                    }
                }
                if (conf.maxGames != null) {
                    strArr.push("共" + conf.maxGames + "局");
                } else if (cc.fy.gameNetMgr.maxNumOfGames != null) {
                    strArr.push("共" + cc.fy.gameNetMgr.maxNumOfGames + "局");

                }
                let wanfaArr = this.getWanfaArr(conf, isClub);
                strArr = strArr.concat(wanfaArr);
            } else if (conf.type == cc.GAMETYPE.SZWJ) {
                if (isClub == false) {
                    strArr.push(this.getGameTitle(conf.type));
                }
                if (conf.aagems != null) {
                    if (conf.aagems == 0) {
                        strArr.push("房主付费");
                    }
                    else if (conf.aagems == 1) {
                        strArr.push("AA付费");
                    }
                    else if (conf.aagems == 3) {
                        strArr.push("大赢家付费");
                    }
                    else {
                        strArr.push("圈主开房");
                    }
                }
                if (conf.maxGames != null) {
                    strArr.push("共" + conf.maxGames + "局");
                } else if (cc.fy.gameNetMgr.maxNumOfGames != null) {
                    strArr.push("共" + cc.fy.gameNetMgr.maxNumOfGames + "局");

                }
                let wanfaArr = this.getWanfaArr(conf, isClub);
                strArr = strArr.concat(wanfaArr);
            }
            return strArr;
        }
        console.log(strArr);
        return null;
    },


    getWanfaArr: function (_conf, isClub) {
        var conf = this.conf;
        if (_conf != null) {
            conf = _conf;
        }
        var strArr = [];
        console.log('_conf: ', conf);
        if (conf && conf.type != null) {
            // 玩法

            if (conf.type == cc.GAMETYPE.PDK) {
                if (conf.wanfa.indexOf(0) >= 0) {
                    strArr.push("赢家先出");
                }
                if (conf.wanfa.indexOf(1) >= 0) {
                    strArr.push("黑桃3先出");
                }
                if (conf.wanfa.indexOf(2) >= 0) {
                    strArr.push("红桃3先出");
                }
                if (conf.wanfa.indexOf(4) >= 0) {
                    strArr.push("炸弹翻倍");
                }

                if (conf.wanfa.indexOf(5) >= 0) {
                    strArr.push("必管");
                } else {
                    strArr.push("不必管");
                }
                if (conf.wanfa.indexOf(6) >= 0) {
                    strArr.push("三带一");
                } else {
                    strArr.push("不带三带一");
                }
                if (conf.wanfa.indexOf(9) >= 0) {
                    strArr.push("炸弹算分");
                }

                if (conf.wanfa.indexOf(10) >= 0) {
                    strArr.push("飞机带单张");
                }
                if (conf.wanfa.indexOf(11) >= 0 && conf.wanfa.indexOf(0) >= 0) {
                    strArr.push("AAA是炸弹");
                }
                else if (conf.wanfa.indexOf(11) >= 0) {
                    strArr.push("333 AAA是炸弹");
                }
                else if (conf.wanfa.indexOf(7) >= 0) {
                    strArr.push("标准16张");
                }
                else if (conf.wanfa.indexOf(8) >= 0) {
                    strArr.push("15张");
                }
                if (conf.wanfa.indexOf(4) < 0 && conf.wanfa.indexOf(9) < 0) {
                    strArr.push("炸弹不算分不翻倍");
                }
                if (isClub && conf.isGps) {
                    strArr.push("限制GPS");
                }

                if (isClub && conf.maxCntOfPlayers != null) {
                    strArr.push("人数:" + conf.maxCntOfPlayers);
                }
                if (isClub && conf.baseScore != null) {
                    strArr.push("底分:" + conf.baseScore);
                }
            }
            else if (conf.type == cc.GAMETYPE.SZER) {
                if (conf.wanfa != null) {
                    //过胡加倍
                    if (conf.wanfa.double && conf.wanfa.double == 1) {
                        strArr.push("过胡加倍");
                    }
                }
                // if (isClub && conf.isGps) {
                //     strArr.push("限制GPS");
                // }
                // if (isClub && conf.maxCntOfPlayers != null) {
                //     strArr.push("人数:" + conf.maxCntOfPlayers);
                // }
            }
            else if (conf.type == cc.GAMETYPE.SZTDH) {
                if (conf.baseScore != null) {
                    strArr.push("底分:" + conf.baseScore);
                }
                if (conf.wanfa != null) {
                    // 翻倍模式
                    if (conf.wanfa.fanbeibaozi == 1) {
                        strArr.push("豹子翻倍");
                    }
                    if (conf.wanfa.fanbeilianzhuang == 1) {
                        strArr.push("连庄翻倍");
                    }
                    if (conf.wanfa.fanbeipaixing == 1) {
                        strArr.push("牌型翻倍");
                    }
                    //最大翻数
                    if (conf.wanfa.zuidafanshu != null) {
                        let str = 4
                        if (conf.wanfa.zuidafanshu == 2) {
                            str = 4
                        } else if (conf.wanfa.zuidafanshu == 3) {
                            str = 8
                        } else {
                            str = 16
                        }
                        strArr.push(str + "倍封顶");
                    }
                    //带不带飘 
                    if (conf.wanfa.daipiao != null && conf.wanfa.daipiao == 1) {
                        strArr.push("带飘");
                    }
                    else {
                        strArr.push("不带飘");
                    }
                }
                // if (isClub && conf.isGps) {
                //     strArr.push("限制GPS");
                // }
                if (isClub && conf.maxCntOfPlayers != null) {
                    strArr.push("人数:" + conf.maxCntOfPlayers);
                }
            }
            else if (conf.type == cc.GAMETYPE.SZBD) {
                if (conf.wanfa != null) {
                    if (conf.wanfa.huqidui == 1) {
                        strArr.push("可以胡七对");
                    }
                    if (conf.wanfa.zimohu == 1) {
                        strArr.push("只能自摸胡");
                    }

                    if (conf.wanfa.baidafanpai === undefined) {
                        strArr.push("");
                    } else if (conf.wanfa.baidafanpai == 0) {
                        strArr.push("不翻牌");
                    } else if (conf.wanfa.baidafanpai != 0) {
                        strArr.push("翻" + conf.wanfa.baidafanpai + "张");
                    }
                }
                if (isClub && conf.maxCntOfPlayers != null) {
                    strArr.push("人数:" + conf.maxCntOfPlayers);
                }
                // if (isClub && conf.isGps) {
                //     strArr.push("限制GPS");
                // }
            }
            else if (conf.type == cc.GAMETYPE.SZCT) {
                if (conf.wanfa != null) {
                    if (conf.wanfa.diling == 1) {
                        strArr.push("滴零");
                    }
                    if (conf.wanfa.haoqi == 1) {
                        strArr.push("豪七");
                    }
                }
                // if (isClub && conf.isGps) {
                //     strArr.push("限制GPS");
                // }
                if (isClub && conf.maxCntOfPlayers != null) {
                    strArr.push("人数:" + conf.maxCntOfPlayers);
                }
            }
            else if (conf.type == cc.GAMETYPE.SZHD) {
                if (conf.baseScore != null) {
                    strArr.push("底分:" + conf.baseScore);
                }
                if (conf.wanfa != null) {
                    //带不带飘
                    if (conf.wanfa.daipiao != null) {
                        if (conf.wanfa.daipiao == 1) {
                            strArr.push("带飘");
                        }
                        else if (conf.wanfa.daipiao == 0) {
                            strArr.push("不带飘");
                        }
                        else {
                            strArr.push("必飘");
                        }
                    }
                }
                if (isClub && conf.maxCntOfPlayers != null) {
                    strArr.push("人数:" + conf.maxCntOfPlayers);
                }
                // if (isClub && conf.isGps) {
                //     strArr.push("限制GPS");
                // }
            } else if (conf.type == cc.GAMETYPE.SZWJ) {
                if (conf.baseScore != null) {
                    strArr.push("底分:" + conf.baseScore);
                }
                if (conf.wanfa != null) {
                    if (conf.wanfa.isHuangFan) {
                        strArr.push("黄翻");
                    }
                    if (conf.wanfa.isHuangFengFan) {
                        strArr.push("黄风翻");
                    }
                    if (conf.wanfa.isQiangGangHu) {
                        strArr.push("抢杠胡");
                    }
                }
                if (isClub && conf.maxCntOfPlayers != null) {
                    strArr.push("人数:" + conf.maxCntOfPlayers);
                }
                // if (isClub && conf.isGps) {
                //     strArr.push("限制GPS");
                // }
            }
        }
        return strArr;
    },

    array_contain: function (array, obj) {
        if (array == null || array.length == 0) {
            return false;
        }
        for (var i = 0; i < array.length; i++) {
            if (array[i] == obj)//如果要求数据类型也一致，这里可使用恒等号===
                return true;
        }
        return false;
    },


    getGameTitle: function (type) {
        var str = "";
        if (type == cc.GAMETYPE.PDK) {
            str = "苏州关牌";
        } else if (type == cc.GAMETYPE.SZER) {
            str = "二人麻将";
        } else if (type == cc.GAMETYPE.SZTDH) {
            str = "推倒胡";
        } else if (type == cc.GAMETYPE.SZBD) {
            str = "百搭麻将";
        } else if (type == cc.GAMETYPE.SZCT) {
            str = "苏州麻将(花)";
        } else if (type == cc.GAMETYPE.SZHD) {
            str = "黄埭麻将";
        } else if (type == cc.GAMETYPE.SZWJ) {
            str = "吴江麻将";
        }
        return str;
    },

    // 添加游戏模块的消息监听
    initGameHander: function () {
        cc.fy.gameMsg.initHandlers();
    },

    dispatchGameEvent: function (event, data) {
        if (cc.fy.gameMsg) {
            cc.fy.gameMsg.dispatchGameEvent(event, data);
        }
    },
    addHandler: function (msgId, handler) {
        if (this.eventTarget) {
            this.eventTarget.on(msgId, function (data) {
                if (handler) {
                    handler(data);
                }
            });
        }
    },


    initHandlers: function () {
        var self = this;
        cc.fy.net.clearHandlers();
        cc.fy.net.addHandler("login_result", function (data) {
            console.log("login_result===========>", data);
            // console.log("login_result",JSON.stringify(data));
            if (data.errcode === 0) {
                cc.fy.userMgr.oldRoomId = null;
                self.reset();
                var data = data.data;
                self.conf = data.conf;
                self.roomId = data.roomid;
                if (data.conf.uuid != null) {
                    self.roomUuid = data.conf.uuid;
                }
                // 游戏内
                self.initGameHander();

                self.maxNumOfGames = data.conf.maxGames;
                self.maxTypeOfGames = "局";
                self.cntOfGames = 0;
                // if (data.conf.maxGames == "feng4quan") {
                //     self.maxNumOfGames = "4圈";
                // }
                // else if (data.conf.maxGames == "feng2quan") {
                //     self.maxNumOfGames = "2圈";
                // }
                // if (data.conf.type == cc.GAMETYPE.JDMJ) {
                //     if (data.conf.wanfa.indexOf(9) >= 0) {
                //         // self.maxTypeOfGames = "圈";
                //         self.cntOfGames = 1;
                //         self.maxNumOfGames = data.conf.maxGames;
                //     }
                // }
                self.numOfGames = data.numofgames;
                self.aagems = data.conf.aagems
                self.seats = data.seats;
                self.seatIndex = self.getSeatIndexByID(cc.fy.userMgr.userId);

                self.isOver = false;
                self.isClickChupai = false;
                // self.xuanze.push(data.conf.maxGames);
                // self.xuanze.push(data.conf.maShu);
                // self.xuanze.push(data.conf.quanZhong);
                // self.xuanze.push(data.conf.aagems);
                // 俱乐部需要请求一下俱乐部名
                if (self.conf.isClubRoom) {
                    console.log("get_club_name" + self.conf.clubId);
                    cc.fy.net.send('get_club_name', self.conf.clubId);
                }
            } else if (data.errcode == 3) {
                //请求超时，请重试
                cc.fy.alert.show("您的网络不稳定，请检查网络连接！", function () {
                    cc.fy.userMgr.logOut();
                });
            }
            else {
                console.log(data.errmsg);
                self.resetAll();
                cc.fy.net.close();
                let errmsg = "该房间不存在或已解散！";
                if (data.errcode == 1 || data.errcode == 2) {
                    errmsg = "参数不合法！";
                }
                cc.fy.alert.show(errmsg, function () {
                    cc.fy.sceneMgr.loadScene("hall", true);
                });
            }
            // setTimeout(function(){
            //     cc.director.preloadScene('hall',function(err){
            //         console.log("Hall has load",err);
            //     });
            // },2000);
        });

        cc.fy.net.addHandler("get_club_name_result", function (data) {
            console.log('get_club_name_result', data.name);
            console.log(data);
            if (data.name && data.name != undefined) {
                self.clubName = data.name;
                console.log(self.clubName);
                self.dispatchEvent('club_name_rev', self.clubName);
            }

        });

        cc.fy.net.addHandler("login_finished", function (data) {
            console.log("login_finished");
            cc.fy.userMgr.isInRoom = true;
            self.isOver = false;
            self.isExitRoom = false;
            self.isClickChupai = false;
            self.limitOutCard = false;
            self.isReconnect = false;
            cc.fy.sceneMgr.loadGameScene(self.conf.type, true);
            cc.fy.userMgr.refreshGeo(true);
            // setTimeout(function () {
            // cc.fy.anticheatingMgr.sendGeo();
            // }, 1000);

        });

        cc.fy.net.addHandler("exit_result", function (data) {
            console.log("exit_result");
            self.roomId = null;
            self.roomUuid = null;
            cc.fy.userMgr.oldRoomId = null;
            cc.fy.userMgr.isInRoom = false;
            self.turn = -1;
            self.lastTurn = -1;
            self.dingque = -1;
            self.isDingQueing = false;
            self.seats = [];
            self.isExitRoom = true;
            cc.fy.userMgr.isInRoom = false;
            cc.fy.net.close();
            cc.fy.sceneMgr.loadScene("hall");
        });

        cc.fy.net.addHandler("exit_notify_push", function (data) {
            console.log("exit_notify_push");
            var userId = data;
            var s = self.getSeatByID(userId);
            if (s != null) {
                s.userid = 0;
                s.name = "";
                s.gpsInfo = null;
                self.dispatchEvent("user_state_changed", s);
            }
            cc.fy.userMgr.refreshGeo();
        });

        cc.fy.net.addHandler("dispress_push", function (data) {
            console.log("dispress_push", data);
            if (self.isOwner() == false) {
                self.isDispress = true;
            }
            self.roomId = null;
            self.roomUuid = null;
            self.turn = -1;
            self.lastTurn = -1;
            self.dingque = -1;
            self.isDingQueing = false;
            self.seats = [];
            self.isExitRoom = true;
            self.dispatchEvent("reconnecthide");
            if (data.delClubRoom != null && data.delClubRoom == true) {
                cc.fy.hintBox.show("房间已被圈主或管理员解散");
            }
            if (data.msg != null && data.msg != "") {
                cc.fy.hintBox.show(data.msg);
            }
            cc.fy.userMgr.isInRoom = false;
            if (data.delClubRoom) {
                //cc.fy.hintBox.show("圈主已解散该房间");
                self.roomId = null;
                self.roomUuid = null;
                self.turn = -1;
                self.lastTurn = -1;
                self.isDingQueing = false;
                self.seats = [];
                self.isExitRoom = true;
                // cc.fy.alert.show("圈主或管理员已解散该房间", function () {
                //     cc.fy.sceneMgr.loadScene("hall");
                // });
                // return;
            }
            cc.fy.net.close();
            cc.fy.sceneMgr.loadScene("hall");
        });

        cc.fy.net.addHandler("disconnect", function (data) {
            console.log(" gamenetmgr disconnect  ");
            if (!cc.fy.userMgr.isInRoom) {
                return;
            }
            // if(self.roomId == null){
            //     console.log(" gamenetmgr disconnect self.roomId == null");
            //     // cc.director.loadScene("hall");
            //     // cc.director.loadScene("login");
            //     if(self.isExitRoom == false && cc.fy.sceneMgr.isGameScene()){
            //         cc.fy.alert.show("您的网络不稳定，请检查网络连接！",function(){
            //             cc.fy.userMgr.logOut();
            //         });
            //     }
            //     else if(self.isExitRoom == false && cc.fy.userMgr.oldRoomId == null && cc.fy.sceneMgr.isHallScene())
            //     {
            //         if(cc.fy.loading){
            //             cc.fy.loading.hide();
            //         }
            //         // 这个时候oldroomid也是空的，并且还在大厅，必须踢到登录界面
            //         cc.fy.alert.show("网络连接超时，请检查网络连接！",function(){
            //             // cc.fy.sceneMgr.loadScene("login");
            //             // cc.game.restart();
            //             cc.fy.userMgr.logOut();
            //         });
            //     }
            //     self.isExitRoom = false;
            // }
            // else{
            //     if(self.isReconnect || (self.isOver == false && self.isSameAccount == false && self.isExitRoom == false)){
            //         cc.fy.userMgr.oldRoomId = self.roomId;
            //         cc.fy.net.reconnect();
            //         self.isReconnect = true;
            //     }
            //     else if(self.isOver){
            //         cc.fy.userMgr.isInRoom = false;
            //     }
            // }

            if (self.isReconnect || (self.isOver == false && self.isSameAccount == false && self.isExitRoom == false && cc.fy.sceneMgr.isGameScene())) {
                cc.fy.userMgr.oldRoomId = self.roomId;
                cc.fy.net.reconnect();
                self.isReconnect = true;
            }
            else if (self.isOver || self.isExitRoom) {
                cc.fy.userMgr.isInRoom = false;
            }
            else {
                console.log("disconnect other case ======>>>> start");
                console.log("self.isOver " + self.isOver);
                console.log("self.isSameAccount " + self.isSameAccount);
                console.log("self.isExitRoom " + self.isExitRoom);
                console.log("self.cc.fy.sceneMgr.currentScene " + cc.fy.sceneMgr.currentScene);
                console.log("disconnect other case ======>>>> end");
                cc.fy.alert.show("您的网络不稳定，请检查网络连接！", function () {
                    cc.fy.userMgr.logOut();
                });
            }
        });

        cc.fy.net.addHandler("new_user_comes_push", function (data) {
            console.log("new_user_comes_push", data);
            //console.log(data);
            var seatIndex = data.seatindex;
            if (self.seats == null || self.seats.length <= 0) {
                return;
            }
            if (self.seats[seatIndex].userid > 0) {
                self.seats[seatIndex].online = true;
            }
            else {
                data.online = true;
                self.seats[seatIndex] = data;
            }
            self.dispatchEvent('new_user', self.seats[seatIndex]);
            var isForce = false;
            for (var i = 0; i < self.seats.length; i++) {
                if (self.seats[i].userid <= 0 || self.seats[i].name == null || self.seats[i].name == "") {
                    isForce = true;
                    break;
                }
            }
            // cc.fy.userMgr.refreshGeo(isForce);
        });

        cc.fy.net.addHandler("user_state_push", function (data) {
            console.log("user_state_push");
            console.log(data);
            var userId = data.userid;
            var seat = self.getSeatByID(userId);
            if (seat != null) {
                seat.online = data.online;
                self.dispatchEvent('user_state_changed', seat);
            }
        });

        cc.fy.net.addHandler("user_ready_push", function (data) {
            console.log("user_ready_push");
            console.log(data);
            if (self.seats != null) {
                var userId = data.userid;
                var seat = self.getSeatByID(userId);
                if (seat) {
                    seat.ready = data.ready;
                    // seat.online = true;
                    self.dispatchEvent('user_state_changed', seat);
                }
            }
        });

        cc.fy.net.addHandler("game_start_push", function (data) {
            console.log('game_start_push', data);
            console.log();
            self._taskData = null;
            self.reset();
            self.gamestate = "start";
            self._huData = null;
            // self.resetSeats();
            self.dispatchEvent('game_start');
            if (cc.fy.sceneMgr.isHallScene()) {
                cc.fy.sceneMgr.loadGameScene(self.conf.type);
            }
            // cc.fy.userMgr.refreshGeo(true);
        });
        cc.fy.net.addHandler("game_point_push", function (data) {
            console.log("game_point_push");
            console.log(data);
            var point = data;
            self.turn = self.getSeatIndexByID(data);
            setTimeout(function () {
                self.dispatchEvent('game_point', point);
            }, 2000);
        });
        cc.fy.net.addHandler("game_banker_push", function (data) {
            console.log('game_banker_push');
            console.log(data);
            self.button = data;
            self.dispatchEvent('game_banker');
        });

        cc.fy.net.addHandler("game_baida_push", function (data) {
            console.log('game_baida_push');
            console.log(data);
            cc.fy.gameNetMgr.baida = data;
            cc.fy.gameNetMgr.dispatchEvent('gamebaida');
            cc.fy.gameNetMgr.dispatchEvent('initmahjongs');
        });

        cc.fy.net.addHandler("game_holds_push", function (data) {
            console.log('game_holds_push', data);
            var seat = self.seats[self.seatIndex];
            seat.holds = data;

            for (var i = 0; i < self.seats.length; ++i) {
                var s = self.seats[i];
                if (s.folds == null) {
                    s.folds = [];
                }
                if (s.pengs == null) {
                    s.pengs = [];
                }
                if (s.angangs == null) {
                    s.angangs = [];
                }
                if (s.diangangs == null) {
                    s.diangangs = [];
                }
                if (s.wangangs == null) {
                    s.wangangs = [];
                }
                if (s.chipais == null) {
                    s.chipais = [];
                }
                ///////////////////////////////////////////////
                if (s.psign == null) {
                    s.psign = [];
                }
                if (s.bdguserid == null) {
                    s.bdguserid = [];
                }
                if (s.bwguserid == null) {
                    s.bwguserid = [];
                }
                s.ready = false;
            }
            self.dispatchEvent('game_holds');
        });
        cc.fy.net.addHandler("game_begin_push", function (data) {
            console.log('game_begin_push');
            console.log(data);
            self.isShowPiaohua = false;
            //self.isShowLazhuang = false;
            //self.isShowDingzhuang = false;
            self.isZhishaizi = false;
            // self.zhishaizinum = null; 
            self.button = data;
            self.turn = self.button;
            self.lastTurn = self.turn;
            self.gamestate = "begin";
            self.dispatchEvent('game_begin');
        });
        // 飘花开始
        cc.fy.net.addHandler("game_piaohua_push", function (data) {
            console.log('game_piaohua_push');
            console.log(data);
            self.isShowPiaohua = true;
            self.gamestate = "piaohua";
            self.dispatchEvent('game_piaohua');
        });
        // 飘花返回
        cc.fy.net.addHandler("piaohua_notify", function (data) {
            console.log('piaohua_notify', data);
            self.gamestate = "piaohua";
            //收到飘花返回，保存自己飘花的值
            if (data.piao != null && data.piao > 0) {
                var si = self.getSeatIndexByID(data.si);
                if (si != -1) {
                    self.seats[si].piaohua = data.piao;
                }
            }

            self.dispatchEvent('piaohua_notify', data);
        });
        // 飘花结果
        cc.fy.net.addHandler("game_piaoresult_push", function (data) {
            console.log('game_piaoresult_push');
            console.log(data);
            self.piaohuaData = data;
            for (var i = 0; i < self.seats.length; i++) {
                var si = self.getSeatIndexByID(self.piaohuaData[i].si);
                if (si != -1) {
                    self.seats[si].piaohua = self.piaohuaData[i].piao;
                }
            }


            self.dispatchEvent('game_piaoresult');
        });

        // 拉庄开始
        // cc.fy.net.addHandler("push_lazhuang", function (data) {
        //     console.log('push_lazhuang');
        //     self.isShowLazhuang = true;
        //     self.gamestate = "lazhuang";
        //     self.dispatchEvent('game_lazhuang', data);
        // });
        // 拉庄结果
        // cc.fy.net.addHandler("lazhuang_result_push", function (data) {
        //     console.log('lazhuang_result_push');
        //     self.lazhuangData = data;
        //     var si = self.getSeatIndexByID(self.lazhuangData.userid);
        //     if (si != -1) {
        //         self.seats[si].lazhuang = self.lazhuangData.score;
        //     }
        //     self.dispatchEvent('game_lazhuangresult', data);
        // });
        // 顶庄开始
        // cc.fy.net.addHandler("push_dingzhuang", function (data) {
        //     console.log('push_dingzhuang');
        //     self.isShowDingzhuang = true;
        //     self.gamestate = "dingzhuang";
        //     self.dispatchEvent('game_dingzhuang', data);
        // });
        // 顶庄结果
        // cc.fy.net.addHandler("dingzhuang_result_push", function (data) {
        //     console.log('dingzhuang_result_push');
        //     self.dingzhuangData = data;
        //     var si = self.getSeatIndexByID(self.dingzhuangData.userid);
        //     if (si != -1) {
        //         self.seats[si].dingzhuang = self.dingzhuangData.score;
        //     }
        //     self.dispatchEvent('game_dingzhuangresult', data);
        // });
        //检测架听胡牌    
        cc.fy.net.addHandler("can_hu_prompt", function (data) {
            console.log("can_hu_prompt", data);
            self.dispatchEvent("can_hu_prompt_push", data);
        });
        // 架听返回
        cc.fy.net.addHandler("IsTing", function (data) {
            console.log("---> IsTing push");
            self.tingData = data;
            // self.gamestate = "ting";
            var si = self.getSeatIndexByID(self.tingData.userId);
            if (si != -1) {
                self.seats[si].tingState = 1;
                self.seats[si].jiating = data.pai;
            }
            self.dispatchEvent('game_isting', data);
        });
        cc.fy.net.addHandler("show_ting_view", function (data) {
            console.log("---> show_ting_view push");
            self.tingData = data;
            // self.gamestate = "ting";
            var si = self.getSeatIndexByID(self.tingData.userId);
            if (si != -1) {
                self.seats[si].tingState = 1;
                self.seats[si].jiating = data.pai;
            }
            self.dispatchEvent('game_tingresult', data);
        });
        //涟水天听消息监听处理-----------------------------------
        cc.fy.net.addHandler("game_tian_ting_cnt", function (data) {
            console.log("log---->>>>game_tian_ting_cnt");
            self.dispatchEvent("game_tian_ting_cnt_push");
        });
        // cc.fy.net.addHandler("game_tian_ting_push", function (data) {
        //     console.log("log---->>>>>>game_tian_ting_push");
        //     for (var i = 0; i < self.seats.length; ++i) {
        //         if (data != null && self.seats[i].userid == data) {
        //             self.seats[i].tianting = 1;
        //         }
        //     }
        //     self.dispatchEvent("game_tian_ting");
        // });
        // cc.fy.net.addHandler("IsTianTing", function (data) {
        //     var newdata = {
        //         userId: data.userId,
        //         pai: data.pai,
        //         tingstate: data.tingstate,
        //         tiantingstate: data.tiantingstate
        //     }
        //     if (data.tingstate == 0) {
        //         self.dispatchEvent('game_guotingresult');
        //     }
        //     else {
        //         var si = self.getSeatIndexByID(data.userId);
        //         if (si != -1) {
        //             self.seats[si].tingState = 2;
        //             self.seats[si].jiating = [];
        //             self.seats[si].tiantingstate = data.tiantingstate;
        //         }
        //         self.dispatchEvent('game_tingresult', newdata);
        //     }
        // });
        // 掷骰子
        cc.fy.net.addHandler("game_zhishaizi_push", function (data) {
            console.log('game_zhishaizi_push', data);
            self.gamestate = "zhishaizi";
            self.zhishaizinum = data;
            self.isZhishaizi = true;
            // self.dispatchEvent('game_zhishaizi', data);
            setTimeout(function () {
                self.dispatchEvent('game_zhishaizi', data);
            }, 500);
        });

        cc.fy.net.addHandler("game_playing_push", function (data) {
            console.log('game_playing_push');
            self.gamestate = "playing";
            // setTimeout(function(data){
            //     self.dispatchEvent('game_playing');
            // },1000); 
            self.dispatchEvent('game_playing');
        });
        cc.fy.net.addHandler("game_sync_push", function (data) {
            console.log("game_sync_push======>>>>>>>>", data);
            console.log(data);
            console.log(JSON.stringify(data));
            self.numOfMJ = data.numofmj;
            self.numOfDouble = data.doubleNum == null ? data.double : data.doubleNum;
            self.gamestate = data.state;
            if (self.gamestate == "dingque") {
                // self.isDingQueing = true;
            }
            else if (self.gamestate == "huanpai") {
                self.isHuanSanZhang = true;
            }
            else if (self.gamestate == "playing") {
                self.isShowPiaohua = false;
                self.isShowLazhuang = false;
                self.isShowDingzhuang = false;
                self.isZhishaizi = false;
                self.zhishaizinum = null;
            }
            self.turn = data.turn;
            self.lastTurn = data.lastturn ? data.lastturn : data.turn;
            //self.lastTurn = data.lastTurn ? data.lastTurn : data.turn;
            self.button = data.button;
            self.chupai = data.chuPai;
            // self._huData = data.JiaHu;
            self.huanpaimethod = data.huanpaimethod;
            self.fanbaida = data.fanbaida;
            self.baida = data.baida;
            var bankerPoint = -1;
            self.point = data.bankerUserId;

            if (data.shaizi_nums) {
                self.dice = data.shaizi_nums;
            } else if (data.dice) {
                self.dice = data.dice;
            } else {
                self.dice = null;
            }

            self.huangzhuangNum = data.huangzhuangNum;
            self.conf.wind = data.wind;
            self.conf.huangCnt = data.huangCnt;
            self.cntOfGames = data.circleCnt + 1;

            for (var i = 0; i < self.seats.length; ++i) {
                var seat = self.seats[i];
                var sd = data.seats[i];
                //seat.lazhuang = sd.lazhaung;
                //seat.dingzhuang = sd.dingzhuang;
                seat.holds = sd.holds;
                //seat.flowers = sd.flower;
                seat.flowers = sd.flowers;
                seat.sex = sd.sex;
                seat.ready = false;

                // seat.isTing = sd.isTing;
                seat.tingState = sd.tingstate;
                //涟水天听处理
                seat.tianting = sd.tianting;
                seat.tiantingstate = sd.tiantingstate;
                seat.jiating = sd.jiating;
                seat.folds = sd.folds;
                // if (i == data.turn && data.chuPai != -1) {
                //     seat.folds.push(data.chuPai);
                // }

                seat.angangs = sd.angangs;
                seat.diangangs = sd.diangangs;
                seat.wangangs = sd.wangangs;
                ////////////////////////////////////
                seat.bdguserid = sd.dgsign;
                seat.bwguserid = sd.wgsign;
                seat.psign = sd.psign;
                ///////////////////////////////////
                seat.pengs = sd.pengs;
                if (cc.fy.gameNetMgr.conf.type != cc.GAMETYPE.SZER) {
                    seat.chipais = [];
                }
                else {
                    seat.chipais = sd.chipais;
                }
                seat.dingque = sd.que;
                seat.hued = sd.hued;
                seat.iszimo = sd.iszimo;
                seat.huinfo = sd.huinfo;
                seat.huanpais = sd.huanpais;
                if (sd.isBaoTing != null) {
                    seat.isbaoting = sd.isBaoTing;
                    seat.isTianTing = sd.isTianTing;
                }
                if (sd.tings != null) {
                    seat.tings = sd.tings;
                }
                seat.double = sd.double;
                if (i == self.seatIndex) {
                    self.dingque = sd.que;
                }
                // if (cc.fy.userMgr.userId == sd.userid) {
                //     self._huData = sd.JiaHu;
                //     self._tingList = sd.tingList;
                // }
            }

            //飘花状态不显示庄
            if (self.gamestate == "piaohua") {
                self.button = -1;
            }
            // if (self.gamestate == "lazhuang") {
            //     self.button = -1;
            // }

            //if (self.gamestate == "dingzhuang") {
            //    self.button = -1;
            //}

            //已经出牌屏蔽

            if (self.turn == self.seatIndex && self.chupai != -1) {
                self.isClickChupai = true;
            }
            else {
                self.isClickChupai = false;
            }
            // 出的牌放到牌河里
            if (self.chupai != -1) {
                self.seats[self.turn].folds.push(self.chupai);
            }
            //    if(self.seats != null)
            //     {
            //         for(var i = 0;i < self.seats.length;++i){
            //             if(self.seats[i] != null && self.seats[i].userid != 0){
            //                 self.getIP(self.seats[i]);
            //             }
            //         }
            //     }
        });

        // cc.fy.net.addHandler("game_dingque_push",function(data){
        //     self.isDingQueing = true;
        //     self.isHuanSanZhang = false;
        //     self.dispatchEvent('game_dingque');
        // });

        // cc.fy.net.addHandler("game_huanpai_push",function(data){
        //     console.log("game_huanpai_push");
        //     self.isHuanSanZhang = true;
        //     self.dispatchEvent('game_huanpai');
        // });

        cc.fy.net.addHandler("hangang_notify_push", function (data) {
            console.log("hangang_notify_push");
            self.dispatchEvent('hangang_notify', data);
        });

        cc.fy.net.addHandler("gang_recv_push", function (data) {
            console.log("gang_recv_push");
            self.dispatchEvent('hangang_notify', data);
        });

        cc.fy.net.addHandler("game_action_push", function (data) {
            console.log("game_action_push", data);
            console.log("game_action_push  timeDiff  ==", Date.now() - self._mopaitime);
            self.curaction = data;
            if (data) {
                self._actionid = data.actionId;
            }
            self.dispatchEvent('game_action', data);
        });

        cc.fy.net.addHandler("game_chupai_push", function (data) {
            console.log('game_chupai_push', data);
            var turnUserID = data;
            var si = self.getSeatIndexByID(turnUserID);
            if (si != -1) {
                self.doTurnChange(si);
            }
            self.isClickChupai = false;
            self.dispatchEvent("game_hideMjBlank");
            self.dispatchEvent("HuPass_Notity");
        });

        cc.fy.net.addHandler("game_num_push", function (data) {
             console.log("game_num_push" + self.numOfGames); 
            console.log("game_num_push data = " + data)
            self.numOfGames = data;
            console.log('______________________222222');
            self.dispatchEvent('game_num', data);
            console.log("game_num_push + self.numOfGames" + self.numOfGames); 
        });
        cc.fy.net.addHandler("game_task_push", function (data) {
            console.log("game_task_push");
            self._taskData = data;
            self.dispatchEvent('game_task', data);
        });

        cc.fy.net.addHandler("game_task_finish_push", function (data) {
            console.log("game_task_finish_push");
            self.dispatchEvent('game_task_finish', data);
        });

        cc.fy.net.addHandler("game_circle_push", function (data) {
            self.cntOfGames = data + 1;
            self.dispatchEvent('game_circle', data + 1);
        });
        cc.fy.net.addHandler("double_result", function (data) {
            console.log("double_result");
            self.dispatchEvent('double_res', data);
        });
        cc.fy.net.addHandler("game_num_double", function (data) {
            console.log('game_num_double');
            console.log(data);
            self.numOfDouble = data;
            self.dispatchEvent('game_num_double', data);
        });
        cc.fy.net.addHandler("singleScore_result", function (data) {
            console.log('singleScore_result');
            console.log(data);
            // self.singleScore = data;
            self.dispatchEvent('singleScore_result2', data);
        });
        cc.fy.net.addHandler("game_Zhongmapai_push", function (data) {
            console.log('game_Zhongmapai_push');
            self.maimapais = data.maiMaPai;
            self.zhongmapais = data.zhongMa;
            self.dispatchEvent('game_Zhongmapai', data);
        });
        cc.fy.net.addHandler("/login", function (data) {
            console.log("self.logindata =");
            self.logindata = data.logindata;
            self.loginaward = data.loginaward;
        });
        cc.fy.net.addHandler("game_huangzhuang_push", function (data) {
            console.log('game_huangzhuang_push');
            if (data.isHuangZhuang) {
                self.isHuangZhuang = true;
            }
            self.dispatchEvent('game_huangzhuang', data);
        });
        /////////////////////////////////////////////////////////////////////////////////
        cc.fy.net.addHandler("game_over_push", function (data) {
            console.log("game_over_push", data)
            self.doGameOver(data);
            self.dispatchEvent("shaizi_cancel");

        });

        cc.fy.net.addHandler("mj_count_push", function (data) {
            console.log('mj_count_push', data);
            self.numOfMJ = data;
            self.dispatchEvent('mj_count', data);
        });

        cc.fy.net.addHandler("hu_push", function (data) {
            console.log('hu_push');
            console.log(data);
            self.doHu(data);
        });

        cc.fy.net.addHandler("game_chupai_notify_push", function (data) {
            console.log("game_chupai_notify_push  ", data);
            var userId = data.userId;
            var pai = data.pai;
            self.chupais = pai;
            var si = self.getSeatIndexByID(userId);
            if (self.baoting[si] && self.baoting[si].tings) {
                self.baoting[si].tings = {};
            }
            if (si != -1) {
                // if (self.seats[si].seatindex == self.seatIndex) {
                if (self.seats[si].tingState == 1) {
                    self.seats[si].tingState = 2;
                    self.dispatchEvent('game_tingresult', data);

                    // }
                }
                self.curaction = null;
                self.doChupai(si, pai);
                self.isClickChupai = true;
                // self.doGuo(si, pai);

            }
            var initdata = {
                pai: pai,
                userId: userId,
            }
            console.log(initdata);
            self.dispatchEvent('chupais', initdata);

        });

        cc.fy.net.addHandler("game_mopai_push", function (data) {
            console.log('game_mopai_push');
            console.log(data);
            self._mopaitime = Date.now();
            self.doMopai(self.seatIndex, data);
        });

        cc.fy.net.addHandler("game_tingInfo_push", function (data) {
            console.log('game_tingInfo_push');
            console.log(data);
            self.tings_data = data;
            self.dispatchEvent('game_tingInfo', data);
            //self.doMopai(self.seatIndex,data);
        });

        cc.fy.net.addHandler("guo_notify_push", function (data) {
            console.log('guo_notify_push', data);
            console.log(data);
            var userId = data.userId;
            var pai = data.pai;
            var si = self.getSeatIndexByID(userId);
            if (si != -1) {
                self.doGuo(si, pai);
            }
        });

        cc.fy.net.addHandler("guo_result", function (data) {
            console.log('guo_result', data);
            self.isClickChupai = false;
            cc._isRefreshTingData = true;
            // self.curaction = null;
            if (cc.fy.replayMgr.isReplay()) {
                self.dispatchEvent('guo_result', data);
            }
            else {
                self.dispatchEvent('guo_result', self.seatIndex);
            }
        });

        cc.fy.net.addHandler("guohu_push", function (data) {
            console.log('guohu_push');
            self.dispatchEvent("push_notice", { info: "过胡", time: 1.5 });
        });

        cc.fy.net.addHandler("guopeng_push", function (data) {
            console.log('guopeng_push');
            self.dispatchEvent("push_notice", { info: "过碰", time: 1.5 });
        });
        cc.fy.net.addHandler("guochi_push", function (data) {
            console.log('guochi_push');
            self.dispatchEvent("push_notice", { info: "过吃", time: 1.5 });
        });

        // cc.fy.net.addHandler("huanpai_notify",function(data){
        //     console.log("huanpai_notify");
        //     var seat = self.getSeatByID(data.si);
        //     if(seat != null)
        //     {
        //         seat.huanpais = data.huanpais;
        //         self.dispatchEvent('huanpai_notify',seat);
        //     }
        //     else
        //     {
        //         console.log("huanpai_notify seat is null");
        //     }
        // });

        // cc.fy.net.addHandler("game_huanpai_over_push",function(data){
        //     console.log('game_huanpai_over_push');
        //     var info = "";
        //     var method = data.method;
        //     if(method == 0){
        //         info = "换对家牌";
        //     }
        //     else if(method == 1){
        //         info = "换下家牌";
        //     }
        //     else{
        //         info = "换上家牌";
        //     }
        //     self.huanpaimethod = method;
        //     self.isHuanSanZhang = false;
        //     self.dispatchEvent("game_huanpai_over");
        //     self.dispatchEvent("push_notice",{info:info,time:2});
        // });

        cc.fy.net.addHandler("game_chipai_notify_push", function (data) {
            console.log('game_chipai_notify_push', data);
            var userId = data.userId;
            var chipai = data.chipai;
            var bcuserid = data.bcuserid;
            var si0 = self.getSeatIndexByID(bcuserid);
            var arry = data.arry;
            if (arry.length != 2) {
                return;
            }
            self.curaction = null;

            var si = self.getSeatIndexByID(userId);
            if (si != -1) {
                self.doChi(si, data.chipai, data.arry, si0);
            }
        });

        cc.fy.net.addHandler("hangang_recv_push", function (data) {
            console.log('hangang_recv_push');
            self.dispatchEvent("hangang_recv");
        });

        cc.fy.net.addHandler("peng_notify_push", function (data) {
            console.log('peng_notify_push', data);
            var userId = data.userid;
            var bpuserId = data.bpuserid;
            var si0 = self.getSeatIndexByID(bpuserId);
            var pai = data.pai;
            var si = self.getSeatIndexByID(userId);
            self.curaction = null;

            if (cc.fy.gameNetMgr.isWJMJ()) {
                var turn = self.getSeatIndexByID(bpuserId);
                self.doPeng_new(si, pai, turn);
            } else {
                self.doPeng(si, pai, si0);
            }
        });

        cc.fy.net.addHandler("chi_recv_push", function (data) {
            console.log('chi_recv_push');
            self.dispatchEvent("chi_recv");
        });
        cc.fy.net.addHandler("peng_recv_push", function (data) {
            console.log('peng_recv_push');
            self.dispatchEvent("peng_recv");
        });
        cc.fy.net.addHandler("hu_recv_push", function (data) {
            console.log('hu_recv_push');
            self.dispatchEvent("hu_recv");
        });
        // cc.fy.net.addHandler("can_tianting", function (data) {
        //     console.log('can_tianting');
        //     self.dispatchEvent("can_tianting_push", data);
        // });
        // cc.fy.net.addHandler("cancelTing_recv_push", function (data) {
        //     console.log('cancelTing_recv_push');
        //     self.tingData = data;
        //     // self.gamestate = "ting";
        //     var si = self.getSeatIndexByID(self.tingData.userId);
        //     if (si != -1) {
        //         self.seats[si].tingState = -1;
        //         self.seats[si].jiating = [];
        //     }
        //     self.dispatchEvent("cancelTing_recv", data);
        // });
        // 服务器已经收到了对消息，但是需要等待其它玩家的操作
        // cc.fy.net.addHandler("dui_recv_push", function (data) {
        //     console.log('dui_recv_push');
        //     self.dispatchEvent("dui_recv");
        // });

        cc.fy.net.addHandler("gang_notify_push", function (data) {
            console.log('gang_notify_push');
            console.log(data);
            var bguserId = -2;
            if (data.bdguserid > 0) {
                bguserId = data.bdguserid;
            }
            else if (data.bwguserid > 0) {
                bguserId = data.bwguserid;
            }

            var si0 = self.getSeatIndexByID(bguserId);
            if (bguserId < 0) {
                si0 = -2;
            }
            self.curaction = null;

            var userId = data.userid;
            var pai = data.pai;
            var si = self.getSeatIndexByID(userId);
            if (si != -1) {
                if (cc.fy.gameNetMgr.isWJMJ()) {
                    self.doGang_new(si, pai, data.gangtype, data.operedIndex);
                }
                else {
                    self.doGang(si, pai, data.gangtype, si0);
                }
            }
        });
        cc.fy.net.addHandler("kan_notify_push", function (data) {
            console.log('kan_notify_push');
            console.log(data);
            var userId = data.userid;
            var pai = data.pai;
            var si = self.getSeatIndexByID(userId);
            if (si != -1) {
                self.doKan(si, pai, data.operedIndex);
            }
        });
        cc.fy.net.addHandler("hangang_recv_push", function (data) {
            console.log('hangang_recv_push');
            self.dispatchEvent("hangang_recv");
        });

        cc.fy.net.addHandler("kan_recv_push", function (data) {
            console.log('kan_recv_push');
            self.dispatchEvent("kan_recv");
        });

        cc.fy.net.addHandler("zatou_notify_push", function (data) {
            console.log('zatou_notify_push');
            console.log(data);
            var userId = data.userid;
            var pai = data.pai;
            var si = self.getSeatIndexByID(userId);
            if (si != -1) {
                self.doZatou(si, pai, data.operedIndex);
            }
        });

        cc.fy.net.addHandler("zatou_recv_push", function (data) {
            console.log('zatou_recv_push');
            self.dispatchEvent("zatou_recv");
        });

        cc.fy.net.addHandler("gang_score_push", function (data) {
            console.log('gang_score_push');
            console.log(data);
            self.dispatchEvent("gang_score", data);
        });


        // cc.fy.net.addHandler("game_dingque_notify_push",function(data){
        //     self.dispatchEvent('game_dingque_notify',data);
        // });

        // cc.fy.net.addHandler("game_dingque_finish_push",function(data){
        //     for(var i = 0; i < data.length; ++i){
        //         self.seats[i].dingque = data[i];
        //     }
        //     self.dispatchEvent('game_dingque_finish',data);
        // });


        cc.fy.net.addHandler("chat_push", function (data) {
            self.dispatchEvent("chat_push", data);
        });

        cc.fy.net.addHandler("quick_chat_push", function (data) {
            console.log("quick_chat_push");
            self.dispatchEvent("quick_chat_push", data);
        });

        // 风圈
        cc.fy.net.addHandler("game_wind_push", function (data) {
            console.log("game_wind_push");
            self.dispatchEvent("game_wind_push", data);
        });

        // 晃玩法
        cc.fy.net.addHandler("game_huang_count_push", function (data) {
            console.log("game_huang_count_push");
            self.dispatchEvent("game_huang_count_push", data);
        });

        cc.fy.net.addHandler("emoji_push", function (data) {
            console.log("emoji_push");
            self.dispatchEvent("emoji_push", data);
        });

        //互动道具
        cc.fy.net.addHandler("interactivaction_push", function (data) {
            console.log("interactivaction_push");
            self.dispatchEvent("interactivaction_push", data);
        });

        cc.fy.net.addHandler("dissolve_notice_push", function (data) {
            console.log("dissolve_notice_push", data);
            self.dissoveData = data;
            self.dispatchEvent("dissolve_notice", data);
        });

        cc.fy.net.addHandler("dissolve_cancel_push", function (data) {
            self.dissoveData = null;
            console.log("dissolve_cancel_push");
            console.log(data);
            self.dispatchEvent("dissolve_cancel", data);
        });

        cc.fy.net.addHandler("dissolve_finish_push", function (data) {
            self.dissoveData = null;
            console.log("dissolve_cancel_push");
            console.log(data);
        });

        cc.fy.net.addHandler("voice_msg_push", function (data) {
            self.dispatchEvent("voice_msg", data);
        });

        // 强制断线重入
        cc.fy.net.addHandler("game_data_miss_notify", function (data) {
            console.log("game_data_miss_notify");
            cc.fy.net.close();
        });

        // 帐号被挤掉
        cc.fy.net.addHandler("same_account_login", function (data) {
            console.log("same_account_login");
            self.isSameAccount = true;
            cc.fy.alert.show("您的网络环境不稳定，请重新登录！", function () {
                cc.fy.userMgr.logOut();
            });
        });
        //杠分算不算哦
        cc.fy.net.addHandler("gang_chang_score", function (data) {
            console.log("gang_chang_score");
            console.log(data);

            for (const i in data) {
                if (data.hasOwnProperty(i)) {
                    self.seats[i].score = data[i].score;
                }
            }
            self.dispatchEvent("gang_chang", data);
        });
        // cc.fy.net.addHandler("gps_info_push",function(data){
        //     console.log("gps_info_push");
        //     console.log(data);

        //     for(var i = 0; i < self.seats.length; ++i){
        //         if(data[i].userId > 0){
        //             var seat = self.getSeatByID(data[i].userId);
        //             if(data[i].gpsInfo)
        //             {
        //                 var _data = JSON.parse(data[i].gpsInfo);
        //                 if(_data.latitude != null)
        //                 {
        //                     seat.gpsInfo = _data;
        //                 }
        //             }
        //             else{
        //                 seat.gpsInfo = null;
        //             }
        //         }
        //     }
        //     // cc.eventManager.dispatchCustomEvent("gps_info");
        //     setTimeout(function(){
        //         self.dispatchEvent("gps_info_result",_data);
        //     },3000);
        //     cc.fy.anticheatingMgr.checkgps();
        // });
        cc.fy.net.addHandler("gps_info_push", function (data) {
            console.log("gps_info_push");
            console.log(JSON.stringify(data));
            // 防止解散的时候
            if (self.seats == null || self.seats.length == 0) {
                return;
            }
            for (var i = 0; i < self.seats.length; ++i) {
                var seat = self.getSeatByID(data[i].userId);
                if (data[i].gpsInfo) {
                    // var _data = JSON.parse(data[i].gpsInfo);
                    var _data = data[i].gpsInfo;

                    if (_data.latitude != null) {
                        seat.gpsInfo = _data;
                        // seat.gpsInfo = dataarr[i];
                    }
                }

            }
            self.dispatchEvent('new_gps_info');
            //不弹窗了，烦死了
            // setTimeout(function () {
            //     console.log("dispatchevent ID_SHOWGPSALERTVIEW_CTC");
            //     //self.dispatchEvent(GameMsgDef.ID_SHOWGPSALERTVIEW_CTC);
            // }, 3000);
            // cc.fy.anticheatingMgr.checkgps();
        });
        cc.fy.net.addHandler("game_allflowers_push", function (data) {
            console.log("game_allflowers_push", data);
            for (var i = 0; i < self.seats.length; i++) {
                self.seats[i].flowers = data[i];
                var userId = self.getIDBySeatIndex(i);
                if (self.seats[i].flowers.length > 0) {
                    self.dispatchEvent("game_flowers", { userId: userId, newFlowers: self.seats[i].flowers });
                }
            }
            self.dispatchEvent("game_allflowers_recive", data);
        });
        cc.fy.net.addHandler("game_flowers_push", function (data) {
            console.log("game_flowers_push", data);
            var seatIndex = self.getSeatIndexByID(data.userId);
            self.seats[seatIndex].flowers = self.seats[seatIndex].flowers.concat(data.newFlowers);
            self.doHua(seatIndex, data.newFlowers);
            self.dispatchEvent("game_flowers", data);
        });
        cc.fy.net.addHandler("game_newflowers_push", function (data) {
            console.log("game_newflowers_push", data);
            var seatIndex = self.getSeatIndexByID(data.userId);
            self.seats[seatIndex].flowers = self.seats[seatIndex].flowers.concat(data.newFlowers);
            self.doHua(seatIndex, data.newFlowers);
            self.dispatchEvent("game_flowers", data);
        });



        cc.fy.gameMsg.addHandler("push_flower_cnt", function (data) {
            console.log('push_flower_cnt', data);
            var flowersData = data;
            var seats = cc.fy.gameNetMgr.seats;
            for (var i = 0; i < seats.length; ++i) {
                var si = cc.fy.gameNetMgr.getSeatIndexByID(flowersData[i].uid);
                if (si != -1) {
                    seats[si].flowers = [];
                    seats[si].flowers = flowersData[i].flowers
                }
                if (flowersData[i].flowers.length > 0) {
                    cc.fy.gameNetMgr.dispatchEvent("game_flowers", { userId: flowersData[i].uid });
                }
            }
        });

        cc.fy.gameMsg.addHandler("piaohua_push", function (data) {
            console.log("piaohua_push", data);
            console.log(data);
            var flowersData = data.msgArry;
            var seats = cc.fy.gameNetMgr.seats;
            for (var i = 0; i < seats.length; ++i) {
                var si = cc.fy.gameNetMgr.getSeatIndexByID(flowersData[i].uid);
                if (si != -1) {
                    seats[si].flowers = [];
                    seats[si].flowers = flowersData[i].flowers
                }
            }
            cc.fy.gameNetMgr.dispatchEvent('piaohua_notify', data.userid);
        });


        // 听牌
        cc.fy.net.addHandler("ting_notify_push", function (data) {
            console.log("ting_notify_push");
            console.log(data);
            let seatData = cc.fy.gameNetMgr.getSeatByID(data.userId);
            seatData.isBaoTing = true;
            seatData.isTianTing = data.isTianTing;
            if (data.userId == cc.fy.userMgr.userId) {
                var si = cc.fy.gameNetMgr.getSeatIndexByID(data.userId);
                self.baoting[si] = data;
                self.dispatchEvent("tingpai", data);
            }
            else {
                self.dispatchEvent("otherTingPai", data);
            }
        });

        // 听牌
        // cc.fy.net.addHandler("cancelTing_recv_push", function (data) {
        //     console.log("cancelTing_recv_push");
        //     console.log(data);
        //     let seatData = cc.fy.gameNetMgr.getSeatByID(data.userId);
        //     seatData.isBaoTing = false;
        //     seatData.isTianTing = false;
        //     self.baoting[seatData.seatindex] = null;
        //     self.dispatchEvent("cancelTing", data);
        // });

        // 黄庄次数
        cc.fy.net.addHandler("game_huangzhuang_num_push", function (data) {
            console.log("game_huangzhuang_num_push");
            console.log(data);
            self.huangzhuangNum = data;
            self.dispatchEvent("huangzhuang_num_change");
        });

        // 洗牌
        cc.fy.net.addHandler("shuffle_oneself_notify", function (data) {
            console.log('shuffle_oneself_notify');
            cc.fy.gameNetMgr.dispatchEvent("ready_recv");
            cc.fy.net.send('ready');
            if (data.code != 0) {
                cc.fy.hintBox.show(data.msg);
            }
        });
        // 洗牌
        cc.fy.net.addHandler("shuffle_oneself", function (data) {
            console.log('shuffle_oneself');
            cc.fy.gameNetMgr.dispatchEvent("ready_recv");
            cc.fy.net.send('ready');
            if (data.code != 0) {
                cc.fy.hintBox.show(data.msg);
            }
        });
        // 洗牌 
        cc.fy.net.addHandler("shuffle_push", function (data) {
            console.log('shuffle_push');
            self.dispatchEvent('shuffle_push_result', data);



            // console.log('game_start_push');
            // console.log(data);
            self.reset();
            self.gamestate = "start";
            // self.resetSeats();
            self.dispatchEvent('game_start');
            if (cc.fy.sceneMgr.isHallScene()) {
                cc.fy.sceneMgr.loadGameScene(self.conf.type);
            }
            // cc.fy.userMgr.refreshGeo(true);

            // cc.fy.hintBox.show("");
        });

        // cc.fy.net.addHandler("push_lazhuang", function (data) {
        //     console.log("==>> push_lazhuang: ", data);
        //     self.gamestate = "lazhuang";
        //     var selfSeat = cc.fy.gameNetMgr.getSelfData();
        //     selfSeat.lazhuang = -1;
        //     cc.fy.gameNetMgr.dispatchEvent("push_lazhuang_ctc", data);
        // });

        // cc.fy.net.addHandler("lazhuang_result_push", function (data) {
        //     console.log("==>> lazhuang_result_push: ", data);
        //     self.lazhuangData = data;
        //     var si = self.getSeatIndexByID(data.userid);
        //     if (si != -1) {
        //         self.seats[si].lazhuang = data.score;
        //     }
        //     cc.fy.gameNetMgr.dispatchEvent("lazhuang_result_push_ctc", data);
        // });

        // cc.fy.net.addHandler("push_dingzhuang", function (data) {
        //     console.log("==>> push_dingzhuang: ", data);
        //     self.gamestate = "dingzhuang";
        //     var selfSeat = cc.fy.gameNetMgr.getSelfData();
        //     selfSeat.dingzhuang = -1;
        //     cc.fy.gameNetMgr.dispatchEvent("push_dingzhuang_ctc", data);
        // });

        // cc.fy.net.addHandler("dingzhuang_result_push", function (data) {
        //     console.log("==>> dingzhuang_result_push: ", data);
        //     self.dingzhuangData = data;
        //     var si = self.getSeatIndexByID(data.userid);
        //     if (si != -1) {
        //         self.seats[si].dingzhuang = data.score;
        //     }
        //     cc.fy.gameNetMgr.dispatchEvent("dingzhuang_result_push_ctc", data);
        // });
    },

    doGuo: function (seatIndex, pai) {
        var seatData = this.seats[seatIndex];
        var folds = seatData.folds;
        // folds.push(pai);
        // this.chupai = -1;
        this.lastTurn = seatIndex;
        this.dispatchEvent('guo_notify', seatData);
        this.showKuangArr();
    },

    doMopai: function (seatIndex, pai) {
        var seatData = this.seats[seatIndex];
        if (seatData.holds) {
            seatData.holds.push(pai);
            this.dispatchEvent('game_mopai', { seatIndex: seatIndex, pai: pai });
        }
        this.showKuangArr();
    },

    doChupai: function (seatIndex, pai, tingCard) {
        console.log("CHU PAI");
        this.chupai = pai;
        var seatData = this.seats[seatIndex];
        if (seatData.holds) {
            var idx = seatData.holds.indexOf(pai);
            seatData.holds.splice(idx, 1);
        }
        if (seatData.folds) {
            seatData.folds.push(pai);
        }
        this.dispatchEvent('game_chupai_notify', { seatData: seatData, pai: pai });
        this.showKuangArr();
    },

    doHua: function (seatIndex, flowers) {
        var seatData = this.seats[seatIndex];
        if (seatData.holds) {
            for (let i = 0; i < flowers.length; i++) {
                var idx = seatData.holds.indexOf(flowers[i]);
                if (idx >= 0) {
                    seatData.holds.splice(idx, 1);
                }
            }
            cc.fy.gameNetMgr.dispatchEvent("holds_initselfmahjongs");
        }
    },

    doPeng: function (seatIndex, pai, index) {
        var seatData = this.seats[seatIndex];
        console.log("seatData", seatData);
        console.log("seatIndex", seatIndex);
        console.log("pai", pai);
        console.log("index", index);
        seatData.psign.push(index);
        //移除手牌
        if (seatData.holds) {
            for (var i = 0; i < 2; ++i) {
                var idx = seatData.holds.indexOf(pai);
                seatData.holds.splice(idx, 1);
            }
        }
        //更新碰牌数据
        var pengs = seatData.pengs;
        pengs.push(pai);
        if (index != null && index != -2) {
            this.removeMJFromFolds(index, pai);
        }
        this.dispatchEvent('peng_notify', { seatData: seatData, pai: pai });
        this.showKuangArr();
    },
    doPeng_new: function (seatIndex, pai, turn) {
        console.log("dopeng:" + seatIndex + "//////" + pai + "//" + turn);
        var seatData = this.seats[seatIndex];
        //移除手牌
        if (seatData.holds) {
            for (var i = 0; i < 2; ++i) {
                var idx = seatData.holds.indexOf(pai);
                if (idx != -1) {
                    seatData.holds.splice(idx, 1);
                }
            }
        }
        //更新碰牌数据
        var pengs = seatData.pengs;
        pengs.push([pai, turn]);
        if (turn != null && turn != -2) {
            this.removeMJFromFolds(turn, pai);
        }
        this.dispatchEvent('peng_notify', { seatData: seatData, pai: pai });
        this.showKuangArr();
    },
    doChi: function (seatIndex, chipai, arryPai, index) {
        var seatData = this.seats[seatIndex];
        //移除手牌
        if (seatData.holds) {
            for (var i = 0; i < 2; ++i) {
                var idx = seatData.holds.indexOf(arryPai[i]);
                seatData.holds.splice(idx, 1);
            }
        }
        //更新吃数据
        var chipais = seatData.chipais;
        if (arryPai[0] > chipai) {
            chipais.push(chipai);
            chipais.push(arryPai[0]);
            chipais.push(arryPai[1]);
        }
        else if (arryPai[1] < chipai) {
            chipais.push(arryPai[0]);
            chipais.push(arryPai[1]);
            chipais.push(chipai);
        }
        else {
            chipais.push(arryPai[0]);
            chipais.push(chipai);
            chipais.push(arryPai[1]);
        }
        if (index != null && index != -2) {
            this.removeMJFromFolds(index, chipai);
        }
        this.dispatchEvent('chi_notify', seatData);
        this.showKuangArr();
    },

    doGameOver: function (data) {
        this._taskData = null;
        // this.baida = -1;
        var results = data.results;
        for (var i = 0; i < this.seats.length; ++i) {
            this.seats[i].score = results.length == 0 ? 0 : results[i].totalscore;
            this.seats[i].ready = false;
            if (results.length == 0 && data.scores != null && data.scores.length > 0) {
                this.seats[i].score = this.chackGameResult(i, data.scores);
            }
        }
        if (data.endinfo) {
            this.isOver = true;
        }

        if (this.conf.type == cc.GAMETYPE.SZER || this.conf.type == cc.GAMETYPE.SZBD) {
            this.dispatchEvent('game_over', data);
        }
        else {
            this.dispatchEvent('game_over', results);
        }

        if (data.endinfo) {
            if (this.conf.type == cc.GAMETYPE.GD) {
                if (data.endinfo.uuid) {
                    this.roomUuid = data.endinfo.uuid;
                }
            }
            else {
                if (data.endinfo.length > 0 && data.endinfo[0].uuid) {
                    this.roomUuid = data.endinfo[0].uuid;
                }
            }
            console.log("UUID----------------->", this.roomUuid);
            this.isReturn = false;
            this.dispatchEvent('game_end', data);
        }

        this.reset();
    },

    getGangType: function (seatData, pai) {
        if (seatData.pengs.indexOf(pai) != -1) {
            return "wangang";
        }
        else {
            var cnt = 0;
            for (var i = 0; i < seatData.holds.length; ++i) {
                if (seatData.holds[i] == pai) {
                    cnt++;
                }
            }
            if (cnt == 3) {
                return "diangang";
            }
            else {
                return "angang";
            }
        }
    },

    doGang: function (seatIndex, pai, gangtype, si0) {
        console.log("doGang", seatIndex, pai, gangtype, si0);
        var seatData = this.seats[seatIndex];
        console.log("doGang ---------------------->>>");
        console.log(seatData);
        console.log(pai);
        if (!gangtype) {
            gangtype = this.getGangType(seatData, pai);
            console.log(gangtype);
        }
        if (gangtype == "wangang") {
            if (seatData.pengs.indexOf(pai) != -1) {
                var idx = seatData.pengs.indexOf(pai);
                if (idx != -1) {
                    seatData.pengs.splice(idx, 1);
                    seatData.psign.splice(idx, 1);
                }
            }
            seatData.wangangs.push(pai);
            if (si0 > -1) {
                seatData.bwguserid.push(si0);
            }
        }
        // 删手牌
        if (seatData.holds) {
            for (var i = 0; i < 4; ++i) {
                var idx = seatData.holds.indexOf(pai);
                if (idx == -1) {
                    //如果没有找到，表示移完了，直接跳出循环
                    break;
                }
                seatData.holds.splice(idx, 1);
            }
        }
        if (gangtype == "angang") {
            seatData.angangs.push(pai);
        } else if (gangtype == "diangang") {
            seatData.diangangs.push(pai);
            seatData.bdguserid.push(si0);
        }
        if (si0 != -2 && gangtype != null && gangtype != "angang") {
            this.removeMJFromFolds(si0, pai);
        }
        this.dispatchEvent('gang_notify', { seatData: seatData, gangtype: gangtype });
        this.showKuangArr();
    },
    getIndexOfPeng: function (pengs, pai) {
        if (pengs != null) {
            for (var i = 0; i < pengs.length; i++) {
                if (pengs[i][0] == null) {
                    if (pengs[i] == pai) {
                        return i;
                    }
                }
                else {
                    if (pengs[i][0] == pai) {
                        return i;
                    }
                }
            }
        }
        return -1;
    },
    doGang_new: function (seatIndex, pai, gangtype, turn) {
        console.log("doGang_new", seatIndex, pai, gangtype, turn);
        var seatData = this.seats[seatIndex];
        console.log(seatData);
        console.log(pai);
        if (!gangtype) {
            gangtype = this.getGangType(seatData, pai);
            console.log(gangtype);
        }
        if (gangtype == "wangang") {
            var idx = this.getIndexOfPeng(seatData.pengs, pai);
            if (idx != -1) {
                seatData.pengs.splice(idx, 1);
            }
            seatData.wangangs.push([pai, turn]);
        }
        // 删手牌
        if (seatData.holds) {
            for (var i = 0; i < 4; ++i) {
                var idx = seatData.holds.indexOf(pai);
                if (idx == -1) {
                    //如果没有找到，表示移完了，直接跳出循环
                    break;
                }
                seatData.holds.splice(idx, 1);
            }
        }
        if (gangtype == "angang") {
            // seatData.angangs.push(pai);
            seatData.angangs.push([pai, turn]);
        } else if (gangtype == "diangang") {
            // seatData.diangangs.push(pai);
            // seatData.bdguserid.push(turn);
            seatData.diangangs.push([pai, turn]);
        }
        if (turn != -2 && gangtype != null && gangtype != "angang") {
            this.removeMJFromFolds(turn, pai);
        }
        this.dispatchEvent('gang_notify', { seatData: seatData, gangtype: gangtype });
        this.showKuangArr();
    },

    doHu: function (data) {
        this.isHuPai = true;
        this.dispatchEvent('hupai', data);
    },
    getIndexOfPeng: function (pengs, pai) {
        console.log(pengs);
        if (pengs != null) {
            for (var i = 0; i < pengs.length; i++) {
                console.log(pengs[i][0]);
                console.log(pai);
                if (pengs[i][0] == null) {
                    if (pengs[i] == pai) {
                        return i;
                    }
                }
                else {
                    if (pengs[i][0] == pai) {
                        return i;
                    }
                }
            }
        }

        return -1;
    },

    doTurnChange: function (si) {
        var data = {
            last: this.turn,
            turn: si,
        }
        this.lastTurn = this.turn;
        this.turn = si;
        this.dispatchEvent('game_chupai', data);
    },
    isShowOtherHolds: function () {
        if (this.seats != null) {
            for (var i = 0; i < this.seats.length; i++) {
                if (i != this.seatIndex && this.seats[i].holds != null && this.seats[i].holds.length > 0) {
                    return true;
                }
            }
        }

        return false;
    },

    resetSeats: function () {
        for (var i = 0; i < this.seats.length; ++i) {
            var s = this.seats[i];
            if (s.folds == null) {
                s.folds = [];
            }
            if (s.pengs == null) {
                s.pengs = [];
            }
            if (s.angangs == null) {
                s.angangs = [];
            }
            if (s.diangangs == null) {
                s.diangangs = [];
            }
            if (s.wangangs == null) {
                s.wangangs = [];
            }
            if (s.flowers == null) {
                s.flowers = [];
            }
            if (s.piaohua == null) {
                s.piaohua = -1;
            }

            // if (s.chipais == null) {
            //     s.chipais = [];
            // }
        }
    },

    connectGameServer: function (data, callback, reqTime) {
        console.log("连游戏服啦   --" + JSON.stringify(data));
        cc.fy.userMgr.isInRoom = true;
        cc.fy.net.close();
        let self = cc.fy.gameNetMgr;
        self.dissoveData = null;

        cc.fy.net.ip = data.ip + ":" + data.port;
        cc.fy.net.mainIp = cc.fy.net.ip;
        self.initHandlers();
        console.log("connectGameServer ip : " + cc.fy.net.ip);
        if (reqTime == null) {
            reqTime = 5;
        }
        let curReqTime = 0;

        if (self.connectTimeOut != null) {
            clearTimeout(self.connectTimeOut);
            self.connectTimeOut = null;
        }
        let onConnectOK = function () {
            console.log("onConnectOK");
            if (self.connectTimeOut != null) {
                clearTimeout(self.connectTimeOut);
                self.connectTimeOut = null;
            }
            if (callback != null) {
                callback(0);
            }
            let sd = {
                token: data.token,
                roomid: data.roomid,
                time: data.time,
                sign: data.sign,
            };
            cc.fy.net.send("login", sd);
        };

        let onConnectFailed = function () {
            console.log("failed.");
            if (self.connectTimeOut != null) {
                clearTimeout(self.connectTimeOut);
                self.connectTimeOut = null;
            }
        };

        let doConnect = function () {
            if (self.connectTimeOut != null) {
                clearTimeout(self.connectTimeOut);
                self.connectTimeOut = null;
            }
            if (curReqTime++ > reqTime) {
                if (callback != null) {
                    callback(-111);
                }
            }
            else {
                console.log("cc.fy.net.ip = " + cc.fy.net.ip);
                cc.fy.net.connect(onConnectOK, onConnectFailed);
                self.connectTimeOut = setTimeout(function () {
                    cc.fy.net.ip = cc.fy.http.getNextUrl(cc.fy.net.ip);
                    doConnect();
                }, 3000);
            }
        }

        doConnect();
    },

    chackGameResult: function (seatIndex, scores) {
        var resultsScore = 0;
        var length = scores.length;
        for (var i = 0; i < length; i++) {
            resultsScore += scores[i][seatIndex];
        }

        return resultsScore;
    },
    removeMJFromFolds: function (seatIndex, pai) {
        console.log("removeMJFromFolds seatIndex", seatIndex);
        var seatData = this.seats[seatIndex];
        var folds = seatData.folds;
        console.log("removeMJFromFolds seatData", seatData);
        console.log("removeMJFromFolds folds", folds);
        if (pai == folds[folds.length - 1] || pai == (folds[folds.length - 1] - 1000)) {
            folds.pop();
        }
        this.dispatchEvent('remove_mj_notify', seatData);
    },

    showKuangArr: function () {
        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZCT) {
            var holdsList = cc.find("Canvas/gameMain/game/myself/holds");
            for (var i = 0; i < holdsList.childrenCount; ++i) {
                var n = holdsList.children[i].getChildByName("hongzhongbiankuang");
                if (n != null) {
                    n.active = false;
                }
            }

            for (var i = 0; i < holdsList.childrenCount; ++i) {
                var n = holdsList.children[i].getChildByName("hongzhongbiankuang");
                if (holdsList.children[i].mjId == 43) {
                    if (n != null) {
                        n.active = true;
                    }
                }

            }
        }
    },
    getSideByLocalIndex: function (index) {
        var sides = ["myself", "right", "up", "left"];
        return sides[index];
    },

    getLocalIndexBySide: function (side) {
        var sides = ["myself", "right", "up", "left"];
        for (var i = 0; i < sides.length; i++) {
            if (side == sides[i]) {
                return i;
            }
        }
    },

    isWJMJ: function () {
        if (this.conf.type == cc.GAMETYPE.SZWJ) {
            return true;
        }
        return false;
    },
    isERMJ: function () {
        if (this.conf.type == cc.GAMETYPE.SZER) {
            return true;
        }
        return false;
    },
    isFlower: function (pai) {
        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZCT && pai >= 43) {
            return true;
        }
        else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZBD && pai >= 43 && pai != 52) {
            return true;
        }
        return false;
    },
    getIP: function (seat) {
        var onGetIP = function (ret) {
            if (ret.errmsg.ip != null) {
                seat.ip = ret.errmsg.ip;
            }
        };
        var data = {
            userId: seat.userid,
        };

        cc.fy.http.sendRequest("/get_ip", data, onGetIP);
    },

    getIsShareResult: function () {
        var self = this;
        if (self.conf.clubId == null) return;
        var url = "http://" + cc.fy.SI.clubHttpAddr;
        var onGetIP = function (data) {
            console.log("share_histroy_url", data);
            if (data.errcode == 0) {
                self._isShare = data.isShare
                console.log("===========>>>>>>>", self._isShare);
                self.dispatchEvent('share_result_push', data);
            }
        };
        var data = {
            clubid: self.conf.clubId,
        };
        console.log("share_history_url");
        cc.fy.http.sendRequest("/share_histroy_url", data, onGetIP, url);
    },

    // removeMJFromFolds: function (seatIndex, pai) {
    //     var seatData = this.seats[seatIndex];
    //     if (seatData && seatData.folds) {
    //         var folds = seatData.folds;
    //         if (pai == folds[folds.length - 1] || pai == (folds[folds.length - 1] - 1000)) {
    //             folds.pop();
    //         }
    //         this.dispatchEvent('game_updatefolds', { seatData: seatData });
    //     }
    // },

    resetAll: function () {
        cc.fy.gameNetMgr.isResetAll = true;
        cc.fy.userMgr.isInRoom = false;
        cc.fy.userMgr.oldRoomId = null;
        cc.fy.gameNetMgr.isDispress = false;
        cc.fy.gameNetMgr.isOver = true;
        cc.fy.gameNetMgr.isReturn = false;
        cc.fy.gameNetMgr.reset();
        cc.fy.gameNetMgr.clear();
        cc.fy.global.activitydata = null;
        cc.fy.haveShowed = null;
    },
});
