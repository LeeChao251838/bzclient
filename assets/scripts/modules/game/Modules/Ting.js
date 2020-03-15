cc.Class({
    extends: cc.Component,

    properties: {
        gameTing: null,
        tingCard: null,
        _myMJArr: [],
        // _curTingCard: null,
        // _pailist: [],
        // _btnTing: null,
        // _tingTip: null,
        // _tingTip_bg: null,
        // _tingTip_item: null,
        // _tingTip_hu: null,
        // _tingTip_con: null,
        // _ryp: null,
        // _marks: false,
        // _firstTing: -1,
        _maxCanTingPaiNum: 0,
        _mjGameJS: null
    },
    // use this for initialization
    onLoad: function () {
        if (cc.fy.replayMgr.isReplay() == true) {
            return;
        }
        this._myMJArr = [];
        this._mjGameJS = this.node.getComponent("MJGame");
        var gameChild = this.node.getChildByName("game");
        var myselfChild = gameChild.getChildByName("myself");
        var myholds = myselfChild.getChildByName("holds");
        for (var i = 0; i < myholds.children.length; ++i) {
            var sprite = myholds.children[i].getComponent(cc.Sprite);
            this._myMJArr.push(sprite);
        }
        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZTDH) { // || cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZER
            this.gameTing = require("mahTDHTingUtils");
        } else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZCT || cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZBD) {
            this.gameTing = require("mahHMJTingUtils");
            this.gameTing.setCanHuQiDui(cc.fy.gameNetMgr.conf.wanfa.huqidui == 1);
            this.gameTing.setCanHuHaoQi(cc.fy.gameNetMgr.conf.wanfa.haoqi == 1);
            this.gameTing.setIsBaiDa(cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZBD);
        } else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZHD) { // || cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZWJ) {
            this.gameTing = require("mahTDHBdTingUtils");
        } else {
            return;
        }
        this.tingCard = null;
        this._maxCanTingPaiNum = 0
        this.initHander();
        this.updateTingData();


    },
    initHander: function () {
        console.log("ting initHander");
        //初始化事件监听器
        var self = this;
        var game = cc.fy.gameNetMgr;
        game.addHandler('game_mopai_ting', function (data) {
            data = data;
            var pai = data.pai;
            if (self.isFlower(pai) == true) {
                // 摸到花牌不显示箭头
                self.hideDir();
            }
        });
        game.addHandler('game_chupai', function (data) {
            if (data.turn == cc.fy.gameNetMgr.seatIndex) {
                setTimeout(() => {
                    self.updateTingData();
                }, 66);
            }
        });
        game.addHandler('game_holds', function (data) {
            setTimeout(() => {
                self.updateTingData();
            }, 66);
        });

        // game.addHandler('gang_notify', function (data) { 
        // });
        // game.addHandler('peng_notify', function (data) {
        //     // setTimeout(() => {
        //     //     self.updateTingData();
        //     // }, 66);
        // });
        game.addHandler('guo_result', function (data) {
            console.log("ting guo_result _isRefreshTingData", cc._isRefreshTingData);
            if (cc.fy.gameNetMgr.turn == cc.fy.gameNetMgr.seatIndex) {
                setTimeout(() => {
                    self.updateTingData();
                }, 10);
            }
        });

    },
    hideDir: function () {
        for (var i = 0; i < this._myMJArr.length; ++i) {
            var sprite = this._myMJArr[i];
            sprite.node.getChildByName("dir").active = false;
        }
    },
    // subTingCard: function (pai, subnum) {
    //     var self = this;
    //     var hudata = cc.fy.gameNetMgr._huData;
    //     if (hudata == null) return;
    //     for (var i = 0; i < hudata.length; i++) {
    //         var pai = hudata[i].pai
    //         for (var k = i; k < pai[k]; k++) {
    //             pai
    //         }

    //     }

    // },
    updateTingData: function () {
        // 听牌
        console.log(" updateTingData");

        var selfSeat = cc.fy.gameNetMgr.seats[cc.fy.gameNetMgr.seatIndex];
        var holds = selfSeat.holds;
        if (holds == null || holds.length <= 0) {
            return;
        }
        var flowers = [];
        if (selfSeat.flowers) {
            flowers = selfSeat.flowers;
        }
        holds = holds.slice(0);
        var pileCards = this.gameTing.getPileCards(selfSeat);
        var dicPile = this.gameTing.getDictCntRiverAndPile(cc.fy.gameNetMgr.seats);
        var l = holds.length;
        this._maxCanTingPaiNum = this.gameTing.getCanCalcTingList(dicPile).length;
        if (l == 2 || l == 5 || l == 8 || l == 11 || l == 14) {
            if (this.isFlower(holds[l - 1]) == true) {
                // 摸到花牌不显示箭头
                this.hideDir();
                return;
            }
            var selfHolds = [];
            var celting = {};
            var tingData = [];
            for (var i = 0; i < holds.length; i++) {
                if (!cc._isRefreshTingData) {
                    tingData = [];
                    return;
                }
                if (celting[holds[i]] != null || this.isBaida(holds[i])) {
                    continue;
                }
                celting[holds[i]] = 1;// 记录已经计算的牌 已经算过就不继续计算
                selfHolds = [];
                for (var j = 0; j < holds.length; j++) {
                    if (i != j) {
                        selfHolds.push(holds[j]);
                    }
                }
                var _tingCard = this.gameTing.getTingCards(selfHolds, pileCards, flowers, dicPile, cc.fy.gameNetMgr.baida);
                if (_tingCard.length > 0) {
                    tingData.push({ pai: holds[i], hupai: _tingCard });
                }
            }
            cc.fy.gameNetMgr._huData = tingData;
            cc.fy.gameNetMgr.dispatchEvent("can_hu_prompt_push", tingData);

        } else {
            var selfHolds = [];
            for (var j = 0; j < holds.length; j++) {
                selfHolds.push(holds[j]);
            }
            var _tingCard = this.gameTing.getTingCards(selfHolds, pileCards, flowers, dicPile, cc.fy.gameNetMgr.baida);
            if (_tingCard.length > 0) {
                // tingData.push({ pai: holds[i], hupai: _tingCard });
                cc.fy.gameNetMgr._tingList = _tingCard;
            }
        }

    },

    getCanCalcTingList: function () {
        return this._maxCanTingPaiNum;
    },
    isFlower: function (pai) {
        return cc.fy.gameNetMgr.isFlower(pai);
    },
    isBaida: function (pai) {
        return cc.fy.mahjongmgr.isBaida(pai);
    },
    getPaiMaxNum: function (pai) {
        if (cc.fy.gameNetMgr.fanbaida == pai) {
            return 3;
        }
        return 4;
    },
}); 