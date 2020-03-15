var GameMsgDef = require("GameMsgDef");
cc.Class({
    extends: cc.Component,

    properties: {
        _sprIcon: null,
        _zhuang: null,
        _ready: null,
        _readyLoading: null,
        _offline: null,
        _lblName: null,
        _lblScore: null,
        _lblScore1: null,
        _nddayingjia: null,
        _voicemsg: null,
        _quanGuan: null,

        _chatBubble: null,
        // _emojibg:null,
        _emoji: null,
        _lastChatTime: -1,

        _userName: "",
        _score: 0,
        _dayingjia: false,
        _isOffline: false,
        _isReady: false,
        _isZhuang: false,
        _isSameIP: false,
        _userId: null,
        _piao: null,



        _ting: false,
        _tianTing: false,
        _tingMark: null,
        _tianTingMark: null,
        _labtPiao: null,
        // _labLazhuang:null,
        _piaozi: null,
        _sameip: null,
        _turn: null,
        _isturn: false,
        _GameEnd2: null,
        headnull: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        if (cc.fy == null) {
            return;
        }
        this.node.active = false;
        this._sprIcon = this.node.getChildByName("icon").getComponent("ImageLoader");
        this._lblName = this.node.getChildByName("name").getComponent(cc.Label);
        this._lblScore = this.node.getChildByName("score");
        this._lblScore1 = this.node.getChildByName("score1");
        this._voicemsg = this.node.getChildByName("voicemsg");
        this._xuanpai = this.node.getChildByName("xuanpai");
        // this.refreshXuanPaiState();

        if (this._voicemsg) {
            this._voicemsg.active = false;
        }

        if (this._sprIcon && this._sprIcon.getComponent(cc.Button)) {
            cc.fy.utils.addClickEvent(this._sprIcon, this.node, "SeatMJ", "onIconClicked");
        }

        this._offline = this.node.getChildByName("offline");

        this._ready = this.node.getChildByName("ready");
        this._readyLoading = this.node.getChildByName("loading");

        this._zhuang = this.node.getChildByName("zhuang");

        this._nddayingjia = this.node.getChildByName("dayingjia");
        this._GameEnd2 = this.node.getChildByName("GameEnd2");

        var ndQuanGuan = this.node.getChildByName("quanguan");
        if (ndQuanGuan) {
            this._quanGuan = ndQuanGuan.getComponent(sp.Skeleton);
            ndQuanGuan.active = false;
        }

        this._chatBubble = this.node.getChildByName("ChatBubble");
        if (this._chatBubble != null) {
            this._chatBubble.active = false;
        }

        this._emoji = this.node.getChildByName("emoji");
        if (this._emoji != null) {
            this._emoji.active = false;
        }

        var piaoNode = this.node.getChildByName("piao");
        if (piaoNode != null) {
            this._piaozi = this.node.getChildByName("piao_zi");
           
         
            this._labtPiao = piaoNode.getComponent(cc.Label);
            this._labtPiao.node.active = false;
            this._piaozi.active = false;
          
        }
        this._tingMark = this.node.getChildByName("tingMark");
        if (this._tingMark) {
            this._tingMark.active = false;
        }
        this._tianTingMark = this.node.getChildByName("tiantingMark");
        if (this._tianTingMark) {
            this._tianTingMark.active = false;
        }
        this._sameip = this.node.getChildByName("sameip");
        if (this._sameip != null) {
            this._sameip.active = false;
        }

        this._turn = this.node.getChildByName("turn");
        if (this._turn) {
            this._turn.active = this._isturn;
        }


        // this._sameip = this.node.getChildByName("sameip");
        if (this.headnull != null) {
            this.headnull.active = false;
        }


        this.refresh();
        if (this._sprIcon && this._userId) {
            this._sprIcon.setUserID(this._userId);
        }
    },

    onIconClicked: function () {
        if (cc.fy.replayMgr.isReplay()) {
            return;
        }
        var iconSprite = this._sprIcon.node.getComponent(cc.Sprite);
        if (this._userId != null && this._userId > 0) {
            var seat = cc.fy.gameNetMgr.getSeatByID(this._userId);
            var sex = 0;
            if (cc.fy.baseInfoMap) {
                var info = cc.fy.baseInfoMap[this._userId];
                if (info) {
                    sex = info.sex;
                }
            }
            console.log(seat);
            var userData = {
                name: seat.name,
                id: seat.userid,
                iconSprite: iconSprite,
                sex: sex,
                ip: seat.ip,
            };

            if (seat.userid == cc.fy.userMgr.userId) {
                userData.geo = cc.fy.userMgr.geolocation;
                userData.code = cc.fy.userMgr.proid;
            }
            else {
                userData.geo = seat.gpsInfo;
            }
            //cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWSEATINFOVIEW_CTC, {isShow:true, data:userData});
            var index = null;
            var nodeP = this._sprIcon.node.parent;

            if (nodeP) {
                if (nodeP.name == 'seat') {
                    index = nodeP.parent.name;
                } else {
                    index = nodeP.name;
                }
            }

            var content = {
                name: seat.name,
                userId: seat.userid % 99900000,
                iconSprite: iconSprite,
                sex: sex,
                ip: seat.ip,
                geo: seat.gpsInfo,
                index: index,
            }
            if (seat.userid == cc.fy.userMgr.userId) {
                content.geo = cc.fy.userMgr.geolocation;
            }
            cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWSEATINFOVIEW_CTC, { isShow: true, content: content });


        }
    },
    stopEmoji() {
        if (this._emoji) {
            this._emoji.active = false;
            this._emoji.getComponent(cc.Animation).stop();
        }
    },
    refresh: function () {
        if (this._lblName != null) {
            this._lblName.string = cc.fy.utils.subStringCN(this._userName, 8, true);
        }

        if (this._lblScore != null) {
            if (this._lblScore1 != null) {
                this._lblScore.active = this._score != null;
                this._lblScore1.active = this._score != null;
                if (this._score >= 0) {
                    //this._lblScore.color = new cc.Color(255, 228, 0);
                    this._lblScore.active = true
                    this._lblScore1.active = false
                    this._lblScore.getComponent(cc.Label).string = '+' + this._score;

                }
                else {

                    //this._lblScore.color = new cc.Color(207, 226, 255);
                    this._lblScore.active = false
                    this._lblScore1.active = true
                    this._lblScore1.getComponent(cc.Label).string = this._score;
                }
            } else {
                this._lblScore.active = true
                this._lblScore.getComponent(cc.Label).string = '' + this._score;
            }
        }

        if (this._nddayingjia != null) {
            this._nddayingjia.active = this._dayingjia == true;
            if (this.node.getChildByName("icon") && this.node.getChildByName("icon").getChildByName('head_jin')) {
                this.node.getChildByName("icon").getChildByName('head_jin').active = this._dayingjia == true;
            }
            if (this.node.getChildByName("icon") && this.node.getChildByName("icon").getChildByName('head_hui')) {
                this.node.getChildByName("icon").getChildByName('head_hui').active = !(this._dayingjia == true);
            }

            if (this._GameEnd2 != null) {
                this._GameEnd2.active = this._dayingjia == false;
            }

        }

        if (this._offline) {
            this._offline.active = this._isOffline && this._userName != "";
        }

        if (this._ready) {
            this._ready.active = this._isReady /*&& (cc.fy.gameNetMgr.numOfGames > 0)*/;
        }
        if (this._readyLoading) {
            this._readyLoading.active = this._isReady;
        }

        if (this._zhuang) {
            this._zhuang.active = this._isZhuang;
        }

        if (this._sameip) {
            this._sameip.active = this._isSameIP;
        }

        this.node.active = this._userName != null && this._userName != "";

        if (this.headnull != null) {
            this.headnull.active = !this.node.active;
        }
        if (this._turn) {
            this._turn.active = this._isturn;
        }

        this.refreshPiao();
       
        this.refreshTing();
        this.refreshTianTing();
    },

    setInfo(name, score, dayingjia) {
        console.log("name ========>", name);
        console.log("score ========>", score);
        console.log("dayingjia ========>", dayingjia);
        this._userName = name;
        this._score = score;
        if (this._score == null) {
            this._score = 0;
        }
        this._dayingjia = dayingjia;
        this.refresh();
    },
    gangscore(score) {
        this._score = score;
        if (score == null) {
            this._score = 0;
        }
        this.refresh();
    },
    setZhuang: function (value) {
        this._isZhuang = value;
        if (this._zhuang) {
            this._zhuang.active = value;
        }
    },

    setReady: function (isReady) {
        this._isReady = isReady;
        if (this._ready) {
            this._ready.active = this._isReady /*&& (cc.fy.gameNetMgr.numOfGames > 0)*/;
        }
        if (this._readyLoading) {
            this._readyLoading.active = this._isReady;
        }
    },

    setID: function (id) {
        var idNode = this.node.getChildByName("id");
        if (idNode) {
            var lbl = idNode.getComponent(cc.Label);
            lbl.string = "ID:" + id;
        }

        this._userId = id;
        if (this._sprIcon) {
            this._sprIcon.setUserID(id);
        }
    },

    setOffline: function (isOffline) {
        this._isOffline = isOffline;
        if (this._offline) {
            this._offline.active = this._isOffline && this._userName != "";
        }
    },

    setSameIP: function (isSame) {
        this._isSameIP = isSame;
        if (this._sameip != null) {
            this._sameip.active = isSame;
        }
    },

    setTurn: function (bo) {
        this._isturn = bo;
        if (this._turn) {
            this._turn.active = bo;
        }
    },

    quanGuan: function () {
        if (this._quanGuan) {
            this._quanGuan.node.active = true;
            var self = this;
            this._quanGuan.setAnimation(0, "animation", false);
            this._quanGuan.setCompleteListener(function () {
                console.log("PDKGAME Quanguan CompleteListener ");
                setTimeout(function () {
                    self._quanGuan.node.active = false;
                }, 1000)
            });
        }
    },

    chat: function (content) {
        if (this._chatBubble == null || this._emoji == null) {
            return;
        }
        this._emoji.active = false;
        // this._emojibg.active = false;
        this._chatBubble.active = true;


        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.PDK) {
            this._chatBubble.getChildByName("New Label").getComponent(cc.Label).string = content;
            var width = this._chatBubble.getChildByName("New Label").width;
            this._chatBubble.getChildByName("chatbg_ld").width = width + 40;
        }
        else {
            this._chatBubble.getChildByName("chatbg_ld").getChildByName("New Label").getComponent(cc.Label).string = content;
            // var width=this._chatBubble.getChildByName("New Label").width;
            // this._chatBubble.getChildByName("chatbg_ld").width=width+40;       
        }
        this._lastChatTime = 2;

    },

    emoji: function (emoji) {
        //emoji = JSON.parse(emoji);
        if (this._emoji == null) {
            return;
        }
        console.log(emoji);
        this._chatBubble.active = false;
        this._emoji.active = true;
        // this._emojibg.active = true;
        this._emoji.getComponent(cc.Animation).play(emoji);
        this._lastChatTime = 2;
    },

    voiceMsg: function (show) {
        if (this._voicemsg) {
            this._voicemsg.active = show;
        }
    },

    setPiao: function (num) {
        this._piao = num;
        this.refreshPiao();
    },

  

  

    setTing: function (bTing, bTianTing) {
        this._ting = bTing;
        this._tianTing = bTianTing;
        this.refreshTing();
    },

    setTianTing: function (bo) {
        this._tianTing = bo;
        this.refreshTianTing();
    },

    refreshPiao: function () {
        if (this._labtPiao == null) {
            return;
        }
        if (this._piao == null || this._piao < 0) {
            this._labtPiao.node.active = false;
            this._piaozi.active = false;
            return;
        }
        this._labtPiao.node.active = true;
        this._piaozi.active = true;
        this._labtPiao.string = "+" + this._piao;
    },

   
  

    refreshTing: function () {
        if (this._ting && this._tianTing && this._tianTingMark) {
            this._tianTingMark.active = true;
        }
        else if (this._tingMark) {
            this._tingMark.active = this._ting;
        }
    },

    refreshTianTing: function () {
        if (this._tianTingMark == null)
            return;
        this._tianTingMark.active = this._tianTing;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (this._lastChatTime > 0) {
            this._lastChatTime -= dt;
            if (this._lastChatTime < 0) {
                this._chatBubble.active = false;
                this._emoji.active = false;
                //this._interActive.active = false;
                // this._emojibg.active = false;
                this._emoji.getComponent(cc.Animation).stop();
            }
        }
    },
});
