cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        target:cc.Node,
        sprite:cc.SpriteFrame,
        checkedSprite:cc.SpriteFrame,
        checked:false,
        groupId:-1,
    },

    // use this for initialization
    onLoad: function () {
        if(cc.fy == null){
            return;
        }
        if(cc.fy.radiogroupmgr == null){
            var RadioGroupMgr = require("RadioGroupMgr");
            cc.fy.radiogroupmgr = new RadioGroupMgr();
            cc.fy.radiogroupmgr.init();
        }
        // console.log(typeof(cc.fy.radiogroupmgr.add));
        cc.fy.radiogroupmgr.add(this);

        this.refresh();
    },
    
    refresh:function(){
        var targetSprite = this.target.getComponent(cc.Sprite);
        if(this.checked){
            targetSprite.spriteFrame = this.checkedSprite;
        }
        else{
            targetSprite.spriteFrame = this.sprite;
        }
    },
    
    check:function(value){
        this.checked = value;
        this.refresh();
    },
    
    onClicked:function(){
        cc.fy.radiogroupmgr.check(this);
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
    },
    onClickedAs:function(event,data){
        this.checked = !this.checked
        if(this.checked){
            event.target.x = 74
        }else{
            event.target.x = 50
        }
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.refresh();
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    
    onDestroy:function(){
        if(cc.fy && cc.fy.radiogroupmgr){
            cc.fy.radiogroupmgr.del(this);            
        }
    }
});
