cc.Class({
    extends: cc.Component,
    properties: {
        target:cc.Node,
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        _isShow:false,
        lblContent:cc.Label,
        _time:-1,
        _maxtime:30,
        _showOutTimeMsg:true,
    },

    // use this for initialization
    onLoad: function () {
        if(cc.fy == null){
            return null;
        }
        
        cc.fy.loading = this;
        this.node.active = this._isShow;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        this.target.rotation = this.target.rotation - dt*45;

        if(this._time >= 0)
        {
            this._time += dt;
            if(this._time > this._maxtime)
            {
                this._time = -1;
                this.hide();
                if(cc.fy.hintBox == null){
                    var HintBox = require("HintBox");
                    cc.fy.hintBox = new HintBox();
                }
                if( this._showOutTimeMsg)
                {
                     cc.fy.hintBox.show("网络连接超时！");
                }
               
            }
        }
    },
    
    // mt:秒   
    show:function(content, mt, showOutTimeMsg){
        this._time = 0;
        this._isShow = true;
        if(showOutTimeMsg==null)
        {
            showOutTimeMsg = true;
        }
        this._showOutTimeMsg = showOutTimeMsg;
        if(this.node){
            this.node.active = this._isShow;   
        }
        if(this.lblContent){
            if(content == null){
                content = "";
            }
            this.lblContent.string = content;
        }
        if(mt != null){
            this._maxtime = mt;
        }else{
            this._maxtime = 30;
        }
    },
    hide:function(){
        this._time = -1;
        this._isShow = false;
        if(this.node){
            this.node.active = this._isShow;   
        }
    }
});
