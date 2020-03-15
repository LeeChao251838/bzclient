var ConstsDef = require('ConstsDef');
var GameMsgDef = require("GameMsgDef");

cc.Class({
    properties: {
        _handlers: null,
    },

    ctor: function () {
        // 资源的初始化
        this.initGameRes();
        this.initGameMsg();
    },

    reset: function () {
        if (cc.fy.pdkGameNetMgr) {
            cc.fy.pdkGameNetMgr.reset();
        }
        if (cc.fy.ddzGameNetMgr) {
            cc.fy.ddzGameNetMgr.reset();
        }
        // if (cc.fy.gdGameNetMgr) {
        //     cc.fy.gdGameNetMgr.reset();
        // }
        if (cc.fy.hzmjMsg) {
            cc.fy.hzmjMsg.reset();
        }
        if (cc.fy.hzemjMsg) {
            cc.fy.hzemjMsg.reset();
        }
        if (cc.fy.ccmjMsg) {
            cc.fy.ccmjMsg.reset();
        }
        if (cc.fy.czmjMsg) {
            cc.fy.czmjMsg.reset();
        }
        if (cc.fy.lsmjMsg) {
            cc.fy.lsmjMsg.reset();
        }
        if (cc.fy.hamjMsg) {
            cc.fy.hamjMsg.reset();
        }
        if (cc.fy.ttzmjMsg) {
            cc.fy.ttzmjMsg.reset();
        }
    },

    initGameMsg: function () {
        // var YZMJMsg = require("YZMJMsg");
        // cc.fy.yzmjMsg = new YZMJMsg();

        var PDKGameNetMgr = require("PDKGameNetMgr");
        cc.fy.pdkGameNetMgr = new PDKGameNetMgr();

        var LSMJMsg = require("LSMJMsg");
        cc.fy.lsmjMsg = new LSMJMsg();

        var CZMJMsg = require("CZMJMsg");
        cc.fy.czmjMsg = new CZMJMsg();

        var CCMJMsg = require("CCMJMsg");
        cc.fy.ccmjMsg = new CCMJMsg();

        var HAMJMsg = require("HAMJMsg");
        cc.fy.hamjMsg = new HAMJMsg();

        var HZEMJMsg = require("HZEMJMsg");
        cc.fy.hzemjMsg = new HZEMJMsg();

        var HZMJMsg = require("HZMJMsg");
        cc.fy.hzmjMsg = new HZMJMsg();

        var TTZMJMsg = require("TTZMJMsg");
        cc.fy.ttzmjMsg = new TTZMJMsg();

        // var GDGameNetMgr = require("GDGameNetMgr");
        // cc.fy.gdGameNetMgr = new GDGameNetMgr();

        // var DDZGameNetMgr = require("DDZGameNetMgr");
        // cc.fy.ddzGameNetMgr = new DDZGameNetMgr();
    },

    // 消息初始化
    initHandlers: function () {
        // cc.fy.yzmjMsg.initHandlers();
        // 牌类
        cc.fy.pdkGameNetMgr.initHandlers();
        // cc.fy.gdGameNetMgr.initHandlers();
        // cc.fy.ddzGameNetMgr.initHandlers();

        cc.fy.lsmjMsg.initHandlers();
        cc.fy.czmjMsg.initHandlers();
        cc.fy.ccmjMsg.initHandlers();
        cc.fy.hamjMsg.initHandlers();
        cc.fy.hzemjMsg.initHandlers();
        cc.fy.hzmjMsg.initHandlers();
        cc.fy.ttzmjMsg.initHandlers();
    },

    addHandler(event, fn) {
        if (cc.fy.net.addHandler(event, fn)) {
            return;
        }

        if (this._handlers == null) {
            this._handlers = {};
        }

        var handler = function (data) {
            if (event != "disconnect" && typeof (data) == "string") {
                data = JSON.parse(data);
            }
            fn(data);
        };

        var handlers = this._handlers[event];
        if (handlers == null) {
            handlers = [];
        }
        handlers.push(handler);

        this._handlers[event] = handlers;
    },

    prepareReplay: function (roomInfo, detailOfGame) {
        var baseInfo = detailOfGame.base_info;
        if (baseInfo.type == cc.GAMETYPE.PDK || baseInfo.type == cc.GAMETYPE.PDK) {
            if (cc.fy.gameMsg) {
                cc.fy.pdkGameNetMgr.prepareReplay(roomInfo, detailOfGame);
            }
        }
        // else if (baseInfo.type == cc.GAMETYPE.DDZ || baseInfo.type == cc.GAMETYPE.DDZ) {
        //     if (cc.fy.gameMsg) {
        //         cc.fy.ddzGameNetMgr.prepareReplay(roomInfo, detailOfGame);
        //     }
        // }
        // else if (baseInfo.type == cc.GAMETYPE.GD || baseInfo.type == cc.GAMETYPE.GD) {
        //     if (cc.fy.gameMsg) {
        //         cc.fy.gdGameNetMgr.prepareReplay(roomInfo, detailOfGame);
        //     }
        // }
        else if (baseInfo.type == cc.GAMETYPE.SZER || baseInfo.type == cc.GAMETYPE.SZER) {
            if (cc.fy.lsmjMsg) {
                cc.fy.lsmjMsg.prepareReplay(roomInfo, detailOfGame);
            }
        }
        else if (baseInfo.type == cc.GAMETYPE.SZBD || baseInfo.type == cc.GAMETYPE.SZBD) {
            if (cc.fy.czmjMsg) {
                cc.fy.czmjMsg.prepareReplay(roomInfo, detailOfGame);
            }
        }
        else if (baseInfo.type == cc.GAMETYPE.SZTDH || baseInfo.type == cc.GAMETYPE.SZTDH) {
            if (cc.fy.ccmjMsg) {
                cc.fy.ccmjMsg.prepareReplay(roomInfo, detailOfGame);
            }
        }
        else if (baseInfo.type == cc.GAMETYPE.HAMJ || baseInfo.type == cc.GAMETYPE.HAMJ) {
            if (cc.fy.hamjMsg) {
                cc.fy.hamjMsg.prepareReplay(roomInfo, detailOfGame);
            }
        }
        else if (baseInfo.type == cc.GAMETYPE.HZEMJ || baseInfo.type == cc.GAMETYPE.HZEMJ) {
            if (cc.fy.hzemjMsg) {
                cc.fy.hzemjMsg.prepareReplay(roomInfo, detailOfGame);
            }
        }
        else if (baseInfo.type == cc.GAMETYPE.SZCT || baseInfo.type == cc.GAMETYPE.SZCT) {
            if (cc.fy.hzmjMsg) {
                cc.fy.hzmjMsg.prepareReplay(roomInfo, detailOfGame);
            }
        }
        else if (baseInfo.type == cc.GAMETYPE.SZHD || baseInfo.type == cc.GAMETYPE.SZHD) {
            if (cc.fy.ttzmjMsg) {
                cc.fy.ttzmjMsg.prepareReplay(roomInfo, detailOfGame);
            }
        }
        else {
            if (cc.fy.yzmjMsg) {
                cc.fy.yzmjMsg.prepareReplay(roomInfo, detailOfGame);
            }
        }
    },

    dispatchGameEvent: function (event, data) {
        cc.logMgr.log(data, event + " : ");
        if (this._handlers && this._handlers[event]) {
            var handlers = this._handlers[event];
            for (var i = 0; i < handlers.length; i++) {
                var handler = handlers[i];
                handler(data);
            }
        }
    },

    initGameRes: function () {
        // 添加游戏中需要加载的资源
        // 预制体
        cc.fy.resMgr.addRes(ConstsDef.URL_PREFAB_PENGSELF, cc.Prefab);
        cc.fy.resMgr.addRes(ConstsDef.URL_PREFAB_PENGLEFT, cc.Prefab);
        cc.fy.resMgr.addRes(ConstsDef.URL_PREFAB_FLOWERSELF, cc.Prefab);
        cc.fy.resMgr.addRes(ConstsDef.URL_PREFAB_FLOWERLEFT, cc.Prefab);
        cc.fy.resMgr.addRes(ConstsDef.URL_PREFAB_FLOWERMARK, cc.Prefab);
        // 扑克预制体 PDK
        cc.fy.resMgr.addRes(ConstsDef.URL_PREFAB_POKER_CHU, cc.Prefab);
        cc.fy.resMgr.addRes(ConstsDef.URL_PREFAB_POKER_HAND, cc.Prefab);
        cc.fy.resMgr.addRes(ConstsDef.URL_PREFAB_POKER_CHU_BOX, cc.Prefab);
        cc.fy.resMgr.addRes(ConstsDef.URL_PREFAB_POKER_HAND_BOX, cc.Prefab);


        //斗地主poker预制体
        for (var i = 0; i < ConstsDef.URL_PREFAB_POKER_DDZ.length; i++) {
            cc.fy.resMgr.addRes(ConstsDef.URL_PREFAB_POKER_DDZ[i]);
        }

        // 图片
        // 麻将字
        // cc.fy.resMgr.addRes(ConstsDef.URL_ATLAS_MJFT[0], cc.SpriteAtlas);
        // cc.fy.resMgr.addRes(ConstsDef.URL_ATLAS_MJFT[1], cc.SpriteAtlas);
        // cc.fy.resMgr.addRes(ConstsDef.URL_ATLAS_MJFT[2], cc.SpriteAtlas);
        // // 麻将背景
        // cc.fy.resMgr.addRes(ConstsDef.URL_ATLAS_MJBG[0], cc.SpriteAtlas);
        // cc.fy.resMgr.addRes(ConstsDef.URL_ATLAS_MJBG[1], cc.SpriteAtlas);
        // cc.fy.resMgr.addRes(ConstsDef.URL_ATLAS_MJBG[2], cc.SpriteAtlas);
        // 扑克
        cc.fy.resMgr.addRes(ConstsDef.URL_ATLAS_POKER, cc.SpriteAtlas);
        cc.fy.resMgr.addRes(ConstsDef.URL_ATLAS_POKER_DDZ, cc.SpriteAtlas);
        // 大厅房间配置预制件
        for (var i = 0; i < ConstsDef.URL_ROOMCONFIG.length; i++) {
            cc.fy.resMgr.addRes(ConstsDef.URL_ROOMCONFIG[i]);
        }

        //俱乐部
        cc.fy.resMgr.addRes(ConstsDef.URL_PREFAB_GUILDROOMTABLE,cc.Prefab);
    },
});
