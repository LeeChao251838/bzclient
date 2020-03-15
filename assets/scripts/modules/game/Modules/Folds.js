cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        _folds: null,
        _foldsSign: null,
        _gamePlayer: 4,
        _maxCel: 10
    },

    // use this for initialization
    onLoad: function () {
        if (cc.fy == null) {
            return;
        }


        if (cc.fy.gameNetMgr.seats == null) {
            cc.fy.alert.show("该房间已解散", function () {
                cc.fy.sceneMgr.loadScene("hall");
            });
            console.log("cc.fy.gameNetMgr.seats is null");
            return;
        }
        // if (cc.fy.replayMgr.isReplay()) {
        //     this._gamePlayer = cc.fy.gameNetMgr.seats.length;
        // } else {
        //     this._gamePlayer = cc.fy.gameNetMgr.conf.maxCntOfPlayers;
        // }
        this._gamePlayer = cc.fy.gameNetMgr.conf.maxCntOfPlayers ? cc.fy.gameNetMgr.conf.maxCntOfPlayers : cc.fy.gameNetMgr.seats.length;
        if (cc.fy.replayMgr.isReplay()) {
            this._gamePlayer = cc.fy.gameNetMgr.seats.length;
        }
        this.initView();
        this.initEventHandler();
        this.initAllFolds();
    },

    initView: function () {
        this._folds = {};
        var game = this.node.getChildByName("game");
        var sides = [];
        if (this._gamePlayer == 3) {
            sides = ["myself", "right", "left"];
        } else if (this._gamePlayer == 2) {
            sides = ["myself", "up"];
        }
        else {
            sides = ["myself", "right", "up", "left"];
        }
        for (var i = 0; i < sides.length; ++i) {
            var sideName = sides[i];
            var sideRoot = game.getChildByName(sideName);
            var folds = [];
            var foldRoot = null;
            if (this._gamePlayer == 2) {
                if (cc.isMJ(cc.fy.gameNetMgr.conf.type)) {
                    foldRoot = sideRoot.getChildByName("twofolds");
                    foldRoot.active = true;
                    sideRoot.getChildByName("folds").active = false;
                }
            } else {
                foldRoot = sideRoot.getChildByName("folds");
                foldRoot.active = true;
                if (sideRoot.getChildByName("twofolds")) {
                    sideRoot.getChildByName("twofolds").active = false;
                }

            }
            console.log("sideName ===>", sideName);
            for (var j = 0; j < foldRoot.children.length; ++j) {
                // console.log("number ===>", j);
                var n = foldRoot.getChildByName("mj" + j);//.children[j];
                n.active = false;
                var sprite = n.getComponent(cc.Sprite);
                sprite.spriteFrame = null;
                folds.push(sprite);
            }
            this._folds[sideName] = folds;
        }

        this.hideAllFolds();
    },

    hideAllFolds: function () {
        for (var k in this._folds) {
            var f = this._folds[i];
            for (var i in f) {
                f[i].node.active = false;
            }
        }
    },

    refreshFoldColor: function () {
        for (var k in this._folds) {
            var f = this._folds[k];
            for (var i in f) {
                f[i].node.color = new cc.Color(255, 255, 255);
            }
        }
    },

    initEventHandler: function () {
        var self = this;
        var game = cc.fy.gameNetMgr;
        game.addHandler('game_start', function (data) {
            self.initAllFolds();
            self.refreshFoldColor();
        });
        game.addHandler('game_begin', function (data) {
            self.initAllFolds();
        });

        game.addHandler('game_sync', function (data) {
            self.initAllFolds();
        });

        game.addHandler('game_chupai_notify', function (data) {
            self.initFolds(data.seatData);
            // self.showFoldsSign();
        });

        game.addHandler('guo_notify', function (data) {
            self.showFoldsSign();
        });

        game.addHandler('game_showsamefolds', function (data) {
            if (data) {
                self.showSameFolds(data);
            }
        });

        game.addHandler('game_hidesamefolds', function (data) {
            self.hideSameFolds();
        });

        game.addHandler('remove_mj_notify', function (data) {
            self.initFolds(data);
        });
    },

    initAllFolds: function () {
        var seats = cc.fy.gameNetMgr.seats;
        for (var i in seats) {
            this.initFolds(seats[i]);
        }
        this.showFoldsSign();

    },

    initFolds: function (seatData) {
        var folds = seatData.folds;
        if (folds == null) {
            return;
        }
        var localIndex = cc.fy.gameNetMgr.getLocalIndex(seatData.seatindex);
        var pre = cc.fy.mahjongmgr.getFoldPre(localIndex);
        var side = cc.fy.mahjongmgr.getSide(localIndex);
        var foldsSprites = this._folds[side];
        for (var i = 0; i < folds.length; ++i) {
            var index = i;
            // if (side == "right" || side == "up") {
            //     index = foldsSprites.length - i - 1;
            // }
            var sprite = foldsSprites[index];
            sprite.pai = folds[i];//这里保存一下牌点数
            sprite.node.active = true;
            sprite.node.scale = 1;
            // if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.HAMJ && folds[i] == 99) {
            //     if (side == "myself" || side == "up") {
            //         sprite.spriteFrame = cc.fy.mahjongmgr.getUpSpriteFrame();
            //     }
            //     else {
            //         sprite.spriteFrame = cc.fy.mahjongmgr.getEmptySpriteFrame(side);
            //     }
            // }
            // else {
            this.setSpriteFrameByMJID(pre, sprite, folds[i]);
            // }
        }
        for (var i = folds.length; i < foldsSprites.length; ++i) {
            var index = i;
            // if (side == "right" || side == "up") {
            //     index = foldsSprites.length - i - 1;
            // }
            var sprite = foldsSprites[index];
            sprite.pai = null;
            sprite.spriteFrame = null;
            sprite.node.active = false;
        }
    },

    setSpriteFrameByMJID: function (pre, sprite, mjid) {

        if (mjid >= 1000) {
            mjid = mjid - 1000;
            sprite.node.color = new cc.Color(225, 225, 68);
        }
        else {
            sprite.node.color = new cc.Color(255, 255, 255);
        }
        sprite.spriteFrame = cc.fy.mahjongmgr.getSpriteFrameByMJID(pre, mjid);
        sprite.node.active = true;
    },

    showSameFolds: function (pai) {

        var seats = cc.fy.gameNetMgr.seats;

        for (var i in seats) {
            var seatData = seats[i];
            var folds = seatData.folds;
            if (folds == null) {
                continue;
            }
            var localIndex = cc.fy.gameNetMgr.getLocalIndex(seatData.seatindex);
            var side = cc.fy.mahjongmgr.getSide(localIndex);

            var foldsSprites = this._folds[side];
            for (var i = 0; i < folds.length; ++i) {
                var index = i;
                // if (side == "right" || side == "up") {
                //     index = foldsSprites.length - i - 1;
                // }
                if (foldsSprites[index].pai == pai) {
                    foldsSprites[index].node.color = new cc.Color(157, 243, 255);
                }
            }
        }

    },

    hideSameFolds: function () {
        var sides = [];
        // if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.ERMJ) {
        //     sides = ["myself", "up"];
        // }
        // else
        if (cc.isMJ(cc.fy.gameNetMgr.conf.type)) {

            if (this._gamePlayer == 3) {
                sides = ["myself", "right", "left"];
            }
            else if (this._gamePlayer == 2) {
                sides = ["myself", "up"];
            }
            else {
                sides = ["myself", "right", "up", "left"];
            }
        }
        else {
            sides = ["myself", "right", "up", "left"];
        }
        for (var i = 0; i < sides.length; ++i) {
            var sideName = sides[i];
            var foldsSprites = this._folds[sideName];
            //console.log("FoldsSprites",foldsSprites);
            for (var j = 0; j < foldsSprites.length; j++) {
                if (foldsSprites[j].node.active) {
                    if (foldsSprites[j].pai < 1000) {
                        foldsSprites[j].node.color = new cc.Color(255, 255, 255);
                    }
                }
            }
        }
    },

    showFoldsSign: function () {
        //
        var seatindex = cc.fy.gameNetMgr.lastTurn;
        if (seatindex == -1) {
            return;
        }
        // console.log("showFoldsSign seatindex = ", seatindex);

        var localIndex = cc.fy.gameNetMgr.getLocalIndex(seatindex);
        // console.log("showFoldsSign localIndex = ", localIndex);

        var side = cc.fy.mahjongmgr.getSide(localIndex);
        var foldsSprites = this._folds[side];
        var folds = cc.fy.gameNetMgr.seats[seatindex].folds;
        // console.log("showFoldsSign side = ", side);
        if (folds != null && folds.length > 0) {
            var index = folds.length - 1;
            // if (side == "right" || side == "up") {
            //     index = foldsSprites.length - index - 1;
            // }
            var fold = foldsSprites[index];
            // console.log("showFoldsSign index = ", index);
            // console.log("showFoldsSign fold = ", fold);
            // console.log("showFoldsSign fold.node.active = ", fold.node.active);
            // console.log("showFoldsSign self._foldsSign = ", this._foldsSign);
            // fold.node.active = true;
            var self = this;
            if (self._foldsSign) {
                var _sign = fold.node.getChildByName("mjsign");
                if (_sign == null) {
                    console.log("_sign == null");
                    self._foldsSign.removeFromParent(false);
                    fold.node.addChild(self._foldsSign);
                    self._foldsSign.x = 0;
                    self._foldsSign.y = 22;
                    if (side == "up") {
                        self._foldsSign.y = 40;
                        self._foldsSign.setScale(1 / 0.65);
                    } else if (side == "myself") {
                        self._foldsSign.y = 40;
                        self._foldsSign.setScale(1 / 0.8);
                    }
                    else {
                        self._foldsSign.setScale(1);
                    }
                }
                else {
                    console.log("_sign != null");
                }
            } else {
                cc.loader.loadRes("prefabs/mjsign", function (err, prefab) {
                    self._foldsSign = cc.instantiate(prefab);
                    // var _sign = fold.node.getChildByName("mjsign");
                    fold.node.addChild(self._foldsSign);
                    self._foldsSign.x = 0;
                    self._foldsSign.y = 22;
                    if (side == "up") {
                        self._foldsSign.y = 40;
                        self._foldsSign.setScale(1 / 0.65);
                    } else if (side == "myself") {
                        self._foldsSign.y = 40;
                        self._foldsSign.setScale(1 / 0.8);
                    }
                    else {
                        self._foldsSign.setScale(1);
                    }

                });
            }
        }
        // 
    },





    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
