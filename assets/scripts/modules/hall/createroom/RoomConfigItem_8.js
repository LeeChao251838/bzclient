cc.Class({
    extends: require("RoomConfigItem"),

    properties: {
    },

    onCostBtnClicked(){
        // cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        var costIndex = 0;
        for(var i = 0; i < this.nodCost.length; i++){
            var compRadioButton = this.nodCost[i].getComponent("RadioButton");
            if(compRadioButton && compRadioButton.checked){
                costIndex = i;
                break;
            }
        }
        var playerIndex = 0;
        for(var i = 0; i < this.nodPlayer.length; i++){
            var compRadioButton = this.nodPlayer[i].getComponent("RadioButton");
            if(compRadioButton && compRadioButton.checked){
                playerIndex = i;
                break;
            }
        }
        let jushu = [4,8,16];
        let conStr = "局(     x";
        let endStr = ")";
        let titleStr = "";
        for(var i = 0; i < this.nodRound.length; i++){
            var roundNode = this.nodRound[i];
            var labTitleMax = roundNode.getChildByName("titlemax").getComponent(cc.Label);
            titleStr = jushu[i] + conStr;
            if(costIndex == 0){
                titleStr += cc.SZCardConfig[this.type][playerIndex][i];
            }
            else if(costIndex == 1){
                titleStr += cc.SZCardConfig_AA[this.type][playerIndex][i];
            }
            else if(costIndex == 2){
                titleStr += cc.SZCardConfig_DYJ[this.type][playerIndex][i];
            }
            titleStr += endStr;
            labTitleMax.string = titleStr;
        }
    },

    loadCreateInfo(conf){
        console.log("==>> loadCreateInfo --> conf: ", conf);
        for(var i = 0; i < this.nodPlayer.length; i++){
            var compRadioButton = this.nodPlayer[i].getComponent("RadioButton");
            if(compRadioButton){
                if(i == conf.renshu){
                    compRadioButton.checked = true//conf.maxCntOfPlayers == 4;
                }
                else{
                    compRadioButton.checked = false//conf.maxCntOfPlayers == 3;
                }
                compRadioButton.refresh();
            }
        }
        for(var i = 0; i < this.nodRule.length; ++i){
            var compRadioButton = this.nodRule[i].getComponent("RadioButton");
            if(compRadioButton){
                if(cc.fy.utils.array_contain(conf.wanfa, i)){
                    compRadioButton.checked = true;
                }
                else{
                    compRadioButton.checked = false;
                }
                compRadioButton.refresh();
            }
            var compCheckBox = this.nodRule[i].getComponent("CheckBox");
            if(compCheckBox){
                if(cc.fy.utils.array_contain(conf.wanfa, i)){
                    compCheckBox.checked = true;
                }
                else{
                    compCheckBox.checked = false;
                }
                compCheckBox.refresh();
            }
        }
        if(conf.aagems == 2) conf.aagems = 0;
        for(var i = 0; i < this.nodCost.length; ++i){
            var compRadioButton = this.nodCost[i].getComponent("RadioButton");
            if(compRadioButton){
                if(conf.aagems == i){
                    compRadioButton.checked = true;
                }
                else{
                    compRadioButton.checked = false;
                }
                if(conf.aagems == 3){
                    this.nodCost[2].getComponent("RadioButton").checked = true;
                }
                compRadioButton.refresh();
            }
        }
        for(var i = 0; i < this.nodRound.length; ++i){
            var compRadioButton = this.nodRound[i].getComponent("RadioButton");
            if(compRadioButton){
                if(conf.xuanzejushu == i){
                    compRadioButton.checked = true;
                }
                else{
                    compRadioButton.checked = false;
                }
                compRadioButton.refresh();
            }
        }
       // this.onCostBtnClicked();
    },

    refreshState(isClub){
        var title = "房主付费";
        if(isClub){
            title = "圈主付费";
        }
         this.nodGps.active=isClub;
        this.nodCost[0].getChildByName("title").getComponent(cc.Label).string = title;

        this.onCostBtnClicked();
    }
});
