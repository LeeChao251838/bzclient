cc.Class({
    extends: require("RoomConfigItem"),

    properties: {

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
        // var playerIndex = 0;
        // for (var i = 0; i < this.nodPlayer.length; i++) {
        //     var compRadioButton = this.nodPlayer[i].getComponent("RadioButton");
        //     if (compRadioButton && compRadioButton.checked) {
        //         playerIndex = i;
        //         break;
        //     }
        // }
        // if (playerIndex >= 2) {
        this.nodGps.active = false;
        // }
        for (var i = 0; i < this.nodRound.length; i++) {
            var roundNode = this.nodRound[i];
            var labTitleMax = roundNode.getChildByName("titlemax").getComponent(cc.Label);
            if (costIndex == 0) {
                labTitleMax.string = cc.SZCardConfig[this.type][0][i];
            }
            else if (costIndex == 1) {
                labTitleMax.string = cc.SZCardConfig_AA[this.type][0][i];
            }
            else if (costIndex == 2) {
                labTitleMax.string = cc.SZCardConfig_DYJ[this.type][0][i];
            }
        }



    },

    loadCreateInfo(conf) {
        console.log("==>> loadCreateInfo --> conf: ", conf);



        for (var i = 0; i < this.nodRule.length; ++i) {

            var compCheckBox = this.nodRule[i].getComponent("CheckBox");
            if (compCheckBox) {
                compCheckBox.checked = conf.wanfa.double == 1;
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
        //this.onCostBtnClicked();
    },

    refreshState(isClub) {
        var title = "房主付费";
        if (isClub) {
            title = "圈主付费";
        }
        this.nodGps.active = isClub;
        this.nodCost[0].getChildByName("title").getComponent(cc.Label).string = title;

        this.onCostBtnClicked();
    }
});
