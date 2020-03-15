cc.Class({
    extends: cc.Component,

    properties: {
        _timePointer: null,        //倒计时节点
        _point: null,   
        _seats: [],
        
        _gameplayer: 3,            //玩家数
        _time: -1,                 //倒计时时间
        _timeTotal: -1,               //倒计时时间总长
        _alertTime: -1,            //警报时间
        localIndex: -1,            //本地座位
    },

    onLoad: function () {
        if(cc.fy.gameNetMgr.seats == null){
            cc.fy.alert.show("该房间已解散",function(){
                cc.fy.sceneMgr.loadScene("hall");    
            });
            console.log("cc.fy.gameNetMgr.seats is null");
            return;
        }
        this._gameplayer = cc.fy.gameNetMgr.seats.length;

        var gameChild = this.node.getChildByName("game");
        this._timePointer = gameChild.getChildByName("timepoint");
        this._point = this._timePointer.getChildByName("pointers");
        this._timePointer.active = false;

        var sides = [];
        if(this._gameplayer == 3)
        {
            sides = ["self","right","left"];
        }
        else{
            sides = ["self","up"];
        }

        for(var i = 0; i < this._gameplayer; i++){
            var side = sides[i];
            var info = {};
            info.seat = this._point.getChildByName(side);
            info.clock = info.seat.getChildByName("pointdi")
            info.time = info.seat.getChildByName("time").getComponent(cc.Label);
            this._seats.push(info);
        }

        this.initEventHandlers();
    },

    initEventHandlers: function(){
        var self = this;

        // game.addHandler('pdk_game_begin',function(data){
        //     self.initPointer();
        //     self._time = 15;
        //     self._timeTotal = 15;
        //     self._alertTime = 5;
        // });
        var game =cc.fy.gameNetMgr;
        game.addHandler('pdk_game_chupai',function(data){
            self.initPointer();
            self._time = 15;
            self._timeTotal = 15;
            self._alertTime = 5;
        });

      
    },

    initPointer:function(){
        if(cc.fy == null){
            return;
        }

        this._timePointer.active = cc.fy.gameNetMgr.gamestate == "playing";
        if(!this._timePointer.active){
            return;
        }
        
        var turn = cc.fy.pdkGameNetMgr.turn;
        console.log("initPointer:"+turn);
        this.localIndex = cc.fy.gameNetMgr.getLocalIndex(turn);
        var isOver=cc.fy.pdkGameNetMgr.isNoLeftCards();
        for(var i = 0; i < this._seats.length; ++i){
            this._seats[i].seat.active = (i == this.localIndex && !isOver);
        }
    },
    
    update: function (dt) {
        if(this._time > 0){
            this._time -= dt;
            // if(this._alertTime > 0 && this._time < this._alertTime){
            //     this._alertTime = -1;
            // }
            var pre = "";
            if(this._time < 0){
                this._time = 0;
            }
            
            var t = Math.ceil(this._time);
            
            if(t < 10){
                pre = "0";
            }
            var per=this._time/this._timeTotal;
            for(var i = 0; i < this._seats.length; i++){
                if(i == this.localIndex){
                    this._seats[i].time.string = pre + t;
                    // if(t==3){
                    //     //催促音
                    //     cc.fy.audioMgr.playSFX("pdk_djs.mp3");
                    // }
                    // if(this._time <= this._alertTime){
                        this.playAnim(i,per);
                    // }
                }
            }
        }
    },

    playAnim: function(index,per){
        this._seats[index].clock.getComponent(cc.Sprite).fillRange  = per;
        // var seq = cc.repeatForever(
        //     cc.sequence(
        //         cc.fadeOut(0.5),
        //         cc.fadeIn(0.5)
        //     ));
        // this._seats[index].clock.runAction(seq);
    },
});
