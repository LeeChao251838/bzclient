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
        gpswarn:cc.Node,
        labwarn:cc.Label,
        _warnNormal:"",

        _btnGps:null,
    },

    // use this for initialization
    onLoad: function () {
        // this.gpswarn = this.node.getChildByName("_gpswarn");
        // this.labwarn = this.gpswarn.getChildByName("content");
        var self = this;
        // cc.eventManager.addCustomListener('show_gpswarn', function(event){
        //     console.log("show_gpswarn111");
        //     var data = event.getUserData();
        //     if(data && data.data)
        //     {
        //         self.show(data.data);
        //     }
        // });
        
        // var temp = cc.find("Canvas");
        // this._btnGps = temp.getChildByName("btn_gps");
        // temp.on('show_gpswarn',function(data){
        //     var data = data;
        //     if(data != null){
        //         self.show(data);
        //     }
        // });
        // temp.on("show_gpswarn_normal", function(data){
        //     var data = data;
        //     if(data != null){
        //         self._warnNormal = data;
        //         if(self.gpswarn){
        //             self.labwarn.string = self._warnNormal;
        //         }
        //         // if(self._warnNormal == null || self._warnNormal == ""){
        //         //     self.onCloseClick();
        //         //     cc.fy.hintBox.show("暂时无法获取玩家地理位置");
        //         // }
        //     }
        // });

        // temp.on('cc_btngpscolor',function(data){
        //     var data = data;
        //     if(self._btnGps){
        //         if(data == true){
        //             self._btnGps.color = new cc.Color(255,0,0);
        //         }
        //         else{
        //             self._btnGps.color = new cc.Color(255,255,255);
        //         }
        //     }
        // });

        // cc.fy.anticheatingMgr.isForceShowWarn = true;
        // cc.fy.anticheatingMgr.checkgps();
    },

    onCloseClick:function()
    {
        // if(this.gpswarn)
        // {
        //     this.gpswarn.active = false;
        //     this.labwarn.string = "";
        // }
    },

    show:function(warn)
    {
        // if (this.gpswarn) {
        //     this.gpswarn.active = true;
        //     this.labwarn.string = warn;
        // }
        // else
        // {
        //     console.log("this.gpswarn == null");
        // }  
    },

    showNormal:function(){
    //     if(cc.fy.replayMgr.isReplay()){
    //         cc.fy.hintBox.show("暂时无法获取玩家地理位置");
    //         return;
    //     }
    //     console.log("==>> showNormal --> showgps = " + cc.fy.global.showGPSWarn);
    //     console.log("==>> showNormal --> warnlabel = " + this._warnNormal);
    //     // if(this._warnNormal != ""){
    //     //     if(this.gpswarn){
    //     //         this.gpswarn.active = true;
    //     //         this.labwarn.string = this._warnNormal;
    //     //     }
    //     //     else{
    //     //         console.log("this.gpswarn == null");
    //     //     }
    //     // }
    //     // else{
    //     //     cc.fy.hintBox.show("暂时无法获取玩家地理位置");
    //     // }
    //     if(cc.fy.anticheatingMgr.checkgps() == false){
    //         cc.fy.hintBox.show("暂时无法获取玩家地理位置");
    //     }
    //     else{
    //         if(this.gpswarn){
    //             this.gpswarn.active = true;
    //         }
    //     }
        
    //     cc.fy.userMgr.refreshGeo();
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
