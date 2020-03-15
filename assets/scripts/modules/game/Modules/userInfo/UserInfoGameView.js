var GameMsgDef = require("GameMsgDef");
cc.Class({
    extends: require("BaseModuleView"),
    properties: {
        _isShow: false,
        _userid: -1,
        _userInfo_ID: null,
        _lastTime: null,
        bgContent: cc.Node,
        giftList: cc.Node,
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
    },
    initEventHandlers: function () {
        var self = this;
        var game = cc.fy.gameNetMgr;
        game.addHandler(GameMsgDef.ID_SHOWSEATINFOVIEW_CTC, function (data) {
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
        this.node.active = true;
        var data = data.content;
        this.show(data.name, data.userId, data.iconSprite, data.sex, data.ip, data.geo, data.index);
        this._userInfo_ID = this.node.getChildByName("bg").getChildByName("id").getComponent(cc.Label);

    },

    hidePanel: function () {
        this.node.active = false;
    },

    getNode: function () {
        return this.node;
    },
    show: function (name, userId, iconSprite, sex, ip, geo, index) {
        if (userId != null && userId > 0 && cc.fy.replayMgr.isReplay() == false) {
            var box = this.node.getChildByName("bg");
            // box.getComponent(cc.Label).string = cc.fy.utils.subStringCN(name, 10, true);
            if (ip) {
                if (ip == "0.0.0.0") {
                    box.getChildByName("ip").getComponent(cc.Label).string = "IP: 暂未获得";
                }
                else {
                    box.getChildByName("ip").getComponent(cc.Label).string = "IP: " + ip.replace("::ffff:", "");
                }
            }
            else {
                box.getChildByName("ip").getComponent(cc.Label).string = "IP: 正在获取...";
            }
            box.getChildByName("id").getComponent(cc.Label).string = "ID: " + userId;
            if (geo == null || geo.location == null || geo.location == "" || geo.location == "null") {
                box.getChildByName("geo").getComponent(cc.Label).string = "位置暂未获得...";
            } else {
                box.getChildByName("geo").getComponent(cc.Label).string = cc.fy.utils.subStringCN(geo.location, 26, true);
            }
            // var sex_female = this.node.getChildByName("sex_female");
            // sex_female.active = false;

            // var sex_male = this.node.getChildByName("sex_male");
            // sex_male.active = false;
            // if(sex == 1){//男
            //     sex_male.active = true;
            // }   
            // else if(sex == 2){//女
            //     sex_female.active = true;
            // }
            if (index) {
                if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.GD) {
                    if (cc.find("Canvas/prepare") && cc.find("Canvas/prepare").active) {
                        switch (index) {
                            case 'myself':
                                box.x = 220;
                                box.y = -187;
                                break;
                            case 'left':
                                box.x = -92;
                                box.y = 62;
                                break;
                            case 'right':
                                box.x = 130;
                                box.y = 62;
                                break;
                            case 'up':
                                box.x = 220;
                                box.y = 172;
                                break;
                        }
                    } else {
                        switch (index) {
                            case 'myself':
                                box.x = -266;
                                box.y = -192;
                                break;
                            case 'left':
                                box.x = -272;
                                box.y = 90;
                                break;
                            case 'right':
                                box.x = 280;
                                box.y = 90;
                                break;
                            case 'up':
                                box.x = 225;
                                box.y = 162;
                                break;
                        }
                    }
                } else if (cc.isMJ(cc.fy.gameNetMgr.conf.type)) {
                    if (cc.find("Canvas/gameMain/prepare") && cc.find("Canvas/gameMain/prepare").active) {
                        let seats = cc.find("Canvas/gameMain/prepare/seats");
                        let seatItem=seats.getChildByName(index);
                        if(seatItem){
                            switch (index) {
                                case 'myself':
                                    box.x = seatItem.x+250;
                                    box.y = seatItem.y-10;
                                    break;
                                case 'left':
                                    box.x = seatItem.x+250;
                                    box.y = seatItem.y;
                                    break;
                                case 'right':
                                    box.x = seatItem.x-250;
                                    box.y = seatItem.y;
                                    break;
                                case 'up':
                                    box.x = seatItem.x-250;;
                                    box.y = seatItem.y-60;
                                    break;
                            }
                        }
                        
                    } else {

                        let game = cc.find("Canvas/gameMain/game");

                        let seats=game.getChildByName(index);
                        let seatItem = seats.getChildByName("seat")
                        if(seatItem){
                            switch (index) {
                                case 'myself':
                                    box.x = seatItem.x+250;
                                    box.y = seatItem.y-10;
                                    break;
                                case 'left':
                                    box.x = seats.x-370;
                                    box.y = seatItem.y;
                                    break;
                                case 'right':
                                    box.x = seats.x-200;
                                    box.y = seatItem.y;
                                    break;
                                case 'up':
                                    box.x = seatItem.x-250;;
                                    box.y = seatItem.y-100;
                                    break;
                            }
                        }
                       
                    }
                } else if(cc.fy.gameNetMgr.conf.type==cc.GAMETYPE.PDK){
                    let seats = cc.find("Canvas/gameMain/prepare/seats");
                    let seatItem=seats.getChildByName(index);
                    if(seatItem){
                        switch (index) {
                            case 'myself':
                                box.x = seatItem.x+250;
                                box.y = seatItem.y-10;
                                break;
                            case 'left':
                                box.x = seatItem.x+250;
                                box.y =seatItem.y;
                                break;
                            case 'right':
                                box.x = seatItem.x-250;
                                box.y = seatItem.y;
                                break;
                            case 'up':
                                box.x = seatItem.x-250;
                                box.y = seatItem.y-65;
                                break;
                        }
                    }
                }else{
                    switch (index) {
                        case 'myself':
                            box.x = -364;
                            box.y = -216;
                            break;
                        case 'left':
                            box.x = -318;
                            box.y = 76;
                            break;
                        case 'right':
                            box.x = 312;
                            box.y = 66;
                            break;
                        case 'up':
                            box.x = 206;
                            box.y = 186;
                            break;
                    }
                }
                   
            }
            this._isShow = true;
            this._userid = userId;
            this.node.active = true;
            //暂时隐藏魔法表情
            // if ("myself" == index) {
                this.bgContent.height = 160;
                this.giftList.active = false;
            // } else {
            //     this.bgContent.height = 240;
            //     this.giftList.active = true;
            // }
            cc.fy.userMgr.refreshGeo();
        }
    },
    onBtnPropIconClicked: function (event) {
        if (this._lastTime != null) {
            if (Date.now() < this._lastTime + 3000) {
                cc.fy.hintBox.show("您的手速太快了~");
                this.node.active = false;
                return;
            }
        }

        var propID = event.target.name;
        var str = this._userInfo_ID.string.split(":");
        var targetUserID = parseInt(str[1]);
        var temp = 0;
        for (var i = 0; i < cc.fy.gameNetMgr.seats.length; ++i) {
            var seat = cc.fy.gameNetMgr.seats[i];
            temp = 0;
            if (seat.userid == targetUserID) {
                temp--;
                break;
            }
            else {
                temp++;
            }
        }
        if (temp > 0) {
            targetUserID += 99900000;
        }
        if (parseInt(targetUserID) == parseInt(cc.fy.userMgr.userId)) {
            cc.fy.hintBox.show("坏坏，不可以自嗨哟~");
            return;
        }
        var data = {
            userId: targetUserID,
            propId: propID,
        }
        console.log("interactiveaction");
        this._lastTime = Date.now();
        cc.fy.net.send("interactivaction", data);
        this.node.active = false;

    },
    refreshGeo: function (geo) {
        var box = this.node.getChildByName("bg");
        if (this._isShow && this._userid == cc.fy.userMgr.userId) {
            if (geo == null || geo.location == null || geo.location == "") {
                box.getChildByName("geo").getComponent(cc.Label).string = "位置未获得";
            } else {
                box.getChildByName("geo").getComponent(cc.Label).string = cc.fy.utils.subStringCN(geo.location, 26, true);
            }
        }
    },

    onClicked: function () {
        this._isShow = false;
        this.node.active = false;
        this._userid = -1;
    },

});
