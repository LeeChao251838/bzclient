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
        _mainURL:"http://fyhd.hy51v.com",// 正式兑换活动地址
        // _mainURL:"http://fyhdt.hy51v.com",
        _exchange:null,
        _btnExchange:null,
        _webView:null,
        _loadfail:null,
        _gameid:"1",
        _private_key:"jinyou123",
        _url:null,
    },

    // use this for initialization
    onLoad: function () {
        var topLeft = this.node.getChildByName("top_right");
        if(this._exchange == null){
            this._exchange = this.node.getChildByName("exchange");
        }
        // if(this._btnExchange == null){
        //     this._btnExchange = topLeft.getChildByName("btn_Exchange");
        // }
        if(this._loadfail == null){
            this._loadfail = this._exchange.getChildByName("exchanfail");
        }

        this._webView = this._exchange.getChildByName("webview").getComponent(cc.WebView);
        // var self = this;
        // setTimeout(function(){
        //     self.webViewRefresh();
        // },2000);
        this._exchange.active = false;
        this.checkActivity();
    },

    onBtnExchangeClick:function(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this._exchange.active = true;
        this._loadfail.active = false;
        var self = this;
        setTimeout(function(){
            self._loadfail.active = true;
        },3000);
        if(this._url == null){
            this.webViewRefresh();
        }
    },

    onCloseClick:function(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        console.log("onCloseClick");
        this._exchange.active = false;
    },

    onWjzClick:function(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        console.log("onWjzClick");
        cc.sys.openURL(this._url);
        
    },

    webViewRefresh:function(){
        var md5 =  require("md5");;
        var code = "userid=" + cc.fy.userMgr.userId + "&gameid=1";
        // var code = "userid=1" + "&gameid=1";
        var str = cc.fy.userMgr.userId + "" + this._gameid + "" + this._private_key;
        // var str = "1" + this._gameid + this._private_key;
        // console.log("str = " + str);
        var signature = md5.hex_md5(str);
        // console.log("signature = " + signature);
        code += "&sig=" + signature;
        // console.log("code = " + code);
        // http://fyhd.hy51v.com/?userid=10000&gameid=1&sig=520d46a8dc7072c9e47ae26649146777

        this._url = this._mainURL + "/?" + code;
        // console.log("this._url = " + this._url);
        this._webView.url = this._url;
    },

    checkActivity:function(){
        if(cc.fy.global.activitydata == null){
            // this._btnExchange.active = false;
            var data = {
                activity_id:1001,
            };

            var self = this;
            var onGet = function(ret){
                console.log("get_activity_by_id");
                console.log(ret);
                if(ret.errcode !== 0){
                    console.log(ret.errmsg);
                }
                else{
                    if(ret.is_open == "1"){
                        cc.fy.global.activitydata = ret;
                        // this._btnExchange.active = true;
                        this._mainURL = ret.net_addr;
                    }
                }
            };
            // cc.fy.http.sendRequest("/get_activity_by_id",data,onGet.bind(this));
        }
        else{
            // this._btnExchange.active = true;
        }
        
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
