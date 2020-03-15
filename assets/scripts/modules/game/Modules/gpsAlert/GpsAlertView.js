var GameMsgDef = require("GameMsgDef");
cc.Class({
    extends:require("BaseModuleView"),

    properties: {
   
        _seats:null,
        _showdis:null,
        _btnShowGPSWarn:null,
        _btnClose:null,
        _gamePlayer: 4,   //涟水麻将人数

        _sideName:[],
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
        
        game.addHandler(GameMsgDef.ID_SHOWGPSALERTVIEW_CTC, function(data){
             if(data && data.isShow == false){
                console.log("hide")
                self.hidePanel();
            }
            else{
                self.showPanel(data);
            }
        });
         game.addHandler("game_over",function(){
            self.hidePanel();
        });

        game.addHandler("pdk_game_over",function(){
            self.hidePanel();
        });
        game.addHandler("ddz_game_over",function(){
            self.hidePanel();
        });
    },

    initView:function(){
        // 作为弹框模式 不隐藏其它弹框
        this.setHideOther(false);
        if(cc.fy.gameNetMgr.seats == null){
            cc.fy.alert.show("该房间已解散",function(){
                cc.fy.sceneMgr.loadScene("hall");    
            });
            console.log("cc.fy.gameNetMgr.seats is null");
            return;
        }
        this._gamePlayer = cc.fy.gameNetMgr.seats.length;

        //gps信息显示界面
        if(this._gamePlayer == 3){
            this._sideName=["myself","right","left"];
        }
        else if(this._gamePlayer==2){
            this._sideName=["myself","up"];
        }
        else{
            this._sideName=["myself","right","up","left"];
        }
        
        var sideName=["myself","right","up","left"];
        //玩家头像节点
        this._seats={};
        for(let i=0;i<sideName.length;i++){
            var ndSeat=this.node.getChildByName("seats").getChildByName(sideName[i]);
            this._seats[sideName[i]]=ndSeat;
            console.log("seat:"+sideName[i]);
            ndSeat.active=false;
        }
        //距离显示
        this._showdis=[];
        for(let i=0;i<6;i++){
            var dis=this.node.getChildByName("showdis").getChildByName("dis"+i);
            this._showdis.push(dis);
        }
       
        //房间显示距离按钮
        if(this._btnShowGPSWarn == null){
            if(cc.fy.sceneMgr.isPDKGameScene()){
                this._btnShowGPSWarn =cc.find("Canvas/gameMain/btnbox/btn_gps");
            }else{
                this._btnShowGPSWarn = this.node.parent.getChildByName("btn_gps");  
            }   
            if(this._btnShowGPSWarn){
                if(cc.fy.gameNetMgr.seats.length == 2){
                    console.log("gps hide ");
                    this._btnShowGPSWarn.active = false;
                }
            }
        }
     
        this.hideDis();
        this.initEventHandlers2();
    },

    showPanel:function(data){
        if(cc.fy.gameNetMgr.seats.length<3){
            this.hidePanel();
            return;
        }
        this.node.active = true;

        this.setDistance();
        this.setUserInfo();
    },

    hidePanel:function(){
        this.node.active = false;
    },

    initEventHandlers2:function(){
        var self = this;
        cc.fy.gameNetMgr.addHandler('gps_info_result',function(data){
            console.log("gps_info_result-------->>>>");
            cc.fy.gpsAlertMsg._GPSSeats = [];
            if(cc.fy.gameNetMgr.seats != null){
                var seats = cc.fy.gameNetMgr.seats;
                for(var temp = 0; temp < seats.length; ++temp){
                    for(var i = 0; i < seats.length; ++i){
                        var index = cc.fy.gameNetMgr.getLocalIndex(seats[i].seatindex);
                        if(index == temp){
                            cc.fy.gpsAlertMsg._GPSSeats.push(seats[i]);
                        }
                    }
                }
            }
            self.setDistance();
        });

        cc.fy.gameNetMgr.addHandler("game_over",function(){
            // self.hideWarnWord();
            self.onBtnCloseClickEvent();
        });
       
    },

    //计算距离
    setDistance:function(){
        var _warn =cc.fy.gpsAlertMsg.setDistance(); 
        this.showDis(_warn);
        this.setUserInfo();
       
        
    },

    showDis:function(disWarn){
        console.log("warninfo:",disWarn);
       this.hideDis();
       var index=[0,1,2,3,4,5];
       let posX=-100;

       if(this._gamePlayer==3){
            index=[0,2,4];
            posX=0;
       }else if(this._gamePlayer==2){
            index=[1];
       }
       for(var i = 0; i < disWarn.length; ++i){
            console.log("dis"+index[i],disWarn[i]);
            var dis = this._showdis[index[i]];
            var warnInfo = disWarn[i];
            if(warnInfo==null || warnInfo=="undef"){
                continue;
            }
            dis.active = true;
            var lineItem=  dis.getChildByName("line").getComponent(cc.Sprite);
            var wn = dis.getChildByName("warn");
            var normal = dis.getChildByName("normal");
            var undef =dis.getChildByName("undef");
            wn.active=false;
            normal.active=false;
            undef.active=false;
            if(warnInfo == "unknow"){
                undef.active = true;
                if(index[i]==4){
                    undef.x=posX;
                }
            }      
            else if(parseInt(warnInfo) <= 0.5){
                console.log("juli guojin")
                var info = wn.getChildByName("info").getComponent(cc.Label);
                info.string = "距离" + warnInfo + "公里";
                cc.fy.resMgr.setSpriteFrameByUrl("images/gps/bg_gps_red",lineItem);
                wn.active = true;
                if(index[i]==4){
                    wn.x=posX;
                }
            }
            else if(warnInfo != "undef"){
                var info = normal.getChildByName("info").getComponent(cc.Label);
                info.string = "距离" + warnInfo + "公里";    
                cc.fy.resMgr.setSpriteFrameByUrl("images/gps/bg_gps_green",lineItem);
                normal.active = true;
                if(index[i]==4){
                    normal.x=posX;
                }
            }  
            
       }

    },

    hideDis:function(){
        for(var i = 0; i < this._showdis.length; ++i){
            var dis = this._showdis[i];
            dis.active = false;
        }
        var sideName=["myself","right","up","left"];
        for(var i = 0; i < sideName.length; ++i){
            console.log("seatname:"+sideName[i]);
            this._seats[sideName[i]].active=false;
        }
    },
    

    

    setUserInfo:function(){
        
        var seats = cc.fy.gpsAlertMsg._GPSSeats;
        
        for(var i = 0; i < seats.length; ++i){
            var userid = seats[i].userid;
            var ndSeat=this._seats[this._sideName[i]];
            if(userid==0){
                ndSeat.active=false;
                continue;
            }
            ndSeat.active=true;
            var headimg = ndSeat.getChildByName("head").getChildByName("headimg");
            var name = ndSeat.getChildByName("name");
            var sameIP =ndSeat.getChildByName("sameIp");
            sameIP.active=cc.fy.anticheatingMgr.isSameIP(seats[i]);
            if(userid && headimg){
                var imgLoading = headimg.getComponent("ImageLoader");
                imgLoading.setUserID(userid);
            }
            if(name){
                name.getComponent(cc.Label).string = seats[i].name;
            }
            
        }
    },


    onBtnCloseClickEvent:function(){
        this.node.active = false;
    }

});
