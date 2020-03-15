var md5Tool = require("md5Tool");
cc.Class({
    extends: cc.Component,

    properties: {
        updatePanel: {
            default: null,
            type: cc.Node
        },
        alertPanel: {
            default: null,
            type: cc.Node
        },
        manifestUrl: {
            type: cc.Asset,     // use 'type:' to define Asset object directly
            default: null,      // object's default value is null
        },
        percent: {
            default: null,
            type: cc.Label
        },
        lblErr: {
            default: null,
            type: cc.Label
        },
        checkServerInfo: 
        {
            default: true,
        },
        progressbar:{
            default : null,
            type : cc.ProgressBar
        },
        
        labAlertContent:cc.Label,
        _hotUpdateDir: "ups-asset", //热更新目录
    },
    percentStr:"",

    checkCb: function (event) {
        var failed = false;
        switch (event.getEventCode())
        {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.lblErr.string += "错误，本地资源描述文件缺失！" + "\n";
                cc.log("checkCb No local manifest file found, hot update skipped.");
                cc.eventManager.removeListener(this._checkListener);
                failed = true;
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
               //  this.lblErr.string += "checkCb Fail to download manifest file, hot update skipped." + "\n";
                cc.log("checkCb Fail to download manifest file, hot update skipped.");
                cc.eventManager.removeListener(this._checkListener);
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
              //  this.lblErr.string += "checkCb 已经是最新的版本." + "\n";
                cc.log("checkCb Already up to date with the latest remote version.");
                cc.eventManager.removeListener(this._checkListener);
                this.lblErr.string += "游戏不需要更新 \n";
                this.setProgress(100);
                //直接进游戏
                cc.director.loadScene("loading");
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
               // this.lblErr.string += "checkCb New version fond!." + "\n";
                 cc.log("checkCb New version fond!.");
                this._needUpdate = true;
                // this.updatePanel.active = true;
                // this.percent.string = '更新中...';
                this.setProgress(0);
                cc.eventManager.removeListener(this._checkListener);
                break;
            default:
                break;
        }
        if (failed) {
            this.alertPanel.active = true;
        }
        this.hotUpdate();
    },

    updateCb: function (event) {
        var needRestart = false;
        var failed = false;
        switch (event.getEventCode())
        {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                cc.log('No local manifest file found, hot update skipped.');
             //   this.lblErr.string += "No local manifest file found, hot update skipped." + "\n";
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                var perNum = event.getPercent();
                // var percentByFile = event.getPercentByFile();
                if(perNum)
                {
                    var per = ((event.getDownloadedFiles()/event.getTotalFiles()) * 100).toFixed(2);
                    var str = "("+event.getDownloadedFiles()+"/"+event.getTotalFiles()+")";
                    this.setProgress(per, str);
                }

                var msg =event.getMessage();
                if(msg){
                    console.log("updated file:"+msg);
                }


                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
             //   this.lblErr.string += "Fail to download manifest file, hot update skipped." + "\n";
                cc.log('Fail to download manifest file, hot update skipped.');
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
             //   this.lblErr.string += "Already up to date with the latest remote version." + "\n";
                cc.log('Already up to date with the latest remote version.');
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
             //   this.lblErr.string += "Update finished." + "\n";
                cc.log('Update finished. ' + event.getMessage());

                needRestart = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
             //   this.lblErr.string += 'Update failed. ' + event.getMessage() + "\n";
                cc.log('Update failed. ' + event.getMessage());

                this._failCount ++;
                if (this._failCount < 5)
                {
                    this._am.downloadFailedAssets();
                }
                else
                {
                    cc.log('Reach maximum fail count, exit update process');
                    this._failCount = 0;
                    failed = true;
                }
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
             //   this.lblErr.string += 'Asset update error: ' + event.getAssetId() + ', ' + event.getMessage() + "\n";
                cc.log('Asset update error: ' + event.getAssetId() + ', ' + event.getMessage());
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                this.lblErr.string += event.getMessage() + "\n";
                cc.log(event.getMessage());
                break;
            default:
                break;
        }

        if (failed) {
            cc.eventManager.removeListener(this._updateListener);
            this.updatePanel.active = false;
            this.alertPanel.active = true;
        }

        if (needRestart) {
            this.setProgress(100);
            cc.eventManager.removeListener(this._updateListener);
            // Prepend the manifest's search path
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this._am.getLocalManifest().getSearchPaths();
            Array.prototype.unshift(searchPaths, newPaths);
            console.log("searchPaths" + searchPaths);
            console.log("newPaths" + newPaths);
            // This value will be retrieved and appended to the default search path during game startup,
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));

            jsb.fileUtils.setSearchPaths(searchPaths);
            // this.lblErr.string += "游戏资源更新完毕\n";
            
            cc.log("needRestart cc.game.restart");
            cc.game.restart();
        }
    },

    retry: function (){
        let storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + this._hotUpdateDir + "_temp";
        cc.log("retry  storagePath:" + storagePath);
        if (jsb.fileUtils.isDirectoryExist(storagePath)) {
            cc.log("retry isDirectoryExist storagePath:" + storagePath);
            let deleteBack =  jsb.fileUtils.removeDirectory(storagePath);
            cc.log("retry isDirectoryExist deleteBack:" + deleteBack);
        }
        cc.game.restart();
    },

    hotUpdate: function () {
        if (this._am && this._needUpdate) {
            // this.lblErr.string += "开始更新游戏资源...\n";
            this.setProgress(0);
            this._updateListener = new jsb.EventListenerAssetsManager(this._am, this.updateCb.bind(this));
            cc.eventManager.addListener(this._updateListener, 1);

            this._failCount = 0;
            this._am.update();
        }
    },

    // use this for initialization
    onLoad: function () {
        // Hot update is only available in Native build
         
        if (!cc.sys.isNative) {
            //直接进游戏
            cc.director.loadScene("loading");
            return;
        }

        if(cc.sys.os == cc.sys.OS_ANDROID){
            cc.CHANNELID = 2;
        }
        else if(cc.sys.os == cc.sys.OS_IOS){
            cc.CHANNELID = 1;
        }
        else{
            cc.CHANNELID = 3;
        }

        // var storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + this._hotUpdateDir);
       
      // jsb.fileUtils.setSearchPaths(t);
        var searchPaths = jsb.fileUtils.getSearchPaths();
      //  console.log("搜索路径:" + searchPaths);
            
        this.lblErr.string = "";
        // this.updatePanel.active = false;
       // this.lblErr.node.active = false;
        var self = this;

        if (this.checkServerInfo){
            var xhr = null;
            var data = {
                channelid:cc.CHANNELID
            }
            var complete = false;
            var fnRequest = function(){
                self.lblErr.string = "正在连接服务器...";
                xhr = cc.fy.http.sendRequest("/get_serverinfo",data,function(ret){
                    xhr = null;
                    if(ret.errcode != null &&　ret.errcode != 0){
                        console.log(ret.errmsg);
                        if(ret.errcode == -111){
                            self.alertPanel.active = true;
                        }
                    }
                    else{
                        complete = true;
                        //console.log("ret.channelid:"+ret.channelid);
                        cc.fy.SI = ret;
                        //测试用
                        //cc.fy.SI.hotswitch = 1;
                        //测试结束
                        if(ret.version > cc.VERSION && parseInt(cc.fy.SI.verify) == 1)
                        {
                            // cc.find("Canvas/alert").active = true;
                            cc.fy.alert.show("当前版本过低，请下载新版本",function(){
                                cc.sys.openURL(cc.fy.SI.appweb);
                                cc.game.end();
                            });
                        }
                        else{
                            if(parseInt(cc.fy.SI.hotswitch) == 1) //开启
                            {
                                self.alertPanel.active = false;
                                self.doUpdate();
                            }else//未开启
                            {
                                cc.director.loadScene("loading");
                            }
                        }
                    }
                    
                });
                // setTimeout(fn,3000);            
            }

            var fn = function(){
                if(!complete){
                    if(xhr){
                        xhr.abort();
                        // self.lblErr.string = "连接失败，即将重试";
                        self.lblErr.string = "正在连接服务器...";
                        setTimeout(function(){
                            fnRequest();
                        },3000);
                    }
                    else{
                        fnRequest();
                    }
                }
            };
            fn();
        }
        else{
            this.setProgress(100);
            cc.director.loadScene("loading");
        }

    },

    doUpdate: function(){
        this.lblErr.string = "正在检查游戏资源...\n";
        var storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + this._hotUpdateDir);
        console.log('Storage path for remote asset : ' + storagePath);
        //this.lblErr.string += storagePath + "\n";
        console.log('本地: ' + this.manifestUrl);
        //this.lblErr.string += '本地: ' + this.manifestUrl + "\n";
        this._am = new jsb.AssetsManager(this.manifestUrl, storagePath);
        this._am.retain();

        let failedFiles = new Array();
        let self = this;
        this._am.setVerifyCallback(function (path, asset) {
            cc.log('computed path:' + path);
            var filename = self.getFileName(path);
            cc.log('computed filename:' + filename);
            if (filename == 'project.manifest' || filename == 'version.manifest') {
              return true;
            }
          
            // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
            if (asset.compressed) {
              return true;
            } else {
              var data = jsb.fileUtils.getDataFromFile(path);
              if (data == null) {
                cc.log('updateHandler verify get file failed:'+data);
                return false;
              }
              var md5strs = md5Tool(data).toLowerCase();

              //cc.log('computed md5:' + md5strs);
              //cc.log('expected md5:' + asset.md5);
              if (md5strs == asset.md5) {
                return true;
              } else {
                if(failedFiles[path]  && (failedFiles[path]==md5strs) )
                {
                    //cc.log(failedFiles[path],"1--------",md5strs);
                    return true;
                }else
                {
                    failedFiles[path]=md5strs;
                    //cc.log(failedFiles[path],"2--------",md5strs);
                }

                if (jsb.fileUtils.isFileExist(path)) {
                    jsb.fileUtils.removeFile(path);
                }
                //cc.log('updateHandler verify failed:'+path);
                //cc.log('updateHandler md5:'+md5strs+' asset.md5:'+asset.md5);
                return false;
              }
            }
            return false;
        });

        this._needUpdate = false;
        if (this._am.getLocalManifest().isLoaded())
        {
            cc.HOTVERSION = this._am.getLocalManifest().getVersion();
             cc.log('LLocalManifest getVersion: ' + cc.HOTVERSION);
            
            this._checkListener = new jsb.EventListenerAssetsManager(this._am, this.checkCb.bind(this));
            cc.eventManager.addListener(this._checkListener, 1);

            this._am.checkUpdate();
        }
    },

    getFileName:function(path) {
        var pos1 = path.lastIndexOf('/');
        var pos2 = path.lastIndexOf('\\');
        var pos  = Math.max(pos1, pos2)
        if (pos < 0)
          return path;
        else
          return path.substring(pos+1);
    },

    setProgress: function(val, str){
        str = str == null ? '':str;
        let tipStr = "正在为您检查更新：";
        this.percentStr = tipStr + val.toString() + '%' + str
        this.progressbar.progress = val/10000;
    },

    onDestroy: function () {
        this._am && this._am.release();
    },

    update:function(){
        if(this.percent){
            this.percent.string = this.percentStr;
        }

        if(this.alertPanel && this.alertPanel.active && this.labAlertContent){
            this.labAlertContent.string = "资源更新失败，请检查网络，再重试！";
        }
    },
});
