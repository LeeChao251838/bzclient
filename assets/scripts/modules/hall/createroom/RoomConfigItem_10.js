cc.Class({
    extends: require("RoomConfigItem"),

    properties: {
        nodTop:{
            tooltip:"封顶",
            default:[],
            type:cc.Node
        },
    },

    onCostBtnClicked(){
        // cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        var costIndex = 0;
        //房主、AA、大赢家
        for(var i = 0; i < this.nodCost.length; i++){
            var compRadioButton = this.nodCost[i].getComponent("RadioButton");
            if(compRadioButton && compRadioButton.checked){
                costIndex = i;
                break;
            }
        }
        //局数
        let rounds=[6, 8, 16];
        let card=1;
        for(var i = 0; i < this.nodRound.length; i++){
            var roundNode = this.nodRound[i];
            var labTitleMax = roundNode.getChildByName("cardNum").getComponent(cc.Label);
            if(costIndex == 0){
                card = cc.SZCardConfig[this.type][i];
            }
            else if(costIndex == 1){
                card= cc.SZCardConfig_AA[this.type][i];
            }
            else if(costIndex == 2){
                card= cc.SZCardConfig_DYJ[this.type][i];
            }
            labTitleMax.string=rounds[i]+"局(     x"+card+")";
        }
    },

    //控制叫分、叫地主可选状态
    onRuleBtnClicked(){
        var randioButton0=this.nodRule[4].getComponent("RadioButton");
        var randioButton1=this.nodRule[5].getComponent("RadioButton");

        var checkJiaoFen=this.nodRule[6].getComponent("CheckBox");
        var button0=this.nodRule[6].getChildByName("button").getComponent(cc.Button);
        var button1=this.nodRule[6].getChildByName("title").getComponent(cc.Button);
        if(randioButton0 && randioButton0.checked){
            checkJiaoFen.checked=false;
            checkJiaoFen.refresh();
            if(button0 && button1){
                button0.interactable=false;
                button1.interactable=false;
            }
        }
        if(randioButton1 && randioButton1.checked){
            if(button0 && button1){
                button0.interactable=true;
                button1.interactable=true;
            }
        }
    },
    loadCreateInfo(conf){
        console.log("==>> loadCreateInfo --> conf: ", conf);
        // exports.WanFa = {
	    //     BuFengDing:0,		//不封顶
	    //     FD12:1,				//封顶12
	    //     FD24:2,				//封顶24
	    //     FD48:3,				//封顶48
	    //     LandLord:4,			//叫地主
	    //     CallScore:5,		//叫分
	    //     CallThreeScore:6,   //王炸、2炸叫3分
	    //     Double: 7,			//加倍
	    //     ShowHand: 8,		//明牌
        // }
        //底分
        for(var i = 0; i < this.nodBaseScore.length; i++){
            var compRadioButton = this.nodBaseScore[i].getComponent("RadioButton");
            if(compRadioButton){
                compRadioButton.check(conf.baseScore == i+1);
            }
        }
         //局数
        for(var i = 0; i < this.nodRound.length; i++){
            var compRadioButton = this.nodRound[i].getComponent("RadioButton");
            if(compRadioButton){
                compRadioButton.check(conf.xuanzejushu == i);
            }
        }
        //玩法
        for(var i = 0; i < this.nodRule.length; i++){
            var isContain = cc.fy.utils.array_contain(conf.wanfa, i);
            var compRadioButton = this.nodRule[i].getComponent("RadioButton");
            if(compRadioButton){
                compRadioButton.check(isContain);
            }
            var compCheckBox = this.nodRule[i].getComponent("CheckBox");
            if(compCheckBox){
                compCheckBox.checked=isContain;
                compCheckBox.refresh();
            }
            if(i==4 && isContain==true ){
                var button0=this.nodRule[6].getChildByName("button").getComponent(cc.Button);
                var button1=this.nodRule[6].getChildByName("title").getComponent(cc.Button);
                if(button0 && button1){
                    button0.interactable=false;
                    button1.interactable=false;
                }
            }
        }

        //付费方式
        //支付方式
        if(conf.aagems == 2) conf.aagems = 0;   //房主、群主同一个按钮
        for(var i = 0; i < this.nodCost.length; i++){
            var compRadioButton = this.nodCost[i].getComponent("RadioButton");
            if(compRadioButton){
                compRadioButton.check(conf.aagems == i);
            }
        }
        // if(conf.aagems == 3){
        //     this.nodCost[2].getComponent("RadioButton").check(true);
        // }
        
        
        this.onCostBtnClicked();
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
