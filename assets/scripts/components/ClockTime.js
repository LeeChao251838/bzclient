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
        labTime:cc.Label,
        _lastMinute:-1,
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.labTime != null){
            var minutes = Math.floor(Date.now()/1000/60);
            if(this._lastMinute != minutes){
                this._lastMinute = minutes;
                var date = new Date();
                var y = date.getFullYear();

                var mo = date.getMonth() + 1;
                // m = m < 10? "0"+m:m;

                var d = date.getDate();
                // d = d < 10? "0"+d:d;

                var h = date.getHours();
                h = h < 10? "0"+h:h;

                var m = date.getMinutes();
                m = m < 10? "0"+m:m;

                this.labTime.string =  y + "-" + mo + "-" + d + " " + h + ":" + m;
            }
        }
    },
});