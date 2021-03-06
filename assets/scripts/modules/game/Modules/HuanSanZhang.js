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
        _huanpaitip: null,
        _huanpaiArr: []
    },

    // use this for initialization
    onLoad: function () {
        this._huanpaitip = cc.find("Canvas/gameMain/huansanzhang");
        this._huanpaitip.active = cc.fy.gameNetMgr.isHuanSanZhang;

        if (this._huanpaitip.active) {
            this.showHuanpai(cc.fy.gameNetMgr.getSelfData().huanpais == null);
        }
        this.initHuaipaiInfo();

        var btnOk = cc.find("Canvas/gameMain/huansanzhang/btn_ok");
        if (btnOk) {
            cc.fy.utils.addClickEvent(btnOk, this.node, "HuanSanZhang", "onHuanSanZhang");
        }

        var self = this;

        this.node.on('game_huanpai', function (data) {
            self._huanpaitip.active = true;
            self.showHuanpai(true);
        });

        this.node.on('huanpai_notify', function (data) {
            if (data.seatindex == cc.fy.gameNetMgr.seatIndex) {
                self.initHuaipaiInfo();
            }
        });

        this.node.on('game_huanpai_over', function (data) {
            self._huanpaitip.active = false;
            for (var i = 0; i < self._huanpaiArr.length; ++i) {
                self._huanpaiArr[i].y = 0;
            }
            self._huanpaiArr = [];
            self.initHuaipaiInfo();
        });

        this.node.on('game_huanpai_result', function (data) {
            cc.fy.gameNetMgr.isHuanSanZhang = false;
            self._huanpaitip.active = false;
            for (var i = 0; i < self._huanpaiArr.length; ++i) {
                self._huanpaiArr[i].y = 0;
            }
            self._huanpaiArr = [];
        });

        this.node.on('mj_clicked', function (data) {
            var target = data;
            //如果已经点起来，则取消
            var idx = self._huanpaiArr.indexOf(target);
            if (idx != -1) {
                target.y = 0;
                self._huanpaiArr.splice(idx, 1);
            }
            else {
                //如果是新的，则加入
                if (self._huanpaiArr.length < 3) {
                    self._huanpaiArr.push(target);
                    target.y = 15;
                }
            }
        });
    },

    showHuanpai: function (interactable) {
        // this._huanpaitip.getChildByName("info").getComponent(cc.Label).string = "请选择三张一样花色的牌";
        // this._huanpaitip.getChildByName("btn_ok").getComponent(cc.Button).interactable = interactable;
        // this._huanpaitip.getChildByName("mask").active = false;        
    },

    initHuaipaiInfo: function () {
        var huaipaiinfo = cc.find("Canvas/gameMain/game/huanpaiinfo");
        var seat = cc.fy.gameNetMgr.getSelfData();
        if (seat.huanpais == null) {
            huaipaiinfo.active = false;
            return;
        }
        huaipaiinfo.active = true;
        for (var i = 0; i < seat.huanpais.length; ++i) {
            cc.fy.mahjongmgr.createMahjongNode("M_", seat.huanpais[i], huaipaiinfo.getChildByName("hp" + (i + 1)).getComponent(cc.Sprite).node);
        }

        var hpm = huaipaiinfo.getChildByName("hpm");
        hpm.active = true;
        if (cc.fy.gameNetMgr.huanpaimethod == 0) {
            hpm.rotation = 90;
        }
        else if (cc.fy.gameNetMgr.huanpaimethod == 1) {
            hpm.rotation = 0;
        }
        else if (cc.fy.gameNetMgr.huanpaimethod == 2 || cc.fy.gameNetMgr.seats.length == 3) {
            hpm.rotation = 180;
        }
        else {
            hpm.active = false;
        }
    },

    onHuanSanZhang: function (event) {
        if (this._huanpaiArr.length != 3) {
            return;
        }

        var type = null;
        for (var i = 0; i < this._huanpaiArr.length; ++i) {
            var pai = this._huanpaiArr[i].mjId;
            var nt = cc.fy.mahjongmgr.getMahjongType(pai);
            if (type == null) {
                type = nt;
            }
            else {
                if (type != nt) {
                    return;
                }
            }
        }

        var data = {
            p1: this._huanpaiArr[0].mjId,
            p2: this._huanpaiArr[1].mjId,
            p3: this._huanpaiArr[2].mjId,
        }

        this._huanpaitip.getChildByName("info").getComponent(cc.Label).string = "等待其他玩家选牌...";
        this._huanpaitip.getChildByName("btn_ok").getComponent(cc.Button).interactable = false;
        this._huanpaitip.getChildByName("mask").active = true;

        cc.fy.net.send("huanpai", data);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
