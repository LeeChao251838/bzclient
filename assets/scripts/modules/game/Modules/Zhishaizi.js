cc.Class({
    extends: cc.Component,
    properties: {
        zhishaizi1_atlas: cc.SpriteAtlas,
        zhishaizi_an1: cc.Animation,
        zhishaizi_an2: cc.Animation,
        zhishaizi1: cc.Sprite,
        zhishaizi2: cc.Sprite,
        shaiziParents: {
            tooltip: "骰子父节点",
            default: [],
            type: cc.Node
        },
        _lastCheckTime: -1,
        _delayTime: 3,
        _zhishaizinum: null,
        _num1: [],
        _num2: [],

    },
    onLoad: function () {
        var shaizinum1 = [];
        shaizinum1 = ["1", "2", "3", "4", "5", "6"];
        var shaiziParent = null;
        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZWJ || cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZHD) {
            shaiziParent = this.shaiziParents[0];
        } else {
            shaiziParent = this.shaiziParents[1];
        }
        for (var i = 0; i < shaizinum1.length; ++i) {
            var num1Node = shaiziParent.getChildByName("shaizixs").getChildByName("num1");
            var num1 = num1Node.getChildByName(shaizinum1[i]);
            this._num1.push(num1);
        }
        var shaizinum2 = [];
        shaizinum2 = ["1", "2", "3", "4", "5", "6"];
        for (var i = 0; i < shaizinum2.length; ++i) {
            var num2Node = shaiziParent.getChildByName("shaizixs").getChildByName("num2");
            var num2 = num2Node.getChildByName(shaizinum2[i]);
            this._num2.push(num2);
        }
        this.setShaiZiCancel();

        if (cc.fy.gameNetMgr.dice) {
            this.setShaiZi(cc.fy.gameNetMgr.dice);
        }
        this.initEventHandlers();
    },
    initEventHandlers: function () {
        var self = this;
        var game = cc.fy.gameNetMgr;
        // game.addHandler('game_zhishaizi', function (data) {
        // console.log("MJroom setShaiZi ", data); 
        // setTimeout(function () {
        //     self.setShaiZi(data);
        // }, 2000);
        // });
        game.addHandler('shaizi_cancel', function () {
            console.log("shaizi_cancel");
            self.setShaiZiCancel();
        })
    },

    playZ: function (data) {
        console.log("zhishaizi playZ");
        this._lastCheckTime = Date.now();
        this.node.active = true;
        this.zhishaizi_an1.node.active = true;
        this.zhishaizi_an2.node.active = true;
        this.zhishaizi1.node.active = false;
        this.zhishaizi2.node.active = false;
        this._zhishaizinum = data;
        // this.zhishaiziEnd();
        this.zhishaizi_an1.play();
        this.zhishaizi_an2.play();
        this.zhishaizi_an1.on('finished', this.zhishaiziEnd, this);
        cc.fy.gameNetMgr.zhishaizinum = null;
        cc.fy.audioMgr.playSFX("dice.mp3");
    },
    zhishaiziEnd: function () {
        console.log("zhishaiziEnd");
        this.zhishaizi_an1.node.active = false;
        this.zhishaizi_an2.node.active = false;
        if (this._zhishaizinum != null) {
            this.zhishaizi1.node.active = true;
            this.zhishaizi2.node.active = true;
            this.zhishaizi1.spriteFrame = this.zhishaizi1_atlas.getSpriteFrame("b_0" + this._zhishaizinum.num1);
            this.zhishaizi2.spriteFrame = this.zhishaizi1_atlas.getSpriteFrame("w_0" + this._zhishaizinum.num2);
            this.setShaiZi(this._zhishaizinum);
        }
        this._zhishaizinum = null;
    },
    hide: function () {
        this.node.active = false;
    },
    setShaiZi: function (data) {
        // for (var i = 0; i < this._num1.length; ++i) {
        //     this._num1[i].active = false;
        // }
        // for (var i = 0; i < this._num2.length; ++i) {
        //     this._num2[i].active = false;
        // }
        this.setShaiZiCancel();
        var a = data.num1;
        var b = data.num2;
        // let self = this
        // if (cc.fy.gameNetMgr.conf.type == 23) {
        // this.scheduleOnce(function(){
        this._num1[a - 1].active = true;
        this._num2[b - 1].active = true;
        // },0.2)

        // }
    },
    setShaiZiCancel: function () {
        for (var i = 0; i < this._num1.length; ++i) {
            this._num1[i].active = false;
        }
        for (var i = 0; i < this._num2.length; ++i) {
            this._num2[i].active = false;
        }
    },
    update: function () {
        if (Date.now() - this._lastCheckTime > this._delayTime * 1000) {
            if (this.node) {
                this.hide();
            }
            this._lastCheckTime = Date.now();
        }
    },

});
