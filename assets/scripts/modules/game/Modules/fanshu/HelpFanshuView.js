var GameMsgDef = require("GameMsgDef");
cc.Class({
    extends: require("BaseModuleView"),

    properties: {
       
        _btnVissal: null,
        _pageView: null,

      
     
    },

    onLoad: function () {
        this.initView();
        this.initEventHandlers();
    },

    start: function () {

    },

    initEventHandlers: function () {
        var self = this;
        var game = cc.fy.gameNetMgr;

        game.addHandler(GameMsgDef.ID_SHOWHELPFANSHUVIEW_CTC, function (data) {
            if (data.isShow == false) {
                self.hidePanel();
            }
            else {
                self.showPanel(data);
            }
        });


    },

    initView: function () {
        // 作为弹框模式 不隐藏其它弹框
        this.setHideOther(false);

        var scrollView = this.node.getChildByName("btnVissal");
        var view = scrollView.getChildByName("view");
        this._btnVissal = view.getChildByName("content");
        this._pageView = this.node.getChildByName("pageview");
        for(var i = 0; i < this._btnVissal.childrenCount; ++i){
            var roadioButton = this._btnVissal.children[i];
            var buttonName = roadioButton.name;
            var btn = roadioButton.getChildByName(buttonName);
            cc.fy.utils.addClickEvent(btn,this.node,"HelpFanshuView","onBtnTypeChooseClickEvent");
        }
  
    },

    showPanel: function (data) {
        this.node.active = true; 
    },

    hidePanel: function () {
        this.node.active = false;
    },

    onBtnTypeChooseClickEvent:function(event){
        if(event.target.name == "88"){
            this.setPageViewPageIndex(0);
        }
        else if(event.target.name == "64"){
            this.setPageViewPageIndex(1)
        }
        else if(event.target.name == "48"){
            this.setPageViewPageIndex(2)
        }
        else if(event.target.name == "32"){
            this.setPageViewPageIndex(3);
        }
        else if(event.target.name == "24"){
            this.setPageViewPageIndex(4)
        }
        else if(event.target.name == "16"){
            this.setPageViewPageIndex(5);
        }
        else if(event.target.name == "12"){
            this.setPageViewPageIndex(6);
        }
        else if(event.target.name == "8"){
            this.setPageViewPageIndex(7);
        }
        else if(event.target.name == "6"){
            this.setPageViewPageIndex(8);
        }
        else if(event.target.name == "other"){
            this.setPageViewPageIndex(9);
        }
    },

    setPageViewPageIndex:function(index){
        var pageview = this._pageView.getComponent(cc.PageView);
        pageview.setCurrentPageIndex(index);
    },

    onBtnClose(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.node.active = false;
    },
   
   
});
