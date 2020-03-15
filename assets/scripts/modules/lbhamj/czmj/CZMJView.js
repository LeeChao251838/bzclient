var Holds = require("Holds");
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
        _myMJArr: [],
        _config: null,
        _seats: [],
        _peiziWin: null,
        _ndOtherHasAction: null,



        _gameEnd: null,
        _gameEndData: null,

        _holdsMaxLen: 14,
    },

    // use this for initialization
    onLoad() {
        this._holdsMaxLen = 14;
        this._config = {
            holdsMaxLen: this._holdsMaxLen,

            myHolds: { // 从左往右
                off: cc.p(80, 0),
                newOff: cc.p(108.5, 0)
            },

            upHolds: { // 从右往左
                off: cc.p(-38, 0),
                newOff: cc.p(-50, 0),
            },

            rightHolds: {
                off: cc.p(0, 25),
                newOff: cc.p(0, 36),
            },

            leftHolds: {
                off: cc.p(0, -25),
                newOff: cc.p(0, -33),
            },
        };

        Holds.Config = this._config;

        this.initHander();
        this.initView();
        this.onGameBegin();

    },

    initHander() {
        console.log("创建");
        //初始化事件监听器
        var self = this;
        var game = cc.fy.gameNetMgr;
        game.addHandler('initmahjongs', function (data) {
            self.initMahjongs();
        });

        // game.addHandler('initothermahjongs',function(data){
        //     self.initOtherMahjongs(data);
        // });

        game.addHandler('game_endsure', function (data) {
            self.gameEndSure(data);
        });


        game.addHandler('gang_score', function (data) {
            self.gangScoreChange(data);
        });

        game.addHandler('game_allflowers_recive', function (data) {
            console.log("收到game_allflowers_recive");
            var seatData = data;
            // self.setAllFlower(data);
            for (var i = 0; i < seatData.length; i++) {
                let flowers = seatData[i];
                if (flowers != null && flowers.length > 0) {
                    let seatData = cc.fy.gameNetMgr.seats[i];
                    let localIndex = cc.fy.gameNetMgr.getLocalIndex(i);
                    console.log(localIndex);
                    if (seatData.userid != cc.fy.userMgr.userId) {
                        self.scheduleOnce(function () {
                            self._seats[localIndex].playBuhua();
                        }, 0.5);
                    }
                    else {
                        self._seats[localIndex].playBuhua();
                    }
                }
            }
        });

        game.addHandler('game_newflowers_recive', function (data) {
            console.log("收到game_newflowers_recive");
            var seatData = data;
            self.setNewFlower(data);
        });

        game.addHandler('tingpai_ctc', function (event) {
            console.log("听牌啦2");
            let data = event;

            self.tingpai(data);
        });

        game.addHandler('otherTingPai_ctc', function (event) {
            console.log("re听牌啦2");
            var data = event;
            self.tingpai(data);
        });

        game.addHandler('game_start', function (data) {
            console.log("game_start啦");
            for (var i = 0; i < self._seats.length; i++) {
                self._seats[i].setIsTing(false);
            }
            self.setSelfHoldsState(false);
        });

        game.addHandler('game_special', function (event) {
            console.log("game_special");
            console.log(data);
            let data = event;
            let userId = data.userId;
            let index = cc.fy.gameNetMgr.getSeatIndexByID(userId);
            let localIndex = cc.fy.gameNetMgr.getLocalIndex(index);

            if (data.specialType == 'daxi') {
                self._seats[localIndex].playDaXi();
            } else {
                self._seats[localIndex].playXiaoXi();
            }
        });

        game.addHandler("game_flowers", function (data) {
            if (data != null && data.userId != null) {
                let index = cc.fy.gameNetMgr.getSeatIndexByID(data.userId);
                let localIndex = cc.fy.gameNetMgr.getLocalIndex(index);
                self._seats[localIndex].playBuhua();
            }
        });

        game.addHandler('replay_flowers', function (data) {
            if (data != null) {
                let localIndex = cc.fy.gameNetMgr.getLocalIndex(data);
                self._seats[localIndex].playBuhua();
            }
        });

        // 刷新手牌 主要刷新牌的颜色
        game.addHandler('cc_other_has_actions_push', function (data) {
            var isHasAction = data;
            if (isHasAction == true) {
                self.showOtherHasAction();
            }
            else {
                self.hideOtherHasAction();
            }
        });

        // game.addHandler('game_refreshscore',function(data){
        //     console.log("yangzhou game_refreshscore");
        //     console.log(data);
        //     self.refreshScore(data);
        // });

        game.addHandler('game_isTing', function (data) {
            console.log("game_isting--->>>>");
            var detail = data;
            if (detail == null) {
                return;
            }
            var seatindex = cc.fy.gameNetMgr.getSeatIndexByID(detail.userId);
            var localIndex = cc.fy.gameNetMgr.getLocalIndex(seatindex);
            // self.hideChupai();
            self.dispatchEvent('hideChupai_ctc');
            if (localIndex == 0) {
                self.hideOptions();
            }

            self.doTing(data);
        });

        game.addHandler('game_tian_ting_cnt_push', function (data) {
            cc.fy.hintBox.show("等待天听玩家操作...");
        });

        game.addHandler('game_tian_ting_ctc', function (data) {
            console.log("game_tian_ting_ctc");
            self.addOption("btntianting", -1);
        });

        game.addHandler('game_guotingresult', function (data) {
            console.log("game_guotingresult--->>>>");
            var detail = data;
            if (detail == null) {
                return;
            }
            var seatindex = cc.fy.gameNetMgr.getSeatIndexByID(detail.userId);
            var localIndex = cc.fy.gameNetMgr.getLocalIndex(seatindex);
            if (localIndex == 0) {
                self.hideOptions();
            }
        });

        game.addHandler('game_tingresult', function (data) {
            var seats = cc.fy.gameNetMgr.seats;
            var length = seats.length;
            for (var i = 0; i < length; i++) {
                var index = cc.fy.gameNetMgr.getLocalIndex(seats[i].seatindex);
                self._seats2[index].setTing((seats[i].tingState == 1 || seats[i].tingState == 2), seats[i].tiantingstate);
            }
        });

        game.addHandler('tingpai', function (event) {
            console.log("听牌啦2");
            let data = event;

            self.tingpai(data);
            if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.KZMJ) {
                let userId = data.userId;
                let index = cc.fy.gameNetMgr.getSeatIndexByID(userId);
                let localIndex = cc.fy.gameNetMgr.getLocalIndex(index);
                self._seats[localIndex].setIsTing(true);
            }
        });

        game.addHandler('otherTingPai', function (event) {
            if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.KZMJ) {
                let data = event;
                let userId = data.userId;
                let index = cc.fy.gameNetMgr.getSeatIndexByID(userId);
                let localIndex = cc.fy.gameNetMgr.getLocalIndex(index);
                self._seats[localIndex].setIsTing(true);
            }
        });

        game.addHandler('retingpai', function (event) {
            console.log("re听牌啦2");
            var data = event;
            self.tingpai(data);
        });

        game.addHandler('cancelTing', function (event) {
            let data = event;
            let userId = data.userId;
            let index = cc.fy.gameNetMgr.getSeatIndexByID(userId);
            let localIndex = cc.fy.gameNetMgr.getLocalIndex(index);
            self._seats[localIndex].setIsTing(false);
            if (localIndex == 0) {
                self.setCancelTingActive(false);
                cc.fy.gameNetMgr.dispatchEvent('initmahjongs');
            }
        });

        game.addHandler('game_action', function (data) {
            if (data && data.canCancelTing) {
                self.setCancelTingActive(true);
            }
            else {
                self.setCancelTingActive(false);
            }
        });
        game.addHandler('game_chupai_notify', function (data) {
            if (data.seatData.seatindex == cc.fy.gameNetMgr.seatIndex) {
                self.setCancelTingActive(false);
            }
        });
    },

    initView() {
        var nodMyHolds = cc.find("game/myself/holds", this.node),
            nodUpHolds = cc.find("game/up/holds", this.node),
            nodRightHolds = cc.find("game/right/holds", this.node),
            nodLeftHolds = cc.find("game/left/holds", this.node),
            nodMyFirstCard = nodMyHolds.getChildByName("MyMahJong"),
            nodUpFirstCard = nodUpHolds.getChildByName("e_mj_up"),
            nodRightFirstCard = nodRightHolds.getChildByName("e_mj_right"),
            nodLeftFirstCard = nodLeftHolds.getChildByName("e_mj_left"),

            config = this._config,
            maxLen = config.holdsMaxLen;

        this.createHolds(nodMyFirstCard, maxLen, config.myHolds.off, config.myHolds.newOff, false);
        this.createHolds(nodUpFirstCard, maxLen, config.upHolds.off, config.upHolds.newOff, true);
        this.createHolds(nodRightFirstCard, maxLen, config.rightHolds.off, config.rightHolds.newOff, true);
        this.createHolds(nodLeftFirstCard, maxLen, config.leftHolds.off, config.leftHolds.newOff, false);

        var gameChild = this.node.getChildByName("game");
        var myselfChild = gameChild.getChildByName("myself");
        var myholds = myselfChild.getChildByName("holds");
        this._myMJArr = [];
        for (var i = 0; i < myholds.children.length; ++i) {
            var sprite = myholds.children[i].getComponent(cc.Sprite);
            this._myMJArr.push(sprite);
        }

        // this._gameEnd = this.node.getChildByName("gameEnd");
        // var btnEndSure = this._gameEnd.getChildByName("btnSure");
        // cc.fy.utils.addClickEvent(btnEndSure,this.node,"HDMJView","gameSureClick");
        // this._gameEnd.active = false;

        var gameChild = this.node.getChildByName("game");
        var sides = ["myself", "right", "up", "left"];
        for (var i = 0; i < sides.length; ++i) {
            var sideNode = gameChild.getChildByName(sides[i]);
            var seat = sideNode.getChildByName("seat");
            this._seats.push(seat.getComponent("SeatMJ"));
        }

        // 其它玩家操作
        this._ndOtherHasAction = gameChild.getChildByName("otherhasaction");
        if (this._ndOtherHasAction) {
            this._ndOtherHasAction.active = false;
        }

        this._canCancelTing = gameChild.getChildByName("btnCancelTing");
        cc.fy.utils.addClickEvent(this._canCancelTing, this.node, 'CZMJView', 'cancelTingClick');
        this.setCancelTingActive(false);
    },

    // 游戏开始状态重置
    onGameBegin() {
        console.log("HD onGameBegin");
        if (cc.fy.czmjMsg.otherHasAction) {
            this.showOtherHasAction();
            cc.fy.czmjMsg.otherHasAction = false;
        }

        if (cc.fy.gameNetMgr.gamestate == "playing") {
            var seats = cc.fy.gameNetMgr.seats;
            for (var i = 0; i < seats.length; i++) {
                var seatdata = seats[i];
                if (seatdata.isbaoting == true) {
                    let localIndex = cc.fy.gameNetMgr.getLocalIndex(i);
                    this._seats[localIndex].setIsTing(true, seatdata.isTianTing == true);
                }
            }
        }

        if (cc.fy.gameNetMgr.curaction != null) {
            let action = cc.fy.gameNetMgr.curaction;
            if (action.canCancelTing) {
                this.setCancelTingActive(true);
            }
        }
    },

    setCancelTingActive(bo) {
        if (this._canCancelTing) {
            this._canCancelTing.active = bo;
        }
    },

    showOtherHasAction() {
        console.log("showOtherHasAction")
        console.log(this._ndOtherHasAction);;
        this._ndOtherHasAction.active = true;
    },

    hideOtherHasAction() {
        this._ndOtherHasAction.active = false;
    },


    setAllFlower(data) {
        console.log(data);
        for (var i = 0; i < cc.fy.gameNetMgr.seats.length; i++) {
            var seat = cc.fy.gameNetMgr.seats[i];
            seat.flowers = data[i];
            console.log("allflower: " + seat.flowers);
        }

        this.showFlower();
    },

    setNewFlower(data) {
        let seatData = cc.fy.gameNetMgr.getSeatByID(data.userId)
        seatData.flowers = seatData.flowers.concat(data.newFlowers);
        this.showFlower();
    },


    showFlower() {

    },


    gangScoreChange(data) {
        console.log("gangScoreChange");
        console.log(data);
        for (const i in data) {
            if (data.hasOwnProperty(i)) {
                var index = cc.fy.gameNetMgr.getLocalIndex(i);
                var seatData = cc.fy.gameNetMgr.seats[i];
                if (seatData && seatData.score != null) {
                    seatData.score = seatData.score + data[i];
                    this._seats[index].setScore(seatData.score);
                }
            }
        }
    },

    gameEndSure(data) {
        console.log("gameEndSure");
        console.log(data);
        this._gameEndData = data;
        this._gameEnd.active = false;
        this.gameSureClick();
    },

    gameSureClick() {
        console.log("gameSureClick");
        this._gameEnd.active = false;
        if (this._gameEndData) {
            var data = this._gameEndData;
            var results = data.results;
            var self = cc.fy.gameNetMgr;
            self.reset();
            self.dispatchEvent('game_over', data);
            for (var i = 0; i < self.seats.length; ++i) {
                self.dispatchEvent('user_state_changed', self.seats[i]);
            }
            this._gameEndData = null;
        }
        else {
            console.log("_gameEndData == null");
            self.dispatchEvent('game_over', []);
            cc.fy.net.send('ready');
        }
    },

    createHolds(nodFirstCard, len, off, newOff, revertZIndex) {
        console.log("hdmj createHolds ");
        var startPos = nodFirstCard.getPosition(),
            i,
            pos,
            zIndex;

        nodFirstCard.name = "mj0";
        nodFirstCard.zIndex = revertZIndex ? len : 0;
        let otherHolds = [];
        for (i = 1; i < len - 1; ++i) {
            pos = startPos.add(off.mul(i));
            zIndex = revertZIndex ? len - i : i;
            this.createCard(nodFirstCard, pos, "mj" + i, zIndex);
        }

        zIndex = revertZIndex ? 0 : len - 1;
        this.createCard(nodFirstCard, pos.add(newOff), "mj" + (len - 1), zIndex, Holds.NewCardTag);
    },

    createCard(nodCard, pos, name, zIndex, tag) {
        // console.log("createCard-----------------");
        var nodNewCard = cc.instantiate(nodCard);
        nodCard.parent.addChild(nodNewCard);
        nodNewCard.setPosition(pos);
        nodNewCard.name = name;
        nodNewCard.zIndex = zIndex;
        if (tag) {
            nodNewCard.tag = tag;
        }
        // console.log(nodNewCard);
        // console.log(pos);
        // console.log(name);
    },

    initMahjongs() {
        if (cc.fy.gameNetMgr.conf == null) {
            return;
        }

        console.log("initMahjongs 啦");

        var seats = cc.fy.gameNetMgr.seats;
        var seatData = seats[cc.fy.gameNetMgr.seatIndex];

        var lackingNum = this.getLackingNum(seatData);

        //初始化手牌
        var baida = cc.fy.gameNetMgr.baida;
        if (baida != null && baida != -1) {
            console.log("==>> initMahjongs --> baida = " + baida);
            console.log("==>> _myMJArr = " + this._myMJArr);

            for (var i = 0; i < this._myMJArr.length; ++i) {
                var sprite = this._myMJArr[i];
                // cc.fy.mahjongmgr.changeMahjongNodeColor(sprite.node,new cc.Color(255, 255, 255));
                // sprite.node.color = new cc.Color(255, 255, 255);
                var sameMark = sprite.node.getChildByName("sameMark");
                sameMark.active = false;
                var button = sprite.node.getComponent(cc.Button);
                if (button) {
                    button.interactable = true;
                }
            }

            for (var j = lackingNum; j < this._myMJArr.length; ++j) {
                var sprMJ = this._myMJArr[j];
                if (cc.fy.mahjongmgr.isBaida(sprMJ.node.mjId)) {
                    var baidaMark = sprMJ.node.getChildByName("baidaMark");
                    if (baidaMark != null) {
                        baidaMark.active = true;
                    }
                    else {
                        cc.fy.resMgr.loadRes("prefabs/baidaMark", function (prefab) {
                            var mark = cc.instantiate(prefab);
                            sprMJ.node.addChild(mark);
                            mark.x = 28;
                            mark.y = 43;
                            mark.rotation = 0;
                        });
                    }

                    cc.fy.mahjongmgr.changeMahjongNodeColor(sprMJ.node, new cc.Color(248, 239, 127));

                    var button = sprMJ.node.getComponent(cc.Button);
                    if (button && cc.fy.gameNetMgr.conf.type != cc.GAMETYPE.YZHZ
                        && cc.fy.gameNetMgr.conf.type != cc.GAMETYPE.YZER_YZ) {
                        button.enableAutoGrayEffect = false;
                        button.interactable = false;
                        cc.fy.mahjongmgr.changeMahjongNodeColor(sprMJ.node, new cc.Color(248, 239, 127));
                        // button.disabledColor = new cc.Color(248, 239, 127);
                    }
                }
                else {
                    cc.fy.mahjongmgr.changeMahjongNodeColor(sprMJ.node, new cc.Color(255, 255, 255));
                    var baidaMark = sprMJ.node.getChildByName("baidaMark");
                    if (baidaMark != null) {
                        baidaMark.active = false;
                    }
                }
                var fanbaida = cc.fy.gameNetMgr.fanbaida;
                var banziMark = sprMJ.node.getChildByName("banziMark");
                if (fanbaida != null && sprMJ.node.mjId == fanbaida && (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.YZDDH || cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.YZER)) {
                    if (banziMark != null) {
                        // banziMark.active = true;
                        // cc.fy.mahjongmgr.changeMahjongNodeColor(sprMJ.node,new cc.Color(248, 239, 127));
                    }
                }
                else {
                    if (banziMark != null) {
                        banziMark.active = false;
                        // cc.fy.mahjongmgr.changeMahjongNodeColor(sprMJ.node,new cc.Color(255, 255, 255));
                    }
                }
            }
        }

        var btdata = cc.fy.gameNetMgr.baoting;
        console.log("==>> baoting: ", btdata);
        console.log("==>> myMJArr: ", this._myMJArr);
        if (btdata[cc.fy.gameNetMgr.seatIndex]) {
            let tingData = btdata[cc.fy.gameNetMgr.seatIndex];
            console.log("==>> tingData: ", tingData);
            if (tingData.tings) {
                this.tingpai(tingData);
            }
            else {
                for (var i = 0; i < this._myMJArr.length; ++i) {
                    var targetNode = this._myMJArr[i].node;
                    var sprite = this._myMJArr[i];
                    var button = targetNode.getComponent(cc.Button);
                    if (i < this._myMJArr.length - 1) {
                        button.interactable = false;
                        cc.fy.mahjongmgr.changeMahjongNodeColor(sprite.node, new cc.Color(155, 155, 155));
                    }
                    else {
                        button.interactable = true;
                        cc.fy.mahjongmgr.changeMahjongNodeColor(sprite.node, new cc.Color(255, 255, 255));
                    }
                }
            }
        }
        else {
            for (var i = 0; i < this._myMJArr.length; ++i) {
                var targetNode = this._myMJArr[i].node;
                var sprite = this._myMJArr[i];
                var button = targetNode.getComponent(cc.Button);
                button.interactable = true;
                cc.fy.mahjongmgr.changeMahjongNodeColor(sprite.node, new cc.Color(255, 255, 255));
            }
        }
    },

    setSelfHoldsState(data) {
        for (var i = 0; i < this._myMJArr.length; ++i) {
            var targetNode = this._myMJArr[i].node;
            var sprite = this._myMJArr[i];
            var button = targetNode.getComponent(cc.Button);
            if (i < this._myMJArr.length - 1) {
                if (data) {
                    button.interactable = false;
                    cc.fy.mahjongmgr.changeMahjongNodeColor(sprite.node, new cc.Color(155, 155, 155));
                }
                else {
                    button.interactable = true;
                    cc.fy.mahjongmgr.changeMahjongNodeColor(sprite.node, new cc.Color(255, 255, 255));
                }
            }
            else {
                button.interactable = true;
                cc.fy.mahjongmgr.changeMahjongNodeColor(sprite.node, new cc.Color(255, 255, 255));
            }
        }
    },

    getLackingNum(seatData) {
        var getLength = function (arr) {
            return arr ? arr.length : 0;
        };

        var num = getLength(seatData.pengs) + getLength(seatData.angangs) + getLength(seatData.diangangs) + getLength(seatData.wangangs) +
            getLength(seatData.chis) + getLength(seatData.kans) + getLength(seatData.duis);
        num = num * 3;
        return num;
    },


    tingpai(data) {
        console.log("tingpai", data);
        if (data.tings == null) {
            return;
        }
        //仪征闲家天听 
        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.YZHZ ||
            cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.YZER_YZ) {
            if (cc.fy.gameNetMgr.getSeatIndexByID(data.userId) != cc.fy.gameNetMgr.turn) {
                let isfirstbool = true;
                let tingdata = { "userId": data.userId, "isFirst": isfirstbool };
                let index = cc.fy.gameNetMgr.getSeatIndexByID(data.userId);
                cc.fy.gameNetMgr.baoting[index] = tingdata;

                for (var i = 0; i < this._myMJArr.length; i++) {
                    var targetNode = this._myMJArr[i].node;
                    var sprite = this._myMJArr[i];
                    var button = targetNode.getComponent(cc.Button);
                    if (button.interactable) {
                        button.interactable = false;
                        cc.fy.mahjongmgr.changeMahjongNodeColor(sprite.node, new cc.Color(155, 155, 155));
                        // button.disabledColor = new cc.Color(155, 155, 155);
                    }
                }
                return;
            }
        }

        for (var i = 0; i < this._myMJArr.length; i++) {
            var targetNode = this._myMJArr[i].node;
            var sprite = this._myMJArr[i];
            var button = targetNode.getComponent(cc.Button);
            if (data.tings[targetNode.mjId] != null) {
                button.interactable = true;
            }
            else {
                if (button.interactable) {
                    button.interactable = false;
                    cc.fy.mahjongmgr.changeMahjongNodeColor(sprite.node, new cc.Color(155, 155, 155));

                    // button.disabledColor = new cc.Color(155, 155, 155);
                }
            }
        }
    },

    loadMark(snode, side) {
        cc.fy.resMgr.loadRes("prefabs/baidaMark", function (prefab) {
            var mark = cc.instantiate(prefab);
            snode.addChild(mark);
            if (side == "up") {
                mark.x = 16;
                mark.y = 29;
                mark.setScale(0.8);
                mark.rotation = 0;
            }
            else if (side == "left") {
                mark.x = 16;
                mark.y = 0;
                mark.setScale(0.5);
                mark.rotation = 90;
            }
            else if (side == "right") {
                mark.x = -16;
                mark.y = 13;
                mark.setScale(0.5);
                mark.rotation = 270;
            }

        });
    },

    getMJIndex(side, index) {
        var num = 13;
        if (side == "right" || side == "up") {
            return num - index;
        }
        return index;
    },

    setSpriteFrameByMJID(pre, sprite, mjid) {
        cc.fy.mahjongmgr.createMahjongNode(pre, mjid, sprite.node);
        sprite.node.active = true;
        sprite.node.color = new cc.Color(255, 255, 255);
    },

    cancelTingClick() {
        console.log("cancelTing ");
        cc.fy.net.send("cancelTing");
        // this.setCancelTingActive(false);
    },
});
