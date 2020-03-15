var GameMsgDef = require("GameMsgDef");
cc.Class({
    extends: require("BaseModuleView"),
    properties: {
        skeletons: {
            default: [],
            type: sp.SkeletonData,
        },
        _skeletonConfig: null,
        _animNames: null,
        _propItem: null,
        _skeleton: null,

        _gameplayer: null,

        positions: {
            default: [],
            type: cc.Node,
        },
        MJPrepositions: {
            default: [],
            type: cc.Node,
        },
        MJGamepositions: {
            default: [],
            type: cc.Node,
        },

        DDZPrepositions: {
            default: [],
            type: cc.Node,
        },
        GDPrepositions: {
            default: [],
            type: cc.Node,
        },
        GDGamepositions: {
            default: [],
            type: cc.Node,
        },
    },
    onLoad: function () {

        this.initView();
        this.initEventHandlers();
    },
    start: function () {

    },

    initView: function () {
        // 作为弹框模式 不隐藏其它弹框
        this.setHideOther(false);
        if (cc.fy.gameNetMgr.seats == null) {
            cc.fy.alert.show("该房间已解散", function () {
                cc.fy.sceneMgr.loadScene("hall");
            });
            console.log("cc.fy.gameNetMgr.seats is null");
            return;
        }
        this._gameplayer = cc.fy.gameNetMgr.seats.length;//cc.fy.gameNetMgr.conf.maxCntOfPlayers;
        // var self = this;
        cc.fy.useProp = this;
        if (this._skeletonConfig == null) {
            this._skeletonConfig = {
                "SP_SHOES": 0,
                "SP_FLOWER": 1,
                "SP_EGG": 2,
                "SP_CHEERS": 3,
            }
        }

        this._animNames = ["tuoxie", "hua02", "animation", "animation"];
        this._propItem = this.node.getChildByName("propItem");

    },
    initEventHandlers: function () {
        var self = this;
        var game = cc.fy.gameNetMgr;
        game.addHandler(GameMsgDef.ID_SHOWUSEPROPVIEW_CTC, function (data) {
            if (data.isShow == false) {
                console.log("hide")
                self.hidePanel();
            }
            else {
                self.showPanel(data);
            }
        });
    },
    showPanel: function (data) {
        console.log("show user prop", data);
        this.node.active = true;
        if (data.isFlash) {
            var self = this;
            setTimeout(function () {
                self.node.active = false;
            }, 100);

            return;
        }

        var content = JSON.parse(data.content.content);
        var fromID = data.content.sender;
        var toID = content.userId;
        var propID = content.propId;

        var fromIdx = cc.fy.gameNetMgr.getSeatIndexByID(fromID);
        var fromLocalIdx = cc.fy.gameNetMgr.getLocalIndex(fromIdx);
        var toIdx = cc.fy.gameNetMgr.getSeatIndexByID(toID);
        var toLocalIdx = cc.fy.gameNetMgr.getLocalIndex(toIdx);
        this.onUseProp(fromLocalIdx, toLocalIdx, propID);
    },

    hidePanel: function () {
        this.node.active = false;
    },

    onUseProp: function (from, to, prop) {
        console.log("onUseProp");
        var positionReal = null;
        positionReal = this.positions;
        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.DDZ) {
            positionReal = this.DDZPrepositions;
        }

        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.PDK
            || cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.DDZ) {
            if (this._gameplayer == 2) {
                if (from == 1) {
                    from = 2;
                }

                if (to == 1) {
                    to = 2;
                }
            }
            else if (this._gameplayer == 3) {
                if (from == 2) {
                    from = 3;
                }

                if (to == 2) {
                    to = 3;
                }
            }
        } else if (cc.isMJ(cc.fy.gameNetMgr.conf.type)) {
            if (cc.find("Canvas/gameMain/prepare") && cc.find("Canvas/gameMain/prepare").active) {
                positionReal = this.MJPrepositions;
            } else {
                positionReal = this.MJGamepositions;
                //     if (this._gameplayer == 2) {
                //         if (from == 1) {
                //             from = 2;
                //         }
                //         if (to == 1) {
                //             to = 2;
                //         }
                //     }
                //     else if (this._gameplayer == 3) {
                //         if (from == 2) {
                //             from = 3;
                //         }
                //         if (to == 2) {
                //             to = 3;
                //         }
                //     }
            }
            if (this._gameplayer == 2) {
                if (from == 1) {
                    from = 2;
                }
                if (to == 1) {
                    to = 2;
                }
            }
            else if (this._gameplayer == 3) {
                if (from == 2) {
                    from = 3;
                }
                if (to == 2) {
                    to = 3;
                }
            }
        } else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.GD) {
            if (cc.find("Canvas/prepare") && cc.find("Canvas/prepare").active) {
                positionReal = this.GDPrepositions;
            } else {
                positionReal = this.GDGamepositions;
            }
            if (this._gameplayer == 2) {
                if (from == 1) {
                    from = 2;
                }
                if (to == 1) {
                    to = 2;
                }
            }
            else if (this._gameplayer == 3) {
                if (from == 2) {
                    from = 3;
                }
                if (to == 2) {
                    to = 3;
                }
            }
        }


        var fromPos = positionReal[from].position;
        var toPos = positionReal[to].position;
        if (prop == 'SP_SHOES') {
            toPos = { x: toPos.x - 50, y: toPos.y - 50 };
        }

        console.log("fromPos:" + fromPos.x + "toPos:" + toPos.x);

        var item = cc.instantiate(this._propItem);
        this.node.addChild(item);
        item.setPosition(fromPos);
        var propIconCount = item.childrenCount;
        for (var i = 0; i < propIconCount; ++i) {
            var icon = item.children[i];
            if (icon.name == prop) {
                icon.active = true;
                break;
            }
        }
        var rotateBy = cc.rotateBy(0.5, 360 * 2);
        var moveTo = cc.moveTo(0.5, toPos);
        var playvoice = cc.callFunc(function () {
            // var voiceName = "prop/" + prop + "_WAY.mp3";
            // cc.fy.audioMgr.playSFX(voiceName);    
        });

        var spawnAction = cc.spawn(moveTo, rotateBy, playvoice);
        var self = this;

        var hidePropIcon = cc.callFunc(function () {
            var count = item.childrenCount;
            for (var i = 0; i < count; ++i) {
                var icon = item.children[i];
                if (icon.name == prop) {
                    icon.active = false;
                    break;
                }
            }
        });
        var spineAction = cc.callFunc(function () {

            var voiceName = "prop/" + prop + ".mp3";
            cc.fy.audioMgr.playSFX(voiceName);
            var index = self._skeletonConfig[prop];
            var animName = self._animNames[index];
            var skeletonNode = item.getChildByName("spine");
            skeletonNode.active = true;
            var skeleton = skeletonNode.getComponent(sp.Skeleton);
            skeleton.skeletonData = self.skeletons[index];

            if (animName == 'tuoxie' || animName == "hua") {
                skeleton.setAnimation(1, animName + '01', false);
                skeleton.setCompleteListener(function () {
                    skeleton.setAnimation(1, animName + '02', false);
                    skeleton.setCompleteListener(function () {
                        skeletonNode.active = false;
                    });
                });
            } else {
                skeleton.setAnimation(1, animName, false);
                skeleton.setCompleteListener(function () {
                    skeletonNode.active = false;
                });
            }

        });

        var seqAction = cc.sequence(spawnAction, hidePropIcon, spineAction);
        item.runAction(seqAction);
        console.log("fromPos", fromPos);
        console.log("toPos", toPos);
    },


});
