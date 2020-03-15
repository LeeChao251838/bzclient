var GameMsgDef = require("GameMsgDef");

cc.Class({
    extends: cc.Component,

    properties: {
        lblRoomID: {
            "default": null,
            type: cc.Label
        },
        _prepare: null,       //准备节点
        _btnReady: null,      //准备按钮
        _seats: [],           //准备座位
        _timeLabel: null,     //时间节点
        _seats2: [],          //玩家座位
        _bgArr: null,         //桌布
        _lastPlayTime: null,  //上次说话时间
        _lastMinute: null, 
        _playingSeat: null,   //播放语音位置
        _voiceMsgQueue: [],   //语音队列
        _tiChuTime: null,     //踢出面板
        _loading:null,        //准备状态loading动画

        _friendContentScrollView:null,
        _friendContent:null,
        _friendViewitemTemp:null,
        _friendViewlist:null,
        _currentFriendList:null,
        _canInvListOriPosX:-880,
        
    },

    // use this for initialization
    onLoad: function () {
        if(cc.fy == null || cc.fy.gameNetMgr.roomId == null){
            if (cc.fy) {
                cc.fy.alert.show("连接超时，请检查网络连接！",function(){
                    cc.fy.userMgr.logOut();
                });
            }
            return ;
        }
        this._prepare = this.node.getChildByName("prepare");

        this.initView();      //初始化界面
        this.initSeats();     //初始化玩家位置
        this.initEventHandlers();  //初始化事件监听
        //this.addSound(this.node); 
    },

    initView: function(){
        var prepare =this.node.getChildByName("prepare");
        var seats = this._prepare.getChildByName("seats");
        var sides = [];
        if(cc.fy.gameNetMgr.seats.length == 2){
            sides = ["myself", "up"];
        }
        else{
            sides = ["myself", "right", "left"];
        }

        var gameChild = this.node.getChildByName("game");
        for (var i = 0; i < sides.length; ++i) {
            var psideNode = seats.getChildByName(sides[i]);
            psideNode.active = true;
            this._seats.push(psideNode.getComponent("Seat"));

            var sideNode = gameChild.getChildByName(sides[i]);
            var seat = sideNode.getChildByName("seat");
            this._seats2.push(seat.getComponent("Seat"));
           
        }
        
        this._tiChuTime = this._prepare.getChildByName("TiChuTime");

        var infobar =this.node.getChildByName("infobar");
        //房间ID
        this.lblRoomID = cc.find("left/roomId",infobar).getComponent(cc.Label);
        this.lblRoomID.string = cc.fy.gameNetMgr.roomId.toString();

        //时间
        this._timeLabel = cc.find("right/time",infobar).getComponent(cc.Label);

        //微信邀请
        var btnWechat = cc.find("btnLayout/btnWeichat",this._prepare);
        if (btnWechat) {
            cc.fy.utils.addClickEvent(btnWechat, this.node, "PDKGameRoom", "onBtnWeichatClicked");
        }
        
        //闲聊邀请
        var btnXianLiao = cc.find("btnLayout/btnXianLiao",this._prepare);
        if (btnXianLiao) { 
            cc.fy.utils.addClickEvent(btnXianLiao, this.node, "PDKGameRoom", "onBtnXianLiaoClicked");
        }


        //默往邀请
        var btnMoWang = cc.find("btnLayout/btnMoWang",this._prepare);
        if (btnMoWang) { 
            cc.fy.utils.addClickEvent(btnMoWang, this.node, "PDKGameRoom", "onBtnMoWangClicked");
        }
        //准备
        this._btnReady = this._prepare.getChildByName("btnLayout").getChildByName("btnReady");
        console.log("btnready  addclick")
        if(this._btnReady){
            cc.fy.utils.addClickEvent(this._btnReady, this.node, "PDKGameRoom", "onBtnReadyClicked");
        }
        
        //设置
        var btnSetting = cc.find("btnbox/btn_settings",this.node);
        this._loading =this._prepare.getChildByName("loading");
       
        if(btnSetting){
            cc.fy.utils.addClickEvent(btnSetting, this.node, "PDKGameRoom", "showPDKSetting");
        }

         //快捷语聊天
        var btnchat = cc.find("btnbox/btn_chat",this.node);
         cc.fy.utils.addClickEvent(btnchat, this.node, "PDKGameRoom", "onBtnChatClicked");

        //初始化按钮
        this.refreshBtns();

        if (cc.fy.pdkGameNetMgr.gamestate != "" ) {
            this.refreshBtns(false);
            this._btnReady.active = false;
            this._tiChuTime.active = false;
            this._loading.active=true;
        }

        if(cc.fy.replayMgr.isReplay()){
            this.refreshBtns(false);
            this._tiChuTime.active = false;
            btnSetting.active = false; 
        }
        // //桌布设置   放到changeSKinMsg里面去设置
        // this.setZhuobu();
        

        var btnGuildFriend = prepare.getChildByName("btnGuildFriend");
        cc.fy.utils.addClickEvent(btnGuildFriend.getComponent(cc.Button), this.node, "PDKGameRoom", "getOnlineList");
        var btnHide = prepare.getChildByName("btnHide");
        cc.fy.utils.addClickEvent(btnHide.getComponent(cc.Button), this.node, "PDKGameRoom", "hideOnlineList");
        if (this._friendViewlist == null) {
            this._friendViewlist = prepare.getChildByName("canInvList").getChildByName("listScrollView");
            this._canInvListOriPosX = -880;
            this._friendViewlist.active = false;
            this._friendContentScrollView = this._friendViewlist.getComponent(cc.ScrollView);
        }
        if (this._friendContent == null) {
            this._friendContent = this._friendViewlist.getChildByName("view").getChildByName("content");
            this._friendContent.active = true;
        }
        this._friendViewitemTemp = cc.find("view/content/onlineUser", this._friendViewlist);
        if (cc.fy.replayMgr.isReplay() == true) {
            this.node.getChildByName("btnbox").active = false;
        }    
    },
   
    refreshBtns: function (state) {
        var btnWeichat = this._prepare.getChildByName("btnLayout").getChildByName("btnWeichat");
         var btnXianLiao = this._prepare.getChildByName("btnLayout").getChildByName("btnXianLiao");
        var btnGuildFriend = this._prepare.getChildByName("btnGuildFriend");
        var btnHide = this._prepare.getChildByName("btnHide");
        var btnMoWang =this._prepare.getChildByName("btnLayout").getChildByName("btnMoWang");
        if(state){
            this._btnReady.active = state;
        }
        
        var isIdle = false;
        if (state == null) {
            isIdle = cc.fy.gameNetMgr.numOfGames == 0;
        } else {
            isIdle = state;
        }
        
        btnWeichat.active = isIdle;
        btnMoWang.active =isIdle;
        btnXianLiao.active = isIdle && cc.FREECHAT_GAMEROOM;

        if (cc.fy.gameNetMgr.conf != null && cc.fy.gameNetMgr.conf.isClubRoom &&
            cc.fy.gameNetMgr.numOfGames == 0) {
            btnGuildFriend.active = true;
        }
        else{
            btnGuildFriend.active = false;
            // btnHide.active = false;
             //关闭邀请圈成员
            cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWKCANINVLISTVIEW_CTC, {isShow:false});

        }

        let  canInvList = this._prepare.getChildByName("canInvList");
        canInvList.active = false;
        console.log("canInvList:false",canInvList.x);
    },

    getOnlineList:function(){
        if(this._clickTime != null){
            if(Date.now() - this._clickTime < 1000){
                return;
            }
        }
        this._clickTime = Date.now();
        var self = this;
        var data = {
            userId:cc.fy.userMgr.userId,
            clubid:cc.fy.gameNetMgr.conf.clubId,
        }
        cc.fy.http.sendRequest('/get_online_user', data, function(ret){
            console.log("get_online_user");
            console.log(ret);
            // self.showOnlineList(ret);
            // self.RefreshFriendList(ret.data.playerUser);
            if(ret.data.playerUser){
                cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWKCANINVLISTVIEW_CTC, {isShow:true,content:ret.data.playerUser});
            }
           
        },"http://" + cc.fy.SI.clubHttpAddr); 
    },

    showOnlineList:function(ret){
        let  canInvList = this._prepare.getChildByName("canInvList");
        let  btnHide = this._prepare.getChildByName("btnHide");
        let  btnGuildFriend = this._prepare.getChildByName("btnGuildFriend");
        canInvList.active = true;
        canInvList.x = this._canInvListOriPosX + 280;
        console.log("canInvList:true",canInvList.x);
        btnHide.active = true;
        btnGuildFriend.active = false;
    },

    RefreshFriendList:function(ret){
        let  canInvList = this._prepare.getChildByName("canInvList");
        canInvList.active=true;
        let friendList = ret;
        this._friendContent.removeAllChildren();
        this._friendViewlist.active = true;
        if(this._friendContentScrollView)
        {
            this._friendContentScrollView.scrollToTop();
        }

        if (friendList != null && friendList.length> 0) {
            this._currentFriendList = friendList;
            for (var i = 0; i < friendList.length; i++) {
                var data = friendList[i];
                var node = this.getFriendViewItem(i);
                node.active = data.userId == cc.fy.userMgr.userId ? false : true;
                node.idx = i;
                node.getChildByName('nameLabel').getComponent(cc.Label).string = data.name ;
                let imageloader = node.getChildByName("headimg").getComponent("ImageLoader");
                node.getChildByName("onlineLabel").getComponent(cc.Label).string = data.isPlay ? "游戏中" : "空闲";
                if (data.headimg != null && data.headimg != "") {
                    imageloader.setUrl(data.headimg);
                }
                let btnInv = node.getChildByName("btnInv");
                btnInv.idx = i;
                if (btnInv) {
                    cc.fy.utils.addClickEvent(btnInv.getComponent(cc.Button), this.node, "PDKGameRoom", "InvFriend");
                }
                btnInv.active = !data.isPlay;
            }
        }
    },

    InvFriend:function(event){
        let  curNode = event.target;
        if (curNode.idx == null ) {
            return;
        }
        if (this._currentFriendList == null) {
            return;
        }
        setTimeout(function(){
            if (curNode == null) {
                return;
            }
            curNode.getComponent(cc.Button).interactable = true;
            curNode.color = new cc.Color(255, 255, 255);
        }, 5000);
        curNode.getComponent(cc.Button).interactable = false;
        curNode.color = new cc.Color(150, 150, 150);
        let friendData = this._currentFriendList[curNode.idx];
        var self = this;
        var data = {
            userId :cc.fy.userMgr.userId,
            invite_userId:friendData.userId,
            clubId:cc.fy.gameNetMgr.conf.clubId,
            clubname:"xxx",
            conf:JSON.stringify(cc.fy.gameNetMgr.conf),
            roomid:cc.fy.gameNetMgr.roomId,
            username:cc.fy.userMgr.userName,
        }
        cc.fy.http.sendRequest('/invite_user_play', data, function(ret){
            console.log("invite_user_play");
            console.log(ret);
        },"http://" + cc.fy.SI.clubHttpAddr); 
    },


    hideOnlineList:function(){
        let  canInvList = this._prepare.getChildByName("canInvList");
        let  btnHide = this._prepare.getChildByName("btnHide");
        let  btnGuildFriend = this._prepare.getChildByName("btnGuildFriend");
        canInvList.active = false;
        canInvList.x = this._canInvListOriPosX - 280;
        console.log("canInvList:false",canInvList.x);
        btnHide.active = false;
        btnGuildFriend.active = true;
    },

    initSeats: function () {
        var seats = cc.fy.gameNetMgr.seats;
        if (seats == null) {
            console.log("initSeats seats = null");
            return;
        }

        for (var i = 0; i < seats.length; ++i) {
            this.initSingleSeat(seats[i]);
        }

        this.initSameIP(); // 检测同ip
        cc.fy.anticheatingMgr.check();
    },

    initSingleSeat: function (seat) {
        var index = cc.fy.gameNetMgr.getLocalIndex(seat.seatindex);
        var isOffline = !seat.online;
        var isZhuang = seat.seatindex == cc.fy.gameNetMgr.button;
        this._seats[index].setInfo(seat.name, seat.score);
        this._seats[index].setReady(seat.ready);
        this._seats[index].setOffline(isOffline);
        this._seats[index].setID(seat.userid);
        this._seats[index].voiceMsg(false);
        this._seats[index].setSameIP(cc.fy.anticheatingMgr.isSameIP(seat));

        this._seats2[index].setInfo(seat.name, seat.score);
        this._seats2[index].setZhuang(isZhuang);
        this._seats2[index].setOffline(isOffline);
        this._seats2[index].setID(seat.userid);
        this._seats2[index].setSameIP(cc.fy.anticheatingMgr.isSameIP(seat));
        this._seats2[index].voiceMsg(false);

        var fangzhu1 = this._seats[index].node.getChildByName("fangzhu");
        var fangzhu2 = this._seats2[index].node.getChildByName("fangzhu");
        if(seat.seatindex == 0 && cc.fy.gameNetMgr.conf.aagems != 1 && cc.fy.gameNetMgr.conf.isClubRoom != true){
            fangzhu1.active = true;
            fangzhu2.active = true;
        }
        else{
            fangzhu1.active = false;
            fangzhu2.active = false;
        }     

        if(index == 0 && cc.fy.pdkGameNetMgr.gamestate == ""){
            this._btnReady.active = !seat.ready;
            this._loading.active=seat.ready;
            this._tiChuTime.active = this._btnReady.active;
           
        }
    },
    //全关
    doQuanGuan:function(data){
        var list=data.list;
        if(list==null || list.length==0){
            return;
        }
        for(let i=0;i<list.length;i++){
            if(list[i]){
                var index = cc.fy.gameNetMgr.getLocalIndex(i);
                this._seats2[index].quanGuan();
            }
        }
    },
    initSameIP: function () {
        var seats = cc.fy.gameNetMgr.seats;
        if (seats == null) {
            console.log("initSeats seats = null");
            return;
        }

        for (var i = 0; i < seats.length; ++i) {
                var index = cc.fy.gameNetMgr.getLocalIndex(seats[i].seatindex);
                this._seats[index].setSameIP(cc.fy.anticheatingMgr.isSameIP(seats[i]));
                this._seats2[index].setSameIP(cc.fy.anticheatingMgr.isSameIP(seats[i]));
        }

        cc.fy.gpsAlertMsg.initGPS();
        cc.fy.gpsAlertMsg.setDistance();
    },

    initEventHandlers: function () {
        var self = this;
        var game =cc.fy.gameNetMgr;
        //新玩家进房间
        game.addHandler('new_user', function(data){
            self.initSingleSeat(data);
            self.initSameIP(); // 检测同ip
            cc.fy.gameNetMgr.dispatchEvent("gps_info_result");
            console .log("new_user");
        })

        //玩家状态改变
        game.addHandler('user_state_changed', function (data) {
            console.log("user_state_change")
            self.initSingleSeat(data);
            self.initSameIP(); // 检测同ip
            cc.fy.gameNetMgr.dispatchEvent("gps_info_result");
        });

        game.addHandler("new_gps_info",function(data){
            console .log("new_gps_info");
            self.initSameIP(); // 检测同ip
            cc.fy.gameNetMgr.dispatchEvent("gps_info_result");
        });

        //开始游戏
        game.addHandler('pdk_game_begin', function (data) {
            self.refreshBtns(false);
            self.initSeats();
        });

        //牌局数
        game.addHandler('pdk_game_num', function (data) {
            console.log('+++++++++++   22222222222222');
            self.refreshBtns();
        });

        game.addHandler('voice_msg', function (data) {
            
            self._voiceMsgQueue.push(data);
            self.playVoice();
        });

        //聊天
        game.addHandler('chat_push', function (data) {
            
            var idx = cc.fy.gameNetMgr.getSeatIndexByID(data.sender);
            var localIdx = cc.fy.gameNetMgr.getLocalIndex(idx);
            self._seats[localIdx].chat(data.content);
            self._seats2[localIdx].chat(data.content);
        });
        
        //快捷语
        game.addHandler('quick_chat_push', function (data) {  

            var idx = cc.fy.gameNetMgr.getSeatIndexByID(data.sender);
            var localIdx = cc.fy.gameNetMgr.getLocalIndex(idx);
            var index = data.content;
            console.log("content：",index);
            var info =  cc.fy.chatBagMsg.getQuickChatInfo(index);
            self._seats[localIdx].chat(info.content2);
            self._seats2[localIdx].chat(info.content2);
            var sex = 0;
            var cont=null;
            if(cc.fy.baseInfoMap){
                cont = cc.fy.baseInfoMap[data.sender];                               
            }
            if(cont){
                sex = cont.sex;
                 cc.fy.audioMgr.playChat(info.sound,sex);
                return;
            }
            else{
                cc.fy.userMgr.getBaseInfo(data.sender,function(code,content){
                    if(content.name){
                        sex= content.sex;
                        cc.fy.audioMgr.playChat(info.sound,sex);
                       
                     } else{
                        cc.fy.audioMgr.playChat(info.sound,sex);
                     }
                 });
            } 
        });

        //表情
        game.addHandler('emoji_push', function (data) {
        
            var idx = cc.fy.gameNetMgr.getSeatIndexByID(data.sender);
            var localIdx = cc.fy.gameNetMgr.getLocalIndex(idx);
            self._seats[localIdx].emoji(data.content);
            self._seats2[localIdx].emoji(data.content);
        });
        //扔鸡蛋等动画
        game.addHandler('interactivaction_push', function (data) {
            if(data == null){
                return;
            }
            cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWUSEPROPVIEW_CTC, {isShow:true,content:data});
       
        });
        //全关，个人头像上动画
        game.addHandler('pdk_quanguan', function(data){
            self.doQuanGuan(data);
        });
       
        
        game.addHandler('cc_pdk_stc_gamedata', function(data){
            self.initSeats();
        });

        game.addHandler('pdk_game_over',function(data){
            var seats = cc.fy.gameNetMgr.seats;
            for (var i = 0; i < seats.length; ++i) {
                seats[i].ready = false;
            }
            
            self.initSeats();
            self._loading.active=false;
            self._btnReady.active=false;
            self._tiChuTime.active=false;
        });

        

    },
    //快捷语
    onBtnChatClicked:function(){
        cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWCHATBAGVIEW_CTC, {isShow:true});
    },
    

    //设置轮
    setTurn: function (turn) {
        var seats = cc.fy.gameNetMgr.seats;
        if (seats == null) {
            console.log("setTurn seats = null");
            return;
        }
        for (var i = 0; i < seats.length; ++i) {
            var index = cc.fy.gameNetMgr.getLocalIndex(seats[i].seatindex);
            this._seats2[index].setTurn(turn == seats[i].seatindex);
        }
    },

    showPDKSetting(){
        cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWGAMESETTINGPDKVIEW_CTC, {isShow:true});
    },

    //准备按钮
    onBtnReadyClicked: function (){
        console.log("btn ready click")
        this._btnReady.active = false;
        this._tiChuTime.active = false;
        
        cc.fy.net.send('ready');
      
        //this.initSeats();
    },

    //解散房间
    onBtnDissolveClicked: function () {
        if (cc.FREEVERSION == true) {
            cc.fy.alert.show("是否确定解散房间？", function () {
                cc.fy.net.send("dispress");
            }, true);
        } else {
            cc.fy.alert.showFK(0, function () {
                cc.fy.net.send("dispress");
            }, true);
        }
        console.log("onBtnDissolveClicked");
    },

    //离开房间
    onBtnExit: function () {
        cc.fy.net.send("exit");
    },

     //闲聊邀请
     onBtnXianLiaoClicked: function () {
        var btnShare = cc.find("btnLayout/btnXianLiao",this._prepare);
        if (btnShare) {
            btnShare.getComponent(cc.Button).interactable = false;
            this.schedule(function () {
                btnShare.getComponent(cc.Button).interactable = true;
            }, 5);
        }

       
        var title = "苏州关牌";
        
        // 淮安 1  苏州 2  如皋 3  连云港 5 泰兴 7
        var param = "http://fyweb.51v.cn/szmj/images/icon.png";
        var userNum = this.getRoomUserNum();
        var queStr = "";
        if(userNum > 0 && userNum < cc.fy.gameNetMgr.seats.length){
            queStr = userNum + "缺" + (cc.fy.gameNetMgr.seats.length - userNum);
        }
        cc.fy.anysdkMgr.xianLiaoShareGame(cc.fy.gameNetMgr.roomId,"boxRoom",title + " " + queStr + " 房号:" +cc.fy.gameNetMgr.roomId ,cc.fy.gameNetMgr.getWanfa(),param);
    },
    //微信邀请
    onBtnWeichatClicked: function () {
        var btnShare = cc.find("btnLayout/btnWeichat",this._prepare);
     
        if (btnShare) {
            btnShare.getComponent(cc.Button).interactable = false;
           this.schedule(function () {
                btnShare.getComponent(cc.Button).interactable = true;
            }.bind(this), 5);
        }

       
        var title = "苏州关牌";
        
        // 淮安 1  苏州 2  如皋 3  连云港 5 泰兴 7
        var param = cc.InviteLink + encodeURIComponent("openPage=boxRoom&inviteCode=" + cc.fy.gameNetMgr.roomId);
        var userNum = this.getRoomUserNum();
        var queStr = "";
        if(userNum > 0 && userNum < cc.fy.gameNetMgr.seats.length){
            queStr = userNum + "缺" + (cc.fy.gameNetMgr.seats.length - userNum);
        }
        cc.fy.anysdkMgr.share(title + " " + queStr + " 房号:" + cc.fy.gameNetMgr.roomId, " 玩法:" + cc.fy.gameNetMgr.getWanfa(), param);
    },
    //默往邀请
    onBtnMoWangClicked: function () {
        var btnShare = cc.find("btnLayout/btnMoWang",this._prepare);
     
        if (btnShare) {
            btnShare.getComponent(cc.Button).interactable = false;
            this.schedule(function () {
                btnShare.getComponent(cc.Button).interactable = true;
            }.bind(this), 5);
        }

       
        var title = "苏州关牌";
        
        // 淮安 1  苏州 2  如皋 3  连云港 5 泰兴 7
        var param =  cc.InviteLink + encodeURIComponent("openPage=boxRoom&inviteCode=" + cc.fy.gameNetMgr.roomId);
        var userNum = this.getRoomUserNum();
        var queStr = "";
        if(userNum > 0 && userNum < cc.fy.gameNetMgr.seats.length){
            queStr = userNum + "缺" + (cc.fy.gameNetMgr.seats.length - userNum);
        }
        cc.fy.anysdkMgr.MoWangShareLink(title + " " + queStr + " 房号:" + cc.fy.gameNetMgr.roomId, " 玩法:" + cc.fy.gameNetMgr.getWanfa(), param);
    },
    update: function (dt) {

        var minutes = Math.floor(Date.now() / 1000 / 60);
        if (this._lastMinute != minutes) {
            this._lastMinute = minutes;
            var date = new Date();
            var h = date.getHours();
            h = h < 10 ? "0" + h : h;

            var m = date.getMinutes();
            m = m < 10 ? "0" + m : m;
            if (this._timeLabel) {
                this._timeLabel.string = "" + h + ":" + m;
            }
        }

        if (this._lastPlayTime != null) {
            if (Date.now() > this._lastPlayTime + 200) {
                this.onPlayerOver();
                this._lastPlayTime = null;
            }
        } else {
            this.playVoice();
        }
    },

    //播放语音
    playVoice: function () {
        if (this._playingSeat == null && this._voiceMsgQueue.length) {
            console.log("playVoice2");
            var data = this._voiceMsgQueue.shift();
            var idx = cc.fy.gameNetMgr.getSeatIndexByID(data.sender);
            var localIndex = cc.fy.gameNetMgr.getLocalIndex(idx);
            this._playingSeat = localIndex;
            this._seats[localIndex].voiceMsg(true);
            this._seats2[localIndex].voiceMsg(true);

            var msgInfo = JSON.parse(data.content);

            var msgfile = "voicemsg.amr";
            cc.fy.voiceMgr.writeVoice(msgfile, msgInfo.msg);
            cc.fy.voiceMgr.play(msgfile);
            this._lastPlayTime = Date.now() + msgInfo.time;
        }
    },

    //语音结束
    onPlayerOver: function () {
        cc.fy.audioMgr.resumeAll();
        var localIndex = this._playingSeat;
        this._playingSeat = null;
        this._seats[localIndex].voiceMsg(false);
        this._seats2[localIndex].voiceMsg(false);
    },

    onDestroy: function () {
        cc.fy.voiceMgr.stop();
        //        cc.fy.voiceMgr.onPlayCallback = null;
    },

    getFriendViewItem:function(index){
        var content = this._friendContent;
        var viewitemTemp = this._friendViewitemTemp;
        var node = cc.instantiate(viewitemTemp);
        content.addChild(node);
        return node;
    },
    //获取房间玩家数目
    getRoomUserNum:function(){
        var num = 0;
        if(cc.fy.gameNetMgr.seats != null){
            for(var i=0;i<cc.fy.gameNetMgr.seats.length;i++){
                if(cc.fy.gameNetMgr.seats[i] && cc.fy.gameNetMgr.seats[i].userid != 0){
                    num++;
                }
            }
        }
        return num;
    },

    playBtnClickSound: function(){
        // cc.fy.audioMgr.playSFX("click_pop.mp3");
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
    },

    addSound:function(curNode){
        if (curNode.childrenCount == 0) {
            return;
        }
        for (var i = 0; i < curNode.childrenCount; i++) {
            let newNode = curNode.children[i];
            if (newNode.getComponent(cc.Button) != null && this.checkIsNeed(newNode)) {
                cc.fy.utils.addClickEvent(newNode.getComponent(cc.Button),this.node,"PDKGameRoom","playBtnClickSound");
            }
            this.addSoundS2(newNode);
        }
    },

    addSoundS2:function(curNode){
        if (curNode.childrenCount == 0) {
            return;
        }
        for (var i = 0; i < curNode.childrenCount; i++) {
            let newNode = curNode.children[i];
            if (newNode.getComponent(cc.Button) != null && this.checkIsNeed(newNode)) {
                cc.fy.utils.addClickEvent(newNode.getComponent(cc.Button),this.node,"PDKGameRoom","playBtnClickSound");
            }
            this.addSound(newNode);
        }
    },

    checkIsNeed:function(node){
        let banList = ["btnWeichat","btnShare","btnshare"];
        let needList = [];
        if (needList.indexOf(node.name) != -1) {
            return true;
        }
        if (banList.indexOf(node.name) != -1) {
            return false;
        }
        if (node.getComponent(cc.Button) != null && node.getComponent(cc.Button).clickEvents.length == 0) {
            return false;
        }
        return true;
    },

});
