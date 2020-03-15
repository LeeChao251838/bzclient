cc.Class({
    extends: require("RoomConfigItem"),

    properties: {
        _isClub: false,

        free: cc.Node,
        _refreshtime: 0,
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
    },

    onCostBtnClicked() {
        // cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        var costIndex = 0;
        var playerIndex = 0;
        for (var i = 0; i < this.nodCost.length; i++) {
            var compRadioButton = this.nodCost[i].getComponent("RadioButton");
            if (compRadioButton && compRadioButton.checked) {
                costIndex = i;
                break;
            }
        }
        var maxGames = [4, 8, 16];
        for (var i = 0; i < this.nodRound.length; i++) {
            var roundNode = this.nodRound[i];
            var costLabel = roundNode.getChildByName("titlemax").getChildByName("num").getComponent(cc.Label);
            if (costIndex == 0) {
                // if(this.type == cc.GAMETYPE.PDK){
                for (var j = 0; j < this.nodPlayer.length; j++) {
                    var compRadioButton = this.nodPlayer[j].getComponent("RadioButton");
                    if (compRadioButton && compRadioButton.checked) {
                        playerIndex = j;
                        break;
                    }
                }
                if (playerIndex == 0) {
                    costLabel.string = "x" + cc.SZCardConfig[cc.GAMETYPE.PDK][1][i];
                }
                else {
                    costLabel.string = "x" + cc.SZCardConfig[cc.GAMETYPE.PDK][2][i];
                }
                // }
            }
            else if (costIndex == 1) {
                // if(this.type == cc.GAMETYPE.PDK){
                for (var j = 0; j < this.nodPlayer.length; j++) {
                    var compRadioButton = this.nodPlayer[j].getComponent("RadioButton");
                    if (compRadioButton && compRadioButton.checked) {
                        playerIndex = j;
                        break;
                    }
                }
                if (playerIndex == 0) {
                    costLabel.string = "x" + cc.SZCardConfig_AA[cc.GAMETYPE.PDK][2][i];
                }
                else {
                    costLabel.string = "x" + cc.SZCardConfig_AA[cc.GAMETYPE.PDK][2][i];
                }
                // }
            }
            if (playerIndex == 1) {
                this.nodGps.active = false;
            } else {
                this.nodGps.active = this._isClub;
            }
            // else if(costIndex == 2){
            //     // if(this.type == cc.GAMETYPE.PDK){
            //         for(var j = 0; j < this.nodPlayer.length; j++){
            //             var compRadioButton = this.nodPlayer[j].getComponent("RadioButton");
            //             if(compRadioButton && compRadioButton.checked){
            //                 playerIndex = j;
            //                 break;
            //             }
            //         }
            //         if(playerIndex == 0){
            //             labTitleMax.string = cc.NewCardStrConfig.gemsArrPDKWin[i];
            //         }
            //         else{
            //             labTitleMax.string = cc.NewCardStrConfig.gemsArrPDKTWOWin[i];
            //         }
            //     // }
            // }
        }
        
    },

    onPDKWinFirstClick() {
        var pdk_chupai = 0;
        for (var i = 0; i < 3; i++) {
            var compRadioButton = this.nodRule[i].getComponent("RadioButton");
            if (compRadioButton && compRadioButton.checked) {
                pdk_chupai = i;
                break;
            }
        }
        // var labTip = this.nodRule[10].getChildByName("labTip").getComponent(cc.Label);
        // if (pdk_chupai == 0) {  // 赢家先出
        //     labTip.string = "AAA是炸弹";
        // }
        // else{
        //     labTip.string = "333、AAA是炸弹";
        // }
    },

    loadCreateInfo(conf) {
        console.log("==>> loadCreateInfo --> conf: ", conf);
        // if(conf.type == cc.GAMETYPE.PDK){
        if (conf.aagems == 2) conf.aagems = 0;
        for (var i = 0; i < this.nodCost.length; i++) {
            var compRadioButton = this.nodCost[i].getComponent("RadioButton");
            if (compRadioButton) {
                compRadioButton.checked = conf.aagems == i;
                compRadioButton.refresh();
            }
            // if(conf.aagems == 3){
            //     var compRadioButton = this.nodCost[2].getComponent("RadioButton");
            //     if(compRadioButton){
            //         compRadioButton.checked = true;
            //         compRadioButton.refresh();
            //     }
            // }
        }
        for (var i = 0; i < this.nodRound.length; i++) {
            var compRadioButton = this.nodRound[i].getComponent("RadioButton");
            if (compRadioButton) {
                compRadioButton.checked = conf.xuanzejushu == i;
                compRadioButton.refresh();
            }
        }
        for (var i = 0; i < 3; i++) {
            var compRadioButton = this.nodRule[i].getComponent("RadioButton");
            var isContant = cc.fy.gameNetMgr.array_contain(conf.wanfa, i);
            if (compRadioButton) {
                compRadioButton.checked = isContant;
                compRadioButton.refresh();
            }
        }

        var isBiguan = cc.fy.gameNetMgr.array_contain(conf.wanfa, 5);
        var compRadioButton = this.nodRule[3].getComponent("RadioButton");
        if (compRadioButton) {
            compRadioButton.checked = !isBiguan;
            compRadioButton.refresh();
        }
        var compRadioButton = this.nodRule[4].getComponent("RadioButton");
        if (compRadioButton) {
            compRadioButton.checked = isBiguan;
            compRadioButton.refresh();
        }

        var isBombScore = cc.fy.gameNetMgr.array_contain(conf.wanfa, 9);
        var isBombDouble = cc.fy.gameNetMgr.array_contain(conf.wanfa, 4);

        for (var i = 5; i < 8; i++) {
            var compRadioButton = this.nodRule[i].getComponent("RadioButton");

            if (compRadioButton) {
                if (i == 5) {
                    compRadioButton.checked = !(isBombScore || isBombDouble);
                }
                else if (i == 6) {
                    compRadioButton.checked = isBombDouble;
                }
                else if (i == 7) {
                    compRadioButton.checked = isBombScore;
                }
                compRadioButton.refresh();
            }
        }
        var Cards_16 = cc.fy.gameNetMgr.array_contain(conf.wanfa, 7);
        for (var i = 8; i < 10; i++) {
            var compRadioButton = this.nodRule[i].getComponent("RadioButton");
            if (compRadioButton) {
                if (i == 8) {
                    compRadioButton.checked = Cards_16;
                }
                else if (i == 9) {
                    compRadioButton.checked = !Cards_16;
                }
                compRadioButton.refresh();
            }
        }
        // var compCheckBox = this.nodRule[8].getComponent("CheckBox");
        // if(compCheckBox){
        //     compCheckBox.checked = conf.pdk_sandaiyi == 1;
        //     compCheckBox.refresh();
        // }
        // var compCheckBox = this.nodRule[9].getComponent("CheckBox");
        // if(compCheckBox){
        //     compCheckBox.checked = conf.pdk_plane1 == 1;
        //     compCheckBox.refresh();
        // }
        var sandaiyi = cc.fy.gameNetMgr.array_contain(conf.wanfa, 6);
        var compCheckBox = this.nodRule[10].getComponent("CheckBox");
        if (compCheckBox) {
            compCheckBox.checked = sandaiyi;
            compCheckBox.refresh();
        }

        var renshu = [3, 2];
        for (var i = 0; i < this.nodPlayer.length; i++) {
            var compRadioButton = this.nodPlayer[i].getComponent("RadioButton");
            if (compRadioButton) {
                compRadioButton.checked = conf.maxCntOfPlayers == renshu[i];
                compRadioButton.refresh();
            }
        }
        for (var i = 0; i < this.nodBaseScore.length; i++) {
            var compRadioButton = this.nodBaseScore[i].getComponent("RadioButton");
            if (compRadioButton) {
                compRadioButton.checked = conf.difen == i;
                compRadioButton.refresh();
            }
        }
        // }
        // else{
        //     this.setContentByType(cc.GAMETYPE.YZDDH, true);
        //     this.setGameTypeByType(cc.GAMETYPE.YZDDH);
        // }

        this.onCostBtnClicked();
    },

    refreshState(isClub) {
        this.onPDKWinFirstClick();
        this.FreeCard();
        // if(this.type == cc.GAMETYPE.PDK){
        var title = "房主付费";
        if (isClub) {
            title = "圈主付费";

        }
        this._isClub = isClub;

        this.nodGps.active = isClub;
        this.nodCost[0].getChildByName("title").getComponent(cc.Label).string = title;
        // }
        this.onCostBtnClicked();
    },

    //刷新限免的配置
    FreeCard: function () {
        var isFree = false;

        var inFreeDay = false;//在活动当天

        var freeList = cc.fy.global.cardFree;
        var starttime = 0;
        var endtime = 0;
        if (freeList != null && freeList.length > 0) {
            for (let i = 0; i < freeList.length; i++) {
                if (freeList[i].main_type != cc.GAMETYPE.PDK) {
                    continue;
                }
                console.log("type  pdk", freeList[i]);
                var time = freeList[i].time;
                time = JSON.parse(time);
                var _Date = new Date();
                var timenow = _Date.getTime();
                var today = _Date.getFullYear() + "/" + _Date.getMonth() + "/" + _Date.getDate();
                console.log(time);
                time.sort(function (a, b) {
                    return b.starttime - a.starttime;
                });
                for (let j = 0; j < time.length; j++) {
                    //计算是否在活动当天
                    var startDate = new Date(time[j].starttime);
                    var startday = startDate.getFullYear() + "/" + startDate.getMonth() + "/" + startDate.getDate();
                    if (startday == today) {
                        if (inFreeDay == true) {
                            if (timenow < time[j].endtime) {
                                starttime = time[j].starttime;
                                endtime = time[j].endtime;
                            }
                        } else {
                            inFreeDay = true;
                            starttime = time[j].starttime;
                            endtime = time[j].endtime;
                        }
                    }
                    //显示的时间段，一天可能有两个时间段


                    //判断是否在时间段内
                    if (timenow > time[j].starttime && timenow < time[j].endtime) {
                        isFree = true;
                    }
                }
            }
        }
        if (inFreeDay) {
            this.free.active = true;
            var timestr = this.free.getComponent(cc.Label);
            var freetime = "房卡限免";

            if (starttime > 0 && endtime > 0) {
                var date1 = new Date(starttime);
                var date2 = new Date(endtime);
                var h1 = date1.getHours();
                var min1 = date1.getMinutes();
                min1 = min1 < 10 ? ("0" + min1) : min1;
                var h2 = date2.getHours();
                var min2 = date2.getMinutes();
                if (h2 == 0 && min2 == 0) {
                    h2 = 24;
                }
                min2 = min2 < 10 ? ("0" + min2) : min2;
                freetime = h1 + ":" + min1 + "~" + h2 + ":" + min2 + freetime;
            }
            timestr.string = freetime;

        } else {
            this.free.active = false;
        }

        for (let i = 0; i < this.nodRound.length; i++) {
            var titlemax = this.nodRound[i].getChildByName("titlemax");
            var freeline = titlemax.getChildByName("freeline");
            var num = titlemax.getChildByName("num");
            var card = titlemax.getChildByName("card");
            freeline.active = isFree;
            if (isFree) {
                num.color = new cc.Color(105, 105, 105);
            } else {
                num.color = new cc.Color(135, 50, 39);
            }
            card.getComponent(cc.Button).interactable = !isFree;
        }
    },

    //刷新界面限免
    update(dt) {
        this._refreshtime += dt;
        if (this._refreshtime < 5) {
            return;
        }
        this._refreshtime = 0;
        this.FreeCard();
    },
});
