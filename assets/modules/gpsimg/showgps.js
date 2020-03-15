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
        _gpsAlert:null,
        _seats:null,
        _showdis:null,
        _GPSSeats:null,
        _btnShowGPSWarn:null,
        _btnClose:null,
        _warnWord:null,
        _gpsNode:null,
    },

    // use this for initialization
    onLoad: function () {
        this._GPSSeats = [];
        //gps信息显示界面
        if(this._gpsAlert == null){
            this._gpsAlert = this.node.getChildByName("gpsAlert");
        }
        let gpsNode3 = this._gpsAlert.getChildByName("gps3");
        let gpsNode4 = this._gpsAlert.getChildByName("gps4");
        
        if (cc.fy.gameNetMgr.seats.length == 4) {
            gpsNode3.active = false;
            gpsNode4.active = true;
            this._gpsNode = gpsNode4;
        }
        else{
            gpsNode3.active = true;
            gpsNode4.active = false;
            this._gpsNode = gpsNode3;
        }
        //玩家头像信息显示
        if(this._seats == null){
            this._seats = this._gpsNode.getChildByName("seats");
        }
        //距离显示
        if(this._showdis == null){
            this._showdis = this._gpsNode.getChildByName("showdis");
        }
        //房间显示距离按钮
        if(this._btnShowGPSWarn == null){
            this._btnShowGPSWarn = this.node.getChildByName("btn_gps");
            if(this._btnShowGPSWarn == null){
                this._btnShowGPSWarn = cc.find("btnbox/btn_gps",this.node);
            }
            if(cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.YZER_YZ){
                this._btnShowGPSWarn.active = false;
            }
            if(cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.YZER){
                this._btnShowGPSWarn.active = false;
            }

            cc.fy.utils.addClickEvent(this._btnShowGPSWarn.getComponent(cc.Button), this.node, "showgps", "onBtnShowGPSWarnClickEvent");
        }
        //关闭距离提示界面按钮
        if(this._btnClose == null){
            this._btnClose = this._gpsAlert.getChildByName("close");
            cc.fy.utils.addClickEvent(this._btnClose.getComponent(cc.Button), this.node, "showgps", "onBtnCloseClickEvent");
            
        }
        //警告文字
        if(this._warnWord == null){
            this._warnWord = this._btnShowGPSWarn.getChildByName("Warn");
        }
        this.hideDis();
        this.hideWarnWord();
        this.initEventHandlers();
        this.test();
    },

    test(){
        this._GPSSeats = [];
        var seats = cc.fy.gameNetMgr.seats;
        if(seats == null || seats.length <= 0){
            return;
        }
        for(var temp = 0; temp < seats.length; ++temp){
            let tempIdx = cc.fy.gameNetMgr.getLocalIndex(temp);
            for(var i = 0; i < seats.length; ++i){
                var index = cc.fy.gameNetMgr.getLocalIndex(seats[i].seatindex);
                if(index == tempIdx){
                    this._GPSSeats.push(seats[i]);
                }
            }
        }
        console.log("==>> GPS数据： ", this._GPSSeats);
        this.setDistance(this._GPSSeats);
    },

    initEventHandlers:function(){
        var self = this;
        var game = cc.fy.gameNetMgr;
        game.addHandler('gps_info_result',function(data){
            console.log("gps_info_result");
            console.log(data);
            self._GPSSeats = [];
            var seats = cc.fy.gameNetMgr.seats;
            console.log(seats);
            for(var temp = 0; temp < seats.length; ++temp){
                let tempIdx = cc.fy.gameNetMgr.getLocalIndex(temp);
                for(var i = 0; i < seats.length; ++i){
                    var index = cc.fy.gameNetMgr.getLocalIndex(seats[i].seatindex);
                    if(index == tempIdx){
                        self._GPSSeats.push(seats[i]);
                    }
                }
            }
            console.log(self._GPSSeats);
            self.setDistance(self._GPSSeats);
        });

        game.addHandler("game_over",function(){
            self.hideWarnWord();
            self.onBtnCloseClickEvent();
        });
    },

    setDistance:function(seats){
        // console.log(this._GPSSeats);
        var _warn = [];
        if(seats == null)
        {
            console.log("checkgps seats = null");
            return;
        }
        var length = seats.length;
        var gpsInfos = [];
        // console.log(seats[0]);
        // seats[0].gpsInfo = {latitude: "50.295461", longitude: "110.666", location: "吴中通园路490号"};
        // seats[1].gpsInfo = {latitude: "50.395462", longitude: "130", location: "2吴中通园路491号"};
        // seats[2].gpsInfo = {latitude: "50.495463", longitude: "140", location: "3吴中区通园路492号"};
        // seats[3].gpsInfo = {latitude: "50.495463", longitude: "150", location: "4吴中区通园路492号"};
        for(var i = 0;i<length;i++)
        { 
            if(!seats[i].gpsInfo){
                seats[i].gpsInfo = {latitude: "0", longitude: "0", location: "null"};
            }
            gpsInfos.push(seats[i]);
            
            // if(i != cc.fy.gameNetMgr.seatIndex)
            // {
            //     gpsInfos.push(seats[i]);
            // }
        }

        // var disSmall = [];
        // var distance = [];
        //玩家gps数据都有了之后再处理
        var infoLength = gpsInfos.length;
        // if(infoLength < 2)
        // {
        //     cc.fy.hintBox.show("玩家过少，暂未获得距离信息！");
        //     return;
        // }
        for(var i = 0;i<infoLength;i++)
        {
            var gpsInfo = gpsInfos[i].gpsInfo;

            // if(gpsInfo.latitude == 0 && gpsInfo.longitude == 0 && gpsInfo.location == null){
            //     // _warn += gpsInfos[i].name + " 未获得地理位置信息\n";
            //     continue;
            // }
            for(var j = i + 1;j<infoLength;j++)
            {
                if(gpsInfos[i].userid == 0 || gpsInfos[j].userid == 0){
                    _warn.push("undef");
                    continue;
                }
                if(gpsInfos[i].userid != gpsInfos[j].userid);
                {
                    var isKnow_j = gpsInfos[j].gpsInfo.latitude == 0 && gpsInfos[j].gpsInfo.longitude == 0;
                    var isKnow_i = gpsInfos[i].gpsInfo.latitude == 0 && gpsInfos[i].gpsInfo.longitude == 0;
                    if(isKnow_i || isKnow_j){
                        _warn.push("unknow");
                        continue;
                    }       
                    // if(gpsInfos[j].gpsInfo.latitude == 0 && gpsInfos[j].gpsInfo.longitude == 0){
                    //     continue;
                    // }
                    var dis = cc.fy.anysdkMgr.getDisance(gpsInfo.latitude, gpsInfo.longitude, 
                    gpsInfos[j].gpsInfo.latitude, gpsInfos[j].gpsInfo.longitude);
                    dis = (dis/1000).toFixed(2);
                    // console.log("i = " + i,", j = " + j);
                    _warn.push(dis);
                    // _warn.push(cc.fy.utils.subStringCN(gpsInfos[i].name, 8, true) + " 与 " +cc.fy.utils.subStringCN(gpsInfos[j].name, 8, true) + " 距离 " + dis + " 公里\n");
                }
            }

        }
        // if(_warn == null || _warn == ""){
        //     _warn = "暂未获得位置信息";
        // }
        // if(disSmall.length > 1)
        // {
        //     _warn = "以下玩家距离过近\n";
        //     for(var i=0;i<disSmall.length;i++)
        //     {
        //         _warn += "[" + cc.fy.utils.subStringCN(disSmall[i].name, 8, true) + "]";
        //     }

        //     // this.showWarn(this._warn);
        // }
        // if(_warn != null && _warn != ""){
        //     this.showDis(_warn);
        // }
        // else{
        //     cc.fy.hintBox.show("未获得其他玩家位置信息！");
        // }
        var sameIPSeat = cc.fy.anticheatingMgr.checkSameIP();
        this.showSameIP(sameIPSeat);
        this.showDis(_warn);
        this.showWarnWord(_warn,sameIPSeat);
        this.setUserInfo();
    },

    showDis:function(disWarn){
       this.hideDis();
       for(var i = 0; i < this._showdis.childrenCount; ++i){
        //    var name = "dis" + i;
        //    var dis = this._showdis.getChildByName(name);
            var dis = this._showdis.children[i];
            var warnInfo = disWarn[i];
            if(!warnInfo){
                return;
            }
            if(warnInfo == "unknow"){
                dis.getChildByName("undef").active = true;
            }
            else if(warnInfo <= 0.05){
                var wn = dis.getChildByName("warn");
                var info = wn.getChildByName("info").getComponent(cc.Label);
                if(warnInfo <= 1.0){
                    info.string = "距离" + warnInfo * 1000 + "米";
                }else{
                    info.string = "距离" + warnInfo + "公里";
                }
                wn.active = true;
            }
            else if(warnInfo != "undef" && warnInfo > 0.05){
                var normal = dis.getChildByName("normal");
                var info = normal.getChildByName("info").getComponent(cc.Label);
                if(warnInfo <= 1.0){
                    info.string = "距离" + warnInfo * 1000 + "米";
                }else{
                    info.string = "距离" + warnInfo + "公里";
                }
                normal.active = true;
            }  
            dis.active = true;
       }

    },

    hideDis:function(){
        for(var i = 0; i < this._showdis.childrenCount; ++i){
            var dis = this._showdis.children[i];
            for(var j = 0; j < dis.childrenCount; ++j){
                dis.children[j].active = false;
            }
            dis.active = false;
        }

        for(var i = 0; i < this._seats.childrenCount; ++i){
            this._seats.children[i].active = false;
        }
    },

    hideWarnWord:function(){
        // this._warnWord.stopAllActions();
        this._warnWord.active = false;
    },

    showSameIP:function(sameIPSeat){
        for(var i = 0; i < this._seats.childrenCount; ++i){
            var SIP = this._seats.children[i].getChildByName("sameIP");
            if(SIP){
                SIP.active = false;
            }
        }
        if(sameIPSeat){
            for(var i = 0; i < sameIPSeat.length; ++i){
                for(var j = 0; j < this._GPSSeats.length; ++j){
                    if(sameIPSeat[i].userid == this._GPSSeats[j].userid){
                        this._seats.children[j].getChildByName("sameIP").active = true;
                    }
                }
            }
        } 
    },

    showWarnWord:function(warnInfo,sameIPSeat){
        var self = this;
        if(warnInfo || sameIPSeat){
            for(var i = 0; i < warnInfo.length; ++i){
                var info = warnInfo[i];
                if(info != "unknow" && info <= 0.05) {
                    this._btnShowGPSWarn.color = new cc.Color(255,0,0);
                    this.playAnim();
                    this.showScan();
                    // setTimeout(function(){
                    //     self.hideWarnWord();
                    // },15000);
                    break;
                }
                else{
                    this._btnShowGPSWarn.color = new cc.Color(255,255,255);
                    this.hideWarnWord();
                }
            }
        }
        if(cc.fy.gameNetMgr.gamestate == "playing"){
            setTimeout(function(){
                self.hideWarnWord();
            },5000);
        }
    },
    
    showScan:function(){
        if(cc.fy.gameNetMgr.gamestate == "" && cc.fy.gameNetMgr.numOfGames < 1){
            if(this.havenScan==true){
                return;
            }
            if(this._gpsScan==null){
                this.havenScan=true;
                cc.loader.loadRes("prefabs/gpsScan",function (err, prefab) {
                    if (err) {
                        cc.error(err.message || err);
                        return;
                    }
                    console.log("创建一个预制体")
                    this._gpsScan=cc.instantiate(prefab);
                    this.node.addChild(this._gpsScan);
                    this.doScan();
                    // this._gpsScan.active=true;
                    // this._gpsScan.getComponent("gpsScan").refresh();
                    // setTimeout(function(){
                    //     this._gpsScan.active=false;
                    // }.bind(this),500);
                }.bind(this));
            }else{
                // this._gpsScan.active=true;
                // this._gpsScan.getComponent("gpsScan").refresh();
                // setTimeout(function(){
                //     this._gpsScan.active=false;
                // }.bind(this),500);
                this.doScan();
            }
        }
    },

    doScan:function(){
        if(cc.fy.gameNetMgr.numOfGames <= 1){
            this._gpsScan.active=true;
            this._gpsScan.getComponent("gpsScan").refresh();
            var data={}
            data.distance=this.distanceOK;
            this._gpsScan.getComponent("gpsScan").doScan(data,0);
            this._gpsScan.runAction(cc.sequence(
                cc.delayTime(1.5),
                cc.scaleTo(0.2,0.1),
                cc.moveBy(0.3,515,160),
                cc.callFunc(function(){
                    this._gpsScan.setScale(1);
                    this._gpsScan.setPosition(cc.p(0,0));
                    this._gpsScan.active=false;
                   // this._gpsAlert.active=true;
                }.bind(this))
            ))
        }
    },
    playAnim:function(){
        this._warnWord.active = false;
        // var seq = cc.repeatForever(
        //     cc.sequence(
        //         cc.fadeOut(0.5),
        //         cc.fadeIn(0.5)
        //     ));
        // this._warnWord.runAction(seq);
    },

    setUserInfo:function(){
        // this._sprIcon.setUserID(this._userId);
        var seats = this._GPSSeats;
        // console.log(this._seats);
        for(var i = 0; i < seats.length; ++i){
            var userid = seats[i].userid;
            var headimg = this._seats.children[i].getChildByName("headimg");
            var name = this._seats.children[i].getChildByName("name");
            if(userid && headimg){
                var imgLoading = headimg.getComponent("ImageLoader");
                imgLoading.setUserID(userid);
            }
            if(name){
                name.getComponent(cc.Label).string = seats[i].name;
            }
            if(userid != 0){
                this._seats.children[i].active = true;
            }
        }
    },

    onBtnShowGPSWarnClickEvent:function(){
        this.setDistance(this._GPSSeats);
        this.setUserInfo();
        this._gpsAlert.active = true;
    },

    onBtnCloseClickEvent:function(){
        this._gpsAlert.active = false;
    }


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
