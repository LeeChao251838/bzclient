var md5 = require("md5");

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        _btnLottery: null,
        _btnLotteryGet: null,
        _btnShare: null,
        _lottery: null,
        _lotteryResult: null,
        _labDes: null,
        _lblGems: null,
        _sprMask: null,
        _prizeResultContent: null,
        _shareContent: null,
        _btnShareToFriend: null,
        _btnShareToMoment: null,
        _labTip: null,
        _btnShareToGet: null,
        _btnSure: null,
        _btnCloseLotteryContent: null,
        _btnCloseShareContent: null,
        _sprToShare: null,
        _sprShareToGet: null,
        _zhuanpan:null,

        _isshare:false,
        _isgame8:false,
        _isgame16:false,

        _resultHistory:null,
        _historyExit:null,
        _emptyTip:null,
        _contentScrollView:null,
        _content:null,
        _viewitemTemp:null,
        _viewlist:null,

        _userid: null,
        // _unionid:null,
        _mainURL: null,
        _userinfo: null,
        _signature: null,
        _prizeContent: null,
        _lightNormalContent: null,
        _lightRotateContent: null,
        _lastCheckTime: -1,
        _lastNormalRandomIndex: -1,
        _lastRotateRandomIndex: -1,
        _curRotateIndex: 0,
        _lottery_results_des: [],

        _lottery_items_des: [],

        _rotate:0,
        _result: null,
        _shareTime:0,
        _redpack:0,
        // _shareType:null,


        sharePic: {
            default: null,
            type: cc.Texture2D
        },
    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        this._mainURL = cc.activityURL;
        // this._mainURL = "http://rghall.javgame.com:32200";
        var url = this.getHallUrl();
        if(url != null){
            this._mainURL = url;
        }
        this._lottery_results_des = ["谢谢参与","1张房卡", "3张房卡", "5张房卡", "6张房卡", "8张房卡", "9张房卡", "1张羊汤卷"];
        this._lottery_items_des = [4,1,2,3,5,6,7,0];
        // 抽奖界面
        if (this._lottery == null) {
            this._lottery = this.node.getChildByName("lottery2");
        }
        // 大厅抽奖按钮
        // if (this._btnLottery == null) {
        //     this._btnLottery = this.node.getChildByName("main_bottom").getChildByName("gridbutton").getChildByName("btn_share1")
        //     cc.fy.utils.addClickEvent(this._btnLottery.getComponent(cc.Button), this.node, "lottery", "onShowLotteryContent");
        // }
        // 抽奖按钮
        if (this._btnLotteryGet == null) {
            this._btnLotteryGet = this._lottery.getChildByName("zhuanpan").getChildByName("choujiangbtn").getComponent(cc.Button);
            cc.fy.utils.addClickEvent(this._btnLotteryGet.getComponent(cc.Button), this.node, "lottery", "onButtonLottery");
        }
        if (this._zhuanpan == null) {
            this._zhuanpan = this._lottery.getChildByName("zhuanpan").getChildByName('dipan');
        }
        // 抽奖界面关闭按钮
        if (this._btnCloseLotteryContent == null) {
            this._btnCloseLotteryContent = this._lottery.getChildByName("exitbtn");
            cc.fy.utils.addClickEvent(this._btnCloseLotteryContent.getComponent(cc.Button), this.node, "lottery", "onCloseLotteryContent");
        }
        // 大厅房卡数量
        if (this._lblGems == null) {
            this._lblGems = cc.find("Canvas/top_left/headinfo/lblGems").getComponent(cc.Label);
        }
        // 奖励展示界面
        if (this._lotteryResult == null) {
            this._lotteryResult = this._lottery.getChildByName("lotteryResult");
            this._labDes = this._lotteryResult.getChildByName("labDes").getComponent(cc.Label);
            this._lotteryResult.active = false;
        }
        // 抽奖界面里的分享按钮
        if (this._btnShare == null) {
            this._btnShare = this._lottery.getChildByName("fenxiangbtn");
            cc.fy.utils.addClickEvent(this._btnShare.getComponent(cc.Button), this.node, "lottery", "showShareContent");
        }
        // 奖项
        if (this._prizeResultContent == null) {
            this._prizeResultContent = this._lotteryResult.getChildByName("prizeResultContent");
            this.hidePirzeResultContent();
        }
        // 抽奖界面遮罩
        // if (this._sprMask == null) {
        //     this._sprMask = this._lottery.getChildByName("zhuanpan").getChildByName("sprMask");
        //     this._sprMask.active = true;
        // }

        // 分享界面
        if (this._shareContent == null) {
            this._shareContent = this._lottery.getChildByName("shareContent");
            this._shareContent.active = false;
        }
        // 分享至朋友按钮
        if (this._btnShareToFriend == null) {
            this._btnShareToFriend = this._shareContent.getChildByName("btnShareToFriend");
            cc.fy.utils.addClickEvent(this._btnShareToFriend.getComponent(cc.Button), this.node, "lottery", "onShare");
        }
        // 分享至朋友圈按钮
        if (this._btnShareToMoment == null) {
            this._btnShareToMoment = this._shareContent.getChildByName("btnShareToMoment");
            cc.fy.utils.addClickEvent(this._btnShareToMoment.getComponent(cc.Button), this.node, "lottery", "onShare");
        }
        // 分享界面的分享图片
        if (this._sprToShare == null) {
            this._sprToShare = this._shareContent.getChildByName("sprToShare");
            this._sprToShare.active = false;
        }
        // 关闭分享界面按钮
        if (this._btnCloseShareContent == null) {
            this._btnCloseShareContent = this._shareContent.getChildByName("btnShareClose");
            cc.fy.utils.addClickEvent(this._btnCloseShareContent.getComponent(cc.Button), this.node, "lottery", "hideShareContent");
        }
        // 抽奖界面剩余分享次数提示
        if (this._labTip == null) {
            this._labTip = this._lottery.getChildByName("numberLabel").getComponent(cc.Label);
        }
        // 抽中红包时的分享按钮
        if (this._btnShareToGet == null) {
            this._btnShareToGet = this._lotteryResult.getChildByName("btnShareToGet");
            this._btnShareToGet.active = false;
            cc.fy.utils.addClickEvent(this._btnShareToGet.getComponent(cc.Button), this.node, "lottery", "shareToGet");
        }
        // 奖励展示界面中的确定按钮
        if (this._btnSure == null) {
            this._btnSure = this._lotteryResult.getChildByName("btnSure");
            this._btnSure.active = false;
            cc.fy.utils.addClickEvent(this._btnSure.getComponent(cc.Button), this.node, "lottery", "hidePrizeContent");
        }
        // 奖励展示界面中的分享图片
        if (this._sprShareToGet == null) {
            this._sprShareToGet = this._lotteryResult.getChildByName("share_erweima");
            this._sprShareToGet.active = false;
        }
        // 抽奖记录
        if (this._resultHistory == null) {
            this._resultHistory = this._lottery.getChildByName("resultHistory");
            this._resultHistory.active = false;
        }
        // 抽奖记录退出按钮
        if (this._historyExit == null) {
            this._historyExit = this._resultHistory.getChildByName("exitBtn");
            this._historyExit.active = true;
             cc.fy.utils.addClickEvent(this._historyExit.getComponent(cc.Button), this.node, "lottery", "hideresultHistory");
        }
          // 抽奖记录为空提示
        if (this._emptyTip == null) {
            this._emptyTip = this._resultHistory.getChildByName("emptyTip");
            this._emptyTip.active = true;
        }
         // 抽奖记录scrollview
        if (this._viewlist == null) {
            this._viewlist = this._resultHistory.getChildByName("viewlist");
            this._viewlist.active = false;
            this._contentScrollView = this._viewlist.getComponent(cc.ScrollView);
        }
          // 抽奖记录scrollview内容
        if (this._content == null) {
            this._content = this._viewlist.getChildByName("view").getChildByName("content");
            this._content.active = true;
            console.log('_content' + this._content);
        }

        this._viewitemTemp = cc.find("view/content/hostory1", this._viewlist);

        // this._prizeContent = this._lottery.getChildByName("prizeContent");
        // for (var i = 0; i < this._prizeContent.childrenCount; ++i) {
        //     var item = this._prizeContent.children[i];
        //     if (item != null) {
        //         item.index = i;
        //     }
        // }

        this._lightNormalContent = this._lottery.getChildByName("zhuanpan").getChildByName('lightContent');
        for (var i = 0; i < this._lightNormalContent.childrenCount; ++i) {
            var item = this._lightNormalContent.children[i];
            if (item != null) {
                item.active = false;
            }
        }

        this._lightRotateContent = this._lottery.getChildByName("zhuanpan").getChildByName("rotateContent");
        for (var i = 0; i < this._lightRotateContent.childrenCount; ++i) {
            var item = this._lightRotateContent.children[i];
            if (item != null) {
                item.active = false;
            }
        }

        this._userid = cc.fy.userMgr.userId;
        this._userid = parseInt(this._userid);

        this.getBaseInfo(this._userid);/*, function(info){*/
        // if(info != null){
        //     self._unionid = info;
        //     cc.fy.userMgr.unionid = info;
        // }
        // else{
        //     console.log("==>> info is null!!!");
        // }
        // });
        
        if (!cc.fy.global.hasLotteryChance && cc.fy.userMgr.roomData == null && cc.fy.gameNetMgr.roomId == null) {
            this.autoShowLottery();
        }
    },

    hideNormalLightContent: function () {
        if (this.lightNormalTimer != null) {
            clearTimeout(this.lightNormalTimer);
            this.lightNormalTimer = null;
        }
        this._lightNormalContent.active = false;
        for (var i = 0; i < this._lightNormalContent.childrenCount; ++i) {
            var item = this._lightNormalContent.children[i];
            if (item != null) {
                item.active = false;
            }
        }
    },

    hideRatateLightContent: function (ret) {
        var self = this;
        if (this.lightRotateTimer != null) {
            clearTimeout(this.lightRotateTimer);
            this.lightRotateTimer = null;
        }
        for (var i = 0; i < this._lightRotateContent.childrenCount; ++i) {
            var item = this._lightRotateContent.children[i];
            if (item != null) {
                item.active = false;
            }
        }

        if (ret) {
           var activity_str = JSON.parse(ret.activity_str);
           var index = this._lottery_items_des[activity_str.index]
           this._lightRotateContent.children[index].active = true;
        
           setTimeout(function(){
            self._lightRotateContent.active = false;
            for (var i = 0; i < self._lightRotateContent.childrenCount; ++i) {
                var item = self._lightRotateContent.children[i];
                if (item != null) {
                    item.active = false;
                }
            }
        },500);
        
        }
        else{
            this._lightRotateContent.active = false;
            for (var i = 0; i < this._lightRotateContent.childrenCount; ++i) {
                var item = this._lightRotateContent.children[i];
                if (item != null) {
                    item.active = false;
                }
            }
        }
    },

    onShowLotteryContent: function () {
        this._lottery.active = true;
        this._btnLotteryGet.getComponent(cc.Button).interactable = false;
        // this._sprMask.active = true;
        this.tipForShow();
        this.showLightNormal();
    },

    onCloseLotteryContent: function () {
        this._lottery.active = false;
        if (this.lightNormalTimer != null) {
            clearTimeout(this.lightNormalTimer);
            this.lightNormalTimer = null;
        }
        if (this.lightRotateTimer != null) {
            clearTimeout(this.lightRotateTimer);
            this.lightRotateTimer = null;
        }
        if (this.totteryResultTimer != null) {
            clearTimeout(this.totteryResultTimer);
            this.totteryResultTimer = null;
        }
        if (this.prizeResultTimer != null) {
            clearTimeout(this.prizeResultTimer);
            this.prizeResultTimer = null;
        }
        if (this.shareTimer != null) {
            clearTimeout(this.shareTimer);
            this.shareTimer = null;
        }
        if (this.shareToGetTimer != null) {
            clearTimeout(this.shareToGetTimer);
            this.shareToGetTimer = null;
        }
        this._btnShareToFriend.getComponent(cc.Button).interactable = true;
        this._btnShareToMoment.getComponent(cc.Button).interactable = true;
        this._btnShareToGet.getComponent(cc.Button).interactable = true;
        this.hideNormalLightContent();
        this.hideRatateLightContent();
    },

    showLightNormal: function () {
        // this._btnLotteryGet.getComponent(cc.Button).interactable = true;
        var self = this;
        this._lightNormalContent.active = true;
        if (this._lastNormalRandomIndex != -1) {
            this._lightNormalContent.children[this._lastNormalRandomIndex].active = false;
            if (this._lastNormalRandomIndex<4) {
                this._lightNormalContent.children[this._lastNormalRandomIndex + 4].active = false;
            }
            else{
                this._lightNormalContent.children[this._lastNormalRandomIndex - 4].active = false;
            }
        }
        if (this._lastNormalRandomIndex == 7){
            var index = 0;
        }
        else{
            var index = this._lastNormalRandomIndex + 1;
        }
        if (this._lastNormalRandomIndex == index) {
            this.showLightNormal();
            return;
        }
        this._lastNormalRandomIndex = index;
        this._lightNormalContent.children[index].active = true;
        if (index<4) {
            this._lightNormalContent.children[index + 4].active = true;
        }
        else{
            this._lightNormalContent.children[index - 4 ].active = true;
        }

        this.lightNormalTimer = setTimeout(function () {
            self.showLightNormal();
        }, 500);
    },

    showLightRotate: function () {
        // var self = this;
        // this._lightRotateContent.active = true;
        // var realIndex = this._curRotateIndex % (this._lightRotateContent.childrenCount);
        // if (this._lastRotateRandomIndex != -1) {
        //     this._lightRotateContent.children[this._lastRotateRandomIndex].active = false;
        // }
        // this._lightRotateContent.children[realIndex].active = true;
        // this._lastRotateRandomIndex = realIndex;
        // this._curRotateIndex++;
        // this.lightRotateTimer = setTimeout(function () {
        //     self.showLightRotate();
        // }, 50);

        

    },

    startRotate:function(){
        var self = this;
        var actionBy = cc.rotateBy(0.05, 45);
        this._zhuanpan.runAction(cc.repeatForever(actionBy));
    },

    slowdownRotate:function(index){

        var self = this;
        this._zhuanpan.stopAllActions();
        var newIndex = this._lottery_items_des[index];
        var quanshu = Math.floor(this._zhuanpan.rotation/360) + 2;
        var actionBy2 = cc.rotateTo(2,quanshu*360 - newIndex * 45 );
        this._zhuanpan.runAction((cc.sequence(actionBy2,
            cc.callFunc(function(action,data){
                self._zhuanpan.stopAllActions();
                self._rotate = self._zhuanpan.rotation;
            }) 
        )));
    },
     
    //更新提示框
    refreshLabTip:function(ret){
        var maxTime = 0;
        var shareString ;
        if (ret) {
        	this._isshare = ret.isshare;
            this._isgame8 = ret.isgame8;
            this._isgame16 = ret.isgame16;      
        }
        if (this._isshare) {
      	    maxTime ++;
      	    shareString = '';
        }
        else{
      	    shareString = '每天分享可以获得一次抽奖机会';
        }
        if (this._isgame8) {
      	    maxTime ++;
        }
        if (this._isgame16) {
      	    maxTime ++;
        }
    
       // this._labTip.string = "抽奖机会用光啦！每天分享可以获得1次抽奖机会";
      

      if(maxTime == 3){
      	if (this._shareTime <= 0) {
      		this._labTip.string = "抽奖机会用光啦!";
      	}
      	else{
      		this._labTip.string = "当前有" + this._shareTime + "次抽奖机会!" + shareString;
      	}
      }
      else{
      	if (this._shareTime <= 0) {
      		this._labTip.string = "当前有0次抽奖机会!" + shareString;
      	}
      	else{
      		this._labTip.string = "当前有" + this._shareTime + "次抽奖机会!" + shareString;
      	}
      }



    },

    // 点击抽奖按钮
    onButtonLottery: function () {
        var self = this;
        // if(this._unionid == null){
        this.getBaseInfo(this._userid);/*, function(info){*/
        // if(info != null){
        if (cc.fy.userMgr.unionid != null) {
            this._btnLotteryGet.getComponent(cc.Button).interactable = true;
            this.canTotteryToday();
        }
        else {
            cc.fy.alert.show("微信重新授权后才能抽奖，点击确定重新授权！", function () {
                self.onCloseLotteryContent();
                cc.fy.userMgr.logOut();
            });
        }
    },

    autoShowLottery: function () {
        if (cc.fy.global.hasLotteryChance) {
            return;
        }
        var data = {
            userid: this._userid,
            activityid: 19,
        };

        var self = this;
        var onRec = function (ret) {
            console.log(ret);
            if (ret.errcode !== 0) {
                self._shareTime = 0;
                self._btnLotteryGet.getComponent(cc.Button).interactable = false;
                self.refreshLabTip(ret);
            }
            else if (ret.errcode == 0) {
                self._btnLotteryGet.getComponent(cc.Button).interactable = true;
                self._shareTime = ret.times;
                cc.fy.global.hasLotteryChance = true;
                self.onShowLotteryContent();
            }
        };

        cc.fy.http.sendRequest("/get_activity_islottery", data, onRec, this._mainURL);
    },

    tipForShare: function () {
        var data = {
            userid: this._userid,
            activityid: 0,
        };

        var self = this;
        var onRec = function (ret) {
            console.log(ret);
            if (ret.errcode !== 0) {
                self._shareTime = 0;
                self._btnLotteryGet.getComponent(cc.Button).interactable = false;
                self.refreshLabTip(ret);
            }
            else if (ret.errcode == 0) {
                self.refreshInfo();
                self._btnLotteryGet.getComponent(cc.Button).interactable = true;
                self._shareTime = ret.times;
                self.refreshLabTip(ret);
            }
        };

        cc.fy.http.sendRequest("/get_activity_islottery", data, onRec, this._mainURL);
    },

    tipForShow: function () {
        var data = {
            userid: this._userid,
            activityid: 19,
        };

        var self = this;
        var onRec = function (ret) {
            console.log(ret);
            if (ret.errcode !== 0) {
                self._shareTime = 0;
                self._btnLotteryGet.getComponent(cc.Button).interactable = false;
                self.refreshLabTip(ret);

            }
            else if (ret.errcode == 0) {
                self._shareTime = ret.times;
                self._btnLotteryGet.getComponent(cc.Button).interactable = true;
                self.refreshLabTip(ret);

            }
        };

        cc.fy.http.sendRequest("/get_activity_islottery", data, onRec, this._mainURL);
    },

    addShareWX: function () {
        var data = {
            userid: this._userid,
            activityid: 0,
            sharetype: 4,
        }

        var self = this;
        var onRec = function (ret) {
            console.log(ret);
        }

        cc.fy.http.sendRequest("/add_shareWX_res", data, onRec, this._mainURL);
    },

    // 今天是否有抽奖的机会
    canTotteryToday: function () {
        var data = {
            userid: this._userid,
            activityid: 19,
        };
        this._btnLotteryGet.getComponent(cc.Button).interactable = false;
        var self = this;
        var onRec = function (ret) {
            console.log(ret);
            if (ret.errcode !== 0) {
                self._shareTime = 0; 
                console.log(ret.errmsg);
                cc.fy.hintBox.show("当前无抽奖机会可用哦！");
            }
            else {
                self._shareTime = ret.times;
                self.hideNormalLightContent();
                self.startRotate();
                self.getTotteryResult();
            }
        };

        cc.fy.http.sendRequest("/get_activity_islottery", data, onRec, this._mainURL);
    },

    // 获取抽奖结果 
    getTotteryResult: function () {
        var data = {
            userid: this._userid,
            wx_uuid: cc.fy.userMgr.unionid,
            activityid: 0,
        };

        var self = this;
        var onRec = function (ret) {

            console.log(ret);
            if (ret.errcode !== 0) {
                self.getTotteryResult2();
            }
            else {
                var activity_str = JSON.parse(ret.activity_str);
                self._result = activity_str.index;
                self._redpack = ret.activity_time;
                cc.fy._activity_str = ret.activity_str;
                
                setTimeout(function(){
                    self.slowdownRotate(activity_str.index);
                },1000);
                self.totteryResultTimer = setTimeout(function(){
                     self._shareTime --;
                     if (self._shareTime > 0) {
                        self._btnLotteryGet.getComponent(cc.Button).interactable = true;
                    } else {
                        self._btnLotteryGet.getComponent(cc.Button).interactable = false;
                    }
                    self.refreshLabTip();
                    self.showLightNormal();
                    self.showPrize(activity_str.index,ret);
                    self.refreshInfo();
                }, 3500);
            }
        };
        cc.fy.http.sendRequest("/get_share_activity_result", data, onRec, this._mainURL);
    },

     getTotteryResult2: function () {
        var data = {
            userid: this._userid,
            wx_uuid: cc.fy.userMgr.unionid,
            activityid: 2,
        };

        var self = this;
        var onRec = function (ret) {

            console.log(ret);
            if (ret.errcode !== 0) {
                cc.fy.hintBox.show(ret.errmsg);
                self.showLightNormal();
                self.hideRatateLightContent();
                self._btnLotteryGet.getComponent(cc.Button).interactable = false;
            }
            else {
                var activity_str = JSON.parse(ret.activity_str);
                self._result = activity_str.index;
                self._redpack = ret.activity_time;
                cc.fy._activity_str = ret.activity_str;
                
                setTimeout(function(){
                    self.slowdownRotate(activity_str.index);
                },1000);
                self.totteryResultTimer = setTimeout(function(){
                     self._shareTime --;
                     if (self._shareTime > 0) {
                        self._btnLotteryGet.getComponent(cc.Button).interactable = true;
                    } else {
                        self._btnLotteryGet.getComponent(cc.Button).interactable = false;
                    }
                    self.refreshLabTip();
                    self.showLightNormal();
                    self.showPrize(activity_str.index,ret);
                    self.refreshInfo();
                }, 3500);
            }
        };
        cc.fy.http.sendRequest("/get_share_activity_result", data, onRec, this._mainURL);
    },

     getTotteryResult3:function(){
        var data = {
            userid:this._userid,
            wx_uuid:cc.fy.userMgr.unionid,
            activityid:3,
        };
        
        var self = this;
        var onRec = function(ret){
            console.log(ret);
            if(ret.errcode !== 0){
                cc.fy.hintBox.show(ret.errmsg);
                self.showLightNormal();
                self.hideRatateLightContent();
                self._btnLotteryGet.getComponent(cc.Button).interactable = false;
            }
            else{
               
                var activity_str = JSON.parse(ret.activity_str);
                self._result = activity_str.index;
                self._redpack = ret.activity_time;
                cc.fy._activity_str = ret.activity_str;
                
                setTimeout(function(){
                    self.slowdownRotate(activity_str.index);
                },1000);
                self.totteryResultTimer = setTimeout(function(){
                     self._shareTime --;
                     if (self._shareTime > 0) {
                        self._btnLotteryGet.getComponent(cc.Button).interactable = true;
                    } else {
                        self._btnLotteryGet.getComponent(cc.Button).interactable = false;
                        // self._sprMask.active = true;
                    }
                    self.refreshLabTip();
                    self.showLightNormal();
                    self.showPrize(activity_str.index,ret);
                    self.refreshInfo();
                }, 3500);
            }
        };
        
        if (this._shareTime <= 0) {
           cc.fy.hintBox.show("当前无抽奖机会可用哦！");
           return;
        }
        cc.fy.http.sendRequest("/get_share_activity_result", data, onRec, this._mainURL);
    },

    // 展示奖品
    showPrize: function (result, ret) {
        if (result == 0) {
            cc.fy.hintBox.show("谢谢参与");
            return;
        }
        this._lotteryResult.active = true;
        console.log("this._prizeResultContent.children",this._prizeResultContent.children);
        if (result == 1 || result == 2 || result == 3 || result == 4 || result == 5 || result == 6 ) {
            this._btnShareToGet.active = false;
            this._btnSure.active = true;
            this._prizeResultContent.children[0].active = true;
        }
        else {
            this._btnShareToGet.active = true;
            this._btnSure.active = false;
            this._prizeResultContent.children[1].active = true;
            var activity_str = JSON.parse(ret.activity_str);
            this._prizeResultContent.children[1].getChildByName('codeLabel').getComponent(cc.Label).string = "fypzmj" + parseInt(Math.random() * 10000);
        }
        var resultDes = this._lottery_results_des[result];
        this._labDes.string = resultDes;
    },

    hidePrizeContent: function () {
        this._lotteryResult.active = false;
        this.hidePirzeResultContent();
        
        if (this.prizeResultTimer != null) {
            clearTimeout(this.prizeResultTimer);
            this.prizeResultTimer = null;
        }
    },

    hidePirzeResultContent: function () {
        for (var i = 0; i < this._prizeResultContent.childrenCount; ++i) {
            var item = this._prizeResultContent.children[i];
            if (item != null) {
                item.active = false;
            }
        }
    },

    showShareContent: function () {
        this._shareContent.active = true;
    },

    hideShareContent: function () {
        this._shareContent.active = false;
    },

    onShare: function (event) {
        var self = this;
        var info = "随时随地想玩就玩，立邀朋友一起玩。当天分享还有机会赢取iPhone8和红包。";
        // this.hideShareContent();
        var name = event.target.name;
        var shareType = "1";
        if (name == "btnShareToFriend") {
            shareType = "1";
        }
        else if (name == "btnShareToMoment") {
            shareType = "2";
            this.tipForShare();
        }
        // else if(name == "btnShareToGet"){
        //     shareType = "2";
        //     info = "我在风云亳州麻将中喜中" + event.info + "元现金红包，大家一起来抢吧！先到先得！";
        // }
        this._btnShareToFriend.getComponent(cc.Button).interactable = false;
        this._btnShareToMoment.getComponent(cc.Button).interactable = false;
        this.shareTimer = setTimeout(function () {
            self._btnShareToFriend.getComponent(cc.Button).interactable = true;
            self._btnShareToMoment.getComponent(cc.Button).interactable = true;
            self.hideShareContent();
            if (shareType == "2") {
                // this._btnLotteryGet.interactable = true;
                // self._sprMask.active = false;
            }
        }, 5000);

        try {
            this._sprToShare.active = true;
            cc.fy.anysdkMgr.shareResult(shareType);          
        } catch (e) {
            cc.fy.anysdkMgr.share("邳州麻将", info, "http://fyweb.51v.cn/pzmj/", shareType);
        } finally {
            this._sprToShare.active = false;
        }
        // console.log("path1:" + this.sharePic);
        // var p = jsb.fileUtils.fullPathForFilename(this.sharePic);
        // console.log("path2:" + p);
        // cc.fy.anysdkMgr.shareImg(p, shareType);
    },

    shareToGet: function (event) {
        var self = this;
        
        //shareType 1 朋友  2 朋友圈
        var shareType = "2";
        var des = this._lottery_results_des[this._result];
        var info = "我在邳州麻将中喜中" + des + "，大家一起来抢吧！先到先得！";
        // console.log(info);
        // this.hidePrizeContent();
        this._btnShareToGet.getComponent(cc.Button).interactable = false;
        this.shareToGetTimer = setTimeout(function () {
            self._btnShareToGet.getComponent(cc.Button).interactable = true;
            self.hidePrizeContent();
            //分享得奖励逻辑开始
            self.addShareWX();
            //分享得奖励逻辑结束
        }, 5000);
        try {
            this._sprShareToGet.active = true;
              cc.fy.anysdkMgr.shareResult(shareType);          
        } catch (e) {
            cc.fy.anysdkMgr.share("邳州麻将", info, "http://fyweb.51v.cn/pzmj/", shareType);
        } finally {
            this._sprShareToGet.active = false;
        }


    },

    // 刷新显示数据
    refreshInfo: function () {
        var self = this;
        var onGet = function (ret) {
            if (ret.errcode !== 0) {
                console.log(ret.errmsg);
            }
            else {
                if (ret.gems != null) {
                    self._lblGems.string = ret.gems;
                }
            }
        };

        var data = {
            account: cc.fy.userMgr.account,
            sign: cc.fy.userMgr.sign,
        };
        cc.fy.http.sendRequest("/get_user_status", data, onGet.bind(this));
    },

    getBaseInfo: function (userid/*, callback*/) {
        var self = this;
        if (cc.fy.userMgr.unionid != null) {
            // callback(cc.fy.userMgr.unionid);
            return;
        }
        // else{
        cc.fy.http.sendRequest('/base_info', { userid: userid }, function (ret) {
            console.log(ret);
            // var uuid = null;
            if (ret.uuid != null) {
                // uuid = ret.uuid;
                // self._unionid = ret.uuid;
                cc.fy.userMgr.unionid = ret.uuid;;
            }
            // callback(cc.fy.userMgr.unionid);
        }, cc.fy.http.master_url);
        // }  
    },

    getHallUrl: function () {
        // 获取大厅服务器地址
        var url = cc.fy.http.url;
        var urlArr = url.split(':');
        if (urlArr != null && urlArr.length == 3) {
            return urlArr[0] + ":" + urlArr[1] + ":32200";
        }
        return null;
    },

    showresultHistory:function(){
       var self = this;

        this._resultHistory.active = true;

      

        var data = {
            userid:this._userid,
            activityid:0,
        };
        

        var initContent = function(ret){
            self._content.removeAllChildren();

            if (ret.errcode != 0){
                // cc.fy.hintBox.show(ret.errmsg);
            } 
            else{
                self._viewlist.active = true;
                self._emptyTip.active = false;
                if(self._contentScrollView)
                {
                   self._contentScrollView.scrollToTop();
                }


            }
            
          
            for (var i = 0; i < ret.data.length; i++) {
                var node = self.getViewItem(i);
                node.active = true;
                node.idx = i;
                var data = ret.data[i];
                var datetime = self.dateFormat(data.activitytime);

                var info = JSON.parse(data.activitystr);
                var prizeinfo;
                var danwei;
                if(info.index == 7) {
                    prizeinfo = '羊汤券';
                    danwei = '张';
                }
                else{
                    prizeinfo = '房卡';
                    danwei = '张';
                }

                node.getChildByName('label1').getComponent(cc.Label).string = prizeinfo ;
                node.getChildByName('label2').getComponent(cc.Label).string = data.cardnum + danwei ;
                node.getChildByName('label3').getComponent(cc.Label).string = datetime ;


            }

        };
      
        cc.fy.http.sendRequest("/get_activity_history_top30", data, initContent,this._mainURL);

    },
  
    dateFormat:function(time){
        var date = new Date(time);
        var datetime = "{0}-{1}-{2}\n{3}:{4}:{5}";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        month = month >= 10? month : ("0"+month);
        var day = date.getDate();
        day = day >= 10? day : ("0"+day);
        var h = date.getHours();
        h = h >= 10? h : ("0"+h);
        var m = date.getMinutes();
        m = m >= 10? m : ("0"+m);
        var s = date.getSeconds();
        s = s >= 10? s : ("0"+s);
        datetime = datetime.format(year,month,day,h,m,s);
        return datetime;
    },

    hideresultHistory:function(){
        this._resultHistory.active = false;
    },

    getViewItem:function(index){
        var content = this._content;
        var viewitemTemp = this._viewitemTemp;
        var node = cc.instantiate(viewitemTemp);
        content.addChild(node);
        return node;
    },

});
