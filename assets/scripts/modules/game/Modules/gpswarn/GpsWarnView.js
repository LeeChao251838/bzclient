var GameMsgDef = require("GameMsgDef");
cc.Class({
    extends: require("BaseModuleView"),

    properties: {
        _gpsAlert:null,
        _gpsScan:null,
        _seats:null,
        _showdis:null,
        _GPSSeats:null,
        _btnShowGPSWarn:null,
        _btnClose:null,
        _warnWord:null,
        _gpsNode:null,
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
        
        game.addHandler(GameMsgDef.ID_SHOWGPSWARNVIEW_CTC, function(data){
            if(data && data.isShow == false){
                self.hidePanel();
            }
            else{
                self.showPanel(data);
            }
        });

        game.addHandler("game_over",function(){
            self.hidePanel();
        });
    },

    initView:function(){
        // 作为弹框模式 不隐藏其它弹框
        this.setHideOther(false);

        this._GPSSeats = [];
        //gps信息显示界面
        let gpsNode3 = this.node.getChildByName("gps3");
        let gpsNode4 = this.node.getChildByName("gps4");
        
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
            this._btnShowGPSWarn = this.node.parent.getChildByName("btn_gps");
            if(this._btnShowGPSWarn){
                if(cc.fy.gameNetMgr.seats.length == 2){
                        this._btnShowGPSWarn.active = false;
                }
            }
        }

        this.hideDis();
        this.initEventHandlers();
        this.test();
    },

    showPanel:function(data){
        if(cc.fy.sceneMgr.isPDKGameScene()){
            console.log("是pdk场景    关掉");
            this.hidePanel();
            return;
        }
        this.node.active = false;
        if(!cc.fy.sceneMgr.isGameScene()){
            return;
        }
        if(data && data.isForce){
            this.forceShowGPSWarn();
            return;
        }

        this._GPSSeats = [];
        var seats = cc.fy.gameNetMgr.seats;

        for(var temp = 0; temp < seats.length; ++temp){
            let tempIdx = cc.fy.gameNetMgr.getLocalIndex(temp);
            for(var i = 0; i < seats.length; ++i){
                var index = cc.fy.gameNetMgr.getLocalIndex(seats[i].seatindex);
                if(index == tempIdx){
                    this._GPSSeats.push(seats[i]);
                }
            }
        }
        console.log(this._GPSSeats);
        this.setDistance(this._GPSSeats);
    },

    hidePanel:function(){
        this.node.active = false;
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
        this.setDistance(this._GPSSeats);
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
        if (length < 3) {
            return;
        }
        var gpsInfos = [];
        for(var i = 0;i<length;i++)
        { 
            if(!seats[i].gpsInfo){
                seats[i].gpsInfo = {latitude: "0", longitude: "0", location: "null"};
            }
            gpsInfos.push(seats[i]);
        }

        var infoLength = gpsInfos.length;
        for(var i = 0;i<infoLength;i++)
        {
            var gpsInfo = gpsInfos[i].gpsInfo;
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
                    _warn.push(dis);
                }
            }

        }
        var sameIPSeat = cc.fy.anticheatingMgr.checkSameIP();
        this.showSameIP(sameIPSeat);
        this.showDis(_warn);
        this.setUserInfo();
        if(infoLength > 2){
            this.showWarnWord(_warn,sameIPSeat);
        }
    },

    showDis:function(disWarn){
       this.hideDis();
       for(var i = 0; i < this._showdis.childrenCount; ++i){
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
        if(warnInfo || sameIPSeat){
            for(var i = 0; i < warnInfo.length; ++i){
                var info = warnInfo[i];
                if(info != "unknow" && info <= 0.05) {
                    this._btnShowGPSWarn.color = new cc.Color(255,0,0);
                    if(cc.fy.gameNetMgr.gamestate == "" && cc.fy.gameNetMgr.numOfGames < 1){
                       
                    }
                    break;
                }
                else{
                    this._btnShowGPSWarn.color = new cc.Color(255,255,255);
                }
            }
        }
    },

    
    setUserInfo:function(){
        var seats = this._GPSSeats;
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

    forceShowGPSWarn:function(){
        this.setDistance(this._GPSSeats);
        this.setUserInfo();
        this.node.active = true;
    },

    onBtnCloseClickEvent:function(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.hidePanel();
    }
});
