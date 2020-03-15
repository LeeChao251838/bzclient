cc.Class({
    extends: require("RoomConfigItem"),

    properties: {
        _isClub: false,

    },

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
        if (playerIndex >= 2) {
            this.nodGps.active = false;
        } else {
            this.nodGps.active = this._isClub;
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
        for (var i = 0; i < this.nodPlayer.length; i++) {
            var compRadioButton = this.nodPlayer[i].getComponent("RadioButton");
            if (compRadioButton) {
                if (i == 4 - conf.maxCntOfPlayers) {
                    compRadioButton.checked = true//conf.maxCntOfPlayers == 4;
                }
                else {
                    compRadioButton.checked = false//conf.maxCntOfPlayers == 3;
                }
                compRadioButton.refresh();
            }
        }
        let wanfa = conf.wanfa.toString();
        for (var i = 0; i < this.nodRule.length; ++i) {
            var compToggle = this.nodRule[i].getComponent(cc.Toggle);
            if (compToggle) {
                if (wanfa.indexOf('1') == 0) {
                    compToggle.check();
                } else {
                    compToggle.uncheck();
                }
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
        this.onCostBtnClicked();
    },

    refreshState(isClub) {
        var title = "房主付费";
        if (isClub) {
            title = "圈主付费";
        }
        this._isClub = isClub;
        this.nodGps.active = isClub;
        this.nodCost[0].getChildByName("title").getComponent(cc.Label).string = title;

        this.onCostBtnClicked();
    }
});
