cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        _startPo: null,
        num: 1,
        _gamePlayer: 3,
        _showType: 0,
    },

    // use this for initialization
    onLoad: function () {
        if (!cc.fy) {
            return;
        }

        if (cc.fy.gameNetMgr.seats == null) {
            cc.fy.alert.show("该房间已解散", function () {
                cc.fy.sceneMgr.loadScene("hall");
            });
            console.log("cc.fy.gameNetMgr.seats is null");
            return;
        }
        // this._gamePlayer = cc.fy.gameNetMgr.conf.maxCntOfPlayers;
        this._gamePlayer = cc.fy.gameNetMgr.conf.maxCntOfPlayers ? cc.fy.gameNetMgr.conf.maxCntOfPlayers : cc.fy.gameNetMgr.seats.length;
        if (cc.fy.replayMgr.isReplay()) {
            this._gamePlayer = cc.fy.gameNetMgr.seats.length;
        }
        var gameChild = this.node.getChildByName("game");
        var myself = gameChild.getChildByName("myself");
        var pengangroot = myself.getChildByName("penggangs");
        // var realwidth = cc.director.getVisibleSize().width;
        // var scale = realwidth / 1280;
        // pengangroot.scaleX *= scale;
        // pengangroot.scaleY *= scale;

        var self = this;
        var game = cc.fy.gameNetMgr;

        // 点击碰杠显示形式按钮
        game.addHandler('changShowType', function (data) {
            self._showType = data.showType;
            if (self._showType == null) self._showType = 0;
            var seats = cc.fy.gameNetMgr.seats;
            if (seats) {
                for (var i = 0; i < seats.length; i++) {
                    self.onPengGangChanged(seats[i]);
                }
            }
        });
        game.addHandler('peng_notify', function (data) {
            //刷新所有的牌 
            var seatData = data.seatData;
            self.onPengGangChanged(seatData);
        });

        game.addHandler('gang_notify', function (data) {
            //刷新所有的牌
            //console.log(data);
            var data = data.seatData;
            self.onPengGangChanged(data);
        });
        game.addHandler('kan_notify', function (data) {
            //刷新所有的牌
            //console.log(data);
            var data = data;
            self.onPengGangChanged(data.seatData);
        });
        game.addHandler('dui_notify', function (data) {
            //刷新所有的牌
            //console.log(data);
            var data = data;
            self.onPengGangChanged(data.seatData);
        });
        game.addHandler('chi_notify', function (data) {
            var data = data;
            self.onPengGangChanged(data);
        });

        game.addHandler('zatou_notify', function (data) {
            //刷新所有的牌
            //console.log(data);
            var data = data;
            self.onPengGangChanged(data.seatData);
        });

        game.addHandler('game_start', function (data) {
            self.onGameBein();
        });

        game.addHandler('game_begin', function (data) {
            self.onGameBein();
        });

        // game.addHandler('3D2D_Config', function (data) {
        //     self.onGameBein();
        // });

        // game.addHandler('game_refreshallholds',function(data){
        //     var seats = cc.fy.gameNetMgr.seats;
        //     if(seats){
        //         for(var i=0;i<seats.length;i++){
        //             self.onPengGangChanged(seats[i]);
        //         }
        //     }
        // });

        var seats = cc.fy.gameNetMgr.seats;
        for (var i in seats) {
            this.onPengGangChanged(seats[i]);
        }
    },

    onGameBein: function () {
        this.hideSide("myself");
        this.hideSide("right");
        this.hideSide("up");
        this.hideSide("left");

        var seats = cc.fy.gameNetMgr.seats;
        if (seats) {
            for (var i = 0; i < seats.length; i++) {
                this.onPengGangChanged(seats[i]);
            }
        }
    },

    hideSide: function (side) {
        var gameChild = this.node.getChildByName("game");
        var myself = gameChild.getChildByName(side);
        var pengangroot = myself.getChildByName("penggangs");
        if (pengangroot) {
            for (var i = 0; i < pengangroot.childrenCount; ++i) {
                pengangroot.children[i].active = false;
            }
        }
    },

    onPengGangChanged: function (seatData) {
        if (seatData.angangs == null && seatData.diangangs == null && seatData.wangangs == null
            && seatData.pengs == null) {//&& seatData.chipais == null) {
            return;
        }
        var localIndex = cc.fy.gameNetMgr.getLocalIndex(seatData.seatindex);
        var side = cc.fy.mahjongmgr.getSide(localIndex);
        var pre = cc.fy.mahjongmgr.getFoldPre(localIndex);
        console.log("onPengGangChanged" + localIndex);
        var gameChild = this.node.getChildByName("game");
        var myself = gameChild.getChildByName(side);
        var pengangroot = myself.getChildByName("penggangs");

        for (var i = 0; i < pengangroot.childrenCount; ++i) {
            pengangroot.children[i].active = false;
        }

        //初始化杠牌
        var index = 0;
        var gangs = seatData.angangs;
        for (var i = 0; i < gangs.length; ++i) {
            var mjid = gangs[i];
            if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZWJ) {
                mjid = mjid[0];
            }
            this.initPengAndGangs(pengangroot, side, pre, index, mjid, "angang");
            index++;
        }

        var gangs = seatData.diangangs;
        for (var i = 0; i < gangs.length; ++i) {
            var mjid = gangs[i];

            var bguseridx = -1;
            if (seatData.bdguserid.length > 0) {
                bguseridx = seatData.bdguserid[i];
                if (bguseridx > 4) {
                    bguseridx = cc.fy.gameNetMgr.getSeatIndexByID(bguseridx);
                }
            }
            if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZWJ) {
                [mjid, bguseridx] = mjid;
            }
            bguseridx = cc.fy.gameNetMgr.getLocalIndex(bguseridx);
            this.initPengAndGangs(pengangroot, side, pre, index, mjid, "diangang", bguseridx);
            index++;
        }
        var gangs = seatData.wangangs;
        for (var i = 0; i < gangs.length; ++i) {
            var mjid = gangs[i];
            var bguseridx = -1;
            if (seatData.bwguserid.length > 0) {
                bguseridx = seatData.bwguserid[i];
                if (bguseridx > 4) {
                    bguseridx = cc.fy.gameNetMgr.getSeatIndexByID(bguseridx);
                }
            }
            if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZWJ) {
                [mjid, bguseridx] = mjid;
            }
            bguseridx = cc.fy.gameNetMgr.getLocalIndex(bguseridx);
            this.initPengAndGangs(pengangroot, side, pre, index, mjid, "wangang", bguseridx);
            index++;
        }

        //初始化碰牌
        var pengs = seatData.pengs;
        if (pengs) {
            for (var i = 0; i < pengs.length; ++i) {
                var mjid = pengs[i];
                var bpuseridx = seatData.psign[i];
                if (bpuseridx > 4) {
                    bpuseridx = cc.fy.gameNetMgr.getSeatIndexByID(bpuseridx);
                }
                if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.SZWJ) {
                    [mjid, bpuseridx] = mjid;
                }
                bpuseridx = cc.fy.gameNetMgr.getLocalIndex(bpuseridx);
                this.initPengAndGangs(pengangroot, side, pre, index, mjid, "peng", bpuseridx);
                index++;
            }
        }

        var chipais = seatData.chipais;
        if (chipais) {
            for (var i = 0; i < chipais.length; i += 3) {
                var mjid = chipais[i];
                this.initPengAndGangs(pengangroot, side, pre, index, mjid, "chi");
                index++;
            }
        }
    },


    initPengAndGangs: function (pengangroot, side, pre, index, mjid, flag, bpuseridx) {
        console.log("initPengAndGangs", side, pre, index, mjid, flag, bpuseridx);
        var pgroot = null;
        if (pengangroot.childrenCount <= index) {
            if (side == "left" || side == "right") {
                pgroot = cc.instantiate(cc.fy.mahjongmgr.pengPrefabLeft);
            }
            else {
                pgroot = cc.instantiate(cc.fy.mahjongmgr.pengPrefabSelf);
            }

            pengangroot.addChild(pgroot);
        }
        else {
            pgroot = pengangroot.children[index];
            pgroot.active = true;
        }
        if (side == "left") {
            pgroot.y = -(index * 35 * 3);
        } else if (side == "right") {
            pgroot.y = (index * 35 * 3);
            pgroot.setLocalZOrder(-index);
        } else if (side == "myself") {
            pgroot.x = index * 60 * 3 + index * 30;
        }
        else {
            pgroot.x = -(index * 60 * 3) - index * 18;
        }
        var sprites = [];
        for (var i = 0; i < 4; ++i) {
            var spr = pgroot.getChildByName("item_" + i).getComponent(cc.Sprite);
            if (spr) sprites.push(spr);
        }

        if (flag == "chi") {
            var _mjid = mjid;

            for (var s = 0; s < sprites.length; ++s) {
                var sprite = sprites[s];
                if (sprite.node.name == "item_3") {
                    sprite.node.active = false;
                }
                else {
                    sprite.node.scaleX = 1.0;
                    sprite.node.scaleY = 1.0;
                    sprite.spriteFrame = cc.fy.mahjongmgr.getSpriteFrameByMJID(pre, _mjid);
                    _mjid++;
                }
            }
        }
        else {
            var arr = pgroot.getChildByName("arr");
            if (arr) arr.active = false;
            for (var s = 0; s < sprites.length; ++s) {
                var sprite = sprites[s];
                sprite.node.scaleX = 1.0;
                sprite.node.scaleY = 1.0;
                if (sprite.node.name == "item_3") {
                    var isGang = (flag != "peng");
                    sprite.node.active = isGang;
                    if (flag == "angang") {
                        sprite.spriteFrame = cc.fy.mahjongmgr.getEmptySpriteFrame(side);
                        if (side == "myself" || side == "up") {
                            sprite.node.scaleX = 1.0;//1.5;
                            sprite.node.scaleY = 1.0;//1.5;
                        }
                        if (side == "myself" || side == "up" || side == "left" || side == "right") {
                            if (sprite.node.name == "item_3") {
                                sprite.spriteFrame = cc.fy.mahjongmgr.getSpriteFrameByMJID(pre, mjid);
                                sprite.node.scaleX = 1.0;
                                sprite.node.scaleY = 1.0;
                            }
                        }
                    } else {
                        sprite.spriteFrame = cc.fy.mahjongmgr.getSpriteFrameByMJID(pre, mjid);
                    }
                } else {
                    if (flag == "angang") {
                        sprite.spriteFrame = cc.fy.mahjongmgr.getEmptySpriteFrame(side);
                        if (side == "myself" || side == "up") {
                            sprite.node.scaleX = 1.0;//1.5;
                            sprite.node.scaleY = 1.0;//1.5;
                        }
                    } else {
                        sprite.spriteFrame = cc.fy.mahjongmgr.getSpriteFrameByMJID(pre, mjid);

                    }
                }
                if (cc.fy.gameNetMgr.conf.type != cc.GAMETYPE.ERMJ && this._gamePlayer != 2 && this._showType == 0) {
                    if (flag != "peng") {
                        if (flag != "angang") {
                            this.showGangPaiType(side, s, bpuseridx, sprite, flag, cc.fy.gameNetMgr.seats.length);
                        }
                    }
                    else {
                        this.showPengPaiType(side, s, bpuseridx, sprite, cc.fy.gameNetMgr.seats.length);
                    }
                }
            }
            if (cc.fy.gameNetMgr.conf.type != cc.GAMETYPE.ERMJ && this._gamePlayer != 2 && this._showType == 1) {
                this.setArrDir(side, pgroot, bpuseridx, flag, cc.fy.gameNetMgr.seats.length);
            }
        }
    },
    showGangPaiType: function (side, s, bguseridx, sprite, flag, playerNum) {
        if (side == "myself" || side == "up") {
            if (playerNum == 3) {
                if (bguseridx == 2) {
                    if (s == 0) {
                        sprite.spriteFrame = cc.fy.mahjongmgr.getEmptySpriteFrame("up");
                        sprite.node.scaleX = 1.0;//1.5;
                        sprite.node.scaleY = 1.0;//1.5;
                    }
                }
                else if (bguseridx == 0) {
                    if (flag == "wangang" && s == 1) {
                        sprite.spriteFrame = cc.fy.mahjongmgr.getEmptySpriteFrame("up");
                        sprite.node.scaleX = 1.0;//1.5;
                        sprite.node.scaleY = 1.0;//1.5;
                    }
                    else {
                        if (flag != "wangang" && s == 3) {
                            sprite.spriteFrame = cc.fy.mahjongmgr.getEmptySpriteFrame("up");
                            sprite.node.scaleX = 1.0;//1.5;
                            sprite.node.scaleY = 1.0;// 1.5;
                        }
                    }
                }
                else if (bguseridx == 1) {
                    if (s == 2) {
                        sprite.spriteFrame = cc.fy.mahjongmgr.getEmptySpriteFrame("up");
                        sprite.node.scaleX = 1.0;// 1.5;
                        sprite.node.scaleY = 1.0;//1.5;
                    }
                }
            }
            else {
                if (bguseridx == 3) {
                    if (s == 0) {
                        sprite.spriteFrame = cc.fy.mahjongmgr.getEmptySpriteFrame("up");
                        sprite.node.scaleX = 1.0;//1.5;
                        sprite.node.scaleY = 1.0;//1.5;
                    }
                }
                else if (bguseridx == 0 || bguseridx == 2) {
                    if (flag == "wangang" && s == 1) {
                        sprite.spriteFrame = cc.fy.mahjongmgr.getEmptySpriteFrame("up");
                        sprite.node.scaleX = 1.0;//1.5;
                        sprite.node.scaleY = 1.0;//1.5;
                    }
                    else {
                        if (flag != "wangang" && s == 3) {
                            sprite.spriteFrame = cc.fy.mahjongmgr.getEmptySpriteFrame("up");
                            sprite.node.scaleX = 1.0;//1.5;
                            sprite.node.scaleY = 1.0;//1.5;
                        }
                    }
                }
                else if (bguseridx == 1) {
                    if (s == 2) {
                        sprite.spriteFrame = cc.fy.mahjongmgr.getEmptySpriteFrame("up");
                        sprite.node.scaleX = 1.0;//1.5;
                        sprite.node.scaleY = 1.0;//1.5;
                    }
                }
            }

        }
        else {
            if (playerNum == 3) {
                if (bguseridx == 1 || bguseridx == 2) {
                    if (s == 1 || s == 3) {
                        sprite.spriteFrame = cc.fy.mahjongmgr.getEmptySpriteFrame("left");
                    }
                }
                else if (bguseridx == 0) {
                    if (s == 2) {
                        sprite.spriteFrame = cc.fy.mahjongmgr.getEmptySpriteFrame("left");
                    }
                }
            }

            else {
                if (bguseridx == 2) {
                    if (s == 0) {
                        sprite.spriteFrame = cc.fy.mahjongmgr.getEmptySpriteFrame("left");
                    }
                }
                else if (bguseridx == 1 || bguseridx == 3) {
                    if (s == 1 || s == 3) {
                        sprite.spriteFrame = cc.fy.mahjongmgr.getEmptySpriteFrame("left");
                    }
                }
                else if (bguseridx == 0) {
                    if (s == 2) {
                        sprite.spriteFrame = cc.fy.mahjongmgr.getEmptySpriteFrame("left");
                    }

                }

            }
        }
    },
    showPengPaiType: function (side, s, bpuseridx, sprite, playerNum) {
        if (side == "myself" || side == "up") {
            if (playerNum == 3) {
                if (bpuseridx == 0) {
                    if (s == 1) {
                        sprite.spriteFrame = cc.fy.mahjongmgr.getEmptySpriteFrame("up");
                        // sprite.node.scaleX = 1.5;
                        // sprite.node.scaleY = 1.5;
                    }
                }

                else if (bpuseridx == 1) {
                    if (s == 2) {
                        sprite.spriteFrame = cc.fy.mahjongmgr.getEmptySpriteFrame("up");
                        // sprite.node.scaleX = 1.5;
                        // sprite.node.scaleY = 1.5;
                    }
                }
                else if (bpuseridx == 2) {
                    if (s == 0) {
                        sprite.spriteFrame = cc.fy.mahjongmgr.getEmptySpriteFrame("up");
                        // sprite.node.scaleX = 1.5;
                        // sprite.node.scaleY = 1.5;
                    }
                }

            }
            else {
                if (bpuseridx == 0 || bpuseridx == 2) {
                    if (s == 1) {
                        sprite.spriteFrame = cc.fy.mahjongmgr.getEmptySpriteFrame("up");
                        // sprite.node.scaleX = 1.5;
                        // sprite.node.scaleY = 1.5;
                    }
                }
                else if (bpuseridx == 1) {
                    if (s == 2) {
                        sprite.spriteFrame = cc.fy.mahjongmgr.getEmptySpriteFrame("up");
                        // sprite.node.scaleX = 1.5;
                        // sprite.node.scaleY = 1.5;
                    }
                }
                else if (bpuseridx == 3) {
                    if (s == 0) {
                        sprite.spriteFrame = cc.fy.mahjongmgr.getEmptySpriteFrame("up");
                        // sprite.node.scaleX = 1.5;
                        // sprite.node.scaleY = 1.5;
                    }
                }
            }
        }
        else {
            if (playerNum == 3) {
                if (bpuseridx == 0) {
                    if (s == 2) {
                        sprite.spriteFrame = cc.fy.mahjongmgr.getEmptySpriteFrame("left");
                    }
                }
                else if (bpuseridx == 1 || bpuseridx == 2) {
                    if (s == 1) {
                        sprite.spriteFrame = cc.fy.mahjongmgr.getEmptySpriteFrame("left");
                    }
                }
            }
            else {
                if (bpuseridx == 0) {
                    if (s == 2) {
                        sprite.spriteFrame = cc.fy.mahjongmgr.getEmptySpriteFrame("left");
                    }
                }
                else if (bpuseridx == 1 || bpuseridx == 3) {
                    if (s == 1) {
                        sprite.spriteFrame = cc.fy.mahjongmgr.getEmptySpriteFrame("left");
                    }
                }
                else if (bpuseridx == 2) {
                    if (s == 0) {
                        sprite.spriteFrame = cc.fy.mahjongmgr.getEmptySpriteFrame("left");
                    }
                }
            }
        }
    },

    setArrDir: function (side, pgroot, bpuseridx, flag, playerNum) {
        var arr = pgroot.getChildByName("arr");
        if (arr) {
            if (bpuseridx != null) {
                arr.active = true;
                // var orlocalIndex = cc.fy.gameNetMgr.getLocalIndex(bpuseridx);
                var orlocalIndex = bpuseridx;
                var localIndex = cc.fy.gameNetMgr.getLocalIndexBySide(side);
                var dir = "left";
                console.log("orlocalIndex = " + orlocalIndex + "  localIndex = " + localIndex + " side = " + side + " bpuseridx = " + bpuseridx);
                var dirOff = localIndex - orlocalIndex;
                if (playerNum == 3) {
                    if (dirOff == 0) {
                        arr.active = false;
                    }
                    else if (Math.abs(dirOff) == 1) { // 相差一的话说明是临近的两个坐位，自己的话肯定朝右，左侧玩家肯定朝上
                        if (localIndex == 0) {
                            dir = "right";
                        }
                        else if (localIndex == 1) { // 右侧玩家 上下
                            if (localIndex > orlocalIndex) {
                                dir = "left";
                            }
                            else {
                                dir = "down";
                            }
                        }
                        else if (localIndex == 2) { // 上方玩家 左右
                            dir = "right";
                        }
                    }
                    else if (Math.abs(dirOff) == 2) { // 对家的话，每个位置也要单独计算，上方玩家朝下，左侧朝右，右侧朝左，自己朝上
                        if (localIndex > orlocalIndex) {
                            dir = "right";
                        }
                        else {
                            dir = "down";
                        }
                    }

                    if (dir == "up") {
                        // 上方
                        arr.rotation = 180;
                    }
                    else if (dir == "down") {
                        // 上方
                        arr.rotation = 270;
                    }
                    else if (dir == "left") {
                        // 左边
                        arr.rotation = 180;
                    }
                    else if (dir == "right") {
                        // 右边
                        arr.rotation = 90;
                    }
                    console.log('111112222', dir)

                    // 左右和上下的杠的预制体不一样，需要单独调坐标
                    if (this.isNeedShowGang(flag)) {
                        // if(localIndex == 0 || localIndex == 2){
                        //     arr.y = 35;
                        // }
                        // else{
                        //     arr.y = -5.5;
                        // }
                        // if( cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.yzmj_yangzhou_tdh && cc.fy.gameNetMgr.fanbaida == mjid){
                        //     var ndmj = pgroot.getChildByName("item_1");
                        //     arr.x = ndmj.x;
                        //     arr.y = ndmj.y + 8;
                        // }
                        // else{
                        var ndmj = pgroot.getChildByName("item_3");
                        arr.x = ndmj.x;
                        arr.y = ndmj.y + 8;
                        // }
                    }
                    else {
                        // if(localIndex == 0 || localIndex == 2){
                        //     arr.y = 10;
                        // }
                        // else{
                        //     arr.y = -18;
                        // }

                        if (flag != "chi") {
                            var ndmj = pgroot.getChildByName("item_1");
                            arr.x = ndmj.x;
                            arr.y = ndmj.y + 8;
                        }
                    }
                }
                else {



                    if (dirOff == 0) {
                        if (flag == "wangang" /*|| flag == "diangang" || flag == "angang"*/) {
                            // if (side == "myself") {
                            //     dir = "down";
                            // }
                            // else {
                            //     dir = side;
                            // }
                        }
                        else {
                            arr.active = false;
                        }
                    }
                    else if (Math.abs(dirOff) == 3) { // 自己和最后一个人的坐位比较 要么朝左要么朝下
                        if (localIndex > orlocalIndex) {
                            dir = "down";
                        }
                        else {
                            dir = "left";
                        }
                    }
                    else if (Math.abs(dirOff) == 1) { // 相差一的话说明是临近的两个坐位，自己的话肯定朝右，左侧玩家肯定朝上
                        if (localIndex == 0) {
                            dir = "right";
                        }
                        else if (localIndex == 3) {
                            dir = "up";
                        }
                        else if (localIndex == 1) { // 右侧玩家 上下
                            if (localIndex > orlocalIndex) {
                                dir = "down";
                            }
                            else {
                                dir = "up";
                            }
                        }
                        else if (localIndex == 2) { // 上方玩家 左右
                            if (localIndex > orlocalIndex) {
                                dir = "right";
                            }
                            else {
                                dir = "left";
                            }
                        }
                    }
                    else if (Math.abs(dirOff) == 2) { // 对家的话，每个位置也要单独计算，上方玩家朝下，左侧朝右，右侧朝左，自己朝上
                        if (localIndex == 0) {
                            dir = "up";
                        }
                        else if (localIndex == 1) {
                            dir = "left";
                        }
                        else if (localIndex == 2) {
                            dir = "down";
                        }
                        else if (localIndex == 3) {
                            dir = "right";
                        }
                    }

                    if (dir == "up") {
                        // 上方
                        arr.rotation = 0;
                    }
                    else if (dir == "down") {
                        // 上方
                        arr.rotation = 180;
                    }
                    else if (dir == "left") {
                        // 左边
                        arr.rotation = 270;
                    }
                    else if (dir == "right") {
                        // 右边
                        arr.rotation = 90;
                    }

                    // 左右和上下的杠的预制体不一样，需要单独调坐标
                    if (this.isNeedShowGang(flag)) {
                        // if(localIndex == 0 || localIndex == 2){
                        //     arr.y = 35;
                        // }
                        // else{
                        //     arr.y = -5.5;
                        // }
                        // if( cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.yzmj_yangzhou_tdh && cc.fy.gameNetMgr.fanbaida == mjid){
                        //     var ndmj = pgroot.getChildByName("item_1");
                        //     arr.x = ndmj.x;
                        //     arr.y = ndmj.y + 8;
                        // }
                        // else{
                        var ndmj = pgroot.getChildByName("item_3");
                        arr.x = ndmj.x;
                        arr.y = ndmj.y + 8;
                        // }
                    }
                    else {
                        // if(localIndex == 0 || localIndex == 2){
                        //     arr.y = 10;
                        // }
                        // else{
                        //     arr.y = -18;
                        // }

                        if (flag != "chi") {
                            var ndmj = pgroot.getChildByName("item_1");
                            arr.x = ndmj.x;
                            arr.y = ndmj.y + 8;
                        }
                    }
                }
            }
            else {
                arr.active = false;
            }
        }
    },

    isNeedShowGang: function (flag) {
        if (flag == "angang" || flag == "diangang" || flag == "wangang") {
            return true;
        }
        return false;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
