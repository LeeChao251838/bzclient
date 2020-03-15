var mahjongSprites = [];
// var Hold = require("Hold");
var ConstsDef = require('ConstsDef');
cc.Class({
    extends: cc.Component,

    properties: {
        leftAtlas: {
            default: null,
            type: cc.SpriteAtlas
        },

        rightAtlas: {
            default: null,
            type: cc.SpriteAtlas
        },

        bottomAtlas: {
            default: null,
            type: cc.SpriteAtlas
        },

        bottomFoldAtlas: {
            default: null,
            type: cc.SpriteAtlas
        },

        flowerLeftAtlas: {
            default: null,
            type: cc.SpriteAtlas
        },

        flowerRightAtlas: {
            default: null,
            type: cc.SpriteAtlas
        },

        flowerSelfAtlas: {
            default: null,
            type: cc.SpriteAtlas
        },

        pengPrefabSelf: {
            default: null,
            type: cc.Prefab
        },

        pengPrefabLeft: {
            default: null,
            type: cc.Prefab
        },

        flowerPrefabSelf: {
            default: null,
            type: cc.Prefab
        },

        flowerPrefabLeftOrRight: {
            default: null,
            type: cc.Prefab
        },

        flowerMarkPrefab: {
            default: null,
            type: cc.Prefab
        },

        // flowerMarkPrefab1: {
        //     default: null,
        //     type: cc.Prefab
        // },

        emptyAtlas: {
            default: null,
            type: cc.SpriteAtlas
        },

        holdsEmpty: {
            default: [],
            type: [cc.SpriteFrame]
        },

        _sides: null,
        _pres: null,
        _foldPres: null,
        _gamePlayer: 3,
    },

    onLoad: function () {
        if (cc.fy == null) {
            return;
        }

        if (cc.fy.gameNetMgr.seats == null) {
            cc.fy.alert.show("该房间已解散", function () {
                cc.fy.sceneMgr.loadScene("hall");
            });
            console.log("cc.fy.gameNetMgr.seats is null");
            return;
        }

        this._gamePlayer = cc.fy.gameNetMgr.seats.length;
        // if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.ERMJ) {
        //     this._sides = ["myself", "up"];
        //     this._pres = ["M_", "B_"];
        //     this._foldPres = ["B_", "B_"];
        // }
        // else
        if (cc.isMJ(cc.fy.gameNetMgr.conf.type)) {
            if (this._gamePlayer == 3) {
                this._sides = ["myself", "right", "left"];
                this._pres = ["M_", "R_", "L_"];
                this._foldPres = ["B_", "R_", "L_"];
            }
            else if (this._gamePlayer == 2) {
                this._sides = ["myself", "up"];
                this._pres = ["M_", "B_"];
                this._foldPres = ["B_", "B_"];
            }
            else {
                this._sides = ["myself", "right", "up", "left"];
                this._pres = ["M_", "R_", "B_", "L_"];
                this._foldPres = ["B_", "R_", "B_", "L_"];
            }
        }
        else {
            this._sides = ["myself", "right", "up", "left"];
            this._pres = ["M_", "R_", "B_", "L_"];
            this._foldPres = ["B_", "R_", "B_", "L_"];
        }

        cc.fy.mahjongmgr = this;
        //筒
        for (var i = 1; i < 10; ++i) {
            mahjongSprites.push("dot_" + i);
        }

        //条
        for (var i = 1; i < 10; ++i) {
            mahjongSprites.push("bamboo_" + i);
        }

        //万
        for (var i = 1; i < 10; ++i) {
            mahjongSprites.push("character_" + i);
        }
        //东南西北风
        mahjongSprites.push("wind_east");
        mahjongSprites.push("wind_south");
        mahjongSprites.push("wind_west");
        mahjongSprites.push("wind_north");
        //中、发、白
        mahjongSprites.push("red");
        mahjongSprites.push("green");
        mahjongSprites.push("white");
        // 花麻将：百搭、大白板、春、夏、秋、冬、梅、兰、竹、菊
        mahjongSprites.push("joker");
        mahjongSprites.push("nothing");
        mahjongSprites.push("spring");
        mahjongSprites.push("summer");
        mahjongSprites.push("autumn");
        mahjongSprites.push("winter");
        mahjongSprites.push("plum");
        mahjongSprites.push("orchid");
        mahjongSprites.push("bamboo");
        mahjongSprites.push("chrysanthemum");
    },

    getMahjongSpriteByID: function (id) {
        // 东南西北中发白id相差4
        // 花麻将增加百搭、大白板、春、夏、秋、冬、梅、兰、竹、菊（id相差1）
        if (id >= 27 && id < 52) {
            var idT = parseInt((id - 27) / 4 + 27);
            return mahjongSprites[idT];
        }
        else if (id >= 52 && id < 62) {
            var idT = id - 18;
            // console.log("getMahjongSpriteByID idt = " + idT);
            return mahjongSprites[idT];
        }
        else if (id >= 62) {
            console.log("==>> error: invalid id, please check your input...");
            return mahjongSprites[35];    // 暂时用大白板代替无效的牌
        }
        return mahjongSprites[id];
    },

    getMahjongType: function (id) {
        if (id >= 0 && id < 9) {
            return 0;
        }
        else if (id >= 9 && id < 18) {
            return 1;
        }
        else if (id >= 18 && id < 27) {
            return 2;
        }
    },

    getSpriteFrameByMJID: function (pre, mjid) {
        var spriteFrameName = this.getMahjongSpriteByID(mjid);
        spriteFrameName = pre + spriteFrameName;
        if (pre == "M_") {
            return this.bottomAtlas.getSpriteFrame(spriteFrameName);
        }
        else if (pre == "B_") {
            return this.bottomFoldAtlas.getSpriteFrame(spriteFrameName);
        }
        else if (pre == "L_") {
            if (mjid == 52) {
                return this.getFlowerSpriteFrameByMJID(pre, mjid);
            } else {
                return this.leftAtlas.getSpriteFrame(spriteFrameName);
            }
        }
        else if (pre == "R_") {
            if (mjid == 52) {
                return this.getFlowerSpriteFrameByMJID(pre, mjid);
            } else {
                return this.rightAtlas.getSpriteFrame(spriteFrameName);
            }
        }
    },

    getUpSpriteFrame: function () {
        return this.bottomFoldAtlas.getSpriteFrame("e_mj_b_up");
    },

    // 根据麻将id获取花牌图片资源
    getFlowerSpriteFrameByMJID: function (pre, mjid) {
        var spriteFrameName = this.getMahjongSpriteByID(mjid);
        spriteFrameName = pre + spriteFrameName;
        if (pre == "L_") {
            return this.flowerLeftAtlas.getSpriteFrame(spriteFrameName);
        }
        else if (pre == "R_") {
            return this.flowerRightAtlas.getSpriteFrame(spriteFrameName);
        }
        else {
            return this.flowerSelfAtlas.getSpriteFrame(spriteFrameName);
        }
    },

    getAudioURLByMJID: function (id) {
        var realId = 0;
        if (id >= 0 && id < 9) {
            realId = id + 21;
        }
        else if (id >= 9 && id < 18) {
            realId = id - 8;
        }
        else if (id >= 18 && id < 27) {
            realId = id - 7;
        }
        else if (id >= 27) {
            var idT = parseInt((id - 27) / 4 + 27);
            realId = (idT - 27) * 10 + 31;
        }
        return realId + ".mp3";
    },

    getEmptySpriteFrame: function (side) {
        if (side == "up") {
            return this.emptyAtlas.getSpriteFrame("e_mj_b_up");
        }
        else if (side == "myself") {
            return this.emptyAtlas.getSpriteFrame("e_mj_b_up");  // e_mj_b_bottom
        }
        else if (side == "left") {
            return this.emptyAtlas.getSpriteFrame("e_mj_b_left");
        }
        else if (side == "right") {
            return this.emptyAtlas.getSpriteFrame("e_mj_b_right");
        }
    },

    getHoldsEmptySpriteFrame: function (side) {
        if (side == "up") {
            return this.emptyAtlas.getSpriteFrame("e_mj_up");
        }
        else if (side == "myself") {
            return null;
        }
        else if (side == "left") {
            return this.emptyAtlas.getSpriteFrame("e_mj_left");
        }
        else if (side == "right") {
            return this.emptyAtlas.getSpriteFrame("e_mj_right");
        }
    },

    // sortMJ:function(mahjongs,dingque){
    //     var self = this;
    //     mahjongs.sort(function(a,b){
    //         if(dingque >= 0){
    //             var t1 = self.getMahjongType(a);
    //             var t2 = self.getMahjongType(b);
    //             if(t1 != t2){
    //                 if(dingque == t1){
    //                     return 1;
    //                 }
    //                 else if(dingque == t2){
    //                     return -1;
    //                 }
    //             }
    //         }
    //         return a - b;
    //     });
    // },
    sortBaiDaMJ: function (mahjongs) {
        var self = this;
        mahjongs.sort(function (a, b) {
            // 万放在前面
            if (a == 43 && b == 43) {
                return 0;
            }
            else if (a != 43 && b == 43) {
                return 1;
            }
            else if (a == 43 && b != 43) {
                return -1;
            }
            else if (self.isMJWan(a) && self.isMJWan(b)) {
                return a - b;
            }
            else if (self.isMJWan(a) && !self.isMJWan(b)) {
                return -1;
            }
            else if (!self.isMJWan(a) && self.isMJWan(b)) {
                return 1;
            }
            return a - b;
        });
    },

    sortMJ: function (mahjongs) {
        var self = this;
        mahjongs.sort(function (a, b) {
            // 万放在前面
            if (self.isMJWan(a) && self.isMJWan(b)) {
                return a - b;
            }
            else if (self.isMJWan(a) && !self.isMJWan(b)) {
                return -1;
            }
            else if (!self.isMJWan(a) && self.isMJWan(b)) {
                return 1;
            }
            return a - b;
        });
    },
    sortSZMJ: function (mahjongs) {
        var self = this;
        mahjongs.sort(function (a, b) {
            if (self.isBaida(a) && !self.isBaida(b)) {
                return -1;
            }
            else if (!self.isBaida(a) && self.isBaida(b)) {
                return 1;
            }
            // 万放在前面
            if (self.isMJWan(a) && self.isMJWan(b)) {
                return a - b;
            }
            else if (self.isMJWan(a) && !self.isMJWan(b)) {
                return -1;
            }
            else if (!self.isMJWan(a) && self.isMJWan(b)) {
                return 1;
            }
            return a - b;
        });
    },
    sortHZMJ: function (mahjongs) {
        var self = this;
        mahjongs.sort(function (a, b) {
            if (self.isBaida(a) && !self.isBaida(b)) {
                return -1;
            }
            else if (!self.isBaida(a) && self.isBaida(b)) {
                return 1;
            }
            // 万放在前面
            if (self.isMJWan(a) && self.isMJWan(b)) {
                return a - b;
            }
            else if (self.isMJWan(a) && !self.isMJWan(b)) {
                return -1;
            }
            else if (!self.isMJWan(a) && self.isMJWan(b)) {
                return 1;
            }
            return a - b;
        });
    },

    sortHolds: function (seatData) {
        var holds = seatData.holds,
            mopai;

        if (holds == null) {
            return null;
        }
        if (this.hasNewCard(seatData)) {
            mopai = holds.pop();
        }
        this.sortMJ(holds);
        //将摸牌添加到最后
        if (mopai != null) {
            holds.push(mopai);
            console.log("sortHolds push:" + mopai);
        }

        return holds;
    },


    isMJWan: function (mjid) {
        if (mjid >= 18 && mjid <= 26) {
            return true;
        }
        return false;
    },

    isBaidaPai: function (pai) {
        if (cc.fy.gameNetMgr.conf.type == 2 && pai == 52) {
            return true;
        }
        if (cc.fy.gameNetMgr.conf.type == 3 && pai == cc.fy.gameNetMgr.baida) {
            return true;
        }
        if (cc.fy.gameNetMgr.conf.type == 23 && pai == cc.fy.gameNetMgr.baida) {
            return true;
        }
        return false;
    },

    isBaida: function (pai) {
        // if (cc.fy.gameNetMgr.conf.type == 2 && pai == 52) {
        //     return true;
        // }
        if (cc.fy.gameNetMgr.conf.type == 3 && pai == cc.fy.gameNetMgr.baida) {
            return true;
        }
        if (cc.fy.gameNetMgr.conf.type == 23 && pai == cc.fy.gameNetMgr.baida) {
            return true;
        }
        return false;
    },

    getSide: function (localIndex) {
        return this._sides[localIndex];
    },

    getPre: function (localIndex) {
        return this._pres[localIndex];
    },

    getFoldPre: function (localIndex) {
        return this._foldPres[localIndex];
    },

    // 判断有摸牌
    hasNewCard: function (seatData) {
        if (seatData.zatoucard == null || seatData.zatoucard == -1) {
            return seatData.holds.length % 3 == 2;
        } else {
            return seatData.holds.length % 3 == 0;
        }
    },

    isHongZhong: function (pai) {
        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZCT && pai == 43) {
            return true;
        }
        return false;
    },




    // 初始化所有牌面和牌背  用于切换牌型配置后使用
    // 以及初始化背景
    // initAllMahjongInGame: function () {
    //     console.log("切换风格！");
    //     var cardSetting = JSON.parse(cc.fy.localStorage.getItem('card_setting'));
    //     // if (cc.fy.utils.check3D(cardSetting)) {
    //     //     this._sides = ["myself", "right", "up", "left"];
    //     //     this._pres = ["M_", "R_", "B_", "L_"];
    //     //     this._foldPres = ["B_", "R_", "U_", "L_"];
    //     // }
    //     // else {
    //         this._sides = ["myself", "right", "up", "left"];
    //         this._pres = ["M_", "R_", "B_", "L_"];
    //         this._foldPres = ["B_", "R_", "B_", "L_"];
    //     // }
    //     // if(cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.ERMJ) return;// 二人麻将不处理
    //     console.log("==>> newHolds: ", this.newHolds);
    //     for (var i = 0; i < this.newHolds.length; i++) {
    //         var hold = this.newHolds[i];
    //         if (hold != null) {
    //             // console.log(hold);
    //             hold.changeConfigTexture();
    //         } else {// 如果已经不存在了就删除了
    //             this.newHolds.splice(i, 1);
    //         }
    //     }
    // },


    getPengPrefabSelf: function () {
        // 获取peng预制体
        return cc.fy.resMgr.getRes(ConstsDef.URL_PREFAB_PENGSELF);
    },

    getPengPrefabLeft: function () {
        // 获取peng预制体
        return cc.fy.resMgr.getRes(ConstsDef.URL_PREFAB_PENGLEFT);
    },

    getFlowerPrefabSelf: function () {
        // 获取peng预制体
        return cc.fy.resMgr.getRes(ConstsDef.URL_PREFAB_FLOWERSELF);
    },

    getflowerPrefabLeft: function () {
        // 获取peng预制体
        return cc.fy.resMgr.getRes(ConstsDef.URL_PREFAB_FLOWERLEFT);
    },

    getflowerPrefabMark: function () {
        // 获取peng预制体
        return cc.fy.resMgr.getRes(ConstsDef.URL_PREFAB_FLOWERMARK);
    },
});

