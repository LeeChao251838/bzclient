const Buffer = require('buffer').Buffer;
var GameMsgDef = require("GameMsgDef");
cc.Class({
    extends: require("BaseModuleView"),

    properties: {
        // _viewlist:null,
        // _content:null,
        
        _historyData:null,
        // _curRoomInfo:null,
        _emptyTip:null,

        // _viewitemTemp0:null,
        // _viewitemTemp1:null,
        _scorllView:null,

        zhanjiView:cc.Node,//战绩view
        baseView:cc.Node,//整体战绩

        detailView:cc.Node,//每局详细战绩
        detailInfo:cc.Label,
        detailInfoTime:cc.Label,
        detailTd:cc.Node,//详情表头

        scrollViewBase:require("ScrollViewController"),  //每个房间
        scrollViewDetail:require("ScrollViewController"), //每一小局

        // _ndHistoryCode:null,
        // _gameresult:null,

        // _titleList:null,
        // _detailtitleList:null,
        // _isGroupHistory: false,
    },

    onLoad(){
        this.initEventHandlers();
        this.initView();
        
        // var self = this;
        // this.node.on('get_group_history_result',function(data){  
        //     self.showGroupHistory(data.detail);
        // });
    },

    initEventHandlers(){
        var self = this;
        var game = cc.fy.gameNetMgr;
        
        game.addHandler(GameMsgDef.ID_SHOWHISTORYVIEW_CTC, function(data){
            if(data.isShow == false){
                self.close();
            }
            else{
                console.log("ID_SHOWHISTORYVIEW_CTC ---- ");
                if(data.isClubRoom){
                    self.showGroupHistory(data);
                }
                else{
                    self.show();
                }
            }
        });
        //展示详细对局数据
         game.addHandler("ctc_hall_zhanji_detail",function(data){
             if(self.node.active==false){
                
            }else{
                self.showDetailViewInfo(data.idx);
            }
        });
    },

    initView(){
        // 作为弹框模式 不隐藏其它弹框
        this.setHideOther(false);
        
        this._emptyTip = this.node.getChildByName("emptyTip");
       

        // this._titleList = this.node.getChildByName("help_p_bg").getChildByName("bg").getChildByName("titleList");
        // this._detailtitleList = this.node.getChildByName("help_p_bg").getChildByName("bg").getChildByName("detailtitleList");

        // this._viewlist = this.node.getChildByName("viewlist");
        // this._scorllView = this._viewlist.getComponent(cc.ScrollView);
        // this._content = cc.find("view/content",this._viewlist);

        // this._viewitemTemp0 = cc.find("view/HistoryItem0", this._viewlist);
        // this._viewitemTemp1 = cc.find("view/HistoryItem1", this._viewlist);
        
     

        var btnback =this.detailView.getChildByName("title_back");
        cc.fy.utils.addClickEvent(btnback, this.node, "HistoryView", "onBtnBackClicked");

        // this._gameresult = this.node.getChildByName("game_result");
    },

    close(){
        this.detailView.active=false;
        this.node.active = false;
    },
    
    onBtnBackClicked:function(){
         this.baseView.active=true;
          this.detailView.active=false;
        // if(this._curRoomInfo == null || this._isGroupHistory){
        //     this._historyData = null;
        //     this.node.active = false;
        //     this._isGroupHistory = false;            
        // }
        // else{
        //     this.initRoomHistoryList(this._historyData);   
        // }
    },

    // onBtnOtherClicked:function(){
    //     cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWHISTORYCODEVIEW_CTC, {isShow:true});
    // },
    
    show:function(){
        cc.fy.guildMainMsg._isInclub=false;
        this.node.active = true;
        var self = this;
        cc.fy.userMgr.getHistoryList(function(data){
            if(data == null)
            {
                data = [];
            }
            data.sort(function(a,b){
                return b.time - a.time; 
            });
            self._historyData = data;
            for(var i = 0; i < data.length; ++i){
                for(var j = 0; j < data[i].seats.length; ++j){
                    var s = data[i].seats[j];
                    s.name = new Buffer(s.name,'base64').toString();
                }
            }
            self.initRoomHistoryList(data);
        });
    },

    //展示房间详细战绩列表
    showGroupHistory:function(data){
        this.node.active = true;
        if (data == null) {
            return;
        }
        console.log("show HISTORY list",data);
        this.initGameHistoryList(data.roomInfo, data.history);
        this._emptyTip.active = false;
       // this._isGroupHistory = true;
    },
    
    //展示大致战绩列表
    initRoomHistoryList:function(data){
        if(data && data.length>0){
            this._emptyTip.active=false;
            this.baseView.active=true;
             this.scrollViewBase.setData(data);
        }else{
            this.baseView.active=false;
             this._emptyTip.active = true;;
        }
       
        // this._content.removeAllChildren();
        // if(this._scorllView)
        // {
        //     this._scorllView.scrollToTop();
        // }
        // console.log( "initRoomHistoryList", data );

        // for(var i = 0; i < data.length; ++i){
        //     var node = this.getViewItem(i, 0);
        //     node.active = true;

        //     node.getChildByName("roomNo").getComponent(cc.Label).string =  data[i].id + "号房间";
        //     var date = new Date(data[i].time * 1000);
        //     var dateStr = cc.fy.utils.timeToString(date, "yyyy-MM-dd");
        //     var timeStr = cc.fy.utils.timeToString(date, "hh:mm:ss");
        //     node.getChildByName("date").getComponent(cc.Label).string = dateStr;
        //     node.getChildByName("time").getComponent(cc.Label).string = timeStr;
        //     var noStr = "局数 "
        //     if(!data[i].maxGame){
        //         data[i].maxGame = data[i].maxGames;
        //     }
        //     if (data[i].maxGame == "feng4quan") {
        //         noStr = "圈数 "
        //         node.getChildByName("GameNo").getComponent(cc.Label).string = noStr + data[i].numOfGames + "局 / 4圈 ";
        //     }
        //     else if (data[i].maxGame == "feng2quan") {
        //         noStr = "圈数 "
        //         node.getChildByName("GameNo").getComponent(cc.Label).string = noStr + data[i].numOfGames + "局 / 2圈 ";
        //     }
        //     else{
        //         if (data[i].type == cc.GAMETYPE.JDMJ) {
        //             if ( data[i].circleCnt != null && data[i].circleCnt >= 0) {
        //                 noStr = "圈数 "
        //                 node.getChildByName("GameNo").getComponent(cc.Label).string = noStr + data[i].circleCnt + " / " + data[i].maxGame;
        //             }
        //             else{
        //                 node.getChildByName("GameNo").getComponent(cc.Label).string = noStr + data[i].numOfGames + " / " + data[i].maxGame;
        //             }
        //         }
        //         else {
        //             node.getChildByName("GameNo").getComponent(cc.Label).string = noStr + data[i].numOfGames + " / " + data[i].maxGame;
        //         }

        //     }

        //     var noType = "";
        //     if (data[i].type != null) {
        //         noType = "("+ cc.GAMETYPENAME[data[i].type] +")";
        //     }
        //     node.getChildByName("GameType").getComponent(cc.Label).string = noType;

        //     for(var j = 0; j < 4; ++j){
        //         var s = data[i].seats[j];
        //         if (s) {

        //             s.score = cc.fy.utils.floatToFixed(s.score,1,true);
        //             var info = cc.fy.utils.subStringCN(s.name, 10, true)  + ":";
        //             node.getChildByName("info" + j).getComponent(cc.Label).string = info;
        //             var ndScore = node.getChildByName("score" + j);
        //             ndScore.getComponent(cc.Label).string = (s.score >= 0 ? ("+" + s.score) : s.score);
        //             ndScore.color = s.score >= 0 ? new cc.Color(255, 0, 0) : new cc.Color(0, 175, 0);
        //             if (data[i].seats.length == 2) {
        //                 if (j == 2 || j == 3) {
        //                    node.getChildByName("info" + j).getComponent(cc.Label).active = false; 
        //                    node.getChildByName("score" + j).getComponent(cc.Label).active = false;
        //                 }
        //             }
        //             else if (data[i].seats.length == 3) {
        //                 if (j == 3) {
        //                    node.getChildByName("info" + j).getComponent(cc.Label).active = false; 
        //                    node.getChildByName("score" + j).getComponent(cc.Label).active = false;
        //                 }
        //             }
        //         } else {
        //             node.getChildByName("info" + j).getComponent(cc.Label).string = "";
        //             node.getChildByName("score" + j).getComponent(cc.Label).string = "";
        //         }
        //     }

        //     var btnOp = node.getChildByName("btnOp");
        //     var btnItem = node.getChildByName("btnitem");
        //     var btnResult = node.getChildByName("btnResult");
        //     btnOp.idx = i;
        //     btnItem.idx = i;
        //     btnResult.idx = i;
        // }
         var isshowtip = data.length == 0;
        // console.log("is show history tips = " + isshowtip);
        
        // this._curRoomInfo = null;
    },
    
    showDetailView(){
        this.baseView.active=false;
        this.detailView.active=true;
    },

    //点击查看详情战绩
    showDetailViewInfo:function(idx){    
        console.log(idx);
        if (idx == null ) {
            return;
        }

        var historyData = this._historyData[idx];
       
       // this._curRoomInfo=historyData;
        cc.fy.zhanjiMsg._roomInfo=historyData;

        if (!historyData) {
            return;
        }
       // this.showDetailView();
       console.log("房间信息：",JSON.stringify(historyData));
        cc.fy.loading.show();
        var self=this;
        cc.fy.userMgr.getGamesOfRoom(historyData.uuid, function(data){
            cc.fy.loading.hide();
            console.log("gamesofroom data:",data);
            if(data != null && data.length > 0){
                // cc.fy.guildMsg.dispatchEvent("get_group_history_result", {history: historyData, data});
                self.showDetailView();
                console.log(data);
                var date = new Date(historyData.time * 1000);
                var dateStr = cc.fy.utils.timeToString(date, "yyyy-MM-dd");
                var timeStr = cc.fy.utils.timeToString(date, "hh:mm:ss");
                self.detailInfoTime.string = dateStr+ " "+timeStr;
            
                let roomId= "房间:"+historyData.id+" ";
                let difen ="";
                var noStr ="";
                if(historyData.numOfGames>=0 && historyData.maxGames>=0){
                    noStr = "  局数:"+historyData.numOfGames+"/"+historyData.maxGames;
                }
                let noType = "";
                var conf =historyData.conf;
                if(conf){
                     if(conf.baseScore>=0){
                        difen =" 底分:"+conf.baseScore;
                    }
                    if(conf.base_score>=0){
                        difen =" 底分:"+conf.base_score;
                    }
                    if(conf.diFen>=0){
                        difen =" 底分:"+conf.diFen;
                    }
                    if (conf.type != null) {
                        noType = " ("+ cc.GAMETYPENAME[conf.type] +")";
                    }
                }
               
                self.detailInfo.string=roomId+difen+noStr+noType;
                //玩家昵称
                //初始化
                var otherIndex =0;

                for(let i = 0; i < 4; ++i){
                    let initName = self.detailTd.getChildByName("info" + i);
                
                    initName.active=false;
                }
                if(historyData.seats){
                    for(let i=0;i<historyData.seats.length;i++){
                        var s = historyData.seats[i];    
                        if(s &&s.userid== cc.fy.userMgr.userId){
                            otherIndex=1;
                            break;
                        }
                    }
                    for(let j = 0; j < historyData.seats.length; ++j){
                        let s = historyData.seats[j];
                        let initName = self.detailTd.getChildByName("info0");
                        if(s.userid!=cc.fy.userMgr.userId){
                           
                            initName =self.detailTd.getChildByName("info" + otherIndex);
                            otherIndex++;
                        }

                        initName.active=true;
                        initName.getComponent(cc.Label).string = cc.fy.utils.subStringCN(s.name, 10, true);                      
                    }     
                }
                self.initGameHistoryList(historyData,data)
            }
            else{
                cc.fy.hintBox.show("未打满一局无法查看更多内容哦！");
            }
        });
    },

    //房间每局对局记录
    initGameHistoryList:function(roomInfo,data)
    {
        console.log("room data",roomInfo);
        console.log("data",data);
        // this._content.removeAllChildren();
        // if(this._scorllView)
        // {
        //     this._scorllView.scrollToTop();
        // }
        if(data==null){
            return;
        }
        data.sort(function(a,b){
           return a.create_time - b.create_time; 
        });

         this.scrollViewDetail.setData(data);

        
        // if(roomInfo.dissInfo != null){
        //     // 有解散房间数据
        //     // 查看解散方式 1:发起解散 2:同意解散 3:不同意
		// 	let disagreeCnt = 0;
		// 	let noActionCnt = 0;
        //     for(let key in roomInfo.dissInfo){
        //         if(roomInfo.dissInfo[key] == 3){
        //             disagreeCnt ++;
        //         }
        //         else if(roomInfo.dissInfo[key] == 0){
        //             noActionCnt ++;
        //         }
        //     }
        //     if(disagreeCnt == 0){
        //         // 没有人拒绝，就是都同意解散，或者超时解散了
        //         let seats = roomInfo.seats;
        //         let disResult = [];
        //         for(let i=0;i<seats.length;i++){
        //             let type = roomInfo.dissInfo[seats[i].userid];
        //             let desDiss = "未确认";
        //             if(noActionCnt == seats.length){
        //                 desDiss = "群主解散"
        //             }
        //             else if(type == 1){
        //                 desDiss = "申请解散";
        //             }
        //             else if(type == 2){
        //                 desDiss = "已同意";
        //             }
        //             else if(type == 3){
        //                 desDiss = "已拒绝";
        //             }
        //             disResult.push(desDiss);
        //         }
        //         var tData = data[0];
        //         var node = this.getViewItem(i, 1);
        //         node.active = true;
        //         node.getChildByName("gamenumber").getComponent(cc.Label).string = "第" + data.length + "局";
        //         var date = new Date(tData.create_time * 1000);
        //         var dateStr = cc.fy.utils.timeToString(date, "yyyy-MM-dd");
        //         var timeStr = cc.fy.utils.timeToString(date, "hh:mm:ss");
        //         node.getChildByName("date").getComponent(cc.Label).string = dateStr;
        //         node.getChildByName("time").getComponent(cc.Label).string = timeStr;
        //         node.getChildByName("roomNo").getComponent(cc.Label).string = roomInfo.id + "号房间";
        //         node.getChildByName("shareCodeLabel").getComponent(cc.Label).string = "";
        //         var btnOp = node.getChildByName("btnOp");
        //         btnOp.active = false;
        //         for(var j = 0; j < 4; ++j){
        //             var s = roomInfo.seats[j];
        //             if (s) {
        //                 var info = cc.fy.utils.subStringCN(s.name, 10, true) + " :";
        //                 node.getChildByName("info" + j).getComponent(cc.Label).string = info;
        //                 var ndScore = node.getChildByName("score" + j);
        //                 ndScore.getComponent(cc.Label).string = disResult[j];
        //             } else {
        //                 node.getChildByName("score" + j).getComponent(cc.Label).string = "";
        //                 node.getChildByName("info" + j).getComponent(cc.Label).string = "";
        //             }
        //         }
        //     }
        // }
        
        // for(var i = 0; i < data.length; ++i){
        //     var node = this.getViewItem(i, 1);
        //     node.active = true;
        //     var idx = data.length - i - 1;
        //     // node.idx = idx;
        //     var titleId = "" + (idx + 1);
        //     node.getChildByName("gamenumber").getComponent(cc.Label).string = "第" + titleId + "局";
            
        //     var date = new Date(data[i].create_time * 1000);
        //     var dateStr = cc.fy.utils.timeToString(date, "yyyy-MM-dd");
        //     var timeStr = cc.fy.utils.timeToString(date, "hh:mm:ss");
        //     node.getChildByName("date").getComponent(cc.Label).string = dateStr;
        //     node.getChildByName("time").getComponent(cc.Label).string = timeStr;
        //     node.getChildByName("roomNo").getComponent(cc.Label).string = roomInfo.id + "号房间";
        //     node.getChildByName("shareCodeLabel").getComponent(cc.Label).string = "分享码：" + data[i].shareCode;
        //     if(!data[i].shareCode){
        //         node.getChildByName("shareCodeLabel").getComponent(cc.Label).string = "分享码：无";
        //     }
        //     console.log(data[i]);
        //     var btnOp = node.getChildByName("btnOp");
        //     btnOp.idx = idx;
        //     btnOp.active=true;
        //     if (data[i].result == null ||data[i].result =="" ){
        //         data[i].result = "[0, 0, 0, 0]";
        //     }
            
           
        //     var result = JSON.parse(data[i].result);
        //     var resultDis=[];
        //     if(data[i].dissolve!=null && data[i].dissolve!=""){
        //         var dissolve=JSON.parse(data[i].dissolve);
        //         for(let j=0;j<dissolve.length;j++){
        //             if(dissolve[j]==1){
        //                 resultDis[j]="同意解散";
        //             }else if(dissolve[j]==2){
        //                 resultDis[j]="发起解散";
        //             }else{
        //                 resultDis[j]="未确认";
        //             }
        //         }
        //         btnOp.active=false;
        //     }
           

        //     for(var j = 0; j < 4; ++j){
        //         var s = roomInfo.seats[j];
        //         if (s) {
        //             result[j] = cc.fy.utils.floatToFixed(result[j],1,true);
        //             var info = cc.fy.utils.subStringCN(s.name, 10, true) + " :";
        //             node.getChildByName("info" + j).getComponent(cc.Label).string = info;
        //             var ndScore = node.getChildByName("score" + j);
        //             ndScore.getComponent(cc.Label).string = (result[j] >= 0 ? ("+" + result[j]) : result[j]);
        //             ndScore.color = result[j] >= 0 ? new cc.Color(255, 0, 0) : new cc.Color(0, 255, 0);
        //             if(resultDis.length>0){
        //                 ndScore.getComponent(cc.Label).string =resultDis[j];
        //             }
        //         } else {
        //             node.getChildByName("score" + j).getComponent(cc.Label).string = "";
        //             node.getChildByName("info" + j).getComponent(cc.Label).string = "";
        //         }
        //     }

            
        // }
        // this._curRoomInfo = roomInfo;
    },
    onBtnClose(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.detailView.active=false;
        this.node.active = false;
    },
    // getViewItem:function(index, type){
    //     var content = this._content;
    //     var viewitemTemp = type == 0 ? this._viewitemTemp0 : this._viewitemTemp1;
    //     var node = cc.instantiate(viewitemTemp);
    //     content.addChild(node);
    //     return node;
    // },

    // shrinkContent:function(num){
    //     while(this._content.childrenCount > num){
    //         var lastOne = this._content.children[this._content.childrenCount -1];
    //         this._content.removeChild(lastOne,true);
    //     }
    // },
    
    // getGameListOfRoom:function(idx){
    //     var self = this;
    //     var roomInfo = this._historyData[idx];
    //     console.log("getGameListOfRoom:" + idx);
    //     cc.fy.userMgr.getGamesOfRoom(roomInfo.uuid,function(data){
    //         if(data != null && data.length > 0){
    //             self.initGameHistoryList(roomInfo,data);
    //         }
    //         else{
    //             cc.fy.hintBox.show("未打满一局或战绩已过期！");
    //         }
    //     });
    // },
    
    // getDetailOfGame:function(idx){
    //     if(cc.fy.gameNetMgr.roomId != null || cc.fy.userMgr.oldRoomId != null)
    //     {
    //         console.log(cc.fy.gameNetMgr.roomId,cc.fy.userMgr.oldRoomId);
    //         cc.fy.hintBox.show("您正在包厢中，不能查看回放！");
    //         return;
    //     }
    //     var self = this;
    //     var roomUUID = this._curRoomInfo.uuid;
    //     cc.fy.userMgr.getDetailOfGame(roomUUID,idx,function(data){
    //         console.log("===================>>>>>>>>>>>>>",data);
    //         var base_info = data.base_info;
    //         var action_records = data.action_records;
    //         if(base_info){
    //             data.base_info = JSON.parse(data.base_info);
    //         }
    //         if(action_records){
    //             data.action_records = JSON.parse(data.action_records);
    //         }
    //         self._curRoomInfo.idx = idx;
    //         cc.fy.gameNetMgr.prepareReplay(self._curRoomInfo,data);
    //         cc.fy.replayMgr.init(data);
    //         cc.fy.sceneMgr.loadGameScene(cc.fy.gameNetMgr.conf.type);
    //     });
    // },

    // getShareCode:function(idx, item){
    //     // 获取分享码
    //     var self = this;
    //     var roomUUID = this._curRoomInfo.uuid;
    //     cc.fy.userMgr.getSharecode(roomUUID, idx, function(data){
    //         var shareCode = data.share_code;
    //         console.log("shareCode = " + shareCode);
    //         if(item.labCode){
    //             item.labCode.string = "" + shareCode;
    //             item.btnNoShare.interactable = true;
    //         }
    //         self.onShare(shareCode);
    //     });
    // },

    // getGameResult:function(idx){
    //     // 获取当局的总结算
    //     var self = this;
    //     var roomInfo = this._historyData[idx];
    //     cc.fy.userMgr.getGameResult(roomInfo.uuid,function(data){
    //         data.game_info = JSON.parse(data.game_info);
    //         // game_result
    //         cc.fy.gameNetMgr.roomId = roomInfo.id;
    //         cc.fy.gameNetMgr.seats = roomInfo.seats;
    //         var endData = {
    //             endinfo:data.game_info,
    //         };
    //         cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWGAMERESULTVIEW_CTC, {isShow:true, data:endData});
    //         cc.fy.gameNetMgr.roomId = null;
    //         cc.fy.gameNetMgr.clear();
            
    //         self._gameresult.active = true;
    //     });
    // },

    // onGameResultClicked:function(event){
    //     cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
    //     var idx = event.target.idx;
    //     console.log(idx);
    //     this.getGameResult(idx);
    // },
    
    // onViewItemClicked:function(event){
    //     cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
    //     var idx = event.target.idx;
    //     console.log(idx);
    //     if(this._curRoomInfo == null){
    //         this.getGameListOfRoom(idx);
    //     }
    //     else{
    //         this.getDetailOfGame(idx);      
    //     }
    // },
    
    // onBtnOpClicked:function(event){
    //     cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
    //     var idx = event.target.idx;
    //     console.log(idx);
    //     if(this._curRoomInfo == null){
    //         this.getGameListOfRoom(idx);
    //     }
    //     else{
    //         this.getDetailOfGame(idx);      
    //     }
    // },

    // onBtnShareClicked:function(event){
    //     cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
    //     var idx = event.target.idx;
    //     var node = event.target.parent;
    //     this.getShareCode(idx, node);
    // },
    // onBtnNoShareClicked:function(event){
    //     cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
    //     var node = event.target.parent;
    //     node.labCode.string = "";
    //     node.btnNoShare.interactable = false;
    // },

    // onShare:function(code){
    //     var btnShare = cc.find("Canvas/prepare/btnWeichat");
    //     if(btnShare){
    //         btnShare.getComponent(cc.Button).interactable = false;

    //         this.schedule(function() {
    //             btnShare.getComponent(cc.Button).interactable = true;
    //         }, 2);
    //     }

    //     var title = "<" + cc.fy.gameNetMgr.getGameTitle(cc.fy.gameNetMgr.conf.type) + ">";
    //     var param = cc.InviteLink + encodeURIComponent("openPage=history&inviteCode="+code);

    //     cc.fy.anysdkMgr.share("" + title, "回放码:" + code + "，在战绩内点击查看他人回放并输入回放码", param);
    // },
});
