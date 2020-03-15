var showModuleQueue = [];

cc.Class({
    extends: cc.Component,
    properties:{
        _hidePo:999999,
        _isHideOther:true,
        _isPopAction:false,
        _topIndex:0,
    },
    onEnable:function(){
        this.initBaseHander();
        if(this._isHideOther){
            var queue = showModuleQueue;
            if(queue == null){
                queue = [];
            }
            if(queue.length > 0){
                queue[queue.length - 1].startPo = queue[queue.length - 1].position;
                queue[queue.length - 1].position = cc.p(this._hidePo, this._hidePo);
            }
            else{
                this.node.startPo = this.node.position;
            }
            queue.push(this.node);
            this.node.queueIndex = queue.length - 1;
        }
        this.node.zIndex = cc.fy.global.zIndex++ + this._topIndex;
        this.baseShowView();
    },

    initBaseHander:function(){
        if(!this._isBaseHanderOn){
            var self = this;
            this.node.on("baseshow", function(){
                if(self.node.active){
                    var queue = showModuleQueue;
                    if(self.node.queueIndex != null && self.node.queueIndex < queue.length - 1){
                        queue[queue.length - 1].startPo = queue[queue.length - 1].position;
                        queue[queue.length - 1].position = cc.p(self._hidePo, self._hidePo);
                        queue.splice(self.node.queueIndex, 1);
                        queue.push(self.node);
                        self.node.position = self.node.startPo;
                        
                        for(var i=0;i<queue.length;i++){
                            queue[i].queueIndex = i;
                        }

                        self.baseShowView();
                    }
                }
            });
            this._isBaseHanderOn = true;
        }
    },

    baseShowView:function(){
        if(this._isPopAction){
            if(this.ndBalckbg == null){
                this.ndBalckbg = this.node.getChildByName("blackbg");
                this.alwaysTop = this.node.parent.getChildByName("alwaysTop");
            }
            if(this.ndBalckbg && this.alwaysTop){
                this.ndBalckbg.parent = this.alwaysTop;
                this.node.scale = 0.6;
                var actionDelay = cc.delayTime(0.2);
                var action = cc.scaleTo(0.4, 1);
                var self = this;
                var actionCallBack = cc.callFunc(function () {
                    self.ndBalckbg.parent = self.node;
                    self.ndBalckbg.zIndex = -1;
                });
                action.easing(cc.easeBackOut(3.0));
                this.node.runAction(cc.sequence(action, actionCallBack));
            }
        }
    },

    onDisable:function(){
        if(this._isHideOther){
            var queue = showModuleQueue;
            if(queue == null){
                queue = [];
            }
            var n = queue.pop();
            if(n){
                n.queueIndex = null;
            }
            if(queue.length > 0){
                queue[queue.length - 1].position = queue[queue.length - 1].startPo;
            }
        }
    },

    setHideOther:function(bo){
        this._isHideOther = bo;
    },
    setPopAction:function(bo){
        this._isPopAction = bo;
    },

    setAlwaysTop:function(bo){
        this._topIndex = bo ? 10 : 0;
    },

    onDestroy:function(){
        var queue = showModuleQueue;
        if(queue != null && queue.length > 0 && this.node.queueIndex != null && this.node.queueIndex < queue.length){
            console.log(queue.length);
            queue.splice(this.node.queueIndex, 1);
            console.log(queue.length);
        }
    },
});
