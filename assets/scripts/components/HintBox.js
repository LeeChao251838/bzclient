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

        _hintClone:null,
        _parent:null,
        _msg:"null",
        _lastHint:null,
    },

    // use this for initialization
    init: function () {
        
        
    },

    show:function(msg)
    {
        if(msg == null || msg == "")
        {
            return;
        }
        this._parent = cc.find("Canvas");
        if(this._parent == null)
        {
            console.log( " HintBox Canvas == null")
            return;
        }
        console.log("hintbox show = " + msg);
        this._msg = msg;
        this.loadHint();
        // var label = this._hintClone.getChildByName("label").getComponent(cc.Label);
        // label.string = msg;
        
    },

    loadHint:function()
    {
        var self = this;
        cc.fy.resMgr.loadRes("prefabs/hintbox", function (prefab) {
            if(self._parent == null)
            {
                return;
            }
            self._hintClone = cc.instantiate(prefab);
            self._parent.addChild(self._hintClone);
            self._hintClone.x = 0;
            self._hintClone.y = 0;

            self._hintClone.zIndex = cc.fy.global.zIndex + 170;
            let content=self._hintClone.getChildByName("content");
            
            var label = content.getChildByName("label").getComponent(cc.Label);
            label.string = self._msg;
            var hintbg = content.getChildByName("hintbg");
            hintbg.width = label.node.width + 110;
            content.scale=0;
            content.y=-100;
            content.runAction(cc.spawn(
                cc.scaleTo(0.17,1),
                cc.moveBy(0.17,0,100)               
            ))
            // var hint_an = self._hintClone.getComponent(cc.Animation);
            // hint_an.play("hintbox");

            if(self._lastHint != null)
            {
                self._lastHint.removeFromParent();
                self._lastHint = null;
            }
            self._lastHint = self._hintClone;
        });
    },

    reset:function()
    {
        this._lastHint = null;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
