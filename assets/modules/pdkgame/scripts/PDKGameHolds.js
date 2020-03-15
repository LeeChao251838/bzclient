var PokerDef            = require("PDKPokerDef");
var PokerUtil           = require("PDKUtils");
var PokerValue          = PokerDef.PokerValue;

var HoldDegree={
    1:{start:0,dis:0},
    2:{start:-2.5,dis:5},
    3:{start:-5,dis:5},
    4:{start:-7.5,dis:16/3},
    5:{start:-8.6,dis:4.5},
    6:{start:-9.5,dis:4},
    7:{start:-11.4,dis:22/6},
    8:{start:-12.8,dis:26/7},
    9:{start:-12.8,dis:26/8},
    10:{start:-12.8,dis:26/9},
    11:{start:-12.8,dis:26/10},
    12:{start:-12.8,dis:26/11},
    13:{start:-12.8,dis:26/12},
    14:{start:-12.8,dis:2},
    15:{start:-13.8,dis:2},
    16:{start:-14.5,dis:1.95},
}

var HoldY=[0,-4,-9,-16,-26,-39,-54,-71];
var FoldY=[0,-2,-4,-7,-11,-15,-19,-24];

var LHold={
    1:{r:73,x:-186,y:33},
    2:{r:80,x:-185,y:24},
    3:{r:87,x:-184,y:17},
    4:{r:94,x:-184,y:10},
    5:{r:100,x:-185,y:1},
    6:{r:106,x:-188,y:-8},
    7:{r:111,x:-194,y:-13},
    8:{r:118,x:-199,y:-18},
    9:{r:122,x:-206,y:-26},
}
var RHold={
    1:{r:-73,x:194,y:34},
    2:{r:-80,x:194,y:25},
    3:{r:-87,x:193,y:17},
    4:{r:-94,x:194,y:10},
    5:{r:-100,x:195,y:0},
    6:{r:-106,x:198,y:-8},
    7:{r:-111,x:202,y:-14},
    8:{r:-118,x:208,y:-19},
    9:{r:-122,x:214,y:-26},
}

var UHold={
    1:{r:-198,x:154,y:87},
    2:{r:-190,x:146,y:86},
    3:{r:-184,x:137,y:86},
    4:{r:-176,x:130,y:86},
    5:{r:-170,x:121,y:87},
    6:{r:-163,x:113,y:89},
    7:{r:-158,x:107,y:95},
    8:{r:-152,x:102,y:100},
    9:{r:-147,x:95,y:106},
}
cc.Class({
    extends: cc.Component,
 
    properties: {
        _pokerBlank: null,        
        ndHoldRoot: null,          //自己手牌节点
        ndOtherHolds: null,
        ndHolds: [],               //自己手牌数组
        ndOtherHoldRoot: null,     //其他玩家手牌节点

        _gameplayer: 3,            //玩家
        rotateRadius:1821,            //牌旋转半径
        offsetPai: 32,               //牌向上移动的距离
        _touchBegan: 0,            //开始点击
        _touchNull: false,         //是否点击空白区域
        _selectPoker: null,        //当前选择的牌
        _tipIndex: 0,              //提示数据
        _tipList: null,            //提示牌列表
        _moveSelected:0,            // 滑动选牌完成
        _isRunning:false,            //手牌正在跑动画
        _chupaiAlert:null,          //出牌提示节点
        _isAlerting:false,          //正在提示
        _limitTouch:false,          //限制按钮点击
        _selectPokerArr:[],//已选的数组
    },

    onLoad: function () {
        this._gameplayer = cc.fy.gameNetMgr.seats.length;

        this._pokerBlank = this.node.getChildByName("pokerblank");
        var gameChild = this.node.getChildByName("game");
        var myselfChild = gameChild.getChildByName("myself");
        this.ndHoldRoot = myselfChild.getChildByName("holds");
        this.ndHoldRoot.active = false;
       
        this._chupaiAlert=this.node.getChildByName("pdkAlert");
        //战绩回放显示其他手牌
     //   if(cc.fy.replayMgr.isReplay()){
            this.ndOtherHoldRoot = {};
            for(var i = 1; i < cc.fy.gameNetMgr.seats.length; ++i){
                var sideName = cc.fy.pdkGameNetMgr.getSideByLocalIndex(i);
                var sideRoot = gameChild.getChildByName(sideName);
                var foldRoot = sideRoot.getChildByName("holds");
                this.ndOtherHoldRoot[sideName] = foldRoot;
            }
    
            this.ndOtherHolds = {};
       // }

        this.initEventHandlers();
        this.initTouchHandler();

    },

    initEventHandlers: function(){
        var self = this;
        var game =cc.fy.gameNetMgr;
        // 发手牌
        game.addHandler('cc_pdk_stc_dealcard', function(data){
            self.hideSelfHolds();
            self.hideAllHolds();
            setTimeout(function(){
                self.doFaPai();
              // self.initHands();
            },300);
            
        });

        // 发送出牌消息
        game.addHandler('cc_pdk_cts_playcard', function(data){
            // 传递过来有数据，视为不出
            if(data){
                self.buChu(); 
            }else{
                self.playCard(); // 出牌
            }
        });

        // 收到出牌消息
        game.addHandler('cc_pdk_stc_playcard', function(data){
             self._moveSelected = 0;
             self.doPlayCards(data);
        });

        //轮到出牌
        game.addHandler('pdk_game_chupai',function(data){
            self._isRunning=false;
            self._limitTouch=false;
            self.checkOnlyOne();
        });
        game.addHandler('cc_pdk_stc_gamedata', function(data){
            setTimeout(function(){
                self.initHands();
            },100);
        });

        // 提示消息
        game.addHandler('cc_pdk_bigertip', function(data){
            self.showBigerTip();
        });

        game.addHandler('pdk_reply', function(){
             // 理个牌
              console.log("----------pdk_replay--------");
             var holds = cc.fy.pdkGameNetMgr.holds;
            //  console.log(holds);
             if(holds != null && holds.length > 0){
                self.initHands();          
             }
             var allHolds = cc.fy.pdkGameNetMgr.hands;
            //  console.log(allHolds);
             if(allHolds != null && allHolds.length > 0){
                // 理个牌
                for(var i=0;i<allHolds.length;i++){
                     cc.fy.PDKGameMgr.sortCards(allHolds[i]);
                 }
                self.initOtherHolds();
             }
        });

       //游戏结束,清理手牌
        game.addHandler('pdk_game_over',function(data){
            self.hideSelfHolds();
        });

    },

    //出牌提示
    alert:function(msg){
        if(!this._chupaiAlert || this._isAlerting==true){
            return;
        }
        this._isAlerting=true;
        this._chupaiAlert.active=true;
        this._chupaiAlert.opacity=0;
        var lal= this._chupaiAlert.getChildByName("info");
        lal.getComponent(cc.Label).string=msg;
        
        var self=this;
        this._chupaiAlert.runAction(cc.sequence(
            cc.fadeIn(0.3),
            cc.delayTime(1.5),
            cc.fadeOut(0.5),
            cc.callFunc(function(){
                self._isAlerting=false;
            })
        ));
    },

    //发牌动画
    doFaPai:function(){
        console.log("pdk  fapai");
       
        if(this.ndHoldRoot==null){
            this.ndHoldRoot=cc.find("game/myself/holds",this.node);
        }
        this.ndHoldRoot.active = true;
        
        var hands = cc.fy.pdkGameNetMgr.holds;
        if(hands==null || hands.length==0){
            this.ndHoldRoot.active = false;
            return;
        }
        this._isRunning=true;

        var perfab = cc.fy.PDKGameMgr.getHandsPoferBoxPrefab();
    
        var startRotation=HoldDegree[hands.length].start;
        var offRotation=HoldDegree[hands.length].dis;
      
        var holdsIndex = 0;
        for(var i = 0; i < hands.length; i++){
            var rota=startRotation+offRotation*i;
            var pokerBox = this.ndHolds[i];
            if(pokerBox == null){
                var ndpoker = cc.instantiate(perfab);                                         
                this.ndHoldRoot.addChild(ndpoker);
                pokerBox = ndpoker.getComponent("PDKPokerBox");          
                this.ndHolds.push(pokerBox);
            }
            holdsIndex++;
            pokerBox.DealCards(this.rotateRadius,rota,i); //发牌动作
        }
        //发完牌
        var self=this;
        setTimeout(function(){
            self.initHands(true);
            self._isRunning=false;
        },1300);

        // setTimeout(function(){
        //     self._isRunning=false;
        // },2600);

        

            // poker.node.runAction(cc.sequence(
            //     cc.delayTime(_time),
            //     cc.callFunc(function(){ 
            //         //self.ndHolds[index].show();
            //         index++;
            //     }),
            //     cc.spawn(cc.moveTo(0.08,_x,_y),cc.rotateTo(0.08,_rotation)),
            //     cc.callFunc(function(){
            //         console.log("index:"+index);
            //         if(index==hands.length){
            //             self._isRunning=false;
            //             console.log("初始化手牌");
            //             setTimeout(function(){
                            
            //             },100);
            //         }
            //     }),
            // ));       
        //其他人发牌
 /*       var side=["right","left"];
        if(this._gameplayer==2){
            side=["up"];
             
        }
        var prefab= cc.fy.PDKGameMgr.getFoldsPokerPrefab();
        
        for(let i=0;i<side.length;i++){
            var holdRoot=this.ndOtherHoldRoot[side[i]];
            var cards=holdRoot.children;
            for(let j=0;j<9;j++){
                var ndPoker=cards[j];
                if(ndPoker==null){
                    ndPoker=cc.instantiate(prefab);
                    holdRoot.addChild(ndPoker);
                }
                var poker=ndPoker.getComponent("PDKPoker");
                poker.showBack();
                poker.setSelect(false);
                var _rotation=-180;
                var _pos={x:119,y:70};
                var holdData=null;
                if(side[i]=="left"){
                    _rotation=90;
                    _pos={x:-166,y:0};
                    holdData=LHold[i+1];
                }else if(side[i]=="right"){
                    _rotation=-90;
                    _pos={x:176,y:0};
                    holdData=RHold[i+1];
                }else{
                    holdData=UHold[i+1];
                }
                poker.setNScale(0.97);
                poker.setRotation(_rotation);
                poker.setX(_pos.x);
                poker.setY(_pos.y);
                ndPoker.runAction(cc.sequence(
                    cc.delayTime(1),
                    cc.spawn(cc.moveTo(0.3,holdData.x,holdData.y),cc.rotateTo(0.3,holdData.r)),
                    cc.callFunc(function(){
                        this.hideAllHolds();
                    }.bind(this))
                ));
            }
        }*/
    },

    //通过下标获取相应本地位置
    getSideByIndex: function(playernum, index){
        var sides = [];
        if(playernum == 3){
            sides = ["myself", "right","left"];
        }
        else{
            sides = ["myself", "up"];
        }

        return sides[index]
    },

    //初始化手牌数据, 有沒有發牌動作
    initHands:function(isAction){
        this.ndHoldRoot.active = true;
        var hands = cc.fy.pdkGameNetMgr.holds = cc.fy.PDKGameMgr.sortCards(cc.fy.pdkGameNetMgr.holds);
        console.log("int hands:"+hands);
        if(hands){
            this.setHands(hands,isAction);
        }
        else{
            
            this.ndHoldRoot.active = false;
        }
    },

    //隐藏所有出牌
    hideAllHolds:function(){
        var arr=["left","up","right"];
        for(let j=0;j<arr.length;j++){
           var holdRoot= this.ndOtherHoldRoot[arr[j]];
           if(holdRoot==null){
               continue;
           }
            holdRoot.active=true;
            var cards=holdRoot.children;
            for(let i=0;i<cards.length;i++){
                cards[i].active=false;
            }
        }  
    },

    hideSelfHolds:function(){
        //自己手牌
        for(let i=0;i<this.ndHolds.length;i++){
         
            this.ndHolds[i].setNScale(1);
            this.ndHolds[i].hide();
        }
    },

    //设置手牌 ,发不发牌
    setHands: function(hands,isAction){
        if(hands == null){
            return;
        }
        var perfab = cc.fy.PDKGameMgr.getHandsPoferBoxPrefab();
    
        var startRotation=HoldDegree[hands.length].start;
        var offRotation=HoldDegree[hands.length].dis;
      
        var holdsIndex = 0;
        for(var i = 0; i < hands.length; i++){
            var rota=startRotation+offRotation*i;
            var pokerBox = this.ndHolds[i];
            if(pokerBox == null){
                var ndpoker = cc.instantiate(perfab);                                         
                this.ndHoldRoot.addChild(ndpoker);
                pokerBox = ndpoker.getComponent("PDKPokerBox");          
                this.ndHolds.push(pokerBox);
            }
            holdsIndex++;
            pokerBox.setCard(this.rotateRadius,rota,hands[i])      
            if(isAction){
                pokerBox.FanPai(i*0.02);
            }   
        }
        console.log("holdsIndex:"+holdsIndex+"   hands:"+hands,this.ndHolds);
        if(this.ndHolds.length > holdsIndex){
            for(var j=holdsIndex;j<this.ndHolds.length;j++){
                this.ndHolds[j].hide();
            }
        }

    },

    // 初始化其他手牌
    initOtherHolds:function(){
        var hands = cc.fy.pdkGameNetMgr.hands;
        if(hands == null || hands.length == 0){
            return;
        }

        for(var i = 0; i < hands.length; i++){
            this.showOtherHolds(i, hands[i])
        }
    },

    showOtherHolds:function(seatIndex, holds){
        
        var localIndex = cc.fy.gameNetMgr.getLocalIndex(seatIndex);
        if(localIndex == 0 || holds == null){
            return;
        }
    
        cc.fy.PDKGameMgr.printCards(holds, "initOtherHolds index:" + seatIndex);
       
        var offsetX = 30;
        var offsetY = 50;
        var smallCel = 8;
        var prefab = cc.fy.PDKGameMgr.getFoldsPokerPrefab();
        var sideName = cc.fy.pdkGameNetMgr.getSideByLocalIndex(localIndex);
        var holdsIndex = 0;
        var dirX = sideName == "left" ? 1:-1;  //left往右 ，up、right往左
        var length = holds.length;

        var startX=0;
        var startY=0;
        if(sideName=="right"){
            startX=66;
            startY=50;
        }else if(sideName=="left"){
            startX=-120;
            startY=150;
        }else if(sideName=="up"){
            startX=66;
            startY=10;
        }

        this.ndOtherHoldRoot[sideName].active = true;

        if(this.ndOtherHolds[sideName] == null){
            this.ndOtherHolds[sideName] = [];
        }
       
        // console.log(this.ndOtherHolds);
        for(var i=0;i<holds.length;i++){
            if(holds[i].length == null){
                var poker = this.ndOtherHolds[sideName][holdsIndex];
                if(poker == null){
                    var ndpoker = cc.instantiate(prefab);
                    this.ndOtherHoldRoot[sideName].addChild(ndpoker);
                    if(dirX == -1){
                        ndpoker.zIndex = i < 8 ? - i : length - i;
                    }
                    else{
                        ndpoker.zIndex = i;
                    }
                    
                    poker = ndpoker.getComponent("PDKPoker");
                    this.ndOtherHolds[sideName].push(poker);
                    //console.log(poker);
                }
                poker.setX(startX+dirX * offsetX * (i % smallCel));
                poker.setY(startY+offsetY * -Math.floor(i / smallCel));
                poker.setCard(holds[i]);
                poker.setSelect(false);
                poker.show();
                poker.setNScale(0.8);
                holdsIndex++;
            }
        }
        if(this.ndOtherHolds[sideName].length > holdsIndex){
            for(var j=holdsIndex;j<this.ndOtherHolds[sideName].length;j++){
                this.ndOtherHolds[sideName][j].hide();
            }
        }
    },

    //获取牌之间的间距
    getCardOffset:function(count){
        var offset =this.maxOffset;
        if(count>14)
        {
            offset =  (this.maxWidth -this.paiWidth)/ (count - 1);
        }else if(8<=count<=14){
            offset =  (this.maxWidth2 -this.paiWidth)/ (count - 1);
        }else{
           switch(count){
                case 7:
                    offset=this.minOffset+6;
                case 6:
                    offset=this.minOffset+12;
                case 5:
                    offset=this.minOffset+24;
                default:
                    offset=this.maxOffset;                  
           }
        }
     
        if(offset > this.maxOffset){
            offset = this.maxOffset;
        }
        else if(offset < this.minOffset){
            offset = this.minOffset;
        }
        return offset;
    },

    initTouchHandler:function() {
        this._pokerBlank.on(cc.Node.EventType.TOUCH_START, this.touchBegan, this);
        this._pokerBlank.on(cc.Node.EventType.TOUCH_MOVE, this.touchMoved, this);
        this._pokerBlank.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
    },

    touchBegan: function (event) {
        if(this.isCanTouch() == false){
            return;
        }
        var touches = event.getTouches();
        var touchLoc = touches[0].getLocation();
        this._touchBegan = touchLoc;
        // var _touchPo = this.ndHoldRoot.convertToNodeSpaceAR(touchLoc);     
        // var _touchPo2 = this.node.convertToNodeSpaceAR(touchLoc);
        // var _touchPo3 = this.node.convertToWorldSpaceAR(touchLoc);
        // var _touchPo4= this.ndHoldRoot.convertToWorldSpaceAR(touchLoc);
        this._selectPoker = null;
        if(this.ndHolds.length==0||this.ndHolds==null){
            this._touchNull = true;
        }else{
            var boxs=this.ndHoldRoot.children;
            var flag=false;
            for(var i=boxs.length-1;i>=0;i--){
                var touchPos= boxs[i].convertToNodeSpaceAR(touchLoc);
                if(this.checkOver(touchPos,boxs[i],true)==true){
                    flag=  true;
                    console.log('牌加黑111111111111111')
                    let pokerBox=boxs[i].getComponent('PDKPokerBox');
                    pokerBox.setMask(true);
                    this._selectPokerArr.push(pokerBox)
                    break;
                }       
            }
            if(!flag){
              
                this._touchNull=true;
            }
            //this.rsetSelect();
        }
        
      
    },

    touchMoved:function(event) {
        if(this.isCanTouch() == false){
            return;
        }
        // 开始点击的时候没有点中牌就不处理选中状态
        if(this._touchNull){
            return;
        }
        var touches = event.getTouches();
        var touchLoc = touches[0].getLocation();

        if(Math.abs(touchLoc.x - this._touchBegan.x) < 5 && Math.abs(touchLoc.y - this._touchBegan.y) < 5 ){
            // 5像素视为没移动
            return;
        }
        var boxs=this.ndHoldRoot.children;
        // var _touchMoved = this.ndHoldRoot.convertToNodeSpaceAR(touchLoc);
        for(var i=boxs.length-1;i>=0;i--){
            var touchPos= boxs[i].convertToNodeSpaceAR(touchLoc);

            let item=boxs[i].getComponent('PDKPokerBox');
            if(item.isOver(touchPos)) {
                //点击到了这个牌
                if(this._selectPoker != item){
                    //不是之前的牌
                  
                    if(this._selectPokerArr.length>1){
                        let idx=this._selectPokerArr.indexOf(item);
                        if(idx>=0){
                            let idx2=this._selectPokerArr.indexOf(this._selectPoker);
                            if(idx2){
                                this._selectPokerArr.splice(idx2,1);
                            }
                            if(this._selectPoker){
                                this._selectPoker.setMask(false);    
                            }                                     
                         }else{
                            this._selectPokerArr.push(item);
                            item.setMask(true);  
                         }            
                    }
                    else{
                        this._selectPokerArr.push(item);
                        item.setMask(true);  
                    }           
                }
                this._selectPoker = item;
                return;
            }

        }
      console.log('1111')
     
    },
    touchEnd:function(event){
       
        this.resetPokerMask();
        if(this.isCanTouch() == false){
            return;
        }
        var touches = event.getTouches();
        var touchLoc = touches[0].getLocation();
        var boxs=this.ndHoldRoot.children;     
        // var _touchPo = this.ndHoldRoot.convertToNodeSpaceAR(touchLoc);
        if(this._touchNull){
            this._touchNull = false;
            console.log("点击空白");
            this.rsetSelect();
            this._moveSelected = 0;
        }
        else{
            for(var i=boxs.length-1;i>=0;i--){
                var touchPos= boxs[i].convertToNodeSpaceAR(touchLoc);
                let item=boxs[i].getComponent('PDKPokerBox');
              
                
                // if(this.checkOver(touchPos,boxs[i])) {
                //     //播放点击音
                //     cc.fy.audioMgr.playSFX("pdk/poker_select.mp3");
                //     break;
                // }
              
                let idx=this._selectPokerArr.indexOf(item);
                if(idx>=0){
                    item.checkOver(this.rotateRadius,item.getRota(),this.offsetPai);  
                }
            }
            if(this._selectPokerArr.length>0){
                cc.fy.audioMgr.playSFX("pdk/poker_select.mp3");               
            }
            this._selectPokerArr=[];
            this._moveSelected++;
            // 只对第一次滑动的牌进行滑牌处理
            if (this._moveSelected == 1) {
                this.checkSelectCards();
            }
        }
        this.setChupai();
    },
    resetPokerMask(){
        for(var i = 0; i < this.ndHolds.length; i++){       
            var pokerBox = this.ndHolds[i];
            pokerBox.setMask(false);
        }

    },
    //是否可触摸选牌
    isCanTouch:function(){
        if(cc.fy.replayMgr.isReplay() || this._isRunning==true){
            return false;
        }
        return true;
    },

    //控制出牌按钮
    setChupai:function(){
        var canChuPai=false;
        for(var i = this.ndHolds.length - 1; i >= 0; i--){
            if(this.ndHolds[i].isShow() && this.ndHolds[i].isSelect()){
                canChuPai=true;
                break;
            }
        }
        var chupai =cc.find("game/ops/btnPlayCard",this.node); 
        if(chupai){
            chupai.getComponent(cc.Button).interactable=canChuPai;
        }
        var btntip =cc.find("game/ops/btnTip",this.node); 
        if(btntip){
            btntip.interactable=true;
        }
    },
    //
    checkOverMask:function(touchPos,box){
        console.log("checkOver")
        let item=box.getComponent('PDKPokerBox');
        if(item.isOver(touchPos)) {
            
            if(this._selectPoker != item){
                let idx=this._selectPokerArr.indexOf(item);
                 if(idx>=0){
                    this._selectPokerArr.splice(idx,1);
                 }else{
                    this._selectPokerArr.push(item);
                 }          
            }
            this._selectPoker = item;
            return true;
        }
        return false
    },
    //选牌
    checkOver:function(touchPos,box, uns){
        console.log("checkOver")
        let item=box.getComponent('PDKPokerBox');
        if(item.isOver(touchPos)) {
            if(uns){
                return true;
            }
            if(this._selectPoker != item){
                console.log("selectcard ==========================");
                item.checkOver(this.rotateRadius,item.getRota(),this.offsetPai);                  
            }
            this._selectPoker = item;
            return true;
        }
        console.log("mei dian zhong ------------")
        // for(var i = this.ndHolds.length - 1; i >= 0; i--){
        //     if(this.ndHolds[i].isOver(touchPos)){
        //         // 只需要判断是否点击到牌，不需要操作牌
        //         if(uns){
        //             return true;
        //         }
        //         if(this._selectPoker != this.ndHolds[i]){
                   
        //             this.ndHolds[i].checkOver(this.rotateRadius,this.ndHolds[i].getRota(),this.offsetPai);                  
        //         }
        //         this._selectPoker = this.ndHolds[i];
        //         return true;
        //     }
        // }
        return false;
    },

    //重置选中牌
    rsetSelect:function(){
        if(this._isRunning){
            return;
        }
        this._selectPoker = null;
        var hand=cc.fy.pdkGameNetMgr.holds;
        console.log("hand:"+hand);
        if(hand==null || hand.length==0){
            return;
        }
       
        for(var i = this.ndHolds.length - 1; i >= 0; i--){
            var item=this.ndHolds[i];
            if(!item.isShow()){
                continue;
            }        		
           // for(let j=0;j<hand.length;j++){
                //if(hand[j]==item.getNCard()){                       
            item.setSelect(false);    
            console.log('rsetSelectzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz')            
            item.setPosition(this.rotateRadius);
               // }
          //  }
        }        
        this.setChupai();
    },

    //获得选中的牌
    getSelectCards:function(){
        var selCards = [];
        // 遍历 选中的牌
        for(var i = this.ndHolds.length - 1; i >= 0; i--){
            if(this.ndHolds[i].isSelect()){
                selCards.push(this.ndHolds[i].getNCard());
            }
        }
        return selCards;
    },

      // 滑动选牌 顺子->连对 
    checkSelectCards:function(){
        var lastCards = cc.fy.pdkGameNetMgr.lastPlayedCards;
        // console.log("==>lastCards:",lastCards);
        // if ( lastCards != null && lastCards.length != 0) {
        //     return;
        // }
        let selCards = this.getSelectCards();
        if (selCards == null || selCards.length < 4) {
            // this.rsetSelect();
           // this.setMovedCards(selCards);
            //return;
        }

        let selCount = selCards.length;

        let countCards = PokerUtil.countCardsByKey(selCards);
        // let key = PokerUtil.getKey(selCards[0])
        // console.log("===>selectCount: ", selCount);
        // console.log("===>selectcard: ", countCards);
        let cardType = cc.fy.PDKGameMgr.getPokerType(selCards);
        // console.log("===>selectcardcardType: ", cardType);
        if (cardType.type != PokerDef.PokerType.INVALID) {       // 一次滑动的牌是有效牌型则不处理
            return;
        }

        if (selCount == 4) {     // 4张牌只能组成连对，判断是否连对即可
            if (cardType.type != PokerDef.PokerType.STRAIGHT_2) {        // 不是连对重置选择牌
                console.log("4张牌不是连对，手牌重新整理")
               // this.rsetSelect();
            }
        }
        // 大于四张  飞机-》连对-》顺子 判断是否能组成顺子或者连对
        else{
            // 判断是否可以组成顺子 顺子最低5张牌
            //let cards = cc.fy.PDKGameMgr.getCardListByType(cc.fy.pdkGameNetMgr.holds, PokerDef.PokerType.BOMB4, cc.fy.gameNetMgr.conf.wanfa);           
            // console.log('11111111111111111111');

            // console.log(cards);
           
            // if (cards.length > 0){
            //     for (let index = 0; index < cards.length; index++) {
            //         for (let i = 0; i < cards[index].length;i++){
            //             selCards.splice(selCards.indexOf(cards[index][i]), 1);
            //         }
            //     }
            // }
            var cards = cc.fy.PDKGameMgr.getMinCardByType(selCards, PokerDef.PokerType.AIRPLANE);
            console.log("===> 飞机",cards);
            
            
            if(cards==null){    // 连对没找到 开始找顺子
                cards = cc.fy.PDKGameMgr.getMinCardByType(selCards, PokerDef.PokerType.STRAIGHT);
                console.log("===> 顺子: ", cards);
            }
            if(cards == null){      // 飞机没找到 开始找连对
                cards = cc.fy.PDKGameMgr.getMinCardByType(selCards, PokerDef.PokerType.STRAIGHT_2);
                console.log("===> 连对: ", cards);
			}
           
            
            
			
			console.log("====>cards: ", cards);
			if(cards != null){
				this.setMovedCards(cards);
			}
			else{
                console.log("不成牌型");
				//this.rsetSelect();
			}

        }

    },
     // 滑动选择的牌，未选中的还原到原处
    setMovedCards:function(cards){        
        if(cards == null){
            return;
        }
        for(var j = this.ndHolds.length - 1; j >= 0; j--){
            var item=this.ndHolds[j];
            if(!item.isShow() ){
                continue;
            }         
            console.log(item);
            for(var i = 0; i < cards.length; i++){
                if (item.getNCard() == cards[i]) {
                    if (item.getPokerX() ==item.pokerX(this.rotateRadius)&&item.getPokerY() ==item.pokerY(this.rotateRadius)) {
                        item.setSelect(true);   
                        console.log('setMovedCardszzzzzzzzzzzzzzzzzzzzzzzzzzzzzz')                
                        item.setPosition(this.rotateRadius+this.offsetPai);
                    }
                    break;
                }
                else{
                    item.setSelect(false);  
                    console.log('setMovedCardsxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')                
                    item.setPosition(this.rotateRadius);
                }
            }
        }
    },

     //获得出牌的位置
    getPosition:function(seatIndex, count,index){
        var po = {x:-40,y:344};
        if(this._gameplayer == 3)
        {
            if(seatIndex == 0){  
                po = {x:-40,y:344};
            }
            else if(seatIndex == 1){  //right
                po = {x:-440,y:42};
            }
            else{                      //left
                 po = {x:451,y:42};
            }
        }
        else
        {
            if(seatIndex==0){
                po = {x:-40,y:344};
            }else{
                po = {x:-333,y:-148};
            }
            
        }
        var mid=(count-1)/2;
        
        po.x = po.x-(count - 1) * 30 * 0.5+30*index;
        po.y = po.y+FoldY[parseInt(Math.abs(index-mid))];
        // // 自己和上方
        // if(seatIndex == 0 || seatIndex == 2){
        //     po = -(count - 1) * this.offset * 0.5;
        // }
        // else if(seatIndex == 1){
        //     po = -(count - 1) * this.offset;
        // }

        return po;
    },

    //手牌出牌动画
  /*  cardAction:function(card,p,rotation,isEnd,seat){
        var self =this;
        var action1=null;
        if(seat==0){
            var tempx=p.x-card.x;
            var tempy=p.y-card.y;
            action1=cc.sequence(
                cc.spawn(cc.moveBy(0.2,0,tempy),cc.rotateTo(0.2,rotation)),
                cc.spawn(cc.moveBy(0.2,tempx,0),cc.scaleTo(0.2,0.55,0.55))
            );
        }else if(seat==1 && this._gameplayer==3){//right
            card.setRotation(-90);
            action1=cc.spawn(cc.moveTo(0.4,p.x,p.y),cc.rotateTo(0.4,rotation));
            console.log("right:",p);
        }else if(seat ==1 && this._gameplayer==2){//up
            console.log("up:",p);
            card.setRotation(180);
            action1=cc.spawn(cc.moveTo(0.4,p.x,p.y),cc.rotateTo(0.4,rotation));
        }else{//left
            console.log("left:",p);
            card.setRotation(90);
            action1=cc.spawn(cc.moveTo(0.4,p.x,p.y),cc.rotateTo(0.4,rotation));
        }
        if(action1!=null){
            card.runAction(cc.sequence(
                action1,
                cc.delayTime(0.1),
                cc.callFunc(function(){
                    if(isEnd){//手牌都上去了，该整理手牌，通知folds显示。
                        cc.fy.gameNetMgr.dispatchEvent("show_folds",{localIndex:seat});
                        if(seat==0){
                            self._isRunning=false;
                            self.hideSelfHolds();
                            self.initHands();
                        }else{
                            self.hideAllHolds();
                            self.initOtherHolds();
                            //card.active=false;
                        }
                        
                    }
                }),
            ));
        }
         
    },
    */
    //出牌处理
    doPlayCards:function(data){
        if(data.playedCards == null || data.playedCards.length == 0){
            return ;
        }
        var len=data.playedCards.length;
        var localIndex=cc.fy.gameNetMgr.getLocalIndex(data.seatIndex);

        if(localIndex==0){
           this._isRunning=false;
           this.hideSelfHolds();
           this.initHands();
        }else{
            this.hideAllHolds();
            this.initOtherHolds();
            //card.active=false;
        }
      /*  return;
        var count=0;
        var startRotation=HoldDegree[len].start;
        var offRotation =HoldDegree[len].dis;
        if(data.seatIndex == cc.fy.gameNetMgr.seatIndex){//自己
            this._isRunning=true;
            for(let i=0;i<this.ndHolds.length;i++){
                if(!this.ndHolds[i].isShow()){
                    continue;
                }
                for(let j=0;j<len;j++){
                    if(data.playedCards[j]==this.ndHolds[i].nCard){
                        console.log("ncard:"+this.ndHolds[i].nCard+"    i:"+i);
                        var po=this.getPosition(localIndex,len,count);
                        var _rotation=(startRotation+offRotation*count)/2;
                        count++;
                        var isEnd = len==count;
                        this.cardAction(this.ndHolds[i].node,po,_rotation,isEnd,localIndex);
                        break;
                    }
                }
            }
           
        }
        else{ //其他人
            var hands = cc.fy.pdkGameNetMgr.hands[data.seatIndex];
            var sideName = cc.fy.pdkGameNetMgr.getSideByLocalIndex(localIndex);
            var holdRoot=this.ndOtherHoldRoot[sideName] ;
            console.log("sidename:"+sideName);
            if(hands==null || hands.length==0){//没有手牌
                var prefab = cc.fy.PDKGameMgr.getFoldsPokerPrefab();
                var pokers =holdRoot.children;
                for(let i=0;i<len;i++){
                    var ndpoker = pokers[i];
                    if(ndpoker==null){
                        ndpoker =cc.instantiate(prefab);
                        holdRoot.addChild(ndpoker);
                    }
                    var poker = ndpoker.getComponent("PDKPoker");
                    poker.show();
                    poker.setCard(data.playedCards[i]);
                    poker.setNScale(1);
                    if(localIndex==1 && this._gameplayer==2){//up
                        poker.setX(100);
                        poker.setY(200);
                        console.log("setposition up ");
                    }else if(localIndex==1 && this._gameplayer==3){//right
                        poker.setX(300);
                        poker.setY(0);   
                        console.log("setposition right ");
                    }else{                         //left
                        poker.setX(-300);
                        poker.setY(0);
                        console.log("setposition left ");
                    }
                    var po =this.getPosition(localIndex,len,count);
                    var _rotation=(startRotation+offRotation*count)/2;
                    count++;
                    var isEnd = len==count;
                    this.cardAction(ndpoker,po,_rotation,isEnd,localIndex);
                }
            }else{ //有手牌，回放的。
                this.initOtherHolds();
            }
        }
        */
    },
    

    //不出
    buChu: function(){
        this.rsetSelect();
        this.sendPlayCards([]);
    },

    //提示
    showBigerTip: function(){
        if(this.isCanTouch() == false){
            return;
        }
       
        var handCards = cc.fy.pdkGameNetMgr.holds;
        console.log("点击提示，先理牌");
        this.rsetSelect();
        if(this._tipList == null){
            var lastCards = cc.fy.pdkGameNetMgr.lastPlayedCards;
            this._tipList = cc.fy.PDKGameMgr.getBiggerTips(lastCards,handCards);
            console.log("提示牌组：",this._tipList[0]);
        }

        if(this._tipList == null || this._tipList.length == 0){
            this.buChu();
            return;
        }
        this._moveSelected ++;
        var countCards = PokerUtil.countCardsByKey(handCards);
        console.log("contcards:",countCards);
        
        this._tipList = cc.fy.PDKGameMgr.checkSpecialBomb(this._tipList, countCards,cc.fy.gameNetMgr.conf)

        console.log("sepcialbomb:",this._tipList);

             // 提示牌型排序 最小的在前面
        this._tipList.sort(function(a, b){
            // 检查炸弹牌型
            if (cc.fy.PDKGameMgr.IsBomb(a) == true && cc.fy.PDKGameMgr.IsBomb(b) == false) {
                return 1;
            }
            else if (cc.fy.PDKGameMgr.IsBomb(a) == false && cc.fy.PDKGameMgr.IsBomb(b) == true) {
                return -1;
            }
            else if (cc.fy.PDKGameMgr.IsBomb(a) == true && cc.fy.PDKGameMgr.IsBomb(b) == true) {
                if (a.length != b.length) {
                    return cc.fy.PDKGameMgr.getWeight(a[0]) - cc.fy.PDKGameMgr.getWeight(b[0]);
                }
            }
           
            // console.log("tipListsort ")
            
            let aVal = 0;
            let bVal = 0;
            let aKey = 0;
            let bKey = 0;

            for (let i = 0; i < a.length; i++) {
                aVal = cc.fy.PDKGameMgr.getWeight(a[i]);
                bVal = cc.fy.PDKGameMgr.getWeight(b[i]);
                aKey = PokerUtil.getKey(a[i]);
                bKey = PokerUtil.getKey(b[i]);

                // 检查出不同的牌  用于排序
                if (aVal != bVal) {
                    break;
                }
            }
           
            // 判断拆牌数量 数量少的排在前面   单张->对子->三张
            if (countCards[aKey] > countCards[bKey]) {
                return 1;
            }
            else if (countCards[aKey] < countCards[bKey]) {
                return -1;
            }
            // console.log("a==>", aVal);
            // console.log("b==>", bVal);
            // console.log("b==>a", aVal - bVal);
            // 提示中小牌 排在前面
            return aVal - bVal;

        });

        // console.log("this._tipIndex = " + this._tipIndex);
        // console.log(this._tipList[this._tipIndex]);
        if(lastCards !=null &&lastCards.length>0 &&this._tipList.length>1 ){
           // cc.fy.hintBox.show("仅一手牌大过上家！");  

        }
        

        this.setSelectCards(this._tipList[this._tipIndex]);
        this._tipIndex++;
        if(this._tipIndex >= this._tipList.length){
            this._tipIndex = 0;
        }
        this.setChupai();
    },

    //检查只有一手牌可出
    checkOnlyOne:function(){
        console.log("check only one");
        console.log(cc.fy.pdkGameNetMgr.lastPlayedCards)
        var handCards = cc.fy.pdkGameNetMgr.holds;
        if(cc.fy.replayMgr.isReplay()){
            return;
        }
        if(handCards==null || handCards.length==0 || cc.fy.pdkGameNetMgr.turn != cc.fy.gameNetMgr.seatIndex){
            this.setChupai();
            return ;
        }
        
        if(cc.fy.pdkGameNetMgr.lastPlayedCards!=null && cc.fy.pdkGameNetMgr.lastPlayedCards.length>0){          
            this._tipList=null;
            if(this._tipList == null){
                var lastCards = cc.fy.pdkGameNetMgr.lastPlayedCards;
                this._tipList = cc.fy.PDKGameMgr.getBiggerTips(lastCards,handCards);
            }
            if(this._tipList == null || this._tipList.length == 0){
                this.setChupai();
                return ;
            }

            if(this._tipList.length ==1){
                this.rsetSelect();
                this._tipIndex=0;
                this.setSelectCards(this._tipList[this._tipIndex]);
            }else{
                this._tipList=null;
            }        
        }else{//如果是最后一手牌
            if(cc.fy.PDKGameMgr.checkOnlyOne(handCards)){
                this.rsetSelect();
                this.setSelectCards(handCards);
            }
        }     
        this.setChupai();
    },

    //设置选中的牌
    setSelectCards:function(cards){
        if(cards == null){
            return;
        }
        console.log("setSelectCards",cards)
        for(var i = 0; i < cards.length; i++){
            for(var j = this.ndHolds.length - 1; j >= 0; j--){              
                var item=this.ndHolds[j];
                if(item.isShow() && item.getNCard() == cards[i]){
                    item.setSelect(true);
                    console.log('setSelectCardsxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')    
                    item.setPosition(this.rotateRadius+this.offsetPai);
                    break;
                }
            }
        }
    },

    //出牌
    playCard: function(){
        if(this._limitTouch==true){
            return;
        }
        this._limitTouch=true;
        setTimeout(function(){
            this._limitTouch=false;
        }.bind(this),500);


        var selCards = this.getSelectCards();
        var pdkMgr = cc.fy.pdkGameNetMgr;

        if(cc.fy.gameNetMgr.conf.wanfa.indexOf(7) >= 0){
            if(!cc.fy.gameNetMgr.conf.wanfa.indexOf(0) >= 0){
                if(cc.fy.gameNetMgr.conf.wanfa.indexOf(1) >= 0 && cc.fy.pdkGameNetMgr.holds.indexOf(410) >= 0 && !(selCards.indexOf(410) >= 0)){
                    this.rsetSelect();
                    console.log("黑桃三 不能出")
                    this.alert("你的选牌不符合规则");
                    return;
                }
                else if(cc.fy.gameNetMgr.conf.wanfa.indexOf(2) >= 0 && cc.fy.pdkGameNetMgr.holds.indexOf(280) >= 0 && !(selCards.indexOf(280) >= 0)){
                    this.rsetSelect();
                    console.log("红桃三 不能出")
                    this.alert("你的选牌不符合规则");
                    return;
                }
            }
        }     
        
        if(selCards.length > 0){
            

            if(selCards.length == 1){
                if(pdkMgr.leftNums[pdkMgr.getNextSeat(pdkMgr.turn)] == 1){
                    var poker = PokerUtil.getPoint(cc.fy.pdkGameNetMgr.holds[0]);
                    if(PokerUtil.getPoint(selCards[0]) != poker){
                        this.alert("下家报单，请出最大的单张！");
                        return;
                    }
                }
            }

            var lastCards = cc.fy.pdkGameNetMgr.lastPlayedCards, result;
            
            if(lastCards != null && lastCards.length > 0){
                console.log("检查选择的牌是否大过上家出的牌")
                result = cc.fy.PDKGameMgr.checkCanOutCard(lastCards, selCards)
            }
            else{
                result = cc.fy.PDKGameMgr.checkValidType(selCards);
            }

            // if(cc.GDConfig.limitePlayCard==false){
            //     result.ret=0;
            // }
               
           // result.ret = 0; // 打开可以随便出牌  cc.GDConfig.limitePlayCard == false || 
            if(result.ret == 0 ||cc.GDConfig.limitePlayCard == false){
                this.sendPlayCards(selCards);
            }
            else{
                this.rsetSelect();
                console.log("规则不对",result)
                this.alert(result.hint);
            }
        }
       
    },

    checkThree: function(cards){
        var value,
            i,
            num = 0;

        for(i = 0; i < cards.length; i++){
            value = cc.fy.PDKGameMgr.getValue(cards[i]);
            if(value == PokerValue.DIAMOND_3){
                num ++;
            }
            if(value == PokerValue.CLUB_3){
                num ++;
            }
            if(value == PokerValue.HEART_3){
                num ++;
            }
            if(value == PokerValue.SPADE_3){
                num ++;
            }
        }

        return num >= 3;
    },

    sendPlayCards: function(cards){
        this._tipIndex = 0; // 提示数据重置
        this._tipList = null;
        cc.fy.net.send('pdk_cts_playcard',{"cards":cards,"actionId":cc.fy.pdkGameNetMgr.actionId});
        cc.fy.PDKGameMgr.printCards(cards, " pdk_cts_playcard ");
    },

});
