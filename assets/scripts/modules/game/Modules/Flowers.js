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
    },

    // use this for initialization
    onLoad: function () {
        if (!cc.fy) {
            return;
        }

        var gameChild = this.node.getChildByName("game");
        var myself = gameChild.getChildByName("myself");
        var flowerRoot = myself.getChildByName("flowerRoot");
        var flowerMarkRoot = myself.getChildByName("flowerMarkRoot");

        var self = this;
        var game = cc.fy.gameNetMgr;
        game.addHandler("game_flowers", function (data) {
            console.log("game_flowers", data);
            if (cc.fy.gameNetMgr.gamestate == "piaohua") {
                return;
            }
            var seats = cc.fy.gameNetMgr.seats;
            for (var i in seats) {
                self.onFlowerChanged(seats[i]);
            }
            self.playFlowerAction(data, "game_flowers");
        });
        game.addHandler('game_start', function (data) {
            self.onGameBein();
        });
        game.addHandler('game_holds', function (data) {
            var seats = cc.fy.gameNetMgr.seats;
            for (var i in seats) {
                self.onFlowerChanged(seats[i]);
            }
        });
        if (cc.fy.gameNetMgr.gamestate == "lazhuang" || cc.fy.gameNetMgr.gamestate == "dingzhuang") {
            self.onGameBein();
            return;
        }
        var seats = cc.fy.gameNetMgr.seats;
        for (var i in seats) {
            self.onFlowerChanged(seats[i]);
        }
    },

    onGameBein: function () {
        // if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.ERMJ) {
        //     this.hideSide("myself");
        //     this.hideSide("up");
        // }
        // else {
        this.hideSide("myself");
        this.hideSide("right");
        this.hideSide("up");
        this.hideSide("left");
        // }

    },

    hideSide: function (side) {
        var gameChild = this.node.getChildByName("game");
        var myself = gameChild.getChildByName(side);
        var flowerRoot = myself.getChildByName("flowerRoot");
        var flowerMarkRoot = myself.getChildByName("flowerMarkRoot");
        if (flowerRoot) {
            for (var i = 0; i < flowerRoot.childrenCount; ++i) {
                flowerRoot.children[i].active = false;
            }
        }
        if (flowerMarkRoot) {
            for (var i = 0; i < flowerMarkRoot.childrenCount; ++i) {
                flowerMarkRoot.children[i].active = false;
            }
        }
    },
    onPiaoFenChanged: function (seatData) {
        if (seatData.flowers == null) {
            return;
        }
        var localIndex = cc.fy.gameNetMgr.getLocalIndex(seatData.seatindex);
        var side = cc.fy.mahjongmgr.getSide(localIndex);
        var pre = cc.fy.mahjongmgr.getFoldPre(localIndex);

        var gameChild = this.node.getChildByName("game");
        var xSide = gameChild.getChildByName(side);
        var flower = xSide.getChildByName("flower");
        var flowerRoot = xSide.getChildByName("flowerRoot");
        var flowerMarkRoot = xSide.getChildByName("flowerMarkRoot");
        if (flowerRoot) {
            for (var i = 0; i < flowerRoot.childrenCount; ++i) {
                flowerRoot.children[i].active = false;
            }
        }
        if (flowerMarkRoot) {
            for (var i = 0; i < flowerMarkRoot.childrenCount; ++i) {
                flowerMarkRoot.children[i].active = false;
            }
        }
        flowerRoot.removeAllChildren();
        flowerMarkRoot.removeAllChildren();
        // 初始化花牌
        var index = 0;
        var flowers = seatData.flowers;
        var flowerNum = flowers.length;
        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZER) {
            for (var i = 0; i < flowers.length; ++i) {
                var mjid = flowers[i];
                this.initFlowers(flowerRoot, side, pre, index, mjid);
                index++;
            }
        }
        if (flowerNum > 0) {
            this.initFlowerMark(flowerMarkRoot, flowerNum)
        }
    },


    onFlowerChanged: function (seatData) {
        if (seatData.flowers == null) {
            return;
        }
        var localIndex = cc.fy.gameNetMgr.getLocalIndex(seatData.seatindex);
        var side = cc.fy.mahjongmgr.getSide(localIndex);
        var pre = cc.fy.mahjongmgr.getFoldPre(localIndex);
        var gameChild = this.node.getChildByName("game");
        var xSide = gameChild.getChildByName(side);
        var flower = xSide.getChildByName("flower");
        var flowerRoot = xSide.getChildByName("flowerRoot");
        var flowerMarkRoot = xSide.getChildByName("flowerMarkRoot");
        if (flowerRoot) {
            for (var i = 0; i < flowerRoot.childrenCount; ++i) {
                flowerRoot.children[i].active = false;
            }
        }
        if (flowerMarkRoot) {
            for (var i = 0; i < flowerMarkRoot.childrenCount; ++i) {
                flowerMarkRoot.children[i].active = false;
            }
        }
        flowerRoot.removeAllChildren();
        flowerMarkRoot.removeAllChildren();
        // 初始化花牌
        var index = 0;
        var flowers = seatData.flowers;
        var flowerNum = flowers.length;
        // if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZER) {
        //     for (var i = 0; i < flowers.length; ++i) {
        //         var mjid = flowers[i];
        //         this.initFlowers(flowerRoot, side, pre, index, mjid);
        //         index++;
        //     }
        // }
        if (flowerNum > 0) {
            this.initFlowerMark(flowerMarkRoot, flowerNum);

        }
    },

    // 创建花牌
    initFlowers: function (flowerRoot, side, pre, index, mjid) {
        var fRoot = null;
        if (side == "left" || side == "right") {
            fRoot = cc.instantiate(cc.fy.mahjongmgr.flowerPrefabLeftOrRight);
        } else {
            fRoot = cc.instantiate(cc.fy.mahjongmgr.flowerPrefabSelf);
        }
        flowerRoot.addChild(fRoot);
        fRoot.setPosition(cc.p(0, 0));
        // console.log(fRoot);
        // var width = fRoot.children[0].width;
        if (side == "left") {
            fRoot.y = -(index * 20);
        } else if (side == "right") {
            fRoot.y = index * 20;
            fRoot.setLocalZOrder(-index);
        } else if (side == "myself") {
            if (index < 13) {
                fRoot.x = index * 30;
            } else if (index >= 13 && index < 22) {
                fRoot.x = (index - 11) * 30;
                fRoot.y = 20;
                fRoot.setLocalZOrder(-index);
            } else if (index >= 22 && index < 33) {
                fRoot.x = (index - 22) * 30;
                fRoot.y = 40;
                fRoot.setLocalZOrder(-index);
            }
        } else {
            if (index < 13) {
                fRoot.x = -(index * 30);
            } else if (index >= 13 && index < 25) {
                fRoot.x = -(index - 8) * 30;
                fRoot.y = -30;
            }
        }

        var sprites = fRoot.getComponentsInChildren(cc.Sprite);
        for (var s = 0; s < sprites.length; ++s) {
            var sprite = sprites[s];
            sprite.spriteFrame = cc.fy.mahjongmgr.getFlowerSpriteFrameByMJID(pre, mjid);
        }
    },

    // 创建花标记
    initFlowerMark: function (flowerMarkRoot, num) {
        var fmRoot = null;
        fmRoot = cc.instantiate(cc.fy.mahjongmgr.flowerMarkPrefab);
        // if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZTDH) {
        //     fmRoot = cc.instantiate(cc.fy.mahjongmgr.flowerMarkPrefab);
        // }
        // else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZBD) {
        //     fmRoot = cc.instantiate(cc.fy.mahjongmgr.flowerMarkPrefab1);
        // }
        // else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZHD) {
        //     fmRoot = cc.instantiate(cc.fy.mahjongmgr.flowerMarkPrefab1);
        // }
        // else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZER) {
        //     if (cc.fy.gameNetMgr.conf.xiaohua == 0) {
        //         fmRoot = cc.instantiate(cc.fy.mahjongmgr.flowerMarkPrefab1);
        //     }
        //     else if (cc.fy.gameNetMgr.conf.xiaohua == 1) {
        //         fmRoot = cc.instantiate(cc.fy.mahjongmgr.flowerMarkPrefab);
        //     } else {
        //         fmRoot = cc.instantiate(cc.fy.mahjongmgr.flowerMarkPrefab1);
        //     }
        // }
        // else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.HAMJ) {
        //     fmRoot = cc.instantiate(cc.fy.mahjongmgr.flowerMarkPrefab1);
        // }
        // cc.log("xiaohua num:" + num);
        // cc.log("fmRoot:" + fmRoot);
        if (fmRoot != null) {
            var labNumOfFlower = fmRoot.getChildByName("labFlower").getComponent("cc.Label");
            labNumOfFlower.string = "x" + num;
            flowerMarkRoot.addChild(fmRoot);
            fmRoot.setPosition(cc.p(-5, -10));
        }
    },

    playFlowerAction: function (data, str) {
        console.log("playFlowerAction  data ===", data);
        var toIdx = cc.fy.gameNetMgr.getSeatIndexByID(data.userId);
        var localIndex = cc.fy.gameNetMgr.getLocalIndex(toIdx);
        var side = cc.fy.mahjongmgr.getSide(localIndex);
        var gameChild = this.node.getChildByName("game");
        var xSide = gameChild.getChildByName(side);
        var flower = xSide.getChildByName("flower");
        if (flower) {
            var scaleto = cc.scaleTo(0.5, 0.6);
            var rotateTo = cc.rotateTo(1, 360);
            // var delay = cc.delayTime(1);
            var fadein = cc.fadeIn(1.5);
            var func = cc.callFunc(function () {
                flower.active = false;
            }, this, null);
            var spawn = cc.spawn(scaleto, rotateTo, fadein);
            var seq = cc.sequence(spawn, func);
            flower.active = true;
            flower.runAction(seq);
            cc.fy.audioMgr.playSFX("buhua.mp3");
        }
    },
});
