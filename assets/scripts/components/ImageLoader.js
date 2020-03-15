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
        _spriteFrame:null,
        _ndSprite:null,
        _node:null,
    },

    // use this for initialization
    onLoad: function () {
        this._node = this.node;
        this.setupSpriteFrame();
    },

    setUrl:function(url){
        if(cc.sys.isNative == false || url == null){
            return;
        }
        var self = this;
        this.loadImage(url,null,function (err,spriteFrame) {
            self._spriteFrame = spriteFrame;
            self.setupSpriteFrame();
        }); 
    },
    
    setUserID:function(userid){
        if(cc.sys.isNative == false){
            return;
        }
        if(!userid){
            return;
        }
        
        var self = this;
        this.getBaseInfo(userid,function(code,info){

            //info.url = "http://wx.qlogo.cn/mmopen/YiarjHkcf7STFthYATb0nheibj7PeDGxl9muoECdLysuc6HeljpKagsYFQ2BzLjMw4d5VRDfht9tIRZTMSA8vl59m2RODdvFIX/0";

           if(info && info.url){
                self.loadImage(info.url,userid,function (code,spriteFrame,err) {
                    if(err){
                        cc.fy.anysdkMgr.downloadImg(info.url, code, function(err, texPath) {
                            cc.loader.load({url: texPath, type:"jpg"}, function (err, tex) {   
                                self._spriteFrame = new cc.SpriteFrame(tex);
                                self.setupSpriteFrame();
                            }.bind(this));   
                        });
                    }
                    else{
                        self._spriteFrame = spriteFrame;
                        self.setupSpriteFrame();
                    }
                });
            }
        });
    },
    
    setupSpriteFrame:function(){
        if(this._node == null){
            return;
        }
        if(this._spriteFrame){
            if(this._ndSprite == null){
                this._ndSprite = this._node.getComponent(cc.Sprite);
            }
            this._ndSprite.spriteFrame = this._spriteFrame;   
        }
    },

    getBaseInfo:function(userid,callback){
        if(cc.fy.baseInfoMap == null){
            cc.fy.baseInfoMap = {};
        }
        
        if(cc.fy.baseInfoMap[userid] != null){
            callback(userid,cc.fy.baseInfoMap[userid]);
        }
        else{
            cc.fy.http.sendRequest('/base_info',{userid:userid},function(ret){
                var url = null;
                if(ret.headimgurl){
                    
                    url = ret.headimgurl;
                }
                var info = {
                    name:ret.name,
                    sex:ret.sex,
                    url:url,
                }
                cc.fy.baseInfoMap[userid] = info;
                callback(userid,info);
                
            },cc.fy.http.master_url);   
        }
    },
    loadImage:function(url,code,callback){
        if(cc.fy.images == null){
            cc.fy.images = {};
            cc.fy.images.reset = function(url){
                if(url == null){
                    cc.fy.images = {};
                }
                else{
                    cc.fy.images[url] = null;
                }
            }
        }
        
        if(cc.fy.images[url] == null || cc.fy.images[url].image == null){
            
            (function () {
                var _url = url;
                console.log("loadImage url " + url);
                cc.loader.load({url: url, type: 'png'},function (err,tex) {
                    // console.log("loadImage err " + err);
                    if(err){
                        callback(code, null, err);
                        return;
                    }
                    cc.fy.images[_url] = {
                        image:tex,
                    };
                    var spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height));
                    callback(code,spriteFrame);
                });
            }());
        }
        else{
            var tex = cc.fy.images[url].image;
            var spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height));
            callback(code,spriteFrame);
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
