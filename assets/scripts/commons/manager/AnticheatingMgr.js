var GameMsgDef = require("GameMsgDef");
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
        _warn:"",
        _normalWarn:"",
        _isHaveShow:false,
        _randomDic:null,
    },

    initHandlers:function()
    {
        var self = this;
        cc.eventManager.addCustomListener('gps_info', function(event){
            console.log("gps_info");
            self.checkgps();
        });
        this._randomDic = {};
    },

    // 防作弊
    showWarn:function(warn)
    {
        if(warn != null && warn != "")
        {
            // this._isHaveShow = true;
            var self = this;
            console.log("self._warn " + self._warn);
            // cc.eventManager.dispatchCustomEvent("show_gpswarn", {data:self._warn});
            if(cc.fy.gameNetMgr.numOfGames > 1 || (cc.fy.gameNetMgr.numOfGames == 1 && cc.fy.gameNetMgr.gamestate == ""))
            {
                
            }
            else{
                cc.fy.gameNetMgr.dispatchEvent('show_gpswarn',self._warn);
            }
        }
    },

    reset:function()
    {
        this._isHaveShow = false;
    },

    check:function()
    {
        console.log("Anticheating");
        // if(cc.fy.gameNetMgr.numOfGames > 0 || this._isHaveShow)
        // {
        //     return;
        // }
        // this._warn = "";
        // var sameIPSeat = this.checkSameIP();
        // if(sameIPSeat)
        // {
        //     this._warn = "玩家";
        //     for(var i=0;i<sameIPSeat.length;i++)
        //     {
        //         this._warn += "[" + cc.fy.utils.subStringCN(sameIPSeat[i].name, 8, true) + "]";
        //     }
        //     this._warn += "相同IP登录\n";
        // }
        // this.showWarn(this._warn);
    },

    checkSameIP:function()
    {
        var seats = cc.fy.gameNetMgr.seats;
        if(seats == null)
        {
            console.log("checkSameIP seats = null");
            return null;
        }
        console.log("checkSameIp seats：",seats);
        var sameiplist = [];
        for(var i = 0; i < seats.length; i++)
        {
            if(i != cc.fy.gameNetMgr.seatIndex)
            {
                var seat = seats[i];
                for(var j = i; j < seats.length; j++)
                {
                    // if(sameiplist.length > 2)
                    // {
                    //     break;
                    // }
                    if(j != cc.fy.gameNetMgr.seatIndex &&seat.userid != seats[j].userid &&
                     seats[j].userid != 0 && seat.ip != null && seats[j].ip != null && seat.ip == seats[j].ip)
                    {
                        // if(sameiplist.length == 0)
                        {
                            sameiplist.push(seat);
                        }
                        sameiplist.push(seats[j]);
                    }
                }
            }
        }
        // 说明其它三家有人的IP是相同的
        if(sameiplist.length > 1)
        {
            return sameiplist;
        }

        return null;
    },

    isSameIP:function(seat)
    {
        // 自己不参与同IP的比较
        return false;
        if(seat.seatindex != cc.fy.gameNetMgr.seatIndex)
        {
            var seats = cc.fy.gameNetMgr.seats;
            if(seats == null || seat == null)
            {
                console.log("isSameIP seats = null");
                return false;
            }
            for(var i = 0; i < seats.length; i++)
            {
                if(i != cc.fy.gameNetMgr.seatIndex && seat.userid != seats[i].userid && seats[i].userid != 0 &&
                seat.ip != null && seats[i].ip != null && seat.ip == seats[i].ip)
                {
        
                    return true;
                }
            }
        }
        return false;
    },

    checkgps:function()
    {
        console.log("有玩家进来！！！checkgps")
        var seats = cc.fy.gameNetMgr.seats;
        if(seats == null)
        {
            console.log("checkgps seats = null");
            return;
        }
        var length = seats.length;
        var gpsInfos = [];
        var currentPlayers=0;
        for(var i = 0;i<length;i++)
        {
            // if(i != cc.fy.gameNetMgr.seatIndex && seats[i].gpsInfo)
            if(seats[i].name !=""){
                currentPlayers++;
            }
            if(seats[i].gpsInfo && seats[i].name !="" && seats[i].userid!=0)
            {
                gpsInfos.push(seats[i]);
            }
        }
        cc.fy.gameNetMgr.dispatchEvent('cc_btngpscolor', false);
        var disNormalNames = [];
        var disNormalDistances = [];
        var disSmall = [];
        var distances = [];
        //玩家gps数据都有了之后再处理
        var infoLength = gpsInfos.length;
        console.log("==>> infolength = " + infoLength +JSON.stringify(gpsInfos));
        if(infoLength > 1){
            for(var i = 0; i < infoLength; i++)
            {
                var gpsInfo = gpsInfos[i].gpsInfo;
                if(gpsInfo == null){
                    break;
                }
                for(var j = i; j < infoLength; j++)
                {
                    // if(disSmall.length > 2)
                    // {
                    //     break;
                    // }
                    if(gpsInfos[i].userid != gpsInfos[j].userid)
                    {
                        var dis = cc.fy.anysdkMgr.getDisance(gpsInfo.latitude, gpsInfo.longitude, gpsInfos[j].gpsInfo.latitude, gpsInfos[j].gpsInfo.longitude);
                        if(dis >= 0 && dis < 5){
                            if(this._randomDic[dis] == null){
                                this._randomDic[dis] = parseInt(Math.random() * 2 + 1);
                            }
                            dis = this._randomDic[dis];
                        }
                        if(dis >= 5 && dis < 20){
                            if(this._randomDic[dis] == null){
                                this._randomDic[dis] = parseInt(Math.random() * 5 + 1);
                            }
                            dis = this._randomDic[dis];
                        }
                        else if(dis >= 20 && dis <= 50){
                            if(this._randomDic[dis] == null){
                                this._randomDic[dis] = parseInt(Math.random()*(10 - 5) + 5);
                            }
                            dis = this._randomDic[dis];
                        }

                        disNormalNames.push(gpsInfos[i]);
                        disNormalNames.push(gpsInfos[j]);
                        disNormalDistances.push(dis);
                        if(dis < 100)
                        {
                            // if(disSmall.length == 0)
                            {
                                disSmall.push(gpsInfos[i]);
                            }
                            disSmall.push(gpsInfos[j]);
                            distances.push(dis);
                            
                        }
                    }
                }
            }
        }
        else
        {
            return false;
        }
        
        if(disSmall.length > 1)
        {
            var disGroupCnt = distances.length;
            this._warn = "【注意】以下玩家距离过近：\n";
            for(var t = 0; t < disGroupCnt; ++t){
                this._warn += "[" + cc.fy.utils.subStringCN(disSmall[2 * t].name, 8, true) + "]" + "与" + "[" + cc.fy.utils.subStringCN(disSmall[2 * t + 1].name, 8, true) + "]" + "相距约" + distances[t] + "米\n";
            }
            // this._warn = "【注意】以下玩家距离过近：\n";
            // for(var i = 0; i < disSmall.length; i++)
            // {
            //     this._warn += "[" + cc.fy.utils.subStringCN(disSmall[i].name, 8, true) + "]";
            // }

            var sameIPSeat = this.checkSameIP();
            if(sameIPSeat)
            {
                var ipGroupCnt = sameIPSeat.length / 2;
                this._warn += "\n【注意】有玩家处于相同网络环境：\n";
                for(var i = 0; i < ipGroupCnt; i++)
                {
                    // this._warn += "[" + cc.fy.utils.subStringCN(sameIPSeat[i].name, 8, true) + "]";
                    this._warn += "[" + cc.fy.utils.subStringCN(sameIPSeat[2 * i].name, 8, true) + "]" + "与" + "[" + cc.fy.utils.subStringCN(sameIPSeat[2 * i + 1].name, 8, true) + "]同IP\n";
                }
            }
            cc.fy.gameNetMgr.dispatchEvent('cc_btngpscolor', true);
            
            if(cc.fy.anticheatingMgr.isForceShowWarn == true){
                this.showWarn(this._warn);
                cc.fy.anticheatingMgr.isForceShowWarn = false;
            }
           
        }else{
           
        }

        this._normalWarn = "";
        if(disNormalNames.length > 1){
            console.log("==>> disNormalDistances.length = " + disNormalDistances.length);
            var cnt = disNormalDistances.length;
            this._normalWarn = "【玩家距离检测】\n";
            for(var l = 0; l < cnt; ++l){
                var transDis = "";
                if(disNormalDistances[l] < 1000){
                    transDis = disNormalDistances[l] + "米";
                }
                else{
                    transDis = (Math.round(disNormalDistances[l]/100)/10).toFixed(1) + "公里";
                }
                this._normalWarn += "[" + cc.fy.utils.subStringCN(disNormalNames[2 * l].name, 8, true) + "]" + "与" + "[" + cc.fy.utils.subStringCN(disNormalNames[2 * l + 1].name, 8, true) + "]" + "相距约" + transDis + "\n";
            }
        }
        cc.fy.gameNetMgr.dispatchEvent('show_gpswarn_normal', this._normalWarn);

        return true;
    },

    sendGeo:function()
    {
        // var gpsArr = [{latitude: "50.305461", longitude: "110.003", location: "111通园路490号"},
        //               {latitude: "50.305461", longitude: "110.002", location: "222通园路491号"},
        //               {latitude: "50.305461", longitude: "110.001", location: "333通园路492号"},
        //               {latitude: "50.305461", longitude: "110.005", location: "444通园路493号"}];
        // var num = parseInt(Math.random() * 3);
        // console.log("C--------------------------",Math.random()*3,num);
        // cc.fy.userMgr.geolocation  = gpsArr[num];
        if(cc.fy.userMgr.geolocation != null){
            console.log("send gps_info");
            console.log(cc.fy.userMgr.geolocation);
            // cc.fy.net.send("gps_info", cc.fy.userMgr.geolocation);
            cc.fy.net.send("gps_info", {gpsInfo:cc.fy.userMgr.geolocation, ip:cc.fy.userMgr.ip});
        }
        else
        {
            cc.fy.anysdkMgr.getGeoLocation(); // 获取地理位置
        }
    },

});
