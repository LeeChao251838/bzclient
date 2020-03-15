var GameMsgDef = require('GameMsgDef');
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
        _ndhuangguan: null,
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
        _bulazhuang: null,
        _lazhuang: null,
        _lazhuangzi: [],
        _budingzhuang: null,
        _dingzhuang: null,
        _dingzhuangzi: [],
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
        _flowerCnt: 0,
        _isTing: false,

        _daxi: null,
        _xiaoxi: null,
        _buhua: null,

        _dingzhuang: -1,
        _lazhuang: -1,

        _lazhuangzi: [],
        _dingzhuangzi: [],
    },

    // use this for initialization
    onLoad: function () {
        if (cc.fy == null || cc.fy.gameNetMgr == null || cc.fy.utils == null) {
            return;
        }

        var dingzhuang = this.node.getChildByName("dingzhuang");
        if (dingzhuang) {
            for (var n = 0; n < 5; ++n) {
                var dingzhuangSprite = dingzhuang.getChildByName("dingzhuang_" + n);
                if (dingzhuangSprite != null) {
                    this._dingzhuangzi.push(dingzhuangSprite);
                    this._dingzhuangzi[n].active = false;
                }
            }
        }
        var lazhuang = this.node.getChildByName("lazhuang");
        if (lazhuang) {
            for (var n = 0; n < 5; ++n) {
                var lazhuangSprite = lazhuang.getChildByName("lazhuang_" + n);
                if (lazhuangSprite != null) {
                    this._lazhuangzi.push(lazhuangSprite);
                    this._lazhuangzi[n].active = false;
                }
            }
        }

        this._daxi = this.node.getChildByName("daxi");
        this._xiaoxi = this.node.getChildByName("xiaoxi");
        this._buhua = this.node.getChildByName("buhua");

        this._sprIcon = this.node.getChildByName("icon").getComponent("ImageLoader");
        this._lblName = this.node.getChildByName("name").getComponent(cc.Label);
        var nodeScore = this.node.getChildByName("score");
        if (nodeScore != null) {
            this._lblScore = nodeScore.getComponent(cc.Label);
        }
        // this._lblScore = this.node.getChildByName("score");
        var nodeScore1 = this.node.getChildByName("score1");
        if (nodeScore1 != null) {
            this._lblScore1 = nodeScore1.getComponent(cc.Label);
        }
        this._voicemsg = this.node.getChildByName("voicemsg");
        this._xuanpai = this.node.getChildByName("xuanpai");
        // this.refreshXuanPaiState();

        if (this._voicemsg) {
            this._voicemsg.active = false;
        }

        if (this._sprIcon && this._sprIcon.getComponent(cc.Button)) {
            cc.fy.utils.addClickEvent(this._sprIcon, this.node, "Seat", "onIconClicked");
        }

        this._offline = this.node.getChildByName("offline");

        this._ready = this.node.getChildByName("ready");
        if (this._ready) {
            this._ready.active = false;
        }
        this._readyLoading = this.node.getChildByName("loading");
        this._zhuang = this.node.getChildByName("zhuang");

        this._ndhuangguan = this.node.getChildByName("dayingjia");
        this._nddayingjia = this.node.getChildByName("bigwin");
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

        var dingzhuang = this.node.getChildByName("dingzhuang");
        if (dingzhuang) {
            this._budingzhuang = dingzhuang.getChildByName("budingzhuang");
            if (this._budingzhuang) {
                this._budingzhuang.active = false;
            }

            for (var n = 0; n < 4; ++n) {
                var dingzhuangSprite = dingzhuang.getChildByName("dingzhuang_" + n);
                if (dingzhuangSprite != null) {
                    this._dingzhuangzi.push(dingzhuangSprite);
                    this._dingzhuangzi[n].active = false;
                }
            }
        }

        this._bulazhuang = this.node.getChildByName("bulazhuang");
        if (this._bulazhuang) {
            this._bulazhuang.active = false;
        }

        for (var n = 0; n < 4; ++n) {
            var lazhuangSprite = this.node.getChildByName("lazhuang_" + n);
            if (lazhuangSprite != null) {
                this._lazhuangzi.push(lazhuangSprite);
                this._lazhuangzi[n].active = false;
            }
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
        this._tingMark = this.node.getChildByName("ting");
        if (this._tingMark) {
            this._tingMark.active = false;
        }
        this._tianTingMark = this.node.getChildByName("tianting");
        if (this._tianTingMark) {
            this._tianTingMark.active = false;
        }

        this.refresh();

        if (this._sprIcon && this._userId) {
            console.log("userID：" + this._userId);
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

    refresh: function () {
        if (this._lblName != null) {
            this._lblName.string = cc.fy.utils.subStringCN(this._userName, 12, true);
        }

        if (this._lblScore != null) {
            if (this._score == "破产") {
                if (this._lblScore1 != null) {
                    this._lblScore.node.active = this._score != null;
                    this._lblScore1.node.active = this._score != null;
                    if (this._score >= 0) {
                        //this._lblScore.color = new cc.Color(255, 228, 0);
                        this._lblScore.node.active = true
                        this._lblScore1.node.active = false
                        this._lblScore.getComponent(cc.Label).string = this._score;

                    }
                    else {

                        //this._lblScore.color = new cc.Color(207, 226, 255);
                        this._lblScore.node.active = false
                        this._lblScore1.node.active = true
                        this._lblScore1.getComponent(cc.Label).string = this._score;
                    }
                } else {
                    this._lblScore.node.active = true
                    this._lblScore.getComponent(cc.Label).string = this._score;
                }
                this._lblScore.string = this._score;
            }
            else {
                this._lblScore.string = cc.fy.utils.floatToFixed(this._score, 1, true);
            }
        }

        if (this._nddayingjia != null) {
            this._nddayingjia.active = this._dayingjia == true;
            if (this._GameEnd2 != null) {
                this._GameEnd2.active = this._dayingjia == false;
            }

        }
        if (this._ndhuangguan && this._nddayingjia) {
            this._ndhuangguan.active = this._dayingjia == true;
            this._nddayingjia.active = this._dayingjia == true;
        }

        if (this._offline) {
            this._offline.active = this._isOffline && this._userName != "";
        }

        if (this._ready) {
            this._ready.active = false;
            this._ready.active = this._isReady;// && (cc.fy.gameNetMgr.numOfGames > 0); 
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

        // this.node.active = this._userName != null && this._userName != ""; 
        this.node.active = this._userId != null && this._userId != 0;
        if (this.headnull != null) {
            this.headnull.active = !this.node.active;
        }
        if (this._turn) {
            this._turn.active = this._isturn;
        }

        this.refreshPiao();
        this.refreshLazhuang();
        this.refreshDingzhuang();
        this.refreshTing();
        this.refreshTianTing();
    },

    setDingzhuang(num) {
        this._dingzhuang = num;
        this.refreshDingzhuang();
    },

    refreshDingzhuang() {
        if (this._dingzhuangzi == null || this._dingzhuangzi.length <= 0) return;
        for (var i = 0; i < this._dingzhuangzi.length; ++i) {
            this._dingzhuangzi[i].active = i == this._dingzhuang;
        }
    },

    setLazhuang(num) {
        this._lazhuang = num;
        this.refreshLazhuang();
    },

    refreshLazhuang() {
        if (this._lazhuangzi == null || this._lazhuangzi.length <= 0) return;
        for (var i = 0; i < this._lazhuangzi.length; ++i) {
            this._lazhuangzi[i].active = i == this._lazhuang;
        }
    },

    setInfo(name, score, dayingjia) {
        this._userName = name;

        this._score = score;
        if (this._score == null) {
            this._score = 0;
        }
        // var nodeScore = this.node.getChildByName("score");
        // console.log(nodeScore);
        if (cc.fy.gameNetMgr.conf.wanfa != null && cc.fy.replayMgr.isReplay() == false) {  //查看战绩不显示破产

            if (cc.fy.gameNetMgr.conf.beginScore > 0) {//玩法是高邮炒锅并且玩法是2分数小于0
                if (this._score <= 0) {
                    // if(cc.fy.replayMgr.isReplay()){
                    //     nodeScore.active = false;
                    // }
                    this._score = "破产";
                }
            }
        }

        this._dayingjia = dayingjia;
        if (this._lblScore != null) {
            this._lblScore.node.active = this._score != null;
        }


        this.refresh();
    },

    setScore(score) {
        this._score = score;
        if (this._score == null) {
            this._score = 0;
        }
        if (cc.fy.gameNetMgr.conf.wanfa != null && cc.fy.replayMgr.isReplay() == false) {

            if (cc.fy.gameNetMgr.conf.beginScore > 0) {
                if (this._score <= 0) {
                    this._score = "破产";
                }
            }
        }
        if (this._lblScore != null) {
            this._lblScore.node.active = this._score != null;
        }


        this.refresh();
    },

    setIsTing(isting, istianting) {
        this._isTing = isting;
        this._isTianTing = istianting;
        this.refreshTing();
    },

    setFlower(cnt) {
        this._flowerCnt = cnt;
        this.refresh();
    },

    showFangzhu(value) {
        if (this.node.getChildByName("fangzhu") != null) {

            this.node.getChildByName("fangzhu").active = value;
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
    array_contain: function (array, obj) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] == obj)//如果要求数据类型也一致，这里可使用恒等号===
                return true;
        }
        return false;
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
            this._ready.active = this._isReady; /*&& (cc.fy.gameNetMgr.numOfGames > 0)*/;
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

        this.refresh();
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

    chat: function (content) {

        if (this._chatBubble == null || this._emoji == null) {
            return;
        }
        this._emoji.active = false;
        // this._emojibg.active = false;
        this._chatBubble.active = true;
        if (cc.GAMETYPE.PDK == cc.fy.gameNetMgr.conf.type || cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.GD) {
            this._chatBubble.getChildByName("chatbg_ld").getChildByName("content").getComponent(cc.Label).string = content;
            // var width = this._chatBubble.getChildByName("content").width;
            // this._chatBubble.getChildByName("chatbg_ld").width = width + 40;
        }
        else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.DDZ) {
            this._chatBubble.getComponent(cc.Label).string = content;
            this._chatBubble.getChildByName("content").getComponent(cc.Label).string = content;
        }
        else {
            this._chatBubble.getChildByName("chatbg_ld").getChildByName("New Label").getComponent(cc.Label).string = content;
            // var width=this._chatBubble.getChildByName("New Label").width;
            // this._chatBubble.getChildByName("chatbg_ld").width=width+40;       
        }
        this._lastChatTime = 3;
    },

    emoji: function (emoji) {
        //emoji = JSON.parse(emoji);
        if (this._emoji == null || this._emoji == null) {
            return;
        }
        console.log(emoji);
        this._chatBubble.active = false;
        this._emoji.active = true;
        this._emoji.getComponent(cc.Animation).play(emoji);
        this._lastChatTime = 3;
    },

    stopEmoji() {
        if (this._emoji) {
            this._emoji.active = false;
            this._emoji.getComponent(cc.Animation).stop();
        }
    },

    voiceMsg: function (show) {
        if (this._voicemsg) {
            this._voicemsg.active = show;
        }
    },

    // refreshXuanPaiState:function(){
    // if(this._xuanpai == null){
    //     return;
    // }

    // // this._xuanpai.active = cc.fy.gameNetMgr.isHuanSanZhang;
    // // if(cc.fy.gameNetMgr.isHuanSanZhang == false){ 
    // //     return;
    // // }

    // this._xuanpai.getChildByName("xz").active = false;
    // this._xuanpai.getChildByName("xd").active = false;

    // var seat = cc.fy.gameNetMgr.getSeatByID(this._userId);
    // if(seat){
    //     if(seat.huanpais == null){
    //         this._xuanpai.getChildByName("xz").active = true;
    //     }
    //     else{
    //         this._xuanpai.getChildByName("xd").active = true;
    //     }
    // }
    // },

    setPiao: function (num) {
        this._piao = num;
        this.refreshPiao();
    },
    setLazhuang: function (num) {
        this._lazhuang = num;
        this.refreshLazhuang();
    },
    setDingzhuang: function (num) {
        this._dingzhuang = num;
        this.refreshDingzhuang();
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

    playDaXi: function () {
        if (this._daxi) {
            this._daxi.stopAllActions();
            let seq = cc.sequence(cc.fadeIn(0.5), cc.fadeOut(0.5));
            this._daxi.runAction(seq);
            let index = cc.fy.gameNetMgr.getSeatIndexByID(this._userId);
            cc.fy.audioMgr.playSFXBySex("daxi", cc.fy.gameNetMgr.seats[index], cc.fy.gameNetMgr.conf.type);
        }
    },

    playXiaoXi: function () {
        if (this._xiaoxi) {
            this._xiaoxi.stopAllActions();
            let seq = cc.sequence(cc.fadeIn(0.5), cc.fadeOut(0.5));
            this._xiaoxi.runAction(seq);
            let index = cc.fy.gameNetMgr.getSeatIndexByID(this._userId);
            cc.fy.audioMgr.playSFXBySex("xiaoxi", cc.fy.gameNetMgr.seats[index], cc.fy.gameNetMgr.conf.type);
        }
    },

    playBuhua: function () {
        if (this._buhua) {
            this._buhua.stopAllActions();
            let seq = cc.sequence(cc.fadeIn(0.5), cc.fadeOut(0.5));
            this._buhua.runAction(seq);
        }
    },

    // refreshTing: function () {
    //     if (!this._tingMark || !this._tianTingMark) {
    //         return;
    //     }
    //     if (this._isTing && this._isTianTing) {
    //         this._tianTingMark.active = true;
    //     }
    //     else if (this._isTing) {
    //         this._tingMark.active = true;
    //     }
    //     else {
    //         this._tingMark.active = false;
    //         this._tianTingMark.active = false;
    //     }
    // },


    refreshLazhuang: function () {
        if (this._lazhuangzi == null || this._lazhuangzi.length == 0 || this._bulazhuang == null) {
            return;
        }

        if (this._lazhuang == null || this._lazhuang < 0) {
            for (var i = 0; i < 4; ++i) {
                this._lazhuangzi[i].active = false;
            }
            this._bulazhuang.active = false;
            return;
        }
        if (this._lazhuang == 0) {
            for (var i = 0; i < 4; ++i) {
                this._lazhuangzi[i].active = false;
            }
            this._bulazhuang.active = true;
            return;
        }
        this._bulazhuang.active = false;
        this.setLazhuangActive(this._lazhuang - 1);
    },

    setLazhuangActive: function (n) {
        for (var i = 0; i < 4; ++i) {
            this._lazhuangzi[i].active = i == n;
        }
    },

    refreshDingzhuang: function () {
        if (this._dingzhuangzi == null || this._dingzhuangzi.length == 0 || this._budingzhuang == null) {
            return;
        }

        if (this._dingzhuang == null || this._dingzhuang < 0) {
            for (var i = 0; i < 4; ++i) {
                this._dingzhuangzi[i].active = false;
            }
            this._budingzhuang.active = false;
            return;
        }
        if (this._dingzhuang == 0) {
            for (var i = 0; i < 4; ++i) {
                this._dingzhuangzi[i].active = false;
            }
            this._budingzhuang.active = true;
            return;
        }
        this._budingzhuang.active = false;
        this.setDingzhuangActive(this._dingzhuang - 1);
    },

    setDingzhuangActive: function (n) {
        for (var i = 0; i < 4; ++i) {
            this._dingzhuangzi[i].active = i == n;
        }
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
                this._emoji.getComponent(cc.Animation).stop();
            }
        }
    },
});
