if(window.io == null){
    window.io = require("socket-io");
}
var EventDispatcher = require('EventDispatcher');
var GameMsgDef = require('GameMsgDef');
var Net = cc.Class({
    extends: cc.Component,
    statics: {
        ip:"",
        serverId:"",
        sio:null,
        isPinging:false,
        fnDisconnect:null,
        handlers:{},
        idInterval:null,
        timeTest:null,
        isGameBackground:false,
        isClubSocket:false,
        isReconnect:false,
        addHandler:function(event,fn){
            if(this.handlers[event]){
                console.log("event:" + event + "' handler has been registered.");
                return false;
            }

            var handler = function(data){
                //console.log(event + "(" + typeof(data) + "):" + (data? data.toString():"null"));
                if(event != "disconnect" && typeof(data) == "string"){
                    data = JSON.parse(data);
                }
                fn(data);
                
                if(cc.fy.gameMsg)
                {
                    cc.fy.gameMsg.dispatchGameEvent(event,data);
                }

                EventDispatcher.dispatch(GameMsgDef.MSGID, GameMsgDef.packagMsg(event, data));
            };
            
            this.handlers[event] = handler;
            if(this.sio){
                console.log("register:function " + event);
                this.sio.on(event,handler);
            }
            return true;
        },
        connect:function(fnConnect,fnError, isclub) {
            console.log("connect");
            this.isClubSocket = isclub;
            var self = this;
            
            var opts = {
                'reconnection':false,
                'force new connection': true,
                'transports':['websocket', 'polling']
            }
            var temp = cc.fy.http.getUrlType(this.ip);
            this.sio = window.io.connect(temp,opts);
            this.sio.on('reconnect',function(){
                console.log('sio.on reconnection');
            });
            this.sio.on('connect',function(data){
                console.log("sio.on connect");
                if(self.sio){
                    self.sio.connected = true;
                    fnConnect(data);
                }
            });
            
            this.sio.on('disconnect',function(data){
                console.log("sio.on disconnect");
                // self.sio.connected = false;
                if(self.sio){
                    self.close(true);
                }
            });
            
            this.sio.on('connect_failed',function (){
                console.log('sio.on connect_failed');
                fnError();
            });
            
            for(var key in this.handlers){
                var value = this.handlers[key];
                if(typeof(value) == "function"){
                    if(key == 'disconnect'){
                        this.fnDisconnect = value;
                    }
                    else{
                        console.log("register:function " + key);
                        this.sio.on(key,value);                        
                    }
                }
            }
            
            this.startHearbeat();
            
            // 监听切回来
            cc.game.on(cc.game.EVENT_SHOW, function () {
                console.log("cc.game.EVENT_SHOW Reconnect");
                if(cc.fy.sceneMgr.isGameScene()){
                    // if(cc.fy.net.isGameBackground == true){
                    //     cc.fy.net.isGameBackground = false;
                    //     cc.fy.net.send('game_foreground');
                    // }
                    self.changeBack();
                    // cc.fy.anysdkMgr.onShareMomentWebActive(2);
                }
            });
            cc.game.on(cc.game.EVENT_HIDE, function () {
                console.log("cc.game.EVENT_HIDE Reconnect");
                if(cc.fy.sceneMgr.isGameScene()){
                    self.lastRecieveTime = Date.now();
                    // if(cc.fy.net.isGameBackground == false){
                        // cc.fy.net.isGameBackground = true;
                        // cc.fy.net.send('game_background');
                    // }
                }
            });
        },
        
        changeBack:function()
        {
            var timeout = Date.now() - this.lastRecieveTime;
            if(timeout > 300000)
            {
                // 切后台超过30秒 重新登录
                // cc.fy.gameNetMgr.isOver = true;
                // cc.fy.userMgr.oldRoomId = null;
                // cc.fy.gameNetMgr.isDispress = false;
                // cc.fy.gameNetMgr.reset();
                // cc.fy.gameNetMgr.clear();
                // // cc.fy.sceneMgr.loadScene("hall");
                // cc.fy.userMgr.reLogin();
                cc.fy.userMgr.restart();
            }
            this.lastRecieveTime = Date.now();
        },

        startHearbeat:function(){
            let msgKey = 'game_pong';
            if(this.isClubSocket){
                msgKey = 'club_pong';
            }
            this.sio.on(msgKey, function(){
                console.log('Hearbeat pong');
                self.lastRecieveTime = Date.now();
            });
            this.lastRecieveTime = Date.now();
            var self = this;
            if(!self.isPinging){
                self.isPinging = true;
                self.idInterval = setInterval(function(){
                    if(self.sio && self.sio.connected){
                        if(Date.now() - self.lastRecieveTime > 15000){
                            // self.close();
                            self.sio.disconnect();
                        }
                        else{
                            self.ping();
                        }
                    }
                    else{
                        self.isPinging = false;
                    }
                },5000);
            }   
        },
        send:function(event,data){
            if(this.sio && this.sio.connected){
                if(data != null && (typeof(data) == "object")){
                    data = JSON.stringify(data);
                    //console.log(data);              
                }
                console.log("sio send " + event);
                cc.logMgr.log(data, "sio send " + event);
                this.sio.emit(event,data);
            }
        },
        
        ping:function(){
            let msgKey = 'game_ping';
            if(this.isClubSocket){
                msgKey = 'club_ping';
            }
            this.send(msgKey);
        },
        
        close:function(isServerClose){
            console.log("close");
            if(isServerClose != true){
                this.logOut();
            }
            if(this.idInterval != null)
            {
                clearInterval(this.idInterval);
            }
            this.isPinging = false;
            this.idInterval = null;
            if(this.sio != null){
                if(this.sio.connected){
                    this.sio.connected = false;
                }

                this.sio = null;
            }

            if(this.fnDisconnect){
                this.fnDisconnect();
                this.fnDisconnect = null;
            }
            console.log("close finish");
        },
        
        test:function(fnResult){
            if(this.timeTest != null){
               clearTimeout(this.timeTest);
               this.timeTest = null;
            }
            var xhr = null;
            var fn = function(ret){
                if(ret.isonline == null){
                    ret.isonline = false;
                }
                if(ret.isonline == false && ret.errcode != null && ret.errcode == 0){
                    ret.isonline = true;
                }
                fnResult(ret.isonline);
                xhr = null;
            }
            
            var arr = this.ip.split(':');
            var data = {
                account:cc.fy.userMgr.account,
                sign:cc.fy.userMgr.sign,
                ip:arr[0],
                port:arr[1],
            }
            xhr = cc.fy.http.sendRequest("/is_server_online",data,fn,null,0);
            this.timeTest = setTimeout(function(){
                if(xhr){
                    xhr.abort();
                    // cc.fy.http.url = "http://" + cc.fy.http.getNextUrl(cc.fy.http.url);
                    fnResult(false);
                }
            },1500);
        },

        reconnect:function(){
            cc.fy.loading.show("重新连接服务器", -1);
            let self = cc.fy.net;
            self.isReconnect = true; // 断线重连状态，需要连上游戏服并且成功登录之后切换false
            
            if(self.timeTest != null){
                clearTimeout(self.timeTest);
                self.timeTest = null;
            }

            let xhr = null;

            let enterRoom = function(){
                cc.fy.gameNetMgr.isDispress = false;
                var roomId = cc.fy.gameNetMgr.roomId;
                if( roomId != null){
                    cc.fy.gameNetMgr.isReturn = true;
                    cc.fy.userMgr.enterRoom(roomId, function(ret){
                        if(self.timeTest != null){
                            clearTimeout(self.timeTest);
                            self.timeTest = null;
                        }
                        self.isReconnect = false;
                        if(ret.errcode != 0){
                            cc.fy.gameNetMgr.isOver = true;
                            cc.fy.gameNetMgr.isReturn = false;
                            cc.fy.net.close();
                            cc.fy.userMgr.oldRoomId = null;
                            if(ret.errcode == -2 || (ret.errcode == -1 && ret.errmsg == null)){
                                cc.fy.alert.show("房间已被玩家解散或牌局已结束！",function(){
                                    cc.fy.sceneMgr.loadScene("hall");
                                });
                            }
                            else if(ret.errcode == 4 && ret.errmsg == null){
                                cc.fy.alert.show("房间已满,请刷新！",function(){
                                    cc.fy.sceneMgr.loadScene("hall");
                                });
                            }
                            else if(ret.errcode == 5 ){
                                cc.fy.alert.show("房卡不足",function(){
                                    cc.fy.sceneMgr.loadScene("hall");
                                });
                            }
                            else if(ret.errcode == 6){
                                cc.fy.alert.show("您已被踢出该房间，无法再次进入！",function(){
                                    cc.fy.sceneMgr.loadScene("hall");
                                });
                            }
                            else if(ret.errcode == 7){
                                cc.fy.alert.show("您不是圈子成员，无法进入!",function(){
                                    cc.fy.sceneMgr.loadScene("hall");
                                });
                            }
                            
                        }
                    }, -1);
                }
                else{
                    // 这一步防止连续断线重连时，极限情况下，房间解散了，直接退出登录
                    if(self.timeTest != null){
                        clearTimeout(self.timeTest);
                        self.timeTest = null;
                    }
                    cc.fy.userMgr.logOut();
                }
                
                if(self.timeTest != null){
                    clearTimeout(self.timeTest);
                    self.timeTest = null;
                }
                // 走到这里说明网络连通了，
                // 这里会有enterroom和conncet socket send login 三步操作 所以给进房间留充足的返回时间，4秒后再走doConnect
                self.timeTest = setTimeout(function(){
                    if(xhr){
                        xhr.abort();
                    }
                    doConnect();
                },4000);
            }

            let onCallBack = function(ret){
                if(/*ret.isonline && */!self.isReqEnter){
                    // 游戏服在线进房间，两秒内没返回再请求一次is_server_online，
                    // 这时上次的返回了也不进房间，保证一次的超时请求只有一次进房间
                    self.isReqEnter = true;
                    enterRoom();
                }
            }

            // 检查游戏服是否能连上，没有返回或者游戏服还未重启，每两秒请求一次
            let doConnect = function(){
                cc.fy.loading.show("重新连接服务器", -1);
                self.isReqEnter = false; // 重置掉进房间的状态
                 
                var arr = self.mainIp.split(':');
                let _ip = arr[0];
                let _port = arr[1];
                _ip = cc.fy.http.getUrlType(_ip);
                var data = {
                    account:cc.fy.userMgr.account,
                    sign:cc.fy.userMgr.sign,
                    ip: _ip,
                    port: _port,
                }
    
                xhr = cc.fy.http.sendRequest("/is_server_online",data,onCallBack,null,0);

                if(self.timeTest != null){
                    clearTimeout(self.timeTest);
                    self.timeTest = null;
                }
                
                self.timeTest = setTimeout(function(){
                    if(xhr){
                        xhr.abort();
                    }
                    doConnect(); // 两秒之后再请求一次
                },2000);
            }

            // 第一次请求
            doConnect();
        },

        clearHandlers:function(){
            this.handlers = {};
       },

        logOut:function(){
            let msgKey = 'logout';
            if(this.isClubSocket){
                msgKey = 'club_logout';
            }
            this.send(msgKey);
        },

        disconnect:function(){
            if(this.sio){
                this.sio.disconnect();
            }
        }
    },
});