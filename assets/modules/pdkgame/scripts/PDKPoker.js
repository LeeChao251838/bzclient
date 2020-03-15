var PDKPokerDef = require("PDKPokerDef");

cc.Class({
    extends: cc.Component,

    properties: {
        //节点或组件
        _pdkPoint: null,       //牌点数
        _pdkSuit1: null,       //牌上边花色
        _pdkSuit2: null,       //牌中间花色
        _pdkMask: null,        //牌阴影
        _cardback:null,        //牌背


        //变量值
        nCard:-1,              //牌
        nValue:-1,             //牌值
        nSuit:-1,              //牌花色
        nPoint:-1,             //牌点数
        pokerType:0,           //牌摆放类型

        _scale:1,              //缩放的比例

        _isSelect:false,       //是否选中

        _isTouched:false,      //是否点击

    },

    onLoad: function () {
        this.initPokerNode();
    },

    //初始化牌节点
    initPokerNode: function(){
        var npoint = this.node.getChildByName("point");
        var nsuit1 = this.node.getChildByName("suit1");
        var nsuit2 = this.node.getChildByName("suit2");
        
        if(nsuit1){
            this._pdkPoint = npoint.getComponent(cc.Sprite);
        }
        if(npoint){
            this._pdkSuit1 = nsuit1.getComponent(cc.Sprite);
        }
        if(nsuit2){
            this._pdkSuit2 = nsuit2.getComponent(cc.Sprite);
        }
        this._cardback =this.node.getChildByName("pback");

    },
    //牌阴影
    setMask(result){
         if(result){            
            for (var i = 0; i < this.node.childrenCount; i++) {
                let newNode = this.node.children[i];
                newNode.color=new cc.Color(255/2,255/2,255/2,255);
            }
         }else{
            for (var i = 0; i < this.node.childrenCount; i++) {
                let newNode = this.node.children[i];
                newNode.color=new cc.Color(255,255,255,255);
            }
         }
    },

    //设置牌
    setCard:function(nCard, pType){
        this.nCard = nCard;
        this.nValue = cc.fy.PDKGameMgr.getValue(nCard);
        this.nSuit = cc.fy.PDKGameMgr.getSuit(nCard);
        this.nPoint = cc.fy.PDKGameMgr.getPoint(nCard);
        if(pType != null){
            this.pokerType = pType;
        }

        if(this._pdkPoint){
            this._pdkPoint.spriteFrame = cc.fy.PDKGameMgr.getPointSprite(nCard, pType);
        }
        if(this._pdkSuit1){
            this._pdkSuit1.spriteFrame = cc.fy.PDKGameMgr.getSuitSprite(nCard, 1);
           
        }
        if(this._pdkSuit2){
            
            this._pdkSuit2.spriteFrame = cc.fy.PDKGameMgr.getSuitSprite(nCard, 2);
        }
        if(this._cardback){
             this._cardback.active=false;
        }   
       
    },
    //背面朝上
    showBack:function(){
        if(this._cardback){
            console.log("showback");
            this.node.active=true;
            this._cardback.active=true;
        }
    },

    //隐藏
    hide: function(){
        this.node.active = false;
    },

    //翻牌动画
    fanpai:function(daleyTime){
        if(this._cardback){
            this.node.runAction(cc.sequence(
                cc.delayTime(daleyTime),
                cc.scaleTo(0.1,0.1,1),
                cc.callFunc(function(){
                    this.show();
                }.bind(this)),
                cc.scaleTo(0.1,1,1),
            ));
        }else{
            this.show();
            this.setNScale(1);
        }
        
    },

    //显示
    show: function(){
        this.node.active = true;
        if(this._cardback){
            this._cardback.active=false;
        }
    },
     
    //设置旋转角度
    setNRotation:function(value){
        this.node.rotation = value;
    },
    //设置X坐标
    setX: function(x){
        this.node.x = x;
    },

    
    //
    setNScale: function(nScale){
        // var size={x:191,y:260};
        // if(this.pokerType==2){
        //     size={x:104,y:144};
        // }
        this._scale=nScale;
        this.node.scale=nScale;
        // this.node.width=nScale*size.x;
        // this.node.height=nScale*size.y;
        console.log("setScale:"+nScale,this.node.scale);
    },

    //设置Y坐标
    setY: function(y){
        this.node.y = y;
    },

    //获得Y坐标
    getY: function(){
        return this.node.y;
    },

    //切换选中状态
    setToggle:function(){
        this.setSelect(!this._isSelect);
    },

    //设置选中状态
    setSelect: function(state){
        console.log("setselect:"+state);
        this._isSelect = state;
      
    },

    // 是否选中
    isSelect:function(){
        if(this.node.active == false){
            return false;
        }
        return this._isSelect;
    },

    //选牌是否结束
    isOver:function(touchPos){
        if(this.node.active == false){
            return;
        }
       
        var box = this.node.getBoundingBox();
        // var box = this.node.getBoundingBoxToWorld();
        
        console.log(box,touchPos);
        
        if(cc.rectContainsPoint(box, touchPos)){
            return true;
        }
        return false;
    },

    //是否显示
    isShow:function(){
        return this.node.active;
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
