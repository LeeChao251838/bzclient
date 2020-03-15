var GameMsgDef = require("GameMsgDef");
cc.Class({
    extends: require("BaseModuleView"),

    properties: {
        _healthnotice:null,
        _adultctrl:null,
        _btn_close:null,
        _btn_bg:null,
    },

    onLoad(){
        this.initEventHandlers();
        this.initView();
    },

    initEventHandlers(){
        var self = this;
        var game = cc.fy.gameNetMgr;
        
        game.addHandler(GameMsgDef.ID_SHOWHEALTHVIEW_CTC, function(data){
            if(data.isShow == false){
                self.close();
            }
            else{
                console.log("ID_SHOWHEALTHVIEW_CTC ---- ");
                self.show(data);
            }
        });
    },

    initView(){
        this._healthnotice = this.node.getChildByName("healthnotice");
        this._adultctrl = this.node.getChildByName("adultctrl");    
    },

    // 显示健康提示
    show(data){
        this.node.active = true;
        if(data.type == 0){
            this._healthnotice.active = true;
            this._adultctrl.active = false;
        }
        else{
            this._healthnotice.active = false;
            this._adultctrl.active = true;
        }
    },

    // 隐藏提示或者监控
    close(){
        this._healthnotice.active = false;
        this._adultctrl.active = false;
        this.node.active = false;
    },
});
