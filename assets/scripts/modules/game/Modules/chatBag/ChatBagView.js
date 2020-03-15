var GameMsgDef = require("GameMsgDef");
cc.Class({
    extends: require("BaseModuleView"),
    properties: {
        content: cc.Node,
        quickSpeechList: cc.Node,
        quickSpeechItem: cc.Node,
        icon_biaoqing: cc.Node,
        icon_text: cc.Node,
        chatList: cc.Node,
        chatIconList: cc.Node,
        _lastTime: null,
        _index: null,
        _quickChatInfo: null,
        _isClick: true,
    },

    onLoad: function () {

        this.initView();
        this.initEventHandlers();
        this.initInfo();


        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.PDK || cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.GD) {
            for (var i = 0; i < 5; i++) {
                var quickSpeechItem = cc.instantiate(this.quickSpeechItem);
                var key = "item" + i;
                quickSpeechItem.name = key;
                var label = quickSpeechItem.getChildByName("label").getComponent(cc.Label);
                var text = this._quickChatInfo[key].content;
                label.string = cc.fy.utils.subStringCN(text, 24, true);
                quickSpeechItem.active = true;
                this.quickSpeechList.addChild(quickSpeechItem);
                console.log(this.quickSpeechList);
            }
        }
        else {
            for (var i = 0; i < 9; i++) {
                var quickSpeechItem = cc.instantiate(this.quickSpeechItem);
                var key = "item" + i;
                quickSpeechItem.name = key;
                var label = quickSpeechItem.getChildByName("label").getComponent(cc.Label);
                var text = this._quickChatInfo[key].content;
                label.string = cc.fy.utils.subStringCN(text, 22, true);
                quickSpeechItem.active = true;
                this.quickSpeechList.addChild(quickSpeechItem);
                console.log(this.quickSpeechList);
            }
        }
    },
    initInfo: function () {
        this._quickChatInfo = {};
        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.PDK || cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.GD) {
            this._quickChatInfo["item0"] = { index: 0, content: "老铁,扎心了!", content2: "老铁,扎心了!", sound: "speech_0.mp3" };
            this._quickChatInfo["item1"] = { index: 1, content: "这牌,我也是醉了!", content2: "这牌我也是醉了!", sound: "speech_1.mp3" };
            this._quickChatInfo["item2"] = { index: 2, content: "来啊,互相伤害!", content2: "来啊,互相伤害!", sound: "speech_2.mp3" };
            this._quickChatInfo["item3"] = { index: 3, content: "出牌这么慢,你属乌龟的吗?", content2: "出牌这么慢,你属乌龟的吗?", sound: "speech_3.mp3" };
            this._quickChatInfo["item4"] = { index: 4, content: "厉害了,我的哥!", content2: "厉害了,我的哥!", sound: "speech_4.mp3" };
        }
        else {
            this._quickChatInfo["item0"] = { index: 0, content: "大家好,一起打牌很开心!", sound: "mj_fix_msg_1.mp3" };
            this._quickChatInfo["item1"] = { index: 1, content: "快点吧,等得头发都白了!", sound: "mj_fix_msg_2.mp3" };
            this._quickChatInfo["item2"] = { index: 2, content: "天哪,这牌怎么这么差啊!", sound: "mj_fix_msg_3.mp3" };
            this._quickChatInfo["item3"] = { index: 3, content: "先胡末庄,后胡金庄!", sound: "mj_fix_msg_4.mp3" };
            this._quickChatInfo["item4"] = { index: 4, content: "来个牌碰一下吧！", sound: "mj_fix_msg_5.mp3" };
            this._quickChatInfo["item5"] = { index: 5, content: "哎呀,打错牌啦！", sound: "mj_fix_msg_6.mp3" };
            this._quickChatInfo["item6"] = { index: 6, content: "上碰下自摸,自摸杠开啦！", sound: "mj_fix_msg_7.mp3" };
            this._quickChatInfo["item7"] = { index: 7, content: "你们门槛真精明！", sound: "mj_fix_msg_8.mp3" };
            this._quickChatInfo["item8"] = { index: 8, content: "老板,留条活路吧！", sound: "mj_fix_msg_9.mp3" };
            this._quickChatInfo["item9"] = { index: 9, content: "你打的牌打得太好了！", sound: "mj_fix_msg_10.mp3" };
            this._quickChatInfo["item10"] = { index: 10, content: "不好意思,稍微离开一会。", sound: "mj_fix_msg_11.mp3" };
        }
    },
    start: function () {

    },

    initEventHandlers: function () {
        var self = this;
        var game = cc.fy.gameNetMgr;

        game.addHandler(GameMsgDef.ID_SHOWCHATBAGVIEW_CTC, function (data) {
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
        var _this = this;
        if (this._isClick) {
            this._isClick = false;
            this.node.active = true;
            var btnbox = cc.find("Canvas/gameMain/btnbox");
            if (btnbox) {
                btnbox.active = false;
            }
            var actionBy = cc.moveBy(0.2, -200, 0);
            var seq = cc.sequence(actionBy, cc.callFunc(function () {
                _this._isClick = true;
            }))
            this.content.runAction(seq);
        }
    },

    hidePanel: function () {
        var _this = this;
        if (this._isClick) {
            this._isClick = false;
            var actionBy = cc.moveBy(0.2, 200, 0);

            var seq = cc.sequence(actionBy, cc.callFunc(function () {
                _this._isClick = true;
                _this.node.active = false;
                var btnbox = cc.find("Canvas/gameMain/btnbox");
                if (btnbox) {
                    btnbox.active = true;
                }
            }))
            this.content.runAction(seq);
        }
    },

    initView: function () {
        // 作为弹框模式 不隐藏其它弹框
        this.setHideOther(false);
        this._index = 1;
        this.icon_biaoqing.active = true;
        this.icon_text.active = false;
        this.chageTab();
    },
    chageTab: function () {

        if (this._index == 1) {
            this.icon_biaoqing.active = true;
            this.icon_text.active = false;
            this.chatIconList.active = true;
            this.chatList.active = false;
        } else {
            this.icon_text.active = true;
            this.icon_biaoqing.active = false;
            this.chatIconList.active = false;
            this.chatList.active = true;
        }
    },

    onLeftClicked: function (event) {
        this._index = 1;
        this.chageTab();
    },

    onRightClicked: function (event) {
        this._index = 2;
        this.chageTab();
    },

    getQuickChatInfo(index) {
        if (!this._quickChatInfo) {
            this.initInfo();
        }
        var key = "item" + index;
        return this._quickChatInfo[key];
    },
    onQuickChatItemClicked: function (event) {
        if (this._lastTime != null) {
            if (Date.now() < this._lastTime + 2000) {
                cc.fy.hintBox.show("您的手速太快了~");
                this.hidePanel();
                return;
            }
        }
        this.hidePanel();

        var info = this._quickChatInfo[event.target.name];
        cc.fy.net.send("quick_chat", info.index);
        this._lastTime = Date.now();
    },
    onEmojiItemClicked: function (event) {
        if (this._lastTime != null) {
            if (Date.now() < this._lastTime + 2000) {
                cc.fy.hintBox.show("您的手速太快了~");
                this.hidePanel();
                return;
            }
        }
        console.log(event.target.name);
        this.hidePanel();

        cc.fy.net.send("emoji", event.target.name);
        this._lastTime = Date.now();
    },
    onCloseClicked: function (event) {
        this.hidePanel();
    },
});
