var GameMsgDef = require("GameMsgDef");
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
        _gameresult: null,
        _seats: [],
        _gameOverData: [],
        _roominfo: null,
        _lbldate: null,
        _lblroomid: null,
        _lblnum: null,
        _lbltype: null,
        _gamePlayer: 4,
        _player: null,
        _aagems: null,
        _timeLabel: null,

        _scoreList: [], //分享链接专用
        _roomuuid: null,

        _btnShareUrl: null,//分享链接
        _btnBackClub: null,//返回圈
        _btnClose: null,//关闭
        _btnShare: null,//分享图片
        _btnBack: null,//返回大厅
        _isClickedShare: false,
        _isShare: false,
        _myScore: 0,

    },

    onLoad: function () {
        this.initView();
    },
    initView: function () {
        if (cc.fy == null) {
            return;
        }
        this._isShare = false;
        this._isClickedShare = false;
        this._myScore = 0;
        this._gamePlayer = cc.fy.gameNetMgr.seats.length;
        this._gameresult = this.node.getChildByName("game_result");
        // this._gameresult.active = false; 
        if (this._roominfo == null) {//房间信息节点
            this._roominfo = this._gameresult.getChildByName("roominfo");
        }
        if (this._lbldate == null) {//显示时间文本
            this._lbldate = this._roominfo.getChildByName("date");
        }
        if (this._lblroomid == null) {//房间号
            this._lblroomid = this._roominfo.getChildByName("roomid");
        }
        if (this._lblnum == null) {//局数
            this._lblnum = this._roominfo.getChildByName("num");
        }
        if (this._lbltype == null) {
            this._lbltype = this._roominfo.getChildByName("type");
        }
        if (this._player == null) {
            this._player = this._roominfo.getChildByName("playerCount");
        }
        if (this._aagems == null) {
            this._aagems = this._roominfo.getChildByName("aagems");
        }
        if (this._timeLabel == null) {
            this._timeLabel = this._gameresult.getChildByName("timeLabel").getComponent(cc.Label);
        }

        var seats = this._gameresult.getChildByName("seats");
        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZCT
            || cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZBD
            || cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZTDH
            || cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZHD
            || cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZER
            || cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZWJ) {
            for (var i = 0; i < this._gamePlayer; i++) {
                seats.children[i].active = true;
                this._seats.push(seats.children[i].getComponent("SeatMJ"));
            }
        }
        else {
            for (var i = 0; i < seats.children.length; ++i) {
                this._seats.push(seats.children[i].getComponent("SeatMJ"));
            }
        }

        this._btnClose = cc.find("Canvas/gameMain/game_result/btnClose");
        if (this._btnClose) {
            cc.fy.utils.addClickEvent(this._btnClose, this.node, "GameResult", "onBtnCloseClicked");
        }
        this._btnShare = cc.find("Canvas/gameMain/game_result/btnBox/btnshareImg");
        if (this._btnShare) {
            cc.fy.utils.addClickEvent(this._btnShare, this.node, "GameResult", "onBtnShareClicked");
        }
        this._btnBack = cc.find("Canvas/gameMain/game_result/btnBox/btnBack");
        if (this._btnBack) {
            cc.fy.utils.addClickEvent(this._btnBack, this.node, "GameResult", "onBtnCloseClicked");
        }
        this._btnBackClub = cc.find("Canvas/gameMain/game_result/btnBox/btnBackClub");
        if (this._btnBackClub) {
            cc.fy.utils.addClickEvent(this._btnBackClub, this.node, "GameResult", "onBtnCloseClicked");
        }
        this._btnShareUrl = cc.find("Canvas/gameMain/game_result/btnBox/btnWebLink");
        if (this._btnShareUrl) {
            cc.fy.utils.addClickEvent(this._btnShareUrl, this.node, "GameResult", "onBtnShareURLClicked");
        }
        var btnSharetext = cc.find("Canvas/gameMain/game_result/btnBox/btnshareText");
        if (btnSharetext) {
            cc.fy.utils.addClickEvent(btnSharetext, this.node, "GameResult", "onShareText");
        }
        //初始化网络事件监听器
        var self = this;
        // this.node.on('game_over',function(data){self.onGameOver(data.detail);});
        cc.fy.gameNetMgr.addHandler('game_end', function (data) {
            self.onGameEnd(data);

        });

        cc.fy.gameNetMgr.addHandler("share_result_push", function (data) {
            console.log("share_result_push", data);
            if (cc.fy.gameNetMgr.conf.isClubRoom && data.isShare && cc.fy.gameNetMgr.roomUuid != null) {
                self._btnShareUrl.active = true;//true 
                self._isShare = data.isShare;
                if (self._myScore >= 0) {
                    self._isClickedShare = true;
                } else {
                    self._isClickedShare = false;
                }
            }
            else {
                this._btnShareUrl.active = false;
            }
        });
    },

    showPanel: function () {
        this.node.active = true;

    },

    hidePanel: function () {
        this.node.active = false;
    },


    showResult: function (seat, info, isZuiJiaPaoShou, index) {
        console.log('info_gameresult', info)
        // seat.node.getChildByName("zuijiapaoshou").active = isZuiJiaPaoShou;  
        if (info.numzimo && info.numzimo > 0) {
            seat.node.getChildByName("zimocishu").color = new cc.color(255, 255, 255)
            seat.node.getChildByName("zimocishu").opacity = 255
        } else {
            info.numzimo = 0
            seat.node.getChildByName("zimocishu").color = new cc.color(196, 216, 224)
            seat.node.getChildByName("zimocishu").opacity = 150
        }
        if (info.numjiepao && info.numjiepao > 0) {
            seat.node.getChildByName("jiepaocishu").color = new cc.color(255, 255, 255)
            seat.node.getChildByName("jiepaocishu").opacity = 255
        } else {
            info.numjiepao = 0
            seat.node.getChildByName("jiepaocishu").color = new cc.color(196, 216, 224)
            seat.node.getChildByName("jiepaocishu").opacity = 150
        }
        if (info.numdianpao && info.numdianpao > 0) {
            seat.node.getChildByName("dianpaocishu").color = new cc.color(255, 255, 255)
            seat.node.getChildByName("dianpaocishu").opacity = 255
        } else {
            info.numdianpao = 0
            seat.node.getChildByName("dianpaocishu").color = new cc.color(196, 216, 224)
            seat.node.getChildByName("dianpaocishu").opacity = 150
        }
        if (info.numqianggang && info.numqianggang > 0) {

            seat.node.getChildByName("minggangcishu").color = new cc.color(255, 255, 255)
            seat.node.getChildByName("minggangcishu").opacity = 255
        } else {
            info.numqianggang = 0
            seat.node.getChildByName("minggangcishu").color = new cc.color(196, 216, 224)
            seat.node.getChildByName("minggangcishu").opacity = 150
        }
        if (info.numgangkai && info.numgangkai > 0) {
            seat.node.getChildByName("angangcishu").color = new cc.color(255, 255, 255)
            seat.node.getChildByName("angangcishu").opacity = 255
        } else {
            info.numgangkai = 0
            seat.node.getChildByName("angangcishu").color = new cc.color(196, 216, 224)
            seat.node.getChildByName("angangcishu").opacity = 150
        }



        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZWJ) {
            if (info.gangKaiCnt && info.gangKaiCnt > 0) {
                seat.node.getChildByName("angangcishu").color = new cc.color(255, 255, 255)
                seat.node.getChildByName("angangcishu").opacity = 255
            } else {
                info.gangKaiCnt = 0
                seat.node.getChildByName("angangcishu").color = new cc.color(196, 216, 224)
                seat.node.getChildByName("angangcishu").opacity = 150
            }
            if (info.qiangGangCnt && info.qiangGangCnt > 0) {
                seat.node.getChildByName("minggangcishu").color = new cc.color(255, 255, 255)
                seat.node.getChildByName("minggangcishu").opacity = 255
            } else {
                info.qiangGangCnt = 0
                seat.node.getChildByName("minggangcishu").color = new cc.color(196, 216, 224)
                seat.node.getChildByName("minggangcishu").opacity = 150
            }
            if (info.zimoCnt && info.zimoCnt > 0) {
                seat.node.getChildByName("zimocishu").color = new cc.color(255, 255, 255)
                seat.node.getChildByName("zimocishu").opacity = 255
            } else {
                info.zimoCnt = 0
                seat.node.getChildByName("zimocishu").color = new cc.color(196, 216, 224)
                seat.node.getChildByName("zimocishu").opacity = 150
            }

            seat.node.getChildByName("zimocishu").getComponent(cc.Label).string = "自摸次数×" + info.zimoCnt;
            seat.node.getChildByName("jiepaocishu").getComponent(cc.Label).string = "接炮次数×" + info.numjiepao;
            seat.node.getChildByName("dianpaocishu").getComponent(cc.Label).string = "点炮次数×" + info.numdianpao;
            seat.node.getChildByName("angangcishu").getComponent(cc.Label).string = "杠开次数×" + info.gangKaiCnt;
            seat.node.getChildByName("minggangcishu").getComponent(cc.Label).string = "抢杠次数×" + info.qiangGangCnt;


        }
        else {
            seat.node.getChildByName("zimocishu").getComponent(cc.Label).string = "自摸次数×" + info.numzimo;
            seat.node.getChildByName("jiepaocishu").getComponent(cc.Label).string = "接炮次数×" + info.numjiepao;
            seat.node.getChildByName("dianpaocishu").getComponent(cc.Label).string = "点炮次数×" + info.numdianpao;
            seat.node.getChildByName("angangcishu").getComponent(cc.Label).string = "杠开次数×" + info.numgangkai;
            seat.node.getChildByName("minggangcishu").getComponent(cc.Label).string = "抢杠次数×" + info.numqianggang;
        }
        // seat.node.getChildByName("chajiaocishu").getComponent(cc.Label).string = info.numchadajiao;
        seat.node.getChildByName("GameEnd2").active = true;

        // if(seat._score < 0)
        // {
        //     seat.node.getChildByName("score").color = new cc.Color(102, 182, 253);
        // }
        // else
        // {
        //    seat.node.getChildByName("score").color = new cc.Color(254, 202, 61);
        // }
    },

    getViewItem: function (content, item) {
        var node = cc.instantiate(item);
        content.addChild(node);
        return node;
    },

    // onGameOver:function(data){
    //     console.log("GameResult onGameOver ");
    //     if(data == null || data.length == 0)
    //     {
    //         console.log("onGameOver data == null");
    //         return;
    //     }
    //     var thisData = [];
    //     for(var i = 0; i < 4; ++i)
    //     {
    //         thisData.push(data[i].score);
    //     }
    //     this._gameOverData.push(thisData);
    // },

    onGameEnd: function (data) {
        console.log("GameResult onGameEnd ");
        console.log(data);
        this._scoreList = [];
        var date = new Date();
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        var d = date.getDate();
        d = d < 10 ? "0" + d : d;
        var h = date.getHours();
        h = h < 10 ? "0" + h : h;
        var min = date.getMinutes();
        min = min < 10 ? "0" + min : min;
        var timeStr = y + "-" + m + "-" + d + " " + h + ":" + min;
        this._timeLabel.string = timeStr;
        if (cc.fy.gameNetMgr.conf != null) {
            // this._lbltype.getComponent(cc.Label).string = type;
            this._lblroomid.getComponent(cc.Label).string = "房间号：" + cc.fy.gameNetMgr.roomId;
            // this._lblnum.getComponent(cc.Label).string = "局数：" + cc.fy.gameNetMgr.maxNumOfGames + "局";
            this._player.getComponent(cc.Label).string = this._gamePlayer + '人';
            // if(cc.fy.gameNetMgr.aagems != null){
            //     if(cc.fy.gameNetMgr.aagems == 0){
            //         this._aagems.getComponent(cc.Label).string = "房主付";  
            //     }
            //     else if(cc.fy.gameNetMgr.aagems.aagems == 1){
            //         this._aagems.getComponent(cc.Label).string = "AA制"; 
            //     }
            //     else if(cc.fy.gameNetMgr.aagems.aagems == 2){
            //         this._aagems.getComponent(cc.Label).string = "圈主付费";
            //     }
            // }
            var gamename = cc.GAMETYPENAME[cc.fy.gameNetMgr.conf.type];
            this._lbltype.getComponent(cc.Label).string = gamename + " " + this._gamePlayer + '人 ' + cc.fy.gameNetMgr.getWanfa() + " 房间号：" + cc.fy.gameNetMgr.roomId;
        }
        this._btnShareUrl.active = false;
        this._roomuuid = cc.fy.gameNetMgr.roomUuid;
        // if (data.room_uuid != null) {
        //     this._roomuuid = data.room_uuid;
        // }
        cc.fy.gameNetMgr.getIsShareResult(); //请求一下能否分享链接
        if (cc.fy.gameNetMgr.conf.isClubRoom) {
            this._btnBack.active = false;
            this._btnBackClub.active = true;
            console.log("俱乐部房间，请求分享链接");
            cc.fy.reloadData = { "curClubId": cc.fy.gameNetMgr.conf.clubId };
        }
        else {
            this._btnBack.active = true;
            this._btnBackClub.active = false;
        }
        let paiyou = this._gameresult.getChildByName("peiyouquan");
        if (paiyou) {
            console.log("")
            if (cc.fy.gameNetMgr.conf.isClubRoom && cc.fy.gameNetMgr.clubName != "") {
                paiyou.active = true;
                console.log("cc.fy.gameNetMgr.clubName", cc.fy.gameNetMgr.clubName)
                paiyou.getChildByName("paiyou").getComponent(cc.Label).string = cc.fy.gameNetMgr.clubName;
            } else {
                paiyou.active = false;
            }
        }

        this.sortData(data);
        var endinfo = data.endinfo;
        this._gameOverData = data.scores;
        if (this._gameOverData == null || this._gameOverData.length < 1) {
            if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZER) {
                this._gameOverData = [[0, 0]];
            }
            else {
                this._gameOverData = [[0, 0, 0, 0]];
            }
        }
        var seats = [];
        for (var i = 0; i < data.results.length; ++i) {
            for (var j = 0; j < cc.fy.gameNetMgr.seats.length; ++j) {
                if (data.results[i] != null && data.results[i].userId == cc.fy.gameNetMgr.seats[j].userid) {
                    if (cc.fy.gameNetMgr.seats[j] != null) {
                        seats.push(cc.fy.gameNetMgr.seats[j]);
                    }
                }
            }

        }
        var maxscore = -1;
        var maxdianpao = 0;
        var dianpaogaoshou = -1;

        if (seats.length > 4) {
            return;
        }

        for (var i = 0; i < seats.length; ++i) {
            var seat = seats[i];
            if (seat.score > maxscore) {
                maxscore = seat.score;
            }

            if (endinfo[i].numdianpao > maxdianpao) {
                maxdianpao = endinfo[i].numdianpao;
                dianpaogaoshou = i;
            }
        }

        for (var i = 0; i < seats.length; ++i) {
            var seat = seats[i];
            var isBigwin = false;
            if (seat.score > 0) {
                isBigwin = seat.score == maxscore;
            }
            var userScore = cc.fy.utils.subMatchLen(seat.name, 8, " ") + " (ID:" + seat.userid + ")" + " 分数:" + (seat.score > 0 ? ("+" + seat.score) : seat.score);
            this._scoreList.push(userScore);
            this._seats[i].setInfo(seat.name, seat.score, isBigwin);
            this._seats[i].setID(seat.userid);
            if (seat.userid == cc.fy.userMgr.userId) {
                this._myScore = seat.score;
                this._gameresult.getChildByName("seats").children[i].getChildByName('name').color = new cc.color(255, 249, 154)
            }
            var isZuiJiaPaoShou = dianpaogaoshou == i;
            this.showResult(this._seats[i], endinfo[i], isZuiJiaPaoShou, i);
        }
        var seats_node = this._gameresult.getChildByName("seats");
        if (!cc.fy.gameNetMgr.conf.isClubRoom) {
            if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZCT
                || cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZBD
                || cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZTDH
                || cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZHD
                || cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZER
                || cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZWJ) {

                for (var i = 0; i < this._gamePlayer; ++i) {
                    var seat = seats_node.children[i];
                    var houseOwner = seat.getChildByName("fangzhu");
                    var isHouseOwner = endinfo[i].houseowner;
                    if (houseOwner != null) {
                        houseOwner.active = isHouseOwner;
                    }
                }
            }
            else {
                for (var i = 0; i < seats.length; ++i) {
                    var seat = seats_node.children[i];
                    var houseOwner = seat.getChildByName("fangzhu");
                    var isHouseOwner = endinfo[i].houseowner;
                    if (houseOwner != null) {
                        houseOwner.active = isHouseOwner;
                    }
                }
            }
        }
        else {
            for (var i = 0; i < seats.length; ++i) {
                var seat = seats_node.children[i];
                var houseOwner = seat.getChildByName("fangzhu");
                houseOwner.active = false;
            }
        }

    },

    sortData: function (data) {
        if (data == null) {
            return;
        }

        for (var i = 0; i < data.results.length - 1; ++i) {
            for (var j = 0; j < data.results.length - 1 - i; ++j) {
                if (data.results[j].totalscore < data.results[j + 1].totalscore) {
                    var tempResults = data.results[j];
                    data.results[j] = data.results[j + 1];
                    data.results[j + 1] = tempResults;

                    var tempEndinfo = data.endinfo[j];
                    data.endinfo[j] = data.endinfo[j + 1];
                    data.endinfo[j + 1] = tempEndinfo;

                    var score;
                    for (var m = 0; m < data.scores.length; ++m) {
                        if (data.scores[m] != null) {
                            score = data.scores[m];
                            var tempScore = score[j];
                            score[j] = score[j + 1];
                            score[j + 1] = tempScore;
                        }
                    }
                }
                else if (data.results[j].totalscore == data.results[j + 1].totalscore) {
                    if (data.results[j].userId < data.results[j + 1].userId) {
                        var tempResults = data.results[j];
                        data.results[j] = data.results[j + 1];
                        data.results[j + 1] = tempResults;

                        var tempEndinfo = data.endinfo[j];
                        data.endinfo[j] = data.endinfo[j + 1];
                        data.endinfo[j + 1] = tempEndinfo;

                        var score;
                        for (var m = 0; m < data.scores.length; ++m) {
                            if (data.scores[m] != null) {
                                score = data.scores[m];
                                var tempScore = score[j];
                                score[j] = score[j + 1];
                                score[j + 1] = tempScore;
                            }
                        }
                    }
                }
            }
        }
    },

    onBtnCloseClicked: function () {
        // onBtnCloseClicked
        if (this._isShare && !this._isClickedShare) {
            cc.fy.hintBox.show("请先分享战绩链接 点击下方“分享链接”");
            return;
        }
        cc.fy.gameNetMgr.roomUuid = "";
        cc.fy.sceneMgr.loadScene("hall");
    },


    //分享图片
    onBtnShareClicked: function () {
        if (this._isShare && !this._isClickedShare) {
            cc.fy.hintBox.show("请先分享战绩链接 点击下方“分享链接”");
            return;
        }
        cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWSHAREVIEW_CTC, { isShow: true, sharetype: 4 });
    },

    onBtnShareURLClicked: function () {

        if (this._btnShareUrl) {
            this._btnShareUrl.getComponent(cc.Button).interactable = false;
            this.schedule(function () {
                this._btnShareUrl.getComponent(cc.Button).interactable = true;
                this._isClickedShare = true;
            }.bind(this), 2);
        }

        // http: //wechat_center.test/activity/share/combat?room_id=10&user_id=16298&game_room_id=296041
        // if(!cc.sys.isNative || cc.sys.os == cc.sys.OS_WINDOWS){
        //     cc.fy.hintBox.show("当前操作系统不支持分享！");
        // }
        //var url = "http://ha.51v.cn/activity/share/combat?";//正式
        // var url = "http://hatest.d51v.com/activity/share/combat?";//测试
        var gameid = "room_id=" + cc.GAMEID;
        var uuid = "&uuid=" + cc.fy.gameNetMgr.roomUuid;
        var url = cc.shareURL + gameid + uuid;
        // var userid = "&user_id=" + cc.fy.userMgr.userId;
        // var roomid = "&game_room_id=" + cc.fy.gameNetMgr.roomId;
        // var gametype = "&game_type=" + cc.fy.gameNetMgr.conf.type;
        // var url = cc.shareURL + gameid + userid + roomid + gametype;

        var date = new Date();
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        var d = date.getDate();
        var h = date.getHours();
        var min = date.getMinutes();
        min = min < 10 ? ("0" + min) : min;
        var time = y + "-" + m + "-" + d + " " + h + ":" + min + "\n";

        var title = "";
        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZCT) {
            title = "苏州麻将";
        }
        else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZBD) {
            title = "百搭麻将";
        }
        else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZTDH) {
            title = "推倒胡";
        }
        else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZHD) {
            title = "黄埭麻将";
        }
        else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZWJ) {
            title = "吴江麻将";
        }
        else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZER) {
            title = "二人麻将";
        }
        var clubName = "";
        if (cc.fy.gameNetMgr.conf.isClubRoom && cc.fy.gameNetMgr.clubName != "") {
            clubName = "牌友圈：" + cc.fy.gameNetMgr.clubName + "\n";
        }
        var info = time + clubName + title;
        // if(this._scoreList!=null && this._scoreList.length>0){
        //     info =info + "\n"+this._scoreList.join("\n");
        // }
        console.log("shareweburl:" + info);
        cc.fy.anysdkMgr.share("点击查看战绩", info, url);
    },
    //文字分享
    onShareText: function () {
        if (this._isShare && !this._isClickedShare) {
            cc.fy.hintBox.show("请先分享战绩链接 点击下方“分享链接”");
            return;
        }
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
        if (cc.fy.gameNetMgr.roomUuid != null) {
            url = cc.shareURL + "room_id=" + cc.GAMEID + "&uuid=" + cc.fy.gameNetMgr.roomUuid;
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

});
