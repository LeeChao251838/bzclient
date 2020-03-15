var GameMsgDef = require("GameMsgDef");
cc.Class({
    extends: cc.Component,

    properties: {
        gameRoot: {
            default: null,
            type: cc.Node
        },

        prepareRoot: {
            default: null,
            type: cc.Node
        },

        // nodLaZhuang: cc.Node,
        // nodDingZhuang: cc.Node,

        _myMJArr: [],
        _options: null,
        _selectedMJ: null,
        _chupaiSprite: [],
        _chupaiSpriteBG: [],
        _mjcount: null,
        _gamecount: null,
        _chiPaiList: null,
        _shade: null,
        _hupaiTips: [],
        _hupaiLists: [],
        _playEfxs: [],
        _opts: [],
        _piaohua: cc.node, // 飘分按钮
        _zhishaizi: null,
        _leftCard: null,
        //_leftCard_game: null,
        _doubleNum: null,
        _doubleNum_szmj: null,
        _labAutoChupaiTip: null,
        _labDoubleNum: null,
        _optionIndex: 0,
        _chipaiArr: [],
        _chiData: null,
        _doublePanel: null,
        _btnDouble: null,
        // _typeTitleTDH:null,
        // _typeTitleSZMJ:null,
        // _difenFrame:null,
        // _difenLable:null,
        _renyi: null,
        _huData: null,
        _tingData: null,
        _huAlert: null,
        _btnTing: null,
        _mjNode: null,
        _gamePlayer: 4, //涟水人数
        _tingState: false,  //淮安听状态
        _qihu: null,        //齐胡提示
        _qihuState: false,  //齐胡状态
        _zcount: null,
        _mjNode_P: null,
        _isCheckHit: null,
        _huType: [],
        _peiziWin: null,
        _huangfanshu: null,
        _rightHF: null,
        _huangF: null,
        _hNum: null,
        _huangNum: null,
        _juType1: null,
        _juType2: null,

    },

    onLoad: function () {
        this.isZhuaMa = false;
        this._huType = [null, null, null, null];
        if (cc.fy.gameNetMgr.seats == null || cc.fy.gameNetMgr.seats.length <= 0) {
            cc.fy.alert.show("该房间不存在或已被解散！", function () {
                cc.fy.gameNetMgr.isOver = true;
                cc.fy.gameNetMgr.isReturn = false;
                cc.fy.sceneMgr.loadScene("hall");
            });
            console.log("cc.fy.gameNetMgr.seats is null");
            return;
        }

        if (!cc.fy) {
            cc.fy.sceneMgr.loadScene("loading");
            return;
        }
        // 临界点情况 解散包厢
        if ((cc.fy.replayMgr.isReplay() == false && cc.fy.gameNetMgr.isOver == true) || (cc.fy.gameNetMgr.dissoveData && cc.fy.gameNetMgr.dissoveData.time <= 0)) {
            this.gameRoot.active = false;
            this.prepareRoot.active = false;
            cc.fy.alert.show("房间已被玩家解散或牌局已结束！", function () {
                cc.fy.gameNetMgr.isOver = true;
                cc.fy.gameNetMgr.isReturn = false;
                cc.fy.sceneMgr.loadScene("hall");
            });
            this.node.emit('reconnecthide');
            return;
        }

        console.log("MJGame onload");
        this.addComponent("NoticeTip");
        this.addComponent("PengGangs");
        this.addComponent("MJRoom");
        // this.addComponent("TimePointer");
        this.addComponent("Folds");
        // this.addComponent("Holds");
        this.addComponent("ReplayCtrl");
        // this.addComponent("ReConnect");
        this.addComponent("GameOver");
        this.addComponent("GameResult");
        this.addComponent("Flowers");
        // this.addComponent("GameAction");
        // this.addComponent("Voice");
        this.addComponent("Ting");
        //this.addComponent("AIGame"); // 需要开始单机就取消注释
        this._gamePlayer = cc.fy.gameNetMgr.conf.maxCntOfPlayers ? cc.fy.gameNetMgr.conf.maxCntOfPlayers : cc.fy.gameNetMgr.seats.length;
        if (cc.fy.replayMgr.isReplay()) {
            this._gamePlayer = cc.fy.gameNetMgr.seats.length;
        }


        this._huAlert = cc.find("huAlert", this.gameRoot);
        this._mjNode_P = this._huAlert.getChildByName("mjNode");
        this._mjNode = this._huAlert.getChildByName("mjNode").getChildByName("mj");
        this._renyi = this._huAlert.getChildByName("renyi");
        this._renyi.active = false;

        this._zcount = this._huAlert.getChildByName("count");
        this._btnTing = cc.find("btnTing", this.gameRoot);

        this._peiziWin = this.node.getChildByName("peiziWin");
        this._juType1 = this._peiziWin.getChildByName("ju1");
        this._juType2 = this._peiziWin.getChildByName("ju2");
        this._juType1.active = false
        this._juType2.active = true
        this._huangfanshu = this._peiziWin.getChildByName('zongNum').getChildByName('num').getComponent(cc.Label)
        this._huangfanshu.node.parent.active = false
        this._isCheckHit = false
        if (this._btnTing) {
            //cc.fy.utils.addClickEvent(this._btnTing.getComponent(cc.Button), this.node, "MJGame", "showHuMJ");
            let self = this
            this._btnTing.on(cc.Node.EventType.TOUCH_START, function (event) {
                this._isCheckHit = true;
                self._huAlert.active = true;
            }, this);
            this._btnTing.on(cc.Node.EventType.TOUCH_END, function (event) {
                self._isCheckHit = false;
                self._huAlert.active = false;
            }, this)
            this._btnTing.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
                self._isCheckHit = false;
                self._huAlert.active = false;
            }, this)
        }
        this.initView();
        this.initEventHandlers();

        this.gameRoot.active = false;
        this.prepareRoot.active = true;


        // this.showWindHuang(false);

        // this.initWanfaLabel();
        this.onGameBeign();
        cc.fy.audioMgr.playBGM("bgFight.mp3");

        this.resetView_New();
        cc.fy.global.loginScene = false;

        cc.fy.localStorage.setItem("showType", 1);
        cc.fy.gameNetMgr.dispatchEvent("changShowType", { showType: 1 });
        // this.ceshiMJ()
    },

    initView: function () {
        if (cc.fy.gameNetMgr.seats == null || cc.fy.gameNetMgr.seats.length <= 0) {
            return;
        }
        console.log('cc.fy.gameNetMgr.seats:', cc.fy.gameNetMgr.seats);
        //搜索需要的子节点
        var gameChild = this.gameRoot;
        this._MahJongs = gameChild.getChildByName("myself").getChildByName("MahJongs");
        for (var i = 0; i < this._MahJongs.children.length; ++i) {
            this._MahJongs.children[i].active = false;
        }
        this._infobarNode = this.node.getChildByName("infobar");
        // this._leftCard = this._infobarNode.getChildByName("leftcard");
        // this._mjcount = this._leftCard.getChildByName("mjcount").getComponent(cc.Label);
        // this._mjcount.string = cc.fy.gameNetMgr.numOfMJ.toString();
        // this._gamecount = this._leftCard.getChildByName("gamecount").getComponent(cc.Label);
        // this._gamecountLab = this._leftCard.getChildByName("gamecount1").getComponent(cc.Label);
        this._chiPaiList = this.node.getChildByName("chiPaiList");
        this._shade = this.node.getChildByName("shade");
        this._doublePanel = this.node.getChildByName("doublePanel");
        //加倍按钮
        this._btnDouble = this.node.getChildByName("ermj").getChildByName('btndouble');
        // this._paidun = this.node.getChildByName("ermj").getChildByName("paidunPrefab");
        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZER) {

            //吃牌
            for (var i = 0; i < this._chiPaiList.childrenCount; ++i) {
                this._shade.children[i].active = false;
                this._chiPaiList.children[i].active = false;
            }
            //加倍提示界面
            this._doublePanel.active = false;
            // this._paidun.active = false;
            this.node.getChildByName("ermj").active = true
            this.node.getChildByName("ermj").getChildByName("task").active = false

        } else {
            this._doublePanel = this.node.getChildByName("doublePanel");
            this._doublePanel.active = false;
            this.node.getChildByName("ermj").active = false
        }

        // this._leftCard_game = gameChild.getChildByName("leftcard");
        // this._mjcount_game = this._leftCard_game.getChildByName("mjcount").getComponent(cc.Label);
        // this._mjcount_game.string = cc.fy.gameNetMgr.numOfMJ.toString();
        // this._gamecount_game = this._leftCard_game.getChildByName("gamecount").getComponent(cc.Label);
        // this._gamecount_game.string = cc.fy.gameNetMgr.numOfGames + "/" + cc.fy.gameNetMgr.maxNumOfGames;// + "局";


        this._mjcount = cc.find("leftCard/iconleftcard/lableftcard", this._infobarNode).getComponent(cc.Label);
        this._mjcount.string = cc.fy.gameNetMgr.numOfMJ.toString();

        this._gamecount = cc.find("jushu/iconjushu/labjushu", this._infobarNode).getComponent(cc.Label);
        if (cc.fy.gameNetMgr.numOfGames != null && cc.fy.gameNetMgr.numOfGames != undefined) {
            if (cc.fy.replayMgr.isReplay()) {
                if (cc.fy.gameNetMgr.conf.maxGames) {
                    this._gamecount.string = cc.fy.gameNetMgr.numOfGames + "/" + cc.fy.gameNetMgr.conf.maxGames;
                } else {
                    this._gamecount.string = cc.fy.gameNetMgr.numOfGames
                }
            } else {
                this._gamecount.string = cc.fy.gameNetMgr.numOfGames + "/" + cc.fy.gameNetMgr.maxNumOfGames;
            }
        } else {
            this._gamecount.string = 0 + "/" + cc.fy.gameNetMgr.maxNumOfGames;
            this._mjcount.string = 0;

        }
        var myselfChild = gameChild.getChildByName("myself");
        this._qihu = myselfChild.getChildByName("qihu");
        this._labAutoChupaiTip = myselfChild.getChildByName("labAutoChupaiTip");
        var myholds = myselfChild.getChildByName("holds");
        var self = this;
        for (var i = 0; i < myholds.children.length; ++i) {
            var sprite = myholds.children[i].getComponent(cc.Sprite);
            this._myMJArr.push(sprite);
            sprite.spriteFrame = null;
            myholds.children[i].on(cc.Node.EventType.TOUCH_START, function (event) {
                self.onMJTouch(event);
            });
            myholds.children[i].on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
                self.onMJTouchCancel(event);
            });
            myholds.children[i].on(cc.Node.EventType.TOUCH_MOVE, function (event) {
                self.onMJTouchMove(event);
            });
        }
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
        for (var i = 0; i < sides.length; ++i) {
            var side = sides[i];
            var sideChild = gameChild.getChildByName(side);
            this._hupaiTips.push(sideChild.getChildByName("HuPai"));
            this._hupaiLists.push(sideChild.getChildByName("hupailist"));
            this._playEfxs.push(sideChild.getChildByName("ani").getComponent(sp.Skeleton));
            this._chupaiSprite.push(sideChild.getChildByName("ChuPai").children[1].getComponent(cc.Sprite));
            this._chupaiSpriteBG.push(sideChild.getChildByName("ChuPai").children[0]);
            // if (cc.fy.gameNetMgr.seats.length == 2) {
            //     if (i == 1 || i == 3) {
            //         sideChild.active = false;
            //     }
            // }
            // else if (cc.fy.gameNetMgr.seats.length == 3) {
            //     if (i == 2) {
            //         sideChild.active = false;
            //     }
            // }
            var opt = sideChild.getChildByName("opt");
            opt.active = false;
            var sprite = opt.getChildByName("pai").getComponent(cc.Sprite);
            var data = {
                node: opt,
                sprite: sprite
            };
            this._opts.push(data);
        }


        var opts = this.node.getChildByName("ops");
        this._options = opts;
        this.hideOptions();

        this.hideChupai("initview");
        this.showBaida();
        this._piaohua = gameChild.getChildByName("piaohua");
        this.setPiaohuaActive(false);
        this.setPiaohuaNum();
        if (cc.fy.gameNetMgr.isShowPiaohua == true) {
            this.onPiaohua(null);
        }

        var nodeZsz = gameChild.getChildByName("zhishaizi");
        this._zhishaizi = nodeZsz.getComponent("Zhishaizi");
        if (cc.fy.gameNetMgr.zhishaizinum != null) {
            console.log("cc.fy.gameNetMgr.zhishaizinum != null");
            this._zhishaizi.playZ(cc.fy.gameNetMgr.zhishaizinum);
        }
        this._rightHF = gameChild.getChildByName("rightHF");
        this._huangF = this._rightHF.getChildByName("huangF");
        this._hNum = this._rightHF.getChildByName("huangNum");
        this._huangNum = this._hNum.getComponent(cc.Label);

        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZWJ) {

            this._rightHF.active = false;
            this._huangF.active = true;
            this._hNum.active = true;
        } else {
            this._rightHF.active = false;
        }
        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZWJ && cc.fy.replayMgr.isReplay()) {
            this._rightHF.active = false;
            this._huangF.active = false;
            this._hNum.active = false;
        }


        this._doubleNum = gameChild.getChildByName("doublegame");
        this._labDoubleNum = this._doubleNum.getChildByName("labLabel").getComponent(cc.Label);

        this._doubleNum_szmj = gameChild.getChildByName("doublegame_szmj");
        this._labDoubleNum_szmj = this._doubleNum_szmj.getChildByName("labLabel").getComponent(cc.Label);
        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZCT) {
            this._doubleNum_szmj.active = true
            this._doubleNum.active = false

        } else {
            this._doubleNum_szmj.active = false
        }

        this.setDoubleNum(cc.fy.gameNetMgr.numOfDouble);
        var debugbtn = this.node.getChildByName("btnDebug");
        if (cc.DEBUGBTN == true) {
            debugbtn.active = true;
        }
        else {
            debugbtn.active = false;
        }

        // var sides = ["myself", "right", "up", "left"];
        // for (var i = 0; i < sides.length; ++i) {
        //     var sideNode = gameChild.getChildByName(sides[i]);
        //     var seat = sideNode.getChildByName("seat");
        //     this._seats.push(seat.getComponent("Seat"));
        //     this._seats2.push(seat.getComponent("Seat"));
        // }

        // this._myselfSeat = gameChild.getChildByName(sides[0]).getChildByName("seat");
        // this._myselfFlower = gameChild.getChildByName(sides[0]).getChildByName("flowerMarkRoot");

        // this._rightSeat = gameChild.getChildByName(sides[1]).getChildByName("seat");
        // this._rightFlower = gameChild.getChildByName(sides[1]).getChildByName("flowerMarkRoot");

        // this._upSeat = gameChild.getChildByName(sides[2]).getChildByName("seat");
        // this._upFlower = gameChild.getChildByName(sides[2]).getChildByName("flowerMarkRoot");

        // this._leftSeat = gameChild.getChildByName(sides[3]).getChildByName("seat");
        // this._leftFlower = gameChild.getChildByName(sides[3]).getChildByName("flowerMarkRoot");

        // this.setPlayerPos();

        // 风和晃
        // this._windNode = gameChild.getChildByName("nodWind");
        // this._windNode.active = false;
        // this._windSpr = this._windNode.getChildByName("nodFeng");
        // this._windSpr.active = false;
        // this._windTip = this._windNode.getChildByName("labTip");
        // this._huangNum = this._windNode.getChildByName("sprHuang");
        // this._huangNum.active = false;
        // this.showWindHuang(true);
        // if (cc.fy.gameNetMgr.fanbaida != null && cc.fy.gameNetMgr.fanbaida != -1) {
        //     self.showPaidun(cc.fy.gameNetMgr.fanbaida);
        // }
        // this._btnWanfa = cc.find("right/btnWanfa", this._infobarNode);
        // if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.JDMJ) {
        //     this._btnWanfa.active = true;
        // }
        // else {
        //     this._btnWanfa.active = false;
        // }

    },
    hideChupai: function (type) {
        console.log("hideChupai", type);
        // for (var i = 0; i < this._chupaiSprite.length; ++i) {
        //     this._chupaiSprite[i].node.active = false;
        // }
    },

    hideDir: function () {
        //this._huAlert.active = false;
        for (var i = 0; i < this._myMJArr.length; ++i) {
            var sprite = this._myMJArr[i];
            sprite.node.getChildByName("dir").active = false;
        }
    },

    setAutoChupaiTipActive: function (bo) {
        this._labAutoChupaiTip.active = bo;
    },
    initEventHandlers: function () {
        console.log("MJGame initEventHandlers");

        //初始化事件监听器
        var self = this;
        var game = cc.fy.gameNetMgr;
        game.addHandler('login_result', function (data) {
            console.log(" game login_result ");
        });
        game.addHandler('game_start', function (data) {
            self._isInitBackMahjongOnce = false; // 下次开始的时候重置为FALSE
            cc.fy.promoCode = null;
            self._huType = [null, null, null, null];
            self.resetView_New(true);
        });

        game.addHandler('game_holds', function (data) {
            self.initMahjongs();
            console.log("game_holds ");
            if (self._zhishaizi != null) {
                // self._zhishaizi.hide();
            }
            // self._leftCard_game.active = true;
            // self.showGameCount(true);
            self.setDoubleNum(cc.fy.gameNetMgr.numOfDouble);
            // cc.fy.audioMgr.playSFX("fapai.mp3");
        });
        game.addHandler('game_holds_prepare', function (data) {
            console.log("game_holds_prepare");
            if (self._zhishaizi != null) {
                // self._zhishaizi.hide();
            }
            // self._leftCard_game.active = true;
            self.setDoubleNum(cc.fy.gameNetMgr.numOfDouble);

        });
        game.addHandler('game_fanbaida', function (data) {
            console.log("game_fanbaida");
            var data = data;
            self.showPaidun(data);
        });

        game.addHandler('game_begin', function (data) {
            //self.onGameBeign();
            //for (var i = 0; i < self._MahJongs.children.length; ++i) {
            //     self._MahJongs.children[i].active = false;
            // }
            if (self._doublePanel) {
                self.refreshDoublePanel();
            }
            self.onGameBeign();
            self._huType = [null, null, null, null];
            if (cc.fy.gameNetMgr.isWJMJ()) {
                for (var i = 0; i < self._MahJongs.children.length; ++i) {
                    self._MahJongs.children[i].active = false;
                }
            }
        });

        // 开始飘花消息
        game.addHandler('game_piaohua', function (data) {
            self.onPiaohua(data);
        });
        // 飘花反馈
        game.addHandler('piaohua_notify', function (data) {
            self.onPiaohuaNotify(data);
        });

        // 飘花结果
        game.addHandler('game_piaoresult', function (data) {
            self.onPiaoResult();
        });
        // // 开始拉庄消息
        // game.addHandler('game_lazhuang', function (data) {
        //     self.onLazhuang(data);
        // });

        // // 拉庄结果
        // game.addHandler('game_lazhuangresult', function (data) {
        //     self.onLazhuangResult(data);
        // });

        // // 开始顶庄消息
        // game.addHandler('game_dingzhuang', function (data) {
        //     self.onDingzhuang(data);
        // });

        // // 顶庄结果
        // game.addHandler('game_dingzhuangresult', function (data) {
        //     self.onDingzhuangResult(data);
        // });

        game.addHandler('game_isting', function (data) {
            console.log("game_isting--->>>>");
            var detail = data;
            if (detail == null) {
                return;
            }
            var seatindex = cc.fy.gameNetMgr.getSeatIndexByID(detail.userId);
            var localIndex = cc.fy.gameNetMgr.getLocalIndex(seatindex);
            self.hideChupai('game_isting');
            if (localIndex == 0) {
                self.hideOptions();
            }

            self.doTing(data);
        });
        game.addHandler('game_tingresult', function (data) {
            console.log("game_tingresult--->>>>");
            var detail = data;
            if (detail == null) {
                return;
            }
            var seatindex = cc.fy.gameNetMgr.getSeatIndexByID(detail.userId);
            var localIndex = cc.fy.gameNetMgr.getLocalIndex(seatindex);
            self.hideChupai('game_tingresult');
            if (localIndex == 0) {
                self.hideOptions();
            }

            self.doJiating(data);
        });

        //掷骰子结果
        game.addHandler('game_zhishaizi', function (data) {
            console.log("==>> game_zhishaizi");
            self.onZhishaizi(data);
        });

        game.addHandler('game_action', function (data) {
            self.showAction(data);
        });
        this.node.on('game_refreshallholds', function (data) {
            // self.initSelfMahjongs(true);
            var seats = cc.fy.gameNetMgr.seats;
            for (var i in seats) {
                console.log(seats);
                var seatData = seats[i];
                var localIndex = cc.fy.gameNetMgr.getLocalIndex(i);
                if (localIndex != 0) {
                    console.log("initOtherMahjongs 2");
                    self.initOtherMahjongs(seatData);
                }
            }
        });
        game.addHandler('game_sync', function (data) {
            console.log('MJgame???>>>game_sync', data)
            self._isInitBackMahjongOnce = false; // 下次开始的时候重置为FALSE
            self.onGameBeign();
            // self._btnTing.active = false;
            // self._huAlert.active = false;
            //self.showKuangArr();
        });
        // game.addHandler("game_sync_push", function(data){
        //     if(cc.fy.sceneMgr.isMJGameScene()){
        //         console.log('MJgame???>>>game_sync1111111111',data)
        //     }
        // });
        game.addHandler('game_chupai', function (data) {
            data = data;
            self.hideChupai('game_chupai');
            if (data.last != cc.fy.gameNetMgr.seatIndex) {
                self.initMopai(data.last, null);
            }
            if (!cc.fy.replayMgr.isReplay() && data.turn != cc.fy.gameNetMgr.seatIndex) {
                self.initMopai(data.turn, -1);
            }
        });

        game.addHandler('game_mopai', function (data) {
            self.hideChupai('game_mopai');
            var pai = data.pai;
            var localIndex = cc.fy.gameNetMgr.getLocalIndex(data.seatIndex);
            if (localIndex == 0) {
                var index = 13;
                var sprite = self._myMJArr[index];
                self.setSpriteFrameByMJID("M_", sprite, pai, index);
                sprite.node.mjId = pai;
                sprite.node.y = 0;
            } else if (cc.fy.replayMgr.isReplay()) {
                self.initMopai(data.seatIndex, pai);
            }
            if (cc.fy.gameNetMgr.isWJMJ()) {
                self._MahJongs.children[0].active = false;
            }
            self.initMahjongs();
            cc.fy.gameNetMgr.dispatchEvent("game_mopai_ting", data);

        });
        game.addHandler('gamebaida', function (data) {
            console.log("收到百搭");
            self.showBaida();
            self.initMahjongs();
        });
        game.addHandler('hupai', function (data) {
            console.log("hupai", data);
            var data = data;
            //如果不是玩家自己，则将玩家的牌都放倒
            var seatIndex = data.seatindex;
            var seats = cc.fy.gameNetMgr.seats;
            var localIndex = cc.fy.gameNetMgr.getLocalIndex(seatIndex);
            var sex = seats[seatIndex].sex;
            var hupai = self._hupaiTips[localIndex];
            hupai.active = true;
            //隐藏吃牌节点队列
            if (self._chiPaiList) {
                for (var i = 0; i < self._chiPaiList.childrenCount; ++i) {
                    self._shade.children[i].active = false;
                    self._chiPaiList.children[i].active = false;
                }
            }
            if (localIndex == 0) {
                self.hideOptions();
            }
            var seatData = cc.fy.gameNetMgr.seats[seatIndex];
            seatData.hued = true;
            if (cc.fy.gameNetMgr.conf.type == "xlch") {
                hupai.getChildByName("sprHu").active = true;
                hupai.getChildByName("sprZimo").active = false;
                self.initHupai(localIndex, data.hupai);
                if (data.iszimo) {
                    if (seatData.seatindex == cc.fy.gameNetMgr.seatIndex) {
                        seatData.holds.pop();
                        self.initMahjongs();
                    }
                    else {
                        console.log("initOtherMahjongs 3");
                        self.initOtherMahjongs(seatData);
                    }
                }
            }
            else {
                // hupai.getChildByName("sprHu").active = data.iszimo;
                // hupai.getChildByName("sprZimo").active = false;
                hupai.getChildByName("sprHu").active = false;
                hupai.getChildByName("sprZimo").active = data.iszimo;
                if (!(data.iszimo && localIndex == 0)) {
                    //if(cc.fy.replayMgr.isReplay() == false && localIndex != 0){
                    //    self.initEmptySprites(seatIndex);                
                    //}
                    self.initMopai(seatIndex, data.hupai);
                }
            }
            if (cc.fy.replayMgr.isReplay() == true && cc.fy.gameNetMgr.conf.type != "xlch") {
                var opt = self._opts[localIndex];
                opt.node.active = true;
                opt.sprite.spriteFrame = cc.fy.mahjongmgr.getSpriteFrameByMJID("M_", data.hupai);
            }

            if (data.iszimo) {
                // self.playEfx(localIndex, "play_zimo");
                self.playGameAni(localIndex, "自摸", false);
                cc.fy.audioMgr.playSFX("zimo.mp3", true);
            }
            else {
                //self.playEfx(localIndex, "play_hu");
                self.playGameAni(localIndex, "胡", false);
                cc.fy.audioMgr.playSFX("hu.mp3", true);
            }
            self.hideDoublePanel();

        });


        game.addHandler('zhuaMaList', function (data) {

        });

        game.addHandler('game_num', function (data) {
             console.log('______________________33333' + data);
            self._gamecount.string = parseInt(data) + "/" + cc.fy.gameNetMgr.maxNumOfGames;
            console.log(self._gamecount.string + '______________________333313' + data);
            // self._gamecount_game.string = parseInt(data) + "/" + cc.fy.gameNetMgr.maxNumOfGames;
        });
        game.addHandler('mj_count', function (data) {
            self._mjcount.string = cc.fy.gameNetMgr.numOfMJ.toString();
            // self._mjcount_game.string = cc.fy.gameNetMgr.numOfMJ.toString();
        });
        game.addHandler('game_num_double', function (data) {
            self.setDoubleNum(data);
        });
        game.addHandler('can_tianting_push', function (data) {
            console.log("can_tianting_push");
            var data = data;
            if (data.length > 0) {
                self.showTing(data);
            }
        });


        game.addHandler('game_chupai_notify', function (data) {
            console.log("game_chupai_notify");
            self.hideChupai("game_chupai_notify");
            var seatData = data.seatData;
            //如果是自己，则刷新手牌
            if (seatData.seatindex == cc.fy.gameNetMgr.seatIndex) {
                self.initMahjongs();
            }
            else {
                console.log("initOtherMahjongs 4");
                self.initOtherMahjongs(seatData);
                self.initMopai(seatData.seatindex, null);
            }
            self._huData = null;
            if (self._tingState) {
                self._tingState = false;
            }
            self.showChupai();
            if (data.pai == 99) {
                cc.fy.audioMgr.playSFX("give.mp3");
                return;
            }

            if (data.pai >= 1000) {
                data.pai = data.pai - 1000;
            }
            var audioUrl = cc.fy.mahjongmgr.getAudioURLByMJID(data.pai);
            cc.fy.audioMgr.playSFX(audioUrl, true);
            cc.fy.audioMgr.playSFX("give.mp3");
            self.refreshTingNum();
        });

        game.addHandler('guo_notify', function (data) {
            self.hideChupai('guo_notify');
            var seatData = data;
            //如果是自己，则刷新手牌
            if (seatData.seatindex == cc.fy.gameNetMgr.seatIndex) {
                self.initMahjongs();
            }
            // cc.fy.audioMgr.playSFX("give.mp3"); 
            self.hideOptions();
        });

        game.addHandler('guo_result', function (data) {
            // var seatData = data;
            // if (seatData != null) {
            // var localIndex = cc.fy.gameNetMgr.getLocalIndex(seatData);
            //self.playEfx(localIndex, "play_guo");
            // }
            if (cc.fy.gameNetMgr.curaction && cc.fy.gameNetMgr.curaction.hu) {
                if (self._qihuState) {//&& !self._labAutoChupaiTip.active
                    // self._qihu.active = true;
                    cc.fy.hintBox.show("您选择了在本圈放弃胡牌！");
                }
                self._chiData = null;
            }
            self.hideOptions();
            cc.fy.gameNetMgr.curaction = null;
        });

        game.addHandler('peng_notify', function (data) {
            self.hideChupai('peng_notify');
            var seatData = data.seatData;
            if (seatData.seatindex == cc.fy.gameNetMgr.seatIndex) {
                self.initMahjongs();
            }
            else {
                console.log("initOtherMahjongs 5");
                self.initOtherMahjongs(seatData);
            }
            var localIndex = self.getLocalIndex(seatData.seatindex);
            //self.playEfx(localIndex, "play_peng");
            self.playGameAni(localIndex, "碰", false);
            cc.fy.audioMgr.playSFX("peng.mp3", true);
            self.hideOptions();
            self.refreshTingNum();

        });

        game.addHandler('peng_recv', function (data) {
            self.hideChupai('peng_recv');
            self.hideOptions();

        });
        game.addHandler('chi_recv', function (data) {
            self.hideChupai('chi_recv');
            self.hideOptions();
        });
        game.addHandler('cancelTing_recv', function (data) {
            console.log("cancelTing_recv--->>>>");
            var detail = data;
            if (detail == null) {
                return;
            }
            var seatindex = cc.fy.gameNetMgr.getSeatIndexByID(detail.userId);
            var localIndex = cc.fy.gameNetMgr.getLocalIndex(seatindex);
            self.hideChupai('cancelTing_recv');
            if (localIndex == 0) {
                self.hideOptions();
            }
            self.cancelJiaTing(detail);
        });
        game.addHandler('hu_recv', function (data) {
            // if (self._doublePanel) {
            //     self.hideDoublePanel();
            // }
            self.hideOptions();
        });
        game.addHandler('gang_notify', function (data) {
            self.hideChupai('gang_notify');
            var data = data;
            var seatData = data.seatData;
            var gangtype = data.gangtype;

            var localIndex = self.getLocalIndex(seatData.seatindex);
            //self.playEfx(localIndex, "play_gang");
            self.playGameAni(localIndex, "杠", false);
            cc.fy.audioMgr.playSFX("gang.mp3", true);
            if (seatData.seatindex == cc.fy.gameNetMgr.seatIndex) {
                self.initMahjongs();
            } else {
                console.log("initOtherMahjongs 6");
                self.initOtherMahjongs(seatData);
            }
            self.refreshTingNum();

            // var localIndex = self.getLocalIndex(seatData.seatindex);
            // if(gangtype == "wangang"){
            //     //self.playEfx(localIndex,"play_guafeng");
            //     cc.fy.audioMgr.playSFX("guafeng.mp3");
            //        }
            // else{
            //     //self.playEfx(localIndex,"play_xiayu");
            //     cc.fy.audioMgr.playSFX("rain.mp3");
            //    }

        });

        game.addHandler("chi_notify", function (data) {
            self.hideChupai("chi_notify");
            var seatData = data;
            if (seatData.seatindex == cc.fy.gameNetMgr.seatIndex) {
                self.initMahjongs();
            }
            else {
                self.initOtherMahjongs(seatData);
            }
            var localIndex = self.getLocalIndex(seatData.seatindex);
            //self.playEfx(localIndex, "play_chi");
            self.playGameAni(localIndex, "吃", false);
            cc.fy.audioMgr.playSFX("chi.mp3", true);
            self.hideOptions();
            self._chiData = null;
            self.refreshTingNum();

        });

        game.addHandler("hangang_notify", function (data) {
            self.hideOptions();
            self.refreshTingNum();

        });

        game.addHandler('hangang_recv', function (data) {
            self.hideChupai('hangang_recv');
            self.hideOptions();
            self.refreshTingNum();

        });

        game.addHandler('double_res', function (data) {
            var data = data;
            var times = data.double;
            var userid = data.userid;
            var name = "";
            for (var i = 0; i < cc.fy.gameNetMgr.seats.length; ++i) {
                if (userid == cc.fy.gameNetMgr.seats[i].userid) {
                    name = cc.fy.gameNetMgr.seats[i].name;
                }
            }
            cc.fy.hintBox.show("玩家" + name + "选择加倍");
            self.showDoubleResult(userid, times);
        });


        game.addHandler("game_task", function (data) {
            console.log("game_task");
            console.log(data);
            self.showTask(data);
        });
        game.addHandler("game_task_finish", function (data) {
            var data = data;
            cc.fy.hintBox.show("玩家已完成分数加倍任务！");
            self.showTask(data);
        });

        game.addHandler("can_hu_prompt_push", function (data) {
            console.log("can_hu_prompt_push", data);
            self._huData = data;
            if (self._huData.length > 0) {
                self._btnTing.active = true;
            }
            self.showTingAlert(self._huData);
        });
        //涟水麻将天听消息监听处理---------------------------
        game.addHandler('game_tian_ting', function (data) {
            console.log("game_tian_ting");
            self.addOption("btntianting", -1);
        });
        game.addHandler('game_guotingresult', function (data) {
            console.log("game_guotingresult--->>>>");
            var detail = data;
            if (detail == null) {
                return;
            }
            var seatindex = cc.fy.gameNetMgr.getSeatIndexByID(detail.userId);
            var localIndex = cc.fy.gameNetMgr.getLocalIndex(seatIndex);
            if (localIndex == 0) {
                self.hideOptions();
            }
        });
        // 洗牌动画 
        game.addHandler('shuffle_push_result', function (data) {
            self.playCartoon(data);
        });
        // 结算
        game.addHandler('game_over', function (data) {
            if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZWJ) {
                self._peiziWin.active = false;
            }
            if (cc.fy.gameNetMgr.conf.type == 23) {
                self._huangF.active = false;
                self._hNum.active = false;
            }
            // self.playCartoon(data);
            var delayTimeTmp = 1.0;
            if (!cc.fy.gameNetMgr.isHuPai) {
                if (cc.fy.gameNetMgr.isDispressed) {
                    delayTimeTmp = 0.5;
                }
            } else {
                var huedPlayerNum = 0;
                for (var i = 0; i < data.length; i++) {
                    var userData = data[i];
                    var localIndex = self.getLocalIndex(i);
                    if (userData.hued) {
                        huedPlayerNum++;
                        if (userData.kankanhu) {
                            self._huType[i] = "坎坎胡";
                        } else if (userData.dihu || userData.isDiHu) {
                            self._huType[i] = "地胡";
                        } else if (userData.ruansixi) {
                            self._huType[i] = "软四喜";
                        } else if (userData.jiaanjue) {
                            self._huType[i] = "七对暗绝";
                        } else if (userData.qingyise || userData.isQingYise) {
                            self._huType[i] = "清一色";
                        } else if (userData.qidui || userData.qiDui) {
                            self._huType[i] = "七对";
                        } else if (userData.tianting) {
                            self._huType[i] = "天听";
                        } else if (userData.hunyise || userData.isHunYiSe) {
                            self._huType[i] = "混一色";
                        } else if (userData.long) {
                            self._huType[i] = "一条龙";
                        } else if (userData.quanqiuren) {
                            self._huType[i] = "全求人";
                        } else if (userData.duidui) {
                            self._huType[i] = "对对胡";
                        } else if (userData.pattern != null) {
                            if (userData.pattern == "duidui") {
                                self._huType[i] = "对对胡";
                            }
                        }
                        if (self._huType[i] != null) {
                            delayTimeTmp = 1.1;
                        }
                    }
                }
                for (var i = 0; i < data.length; i++) {
                    var localIndex = self.getLocalIndex(i);
                    var userData = data[i];
                    if (userData.actions) {
                        for (var j = 0; j < userData.actions.length; ++j) {
                            var ac = userData.actions[j];
                            if (ac && ac.type && (ac.type == "fangpao" || ac.type == "beiqianggang")) {
                                self.playGameAni(localIndex, "点炮", false);
                            }
                        }
                    }
                    if (userData.huMethod && (userData.huMethod == 2 || userData.huMethod == 8)) {
                        self.playGameAni(localIndex, "点炮", false);
                    }
                    if (userData.hued && huedPlayerNum > 1) {
                        self.playGameAni(localIndex, "一炮多响", false);
                    }
                }

            }
            self.scheduleOnce(function () {
                self.game_over();
            }, delayTimeTmp);
        });


        //-------------------------------------------------
    },

    showDoubleResult: function (userid, times) {
        if (userid != 0) {
            var seatIndex = cc.fy.gameNetMgr.getSeatIndexByID(userid);
            var localIndex = cc.fy.gameNetMgr.getLocalIndex(seatIndex);
            var seats = ["myself", "up"];
            var seat = this._doublePanel.getChildByName(seats[localIndex]);
            seat.active = true;
            var lbl = seat.getChildByName("times").getComponent(cc.RichText);
            lbl.string = "</c><color=#FFFFFF>已加倍</c><color=#fff000>" + times + "</c><color=#FFFFFF>次</c>"
        }
        else {
            var seat = this._doublePanel.getChildByName("up");
            seat.active = false;
            var seat1 = this._doublePanel.getChildByName("myself");
            seat1.active = false;
        }
        // this.playGameAni("加倍");
    },

    setDoubleNum: function (num) {
        if (num >= 1) {
            this._doubleNum.active = true;
            this._labDoubleNum.string = num;
            if (cc.fy.gameNetMgr.conf.type == 23) {
                this._doubleNum.active = false;
                this._huangF.active = true;
                this._hNum.active = true;
                this._huangfanshu.node.parent.active = true
                this._huangNum.string = num;
                this._huangfanshu.string = num
                this._juType1.active = true
                this._juType2.active = false
            }

            if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZCT) {
                this._doubleNum.active = false;
                this._doubleNum_szmj.active = true;
                this._labDoubleNum_szmj.string = num;
            }
        }
        else {
            this._doubleNum.active = false;
            if (cc.fy.gameNetMgr.conf.type == 23) {
                this._doubleNum.active = false;
                this._huangF.active = true;
                this._hNum.active = true;
                this._huangNum.string = 0;
                this._huangfanshu.node.parent.active = false
                this._juType1.active = false
                this._juType2.active = true
            }

            if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZCT) {
                this._doubleNum.active = false;
                this._doubleNum_szmj.active = false;
            }
        }

    },

    showChupai: function () {
        var pai = cc.fy.gameNetMgr.chupai;
        if (pai >= 0) {
            var localIndex = this.getLocalIndex(cc.fy.gameNetMgr.turn);
            var sprite = this._chupaiSprite[localIndex];
            sprite.spriteFrame = cc.fy.mahjongmgr.getSpriteFrameByMJID("M_", pai);
            sprite.node.active = true;
            // this._chupaiSpriteBG[localIndex].active = true;
            this.scheduleOnce(function () {
                sprite.node.active = false;
            }, 1.5);

        }
    },

    addOption: function (btnName, pai) {
        this._optionIndex += 1;
        this._options.active = true;
        var s = 0;
        for (var i = 0; i < this._myMJArr.length; ++i) {
            var sprite = this._myMJArr[i];
            if (sprite.node.mjId == 43) {
                s = s + 1;
            }
        }

        if (btnName == "btntianting") {
            this._options.getChildByName("btnGuo").active = false;
            this._options.getChildByName("btnTGuo").active = true;
        }
        else {
            this._options.getChildByName("btnGuo").active = true;
            if (this._options.getChildByName("btnTGuo")) {
                this._options.getChildByName("btnTGuo").active = false;
            }
        }
        var btnGuo = this._options.getChildByName("btnGuo");
        btnGuo.active = true;
        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZBD || cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZHD || cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZWJ) {
            btnGuo.active = !this.isHoldsAllBaida();
        }
        for (var i = 0; i < this._options.childrenCount; ++i) {
            var child = this._options.children[i];
            if (child.name == "op" && child.active == false) {
                child.active = true;
                var btn = child.getChildByName(btnName);
                btn.active = true;
                var sprite = child.getChildByName("opTarget").getComponent(cc.Sprite);
                sprite.node.active = true;


                if (cc.fy.gameNetMgr.conf.type == 23) {// 吴江麻将 胡牌不显示牌型
                    if (btnName == "btnHu") {
                        sprite.spriteFrame = null;
                        sprite.node.active = false;
                    }
                }
                if (cc.fy.gameNetMgr.conf.type == 4) {// 二人麻将 架听不显示牌型
                    if (btnName == "btnJiating") {
                        sprite.spriteFrame = null;
                        sprite.node.active = false;
                    }
                }

                if (btnName != "btnJiating" && btnName != "btntianting") {
                    sprite.spriteFrame = cc.fy.mahjongmgr.getSpriteFrameByMJID("M_", pai);
                    btn.pai = pai;
                }
                else if (btnName == "btnJiating" || btnName == "btntianting") {
                    sprite.node.active = false;
                }
                return;
            }
        }
    },
    isHoldsAllBaida: function () {
        var bo = true;
        var seats = cc.fy.gameNetMgr.seats;
        var seatData = seats[cc.fy.gameNetMgr.seatIndex];
        var holds = this.sortHolds(seatData);
        if (holds == null) {
            return;
        }
        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZHD || cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZWJ) {
            for (var i = 0; i < holds.length; ++i) {
                if (!cc.fy.mahjongmgr.isBaida(holds[i])) {
                    bo = false;
                    break;
                }
            }
        }
        else if (cc.fy.gameNetMgr.conf.type == 2) {
            for (var i = 0; i < holds.length; ++i) {
                if (holds[i] != 52) {
                    bo = false;
                    break;
                }
            }
        }

        return bo;
    },
    showDoublePanel: function (type) {

        if (cc.fy.gameNetMgr.conf.wanfa == null || cc.fy.gameNetMgr.conf.wanfa.double != 1) {
            this._doublePanel.active = false;
            return;
        }
        if (type != -1) {
            // if (type == 5) {
            //     this._btnDouble.getComponent(cc.Button).interactable = false;
            // }
            this._btnDouble.active = true;
            this._doublePanel.active = true;
        }
        else {
            // this._btnDouble.getComponent(cc.Button).interactable = false;
            this._btnDouble.active = false;
        }
    },

    refreshDoublePanel: function () {
        if (cc.fy.gameNetMgr.conf.wanfa == null || cc.fy.gameNetMgr.conf.wanfa.double != 1) {
            this._doublePanel.active = false;
            this._btnDouble.active = false;
        }
        else {
            this._doublePanel.active = true;
            this._btnDouble.active = false;

        }
    },
    hideDoublePanel: function () {
        if (this._doublePanel) {
            this._doublePanel.active = false;
        }
    },
    hideOptions: function (data) {

        this._optionIndex = 0;
        this._options.active = false;
        for (var i = 0; i < this._options.childrenCount; ++i) {
            var child = this._options.children[i];
            if (child.name == "op") {
                child.active = false;
                child.getChildByName("btnPeng").active = false;
                child.getChildByName("btnGang").active = false;
                child.getChildByName("btnHu").active = false;
                child.getChildByName("btnZimo").active = false;
                child.getChildByName("btnJiating").active = false;
                child.getChildByName("btnChi").active = false;
                if (child.getChildByName("btntianting")) {
                    child.getChildByName("btntianting").active = false;
                }
            }
        }
        //涟水天听处理“过”按钮
        this._options.getChildByName("btnGuo").active = false;
        this._options.getChildByName("btnCancel").active = false;
        if (this._options.getChildByName("btnTGuo")) {
            this._options.getChildByName("btnTGuo").active = false;
        }

        if (this._chiPaiList) {
            for (var i = 0; i < this._chiPaiList.childrenCount; ++i) {
                this._shade.children[i].active = false;
                this._chiPaiList.children[i].active = false;
            }
            // 加倍按钮
            // this._btnDouble.getComponent(cc.Button).interactable = true;
            this._btnDouble.active = false;
        }
        this._huAlert.active = false;
    },

    showAction: function (data) {
        if (this._options.active) {
            this.hideOptions();
        }
        if (data && (data.hu || data.gang || data.peng || data.ting || data.chipai || data.double || data.canCancelTing)) {
            this._options.active = true;
            this._options.getChildByName("zhezhao").active = true;

            if (data.gang) {
                //同点数只显示一个杠牌按钮
                var lastgang = [];
                for (var i = 0; i < data.gangpai.length; ++i) {
                    var gp = data.gangpai[i];
                    var same = false;
                    var length = lastgang.length;
                    for (var j = 0; j < length; j++) {
                        if (lastgang[j] == gp) {
                            same = true;
                            break;
                        }
                    }
                    if (same == false) {
                        this.addOption("btnGang", gp);
                        lastgang.push(gp);
                    }
                }
            }

            if (data.peng) {
                this.addOption("btnPeng", data.pai);
            }

            if (data.chipai) {
                this.addOption("btnChi", data.pai);
                this.showChiList(data.pai);
            }

            if (data.ting) {
                this.addOption("btnJiating", -1);
            }
            if (data.canCancelTing) {
                this._options.getChildByName("zhezhao").active = false;
                this._options.getChildByName("btnCancel").active = true;
            }

            if (data.hu) {
                cc._isRefreshTingData = false;
                var seat = cc.fy.gameNetMgr.seats[cc.fy.gameNetMgr.seatIndex];
                var tingState = seat.tingState;
                if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.HAMJ && tingState == 2) {
                    this._chiData = null;
                    cc.fy.net.send("hu");
                }
                else {
                    var isZimo = seat.holds.length % 3 == 2 ? true : false;
                    if (isZimo) {
                        this.addOption("btnZimo", data.pai);
                        this._qihuState = true;
                    }
                    else {
                        this.addOption("btnHu", data.pai);
                        this._qihuState = true;
                    }
                }
            }

            if (data.double != null && data.hu) {
                this.showDoublePanel(data.double);
            }
        }
    },

    initWanfaLabel: function () {
    },
    sortPai: function (data) {
        var arr = [];
        arr = data;


        arr.sort(function (a, b) {
            return a > b;
        });
        return arr;
    },
    showTing: function (data) {
        console.log("ting=====showTing", data);
        this._tingData = data;
        this._btnTing.active = true;
        this._mjNode_P.removeAllChildren();
        cc.fy.mahjongmgr.sortSZMJ(data);
        var maxHupaiNum = this.node.getComponent("Ting").getCanCalcTingList();
        if (data.length >= maxHupaiNum) {
            this._renyi.active = true;
            this._mjNode.active = false;
            //var rmjspr = this.getViewItem(this._huAlert,this._renyi,1);
            //rmjspr.x = 38;
            // var curzcount = this.getViewItem1(this._huAlert,this._zcount,1);
            //curzcount.x = -134;
            //var rmj = rmjspr.getComponent(cc.Sprite);
            //cc.fy.hintBox.show("您可以胡任意牌！");
            this._zcount.getComponent(cc.Label).string = cc.fy.gameNetMgr.numOfMJ.toString();
        }
        else {
            this._renyi.active = false
            let curCount = 0
            for (var k = 0; k < data.length; ++k) {
                var mjspr = this.getViewItem(this._mjNode_P, this._mjNode, k);
                var mjnum = mjspr.getChildByName("num").getComponent(cc.Label);
                var num = this.getRemainderMJNum(data[k]);
                mjnum.string = num;
                curCount += num;
                var baidaMark = mjspr.getChildByName("baidaMark");
                if (cc.fy.mahjongmgr.isBaida(data[k])) {
                    baidaMark.active = true;
                    baidaMark.scaleX = 0.8
                    baidaMark.scaleY = 0.8
                } else {
                    baidaMark.active = false;
                }
                mjspr.color = num > 0 ? new cc.Color(255, 255, 255) : new cc.Color(200, 200, 200);
                var mj = mjspr.getComponent(cc.Sprite);
                mj.spriteFrame = cc.fy.mahjongmgr.getSpriteFrameByMJID("M_", data[k]);
            }
            this._zcount.getComponent(cc.Label).string = curCount;
        }

        if (this._renyi.active) {
            this._renyi.active = true;
            this._huAlert.active = true;
            this._btnTing.active = true;
            this._zcount.x = - 149;
            this._mjNode_P.width = 215;

        } else if (this._mjNode_P.childrenCount > 0) {
            this._renyi.active = false
            this._huAlert.active = true;
            this._btnTing.active = true;
            this._zcount.x = -(this._mjNode_P.childrenCount - 1) * 75 + (-149)
        }
        else {
            this._huAlert.active = false;
            this._renyi.active = false

        }

    },

    showTingAlert: function (data) {
        this.hideDir();
        if (data == null || data.length <= 0) {
            return;
        }
        this._btnTing.active = true;
        var k = 0;
        for (var i = 0; i < data.length; ++i) {
            for (var j = 0; j < this._myMJArr.length; ++j) {
                var sprite = this._myMJArr[j];
                var mjid = sprite.node.mjId;
                if (mjid == data[i].pai) {
                    // this.showHuAlert(mjid);
                    if (cc.fy.mahjongmgr.isBaidaPai(mjid)) {
                        sprite.node.getChildByName("dir").active = false;
                    } else {
                        sprite.node.getChildByName("dir").active = true;
                        k = j;
                    }
                }
            }
        }
        // if (k == 13) {
        var spriteTmp = this._myMJArr[k];
        // if (spriteTmp.node.y == 0) {
        //     spriteTmp.node.y = 20;
        // }
        // this._selectedMJ = spriteTmp.node;
        // this._clickedMJ = spriteTmp.node;
        this.showHuAlert(spriteTmp.node.mjId);
        // }
    },

    showHuAlert: function (mjid) {
        if (this._huData != null && this._huData.length > 0) {
            this._mjNode_P.removeAllChildren();
            var maxHupaiNum = this.node.getComponent("Ting").getCanCalcTingList();
            for (var i = 0; i < this._huData.length; ++i) {
                if (mjid == this._huData[i].pai) {
                    this._tingData = this._huData[i].hupai;
                    cc.fy.mahjongmgr.sortSZMJ(this._tingData);
                    if (this._huData[i].hupai.length >= maxHupaiNum) {
                        this._renyi.active = true;
                        this._mjNode.active = false;
                        this._zcount.getComponent(cc.Label).string = cc.fy.gameNetMgr.numOfMJ.toString();
                        //cc.fy.hintBox.show("您可以胡任意牌！");
                        break;
                    } else {
                        this._renyi.active = false;
                        cc.fy.mahjongmgr.sortSZMJ(this._huData[i].hupai);
                        let curCount = 0
                        for (var k = 0; k < this._huData[i].hupai.length; ++k) {
                            var mjspr = this.getViewItem(this._mjNode_P, this._mjNode, k);
                            var mjnum = mjspr.getChildByName("num").getComponent(cc.Label);
                            var num = this.getRemainderMJNum(this._huData[i].hupai[k]);
                            mjnum.string = num;
                            curCount += num;
                            var baidaMark = mjspr.getChildByName("baidaMark");
                            if (cc.fy.mahjongmgr.isBaida(this._huData[i].hupai[k])) {
                                baidaMark.active = true;
                                baidaMark.scaleX = 0.8
                                baidaMark.scaleY = 0.8
                            } else {
                                baidaMark.active = false;
                            }
                            mjspr.color = num > 0 ? new cc.Color(255, 255, 255) : new cc.Color(200, 200, 200);
                            var mj = mjspr.getComponent(cc.Sprite);
                            mj.spriteFrame = cc.fy.mahjongmgr.getSpriteFrameByMJID("M_", this._huData[i].hupai[k]);
                        }
                        this._zcount.getComponent(cc.Label).string = curCount;
                    }
                }
            }
            if (this._renyi.active) {
                this._renyi.active = true;
                this._huAlert.active = true;
                this._btnTing.active = true;
                this._zcount.x = - 149;
                this._mjNode_P.width = 215;
            } else if (this._mjNode_P.childrenCount > 0) {
                this._renyi.active = false;
                this._huAlert.active = true;
                this._btnTing.active = true
                this._zcount.x = -(this._mjNode_P.childrenCount - 1) * 75 - 149
            }
            else {
                this._renyi.active = false
                this._huAlert.active = false;
                this._btnTing.active = false;
            }
        }
    },

    showHuMJ: function () {
        //长按触发听牌提示
        this._huAlert.active = !this._huAlert.active;
    },
    refreshTingNum: function () {
        console.log(" refreshTingNum")
        if (this._tingData && this._tingData.length > 0) {
            cc.fy.mahjongmgr.sortSZMJ(this._tingData);
            this._mjNode_P.removeAllChildren();
            var maxHupaiNum = this.node.getComponent("Ting").getCanCalcTingList();
            if (this._tingData.length >= maxHupaiNum) {
                // var rmjspr = this.getViewItem(this._huAlert,this._renyi,1);
                // rmjspr.x = 38;
                // var curzcount = this.getViewItem1(this._huAlert,this._zcount,1);
                //curzcount.x = 55;
                this._renyi.active = true;
                this._mjNode.active = false
                this._zcount.getComponent(cc.Label).string = cc.fy.gameNetMgr.numOfMJ.toString();
            } else {
                this._renyi.active = false;
                let curCount = 0
                for (var k = 0; k < this._tingData.length; ++k) {
                    var mjspr = this.getViewItem(this._mjNode_P, this._mjNode, k);
                    var mjnum = mjspr.getChildByName("num").getComponent(cc.Label);
                    var num = this.getRemainderMJNum(this._tingData[k]);
                    mjnum.string = num;
                    curCount += num;
                    var baidaMark = mjspr.getChildByName("baidaMark");
                    if (cc.fy.mahjongmgr.isBaida(this._tingData[k])) {
                        baidaMark.active = true;
                        baidaMark.scaleX = 0.8
                        baidaMark.scaleY = 0.8
                    } else {
                        baidaMark.active = false;
                    }
                    mjspr.color = num > 0 ? new cc.Color(255, 255, 255) : new cc.Color(200, 200, 200);
                    var mj = mjspr.getComponent(cc.Sprite);
                    mj.spriteFrame = cc.fy.mahjongmgr.getSpriteFrameByMJID("M_", this._tingData[k]);
                }
                this._zcount.getComponent(cc.Label).string = curCount;
                //  var curzcount = this.getViewItem1(this._huAlert,this._zcount,1);
                //curzcount.x = 55;
            }
            if (this._renyi.active) {
                this._renyi.active = true;
                this._huAlert.active = true;
                this._btnTing.active = true;
                this._zcount.x = - 149;
                this._mjNode_P.width = 215;

            } else if (this._mjNode_P.childrenCount > 0) {
                this._renyi.active = false;
                this._zcount.x = -(this._mjNode_P.childrenCount - 1) * 75 - 149
            }
            else {
                this._renyi.active = false;
                this._huAlert.active = false;
            }
        }
    },

    getRemainderMJNum: function (mjid) {
        var num = 0;
        var seats = cc.fy.gameNetMgr.seats;
        for (var i = 0; i < seats.length; i++) {
            var fold = seats[i].folds;
            for (var j = 0; j < fold.length; j++) {
                if (fold[j] == mjid || (fold[j] - 1000) == mjid) {
                    num++;
                }
            }
        }
        for (var i = 0; i < seats.length; i++) {
            if (i == cc.fy.gameNetMgr.seatIndex) {
                var hold = seats[i].holds;
                for (var j = 0; j < hold.length; j++) {
                    if (hold[j] == mjid) {
                        num++;
                    }
                }
            }
        }

        // for (var i = 0; i < seats.length; i++) {
        //     var chipais = seats[i].chipais;
        //     for (var j = 0; j < chipais.length; j++) {
        //         var chipai = chipais[j];
        //         for (var k = 0; k < chipai.length; k++) {
        //             if (chipai[k] == mjid) {
        //                 num++;
        //             }
        //         }
        //     }
        // }

        for (var i = 0; i < seats.length; i++) {
            var pengs = seats[i].pengs;
            for (var j = 0; j < pengs.length; j++) {
                var peng = pengs[j];
                if (peng == mjid) {
                    num += 3;
                }
            }
        }

        for (var i = 0; i < seats.length; i++) {
            var diangangs = seats[i].diangangs;
            for (var j = 0; j < diangangs.length; j++) {
                var diangang = diangangs[j];
                if (diangang == mjid) {
                    num += 4;
                }
            }
        }

        for (var i = 0; i < seats.length; i++) {
            var wangangs = seats[i].wangangs;
            for (var j = 0; j < wangangs.length; j++) {
                var wangang = wangangs[j];
                if (wangang == mjid) {
                    num += 4;
                }
            }
        }

        for (var i = 0; i < seats.length; i++) {
            var angangs = seats[i].angangs;
            for (var j = 0; j < angangs.length; j++) {
                var angang = angangs[j];
                if (angang == mjid) {
                    num += 4;
                }
            }
        }
        return 4 - num;
    },
    getViewItem: function (content, item, index) {
        var node = cc.instantiate(item);
        // node.x = 120 * index + 20;
        node.active = true;
        content.addChild(node);
        return node;
    },

    initHupai: function (localIndex, pai) {
        if (cc.fy.gameNetMgr.conf.type == "xlch") {
            var hupailist = this._hupaiLists[localIndex];
            for (var i = 0; i < hupailist.children.length; ++i) {
                var hupainode = hupailist.children[i];
                if (hupainode.active == false) {
                    var pre = cc.fy.mahjongmgr.getFoldPre(localIndex);

                    hupainode.getComponent(cc.Sprite).spriteFrame = cc.fy.mahjongmgr.getSpriteFrameByMJID(pre, pai);
                    hupainode.active = true;
                    break;
                }
            }
        }
    },

    playGameAni: function (index, name, gameover) {
        var aniNode = this._playEfxs[index];
        aniNode.node.active = true;
        if (name == '碰' || name == '杠' || name == '吃') {
            aniNode.node.getChildByName("aniBg").active = false;
        } else {
            aniNode.node.getChildByName("aniBg").active = true;
        }
        aniNode.setAnimation(0, name, false);
        var self = this;
        aniNode.setCompleteListener(function () {
            aniNode.node.active = false;
        }, this, null);
        if (name == '胡' || name == '自摸' || name == '一炮多响') {
            this.scheduleOnce(function () {
                this.playGameHuTypeAni(index, name, gameover);
            }, 1.2);
        }
    },
    playGameHuTypeAni: function (index, name, gameover) {
        var isAllNull = true;
        for (var i = 0; i < this._huType.length; i++) {
            var localIndex = cc.fy.gameNetMgr.getLocalIndex(i);
            if (index == localIndex && this._huType[i] != null) {
                isAllNull = false;
                this.playGameAni(localIndex, this._huType[i], true);
            }
        }
    },
    game_over: function () {
        console.log("game_over");
        this.gameRoot.active = false;
        this.prepareRoot.active = true;
        // } 
        this._tingData = null;
        this._huData = null;
        this._btnTing.active = false;
        this._huAlert.active = false;
        this.setAutoChupaiTipActive(false);
        this._qihu.active = false;
        this._huType = [null, null, null, null];
        this._options.active = false;
        this.hideBaida();
        cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWGAMEVIEW_MJPEIZHI_CTC, { isShow: false });
        cc.fy.gameNetMgr.dispatchEvent("game_over_show");
    },
    // playEfx: function (index, name) {
    //     this._playEfxs[index].node.active = true;
    //     this._playEfxs[index].play(name);
    // },
    // playEfxNew: function (index, efxsList, name) {
    //     efxsList[index].node.active = true;
    //     efxsList[index].play(name);
    // },
    onGameBeign: function () {
        for (var i = 0; i < this._playEfxs.length; ++i) {
            this._playEfxs[i].node.active = false;
        }
        for (var i = 0; i < this._hupaiLists.length; ++i) {
            for (var j = 0; j < this._hupaiLists[i].childrenCount; ++j) {
                this._hupaiLists[i].children[j].active = false;
            }
        }
        for (var i = 0; i < cc.fy.gameNetMgr.seats.length; ++i) {
            var seatData = cc.fy.gameNetMgr.seats[i];
            var localIndex = cc.fy.gameNetMgr.getLocalIndex(i);
            var hupai = this._hupaiTips[localIndex];
            hupai.active = seatData.hued;
            if (seatData.hued) {
                hupai.getChildByName("sprHu").active = seatData.iszimo;
                hupai.getChildByName("sprZimo").active = false;
            }

            if (seatData.huinfo) {
                for (var j = 0; j < seatData.huinfo.length; ++j) {
                    var info = seatData.huinfo[j];
                    if (info.ishupai) {
                        this.initHupai(localIndex, info.pai);
                    }
                }
            }


            // for (var i = 0; i < cc.fy.gameNetMgr.seats.length; ++i) {
            // var userId = cc.fy.gameNetMgr.seats[i].userid;
            // if (cc.fy.gameNetMgr.seats[i].flowers && cc.fy.gameNetMgr.seats[i].flowers.length > 0) {
            //     console.log("补花动画 begin");
            //     cc.fy.gameNetMgr.dispatchEvent("play_buhua_Ani", userId);
            // }
            // }
        }

        this.hideChupai("onGameBeign");
        this.hideOptions();
        var sides = [];
        // if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.ERMJ) {
        //     sides = ["up"];
        // } else {
        if (this._gamePlayer == 2) {
            sides = ["up"];
        } else if (this._gamePlayer == 3) {
            sides = ["right", "left"];
        } else {
            sides = ["right", "up", "left"];
        }
        // } 
        var gameChild = this.node.getChildByName("game");
        for (var i = 0; i < sides.length; ++i) {
            var sideChild = gameChild.getChildByName(sides[i]);
            var holds = sideChild.getChildByName("holds");
            for (var j = 0; j < holds.childrenCount; ++j) {
                var nc = holds.children[j];
                nc.active = true;
                nc.scaleX = 1.0;
                nc.scaleY = 1.0;
                var sprite = nc.getComponent(cc.Sprite);
                // if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.ERMJ) {
                //     sprite.spriteFrame = cc.fy.mahjongmgr.holdsEmpty[i + 2];
                // }
                // else {
                // sprite.spriteFrame = cc.fy.mahjongmgr.holdsEmpty[i + 1];

                sprite.spriteFrame = cc.fy.mahjongmgr.getHoldsEmptySpriteFrame(sides[i]);

                // }

            }
        }
        if (cc.fy.gameNetMgr.gamestate == "" && cc.fy.replayMgr.isReplay() == false) {
            return;
        }

        this.gameRoot.active = true;
        this.prepareRoot.active = false;

        this.initMahjongs();
        var seats = cc.fy.gameNetMgr.seats;
        for (var i in seats) {
            var seatData = seats[i];
            var localIndex = cc.fy.gameNetMgr.getLocalIndex(i);
            if (localIndex != 0) {
                this.initOtherMahjongs(seatData);
                if (i == cc.fy.gameNetMgr.turn) {
                    this.initMopai(i, -1);
                }
                else {
                    this.initMopai(i, null);
                }
            }
        }
        // this.showChupai();
        if (cc.fy.gameNetMgr.curaction != null) {
            this.showAction(cc.fy.gameNetMgr.curaction);
            // cc.fy.gameNetMgr.curaction = null;
        }
        this._tingState = false;

    },

    // 收到开始飘花消息
    onPiaohua: function (data) {
        console.log("onPiaohua show piaohua");
        this.setPiaohuaActive(true);

    },
    // 飘花返回
    onPiaohuaNotify: function (data) {
        var userid = cc.fy.userMgr.userId;
        var si = data.si;
        if (userid == si && data.piao >= 0) // 自己飘花
        {
            this.setPiaohuaActive(false);
        }
    },
    // 飘花结果
    onPiaoResult: function () {
        var list = cc.fy.gameNetMgr.piaohuaData;
        if (list != null) {
            console.log("onPiaoResult list != null ");
            var length = list.length;
            for (var i = 0; i < length; i++) {
                // console.log("onPiaoResult id = " + list[i].si + " piao = " + list[i].piao);
            }
        }
        else {
            console.log("error onPiaoResult cc.fy.gameNetMgr.piaohuaData == null");
        }
    },

    // 收到开始拉庄消息
    onLazhuang: function (data) {
        console.log('onLazhuang show lazhuang');
        this.setLazhuangActive(true);
    },

    // 拉庄结果
    onLazhuangResult: function (data) {
        console.log('onLazhuangResult');
        var useid = cc.fy.userMgr.userId;
        var uid = data.userid;
        if (useid == uid) {
            this.setLazhuangActive(false);
        }
    },

    // 收到开始顶庄消息
    onDingzhuang: function (data) {
        console.log('onDingzhuang show dingzhuang');
        this.setDingzhuangActive(true);
    },

    // 顶庄结果
    onDingzhuangResult: function (data) {
        console.log('onDingzhuangResult');
        var useid = cc.fy.userMgr.userId;
        var uid = data.userid;
        if (useid == uid) {
            this.setDingzhuangActive(false);
        }
    },

    //掷骰子结果
    onZhishaizi: function (data) {
        this._zhishaizi.playZ(data);
    },

    showTask: function (data) {
        if (data) {
            var index = data.index;
            var pai = data.pai;
            var double = data.double;
            var state = data.state;
            var task = this.node.getChildByName("ermj").getChildByName("task");
            task.active = true;
            // if(!task.active){
            //     task.active = true;
            // }
            var lbltask = task.getChildByName("taskinfo").getComponent(cc.Label);
            if (index == 0) {
                lbltask.string = "暗杠";
            }
            else if (index == 1) {
                lbltask.string = "明杠";
            }
            else if (index == 2) {
                lbltask.string = "碰";
            }
            else if (index == 3) {
                lbltask.string = "吃";
            }
            var mj = task.getChildByName("mj").getComponent(cc.Sprite);
            mj.spriteFrame = cc.fy.mahjongmgr.getSpriteFrameByMJID("M_", pai);

            var doubleinfo = task.getChildByName("doubleinfo").getComponent(cc.Label);
            doubleinfo.string = "分数×" + double;

            var title = task.getChildByName("title").getComponent(cc.Label);
            if (state == 2) {
                title.string = "已完成";
            }
            else {
                title.string = "任务";
            }
        }
        else {
            var task = this.node.getChildByName("ermj").getChildByName("task");
            task.active = false;
        }
    },

    onMJClicked: function (event) {
        if (cc.fy.replayMgr.isReplay()) {
            return;
        }
        cc.fy.audioMgr.playSFX("click_return.mp3");
        cc.fy.gameNetMgr.dispatchEvent("game_hidesamefolds");

        //如果不是自己的轮子，则忽略
        if (cc.fy.gameNetMgr.turn != cc.fy.gameNetMgr.seatIndex || cc.fy.gameNetMgr.isClickChupai) {
            console.log("not your turn." + cc.fy.gameNetMgr.turn);
            for (var i = 0; i < this._myMJArr.length; ++i) {
                this._myMJArr[i].node.y = 0;
            }
            event.target.y = 20;
            cc.fy.gameNetMgr.dispatchEvent("game_showsamefolds", event.target.mjId);
            return;
        }
        console.log("onMJClicked");

        for (var i = 0; i < this._myMJArr.length; ++i) {
            if (event.target == this._myMJArr[i].node) {
                if (this._touchMJ != null) {
                    this._touchMJ.active = false;
                    // this._touchMJ.removeFromParent();
                    // this._touchMJ = null;
                }
                var button = event.target.getComponent(cc.Button);
                if (button && button.interactable == false) {
                    return;
                }
                if (this._clickedMJ != null && this._clickedMJ == event.target) {
                    this.shoot(this._clickedMJ.mjId);
                    if (this._huData && this._huData.length > 0) {
                        var canting = false;
                        for (var i = 0; i < this._huData.length; i++) {
                            var mjid = this._huData[i].pai;
                            if (mjid == this._clickedMJ.mjId) {
                                canting = true;
                                break;
                            }
                        }
                        if (canting) {
                            this.showHuAlert(this._clickedMJ.mjId);
                        }
                        else {
                            this._btnTing.active = false;
                            this._huAlert.active = false;
                        }
                    }
                    else {
                        this._btnTing.active = false;
                        this._huAlert.active = false;
                    }
                    this.hideDir();
                    this._clickedMJ = null;
                    this._selectedMJ = null;
                    this._huAlert.active = false;
                    return;
                }
                else {
                    this.showHuAlert(event.target.mjId);
                    this._clickedMJ = event.target;
                }
                if (event.target.y == 0) {
                    event.target.y = 20;
                }
                cc.fy.gameNetMgr.dispatchEvent("game_showsamefolds", event.target.mjId);
            } else {
                this._myMJArr[i].node.y = 0;
            }
        }
    },

    onMJTouchCancel: function (event) {
        if (cc.fy.replayMgr.isReplay()) {
            return;
        }

        if (cc.fy.gameNetMgr.turn != cc.fy.gameNetMgr.seatIndex || cc.fy.gameNetMgr.isClickChupai) {
            if (this._selectedMJ != null && event.target == this._selectedMJ) {
                this._selectedMJ.y = 0;
                this._selectedMJ = null;
            }
            return;
        }

        for (var i = 0; i < this._myMJArr.length; ++i) {
            if (event.target == this._myMJArr[i].node) {
                if (this._touchMJ != null) {
                    this._touchMJ.active = false;
                    // this._touchMJ.removeFromParent();
                    // this._touchMJ = null;
                }
                var button = event.target.getComponent(cc.Button);
                if (button && button.interactable == false) {
                    return;
                }
                var lo = event.getLocation();
                var locallo = event.target.convertToNodeSpaceAR(lo);
                //如果是再次点击，则出牌
                if (event.target == this._selectedMJ) {
                    if (locallo.y - this._touchStart.y < -30) {
                        this._selectedMJ.y = 0;
                        this._selectedMJ = null;
                        this._clickedMJ = null;
                        this.showHuAlert(this._selectedMJ.mjId);
                        cc.fy.gameNetMgr.dispatchEvent("game_hidesamefolds");
                    } else {
                        this.shoot(this._selectedMJ.mjId);
                        if (this._huData && this._huData.length > 0) {
                            var canting = false;
                            for (var i = 0; i < this._huData.length; i++) {
                                var mjid = this._huData[i].pai;
                                if (mjid == this._selectedMJ.mjId) {
                                    canting = true;
                                    break;
                                }
                            }
                            if (canting) {
                                this.showHuAlert(this._selectedMJ.mjId);
                            }
                            else {
                                this._btnTing.active = false;
                                this._huAlert.active = false;
                            }
                        }
                        else {
                            this._btnTing.active = false;
                            this._huAlert.active = false;
                        }
                        this.hideDir();
                        this._selectedMJ = null;
                        this._clickedMJ = null;
                        cc.fy.gameNetMgr.dispatchEvent("game_hidesamefolds");
                    }
                }
                return;
            }
        }
    },

    onMJTouchMove: function (event) {
        if (cc.fy.replayMgr.isReplay()) {
            return;
        }

        //如果不是自己的轮子，则忽略
        if (cc.fy.gameNetMgr.turn != cc.fy.gameNetMgr.seatIndex || cc.fy.gameNetMgr.isClickChupai) {
            if (this._selectedMJ != null && event.target == this._selectedMJ) {
                this._selectedMJ.y = 0;
                this._selectedMJ = null;
            }
            return;
        }
        for (var i = 0; i < this._myMJArr.length; ++i) {
            if (event.target == this._myMJArr[i].node) {
                var button = event.target.getComponent(cc.Button);
                if (button && button.interactable == false) {
                    return;
                }
                var lo = event.getLocation();
                var locallo = this.node.convertToNodeSpaceAR(lo);
                var mjlo = event.target.convertToNodeSpaceAR(lo);
                if (Math.abs(this._touchStart.y - mjlo.y) > 5 || Math.abs(this._touchStart.x - mjlo.x) > 5) {
                    if (this._touchMJ == null) {
                        this._touchMJ = cc.instantiate(event.target);
                        this.node.addChild(this._touchMJ);
                        this._touchMJ.opacity = 100;
                        // this._touchMJ.active = true;
                    }
                    this._touchMJ.x = locallo.x - this._touchOffset.x;
                    this._touchMJ.y = locallo.y - this._touchOffset.y;
                    this._touchMJ.active = true;
                    this._touchMJ.getComponent(cc.Sprite).spriteFrame = event.target.getComponent(cc.Sprite).spriteFrame
                    // button.interactable = false;s
                }
                return;
            }
        }
    },

    onMJTouch: function (event) {
        if (cc.fy.replayMgr.isReplay()) {
            return;
        }

        //如果不是自己的轮子，则忽略
        if (cc.fy.gameNetMgr.turn != cc.fy.gameNetMgr.seatIndex || cc.fy.gameNetMgr.isClickChupai) {
            if (this._selectedMJ != null && event.target == this._selectedMJ) {
                this._selectedMJ.y = 0;
                this._selectedMJ = null;
            }
            return;
        }

        for (var i = 0; i < this._myMJArr.length; ++i) {
            if (event.target == this._myMJArr[i].node) {
                var button = event.target.getComponent(cc.Button);
                if (button && button.interactable == false) {
                    return;
                }
                var lo = event.getLocation();
                var locallo = event.target.parent.convertToNodeSpaceAR(lo);
                this._touchOffset = cc.v2(locallo.x - event.target.x, locallo.y - event.target.y);
                this._touchStart = event.target.convertToNodeSpaceAR(lo);
                this._selectedMJ = event.target;
                cc.fy.gameNetMgr.dispatchEvent("game_showsamefolds", event.target.mjId);
            } else {
                this._myMJArr[i].node.y = 0;
            }
        }
    },

    onMJBlankClick: function (event) {
        if (event.target.name == "mjBlank" && this._clickedMJ != null &&
            event.target.parent == this._clickedMJ && this._clickedMJ.y != 0) {
            this.shoot(this._clickedMJ.mjId);
        }
        else {
            for (var i = 0; i < this._myMJArr.length; ++i) {
                this._myMJArr[i].node.y = 0;
            }
        }
        cc.fy.gameNetMgr.dispatchEvent("game_hidesamefolds");
        this._selectedMJ = null;
        this._clickedMJ = null;
        if (this._touchMJ != null) {
            this._touchMJ.active = false;
            // this._touchMJ.removeFromParent();
            // this._touchMJ = null;
        }
    },
    //出牌
    shoot: function (mjId) {
        this.hideOptions();
        if (mjId == null) {
            return;
        }
        if (this._qihuState) {
            this._qihu.active = false;
            this._qihuState = false;
        }
        if (cc.fy.gameNetMgr.isClickChupai == false) {
            cc.fy.net.send('chupai', mjId);

            cc.fy.gameNetMgr.dispatchEvent("game_ai_chupai", mjId);
        }
    },

    getMJIndex: function (side, index) {
        if (side == "right" || side == "up") {
            return 13 - index;
        }
        return index;
    },

    initMopai: function (seatIndex, pai) {
        console.log("initMopai seatIndex", seatIndex);

        var localIndex = cc.fy.gameNetMgr.getLocalIndex(seatIndex);
        var side = cc.fy.mahjongmgr.getSide(localIndex);
        var pre = cc.fy.mahjongmgr.getFoldPre(localIndex);
        var gameChild = this.node.getChildByName("game");
        var sideChild = gameChild.getChildByName(side);
        var holds = sideChild.getChildByName("holds");
        var lastIndex = this.getMJIndex(side, 13);
        console.log("initMopai lastIndex", lastIndex);
        var nc = holds.children[lastIndex];
        nc.scaleX = 1.0;
        nc.scaleY = 1.0;
        if (pai == null) {
            nc.active = false;
        } else if (pai >= 0) {
            nc.active = true;
            if (side == "up") {
                nc.scaleX = 0.65;
                nc.scaleY = 0.65;
            }
            else if (side == "left" || side == "right") {
                nc.scale = 0.9;
            }
            var sprite = nc.getComponent(cc.Sprite);
            sprite.spriteFrame = cc.fy.mahjongmgr.getSpriteFrameByMJID(pre, pai);
        } else if (pai != null) {
            nc.active = true;
            if (side == "up") {
                nc.scaleX = 1.0;
                nc.scaleY = 1.0;
            }
            var sprite = nc.getComponent(cc.Sprite);
            sprite.spriteFrame = cc.fy.mahjongmgr.getHoldsEmptySpriteFrame(side);
        }
    },

    initEmptySprites: function (seatIndex) {
        var localIndex = cc.fy.gameNetMgr.getLocalIndex(seatIndex);
        var side = cc.fy.mahjongmgr.getSide(localIndex);
        var pre = cc.fy.mahjongmgr.getFoldPre(localIndex);
        var gameChild = this.node.getChildByName("game");
        var sideChild = gameChild.getChildByName(side);
        var holds = sideChild.getChildByName("holds");
        var spriteFrame = cc.fy.mahjongmgr.getEmptySpriteFrame(side);
        for (var i = 0; i < holds.childrenCount; ++i) {
            var nc = holds.children[i];
            nc.scaleX = 1.0;
            nc.scaleY = 1.0;
            var sprite = nc.getComponent(cc.Sprite);
            sprite.spriteFrame = spriteFrame;
        }
    },
    initOtherMahjongs: function (seatData) {
        console.log("initOtherMahjongs : seatData", seatData);

        var localIndex = this.getLocalIndex(seatData.seatindex);
        if (localIndex == 0) {
            return;
        }
        var side = cc.fy.mahjongmgr.getSide(localIndex);
        var game = this.node.getChildByName("game");
        var sideRoot = game.getChildByName(side);
        var sideHolds = sideRoot.getChildByName("holds");
        var getLength = function (arr) {
            if (arr == null) {
                return 0;
            }
            return arr.length;
        }
        var num = getLength(seatData.pengs) + getLength(seatData.angangs) + getLength(seatData.diangangs)
            + getLength(seatData.wangangs) + getLength(seatData.chipais) / 3;
        num *= 3;
        console.log("initOtherMahjongs : num", num);

        for (var i = 0; i < num; ++i) {
            var idx = this.getMJIndex(side, i);
            sideHolds.children[idx].active = false;
        }
        var pre = cc.fy.mahjongmgr.getFoldPre(localIndex);
        var holds = this.sortHolds(seatData);
        if (holds != null && holds.length > 0) {
            for (var i = 0; i < holds.length; ++i) {
                var idx = this.getMJIndex(side, i + num);
                if (idx > sideHolds.children.length - 1 || idx < 0) {
                    break;
                }

                var sprite = sideHolds.children[idx].getComponent(cc.Sprite);

                if (side == "up") {
                    sprite.node.scaleX = 0.65;
                    sprite.node.scaleY = 0.65;
                }
                sprite.node.active = true;
                sprite.spriteFrame = cc.fy.mahjongmgr.getSpriteFrameByMJID(pre, holds[i]);
                if (pre != "M_" && pre != "B_") {
                    sprite.node.scale = 0.9;
                }
                if (cc.fy.mahjongmgr.isBaida(holds[i])) {
                    // console.log(i +  " holds[i]  = " + holds[i] + " side = " + side + " idx = " + idx);
                    // if(holds[i] == 25){
                    var mark = sideHolds.children[idx].getChildByName("baidaMark");
                    if (mark != null) {
                        mark.active = true;

                        if (side == "up") {
                            mark.scaleX = 0.5
                            mark.scaleY = 0.5
                            mark.rotation = 0;
                            mark.x = -20;
                            mark.y = 35;
                        }
                        else if (side == "left") {
                            mark.x = 10;
                            mark.y = 15;
                            mark.setScale(0.5);
                            mark.rotation = 90;
                        }
                        else if (side == "right") {
                            // mark.scaleX = 0.5
                            // mark.scaleY = 0.6
                            mark.setScale(0.5);
                            mark.rotation = 270;
                            mark.x = -12;
                            mark.y = 6;;
                        }
                    }
                    else {
                        this.loadMark(sideHolds.children[idx], side);
                    }
                }
                else {
                    var mark = sideHolds.children[idx].getChildByName("baidaMark");
                    if (mark != null) {
                        mark.active = false;
                    }
                }
            }
            if (holds.length + num == 13) {
                var lasetIdx = this.getMJIndex(side, 13);
                sideHolds.children[lasetIdx].active = false;
            }
        }
    },
    loadMark: function (snode, side) {
        cc.loader.loadRes("prefabs/baidaMark", function (err, prefab) {
            var mark = cc.instantiate(prefab);
            snode.addChild(mark);
            if (side == "up") {
                mark.scaleX = 0.5
                mark.scaleY = 0.5
                mark.rotation = 0;
                mark.x = 10;
                mark.y = 15;
            }
            else if (side == "left") {
                mark.x = 10;
                mark.y = 15;
                mark.setScale(0.5);
                mark.rotation = 90;
            }
            else if (side == "right") {
                mark.setScale(0.5);
                mark.rotation = 270;
                mark.x = -14;
                mark.y = 5;;
            }

        });
    },
    sortHolds: function (seatData) {
        var holds = seatData.holds;
        if (holds == null) {
            return null;
        }
        //如果手上的牌的数目是2,5,8,11,14，表示最后一张牌是刚摸到的牌
        var mopai = null;
        var l = holds.length
        console.log("initMahjongs  l === ", l);

        if (l == 2 || l == 5 || l == 8 || l == 11 || l == 14) {
            mopai = holds.pop();
        }
        // if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZCT) {
        //     cc.fy.mahjongmgr.sortBaiDaMJ(holds);
        // }
        // else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.HZEMJ) {
        //     cc.fy.mahjongmgr.sortHZMJ(holds);
        // }
        // else {
        cc.fy.mahjongmgr.sortSZMJ(holds);
        // }
        //将摸牌添加到最后
        if (mopai != null) {
            holds.push(mopai);
        }
        // this.showKuangArr();
        return holds;
    },
    initMahjongs: function () {
        console.log("initMahjongs");
        var seats = cc.fy.gameNetMgr.seats;
        var seatData = seats[cc.fy.gameNetMgr.seatIndex];
        var holds = this.sortHolds(seatData);
        if (holds == null || seatData.pengs == null || seatData.angangs == null ||
            seatData.diangangs == null || seatData.wangangs == null || seatData.chipais == null) {
            return;
        }
        //初始化手牌
        var lackingNum = (seatData.pengs.length + seatData.angangs.length + seatData.diangangs.length
            + seatData.wangangs.length) * 3 + seatData.chipais.length;
        var gameChild = this.node.getChildByName("game");
        var myselfChild = gameChild.getChildByName("myself");
        // var myholds = myselfChild.getChildByName("holds");
        // console.log("lackingNum", lackingNum);
        // console.log("holds.length", holds.length);
        // console.log("pengs.length", seatData.pengs.length);
        // console.log("angangs.length", seatData.angangs.length);
        // console.log("diangangs.length", seatData.diangangs.length);
        // console.log("wangangs.length", seatData.wangangs.length);
        for (var i = 0; i < this._myMJArr.length; ++i) {
            var sprite = this._myMJArr[i];
            var baidaMark = sprite.node.getChildByName("baidaMark");
            baidaMark.active = false;
        }
        for (var i = 0; i < holds.length; ++i) {
            var mjid = holds[i];
            if (i + lackingNum >= this._myMJArr.length) { continue; }
            var sprite = this._myMJArr[i + lackingNum];
            sprite.node.mjId = mjid;
            sprite.node.y = 0;
            this.setSpriteFrameByMJID("M_", sprite, mjid);
            var button = sprite.node.getComponent(cc.Button);
            if (button) {
                button.interactable = false;
            }
        }
        for (var i = 0; i < lackingNum; ++i) {
            var sprite = this._myMJArr[i];
            sprite.node.mjId = null;
            sprite.spriteFrame = null;
            var button = sprite.node.getComponent(cc.Button);
            if (button) {
                button.interactable = false;
            }
            sprite.node.active = false;
        }
        for (var i = lackingNum + holds.length; i < this._myMJArr.length; ++i) {
            var sprite = this._myMJArr[i];
            sprite.node.mjId = null;
            sprite.spriteFrame = null;
            var button = sprite.node.getComponent(cc.Button);
            // console.log("lackingNum [" + i + "] interactable", button.interactable);
            if (button) {
                button.interactable = false;
            }
            sprite.node.active = false;

        }
        if (seatData.tingState == 1) {
            for (var i = 0; i < this._myMJArr.length; ++i) {
                var sprite = this._myMJArr[i];
                sprite.node.color = new cc.Color(255, 255, 255);
                var button = sprite.node.getComponent(cc.Button);
                if (button) {
                    button.interactable = false;
                }
            }
            for (var j = lackingNum; j < this._myMJArr.length; ++j) {
                for (var k = 0; k < seatData.jiating.length; ++k) {
                    var sprMJ = this._myMJArr[j];
                    if (sprMJ.node.mjId == seatData.jiating[k]) {
                        sprMJ.node.color = new cc.Color(255, 255, 255);
                        var button = sprMJ.node.getComponent(cc.Button);
                        if (button) {
                            button.interactable = true;
                        }
                        continue;
                    }
                }
            }
        } else if (seatData.tingState == 2) {
            for (var i = 0; i < this._myMJArr.length; ++i) {
                var sprite = this._myMJArr[i];
                sprite.node.color = new cc.Color(155, 155, 155);
                var button = sprite.node.getComponent(cc.Button);
                if (button) {
                    button.interactable = false;
                }
            }
        }
        else {
            if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZCT) {
                for (var i = 0; i < this._myMJArr.length; ++i) {
                    var sprite = this._myMJArr[i];
                    // var baidaMark = sprite.node.getChildByName("baidaMark");
                    // baidaMark.active = false;
                    var _sprite = this._myMJArr[this._myMJArr.length - 1];
                    if (_sprite.node.active == true && _sprite.node.mjId != null && _sprite.node.mjId >= 43) {
                        var button = sprite.node.getComponent(cc.Button);
                        if (i < this._myMJArr.length - 1) {
                            if (button) {
                                button.interactable = false;
                                sprite.node.color = new cc.Color(155, 155, 155);
                            }
                        } else {
                            if (button) {
                                button.interactable = true;
                                sprite.node.color = new cc.Color(255, 255, 255);
                                // setTimeout(function () { 
                                //     cc.fy.net.send('chupai', _sprite.node.mjId);
                                // }, 500)
                            }
                        }
                    } else {
                        var button = sprite.node.getComponent(cc.Button);
                        if (button) {
                            button.interactable = true;
                            sprite.node.color = new cc.Color(255, 255, 255);
                            // sprMJ.node.color = new cc.Color(255, 255, 255);
                        }
                    }
                }
            } else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZBD) {
                for (var i = 0; i < this._myMJArr.length; ++i) {
                    var sprite = this._myMJArr[i];
                    // var baidaMark = sprite.node.getChildByName("baidaMark");
                    // baidaMark.active = false;
                    var _sprite = this._myMJArr[this._myMJArr.length - 1];
                    if (_sprite.node.active == true && _sprite.node.mjId != null && _sprite.node.mjId >= 43 && _sprite.node.mjId != 52) {
                        var button = sprite.node.getComponent(cc.Button);
                        if (i < this._myMJArr.length - 1) {
                            if (button) {
                                button.interactable = false;
                                sprite.node.color = new cc.Color(155, 155, 155);
                            }
                        } else {
                            if (button) {
                                button.interactable = true;
                                sprite.node.color = new cc.Color(255, 255, 255);
                                // setTimeout(function () { 
                                //     cc.fy.net.send('chupai', _sprite.node.mjId);
                                // }, 500)
                            }
                        }
                    } else {
                        if (sprite.node.mjId != null && sprite.node.mjId == 52) {
                            sprite.node.color = new cc.Color(155, 155, 155);
                            var button = sprite.node.getComponent(cc.Button);
                            if (button) {
                                button.interactable = false;
                            }
                        } else {
                            sprite.node.color = new cc.Color(255, 255, 255);
                            var button = sprite.node.getComponent(cc.Button);
                            if (button) {
                                button.interactable = true;
                            }
                        }

                    }
                }
            } else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZHD || cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZWJ) {
                var baida = cc.fy.gameNetMgr.baida;
                if (baida != null && baida != -1) {
                    for (var i = 0; i < this._myMJArr.length; ++i) {
                        var sprite = this._myMJArr[i];
                        sprite.node.color = new cc.Color(255, 255, 255);
                        var button = sprite.node.getComponent(cc.Button);
                        if (button) {
                            button.interactable = true;
                        }
                    }
                    for (var j = lackingNum; j < this._myMJArr.length; ++j) {
                        var sprMJ = this._myMJArr[j];
                        var baidaMark = sprMJ.node.getChildByName("baidaMark");
                        baidaMark.active = false;
                        if (cc.fy.mahjongmgr.isBaida(sprMJ.node.mjId)) {
                            baidaMark.active = true;
                            baidaMark.scaleX = 0.8
                            baidaMark.scaleY = 0.8
                            var button = sprMJ.node.getComponent(cc.Button);
                            if (button) {
                                button.enableAutoGrayEffect = false;
                                if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZWJ) {
                                    button.interactable = true;
                                } else {
                                    button.interactable = false;
                                }
                                button.disabledColor = new cc.Color(255, 255, 255);
                            }
                        }
                    }
                }
            }
            else {
                for (var i = 0; i < this._myMJArr.length; ++i) {
                    var sprite = this._myMJArr[i];
                    var baidaMark = sprite.node.getChildByName("baidaMark");
                    baidaMark.active = false;
                    sprite.node.color = new cc.Color(255, 255, 255);
                    var button = sprite.node.getComponent(cc.Button);
                    if (button) {
                        button.interactable = true;
                    }
                }
            }

        }
        // var l = holds.length;
        // if (l == 2 || l == 5 || l == 8 || l == 11 || l == 14) { 
        //     var sprite = this._myMJArr[this._myMJArr.length - 1];
        //     if (sprite.node.y == 0) {
        //         sprite.node.y = 20;
        //     }
        //     this._selectedMJ = sprite.node;
        //     this._clickedMJ = sprite.node;
        // } else {
        this._selectedMJ = null;
        this._clickedMJ = null;
        // } 
        if (this._touchMJ != null) {
            this._touchMJ.active = false;
        }
        cc.fy.gameNetMgr.dispatchEvent("initmahjongs");
    },

    setSpriteFrameByMJID: function (pre, sprite, mjid) {
        sprite.spriteFrame = cc.fy.mahjongmgr.getSpriteFrameByMJID(pre, mjid);
        sprite.node.active = true;
    },

    getLocalIndex: function (index) {
        var ret = 0;
        // if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.ERMJ) {
        //     ret = (index - cc.fy.gameNetMgr.seatIndex + 2) % 2;
        // }
        // else
        // if (cc.isMJ(cc.fy.gameNetMgr.conf.type)) {
        if (this._gamePlayer == 3) {
            ret = (index - cc.fy.gameNetMgr.seatIndex + 3) % 3;
        }
        else if (this._gamePlayer == 2) {
            ret = (index - cc.fy.gameNetMgr.seatIndex + 2) % 2;
        }
        else {
            ret = (index - cc.fy.gameNetMgr.seatIndex + 4) % 4;
        }
        // }
        // else {
        //     ret = (index - cc.fy.gameNetMgr.seatIndex + 4) % 4;
        // }
        return ret;
    },

    onOptionClicked: function (event) {
        var self = this;

        var seats = cc.fy.gameNetMgr.seats;
        var seatData = seats[cc.fy.gameNetMgr.seatIndex];
        if (event.target.name == "btnPeng") {
            this._chiData = null;
            if (seatData != null && seatData.tingState != 0) {
                // cc.fy.net.send("guo");
                this.hideOptions();
            }
            cc.fy.net.send("peng", { "pai": event.target.pai, "actionid": cc.fy.gameNetMgr._actionid });
            this.hideOptions();
        }
        else if (event.target.name == "btnGang") {
            this._chiData = null;
            if (seatData != null && seatData.tingState != 0) {
                // cc.fy.net.send("guo");
                this.hideOptions();
            }
            cc.fy.net.send("gang", { "pai": event.target.pai, "actionid": cc.fy.gameNetMgr._actionid });
            this.hideOptions();
        }
        else if (event.target.name == "btnHu") {
            this._chiData = null;
            cc._isRefreshTingData = false;
            cc.fy.net.send("hu", { "pai": event.target.pai, "actionid": cc.fy.gameNetMgr._actionid });
            this.hideOptions();
        }
        else if (event.target.name == "btnZimo") {
            this._chiData = null;
            cc.fy.net.send("hu", { "pai": event.target.pai, "actionid": cc.fy.gameNetMgr._actionid });
            this.hideOptions();
        }
        else if (event.target.name == "btnGuo") {
            if (cc.fy.gameNetMgr.curaction && cc.fy.gameNetMgr.curaction.hu) {
                cc.fy.alert.show("是否确定弃？？？", function () {
                    // if (self._qihuState && !self._labAutoChupaiTip.active) {
                    //     self._qihu.active = true;
                    // }
                    self._chiData = null;
                    cc.fy.net.send("guo", cc.fy.gameNetMgr.curaction.actionId);
                    self.hideOptions();
                }, true);
            } else {
                if (this._qihuState) { //&& !this._labAutoChupaiTip.active
                    // this._qihu.active = true;
                    cc.fy.hintBox.show("您选择了在本圈放弃胡牌！");
                }
                this._chiData = null;
                cc.fy.net.send("guo", cc.fy.gameNetMgr.curaction.actionId);
                this.hideOptions();
            }
            // cc.fy.net.send("guo", cc.fy.gameNetMgr._actionid);
        }
        else if (event.target.name == "btnJiating") {
            this._chiData = null;
            if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.HAMJ) {
                this._tingState = true;
            }
            cc.fy.net.send("tingpai", cc.fy.gameNetMgr._actionid);
            //this.hideOptions();
        }
        else if (event.target.name == "btnCancel") {
            if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.HAMJ) {
                this._tingState = false;
            }
            this._chiData = null;
            cc.fy.net.send("cancelTing");
            this.hideOptions();
        }
        else if (event.target.name == "btnChi") {
            if (this._temp.length < 2 && this._chiData == null) {
                var n = this._tempfirst[0];
                var m = this._tempsecond[0];
                this._chiData = {
                    first: n,
                    second: m,
                };
            }
            this.sendChiData();
            if (seatData == null) {
                return;
            }
        }
        else if (event.target.name == "btntianting") {
            cc.fy.net.send("tianting");
            this.hideOptions();
        }
        else if (event.target.name == "btnTGuo") {
            cc.fy.net.send("tiantingguo");
            this.hideOptions();
        }
    },

    sendChiData: function () {
        if (this._chiData == null) {
            cc.fy.hintBox.show("请先选择吃牌牌型");
        }
        else {
            var data = this._chiData;
            cc.fy.net.send('chipai', data);
            this.hideOptions();
        }
    },
    showChiList: function (data) {
        this._temp = [];
        this._tempfirst = [];
        this._tempsecond = [];
        var seats = cc.fy.gameNetMgr.seats;
        var seatData = seats[cc.fy.gameNetMgr.seatIndex];
        var holds = this.sortHolds(seatData);
        var index = data;
        var countMap = {};
        var nChiType = Math.floor(index / 9);
        if (nChiType >= 3) {
            return;
        }
        for (var i = 0; i < holds.length; ++i) {
            var pai = holds[i];
            if (Math.floor(pai / 9) != nChiType) {
                continue;
            }
            if (countMap[pai] == null) {
                countMap[pai] = 1;
            }
            else {
                countMap[pai]++;
            }
        }
        if (countMap[index + 1] >= 1 && countMap[index + 2] >= 1) {
            this._temp.push(index);
            this._tempfirst.push(index + 1);
            this._tempsecond.push(index + 2);
        }
        if (countMap[index + 1] >= 1 && countMap[index - 1] >= 1) {
            this._temp.push(index - 1);
            this._tempfirst.push(index - 1);
            this._tempsecond.push(index + 1);
        }
        if (countMap[index - 1] >= 1 && countMap[index - 2] >= 1) {
            this._temp.push(index - 2);
            this._tempfirst.push(index - 2);
            this._tempsecond.push(index - 1);
        }
        if (this._temp.length > 0) {
            for (var i = 0; i < this._temp.length; ++i) {
                this._chiPaiList.active = true
                var t = this._chiPaiList.children[i];
                t.active = true;

                this._shade.active = true
                this._shade.children[i].active = false;
                for (var j = 0; j < t.childrenCount; ++j) {
                    var sprite = t.children[j].getComponent(cc.Sprite);
                    sprite.spriteFrame = cc.fy.mahjongmgr.getSpriteFrameByMJID("M_", this._temp[i] + j);
                    t.children[j].scaleX = 0.9
                    t.children[j].scaleY = 0.9
                    t.children[j].getChildByName("zhezhao").active = true;
                    if (this._temp[i] + j == data) {
                        t.children[j].getChildByName("zhezhao").active = false;
                    }
                }
            }
        }
    },
    onChipaiNodeClickEvent: function (event) {
        if (event.target.name == "chiPaiList0") {
            this._chiData = this.setChiData(0)
        }
        else if (event.target.name == "chiPaiList1") {
            this._chiData = this.setChiData(1);
        }
        else if (event.target.name == "chiPaiList2") {
            this._chiData = this.setChiData(2);
        }
    },
    setChiData: function (num) {
        for (var i = 0; i < this._shade.childrenCount; ++i) {
            if (i == num) {
                this._shade.children[i].active = true;
            }
            else {
                this._shade.children[i].active = false;
            }
        }
        var n = 0;
        var m = 0;
        var data = {};
        if (num == 0) {
            n = this._tempfirst[0];
            m = this._tempsecond[0];
            data = {
                first: n,
                second: m,
            };
        }
        else if (num == 1) {
            n = this._tempfirst[1];
            m = this._tempsecond[1];
            data = {
                first: n,
                second: m,
            };
        }
        else if (num == 2) {
            n = this._tempfirst[2];
            m = this._tempsecond[2];
            data = {
                first: n,
                second: m,
            };
        }
        return data;
    },
    cancelJiaTing: function (data) {
        if (data == null) {
            return;
        }
        if (data.userId == cc.fy.userMgr.userId) {
            for (var i = 0; i < this._myMJArr.length; ++i) {
                var sprite = this._myMJArr[i];
                sprite.node.color = new cc.Color(255, 255, 255);
                var button = sprite.node.getComponent(cc.Button);
                if (button) {
                    button.interactable = true;
                }
            }
            this.setAutoChupaiTipActive(false);
        }
    },
    doTing: function (data) {
        if (data == null) {
            return;
        }
        var seats = cc.fy.gameNetMgr.seats;
        var seatData = seats[cc.fy.gameNetMgr.seatIndex];
        if (seatData == null) {
            return;
        }
        if (data.userId == cc.fy.userMgr.userId) {
            var lackingNum = (seatData.pengs.length + seatData.angangs.length + seatData.diangangs.length
                + seatData.wangangs.length) * 3;//+ seatData.chipais.length;
            for (var i = 0; i < this._myMJArr.length; ++i) {
                var sprite = this._myMJArr[i];
                sprite.node.color = new cc.Color(155, 155, 155);
                var button = sprite.node.getComponent(cc.Button);
                if (button) {
                    button.interactable = false;
                }
            }
            for (var j = lackingNum; j < this._myMJArr.length; ++j) {
                if (data.pai) {
                    for (var k = 0; k < data.pai.length; ++k) {
                        var sprMJ = this._myMJArr[j];
                        if (sprMJ.node.mjId == data.pai[k]) {
                            sprMJ.node.color = new cc.Color(255, 255, 255);
                            var button = sprMJ.node.getComponent(cc.Button);
                            if (button) {
                                button.interactable = true;
                            }
                            continue;
                        }
                    }
                }
            }
        }
    },
    doJiating: function (data) {
        var self = this;
        if (data == null) {
            return;
        }
        var seats = cc.fy.gameNetMgr.seats;
        var seatData = seats[cc.fy.gameNetMgr.seatIndex];
        if (seatData == null) {
            return;
        }
        if (!data.userId) {
            var si = cc.fy.gameNetMgr.getSeatIndexByID(data.si);
        }
        else {
            var si = cc.fy.gameNetMgr.getSeatIndexByID(data.userId);
        }
        var localIndex = cc.fy.gameNetMgr.getLocalIndex(si);
        if (localIndex != -1) {
            if (data.tiantingstate) {
                // this.playEfx(localIndex, "play_tianting");
                self.playGameAni(localIndex, "天听", false);
            }
            else {
                // this.playEfx(localIndex, "play_jiating");
                self.playGameAni(localIndex, "架听", false);
            }
            cc.fy.audioMgr.playSFX("jiating.mp3", true);
        }
        if (data.userId == cc.fy.userMgr.userId) {
            // var lackingNum = (seatData.pengs.length + seatData.angangs.length + seatData.diangangs.length 
            // + seatData.wangangs.length) * 3 + seatData.chipais.length;
            for (var i = 0; i < this._myMJArr.length; ++i) {
                var sprite = this._myMJArr[i];
                sprite.node.color = new cc.Color(155, 155, 155);
                var button = sprite.node.getComponent(cc.Button);
                if (data.pai != null && data.pai.length > 0) {
                    for (var j = 0; j < data.pai.length; ++j) {
                        if (button && button.node.mjId == data.pai[j]) {
                            button.interactable = true;
                        }
                        else {
                            button.interactable = false;
                        }
                    }
                }
            }
            if (!cc.fy.replayMgr.isReplay()) {
                this.setAutoChupaiTipActive(true);
            }
        }
    },
    //加倍按钮点击事件
    onBtnDoubleClickEvent: function () {
        this.hideOptions();
        cc.fy.net.send("double");
    },

    // 飘花按钮点击
    onPiaohuaButtonClick: function (event) {
        var piaoNum = 0;
        if (event.target.name != "piao0") {
            var _piaoNum = parseInt(event.target.name);
            if (_piaoNum) {
                piaoNum = _piaoNum;
            }
        }

        this.sendPiaohua(piaoNum);
    },

    // 发送飘花
    sendPiaohua: function (piao) {
        cc.fy.net.send('piaohua', piao);
    },

    // 拉庄按钮点击
    onLazhuangBtnClick: function (event) {
        // var lazhuangNum = 0;
        // if (event.target.name != "0") {
        //     var _lazhuangNum = parseInt(event.target.name);
        //     if (_lazhuangNum) {
        //         lazhuangNum = _lazhuangNum;
        //     }
        // }
        // else {
        //     this.setLazhuangActive(false);
        // }
        // this.sendLazhuang(lazhuangNum);
    },
    // 发送拉庄
    sendLazhuang: function (num) {
        // cc.fy.net.send('lazhuang', num);
    },
    // 拉庄按钮点击
    onDingzhuangBtnClick: function (event) {
        // var dingzhuangNum = 0;
        // if (event.target.name != "0") {
        //     var _dingzhuangNum = parseInt(event.target.name);
        //     if (_dingzhuangNum) {
        //         dingzhuangNum = _dingzhuangNum;
        //     }
        // }
        // else {
        //     this.setDingzhuangActive(false);
        // }
        // this.sendDingzhuang(dingzhuangNum);
    },
    // 发送顶庄
    sendDingzhuang: function (num) {
        // cc.fy.net.send('dingzhuang', num);
    },
    // 新增初始化界面(hamj)
    resetView_New: function (bo) {
        this.showKuangArr();
        this.hideDir();
        var btnBack = this.prepareRoot.getChildByName("btnBack");
        if (cc.fy.gameNetMgr.numOfGames > 0) {
            btnBack.active = false;
        }
        // 断线重入初始化 
        // 飘花状态 没有飘过花显示飘花按钮
        if (cc.fy.gameNetMgr.gamestate == "piaohua") {
            var selfSeat = cc.fy.gameNetMgr.getSelfData();
            var piaohua = selfSeat.piaohua;
            if (piaohua == null || piaohua == -1) {
                this.setPiaohuaActive(true);
                cc.fy.gameNetMgr.isShowPiaohua = true;
            }
            else {
                var data =
                {
                    si: selfSeat.userid,
                    piao: selfSeat.piaohua,
                };
                cc.fy.gameNetMgr.dispatchEvent("piaohua_notify", data);
                var seats = cc.fy.gameNetMgr.seats;
                if (seats != null) {
                    var piaohuaend = true;
                    for (var i = 0; i < seats.length; i++) {
                        if (seats[i].piaohua == null || seats[i].piaohua == -1) {
                            piaohuaend = false;
                            break;
                        }
                    }

                    if (piaohuaend == false) {
                        cc.fy.gameNetMgr.isShowPiaohua = true;
                    }
                }
            }
        }
        console.log(" resetView_New 11");
        if (cc.fy.gameNetMgr.isShowPiaohua == true || cc.fy.gameNetMgr.isZhishaizi == true || bo == true) {
            console.log("resetView_New 2");
            this.gameRoot.active = true;
            this.prepareRoot.active = false;
            this.onGameBeign();
            var sides = [];
            if (cc.fy.gameNetMgr.conf.type == cc.ERMJ) {
                sides = ["myself", "up"];
            }
            else {
                sides = ["myself", "right", "up", "left"];
            }

            for (var i = 0; i < sides.length; ++i) {
                var sideChild = this.gameRoot.getChildByName(sides[i]);
                var holds = sideChild.getChildByName("holds");
                var childCount = holds.childrenCount;
                for (var j = 0; j < childCount; ++j) {
                    var nc = holds.children[j];
                    nc.active = false;
                }
            }

            //this._leftCard_game.active = false;
            this._doubleNum.active = false;
            if (cc.fy.gameNetMgr.conf.type == 23) {
                this._rightHF.active = false;
            }
            cc.fy.gameNetMgr.isShowPiaohua = false;
            cc.fy.gameNetMgr.isZhishaizi = false;
        }
        if (cc.fy.gameNetMgr.numOfMJ == 0 && cc.fy.gameNetMgr.numOfGames == 0 && cc.fy.gameNetMgr.maxNumOfGames == 0) {
            // this._leftCard_game.active = false;
        }
        // 飘花状态 没有飘过花显示飘花按钮
        if (cc.fy.gameNetMgr.gamestate == "piaohua") {
            var selfSeat = cc.fy.gameNetMgr.getSelfData();
            var piaohua = selfSeat.piaohua;
            if (piaohua == null || piaohua == -1) {
                this.setPiaohuaActive(true);
                cc.fy.gameNetMgr.isShowPiaohua = true;
            }
            else {
                var data =
                {
                    si: selfSeat.userid,
                    piao: selfSeat.piaohua,
                };
                cc.fy.gameNetMgr.dispatchEvent("piaohua_notify", data);
                var seats = cc.fy.gameNetMgr.seats;
                if (seats != null) {
                    var piaohuaend = true;
                    for (var i = 0; i < seats.length; i++) {
                        if (seats[i].piaohua == null || seats[i].piaohua == -1) {
                            piaohuaend = false;
                            break;
                        }
                    }

                    if (piaohuaend == false) {
                        cc.fy.gameNetMgr.isShowPiaohua = true;
                    }
                }
            }
        }
        console.log(" resetView_New 11");
        if (cc.fy.gameNetMgr.isShowPiaohua == true || cc.fy.gameNetMgr.isZhishaizi == true || bo == true) {
            console.log("resetView_New 2");
            this.gameRoot.active = true;
            this.prepareRoot.active = false;
            this.onGameBeign();
            var sides = [];
            if (cc.fy.gameNetMgr.conf.type == cc.ERMJ) {
                sides = ["myself", "up"];
            }
            else {
                sides = ["myself", "right", "up", "left"];
            }

            for (var i = 0; i < sides.length; ++i) {
                var sideChild = this.gameRoot.getChildByName(sides[i]);
                var holds = sideChild.getChildByName("holds");
                var childCount = holds.childrenCount;
                for (var j = 0; j < childCount; ++j) {
                    var nc = holds.children[j];
                    nc.active = false;
                }
            }

            //this._leftCard_game.active = false;
            this._doubleNum.active = false;
            if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZWJ) {
                this._rightHF.active = false;
            }
            cc.fy.gameNetMgr.isShowPiaohua = false;
            cc.fy.gameNetMgr.isZhishaizi = false;
        }
        if (cc.fy.gameNetMgr.numOfMJ == 0 && cc.fy.gameNetMgr.numOfGames == 0 && cc.fy.gameNetMgr.maxNumOfGames == 0) {
            //this._leftCard_game.active = false;
        }


        var isRefresh = cc.fy.gameNetMgr.isShowLazhuang == true || cc.fy.gameNetMgr.isShowDingzhuang == true || cc.fy.gameNetMgr.isZhishaizi == true || cc.fy.gameNetMgr._reStart || bo == true;
        if (isRefresh) {
            console.log("resetView_New 2");
            this.gameRoot.active = true;
            this.prepareRoot.active = false;
            this.onGameBeign();
            var sides = [];
            if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.ERMJ) {
                sides = ["myself", "up"];
            }
            else {
                sides = ["myself", "right", "up", "left"];
            }
            for (var i = 0; i < sides.length; ++i) {
                var sideChild = this.gameRoot.getChildByName(sides[i]);
                var holds = sideChild.getChildByName("holds");
                var childCount = holds.childrenCount;
                for (var j = 0; j < childCount; ++j) {
                    var nc = holds.children[j];
                    nc.active = false;
                }
            }
            // this._leftCard.active = false;
            cc.fy.gameNetMgr.isShowPiaohua = false;
            cc.fy.gameNetMgr.isShowLazhuang = false;
            cc.fy.gameNetMgr.isShowDingzhuang = false;
            cc.fy.gameNetMgr.isZhishaizi = false;
        }

        var seats = cc.fy.gameNetMgr.seats;
        if (seats.length == null || seats.length <= 0) {
            return;
        }

        var seatindex = cc.fy.gameNetMgr.seatIndex;
        if (seatindex != null && seatindex != -1) {
            this.setAutoChupaiTipActive(this._huData && this._huData.length == 0 && (seats[seatindex].tingState == 1 || seats[seatindex].tingState == 2));//seats[seatindex].tingState == 1 || 
        }

        if (cc.fy.gameNetMgr.numOfMJ == 0 && cc.fy.gameNetMgr.numOfGames == 0 && cc.fy.gameNetMgr.maxNumOfGames == 0) {
            // this._leftCard.active = false;
        }

        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZER) {
            if (cc.fy.gameNetMgr.conf.wanfa == null || cc.fy.gameNetMgr.conf.wanfa.double == 1) {
                this._doublePanel.active = true;
                for (var i = 0; i < cc.fy.gameNetMgr.seats.length; ++i) {
                    var userId = seats[i].userid;
                    var times = seats[i].double;
                    if (times) {
                        this.showDoubleResult(userId, times);
                    }
                    else {
                        this.showDoubleResult(userId, 0);
                    }
                }

            }
            this.showTask(cc.fy.gameNetMgr._taskData);

            cc.fy.gameNetMgr._taskData = null;
        }

        for (var i = 0; i < cc.fy.gameNetMgr.seats.length; ++i) {
            var userId = seats[i].userid;
            if (userId == cc.fy.userMgr.userId && seats[i].tianting == 1) {
                this.addOption("btntianting", -1);
            }
            // if (seats[i].flowers && seats[i].flowers.length > 0) {
            //     console.log("补花动画");
            //     cc.fy.gameNetMgr.dispatchEvent("play_buhua_Ani", userId);
            // }
        }
        this._huData = cc.fy.gameNetMgr._huData;
        console.log("_huData ====", this._huData);
        if (this._huData) {
            this.showTingAlert(this._huData);
        }
        var tingList = cc.fy.gameNetMgr._tingList;
        console.log("tingList =====", tingList);
        if (tingList && tingList.length > 0) {
            this.showTing(tingList);
        }
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

    onDestroy: function () {
        if (cc.fy && !cc.fy.gameNetMgr.isReturn) {
            cc.fy.gameNetMgr.clear();
        }
        cc.fy.gameNetMgr.isReturn = false;
    },

    onDebugButtonClick: function () {
        if (this.debugNode == null) {
            this.debugNode = this.node.getChildByName("cmdDebug");
        }
        this.debugNode.active = !this.debugNode.active;
    },

    setPiaohuaNum: function () {
        if (this._piaohua && cc.fy.gameNetMgr.conf) {
            var piaoList = [1, 2, 5, 10];
            var piaotype = "分";
            if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZCT || cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZBD) {
                piaotype = "花";
            }
            for (var i = 1; i <= 4; i++) {
                var piao = this._piaohua.getChildByName("piao" + i);
                if (piao) {
                    piao.active = true;
                    var piaoNum = 0;
                    if (cc.fy.gameNetMgr.conf.type == 0) {
                        if (cc.fy.gameNetMgr.conf.baseScore > 1) {
                            if (i == 3) {
                                piaoNum = cc.fy.gameNetMgr.conf.baseScore;
                            }
                            else {
                                piao.active = false;
                                if (i == 1) {
                                    // 不飘的位置改到1位
                                    var _piao0 = this._piaohua.getChildByName("piao0");
                                    _piao0.x = piao.x;
                                    _piao0.y = piao.y;
                                }
                            }
                        }
                        else {
                            piaoNum = piaoList[i - 1] * cc.fy.gameNetMgr.conf.baseScore;
                        }
                    }
                    else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZCT) {
                        piaoNum = piaoList[i - 1];
                    }
                    else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZBD) {
                        piaoNum = piaoList[i - 1];
                    }
                    else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZHD) {
                        if (i == 3) {
                            piaoNum = cc.fy.gameNetMgr.conf.baseScore;
                        }
                        else {
                            piao.active = false;
                            if (i == 1) {
                                // 不飘的位置改到1位
                                var _piao0 = this._piaohua.getChildByName("piao0");
                                _piao0.x = piao.x;
                                _piao0.y = piao.y;
                            }
                        }
                    }

                    var labpiao = piao.getChildByName("labpiao").getComponent(cc.Label);
                    labpiao.string = "飘" + piaoNum + piaotype;
                    piao.name = "" + piaoNum;
                }

            }
        }
    },

    setDistance: function () {
        var _warn = "";
        var seats = cc.fy.gameNetMgr.seats;
        if (seats == null) {
            console.log("checkgps seats = null");
            return;
        }
        var length = seats.length;
        var gpsInfos = [];
        // seats[0].gpsInfo = {latitude: "50.295461", longitude: "110.666", location: "huao通园路490号"};
        // seats[1].gpsInfo = {latitude: "50.395462", longitude: "110.666", location: "taiz通园路490号"};
        // seats[2].gpsInfo = {latitude: "50.495463", longitude: "110.666", location: "吴中区通园路490号"};
        for (var i = 0; i < length; i++) {
            if (!seats[i].gpsInfo) {
                seats[i].gpsInfo = { latitude: "0", longitude: "0", location: "null" };
            }

            if (i != cc.fy.gameNetMgr.seatIndex) {
                gpsInfos.push(seats[i]);
            }
        }
        //玩家gps数据都有了之后再处理
        var infoLength = gpsInfos.length;
        for (var i = 0; i < infoLength; i++) {
            var gpsInfo = gpsInfos[i].gpsInfo;

            if (gpsInfo.latitude == 0 && gpsInfo.longitude == 0) {
                // _warn += gpsInfos[i].name + " 未获得地理位置信息\n";
                continue;
            }
            for (var j = i; j < infoLength; j++) {
                if (gpsInfos[i].userid != gpsInfos[j].userid) {
                    if (gpsInfos[j].gpsInfo.latitude == 0 && gpsInfos[j].gpsInfo.longitude == 0) {
                        continue;
                    }

                    var dis = cc.fy.anysdkMgr.getDisance(gpsInfo.latitude, gpsInfo.longitude,
                        gpsInfos[j].gpsInfo.latitude, gpsInfos[j].gpsInfo.longitude);
                    dis = (dis / 1000).toFixed(2);
                    _warn += cc.fy.utils.subStringCN(gpsInfos[i].name, 8, true) + " 与 " + cc.fy.utils.subStringCN(gpsInfos[j].name, 8, true) + " 距离 " + dis + " 公里\n";
                }
            }

        }
        if (_warn != null && _warn != "") {
            this.showDis(_warn);
        }
        else {
            cc.fy.hintBox.show("未获得其他玩家位置信息！");
        }
    },

    showDis: function (string) {
        var gpsWarn = cc.find("Canvas/gameMain/gpswarn/_gpswarn");
        var content = gpsWarn.getChildByName("content");
        content.getComponent(cc.Label).string = string;
        gpsWarn.active = true;
    },

    //洗牌动画
    playCartoon: function (userId) {
        let self = this;
        let index = cc.fy.gameNetMgr.getSeatIndexByID(userId);
        let localIndex = cc.fy.gameNetMgr.getLocalIndex(index);
        let seatArr = ["myself", "right", "up", "left"];
        if (this._gamePlayer == 3) {
            seatArr = ["myself", "right", "left"];
        }
        else if (this._gamePlayer == 2) {
            seatArr = ["myself", "up"];
        }
        let sortCartoon = this.node.getChildByName("sortCartoon");
        let skeleton = sortCartoon.getComponent(sp.Skeleton);
        let xinpainode;
        var playerNode = this.gameRoot.getChildByName(seatArr[localIndex]);
        xinpainode = playerNode.getChildByName("seat").getChildByName("xipaiING");
        for (var i = 0; i < seatArr.length; i++) {
            var xSide = this.node.getChildByName("game").getChildByName(seatArr[i]);
            var flower = xSide.getChildByName("flower");
            flower.active = false;
        }
        xinpainode.active = true;
        skeleton.node.active = true;
        this.gameRoot.active = true;
        this.prepareRoot.active = false;
        skeleton.setAnimation(0, "xipai", true);
        setTimeout(function () {
            xinpainode.active = false;
        }, 1500);

        skeleton.setCompleteListener(function () {
            skeleton.node.active = false;
        }, this, null);
    },

    setPiaohuaActive: function (bo) {

        this._piaohua.active = bo;
        if (bo) {
            this.setPiaohuaNum();
            this.scheduleOnce(function () {
                cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWGAMEVIEW_MJPEIZHI_CTC, { isShow: false });
            }, 0.5)

        }
        // if(bo){
        //     var imgpiaodes = this._piaohua.getChildByName("imgpiaodes").getComponent(cc.Sprite);
        //     var spriteframe = "tiltle_xzpf";
        //     if(cc.fy.gameNetMgr.conf.type == cc.SZCT){
        //         spriteframe = "tiltle_xzph";
        //         }
        //     cc.loader.loadRes("images/game/game_t", cc.SpriteAtlas, function (err, atlas) {
        //         var frame = atlas.getSpriteFrame(spriteframe);
        //         imgpiaodes.spriteFrame = frame;
        //     });

        // }
    },

    setLazhuangActive: function (bo) {
        //  this._lazhuang.active = bo;
    },

    setDingzhuangActive: function (bo) {
        console.log("---- dingzhuang.active", bo);
        this._dingzhuang.active = bo;
    },

    showBaida: function () {
        var sprite = this._peiziWin.getChildByName("MyMahJong").getComponent(cc.Sprite);
        var baidamark = this._peiziWin.getChildByName("MyMahJong").getChildByName("baidaMark");

        if (cc.fy.gameNetMgr.baida != -1 && cc.fy.gameNetMgr.baida != null
            && (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZWJ || cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZHD)) {
            this._peiziWin.active = true;
            // jnmvnipdaj 新牌替换
            sprite.spriteFrame = cc.fy.mahjongmgr.getSpriteFrameByMJID("M_", cc.fy.gameNetMgr.baida);
            // sprite.node.scale = 0.8; 
            baidamark.active = false;
            baidamark.scaleX = 0.5
            baidamark.scaleY = 0.5
            if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZHD) {
                this._huangfanshu.node.parent.active = false
            }
        } else {
            sprite.spriteFrame = cc.fy.mahjongmgr.getUpSpriteFrame();
        }
    },
    hideBaida: function () {
        this._peiziWin.active = false;
    },
});
