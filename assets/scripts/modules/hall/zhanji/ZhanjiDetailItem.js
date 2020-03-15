cc.Class({
    extends: require('Item'),

    properties: {

        num: cc.Label,
        time: cc.Label,

        shareBtn: cc.Node,
        lookBtn: cc.Node,
        bgImage: cc.Node,


        _Data: null,
        _roomInfo: null,

        _gameIndex: 0,
    },

    updateItem: function (index, data) {
        console.log(data);
        this._super(index, data);
        this.node.active = true;
        if (index % 2 == 1) {
            this.bgImage.active = false;
        } else {
            this.bgImage.active = true;
        }

        this._Data = data;
        this._roomInfo = cc.fy.zhanjiMsg._roomInfo;


        var date = new Date(data.create_time * 1000);

        this.num.string = data.game_index + 1;
        var timeStr = cc.fy.utils.timeToString(date, "hh:mm");
        this.time.string = timeStr;

        //分享和回看
        this.shareBtn.active = false;
        this.lookBtn.active = true;
        cc.fy.utils.addClickEvent(this.lookBtn, this.node, "ZhanjiDetailItem", "onBtnLook");
        this._gameIndex = data.game_index;
        if (data.result == null || data.result == "") {
            data.result = "[0, 0, 0, 0]";
        }


        var result = JSON.parse(data.result);
        var resultDis = [];
        if (data.dissolve != null && data.dissolve != "") {
            var dissolve = JSON.parse(data.dissolve);
            for (let j = 0; j < dissolve.length; j++) {
                if (dissolve[j] == 1) {
                    resultDis[j] = "同意解散";
                } else if (dissolve[j] == 2) {
                    resultDis[j] = "发起解散";
                } else if (dissolve[j] == 3) {
                    resultDis[j] = "圈主解散";
                } else if (dissolve[j] == 0) {
                    resultDis[j] = "离线";
                } else {
                    resultDis[j] = "未确认";
                }
            }
            this.shareBtn.active = false;
            this.lookBtn.active = false;
        }
        var otherIndex = 0;
        for (let i = 0; i < this._roomInfo.seats.length; i++) {
            var s = this._roomInfo.seats[i];
            if (s && s.userid == cc.fy.userMgr.userId) {
                otherIndex = 1;
                break;
            }
        }

        //赋值分数   
        for (let i = 0; i < 4; ++i) {
            let scoreNode = this.node.getChildByName("score" + i);
            scoreNode.active = true;
            var s = this._roomInfo.seats[i];
            if (s) {
                if (s.userid == cc.fy.userMgr.userId) {
                    scoreNode = this.node.getChildByName("score0");
                } else {
                    scoreNode = this.node.getChildByName("score" + otherIndex);
                    otherIndex++;
                }
                let scoreInfo = cc.fy.utils.floatToFixed(result[i], 1, true);
                if (scoreInfo >= 0) {
                    scoreNode.getComponent(cc.Label).string = scoreInfo;
                } else {
                    scoreNode.getComponent(cc.Label).string = scoreInfo;
                }
                if (resultDis.length > 0) {
                    scoreNode.getComponent(cc.Label).string = resultDis[i];
                }

            } else {
                scoreNode.getComponent(cc.Label).string = "";
            }

        }

    },
    //点击分享
    onBtnShare() {
        console.log("分享")
    },
    //点击回看
    onBtnLook() {
        console.log();
        var roomUUID = this._roomInfo.uuid;
        var self = this;
        cc.fy.userMgr.getDetailOfGame(roomUUID, this._gameIndex, function (data) {
            console.log("===================>>>>>>>>>>>>>", data);
            var base_info = data.base_info;
            var action_records = data.action_records;
            if (base_info) {
                data.base_info = JSON.parse(data.base_info);
            }
            if (action_records) {
                data.action_records = JSON.parse(data.action_records);
            }
            self._roomInfo.idx = self._gameIndex;
            cc.fy.gameNetMgr.prepareReplay(self._roomInfo, data);
            cc.fy.replayMgr.init(data);
            cc.fy.sceneMgr.loadGameScene(cc.fy.gameNetMgr.conf.type);
        });
    }

});
