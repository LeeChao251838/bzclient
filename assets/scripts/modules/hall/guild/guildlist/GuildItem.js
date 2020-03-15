cc.Class({
    extends: require('Item'),

    properties: {
        labName:cc.Label,
        labNum:cc.Label,
        labName2:cc.Label,
        labNum2:cc.Label,
        sprHead:cc.Node,
    },

    updateItem:function(index, data){
        this._super(index, data);
        var clubInfo = data.clubInfo;
        this.labName.string = clubInfo.name;
        this.labName2.string = clubInfo.name;
        if(clubInfo.online < 1){
            clubInfo.online = 1;
        }
        if(clubInfo.online > clubInfo.players){
            clubInfo.online = clubInfo.players;
        }
        this.labNum.string = clubInfo.online + "/" + clubInfo.players
        this.labNum2.string = clubInfo.online + "/" + clubInfo.players
        let imageloader = this.sprHead.getComponent("ImageLoader");
        if(clubInfo.headimg != null && clubInfo.headimg != ""){
             imageloader.setUrl(clubInfo.headimg);
        }else{
            cc.fy.resMgr.setSpriteFrameByUrl(ConstsDef.URL_ATLAS_HEADIMG,this.sprHead.getComponent(cc.Sprite));
        }
        this.node.idx = index;
    },
});