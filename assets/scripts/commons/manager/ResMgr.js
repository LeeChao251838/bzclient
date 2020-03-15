cc.Class({
    properties: {
        _onLoadComplete:null,
        _onProgress:null,
        _stateStr:"",
        _loadQueue:[],

        _dataList:null,

        _resQueue:null,
        _resQueueUrl:[],
        _resQueueUrl_sp:[],
    },

    startLoadRes:function(loadComplete, progress){
        this._onLoadComplete = loadComplete;
        this._onProgress = progress;
        this._loadQueue = [];
        this._resQueue = {};
        var self = this;
        var onProgress = function ( completedCount, totalCount,  item ){
            // console.log("completedCount:" + completedCount + ",totalCount:" + totalCount );
            if(self._onProgress){
                var pronum = totalCount == 0 ? 0 : completedCount/totalCount;
                self._onProgress(pronum, self._stateStr);
            }
        };
        
        var loadFun = function(){
            self._stateStr = "正在加载数据，请稍候..."; // 加载配置
            if(cc.GameConfigJson == null){
                self.loadNext();
                return;
            }
            var urls = [];
            var keys = [];
            for(var key in cc.GameConfigJson){
                keys.push(key);
                urls.push(cc.GameConfigJson[key]);
            }
            cc.loader.loadResArray(urls, onProgress, function(err,res){ // 加载 配置
                if (err){
                    console.log(err);
                }else{
                    // console.log(res);
                    for(var i=0;i<res.length;i++){
                        self[keys[i]] = res[i];
                        // self[keys[i]] = self.getDataList(res[i]);
                    }
                }
                self.loadNext();
            });
        }
        this._loadQueue.push(loadFun);
        if(this._resQueueUrl.length > 0){
            var loadFun = function(){
                self._stateStr = "正在加载常驻资源，请稍候..."; // 加载数据
                cc.loader.loadResArray(self._resQueueUrl, onProgress, function(err,res){ // 加载 配置
                    if (err){
                        console.log(err);
                    }else{
                        // console.log(res);
                        
                        if(res != null){
                            for(var i=0;i<res.length;i++){
                                self._resQueue[self._resQueueUrl[i]] = res[i];
                            }
                        }
                        
                    }
                    self.loadNext();
                });
            }
            this._loadQueue.push(loadFun);
        }

        if(this._resQueueUrl_sp.length > 0){
            var loadFun = function(){
                self._stateStr = "正在加载图片，请稍候..."; // 加载数据
                cc.loader.loadResArray(self._resQueueUrl_sp, cc.SpriteAtlas, onProgress, function(err,res){ // 加载 配置
                    if (err){
                        console.log(err);
                    }else{
                        // console.log(res);
                        if(res != null){
                            for(var i=0;i<res.length;i++){
                                self._resQueue[self._resQueueUrl_sp[i]] = res[i];
                            }
                        }
                        
                    }
                    self.loadNext();
                });
            }
            this._loadQueue.push(loadFun);
        }

        this.loadNext();
    },

    loadNext:function(){
        if(this._loadQueue.length == 0){
            if(this._onLoadComplete){
                this._onLoadComplete();
            }
            cc.loader.onComplete = null;
            cc.loader.onProgress = null;
        }
        else{
            var loadfn = this._loadQueue.pop();
            loadfn();
        }
    },

    getDataList:function(json){
        this._dataList = [];
        var data = json;
        for(var k in data){
            for(var i = 0; i < data[k].list.length; ++i){
                var plot = data[k].list[i];
                this._dataList.push(plot);
            }
        }
        return this._dataList;
    },

    addRes:function(url, type){
        if(this._resQueueUrl == null){
            this._resQueueUrl = [];
        }
        if(url){
            if(type == null || type == cc.Prefab){
                this._resQueueUrl.push(url);
            }
            else if(type == cc.SpriteAtlas){
                this._resQueueUrl_sp.push(url);
            }
        }
    },

    getRes:function(url){
        if(this._resQueue != null){
            return this._resQueue[url];
        }
        
    },

    loadRes:function(url, callBack){
        if(this._resQueue == null){
            this._resQueue = {};
        }
        if(this._resQueue[url] != null){
            callBack(this._resQueue[url]);
        }
        else{
            cc.loader.loadRes(url, (err, obj)=>{
                if(err){
                    console.log(err);
                    callBack();
                }
                else{
                    this._resQueue[url] = obj;
                    callBack(this._resQueue[url]);
                }
            });
        }
    },

    setSpriteFrameByUrl:function(imgUrl, sprite){
        if(sprite){
            if(this._resQueue != null && this._resQueue[imgUrl] != null){
                sprite.spriteFrame = this._resQueue[imgUrl];
            }
            else{
                cc.loader.loadRes(imgUrl, cc.SpriteFrame, (err, spriteFrame)=>{
                    if(err){
                        console.log(err);
                    }
                    else{
                        this._resQueue[imgUrl] = spriteFrame;
                        sprite.spriteFrame = spriteFrame;
                    }
                });
            }
        }
    },
    
    setSpriteFrameByAtlasUrl:function(imgUrl, spriteName, sprite){
        if(sprite){
            if(this._resQueue != null && this._resQueue[imgUrl] != null){
                sprite.spriteFrame = this._resQueue[imgUrl].getSpriteFrame(spriteName);;
            }
            else{
                cc.loader.loadRes(imgUrl, cc.SpriteAtlas, (err, spriteAtlas)=>{
                    if(err){
                        console.log(err);
                    }
                    else{
                        this._resQueue[imgUrl] = spriteAtlas;
                        sprite.spriteFrame = spriteAtlas.getSpriteFrame(spriteName);;
                    }
                });
            }
        }
    },
});