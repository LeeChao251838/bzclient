var ConstsDef  = require("ConstsDef");
cc.Class({
    extends:cc.Component,

    properties: {
       
        first:cc.Node,
        second:cc.Node,
        three:cc.Node,
        other:cc.Node,
        headImage:cc.Node,
        userName:cc.Label,
        jushu:cc.Label,
        yingjia:cc.Label,
        yingfen:cc.Label,
     
        _Data:null,
    },

    updateItem:function(data,index){
       
        
        this.node.active=true;
        this._Data=data;
        var imageloader = this.headImage.getComponent("ImageLoader");
        cc.fy.resMgr.setSpriteFrameByUrl(ConstsDef.URL_ATLAS_HEADIMG,this.headImage.getComponent(cc.Sprite));
        if(data.headimg != null || data.headimg != ""){
            imageloader.setUrl(data.headimg);
        } 
        //名字
        let username = cc.fy.utils.subStringCN(data.name, 8, true);
        this.userName.string = username;
        //局数
        this.jushu.string = data.numofgames;
        //赢家
        this.yingjia.string = data.bigwinner;
        //赢分
        this.yingfen.string = data.totalscores;
       
        if(index == 1){
            this.first.active = true;
            this.second.active = false;
            this.three.active = false;
            this.other.active = false;
        }
        else if(index == 2){
            this.first.active = false;
            this.second.active = true;
            this.three.active = false;
            this.other.active = false;
        }
        else if(index == 3){
            this.first.active = false;
            this.second.active = false;
            this.three.active = true;
            this.other.active = false;
        }
        else{
            this.first.active = false;
            this.second.active = false;
            this.three.active = false;
            this.other.active = true;
            this.other.getComponent(cc.Label).string = index ;
        }  
   
    },
   
 
});
