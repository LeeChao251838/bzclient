cc.Class({
    extends: require("RoomConfigItem"),

    properties: {

    },


    // a: {
    //     "type": 9, "xuanzejushu": 0, "renshu": 2, "aagems": 0, "xiaohua": 1, "difen": 2, "mingan": 1,
    //     "isGroup": 0, "isSameIp": 0, "isGps": 0, "version": 20171109, "channelid": 3
    // },

    // a: {
    //     "type": 9, "wanfa": [1, 2], "createtype": 0, "xuanzejushu": 0, "difen": 4, "aagems": 0,
    //     "version": 20171109, "channelid": 3, "maxCntOfPlayers": 4
    // }


    onCostBtnClicked() {
        // cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        var costIndex = 0;
        for (var i = 0; i < this.nodCost.length; i++) {
            var compRadioButton = this.nodCost[i].getComponent("RadioButton");
            if (compRadioButton && compRadioButton.checked) {
                costIndex = i;
                break;
            }
        }
        var playerIndex = 0;
        for (var i = 0; i < this.nodPlayer.length; i++) {
            var compRadioButton = this.nodPlayer[i].getComponent("RadioButton");
            if (compRadioButton && compRadioButton.checked) {
                playerIndex = i;
                break;
            }
        }
        for (var i = 0; i < this.nodRound.length; i++) {
            var roundNode = this.nodRound[i];
            var labTitleMax = roundNode.getChildByName("titlemax").getComponent(cc.Label);
            if (costIndex == 0) {
                labTitleMax.string = cc.SZCardConfig[this.type][playerIndex][i];
            }
            else if (costIndex == 1) {
                labTitleMax.string = cc.SZCardConfig_AA[this.type][playerIndex][i];
            }
            else if (costIndex == 2) {
                labTitleMax.string = cc.SZCardConfig_DYJ[this.type][playerIndex][i];
            }
        }
    },

    loadCreateInfo(conf) {
        console.log("==>> loadCreateInfo --> conf: ", conf);
        var difenNum = conf.difen;
        // if (conf.difen == 0) {
        //     difenNum = 0;
        // }
        // else if (conf.difen == 1) {
        //     difenNum = 1;
        // }
        // else if (conf.difen == 4) {
        //     difenNum = 2;
        // }
        for (var i = 0; i < this.nodBaseScore.length; ++i) {
            var compRadioButton = this.nodBaseScore[i].getComponent("RadioButton");
            if (compRadioButton) {
                if (difenNum == i) {
                    compRadioButton.checked = true;
                }
                else {
                    compRadioButton.checked = false;
                }
                compRadioButton.refresh();
            }
        }
        for (var i = 0; i < this.nodRule.length; ++i) {
            var compRadioButton = this.nodRule[i].getComponent("RadioButton");
            if (compRadioButton) {
                if (cc.fy.utils.array_contain(conf.wanfa, i)) {
                    compRadioButton.checked = true;
                }
                else {
                    compRadioButton.checked = false;
                }
                compRadioButton.refresh();
            }
            var compCheckBox = this.nodRule[i].getComponent("CheckBox");
            if (compCheckBox) {
                if (cc.fy.utils.array_contain(conf.wanfa, i)) {
                    compCheckBox.checked = true;
                }
                else {
                    compCheckBox.checked = false;
                }
                compCheckBox.refresh();
            }
        }
        if (conf.aagems == 2) conf.aagems = 0;
        for (var i = 0; i < this.nodCost.length; ++i) {
            var compRadioButton = this.nodCost[i].getComponent("RadioButton");
            if (compRadioButton) {
                if (conf.aagems == i) {
                    compRadioButton.checked = true;
                }
                else {
                    compRadioButton.checked = false;
                }
                if (conf.aagems == 3) {
                    this.nodCost[2].getComponent("RadioButton").checked = true;
                }
                compRadioButton.refresh();
            }
        }
        for (var i = 0; i < this.nodRound.length; ++i) {
            var compRadioButton = this.nodRound[i].getComponent("RadioButton");
            if (compRadioButton) {
                if (conf.xuanzejushu == i) {
                    compRadioButton.checked = true;
                }
                else {
                    compRadioButton.checked = false;
                }
                compRadioButton.refresh();
            }
        }
        for (var i = 0; i < this.nodPlayer.length; i++) {
            var compRadioButton = this.nodPlayer[i].getComponent("RadioButton");
            if (compRadioButton) {
                // if (i == 0) {
                compRadioButton.checked = conf.renshu == i;// maxCntOfPlayers == 4;
                // }
                // else if (i == 1) {
                //     compRadioButton.checked = conf.maxCntOfPlayers == 3;
                // }
                // else if (i == 2) {
                //     compRadioButton.checked = conf.maxCntOfPlayers == 2;
                // }
                compRadioButton.refresh();
            }
        }
        //this.onCostBtnClicked();
    },

    refreshState(isClub) {
        var title = "房主付费";
        if (isClub) {
            title = "圈主付费";
        }
         this.nodGps.active=isClub;
        this.nodCost[0].getChildByName("title").getComponent(cc.Label).string = title;

        this.onCostBtnClicked();
    }
});
