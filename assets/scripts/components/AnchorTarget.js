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

        target:cc.Node,
        definePo:cc.Vec2,
        toPo:cc.Vec2,
    },

    update:function(){
        if(this.target != null && this.target.active == true){
            if(this.node.getPosition() != this.toPo){
                this.node.setPosition(this.toPo);
            }
        }
        else{
            if(this.node.getPosition() != this.definePo){
                this.node.setPosition(this.definePo);
            }
        }
    }
});
