var GameMsgDef = require('GameMsgDef');
cc.Class({
    extends: cc.Component,

    properties: {
        lblRoomNo: {
            default: null,
            type: cc.Label
        },
        _lblRoomNewNo: null,
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        _seats: [],
        _seats2: [],
        _timeLabel: null,
        _voiceMsgQueue: [],


        _lastPlayingSeat: null,
        _playingSeat: null,


        _lastPlayTime: null,
        _setting: null,
        _userinfo: null,
        _prepare: null,
        _bgArr: null,
        _tingAlert: null,
        _gamePlayer: 3,

        _friendContentScrollView: null,
        _friendContent: null,
        _friendViewitemTemp: null,
        _friendViewlist: null,
        _currentFriendList: null,
        _canInvListOriPosX: null,

        _tiChuTime: null,     //踢出面板


    },

    // use this for initialization
    onLoad: function () {
        if (cc.fy == null || cc.fy.gameNetMgr.roomId == null) {
            if (cc.fy) {
                cc.fy.alert.show("连接超时，请检查网络连接！", function () {
                    cc.fy.userMgr.logOut();
                });
            }
            return;
        }
        console.log("cc.fy.gameNetMgr.conf =====>", cc.fy.gameNetMgr.conf);
        // this._gamePlayer = cc.fy.gameNetMgr.conf.maxCntOfPlayers;
        // if (cc.fy.replayMgr.isReplay()) {
        //     this._gamePlayer = cc.fy.gameNetMgr.seats.length;
        // }

        this._gamePlayer = cc.fy.gameNetMgr.conf.maxCntOfPlayers ? cc.fy.gameNetMgr.conf.maxCntOfPlayers : cc.fy.gameNetMgr.seats.length;
        if (cc.fy.replayMgr.isReplay()) {
            this._gamePlayer = cc.fy.gameNetMgr.seats.length;
        }
        this._tingAlert = this.node.getChildByName("tingAlert");
        if (this._tingAlert) {
            this._tingAlert.active = false;
        }

        this._bgArr = [];
        var bg = cc.find("Canvas/bg");
        for (var i = 0; i < bg.childrenCount; ++i) {
            var temp = bg.children[i];
            if (temp) {
                this._bgArr.push(temp);
            }
        }

        var showbgtype = cc.fy.localStorage.getItem("bgtypeMJ");

        for (var i = 0; i < this._bgArr.length; ++i) {
            this._bgArr[i].active = false;
            if (showbgtype) {
                if (i == showbgtype) {
                    this._bgArr[i].active = true;
                }
                else {
                    this._bgArr[i].active = false;
                }
            } else {
                this._bgArr[0].active = true;
                cc.fy.localStorage.setItem("bgtypeMJ", 0);
            }
        }


        this.initView();
        this.initSeats();
        this.initEventHandlers();
    },
    initView: function () {
        var prepare = this.node.getChildByName("prepare");
        this._prepare = prepare;
        this._tiChuTime = this._prepare.getChildByName("TiChuTime");

        // var prepare = this.node.getChildByName("prepare");
        var btnWeichat = cc.find("Canvas/gameMain/prepare/btnLayout/btnWeichat");

        cc.fy.utils.addClickEvent(btnWeichat, this.node, "MJRoom", "onBtnWeichatClicked");
        var btnGuildFriend = prepare.getChildByName("btnGuildFriend");
        cc.fy.utils.addClickEvent(btnGuildFriend, this.node, "MJRoom", "getOnlineList");
        // cc.fy.utils.addClickEvent(btnExit, this.node, "MJRoom", "onBtnExit");
        // cc.fy.utils.addClickEvent(btnDispress, this.node, "MJRoom", "onBtnDissolveClicked");

        var btnXianLiao = cc.find("Canvas/gameMain/prepare/btnLayout/btnXianLiao");
        if (btnXianLiao) {
            if (cc.FREECHAT_GAMEROOM) {
                btnXianLiao.active = true
            } else {
                btnXianLiao.active = false
            }
            cc.fy.utils.addClickEvent(btnXianLiao, this.node, "MJRoom", "onBtnXianliaoClicked");
        }

        var btnMoWang = cc.find("Canvas/gameMain/prepare/btnLayout/btnMoWang");

        cc.fy.utils.addClickEvent(btnMoWang, this.node, "MJRoom", "onBtnMoWangClicked");
        // 复制房间号
        var btnCopyRoomID = cc.find("Canvas/gameMain/prepare/btnLayout/btnCopy");// cc.find("Canvas/prepare/btnCopy");

        if (btnCopyRoomID) {
            cc.fy.utils.addClickEvent(btnCopyRoomID, this.node, "MJRoom", "onBtnCopyRoomID");
        }
        // 吴江麻将 准备按钮
        var btnReady = prepare.getChildByName("btnReady");// cc.find("Canvas/prepare/btnCopy");
        if (btnReady) {
            cc.fy.utils.addClickEvent(btnReady, this.node, "MJRoom", "onBtnReadyClicked");
            if (cc.fy.gameNetMgr.isWJMJ()) {//吴江
                btnReady.active = true;
            } else {
                btnReady.active = false;
            }
            this._tiChuTime.active = btnReady.active;
        }
        this.refreshBtns();
        let infobarNode = this.node.getChildByName("infobar");
        this.lblRoomNo = cc.find("roomid/iconroom/labroomid", infobarNode).getComponent(cc.Label);
        this._timeLabel = cc.find("time/timebg/time", infobarNode).getComponent(cc.Label);
        this.lblRoomNo.string = cc.fy.gameNetMgr.roomId.toString();
        // if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.JDMJ) {
        //     this._lblRoomNewNo = cc.find("wanfaNewbg/roomId", infobarNode).getComponent(cc.Label);
        //     this.lblRoomNo.node.parent.active = false;
        //     this._lblRoomNewNo.string = "房间号:" + cc.fy.gameNetMgr.roomId.toString();
        // } else {
        // this.lblRoomNo.node.parent.active = true;
        // }
        // this.refreshRoomNoPos();
        var gameChild = this.node.getChildByName("game");
        var sides = ["myself", "right", "up", "left"];
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
            var sideNode = gameChild.getChildByName(sides[i]);
            sideNode.active = true;
            var seats = prepare.getChildByName("seats");
            // for (var i = 0; i < seats.children.length; ++i) {
            this._seats.push(seats.getChildByName(sides[i]).getComponent("SeatMJ"));
            // }

            var seat = sideNode.getChildByName("seat");
            this._seats2.push(seat.getComponent("SeatMJ"));
            ////////////////////////////////////////////
            var flower = sideNode.getChildByName("flower");
            if (flower) {
                flower.active = false;
            }
        }
        // var titles = this.node.getChildByName("typeTitle");-
        // var difenFrame = cc.find("game/difen", this.node);
        // var labDifen = difenFrame.getChildByName("labDifen").getComponent(cc.Label);
        var _gamecount = cc.find("jushu/iconjushu/labjushu", infobarNode).getComponent(cc.Label);

        if (cc.fy.replayMgr.isReplay()) {
            if (cc.fy.gameNetMgr.conf.maxGames) {
                _gamecount.string = 0 + "/" + cc.fy.gameNetMgr.conf.maxGames;

            } else {
                _gamecount.string = 0 + "";
            }
        } else {
            _gamecount.string = 0 + "/" + cc.fy.gameNetMgr.maxNumOfGames;
        }
        var _difen = cc.find("difen/icondifen/labdifen", infobarNode).getComponent(cc.Label);

        var _mjcount = cc.find("leftCard/iconleftcard/lableftcard", infobarNode).getComponent(cc.Label);
        _mjcount.string = 0;
        // _difen.string = cc.fy.gameNetMgr.conf.baseScore; 
        // difenFrame.active = false;

        if (cc.fy.gameNetMgr.conf) {
            var numOfDifen = null;
            if (cc.fy.gameNetMgr.conf.baseScore != null) {
                numOfDifen = cc.fy.gameNetMgr.conf.baseScore;
            }
            if (cc.fy.gameNetMgr.conf.base_score != null) { //涟水
                numOfDifen = cc.fy.gameNetMgr.conf.base_score;
            }
            if (numOfDifen != null) {
                // difenFrame.active = true;
                _difen.string = numOfDifen.toString();
            } else {
                _difen.string = 1;
            }


        }

        var btnHide = prepare.getChildByName("btnHide");
        cc.fy.utils.addClickEvent(btnHide.getComponent(cc.Button), this.node, "MJRoom", "hideOnlineList");
        if (this._friendViewlist == null) {
            this._friendViewlist = prepare.getChildByName("canInvList").getChildByName("listScrollView");
            this._canInvListOriPosX = prepare.getChildByName("canInvList").x;
            this._friendViewlist.active = false;
            this._friendContentScrollView = this._friendViewlist.getComponent(cc.ScrollView);
        }
        if (this._friendContent == null) {
            this._friendContent = this._friendViewlist.getChildByName("view").getChildByName("content");
            this._friendContent.active = true;
        }
        this._friendViewitemTemp = cc.find("view/content/onlineUser", this._friendViewlist);

        if (cc.fy.gameNetMgr.gamestate != "") {
            this.refreshBtns(false);
            // this._tiChuTime.active = false;
        }


        let btnChat = this.node.getChildByName("btnbox").getChildByName("btn_chat");
        if (btnChat) {
            cc.fy.utils.addClickEvent(btnChat, this.node, "MJRoom", "onBtnChatClicked");
        }

        var btnSetting = this.node.getChildByName("btnbox").getChildByName("btn_settings");
        cc.fy.utils.addClickEvent(btnSetting, this.node, "MJRoom", "onBtnSettingsClicked");

        var guizeBtn = infobarNode.getChildByName("guizeBtn");
        cc.fy.utils.addClickEvent(guizeBtn, this.node, "MJRoom", "onBtngameInfo");

        var btn_gps = this.node.getChildByName('btnbox').getChildByName("btn_gps");
        cc.fy.utils.addClickEvent(btn_gps, this.node, "MJRoom", "onBtnGpsClicked");

        //二人麻将 番数宝典
        var btnFanshu = this.node.getChildByName('btnbox').getChildByName("btn_fanshu");
        btnFanshu.active = false;
        if (cc.fy.gameNetMgr.isERMJ()) {
            btnFanshu.active = true;
            cc.fy.utils.addClickEvent(btnFanshu, this.node, "MJRoom", "onBtnFanshuClicked");
        }

        // var btn_voice = this.node.getChildByName('btnbox').getChildByName("btn_voice");
        // cc.fy.utils.addClickEvent(btn_voice, this.node, "MJRoom", "onBtnGpsClicked");
        let sp = this._prepare.getChildByName('texture').getChildByName('logoMJ').getComponent('logoMJ').getSpriteFrame(cc.fy.gameNetMgr.conf.type)
        if (sp) {
            this._prepare.getChildByName('texture').getChildByName('logoMJ').getComponent(cc.Sprite).spriteFrame = sp
            gameChild.getChildByName('arrow').getChildByName('texture').getChildByName('logoMJ').getComponent(cc.Sprite).spriteFrame = sp
        }
        if (cc.fy.replayMgr.isReplay()) {
            if (btnSetting) {
                btnSetting.active = false;
            }
            if (btnChat) {
                btnChat.active = false;
            }
        }
        this.scheduleOnce(function () {
            if (cc.fy.gameNetMgr.numOfGames == 0) {
                this.onBtngameInfo();
            }
        }, 0.5)

    },
    //二人麻将 番数宝典
    onBtnFanshuClicked: function () {
        cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWHELPFANSHUVIEW_CTC, { isShow: true });
    },
    refreshBtns: function (bo) {
        var prepare = this.node.getChildByName("prepare");
        var btnWeichat = cc.find("btnLayout/btnWeichat", prepare);
        var btnCopy = cc.find("btnLayout/btnCopy", prepare);
        var btnXianLiao = cc.find("btnLayout/btnXianLiao", prepare);
        var btnMoWang = cc.find("btnLayout/btnMoWang", prepare);
        var btnGuildFriend = prepare.getChildByName("btnGuildFriend");
        var btnReady = prepare.getChildByName("btnReady");

        var isIdle = false;
        if (bo == null) {
            isIdle = cc.fy.gameNetMgr.numOfGames == 0;
        }
        else {
            isIdle = bo;
        }
        btnWeichat.active = isIdle;
        if (btnCopy) {
            btnCopy.active = isIdle;
        }
        if (btnXianLiao) {
            btnXianLiao.active = isIdle && cc.FREECHAT_GAMEROOM;
        }
        if (btnMoWang) {
            btnMoWang.active = isIdle;
        }
        console.log("numOfGames", cc.fy.gameNetMgr.numOfGames);
        if (cc.fy.gameNetMgr.conf != null && cc.fy.gameNetMgr.conf.isClubRoom &&
            cc.fy.gameNetMgr.numOfGames == 0) {
            btnGuildFriend.active = true;
        }
        else {
            btnGuildFriend.active = false;
            cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWKCANINVLISTVIEW_CTC, { isShow: false });
        }
        let canInvList = cc.find("prepare/canInvList", this.node);
        canInvList.active = false;


        if (cc.fy.gameNetMgr.isWJMJ() && cc.fy.gameNetMgr.seats[cc.fy.gameNetMgr.seatIndex].ready == false && cc.fy.gameNetMgr.numOfGames == 0) {
            btnReady.active = true;
            // wj_btnWeichat.active = isIdle && !cc.fy.gameNetMgr.conf.isClubRoom; 
            // btnWeichat.active = false;
            // btnFreechat.active = false;
            // if (cc.fy.gameNetMgr.isOwner() == false) {
            //     readyTip.active = true;
            // }
        }
        else {
            btnReady.active = false;
            // btnWeichat.active = isIdle && !cc.fy.gameNetMgr.conf.isClubRoom; 
        }
        this._tiChuTime.active = btnReady.active;


    },

    onBtngameInfo() {
        //cc.fy.audioMgr.playSFX("click_return.mp3");
        if (cc.fy.replayMgr.isReplay()) return

        let id = 0
        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZTDH) {//推倒胡
            id = 3
        }
        else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZCT) {//传统麻将
            id = 2
        }
        else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZBD) {//百搭麻将
            id = 4
        }
        else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZHD) {//黄埭麻将
            id = 5
        }
        else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZER) {//二人麻将
            id = 6
        } else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZWJ) {//吴江麻将
            id = 0
        }



        cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWGAMEVIEW_MJPEIZHI_CTC, { isShow: true, id });
    },
    getOnlineList: function () {
        if (this._clickTime != null) {
            if (Date.now() - this._clickTime < 1000) {
                return;
            }
        }
        this._clickTime = Date.now();
        var self = this;
        var data = {
            userId: cc.fy.userMgr.userId,
            clubid: cc.fy.gameNetMgr.conf.clubId,
        }
        cc.fy.http.sendRequest('/get_online_user', data, function (ret) {
            console.log("get_online_user");
            console.log(ret);
            // self.showOnlineList(ret);
            // self.RefreshFriendList(ret.data.playerUser);
            if (ret.data.playerUser) {
                cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWKCANINVLISTVIEW_CTC, { isShow: true, content: ret.data.playerUser });
            }

        }, "http://" + cc.fy.SI.clubHttpAddr);
        // cc.fy.http.sendRequest('/get_online_user', data, function (ret) {
        //     console.log("get_online_user");
        //     console.log(ret);
        //     self.showOnlineList(ret);
        //     self.RefreshFriendList(ret.data.playerUser);
        // }, "http://" + cc.fy.SI.clubHttpAddr);
    },

    showOnlineList: function (ret) {
        let canInvList = this._prepare.getChildByName("canInvList");
        let btnHide = this._prepare.getChildByName("btnHide");
        let btnGuildFriend = this._prepare.getChildByName("btnGuildFriend");
        canInvList.active = true;
        canInvList.x = this._canInvListOriPosX + 280;
        console.log("canInvList:true", canInvList.x);
        btnHide.active = true;
        btnGuildFriend.active = false;

    },

    RefreshFriendList: function (ret) {
        let canInvList = this._prepare.getChildByName("canInvList");
        canInvList.active = true;
        let friendList = ret;
        this._friendContent.removeAllChildren();
        this._friendViewlist.active = true;
        if (this._friendContentScrollView) {
            this._friendContentScrollView.scrollToTop();
        }

        if (friendList != null && friendList.length > 0) {
            this._currentFriendList = friendList;
            for (var i = 0; i < friendList.length; i++) {
                var data = friendList[i];
                var node = this.getFriendViewItem(i);
                node.active = data.userId == cc.fy.userMgr.userId ? false : true;
                node.idx = i;
                node.getChildByName('nameLabel').getComponent(cc.Label).string = data.name;
                let imageloader = node.getChildByName("headimg").getComponent("ImageLoader");
                node.getChildByName("onlineLabel").getComponent(cc.Label).string = data.isPlay ? "游戏中" : "空闲";
                if (data.headimg != null && data.headimg != "") {
                    imageloader.setUrl(data.headimg);
                }
                let btnInv = node.getChildByName("btnInv");
                btnInv.idx = i;
                if (btnInv) {
                    cc.fy.utils.addClickEvent(btnInv.getComponent(cc.Button), this.node, "MJRoom", "InvFriend");
                }
                btnInv.active = !data.isPlay;
            }
        }
    },

    InvFriend: function (event) {
        let curNode = event.target;
        if (curNode.idx == null) {
            return;
        }
        if (this._currentFriendList == null) {
            return;
        }
        this.scheduleOnce(function () {
            if (curNode == null) {
                return;
            }
            curNode.getComponent(cc.Button).interactable = true;
            curNode.color = new cc.Color(255, 255, 255);
        }, 5);
        curNode.getComponent(cc.Button).interactable = false;
        curNode.color = new cc.Color(150, 150, 150);
        let friendData = this._currentFriendList[curNode.idx];
        var self = this;
        var data = {
            userId: cc.fy.userMgr.userId,
            invite_userId: friendData.userId,
            clubId: cc.fy.gameNetMgr.conf.clubId,
            clubname: "xxx",
            conf: JSON.stringify(cc.fy.gameNetMgr.conf),
            roomid: cc.fy.gameNetMgr.roomId,
            username: cc.fy.userMgr.userName,
        }
        cc.fy.http.sendRequest('/invite_user_play', data, function (ret) {
            console.log("invite_user_play");
            console.log(ret);
        }, "http://" + cc.fy.SI.clubHttpAddr);
    },


    hideOnlineList: function () {
        let canInvList = this._prepare.getChildByName("canInvList");
        let btnHide = this._prepare.getChildByName("btnHide");
        let btnGuildFriend = this._prepare.getChildByName("btnGuildFriend");
        canInvList.active = false;
        canInvList.x = this._canInvListOriPosX - 280;
        console.log("canInvList:false", canInvList.x);
        btnHide.active = false;
        if (cc.fy.gameNetMgr.conf != null && cc.fy.gameNetMgr.conf.isClubRoom &&
            cc.fy.gameNetMgr.numOfGames == 0) {
            btnGuildFriend.active = true;
        }
        else {
            btnGuildFriend.active = false;
        }
        // btnGuildFriend.active = true;
    },

    initEventHandlers: function () {
        var self = this;
        var game = cc.fy.gameNetMgr;
        game.addHandler('new_user', function (data) {
            var seats = cc.fy.gameNetMgr.seats;
            var showPiao = self.isNeedShowPiao(seats);
            self.initSingleSeat(data, showPiao);
            self.InitSameIP(); // 检测同ip
        });

        game.addHandler('user_state_changed', function (data) {
            var seats = cc.fy.gameNetMgr.seats;
            var showPiao = self.isNeedShowPiao(seats);
            self.initSingleSeat(data, showPiao);
            self.InitSameIP(); // 检测同ip
            self.refreshBtns();
        });

        game.addHandler('game_start', function (data) {
            self.refreshBtns(false);
            self.initSeats();
        });





        game.addHandler('game_banker', function (data) {
            self.initSeats();
        });

        // 飘花反馈
        game.addHandler('piaohua_notify', function (data) {
            var si = cc.fy.gameNetMgr.getSeatIndexByID(data.si);
            var lsi = cc.fy.gameNetMgr.getLocalIndex(si);
            self._seats2[lsi].setPiao(data.piao);
        });

        //飘花结果
        game.addHandler('game_piaoresult', function (data) {
            var seats = cc.fy.gameNetMgr.seats;
            var length = seats.length;
            for (var i = 0; i < length; i++) {
                var index = cc.fy.gameNetMgr.getLocalIndex(seats[i].seatindex);
                self._seats2[index].setPiao(seats[i].piaohua);
            }
        });

        // // 拉庄反馈
        // game.addHandler('lazhuang_notify', function (data) {
        //     var si = cc.fy.gameNetMgr.getSeatIndexByID(data.si);
        //     var lsi = cc.fy.gameNetMgr.getLocalIndex(si);
        //     self._seats2[lsi].setLazhuang(data.lazhuang);
        // });

        // // 顶庄反馈
        // game.addHandler('dingzhuang_notify', function (data) {
        //     console.log("dingzhuang_notify");
        //     var si = cc.fy.gameNetMgr.getSeatIndexByID(data.si);
        //     var lsi = cc.fy.gameNetMgr.getLocalIndex(si);
        //     self._seats2[lsi].setDingzhuang(data.dingzhuang);
        // });

        // game.addHandler('gang_chang', function (data) {
        //     var score = data;
        //     self.gangScore(score);
        // });

        // // 拉庄结果
        // game.addHandler('game_lazhuangresult', function (data) {
        //     var seats = cc.fy.gameNetMgr.seats;
        //     var length = seats.length;
        //     for (var i = 0; i < length; i++) {
        //         var index = cc.fy.gameNetMgr.getLocalIndex(seats[i].seatindex);
        //         self._seats2[index].setLazhuang(seats[i].lazhuang);
        //     }
        // });

        // // 顶庄结果
        // game.addHandler('game_dingzhuangresult', function (data) {
        //     console.log("game_dingzhuangresult");
        //     var seats = cc.fy.gameNetMgr.seats;
        //     var length = seats.length;
        //     for (var i = 0; i < length; i++) {
        //         var index = cc.fy.gameNetMgr.getLocalIndex(seats[i].seatindex);
        //         self._seats2[index].setDingzhuang(seats[i].dingzhuang);
        //     }
        // });
        //互动
        // game.addHandler('interactivaction_push', function (data) {
        //     if (data == null) {
        //         return;
        //     }
        //     cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWUSEPROPVIEW_CTC, { isShow: true, content: data });

        // });

        //涟水天听消息处理
        game.addHandler('game_tian_ting_cnt_push', function (data) {
            self._tingAlert.active = true;
        });
        game.addHandler('game_tingresult', function (data) {
            var seats = cc.fy.gameNetMgr.seats;
            var length = seats.length;
            for (var i = 0; i < length; i++) {
                var index = cc.fy.gameNetMgr.getLocalIndex(seats[i].seatindex);

                self._seats2[index].setTing((seats[i].tingState == 1 || seats[i].tingState == 2), seats[i].tiantingstate);
            }
        });

        game.addHandler('cancelTing_recv', function (data) {
            var seats = cc.fy.gameNetMgr.seats;
            var length = seats.length;
            for (var i = 0; i < length; i++) {
                var index = cc.fy.gameNetMgr.getLocalIndex(seats[i].seatindex);

                self._seats2[index].setTing((seats[i].tingState == 1 || seats[i].tingState == 2), seats[i].tiantingstate);
            }
        });
        game.addHandler('game_begin', function (data) {
            self.refreshBtns();
            self.initSeats();
            self.stopEmojis();
            cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWGAMEVIEW_MJPEIZHI_CTC, { isShow: false });
        });

        game.addHandler('game_num', function (data) {
            self.refreshBtns();
        });

        game.addHandler('game_chupai', function (data) {
            self.setTurn(cc.fy.gameNetMgr.turn);
            if (self._tingAlert) {
                self._tingAlert.active = false;
            }
        });

        game.addHandler('guo_notify', function (data) {
            self.setTurn(cc.fy.gameNetMgr.turn);
        });

        // game.addHandler('game_huanpai',function(data){
        //     for(var i in self._seats2){
        //         self._seats2[i].refreshXuanPaiState();    
        //     }
        // });

        // game.addHandler('huanpai_notify',function(data){
        //     var idx = data.seatindex;
        //     var localIdx = cc.fy.gameNetMgr.getLocalIndex(idx);
        //     self._seats2[localIdx].refreshXuanPaiState();
        // });

        // game.addHandler('game_huanpai_over',function(data){
        //     for(var i in self._seats2){
        //         self._seats2[i].refreshXuanPaiState();    
        //     }
        // });

        game.addHandler('voice_msg', function (data) {
            var data = data;
            self._voiceMsgQueue.push(data);
            self.playVoice();
        });

        game.addHandler('chat_push', function (data) {
            var data = data;
            console.log("<><><", data)
            var idx = cc.fy.gameNetMgr.getSeatIndexByID(data.sender);
            var localIdx = cc.fy.gameNetMgr.getLocalIndex(idx);
            self._seats[localIdx].chat(data.content);
            self._seats2[localIdx].chat(data.content);

        });

        // game.addHandler('quick_chat_push', function (data) {
        //     console.log("this.node quick_chat_push");
        //     var data = data;
        //     var idx = cc.fy.gameNetMgr.getSeatIndexByID(data.sender);
        //     var localIdx = cc.fy.gameNetMgr.getLocalIndex(idx);
        //     var seatData = cc.fy.gameNetMgr.seats[idx];

        //     var index = data.content;
        //     var info = cc.fy.chatMsg.getQuickChatInfo(index);
        //     var gameChild = self.node.getChildByName("game");
        //     if (gameChild) {
        //         if (gameChild.active) {
        //             self._seats2[localIdx].chat(info.content);
        //         } else {
        //             self._seats[localIdx].chat(info.content);
        //         }
        //     }
        //     else {
        //         self._seats[localIdx].chat(info.content);
        //         self._seats2[localIdx].chat(info.content);
        //     }
        //     // cc.fy.audioMgr.playSFX(info.sound);
        //     cc.fy.audioMgr.playQuickChatBySex(info.sound, seatData, cc.fy.gameNetMgr.conf.type);
        // });
        game.addHandler('quick_chat_push', function (data) {

            var idx = cc.fy.gameNetMgr.getSeatIndexByID(data.sender);
            var localIdx = cc.fy.gameNetMgr.getLocalIndex(idx);
            var index = data.content;
            console.log("content：", index);
            var info = cc.fy.chatBagMsg.getQuickChatInfo(index);
            self._seats[localIdx].chat(info.content);
            self._seats2[localIdx].chat(info.content);
            var sex = 0;
            var cont = null;
            console.log('!!!!!!', data)
            console.log('!!!!!!123', info)
            if (cc.fy.baseInfoMap) {
                cont = cc.fy.baseInfoMap[data.sender];
            }
            if (cont) {
                sex = cont.sex;
                cc.fy.audioMgr.playChat(info.sound, sex);
                return;
            }
            else {
                cc.fy.userMgr.getBaseInfo(data.sender, function (code, content) {
                    if (content.name) {
                        sex = content.sex;
                        cc.fy.audioMgr.playChat(info.sound, sex);

                    } else {
                        cc.fy.audioMgr.playChat(info.sound, sex);
                    }
                });
            }
        });
        game.addHandler('emoji_push', function (data) {
            var data = data;
            var idx = cc.fy.gameNetMgr.getSeatIndexByID(data.sender);
            var localIdx = cc.fy.gameNetMgr.getLocalIndex(idx);
            console.log(data);
            var gameChild = self.node.getChildByName("game");
            if (gameChild) {
                if (gameChild.active) {
                    self._seats2[localIdx].emoji(data.content);
                } else {
                    self._seats[localIdx].emoji(data.content);
                }
            }
            else {
                self._seats[localIdx].emoji(data.content);
                self._seats2[localIdx].emoji(data.content);
            }
        });
        //扔鸡蛋等动画
        game.addHandler('interactivaction_push', function (data) {
            if (data == null) {
                return;
            }
            cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWUSEPROPVIEW_CTC, { isShow: true, content: data });

        });
        game.addHandler('3D2D_Config', function (data) {
            // self.refreshRoomNoPos();
        });

        game.addHandler('game_over', function (data) {
            // for (var i = 0; i < seats.length; ++i) {
            //     if (seats[i].userId == 0) break;
            //     this.initSingleSeat(seats[i]);
            // }
            self.initSeats();
        });




    },

    refreshRoomNoPos() {
        var cardSetting = JSON.parse(cc.fy.localStorage.getItem('card_setting'));
        if (cc.fy.utils.check3D(cardSetting)) { // 3d
            this.lblRoomNo.node.parent.setPosition(0, -15);
        }
        else {
            this.lblRoomNo.node.parent.setPosition(0, -37);
        }
    },

    initSeats: function () {
        var seats = cc.fy.gameNetMgr.seats;
        console.log(seats);
        if (seats == null) {
            console.log("initSeats seats = null");
            return;
        }
        var showPiao = this.isNeedShowPiao(seats);
        for (var i = 0; i < seats.length; ++i) {
            if (seats[i].userId == 0) break;
            this.initSingleSeat(seats[i]);
        }
        this.InitSameIP(); // 检测同ip
        // cc.fy.anticheatingMgr.check();
    },


    // setGamePoint: function (data) {
    //     for (var i = 0; i < this._point.length; ++i) {
    //         this._point[i].active = false;
    //     }
    //     var east = cc.fy.gameNetMgr.getSeatIndexByID(data);
    //     var seatPoint = cc.fy.gameNetMgr.getLocalIndex(east);
    //     if (cc.fy.gameNetMgr.conf.type == 23) {
    //         this._point[seatPoint].active = true;
    //     }
    // },

    isNeedShowPiao: function (seats) {
        for (var i = 0; i < seats.length; i++) {
            if (seats[i].piaohua == -1) {
                return false;
            }
        }

        return true;
    },

    initSingleSeat: function (seat, showPiao) {
        var index = cc.fy.gameNetMgr.getLocalIndex(seat.seatindex);
        var isOffline = !seat.online;
        var isZhuang = seat.seatindex == cc.fy.gameNetMgr.button;

        console.log("isOffline:" + isOffline);
        console.log("seat.ready:" + seat.ready);
        console.log("seat.score" + seat.score);
        this._seats[index].setInfo(seat.name, seat.score);
        this._seats[index].setReady(seat.ready);
        this._seats[index].setOffline(isOffline);
        this._seats[index].setID(seat.userid);
        this._seats[index].voiceMsg(false);
        this._seats[index].setSameIP(cc.fy.anticheatingMgr.isSameIP(seat));
        this._seats2[index].setInfo(seat.name, seat.score);
        this._seats2[index].setZhuang(isZhuang);
        this._seats2[index].setOffline(isOffline);
        this._seats2[index].setID(seat.userid);
        this._seats2[index].setSameIP(cc.fy.anticheatingMgr.isSameIP(seat));
        this._seats2[index].voiceMsg(false);
        if (cc.fy.gameNetMgr.gamestate != "piaohua") {
            this._seats2[index].setTurn(cc.fy.gameNetMgr.turn == seat.seatindex);
        }
        // this._seats2[index].refreshXuanPaiState();
        if (showPiao != false || seat.seatindex == cc.fy.gameNetMgr.seatindex) {
            this._seats2[index].setPiao(seat.piaohua);
        }
        else {
            this._seats2[index].setPiao(-1);
        }

        // if (cc.fy.gameNetMgr.gamestate != "lazhuang") {
        //     this._seats2[index].setTurn(cc.fy.gameNetMgr.turn == seat.seatindex);
        // }
        // this._seats2[index].setLazhuang(seat.lazhuang);
        // this._seats2[index].setDingzhuang(seat.dingzhuang);
        this._seats2[index].setTing((seat.tingState == 1 || seat.tingState == 2), seat.tiantingstate);

        // if (cc.fy.gameNetMgr.conf.type == cc.JPGD && index == 0) {
        //     this._seats2[index].setInfo(seat.name, seat.score, 15);
        // }
        // else {
        this._seats2[index].setInfo(seat.name, seat.score);
        // }
        //房主fangzhu
        var fangzhu1 = this._seats[index].node.getChildByName("fangzhu");
        var fangzhu2 = this._seats2[index].node.getChildByName("fangzhu");
        if (seat.seatindex == 0 && cc.fy.gameNetMgr.conf.aagems != 1 && cc.fy.gameNetMgr.conf.isClubRoom != true) {
            fangzhu1.active = true;
            fangzhu2.active = true;
        }
        else {
            fangzhu1.active = false;
            fangzhu2.active = false;
        }

        // if (index == 0 && cc.fy.gameNetMgr.gamestate == "") {
        //     this._btnReady.active = !seat.ready;
        //     this._loading.active = seat.ready;
        //     this._tiChuTime.active = this._btnReady.active;
        // }
    },

    InitSameIP: function () {
        var seats = cc.fy.gameNetMgr.seats;
        if (seats == null) {
            console.log("initSeats seats = null");
            return;
        }
        for (var i = 0; i < seats.length; ++i) {
            var index = cc.fy.gameNetMgr.getLocalIndex(seats[i].seatindex);
            this._seats[index].setSameIP(cc.fy.anticheatingMgr.isSameIP(seats[i]));
            this._seats2[index].setSameIP(cc.fy.anticheatingMgr.isSameIP(seats[i]));
        }
        this.showWarnWord();
    },

    //gps点击
    onBtnGpsClicked: function () {
        // cc.fy.audioMgr.playSFX("click_return.mp3");
        console.log("mjroom  showgps");
        cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWGPSALERTVIEW_CTC, { isShow: true, isForce: true });
    },
    showWarnWord: function () {
        cc.fy.gpsAlertMsg.initGPS()
        cc.fy.gpsAlertMsg.setDistance()
        // var warnInfo = cc.fy.gpsAlertMsg.setDistance();
        // var self = this;
        // var isShowWarn = false;
        // var sameIPSeat = cc.fy.anticheatingMgr.checkSameIP();
        // var btnGps = cc.find("Canvas/btnbox/btn_gps");
        // var GpsSprite = btnGps.getComponent(cc.Sprite);
        // if (warnInfo || sameIPSeat) {
        //     for (var i = 0; i < warnInfo.length; ++i) {
        //         var info = warnInfo[i];
        //         if (info != "unknow" && info <= 0.5) {
        //             console.log("gps变红");
        //             isShowWarn = true;
        //             break;
        //         }
        //     }
        // }
        // if (isShowWarn) {
        //     btnGps.color = new cc.Color(255, 0, 0);
        //     btnGps.getChildByName("Warn").active = true;
        // } else {
        //     btnGps.color = new cc.Color(255, 255, 255);
        //     btnGps.getChildByName("Warn").active = false;
        // }
    },
    setTurn: function (turn) {
        var seats = cc.fy.gameNetMgr.seats;
        if (seats == null) {
            console.log("setTurn seats = null");
            return;
        }
        for (var i = 0; i < seats.length; ++i) {
            var index = cc.fy.gameNetMgr.getLocalIndex(seats[i].seatindex);
            this._seats2[index].setTurn(turn == seats[i].seatindex);
        }
    },

    onBtnSettingsClicked: function () {
        //cc.fy.audioMgr.playSFX("click_return.mp3");
        if (cc.fy.sceneMgr.isMJGameScene()) {
            //  console.log("ID_SHOWGAMESETTINGVIEW_CTC ");
            cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWMJGAMESETTINGVIEW_CTC, { isShow: true });
        }
        else if (cc.fy.sceneMgr.isGDGameScene()) {
            console.log("ID_SHOWGAMESETTING_GD_VIEW_CTC ");
            cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWGAMESETTING_GD_VIEW_CTC);
        }

    },

    onBtnBackClicked: function () {
        cc.fy.alert.show("返回大厅房间仍会保留，快去邀请大伙来玩吧！", function () {
            if (cc.fy.gameNetMgr.numOfGames > 0) {
                if (cc.fy.hintBox == null) {
                    var HintBox = require("HintBox");
                    cc.fy.hintBox = new HintBox();
                }
                cc.fy.hintBox.show("游戏已经开始，请继续游戏！");
            }
            else {
                cc.fy.sceneMgr.loadScene("hall");
            }
        }, true);
    },

    onBtnReadyClicked: function () {
        cc.fy.gameNetMgr.dispatchEvent("ready_recv");
        cc.fy.net.send('ready');
    },

    //游戏场景内点击闲聊邀请好友
    onBtnXianliaoClicked: function () {
        var btnCopy = cc.find("prepare/btnLayout/btnCopy", this.node);
        var btnShareWX = cc.find("prepare/btnLayout/btnWeichat", this.node);
        var btnShareXL = cc.find("prepare/btnLayout/btnXianLiao", this.node);
        var btnShareMW = cc.find("prepare/btnLayout/btnMoWang", this.node);
        if (btnCopy && btnShareWX && btnShareXL && btnShareMW) {
            // btnCopy.getComponent(cc.Button).interactable = false;
            // btnShareWX.getComponent(cc.Button).interactable = false;
            btnShareXL.getComponent(cc.Button).interactable = false;
            //  btnShareMW.getComponent(cc.Button).interactable = false;
            this.schedule(function () {
                // btnShareWX.getComponent(cc.Button).interactable = true;
                btnShareXL.getComponent(cc.Button).interactable = true;
                //  btnShareMW.getComponent(cc.Button).interactable = true;
            }, 5);
        }
        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZTDH) {
            var title = "苏州推倒胡";
        } else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZCT) {
            var title = "苏州麻将";
        } else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZBD) {
            var title = "苏州百搭麻将";
        } else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZHD) {
            var title = "苏州黄埭麻将";
        } else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZER) {
            var title = "苏州二人麻将";
        } else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZWJ) {
            var title = "吴江麻将";
        }
        var param = "http://fyweb.51v.cn/szmj/images/icon.png";
        var userNum = this.getRoomUserNum();
        var queStr = "";
        if (userNum > 0 && userNum < cc.fy.gameNetMgr.seats.length) {
            queStr = userNum + "缺" + (cc.fy.gameNetMgr.seats.length - userNum);
        }
        //roomid,roomtoken,title,text,url
        cc.fy.anysdkMgr.xianLiaoShareGame(cc.fy.gameNetMgr.roomId, "boxRoom", title + " " + queStr + " 房号:" + cc.fy.gameNetMgr.roomId, cc.fy.gameNetMgr.getWanfa(), param);
    },
    onBtnCopyRoomID: function () {
        // cc.fy.audioMgr.playSFX("click_return.mp3");
        console.log("onBtnCopyRoomID");
        cc.fy.anysdkMgr.copyAndJump(cc.fy.gameNetMgr.roomId.toString(), true);
    },

    onBtnMoWangClicked: function () {
        this.onBtnWeichatClicked("mowang");
    },

    onBtnWeichatClicked: function (isMoWang) {
        // cc.fy.audioMgr.playSFX("click_return.mp3");
        var btnCopy = cc.find("prepare/btnLayout/btnCopy", this.node);
        var btnShareWX = cc.find("prepare/btnLayout/btnWeichat", this.node);
        var btnShareXL = cc.find("prepare/btnLayout/btnXianLiao", this.node);
        var btnShareMW = cc.find("prepare/btnLayout/btnMoWang", this.node);
        if (btnCopy && btnShareWX && btnShareXL && btnShareMW) {
            // btnCopy.getComponent(cc.Button).interactable = false;
            btnShareWX.getComponent(cc.Button).interactable = false;
            // btnShareXL.getComponent(cc.Button).interactable = false;
            btnShareMW.getComponent(cc.Button).interactable = false;
            this.schedule(function () {
                btnShareWX.getComponent(cc.Button).interactable = true;
                // btnShareXL.getComponent(cc.Button).interactable = true;
                btnShareMW.getComponent(cc.Button).interactable = true;
            }, 5);
        }


        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZTDH) {
            var title = "苏州推倒胡";
        } else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZCT) {
            var title = "苏州麻将";
        } else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZBD) {
            var title = "苏州百搭麻将";
        } else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZHD) {
            var title = "苏州黄埭麻将";
        } else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZER) {
            var title = "苏州二人麻将";
        } else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZWJ) {
            var title = "吴江麻将";
        }

        // 淮安 1  苏州 2  如皋 3  连云港 5 泰兴 7
        // var param = "https://ha.51v.cn/api/game/inroom?gameid=10&url=https://a.mlinks.cc/Ae7l?key=" + encodeURIComponent("openPage=boxRoom&inviteCode=" + cc.fy.gameNetMgr.roomId);
        var param = cc.InviteLink + encodeURIComponent("openPage=boxRoom&inviteCode=" + cc.fy.gameNetMgr.roomId);
        var userNum = this.getRoomUserNum();
        var queStr = "";
        if (userNum > 0 && userNum < cc.fy.gameNetMgr.seats.length) {
            queStr = userNum + "缺" + (cc.fy.gameNetMgr.seats.length - userNum);
        }

        if (isMoWang === "mowang") {
            cc.fy.anysdkMgr.MoWangShareLink(title + " " + queStr + " 房号:" + cc.fy.gameNetMgr.roomId, " 玩法:" + cc.fy.gameNetMgr.getWanfa(), param);
        } else {
            cc.fy.anysdkMgr.share(title + " " + queStr + " 房号:" + cc.fy.gameNetMgr.roomId, " 玩法:" + cc.fy.gameNetMgr.getWanfa(), param);
        }


    },

    array_contain: function (array, obj) {
        if (array == null) {
            return;
        }
        for (var i = 0; i < array.length; i++) {
            if (array[i] == obj)//如果要求数据类型也一致，这里可使用恒等号===
                return true;
        }
        return false;
    },

    getRoomUserNum: function () {
        var num = 0;
        if (cc.fy.gameNetMgr.seats != null) {
            for (var i = 0; i < cc.fy.gameNetMgr.seats.length; i++) {
                if (cc.fy.gameNetMgr.seats[i] && cc.fy.gameNetMgr.seats[i].userid != 0) {
                    num++;
                }
            }
        }
        return num;
    },

    onBtnDissolveClicked: function () {
        if (cc.FREEVERSION == true) {
            cc.fy.alert.show("是否确定解散房间？", function () {
                if (cc.fy.gameNetMgr.numOfGames > 0) {
                    if (cc.fy.hintBox == null) {
                        var HintBox = require("HintBox");
                        cc.fy.hintBox = new HintBox();
                    }
                    cc.fy.hintBox.show("游戏已经开始，请继续游戏！");
                }
                else {
                    cc.fy.net.send("dispress");
                }
            }, true);
        }
        else {
            cc.fy.alert.showFK(0, function () {
                if (cc.fy.gameNetMgr.numOfGames > 0) {
                    if (cc.fy.hintBox == null) {
                        var HintBox = require("HintBox");
                        cc.fy.hintBox = new HintBox();
                    }
                    cc.fy.hintBox.show("游戏已经开始，请继续游戏！");
                }
                else {
                    cc.fy.net.send("dispress");
                }
            }, true);
        }
    },

    onBtnExit: function () {
        cc.fy.net.send("exit");
    },

    onBtnChatClicked: function () {
        //cc.fy.audioMgr.playSFX("click_return.mp3");
        if (cc.fy.replayMgr.isReplay() == true) {
            return false;
        }

        // cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWCHATVIEW_CTC, { isShow: true });
        cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWCHATBAGVIEW_CTC, { isShow: true });
    },

    playVoice: function () {
        if (this._playingSeat == null && this._voiceMsgQueue.length) {
            console.log("playVoice2");
            var data = this._voiceMsgQueue.shift();
            var idx = cc.fy.gameNetMgr.getSeatIndexByID(data.sender);
            var localIndex = cc.fy.gameNetMgr.getLocalIndex(idx);
            this._playingSeat = localIndex;
            this._seats[localIndex].voiceMsg(true);
            this._seats2[localIndex].voiceMsg(true);

            var msgInfo = JSON.parse(data.content);

            var msgfile = "voicemsg.amr";
            console.log(msgInfo.msg.length);
            cc.fy.voiceMgr.writeVoice(msgfile, msgInfo.msg);
            cc.fy.voiceMgr.play(msgfile);
            this._lastPlayTime = Date.now() + msgInfo.time;
        }
    },
    playBtnClickSound: function (event) {
        // cc.fy.audioMgr.playSFX("click_return.mp3");
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
    },
    addSound: function (curNode) {
        if (curNode.childrenCount == 0) {
            return;
        }
        for (var i = 0; i < curNode.childrenCount; i++) {
            let newNode = curNode.children[i];
            if (newNode.getComponent(cc.Button) != null && this.checkIsNeed(newNode)) {
                cc.fy.utils.addClickEvent(newNode.getComponent(cc.Button), this.node, "MJRoom", "playBtnClickSound");
            }
            this.addSoundS2(newNode);
        }
    },
    addSoundS2: function (curNode) {
        if (curNode.childrenCount == 0) {
            return;
        }
        for (var i = 0; i < curNode.childrenCount; i++) {
            let newNode = curNode.children[i];
            if (newNode.getComponent(cc.Button) != null && this.checkIsNeed(newNode)) {
                cc.fy.utils.addClickEvent(newNode.getComponent(cc.Button), this.node, "MJRoom", "playBtnClickSound");
            }
            this.addSound(newNode);
        }
    },
    checkIsNeed: function (node) {
        let banList = ["mjBlank", "btnWeichat", "New Sprite(Splash)", "btnPeng", "btnGang", "btnHu", "MyMahJong",
            "btnJiating", "btnChi", "btntianting", "btnGuo", "btnTGuo", "btnCancel"];
        let needList = [];
        if (needList.indexOf(node.name) != -1) {
            return true;
        }
        if (banList.indexOf(node.name) != -1) {
            return false;
        }
        if (node.getComponent(cc.Button) != null && node.getComponent(cc.Button).clickEvents.length == 0) {
            return false;
        }
        return true;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        var minutes = Math.floor(Date.now() / 1000 / 60);
        if (this._lastMinute != minutes) {
            this._lastMinute = minutes;
            var date = new Date();
            var h = date.getHours();
            h = h < 10 ? "0" + h : h;

            var m = date.getMinutes();
            m = m < 10 ? "0" + m : m;
            if (this._timeLabel) {
                this._timeLabel.string = "" + h + ":" + m;
            }
        }


        if (this._lastPlayTime != null) {
            if (Date.now() > this._lastPlayTime + 200) {
                this.onPlayerOver();
                this._lastPlayTime = null;
            }
        } else {
            this.playVoice();
        }
    },


    onPlayerOver: function () {
        cc.fy.audioMgr.resumeAll();
        console.log("onPlayCallback:" + this._playingSeat);
        var localIndex = this._playingSeat;
        this._playingSeat = null;
        this._seats[localIndex].voiceMsg(false);
        this._seats2[localIndex].voiceMsg(false);
    },

    onDestroy: function () {
        cc.fy.voiceMgr.stop();
        //        cc.fy.voiceMgr.onPlayCallback = null;
    },

    getRoomUserNum: function () {
        var num = 0;
        if (cc.fy.gameNetMgr.seats != null) {
            for (var i = 0; i < cc.fy.gameNetMgr.seats.length; i++) {
                if (cc.fy.gameNetMgr.seats[i] && cc.fy.gameNetMgr.seats[i].userid != 0) {
                    num++;
                }
            }
        }
        return num;
    },
    gangScore: function (score) {
        for (var i = 0; i < this._gamePlayer; i++) {
            var index = cc.fy.gameNetMgr.getSeatIndexByID(score[i].userId);
            var localIndex = cc.fy.gameNetMgr.getLocalIndex(index);
            var s = score[i].score;
            this._seats[localIndex].gangscore(s);
            this._seats2[localIndex].gangscore(s);
            this.playAniGang(localIndex, score[i].lwScore)
            // if (score[i].lwScore == -1) {
            //     //this.playSPEfx(localIndex, "jian1");
            //     this.playAniGang(localIndex,-1)
            // }
            // else if (score[i].lwScore == -2) {
            //     this.playAniGang(localIndex,-2)

            // }
            // else if (score[i].lwScore == -3) {
            //     this.playAniGang(localIndex,-1)
            //     this.playSPEfx(localIndex, "jian3");
            // }
            // else if (score[i].lwScore == 1) {
            //     this.playSPEfx(localIndex, "jia1");
            // }
            // else if (score[i].lwScore == 2) {
            //     this.playSPEfx(localIndex, "jia2");
            // }
            // else if (score[i].lwScore == 3) {
            //     this.playSPEfx(localIndex, "jia3");
            // }
            // else if (score[i].lwScore == 4) {
            //     this.playSPEfx(localIndex, "jia4");
            // }
            // else if (score[i].lwScore == 6) {
            //     this.playSPEfx(localIndex, "jia6");
            // }
        }
    },
    playSPEfx: function (index, animname) {
        var self = this;
        var gameChild = this.node.getChildByName("game");
        var sides = [];
        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.ERMJ || this._gamePlayer == 2) {
            sides = ["myself", "up"];
        }
        else if (this._gamePlayer == 3) {
            sides = ["myself", "right", "left"];
        }
        else {
            sides = ["myself", "right", "up", "left"];
        }
        var sideNode = gameChild.getChildByName(sides[index]);
        var gangscores = sideNode.getChildByName("seat").getChildByName("gangscore");
        gangscores.active = true;
        // var skeleton = gangscores.getComponent(sp.Skeleton);
        // skeleton.setAnimation(1, animname, false);
        // skeleton.setCompleteListener(function () {
        //     gangscores.active = false;
        // }, this, null);
    },
    playAniGang(index, fenshu) {
        var self = this;
        var gameChild = this.node.getChildByName("game");
        var sides = [];
        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.ERMJ || this._gamePlayer == 2) {
            sides = ["myself", "up"];
        }
        else if (this._gamePlayer == 3) {
            sides = ["myself", "right", "left"];
        }
        else {
            sides = ["myself", "right", "up", "left"];
        }
        var sideNode = gameChild.getChildByName(sides[index]);
        var gangscores = sideNode.getChildByName("seat").getChildByName("gangscore");
        var aniJia = gangscores.getChildByName('aniJia')
        var aniJian = gangscores.getChildByName('aniJian')
        aniJia.active = false
        aniJian.active = false
        gangscores.active = true;
        if (fenshu > 0) {
            aniJia.active = true
            aniJia.getComponent(cc.Label).string = '+' + fenshu
            aniJia.getComponent('gangFenAni').PlayAni()
        } else {
            if (fenshu == 0) {
                aniJian.active = false
                return
            }
            aniJian.active = true
            aniJian.getComponent(cc.Label).string = fenshu
            aniJian.getComponent('gangFenAni').PlayAni()
        }
        console.log('lllllllllldddddddddddd', fenshu)
    },
    getFriendViewItem: function (index) {
        var content = this._friendContent;
        var viewitemTemp = this._friendViewitemTemp;
        var node = cc.instantiate(viewitemTemp);
        content.addChild(node);
        return node;
    },

    stopEmojis() {
        for (var i = 0; i < this._gamePlayer; i++) {
            this._seats[i].stopEmoji();
            this._seats2[i].stopEmoji();
        }
    },

    onDestroy: function () {
        cc.fy.voiceMgr.stop();
        //        cc.fy.voiceMgr.onPlayCallback = null;
    }
});
// cc._RFpop();