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
        _side:null,
        _offset:10,
        _startPo:cc.Vec2,
        _moveDir:-1,// 记录坐标加减
        _endPo:0,
        _speed:30,
    },

    // use this for initialization
    onLoad: function () {

    },

    setSide:function(side){
        this._side = side;
        // this.
        // var sides = ["myself","right","up","left"];
        let scaleOff = 1;
        let poOff = 1;
        if(this.node.parent.scale < 1){
            scaleOff = this.node.parent.scale;
            poOff = 1 + (1 - scaleOff) * 2;
        }
        if(side == "myself"){
            this.node.rotation = 270;
            this._startPo = cc.v2(0,42*poOff);
            this._moveDir = 1;
            this._endPo = this._startPo.y + this._offset;
            this.node.setScale(1/0.8/scaleOff);
        }
        else if(side == "right"){
            this.node.rotation = 180;
            this._startPo = cc.v2(-30*poOff,5);
            this._moveDir = -1;
            this._endPo = this._startPo.x - this._offset;
            this.node.setScale(1/scaleOff);
        }
        else if(side == "up"){
            this.node.rotation = 90;
            this._startPo = cc.v2(0,-48 * poOff);
            this._moveDir = -1;
            this._endPo = this._startPo.y - this._offset;
            this.node.setScale(1/0.6/scaleOff);
        }
        else if(side == "left"){
            this.node.rotation = 0;
            this._startPo = cc.v2(30*poOff,6);
            this._moveDir = 1;
            this._endPo = this._startPo.x + this._offset;
            this.node.setScale(1/scaleOff);
        }
        this.node.setPosition(this._startPo);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this._side == "myself"){
            if(this._moveDir > 0 && this.node.y > this._endPo){
                this._moveDir = -this._moveDir;
            }
            if(this._moveDir < 0 && this.node.y < this._startPo.y){
                this._moveDir = -this._moveDir;
            }
            this.node.y += this._moveDir * dt * this._speed;
        }
        else if(this._side == "up"){
            if(this._moveDir < 0 && this.node.y < this._endPo){
                this._moveDir = -this._moveDir;
            }
            if(this._moveDir > 0 && this.node.y > this._startPo.y){
                this._moveDir = -this._moveDir;
            }
            this.node.y += this._moveDir * dt * this._speed;
        }
        else if(this._side == "left"){
            if(this._moveDir > 0 && this.node.x > this._endPo){
                this._moveDir = -this._moveDir;
            }
            if(this._moveDir < 0 && this.node.x < this._startPo.x){
                this._moveDir = -this._moveDir;
            }
            this.node.x += this._moveDir * dt * this._speed;
        }
        else if(this._side == "right"){
            if(this._moveDir < 0 && this.node.x < this._endPo){
                this._moveDir = -this._moveDir;
            }
            if(this._moveDir > 0 && this.node.x > this._startPo.x){
                this._moveDir = -this._moveDir;
            }
            this.node.x += this._moveDir * dt * this._speed;
        }
    },
});
