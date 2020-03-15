var md5 =  require("md5");
var GameMsgDef = require('GameMsgDef');
var ConstsDef  = require("ConstsDef");
cc.Class({
    extends: cc.Component,

    properties: {
        gameMain:cc.Node,
        lblName:cc.Label,
        lblGems:cc.Label,
        lblID:cc.Label,
        lblNotice:cc.Label,
        sprHeadImg:cc.Sprite,
        btnAddGem:cc.Node,

        tipKefu:cc.Node,//添加客服微信的飘窗
        tipShare:cc.Node,//分享送房卡的飘窗

        _delayTime : 0.0,
        anBg:cc.Node,
        guideNode:cc.Node,//引导进牌友圈
        guildClick:false,
        
    },
  

    //
    onShareMOwang(){
        cc.fy.anysdkMgr.MoWangShareDataImage();
    },
    
    onShareMOwangLink(){
        var title="【乐百苏州麻将】";
        var info = "集合当地多种玩法，一键开局，享受最流畅的地方棋牌，等你来开房!";
        var shareLink=cc.InviteLink;
        // cc.fy.anysdkMgr.MoWangShare(2,"","",title,info,shareLink);
        cc.fy.anysdkMgr.MoWangShareLink(title,info);
    },
    //节日活动
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
            if(ret!=null){
                if(ret.code==0){
                    // self.gameMain.getChildByName("top_right").getChildByName("btnActivity").getChildByName("icon_red").active=true;            
                }
            }
        };
        cc.fy.http.sendRequest("/game/get_activity", data, onCallBack, _url, 3, null, true);
    },
    //绑定有礼活动
    getBindActivityURL(){
        // cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWWEBVIEWBOXVIEW_CTC, {isShow:true,url:'',type:'invite'});
                
        var self = this;
        var _url = cc.WEBURL+"api";
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
            if(ret!=null){
                if(ret.code==0){
                    var url =ret.data.url;
                    cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWWEBVIEWBOXVIEW_CTC, {isShow:true,url:url,type:'invite'});
                }else{
                    cc.fy.hintBox.show("暂无活动");
                }
            }
        };
            
        cc.fy.http.sendRequest("/game/activity_url", data, onCallBack, _url, 3, null, true);
    },
    // 活动分享
    onShareMomentActive(){
        let gameid = cc.GAMEID;
        let userid =  cc.fy.userMgr.userId;
        let data = "gameid="+gameid+"&userid="+userid+"&secret=1k18zavmpad";

        let autosignature = md5.hex_md5(data);
        let newdata = {
            gameid:gameid,
            userid:userid,
            signature:autosignature,
        };

        // var self = this;
        let onRec = function(ret){
            if(ret.code == 0){
                cc.fy.hintBox.show(ret.message);
            }
        };

        let shareURl = cc.WEBAPIURL + "/game";

        cc.fy.http.sendRequest("/share", newdata, onRec, shareURl,3,autosignature,true);
    },

    initEventHandlers(){
        var game = cc.fy.gameNetMgr;
        console.log("hall view load-----")
        // 指定消息转发的结点 需要切换场景才需要加这句，作为界面的组件不需要这句
        game.eventTarget = this.node;
    },

    start(){     
        var self = this;
        if(!cc.fy){
            cc.fy.sceneMgr.loadScene("loading");
            return;
        }

        this.initEventHandlers();

        if(cc.fy.global.masterKillMe){
            cc.fy.hintBox.show("您已被房主踢出房间");
            cc.fy.global.masterKillMe = false;
        }

        this.initLabels();

        var listener = { 
            event: cc.EventListener.KEYBOARD, 
            onKeyPressed: function (keyCode, event) { 
                cc.log('keyDown: ' + keyCode); 
            }, 
            onKeyReleased: function (keyCode, event) { 
                cc.log('keyUp: ' + keyCode); 
                if (keyCode == cc.KEY.back) {    //beta版本这里的back的keycode有误，也可以自行改为6 
                    cc.fy.alert.show("是否退出游戏？",function(){
                            cc.director.end(); 
                    },true);
                    
                } 
            } 
        } 
        // 绑定键盘事件 
        cc.eventManager.addListener(listener, this.node);
        var roomId = cc.fy.userMgr.oldRoomId 
        if(roomId != null){
            cc.fy.userMgr.enterRoom(roomId);
        }
        
        var imageloader = this.sprHeadImg.node.getComponent("ImageLoader");
        // imgLoader.setUserID(cc.fy.userMgr.userId);
        cc.fy.resMgr.setSpriteFrameByUrl(ConstsDef.URL_ATLAS_HEADIMG,this.sprHeadImg);
        
        imageloader.setUserID(cc.fy.userMgr.userId);
        
        // var btn_shop = cc.find("Canvas/bottom_left/gridbutton/btn_shop");
    
        this.lblGems.string = cc.fy.userMgr.gems;
            
        if(!cc.fy.userMgr.notice){
            cc.fy.userMgr.notice = {
                version:null,
                msg:"数据请求中...",
            }
        }
        
        if(!cc.fy.userMgr.gemstip){
            cc.fy.userMgr.gemstip = {
                version:null,
                msg:"数据请求中...",
            }
        }

        if(!cc.fy.userMgr.welcome){
            cc.fy.userMgr.welcome = {
                version:null,
                msg:"数据请求中...",
            }
        }
        
        this.lblNotice.string = cc.fy.userMgr.notice.msg;
        
        this.refreshInfo();
        //顶部跑马灯
        this.refreshNotice();
        //点击充值弹出的文本
        this.refreshGemsTip();
        cc.fy.hall = this;
        cc.fy.audioMgr.playBGM("bgMain.mp3");

        // 监听切回来
        cc.game.on(cc.game.EVENT_SHOW, function () {
            console.log("cc.game.EVENT_SHOW ");
            setTimeout(function(){
                 self.checkInvite();
            },300);
           
        });

        this.checkInvite();
        this.getWebActivityURL();
        if(cc.fy.gameNetMgr.isDispress){
            cc.fy.gameNetMgr.isDispress = false;
            cc.fy.hintBox.show("房间已被玩家解散或牌局已结束！");
        }

        cc.fy.userMgr.getUserPlayRecord();
        //获取二维码
        cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_REFRESHQRCODE_CTC);


        //测试代码
        // cc.fy.anysdkMgr.getBattery();
        // cc.fy.anysdkMgr.getWifiLevel();


        //飘窗动画
   
        this.tipKefu.y=-140;
        this.tipShare.y=-140;
        this.tipKefu.runAction(cc.repeatForever(cc.sequence(
            cc.moveBy(0.5,0,10),  
            cc.moveBy(0.5,0,-10),              
        )));
        this.tipShare.runAction(cc.repeatForever(cc.sequence(
            cc.moveBy(0.5,0,10),
            cc.moveBy(0.5,0,-10),               
        )))
        // let anmi= this.anBg.getComponent(sp.Skeleton);
      
        // anmi.setAnimation(1, "关门", false);
        // anmi.setCompleteListener(function(){        
        //     anmi.setAnimation(1, "开门", false);
        //     anmi.setCompleteListener(function(){
        //         anmi.setAnimation(1, "关门", false);
        //     })
        // });
        this.guideNode.active=false;
        this.guildClick=cc.fy.localStorage.getItem('guildClick');
        if(this.guildClick=='0'){         
            let localGuide=cc.fy.localStorage.getItem('localGuide');
            if(localGuide){
                switch(localGuide){
                    case '1':                   
                        this.guideNode.active=true;
                        break;
                    case '2':
                        this.guideNode.active=true;
                        break;
                    case '3':
                        this.guideNode.active=true;
                        break;
                }
            }
        }
    
    },

    refreshInfo(){
        var self = this;
        var onGet = function(ret){
            if(ret.errcode !== 0){
                console.log(ret.errmsg);
            }
            else{
                if(ret.gems != null){
                    //控制加房卡按钮 如果未审核通过 cc.FREEVERSION = true 时
                    // if(cc.FREEVERSION)
                    // {
                    //     self.lblGems.string = "免费";
                    // }else
                    // {
                        self.lblGems.string = ret.gems;
                    // }
                    cc.fy.gameNetMgr.dispatchEvent("gems_change",{gems:ret.gems});
                    //self.lblGems.string = ret.gems;
                }
            }
        };
        cc.fy.userMgr.getUserStatus(onGet);
        cc.fy.http.sendRequest('/is_certification', { userId:cc.fy.userMgr.userId}, function(data){
            if(data.is){
                var json = {uid: cc.fy.userMgr.userId};
                cc.fy.localStorage.setItem("realname", JSON.stringify(json));
            }
        });
        // cc.fy.http.sendRequest('/get_free_time',{ userId:cc.fy.userMgr.userId},function(ret){
        //     if(ret.errcode==0){
        //         cc.fy.global.cardFree=ret.errmsg.data;
        //     }else{
        //         cc.fy.global.cardFree=null;
        //     }
        //     console.log("get_free_time",ret);
        // });
    },
    
    refreshGemsTip(){
        var onGet = function(ret){
            if(ret.errcode !== 0){
                console.log(ret.errmsg);
            }
            else{
                cc.fy.userMgr.gemstip.version = ret.version;
                cc.fy.userMgr.gemstip.msg = ret.msg.replace("<newline>","\n");
            }
        };
        
        var data = {
            account:cc.fy.userMgr.account,
            sign:cc.fy.userMgr.sign,
            type:"gems",
            // version:cc.fy.userMgr.gemstip.version
        };
        cc.fy.http.sendRequest("/get_message",data,onGet.bind(this));
    },

    refreshNotice(){
        var onGet = function(ret){
            if(ret.errcode !== 0){
                console.log(ret.errmsg);
            }
            else{
                cc.fy.userMgr.notice.version = ret.version;
                cc.fy.userMgr.notice.msg = ret.msg;
                this.lblNotice.string = ret.msg;
            }
        };
        
        var data = {
            account:cc.fy.userMgr.account,
            sign:cc.fy.userMgr.sign,
            type:"notice",
        };
        cc.fy.http.sendRequest("/get_message", data, onGet.bind(this));
    },
    
    initLabels(){
        this.lblName.string = cc.fy.utils.subStringCN(cc.fy.userMgr.userName, 12, true);
        this.lblID.string = "ID:" + cc.fy.userMgr.userId;
    },
    
    onBtnClicked(event){
        var name = event.target.name;
        console.log("==>> onBtnClicked --> name: ", name);
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        //个人信息
        if(name == "headInfo"){
            var userData = {
                name:cc.fy.userMgr.userName,
                id:cc.fy.userMgr.userId,
                iconSprite:this.sprHeadImg,
                sex:cc.fy.userMgr.sex,
                ip:cc.fy.userMgr.localIP,
                geo:cc.fy.userMgr.geolocation,
                code:cc.fy.userMgr.proid
            };
            cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWUSERINFOVIEW_CTC, {isShow:true, userData:userData});
        }
        else if(name == "addfangkaButton"){
           
            //新版商店
            cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWHALLSHOPVIEW_CTC, {isShow:true});
        }
        // else if(name == "btn_feedback"){
        //     cc.fy.alert.show(cc.fy.userMgr.gemstip.msg);
        // }
        // else if(name == "btn_popnotice"){
        //     cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWPOPNOTICEVIEW_CTC, {isShow:true});
        // }
         //活动
        //  else if(name == "btnActivity"){
        //     // cc.fy.hintBox.show("敬请期待");
        //       cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWACTIVITYVIEW_CTC, {isShow:true});
        //  }
        //招募跳转公告  传1
        else if(name == "btnZhaoMu"){
            // cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWPOPNOTICEVIEW_CTC, {isShow:true,idx:1});
            // cc.fy.localStorage.clear();
            cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWZHAOMUVIEW_CTC, {isShow:true});
        }
        //绑定
        else if(name == "btnYQM"){
           
           
                cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWWELFAREVIEW_CTC , {isShow:true});
          
        }
        else if(name=='btnShare'){

        //    if(cc.fy.anysdkMgr.isXianliaoInstalled()){
        //         //闲聊
        //         //this.onXianLiaoShare();
        //         // var info = "集合当地多种玩法，一键开局，享受最流畅的当地棋牌，等你来开房!";
        //         //  var param = "http://fyweb.51v.cn/lbhamj/images/icon.png";
        //         //  var title="【乐百淮安麻将】";
        //         // cc.fy.anysdkMgr.xianLiaoShareGame("","roomToken",title,info,param);
        //         //分享网络图片
        //         var onGet=function(ret){
        //             console.log("shareImg:",ret);
        //             if(ret.errcode !== 0){
        //                 console.log(ret.errmsg);
        //             }else{
        //                 cc.fy.anysdkMgr.xianLiaoShareUrlImage(ret.msg);
        //             }
                    
        //         };
        //         var data = {
        //             account:cc.fy.userMgr.account,
        //             sign:cc.fy.userMgr.sign,
        //             type:"shareImg",
        //         };
        //         cc.fy.http.sendRequest("/get_message", data, onGet.bind(this));
                
        //     }else{
                //分享微信
                // var info = "集合当地多种玩法，一键开局，享受最流畅的当地棋牌，等你来开房!";
                // cc.fy.anysdkMgr.share("【乐百淮安麻将】", info);
               

              cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWSHAREVIEW_CTC,{isShow:true,sharetype:1});
              
          //  }
            
            //cc.fy.anysdkMgr.share();
           // cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWSHAREVIEW_CTC, {isShow:true});
        }            
        //牌友圈
        else if(name == "btnGuild"){
            console.log("btnGuild");
            cc.fy.localStorage.setItem('guildClick','1');
            this.guideNode.active=false;
            cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWGUILDMAINVIEW_CTC, {isShow:true});
        }
        //设置
        else if(name == "btnSet"){           
            cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWHALLSETTINGVIEW_CTC, {isShow:true});
        } 
        //活动公告
        else if(name=='btnNotice'){
            cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWPOPNOTICEVIEW_CTC, {isShow:true});
        }  
        //创建房间
        else if(name == "btnCreate"){
            if(cc.fy.gameNetMgr.roomId != null){
                cc.fy.alert.show("房间已经创建!\n必须解散当前房间才能创建新的房间");
                return;
            }
            cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWCREATEROOMVIEW_CTC, {isShow:true});
        }
        //加入房间
        else if(name == "btnJoin"){
            cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWJOINGAMEVIEW_CTC, {isShow:true});
        }
        //战绩
        else if(name == "btnZhanji"){
            cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWHISTORYVIEW_CTC, {isShow:true});
        } 
        //规则
        else if(name == "btnRule"){
            cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWHELPVIEW_CTC, {isShow:true});
        }
        //绑定好礼
        else if(name == "btnBangdingyouli"){
            this.getBindActivityURL();
         }
       
    },

    onStartGameClicked(event, type){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        var AIGameMgr = require("AIGameMgr");
        cc.fy.aiGameMgr = new AIGameMgr();
        cc.fy.aiGameMgr.onJoinGame(type);
    },
    
    onBtnAddGemsClicked(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        // if((cc.FREEVERSION && cc.sys.os == cc.sys.OS_IOS) || cc.APPSTORE){
        //     if(this.shopWin){
        //         this.shopWin.active = true;
        //     }
        // }
        // else{
        //     cc.fy.alert.show(cc.fy.userMgr.gemstip.msg);
        // }
    },
    // onPlayAnim(){
    //     var birdSpine = cc.find("bird/skeleton", this.node);
    //     var spine = birdSpine.getComponent(sp.Skeleton);
    //     spine.setAnimation(0, "shengqi", false);
    //     spine.setCompleteListener(function () {
    //         if (spine.animation == "shengqi") {
    //             spine.setAnimation(0, "qifei", true);
    //         }
    //     });
    // },

    checkInvite(){
        // 情况一：玩家未启动应用，直接进入该房间
        // 情况二：玩家已启动应用，直接进入该房间
        // 情况三：玩家正在房间内（不是房主），则退出原来的房间，进入新的房间
        // 情况四：玩家正在房间内（是房主），则提示：您是房主，需要先解散该房间才能进入别的房间、
        // 情况五：玩家正在游戏，无反应
        this.scheduleOnce(function() {
            console.log("checkInvite");
            // 这里的 this 指向 component
            cc.fy.anysdkMgr.getInviteData();
        }, 1.5);
    },

    // 排序
    getCodeN(data){
        var keys = [];
        var str = "?";
        var _code = "";
        for(var k in data){
            if(str != "?"){
                str += "&";
            }
            str += k + "=" + data[k];

            keys.push(k);
        }
        keys.sort();

        for(var i = 0; i < keys.length; i++)
        {
            if(keys[i].toString() == "name"){
                continue;
            }
            if(_code != "")
            {
                _code = _code + "&";
            }
            _code =  _code + keys[i] + "=" + data[keys[i]];
        }
        return _code;
    },
    update(dt){
        if(this.lblNotice){
            var x = this.lblNotice.node.x;
            x -= dt*100;
            if(x + this.lblNotice.node.width < -260){
                x = 460;
            }
            this.lblNotice.node.x = x;
        }
        
        if(cc.fy && cc.fy.userMgr.roomData != null){
            cc.fy.userMgr.enterRoom(cc.fy.userMgr.roomData);
            cc.fy.userMgr.roomData = null;
        }

        // 每隔5秒钟刷新一次房卡数量
        this._delayTime += dt;
        // console.log("--> delayTime  ", this._delayTime);
        if(this._delayTime >= 5){
            this._delayTime = 0.0;
            this.refreshInfo();
        }
    },
});
