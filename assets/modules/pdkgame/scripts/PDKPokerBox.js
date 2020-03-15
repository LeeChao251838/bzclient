var PDKPokerDef = require("PDKPokerDef");

cc.Class({
    extends: cc.Component,

    properties: {
        //节点或组件
        _rota:-90,
        poker:cc.Node,
    },

    onLoad: function () {
       // this.pokerS=this.poker.getComponent('PDKPoker');
    },

   

    //设置角度
    setRota:function(x){
        this.node.rotation=x;
    },
    setBoxY(r){
        this.node.y=0-r;
    },
    getRota:function(){
        return  this.node.rotation+90;
    },
    setCard:function(r,rota,card){
        var poker=this.poker.getComponent('PDKPoker');
        this.setRota(rota-90);
        this.setBoxY(r);
        poker.setCard(card);
        poker.setSelect(false);
        poker.show();
        poker.setNRotation(90);
        poker.setX(r);
        poker.setY(0);
        poker.setNScale(1);
    },

    //发牌动作
    DealCards(r,rota,index){
        console.log("发牌",r,rota,index);
        var poker=this.poker.getComponent('PDKPoker');
        this.setRota(-90); 
        poker.showBack();
        poker.setSelect(false);
        poker.setNRotation(90);
        poker.setX(r+300);
        poker.setY(0);
        poker.setNScale(1);
        
        this.poker.runAction(cc.sequence(
            cc.delayTime(index*0.06),
            cc.moveTo(0.06,r,0),
        ));
        this.node.runAction(cc.sequence(
            cc.delayTime(index*0.06),
            cc.rotateTo(0.06,rota-90)
        ));
    },

    //翻牌动作
    FanPai(delayTime){
        var poker=this.poker.getComponent('PDKPoker');
        poker.showBack();
        poker.fanpai(delayTime);
    },

    hide(){
        var poker=this.poker.getComponent('PDKPoker');
        poker.hide();
    },
    isShow(){
        var poker=this.poker.getComponent('PDKPoker');
        return poker.isShow();
    },
    isSelect(){
        var poker=this.poker.getComponent('PDKPoker');
        return  poker.isSelect();
    },
    isOver(touchPos){
        var poker=this.poker.getComponent('PDKPoker');
        return   poker.isOver(touchPos);
    },
    checkOver(r,rota,offset){
        var poker=this.poker.getComponent('PDKPoker');
        poker.setToggle();
        if(poker.isSelect()){
            // poker.setX(this.pokerX(r+offset,rota));
            // poker.setY(this.pokerY(r+offset,rota));
            poker.setX(r+offset);
        }
        else{
            // poker.setX(this.pokerX(r,rota));
            // poker.setY(this.pokerY(r,rota));
            poker.setX(r);
        }
    },
    pokerX(r){    
        return r;
    },
    pokerY(r){    
        return 0;
    },
    getPokerX(){
        return this.poker.x;
    },
    getPokerY(){
        return this.poker.y;
    },

    setSelect(bol){
        var poker=this.poker.getComponent('PDKPoker');
        poker.setSelect(bol);
    },
    setPosition(r){
        var poker=this.poker.getComponent('PDKPoker');
        poker.setX(r); 
    },
    getNCard(){
        var poker=this.poker.getComponent('PDKPoker');
        return poker.nCard;
    },
    setNScale(nScale){
        var poker=this.poker.getComponent('PDKPoker');
        poker.setNScale(nScale);
    },
    setMask(s){
        var poker=this.poker.getComponent('PDKPoker');
        poker.setMask(s);
    }
});
