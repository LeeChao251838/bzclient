var GameMsgDef = require("GameMsgDef");
var ConstsDef = require('ConstsDef');
cc.Class({
    extends: cc.Component,

    properties: {
        _prepare: null,
        _btnBack: null,
        _btnExit: null,
        _btnDissolve: null,
        _btnWeichat: null,
        _gameover: null,
        _gameover_nopai: null,
        _gameresult: null,
        _seats: [],
        _isGameEnd: false,
        _pingju: null,
        _win: null,
        _lose: null,
        _difenFrame: null,
        //_maimajiesuan: null,
        _paiStyleBtn: null,
        _showpaistyle: null,
        _btnready: null,
        _gamePlayer: 3,
        //洪泽抓牌
        // _zhuapai: null,
        _pais: null,
        _isZhuaMa: false,
        _overdata: null,
        _isZhuang: -1,

        _fanCards: [],
        _fanpaiNode: null,
        _sprFanpai: null,
        _task:null
    },
    // use this for initialization
    onLoad: function () {
        if (cc.fy.gameNetMgr.seats == null) {
            cc.fy.alert.show("该房间已解散", function () {
                cc.fy.sceneMgr.loadScene("hall");
            });
            console.log("cc.fy.gameNetMgr.seats is null");
            return;
        }
        this.diArr = []

        this._isZhuang = -1;
        //this._zhuapai = this.node.getChildByName("zhuaPai");
        // this._btnSure_zhuapai = this._zhuapai.getChildByName("BtnSure");
        // cc.fy.utils.addClickEvent(this._btnSure_zhuapai, this.node, "GameOver", "onBtnClose");
        // this._pais = this._zhuapai.getChildByName("pais");
        // this._zhuapai.active = false;
        // this._isZhuaMa = false;
        this._gamePlayer = cc.fy.gameNetMgr.seats.length;
        this._prepare = this.node.getChildByName("prepare");
        this._btnBack = this._prepare.getChildByName("btnBack");
        this._btnExit = this._prepare.getChildByName("btnExit");
        this._btnDissolve = this._prepare.getChildByName("btnDissolve");
        this._btnWeichat = this._prepare.getChildByName('btnLayout').getChildByName("btnWeichat");
        this._btnready = cc.find("Canvas/gameMain/game_over_hamj/btnLayout/btnReady");

        if (this._btnready) {
            cc.fy.utils.addClickEvent(this._btnready, this.node, "GameOver", "onBtnReadyClicked");
        }
        var btnShare = cc.find("Canvas/gameMain/game_over_hamj/btnLayout/btnShare");
        if (btnShare) {
            cc.fy.utils.addClickEvent(btnShare, this.node, "GameOver", "onBtnShareClicked");
        }

        if (cc.fy == null || cc.fy.gameNetMgr.conf == null) {
            return;
        }

        this._gameover = this.node.getChildByName("game_over_hamj");
        this._gameover.active = false;
        this._gameover_nopai = this.node.getChildByName("game_over_nohapai");
        this._gameover_nopai.active = false;
        this._fanpaiNode = this._gameover.getChildByName("fanpaiNode");
        this._fanpaiNode.active = false;
        this._sprFanpai = this._gameover.getChildByName("sprFanpai");
        this._sprFanpai.active = false;
        this._task = this._gameover.getChildByName('task')
        this._zhishaiziNode = this._gameover.getChildByName('shaizixs')
        this._zhishaiziNode.active = false
        this._paiStyleBtn = cc.find("Canvas/gameMain/game_over_hamj/paistylebtn");
        this._showpaistyle = cc.find("Canvas/gameMain/game_over_hamj/showpaistyle");
        for (var i = 0; i < this._paiStyleBtn.childrenCount; ++i) {
            var n = this._paiStyleBtn.children[i];
            if (n != null) {
                n.active = false;
            }
        }

        for (var i = 0; i < this._showpaistyle.childrenCount; ++i) {
            var n = this._showpaistyle.children[i];
            if (n != null) {
                n.active = false;
            }
        }

        var shuffleBtn = cc.find("Canvas/gameMain/game_over_hamj/btnLayout/shuffleBtn");
        if (shuffleBtn) {
            cc.fy.utils.addClickEvent(shuffleBtn, this.node, "GameOver", "onBtnXipaiClicked");
        }
        this._pingju = this._gameover.getChildByName("pingju");
        this._win = this._gameover.getChildByName("win");
        this._lose = this._gameover.getChildByName("lose");
        this._gameresult = this.node.getChildByName("game_result");
        var listRoot = this._gameover.getChildByName("result_list");

        for (var i = 1; i <= cc.fy.gameNetMgr.seats.length; ++i) {
            var s = "s" + i;
            var sn = listRoot.getChildByName(s);
            sn.active = true;
            var viewdata = {};
            viewdata.username = sn.getChildByName('username').getComponent(cc.Label);
            viewdata.reason = sn.getChildByName('reason').getComponent(cc.Label);
            viewdata.zhuama = sn.getChildByName('zhuama').getComponent(cc.Label);
            viewdata.score = sn.getChildByName('score').getComponent(cc.Label);
            viewdata.score1 = sn.getChildByName('score1').getComponent(cc.Label);
            viewdata.head = sn.getChildByName('head').getComponent("ImageLoader");
            viewdata.hua = sn.getChildByName('hua');
            viewdata.hu = sn.getChildByName('hu');
            viewdata.mahjongs = sn.getChildByName('pai');
            viewdata.didi = sn.getChildByName('paidi');
            viewdata.zhuang = sn.getChildByName('zhuang');
            viewdata.hupai = sn.getChildByName('hupai');
            var imgresult = sn.getChildByName("imgresult");
            viewdata.zimo = imgresult.getChildByName("zimo");
            viewdata.zimo.active = false;
            viewdata.fangpao = imgresult.getChildByName("fangpao");
            viewdata.fangpao.active = false;
            viewdata.imghu = imgresult.getChildByName("hu");
            viewdata.imghu.active = false;
            viewdata.imgqgh = imgresult.getChildByName("qiangganghu");
            viewdata.imgqgh.active = false;
            viewdata._pengandgang = [];
            viewdata.imgbg = sn.getChildByName("bg1");
            viewdata.showhuscore = sn.getChildByName('showhuscore').getComponent(cc.Label);
            viewdata.showluckscore = sn.getChildByName('showluckscore').getComponent(cc.Label);
            viewdata.showgangscore = sn.getChildByName('showgangscore').getComponent(cc.Label);
            viewdata.showmascore = sn.getChildByName('showmascore').getComponent(cc.Label);
            viewdata.gangWinScore = sn.getChildByName('gangWinScore').getComponent(cc.Label);
            viewdata.gangLoseScore = sn.getChildByName('gangLoseScore').getComponent(cc.Label);

            this._seats.push(viewdata);
            this.diArr.push(viewdata.didi)
        }
        //初始化网络事件监听器
        var self = this;
        cc.fy.gameNetMgr.addHandler('game_over', function (data) {
            console.log("game_over  game_over ", data);
            self._isZhuang = cc.fy.gameNetMgr.button;
            self.onGameOver(data);
        });
        cc.fy.gameNetMgr.addHandler('game_end', function (data) {
            self._isGameEnd = true;
        });
        cc.fy.gameNetMgr.addHandler('game_over_show', function (data) {
            self._gameover.active = true;
        });
    },
    onGameOver: function (data) {
        console.log("onGameOver  ----->>>>>");
        console.log(data);


        // for (var i = 0; i < this._showpaistyle.childrenCount; ++i) {
        //     var n = this._showpaistyle.children[i];
        //     var m = this._gameover.getChildByName("result_list").children[i].getChildByName("reason");
        //     if (n.active) {
        //         n.active = false;
        //     }
        //     m.active = false//(!n.active);
        // }
        //隐藏
        for (let i = 0; i < this.diArr.length; i++) {
            this.diArr[i].active = false
        }

        let shuffleBtn = cc.find("Canvas/gameMain/game_over_hamj/btnLayout/shuffleBtn");
        let btnShare = cc.find("Canvas/gameMain/game_over_hamj/btnLayout/btnShare");
        if (cc.fy.gameNetMgr.isOver == false) {
            //  shuffleBtn.x = 290;
            // this._btnready.x = 0;
            // btnShare.x = -290
            btnShare.active = true
        }
        else {
            //  this._btnready.x = 0;
            shuffleBtn.active = false;
            btnShare.active = false
        }
        //cc.fy.gameNetMgr.numOfDouble = 0
        this._task.active = false;
        if (data[0] && data[0].shaizi_nums && (cc.fy.gameNetMgr.conf.type != cc.GAMETYPE.SZBD)) {
            this._zhishaiziNode.active = true
            let num1 = data[0].shaizi_nums.num1
            let num2 = data[0].shaizi_nums.num2
            this._zhishaiziNode.children[0].active = true
            this._zhishaiziNode.children[1].active = true
            for (let j = 1; j < 7; j++) {
                if (j == num1) {
                    this._zhishaiziNode.children[0].getChildByName(String(j)).active = true
                } else {
                    this._zhishaiziNode.children[0].getChildByName(String(j)).active = false
                }
                if (j == num2) {
                    this._zhishaiziNode.children[1].getChildByName(String(j)).active = true
                } else {
                    this._zhishaiziNode.children[1].getChildByName(String(j)).active = false
                }
            }


        } else {
            this._zhishaiziNode.active = false
        }
        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZCT) {
            this.onGameOver_SZCT(data);

        }
        else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZBD) {
            this.onGameOver_SZBD(data);
        }
        else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZTDH) {
            this.onGameOver_SZTDH(data);
        }
        else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZHD) {
            this.onGameOver_SZHD(data);
        }
        else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZWJ) {
            this.onGameOver_SZWJ(data);
        }
        else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZER) {
            this.onGameOver_SZER(data);
        }
        //初始化玩法
        this._gameover.getChildByName('wanfa').getComponent(cc.Label).string = cc.fy.gameNetMgr.getWanfa()

    },
    onGameOver_SZCT(data) {

        this._btnBack.active = false;
        this._btnExit.active = false;
        this._btnDissolve.active = false;
        this._btnWeichat.active = false;
        if (data.length == 0) {
            this._gameresult.active = true;
            return;
        }

        this._gameresult.active = false;
        // //飘花阶段不显示手牌
        // if (cc.fy.gameNetMgr.gamestate == "piaohua") {
        //     this.onGameOver_Nopai(data);
        //     return;
        // }

        this._gameresult.active = false;
        this._gameover.active = false;
        this._pingju.active = false;
        this._win.active = false;
        this._lose.active = false;
        var myscore = data[cc.fy.gameNetMgr.seatIndex].score;
        if (myscore > 0) {
            this._win.active = true;
        } else if (myscore < 0) {
            this._lose.active = true;
        }
        else {
            var isPingju = true;
            for (var i = 0; i < cc.fy.gameNetMgr.seats.length; ++i) {
                if (data[i].score > 0 || data[i].score < 0) {
                    isPingju = false;
                    break;
                }
            }
            if (isPingju) {
                this._pingju.active = true;
            }
        }

        //显示玩家信息
        for (var i = 0; i < cc.fy.gameNetMgr.seats.length; ++i) {
            var seatView = this._seats[i];
            seatView.zimo.active = false;
            seatView.fangpao.active = false;
            seatView.imghu.active = false;
            seatView.imgqgh.active = false;
            seatView.imgbg.active = false;
            seatView.hua.active = false
            seatView.reason.string = ''
            var userData = data[i];
            var hued = false;
            //胡牌的玩家才显示 是否清一色
            var numOfGangs = userData.angangs.length + userData.wangangs.length + userData.diangangs.length;
            var actionArr = [];
            this._gameover.getChildByName("result_list").children[i].getChildByName("reason").active = false
            for (var j = 0; j < userData.actions.length; ++j) {
                var ac = userData.actions[j];
                if (ac.type == "zimo" || ac.type == "ganghua" || ac.type == "dianganghua" || ac.type == "hu" || ac.type == "gangpaohu" || ac.type == "qiangganghu" || ac.type == "chadajiao") {
                    if (ac.type == "zimo") {
                        //自摸
                        seatView.zimo.active = true;

                    }
                    else if (ac.type == "qiangganghu") {
                        seatView.imgqgh.active = true;

                    }
                    else if (ac.type == "ganghua" || ac.type == "dianganghua") {

                    }

                    if (seatView.zimo.active == false && seatView.imgqgh.active == false) {
                        seatView.imghu.active = true;

                    }
                    hued = true;
                }
                else if (ac.type == "fangpao") {
                    seatView.fangpao.active = true;
                }
            }
            if (hued) {
                seatView.imgbg.active = true;

                if (userData.qingyise) {
                    actionArr.push("清一色");
                }

                if (userData.qidui) {
                    actionArr.push("七对");
                }

                if (userData.haidilaoyue) {
                    actionArr.push("海底捞月");
                }

                if (userData.hunyise) {
                    actionArr.push("混一色");
                }

                if (userData.duiduihu) {
                    actionArr.push("对对胡");
                }

                if (userData.dadiaoche) {
                    actionArr.push("大吊车");
                }

                if (userData.haoqidui) {
                    actionArr.push("豪七对");
                }

                if (userData.damenqing) {
                    actionArr.push("大门清");
                }

                if (userData.xiaomenqing) {
                    actionArr.push("小门清");
                }

                if (userData.tianhu) {
                    actionArr.push("天胡");
                }

                if (userData.dihu) {
                    actionArr.push("地胡");
                }

                if (userData.baojiaozi) {
                    actionArr.push("包饺子");
                }

                if (userData.qianggang) {
                    actionArr.push("抢杠");
                }

                if (userData.gangkai) {
                    actionArr.push("杠开");
                }

                if (cc.fy.gameNetMgr.numOfDouble > 0) {
                   actionArr.push(" 共 " + userData.flowersCnt + " 花" + " 牌局 2 倍");
                }
                else {
                   actionArr.push(" 共 " + userData.flowersCnt + " 花");
                }
                seatView.hua.active = true
                seatView.hua.getChildByName('huashu').getComponent(cc.Label).string = 'x' + cc.fy.gameNetMgr.seats[i].flowers.length
                if (actionArr.length > 0) {
                    this._gameover.getChildByName("result_list").children[i].getChildByName("reason").active = true;
                    this.diArr[i].active = true
                }

            } else {
                if (cc.fy.gameNetMgr.seats[i].flowers && cc.fy.gameNetMgr.seats[i].flowers.length > 0) {
                    seatView.hua.active = true
                    seatView.hua.getChildByName('huashu').getComponent(cc.Label).string = 'x' + cc.fy.gameNetMgr.seats[i].flowers.length
                } else {
                    seatView.hua.active = false

                }

            }
            console.log('piaohua', cc.fy.gameNetMgr.seats[i])
            for (var j = 0; j < cc.fy.gameNetMgr.seats.length; ++j) {
                if (cc.fy.gameNetMgr.seats[j].userid == data[i].userId) {
                    seatView.username.string = cc.fy.utils.subStringCN(cc.fy.gameNetMgr.seats[j].name, 10, true);
                    if (data[i].userId == cc.fy.userMgr.userId) {
                        seatView.username.node.color = new cc.color(255, 249, 154)
                    }
                    var info = cc.fy.gameNetMgr.seats[j];
                    //设置头像
                    seatView.head.setUserID(info.userid);
                    //seatView.hua.active = true
                }
            }
            seatView.zhuang.active = cc.fy.gameNetMgr.button == i;
            seatView.reason.string = actionArr.join(",");
            console.log('fdsfsfsdfds', seatView.reason)
            seatView.reason.node.active = true
            if (userData.score >= 0) {
                seatView.score.string = "+" + userData.score;
                //seatView.score.node.color = new cc.Color(255, 182, 22); 
                seatView.score.node.active = true
                seatView.score1.node.active = false


            }
            else {
                //seatView.score.string = userData.score;
                seatView.score1.string = userData.score;
                seatView.score.node.active = false
                seatView.score1.node.active = true
                //seatView.score.node.color = new cc.Color(255, 71, 41);
            }



            var hupai = -1;
            if (hued) {
                hupai = userData.holds.pop();
            }
            cc.fy.mahjongmgr.sortSZMJ(userData.holds);
            //胡牌不参与排序   
            if (hued) {
                userData.holds.push(hupai);
            }
            //隐藏所有牌
            for (var k = 0; k < seatView.mahjongs.childrenCount; ++k) {
                var n = seatView.mahjongs.children[k];
                n.active = false;
            }
            var lackingNum = (userData.pengs.length + numOfGangs) * 3;
            //显示相关的牌
            for (var k = 0; k < userData.holds.length; ++k) {
                var pai = userData.holds[k];
                var n = seatView.mahjongs.children[k + lackingNum];
                n.active = true;
                var sprite = n.getComponent(cc.Sprite);
                sprite.spriteFrame = cc.fy.mahjongmgr.getSpriteFrameByMJID("B_", pai);
                n.scaleX = 1.4
                n.scaleY = 1.4
                // 胡牌的标识
                var huico = n.getChildByName("huicon");
                if (huico) {
                    huico.active = hued;
                }
            }

            for (var k = 0; k < seatView._pengandgang.length; ++k) {
                seatView._pengandgang[k].active = false;
            }

            //初始化杠牌
            var index = 0;
            var gangs = userData.angangs;
            for (var k = 0; k < gangs.length; ++k) {
                var mjid = gangs[k];
                this.initPengAndGangs(seatView, index, mjid, "angang");
                index++;
            }

            var gangs = userData.diangangs;
            for (var k = 0; k < gangs.length; ++k) {
                var mjid = gangs[k];
                this.initPengAndGangs(seatView, index, mjid, "diangang");
                index++;
            }

            var gangs = userData.wangangs;
            for (var k = 0; k < gangs.length; ++k) {
                var mjid = gangs[k];
                this.initPengAndGangs(seatView, index, mjid, "wangang");
                index++;
            }

            //初始化碰牌
            var pengs = userData.pengs
            if (pengs) {
                for (var k = 0; k < pengs.length; ++k) {
                    var mjid = pengs[k];
                    this.initPengAndGangs(seatView, index, mjid, "peng");
                    index++;
                }
            }
        }



    },
    onGameOver_SZBD: function (newdata) {
        this._fanCards = newdata.fanCards;
        this._btnBack.active = false;
        this._btnExit.active = false;
        this._btnDissolve.active = false;
        this._btnWeichat.active = false;
        var data = newdata.results
        if (data.length == 0) {
            this._gameresult.active = true;
            return;
        }

        this._gameresult.active = false;
        //飘花阶段不显示手牌
        // if (cc.fy.gameNetMgr.gamestate == "piaohua") {
        //     this.onGameOver_Nopai(data);
        //     return;
        // }
        this._gameover.active = false;
        this._pingju.active = false;
        this._win.active = false;
        this._lose.active = false;
        var myscore = data[cc.fy.gameNetMgr.seatIndex].score;
        if (myscore > 0) {
            this._win.active = true;
        } else if (myscore < 0) {
            this._lose.active = true;
        }
        else {
            var isPingju = true;
            for (var i = 0; i < cc.fy.gameNetMgr.seats.length; ++i) {
                if (data[i].score > 0 || data[i].score < 0) {
                    isPingju = false;
                    break;
                }
            }
            if (isPingju) {
                this._pingju.active = true;
            }
        }
        if (this._fanCards != null && this._fanCards.length > 0) {
            console.log("==>> data.fanCard = " + this._fanCards);
            this._fanpaiNode.active = true;
            
            this._sprFanpai.active = true;
            var fanpaiChildren = this._fanpaiNode.getChildren();
            for (let h = 0; h < fanpaiChildren.length; h++) {
                fanpaiChildren[h].active = false
            }
            // this._sprFanpai.active = true;
            for (var f = 0; f < this._fanCards.length; ++f) {
                fanpaiChildren[f].active = true;
                var sprite = fanpaiChildren[f].getComponent(cc.Sprite);
                if (this._fanCards[f] != -1) {
                    // jnmvnipdaj 新牌替换
                    //cc.fy.mahjongmgr.createMahjongNode("up", this._fanCards[f], sprite.node, false);
                    sprite.spriteFrame = cc.fy.mahjongmgr.getSpriteFrameByMJID("B_", this._fanCards[f]);
                    // sprite.node.scale = this._nodescale;
                }
                else {
                    // jnmvnipdaj 新牌背替换
                    //cc.fy.mahjongmgr.getNewEmptySpriteFrame("myself", sprite, false);
                    sprite.spriteFrame = cc.fy.mahjongmgr.getEmptySpriteFrame("myself");
                    // sprite.node.scale = this._nodescale;
                }
            }

        }
        else {
            this._fanpaiNode.active = false;

            this._sprFanpai.active = false;
            console.log("==>> data.fanCard = null ");
        }
        //显示玩家信息
        for (var i = 0; i < cc.fy.gameNetMgr.seats.length; ++i) {

            var seatView = this._seats[i];
            seatView.zimo.active = false;
            seatView.fangpao.active = false;
            seatView.imghu.active = false;
            seatView.imgqgh.active = false;
            seatView.imgbg.active = false;
            seatView.hua.active = false
            seatView.reason.string = ''
            var userData = data[i];
            var hued = false;
            //胡牌的玩家才显示 是否清一色
            var numOfGangs = userData.angangs.length + userData.wangangs.length + userData.diangangs.length;
            var actionArr = [];
            this._gameover.getChildByName("result_list").children[i].getChildByName("reason").active = false;
            for (var j = 0; j < userData.actions.length; ++j) {
                var ac = userData.actions[j];
                if (ac.type == "zimo" || ac.type == "ganghua" || ac.type == "dianganghua" || ac.type == "hu" || ac.type == "gangpaohu" || ac.type == "qiangganghu" || ac.type == "chadajiao") {
                    if (ac.type == "zimo") {
                        // 自摸
                        seatView.zimo.active = true;


                    }
                    else if (ac.type == "qiangganghu") {
                        seatView.imgqgh.active = true;


                    }
                    else if (ac.type == "ganghua") {
                        // actionArr.push("杠开2倍");
                    }

                    if (seatView.zimo.active == false && seatView.imgqgh.active == false) {
                        seatView.imghu.active = true;

                    }
                    hued = true;
                }
                else if (ac.type == "fangpao") {
                    seatView.fangpao.active = true;
                }
            }
            if (hued) {
                seatView.imgbg.active = true;
                if (userData.qingyise) {
                    actionArr.push("清一色");
                }

                if (userData.qidui) {
                    actionArr.push("七对");
                }

                if (userData.haidilaoyue) {
                    actionArr.push("海底捞月");
                }

                if (userData.hunyise) {
                    actionArr.push("混一色");
                }

                if (userData.duiduihu) {
                    actionArr.push("对对胡");
                }

                if (userData.dadiaoche) {
                    actionArr.push("大吊车");
                }

                if (userData.haoqidui) {
                    actionArr.push("豪七对");
                }

                if (userData.damenqing) {
                    actionArr.push("大门清");
                }

                if (userData.xiaomenqing) {
                    actionArr.push("小门清");
                }

                if (userData.tianhu) {
                    actionArr.push("天胡");
                }

                if (userData.dihu) {
                    actionArr.push("地胡");
                }

                if (userData.baojiaozi) {
                    actionArr.push("包饺子");
                }

                if (userData.qianggang) {
                    actionArr.push("抢杠");
                }

                if (userData.gangkai) {
                    actionArr.push("杠开");
                }

                if (userData.noBaiDa) {
                    actionArr.push("无百搭");
                }

                if (userData.diaoBaiDa) {
                    actionArr.push("吊百搭");
                }

                if (cc.fy.gameNetMgr.numOfDouble > 0) {
                    actionArr.push(" 共 " + userData.flowersCnt + " 花" + " 牌局 2 倍");
                }
                else {
                    actionArr.push(" 共 " + userData.flowersCnt + " 花");
                }

                seatView.hua.active = true
                seatView.hua.getChildByName('huashu').getComponent(cc.Label).string = 'x' + cc.fy.gameNetMgr.seats[i].flowers.length;
                if (actionArr.length > 0) {
                    this._gameover.getChildByName("result_list").children[i].getChildByName("reason").active = true;
                    this.diArr[i].active = true;
                }

            } else {
                if (cc.fy.gameNetMgr.seats[i].flowers && cc.fy.gameNetMgr.seats[i].flowers.length > 0) {
                    seatView.hua.active = true;
                    seatView.hua.getChildByName('huashu').getComponent(cc.Label).string = 'x' + cc.fy.gameNetMgr.seats[i].flowers.length
                } else {
                    seatView.hua.active = false;
                }

            }
            console.log('piaohua', cc.fy.gameNetMgr.seats[i])
            for (var j = 0; j < cc.fy.gameNetMgr.seats.length; ++j) {
                if (cc.fy.gameNetMgr.seats[j].userid == data[i].userId) {
                    seatView.username.string = cc.fy.utils.subStringCN(cc.fy.gameNetMgr.seats[j].name, 10, true);
                    if (data[i].userId == cc.fy.userMgr.userId) {
                        seatView.username.node.color = new cc.color(255, 249, 154)
                    }
                    var info = cc.fy.gameNetMgr.seats[j];
                    //设置头像
                    seatView.head.setUserID(info.userid);
                    // seatView.hua.active = true
                }
            }
            seatView.zhuang.active = cc.fy.gameNetMgr.button == i;
            seatView.reason.string = actionArr.join(",");
            seatView.reason.node.active = true

            if (userData.score >= 0) {
                seatView.score.string = "+" + userData.score;
                seatView.score.node.active = true
                seatView.score1.node.active = false
            }
            else {
                seatView.score1.string = userData.score;
                seatView.score.node.active = false
                seatView.score1.node.active = true
            }



            var hupai = -1;
            if (hued) {
                hupai = userData.holds.pop();
            }
            cc.fy.mahjongmgr.sortSZMJ(userData.holds);

            //胡牌不参与排序   
            if (hued) {
                userData.holds.push(hupai);
            }

            //隐藏所有牌
            for (var k = 0; k < seatView.mahjongs.childrenCount; ++k) {
                var n = seatView.mahjongs.children[k];
                n.active = false;
            }

            var lackingNum = (userData.pengs.length + numOfGangs) * 3;

            //显示相关的牌
            for (var k = 0; k < userData.holds.length; ++k) {
                var pai = userData.holds[k];
                var n = seatView.mahjongs.children[k + lackingNum];
                n.active = true;
                var sprite = n.getComponent(cc.Sprite);
                sprite.spriteFrame = cc.fy.mahjongmgr.getSpriteFrameByMJID("B_", pai);
                n.scaleX = 1.4
                n.scaleY = 1.4
                // 胡牌的标识
                var huico = n.getChildByName("huicon");
                if (huico) {
                    huico.active = hued;
                }
            }


            for (var k = 0; k < seatView._pengandgang.length; ++k) {
                seatView._pengandgang[k].active = false;
            }

            //初始化杠牌
            var index = 0;
            var gangs = userData.angangs;
            for (var k = 0; k < gangs.length; ++k) {
                var mjid = gangs[k];
                this.initPengAndGangs(seatView, index, mjid, "angang");
                index++;
            }

            var gangs = userData.diangangs;
            for (var k = 0; k < gangs.length; ++k) {
                var mjid = gangs[k];
                this.initPengAndGangs(seatView, index, mjid, "diangang");
                index++;
            }

            var gangs = userData.wangangs;
            for (var k = 0; k < gangs.length; ++k) {
                var mjid = gangs[k];
                this.initPengAndGangs(seatView, index, mjid, "wangang");
                index++;
            }

            //初始化碰牌
            var pengs = userData.pengs
            if (pengs) {
                for (var k = 0; k < pengs.length; ++k) {
                    var mjid = pengs[k];
                    this.initPengAndGangs(seatView, index, mjid, "peng");
                    index++;
                }
            }
        }


        var myscore = data[cc.fy.gameNetMgr.seatIndex].score;




    },
    onGameOver_SZTDH: function (data) {
        this._btnBack.active = false;
        this._btnExit.active = false;
        this._btnDissolve.active = false;
        this._btnWeichat.active = false;
        if (data.length == 0) {
            this._gameresult.active = true;
            return;
        }

        this._gameresult.active = false;
        //飘花阶段不显示手牌
        // if (cc.fy.gameNetMgr.gamestate == "piaohua") {
        //     this.onGameOver_Nopai(data);
        //     return;
        // }
        this._gameover.active = false;
        this._pingju.active = false;
        this._win.active = false;
        this._lose.active = false;
        var myscore = data[cc.fy.gameNetMgr.seatIndex].score;
        if (myscore > 0) {
            this._win.active = true;
        }
        else if (myscore < 0) {
            this._lose.active = true;
        }
        else {
            var isPingju = true;
            for (var i = 0; i < cc.fy.gameNetMgr.seats.length; ++i) {
                if (data[i].score > 0 || data[i].score < 0) {
                    isPingju = false;
                    break;
                }
            }
            if (isPingju) {
                this._pingju.active = true;
            }
        }

        //显示玩家信息
        for (var i = 0; i < cc.fy.gameNetMgr.seats.length; ++i) {
            var seatView = this._seats[i];
            seatView.zimo.active = false;
            seatView.fangpao.active = false;
            seatView.imghu.active = false;
            seatView.imgqgh.active = false;
            seatView.imgbg.active = false;
            seatView.reason.string = ''
            var userData = data[i];
            var hued = false;
            seatView.hua.active = false
            // seatView.hua.getChildByName('huashu').getComponent(cc.Label).string = userData.flower*4
            //胡牌的玩家才显示 是否清一色
            var numOfGangs = userData.angangs.length + userData.wangangs.length + userData.diangangs.length;
            var actionArr = [];
            this._gameover.getChildByName("result_list").children[i].getChildByName("reason").active = false;
            for (var j = 0; j < userData.actions.length; ++j) {
                var ac = userData.actions[j];
                if (ac.type == "zimo" || ac.type == "ganghua" || ac.type == "dianganghua" || ac.type == "hu" || ac.type == "gangpaohu" || ac.type == "qiangganghu" || ac.type == "chadajiao") {
                    if (ac.type == "zimo") {
                        // 自摸
                        seatView.zimo.active = true;

                    }
                    else if (ac.type == "qiangganghu") {
                        seatView.imgqgh.active = true;

                    } else if (ac.type == "ganghua" || ac.type == "dianganghua") {
                        actionArr.push("杠开 2 倍");
                    }
                    if (seatView.zimo.active == false && seatView.imgqgh.active == false) {
                        seatView.imghu.active = true;

                    }
                    hued = true;
                }
                else if (ac.type == "fangpao") {
                    seatView.fangpao.active = true;
                }
            }

            if (hued) {
                seatView.imgbg.active = true;
                if (cc.fy.gameNetMgr.numOfDouble > 0) {
                    actionArr.push("牌局 2 倍");
                }

                if (userData.qingyise || userData.hunyise) {
                    if (userData.hunyise) {
                        if (userData.pattern == "duidui") {
                            actionArr.push("混对对 4 倍");
                        }
                        else {
                            actionArr.push("混一色 2 倍");
                        }
                    }

                    if (userData.qingyise) {
                        actionArr.push("清一色(封顶)");
                    }
                }
                else {
                    if (userData.pattern == "duidui") {
                        actionArr.push("对对胡 2 倍");
                    }
                }

                // if(userData.menqing){
                //     actionArr.push("门清");
                // }

                // if(userData.zhongzhang){
                //     actionArr.push("中张");
                // }

                if (userData.jingouhu) {
                    actionArr.push("大吊车(封顶)");
                }

                // if(userData.haidihu){
                //     actionArr.push("海底胡");
                // }

                if (userData.tianhu) {
                    actionArr.push("天胡(封顶)");
                }

                if (userData.dihu) {
                    actionArr.push("地胡(封顶)");
                }
                if (actionArr.length > 0) {
                    this._gameover.getChildByName("result_list").children[i].getChildByName("reason").active = true;
                    this.diArr[i].active = true
                }

            }
            console.log('piaohua', cc.fy.gameNetMgr.seats[i].piaohua)

            if (cc.fy.gameNetMgr.seats[i].piaohua > 0) {
                actionArr.push(String("飘分:" + cc.fy.gameNetMgr.seats[i].piaohua));
                this._gameover.getChildByName("result_list").children[i].getChildByName("reason").active = true;
                this.diArr[i].active = true
            }


            for (var j = 0; j < cc.fy.gameNetMgr.seats.length; ++j) {

                if (cc.fy.gameNetMgr.seats[j].userid == data[i].userId) {
                    seatView.username.string = cc.fy.utils.subStringCN(cc.fy.gameNetMgr.seats[j].name, 10, true);
                    if (data[i].userId == cc.fy.userMgr.userId) {
                        seatView.username.node.color = new cc.color(255, 249, 154)
                    }
                    var info = cc.fy.gameNetMgr.seats[j];
                    //设置头像
                    seatView.head.setUserID(info.userid);

                }
            }
            var strfan = "番";
            if (cc.fy.gameNetMgr.conf != null && cc.fy.gameNetMgr.conf.maxFan == userData.fan) {
                strfan = "番(封顶)"
            }
            let str = userData.fan > 0 ? userData.fan + strfan : "";
            actionArr.push(String(' ' + str));

            seatView.zhuang.active = cc.fy.gameNetMgr.button == i;
            seatView.reason.string = actionArr.join(",");
            seatView.reason.node.active = true

            if (userData.score >= 0) {
                seatView.score.string = "+" + userData.score;
                seatView.score.node.active = true
                seatView.score1.node.active = false
            }
            else {
                seatView.score1.string = userData.score;
                seatView.score.node.active = false
                seatView.score1.node.active = true
            }

            var hupai = -1;
            if (hued) {
                hupai = userData.holds.pop();
            }

            cc.fy.mahjongmgr.sortSZMJ(userData.holds);

            //胡牌不参与排序   
            if (hued) {
                userData.holds.push(hupai);
            }

            //隐藏所有牌
            for (var k = 0; k < seatView.mahjongs.childrenCount; ++k) {
                var n = seatView.mahjongs.children[k];
                n.active = false;
            }

            var lackingNum = (userData.pengs.length + numOfGangs) * 3;

            //显示相关的牌
            for (var k = 0; k < userData.holds.length; ++k) {
                var pai = userData.holds[k];
                var n = seatView.mahjongs.children[k + lackingNum];
                n.active = true;
                var sprite = n.getComponent(cc.Sprite);
                sprite.spriteFrame = cc.fy.mahjongmgr.getSpriteFrameByMJID("B_", pai);
                n.scaleX = 1.4
                n.scaleY = 1.4
                // 胡牌的标识
                var huico = n.getChildByName("huicon");
                if (huico) {
                    huico.active = hued;
                }
            }


            for (var k = 0; k < seatView._pengandgang.length; ++k) {
                seatView._pengandgang[k].active = false;
            }

            //初始化杠牌
            var index = 0;
            var gangs = userData.angangs;
            for (var k = 0; k < gangs.length; ++k) {
                var mjid = gangs[k];
                this.initPengAndGangs(seatView, index, mjid, "angang");
                index++;
            }

            var gangs = userData.diangangs;
            for (var k = 0; k < gangs.length; ++k) {
                var mjid = gangs[k];
                this.initPengAndGangs(seatView, index, mjid, "diangang");
                index++;
            }

            var gangs = userData.wangangs;
            for (var k = 0; k < gangs.length; ++k) {
                var mjid = gangs[k];
                this.initPengAndGangs(seatView, index, mjid, "wangang");
                index++;
            }

            //初始化碰牌
            var pengs = userData.pengs
            if (pengs) {
                for (var k = 0; k < pengs.length; ++k) {
                    var mjid = pengs[k];
                    this.initPengAndGangs(seatView, index, mjid, "peng");
                    index++;
                }
            }
        }

    },
    onGameOver_SZHD(data) {


        this._btnBack.active = false;
        this._btnExit.active = false;
        this._btnDissolve.active = false;
        this._btnWeichat.active = false;
        if (data.length == 0) {
            this._gameresult.active = true;
            return;
        }

        this._gameresult.active = false;
        this._gameover.active = false;
        this._pingju.active = false;
        this._win.active = false;
        this._lose.active = false;
        var myscore = data[cc.fy.gameNetMgr.seatIndex].score;
        if (myscore > 0) {
            this._win.active = true;
        }
        else if (myscore < 0) {
            this._lose.active = true;
        }
        else {
            var isPingju = true;
            for (var i = 0; i < cc.fy.gameNetMgr.seats.length; ++i) {
                if (data[i].score > 0 || data[i].score < 0) {
                    isPingju = false;
                    break;
                }
            }
            if (isPingju) {
                this._pingju.active = true;
            }
        }
        //显示玩家信息
        for (var i = 0; i < cc.fy.gameNetMgr.seats.length; ++i) {
            var seatView = this._seats[i];
            seatView.zimo.active = false;
            seatView.fangpao.active = false;
            seatView.imghu.active = false;
            seatView.imgqgh.active = false;
            seatView.imgbg.active = false;
            seatView.hua.active = false
            seatView.reason.string = ''
            var userData = data[i];
            var hued = false;
            //胡牌的玩家才显示 是否清一色
            var numOfGangs = userData.angangs.length + userData.wangangs.length + userData.diangangs.length;
            var numOfGen = userData.numofgen;
            var actionArr = [];
            var is7pairs = false;
            var ischadajiao = false;
            this._gameover.getChildByName("result_list").children[i].getChildByName("reason").active = false;


            for (var j = 0; j < userData.actions.length; ++j) {
                var ac = userData.actions[j];
                if (ac.type == "zimo" || ac.type == "ganghua" || ac.type == "dianganghua" || ac.type == "hu" || ac.type == "gangpaohu" || ac.type == "qiangganghu" || ac.type == "chadajiao") {
                    if (ac.type == "zimo") {
                        //自摸
                        seatView.zimo.active = true;

                    }
                    else if (ac.type == "qiangganghu") {
                        seatView.imgqgh.active = true;

                    } else if (ac.type == "ganghua" || ac.type == "dianganghua") {
                        actionArr.push("杠开");
                    }

                    if (seatView.zimo.active == false && seatView.imgqgh.active == false) {
                        seatView.imghu.active = true;

                    }
                    hued = true;
                }
                else if (ac.type == "fangpao") {
                    seatView.fangpao.active = true;
                }
            }

            if (hued) {
                seatView.imgbg.active = true;
                // if(cc.fy.gameNetMgr.numOfDouble > 0)
                // {
                //     actionArr.push("牌局 2 倍");
                // }

                if (userData.qingyise || userData.hunyise) {
                    if (userData.hunyise) {
                        if (userData.pattern == "duidui") {
                            actionArr.push("混对对");
                        }
                        else {
                            actionArr.push("混一色");
                        }
                    }

                    if (userData.qingyise) {
                        actionArr.push("清一色");
                    }
                }
                else {
                    if (userData.pattern == "duidui") {
                        actionArr.push("对对胡");
                    }
                }

                // if(userData.menqing){
                //     actionArr.push("门清");
                // }

                // if(userData.zhongzhang){
                //     actionArr.push("中张");
                // }

                if (userData.jingouhu) {
                    actionArr.push("大吊车");
                }

                // if(userData.haidihu){
                //     actionArr.push("海底胡");
                // }

                if (userData.tianhu) {
                    actionArr.push("天胡");
                }

                // if(userData.dihu){
                //     actionArr.push("地胡");
                // }

                if (userData.diaoBaiDa) {
                    actionArr.push("吊百搭");
                }

                if (userData.diaobaida) {
                    actionArr.push("吊百搭");
                }

                if (userData.duanbaida) {
                    actionArr.push("断百搭");
                }

                // if(userData.isganghu){
                //     actionArr.push("杠胡");
                // }

                // if(userData.jingouhu){
                //     actionArr.push("金钩胡");
                // }

                if (userData.haidihu) {
                    actionArr.push("海底胡");
                }
                if (actionArr.length > 0) {
                    this._gameover.getChildByName("result_list").children[i].getChildByName("reason").active = true;
                    this.diArr[i].active = true
                }
            }
            console.log('piaohua', cc.fy.gameNetMgr.seats[i].piaohua)

            if (cc.fy.gameNetMgr.seats[i].piaohua > 0) {
                actionArr.push(String("飘分:" + cc.fy.gameNetMgr.seats[i].piaohua));
                this._gameover.getChildByName("result_list").children[i].getChildByName("reason").active = true;
                this.diArr[i].active = true
            }

            console.log('piaohua', cc.fy.gameNetMgr.seats[i])
            for (var j = 0; j < cc.fy.gameNetMgr.seats.length; ++j) {
                if (cc.fy.gameNetMgr.seats[j].userid == data[i].userId) {
                    seatView.username.string = cc.fy.utils.subStringCN(cc.fy.gameNetMgr.seats[j].name, 10, true);
                    if (data[i].userId == cc.fy.userMgr.userId) {
                        seatView.username.node.color = new cc.color(255, 249, 154)
                    }
                    var info = cc.fy.gameNetMgr.seats[j];
                    //设置头像
                    seatView.head.setUserID(info.userid);
                }
            }
            var strfan = "番";
            if (cc.fy.gameNetMgr.conf != null && cc.fy.gameNetMgr.conf.maxFan == userData.fan) {
                strfan = "番"
            }
            let str = userData.fan > 0 ? userData.fan + strfan : "";
            actionArr.push(String(' ' + str));

            seatView.zhuang.active = cc.fy.gameNetMgr.button == i;
            seatView.reason.string = actionArr.join(",");
            seatView.reason.node.active = true

            if (userData.score >= 0) {
                seatView.score.string = "+" + userData.score;
                seatView.score.node.active = true
                seatView.score1.node.active = false
            }
            else {
                seatView.score1.string = userData.score;
                seatView.score.node.active = false
                seatView.score1.node.active = true
            }

            var hupai = -1;
            if (hued) {
                hupai = userData.holds.pop();
            }
            cc.fy.mahjongmgr.sortSZMJ(userData.holds);
            //胡牌不参与排序   
            if (hued) {
                userData.holds.push(hupai);
            }
            //隐藏所有牌
            for (var k = 0; k < seatView.mahjongs.childrenCount; ++k) {
                var n = seatView.mahjongs.children[k];
                n.active = false;
            }
            var lackingNum = (userData.pengs.length + numOfGangs) * 3;
            //显示相关的牌
            for (var k = 0; k < userData.holds.length; ++k) {
                var pai = userData.holds[k];
                var n = seatView.mahjongs.children[k + lackingNum];
                n.active = true;
                var sprite = n.getComponent(cc.Sprite);
                sprite.spriteFrame = cc.fy.mahjongmgr.getSpriteFrameByMJID("B_", pai);
                this.loadMark(n, pai, userData.baida)

                n.scaleX = 1.4
                n.scaleY = 1.4
                // 胡牌的标识
                var huico = n.getChildByName("huicon");
                if (huico) {
                    huico.active = hued;
                }
            }

            for (var k = 0; k < seatView._pengandgang.length; ++k) {
                seatView._pengandgang[k].active = false;
            }

            //初始化杠牌
            var index = 0;
            var gangs = userData.angangs;
            for (var k = 0; k < gangs.length; ++k) {
                var mjid = gangs[k];
                this.initPengAndGangs(seatView, index, mjid, "angang");
                index++;
            }

            var gangs = userData.diangangs;
            for (var k = 0; k < gangs.length; ++k) {
                var mjid = gangs[k];
                this.initPengAndGangs(seatView, index, mjid, "diangang");
                index++;
            }

            var gangs = userData.wangangs;
            for (var k = 0; k < gangs.length; ++k) {
                var mjid = gangs[k];
                this.initPengAndGangs(seatView, index, mjid, "wangang");
                index++;
            }

            //初始化碰牌
            var pengs = userData.pengs
            if (pengs) {
                for (var k = 0; k < pengs.length; ++k) {
                    var mjid = pengs[k];
                    this.initPengAndGangs(seatView, index, mjid, "peng");
                    index++;
                }
            }
        }

    },
    onGameOver_SZWJ(data) {
        console.log('wujiang gameover', data)
        this._btnBack.active = false;
        this._btnExit.active = false;
        this._btnDissolve.active = false;
        this._btnWeichat.active = false;
        if (data.length == 0) {
            this._gameresult.active = true;
            return;
        }
        //飘花阶段不显示手牌
        // if(cc.fy.gameNetMgr.gamestate == "piaohua")
        // {
        //     this.onGameOver_Nopai(data);
        //     return;
        // }

        this._gameresult.active = false;
        this._gameover.active = false;
        this._pingju.active = false;
        this._win.active = false;
        this._lose.active = false;
        var myscore = data[cc.fy.gameNetMgr.seatIndex].score;
        if (myscore > 0) {
            this._win.active = true;
        }
        else if (myscore < 0) {
            this._lose.active = true;
        }
        else {
            var isPingju = true;
            for (var i = 0; i < this._gamePlayer; ++i) {
                if (data[i].score > 0 || data[i].score < 0) {
                    isPingju = false;
                    break;
                }
            }
            if (isPingju) {
                this._pingju.active = true;
            }
        }
        //显示玩家信息
        for (var i = 0; i < this._gamePlayer; ++i) {
            var seatView = this._seats[i];
            seatView.zimo.active = false;
            seatView.fangpao.active = false;
            seatView.imghu.active = false;
            seatView.imgqgh.active = false;
            seatView.imgbg.active = false;
            seatView.reason.string = ''
            var userData = data[i];
            var hued = false;
            //胡牌的玩家才显示 是否清一色
            var numOfGangs = userData.angangs.length + userData.wangangs.length + userData.diangangs.length;
            var actionArr = [];
            var actionArr_1 = [];
            var actionArr_2 = [];
            this._gameover.getChildByName("result_list").children[i].getChildByName("reason").active = false;
            for (var j = 0; j < userData.actions.length; ++j) {
                var ac = userData.actions[j];
                if (ac.type == "zimo" || ac.type == "ganghua" || ac.type == "dianganghua" || ac.type == "hu" || ac.type == "gangpaohu" || ac.type == "qiangganghu" || ac.type == "chadajiao") {
                    if (ac.type == "zimo") {
                        //自摸
                        seatView.zimo.active = true;
                        // if (cc.fy.localStorage.getItem("zimo_score") == 1) {
                        //     actionArr.push("自摸+4");
                        // } else {
                        //     actionArr.push("自摸+1");
                        // }

                    }
                    else if (ac.type == "qiangganghu") {
                        seatView.imgqgh.active = true;

                    }
                    else if (ac.type == "ganghua" || ac.type == "dianganghua") {
                        //actionArr.push("杠开 2 倍");
                    }

                    if (seatView.zimo.active == false && seatView.imgqgh.active == false) {
                        seatView.imghu.active = true;

                    }
                    hued = true;
                }
                else if (ac.type == "fangpao" || ac.type == "beiqianggang") {
                    seatView.fangpao.active = true;
                }
            }
            if (hued) {
                seatView.imgbg.active = true;
                if (userData.isQingYise) {
                    actionArr.push("清一色" + (9 * userData.difen));
                }

                if (userData.isHaiDiLaoYue) {
                    actionArr.push("海底捞月" + (1 * userData.difen));
                }

                if (userData.isHunYiSe) {
                    actionArr.push("混一色" + (2 * userData.difen));
                }

                if (userData.isTianHu) {
                    actionArr.push("天胡" + (19 * userData.difen));
                }

                if (userData.isDiHu) {
                    actionArr.push("地胡" + (9 * userData.difen));
                }

                if (userData.isQiangGangHu) {
                    actionArr.push("抢杠" + (1 * userData.difen));
                }

                if (userData.isGanQian) {
                    actionArr.push("干嵌 " + (1 * userData.difen));
                }

                if (userData.isGangKai) {
                    actionArr.push("杠开" + (1 * userData.difen));
                }

                if (userData.menFengCnt > 0) {
                    actionArr.push("门风" + (userData.menFengCnt * userData.difen));
                }

                if (userData.taitou) {
                    actionArr.push("台头" + (1 * userData.difen));
                }

                if (userData.isDaDiaoChe) {
                    actionArr.push("大吊车" + (1 * userData.difen));
                }

                if (userData.isRaoDa) {
                    actionArr.push("绕搭" + (1 * userData.difen));
                }

                if (userData.isDiuDaRaoDa) {
                    actionArr.push("丢搭绕搭" + (1 * userData.difen));
                }

                if (userData.isDaRaoDa) {
                    actionArr.push("搭绕搭" + (1 * userData.difen));
                }

                if (userData.isPengPengHu) {
                    actionArr.push("碰碰胡" + (2 * userData.difen));
                }

                if (userData.isSanBaiDa) {
                    actionArr.push("三百搭" + (9 * userData.difen));
                }

                if (userData.isZiYiSe) {
                    actionArr.push("字一色" + (20 * userData.difen));
                }
                if (userData.taiTouCnt > 0) {
                    actionArr_1.push(" 台头: " + userData.taiTouCnt * userData.difen);
                }
                if (userData.minggangCnt > 0) {
                    actionArr_1.push("明杠" + userData.minggangCnt * userData.difen);
                }
                if (userData.angangCnt > 0) {
                    actionArr_1.push("暗杠" + userData.angangCnt * userData.difen);
                }
                actionArr_2.push("底胡" + (1 * userData.difen));
                // if(userData.menFengCnt > 0){
                //     actionArr_2.push("门风："+ userData.menFengCnt*userData.difen);
                // }
                if (userData.isHuangFan) {
                    actionArr_2.push("黄翻");
                }
                if (userData.isQiangGangHu) {
                    actionArr_2.push("抢杠胡*3");
                }
                // if(userData.isHuangFengFan){
                //     actionArr_2.push("黄风翻");
                // }
                // if(cc.fy.gameNetMgr.numOfDouble > 0)
                // {
                //     seatView.reason.string = actionArr.join(",") + " 共 " + userData.taiCnt + "台" ;//+ " 牌局 2 倍";//userData.flowersCnt
                // }
                // else{
                //     seatView.reason.string = actionArr.join(",") + " 共 " + userData.taiCnt + " 台";
                // }
                seatView.reason.string = actionArr_1.join(",") + ' ' + actionArr.join(",") + ' ' + actionArr_2.join(",") + " 共 " + userData.taiCnt + " 台 ";
                // seatView.taiTouCnt.string =  ;
                // seatView.menFengCnt.string = ;
                // seatView.flowerMark.active = true;
                // seatView.numOfFlower.string = "x" + cc.fy.gameNetMgr.seats[i].flowers.length;
                if (actionArr.length > 0 || actionArr_1.length > 0 || actionArr_2.length > 0) {
                    this._gameover.getChildByName("result_list").children[i].getChildByName("reason").active = true;
                    this.diArr[i].active = true;
                }
            } else {
                this._gameover.getChildByName("result_list").children[i].getChildByName("reason").active = false;
                this.diArr[i].active = false;
            }
            console.log('piaohua', cc.fy.gameNetMgr.seats[i])
            for (var j = 0; j < this._gamePlayer; ++j) {
                if (cc.fy.gameNetMgr.seats[j].userid == data[i].userId) {
                    seatView.username.string = cc.fy.utils.subStringCN(cc.fy.gameNetMgr.seats[j].name, 10, true);
                    if (data[i].userId == cc.fy.userMgr.userId) {
                        seatView.username.node.color = new cc.color(255, 249, 154)
                    }
                    var info = cc.fy.gameNetMgr.seats[j];
                    //设置头像
                    seatView.head.setUserID(info.userid);
                    seatView.hua.active = false
                }
            }

            seatView.zhuang.active = cc.fy.gameNetMgr.button == i;
            seatView.reason.node.active = true

            if (userData.score >= 0) {
                seatView.score.string = "+" + userData.score;
                seatView.score.node.active = true
                seatView.score1.node.active = false
            }
            else {
                seatView.score1.string = userData.score;
                seatView.score.node.active = false
                seatView.score1.node.active = true
            }
            var hupai = -1;
            if (hued) {
                hupai = userData.holds.pop();
            }
            cc.fy.mahjongmgr.sortSZMJ(userData.holds);
            //胡牌不参与排序   
            if (hued) {
                userData.holds.push(hupai);
            }
            //隐藏所有牌
            for (var k = 0; k < seatView.mahjongs.childrenCount; ++k) {
                var n = seatView.mahjongs.children[k];
                n.active = false;
            }
            var lackingNum = (userData.pengs.length + numOfGangs) * 3;
            //显示相关的牌
            for (var k = 0; k < userData.holds.length; ++k) {
                var pai = userData.holds[k];
                var n = seatView.mahjongs.children[k + lackingNum];
                n.active = true;
                var sprite = n.getComponent(cc.Sprite);
                sprite.spriteFrame = cc.fy.mahjongmgr.getSpriteFrameByMJID("B_", pai);
                if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZWJ) {
                    this.loadMark(n, pai, userData.baida)
                }
                n.scaleX = 1.4
                n.scaleY = 1.4
                // 胡牌的标识
                var huico = n.getChildByName("huicon");
                if (huico) {
                    huico.active = hued;
                }
            }

            for (var k = 0; k < seatView._pengandgang.length; ++k) {
                seatView._pengandgang[k].active = false;
            }

            //初始化杠牌
            var index = 0;
            var gangs = userData.angangs;
            for (var k = 0; k < gangs.length; ++k) {
                var mjid = gangs[k];
                this.initPengAndGangs(seatView, index, mjid, "angang");
                index++;
            }

            var gangs = userData.diangangs;
            for (var k = 0; k < gangs.length; ++k) {
                var mjid = gangs[k];
                this.initPengAndGangs(seatView, index, mjid, "diangang");
                index++;
            }

            var gangs = userData.wangangs;
            for (var k = 0; k < gangs.length; ++k) {
                var mjid = gangs[k];
                this.initPengAndGangs(seatView, index, mjid, "wangang");
                index++;
            }

            //初始化碰牌
            var pengs = userData.pengs
            if (pengs) {
                for (var k = 0; k < pengs.length; ++k) {
                    var mjid = pengs[k];
                    this.initPengAndGangs(seatView, index, mjid, "peng");
                    index++;
                }
            }
        }

    },
    onGameOver_SZER(newdata) {
        this._task.active = false;
        var taskData = newdata.task;
        var data = newdata.results;
        this.showTask(taskData);

        this._btnBack.active = false;
        this._btnExit.active = false;
        this._btnDissolve.active = false;
        this._btnWeichat.active = false;
        var fanCards = data.fanCards;
        if (data.length == 0) {
            this._gameresult.active = true;
            return;
        }

        this._gameresult.active = false;
        this._gameover.active = false;

        this._pingju.active = false;
        this._win.active = false;
        this._lose.active = false;
        var myscore = data[cc.fy.gameNetMgr.seatIndex].score;
        if (myscore > 0) {
            this._win.active = true;
        }
        else if (myscore < 0) {
            this._lose.active = true;
        }
        else {
            var isPingju = true;
            for (var i = 0; i < this._gamePlayer; ++i) {
                if (data[i].score > 0 || data[i].score < 0) {
                    isPingju = false;
                    break;
                }
            }
            if (isPingju) {
                this._pingju.active = true;
            }
        }
        if (fanCards != null && fanCards.length > 0) {
            console.log("==>> data.fanCard = " + fanCards);
            this._fanpaiNode.active = true;
            var fanpaiChildren = this._fanpaiNode.getChildren();
            for (let h = 0; h < fanpaiChildren.length; h++) {
                fanpaiChildren[h].active = false
            }
            this._sprFanpai.active = true;
            for (var f = 0; f < fanCards.length; ++f) {
                fanpaiChildren[f].active = true;
                var sprite = fanpaiChildren[f].getComponent(cc.Sprite);
                if (fanCards[f] != -1) {
                    // jnmvnipdaj 新牌替换
                    //cc.fy.mahjongmgr.createMahjongNode("up", fanCards[f], sprite.node, false);
                    sprite.spriteFrame = cc.fy.mahjongmgr.getSpriteFrameByMJID("B_", fanCards[f]);
                    //sprite.node.scale = this._nodescale;
                }
                else {
                    // jnmvnipdaj 新牌背替换
                    cc.fy.mahjongmgr.getNewEmptySpriteFrame("myself", sprite, false);
                    // sprite.spriteFrame = cc.fy.mahjongmgr.getEmptySpriteFrame("myself");
                    //sprite.node.scale = this._nodescale;
                }
            }
        }
        else {
            this._fanpaiNode.active = false;
             this._sprFanpai.active = false;
            console.log("==>> data.fanCard = null ");
        }
        //显示玩家信息
        for (var i = 0; i < this._gamePlayer; ++i) {
            var seatView = this._seats[i];
            seatView.zimo.active = false;
            seatView.fangpao.active = false;
            seatView.imghu.active = false;
            seatView.imgqgh.active = false;
            seatView.imgbg.active = false;
            seatView.reason.string = ''
            var userData = data[i];
            var zhuamaData = data[i].data;
            var hued = false;
            //胡牌的玩家才显示 是否清一色
            var numOfGangs = userData.angangs.length + userData.wangangs.length + userData.diangangs.length;
            var actionArr = [];
            var zhuaMaArr = [];
            seatView.zhuama.string = "";
            seatView.gangWinScore.string = "";
            seatView.gangLoseScore.string = "";
            this._gameover.getChildByName("result_list").children[i].getChildByName("reason").active = false;
            for (var j = 0; j < userData.actions.length; ++j) {
                var ac = userData.actions[j];
                if (ac.type == "zimo" || ac.type == "ganghua" || ac.type == "dianganghua" || ac.type == "hu" || ac.type == "gangpaohu" || ac.type == "qiangganghu" || ac.type == "chadajiao") {
                    if (ac.type == "zimo") {
                        //自摸
                        seatView.zimo.active = true;

                        // this._gameover.getChildByName("result_list").children[i].getChildByName("reason").active = true;
                    }
                    else if (ac.type == "qiangganghu") {
                        seatView.imgqgh.active = true;

                        // this._gameover.getChildByName("result_list").children[i].getChildByName("reason").active = true;
                    }
                    else if (ac.type == "ganghua" || ac.type == "dianganghua") {
                        //actionArr.push("杠开 2 倍");
                    }

                    if (seatView.zimo.active == false && seatView.imgqgh.active == false) {
                        seatView.imghu.active = true;

                        //  this._gameover.getChildByName("result_list").children[i].getChildByName("reason").active = true;
                    }
                    hued = true;
                }
                else if (ac.type == "fangpao") {
                    seatView.fangpao.active = true;
                }
            }

            if (hued) {
                seatView.imgbg.active = true;
                if (userData.double > 0) {
                    actionArr.push("分数翻倍×" + Math.pow(2, userData.double));
                }
                if (userData.dasixi) {
                    actionArr.push("大四喜:88");
                }
                if (userData.dasanyuan) {
                    actionArr.push("大三元:88");
                }
                if (userData.jiubaoliandeng) {
                    actionArr.push("九莲宝灯:88");
                }
                if (userData.tianhe) {
                    actionArr.push("天和:88");
                }
                if (userData.dihe) {
                    actionArr.push("地和:88");
                }
                if (userData.renhe) {
                    actionArr.push("人和:88");
                }
                if (userData.sigang) {
                    actionArr.push("四杠:88");
                }
                if (userData.qiliandui) {
                    actionArr.push("七连对:88");
                }
                if (userData.baiwanshi) {
                    actionArr.push("百万石:88");
                }
                if (userData.xiaosixi) {
                    actionArr.push("小四喜:64");
                }
                if (userData.xiaosanyuan) {
                    actionArr.push("小三元:64");
                }
                if (userData.ziyise) {
                    actionArr.push("字一色:64");
                }
                if (userData.sianke) {
                    actionArr.push("四暗刻:64");
                }
                if (userData.yiseshuanglonghui) {
                    actionArr.push("一色双龙会:64");
                }
                if (userData.yisesitongshun) {
                    actionArr.push("一色四同顺:48");
                }
                if (userData.yisesijiegao) {
                    actionArr.push("一色四节高:48");
                }
                if (userData.yisesibugao) {
                    actionArr.push("一色四步高:32");
                }
                if (userData.sangang) {
                    actionArr.push("三杠:32");
                }
                if (userData.hunjiuyao) {
                    actionArr.push("混九幺:32");
                }
                if (userData.qidui) {
                    actionArr.push("七对:24");
                }
                if (userData.yisesantongshun) {
                    actionArr.push("一色三同顺:24");
                }
                if (userData.yisesanjiegao) {
                    actionArr.push("一色三节高:24");
                }
                if (userData.qingyise) {
                    actionArr.push("清一色:24");
                }
                if (userData.qinglong) {
                    actionArr.push("清龙:16");
                }
                if (userData.yisesanbugao) {
                    actionArr.push("一步三色高:16");
                }
                if (userData.sananke) {
                    actionArr.push("三暗刻:16");
                }
                if (userData.tianting) {
                    actionArr.push("天听:16");
                }
                if (userData.dayuwu) {
                    actionArr.push("大于5:12");
                }
                if (userData.xiaoyuwu) {
                    actionArr.push("小于5:12");
                }
                if (userData.sanfengke) {
                    actionArr.push("三风刻:12");
                }
                if (userData.miaoshouhuichun) {
                    actionArr.push("妙手回春:8");
                }
                if (userData.haidilaoyue) {
                    actionArr.push("海底捞月:8");
                }
                if (userData.gangshangkaihua) {
                    actionArr.push("杠上开花:8");
                }
                if (userData.qiangganghu) {
                    actionArr.push("抢杠胡:8");
                }
                if (userData.pengpenghu) {
                    actionArr.push("碰碰胡:6");
                }
                if (userData.huiyise) {
                    actionArr.push("混一色:6");
                }
                if (userData.shuangangang) {
                    actionArr.push("双暗杠:6");
                }
                if (userData.shuangjianke) {
                    actionArr.push("双箭刻:6");
                }
                if (userData.quanqiuren) {
                    actionArr.push("全求人:6");
                }
                if (userData.quandaiyao) {
                    actionArr.push("全带幺:4");
                }
                if (userData.buqiuren) {
                    actionArr.push("不求人:4");
                }
                if (userData.shuangminggang) {
                    actionArr.push("双明杠:4");
                }
                if (userData.hejuezhang) {
                    actionArr.push("和绝张:4");
                }
                if (userData.zhili) {
                    actionArr.push("立直:4");
                }
                if (userData.jianke) {
                    actionArr.push("箭刻:2");
                }
                if (userData.menqing) {
                    actionArr.push("门清:2");
                }
                if (userData.pinghe) {
                    actionArr.push("平和:2");
                }
                if (userData.siguiyi) {
                    actionArr.push("四归一:2");
                }
                if (userData.shuanganke) {
                    actionArr.push("双暗刻:2");
                }
                if (userData.an_gang) {
                    actionArr.push("暗杠:2");
                }
                if (userData.duanyao) {
                    actionArr.push("断幺:2");
                }
                if (userData.erwubajiang) {
                    actionArr.push("二五八将:1");
                }
                if (userData.yaojiutou) {
                    actionArr.push("幺九头:1");
                }
                if (userData.baoting) {
                    actionArr.push("报听:1");
                }
                if (userData.yibangao) {
                    actionArr.push("一般高:1");
                }
                if (userData.lianliu) {
                    actionArr.push("连六:1");
                }
                if (userData.laoshaofu) {
                    actionArr.push("老少付:1");
                }
                if (userData.yaojiuke) {
                    actionArr.push("幺九刻:1");
                }
                if (userData.ming_gang) {
                    actionArr.push("明杠:1");
                }
                if (userData.bianzhang) {
                    actionArr.push("边张:1");
                }
                if (userData.kanzhang) {
                    actionArr.push("坎张:1");
                }
                if (userData.dandiaojiang) {
                    actionArr.push("单调将:1");
                }
                if (userData.zi_mo) {
                    actionArr.push("自摸:1");
                }
                if (actionArr.length > 0) {
                    this._gameover.getChildByName("result_list").children[i].getChildByName("reason").active = true;
                    this.diArr[i].active = true
                }
            }
            console.log('piaohua', cc.fy.gameNetMgr.seats[i])
            for (var k = 0; k < this._gamePlayer; ++k) {
                if (cc.fy.gameNetMgr.seats[k].userid == data[i].userId) {
                    seatView.username.string = cc.fy.utils.subStringCN(cc.fy.gameNetMgr.seats[k].name, 10, true);
                    if (data[i].userId == cc.fy.userMgr.userId) {
                        seatView.username.node.color = new cc.color(255, 249, 154)
                    }
                    var info = cc.fy.gameNetMgr.seats[k];
                    //设置头像
                    seatView.head.setUserID(info.userid);
                    seatView.hua.active = false
                }
            }
            seatView.zhuang.active = this._isZhuang == i;
            seatView.reason.string = actionArr.join(",");

            if (userData.score >= 0) {
                seatView.score.string = "+" + userData.score;
                seatView.score.node.active = true
                seatView.score1.node.active = false
            }
            else {
                seatView.score1.string = userData.score;
                seatView.score.node.active = false
                seatView.score1.node.active = true
            }
            var hupai = -1;
            if (hued) {
                hupai = userData.holds.pop();
            }
            cc.fy.mahjongmgr.sortSZMJ(userData.holds);
            //胡牌不参与排序   
            if (hued) {
                userData.holds.push(hupai);
            }
            //隐藏所有牌
            for (var k = 0; k < seatView.mahjongs.childrenCount; ++k) {
                var n = seatView.mahjongs.children[k];
                n.active = false;
            }
            var lackingNum = (userData.pengs.length + numOfGangs) * 3 + userData.chipais.length;
            //显示相关的牌
            for (var k = 0; k < userData.holds.length; ++k) {
                var pai = userData.holds[k];
                var n = seatView.mahjongs.children[k + lackingNum];
                n.active = true;
                var sprite = n.getComponent(cc.Sprite);
                sprite.spriteFrame = cc.fy.mahjongmgr.getSpriteFrameByMJID("B_", pai);
                n.scaleX = 1.4
                n.scaleY = 1.4
                // 胡牌的标识
                var huico = n.getChildByName("huicon");
                if (huico) {
                    huico.active = hued;
                }
            }

            for (var k = 0; k < seatView._pengandgang.length; ++k) {
                seatView._pengandgang[k].active = false;
            }

            //初始化杠牌
            var index = 0;
            var gangs = userData.angangs;
            for (var k = 0; k < gangs.length; ++k) {
                var mjid = gangs[k];
                this.initPengAndGangs(seatView, index, mjid, "angang");
                index++;
            }

            var gangs = userData.diangangs;
            for (var k = 0; k < gangs.length; ++k) {
                var mjid = gangs[k];
                this.initPengAndGangs(seatView, index, mjid, "diangang");
                index++;
            }

            var gangs = userData.wangangs;
            for (var k = 0; k < gangs.length; ++k) {
                var mjid = gangs[k];
                this.initPengAndGangs(seatView, index, mjid, "wangang");
                index++;
            }

            //初始化碰牌
            var pengs = userData.pengs
            if (pengs) {
                for (var k = 0; k < pengs.length; ++k) {
                    var mjid = pengs[k];
                    this.initPengAndGangs(seatView, index, mjid, "peng");
                    index++;
                }
            }

            var chipais = userData.chipais;
            if (chipais) {
                for (var k = 0; k < chipais.length; k += 3) {
                    var mjid = chipais[k];
                    this.initPengAndGangs(seatView, index, mjid, "chi");
                    index++;
                }
            }

        }


    },

    onGameOver_Nopai: function (data) {
        this._gameover_nopai.active = true;
        var listRoot = this._gameover_nopai.getChildByName("result_list");
        var seatsTemp = [];
        for (var i = 1; i <= 4; ++i) {
            var s = "s" + i;
            var sn = listRoot.getChildByName(s);
            var viewdata = {};
            viewdata.username = sn.getChildByName('username').getComponent(cc.Label);

            viewdata.score = sn.getChildByName('score').getComponent(cc.Label);
            viewdata.score1 = sn.getChildByName('score1').getComponent(cc.Label);
            viewdata.zhuang = sn.getChildByName('zhuang');
            seatsTemp.push(viewdata);
        }

        //显示玩家信息
        for (var i = 0; i < 4; ++i) {
            var seatView = seatsTemp[i];
            var userData = data[i];

            seatView.username.string = cc.fy.utils.subStringCN(cc.fy.gameNetMgr.seats[i].name, 10, true);
            if (data[i].userId == cc.fy.userMgr.userId) {
                seatView.username.node.color = new cc.color(255, 249, 154)
            }
            var info = cc.fy.gameNetMgr.seats[i];
            //设置头像
            seatView.head.setUserID(info.userid);

            seatView.zhuang.active = cc.fy.gameNetMgr.button == i;

            if (userData.score >= 0) {
                seatView.score.string = "+" + userData.score;
                //seatView.score1.string = "+" + userData.score;
                seatView.score.node.active = true
                seatView.score1.node.active = false
                //seatView.score.node.color = new cc.Color(255, 189, 22);  
            }
            else {
                //seatView.score.string = userData.score;
                seatView.score1.string = userData.score;
                seatView.score.node.active = false
                seatView.score1.node.active = true
                //seatView.score.node.color = new cc.Color(255, 71, 41);
            }
        }
    },
    showTask: function (data) {
        if (data) {
            var index = data.index;
            var pai = data.pai;
            var double = data.double;
            var state = data.state;
            
            if (state != 2) {
                this._task.active = false;
                return;
            }
            this._task.active = true;
            var lbltask = this._task.getChildByName("taskinfo").getComponent(cc.Label);
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
            var mj = this._task.getChildByName("mj").getComponent(cc.Sprite);
            mj.spriteFrame = cc.fy.mahjongmgr.getSpriteFrameByMJID("B_", pai);

            var doubleinfo = this._task.getChildByName("doubleinfo").getComponent(cc.Label);
            doubleinfo.string = "分数×" + double;

            var title = this._task.getChildByName("title").getComponent(cc.Label);
            title.string = "已完成";
        }
        else {
          
            this._task.active = false;
        }
    },
    initPengAndGangs: function (seatView, index, mjid, flag) {

        var pgroot = null;
        if (seatView._pengandgang.length <= index) {
            pgroot = cc.instantiate(cc.fy.mahjongmgr.pengPrefabSelf);
            pgroot.scaleX = 1
            pgroot.scaleY = 1
            seatView._pengandgang.push(pgroot);
            seatView.mahjongs.addChild(pgroot);

        }
        else {
            pgroot = seatView._pengandgang[index];
            pgroot.active = true;
            pgroot.scaleX = 1
            pgroot.scaleY = 1
        }

        var sprites = pgroot.getComponentsInChildren(cc.Sprite);
        if (flag == "chi") {
            var _mjid = mjid;
            for (var s = 0; s < sprites.length; ++s) {
                var sprite = sprites[s];
                if (sprite.node.name == "item_3") {
                    sprite.node.active = false;
                }
                else {
                    // sprite.node.scaleX = 1.2;
                    // sprite.node.scaleY = 1.2;
                    sprite.spriteFrame = cc.fy.mahjongmgr.getSpriteFrameByMJID("B_", _mjid);
                    _mjid++;
                }
            }
        }
        else {
            for (var s = 0; s < sprites.length; ++s) {
                var sprite = sprites[s];
                // sprite.node.scaleX = 1.2;
                // sprite.node.scaleY = 1.2;
                if (sprite.node.name == "item_3") {
                    var isGang = flag != "peng";
                    sprite.node.active = isGang;
                    if (flag == "angang") {
                        sprite.spriteFrame = cc.fy.mahjongmgr.getSpriteFrameByMJID("B_", mjid);
                    }
                    else {
                        sprite.spriteFrame = cc.fy.mahjongmgr.getSpriteFrameByMJID("B_", mjid);
                    }

                }
                else {
                    if (flag == "angang") {
                        sprite.spriteFrame = cc.fy.mahjongmgr.getEmptySpriteFrame("myself");
                        // sprite.node.scaleX = 1.2;
                        // sprite.node.scaleY = 1.2;
                    }
                    else {
                        sprite.spriteFrame = cc.fy.mahjongmgr.getSpriteFrameByMJID("B_", mjid);
                    }
                }
            }
        }
        console.log(index)
        pgroot.x = -350 + index * 55 * 3 + index * 10 - 9 + 12 * index + 20 * index//index * 55 * 3 + index * 10 - 9 + 12 * index-140*index;

        pgroot.y = -10;
    },
    onBtnReadyClicked: function () {
        console.log("onBtnReadyClicked");
        if (this._isGameEnd) {
            this._gameresult.active = true;
        }
        else {
            console.log("send ready");
            cc.fy.net.send('ready');
        }
        this._gameover.active = false;
        this._gameover_nopai.active = false;
        if (cc.fy.gameNetMgr.conf.type == 2) {
            this._gameover = this.node.getChildByName("game_over_hamj");
            this._fanpaiNode = this._gameover.getChildByName("fanpaiNode");
            this._fanpaiNode.active = false;
        }
    },
    onBtnShareClicked: function () {
        this._btnShare = cc.find("Canvas/gameMain/game_over_hamj/btnLayout/btnShare");
        if (this._btnShare) {
            var btnReady = cc.find("Canvas/gameMain/game_over_hamj/btnLayout/btnReady");
            this._btnShare.getComponent(cc.Button).interactable = false;
            btnReady.getComponent(cc.Button).interactable = false;
            this.schedule(function () {
                btnReady.getComponent(cc.Button).interactable = true;
                this._btnShare.getComponent(cc.Button).interactable = true;
            }, 5);
        }

        if (cc.sys.isNative) {
            cc.fy.anysdkMgr.shareResult(1);
        }
    },
    onLabBtnClicked0: function () {
        var button = this._paiStyleBtn.getChildByName("labBtn0");
        var lab = cc.find("Canvas/gameMain/game_over_hamj/result_list/s1/reason");
        var spr = cc.find("Canvas/gameMain/game_over_hamj/showpaistyle/spr0");
        this.showBtn(button);
        this.reasonToSpr(spr, lab);
    },
    onLabBtnClicked1: function () {
        var button = this._paiStyleBtn.getChildByName("labBtn1");
        var lab = cc.find("Canvas/gameMain/game_over_hamj/result_list/s2/reason");
        var spr = cc.find("Canvas/gameMain/game_over_hamj/showpaistyle/spr1");
        this.showBtn(button);
        this.reasonToSpr(spr, lab);
    },
    onLabBtnClicked2: function () {
        var button = this._paiStyleBtn.getChildByName("labBtn2");
        var lab = cc.find("Canvas/gameMain/game_over_hamj/result_list/s3/reason");
        var spr = cc.find("Canvas/gameMain/game_over_hamj/showpaistyle/spr2");
        this.showBtn(button);
        this.reasonToSpr(spr, lab);
    },
    onLabBtnClicked3: function () {
        var button = this._paiStyleBtn.getChildByName("labBtn3");
        var lab = cc.find("Canvas/gameMain/game_over_hamj/result_list/s4/reason");
        var spr = cc.find("Canvas/gameMain/game_over_hamj/showpaistyle/spr3");
        this.showBtn(button);
        this.reasonToSpr(spr, lab);
    },
    showBtn: function (button) {
        if (button == null) {
            return;
        }
        var norspr = button.getChildByName("norspr");
        var chkspr = button.getChildByName("chkspr");
        if (norspr.active && (!chkspr.active)) {
            norspr.active = false;
            chkspr.active = true;
        }
        else if ((!norspr.active) && chkspr.active) {
            norspr.active = true;
            chkspr.active = false;
        }
    },

    onBtnClose: function () {
        // this._zhuapai.active = false;
        this.onGameOver(this._overdata.results);
        this._gameover.active = true;

    },
    reasonToSpr: function (spr, lab) {
        if (spr == null || lab == null) {
            return;
        }
        if (lab.getComponent(cc.Label).string.length == 0) {
            return;
        }
        else {
            var str = spr.getChildByName("Label");
            str.getComponent(cc.Label).string = lab.getComponent(cc.Label).string;
        }

        if (spr.active) {
            spr.active = false;
        }
        else {
            spr.active = true;
            if (lab.getComponent(cc.Label).string.length > 0) {
                spr.height = str.height + 10;
            }
        }

        if (lab.active) {
            lab.active = false;
        }
        else {
            lab.active = true;
        }
    },
    onBtnXipaiClicked: function (event) {
        if (this._isGameEnd) {
            this._gameresult.active = true;
            this._gameover.active = false;
            this._gameover_nopai.active = false;
        }
        else {
            cc.fy.net.send('shuffle_oneself');
            this._gameover.active = false;
            this._gameover_nopai.active = false;
        }
    },
    loadMark: function (snode, pai, baida) {
        cc.loader.loadRes("prefabs/baidaMark", function (err, prefab) {
            snode.removeAllChildren()
            var mark = cc.instantiate(prefab);
            snode.addChild(mark);
            mark.scaleX = 0.5
            mark.scaleY = 0.5
            mark.x = -14
            mark.y = 28
            mark.active = baida == pai
        });
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
