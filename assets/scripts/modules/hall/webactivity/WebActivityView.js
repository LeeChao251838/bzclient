var GameMsgDef = require("GameMsgDef");
cc.Class({
    extends: require("BaseModuleView"),

    properties: {
        _btnWebActivity:null,
        _btnPanelClose:null,
        _webView:null,
        _btnVessel:null,
        _webData:null,
        _infomation:null,
        _btnVessel_0:null,
        _btnVessel_0_0:null,
        _btnVessel_0_1:null,
        _sBtn_0_0:null,
        _sBtn_0_1:null,  
        _exchangeCenterButtonArr:[], 
        _hotActivityButtonArr:[],  
        _currentIndex:0,   
    },

    onLoad(){
        this.initEventHandlers();
        this.initView();
    },

    initEventHandlers(){
        var self = this;
        var game = cc.fy.gameNetMgr;
        
        game.addHandler(GameMsgDef.ID_SHOWACTIVITYVIEW_CTC, function(data){
            if(data.isShow == false){
                self.close();
            }
            else{
                console.log("ID_SHOWACTIVITYVIEW_CTC ---- ");
                self.show();
            }
        });
        game.addHandler(GameMsgDef.ID_GETWEBACTIVITYURL_CTC, function(data){
            self.getWebActivityURL();
        })
    },

    initView(){
        // webView
        if(this._webView == null){
            this._webView = this.node.getChildByName("webview");
        }
        // 活动类型按钮容器
        if(this._btnVessel == null){
            this._btnVessel = this.node.getChildByName("btnVessel");
        }
        // 未获得活动信息文本
        if(this._infomation == null){
            this._infomation = this.node.getChildByName("nullView");
        }
        // 一级目录
        if(this._btnVessel_0 == null){
            this._btnVessel_0 = this.node.getChildByName("btnVessel_0");
        }
        // 二级按钮目录
        if(this._btnVessel_0_0 == null){
            this._btnVessel_0_0 = this.node.getChildByName("btnVessel_0_0");
        }  
        if(this._btnVessel_0_1 == null){
            this._btnVessel_0_1 = this.node.getChildByName("btnVessel_0_1");
        }
        // 活动类型按钮
        if(this._sBtn_0_0 == null){
            this._sBtn_0_0 = this._btnVessel_0_0.getChildByName("RadioButton");
        } 
        if(this._sBtn_0_1 == null){
            this._sBtn_0_1 = this._btnVessel_0_1.getChildByName("RadioButton");
        }
    },

    show(){
      
        this.node.active = true;
        if(this._webData != null){
            this.getURLData();
        }
        else{
            this.getWebActivityURL();
        }
        this.firstCheckListChangeEvent();
        var bgcolor = new cc.Color(255,189,22);
        this._webView.setColor(bgcolor);
       
    },

    close(){
      
        this.node.active = false;
    },

    getURLData(){
        var newData = this._webData;
        if(newData){
            if(newData.code != 0){
                if (this._webView){
                    this._webView.active = false;
                    this._infomation.active = true;
                }
            }
            else{
                if(newData.data.length < 1){
                    this._webView.active = false;
                    this._infomation.active = true;
                    this.firstCheckListChangeEvent();
                }
                else{
                    this._webView.active=true;
                     this._infomation.active = false;
                    console.log("zouzhe")
                    this.refresChecklist();
                    this.firstCheckListChangeEvent(0);
                    this.refreshView(newData.data);
                }
            }
        }
        else{
            this._webView.active = false;
            this._infomation.active = true;
            this.firstCheckListChangeEvent();
        }
    },

    refreshView(data){
        console.log("==>> refreshView");
        this._hotActivityButtonArr = [];
        this._exchangeCenterButtonArr = [];
        var activityData = data.activity;
        var awardData = data.award;
        console.log(activityData);
        console.log(awardData);

        if(activityData){
            this._btnVessel_0_0.removeAllChildren();
            this._btnVessel_0_0.active = true;
            for(var i = 0; i < activityData.length; ++i){
                var node = this.getViewItem(this._sBtn_0_0,this._btnVessel_0_0);
                node.active = true;
                node.idx = i; 
                node.y -= 100 * i; 

                if(i != this._currentIndex){
                    var comp = node.getComponent("RadioButton");
                    comp.check(false);
                }else{
                    var comp = node.getComponent("RadioButton");
                    comp.check(true);
                }
                this._hotActivityButtonArr.push(node);               
                var button = node.getChildByName("button");
                var labName = button.getChildByName("name");
                labName.getComponent(cc.Label).string = activityData[i].name;
            }
        }
        else{
            this._btnVessel_0_0.active = false;
        }

        if(awardData){
            this._btnVessel_0_1.removeAllChildren();
            this._btnVessel_0_1.active = true;
            for(var i = 0; i < awardData.length; ++i){
                var node = this.getViewItem(this._sBtn_0_1,this._btnVessel_0_1);
                node.active = true;
                node.idx = i;
                node.y -= 100 * i; 

                if(i > 0){
                    var comp = node.getComponent("RadioButton");

                    comp.check(false);
                }
                this._exchangeCenterButtonArr.push(node);
                
                var button = node.getChildByName("button");
                var labName = button.getChildByName("name");
                labName.getComponent(cc.Label).string = awardData[i].name;
            }
        }
        else{
            this._btnVessel_0_1.active = false;
        }

        if(!activityData && !awardData){
            this._webView.active = false;
            this._infomation.active = true;
        }
        for(var i = 0; i < this._hotActivityButtonArr.length; ++i){
            var comp = this._hotActivityButtonArr[i].getComponent("RadioButton");
            if(comp.checked){
                var button = comp.node.getChildByName("button");
                var labName = button.getChildByName("name");
                labName.color = new cc.Color(171, 49, 33);
            }
            else{
                var button = comp.node.getChildByName("button");
                var labName = button.getChildByName("name");
                labName.color = new cc.Color(163, 112, 81);
            }
            comp.check(comp.checked);
        }
        for(var i = 0; i < this._exchangeCenterButtonArr.length; ++i){
            var comp = this._exchangeCenterButtonArr[i].getComponent("RadioButton");
            if(comp.checked){
                var button = comp.node.getChildByName("button");
                var labName = button.getChildByName("name");
                labName.color = new cc.Color(171, 49, 33);
            }
            else{
                var button = comp.node.getChildByName("button");
                var labName = button.getChildByName("name");
                labName.color = new cc.Color(163, 112, 81);
            }
            comp.check(comp.checked);
        }
    },
    //热门活动二级目录按钮点击事件
    onSecondHotActivityButtonClickEvent(data){
        console.log("==>> onSecondHotActivityButtonClickEvent");
        for(var i = 0; i < this._hotActivityButtonArr.length; ++i){
            if(this._hotActivityButtonArr[i].idx == data.target.parent.idx){
                var button = this._hotActivityButtonArr[i].getChildByName("button");
                var labName = button.getChildByName("name");
                labName.color = new cc.Color(171, 49, 33);
                console.log(this._webData && this._webData.data.activity);
                console.log(this._webData);
                console.log(this._webData.data.activity);
                if(this._webData && this._webData.data.activity){
                    var url = this._webData.data.activity[i].url;
                    this.setWebViewURL(url);
                }
            }
            else{
                var button = this._hotActivityButtonArr[i].getChildByName("button");
                var labName = button.getChildByName("name");
                labName.color = new cc.Color(163, 112, 81);
            }
        }
    },
    //兑奖中心二级目录按钮
    onSecondExchangeCenterButtonClickEvent(data){
        console.log("==>> onSecondExchangeCenterButtonClickEvent");
        console.log(this._webData.data.award);
        for(var i = 0; i < this._exchangeCenterButtonArr.length; ++i){
            if(this._exchangeCenterButtonArr[i].idx == data.target.parent.idx){
                var button = this._exchangeCenterButtonArr[i].getChildByName("button");
                var labName = button.getChildByName("name");
                labName.color = new cc.Color(171, 49, 33);
                if(this._webData && this._webData.data.award){
                    var url = this._webData.data.award[i].url;
                    this.setWebViewURL(url);
                }
            }
            else{
                var button = this._exchangeCenterButtonArr[i].getChildByName("button");
                var labName = button.getChildByName("name");
                labName.color = new cc.Color(163, 112, 81);
            }
        }
    },

    setWebViewURL:function(url){
        console.log("setUrl:"+url);
        this._webView.active=true;
        var webView = this._webView.getComponent(cc.WebView);
        webView.url = url;
    },

    //在userMgr脚本中登录时调用此方法 
    getWebActivityURL(){
        var self = this;
        var _url = cc.WEBAPIURL;
        var data = {};
        if(cc.fy.userMgr.userId != 0 && cc.fy.userMgr.userId != null){
            var gameid = cc.GAMEID;
            var userid = cc.fy.userMgr.userId;
            data = {
                gameid:gameid,
                userid:userid,
            };
        }

        var onCallBack = function(ret){
            console.log("获取活动的数据", JSON.stringify(ret));
            console.log(typeof ret);
            self._webData = ret;
            self.getURLData();
        };
        cc.fy.http.sendRequest("/game/get_activity", data, onCallBack, _url, 3, null, true);
    },

    getViewItem(childNode, parNode){
        var node = cc.instantiate(childNode);
        parNode.addChild(node);
        return node;
    },

    onBtnExchangeCenterClickEvent(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        console.log("==>> onBtnExchangeCenterClickEvent");
        this.firstCheckListChangeEvent(1);
        this.refresChecklist();
    },

    onBtnHotActivityClickEvent(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        console.log("==>> onBtnHotActivityClickEvent");
        this.firstCheckListChangeEvent(0);
        this.refresChecklist();
    },

    firstCheckListChangeEvent(index){
        console.log("选中idex"+index);
        if(this._webData == null || this._webData.length == 0||!this._webData.data) return;
       
        var activityData = this._webData.data.activity;
        var awardData = this._webData.data.award;
        if(!activityData && !awardData){
            this._btnVessel_0_0.active = false;
            this._btnVessel_0_1.active = false;
            return;
        }
        
        if(index != null && activityData && awardData){
            if(index == 0){
                this._btnVessel_0_0.active = true;
                this._btnVessel_0_1.active = false;
            }
            else if(index == 1){
                this._btnVessel_0_0.active = false;
                this._btnVessel_0_1.active = true;
            }
            else{
                this._btnVessel_0_0.active = false;
                this._btnVessel_0_1.active = false;
            }
        }
        else if(activityData && !awardData){
            this._btnVessel_0_1.active = false;
            if(index == 0){
                this._btnVessel_0_0.active = true;
            }
            else if(index == 1){
                this._btnVessel_0_0.active = false;
            }
            else{
                this._btnVessel_0_0.active = false;
            }
        }
        else if(!activityData && awardData){
            this._btnVessel_0_0.active = false;
            if(index == 0){
                this._btnVessel_0_1.active = true;
            }
            else if(index == 1){
                this._btnVessel_0_1.active = false;
            }
            else{
                this._btnVessel_0_1.active = false;
            }
        }
    },

    refresChecklist(){
        var firstChecklistArr = [];
        for(var i = 0; i < this._btnVessel_0.childrenCount; ++i){
            var n = this._btnVessel_0.children[i].getComponent("RadioButton");
            if(n != null){
                firstChecklistArr.push(n);
            }
        }
        var index = 0;
        for(var i = 0; i < firstChecklistArr.length; ++i){
            if(firstChecklistArr[i].checked){
                index = i;
                break;
            }
        }
        this.firstCheckListChangeEvent(index);
        console.log(JSON.stringify(this._webData));
        if(this._webData == null || this._webData.length == 0) return;
        var btnVessel = null;
        var urlData = null;
        if(index == 0){
            btnVessel = this._btnVessel_0_0;
            urlData = this._webData.data.activity;
        }
        else{
            btnVessel = this._btnVessel_0_1;
            urlData = this._webData.data.award;
        }
        var btnArr = [];
        for(var i = 0; i < btnVessel.childrenCount; ++i){
            var n = btnVessel.children[i].getComponent("RadioButton");
            if(n != null){
                btnArr.push(n);
            }
        }
        var index = 0;
        for(var i = 0; i < btnArr.length; ++i){
            if(btnArr[i].checked){
                index = i;
                break;
            }
        }
        console.log(urlData);
        if(urlData && urlData.length > 0){
            var url = urlData[index].url;
            this.setWebViewURL(url);
        }
        else{
            var url = "";
            this.setWebViewURL(url);
        }  
        this._currentIndex=index;      
    }, 
    onBtnClose(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.node.active = false;
    },
});
