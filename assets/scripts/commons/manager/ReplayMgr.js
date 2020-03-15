
var ACTION_CHUPAI = 1;
var ACTION_MOPAI = 2;
var ACTION_PENG = 3;
var ACTION_GANG = 4;
var ACTION_HU = 5;
var ACTION_ZIMO = 6;
var ACTION_FLOWER = 7;
var ACTION_GUO = 8;
var ACTION_CHI = 9;
var ACTION_CANACT = 18;// 特殊动作：吃碰杠胡前可以操作的动作记录
var ACTION_TING = 11;
var ACTION_CALL = 13; //叫地主
var ACTION_ROB = 12; //抢地主
var ACTION_DOUBLE = 14;
var ACTION_MING = 15;
var ACTION_SCORE = 16;
var ACTION_JIABEI = 19;// 加倍
var ACTION_HUANGFAN = 20;// 荒番局的标志 具体数字
var ReplayActionCtrl = require("ReplayActionCtrl");
cc.Class({
    extends: cc.Component,
    properties: {
        _lastAction: null,
        _actionRecords: null,
        _currentIndex: 0,

        isPlaying: true,

        replayAction: ReplayActionCtrl,// 回放动作补充脚本
    },
    // use this for initialization
    onLoad: function () {
    },
    // 切换坐位
    changeSeat: function () {
        if (this.isReplay() == false) {
            return;
        }
        // 换座位只需要切换本地座位号就行了
        // 旋转切换坐位，逆时针
        cc.fy.gameNetMgr.seatIndex++;
        console.log('cc.fy.gameNetMgr.seats:', cc.fy.gameNetMgr.seats);
        if (cc.fy.gameNetMgr.seatIndex == cc.fy.gameNetMgr.seats.length) {
            cc.fy.gameNetMgr.seatIndex = 0;
        }
        console.log(cc.fy.gameNetMgr.conf.type);
        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.PDK) {
            cc.fy.gameNetMgr.dispatchEvent('pdk_game_begin');
        }
        else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.DDZ) {
            cc.fy.ddzGameNetMgr.dispatchEvent("ddz_game_begin");
        }
        else {
            cc.fy.gameNetMgr.dispatchEvent('game_begin');
        }
    },
    getDetailOfGameByCode: function (code) {
        // 通过战绩分享码获取战绩
        var _getDetailOfGame = function (uuid, idx) {
            cc.fy.userMgr.getDetailOfGame(uuid, idx, function (data) {
                data.base_info = JSON.parse(data.base_info);
                data.action_records = JSON.parse(data.action_records);
                data.seats = JSON.parse(data.seats);
                for (var i = 0; i < data.seats.length; i++) {
                    if (data.seats[i].userId != null) {
                        data.seats[i].userid = data.seats[i].userId;
                    }
                }
                console.log("==>> seats: ", data.seats);
                for (var i = 0; i < data.seats.length; i++) {
                    if (data.seats[i].name) {
                        data.seats[i].name = new Buffer(data.seats[i].name, 'base64').toString();
                    }
                }
                var curRoomInfoTemp = {
                    id: uuid.substr(uuid.length - 6, 6), // 房间号
                    seats: data.seats,
                };
                cc.fy.gameNetMgr.prepareReplay(curRoomInfoTemp, data);
                cc.fy.replayMgr.init(data);
                cc.fy.sceneMgr.loadGameScene(cc.fy.gameNetMgr.conf.type);
            });
        };

        cc.fy.userMgr.getDetailOfGameSharecode(code, function (data) {
            _getDetailOfGame(data.uuid, data.index);
        });
    },

    clear: function () {
        this._lastAction = null;
        this._actionRecords = null;
        this._currentIndex = 0;
        this._double=[0,0];

    },

    init: function (data) {
        this._actionRecords = data.action_records;
        if (this._actionRecords == null) {
            this._actionRecords = {};
        }
        this._currentIndex = 0;
        this._lastAction = null;
        this._double=[0,0];

    },

    isReplay: function () {
        return this._actionRecords != null;
    },

    getNextAction: function () {
        if (this._currentIndex >= this._actionRecords.length) {
            return null;
        }

        var data = {};

        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.GD) {
            var si = this._actionRecords[this._currentIndex++];
            var action = this._actionRecords[this._currentIndex++];
            var pai = this._actionRecords[this._currentIndex++];
            data = { si: si, type: action, pai: pai };
        }
        else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.PDK) {
            var si = this._actionRecords[this._currentIndex++];
            var action = this._actionRecords[this._currentIndex++];
            var pai = this._actionRecords[this._currentIndex++];
            data = { si: si, type: action, pai: pai };
        }
        else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.DDZ) {
            var si = this._actionRecords[this._currentIndex++];
            var action = this._actionRecords[this._currentIndex++];
            var pai = this._actionRecords[this._currentIndex++];
            data = { si: si, type: action, pai: pai };
        }
        else {
            var si = this._actionRecords[this._currentIndex++];
            var action = this._actionRecords[this._currentIndex++];
            var pai = this._actionRecords[this._currentIndex++];
            var peng = this._actionRecords[this._currentIndex++];
            var wangang = this._actionRecords[this._currentIndex++];
            var diangang = this._actionRecords[this._currentIndex++];
            data = { si: si, type: action, pai: pai, peng: peng, wangang: wangang, diangang: diangang };
        }
        return data;
    },
    // 获取下一步动作但是不增加索引数量
    getNextActionNotUp: function (num) {
        if (this._currentIndex >= this._actionRecords.length) {
            return null;
        }

        var si = this._actionRecords[this._currentIndex + num * 3 + 0];
        var action = this._actionRecords[this._currentIndex + num * 3 + 1];
        var pai = this._actionRecords[this._currentIndex + num * 3 + 2];
        return { si: si, type: action, pai: pai };
    },

    takeAction: function () {

        var action = this.getNextAction();
        console.log(action);

        // if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.GD) {
        //     if (action == null) {
        //         return -1;
        //     }
        //     if (action.type == ACTION_CHUPAI) {
        //         cc.fy.gdGameNetMgr.doPlayCardReplay(action.pai);
        //         return 1.0;
        //     }
        // }
        // else 
        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.PDK) {
            if (action == null) {
                return -1;
            }
            if (action.type == ACTION_CHUPAI) {
                cc.fy.pdkGameNetMgr.doPlayCardReplay(action.pai);
                return 1.0;
            }
        }
        // else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.DDZ) {
        //     if (action == null) {
        //         return -1;
        //     }
        //     if (action.type == ACTION_CHUPAI) {
        //         cc.fy.ddzGameNetMgr.doPlayCardReplay(action.pai);
        //         return 1.0;
        //     }

        //     if (action.type == ACTION_CALL || action.type == ACTION_ROB) {
        //         cc.fy.ddzGameNetMgr.doCallLord(action);
        //         return 1.0;
        //     }

        //     if (action.type == ACTION_DOUBLE) {
        //         cc.fy.ddzGameNetMgr.doDoubleTimes(action);
        //         return 1.0;
        //     }

        //     if (action.type == ACTION_MING) {
        //         cc.fy.ddzGameNetMgr.doMingPai(action);
        //         return 1.0;
        //     }

        //     if (action.type == ACTION_SCORE) {
        //         cc.fy.ddzGameNetMgr.doCallScore(action);
        //         return 1.0;
        //     }
        // }

        if (this._lastAction != null && this._lastAction.type == ACTION_CHUPAI) {
            if (action != null && action.type != ACTION_PENG && action.type != ACTION_GANG && action.type != ACTION_HU) {
                cc.fy.gameNetMgr.doGuo(this._lastAction.si, this._lastAction.pai);
            }
        }
        this._lastAction = action;
        if (action == null) {
            return -1;
        }
        var nextActionDelay = 1.0;
        if (action.type == ACTION_CHUPAI) {
            console.log("chupai");
            this.replayAction.hideAllAction();
            cc.fy.gameNetMgr.doChupai(action.si, action.pai);
            return 1.0;
        } else if (action.type == ACTION_MOPAI) {
            this.replayAction.hideAllAction();
            console.log("mopai");
            cc.fy.gameNetMgr.doMopai(action.si, action.pai);
            cc.fy.gameNetMgr.doTurnChange(action.si);
            return 0.5;
        } else if (action.type == ACTION_CHI) {
            this.replayAction.hideAllAction();// 处理了下一个动作就隐藏动作面板
            console.log("chipai");
            var strPai = action.pai;
            var arrPai = strPai.split("|");
            for (var i = 0; i < arrPai.length; ++i) {
                arrPai[i] = parseInt(arrPai[i]);
            }
            var chipai = arrPai[0];
            arrPai.splice(0, 1);
            var si0 = cc.fy.gameNetMgr.getUpSeatIndexBySeatIndex(action.si);
            // var si0 = cc.fy.gameNetMgr.getSeatIndexByID();

            cc.fy.gameNetMgr.doChi(action.si, chipai, arrPai, si0);
            cc.fy.gameNetMgr.doTurnChange(action.si);
            return 1.0;
        } else if (action.type == ACTION_PENG) {
            this.replayAction.hideAllAction();// 处理了下一个动作就隐藏动作面板
            console.log("peng");
            console.log(action.peng);
            var bpuserId = action.peng;
            var si0 = cc.fy.gameNetMgr.getSeatIndexByID(bpuserId);
            if (cc.fy.gameNetMgr.isWJMJ()) {
                // si0 = bpuserId;
                cc.fy.gameNetMgr.doPeng_new(action.si, action.pai, si0);

            } else {
                cc.fy.gameNetMgr.doPeng(action.si, action.pai, si0);

            }
            cc.fy.gameNetMgr.doTurnChange(action.si);
            return 1.0;
        } else if (action.type == ACTION_TING) {
            this.replayAction.hideAllAction();
            console.log("ting");
            var seatData = cc.fy.gameNetMgr.seats[action.si];
            var data = {
                userId: seatData.userid,
                pai: action.pai,
            }
            // if (data.userId == cc.fy.userMgr.userId) {
            //     cc.fy.gameNetMgr.dispatchEvent("tingpai",data);
            // }
            // else{
            //     cc.fy.gameNetMgr.dispatchEvent("otherTingPai",data);
            // }
            cc.fy.gameNetMgr.dispatchEvent('game_tingresult', data);
            return 1.0;

        } else if (action.type == ACTION_GANG) {
            this.replayAction.hideAllAction();// 处理了下一个动作就隐藏动作面板
            console.log("gang");
            cc.fy.gameNetMgr.dispatchEvent('hangang_notify', action.si);
            if (action.wangang != -1) {
                var bguserId = action.wangang;
                var si0 = cc.fy.gameNetMgr.getSeatIndexByID(bguserId);



                if (cc.fy.gameNetMgr.isWJMJ()) {
                    cc.fy.gameNetMgr.doGang_new(action.si, action.pai, "wangang", si0);
                }
                else {
                    cc.fy.gameNetMgr.doGang(action.si, action.pai, "wangang", si0);
                }
            }
            else if (action.diangang != -1) {
                var bguserId = action.diangang;
                var si0 = cc.fy.gameNetMgr.getSeatIndexByID(bguserId);
                // cc.fy.gameNetMgr.doGang(action.si, action.pai, "diangang", si0);
                if (cc.fy.gameNetMgr.isWJMJ()) {
                    cc.fy.gameNetMgr.doGang_new(action.si, action.pai, "diangang", si0);
                }
                else {
                    cc.fy.gameNetMgr.doGang(action.si, action.pai, "diangang", si0);
                }
            }
            else {
                cc.fy.gameNetMgr.doGang(action.si, action.pai, "angang");
            }
            // cc.fy.gameNetMgr.doGang(action.si,action.pai,"diangang",si0,-2);
            cc.fy.gameNetMgr.doTurnChange(action.si);
            return 1.0;
        } else if (action.type == ACTION_HU || action.type == ACTION_ZIMO) {
            this.replayAction.hideAllAction();// 处理了下一个动作就隐藏动作面板
            console.log("hu");
            cc.fy.gameNetMgr.doHu({ seatindex: action.si, hupai: action.pai, iszimo: false });
            return 1.5;
        } else if (action.type == ACTION_FLOWER) {
            var flowersData = action.pai;
            console.log('replay_flowers   ', flowersData);
            console.log('replay_flowers   this.this._currentIndex  ', this._currentIndex);
            var seats = cc.fy.gameNetMgr.seats;
            for (var i = 0; i < seats.length; ++i) {
                var si = cc.fy.gameNetMgr.getSeatIndexByID(flowersData[i].uid);
                if (si != -1) {
                    seats[si].flowers = [];
                    seats[si].flowers = flowersData[i].flowers;
                }
            }
            // cc.fy.gameNetMgr.doMopai(action.si, action.pai);
            // cc.fy.gameNetMgr.doHua(seatIndex, data.newFlowers);

            if (this._currentIndex / 6 > seats.length) {
                cc.fy.gameNetMgr.dispatchEvent("game_flowers", { userId: cc.fy.gameNetMgr.getIDBySeatIndex(action.si), newFlowers: flowersData[si].flowers });
            } else if (this._currentIndex / 6 == seats.length) {
                for (var i = 0; i < seats.length; ++i) {
                    var si = cc.fy.gameNetMgr.getSeatIndexByID(flowersData[i].uid);
                    if (si != -1 && seats[si].flowers.length > 0) {
                        cc.fy.gameNetMgr.dispatchEvent("game_flowers", { userId: cc.fy.gameNetMgr.getIDBySeatIndex(si), newFlowers: seats[si].flowers });
                        ;
                    }
                }

            }

            var selfHolds = seats[action.si].holds;
            if (selfHolds && cc.fy.gameNetMgr.isFlower(selfHolds[selfHolds.length - 1])) {    // 花牌
                // var audioUrl = "nv/" + "flower.mp3";
                // cc.fy.audioMgr.playSFX(audioUrl);
                cc.fy.gameNetMgr.chupai = selfHolds[selfHolds.length - 1];
                var idx = selfHolds.indexOf(selfHolds[selfHolds.length - 1]);
                selfHolds.splice(idx, 1);
            }


            return 0.5;
        }
        else if (action.type == ACTION_GUO) {
            this.replayAction.hideAllAction();// 处理了下一个动作就隐藏动作面板
            console.log('replay_guo');
            cc.fy.gameNetMgr.dispatchEvent('guo_result', action.si);
            // cc.fy.gameNetMgr.doTurnChange(action.si);
            return 1.0;
        }
        // else if(action.type == ACTION_TING){
        //     this.replayAction.hideAllAction();// 处理了下一个动作就隐藏动作面板
        //     console.log('replay_ting');
        //     cc.fy.gameNetMgr.dispatchEvent('game_tingresult', action.si);
        //     // cc.fy.gameNetMgr.doTurnChange(action.si);
        //     return 1.0;
        // }
        else if (action.type == ACTION_CANACT) {// 可行动的操作显示
            for (var i = 0; i < 10; i++) {
                var nextAction = this.getNextActionNotUp(i);
                console.log("NextAction----1---", nextAction);
                if (nextAction == null) break;
                var sides = [];
                if (cc.fy.gameNetMgr.seats.length== 3) {
                    sides = ["myself", "right", "left"];
                } else if (cc.fy.gameNetMgr.seats.length== 2) {
                    sides = ["myself", "up"];
                } else {
                    sides = ["myself", "right", "up", "left"];
                }
                var localIndex =  cc.fy.gameNetMgr.getLocalIndexBySide(sides[cc.fy.gameNetMgr.getLocalIndex(action.si)]);
                if (nextAction.type == ACTION_CHUPAI || nextAction.type == ACTION_MOPAI) break;// 如果是摸牌和出牌则无效化
                //if(nextAction.type == ACTION_JIABEI) return 0.5;// 加倍跳过 不显示
                console.log("NextAction----2---", nextAction);

                if (nextAction.si == action.si) { 
                    this.replayAction.setActionData(localIndex, action.pai, nextAction.type);
                    return 1.0;
                }
            }
            // this.replayAction.setActionData(localIndex, action.pai, -1);
            return 0.5;
        } else if (action.type == ACTION_JIABEI) {// 可行动的操作显示
            this.replayAction.hideAllAction();
            console.log("ting");
            var seatData = cc.fy.gameNetMgr.seats[action.si];
            // this._double[action.si]++;
            // if(this._double[action.si]!=null){
            //     this._double[action.si]++;
            // }else{
                this._double[action.si]+=1;
            // }
            console.log(this._double);

            // if (data.userId == cc.fy.userMgr.userId) {
            //     cc.fy.gameNetMgr.dispatchEvent("tingpai",data);
            // }
            // else{
            //     cc.fy.gameNetMgr.dispatchEvent("otherTingPai",data);
            // }
            var data = {
                userid: seatData.userid,
                double: this._double[action.si],
            }
            cc.fy.gameNetMgr.dispatchEvent('double_res', data);
            return 1.0;
        }else if(action.type == ACTION_HUANGFAN){
            if(cc.fy.gameNetMgr.conf.type = cc.GAMETYPE.SZWJ){
                cc.fy.gameNetMgr.numOfDouble = action.pai
                cc.fy.gameNetMgr.dispatchEvent('game_num_double', cc.fy.gameNetMgr.numOfDouble);
            }
            return 0.1;
        } 
        else {
            return 0.1;
        }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});



