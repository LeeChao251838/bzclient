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
        var compCheckBox = this.nodRule[0].getComponent("RadioButton");
        if (compCheckBox) {
            if (conf.wanfa.baidafanpai == 0) {
                compCheckBox.checked = true;
            } else {
                compCheckBox.checked = false;
            }
            compCheckBox.refresh();
        }
        var compCheckBox = this.nodRule[1].getComponent("RadioButton");
        if (compCheckBox) {
            if (conf.wanfa.baidafanpai == 2) {
                compCheckBox.checked = true;
            } else {
                compCheckBox.checked = false;
            }
            compCheckBox.refresh();
        }

        var compCheckBox = this.nodRule[2].getComponent("RadioButton");
        if (compCheckBox) {
            if (conf.wanfa.baidafanpai == 4) {
                compCheckBox.checked = true;
            } else {
                compCheckBox.checked = false;
            }
            compCheckBox.refresh();
        }
        var compCheckBox = this.nodRule[3].getComponent("RadioButton");
        if (compCheckBox) {
            if (conf.wanfa.baidafanpai == 6) {
                compCheckBox.checked = true;
            } else {
                compCheckBox.checked = false;
            }
            compCheckBox.refresh();
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
                // else if(i == 2){
                //     compRadioButton.checked = conf.maxCntOfPlayers == 2;
                // }
                compRadioButton.refresh();
            }
        }
        //根据设置改变  


        var compCheckBox = this.nodRule[4].getComponent("CheckBox");
        if (compCheckBox) {
            if (conf.wanfa.zimohu == 1) {
                compCheckBox.checked = true;
            } else {
                compCheckBox.checked = false;
            }
            compCheckBox.refresh();
        }

        var compCheckBox = this.nodRule[5].getComponent("CheckBox");
        if (compCheckBox) {
            if (conf.wanfa.huqidui == 1) {
                compCheckBox.checked = true;
            } else {
                compCheckBox.checked = false;
            }
            compCheckBox.refresh();
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
