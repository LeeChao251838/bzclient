cc.Class({
    extends: cc.Component,

    properties: {
        _arrow: null,
        _pointer: null,
        _pointerTwo: null,
        _pointerThree: null,

        _timeLabel: null,
        _time: -1,
        _alertTime: -1,

        _gamePlayer: 3,
        _seats: [],
        pointerSpriteFrame: {
            default: [],
            type: [cc.SpriteFrame]
        },
        weizhiSpriteFrame: {
            default: [],
            type: [cc.SpriteFrame]
        },
        // rootNode: cc.Node,
        _localIndex: null,
    },
    // use this for initialization
    onLoad: function () {
        // this._gamePlayer = cc.fy.gameNetMgr.seats.length; 
        this._gamePlayer = cc.fy.gameNetMgr.conf.maxCntOfPlayers ? cc.fy.gameNetMgr.conf.maxCntOfPlayers : cc.fy.gameNetMgr.seats.length;
        if (cc.fy.replayMgr.isReplay()) {
            this._gamePlayer = cc.fy.gameNetMgr.seats.length;
        }
        this._arrow = this.node;
        this._pointer = this._arrow.getChildByName("pointer");
        var sides = [];
        if (this._gamePlayer == 3) {
            sides = ["myself", "right", "left"];
        }
        else if (this._gamePlayer == 2) {
            sides = ["myself", "up"];
        }
        else {
            sides = ["myself", "right", "up", "left"];
        }
        var seatIndex = cc.fy.gameNetMgr.seatIndex;
        for (var i = 0; i < 4; i++) {
            this._pointer.children[i].getComponent(cc.Sprite).spriteFrame = this.pointerSpriteFrame[(seatIndex + i) % 4];
            this._pointer.children[i].getChildByName("weizhi").getComponent(cc.Sprite).spriteFrame = this.weizhiSpriteFrame[(seatIndex + i) % 4];
        }
        if (this._gamePlayer == 2) {
            for (var i = 0; i < 4; i++) {
                this._pointer.children[i].getComponent(cc.Sprite).spriteFrame = this.pointerSpriteFrame[(seatIndex * 2 + i) % 4];
                this._pointer.children[i].getChildByName("weizhi").getComponent(cc.Sprite).spriteFrame = this.weizhiSpriteFrame[(seatIndex * 2 + i) % 4];
            }
        }
        this.setGamePoint(cc.fy.gameNetMgr.point);
        for (var i = 0; i < this._gamePlayer; i++) {
            var side = sides[i];
            var sidenode = this._pointer.getChildByName(side).getChildByName("weizhi");
            this._seats.push(sidenode);
        }
        this._pointer = this._arrow.getChildByName("pointer");
        this._timeLabelB = this._arrow.getChildByName("lblTimeB").getComponent(cc.Label);
        this._timeLabelR = this._arrow.getChildByName("lblTimeR").getComponent(cc.Label);
        this._timeLabelB.string = "00";
        this._timeLabelR.string = "00";
        this._sTypeList = [cc.GAMETYPE.JDMJ, cc.GAMETYPE.HZEMJ]; // 庄家是东

        this.initPointer();

        var self = this;
        var game = cc.fy.gameNetMgr;

        self.initPointer();
        self._time = 10;
        self._alertTime = 3;

        game.addHandler('game_start', function (data) {
            self.initPointer();
        });

        game.addHandler('game_begin', function (data) {
            self.initPointer();
            self._time = 10;
            self._alertTime = 3;
        });

        game.addHandler('game_playing', function (data) {
            self.initPointer();
            self._time = 10;
            self._alertTime = 3;
        });

        game.addHandler('game_chupai', function (data) {
            self.initPointer();
            self._time = 10;
            self._alertTime = 3;
        });

        game.addHandler('game_point', function (data) {
            console.log("game_point", data);
            self.setGamePoint(data);
            self.initPointer();
            self._time = 10;
            self._alertTime = 3;
        });
    },
    setGamePoint: function (data) {
        // for (var i = 0; i < this._pointer.length; ++i) {
        //     this._pointer.children[i].active = false;
        // }
        var east = cc.fy.gameNetMgr.getSeatIndexByID(data);
        var seatPoint = cc.fy.gameNetMgr.getLocalIndex(east);
        if (cc.fy.gameNetMgr.conf.type == 23) {
            var sides = ["myself", "right", "up", "left"];
            for (var i = 0; i < 4; i++) {
                this._pointer.getChildByName(sides[i]).getComponent(cc.Sprite).spriteFrame = this.pointerSpriteFrame[(4 - seatPoint + i) % 4];
                this._pointer.getChildByName(sides[i]).getChildByName("weizhi").getComponent(cc.Sprite).spriteFrame = this.weizhiSpriteFrame[(4 - seatPoint + i) % 4];
            }
        }
    },
    initPointer: function () {
        if (cc.fy == null) {
            return;
        }


        this._arrow.active = cc.fy.gameNetMgr.gamestate == "playing";

        if (cc.fy.replayMgr.isReplay()) {
            // this._gamePlayer = cc.fy.gameNetMgr.seats.length;
            this._arrow.active =true;
        }
        if (!this._arrow.active) {
            return;
        }

        let playersCount = cc.fy.gameNetMgr.seats.length;

        var turn = cc.fy.gameNetMgr.turn;
        var selfSide = cc.fy.gameNetMgr.seatIndex;
        if (cc.fy.utils.array_contain(this._sTypeList, cc.fy.gameNetMgr.conf.type)) {
            selfSide = selfSide - cc.fy.gameNetMgr.button;
            if (selfSide < 0) {
                selfSide += playersCount;
            }
        }
        // var localIndex = cc.fy.gameNetMgr.getLocalIndex(turn);  
        this._localIndex = cc.fy.gameNetMgr.getLocalIndex(turn);
        console.log('initPointer======>  _localIndex ', this._localIndex)
        if (cc.isMJ(cc.fy.gameNetMgr.conf.type)) {
            for (var i = 0; i < this._gamePlayer; i++) {
                this._seats[i].active = i == this._localIndex;
            }
        }
        else {
            for (var i = 0; i < this._pointer.children.length; ++i) {
                this._pointer.children[i].active = i == this._localIndex;
            }
        }
    },

    update: function (dt) {
        if (this._time > 0) {
            this._time -= dt;
            if (this._alertTime > 0 && this._time < this._alertTime) {
                // cc.fy.audioMgr.playSFX("timeup_alarm.mp3");
                this._alertTime = -1;
            }
            var pre = "";
            if (this._time < 0) {
                this._time = 0;
            }

            var t = Math.ceil(this._time);
            if (t % 2 == 0) {
                for (var i = 0; i < this._gamePlayer; i++) {
                    this._seats[i].active = i == this._localIndex;
                }
            } else {
                for (var i = 0; i < this._gamePlayer; i++) {
                    this._seats[i].active = false;
                }
            }
            if (t < 10) {
                pre = "0";
            }
            // this._timeLabel.string = pre + t;
            // this._timeLabel3D.string = pre + t; 
            this._timeLabelB.string = pre + t;
            this._timeLabelR.string = pre + t;
        }
    },
});
