const Buffer = require('buffer').Buffer;
var GameMsgDef = require("GameMsgDef");
cc.Class({
    extends: require("BaseModuleView"),

    properties: {
        nullView:cc.Node,
        zhanjiView:cc.Node,
        baseView:cc.Node,//整体战绩
        detailView:cc.Node,//每局详细战绩

        detailInfo:cc.Label,
        detailInfoTime:cc.Label,
        detailTd:cc.Node,//详情表头
  

        scrollViewBase:require("ScrollViewController"), 
        scrollViewDetail:require("ScrollViewController"), 
        allTab:cc.Node,
        myTab:cc.Node,
  
        _allList:null, //所有战绩列表
        _myList:null, // 自己战绩列表

        

        _curTab:1,  //默认是自己
        
        _tabIndex:1,   //分页,所有战绩
        _maxPage:1,    //最大页数

    },
    onLoad(){
        this.initView();
        this.initEventHandlers();
        
    },
    initEventHandlers(){
        var self = this;
        var game = cc.fy.gameNetMgr;
       
        game.addHandler(GameMsgDef.ID_SHOWZHANJIVIEW_CTC, function(data){
            if(data.isShow == false){
                self.close();
            }
            else{
                console.log("ID_SHOWZHANJIVIEW_CTC ---- ");
                self.show();
            }

        });
        
        game.addHandler('get_group_history_response', function(data){
            console.log("==>> get_group_history_response: ", data);
            cc.fy.loading.hide();
            if(data.code == 0){
                if(self._curTab==0){
                    self._maxPage=data.maxPage;
                }
                
                self.refreshHistoryList(data.history);
            }
        });

        game.addHandler("ctc_guild_zhanji_detail",function(data){
            if(self.node.active==false){
                
            }else{
                self.showDetailViewInfo(data.idx);
            }
        });
    },

    initView(){
        // 作为弹框模式 不隐藏其它弹框
        this.setHideOther(false);

        cc.fy.utils.addClickEvent(this.allTab,this.node,"ZhanjiView","changeTab");
        cc.fy.utils.addClickEvent(this.myTab,this.node,"ZhanjiView","changeTab");
       
    },
    show:function(){
        this.node.active = true;
        cc.fy.guildMainMsg._isInclub=true;
        var curGuild =cc.fy.guildMainMsg.getCurClub();  
        if(!curGuild){
            return;
        }
        console.log("level",)
        if(curGuild.level>=1){ //会长，管理员
            this.allTab.active=true;
            this._curTab=0;
        }else{                 //普通成员
             this.allTab.active=false;
             this._curTab=1;
        }
        this.allTab.getComponent(cc.Toggle).isChecked=this._curTab==0;
        this.myTab.getComponent(cc.Toggle).isChecked=this._curTab==1;
         //圈子战绩
         this.sendZhanjiInfo(this._curTab);
    },
    close(){
        this._allList=null;
        this._myList=null;
        this._tabIndex=1;
        this._maxPage=1;
        this.baseView.active=true;
        this.detailView.active=false;
        this.node.active = false;
    },

   
    scrollEvent: function(sender, event) {
        var str="";
        switch(event) {
            case 0: 
            str= "Scroll to Top"; 
            break;
            case 1: 
            str = "Scroll to Bottom"; 
            console.log("Scroll to Bottom"+this._curTab);
            if(this._curTab==0){
                this.sendZhanjiInfo(this._curTab);
            }
            break;
            case 2: 
            str = "Scroll to Left"; 
            break;
            case 3: 
            str = "Scroll to Right"; 
            break;
            case 4: 
            str = "Scrolling"; 
            break;
            case 5: 
            str = "Bounce Top"; 
            break;
            case 6: 
            str = "Bounce bottom"; 
            break;
            case 7: 
            str = "Bounce left"; 
            break;
            case 8: 
            str = "Bounce right"; 
            break;
            case 9: 
            str = "Auto scroll ended"; 
            break;
        }
       
    },
    

    changeTab(event){
    
        if(event.target.name == 'allTab'){
            this._curTab=0;
            this._allList=null;
            this._tabIndex=1;
            this._maxPage=1;
        }else if(event.target.name == 'myTab'){
            this._curTab=1;
            this._myList=null;
        }
        this.sendZhanjiInfo(this._curTab);
    },
    //申请战绩数据
    sendZhanjiInfo(type){
        var curGuild =cc.fy.guildMainMsg.getCurClub();    
        //判断一下当前页签；

         if(curGuild != null){
             var curGuildInfo =curGuild.clubInfo;
             console.log("申请战绩数据"+type);
             cc.fy.loading.show();
             if(type==0){ //所有
                if(this._tabIndex<this._maxPage){
                    this._tabIndex++;
                }
                console.log("maxpage:")
                cc.fy.net.send("get_group_history_request_new", {"clubid":curGuildInfo.clubid, userid: cc.fy.userMgr.userId,index:this._tabIndex});
             }else {
                cc.fy.net.send("get_group_history_request_new", {"clubid":curGuildInfo.clubid, userid: cc.fy.userMgr.userId});
             }
             
         }
    },
    //刷新战绩列表
    refreshHistoryList(ret) {
        console.log("==>> refreshHistoryList --> ret: ", ret);
        ret = ret || [];
        let historyList = ret;
        var curGuild=cc.fy.guildMainMsg.getCurClub();

        cc.fy.loading.hide();
        
        //有记录
        if(historyList.length>0){
            this.nullView.active=false;
            this.zhanjiView.active=true;
            this.showBaseView();
            
            historyList.sort(function(a,b){
                return b.time - a.time; 
            });


            historyList.forEach(history => {
                history.seats.forEach(seat => {
                    seat.name = new Buffer(seat.name,'base64').toString();
                });
            });
            if(this._curTab==0){
                if(this._allList!=null && this._allList.length>0&& this._tabIndex<this._maxPage){
                    this._allList =this._allList.concat(historyList);
                }else if(this._allList!=null && this._allList.length>0&& this._tabIndex==this._maxPage){
                    for(let i=0;i<historyList.length;i++){
                        var index = (this._tabIndex-1)*10 +i;
                        this._allList[index]=historyList[i]; 
                    }
                }else{
                    this._allList=historyList;
                } 
                this.scrollViewBase.setData(this._allList);
            }else{
                this._myList = historyList;
                this.scrollViewBase.setData(this._myList);
            }
        }else {
            
            if(this._curTab==1 && this._allList!=null){
                this.scrollViewBase.setData([]);
                return;
            }
            this.nullView.active=true;
            this.zhanjiView.active=false;
        }
    },
    
    showBaseView(){
          this.baseView.active=true;
          this.detailView.active=false;
    },
    showDetailView(){
        this.baseView.active=false;
        this.detailView.active=true;
    },
    onBtnBackClicked:function(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.showBaseView();//返回战绩页面
    },
  
    //点击查看详情战绩
    showDetailViewInfo:function(idx){    
        console.log(idx);
        if (idx == null ) {
            return;
        }

        var historyData = null;
        if(this._curTab==0){
            historyData=this._allList[idx];
        }else{
            historyData=this._myList[idx];
        }
        cc.fy.zhanjiMsg._roomInfo=historyData;

        if (!historyData) {
            return;
        }
       // this.showDetailView();
       console.log("房间信息：",historyData);
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
                
                let conf =historyData.conf;
                let roomId= "房间:"+historyData.id;
                let difen ="";
                var noStr ="";
                if(historyData.numOfGames>=0 && historyData.maxGames>=0){
                    noStr = "  局数:"+historyData.numOfGames+"/"+historyData.maxGames;
                }
                let noType = "";
                if(conf){
                    if(conf.baseScore>=0){
                        difen ="  底分:"+conf.baseScore;
                    }
                    if(conf.base_score>=0){
                        difen ="  底分:"+conf.base_score;
                    }
                    if(conf.diFen>=0){
                        difen ="  底分:"+conf.diFen;
                    }
                    if (conf.type != null) {
                        noType = " ("+ cc.GAMETYPENAME[conf.type] +")";
                    }
                }
                
               
                self.detailInfo.string=roomId+difen+noStr+noType;
                //玩家昵称
                //初始化
                 
                for(let i = 0; i < 4; ++i){
                    let initName = self.detailTd.getChildByName("info" + i);
                    initName.active=false;
                }
                if(historyData.seats){
                    var otherIndex =0;
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
    //战绩详情列表
    initGameHistoryList:function(roomInfo,data)
    {
        console.log("room data",roomInfo);
        console.log("data",data);
     
       
        if(data!=null&&data.length>=0){ 
            data.sort(function(a,b){
                return a.create_time - b.create_time; 
             });
           
            this.scrollViewDetail.setData(data);
        }

    },
    onBtnClose(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.close();
    },
});
