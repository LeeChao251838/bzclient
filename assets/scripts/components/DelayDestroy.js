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
        _lastCheckTime:-1,
        delayTime:3,
    },

    // use this for initialization
    onLoad: function () {
        this._lastCheckTime = Date.now();
    },

    setDelayTime:function(time)
    {
        this.delayTime = time;
    },

    // called every frame, uncomment this function to activate update callback
    update: function () {
        if(Date.now() - this._lastCheckTime > this.delayTime * 1000)
        {
            this._lastCheckTime = Date.now();
            if(this.node){
                this.node.removeFromParent();
            }
        }
    },
});
