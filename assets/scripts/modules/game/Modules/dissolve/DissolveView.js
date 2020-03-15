var GameMsgDef = require("GameMsgDef");
cc.Class({
    extends: require("BaseModuleView"),

    properties: {
        _endTime: -1,
        _extraInfo: null,
        _noticeLabel: null,

        _bSelfAgree: false,
        _bselfReject: false,
        _usernamenoticeLabel: null,
        sendName: cc.Label,//发起人
        userLayout: cc.Node,
        itemUser: cc.Node,//玩家

    },

    onLoad: function () {
        this.initView();
        this.initEventHandlers();
    },

    start: function () {

    },

    initEventHandlers: function () {
        var self = this;
        var game = cc.fy.gameNetMgr;

        game.addHandler(GameMsgDef.ID_SHOWDISSOLVEVIEW_CTC, function (data) {
            if (data.isShow == false) {
                self.hidePanel();
            }
            else {
                self.showPanel(data);
            }
        });


    },

    initView: function () {
        // 作为弹框模式 不隐藏其它弹框
        this.setHideOther(false);
        this.setAlwaysTop(true);

        this._noticeLabel = this.node.getChildByName("info").getComponent(cc.Label);
        this._btnDisAgree = this.node.getChildByName("btn_agree");
        this._btnDisReject = this.node.getChildByName("btn_reject");

        cc.fy.utils.addClickEvent(this._btnDisAgree, this.node, "DissolveView", "onBtnClicked");
        cc.fy.utils.addClickEvent(this._btnDisReject, this.node, "DissolveView", "onBtnClicked");
    },

    showPanel: function (data) {
        this.node.active = true;
        let _data = cc.fy.dissolveMsg.dissolveData;
        if (data && data.data) {
            _data = data.data;
        }
        this.showDissolveNotice(_data);
    },

    hidePanel: function () {
        this.node.active = false;
    },

    onBtnClicked: function (event) {
        var btnName = event.target.name;
        if (btnName == "btn_agree") {
            if (this._bSelfAgree != true) {
                cc.fy.net.send("dissolve_agree");
            }
        }
        else if (btnName == "btn_reject") {
            if (this._bselfReject != true) {
                cc.fy.net.send("dissolve_reject");
            }
        }
    },

    showDissolveNotice: function (data) {
        console.log("showDissolveNotice: ");
        console.log(data);
        if (cc.fy.replayMgr.isReplay() == true || cc.fy.gameNetMgr.seats == null || cc.fy.gameNetMgr.seats.length == 0 || data.time <= 0) {
            this.hidePanel();
            return;
        }
        this._endTime = Date.now() / 1000 + data.time;
        this._extraInfo = "";
        this._bSelfAgree = false;
        this._bselfReject = false;
        var bExit = 0;
        this.itemUser.active = false;
        this.userLayout.removeAllChildren();
        var items = this.userLayout.children;
        for (let i = 0; i < items.length; i++) {
            items[i].active = false;
        }
        for (var i = 0; i < data.states.length; ++i) {
            var b = data.states[i];
            var idx = i;
            if (data.userIds) {
                idx = cc.fy.gameNetMgr.getSeatIndexByID(data.userIds[i]);
            }
            console.log(cc.fy.gameNetMgr.seats, idx);
            var name = cc.fy.utils.subStringCN(cc.fy.gameNetMgr.seats[idx].name, 8, true);
            if (name == null) {
                return;
            }
            var nodeItem = items[i];
            if (!nodeItem) {
                nodeItem = cc.instantiate(this.itemUser);
                this.userLayout.addChild(nodeItem);
            }
            nodeItem.active = true;
            var refuse = nodeItem.getChildByName('refuse');
            var agree = nodeItem.getChildByName('agree');
            var labName = nodeItem.getChildByName('labName').getComponent(cc.Label);
            var sprHead = nodeItem.getChildByName('info_head').getChildByName('sprHead');

            var imageloader = sprHead.getComponent("ImageLoader");
            //先初始化默认头像
            imageloader.setUserID(cc.fy.gameNetMgr.seats[idx].userid);

            refuse.active = false;
            agree.active = false;
            labName.string = name;
            if (b == 1 || b == 2) {
                bExit += 1;
                if (b == 2) {
                    this.sendName.string = name;
                }
                agree.active = true;
                if (cc.fy.gameNetMgr.seatIndex == idx) {
                    if (b == 2) {
                        this._bselfReject = true;
                    }
                    this._bSelfAgree = true;
                }
            }
            else if (b == -1) {
                bExit += b;
                refuse.active = true;
                if (cc.fy.gameNetMgr.seatIndex == idx) {
                    this._bselfReject = true;
                }
            }
        }
        // cc.fy.gameNetMgr.isDispressed


        if (bExit == data.states.length) {
            this.hidePanel();
            cc.fy.gameNetMgr.isDispressed = true;
        }


        // 自己已经同意 同意按钮响应变化
        if (this._bSelfAgree == true) {
            this._btnDisAgree.color = new cc.Color(138, 138, 138);
            this._btnDisAgree.interactable = false;
            this._btnDisAgree.getChildByName('title_agree').color = new cc.Color(138, 138, 138);
        }
        else {
            this._btnDisAgree.color = new cc.Color(255, 255, 255);
            this._btnDisAgree.interactable = true;
            this._btnDisAgree.getChildByName('title_agree').color = new cc.Color(255, 255, 255);
        }
        //  拒绝按钮 控制响应变化
        if (this._bselfReject == true) {
            this._btnDisReject.color = new cc.Color(138, 138, 138);
            this._btnDisReject.interactable = false;
            this._btnDisReject.getChildByName('title_refuse').color = new cc.Color(138, 138, 138);
        }
        else {
            this._btnDisReject.color = new cc.Color(255, 255, 255);
            this._btnDisReject.interactable = true;
            this._btnDisReject.getChildByName('title_refuse').color = new cc.Color(255, 255, 255);
        }
    },

    update: function (dt) {
        if (this._endTime > 0) {
            var lastTime = this._endTime - Date.now() / 1000;
            if (lastTime >= 0) {
                var m = Math.floor(lastTime / 60);
                var s = Math.ceil(lastTime - m * 60);

                var str = "";
                if (m > 0) {
                    str += m + "分";
                }
                // if(cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.PDK){
                //     if(this._noticeLabel){
                //         this._noticeLabel.string = str + s + "秒后房间将自动解散" + this._extraInfo;
                //         this._noticeLabel.string = "";
                //     }
                // }
                // else{
                //     if(this._noticeLabel){
                //         this._noticeLabel.string = str + s + "秒后房间将自动解散" + this._extraInfo;
                //     }
                // }
                if (this._noticeLabel) {
                    this._noticeLabel.string = str + s + "秒后离线者视为同意解散，未确认者视为拒绝";
                }
            }
            else {
                this._endTime = -1;
                this.hidePanel();
            }

        }
    },
});
