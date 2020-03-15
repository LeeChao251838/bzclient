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
        _mahjongs:null,
        _nextPlayTime:0,
    },

    // use this for initialization
    onLoad: function () {

        var ndSetting = cc.find("popups/settings/btn_sqjsfj", this.node);
        cc.fy.utils.addClickEvent(ndSetting,this.node,"AIGame","onBtnClicked");
        var self = this;
        var game = cc.fy.gameNetMgr;
        game.addHandler('game_ai_chupai',function(data){
            console.log("game_ai_chupai");
            self.chupai(data);
        });
    },

    chupai:function(pai){
        if(cc.fy.aiGameMgr){
            cc.fy.aiGameMgr.selfChupai(pai);
            this._nextPlayTime = 1;
        }
    },

    refresh:function(){
        cc.fy.gameNetMgr.dispatchEvent("mj_count");//更新剩余牌数
        if(cc.fy.gameNetMgr.numOfMJ <= 26){
            var ng = cc.fy.gameNetMgr.numOfGames + 1;
            cc.fy.aiGameMgr.resetAI();
            cc.fy.gameNetMgr.numOfGames = ng;
            cc.fy.sceneMgr.loadGameScene(cc.fy.gameNetMgr.conf.type, true);
        }
    },

    onBtnClicked:function(){
        cc.fy.gameNetMgr.isOver = true;
        cc.fy.gameNetMgr.reset();
        cc.fy.gameNetMgr.clear();
        cc.fy.sceneMgr.loadScene("hall");
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(cc.fy.aiGameMgr && cc.fy.gameNetMgr.gamestate != null && cc.fy.gameNetMgr.turn != 0){
            if(this._nextPlayTime > 0){
                this._nextPlayTime -= dt;
                if(this._nextPlayTime < 0){
                    this._nextPlayTime = cc.fy.aiGameMgr.takeNextAction();
                    this.refresh();
                }
            }
        }
    },
});
