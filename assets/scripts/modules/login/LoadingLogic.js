var FilterWord = require("FilterWord");
cc.Class({
    extends: cc.Component,

    properties: {
        tipLabel:cc.Label,
        progressBar:cc.ProgressBar,
        _stateStr:'',
        _progress:0.0,
        _splash:null,
        _isLoading:false,
    },

    // use this for initialization
    onLoad: function () {
        if(cc.sys.os == cc.sys.OS_ANDROID){
            cc.CHANNELID = 2;
        }
        else if(cc.sys.os == cc.sys.OS_IOS){
            cc.CHANNELID = 1;
        }
        else{
            cc.CHANNELID = 3;
        }

        this.tipLabel.string = this._stateStr;
        
        this._splash = cc.find("Canvas/splash");
        this._splash.active = true;
    },
    
    start:function(){        
        var self = this;
        var SHOW_TIME = 500;
        var FADE_TIME = 500;
        //if(cc.sys.os != cc.sys.OS_IOS || !cc.sys.isNative){  //非ios 或者 浏览器
        if(true){  
        self._splash.active = true;
            var t = Date.now();
            var fn = function(){
                var dt = Date.now() - t;
                if(dt < SHOW_TIME){
                    setTimeout(fn,33);
                }
                else {
                    var op = (1 - ((dt - SHOW_TIME) / FADE_TIME)) * 255;
                    if(op < 0){
                        self._splash.opacity = 0;
                        self.checkVersion();    
                    }
                    else{
                        self._splash.opacity = op;
                        setTimeout(fn,33);   
                    }
                }
            };
            setTimeout(fn,33);
        }
        else{
            this._splash.active = false;
            this.checkVersion();
        }
    },
    
    checkVersion:function(){
        var self = this;
        var onGetVersion = function(ret){
             console.log("ret.channelid:"+ret.channelid);
            if(ret.version == null){
                console.log("error.");
            }
            else{
                cc.fy.SI = ret;
                cc.fy.userMgr.loadUrl(cc.fy.SI);
                if(ret.version > cc.VERSION && parseInt(cc.fy.SI.verify) == 1)
                {
                    // cc.find("Canvas/alert").active = true;
                    cc.fy.alert.show("当前版本过低，请下载新版本",function(){
                         cc.sys.openURL(cc.fy.SI.appweb);
                    });
                }
                else{
                    if(ret.version < cc.VERSION && parseInt(cc.fy.SI.verify) == 0)
                    {
                        cc.FREEVERSION = true;
                    }else
                    {
                        cc.FREEVERSION = false;
                    }
                    
                    self.startPreloading();
                }
            }
        };
        
        if(cc.fy.SI)
        {
            onGetVersion(cc.fy.SI)
        }else
        {
            var xhr = null;
            var data = {
                channelid:cc.CHANNELID
            }
            var complete = false;
            var fnRequest = function(){
                self._stateStr = "正在连接服务器";
                xhr = cc.fy.http.sendRequest("/get_serverinfo",data,function(ret){
                    xhr = null;
                    complete = true;
                    if(ret.errcode != null && ret.errcode != 0){
                        self._stateStr = "连接失败，请检查网络";
                        console.log(ret.errmsg);
                        if(cc.fy.hintBox == null){
                            var HintBox = require("HintBox");
                            cc.fy.hintBox = new HintBox();
                        }
                        if(ret.errmsg != null)
                        {
                            cc.fy.hintBox.show(ret.errmsg);
                        }
                    }
                    else{
                        onGetVersion(ret);
                    }
                });
                //setTimeout(fn,5000);            
            }
            
            var fn = function(){
                if(!complete){
                    if(xhr){
                        xhr.abort();
                        self._stateStr = "连接失败，即将重试";
                        setTimeout(function(){
                            fnRequest();
                        },5000);
                    }
                    else{
                        fnRequest();
                    }
                }
            };
            fn();
        }
        
    },
    
    onBtnDownloadClicked:function(){
        cc.sys.openURL(cc.fy.SI.appweb);
    },
    
    startPreloading:function(){
        this._stateStr = "基础数据初始化，请稍候...";

        this._isLoading = true;
        var self = this;
        var onProgress = function(progress, stateStr){
            // console.log(" progress = " + progress + " stateStr = " + stateStr);
            self._progress = progress;
            self._stateStr = stateStr;
        };

        var onComplete = function(){
            self.onLoadComplete();
        };

        cc.fy.resMgr.startLoadRes(onComplete, onProgress);
    },
    
    onLoadComplete:function(){
        this._isLoading = false;
        this._stateStr = "准备登陆";
        cc.fy.sceneMgr.loadScene("login");
        cc.loader.onComplete = null;
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this._stateStr.length == 0){
            return;
        }
        this.progressBar.progress = this._progress;
        this.tipLabel.string = this._stateStr + ' ';
        if(this._isLoading){
            this.tipLabel.string += Math.floor(this._progress * 100) + "%";   
        }
        else{
            var t = Math.floor(Date.now() / 1000) % 4;
            for(var i = 0; i < t; ++ i){
                this.tipLabel.string += '.';
            }            
        }
    }
});