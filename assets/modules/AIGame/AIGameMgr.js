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
        game: null,
        _mahjongs: null,
        _pokers: null,
        _type: 0,
        _maxUsers: 4,
    },

    onJoinGame: function (type) {
        console.log("onJoinGame1");
        this.game = cc.fy.gameNetMgr;
        if (type) {
            this._type = type;
        }
        // 初始化游戏数据
        this.initMj();
        this.initData();
        console.log("onJoinGame2");
        cc.fy.sceneMgr.loadGameScene(this._type);
    },

    resetAI: function () {
        this.initMj();
        this.initData();
    },

    initData: function () {
        this.game.roomId = "888888";
        this.game.conf = {
            type: this._type,
        }
        this.game.turn = 0;
        this.game.chupai = -1,
            this.game.dingque = -1;
        this.game.button = 0;
        this.game.gamestate = "playing";
        this.game.dingque = -1;
        this.game.isDingQueing = false;
        this.game.isHuanSanZhang = false;
        this.game.curaction = null;
        this.game.piaohuaData = null;

        this.game.isShowPiaohua = false;

        this.game.dissoveData = null;
        this.game.isClickChupai = false;
        this.game.isOver = false;
        this.game.seatIndex = 0;
        this.game.maxNumOfGames = 8;
        this.game.numOfGames = 1;
        this.game.numOfDouble = 0;
        this.game.numOfMJ = 0;
        this.game.seats = [];
        for (var i = 0; i < this._maxUsers; ++i) {
            var s = {};
            if (i == 0) {
                s.userid = cc.fy.userMgr.userId;
                s.ip = cc.fy.userMgr.ip
                s.name = cc.fy.userMgr.userName;
                s.holds = this.getHoldsFromWall(14);
            }
            else {
                s.userid = Math.floor(Math.random() * 10000 + 10100) + 1;
                s.name = cc.fy.userMgr.userName;
                s.holds = null;
            }
            s.name = this.getUserName();
            s.seatindex = i;
            s.folds = [];
            s.pengs = [];
            s.angangs = [];
            s.diangangs = [];
            s.wangangs = [];
            s.flowers = [];
            s.dingque = -1;
            s.online = true;
            s.ready = false;
            s.hued = false;
            this.game.seats.push(s);
        }

        // if(this._type == cc.GAMETYPE.GD){
        //     // if(cc.fy.gdGameNetMgr == null){
        //     //     var GDGameNetMgr = require("GDGameNetMgr");
        //     //     cc.fy.gdGameNetMgr = new GDGameNetMgr();
        //     //     cc.fy.gdGameNetMgr.initHandlers();
        //     // }
        //     // var holds = this._pokers.splice(this._pokers.length - 27, 27);
        //     // cc.fy.gdGameNetMgr.holds = holds;
        //     // cc.fy.gdGameNetMgr.folds = [];
        //     // cc.fy.gdGameNetMgr.levelCard = 2;
        // }
    },

    initMj: function () {
        this._mahjongs = [];
        //筒 0 ~ 8 表示筒子
        var index = 0;
        for (var i = 0; i < 9; ++i) {
            for (var c = 0; c < 4; ++c) {
                this._mahjongs.push(i);
                index++;
            }
        }

        //条 9 ~ 17表示条子
        for (var i = 9; i < 18; ++i) {
            for (var c = 0; c < 4; ++c) {
                this._mahjongs.push(i);
                index++;
            }
        }

        //万 18 ~ 26表示万
        for (var i = 18; i < 27; ++i) {
            for (var c = 0; c < 4; ++c) {
                this._mahjongs.push(i);
                index++;
            }
        }

        //特殊牌型,编号差4便于算法统一判断胡牌
        //东 27表示东风
        var i = 27
        for (var c = 0; c < 4; ++c) {
            this._mahjongs.push(i);
            index++;
        }
        i += 4;
        //南 31表示南风
        for (var c = 0; c < 4; ++c) {
            this._mahjongs.push(i);
            index++;
        }
        i += 4;
        //西 35表示西风
        for (var c = 0; c < 4; ++c) {
            this._mahjongs.push(i);
            index++;
        }
        i += 4;
        //北 39表示北风
        for (var c = 0; c < 4; ++c) {
            this._mahjongs.push(i);
            index++;
        }
        i += 4;
        //中 43表示红中
        for (var c = 0; c < 4; ++c) {
            this._mahjongs.push(i);
            index++;
        }
        i += 4;
        //发 47表示发财
        for (var c = 0; c < 4; ++c) {
            this._mahjongs.push(i);
            index++;
        }
        i += 4;
        //白 51表示白板
        for (var c = 0; c < 4; ++c) {
            this._mahjongs.push(i);
            index++;
        }
        // i+=1;
        // //百 52
        // for(var c = 0; c < 4; ++c){
        //     this._mahjongs[index] = i;
        //     index++;
        // }
        // i+=1;
        // //大白 53 
        // for(var c = 0; c < 4; ++c){
        //     this._mahjongs[index] = i;
        //     index++;
        // }
        // i+=3;
        // //春夏秋冬梅兰竹菊(54~61)
        // for(var c = 0; c < 8; ++c){
        //     this._mahjongs[index] = i + c;
        //     index++;
        // }

        // 洗牌
        // this._mahjongs.sort(function(){return Math.random() - 0.5;});
        this._mahjongs = this.shuffle(this._mahjongs);

        this._pokers = this.getPokerWall(2);
    },

    shuffle: function (array) {
        var _array = array.concat();
        for (var i = _array.length; i--;) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = _array[i];
            _array[i] = _array[j];
            _array[j] = temp;
        }

        return _array;
    },

    getHoldsFromWall: function (l) {
        var arr = [];
        if (l) {

            for (var i = 0; i < l; i++) {
                arr.push(this._mahjongs.pop());
            }
        }
        this.game.numOfMJ = this._mahjongs.length;
        return arr;
    },

    moPaiFromWall: function () {
        var pai = this._mahjongs.pop();
        this.game.numOfMJ = this._mahjongs.length;
        return pai;
    },
    takeNextAction: function () {
        // if(this.game.conf.type == cc.GAMETYPE.GD){
        //     // var chupaiNum = Math.random() * 10;
        //     // var data = {
        //     //     seatIndex:this.game.turn,
        //     //     nextTurn:this.getNextTurn(this.game.turn),
        //     //     playedCards:this._pokers.splice(this._pokers.length - chupaiNum, chupaiNum),
        //     // };
        //     // cc.fy.gdGameNetMgr.doPlayCard(data);
        // }
        // else{
        this.game.doChupai(this.game.turn, this.moPaiFromWall());
        this.game.doTurnChange(this.getNextTurn(this.game.turn));
        if (this.game.turn == this.game.seatIndex) {
            cc.fy.gameNetMgr.isClickChupai = false;
            this.game.doMopai(this.game.turn, this.moPaiFromWall());
        }
        //}

        return 1;
    },

    getNextTurn: function (t) {
        if (++t >= this._maxUsers) {
            t = 0;
        }
        return t;
    },

    selfChupai: function (pai) {
        // if(this.game.conf.type == cc.GAMETYPE.GD){
        //     // var data = {
        //     //     seatIndex:this.game.turn,
        //     //     nextTurn:this.getNextTurn(this.game.turn),
        //     //     playedCards:pai,
        //     // };
        //     // cc.fy.gdGameNetMgr.doPlayCard(data);
        // }
        // else{
        this.game.doChupai(this.game.turn, pai);
        this.game.doTurnChange(this.getNextTurn(this.game.turn));
        //}
    },

    getUserName: function () {
        var names = [
            "上官",
            "欧阳",
            "东方",
            "端木",
            "独孤",
            "司马",
            "南宫",
            "夏侯",
            "诸葛",
            "皇甫",
            "长孙",
            "宇文",
            "轩辕",
            "东郭",
            "子车",
            "东阳",
            "子言",
        ];

        var names2 = [
            "雀圣",
            "赌侠",
            "赌圣",
            "稳赢",
            "不输",
            "好运",
            "自摸",
            "有钱",
            "土豪",
        ];
        var idx = Math.floor(Math.random() * (names.length - 1));
        var idx2 = Math.floor(Math.random() * (names2.length - 1));
        return names[idx] + names2[idx2];
    },

    // 生成扑克牌堆 num是几副牌
    getPokerWall: function (num) {
        var pNum = num;
        if (pNum == null || pNum < 1) {
            pNum = 1;
        }
        var pokerWall = [];
        // 一副牌一共54张牌
        for (var i = 0; i < 54; i++) {
            for (var j = 0; j < pNum; j++) {
                pokerWall.push(i * 10 + (j + 1));
            }
        }

        // 洗牌
        pokerWall = this.shuffle(pokerWall);
        return pokerWall;
    },
});
