var GameMsgDef = require("GameMsgDef");
var ConstsDef = require('ConstsDef');

cc.Class({
    extends: require("BaseModuleMsg"),

    properties: {
        ///////////////////////
        resPanelUrl:"prefabs/gpsAlert", // 预制体路径
        msgIdShowView:GameMsgDef.ID_SHOWGPSALERTVIEW_CTC, // 显示ID
        isPreload:false, // 是否需要预加载，ps:常用组件需要预加载加快显示
        limitScene:ConstsDef.SCENE_NAME.GAME, // 限制场景，指定模块的场景，null是不限制 如:limitScene:ConstsDef.SCENE_NAME.GAME 游戏场景模块
        ///////////////////////

        _GPSSeats:null,
        _btnGps:null,
    },
   
    init:function(){
        console.log("预制-------------gpsAlertMsg");
    },
    messageDispatch:function(msg){
       
        switch (msg.msgId) {
            case GameMsgDef.ID_LOADSCENEFINISH: // 进入游戏场景
                if(cc.fy.sceneMgr.isGameScene()){
                    console.log("initgps,")
                    this.initGPS();
                }
            break;

        }
    },
   
    initGPS:function(){
        this._GPSSeats=[];
        var self = this;
        var eventTarget = cc.fy.gameNetMgr.eventTarget;
        
        console.log("eventTarget:",eventTarget);
        //房间显示距离按钮
        if(cc.fy.sceneMgr.isPDKGameScene()){
           this._btnGps = cc.find("gameMain/btnbox/btn_gps",eventTarget);
        }else if(cc.fy.sceneMgr.isMJGameScene()){
            this._btnGps = cc.find("gameMain/btnbox/btn_gps",eventTarget);
            this._btnGps.getChildByName('di').opacity = 0
        }
        else{
            this._btnGps = eventTarget.getChildByName("btn_gps");
        }
        
        console.log("initgps ",this._btnGps);
        if(cc.fy.gameNetMgr.seats.length <= 2 || cc.fy.replayMgr.isReplay()){
            console.log("gps hide")
            this._btnGps.active = false;
        }
        else{
             console.log("gps show")
            this._btnGps.active = true;
        }
        
    },
     //计算距离
    setDistance:function(){
        
        console.log("gps_info_result-------->>>>");
        this._GPSSeats = [];
        if(cc.fy.gameNetMgr.seats != null){
            var seats = cc.fy.gameNetMgr.seats;
            for(var temp = 0; temp < seats.length; ++temp){
                for(var i = 0; i < seats.length; ++i){
                    var index = cc.fy.gameNetMgr.getLocalIndex(seats[i].seatindex);
                    if(index == temp){
                        this._GPSSeats.push(seats[i]);
                    }
                }
            }
        } 
    
        var seats =this._GPSSeats;
        var _warn = [];
        var length = seats.length;
        var gpsInfos = [];
        // seats[0].gpsInfo = {latitude: "50.295461", longitude: "110.666", location: "吴中通园路490号"};
        // seats[1].gpsInfo = {latitude: "50.395462", longitude: "110.666", location: "吴中通园路491号"};
        // seats[2].gpsInfo = {latitude: "50.495463", longitude: "110.666", location: "吴中区通园路492号"};
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
            var ipI=gpsInfos[i].ip;
            for(var j = i + 1;j<infoLength;j++)
            {
                
                var ipJ =gpsInfos[j].ip;
                if(gpsInfos[i].userid == 0 || gpsInfos[j].userid == 0){
                    _warn.push("undef");
                    continue;
                }
                if(gpsInfos[i].userid != gpsInfos[j].userid);
                {
                    // if(gpsInfos[i].userid != cc.fy.userMgr.userId && gpsInfos[j].userid != cc.fy.userMgr.userId){
                    //     _warn.push(0.0);
                    //     continue;
                    // }
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
                    if(dis/1000 > 100){
                        dis = (dis/1000).toFixed(0);
                    }
                    else{
                        dis = (dis/1000).toFixed(2);
                    }

                    // console.log("i = " + i,", j = " + j);
                    _warn.push(dis);
                    // _warn.push(cc.fy.utils.subStringCN(gpsInfos[i].name, 8, true) + " 与 " +cc.fy.utils.subStringCN(gpsInfos[j].name, 8, true) + " 距离 " + dis + " 公里\n");
                }
            }

        }
        this.showWarnWord(_warn);
        return _warn;
    },

    //变红，定位
    showWarnWord:function(warnInfo){
        if(this._btnGps==null){
            return;
        }
        var self = this;
        var isShowWarn=false;
        var sameIPSeat=cc.fy.anticheatingMgr.checkSameIP();
        var GpsSprite=this._btnGps.getComponent(cc.Sprite);
        if(warnInfo ){
            for(var i = 0; i < warnInfo.length; ++i){
                var info = warnInfo[i];
                if(info != "unknow" && info <= 0.5) {
                    console.log("gps变红");
                    isShowWarn=true;
                    break;
                }
            }
        }
        console.log(warnInfo,sameIPSeat);
        if(cc.fy.sceneMgr.isPDKGameScene()){
            if(isShowWarn || sameIPSeat){
                cc.fy.resMgr.setSpriteFrameByUrl("images/gps/icon_position_warn",GpsSprite);
            }else{
                cc.fy.resMgr.setSpriteFrameByUrl("images/gps/icon_position",GpsSprite);
            }


        }else if(cc.fy.sceneMgr.isMJGameScene()){
            if(isShowWarn || sameIPSeat){
                this._btnGps.getChildByName('di').runAction(cc.repeatForever(cc.sequence(cc.fadeIn(1),cc.fadeOut(1))))
            }else{
                
            }

           
        }
        else{
            if(isShowWarn || sameIPSeat){
                this._btnGps.color = new cc.Color(255,0,0);
            }else{
                this._btnGps.color = new cc.Color(255,255,255);
            }
        }
        
    },

});
