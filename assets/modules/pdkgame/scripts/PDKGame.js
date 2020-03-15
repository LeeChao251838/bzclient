var PokerDef = require("PDKPokerDef");
var GameMsgDef = require("GameMsgDef");
cc.Class({
    extends: cc.Component,

    properties: {
        gameRoot:{
            default:null,         //游戏节点
            type:cc.Node
        },

        prepareRoot:{             //准备游戏节点
            default: null,
            type: cc.Node
        },

        _gameChild: null,          //game节点
        _gamecount: null,          //局数节点
        _ndOps: null,              //操作节点
        _buchu: null,              //不出节点
        _yaobuqi:null,             // 要不起按钮节点

        _gamecurrent: 0,           //当前局数
        _gametotal: 0,             //总局数
        _gameplayer: 3,            //玩家数目
        _ndLeftCards:[],           //剩余手牌父节点   
        _leftCards: [],            //剩余牌数
        _baodan: [],               //报单状态

        _replay: false,            //回放
        isBaodan:false,//是否报过单 用来播放报单背景
        selfBaodan:false, //自己是否报过单  播放自己的报单音 （自己不亮灯）

          
    },

    // use this for initialization
    onLoad: function () {
       

        if(!cc.fy){
            cc.fy.sceneMgr.loadScene("loading");
            return;
        }
       

        

        // 临界点情况 解散包厢
        if((cc.fy.replayMgr.isReplay() == false && cc.fy.gameNetMgr.isOver == true) || (cc.fy.gameNetMgr.dissoveData && cc.fy.gameNetMgr.dissoveData.time <= 0)){
            this.gameRoot.active = false;
            this.prepareRoot.active = false;
            cc.fy.alert.show("房间已解散！",function(){
                cc.fy.sceneMgr.loadScene("hall");    
            });
            this.node.emit('reconnecthide');
            
            return;
        }
        // 多次断线情况
        // if(cc.fy.gameNetMgr.roomId == null){
        //     this.gameRoot.active = false;
        //     this.prepareRoot.active = false;
        //     cc.fy.alert.show("与游戏服务器断开连接，点击确定重新登录！",function(){
        //         cc.fy.sceneMgr.loadScene("login");
        //     });
        //     this.node.emit('reconnecthide');
        //     return;
        // }

        if(cc.fy.gameNetMgr.seats == null){
            cc.fy.alert.show("该房间已解散",function(){
                cc.fy.sceneMgr.loadScene("hall");    
            });
            console.log("cc.fy.gameNetMgr.seats is null");
            return;
        }

        this._gameplayer = cc.fy.gameNetMgr.seats.length;//cc.fy.gameNetMgr.conf.maxCntOfPlayers;
         
        //动态加载脚本
        
        this.addComponent("PDKGameRoom");
        this.addComponent("PDKGameHolds");
        this.addComponent("PDKGameFolds");
       
        this.addComponent("PDKTimePointer");
        this.addComponent("PDKAniSound");

        // this.addComponent("UserInfoShow");//改模板预制
        // this.addComponent("showgps");//改成模板预制
      
        // this.addComponent("ReConnect");
        this.addComponent("ReplayCtrl");

        this.gameRoot.active = false;
        this.prepareRoot.active = true;
        this.isBaodan=false;
        this.selfBaodan=false;
        
        this.initEventHandlers();
        this.initView();
        // this.initVoice();
        cc.fy.audioMgr.playBGM("bgm_table.mp3",cc.GAMETYPE.PDK) 
        if(cc.fy.replayMgr.isReplay()){
            this.onGameBeign();     
            this._replay = true;
            //this.gameRoot.getChildByName("gamejushu").active = false;
        }

        this.initJuShuLabel();
        this.initWanfaLabel();
        this.initNewView();  
     
       
        cc.fy.global.loginScene = false;
    },
   
    initView: function(){
        var debugbtn = this.node.getChildByName("btnDebug");
        if(cc.DEBUGBTN == true)
        {
            debugbtn.active = true;
        }
        else
        {
            debugbtn.active = false;
        }

        this._gameChild = this.node.getChildByName("game");
        this._ndOps = this._gameChild.getChildByName("ops");
        
       
        this._leftCards= [];         //剩余牌数
        this._baodan= [];   
        var sides = [];
        if(this._gameplayer == 3)
        {
            sides = ["myself","right","left"];
        }
        else{
            sides = ["myself","up"];
        }

        for(var i = 0; i < sides.length; ++i)
        {
            var side = sides[i];
            var sideChild = this._gameChild.getChildByName(side);
            sideChild.active = true;
            var cardnum = sideChild.getChildByName("cardnum");
            if(cardnum){
                var leftCard = cardnum.getChildByName("leftCard");
                cardnum.active = false;
                var lable = leftCard.getComponent(cc.Label);
                this._leftCards[i]=lable;
                this._ndLeftCards[i]=cardnum;
            }
            var baodan = sideChild.getChildByName("ainBaoDan");
            if(baodan){
                this._baodan[i]=baodan.getComponent(sp.Skeleton);
            }    
        }
        //报单是播放报单背景音
        

        //不出、提示、出牌、要不起
        this._buchu = this._ndOps.getChildByName("btnGuo");
        if (this._buchu) {
            cc.fy.utils.addClickEvent(this._buchu, this.node, "PDKGame", "onGuoClick");
        }
        this._yaobuqi = this._ndOps.getChildByName("btnYaobuqi");
        if (this._yaobuqi) {
            cc.fy.utils.addClickEvent(this._yaobuqi, this.node, "PDKGame", "onGuoClick");
        }


        var tishi = this._ndOps.getChildByName("btnTip");
        if (tishi) {
            cc.fy.utils.addClickEvent(tishi, this.node, "PDKGame", "onTipClick");
        }

        var chupai = this._ndOps.getChildByName("btnPlayCard");
        if (chupai) {
            cc.fy.utils.addClickEvent(chupai, this.node, "PDKGame", "onPlayCardClick");
        }

       
        
    },

    initNewView: function(){
        if(cc.fy.pdkGameNetMgr.gamebegin != null && !this._replay){
            var data = cc.fy.pdkGameNetMgr.gamebegin;
            cc.fy.pdkGameNetMgr.dispatchEvent('pdk_game_begin', data);
        }

        if(cc.fy.pdkGameNetMgr.juNum != null && !this._replay){
            var data = cc.fy.pdkGameNetMgr.juNum;
            console.log('______________________111111111111111');
            cc.fy.pdkGameNetMgr.dispatchEvent('pdk_game_num', data);
        }

        if(cc.fy.pdkGameNetMgr.gamestate != "playing" && cc.fy.pdkGameNetMgr.holds.length != 0 && !this._replay){
            var data = cc.fy.pdkGameNetMgr.holds;
            cc.fy.pdkGameNetMgr.dispatchEvent('cc_pdk_stc_dealcard', data);
        }

        if(cc.fy.pdkGameNetMgr.playbegin != null && !this._replay){
            var data = cc.fy.pdkGameNetMgr.playbegin;
            cc.fy.pdkGameNetMgr.doPlayBegin(data);
        }

        if(cc.fy.pdkGameNetMgr.gamedata != null && !this._replay){
            var data = cc.fy.pdkGameNetMgr.gamedata;
            cc.fy.pdkGameNetMgr.dispatchEvent('cc_pdk_stc_gamedata', data);
        }

        if(cc.fy.pdkGameNetMgr.playeddata != null && !this._replay){
            setTimeout(function(){
                var data = cc.fy.pdkGameNetMgr.playeddata;
                cc.fy.pdkGameNetMgr.doPlay(data);
            },1);
        }

        if(this._replay){
            var data = null;
            cc.fy.pdkGameNetMgr.dispatchEvent('pdk_reply', data);
        }
    },

    initEventHandlers: function(){
        console.log("PDKGame initEventHandles");
        var game=cc.fy.gameNetMgr;
        var self = this;

        game.addHandler('pdk_game_begin',function(data){
            self.onGameBeign(true);
        });

        game.addHandler('pdk_game_num',function(data){
            console.log('+++++++++++   111111111111');
            self.updateGameNum(data);
        });

        game.addHandler('cc_pdk_stc_gamedata',function(data){
            console.log("PDKGame cc_pdk_stc_gamedata"+JSON.stringify(data));
            

            var num = cc.fy.gameNetMgr.numOfGames;
            self.updateGameNum(num);
            cc.fy.pdkGameNetMgr.doTurnChange(data.curTurn);
            // setTimeout(function(){
            //     cc.fy.pdkGameNetMgr.doTurnChange(data.curTurn);
            // },10);

            self.onGameBeign();

        });

        // 轮到出牌
        game.addHandler('pdk_game_chupai',function(data){
            console.log("pdk_game_chupai");
            self.initOps();
        });

         // 出牌消息
         game.addHandler('cc_pdk_stc_playcard', function(data){
           
            self.showLeftCard(data.seatIndex, data.leftCardCnt);
        });

        //游戏结束
        game.addHandler('pdk_game_over',function(data){
            self.gameRoot.active = false;
            self.prepareRoot.active = true;
            self.hideOps();
            self.hideAllLeftCard();
            self.resetBaoDan();
        });
        
    },

    // 不出
    onGuoClick:function (){
        cc.fy.pdkGameNetMgr.dispatchEvent('cc_pdk_cts_playcard', []);
    },

    // 提示
    onTipClick:function (){
        cc.fy.pdkGameNetMgr.dispatchEvent('cc_pdk_bigertip');
    },

     // 出牌
     onPlayCardClick:function (){
        cc.fy.pdkGameNetMgr.dispatchEvent('cc_pdk_cts_playcard');
    },

    //初始化玩法
    initWanfaLabel:function(){
        var wanfa = cc.find("infobar/wanfabg/wanfa",this.node).getComponent(cc.Label);
       // if(cc.fy.replayMgr.isReplay() == false){
            wanfa.string = this._gameplayer + "人 " + cc.fy.gameNetMgr.getWanfa();     
            var width=cc.find("infobar/wanfabg/wanfa",this.node).width;
            cc.find("infobar/wanfabg",this.node).width=width+20;
       // }else{
            // var wanfabg = cc.find("Canvas/infobar/wanfabg");
            // wanfabg.active = false;
       // }
    },

    //初始化局数
    initJuShuLabel:function(){
        this._gamecount = cc.find("infobar/left/gamecount",this.node).getComponent(cc.Label); 

        var maxNumOfGames = [4,8,16];
        this._gametotal = maxNumOfGames[cc.fy.gameNetMgr.conf.xuanzejushu];

        console.log(" cc.fy.gameNetMgr.maxNumOfGames = " , cc.fy.gameNetMgr.conf);
        if(this._gametotal <= 0 || cc.fy.replayMgr.isReplay()){
            this._gamecount.node.active = true;
            var roomInfo=cc.fy.pdkGameNetMgr._replayConf
            if(roomInfo){
                 this._gamecount.string = (roomInfo.idx+1)+"/"+roomInfo.maxGames;
            }
        }
        else{
            this._gamecount.node.active = true;
            this._gamecount.string =  this._gamecurrent + "/" + this._gametotal ;
        }
    },

    //开始游戏
    onGameBeign: function(isDelay){
       
        console.log("PDKGame onGameBeign");
        if(cc.fy.gameNetMgr.gamestate == "" && cc.fy.replayMgr.isReplay() == false){
            console.log("PDKGame not onGameBeign");
            return;
        }
       
        this.gameRoot.active = true;
        this.prepareRoot.active = false;
        this.isBaodan=false;
        this.selfBaodan=false;
        
        for(var i = 0; i < cc.fy.gameNetMgr.seats.length; i++){
            console.log("---gameNetMgr.seats.length = " + cc.fy.gameNetMgr.seats.length);
            var si = cc.fy.gameNetMgr.getLocalIndex(i);
            var leftNums = cc.fy.pdkGameNetMgr.leftNums;

            // 游戏开始，初始化剩余张数16
            if(leftNums == null || leftNums.length == 0){
                if(cc.fy.replayMgr.isReplay() == false){
                    var holdsCount = cc.fy.gameNetMgr.conf.wanfa.indexOf(7) >= 0 ? 16 : 15;
                }
                
                if(this._gameplayer == 3){
                    cc.fy.pdkGameNetMgr.leftNums = leftNums = [holdsCount,holdsCount,holdsCount];
                }
                else
                {
                    cc.fy.pdkGameNetMgr.leftNums = leftNums = [holdsCount,holdsCount];
                }
            }

            if(leftNums[i] >= 0){
                this.showLeftCard(i, leftNums[i],true);
            }
        }
        if(isDelay&&this._ndLeftCards!=null &&this._ndLeftCards.length>0){
            for(let i=0;i<this._ndLeftCards.length;i++){
                if(i==0){
                    continue;
                }
            }
            setTimeout(function(){
                for(let i=0;i<this._ndLeftCards.length;i++){           
                    if(i==0){
                        continue;
                    }
                    this._ndLeftCards[i].active=true;        
                }
            }.bind(this),1500);
           
        }
    },

    //显示剩余牌数
    showLeftCard: function(seat,num,isFirst=false){
        //isFirst一一进来开始
        console.log("pdkgame seat = "+ seat +",card num = "+ num);

        var nums=cc.fy.pdkGameNetMgr.leftNums;
        var localIndex = cc.fy.gameNetMgr.getLocalIndex(seat);
        if(cc.fy.replayMgr.isReplay()){
            this.hideAllLeftCard();
            return;
        }
        if(!this.isBaodan){
            if(nums){
                if(nums.length>0){
                    for(let n=0;n<nums.length;n++){
                        if(nums[n]==1){
                           this.isBaodan=true;
                        }
                    }
                }
            }
            if(this.isBaodan){
                cc.fy.audioMgr.playBGM("bgm_baodan.mp3",cc.GAMETYPE.PDK)  
                
            }
        }
        if(isFirst){
            if(localIndex == 0){
                return;
            }                   
            if(this._baodan[localIndex]){
                if(num == 1 && this._baodan[localIndex].node.active == false){                  
                    this._baodan[localIndex].node.active = true;
                }
            }
    
            if(this._leftCards[localIndex]){
                this._leftCards[localIndex].node.parent.active = true;
                this._leftCards[localIndex].string = num;       
                var leftSpr=this._leftCards[localIndex].node.parent.getChildByName("spr").getComponent(cc.Sprite);
                if(leftSpr){
                    if(num==0){
                        leftSpr.node.active=false;
                        return;
                    }
                    leftSpr.node.active=true;
                    var _num=num;
                    if(_num>=9){
                        _num=9;
                    }else if(_num>=5){
                        _num=5;
                    }
                    cc.fy.resMgr.setSpriteFrameByUrl("images/pdk/leftCards/"+_num,leftSpr);
                }
            }
        }else{
            if(localIndex == 0){
                if(!this.selfBaodan){
                    if(num == 1){  
                        this.selfBaodan=true;                
                        cc.fy.pdkGameNetMgr.dispatchEvent('cc_pdk_baodan', seat);  
                    }
                }
            }else{
                if(this._baodan[localIndex]){
                    if(num == 1 && this._baodan[localIndex].node.active == false){                  
                        this._baodan[localIndex].node.active = true;
                        cc.fy.pdkGameNetMgr.dispatchEvent('cc_pdk_baodan', seat);  
                    }
                }
        
                if(this._leftCards[localIndex]){
                    this._leftCards[localIndex].node.parent.active = true;
                    this._leftCards[localIndex].string = num;       
                    var leftSpr=this._leftCards[localIndex].node.parent.getChildByName("spr").getComponent(cc.Sprite);
                    if(leftSpr){
                        if(num==0){
                            leftSpr.node.active=false;
                            return;
                        }
                        leftSpr.node.active=true;
                        var _num=num;
                        if(_num>=9){
                            _num=9;
                        }else if(_num>=5){
                            _num=5;
                        }
                        cc.fy.resMgr.setSpriteFrameByUrl("images/pdk/leftCards/"+_num,leftSpr);
                    }
                }
            }
        }
       
     
        
        
    },

    //隐藏操作界面
    hideOps:function(){
        this._ndOps.active = false;
        console.log("hideops false")
    },

    //隐藏剩余牌数
    hideAllLeftCard:function(){
        for(var i = 0; i < this._leftCards.length; i++){
            if(this._leftCards[i]){
                this._leftCards[i].node.parent.active = false;   
            }
        }
    },

    //更新局数
    updateGameNum:function(data){
        this._gamecurrent = data;
        cc.fy.pdkGameNetMgr.juNum=data;
        this._gamecount.string =  this._gamecurrent + "/" + this._gametotal ;
    },

    //初始化操作管理
    initOps: function(){
        console.log(" turn = " + cc.fy.pdkGameNetMgr.turn + ",seatIndex = " + cc.fy.gameNetMgr.seatIndex);
        var pdkMgr = cc.fy.pdkGameNetMgr;

        if(cc.fy.pdkGameNetMgr.isNoLeftCards()){
             this._ndOps.active = false;
        }

        if(cc.fy.replayMgr.isReplay() == false && cc.fy.pdkGameNetMgr.turn == cc.fy.gameNetMgr.seatIndex){
           
            var btnBuchu = this._ndOps.getChildByName("btnGuo").getComponent(cc.Button);
            var btnTip = this._ndOps.getChildByName("btnTip").getComponent(cc.Button);
            var chupai = this._ndOps.getChildByName("btnPlayCard").getComponent(cc.Button);
            this._ndOps.active = true;
            console.log("intiops true");
            //默认不显示 要不起
            this._yaobuqi.active=false;
            this._buchu.active=true;
            btnTip.node.active=true;
            chupai.node.active=true;

            //必管
            if(cc.fy.gameNetMgr.conf.wanfa.indexOf(5) >= 0){
                this._buchu.active = false;
            }

            //自己出牌
            if(cc.fy.pdkGameNetMgr.lastPlayedCards == null || cc.fy.pdkGameNetMgr.lastPlayedCards.length == 0){
                btnBuchu.interactable = false;
              //  btnTip.interactable = false;
               // chupai.interactable = false;//可出牌,要先选了牌再变可出
            }
            else{
                //检查有没有可出的牌
                console.log("lastplaycards："+cc.fy.pdkGameNetMgr.lastPlayedCards,"holds:"+cc.fy.pdkGameNetMgr.holds)
                if(!cc.fy.PDKGameMgr.checkHaveOutCard(cc.fy.pdkGameNetMgr.lastPlayedCards,cc.fy.pdkGameNetMgr.holds)){
                    //chupai.interactable = false; //要不起
                    this._yaobuqi.active=true;
                    this._buchu.active=false;
                    btnTip.node.active=false;
                    chupai.node.active=false;
                }
                else{
                   // chupai.interactable = false;//可出牌,要先选了牌再变可出
                }
               // btnTip.interactable = true; //提示按钮

                if(cc.fy.gameNetMgr.conf.wanfa.indexOf(7) >= 0){
                    if(cc.fy.pdkGameNetMgr.lastPlayedCards.length == 1){
                        console.log("LastPlayedCards=====",cc.fy.pdkGameNetMgr.lastPlayedCards[0]);
                        var point = cc.fy.PDKGameMgr.getPoint(cc.fy.pdkGameNetMgr.lastPlayedCards[0]);
                        console.log("point=====",point);
                        if(point == PokerDef.PokerPoint.PT_A){
                            for(var i = 0; i < cc.fy.pdkGameNetMgr.holds.length; i++){
                                var holdPoint = cc.fy.PDKGameMgr.getPoint(cc.fy.pdkGameNetMgr.holds[i]);
                                if(holdPoint == PokerDef.PokerPoint.PT_2){
                                    btnBuchu.interactable = false;
                                    return;
                                }
                            }
                        }
                    }
                }            

                if(pdkMgr.leftNums[pdkMgr.getNextSeat(pdkMgr.turn)] == 1){
                    btnBuchu.interactable = false;
                    return;
                }
                btnBuchu.interactable = true;   
            }
        }
        else{
            this._ndOps.active = false;
            console.log("intops false ");
        }
    },
    
    //清楚报单
    resetBaoDan: function(){
        for(var i = 0; i < cc.fy.gameNetMgr.seats.length; i++){
            if(this._baodan[i]){
                this._baodan[i].node.active = false;
            }
        }
    },
    

    onBtnGps(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");   
        cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWGPSALERTVIEW_CTC, { isShow: true, isForce: true });
    },

    //调试
    onDebugButtonClick:function()
    {
        if(this.debugNode == null)
        {
            this.debugNode = this.node.getChildByName("cmdDebug");
        }
        this.debugNode.active = !this.debugNode.active;
    },

    onDestroy:function(){
        if(cc.fy && !cc.fy.gameNetMgr.isReturn){
            cc.fy.gameNetMgr.clear();
        }
        cc.fy.gameNetMgr.isReturn = false;
    },

    update:function(dt){
        if(cc.fy.replayMgr.isReplay() || cc.fy.gameNetMgr.gamestate != "playing"){
            return;
        }
    },

});
