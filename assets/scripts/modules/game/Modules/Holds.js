var NewCardTag = 1001;

cc.Class({
    extends: cc.Component,

    properties: {
        _holds: null,
        _selectedMj: null,
        _touchOffset: null,
        _touchStart: null,
        _touchMj: null,
        _MahJongs: [],
        _lastevent: null,

        _myMJArr: [],
    },

    statics: {
        NewCardTag: NewCardTag,
        Config: null,
    },

    // use this for initialization
    onLoad: function () {
        if (cc.fy == null) {
            return;
        }

        this.initView();
        this.initHandler();

    },

    initView: function () {
        this._nodMyHolds = cc.find("game/myself/holds", this.node);
        this._nodUpHolds = cc.find("game/up/holds", this.node);
        this._nodUpPgs = cc.find("game/up/penggangs", this.node);
        // if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.JDMJ) {
        //     this._nodMyHolds.scale = 0.8;
        //     this._nodMyHolds.x = 470;
        //     var cardSetting = JSON.parse(cc.fy.localStorage.getItem('card_setting'));
        //     if (cc.fy.utils.check3D(cardSetting)) {
        //         this._nodUpHolds.y = -18;
        //         this._nodUpPgs.y = -18;
        //     }
        //     else {
        //         this._nodUpHolds.y = 10;
        //         this._nodUpPgs.y = 10;
        //     }
        // }
        // else {
        //     this._nodMyHolds.scale = 0.96;
        //     this._nodMyHolds.x = 568;
        //     this._nodUpHolds.y = -18;
        //     if (cc.fy.isFitWidth == true && cc.fy.utils.check3D(cardSetting)) {
        //         cc.fy.RemoveCard3D = true;
        //         this._nodMyHolds.x += 80;
        //     }
        // }
        var key, nodCard;
        this._MahJongs = cc.find("game/myself/MahJongs", this.node);
        // console.log(this._MahJongs);
        // console.log("nodMyHolds",this._nodMyHolds);
        if (this._MahJongs) {
            for (var i = 0; i < this._MahJongs.children.length; ++i) {
                this._MahJongs.children[i].active = false;
            }
        }

        this._holds = this._nodMyHolds.children;
        for (key in this._nodMyHolds.children) {
            nodCard = this._nodMyHolds.children[key];
            this.initAndCacheProp(nodCard);
            cc.fy.utils.addClickEvent(nodCard, this.node, "Holds", "onMjClicked");
            this.initTouchHandler(nodCard);
        }
    },

    initHandler: function () {
        var self = this,
            game = cc.fy.gameNetMgr,
            initEvent = function (eventName, funName) {
                game.addHandler(eventName, function (data) {
                    if (self[funName]) {
                        self[funName](data);
                    }
                });
            },

            initEvents = function (dictEvent2Fun) {
                var eventName,
                    funName;

                for (eventName in dictEvent2Fun) {
                    funName = dictEvent2Fun[eventName];
                    initEvent(eventName, funName);
                }
            };

        initEvents({
            ["holds_resetothermahjongs"]: "resetOtherMahjongs",
            ["holds_initselfmahjongs"]: "initSelfMahjongs",
            ["holds_initothermahjongs"]: "initOtherMahjongs",
            ["holds_initselfmopai"]: "initSelfMopai",
            ["holds_initothermopai"]: "initOtherMopai",
            ["holds_mjblankclick"]: "onMjBlankClick",
            ["kan_notify"]: "onGameActionNotify", // 操作按钮之后，刷新手牌
            ["dui_notify"]: "onGameActionNotify",
            ["chi_notify"]: "onGameActionNotify",
            ["zatou_notify"]: "onGameActionNotify",
            ["game_refreshallholds"]: "RefreshAllHolds",
            ["game_hideMjBlank"]: "hideMjBlank",
            ["3D2D_Config"]: "hideMahjongShowMark",
            ["game_hidesamefolds"]: "hideSelfMahjongShowMark",
        });
    },

    hideMahjongShowMark() {
        for (var i = 0; i < this._MahJongs.children.length; ++i) {
            this._MahJongs.children[i].active = false;
        }
        var rightHoldsNode = cc.find("game/right/holds", this.node);
        var leftHoldsNode = cc.find("game/left/holds", this.node);
        console.log("====> ", cc.fy.localStorage.getItem('card_setting'));
        var cardSetting = JSON.parse(cc.fy.localStorage.getItem('card_setting'));
        var size = cc.view.getFrameSize();
        var isQMP = size.width / size.height > cc.ScreenRatio;
        if (cc.fy.utils.check3D(cardSetting)) {
            if (cc.sys.isNative && (cc.sys.platform == cc.sys.IPHONE) && isQMP) {
                rightHoldsNode.rotation = -2;
                leftHoldsNode.rotation = 2;
            }
            else {
                rightHoldsNode.rotation = 2;
                leftHoldsNode.rotation = -2;
            }
            if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.JDMJ) {
                this._nodUpHolds.y = -18;
                this._nodUpPgs.y = -18;
            }
            if (cc.fy.isFitWidth == true && !cc.fy.RemoveCard3D && this._nodMyHolds) {
                cc.fy.RemoveCard3D = true;
                this._nodMyHolds.x += 80;
            }
        }
        else {
            rightHoldsNode.rotation = 0;
            leftHoldsNode.rotation = 0;
            if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.JDMJ) {
                this._nodUpHolds.y = 10;
                this._nodUpPgs.y = 10;
            }
            if (cc.fy.isFitWidth == true && cc.fy.RemoveCard3D == true && this._nodMyHolds) {
                cc.fy.RemoveCard3D = false;
                this._nodMyHolds.x -= 80;
            }
        }
    },

    hideSelfMahjongShowMark() {
        let seatData = cc.fy.gameNetMgr.getSelfData();
        if (!seatData || seatData.isbaoting) return;
        // var allHolds = cc.fy.mahjongmgr.newHolds;
        // this._holds = this._nodMyHolds.children;
        // console.log("==>> hideSelfMahjongShowMark --> holds: ", this._holds);
        for (var i = 0; i < this._holds.length; i++) {
            var nodHold = this._holds[i];
            if (cc.fy.mahjongmgr.isBaida(nodHold.mjId)) continue;
            // if(cc.fy.gameNetMgr.fanbaida != null && nodHold.mjId == cc.fy.gameNetMgr.fanbaida && cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.YZDDH) continue;
            // if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.GYPDZ ) { 
            var baoData = cc.fy.gameNetMgr.baoting
            // 趴牌 
            if (baoData != null && baoData[cc.fy.gameNetMgr.seatIndex]) {
                continue;
            }
            // }
            var color = new cc.Color(255, 255, 255);
            cc.fy.mahjongmgr.changeMahjongNodeColor(nodHold, color);
        }
    },

    resetOtherMahjongs: function () {
        console.log("==>> resetOtherMahjongs");
        var sides = ["right", "up", "left"];
        var gameChild = this.node.getChildByName("game");
        for (var i = 0; i < sides.length; ++i) {
            var sideChild = gameChild.getChildByName(sides[i]);
            var holds = sideChild.getChildByName("holds");
            for (var j = 0; j < holds.childrenCount; ++j) {
                var nc = holds.children[j];
                nc.active = true;
            }
        }
    },

    onGameActionNotify: function (data) {
        var data = data;
        var seatData = data.seatData;

        if (seatData.seatindex == cc.fy.gameNetMgr.seatIndex) {
            this.initSelfMahjongs();
        }
        else {
            this.initOtherMahjongs(seatData);
        }
    },

    initSelfMopai: function (data) {
        // var pai = data.pai,
        //     localIndex = cc.fy.gameNetMgr.getLocalIndex(data.seatIndex),
        //     key,
        //     nodCard,
        //     sprite,
        //     index;
        // console.log("initSelfMopai:" + pai);

        // if (localIndex == 0) {
        //     for (key in this._holds) {
        //         nodCard = this._holds[key];
        //         if (nodCard.tag == NewCardTag) {
        //             index = key;
        //             break;
        //         }
        //     }
        //     sprite = nodCard.sprite || nodCard.getComponent(cc.Sprite);
        //     this.setSpriteFrameByMjID("M_", sprite, pai, index);
        //     sprite.node.mjId = pai;
        // }

        // else if (cc.fy.replayMgr.isReplay()) {
        //     this.initOtherMopai({
        //         seatIndex: data.seatIndex,
        //         pai: pai
        //     });
        // }
        this.initSelfMahjongs();
    },

    initOtherMopai: function (data) {
        var seatIndex = data.seatIndex;
        var pai = data.pai;
        var localIndex = cc.fy.gameNetMgr.getLocalIndex(seatIndex);
        var side = cc.fy.mahjongmgr.getSide(localIndex);
        var pre = cc.fy.mahjongmgr.getFoldPre(localIndex);
        var path = "game/" + side + "/holds";
        var mopaiIndex;
        var sprite;
        console.log(" seatIndex ", seatIndex);
        console.log(" localIndex ", localIndex);
        console.log(" side ", side);
        console.log(" path ", path);
        var holds = cc.find(path, this.node);
        var nc = holds.getChildByTag(NewCardTag);

        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.JDMJ) {
            mopaiIndex = 16;
        }
        else {
            mopaiIndex = 13;
        }

        if (nc == null) return;

        nc.scaleX = 1.0;
        nc.scaleY = 1.0;
        console.log("==>> 创建其他家的摸牌: pai: ", pai);
        if (pai == null) {
            // console.log("==>> 创建其他家的摸牌");
            nc.active = false;
        }
        else if (pai >= 0) {
            var cardSetting = JSON.parse(cc.fy.localStorage.getItem('card_setting'));
            if (cc.fy.utils.check3D(cardSetting)) {
                nc.active = true;
                if (side == "up") {
                    nc.y = 38;
                    nc.scale = 0.65;
                    nc.x = -(mopaiIndex % holds.length + 0.5) * 46;
                }
                else if (side == "left") {
                    nc.scale = 0.9;
                    nc.x = - (mopaiIndex % holds.length + 0.5) * 8 + 30;
                    nc.y = - (mopaiIndex % holds.length + 0.5) * 28;
                }
                else if (side == "right") {
                    nc.scale = 0.9;
                    nc.x = - (mopaiIndex % holds.length + 0.5) * 8 + 40;
                    nc.y = (mopaiIndex % holds.length + 0.5) * 28;
                }
                sprite = nc.getComponent(cc.Sprite);
                cc.fy.mahjongmgr.createMahjongNode(pre, pai, sprite.node, null, "fold", mopaiIndex);
            }
            else {
                nc.active = true;
                if (side == "up") {
                    nc.scale = 0.73;
                    nc.x = - (mopaiIndex % holds.childrenCount + 0.5) * 38;
                    nc.y = 0;
                }
                else if (side == "left") {
                    nc.scale = 1;
                    nc.x = -10;
                    nc.y = - (mopaiIndex % holds.childrenCount + 0.5) * 28;
                }
                else if (side == "right") {
                    nc.scale = 1;
                    nc.x = 0;
                    nc.y = (mopaiIndex % holds.childrenCount + 0.5) * 28;
                }
                sprite = nc.getComponent(cc.Sprite);
                cc.fy.mahjongmgr.createMahjongNode(pre, pai, sprite.node, null, "fold", mopaiIndex);
            }
        }
        else if (pai != null) {
            nc.active = true;
            if (side == "up") {
                nc.scaleX = 1.0;
                nc.scaleY = 1.0;
            }
            sprite = nc.getComponent(cc.Sprite);
            cc.fy.mahjongmgr.createBackMahjongNode(side, sprite);
        }

    },

    initSelfMahjongs: function (isEnd) {
        var seats = cc.fy.gameNetMgr.seats;
        var seatData = seats[cc.fy.gameNetMgr.seatIndex];
        var holds = this.sortHolds(seatData);
        if (holds == null || seatData.pengs == null || seatData.angangs == null
            || seatData.diangangs == null || seatData.wangangs == null) {//|| seatData.chipais == null
            return;
        }
        //初始化手牌
        var lackingNum = (seatData.pengs.length + seatData.angangs.length + seatData.diangangs.length + seatData.wangangs.length) * 3;//+ seatData.chipais.length;
        var gameChild = this.node.getChildByName("game");
        var myselfChild = gameChild.getChildByName("myself");
        // var myholds = myselfChild.getChildByName("holds");
        for (var i = 0; i < holds.length; ++i) {
            var mjid = holds[i];
            var sprite = this._myMJArr[i + lackingNum];
            sprite.node.mjId = mjid;
            sprite.node.y = 0;
            this.setSpriteFrameByMJID("M_", sprite, mjid);
        }

        for (var i = 0; i < lackingNum; ++i) {
            var sprite = this._myMJArr[i];
            sprite.node.mjId = null;
            sprite.spriteFrame = null;
            sprite.node.active = false;
        }
        for (var i = lackingNum + holds.length; i < this._myMJArr.length; ++i) {
            var sprite = this._myMJArr[i];
            sprite.node.mjId = null;
            sprite.spriteFrame = null;
            sprite.node.active = false;
        }

        if (seatData.tingState == 1) {
            for (var i = 0; i < this._myMJArr.length; ++i) {
                var sprite = this._myMJArr[i];
                sprite.node.color = new cc.Color(200, 200, 200);
                var button = sprite.node.getComponent(cc.Button);
                if (button) {
                    button.interactable = false;
                }
            }

            for (var j = lackingNum; j < this._myMJArr.length; ++j) {
                for (var k = 0; k < seatData.jiating.length; ++k) {
                    var sprMJ = this._myMJArr[j];
                    if (sprMJ.node.mjId == seatData.jiating[k]) {
                        sprMJ.node.color = new cc.Color(255, 255, 255);
                        var button = sprMJ.node.getComponent(cc.Button);
                        if (button) {
                            button.interactable = true;
                        }
                        continue;
                    }
                }
            }
        }
        else if (seatData.tingState == 2) {
            for (var i = 0; i < this._myMJArr.length; ++i) {
                var sprite = this._myMJArr[i];
                sprite.node.color = new cc.Color(155, 155, 155);
                var button = sprite.node.getComponent(cc.Button);
                if (button) {
                    button.interactable = false;
                }
            }
        }
        else {
            for (var i = 0; i < this._myMJArr.length; ++i) {
                var sprite = this._myMJArr[i];
                sprite.node.color = new cc.Color(255, 255, 255);
                var button = sprite.node.getComponent(cc.Button);
                if (button) {
                    button.interactable = true;
                }
            }
        }

        this._selectedMJ = null;
        this._clickedMJ = null;
        if (this._touchMJ != null) {
            this._touchMJ.removeFromParent();
            this._touchMJ = null;
        }
        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.HZEMJ) {
            for (var i = 0; i < this._myMJArr.length; ++i) {
                var sprite = this._myMJArr[i];
                sprite.node.color = new cc.Color(200, 200, 200);
                var button = sprite.node.getComponent(cc.Button);
                if (button) {
                    button.interactable = false;
                }
            }

            for (var j = lackingNum; j < this._myMJArr.length; ++j) {
                var sprMJ = this._myMJArr[j];
                if (sprMJ.node.mjId != 43) {
                    sprMJ.node.color = new cc.Color(255, 255, 255);
                    var button = sprMJ.node.getComponent(cc.Button);
                    if (button) {
                        button.interactable = true;
                    }
                    continue;
                }
            }
            for (var j = lackingNum; j < this._myMJArr.length; ++j) {
                var sprMJ = this._myMJArr[j];
                if (sprMJ.node.mjId == 43) {
                    var button = sprMJ.node.getComponent(cc.Button);
                    if (button) {
                        button.enableAutoGrayEffect = false;
                        button.interactable = false;
                        button.disabledColor = new cc.Color(155, 155, 155);
                    }
                }
            }
        }
        // cc.fy.gameNetMgr.dispatchEvent("initmahjongs");.
        if (isEnd != true) {
            cc.fy.gameNetMgr.dispatchEvent("initmahjongs");
        }
    },

    sortHolds: function (seatData) {
        var holds = seatData.holds;
        if (holds == null) {
            return null;
        }
        //如果手上的牌的数目是2,5,8,11,14，表示最后一张牌是刚摸到的牌
        var mopai = null;
        var l = holds.length
        if (l == 2 || l == 5 || l == 8 || l == 11 || l == 14) {
            mopai = holds.pop();
        }

        // if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZCT) {
        //     cc.fy.mahjongmgr.sortBaiDaMJ(holds);
        // }
        // else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.HZEMJ) {
        //     cc.fy.mahjongmgr.sortHZMJ(holds);
        // }
        // else {
        cc.fy.mahjongmgr.sortSZMJ(holds);
        // }

        //将摸牌添加到最后
        if (mopai != null) {
            holds.push(mopai);
        }
        // this.showKuangArr();
        return holds;
    },

    initOtherMahjongs: function (data, si) {
        console.log("initother Mahjongs");
        var seatData = data;
        var localIndex = cc.fy.gameNetMgr.getLocalIndex(seatData.seatindex);
        if (si != null) {
            localIndex = cc.fy.gameNetMgr.getLocalIndex(si);
        }
        // console.log("==>> localIndex: ", localIndex);
        var side = cc.fy.mahjongmgr.getSide(localIndex),
            sideHolds = cc.find("game/" + side + "/holds", this.node),
            num,
            i,
            idx,
            pre,
            holds,
            snode,
            sprite;
        if (localIndex == 0) {
            return;
        }

        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.JDMJ) {
            sideHolds.scale = 0.8;
        }
        else {
            sideHolds.scale = 0.90;
        }

        num = this.getLackingNum(seatData);
        for (i = 0; i < num; ++i) {
            idx = i;
            if (sideHolds.getChildByName("mj" + idx)) {
                sideHolds.getChildByName("mj" + idx).active = false;
            }
        }
        pre = cc.fy.mahjongmgr.getFoldPre(localIndex);
        holds = cc.fy.mahjongmgr.sortHolds(seatData);
        console.log("==>> 排序后的holds： ", holds);
        if (holds != null && holds.length > 0) {
            for (i = 0; i < holds.length; ++i) {
                idx = i + num;
                if (idx < 0 || idx > sideHolds.children.length - 1) {
                    break;
                }
                var cardSetting = JSON.parse(cc.fy.localStorage.getItem('card_setting'));
                if (cc.fy.utils.check3D(cardSetting)) {
                    snode = sideHolds.getChildByName("mj" + idx);
                    sprite = sideHolds.getChildByName("mj" + idx).getComponent(cc.Sprite);
                    if (side == "up") {
                        snode.y = 38;
                        snode.x = - idx % sideHolds.childrenCount * 40;
                        snode.scale = 0.65;
                        if (i < 4) {
                            snode.zIndex = i;
                        }
                        else {
                            snode.zIndex = -i;
                        }
                    }
                    else if (side == "left") {
                        snode.scale = 0.9;
                        snode.x = - idx % sideHolds.childrenCount * 7.4 + 30;
                        snode.y = - idx % sideHolds.childrenCount * 25 + 30;

                    }
                    else if (side == "right") {
                        snode.scale = 0.9;
                        snode.x = - idx % sideHolds.childrenCount * 7.4 + 40;
                        snode.y = idx % sideHolds.childrenCount * 25;
                    }
                }
                else {
                    snode = sideHolds.getChildByName("mj" + idx);
                    sprite = sideHolds.getChildByName("mj" + idx).getComponent(cc.Sprite);
                    if (side == "up") {
                        snode.scale = 0.73;
                        snode.y = 0;
                        snode.x = - idx % sideHolds.childrenCount * 38;
                    }
                    else if (side == "left") {
                        snode.scale = 1;
                        snode.x = -10;
                        snode.y = - idx % sideHolds.childrenCount * 28 + 20;
                    }
                    else if (side == "right") {
                        snode.scale = 1;
                        snode.x = 0;
                        snode.y = idx % sideHolds.childrenCount * 28;
                    }
                }

                snode.active = true;
                console.log("==>> i: ", i);
                cc.fy.mahjongmgr.createMahjongNode(pre, holds[i], snode, null, "fold", i);

                if (cc.fy.mahjongmgr.isBaida(holds[i])) {
                    var mark = snode.getChildByName("baidaMark");
                    if (mark != null) {
                        mark.active = true;
                        mark.scaleX = 0.8
                        mark.scaleY = 0.8
                    }
                    else {
                        this.loadMark(snode, side);
                    }

                }
                else {
                    var mark = sideHolds.getChildByName("mj" + idx).getChildByName("baidaMark");
                    if (mark != null) {
                        mark.active = false;
                    }
                }
                if (idx == 13) {
                    var tmpData = {
                        seatIndex: seatData.seatindex,
                        pai: holds[i],
                    }
                    this.initOtherMopai(tmpData);
                }
            }

            if (holds.length + num == sideHolds.children.length - 1) {
                sideHolds.getChildByTag(NewCardTag).active = false;
            }
        }

        // cc.fy.gameNetMgr.dispatchEvent("initothermahjongs",seatData);
    },

    // initOtherMahjongs: function (data) {
    //     console.log("initother Mahjongs");
    //     var seatData = data,
    //         localIndex = cc.fy.gameNetMgr.getLocalIndex(seatData.seatindex),
    //         side = cc.fy.mahjongmgr.getSide(localIndex),
    //         sideHolds = cc.find("game/" + side + "/holds", this.node),
    //         num,
    //         i,
    //         idx,
    //         pre,
    //         holds,
    //         snode,
    //         sprite;
    //     if (localIndex == 0) {
    //         return;
    //     }

    //     if(cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.JDMJ){
    //         sideHolds.scale = 0.8;
    //     }
    //     else{
    //         sideHolds.scale = 0.90;
    //     }

    //     num = this.getLackingNum(seatData);
    //     for (i = 0; i < num; ++i) {
    //         idx = i;
    //         if (sideHolds.getChildByName("mj"+idx)) {
    //             sideHolds.getChildByName("mj"+idx).active = false;
    //         }
    //     }
    //     pre = cc.fy.mahjongmgr.getFoldPre(localIndex);
    //     holds = cc.fy.mahjongmgr.sortHolds(seatData);
    //     console.log("==>> 排序后的holds： ", holds);
    //     if (holds != null && holds.length > 0) {
    //         for (i = 0; i < holds.length; ++i) {
    //             idx = i + num;
    //             if (idx < 0 || idx > sideHolds.children.length - 1) {
    //                 break;
    //             }
    //             var cardSetting = JSON.parse(cc.fy.localStorage.getItem('card_setting'));
    //             if(cc.fy.utils.check3D(cardSetting)){
    //                 snode = sideHolds.getChildByName("mj" + idx);
    //                 sprite = sideHolds.getChildByName("mj" + idx).getComponent(cc.Sprite);
    //                 if(side == "up"){
    //                     snode.y = 38;
    //                     snode.x = - idx % holds.length * 46;
    //                     snode.scale = 0.65;
    //                     if(i < 4){
    //                         snode.zIndex = i;
    //                     }
    //                     else{
    //                         snode.zIndex = -i;
    //                     }
    //                 }
    //                 else if(side == "left"){
    //                     snode.scale = 0.9;
    //                     snode.x = - idx % holds.length * 8 + 30;
    //                     snode.y = - idx % holds.length * 28;

    //                 }
    //                 else if(side == "right"){
    //                     snode.scale = 0.9;
    //                     snode.x = - idx % holds.length * 8 + 40;
    //                     snode.y = idx % holds.length * 28;
    //                 }
    //             }
    //             else{
    //                 snode = sideHolds.getChildByName("mj"+idx);
    //                 sprite = sideHolds.getChildByName("mj"+idx).getComponent(cc.Sprite);
    //                 if(side == "up"){
    //                     snode.scale = 0.73;
    //                     snode.y = 0;
    //                     snode.x = - idx % sideHolds.childrenCount * 38;
    //                 }
    //                 else if(side == "left"){
    //                     snode.scale = 1;
    //                     snode.x = -10;
    //                     snode.y = - idx % sideHolds.childrenCount * 28;
    //                 }
    //                 else if(side == "right"){
    //                     snode.scale = 1;
    //                     snode.x = 0;
    //                     snode.y = idx % sideHolds.childrenCount * 28;
    //                 }
    //             }

    //             snode.active = true;
    //             cc.fy.mahjongmgr.createMahjongNode(pre, holds[i], snode, null, "fold", i);

    //             if(cc.fy.mahjongmgr.isBaida(holds[i])){
    //                 var mark = snode.getChildByName("baidaMark");
    //                 if(mark != null){
    //                     mark.active = true;
    //                 }
    //                 else{
    //                     this.loadMark(snode, side);
    //                 }

    //             }
    //             else{
    //                 var mark = sideHolds.getChildByName("mj"+idx).getChildByName("baidaMark");
    //                 if(mark != null){
    //                     mark.active = false;
    //                 }
    //             }
    //         }

    //         if(holds.length + num == sideHolds.children.length - 1){
    //             sideHolds.getChildByTag(NewCardTag).active = false;
    //         }
    //     }

    //     // cc.fy.gameNetMgr.dispatchEvent("initothermahjongs",seatData);
    // },

    playCard: function (mjId) {
        if (mjId == null) {
            return;
        }
        if (cc.fy.gameNetMgr.turn != cc.fy.gameNetMgr.seatIndex || cc.fy.gameNetMgr.isClickChupai || cc.fy.gameNetMgr.limitOutCard) {
            return;
        }

        console.log("send chupai = " + mjId + " isClickChupai = " + cc.fy.gameNetMgr.isClickChupai);
        if (cc.fy.gameNetMgr.isClickChupai == false) {
            cc.fy.gameNetMgr.dispatchEvent("game_hidesamefolds");
            cc.fy.net.send('chupai', mjId);
            cc.fy.gameNetMgr.isClickChupai = true;
            cc.fy.gameNetMgr.dispatchEvent("game_ai_chupai", mjId);
        }
    },

    // setSpriteFrameByMjID: function (pre, sprite, mjid, index) {
    //     cc.fy.mahjongmgr.createMahjongNode(pre, mjid, sprite.node, null, "fold", index);
    //     sprite.node.active = true;
    //     sprite.node.color = new cc.Color(255, 255, 255);
    // },

    setSpriteFrameByMJID: function (pre, sprite, mjid) {
        sprite.spriteFrame = cc.fy.mahjongmgr.getSpriteFrameByMJID(pre, mjid);
        sprite.node.active = true;
    },

    loadMark: function (snode, side) {
        cc.fy.resMgr.loadRes("prefabs/mjgame/baidaMark", function (prefab) {
            if (prefab == null) {
                return;
            }
            var mark = cc.instantiate(prefab);
            snode.addChild(mark);
            if (side == "up") {
                mark.x = -13;
                mark.y = 25;
                mark.setScale(0.6);
                mark.rotation = 0;
            }
            else if (side == "left") {
                mark.x = 13;
                mark.y = 10;
                mark.setScale(0.4);
                mark.rotation = 90;
            }
            else if (side == "right") {
                mark.x = -14;
                mark.y = -4;
                mark.setScale(0.4);
                mark.rotation = 270;
            }

        });
    },
    initAndCacheProp: function (nodCard) {
        var sprite = nodCard.getComponent(cc.Sprite),
            button = nodCard.getComponent(cc.Button);

        nodCard.button = button;
        nodCard.sprite = sprite;
        nodCard.originPosition = nodCard.getPosition();

        sprite.spriteFrame = null;
    },

    initTouchHandler: function (nodCard) {
        var self = this;
        nodCard.on(cc.Node.EventType.TOUCH_START, function (event) {
            self.onMjTouch(event);
        });

        nodCard.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            self.onMjTouchMove(event);
        });

        nodCard.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            self.onMjTouchCancel(event);
        });
    },

    onMjClicked: function (event) {
        var key,
            nodCard,
            btn,
            touchPos,
            touchPos2Self;
        console.log("onMjClicked");

        // if (this.checkCanDealClick(event) == false) {
        //     return;
        // }
        if (cc.fy.replayMgr.isReplay()) {
            return;
        }
        // this._MahJongs.active = true;
        // var userid = cc.fy.userMgr.userId;
        // var index = cc.fy.gameNetMgr.getSeatIndexByID(userid);
        // var localIndex = cc.fy.gameNetMgr.getLocalIndex(index);
        //    console.log(this._MahJongs.children);
        //    for(var i= 0;i<this._MahJongs.children.length;++i){
        //        if(i == localIndex){
        // this._MahJongs.children[i].active = true;
        //        }
        //    }
        // cc.fy.mahjongmgr.createMahjongNode("M_", event.target.mjId, this._MahJongs.children[localIndex]);
        if (this._lastevent != null && this._lastevent != event.target) {
            console.log("!= _lastevent");
            let sameMark = event.target.getChildByName("sameMark");
            sameMark.active = false;
            cc.fy.gameNetMgr.dispatchEvent("game_hidesamefolds");
        }
        // if(this._lastevent != null && this._lastevent == event.target && this.checkCanDealClick(event) == false){
        //     console.log("!= checkCanDealClick");
        //     return;
        // }

        this._lastevent = event.target;

        for (key in this._holds) {
            nodCard = this._holds[key];
            if (event.target == nodCard) {

                if (this._touchMj != null) {
                    this._touchMj.removeFromParent();
                    this._touchMj = null;
                }

                btn = nodCard.button || nodCard.getComponent(cc.Button);
                if (btn && btn.interactable == false) {
                    return;
                }
                if (this._clickedMj != null && this._clickedMj == event.target) {
                    // if (this.checkCanDealClick(event) == false) {
                    //     return;
                    // }
                    touchPos = event.getLocation();
                    touchPos2Self = event.target.convertToNodeSpaceAR(touchPos);
                    this.playCard(this._clickedMj.mjId);
                    this._clickedMj = null;
                    this._selectedMj = null;
                    if (this.checkCanDealClick(event) == true) {
                        cc.fy.gameNetMgr.dispatchEvent("game_hidesamefolds");
                    }
                    return;
                }
                else {
                    this._clickedMj = event.target;
                }

                if (event.target.y == event.target.originPosition.y) {
                    event.target.y += 18;
                    cc.fy.audioMgr.playSFX("cardselect.mp3");
                }
                cc.fy.gameNetMgr.dispatchEvent("game_showsamefolds", { "pai": event.target.mjId, "target": event.target });
            } else {
                nodCard.y = nodCard.originPosition.y;

                let sameMark = nodCard.getChildByName("sameMark");
                sameMark.active = false;
            }
        }
    },

    onMjTouch: function (event) {
        var key,
            nodCard,
            btn,
            touchPos,
            localTouchPos;

        console.log('  onMjTouch');

        if (cc.fy.replayMgr.isReplay()) {
            return;
        }
        // this._MahJongs.active = true;
        // var userid = cc.fy.userMgr.userId;
        // var index = cc.fy.gameNetMgr.getSeatIndexByID(userid);
        // var localIndex = cc.fy.gameNetMgr.getLocalIndex(index);
        //    console.log(this._MahJongs.children);
        //    for(var i= 0;i<this._MahJongs.children.length;++i){
        //        if(i == localIndex){
        // this._MahJongs.children[i].active = true;
        //    }
        //    }
        //    cc.fy.mahjongmgr.createMahjongNode("M_", event.target.mjId, this._MahJongs.children[localIndex]);

        if (this.checkCanDealTouch(event) == false) {
            return;
        }

        for (key in this._holds) {
            nodCard = this._holds[key];

            var sameMark = nodCard.getChildByName("sameMark");
            sameMark.active = false;

            if (event.target == nodCard) {
                btn = nodCard.button || nodCard.getComponent(cc.Button);
                if (btn && btn.interactable == false) {
                    return;
                }

                touchPos = event.getLocation();
                localTouchPos = event.target.parent.convertToNodeSpaceAR(touchPos);
                this._touchOffset = cc.v2(localTouchPos.x - event.target.x, localTouchPos.y - event.target.y);
                this._touchStart = event.target.convertToNodeSpaceAR(touchPos);
                this._selectedMj = nodCard;
                cc.fy.gameNetMgr.dispatchEvent("game_showsamefolds", { "pai": event.target.mjId, "target": event.target });
            } else {
                nodCard.y = nodCard.originPosition.y;
            }
        }
    },

    onMjTouchMove: function (event) {
        var key,
            nodCard,
            btn,
            touchPos,
            touchPos2Self,
            touchPos2Canvas;
        console.log('  onMjTouchMove');

        if (cc.fy.replayMgr.isReplay()) {
            return;
        }
        // this._MahJongs.active = true;
        // var userid = cc.fy.userMgr.userId;
        // var index = cc.fy.gameNetMgr.getSeatIndexByID(userid);
        // var localIndex = cc.fy.gameNetMgr.getLocalIndex(index);
        //    for(var i= 0;i<this._MahJongs.children.length;++i){
        //        if(i == localIndex){
        // this._MahJongs.children[i].active = true;
        //    }
        //    }
        //    cc.fy.mahjongmgr.createMahjongNode("M_", event.target.mjId, this._MahJongs.children[localIndex]);

        if (this.checkCanDealTouch(event) == false) {
            return;
        }

        for (key in this._holds) {
            nodCard = this._holds[key];

            if (event.target == nodCard) {
                btn = nodCard.button || nodCard.getComponent(cc.Button);
                if (btn && btn.interactable == false) {
                    return;
                }

                touchPos = event.getLocation();
                touchPos2Canvas = this.node.convertToNodeSpaceAR(touchPos);
                touchPos2Self = event.target.convertToNodeSpaceAR(touchPos);
                if (this._touchStart && (Math.abs(this._touchStart.y - touchPos2Self.y) > 5 || Math.abs(this._touchStart.x - touchPos2Self.x)) > 5) {
                    // if (this._touchMj == null) {
                    //     this._touchMj = cc.instantiate(event.target);
                    //     this.node.addChild(this._touchMj);
                    //     this._touchMj.opacity = 100;
                    // }

                    if (this._touchMj != null) {
                        this._touchMj.x = touchPos2Canvas.x - this._touchOffset.x;
                        this._touchMj.y = touchPos2Canvas.y - this._touchOffset.y;
                    }
                }

                return;
            }
        }
    },

    onMjTouchCancel: function (event) {
        var key,
            nodCard,
            btn,
            touchPos,
            touchPos2Self;
        console.log("onMjTouchCancel");

        if (this.checkCanDealTouch(event) == false) {
            return;
        }

        for (key in this._holds) {
            nodCard = this._holds[key];

            if (event.target == nodCard) {

                if (this._touchMj != null) {
                    this._touchMj.removeFromParent();
                    this._touchMj = null;
                }

                btn = nodCard.button || nodCard.getComponent(cc.Button);
                if (btn && btn.interactable == false) {
                    return;
                }

                touchPos = event.getLocation();
                touchPos2Self = event.target.convertToNodeSpaceAR(touchPos);
                if (event.target == this._selectedMj) {
                    if (touchPos2Self.y - this._touchStart.y < -60) {
                        this._selectedMj.y = this._selectedMj.originPosition.y;
                        this._selectedMj = null;
                        this._clickedMj = null;
                        cc.fy.gameNetMgr.dispatchEvent("game_hidesamefolds");
                    } else {
                        this.playCard(this._selectedMj.mjId);
                        this._selectedMj = null;
                        this._clickedMj = null;
                        cc.fy.gameNetMgr.dispatchEvent("game_hidesamefolds");
                    }
                }
                return;
            }
        }
    },

    onMjBlankClick: function (data) {
        var i,
            event = data;
        console.log("onMjBlankClick");

        if (event.target.name == "selfmjblank" && this._clickedMj != null &&
            event.target.parent == this._clickedMj && this._clickedMj.y != this._clickedMj.originPosition.y) {
            this.playCard(this._clickedMj.mjId);
        } else {
            for (i = 0; i < this._holds.length; ++i) {
                this._holds[i].y = this._holds[i].originPosition.y;
                let sameMark = this._holds[i].getChildByName("sameMark");
                sameMark.active = false;
            }
        }
        cc.fy.gameNetMgr.dispatchEvent("game_hidesamefolds");
        this._lastevent = null;
        this._selectedMj = null;
        this._clickedMj = null;
    },

    hideMjBlank: function () {
        for (var i = 0; i < this._holds.length; ++i) {
            this._holds[i].y = this._holds[i].originPosition.y;
            let sameMark = this._holds[i].getChildByName("sameMark");
            sameMark.active = false;
        }
        cc.fy.gameNetMgr.dispatchEvent("game_hidesamefolds");
        this._selectedMj = null;
        this._clickedMj = null;
        this._lastevent = null;
    },

    checkCanDealTouch: function (event) {
        if (cc.fy.replayMgr.isReplay()) {
            return false;
        }

        if (cc.fy.gameNetMgr.turn != cc.fy.gameNetMgr.seatIndex || cc.fy.gameNetMgr.isClickChupai || cc.fy.gameNetMgr.limitOutCard) {
            if (this._selectedMj != null && event.target == this._selectedMj) {
                this._selectedMj.y = this._selectedMj.originPosition.y;
                this._selectedMj = null;
            }
            return false;
        }

        return true;
    },

    checkCanDealClick: function (event) {
        if (cc.fy.replayMgr.isReplay()) {
            return false;
        }

        if (cc.fy.gameNetMgr.turn != cc.fy.gameNetMgr.seatIndex || cc.fy.gameNetMgr.isClickChupai || cc.fy.gameNetMgr.limitOutCard) {
            if (this._clickedMj != null && event.target == this._clickedMj) {
                this._clickedMj.y = this._clickedMj.originPosition.y;
                this._clickedMj = null;
            }
            return false;
        }

        return true;
    },

    getLackingNum: function (seatData) {
        var getLength = function (arr) {
            return arr ? arr.length : 0;
        };

        var num = getLength(seatData.pengs) + getLength(seatData.angangs) + getLength(seatData.diangangs) + getLength(seatData.wangangs) +
            getLength(seatData.chis) + getLength(seatData.kans) + getLength(seatData.duis);
        num = num * 3;
        return num;
    },

    RefreshAllHolds: function () {
        this.initSelfMahjongs(true);
        var seats = cc.fy.gameNetMgr.seats;
        for (var i in seats) {
            var seatData = seats[i];
            var localIndex = cc.fy.gameNetMgr.getLocalIndex(i);
            if (localIndex != 0) {
                console.log("initOtherMahjongs 2");
                this.initOtherMahjongs(seatData);
            }
        }
    },
});