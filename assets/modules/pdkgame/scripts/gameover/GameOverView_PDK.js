var GameMsgDef = require("GameMsgDef");
cc.Class({
    extends: require("BaseModuleView"),

    properties: {
        _gameplayer: 3,               //玩家人数
        _gameresult: null,            //大结算
        _seats: [],                   //玩家
        _win: null,                   //分数赢
        _lost: null,                  //分数输
        _isGameEnd: false,            //是否大结算
    
        _roomid: null,                //房间号
        _jushu: null,                 //局数
        _time: null,                  //时间
        _timeInfo:null,
        _lastMinute: null,
        _btnShare: null,              //分享按钮

        offset: 40,                   //牌间距
        _share: null,                 //分享
        _shareimg: null,              //全关分享图片
        _sharexl:null ,                //闲聊分享
        _sharemw:null,                 //默往分享
        _sharehy: null,               //分享好友
        _sharepyq: null,              //分享朋友圈
        _close: null,                 //关闭

        winAnim:sp.Skeleton,          // 赢的动画
        loseAnim:sp.Skeleton,         // 输的动画
        _isliuju:false
    },

    onLoad: function () {
        this.initView();
        this.initEventHandlers();
    },

    start:function(){
        
    },

    initEventHandlers:function(){
        var self = this;
        var game = cc.fy.gameNetMgr;
        
        game.addHandler(GameMsgDef.ID_SHOWGAMEOVERVIEW_PDK_CTC, function(data){
            if(data && data.isShow == false){
                self.hidePanel();
            }
            else{
                self.showPanel(data);
            }
        });
        //初始化事件监听
        
        game.addHandler('pdk_game_end',function(data){
            self._isGameEnd = true;
        });
    },

    showAction:function(){
        var self =this;
        if(this.winAnim.node.active==true){
            console.log("show win");
            this.winAnim.setAnimation(0, "chuxian", false);
            this.winAnim.setCompleteListener(function(){
                self.winAnim.setAnimation(0, "xuanhun", true);
            });
        }
        
        if(this.loseAnim.node.active==true){
            console.log("show lose");
            if(this._isliuju){
                this.loseAnim.setAnimation(0, "chuxian_liuju", false);
                this.loseAnim.setCompleteListener(function(){
                    self.loseAnim.setAnimation(0, "xunhuan_liuju", true);
                });
            }else{
                this.loseAnim.setAnimation(0, "chuxian", false);
                this.loseAnim.setCompleteListener(function(){
                    self.loseAnim.setAnimation(0, "xunhuan", true);
                });
            }
        }      
    },

    initView:function(){
        // 作为弹框模式 不隐藏其它弹框
        this.setHideOther(false);

        if(cc.fy.gameNetMgr.conf == null){
            return;
        }

        this._win = this.node.getChildByName("win");
        this._lost = this.node.getChildByName("lost");
        this._win.active = false;
        this._lost.active = false;

        var left=this.node.getChildByName("left");
        this._roomid = left.getChildByName("roomid").getComponent(cc.Label);
        this._jushu = left.getChildByName("jushu").getComponent(cc.Label);
        this._time = this.node.getChildByName("timelbl").getChildByName("time").getComponent(cc.Label);

        if(cc.fy.gameNetMgr.seats == null || cc.fy.gameNetMgr.seats.length <= 0){
            return;
        }

        this._gameplayer = cc.fy.gameNetMgr.seats.length;//cc.fy.gameNetMgr.conf.maxCntOfPlayers

        var listRoot = this.node.getChildByName("result_list");
        for(var i = 0; i < this._gameplayer; i++){
            var seat = "seat" + i;
            var seatnode = listRoot.getChildByName(seat);
            seatnode.active = true;
            var viewdata = {};
            viewdata.boompanel = seatnode.getChildByName('boompanel');
            viewdata.head = seatnode.getChildByName('head').getChildByName('headSpr').getComponent("ImageLoader");
            viewdata.username = seatnode.getChildByName('labName').getComponent(cc.Label);
            viewdata.pai = seatnode.getChildByName('pai');
            viewdata.winscore = seatnode.getChildByName('winScore').getComponent(cc.Label);
            viewdata.lostscore = seatnode.getChildByName('lostScore').getComponent(cc.Label);
            viewdata.quanguan = seatnode.getChildByName('quanguan');
            viewdata.fangzhu =seatnode.getChildByName('fangzhu');
            viewdata.leftNum =seatnode.getChildByName("leftNum");
            this._seats.push(viewdata);
        }
        if(this._gameplayer==2){
            listRoot.getChildByName("seat2").active=false;
        }
        var btnReady = this.node.getChildByName("btnReady");
        if(btnReady){
            cc.fy.utils.addClickEvent(btnReady,this.node,"GameOverView_PDK","onBtnReadyClicked");
        }

        this._btnShare = this.node.getChildByName("btnShare");
        if(this._btnShare){
            cc.fy.utils.addClickEvent(this._btnShare,this.node,"GameOverView_PDK","onBtnShareClicked");
        }

        //全关分享
        this._shareimg = this.node.getChildByName("shareimg");
        this._share = this.node.getChildByName("share");

        

        this._sharexl =this._share.getChildByName("layout").getChildByName('sharexl'); 
        if(this._sharexl){
            cc.fy.utils.addClickEvent(this._sharexl,this.node,"GameOverView_PDK","onBtnShareXLClicked");
        }

        this._sharexl.active = cc.FREECHAT_GAMEROOM;
        this._sharehy =this._share.getChildByName("layout").getChildByName('sharehy'); 
        if(this._sharehy){
            cc.fy.utils.addClickEvent(this._sharehy,this.node,"GameOverView_PDK","onBtnShareHYClicked");
        }
        this._sharemw = this._share.getChildByName("layout").getChildByName('sharemw');
        if(this._sharemw){
            cc.fy.utils.addClickEvent(this._sharemw,this.node,"GameOverView_PDK","onBtnShareMWClicked");
        }
        this._sharepyq =this._share.getChildByName("layout").getChildByName('sharepyq');
        if(this._sharepyq){
            cc.fy.utils.addClickEvent(this._sharepyq,this.node,"GameOverView_PDK","onBtnSharePYQClicked");
        }

        this._close = this._share.getChildByName("close");
        // if(this._close){
        //     cc.fy.utils.addClickEvent(this._close,this.node,"GameOverView_PDK","onBtnCloseClicked");
        // }
    },

    showPanel:function(data){
        this.node.active = true;
        let gameOverData = cc.fy.gameOverMsg_PDK.gameOverData;
        if(data && data.data){
            gameOverData = data.data;
        }

        this.onGameOver(gameOverData);
        this.showAction();
    },

    hidePanel:function(){
        this.node.active = false;
    },

    //单局游戏结束
    onGameOver: function(data){
        var result = data.results ? data.results:[];
        var haveQuanGuan = false;
        var winID = null;
        if (data.endinfo != null) {
            this._isGameEnd = true;
        }
        else{
            this._isGameEnd = false;
        }
        

        var bShowOver = false;
        for (let idx = 0; idx < result.length; idx++) {
            if (result[idx].hand && result[idx].hand.length > 0) {
                bShowOver = true;
                break;
            }
        }

        if (bShowOver == false) {
            this.hidePanel();
            cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWGAMERESULTVIEW_PDK_CTC, {isShow:true, data:data,time:this._timeInfo});
            return;
        }
        /**
         * 解散界面 
         * 自动解散无法实现 之前是注释掉的，现在放出来，功能正常，出问题再查
         */
        console.log("PDKGAME onGameOver --> ", result);
        if(this._seats.length == 0){
            return;
        }

        //赢牌张数
        var winNum=0;
        for(let i=0;i<result.length;i++){
            winNum+=result[i].hand.length;
        }


        for(var i = 0; i < this._seats.length; i++){

     
         
            var boom = null;

            var info = cc.fy.gameNetMgr.seats[i];

            var localIndex=cc.fy.gameNetMgr.getLocalIndex(info.seatindex);
            var data = result[i];

            var seat = this._seats[localIndex];
            //设置头像
            seat.head.setUserID(info.userid);
            //设置名字
            seat.username.string = cc.fy.utils.subStringCN(cc.fy.gameNetMgr.seats[i].name, 8, true);
            //设置房主
            
            if(cc.fy.gameNetMgr.conf.aagems==0&&info.seatindex==0&& cc.fy.gameNetMgr.conf.isClubRoom !=true){
                seat.fangzhu.active=true;
            }else{
                seat.fangzhu.active=false;
            }

            //输赢界面和分数显示
            if(data.win){    
                if(data.userId == cc.fy.userMgr.userId){
                    this._win.active = true;
                    this._lost.active = false;
                    
                }     
                winID = data.userId;
                seat.winscore.node.active = true;
                seat.winscore.string = "+" + data.score;
                seat.lostscore.node.active = false;
                seat.leftNum.color= new cc.Color(255,251,207);
                seat.leftNum.getComponent(cc.LabelOutline).color= new cc.Color(141,63,36);
            }
            else{
                if(data.userId == cc.fy.userMgr.userId){
                    this._win.active = false;
                    this._lost.active = true;
               
                    if(data.score==0){
                        this.loseAnim.node.active=true;
                        //流局  
                        this._isliuju=true;                 
                    }else{
                        this.loseAnim.node.active=true;
                        this._isliuju=false; 
                    }
                }   
                seat.winscore.node.active = false;
                seat.lostscore.node.active = true;
                seat.lostscore.string = data.score;   
               
                seat.leftNum.color= new cc.Color(215,236,255);
                seat.leftNum.getComponent(cc.LabelOutline).color= new cc.Color(18,73,120);    
            }
            if(data.score==0){
                seat.leftNum.active = false;
            }
            
            seat.leftNum.getComponent(cc.Label).string=data.hand.length==0?winNum:("-"+data.hand.length);
            seat.pai.removeAllChildren();
            if(data.hand == null || data.hand.length == 0){
                seat.pai.active = false;
            }
            else{
                seat.pai.active = true;

                var prefab = cc.fy.PDKGameMgr.getFoldsPokerPrefab();
                var sorthands = cc.fy.PDKGameMgr.sortCards(data.hand);
                for(var k = 0; k < sorthands.length; k++){
                    //console.log("PDKGAME HAND" + prefab);

                    var pdkpoker = cc.instantiate(prefab);
                    seat.pai.addChild(pdkpoker);

                    var poker = pdkpoker.getComponent("PDKPoker");
                    poker.show();
                    poker.setX(this.offset * k);
                    poker.setCard(data.hand[k]); 
                }
            }

            //炸弹标志显示
            if(data.numOfBomb == 0 || data.win == false || (cc.fy.gameNetMgr.conf.wanfa.indexOf(4) < 0 && cc.fy.gameNetMgr.conf.wanfa.indexOf(9) < 0) ){
                seat.boompanel.active = false;
                console.log("不显示炸弹",data.numOfBomb,data.win,cc.fy.gameNetMgr.conf.wanfa)
            }
            else{
                seat.boompanel.active = true;
                var bomb1=seat.boompanel.getChildByName("bomb1");
                var bomb2=seat.boompanel.getChildByName("bomb2");
                
                bomb1.getComponent(cc.Label).string="炸弹数:"+data.numOfBomb;
                if (cc.fy.gameNetMgr.conf.wanfa.indexOf(9) >= 0) {  // 算分
                     bomb2.getComponent(cc.Label).string="炸弹加分:"+(data.numOfBomb*5*cc.fy.gameNetMgr.conf.baseScore);
                }
                else{   // 翻倍
                    var beishu=1;
                    for(let j=data.numOfBomb;j>0;j--){
                        beishu *=2;
                    }
                     bomb2.getComponent(cc.Label).string="炸弹翻倍:X"+beishu;
                }

            }

            //全关标志显示
            if(data.isNoOutCard){
                seat.quanguan.active = true;
                haveQuanGuan = true;
            }
            else{
                seat.quanguan.active = false;
            }
            
        }

        if(haveQuanGuan && winID == cc.fy.userMgr.userId){
            this._share.active = true;
            var head =this._share.getChildByName("head").getChildByName("headSpr").getComponent("ImageLoader");
            head.setUserID(winID);
            var name =this._share.getChildByName("labName").getComponent(cc.Label);
            name.string=cc.fy.userMgr.userName;
        }
        else{
            this._share.active = false;
        }

        this.setRoomInfo();
    },

    //设置房间信息
    setRoomInfo: function(){
        if(this._roomid == null  || this._time == null || this._jushu ==null){
            return;
        }
        var date = new Date();
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? "0" + m : m;
        var d = date.getDate();
        d  = d  < 10 ? "0" + d  : d ;
        var h = date.getHours();
        h = h < 10 ? "0" + h : h;
        var min = date.getMinutes();
        min  = min  < 10 ? "0" + min  : min ;
        var timeStr = y + "-" + m + "-" + d + " " + h + ":" + min ;
        this._timeInfo=timeStr;
       
       
        var minutes = Math.floor(Date.now() / 1000 / 60);
        if (this._lastMinute != minutes) {
            this._lastMinute = minutes;
           
           
            this._time.string = "" + h + ":" + min;
        }

        this._roomid.string = cc.fy.gameNetMgr.roomId;
        
        var maxNumOfGames = [4,8,16];
        var totalGames = maxNumOfGames[cc.fy.gameNetMgr.conf.xuanzejushu];
        this._jushu.string = "局数:"+cc.fy.pdkGameNetMgr.juNum+"/"+totalGames;
        
    },

    onBtnReadyClicked:function(){
        console.log("onBtnReadyClicked");
        
        this.hidePanel();
        if(this._isGameEnd){
            cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWGAMERESULTVIEW_PDK_CTC, {isShow:true, data:cc.fy.gameOverMsg_PDK.gameOverData,time:this._timeInfo});
        }
        else{
              //继续是播放背景音乐
            cc.fy.audioMgr.playBGM("bgm_table.mp3",cc.GAMETYPE.PDK);
            console.log("send ready");
            cc.fy.gameNetMgr.dispatchEvent("ready_recv");
            cc.fy.net.send('ready');   
        }
      
    }, 

    onBtnShareClicked: function(){
        console.log("onBtnShareClicked");

        if(this._btnShare)
        {
            var btnReady =this.node.getChildByName("btnReady");
            this._btnShare.getComponent(cc.Button).interactable = false;
            btnReady.getComponent(cc.Button).interactable=false;
            this.schedule(function() {
                btnReady.getComponent(cc.Button).interactable=true;
                this._btnShare.getComponent(cc.Button).interactable = true;
            }, 5);
        }

        if(cc.sys.isNative){
            cc.fy.anysdkMgr.shareResult(1);
        }
    },

    //好友
    onBtnShareHYClicked: function(){
        this._share.active = false;
        if(!cc.sys.isNative){
            return;
        }

        this._shareimg.active = true;
        cc.fy.anysdkMgr.shareResult(1); 
        this._shareimg.active = false;
    },
     //闲聊
    onBtnShareXLClicked: function(){
        this._share.active = false;
        if(!cc.sys.isNative){
            return;
        }

        this._shareimg.active = true;
        cc.fy.anysdkMgr.xianLiaoShareDataImage();
        this._shareimg.active = false;
    },
    //默往分享
    onBtnShareMWClicked:function(){
        this._share.active = false;
        if(!cc.sys.isNative){
            return;
        }

        this._shareimg.active = true;
        cc.fy.anysdkMgr.MoWangShareDataImage();
        this._shareimg.active = false;
    },
    //朋友圈
    onBtnSharePYQClicked: function(){
        this._share.active = false;
        if(!cc.sys.isNative){
            return;
        }

        this._shareimg.active = true;
        cc.fy.anysdkMgr.shareResult("2"); 
        this._shareimg.active = false;
    },

    //关闭
    onBtnCloseClicked: function(){
        this._share.active = false;
    },

});
