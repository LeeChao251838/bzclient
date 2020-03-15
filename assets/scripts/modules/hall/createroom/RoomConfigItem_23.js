cc.Class({
    extends: require("RoomConfigItem"),

    properties: {
        difenLabel: cc.Label,
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

        for (var i = 0; i < this.nodBaseScore.length; ++i) {
            var compRadioButton = this.nodBaseScore[i].getComponent("RadioButton");
            if (compRadioButton && compRadioButton.checked) {
                var labTitle = this.nodBaseScore[i].getChildByName("title").getComponent(cc.Label);

                this.difenLabel.string = labTitle.string
                compRadioButton.refresh();
            }
        }

    },

    loadCreateInfo(conf) {
        console.log("==>> loadCreateInfo --> conf: ", conf);
        var difenNum = conf.difen;
        if (conf.difen == 0) {
            difenNum = 0;
        } else if (conf.difen == 1) {
            difenNum = 1;
        } else if (conf.difen == 4) {
            difenNum = 2;
        } else {
            difenNum = 3;
        }
        for (var i = 0; i < this.nodBaseScore.length; ++i) {
            var compRadioButton = this.nodBaseScore[i].getComponent("RadioButton");
            if (compRadioButton) {
                if (difenNum == i) {
                    compRadioButton.checked = true;
                    if (difenNum == 3) {
                        this.nodBaseScore[i].getChildByName("title").getComponent(cc.Label).string = conf.difen + 1;
                    }
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
                // else if(i == 2){
                //     compRadioButton.checked = conf.maxCntOfPlayers == 2;
                // }
                compRadioButton.refresh();
            }
        }
        for (var i = 0; i < this.nodRule.length; ++i) {
            var compCheckBox = this.nodRule[i].getComponent("CheckBox");
            if (compCheckBox) {
                if (conf.wanfa.isHuangFan) {
                    this.nodRule[0].getComponent("CheckBox").checked = true;
                } else {
                    this.nodRule[0].getComponent("CheckBox").checked = false;
                }
                if (conf.wanfa.isHuangFengFan) {
                    this.nodRule[1].getComponent("CheckBox").checked = true;
                } else {
                    this.nodRule[1].getComponent("CheckBox").checked = false;
                }
                if (conf.wanfa.isQiangGangHu) {
                    this.nodRule[2].getComponent("CheckBox").checked = true;
                } else {
                    this.nodRule[2].getComponent("CheckBox").checked = false;
                }
                compCheckBox.refresh();
            }
        }
        if (conf.aagems == 2) conf.aagems = 0;
        console.log("aagems" + conf.aagems);
        for (var i = 0; i < this.nodCost.length; ++i) {
            var compRadioButton = this.nodCost[i].getComponent("RadioButton");
            if (compRadioButton) {
                if (conf.aagems == i) {
                    compRadioButton.checked = true;
                }
                else {
                    compRadioButton.checked = false;
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
        this.difenLabel.string = conf.difen
        this.huangfanClick()
        this.onCostBtnClicked();
    },
    onPlusScore(event) {
        let labScore = event.target.parent.getChildByName('title').getComponent(cc.Label);
        let content = labScore.string;
        let num = parseInt(content);
        if (num < 10) {
            num++;
        }

        labScore.string = num;
        event.target.parent.getComponent("RadioButton").onClicked();
        this.difenLabel.string = num
    },

    onMinusScore(event) {
        let labScore = event.target.parent.getChildByName('title').getComponent(cc.Label);
        let content = labScore.string;
        let num = parseInt(content);
        if (num > 1) {
            num--;
        }

        labScore.string = num;
        event.target.parent.getComponent("RadioButton").onClicked();
        this.difenLabel.string = num
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
    },
    huangfanClick(event) {
        let checked = this.nodRule[0].getComponent('CheckBox').checked
        if (checked) {
            this.nodRule[1].getChildByName('button').getComponent(cc.Button).interactable = true;
            this.nodRule[1].getChildByName('title').getComponent(cc.Button).interactable = true;
            //this.nodRule[1].getComponent("CheckBox").checked = false;
        } else {
            this.nodRule[1].getChildByName('button').getComponent(cc.Button).interactable = false;
            this.nodRule[1].getChildByName('title').getComponent(cc.Button).interactable = false;
            this.nodRule[1].getComponent("CheckBox").checked = false;

        }
        this.nodRule[1].getComponent("CheckBox").refresh()
    }
});
