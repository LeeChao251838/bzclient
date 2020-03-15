cc.Class({
    extends: require('Item'),

    properties: {
        sprHead:cc.Node,
        labName:cc.Label,
        labID:cc.Label,
        labTime:cc.Label,
        labPosition:cc.Label,
        nodBtnOption:cc.Node,
    },

    updateItem:function(index, data){
        this._super(index, data);
        var imageLoader = this.sprHead.getComponent("ImageLoader");
        if(data.headImg != null && data.headImg != ""){
            imageLoader.setUrl(data.headImg);
        }
        this.labName.string = data.userName;
        this.labID.string = data.userId;
        let timestamp = Date.parse(new Date()); 
        this.labTime.string = data.offlineTime == 0 ? "在线" : cc.fy.utils.formatDuring(timestamp - data.offlineTime);
        let level = "成员";
        if(data.level == 1){
            level = "会长";
        }
        else if(data.level == 2){
            level = "管理员";
        }
        this.labPosition.string = level;
        this.nodBtnOption.idx = index;
    },
});