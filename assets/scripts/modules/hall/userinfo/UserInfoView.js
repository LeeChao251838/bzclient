var GameMsgDef = require("GameMsgDef");
cc.Class({
    extends: require("BaseModuleView"),

    properties: {
        infoName:cc.Label,
        infoImage:cc.Node,
        infoIP:cc.Label,      
        infoID:cc.Label,
        infoPositon:cc.Label,
        jushu:cc.Label,
        winRate:cc.Label,
        
        _userid:-1,

    },

    onLoad(){
        this.initEventHandlers();
        this.initView();
    },

    initView(){
   
      

    },

    initEventHandlers(){
        var self = this;
        var game = cc.fy.gameNetMgr;
        
        game.addHandler(GameMsgDef.ID_SHOWUSERINFOVIEW_CTC, function(data){
            console.log("==>> ID_SHOWUSERINFOVIEW_CTC --> data.isShow: ", data.isShow);
            if(data.isShow == false){
                self.close();
            }
            else{
                console.log("ID_SHOWUSERINFOVIEW_CTC ---- ");
                var userData = data.userData;
                console.log("==>> userData: ", userData);
                self.show(userData.name, userData.id, userData.iconSprite, userData.sex, userData.ip, userData.geo, userData.code);
            }
        });
        game.addHandler(GameMsgDef.ID_REFRESHGEO_CTC, function(data){
            self.refreshGeo(data.location, data.id)
        });
    },
    
    show:function(name,userId,iconSprite,sex,ip,geo,code){
        if(userId != null && userId > 0 && cc.fy.replayMgr.isReplay() == false){
          
            this._userid = userId;
            this.node.active = true;
            this.infoImage.getComponent(cc.Sprite).spriteFrame = iconSprite.spriteFrame;
            this.infoName.string = cc.fy.utils.subStringCN(name, 10, true);
            if(ip){
                var _ip = ip.replace("::ffff:","");
                var _iparr = _ip.split(".");
                if(_iparr && _iparr.length == 4 ){
                    _ip = _iparr[0] + "." + _iparr[1] + ".*." + _iparr[3];
                }
                this.infoIP.string = "IP: " + _ip;
            }
            else{
                this.infoIP.string = "IP: 正在获取...";
            }
            this.infoID.string = "ID: " + userId;
            if(geo == null || geo.location == null ||  geo.location == "" || geo.location == "null"){
                this.infoPositon.string = "位置未获得";
            }else{
                this.infoPositon.string = cc.fy.utils.subStringCN(this.getFinalGeo(geo.location),18,true);// cc.fy.utils.subStringCN(geo.location, 14, true);    // geo.location.split("区")[0] + "区";
            }
            // if(code != null){
            //     var labCode = this.node.getChildByName("labCode");
            //     if(labCode != null){
            //         labCode.getComponent(cc.Label).string = "推广码：" + code;
            //     }
            // }
            // else{
            //     var labCode = this.node.getChildByName("labCode");
            //     if(labCode != null){
            //         labCode.getComponent(cc.Label).string = "尚未绑定推广码";
            //     }
            // }
            cc.fy.userMgr.refreshGeo();
            this.reFreshPlayRecord();
        }else{
            this.close();
        }
    },

    reFreshPlayRecord:function(){
        var self=this;
        cc.fy.userMgr.getUserPlayRecord(function(ret){
            if(ret.errcode==0){
                var data =ret.errmsg
                self.jushu.string=data.count;
                if(data.count>0){
                    var rate =100*data.win/data.count;
                    self.winRate.string =rate.toFixed(2) + "%";
                }
            }else{
                self.jushu.string="0";
                self.winRate.string="0%";
            }
        });
    },

    refreshGeo:function(geo, userid)
    {
        if(this._userid == userid)
        {
            if(geo == null || geo.location == null ||  geo.location == ""){
                this.infoPositon.string = "位置未获得";
            }else{
               
                this.infoPositon.string = cc.fy.utils.subStringCN(this.getFinalGeo(geo.location),18,true);// cc.fy.utils.subStringCN(geo.location, 14, true);
            }
        }
    },

    getFinalGeo(geo){
        var finalGeo = "";
        var num1 = geo.indexOf("1");
        var num2 = geo.indexOf("2");
        var num3 = geo.indexOf("3");
        var num4 = geo.indexOf("4");
        var num5 = geo.indexOf("5");
        var num6 = geo.indexOf("6");
        var num7 = geo.indexOf("7");
        var num8 = geo.indexOf("8");
        var num9 = geo.indexOf("9");
        var num0 = geo.indexOf("0");
        if(num1 != -1){
            finalGeo = geo.split("1")[0];
        }
        else if(num2 != -1){
            finalGeo = geo.split("2")[0];
        }
        else if(num3 != -1){
            finalGeo = geo.split("3")[0];
        }
        else if(num4 != -1){
            finalGeo = geo.split("4")[0];
        }
        else if(num5 != -1){
            finalGeo = geo.split("5")[0];
        }
        else if(num6 != -1){
            finalGeo = geo.split("6")[0];
        }
        else if(num7 != -1){
            finalGeo = geo.split("7")[0];
        }
        else if(num8 != -1){
            finalGeo = geo.split("8")[0];
        }
        else if(num9 != -1){
            finalGeo = geo.split("9")[0];
        }
        else if(num0 != -1){
            finalGeo = geo.split("0")[0];
        }
        else{
            finalGeo = cc.fy.utils.subStringCN(geo, 12, true);
        }
        return finalGeo;
    },

    // 我的商城
    showShopWeb:function(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        var shopUrl = cc.WebShopUrl.format(cc.fy.userMgr.userId, cc.GAMEID);
        console.log("个人商场："+shopUrl);
        cc.sys.openURL(shopUrl);
    },
    close(){
        this.node.active = false;
    },
    onBtnClose(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.node.active = false;
    },
});
