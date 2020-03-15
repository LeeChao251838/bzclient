cc.Class({
    extends: require('Item'),

    properties: {
        labName:cc.Label,
        sprHead:cc.Node,
        nodBtnAgree:cc.Node,
        nodBtnRefuse:cc.Node,
    },

    updateItem:function(index, data){
        this._super(index, data);
        let stateStr = data.status == 0 ? "(加入)" : "(退出)";
        this.labName.string = data.name + stateStr;
        let imageloader = this.sprHead.getComponent("ImageLoader");
        if(data.headimg != null && data.headimg != ""){
            imageloader.setUrl(data.headimg);
        }

        this.nodBtnAgree.idx = index;
        this.nodBtnAgree.status = data.status;
        this.nodBtnRefuse.idx = index;
        this.nodBtnRefuse.status = data.status;
        this.nodBtnAgree.status = data.status;
    },
});
