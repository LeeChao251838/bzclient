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
        _reconnect:null,
        _lblTip:null,
        _lastPing:0,
        _connectCount:0,
        _timeTestCon:null,

        // _connectMark:false,
        _delayTime:0.0,
    },

    // use this for initialization
    onLoad: function () {
        // this._connectMark = false;
        this._reconnect = cc.find("reconnect", this.node);
        if(this._reconnect == null)
        {
            return;
        }
        this._lblTip = cc.find("reconnect/tip", this.node).getComponent(cc.Label);
        var self = this;
        var game = cc.fy.gameNetMgr;
        var fnTestServerOn = function(){
            cc.fy.net.test(function(ret){
               if(ret){
                    // cc.director.loadScene('hall');
                    cc.fy.gameNetMgr.reset();
                    cc.fy.gameNetMgr.isDispress = false;
                    var roomId = cc.fy.userMgr.oldRoomId;
                    if( roomId != null){
                        cc.fy.gameNetMgr.isReturn = true;
                        cc.fy.userMgr.enterRoom(roomId, self.onEnter);
                    }
                    else
                    {
                        console.log("fnTestServerOn hall");
                        // cc.director.loadScene("hall");
                        cc.fy.userMgr.reLogin();
                    }
               }
               else{
                    if(self._connectCount > 0 )
                    {
                        self._timeTestCon = setTimeout(fnTestServerOn,3000);
                    }
               }
            });
        }
        
        var fn = function(data){
            game.eventTarget.off('disconnect',fn);
            console.log("reconnect disconnect");

            if(self._timeTestCon != null){
                clearTimeout(self._timeTestCon);
                self._timeTestCon = null;
            }

            self._reconnect.active = true;
            self.reconnectTest();
            self._connectMark = false;
            self._connectCount = 0;
            // fnTestServerOn();
        };
        game.addHandler('disconnect',fn);
        this._connectCount = 0;

        // game.addHandler('reconnecthide', this.hide);
    },

    onEnter:function(ret){
        if(ret.errcode != 0){
            if(cc.fy.loading){
                cc.fy.loading.hide();
            }
            
            cc.fy.net.close();
            if(ret.errcode == -2){
                if(cc.fy.alert)
                {
                    cc.fy.userMgr.oldRoomId = null;
                    cc.fy.alert.show("房间已被玩家解散或牌局已结束！",function(){
                        cc.fy.sceneMgr.loadScene("hall");    
                    });
                    this.hide();
                }
            }
        }
    },

    hide:function(){
        if(this._reconnect){
            this._reconnect.active = false;
            // this._connectMark = false;
        }
        
        if(this._timeTestCon != null){
            clearTimeout(this._timeTestCon);
            this._timeTestCon = null;
        }
    },

    reconnectTest(){
        var self = this;
        // var fnTestServerOn = function(){
            cc.fy.net.test(function(ret){
                console.log("==>> 重连");
                if(ret){
                    self._connectMark = true;
                    // cc.director.loadScene('hall');
                    // cc.fy.gameNetMgr.reset();
                    cc.fy.gameNetMgr.isDispress = false;
                    var roomId = cc.fy.userMgr.oldRoomId;
                    if( roomId != null){
                        cc.fy.gameNetMgr.isReturn = true;
                        cc.fy.userMgr.enterRoom(roomId, self.onEnter);
                    }
                    // else
                    // {
                    //     console.log("fnTestServerOn hall");
                    //     // cc.director.loadScene("hall");
                    //     cc.fy.userMgr.reLogin();
                    // }
                }
            });
        // }
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this._reconnect && this._reconnect.active){
            // var t = Math.floor(Date.now() / 1000) % 4;
            // if(this._lblTip){
            //     this._lblTip.string = "网络连接超时，正在尝试重连";
            //     for(var i = 0; i < t; ++ i){
            //         this._lblTip.string += '.';
            //     }
            // }
            // this._connectCount += dt;
            // if(this._connectCount > 55)
            // {
            //     if(this._timeTestCon != null){
            //         clearTimeout(this._timeTestCon);
            //         this._timeTestCon = null;
            //     }
                
            //     cc.fy.net.close();
            //     cc.fy.sceneMgr.loadScene("login");
            //     this._connectCount = 0;
            // }

            this._delayTime += dt;
            if(this._connectMark == false){
                if(this._delayTime >= 2){
                    this._delayTime = 0.0;
                    this.reconnectTest();
                    this._connectMark = true;
                }
            }
            else{
                if(this._delayTime < 2){
                    this._connectMark = false;
                }
            }
        }
    },
});
