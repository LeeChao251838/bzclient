var GameMsgDef = require("GameMsgDef");
cc.Class({
    extends: require("BaseModuleView"),

    properties: {
        //_labinfo: null,           //房间信息
        //_roomid: null,            //房间号
        //_wanfa: null,             //玩法
        timeLabel: cc.Label,              //时间
        _seats: [],               //座位

        _cost: null,               //支付方式

        _btnBackToClub: null,      //返回俱乐部
        _btnBackToHall: null,      // 返回大厅
        _btnShare: null,          //分享按钮

        _btnWebLink: null,          //网页分享
        _gameplayer: 3,           //玩家数

        _clubname: null,

        _roomuuid: null,           //分享链接专用
        _scoreList: [],

        _isClickedShare: false,
        _isShare: false,
        _myScore: 0,
    },

    onLoad: function () {
        this._isShare = false;
        this._isClickedShare = false;
        this._myScore = 0;
        this.initView();
        this.initEventHandlers();
    },

    start: function () {

    },

    initEventHandlers: function () {
        var self = this;
        var game = cc.fy.gameNetMgr;

        game.addHandler(GameMsgDef.ID_SHOWGAMERESULTVIEW_PDK_CTC, function (data) {
            if (data && data.isShow == false) {
                self.hidePanel();
            }
            else {
                self.showPanel(data);
            }
        });

        game.addHandler("share_result_push", function (data) {
            if (self._btnWebLink == null) {
                self._btnWebLink = cc.find("btnLayout/btnWebLink", this.node);
            }
            if (game.conf.isClubRoom && game._isShare && self._roomuuid != null) {
                self._btnWebLink.active = true;
                self._isShare = game._isShare;
                if (self._myScore >= 0) {
                    self._isClickedShare = true;
                } else {
                    self._isClickedShare = false;
                }
            } else {
                self._btnWebLink.active = false;
            }
        });

    },

    initView: function () {
        // 作为弹框模式 不隐藏其它弹框
        this.setHideOther(false);


        // this._labinfo = this.node.getChildByName("labinfo");

        // this._roomid = this._labinfo.getChildByName("roomid").getComponent(cc.Label);
        // this._wanfa = this._labinfo.getChildByName("wanfa").getComponent(cc.Label);


        if (cc.fy.gameNetMgr.seats == null || cc.fy.gameNetMgr.seats.length <= 0) {
            return;
        }

        this._gameplayer = cc.fy.gameNetMgr.seats.length;//cc.fy.gameNetMgr.conf.maxCntOfPlayers
        this._cost = this.node.getChildByName("cost");
        var seatRoot = this.node.getChildByName("seats");
        for (var i = 0; i < this._gameplayer; i++) {
            var seat = "seat" + i;
            var seatnode = seatRoot.getChildByName(seat);
            seatnode.active = true;
            var seatinfo = {}
            seatinfo.head = seatnode.getChildByName('head').getChildByName('headSpr').getComponent("ImageLoader");
            seatinfo.fangzhu = seatnode.getChildByName('fangzhu');
            seatinfo.username = seatnode.getChildByName('name').getComponent(cc.Label);
            seatinfo.id = seatnode.getChildByName('id').getComponent(cc.Label);

            seatinfo.winnum = seatnode.getChildByName('winNum').getChildByName('num').getComponent(cc.Label);
            seatinfo.boomnum = seatnode.getChildByName('bombNum').getChildByName('num').getComponent(cc.Label);
            seatinfo.winscore = seatnode.getChildByName('totalScore').getChildByName('winscore').getComponent(cc.Label);
            seatinfo.lostscore = seatnode.getChildByName('totalScore').getChildByName('lostscore').getComponent(cc.Label);
            seatinfo.winner = seatnode.getChildByName('winner');
            this._seats.push(seatinfo)
        }
        if (this._gameplayer == 2) {
            seatRoot.getChildByName("seat2").active = false;
        }
        var btnLayout = this.node.getChildByName("btnLayout");
        this._btnBackToHall = btnLayout.getChildByName("btnback");
        if (this._btnBackToHall) {
            cc.fy.utils.addClickEvent(this._btnBackToHall, this.node, "GameResultView_PDK", "onBtnBackClicked");
        }

        this._btnBackToClub = btnLayout.getChildByName("btnbacktoclub");


        if (this._btnBackToClub) {
            cc.fy.utils.addClickEvent(this._btnBackToClub, this.node, "GameResultView_PDK", "onBtnBackClicked");
        }

        this._btnShare = btnLayout.getChildByName("btnshareImg");
        if (this._btnShare) {
            cc.fy.utils.addClickEvent(this._btnShare, this.node, "GameResultView_PDK", "onBtnShareClicked");
        }

        var shareText = btnLayout.getChildByName("btnshareText");
        if (shareText) {
            cc.fy.utils.addClickEvent(shareText, this.node, "GameResultView_PDK", "onShareText");
        }
        this._clubname = this.node.getChildByName("clubname");

        this._btnWebLink = btnLayout.getChildByName("btnWebLink");
        if (this._btnWebLink) {
            cc.fy.utils.addClickEvent(this._btnWebLink, this.node, "GameResultView_PDK", "onBtnWebLinkClicked");
        }
    },

    showPanel: function (data) {
        cc.fy.userMgr.oldRoomId = null;
        if (data == null || data.data == null || cc.fy.gameNetMgr.seats == null || cc.fy.gameNetMgr.seats.length == 0) {
            this.hidePanel();
        }
        else {
            this.node.active = true;
            let gameOverData = gameOverData = data.data;
            this.onGameEnd(gameOverData);
            if (data.time) {
                this.setTime(data.time)
            }
        }
    },

    hidePanel: function () {

        this.node.active = false;
    },

    //返回大厅
    onBtnBackClicked: function () {
        if (this._isShare && !this._isClickedShare) {
            cc.fy.hintBox.show("请先分享战绩链接 点击下方“分享链接”");
            return;
        }
        //cc.fy.gameNetMgr.roomId = null;
        cc.fy.pdkGameNetMgr.juNum = null;
        cc.fy.sceneMgr.loadScene("hall");
    },


    //分享图片按钮
    onBtnShareClicked: function () {
        console.log("onBtnShareClicked");
        if (this._isShare && !this._isClickedShare) {
            cc.fy.hintBox.show("请先分享战绩链接 点击下方“分享链接”");
            return;
        }
        cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWSHAREVIEW_CTC, { isShow: true, sharetype: 4 });
    },

    onBtnWebLinkClicked: function () {
        console.log("onBtnWebLink");
        if (this._btnWebLink) {
            this._btnWebLink.getComponent(cc.Button).interactable = false;
            this.schedule(function () {
                this._btnWebLink.getComponent(cc.Button).interactable = true;
                this._isClickedShare = true;
            }.bind(this), 2);
        }
        // 分享链接
        // var conf = cc.fy.gameNetMgr.conf;
        // var roomId = cc.fy.gameNetMgr.roomId;
        var gameId = cc.GAMEID;
        // var gameType = conf.type;
        // var userId = cc.fy.userMgr.userId;
        //var round = conf.maxGames;
        // var wanfa = cc.fy.gameNetMgr.getWanfa();
        // var webUrl = cc.SHAREWEBURL;
        // var nowTime = Date.now()/1000 + 1*60*60; 
        var date = new Date();
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        var h = date.getHours();
        var min = date.getMinutes();
        var clubName = "";
        if (cc.fy.gameNetMgr.conf.isClubRoom && cc.fy.gameNetMgr.clubName != "") {
            clubName = "牌友圈：" + cc.fy.gameNetMgr.clubName;
        }
        var gamename = cc.GAMETYPENAME[cc.fy.gameNetMgr.conf.type];
        var timeStr = y + "-" + m + "-" + d + " " + h + ":" + min + "\n" + clubName + "\n" + gamename;
        // if(this._scoreList!=null && this._scoreList.length>0){
        //     timeStr =timeStr+"\n"+ this._scoreList.join("\n");
        // }

        // var url = webUrl + "/activity/share/combat?room_id=" + gameId + "&user_id=" + userId + "&game_room_id=" + roomId + "&game_type=" + gameType + "&deadline=" + nowTime; 
        var url = cc.shareURL + "room_id=" + cc.GAMEID + "&uuid=" + this._roomuuid;
        console.log("url: " + url);
        console.log("timeStr: " + timeStr);
        cc.fy.anysdkMgr.share("点击查看战绩", timeStr, url, "1");
    },

    //分享文字战绩
    onShareText: function () {
        if (this._isShare && !this._isClickedShare) {
            cc.fy.hintBox.show("请先分享战绩链接 点击下方“分享链接”");
            return;
        }
        var gameId = cc.GAMEID;
        var date = new Date();
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        var h = date.getHours();
        var min = date.getMinutes();
        min = min < 10 ? ("0" + min) : min;
        var room = "房间号:" + cc.fy.gameNetMgr.roomId + "\n";
        var gamename = "游戏:" + cc.GAMETYPENAME[cc.fy.gameNetMgr.conf.type] + "\n";
        var wanfa = "规则:" + cc.fy.gameNetMgr.conf.maxGames + "局 " + cc.fy.gameNetMgr.getWanfaArr(cc.fy.gameNetMgr.conf, true).join(" ") + "\n";
        var timeStr = "时间:" + y + "-" + m + "-" + d + " " + h + ":" + min + "\n";
        var clubName = "";
        var url = "";
        if (cc.fy.gameNetMgr.conf.isClubRoom && cc.fy.gameNetMgr.clubName != "") {
            clubName = "牌友圈:" + cc.fy.gameNetMgr.clubName + "\n";

        }
        var line = "================\n";
        if (this._roomuuid != null) {
            url = cc.shareURL + "room_id=" + cc.GAMEID + "&uuid=" + this._roomuuid;
        }

        var result = room + gamename + wanfa + timeStr + clubName + line + this._scoreList.join("\n") + "\n";
        console.log("result:" + result);
        if (url == "") {
            cc.fy.anysdkMgr.copyAndJump(result, false);
            cc.fy.hintBox.show("复制成功");
            // cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWSHAREVIEW_CTC,{isShow:true,sharetype:5,result:result});
            return;
        }
        var onRec = function (ret) {
            console.log("转换url", ret);
            var newurl = url;
            if (ret.code == 0) {
                newurl = ret.data.shortUrl;
            }
            result = result + "战绩链接:" + newurl;
            console.log("文字战绩：" + result);
            cc.fy.anysdkMgr.copyAndJump(result, false);
            cc.fy.hintBox.show("复制成功");

            //cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWSHAREVIEW_CTC,{isShow:true,sharetype:5,result:result});
        };
        cc.fy.anysdkMgr.switchUrl(url, onRec);


    },

    //游戏结束
    onGameEnd: function (data) {
        console.log("PDKGAME END");
        this._scoreList = [];
        this._roomuuid = null;
        var endinfo = data.endinfo;
        var endresult = data.results;
        this._btnWebLink.active = false;
        if (data.room_uuid != null) {
            this._roomuuid = data.room_uuid;
        }
        this._clubname.active = false;
        if (cc.fy.gameNetMgr.conf.isClubRoom) {
            this._clubname.active = true;
            if (cc.fy.gameNetMgr.clubName != null) {
                this._clubname.getChildByName("name").getComponent(cc.Label).string = cc.fy.gameNetMgr.clubName;
            }
            this._btnBackToClub.active = true;
            this._btnBackToHall.active = false;
            cc.fy.gameNetMgr.getIsShareResult(); //请求一下能否分享链接
            cc.fy.reloadData = { "curClubId": cc.fy.gameNetMgr.conf.clubId };

        } else {
            this._btnBackToClub.active = false;
            this._btnBackToHall.active = true;
        }

        for (var i = 0; i < this._seats.length; i++) {
            var seatinfo = cc.fy.gameNetMgr.seats[i];
            var localIndex = cc.fy.gameNetMgr.getLocalIndex(seatinfo.seatindex);
            var seat = this._seats[localIndex];
            //自己的localIndex 是0 保证自己在第一个

            if (cc.fy.gameNetMgr.conf.aagems == 0 && seatinfo.seatindex == 0 && cc.fy.gameNetMgr.conf.isClubRoom != true) {
                seat.fangzhu.active = true;
            }
            else {
                seat.fangzhu.active = false;
            }
            seat.head.setUserID(seatinfo.userid);
            seat.username.string = cc.fy.utils.subStringCN(seatinfo.name, 8, true);
            seat.id.string = seatinfo.userid;

            //正常大结算
            if (endresult.length > 0) {
                var data = endresult[i];
                seat.winnum.string = data.numOfWin;
                seat.boomnum.string = data.total_numOfBomb;
                if (localIndex == 0) {
                    this._myScore = data.totalscore;
                }
                if (data.totalscore >= 0) {
                    seat.winscore.node.active = true;
                    seat.winscore.string = "+" + data.totalscore;
                    seat.lostscore.node.active = false;
                }
                else {
                    seat.winscore.node.active = false;
                    seat.lostscore.node.active = true;
                    seat.lostscore.string = data.totalscore;
                }
                var userscore = cc.fy.utils.subMatchLen(seatinfo.name, 8, " ") + "(ID:" + seatinfo.userid + ") 分数:" + (data.totalscore > 0 ? ("+" + data.totalscore) : data.totalscore);
                this._scoreList.push(userscore);
                //大赢家标志
                if (data.bigWinner == i && data.totalscore != 0) {
                    seat.winner.active = true;
                }
                else {
                    seat.winner.active = false;
                }

            }
            //非正常大结算
            else {
                var totalscore = endinfo.totalScore[i];
                if (localIndex == 0) {
                    this._myScore = totalscore;
                }
                if (totalscore >= 0) {
                    seat.winscore.node.active = true;
                    seat.winscore.string = "+" + totalscore;
                    seat.lostscore.node.active = false;
                }
                else {
                    seat.winscore.node.active = false;
                    seat.lostscore.node.active = true;
                    seat.lostscore.string = totalscore;
                }

                seat.winnum.node.active = false;
                seat.boomnum.node.active = false;

                //大赢家标志
                if (endinfo.winnerIndex == i && totalscore != 0) {
                    seat.winner.active = true;
                }
                else {
                    seat.winner.active = false;
                }
                var userscore = cc.fy.utils.subMatchLen(seatinfo.name, 8, " ") + "(ID:" + seatinfo.userid + ") 分数:" + (totalscore > 0 ? ("+" + totalscore) : totalscore);
                this._scoreList.push(userscore);
            }

        }

        this.setRoomInfo();

    },

    //设置房间信息
    setRoomInfo: function () {
        var conf = cc.fy.gameNetMgr.conf;
        var costIndex = conf.aagems;
        for (let i = 0; i < 3; i++) {
            var ndCost = this._cost.getChildByName("cost" + i);
            if (ndCost) {
                ndCost.active = i == costIndex;
            }
        }
        var infobar = this.node.getChildByName("labinfo");
        var gamename = infobar.getChildByName("gametype");
        var lblwanfa = infobar.getChildByName("labwanfa");
        var roomid = infobar.getChildByName("roomid");
        gamename.getComponent(cc.Label).string = cc.GAMETYPENAME[conf.type];
        lblwanfa.getComponent(cc.Label).string = cc.fy.gameNetMgr.getWanfaArr(conf, true).join("，");  //传true这样就不显示支付方式
        roomid.getComponent(cc.Label).string = "房间号：" + cc.fy.gameNetMgr.roomId;

    },
    setTime(str) {
        if (str) {
            this.timeLabel.string = str;
        } else {
            var date = new Date();
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            var d = date.getDate();
            var h = date.getHours();
            var min = date.getMinutes();
            var timeStr = y + "-" + m + "-" + d + " " + h + ":" + min;
            this.timeLabel.string = timeStr;
        }

    }
});
