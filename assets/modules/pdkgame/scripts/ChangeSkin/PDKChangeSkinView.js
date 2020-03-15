var GameMsgDef = require("GameMsgDef");
cc.Class({
    extends: require("BaseModuleView"),

    properties: {
        skin:cc.Sprite,
        btn_choose:cc.Button,
       _zhuobuBg:null,//房间桌布
       _bgTitle:null,//当前桌布标题
       _chooseNum:null,//当前索引
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
        
        game.addHandler(GameMsgDef.ID_SHOWCHANGESKIN_CTC, function(data){
            if(data.isShow == false){
                console.log("hide")
                self.hidePanel();
            }
            else{
                self.showPanel(data);
            }
        });
    },

    showPanel:function(data){
        this.node.active = true;
    },

    hidePanel:function(){
        this.node.active = false;
    },
    initView:function(){
        // 作为弹框模式 不隐藏其它弹框
        this.setHideOther(false);
        this._zhuobuBg = cc.find("Canvas/bg/zhuobuBg");
        this._bgTitle= cc.find("Canvas/bg/bgTitle");
        // 背景显示类型按钮设置
        this.refreshBG();
    },
    refreshBG:function(){
        var temp = cc.fy.localStorage.getItem("bgtype");
       
        this.btn_choose.interactable=false;
        if(temp != null){
            this._chooseNum=Number(temp);
            var url="images/pdk/bg"+this._chooseNum;    
            cc.fy.resMgr.setSpriteFrameByUrl(url,this.skin);  
        }
        else{ 
            this._chooseNum=1;
            cc.fy.resMgr.setSpriteFrameByUrl("images/pdk/bg1",this.skin);
        }
    },
    onBtnBGTypeBefore:function(event){
        if(this._chooseNum>1){
            this._chooseNum--;
        }else{
            this._chooseNum=4;
        }
        var url="images/pdk/bg"+this._chooseNum;    
        cc.fy.resMgr.setSpriteFrameByUrl(url,this.skin);  
        var temp = cc.fy.localStorage.getItem("bgtype");
        if(temp==this._chooseNum){
            this.btn_choose.interactable=false;
        }else{
            this.btn_choose.interactable=true;
        }
    },
    onBtnBGTypeAfter:function(event){
        if(this._chooseNum<4){
            this._chooseNum++;
        }else{
            this._chooseNum=1;
        }
        var url="images/pdk/bg"+this._chooseNum;    
        cc.fy.resMgr.setSpriteFrameByUrl(url,this.skin); 
        var temp = cc.fy.localStorage.getItem("bgtype");
        if(temp==this._chooseNum){
           this.btn_choose.interactable=false;
        }else{
           this.btn_choose.interactable=true;
        }
    },

    onBtnBGTypeClickEvent:function(event){
        cc.fy.resMgr.setSpriteFrameByUrl("images/pdk/bg"+this._chooseNum,this.skin);
        this.btn_choose.interactable=false;
        cc.fy.resMgr.setSpriteFrameByUrl("images/pdk/bg"+this._chooseNum,this._zhuobuBg.getComponent(cc.Sprite));
        cc.fy.resMgr.setSpriteFrameByUrl("images/pdk/bg_title"+this._chooseNum,this._bgTitle.getComponent(cc.Sprite));    
        cc.fy.localStorage.setItem("bgtype",this._chooseNum);
    },
   
    onBtnClose: function (event) {
        this.node.active = false;
        this.refreshBG();
    },

     
});
