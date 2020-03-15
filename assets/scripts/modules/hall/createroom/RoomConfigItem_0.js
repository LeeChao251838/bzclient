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
        // for (var i = 0; i < this.nodRound.length; i++) {
        //     var roundNode = this.nodRound[i];
        //     var labTitleMax = roundNode.getChildByName("titlemax").getComponent(cc.Label);
        //     if (costIndex == 0) {
        //         labTitleMax.string = cc.SZCardConfig[this.type][playerIndex][i];
        //     }
        //     else if (costIndex == 1) {
        //         labTitleMax.string = cc.SZCardConfig_AA[this.type][playerIndex][i];
        //     }
        //     else if (costIndex == 2) {
        //         labTitleMax.string = cc.SZCardConfig_DYJ[this.type][playerIndex][i];
        //     }
        // }
        let jushu = [4, 8, 16];
        let conStr = "局(    x";
        let endStr = ")";
        let titleStr = "";
        for (var i = 0; i < this.nodRound.length; i++) {
            var roundNode = this.nodRound[i];
            var labTitleMax = roundNode.getChildByName("titlemax").getComponent(cc.Label);
            titleStr = jushu[i] + conStr;
            if (costIndex == 0) {
                titleStr += cc.SZCardConfig[this.type][playerIndex][i];
            }
            else if (costIndex == 1) {
                titleStr += cc.SZCardConfig_AA[this.type][playerIndex][i];
            }
            else if (costIndex == 2) {
                titleStr += cc.SZCardConfig_DYJ[this.type][playerIndex][i];
            }
            titleStr += endStr;
            labTitleMax.string = titleStr;
        }

        // for (var i = 0; i < this.nodRule.length; ++i) {
        //     var compRadioButton = this.nodRule[i].getComponent("RadioButton");
        //     if(compRadioButton ){
        //         compRadioButton.checked = !compRadioButton.checked;
        //         compRadioButton.refresh();
        //     }
        // }
    },

    loadCreateInfo(conf) {
        var difenNum = conf.difen;
        // if(conf.difen == 1){
        //     difenNum = 0;
        // }
        // else if(conf.difen == 2){
        //     difenNum = 1;
        // }
        // else if(conf.difen == 5){
        //     difenNum = 2;
        // }else{
        //     difenNum = 3;
        // }
        for (var i = 0; i < this.nodBaseScore.length; ++i) {
            var compRadioButton = this.nodBaseScore[i].getComponent("RadioButton");
            if (compRadioButton) {
                if (difenNum == i) {
                    compRadioButton.checked = true;
                } else {
                    compRadioButton.checked = false;
                }
                compRadioButton.refresh();
            }
        }

        console.log("==>> loadCreateInfo --> conf: ", conf);
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
        // for (var i = 0; i < 3; ++i) {
        //     var compRadioButton = this.nodRule[i].getComponent("RadioButton");
        //     if (compRadioButton) {
        //         if (conf.wanfa.zuidafanshu == i) {
        //             compRadioButton.checked = true;
        //         }
        //         else {
        //             compRadioButton.checked = false;
        //         }
        //         compRadioButton.refresh();
        //     }
        // }
        if (conf.wanfa.zuidafanshu == 2) {
            var compRadioButton1 = this.nodRule[0].getComponent("RadioButton");
            compRadioButton1.checked = true;
            var compRadioButton2 = this.nodRule[1].getComponent("RadioButton");
            compRadioButton2.checked = false;
            var compRadioButton3 = this.nodRule[2].getComponent("RadioButton");
            compRadioButton3.checked = false;
            compRadioButton1.refresh();
            compRadioButton2.refresh();
            compRadioButton3.refresh();

        } else if (conf.wanfa.zuidafanshu == 3) {
            var compRadioButton1 = this.nodRule[0].getComponent("RadioButton");
            compRadioButton1.checked = false;
            var compRadioButton2 = this.nodRule[1].getComponent("RadioButton");
            compRadioButton2.checked = true;
            var compRadioButton3 = this.nodRule[2].getComponent("RadioButton");
            compRadioButton3.checked = false;
            compRadioButton1.refresh();
            compRadioButton2.refresh();
            compRadioButton3.refresh();
        } else if (conf.wanfa.zuidafanshu == 4) {
            var compRadioButton1 = this.nodRule[0].getComponent("RadioButton");
            compRadioButton1.checked = false;
            var compRadioButton2 = this.nodRule[1].getComponent("RadioButton");
            compRadioButton2.checked = false;
            var compRadioButton3 = this.nodRule[2].getComponent("RadioButton");
            compRadioButton3.checked = true;
            compRadioButton1.refresh();
            compRadioButton2.refresh();
            compRadioButton3.refresh();
        }

        var compCheckBox = this.nodRule[3].getComponent("CheckBox");
        if (compCheckBox) {
            if (conf.wanfa.fanbeibaozi == 1) {
                compCheckBox.checked = true;
            }
            else {
                compCheckBox.checked = false;
            }
            compCheckBox.refresh();
        }
        var compCheckBox = this.nodRule[4].getComponent("CheckBox");
        if (compCheckBox) {
            if (conf.wanfa.fanbeilianzhuang == 1) {
                compCheckBox.checked = true;
            }
            else {
                compCheckBox.checked = false;
            }
            compCheckBox.refresh();
        }
        var compCheckBox = this.nodRule[5].getComponent("CheckBox");
        if (compCheckBox) {
            if (conf.wanfa.fanbeipaixing == 1) {
                compCheckBox.checked = true;
            }
            else {
                compCheckBox.checked = false;
            }
            compCheckBox.refresh();
        }

        var compRadioButton6 = this.nodRule[6].getComponent("RadioButton");
        var compRadioButton7 = this.nodRule[7].getComponent("RadioButton");
        if (compRadioButton6 && compRadioButton7) {
            if (conf.wanfa.daipiao == 1) {
                compRadioButton7.checked = true;
                compRadioButton6.checked = false;

            }
            else {
                compRadioButton7.checked = false;
                compRadioButton6.checked = true;
            }
            compRadioButton6.refresh();
            compRadioButton7.refresh();
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
        // this.onCostBtnClicked();
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
