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
        _options: null,
        _optionLst: [],
        _actionCount: 0,
        _ndBtnGuo: null,
        _optionsLab: null,
        _passHu: false,
        // _playEfxs: [],

        // _ndChiTip: null,
        // _ndChiTipLst: [],
        _clickTime: 0,
    },

    // use this for initialization
    onLoad: function () {
        this.initEventHandlers();
        this.initView();
    },

    initView: function () {
        var gameChild = this.node.getChildByName("game");
        this._optionsLab = gameChild.getChildByName("opsLab");
        this._optionsLab.active = false;

        var sides = ["myself", "right", "up", "left"];
        for (var i = 0; i < sides.length; ++i) {
            var side = sides[i];

            var sideChild = gameChild.getChildByName(side);
            // this._playEfxs.push(sideChild.getChildByName("play_efx").getComponent(cc.Animation));
        }

        this._options = gameChild.getChildByName("ops");
        this._optionLst = [];
        var opt = this._options.getChildByName("op");
        this._optionLst.push(opt);

        // 点击事件
        this._ndBtnGuo = this._options.getChildByName("btnGuo");
        cc.fy.utils.addClickEvent(this._ndBtnGuo, this.node, "GameAction", "onOptionClicked");
        var btns = opt.getComponentsInChildren(cc.Button);
        for (var i = 0; i < btns.length; i++) {
            if (btns[i]) {
                cc.fy.utils.addClickEvent(btns[i].node, this.node, "GameAction", "onOptionClicked");
            }
        }

        // 吃牌tip
        this._ndChiTip = gameChild.getChildByName("chipaitip");
        var chiBtnCancel = this._ndChiTip.getChildByName("btnCancel").getComponent(cc.Button);
        cc.fy.utils.addClickEvent(chiBtnCancel, this.node, "GameAction", "onChiTipCancel");
        var chiTipItem = this._ndChiTip.getChildByName("item_0");
        cc.fy.utils.addClickEvent(chiTipItem, this.node, "GameAction", "onChiTipClicked");
        this._ndChiTipLst.push(chiTipItem);
        this.hideChiTip();

        this.hideOptions();
        this.hideAllEfx();
        if (cc.fy.gameNetMgr.curaction != null) {
            this.showAction(cc.fy.gameNetMgr.curaction);
            // cc.fy.gameNetMgr.curaction = null;
        }
        else {
            if (cc.fy.gameNetMgr.tiantingAction) {
                var data = {
                    ting: true
                }
                this.showAction(data);
                cc.fy.gameNetMgr.tiantingAction = null;
            }
        }
    },

    initEventHandlers: function () {
        var self = this;
        var game = cc.fy.gameNetMgr;
        game.addHandler('game_begin', function (data) {
            self.hideAllEfx();
            // self.hideChiTip();
        });
        game.addHandler('game_action', function (data) {
            self.showAction(data);
            // cc.fy.yzmjMsg.gameAction = data;
        });

        game.addHandler('hupai', function (data) {
            self.hideOptions();
            var data = data;
            var seatIndex = data.seatindex;
            var localIndex = cc.fy.gameNetMgr.getLocalIndex(seatIndex);
            if (localIndex == 0) {
                self.hideOptions();
            }

            if (data.iszimo) {
                self.playEfx(localIndex, "play_zimo");
                if (data.huMethod == 5) {
                    cc.fy.audioMgr.playSFXBySex("gangkai", cc.fy.gameNetMgr.seats[seatIndex], cc.fy.gameNetMgr.conf.type);
                } else {
                    cc.fy.audioMgr.playSFXBySex("zimo", cc.fy.gameNetMgr.seats[seatIndex], cc.fy.gameNetMgr.conf.type);
                }
            }
            else {
                if (data.huMethod == 7) {
                    cc.fy.audioMgr.playSFXBySex("qianggang", cc.fy.gameNetMgr.seats[seatIndex], cc.fy.gameNetMgr.conf.type);
                } else {
                    cc.fy.audioMgr.playSFXBySex("hu", cc.fy.gameNetMgr.seats[seatIndex], cc.fy.gameNetMgr.conf.type);
                }
                // self.playEfx(localIndex,"play_hu");
                self.playSPEfx(localIndex, "hu");
            }
        });

        game.addHandler('guo_notify', function (data) {
            self.hideOptions();
            var seatData = data;
            // cc.fy.audioMgr.playSFX("give.mp3");
        });

        game.addHandler('guo_result', function (data) {
            self.hideOptions();
            var seatData = data;
            if (seatData != null) {
                var localIndex = cc.fy.gameNetMgr.getLocalIndex(seatData);
                // self.playEfx(localIndex, "play_guo");
                if (cc.fy.replayMgr.isReplay()) {
                    self.playSPEfx(localIndex, "guo");
                }
            }
        });

        game.addHandler('peng_notify', function (data) {
            var seatData = data.seatData;
            var seats = cc.fy.gameNetMgr.seats;
            var localIndex = cc.fy.gameNetMgr.getLocalIndex(seatData.seatindex);
            // self.playEfx(localIndex,"play_peng");
            self.playSPEfx(localIndex, "peng");
            cc.fy.audioMgr.playSFXBySex("peng", seats[seatData.seatindex], cc.fy.gameNetMgr.conf.type);
            self.hideOptions();
            // self.hideChiTip();
        });

        game.addHandler('peng_recv', function (data) {
            self.hideOptions();
        });

        game.addHandler('gang_notify', function (data) {
            var data = data;
            var seats = cc.fy.gameNetMgr.seats;
            var seatData = data.seatData;
            var gangtype = data.gangtype;

            var localIndex = cc.fy.gameNetMgr.getLocalIndex(seatData.seatindex);
            // self.playEfx(localIndex,"play_gang");
            if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.GYPDZ) {
                if (gangtype == 'angang') {
                    cc.fy.gameNetMgr.dispatchEvent("game_special", { specialType: 'xiaoxi', userId: seatData.userid });
                } else {
                    cc.fy.audioMgr.playSFXBySex("gang", seats[seatData.seatindex], cc.fy.gameNetMgr.conf.type);
                    self.playSPEfx(localIndex, "gang");
                }
            } else {
                cc.fy.audioMgr.playSFXBySex("gang", seats[seatData.seatindex], cc.fy.gameNetMgr.conf.type);
                self.playSPEfx(localIndex, "gang");
            }

            self.hideOptions();
            // self.hideChiTip();  
        });

        game.addHandler('kan_notify', function (data) {
            var data = data;
            var seats = cc.fy.gameNetMgr.seats;
            var seatData = data.seatData;

            var localIndex = cc.fy.gameNetMgr.getLocalIndex(seatData.seatindex);
            // self.playEfx(localIndex,"play_kan");
            self.playSPEfx(localIndex, "kan");
            cc.fy.audioMgr.playSFXBySex("kan", seats[seatData.seatindex], cc.fy.gameNetMgr.conf.type);
            // 自己的坎才能隐藏
            if (seatData.seatindex == cc.fy.gameNetMgr.seatIndex) {
                self.hideOptions();
            }
        });

        game.addHandler('kan_recv', function (data) {
            self.hideOptions();
        });

        game.addHandler('dui_notify', function (data) {
            var data = data;
            var seats = cc.fy.gameNetMgr.seats;
            var seatData = data.seatData;

            var localIndex = cc.fy.gameNetMgr.getLocalIndex(seatData.seatindex);
            // self.playEfx(localIndex,"play_kan");
            self.playSPEfx(localIndex, "peng");
            cc.fy.audioMgr.playSFXBySex("peng", seats[seatData.seatindex], cc.fy.gameNetMgr.conf.type);
            self.hideOptions();
            // self.hideChiTip();
        });

        game.addHandler('dui_recv', function (data) {
            self.hideOptions();
        });

        // game.addHandler('chi_notify',function(data){
        //     var data = data;
        //     var seats = cc.fy.gameNetMgr.seats;
        //     var seatData = data.seatData;

        //     var localIndex = cc.fy.gameNetMgr.getLocalIndex(seatData.seatindex);
        //     // self.playEfx(localIndex,"play_kan");
        //     self.playSPEfx(localIndex, "chi");
        //     cc.fy.audioMgr.playSFXBySex("chi", seats[seatData.seatindex], cc.fy.gameNetMgr.conf.type);
        //     self.hideOptions();
        //     self.hideChiTip();
        // });

        // game.addHandler('chi_recv',function(data){
        //     self.hideOptions();
        //     self.hideChiTip();
        // });

        game.addHandler('hu_recv', function (data) {
            self.hideOptions();
        });


        game.addHandler('zatou_recv', function (data) {
            self.hideOptions();
        });

        game.addHandler('zatou_notify', function (data) {
            var data = data;
            var seats = cc.fy.gameNetMgr.seats;
            var seatData = data.seatData;

            var localIndex = cc.fy.gameNetMgr.getLocalIndex(seatData.seatindex);
            // self.playEfx(localIndex,"play_kan");
            self.playSPEfx(localIndex, "zatou");
            cc.fy.audioMgr.playSFXBySex("zatou", seats[seatData.seatindex], cc.fy.gameNetMgr.conf.type);
            self.hideOptions();
            // self.hideChiTip();  
        });

        game.addHandler("hangang_notify", function (data) {
            self.hideOptions();
        });

        game.addHandler('hangang_recv', function (data) {
            self.hideOptions();
        });

        game.addHandler('cc_guanmen_notify', function (data) {
            console.log('cc_guanmen_notify');
            var userId = data;
            var si = cc.fy.gameNetMgr.getSeatIndexByID(userId);
            var index = cc.fy.gameNetMgr.getLocalIndex(si);
            var seatData = cc.fy.gameNetMgr.getSeatByID(userId);
            self.playSPEfx(index, "guanmen");
            cc.fy.audioMgr.playSFXBySex("guanmen", seatData, cc.fy.gameNetMgr.conf.type);
        });

        game.addHandler('game_endsure', function (data) {
            // self.hideChiTip();
        });


        game.addHandler('tingpai', function (event) {
            console.log("听牌啦");
            var data = event;
            self.tingpai(data);
        });

        game.addHandler('tingpai_ctc', function (event) {
            console.log("听牌啦");
            var data = event;
            self.tingpai(data);
        });

        game.addHandler('HuPass_Notity', function (event) {
            console.log("出牌");
            self._optionsLab.active = false;
        });

        game.addHandler('otherTingPai', function (event) {
            console.log("别人听牌啦");
            var data = event;
            self.othertingpai(data);
        });
        game.addHandler('ready_recv', function (event) {
            self.hideAllEfx();
        });



        game.addHandler('game_tian_ting_ctc', function () {
            var data = {
                ting: true
            }
            self.showAction(data);
        });

        game.addHandler('game_guotingresult_ctc', function () {
            cc.fy.lsmjMsg.tiantingState = false;
            cc.fy.ccmjMsg.tiantingState = false;
            self.hideOptions();
        });
    },

    showAction: function (data) {
        if (this._options.active) {
            this.hideOptions();
        }
        console.log(data);
        if (data && (data.hu || data.gang || data.peng || data.chi || data.kan || data.dui || data.zatou || data.ting)) {
            this._options.active = true;
            this._passHu = false;
            if (data.hu) {
                if (data.hupai) {
                    var lasthu = [];
                    for (var i = 0; i < data.hupai.length; ++i) {
                        var gp = data.hupai[i];
                        if (gp == 52 || gp == "52") {
                            gp = cc.fy.gameNetMgr.baida;
                        }
                        var same = false;
                        var length = lasthu.length;
                        for (var j = 0; j < length; j++) {
                            if (lasthu[j] == gp) {
                                same = true;
                                break;
                            }
                        }
                        if (same == false) {
                            cc.fy.gameNetMgr.huPai = gp;
                            this.addOption("btnHu", gp);
                            this._passHu = true;
                            lasthu.push(gp);

                        }
                    }
                }
                else {
                    cc.fy.gameNetMgr.huPai = data.pai;
                    this.addOption("btnHu", data.pai);
                    this._passHu = true;
                }
            }
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
            // 坎 可能有多种可以坎的牌
            if (data.kan) {
                var lastkan = [];
                for (var i = 0; i < data.kanpai.length; ++i) {
                    var gp = data.kanpai[i];
                    var same = false;
                    var length = lastkan.length;
                    for (var j = 0; j < length; j++) {
                        if (lastkan[j] == gp) {
                            same = true;
                            break;
                        }
                    }
                    if (same == false) {
                        this.addOption("btnKan", gp);
                        lastkan.push(gp);
                    }
                }
            }
            if (data.peng) {
                this.addOption("btnPeng", data.pai);
            }
            if (data.dui) {
                this.addOption("btnDui", data.pai);
            }
            // if(data.chi){
            //     this.addOption("btnChi",data.pai,data.chipai);
            // }
            if (data.zatou) {
                this.addOption("btnZatou", data.pai);
            }
            if (data.ting) {
                if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.GYPDZ) {
                    this.addOption("btnPa");
                }
                else {
                    this.addOption("btnTing");
                }
            }
        }
    },

    hideOptions: function (data) {
        this._options.active = false;
        for (var i = 0; i < this._optionLst.length; ++i) {
            var child = this._optionLst[i];
            child.active = false;
        }
        this._actionCount = 0;
    },
    doGuoHu: function () {
        console.log("1111111");
        cc.fy.net.send("guo", cc.fy.gameNetMgr.curaction.actionid);
        var selfSide = cc.fy.gameNetMgr.seatIndex;
        if (this._passHu == true) {
            this._passHu = false;
            this._optionsLab.active = true;
        }

    },

    addOption: function (btnName, pai, lstPai) {
        console.log("==>> addOption: ", btnName);
        console.log("==>> pai: ", pai);
        console.log("==>> lstPai: ", lstPai);
        this._ndBtnGuo.active = true;
        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.BDMJ || cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.HDMJ) {
            this._ndBtnGuo.active = !this.isHoldsAllBaida();
        }

        // 超过按钮列表就再创建一个
        var child = this._optionLst[this._actionCount];
        if (child == null) {
            child = cc.instantiate(this._optionLst[0]);
            this._options.addChild(child);
            this._optionLst.push(child);
            // 一排只能显示4个，超过四个向上排
            child.x = -315 * (this._actionCount % 3);
            child.y = 195 * parseInt(this._actionCount / 3);
        }
        child.active = true;
        var sprite = child.getChildByName("opTarget").getComponent(cc.Sprite);
        if (pai != null) {
            cc.fy.mahjongmgr.createMahjongNode("M_", pai, sprite.node);
            child.getChildByName("opTarget").active = true;
        }
        else {
            child.getChildByName("opTarget").active = false;
        }
        var btns = child.getComponentsInChildren(cc.Button);
        var dise = child.getChildByName("pai_bottom");
        if (btnName == "btnPa" || btnName == "btnTing") {
            dise.active = false;
        }
        for (var i = 0; i < btns.length; i++) {
            if (btns[i]) {
                var btn = btns[i].node;
                if (btnName == btn.name) {
                    btn.active = true;
                    btn.pai = pai;
                    if (lstPai != null) {
                        btn.lstPai = lstPai;
                    }
                    this._actionCount++; // 放到这里，界面上没有的操作按钮要忽略
                }
                else {
                    btn.active = false;
                }
            }
        }
        if (this.check(btnName)) {
            this._ndBtnGuo.active = false;
        }
    },

    check: function (btnName) {

        if (btnName != "btnHu") {
            return false;
        }
        var myHolds;
        for (var i = 0; i < cc.fy.gameNetMgr.seats.length; i++) {
            var data = cc.fy.gameNetMgr.seats[i];
            if (data.userid == cc.fy.userMgr.userId) {
                myHolds = data.holds;
                break;
            }
        }
        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.YZDDH) {
            if (btnName == "btnHu" && this.isAllBaida(myHolds)) {
                return true;
            }
            return false;
        }
        else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.YZER) {
            if (btnName == "btnHu" && this.isAllBaida(myHolds)) {
                return true;
            }
            return false;
        }
        else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.JDMJ) {
            if (btnName == "btnHu" && this.isAllBaida(myHolds) && myHolds.length == 2) {
                return true;
            }
            return false;
        }
        else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.GYCG || cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.GYPDZ) {
            console.log(myHolds);
            console.log(this.isAllBaida(myHolds));
            if (btnName == "btnHu" && this.isAllBaida(myHolds)) {
                return true;
            }
            var lastPai = myHolds[myHolds.length - 1];

            if (btnName == "btnHu" && cc.fy.mahjongmgr.isBaida(lastPai) && this.isTingPai()) {
                return true;
            }
            return false;
        }
        else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.HZEMJ) {
            if (btnName == "btnHu" && myHolds.length == 2 && myHolds[0] == myHolds[1] && myHolds[0] == 43) {
                return true;
            }
        }
        return false;

        // var huOper = seat.operInfo[GameDef.OperType.Hu];
        // var tingOper = seat.operInfo[GameDef.OperType.Ting];
        // if (tingOper.isBaoTing && huOper.can && isBaida(game, _.last(seat.hand))) {
        //     return;
        // }
        // if (huOper.can && seat.hand.findIndex(card => !isBaida(game, card)) == -1) {
        //     return;
        // }
    },

    isAllBaida: function (arr) {
        if (arr == null) {
            return false;
        }
        for (var i = 0; i < arr.length; i++) {
            if (!cc.fy.mahjongmgr.isBaida(arr[i])) {
                return false;
            }
        }
        return true;
    },

    isTingPai: function () {
        console.log(cc.fy.gameNetMgr.baoting);

        for (var i = 0; i < cc.fy.gameNetMgr.baoting.length; i++) {
            var data = cc.fy.gameNetMgr.baoting[i];
            console.log(data);
            if (data != null) {
                if (data.userId == cc.fy.userMgr.userId) {
                    return true;
                }
            }
        }
        return false;
    },

    onOptionClicked: function (event) {
        console.log(event.target.pai + " event.target.name " + event.target.name);
        if (event.target.name == "btnPeng") {
            cc.fy.net.send("peng");
        }
        else if (event.target.name == "btnGang") {
            // cc.fy.net.send("gang",event.target.pai);
            cc.fy.net.send("gang", { "pai": event.target.pai, "actionid": cc.fy.gameNetMgr.curaction.actionid });
        }
        else if (event.target.name == "btnHu") {
            console.log("===>>>   btnHu");
            console.log(event.target.pai);
            cc.fy.net.send("hu", { "pai": event.target.pai, "actionid": cc.fy.gameNetMgr.curaction.actionid });
            this.hideOptions();
        }
        else if (event.target.name == "btnGuo") {
            console.log("curaction:",cc.fy.gameNetMgr.curaction);
            if ((cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZER && cc.fy.lsmjMsg.tiantingState) ||
                (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZTDH && cc.fy.ccmjMsg.tiantingState)) {
                 cc.fy.alert.show("是否确定弃？？？", function () {
                    cc.fy.net.send("tiantingguo");
                 },true);
                // this.hideOptions();
            }
            else {
                if ((Date.now() - this._clickTime) < 1000) {
                    return;
                }
                if (cc.fy.gameNetMgr.curaction && cc.fy.gameNetMgr.curaction.hu) {
                    if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.JDMJ) {
                        cc.fy.net.send("guo", cc.fy.gameNetMgr.curaction.actionid);
                        if (this._passHu == true) {
                            this._passHu = false;
                            this._optionsLab.active = true;
                        }
                    }
                    else {
                        var self = this;
                        cc.fy.alert.show("确定放弃胡牌吗？？？", function () {
                            cc.fy.net.send("guo", cc.fy.gameNetMgr.curaction.actionid);
                            if (self._passHu == true) {
                                self._passHu = false;
                                self._optionsLab.active = true;
                            }
                        }, true);
                    }
                }
                else {
                    cc.fy.net.send("guo", cc.fy.gameNetMgr.curaction.actionid);
                }
                this._clickTime = Date.now();
            }
        }
        // else if(event.target.name == "btnChi"){
        //     this.hideOptions();
        //     this.showChi(event.target.lstPai);
        // }
        else if (event.target.name == "btnKan") {
            cc.fy.net.send("kan", event.target.pai);
        }
        else if (event.target.name == "btnDui") {
            cc.fy.net.send("dui");
        }
        else if (event.target.name == "btnZatou") {
            cc.fy.net.send("zatou");
        }
        else if (event.target.name == "btnTing") {
            if ((cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZER && cc.fy.lsmjMsg.tiantingState) ||
                (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZTDH && cc.fy.ccmjMsg.tiantingState)) {
                cc.fy.net.send("tianting");
                this.hideOptions();
            }
            else {
                cc.fy.net.send("ting");
                if (this._passHu == true) {
                    this._passHu = false;
                    this._optionsLab.active = true;
                }
            }
        }
        else if (event.target.name == "btnPa") {
            cc.fy.net.send("ting");
            if (this._passHu == true) {
                this._passHu = false;
                this._optionsLab.active = true;
            }
        }
    },

    isHoldsAllBaida: function () {
        var bo = true;
        var seats = cc.fy.gameNetMgr.seats;
        var seatData = seats[cc.fy.gameNetMgr.seatIndex];
        var holds = cc.fy.mahjongmgr.sortHolds(seatData);
        if (holds == null) {
            return false;
        }
        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.HDMJ) {
            for (var i = 0; i < holds.length; ++i) {
                if (!cc.fy.mahjongmgr.isBaida(holds[i])) {
                    bo = false;
                    break;
                }
            }
        }
        else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.BDMJ) {
            for (var i = 0; i < holds.length; ++i) {
                if (holds[i] != 52) {
                    bo = false;
                    break;
                }
            }
        }

        return bo;
    },

    //听牌后
    tingpai: function (data) {
        this.hideOptions();
        var isfirstbool = true;
        var tingdata = { "userId": data.userId, "isFirst": isfirstbool };
        var userId = tingdata.userId;
        var index = cc.fy.gameNetMgr.getSeatIndexByID(userId);
        var localIndex = cc.fy.gameNetMgr.getLocalIndex(index);
        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.GYPDZ) {
            this.playSPEfx(localIndex, "pa");
            cc.fy.audioMgr.playSFXBySex("papai", cc.fy.gameNetMgr.seats[index], cc.fy.gameNetMgr.conf.type);
        }
        else {
            this.playSPEfx(localIndex, "ting");
            cc.fy.audioMgr.playSFXBySex("ting", cc.fy.gameNetMgr.seats[index], cc.fy.gameNetMgr.conf.type);
        }
        // cc.fy.gameNetMgr.baoting[index] = tingdata;
    },

    //重连听牌
    retingpai: function (data) {
        this.hideOptions();
        var isfirstbool = true;
        var tingdata = { "userId": data.userId, "isFirst": isfirstbool };
        var userId = tingdata.userId;
        var index = cc.fy.gameNetMgr.getSeatIndexByID(userId);
        var localIndex = cc.fy.gameNetMgr.getLocalIndex(index);
        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.GYPDZ) {
            this.playSPEfx(localIndex, "pa");
            cc.fy.audioMgr.playSFXBySex("papai", cc.fy.gameNetMgr.seats[index], cc.fy.gameNetMgr.conf.type);
        }
        else {
            this.playSPEfx(localIndex, "ting");
        }
        // cc.fy.gameNetMgr.baoting[index] = tingdata;
    },

    //别人听牌动画
    othertingpai: function (data) {
        var userId = data.userId;
        var index = cc.fy.gameNetMgr.getSeatIndexByID(userId);
        var localIndex = cc.fy.gameNetMgr.getLocalIndex(index);
        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.GYPDZ) {
            this.playSPEfx(localIndex, "pa");
            cc.fy.audioMgr.playSFXBySex("papai", cc.fy.gameNetMgr.seats[index], cc.fy.gameNetMgr.conf.type);
        }
        else {
            this.playSPEfx(localIndex, "ting");
        }
    },

    playEfx: function (index, name) {
        // this._playEfxs[index].node.active = true;
        console.log('动画');
        // console.log(this._playEfxs[index]);
        // this._playEfxs[index].play(name);
    },

    playSPEfx: function (index, animname) {
        var self = this;
        // this._playEfxs[index].node.active = true;
        // var skeleton = this._playEfxs[index].node.getComponent(sp.Skeleton);
        // skeleton.setAnimation(1, animname, false);
        // skeleton.setCompleteListener(function () {
        // self._playEfxs[index].node.active = false;
        // }, this, null);
    },

    hideAllEfx: function () {
        // for (var i = 0; i < this._playEfxs.length; ++i) {
        // this._playEfxs[i].node.active = false;
        // }
    },

    // showChi:function(lstChi){
    //     console.log("showChi");
    //     console.log(lstChi);
    //     if(lstChi == null){
    //         return;
    //     }
    //     if(lstChi.length == 1){
    //         cc.fy.net.send("chi", lstChi[0]);
    //     }
    //     else{
    //         // 显示吃牌列表
    //         this._ndChiTip.active = true;
    //         for(var i=0;i<lstChi.length;i++){
    //             var chiTip = this._ndChiTipLst[i];
    //             if(chiTip == null){
    //                 chiTip = cc.instantiate(this._ndChiTipLst[0]);
    //                 this._ndChiTip.addChild(chiTip);
    //                 this._ndChiTipLst.push(chiTip);
    //             }
    //             chiTip.active = true;
    //             chiTip.x = -(lstChi.length - 1) * chiTip.width * 0.5  + chiTip.width * i;
    //             for(var j=0;j<3;j++){
    //                 var sprite = chiTip.getChildByName("mj_" + j).getComponent(cc.Sprite);
    //                 cc.fy.mahjongmgr.createMahjongNode("M_",  lstChi[i] + j, sprite.node);
    //             }
    //             chiTip.pai = lstChi[i];
    //         }

    //         for(var i=lstChi.length;i<this._ndChiTipLst.length;i++){
    //             if(this._ndChiTipLst[i]){
    //                 this._ndChiTipLst[i].active = false;
    //             }
    //         }
    //     }
    // },

    // hideChiTip:function(){
    //     this._ndChiTip.active = false;
    // },

    // onChiTipClicked:function(event){
    //     cc.fy.net.send("chi", event.target.pai);
    // },

    // onChiTipCancel:function(){
    //     this.hideChiTip();
    //     // if(cc.fy.yzmjMsg.gameAction){
    //     //     this.showAction(cc.fy.yzmjMsg.gameAction);
    //     // }
    //     if(cc.fy.gameNetMgr.curaction != null){
    //         this.showAction(cc.fy.gameNetMgr.curaction);
    //         // cc.fy.gameNetMgr.curaction = null;
    //     }
    // },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
