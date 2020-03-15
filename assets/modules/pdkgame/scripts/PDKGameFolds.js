var HoldDegree = {
    1: { start: 0, dis: 0 },
    2: { start: -2.5, dis: 5 },
    3: { start: -5, dis: 5 },
    4: { start: -7.5, dis: 16 / 3 },
    5: { start: -8.6, dis: 4.5 },
    6: { start: -9.5, dis: 4 },
    7: { start: -11.4, dis: 22 / 6 },
    8: { start: -12.8, dis: 26 / 7 },
    9: { start: -12.8, dis: 26 / 8 },
    10: { start: -12.8, dis: 26 / 9 },
    11: { start: -12.8, dis: 26 / 10 },
    12: { start: -12.8, dis: 26 / 11 },
    13: { start: -12.8, dis: 26 / 12 },
    14: { start: -12.8, dis: 2 },
    15: { start: -13.8, dis: 2 },
    16: { start: -14.5, dis: 1.95 },
}

var FoldY = [0, -2, -4, -7, -11, -15, -19, -24];
cc.Class({
    extends: cc.Component,

    properties: {
        _gameplayer: 3,       //玩家
        ndFolds: [],           //出的牌组 本地索引 0-3
        rotateRadius: 1821,            //牌旋转半径
        // ndFoldsRoot:[],       //出牌节点
        ndFoldsRoot: null,       //出牌节点
        ndBuchus: [],          //不出节点
        offset: 30,           //出牌间距
        tempFoldCards: null    //临时缓存的自己出牌的手牌
    },

    onLoad: function () {
        if (cc.fy.gameNetMgr.seats == null) {
            cc.fy.alert.show("该房间已解散", function () {
                cc.fy.sceneMgr.loadScene("hall");
            });
            console.log("cc.fy.gameNetMgr.seats is null");
            return;
        }
        var frameSize = cc.view.getFrameSize();

        if (frameSize.height) {
            this.rotateRadius = 1821 * 0.55;
        }


        this._gameplayer = cc.fy.gameNetMgr.seats.length;//cc.fy.gameNetMgr.conf.maxCntOfPlayers
        this.ndFolds = [];
        var game = this.node.getChildByName("game");
        var sides = this.getSideByPlay(this._gameplayer);

        this.ndFoldsRoot = this.node.getChildByName("game").getChildByName('folds');

        for (var i = 0; i < sides.length; i++) {
            var sidename = sides[i];

            var sideRoot = game.getChildByName(sidename);
            // var foldRoot = sideRoot.getChildByName("folds");
            // this.ndFoldsRoot.push(foldRoot);

            var buchu = sideRoot.getChildByName("buchu");
            if (buchu) {
                this.ndBuchus.push(buchu);
            }
        }

        this.initEventHandlers();
        this.initAllFolds();
    },

    initEventHandlers: function () {
        var self = this;
        var game = cc.fy.gameNetMgr;
        game.addHandler('pdk_game_begin', function (data) {
            self.hideAllBuchu();
            self.hideAllFolds();
        });

        game.addHandler('cc_pdk_stc_playcard', function (data) {
            self.hideAllBuchu();
            var seat = cc.fy.gameNetMgr.getLocalIndex(data.seatIndex);
            if (data.roundEnd) {
                // console.log("一轮结束")
                // if(cc.fy.replayMgr.isReplay()){
                //     var orders = cc.fy.pokerGameNetMgr.orders;
                //     if(orders){
                //         for(var i = 0; i < cc.fy.gameNetMgr.seats.length; i++){
                //             if(orders[i] != null && orders[i] >= 0 && i != data.seatIndex){
                //                 var si = cc.fy.gameNetMgr.getLocalIndex(i);
                //                 self.hideFolds(si);
                //                 self.hideBuchu(si);
                //             }
                //         }
                //     }
                // }
                // else{
                self.hideAllBuchu();
                self.hideAllFolds();
                //}
            }
            if (data.playedCards == null || data.playedCards.length == 0) {
                console.log("上家不出")
                self.showBuchu(seat);
                self.hideFolds(seat);
            }
            else {
                console.log("上家出牌")
                self.hideAllFolds();
                var cards;
                let tmp = cc.fy.PDKGameMgr.sortSpecial(data.playedCards);
                if (tmp) {
                    cards = tmp;
                } else {
                    cards = cc.fy.PDKGameMgr.sortCards(data.playedCards);
                }
                // cc.fy.PDKGameMgr.sortCards(data.playedCards);
                self.initFolds(seat, cards);
                self.hideBuchu(seat);
                self.tempFoldCards = cards;
                if (!cc.fy.replayMgr.isReplay() || seat == 0) {
                    // self.hideFolds(seat);
                }
            }

            // 出牌清理
            // if(data.nextTurn >= 0){
            //     var nextLocal = cc.fy.gameNetMgr.getLocalIndex(data.nextTurn);
            //     self.hideFolds(nextLocal);
            //     self.hideBuchu(nextLocal);
            // }
            // // 一轮结束了

        });
        game.addHandler('show_folds', function (data) {
            self.showFolds(data.localIndex);
        });
        game.addHandler('cc_pdk_stc_gamedata', function (data) {

            if (data.lastSeatIndex < 0) {
                return;
            }
            else {
                setTimeout(function () {
                    self.initAllFolds();
                }, 100);

            }
        });
    },

    //初始化所有出牌
    initAllFolds: function () {
        var _folds = cc.fy.pdkGameNetMgr.folds;
        if (_folds == null || _folds.length == 0) {
            this.hideAllBuchu();
            this.hideAllFolds();
            return;
        }

        for (var i = 0; i < _folds.length; i++) {
            var seat = cc.fy.gameNetMgr.getLocalIndex(i);
            if (_folds[i] != null) {
                cc.fy.PDKGameMgr.printCards(_folds[i], " initAllFolds " + i);
                if (_folds[i].length == 0) {
                    this.showBuchu(seat);
                }
                else {
                    if (cc.fy.pdkGameNetMgr.gamedata.lastSeatIndex == i) {
                        var cards;
                        let tmp = cc.fy.PDKGameMgr.sortSpecial(_folds[i]);
                        if (tmp) {
                            cards = tmp;
                        } else {
                            cards = cc.fy.PDKGameMgr.sortCards(_folds[i]);
                        }


                        this.initFolds(seat, cards);
                    }

                }
            }
            else {
                this.hideFolds(seat);
                this.hideBuchu(seat);
            }

        }

        this.initFolds(seat, cards);
    },

    //初始化出牌
    initFolds: function (seat, cards) {
        if (cards == null || cards.length == 0) {
            return;
        }

       console.log("seat:"+seat+" cards:",cards);
        if (this.ndFolds[seat] == null) {
            this.ndFolds[seat] = [];
        }

        var prefab = cc.fy.PDKGameMgr.getFoldsPokerBoxPrefab();
        // var startX = this.getPosition(seat, cards.length);
        // console.log(this.ndFolds);
        // var mid=(cards.length-1)/2;
        var startRotation = HoldDegree[cards.length].start;
        var offRotation = HoldDegree[cards.length].dis;
        for (var i = 0; i < cards.length; i++) {
            var rota = startRotation + offRotation * i;
            var pokerBox = this.ndFolds[seat][i];
            if (pokerBox == null) {
                var ndpoker = cc.instantiate(prefab);
                this.ndFoldsRoot.addChild(ndpoker);
                pokerBox = ndpoker.getComponent("PDKPokerBox");
                this.ndFolds[seat].push(pokerBox);
            }
           
            pokerBox.setCard(this.rotateRadius, rota, cards[i])
        }

        if (this.ndFolds[seat].length > cards.length) {
            for (var j = cards.length; j < this.ndFolds[seat].length; j++) {
                
                this.ndFolds[seat][j].hide();
            }
        }
    },

    //隐藏所有不出节点
    hideAllBuchu: function () {
        for (var i = 0; i < this.ndBuchus.length; i++) {
            this.hideBuchu(i);
        }
    },

    //隐藏单个不出节点
    hideBuchu: function (seat) {
        this.ndBuchus[seat].active = false;
    },

    //隐藏所有出牌
    hideAllFolds: function () {
        if (this.ndFolds == null || this.ndFolds.length == 0) {
            return;
        }
        for (var i = 0; i < this.ndFolds.length; i++) {
            this.hideFolds(i);
        }
    },

    //显示单个出牌节点
    showFolds: function (seat) {

        if (this.ndFolds[seat] == null || this.ndFolds[seat].length == 0) {
            return;
        }
        for (var i = 0; i < this.ndFolds[seat].length; i++) {
            var ndpoker = this.ndFolds[seat][i];
            ndpoker.node.active = true;
            //this.ndFoldsRoot[seat].node.active = false;
        }
        if (this.tempFoldCards != null && this.tempFoldCards.length > 0) {
            for (let i = this.tempFoldCards.length; i < this.ndFolds[seat].length; i++) {
                var ndpoker = this.ndFolds[seat][i];
                ndpoker.node.active = false;
            }
        }
        this.tempFoldCards = null;
    },

    //隐藏单个出牌节点
    hideFolds: function (seat) {
        if (this.ndFolds[seat] == null || this.ndFolds[seat].length == 0) {
            return;
        }
        console.log("hideFolds:" + seat);
        for (var i = 0; i < this.ndFolds[seat].length; i++) {
            var ndpoker = this.ndFolds[seat][i];
            ndpoker.hide();
            //this.ndFoldsRoot[seat].node.active = false;
        }
    },

    //显示所有不出
    showAllBuchu: function () {
        for (var i = 0; i < this.ndBuchus.length; i++) {
            this.showBuchu(i);
        }
    },

    //显示单个不出
    showBuchu: function (seat) {
        this.ndBuchus[seat].active = true;
    },

    //获得牌初始位置
    getPosition: function (seatIndex, count) {
        var po = 0;

        // if(this._gameplayer == 3)
        // {
        //     if(seatIndex == 0){
        //         po = -(count - 1) * this.offset * 0.5;
        //     }
        //     else if(seatIndex == 1){
        //         po = -(count - 1) * this.offset;
        //     }
        //     else{
        //         po = -(count - 1) * this.offset * 0.4;
        //     }

        // }
        // else
        // {

        // }
        po = -(count - 1) * this.offset * 0.5;

        // // 自己和上方
        // if(seatIndex == 0 || seatIndex == 2){
        //     po = -(count - 1) * this.offset * 0.5;
        // }
        // else if(seatIndex == 1){
        //     po = -(count - 1) * this.offset;
        // }

        return po;
    },

    //通过玩家数目获得位置
    getSideByPlay: function (playernum) {
        var sides = [];
        if (playernum == 3) {
            sides = ["myself", "right", "left"];
        }
        else {
            sides = ["myself", "up"];
        }

        return sides;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
