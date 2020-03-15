var GameMsgDef = require("GameMsgDef");
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
        skeletons: {
            default: [],
            type: sp.SkeletonData,
        },
        _skeletonConfig: null,
        _animNames: null,
        _useProp: null,
        _propItem: null,
        _skeleton: null,

        _gameChild: null,

        positions: {
            default: [],
            type: cc.Node,
        },

        positions1: {
            default: [],
            type: cc.Node,
        },

        _lastTime: null,
        _gameplayer: null,
    },

    // use this for initialization
    onLoad: function () {
        // var self = this;
        cc.fy.useProp = this;
        if (this._skeletonConfig == null) {
            this._skeletonConfig = {
                "SP_LOVE": 0,
                "SP_TOMATO": 1,
                "SP_CHEERS": 2,
                "SP_FLOWER": 3,
                "SP_EGG": 4,
                "SP_GUN": 5,
                "SP_GRENADE": 6,
                "SP_MONEY": 7,
                "SP_WATER": 8,
                "SP_SPLASH": 9,
                "SP_SHOES": 10,
                "SP_DASUAN": 11,
            }
        }
        if (cc.fy.gameNetMgr.seats == null || cc.fy.gameNetMgr.seats.length == 0) {
            return;
        }
        let gameMain = this.node.parent;

        this._gameplayer = cc.fy.gameNetMgr.seats.length;
        this._gameChild = gameMain.getChildByName("game");
        this._animNames = ["start", "start", "start", "start", "start", "start01", "start", "start", "start", "start", "start", "start"];

        this._useProp = this.node;
        this._propItem = this._useProp.getChildByName("propItem");
        cc.fy.net.addHandler("use_prop_push", function (data) {
            console.log(data);
            var fromID = data.from;
            var toID = data.to;
            var propID = data.propId;
            var fromIdx = cc.fy.gameNetMgr.getSeatIndexByID(fromID);
            var fromLocalIdx = cc.fy.gameNetMgr.getLocalIndex(fromIdx);
            var toIdx = cc.fy.gameNetMgr.getSeatIndexByID(toID);
            var toLocalIdx = cc.fy.gameNetMgr.getLocalIndex(toIdx);
            cc.fy.useProp.onUseProp(fromLocalIdx, toLocalIdx, propID);
        });

        this.change2D3DPos();
    },

    onUseProp: function (from, to, prop) {
        console.log("==>> from: ", from);
        console.log("==>> to: ", to);
        cc.fy.audioMgr.playSFX("prop/" + "SP_DROP.mp3");
        var positionReal = null;
        if (this._gameChild.active == true) {
            positionReal = this.positions;
        }
        else {
            positionReal = this.positions1;
        }

        console.log("==>> positionReal: ", positionReal);
        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.PDK) {
            if (this._gameplayer == 2) {
                if (from == 1) {
                    from = 2;
                }

                if (to == 1) {
                    to = 2;
                }
            }
            else {
                if (from == 2) {
                    from = 3;
                }

                if (to == 2) {
                    to = 3;
                }
            }
        }
        // else if(cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.DDZ){
        //     if(from == 2){
        //         from = 3;
        //     }
        //     if(to == 2){
        //         to = 3;
        //     }
        // }

        var fromPos = positionReal[from].position;
        var toPos = positionReal[to].position;
        var item = cc.instantiate(this._propItem);
        this._useProp.addChild(item);
        item.setPosition(fromPos);
        item.active = true;
        var propIconCount = item.childrenCount;
        for (var i = 0; i < propIconCount; ++i) {
            var icon = item.children[i];
            if (icon.name == prop) {
                icon.active = true;
                break;
            }
        }
        var rotateBy = cc.rotateBy(1, 360 * 2);
        var moveTo = cc.moveTo(1, toPos);
        var spawnAction = cc.spawn(moveTo, rotateBy);
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
            var index = self._skeletonConfig[prop];
            var animName = self._animNames[index];
            var skeletonNode = item.getChildByName("spine");
            skeletonNode.active = true;
            var skeleton = skeletonNode.getComponent(sp.Skeleton);
            skeleton.skeletonData = self.skeletons[index];
            skeleton.setAnimation(1, animName, false);
            cc.fy.audioMgr.playSFX("prop/" + prop + ".mp3");
            skeleton.setCompleteListener(function () {
                skeletonNode.active = false;
            }, this, null);
        });

        var seqAction = cc.sequence(spawnAction, hidePropIcon, spineAction);
        item.runAction(seqAction);
    },

    // 切换3D界面 扔道具位置
    change2D3DPos: function () {
        if (this.positions == null || cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.PDK) {
            return;
        }
        var cardSetting = JSON.parse(cc.fy.localStorage.getItem('card_setting'));
        if (cc.fy.utils.check3D(cardSetting)) { // 3d
            // this.positions[0].setPosition(-505, -75);
            // this.positions[1].setPosition(472, 51);

            // this.positions[2].getComponent(cc.Widget).isAlignRight= true;
            if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.JDMJ) {
                // this.positions[2].getComponent(cc.Widget).right = 310;
                // this.positions[2].setPosition(310, 251);
                if (this.positions[2].getComponent(cc.Widget) != null) {
                    this.positions[2].getComponent(cc.Widget).isAlignRight = true;
                    this.positions[2].getComponent(cc.Widget).right = 290;
                    this.positions[2].getComponent(cc.Widget).top = 69;
                    this.positions[2].getComponent(cc.Widget).updateAlignment();
                }
            }
            else if (cc.fy.gameNetMgr.seats.length == 2) {
                // this.positions[2].setPosition(440, 251);
                if (this.positions[2].getComponent(cc.Widget) != null) {
                    this.positions[2].getComponent(cc.Widget).isAlignRight = true;
                    this.positions[2].getComponent(cc.Widget).right = 140;
                    this.positions[2].getComponent(cc.Widget).top = 69;
                    this.positions[2].getComponent(cc.Widget).updateAlignment();
                }
            }
            else {
                // this.positions[2].getComponent(cc.Widget).right = 141;
                // this.positions[2].setPosition(141, 251);
                if (this.positions[2].getComponent(cc.Widget) != null) {
                    this.positions[2].getComponent(cc.Widget).isAlignRight = true;
                    this.positions[2].getComponent(cc.Widget).right = 140;
                    this.positions[2].getComponent(cc.Widget).top = 69;
                    this.positions[2].getComponent(cc.Widget).updateAlignment();
                }
            }

            // this.positions[3].setPosition(-485, 64);
        }
        else {
            // this.positions[0].setPosition(-505, -75);
            // this.positions[1].setPosition(472, 51);
            if (this.positions[2].getComponent(cc.Widget) != null) {
                this.positions[2].getComponent(cc.Widget).isAlignRight = true;
                this.positions[2].getComponent(cc.Widget).right = 214;
                this.positions[2].getComponent(cc.Widget).top = 69;
                this.positions[2].getComponent(cc.Widget).updateAlignment();
            }

            // this.positions[2].setPosition(300, 260);
            // this.positions[3].setPosition(-485, 64);
        }
    },

});
