var PokerDef = require("PDKPokerDef");
cc.Class({
    extends: cc.Component,

    properties: {
        
        leftNums: [],            //剩余牌数
        holds: [],               //初始手牌
        folds: [],               //出的牌
        hands: [],               //所有玩家手牌
        lastPlayedCards: [],     //上几次打的牌
        playbegin: null,         //首轮出牌玩家数据
        actionId: -1,            //操作id
        turn: -1,                //当前出牌玩家
        lastTurn: -1,            //下一个 出牌玩家
        gamedata: null,          //断线重连数据
        playeddata: null,        //打牌数据
        gamebegin: null,         //开始游戏数据
        juNum: null,             //局数
        wanfa: null,             //玩法
        gamestate: "",
        _replayConf:null,        //回放的房间配置
    
    },
 
    reset:function()
    {
        console.log("pdkGameNetMgr reset");

        this.gamestate = "";
        this.leftNums = [];
        this.holds = [];
        this.hands = [];
        this.folds = [];
        this.lastPlayedCards = [];
        this.playbegin = null;
        this.turn = -1;
        this.lastTurn = -1;
        this.gamedata = null;
        this.playeddata = null;
        this.gamebegin = null;
        this.wanfa = null;
        this._removeChangeTurn=false;
    },

    initHandlers:function(){
        if(cc.fy.gameMsg == null)
        {
            return;
        }

        if(cc.fy.pdkGameNetMgr == null){
            cc.fy.pdkGameNetMgr = this;
        }

        
        var self = this;

        //开始游戏
        cc.fy.gameMsg.addHandler('pdk_stc_gamebegin',function(data){
            console.log("pdk_stc_gamebegin"); 
            console.log("pdk_stc_gamebegin data = " + data)

            self.gamebegin = data;
            self.gamestate = "begin"
            if(cc.fy.sceneMgr.isGameScene()){
                self.doGameBegin(data);
            }
            else {
                self.doGameBegin(data);
                cc.fy.sceneMgr.loadGameScene(cc.fy.gameNetMgr.conf.type);
            }
        })

        //游戏第几局
        cc.fy.gameMsg.addHandler('game_num_push',function(data){
            if(cc.fy.gameNetMgr.conf.type==cc.GAMETYPE.PDK){
                self.juNum = data;
                self.dispatchEvent('pdk_game_num', data);
            }
        })

        //发牌
        cc.fy.gameMsg.addHandler('pdk_stc_dealcard',function(data){
            console.log("pdk_stc_dealcard"); 
            console.log(data)
            self.holds = data.hand;
            self.dispatchEvent('cc_pdk_stc_dealcard', data);
        })

        //开始出牌
        cc.fy.gameMsg.addHandler('pdk_stc_playbegin',function(data){
            console.log("pdk_stc_playbegin"); 
            console.log(data)
            self.actionId = data.actionId;
            self.playbegin = data;
            self.doPlayBegin(data);
        })

         //出牌
         cc.fy.gameMsg.addHandler('pdk_stc_playcard',function(data){
            console.log("pdk_stc_playcard"); 
            console.log(data); 
            self.actionId = data.actionId;
            self.playeddata = data;
           
            self.doPlay(data);
        })

        //游戏翻倍
        cc.fy.gameMsg.addHandler('pdk_stc_gametimes',function(data){
            console.log("pdk_stc_gametimes"); 
            console.log(data); 
        })

        //结算
        cc.fy.gameMsg.addHandler('pdk_stc_gameover',function(data){
            console.log("pdk_stc_gameover");  
            self.doGameOver(data);
        })

        //断线重连的数据
        cc.fy.gameMsg.addHandler('pdk_stc_gamedata',function(data){
            console.log("pdk_stc_gamedata"); 
            console.log(data);

            self.gamedata = data;
            self.leftNums = data.leftNums;
            cc.fy.gameNetMgr.gamestate = "playing";
            self.gamestate = "playing"
            self.holds = data.hand;
            self.actionId = data.actionId;
            if(data.allPlayedCards){
                for(var i = 0; i < cc.fy.gameNetMgr.seats.length; i++){
                     // 该自己出牌，不需要显示自己已经出过的牌   && i == cc.fy.gameNetMgr.seatIndex
                     if(data.curTurn == i){
                        self.folds[i] = null;
                     }
                     else
                     {
                         self.folds[i] = data.allPlayedCards[i];
                     }
                }
            }

            self.turn = data.curTurn;
            if(data.lastSeatIndex >= 0){
                self.lastPlayedCards = data.allPlayedCards[data.lastSeatIndex];
                console.log(" self.folds[i] = data.lastSeatIndex = " + data.lastSeatIndex)
            }
            else{
                self.lastPlayedCards = [];
            }
            
        })

        //其他人操作
        cc.fy.gameMsg.addHandler('pdk_stc_otherhasops',function(data){
            console.log("pdk_stc_otherhasops"); 
        })

        // // 有玩家进来
        // cc.fy.net.addHandler("new_user_comes_push",function(data){
        //     var seatIndex = data.seatindex;
        //     if(self.roomSeats[seatIndex].userid > 0){
        //         self.roomSeats[seatIndex].online = true;
        //     }
        //     else{
        //         data.online = true;
        //         self.roomSeats[seatIndex] = data;
        //     }
        //     self.dispatchEvent('new_user',self.seats[seatIndex]);
        // });
    },

    doGameBegin:function(data){
        console.log("PDKGame doGameBegin ");
        cc.fy.gameNetMgr.gamestate = "begin";

        this.dispatchEvent('pdk_game_begin', data);
    },

    doPlayBegin:function(data){
        cc.fy.gameNetMgr.gamestate = "playing";
        var seat = cc.fy.gameNetMgr.getSeatIndexByID(data.userId);
        console.log("send pdk_play_begin",seat);
        cc.fy.gameNetMgr.dispatchEvent("pdk_play_begin",seat);
        console.log("PDKGame doPlayBegin seat = " + seat);
        if(seat != -1){
            this.lastTurn = seat;
            
            setTimeout(function(){
               // if(this.lastTurn!=-1){
                    if(this.playeddata){
                        this.doTurnChange(this.playeddata.nextTurn);
                    }else{
                        this.doTurnChange(seat);
                    }
                      
                // }
            }.bind(this),3500);
            

            // if(this.gamedata!=null){
            //     this.doTurnChange(seat);
            // }else{
            //     setTimeout(function(){
            //         this.doTurnChange(seat);
            //     }.bind(this),3500);
            // }
            // setTimeout(function(){
            //     if(this.gamedata!=null){
            //         if(this.lastTurn!=-1){
            //             // if(this._removeChangeTurn==false){
            //             this.doTurnChange(this.lastTurn);
            //             // }
            //         }   
            //     }else
            //     {
            //         this.doTurnChange(seat);
            //     }
            // }.bind(this),3500);
            
        }
    },

    /*出牌参数
    // seatIndex: -1, 			// 出牌座位号
	// leftCardCnt: 0, 		    // 出牌后剩余
	// nextTurn: -1, 			// 下一个
	// lastSeatIndex: -1,		// 上一个有效出牌位置
	// roundEnd: false, 		// 是否一轮结束
	// playedCards: [], 		// 打出的牌
	// lastPlayedCards: [], 	// 最后有效出牌
    */ 
    doPlay: function(data){
        console.log(" PDKGame doPlay ");

        if(cc.fy.PDKGameMgr){      
            //console.log("cc.fy.PDKGameMgr exit");

            //cc.fy.PDKGameMgr.printCards(this.holds, " holds");
            // 自己出牌，把出的牌删掉
            if(data.playedCards != null && data.playedCards.length > 0){
                //console.log(" PDKGame playedCards = " + data.playedCards + ",seatIndex = " + data.seatIndex + "cc.fy.gameNetMgr.seatIndex = " + cc.fy.gameNetMgr.seatIndex);

                if(data.seatIndex == cc.fy.gameNetMgr.seatIndex){
                    cc.fy.PDKGameMgr.removeCards(this.holds, data.playedCards);
                }

                // 这时所有人都有手牌，需要删除对应的玩家
                if(cc.fy.pdkGameNetMgr.hands.length > 0){
                    cc.fy.PDKGameMgr.removeCards(this.hands[data.seatIndex], data.playedCards);
                }
            }
            
            cc.fy.PDKGameMgr.printCards(this.holds, " remove holds"); // 手牌删掉


            // 自己出牌，就清理掉已经出的牌
            if(data.nextTurn == cc.fy.gameNetMgr.seatIndex){
                //console.log("this.folds1",this.folds);
                cc.fy.pdkGameNetMgr.folds[cc.fy.gameNetMgr.seatIndex] = null;
            }

            this.folds[data.seatIndex] = data.playedCards;
            // else{
            //     console.log("this.folds2",this.folds);
                
            // }
            //console.log("this.folds",this.folds);

            if(data.roundEnd){
                this.lastPlayedCards = [];
            }
            else{
                this.lastPlayedCards = data.lastPlayedCards;
            }
            
            this.leftNums[data.seatIndex] = data.leftCardCnt;
            this.lastTurn = data.seatIndex;

            this.dispatchEvent('cc_pdk_stc_playcard', data);
            //自己出牌 并且上家有出牌,则延迟0.5s
            if(data.nextTurn == cc.fy.gameNetMgr.seatIndex && data.playedCards != null && data.playedCards.length > 0 && data.leftCardCnt>0){
                var playcardtype=cc.fy.PDKGameMgr.getPokerType(data.playedCards);
                console.log("上家出的牌：",playcardtype);
                var isDelay=false;
                if(playcardtype==PokerDef.PokerType.AIRPLANE || playcardtype==PokerDef.PokerType.AIRPLANE_2 || playcardtype==PokerDef.PokerType.BOMB4){
                    isDelay=true;
                }
                this.doTurnChange(data.nextTurn,isDelay);
            }else{
                this.doTurnChange(data.nextTurn);
            }
        }
    },

    //出光牌了
    isNoLeftCards(){
        if(this.lastTurn>=0 && this.leftNums[this.lastTurn]==0){
            return true;
        }
        return false;
    },

    doGameOver: function(data){
        console.log("PDKGAME doGameOver");
        console.log(data);

        var results = data.results;
        for(var i = 0; i <  cc.fy.gameNetMgr.seats.length; ++i){
            cc.fy.gameNetMgr.seats[i].score = results.length == 0? 0:results[i].totalscore;
        }

        var quanguan=[0,0,0];
        var haveGuan=false;
        if(results!=null && results.length>0){
            for(let i=0;i<results.length;i++){
                quanguan[i]=results[i].isNoOutCard;
                if(results[i].isNoOutCard){
                    haveGuan=true;
                }
            }
        }
        if(haveGuan==true){
            cc.fy.gameNetMgr.dispatchEvent("pdk_quanguan",{list:quanguan});
            if(data.endinfo){
                if(data.endinfo.uuid){
                    cc.fy.gameNetMgr.roomUuid = data.endinfo.uuid;
                }  
                cc.fy.gameNetMgr.isOver = true;
                cc.fy.gameNetMgr.isReturn = false;
                this.gamestate = "";
                cc.fy.gameNetMgr.getIsShareResult();
                this.dispatchEvent('pdk_game_end',data);    
            }
            var self=this;
            setTimeout(function(){
                self.dispatchEvent('pdk_game_over',results);
                cc.fy.gameNetMgr.reset();
                self.reset();
            }, 2000);
        }else{
            this.dispatchEvent('pdk_game_over',results);
            if(data.endinfo){
                if(data.endinfo.uuid){
                    cc.fy.gameNetMgr.roomUuid = data.endinfo.uuid;
                }  
                cc.fy.gameNetMgr.isOver = true;
                cc.fy.gameNetMgr.isReturn = false;
                this.gamestate = "";
                cc.fy.gameNetMgr.getIsShareResult();
                this.dispatchEvent('pdk_game_end',data);    
            }
            cc.fy.gameNetMgr.reset();
            this.reset();
        }
    },

    checkQuanGuan:function(result){
        if(result==null || result.length==0){
            return;
        }
       
        
    },
    //轮转出牌位置
    doTurnChange: function(seat,isDelay){
        var data = {
            last:this.turn,
            turn:seat,
        }
        this.lastTurn = this.turn;
        this.turn = seat;
        if(isDelay){
            setTimeout(function(){
                 this.dispatchEvent('pdk_game_chupai',data);
                  console.log("PDKGame doTurnChange"+this.turn+"isDelay:");
            }.bind(this),500);
        }else{
            this.dispatchEvent('pdk_game_chupai',data);
             console.log("PDKGame doTurnChange"+this.turn+"seat:"+seat);
        }
       
    },

    dispatchEvent(event,data){
            cc.fy.gameNetMgr.dispatchEvent(event,data);
    },

    //获取下一个玩家出牌位置
    getNextSeat: function(index){
        var seat = index + 1;
        var playernum = cc.fy.gameNetMgr.seats.length;//cc.fy.gameNetMgr.conf.maxCntOfPlayers
        if(seat >= playernum){
            seat = 0;
        }

        return seat
    },

    //检查下家是否报单
    checkNextBaoDan:function(){
        var nextSeat=this.getNextSeat(cc.fy.gameNetMgr.seatIndex);
        console.log("剩余手牌",this.leftNums,nextSeat);

        return this.leftNums[nextSeat]==1;
    },

    getSideByLocalIndex:function(index){
        var length = cc.fy.gameNetMgr.seats.length
        var sides = [];
        if(length == 3){
            sides = ["myself", "right", "left"];
        }
        else{
            sides = ["myself", "up"];
        }
         
        return sides[index];
    },

     // 战绩出牌
     doPlayCardReplay:function(dataArr){
         console.log("PDKGAME doPlayCardReplay");
        if(dataArr == null || (dataArr.length != 7 && dataArr.length != 8)){
            return;
        }
        var playCard = {
            seatIndex: dataArr[0], 			// 出牌座位号
            leftCardCnt: dataArr[1], 		// 出牌后剩余
            nextTurn: dataArr[2], 			// 下一个
            lastSeatIndex: dataArr[3],		// 上一个出牌位置
            roundEnd: dataArr[4], 			// 是否一轮结束
            playedCards: dataArr[5], 		// 打出的牌
            lastPlayedCards: dataArr[6], 	// 最后有效出牌
        }
        this.doPlay(playCard);
    },

    // 战绩的准备数据
    prepareReplay:function(roomInfo,detailOfGame){
        console.log("==========",roomInfo);
        console.log("==========",detailOfGame);
        var base_info = detailOfGame.base_info;
        this._replayConf=roomInfo;
        for(var i = 0; i < cc.fy.gameNetMgr.seats.length; ++i){
            var s = cc.fy.gameNetMgr.seats[i];
            s.seatindex = i;
            
            s.online = true;
            if(cc.fy.userMgr.userId == s.userid){
                cc.fy.gameNetMgr.seatIndex = i;
            }

        }
        
        if (cc.fy.gameNetMgr.seatIndex == -1) {
            cc.fy.gameNetMgr.seatIndex = 0;
        }

        if(cc.fy.gameNetMgr.seats.length == 2 && (cc.fy.gameNetMgr.seatIndex == 2 || cc.fy.gameNetMgr.seatIndex == 3)){
            cc.fy.gameNetMgr.seatIndex = 0;
        }
        else if(cc.fy.gameNetMgr.seats.length == 3 && cc.fy.gameNetMgr.seatIndex == 3){
            cc.fy.gameNetMgr.seatIndex = 0;
        }

        this.wanfa = base_info.wanfa;
        this.holds = base_info.hands[cc.fy.gameNetMgr.seatIndex];
        this.hands = base_info.hands;
        this.folds = [];

        this.turn = base_info.button;
        this.lastTurn = this.turn;
       
    },

});
