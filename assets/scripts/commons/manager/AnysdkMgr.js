const Buffer = require('buffer').Buffer;
var md5 =  require("md5");
var GameMsgDef = require('GameMsgDef');
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
        _isCapturing:false,
        _inviteCode:null,
    },

    // use this for initialization
    onLoad: function () {
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    
    init:function(){
        this.ANDROID_API = "com/javgame/smq/WXAPI";
        this.ANDROID_XLAPI = "com/javgame/smq/XLAPI";
        this.ANDROID_MOWANGAPI ="com/javgame/smq/MOWANGAPI";
        this.IOS_API = "AppController";

        this.ANDROID_APPACTIVITY ="org.cocos2dx.javascript.AppActivity";
    },
    
    login:function(){
        try
        {
            if(cc.sys.os == cc.sys.OS_ANDROID){ 
                jsb.reflection.callStaticMethod(this.ANDROID_API, "Login", "()V");
            }
            else if(cc.sys.os == cc.sys.OS_IOS){
                jsb.reflection.callStaticMethod(this.IOS_API, "login");
            }
            else{
             
                console.log("platform:" + cc.sys.os + " dosn't implement share.");
            }
        } catch (e) {
               console.log("err:" + e);
        }finally{
            if(cc.fy && cc.fy.loading){
               // cc.fy.loading.hide();    
            }
        }
        
    },

    feedback:function(uid,username){
        if(cc.sys.os == cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod(this.ANDROID_API, "feedback", "(Ljava/lang/String;Ljava/lang/String;)V",uid,username);
        }
        else if(cc.sys.os == cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod(this.IOS_API, "feedback:nickName:",uid,username);
        }
        else{
            console.log("platform:" + cc.sys.os + " dosn't implement feedback.");
        }
    },
    
    share:function(title,desc,shareLink,shareType,iconUrl){
        // if (this.isNeedNewPack() == false) { //下载新包 使用闲聊功能
        //     return;
        // }
    //    示例  link = = "https://a.mlinks.cc/AKZJ?key="+encodeURIComponent("openPage=boxRoom&inviteCode="+12345);
        //shareLink =cc.
        if(shareLink == null)
        {
            shareLink = cc.InviteLink;
        }
        if(iconUrl == null)
        {
            iconUrl = "http://fyweb.51v.cn/szmj/images/icon.png";
        }
        if(shareType != "2")
        {
            shareType = "1";
        }
        if(shareType == "2")
        {
            title = desc;
        }
       // console.log(cc.sys.os);
       // console.log(cc.sys.OS_ANDROID);
       // console.log(cc.sys.OS_IOS);

        console.log(shareLink);
        if(cc.sys.os == cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod(this.ANDROID_API, "Share", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V",shareLink,title,desc,shareType,iconUrl);
        }
        else if(cc.sys.os == cc.sys.OS_IOS){
            try
            {
                //shareType:1 朋友   2 朋友圈 注意参数都必须是string 比如必须是 "1" 而不是 1
                jsb.reflection.callStaticMethod(this.IOS_API, "share:shareTitle:shareDesc:shareType:iconUrl:",shareLink,title,desc,shareType,iconUrl);
            }catch(e)
            {
                jsb.reflection.callStaticMethod(this.IOS_API, "share:shareTitle:shareDesc:",shareLink,title,desc);
            }          
        }
        else{
            console.log("platform:" + cc.sys.os + " dosn't implement share.");
        }

        //测试用
       // cc.fy.anysdkMgr.onPlatformMsg(null);
    },
    
    shareResult:function(shareType){
        console.log("shareResult");
        // if (this.isNeedNewPack() == false) { //下载新包 使用闲聊功能
        //     return;
        // }

        if(shareType != "2")
        {
            shareType = "1";
        }

        if(shareType == "2")
        {
            // this.onShareMomentWebActive(1);先注释掉，web压力过大
        }

        if(this._isCapturing){
            return;
        }
        this._isCapturing = true;
        var size = cc.director.getWinSize();
        var currentDate = new Date();
        var fileName = "result_share.jpg";
        var fullPath = jsb.fileUtils.getWritablePath() + fileName;
        if(jsb.fileUtils.isFileExist(fullPath)){
            jsb.fileUtils.removeFile(fullPath);
        }

        var texture = new cc.RenderTexture(Math.floor(size.width), Math.floor(size.height),cc.Texture2D.PIXEL_FORMAT_RGBA8888, gl.DEPTH24_STENCIL8_OES);
        texture.setPosition(cc.p(size.width/2, size.height/2));
        texture.begin();
        cc.director.getRunningScene().visit();
        texture.end();
        texture.saveToFile(fileName, cc.IMAGE_FORMAT_JPG);
        
        console.log("shareResult1"+fullPath);

        var self = this;
        var tryTimes = 0;
        var fn = function(){
            if(jsb.fileUtils.isFileExist(fullPath)){
                var height = 100;
                var scale = height/size.height;
			    var width = Math.floor(size.width * scale);
                 console.log("Capturing fullPath:",fullPath,100,100,shareType);
                if(cc.sys.os == cc.sys.OS_ANDROID){ 
                    console.log("shareResult ShareIMG shareType:"+shareType);
                    jsb.reflection.callStaticMethod(self.ANDROID_API, "ShareIMG", "(Ljava/lang/String;IILjava/lang/String;)V",fullPath,100,100,shareType);
                }else if(cc.sys.os == cc.sys.OS_IOS){  
                    jsb.reflection.callStaticMethod(self.IOS_API, "shareIMG:width:height:shareType:",fullPath,100,100,shareType);
                }
                else{
                    console.log("platform:" + cc.sys.os + " dosn't implement share.");
                }
                self._isCapturing = false;
            }
            else{
                tryTimes++;
                if(tryTimes > 10){
                    console.log("time out...");
                    return;
                }
                setTimeout(fn,50); 
            }
        }
        setTimeout(fn,50);
    },

    shareImg:function(fullPath,shareType,callbackArg)
    {
        if(shareType != "2")
        {
            shareType = "1";
        }
        if(callbackArg == null)
        {
            callbackArg = "";
        }

        //console.log("shareImg fullPath:"+fullPath);
        //测试代码
        //cc.fy.anysdkMgr.onPlatformMsg("2|0|hall1");//test

        if(cc.sys.os == cc.sys.OS_ANDROID){ 
            jsb.reflection.callStaticMethod(this.ANDROID_API, "ShareIMG", "(Ljava/lang/String;IILjava/lang/String;Ljava/lang/String;)V",fullPath,100,100,shareType,callbackArg);
        }else if(cc.sys.os == cc.sys.OS_IOS){  
            jsb.reflection.callStaticMethod(this.IOS_API, "shareIMG:width:height:shareType:param:",fullPath,100,100,shareType,callbackArg);
        }
        else{
            console.log("platform:" + cc.sys.os + " dosn't implement share.");
        }
    },
    
    onLoginResp:function(code){
        var fn = function(ret){
            if(ret.errcode == 0){
                cc.fy.localStorage.setItem("wx_account",ret.account);
                cc.fy.localStorage.setItem("wx_sign",ret.sign);
            }
            cc.fy.userMgr.onAuth(ret);
        }
       // http://106.15.64.139:32100/wechat_auth?code=011C9G071bgKhM1kIlZ61HSw071C9G0U&os=iOS&signature=cc3bae77f63be47f1a57366141474159
        // var signature ="cc3bae77f63be47f1a57366141474159";
        // var _code="011C9G071bgKhM1kIlZ61HSw071C9G0U";
        // var _os = "IOS";
        // cc.fy.http.sendRequest("/wechat_auth",{code:_code,os:_os},fn,null,null,signature,null);
        cc.fy.http.sendRequest("/wechat_auth",{code:code,os:cc.sys.os},fn);
    },

    // 获取邀请数据
    getInviteData:function()
    {
        if(!cc.sys.isNative && cc.sys.isMobile){
           return;
        }

        if(cc.sys.os == cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod(this.ANDROID_API,"getSchemaPragma","()V");
        }
        else if(cc.sys.os == cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod(this.IOS_API,"getSchemaPragma")
        }
        else{
            console.log("platform:" + cc.sys.os + " dosn't implement getInviteData(getSchemaPragma).");
        }
        
        //测试用例
        // cc.fy.anysdkMgr.onGetSchemaPragma("openPage=club&inviteCode=095797")
        // cc.fy.anysdkMgr.onGetSchemaPragma()
    },

    onPlatformMsg:function(code){
  //      cc.fy.anysdkMgr.onPlatformMsg()
 //        WXSuccess           = 0, //一般不会传过来
//        WXErrCodeCommon     = -1,
//        WXErrCodeUserCancel = -2,
//        WXErrCodeSentFail   = -3,
//        WXErrCodeAuthDeny   = -4,
//        WXErrCodeUnsupport  = -5,
        if(code == null)
        {
            return;
        }
        var inCode =  parseInt(code);
        var errStr = "";
        switch(inCode)
        {
            case 0:
                errStr = "成功";
                break;
            case -1:
                errStr = "失败";
                break;
            case -2:
                errStr = "用户取消";
                break;
            case -3:
                errStr = "发送失败";
                break;
            case -4:
                errStr = "验证失败";
                break;
            case -5:
                errStr = "不支持";
                break;
        }
        console.log(inCode+"-tdh11："+errStr);
        if(errStr != "")
        {
             if(cc.fy.hintBox == null){
                    var HintBox = require("HintBox");
                    cc.fy.hintBox = new HintBox();
                }
            cc.fy.hintBox.show(errStr);
        }
      
    },
    
    onGetSchemaPragma:function(code){
        // onGetSchemaPragma code示例: openPage=boxRoom&inviteCode=12345
        console.log("onGetSchemaPragma:" + code);
        if(code == null || code == ""){
            return;
        }
        code = code.toString();

        var temp0,temp1,temp2,op,code;
        temp0 = code.split("&");
        if(temp0 && temp0.length > 0){
            temp1 = temp0[0].split("=");
            if(temp0[1]){
                temp2 = temp0[1].split("=");
            }
            if(temp1){
                op = temp1[1];
            }
            if(temp2){
                code = temp2[1];
            }
            
        }
        var inviteData = {
            openPage:op,
            inviteCode:code,
        };
        console.log(inviteData);

        if(inviteData.openPage == "boxRoom")
        {
            console.log("--> inviteCode code:", this._inviteCode);
            if ( this._inviteCode != null && this._inviteCode == code) {
                return;
            }
            
            if(cc.fy.gameNetMgr.roomId != null && cc.fy.gameNetMgr.seatIndex == 0)//房主
            {
                cc.fy.hintBox.show("您是房主，需要先解散该房间才能进入别的房间");
            }
            else
            {
                if(cc.fy.userMgr.roomData != null || cc.fy.gameNetMgr.roomId != null)
                {
                    // cc.fy.net.send("exit");
                    cc.fy.userMgr.roomData = null;
                }
                var _roomId = inviteData.inviteCode;
                console.log("roomId:"+_roomId);
                cc.fy.userMgr.enterRoom(_roomId);
            }
        }
        else if(inviteData.openPage == "history"){
            // 分享码
            console.log(inviteData.inviteCode);
            cc.fy.replayMgr.getDetailOfGameByCode(inviteData.inviteCode);
        }
        else if(inviteData.openPage == "club"){
            // 分享码
            // console.log("收到俱乐部的");
            // console.log(inviteData.inviteCode);
            // cc.fy.clubMgr.isInClub(inviteData.inviteCode);
            cc.fy.guildMainMsg.isInClub(inviteData.inviteCode);
        }

        this._inviteCode = code;
        
    },

    // 获取玩家地理位置
    getGeoLocation:function()
    {
        try
        {
            console.log("run getGeoLocation");
            // 测试用   31.299910 经度:120.661707    '31.298011|120.661959'
            // cc.fy.anysdkMgr.onGetGeoLocation('31.299910|120.661707|东环哎哎哎');
            // cc.fy.anysdkMgr.onGetGeoLocation('31.299910|120.661707|(null) (null) (null) (null))');

            if(cc.sys.os == cc.sys.OS_ANDROID){
                jsb.reflection.callStaticMethod(this.ANDROID_API,"getGeoLocation","()V");
            }
            else if(cc.sys.os == cc.sys.OS_IOS){
                jsb.reflection.callStaticMethod(this.IOS_API,"getGeoLocation")
            }
            else{
                cc.fy.anysdkMgr.onGetGeoLocation('31.299910|120.661707|东环哎哎哎');
                cc.fy.anysdkMgr.onGetGeoLocation('31.299910|120.661707|(null) (null) (null) (null))');
                console.log("platform:" + cc.sys.os + " dosn't implement getGeoLocation.");
            }
        }catch(e)
        {
            cc.log("dosn't implement getGeoLocation." + e.message)
        }
        
    },

    onGetGeoLocation:function(code)
    { 
         
        if (cc.fy.gotLocation && cc.fy.gotLocation == true) {
            return;
        }
        console.log("onGetGeoLocation:"+code);
        // var dis = cc.fy.anysdkMgr.getDisance(31.299910,120.661707,31.298011,120.661959);
        //console.log('计算距离:'+dis);

        //"维度：" + Latitude() +"|" + "经度：" + Longitude;
        //code 格式 31.298011|120.661959  如果获取不到则是 0|0
        var arr = code.split("|");
        var arr2 = arr[2].split(" ");

        var locationStr = "";
        var nullNum = 4;
        for (var i = 0; i < arr2.length; i++) {
            if(arr2[i].indexOf("null") == -1){
                locationStr = locationStr + arr2[i];
                nullNum --;
            }
        }
        
        if(locationStr && locationStr!="")
        {
            var data = 
            {
                latitude:arr[0],//纬度
                longitude:arr[1],//经度
                location:locationStr,//位置
            }
            // cc.eventManager.dispatchCustomEvent("setGeoLocation", {data:data});
            if(data.location != null && nullNum == 0){
                var locationTemp = data.location;
                var locationTemp = locationTemp.substring(0, locationTemp.length - 3) + "***";
                data.location = locationTemp;
                console.log(locationTemp);
            }
            cc.fy.gotLocation = true;
            cc.fy.userMgr.setGeoLocation(data);
            return;
        }
        else{
            console.log("启动百度");
            var url = 'http://api.map.baidu.com/geocoder/v2/';
            cc.fy.http = require("HTTP");
            var xhr = null;
            var data = {
                ak:'eIxDStjzbtH0WtU50gqdXYCz',
                output:'json',
                pois:'1',
                location:arr[0] + ',' + arr[1],
            }

            //解析经纬度
            var fnRequest = function()
            {
                xhr = cc.fy.http.sendRequest("",data,function(ret){
                    xhr = null;
                    console.log(ret.status);
                        if (parseInt(ret.status) == 0) 
                        {
                            // var result = '地址：' + ret.result.formatted_address + '</br>';
                            // result += '省名:' + ret.result.addressComponent.province + '</br>';
                            // result += '城市名:' + ret.result.addressComponent.city + '</br>';
                            // result += '区县名:' + ret.result.addressComponent.district + '</br>';
                            // result += '街道名:' + ret.result.addressComponent.street + '</br>';
                            //result += '街道门牌号:' + ret.result.addressComponent.street_number + '</br>';
                            //result += '周边信息：</br>';
                           
                            // var result = ret.result.addressComponent.district + ret.result.addressComponent.street+ret.result.addressComponent.street_number;
                            var result = ret.result.addressComponent.district + ret.result.addressComponent.street;
                            var data = 
                            {
                                latitude:arr[0],//纬度
                                longitude:arr[1],//经度
                                location:result,//位置
                            }
                            cc.fy.gotLocation = true;
                            cc.fy.userMgr.setGeoLocation(data);
                            // cc.eventManager.dispatchCustomEvent("setGeoLocation", {data:data});
                        }

                },url);         
            }

            fnRequest();
        }
    },

    // 内购 productId 为苹果后台配置的项 比如 com.javgame.8card
    onIap:function(productId)
    {
        if(!cc.sys.isNative && cc.sys.isMobile){
           return;
        }
        try
        {
            console.log("onIap："+productId);
            
            //测试用代码
            // cc.fy.anysdkMgr.onIapResp('0|'+productId+'|receiptStr');
            //内购测试用代码结束

            if(cc.sys.os == cc.sys.OS_ANDROID){
                //jsb.reflection.callStaticMethod(this.ANDROID_API,"getGeoLocation","()V");
            }
            else if(cc.sys.os == cc.sys.OS_IOS){
                jsb.reflection.callStaticMethod(this.IOS_API,"onIap:",productId);
            }
            else{
                console.log("platform:" + cc.sys.os + " dosn't implement onIap.");
            }
        }catch(e)
        {
            cc.log("dosn't implement onIap." + e.message);
        }
        
    },

    //内购成功回调
    onIapResp:function(code)
    {
        //code 示例   成功与否|商品id|消息
        //用户取消或失败这时商品id会是“（null）”   -1|(null)|用户取消
        //购买成功，正常情况下receiptStr是丢给服务器做验证的 0|com.javgame.8card|receiptStr
         console.log("onIapResp code："+code);
        //code 定义 “success|
        cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_BUYCALLBACK_CTC, {code:code});
    },

    //地理位置计算用
    toRad:function(d) 
    {
        return d * Math.PI / 180; 
    },

    //#lat为纬度, lng为经度, 一定不要弄错 getDisance(39.91917,116.3896,39.91726,116.3940)
    getDisance:function(lat1, lng1, lat2, lng2) 
    { 
        var dis = 0;
        var radLat1 = cc.fy.anysdkMgr.toRad(lat1);
        var radLat2 = cc.fy.anysdkMgr.toRad(lat2);
        var deltaLat = radLat1 - radLat2;
        var deltaLng = cc.fy.anysdkMgr.toRad(lng1) - cc.fy.anysdkMgr.toRad(lng2);
        var dis = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(deltaLng / 2), 2)));
        var realDis = dis * 6378137;
        var parseIntDis = parseInt(realDis);
        return parseIntDis;
    },

    //复制到手机粘贴板，再跳转微信
    copyAndJump:function(copyMsg,jumpToWechat){
         console.log("copyMsg,jumpToWechat:",copyMsg,jumpToWechat+"");
        if(cc.sys.os == cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod(this.ANDROID_API, "copyToBoard", "(Ljava/lang/String;Ljava/lang/String;)V",copyMsg+"",jumpToWechat+"");
        }
        else if(cc.sys.os == cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod(this.IOS_API, "copyToBoard:jumpToWechat:",copyMsg+"",jumpToWechat+"");
        }
        else{
            console.log("platform:" + cc.sys.os + " dosn't implement copyToBoard.");
        }
    },

    //开始定位，这个一般不需要主动调，游戏启动的时候会自动调用
    startGeoLocation:function(){
        if(cc.sys.os == cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod(this.ANDROID_API, "startGeoLocation", "()V");
        }
        else if(cc.sys.os == cc.sys.OS_IOS){
            console.log("callStaticMethod startGeoLocation");
            jsb.reflection.callStaticMethod(this.IOS_API, "startGeoLocation");
        }
        else{
            console.log("platform:" + cc.sys.os + " dosn't implement startGeoLocation.");
        }
    },

    //获取系统粘贴板内容
    getPasteBoard:function(){
        if(cc.sys.os == cc.sys.OS_ANDROID){
           return jsb.reflection.callStaticMethod(this.ANDROID_API, "getPasteBoard", "()Ljava/lang/String;");
        }
        else if(cc.sys.os == cc.sys.OS_IOS){
            console.log("callStaticMethod getPasteBoard");
            return jsb.reflection.callStaticMethod(this.IOS_API, "getPasteBoard");
        }
        else{
            console.log("platform:" + cc.sys.os + " dosn't implement getPasteBoard.");
        }
        return "";
    },

    isWXAppInstalled:function(){ 
        if(cc.sys.os == cc.sys.OS_IOS){
            try{
                var isWXAppInstalled = "" + jsb.reflection.callStaticMethod("AppController", "getInfo:","isWXAppInstalled")
                if(isWXAppInstalled == "true"){
                    return 0;          
                }
                else{
                    return -1;
                }
            }catch(e)
            {
               return 1
            }
        }
    },

    //闲聊开始
   //是否安装闲聊
   isXianliaoInstalled:function(){
        console.log("isXianliaoInstalled");
        let isInstalled = false
        try{
            if(cc.sys.os == cc.sys.OS_ANDROID){
                isInstalled = jsb.reflection.callStaticMethod(this.ANDROID_XLAPI,"isXianliaoInstalled","()Ljava/lang/String;");
            }
            else if(cc.sys.os == cc.sys.OS_IOS){
                isInstalled = jsb.reflection.callStaticMethod(this.IOS_API, "IsXianliaoInstalled");
            }
        }catch(e)
        {
            return false;
        }
    
        console.log("isXianliaoInstalled:",isInstalled);
        return isInstalled;
   },

    //闲聊登录
    xianLiaoLogin:function(){
        console.log("xianLiaoLogin");
        if(cc.sys.os == cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod(this.ANDROID_XLAPI,"xianliaologin","()V");
        }
        else if(cc.sys.os == cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod(this.IOS_API, "XianliaoLogin");
        }
        else{
            console.log("platform:" + cc.sys.os + " dosn't implement xianLiaoLogin.");
        }
    },

    //闲聊文字分享
    xianLiaoShareText:function(text){
        if(cc.sys.os == cc.sys.OS_ANDROID){
            console.log("xianLiaoShareText android");
            jsb.reflection.callStaticMethod(this.ANDROID_XLAPI, "shareText","(Ljava/lang/String;)V",text);
        }
        else if(cc.sys.os == cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod(this.IOS_API, "XianliaoShareText:",text);
        }
        else{
            console.log("platform:" + cc.sys.os + " dosn't implement xianLiaoShareText.");
        }
    },

    //闲聊本地图片分享
    xianLiaoShareDataImage:function(){
        // if (this.isNeedNewPack() == false) { //下载新包 使用闲聊功能
        //     return;
        // }
        if(this._isCapturing){
            return;
        }
        this._isCapturing = true;
        var size = cc.director.getWinSize();
        var currentDate = new Date();
        var fileName = "result_share.jpg";
        var fullPath = jsb.fileUtils.getWritablePath() + fileName;
        if(jsb.fileUtils.isFileExist(fullPath)){
            jsb.fileUtils.removeFile(fullPath);
        }

        var texture = new cc.RenderTexture(Math.floor(size.width), Math.floor(size.height),cc.Texture2D.PIXEL_FORMAT_RGBA8888, gl.DEPTH24_STENCIL8_OES);
        texture.setPosition(cc.p(size.width/2, size.height/2));
        texture.begin();
        cc.director.getRunningScene().visit();
        texture.end();
        texture.saveToFile(fileName, cc.IMAGE_FORMAT_JPG);
        
        var self = this;
        var tryTimes = 0;
        var fn = function(){
            if(jsb.fileUtils.isFileExist(fullPath)){
                var height = 100;
                var scale = height/size.height;
                var width = Math.floor(size.width * scale);
                console.log("Capturing fullPath:" + fullPath,width,height);
                if(cc.sys.os == cc.sys.OS_ANDROID){    
                    try{
                        jsb.reflection.callStaticMethod(self.ANDROID_XLAPI, "shareImage", "(Ljava/lang/String;II)V",fullPath,200,400);
                    }catch(e){

                    }finally{
                    }
                }
                else if(cc.sys.os == cc.sys.OS_IOS){
                    try{
                        jsb.reflection.callStaticMethod(self.IOS_API, "XianliaoShareDataImage:",fullPath);
                    }catch(e){

                    }finally{
                    }
                }
                else{
                    console.log("platform:" + cc.sys.os + " dosn't implement xianLiaoShareDataImage.");
                }
                self._isCapturing = false;
            }
            else{
                tryTimes++;
                if(tryTimes > 10){
                    console.log("time out...");
                    return;
                }
                setTimeout(fn,50); 
            }
        }
        setTimeout(fn,50);
    },

    //闲聊网络图片分享
    xianLiaoShareUrlImage:function(url){
        if(cc.sys.os == cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod(this.ANDROID_XLAPI, "shareWebImage", "(Ljava/lang/String;)V",url);
        }
        else if(cc.sys.os == cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod(this.IOS_API, "XianliaoShareUrlImage:",url);
        }
        else{
            console.log("platform:" + cc.sys.os + " dosn't implement xianLiaoShareUrlImage.");
        }
    },

    //闲聊游戏分享,邀请
    xianLiaoShareGame:function(roomid,roomtoken,title,text,url){
        console.log("xianLiaoShareGame:",roomid,roomtoken,title,text,url);
        // if (this.isNeedNewPack() == false) { //下载新包 使用闲聊功能
           
        //     return;
        // }

        if(cc.sys.os == cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod(this.ANDROID_XLAPI,"onInvite","(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V",roomid,roomtoken,title,text,url);
        }
        else if(cc.sys.os == cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod(this.IOS_API, "XianliaoShareGame:GameRoomToken:GameTitle:GameText:GameImgUrl:",roomid,roomtoken,title,text,url);
        }
        else{
            console.log("platform:" + cc.sys.os + " dosn't implement xianLiaoShareGame.");
        }
    },

    onXianLiaoLoginResult:function(res){
        console.log("闲聊登录结果: " , res);
        //失败取消不一定有返回
        if (res == null) return;
        let arr = res.split("|");
        // if(cc.fy.hintBox == null){
        //     var HintBox = require("HintBox");
        //     cc.fy.hintBox = new HintBox();
        // }
        if (arr[0] == 0) {
            //登录成功
            let code = arr[1];
            // cc.fy.hintBox.show(code);
            this.onXLLoginResp(code);
        }
        else if (arr[0] == 1) {
            //登录取消
            // cc.fy.hintBox.show("登录取消");
        }
        else if(arr[0] == 2){
            //登录失败
            // cc.fy.hintBox.show("登录失败");
        }
        else{
            //未知错误
            // cc.fy.hintBox.show("未知错误");
        }
    },

    onXLLoginResp:function(code){
        console.log("=======================================>> onXLLoginResp");
        var fn = function(ret){
            if(ret.errcode == 0){
                cc.fy.localStorage.setItem("wx_account",ret.account);
                cc.fy.localStorage.setItem("wx_sign",ret.sign);
            }
            cc.fy.userMgr.onAuth(ret);
        }
        cc.fy.http.sendRequest("/nl_auth",{code:code,os:cc.sys.os},fn);
    },

    onXianLiaoShareResult:function(res){
        console.log("闲聊分享结果: " , res);
        //失败取消不一定有返回
        if (res == null) return;
        let arr = res.split("|");
        // if(cc.fy.hintBox == null){
        //     var HintBox = require("HintBox");
        //     cc.fy.hintBox = new HintBox();
        // }
        if (arr[0] == 0) {
            //分享成功
            // cc.fy.hintBox.show("分享成功");
        }
        else if (arr[0] == 1) {
            //分享取消
            // cc.fy.hintBox.show("分享取消");
        }
        else if(arr[0] == 2){
            //分享失败
            // cc.fy.hintBox.show("分享失败");
        }
        else{
            //未知错误
            // cc.fy.hintBox.show("未知错误");
        }
    },

    onGetXianLiaoSchemaPragma:function(code){
        console.log("onGetXianLiaoSchemaPragma:" + code);
        if(code==null || code=="")
        {
            return;
        }    
        let arr = code.split("|");
        console.log(arr);
        let roomToken = arr[0];
        let roomId = arr[1];
        let openId = arr[2];

        if(roomId != null)
        {

            console.log("roomId:"+roomId,"roomToken:"+roomToken,"openId:"+openId);
           // if(roomToken == "boxRoom")
           // {
                if(cc.fy.gameNetMgr.roomId != null && cc.fy.gameNetMgr.seatIndex == 0)//房主
                {
                    cc.fy.hintBox.show("您是房主，需要先解散该房间才能进入别的房间");
                }
                else
                {
                    if(cc.fy.userMgr.roomData != null || cc.fy.gameNetMgr.roomId != null)
                    {
                        // cc.fy.net.send("exit");
                        cc.fy.userMgr.roomData = null;
                    }
                    var _roomId = roomId;
                    console.log("roomId:"+_roomId);
                    cc.fy.userMgr.enterRoom(_roomId);
                }
           // }
        }
    },

    showMessage:function(msg){
        if(cc.fy.hintBox == null){
            var HintBox = require("HintBox");
            cc.fy.hintBox = new HintBox();
        }
        cc.fy.hintBox.show(msg);
    },
    //闲聊结束
    
    
    //默往


    //安装
    isMoWangInstalled:function(){
        return true;
        //好像这接口时灵时不灵。。
        if(cc.sys.os == cc.sys.OS_ANDROID){
           return  jsb.reflection.callStaticMethod(this.ANDROID_MOWANGAPI,"IsMoWangInstalled","()I");
        }
        else if(cc.sys.os == cc.sys.OS_IOS){
          return  jsb.reflection.callStaticMethod(this.IOS_API, "IsInstallAction");
        }
        return false;
       
    },
    //登录
    MoWangLogin:function(){
         console.log("MoWangLogin");
        if(cc.sys.os == cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod(this.ANDROID_MOWANGAPI,"MoWangLogin","()V");
        }
        else if(cc.sys.os == cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod(this.IOS_API, "MoWangLogin");
        }
        else{
            console.log("platform:" + cc.sys.os + " dosn't implement MoWangLogin.");
        }
    },


    //登录回调结果
     onMWLoginResp:function(code){
        console.log("=======================================>> onMWLoginResp");
        var fn = function(ret){
            if(ret.errcode == 0){
                cc.fy.localStorage.setItem("wx_account",ret.account);
                cc.fy.localStorage.setItem("wx_sign",ret.sign);
            }
            cc.fy.userMgr.onAuth(ret);
        }
        cc.fy.http.sendRequest("/mw_auth",{code:code,os:cc.sys.os},fn);
    },

    //默往IOS回调
    onMWLoginResp:function(path,code){
        console.log("IOS回调：",path,code);
    },
    //默往本地图片分享
    MoWangShareDataImage:function(){
        // if (this.isNeedNewPack() == false) { //下载新包 使用闲聊功能
        //     return;
        // }
        if(this._isCapturing){
            return;
        }
        // if(!this.isMoWangInstalled()){
        //     cc.sys.openURL("http://www.mostonetech.com/download");
        //     return;
        // }
        this._isCapturing = true;
        var size = cc.director.getWinSize();
        var currentDate = new Date();
        var fileName = "result_share.jpg";
        var fullPath = jsb.fileUtils.getWritablePath() + fileName;
        if(jsb.fileUtils.isFileExist(fullPath)){
            jsb.fileUtils.removeFile(fullPath);
        }

        var texture = new cc.RenderTexture(Math.floor(size.width), Math.floor(size.height),cc.Texture2D.PIXEL_FORMAT_RGBA8888, gl.DEPTH24_STENCIL8_OES);
        texture.setPosition(cc.p(size.width/2, size.height/2));
        texture.begin();
        cc.director.getRunningScene().visit();
        texture.end();
        texture.saveToFile(fileName, cc.IMAGE_FORMAT_JPG);
        
        var self = this;
        var tryTimes = 0;
        var fn = function(){
            if(jsb.fileUtils.isFileExist(fullPath)){
                var height = 100;
                var scale = height/size.height;
                var width = Math.floor(size.width * scale);
                console.log("Capturing fullPath:" + fullPath,width,height);
                if(cc.sys.os == cc.sys.OS_ANDROID){    
                    try{
                        jsb.reflection.callStaticMethod(self.ANDROID_MOWANGAPI, "shareImage", "(Ljava/lang/String;II)V",fullPath,200,400);
                    }catch(e){

                    }finally{
                    }
                }
                else if(cc.sys.os == cc.sys.OS_IOS){
                    try{
                        jsb.reflection.callStaticMethod(self.IOS_API, "shareMoWangImage:",fullPath);
                    }catch(e){

                    }finally{
                    }
                }
                else{
                    console.log("platform:" + cc.sys.os + " dosn't implement xianLiaoShareDataImage.");
                }
                self._isCapturing = false;
            }
            else{
                tryTimes++;
                if(tryTimes > 10){
                    console.log("time out...");
                    return;
                }
                setTimeout(fn,50); 
            }
        }
        setTimeout(fn,50);
    },

    //默往游戏分享,邀请 ,sharetype:1邀请 ，2链接 ；type:club,game;roomid;
    MoWangShare:function(shareType,type,roomid,title,content,inviteUrl){
        console.log("xianLiaoShareGame:",shareType,type,roomid,title,content,inviteUrl);
        // if(!this.isMoWangInstalled()){
        //     cc.sys.openURL("http://www.mostonetech.com/download");
        //     return;
        // }
        var iconurl ="http://fyweb.51v.cn/szmj/images/icon.png";
        if(cc.sys.os == cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod(this.ANDROID_MOWANGAPI,"shareCard","(II;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V",shareType,type,roomid,title,content,iconurl,inviteUrl);
        }
        else if(cc.sys.os == cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod(this.IOS_API, "shareCard:GameRoomToken:GameTitle:GameText:GameImgUrl:",roomid,roomtoken,title,text,url);
        }
        else{
            console.log("platform:" + cc.sys.os + " dosn't implement shareCard.");
        }
    },

    //默往分享链接
    MoWangShareLink:function(title,info,linkUrl,icon){
        //  if(!this.isMoWangInstalled()){
        //     cc.sys.openURL("http://www.mostonetech.com/download");
        //     return;
        // }
        if(linkUrl==null){
            linkUrl = cc.InviteLink;
        }
        if(icon==null){
            icon ="http://fyweb.51v.cn/szmj/images/icon.png";
        }
        console.log("MoWangShareLink",title,info,linkUrl,icon);
        if(cc.sys.os == cc.sys.OS_ANDROID){
            jsb.reflection.callStaticMethod(this.ANDROID_MOWANGAPI,"MShareLink","(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V",title,info,linkUrl,icon);
        }else if(cc.sys.os == cc.sys.OS_IOS){
            jsb.reflection.callStaticMethod(this.IOS_API, "shareMoWangLink:title:info:icon:",linkUrl,title,info,icon);
        }else{
             console.log("platform:" + cc.sys.os + " dosn't implement MoWangShareLink.");
        }
    },

    //默往结束

    //微信支付
    //{
    //    "appid": "wxb4ba3c02aa476ea1",   //由用户微信号和AppID组成的唯一标识，用于校验微信用户
    //    "noncestr": "d1e6ecd5993ad2d06a9f50da607c971c", // 随机编码，为了防止重复的，在后台生成
    //    "package": "Sign=WXPay",    //根据财付通文档填写的数据和签名  这个比较特殊，是固定的，只能是即req.package = Sign=WXPay
    //    "partnerid": "10000100",   // 商家id，在注册的时候给的
    //    "prepayid": "wx20160218122935e3753eda1f0066087993",  // 预支付订单这个是后台跟微信服务器交互后，微信服务器传给你们服务器的，你们服务器再传给你
    //    "timestamp": "1455769775",   // 这个是时间戳，也是在后台生成的，为了验证支付的
    //    "sign": "F6DEE4ADD82217782919A1696500AF06"   // 这个签名也是后台做的
    //}
    //生成prepayid、签名sign后调用微信SDK发起支付
    //+ (void)WXPay:(NSString*)prepayId noncestr:(NSString*)noncestr timestamp:(NSString*)timestamp sign:(NSString*)sign
    //String prepayId,String noncestr,String timestamp,String sign
    WXPay:function(appId, partnerId, prepayId,noncestr,timestamp,sign){
        // console.log("callWxPay",prepayId,noncestr,timestamp,sign);
        // if (this.isNeedNewPack() == false) { //下载新包 使用闲聊功能
        //     return;
        // }
        
       if(cc.sys.os == cc.sys.OS_ANDROID){
           if(appId == null || partnerId == null){
               jsb.reflection.callStaticMethod(this.ANDROID_API, "WXPay", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V",prepayId+"",noncestr+"",timestamp+"",sign+"");
           }
           else{
               jsb.reflection.callStaticMethod(this.ANDROID_API, "WXPayByAppId", "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V",appId+"",partnerId+"",prepayId+"",noncestr+"",timestamp+"",sign+"");
           }
       }
       else if(cc.sys.os == cc.sys.OS_IOS){
           if(appId == null || partnerId == null){
               jsb.reflection.callStaticMethod(this.IOS_API, "WXPay:noncestr:timestamp:sign:",prepayId+"",noncestr+"",timestamp+"",sign+"");
           }
           else{
               //WXPayByAppId
               //+(void) WXPayByAppId:(NSString*)appId partnerId:(NSString*)partnerId prepayId:(NSString*)prepayId noncestr:(NSString*)noncestr timestamp:(NSString*)timestamp sign:(NSString*)sign
               jsb.reflection.callStaticMethod(this.IOS_API, "WXPayByAppId:partnerId:prepayId:noncestr:timestamp:sign:",appId+"",partnerId+"",prepayId+"",noncestr+"",timestamp+"",sign+"");
           }
           
       }
       else{
           console.log("platform:" + cc.sys.os + " dosn't implement WXPay.");
       }
   },

   //微信支付成功后手机平台回调
   onPayResp:function(errCode)
   {
       console.log(" pay errCode " + errCode);
       if(parseInt(errCode) == 0)//支付成功
       {
           console.log(" pay succeed ");
           cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_BUYCALLBACK_CTC, {code:errCode});
       }
   },

   // 判断新旧包
   isNeedNewPack:function(){
        var versionCode = 0;
        var isNewPack = false;
        // if (!cc.sys.isNative) {
        //     return true;
        // }

        var updateBao = setTimeout(function(){
            cc.fy.alert.show("您当前游戏版本过低，部分功能暂不支持，为保障游戏正常使用，请卸载游戏后安装，点击‘确认’前往下载新版本。", function () {
                cc.sys.openURL("http://fyweb.51v.cn/szmj/");
            }, true);
        },1000);
        try
        {
            if(cc.sys.os == cc.sys.OS_ANDROID){
                versionCode = jsb.reflection.callStaticMethod(this.ANDROID_API, "getInfo","(Ljava/lang/String;)Ljava/lang/String;","versionCode");
                
            }
            else if(cc.sys.os == cc.sys.OS_IOS){
                versionCode = jsb.reflection.callStaticMethod(this.IOS_API, "getInfo:","versionCode");
            }
            else{
            }
            // console.log("-----> versionCode ", versionCode);

        }catch(e)
        {
            console.log("checkout versionCode error:"+e); 
        }

        if (isNaN(versionCode)) {
            console.log("-----> versionCode ", versionCode);
            versionCode = 0;
        }
        
        clearTimeout(updateBao);
        if(cc.sys.os == cc.sys.OS_ANDROID){
            isNewPack = parseInt(versionCode) >= 106;
        }
        else if(cc.sys.os == cc.sys.OS_IOS){

            isNewPack = parseInt(versionCode) >= 103;
        }
        if(isNewPack == false)
        {
            //老包没有该功能需要更新新版本
            cc.fy.alert.show("您当前游戏版本过低，部分功能暂不支持，为保障游戏正常使用，请卸载游戏后安装，点击‘确认’前往下载新版本。", function () {
                cc.sys.openURL("http://fyweb.51v.cn/szmj/");
            }, true);
        }
        console.log("---> isNewPack ", isNewPack);
        return isNewPack;
    },

    // 分享活动 行为 1 分享 2 登陆 。发给web记录的
    onShareMomentWebActive:function(action){
        console.log("-->onShareMomentWebActive ", action);
        if (action == null) {
            action = 1;
        }
        let gameid = cc.GAMEID;
        let userid =  cc.fy.userMgr.userId;
        let data = "action="+action+"&gameid="+gameid+"&userid="+userid+"&secret=718p76j28d4";//"&secret=1k18zavmpad";

        let autosignature = md5.hex_md5(data);
        let newdata = {
            gameid:gameid,
            userid:userid,
            action:action,
            signature:autosignature,
        };

        // var self = this;
        let onRec = function(ret){
            console.log("onShareMomentWebActiveret ", ret);
            // if(ret.code == 0){
            //     cc.fy.hintBox.show(ret.message);
            // }
        };

        let shareURl = cc.ACTIONAPIURL + "/gameassist";

        //cc.fy.http.sendRequest("/share_game", newdata, onRec, shareURl,3,autosignature,true);
        console.log("申请");
         cc.fy.http.sendRequest("/share_game", newdata, onRec, shareURl,null,autosignature,null);

    },

    //记录分享行为，直接向服务器发送,type:1 游戏下载链接 2 公众号文章
    onShareRecord:function(type){
        var onRec=function(data){
            console.log("weixinshare callback:",data);
        };
        cc.fy.http.sendRequest("/weixinshare",{userid:cc.fy.userMgr.userId,sharetype:type},onRec);
    },

    downloadImg(url, code, callback){
        let dirpath = jsb.fileUtils.getWritablePath() + '/headimg/';
        console.log("==>> downloadImg -->> dirPath: ", dirpath);
        // let filepath = dirpath + new Buffer(url, 'base64') + '.jpg';
        let filepath = dirpath + "head_" + code;

        if(jsb.fileUtils.isFileExist(filepath)){
            callback(0, filepath);
            return;
        }

        let saveFile = function(data){
            if(data){
                if(!jsb.fileUtils.isDirectoryExist(dirpath)){
                    jsb.fileUtils.createDirectory(dirpath);
                }
                if(jsb.fileUtils.writeDataToFile(new Uint8Array(data) , filepath)){
                    console.log('==>> Remote write file succeed.');
                    callback(0, filepath);
                }else{
                    console.log('==>> Remote write file failed.');
                }
            }else{
                console.log('==>> Remote download file failed.');
            }
        };

        let xhr = new XMLHttpRequest();
        xhr.responseType = 'arraybuffer';

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 ) {
                if(xhr.status == 200){
                    saveFile(xhr.response);
                }else{
                    saveFile(null);
                }
            }
        }.bind(this);
        xhr.open("GET", url, true);
        xhr.send();
    },

    cleanHeadImg(){
        cc.log("删除：" + jsb.fileUtils.getWritablePath() + '/headimg/');
        jsb.fileUtils.removeDirectory(jsb.fileUtils.getWritablePath() + '/headimg/');
        cc.fy.audioMgr.stopAllAudio()
        cc.game.restart();
    },

    //获取电池电量 ，返回值 0-100 ，int
    getBattery(){
        var level =0; 
        if(cc.sys.os == cc.sys.OS_ANDROID){
             level =jsb.reflection.callStaticMethod(this.ANDROID_APPACTIVITY, "getBattery","()I");
             console.log("android battery:    "+ level);
        }
        else if(cc.sys.os == cc.sys.OS_IOS){
             level=jsb.reflection.callStaticMethod(this.IOS_API, "getBattery");
              console.log("ios battery:    "+ level);
        }
        else{
            console.log("platform  cant get dianliang ");
        }
        
    },
    //获取wifi信号 ，返回值 0-100 ，int
    getWifiLevel(){
        var level =0; 
        if(cc.sys.os == cc.sys.OS_ANDROID){
            var wifi =jsb.reflection.callStaticMethod(this.ANDROID_APPACTIVITY, "getWifiLevel","()I");
             console.log("android wifi:    "+ wifi);
             if (wifi > -50 && wifi < 0) {//最强
                console.log("最强");
            } else if (wifi > -70 && wifi < -50) {//较强
                console.log("较强强");
            } else if (wifi > -80 && wifi < -70) {//较弱
                console.log("较弱");
            } else if (wifi > -100 && wifi < -80) {//微弱
                console.log("微弱");
            }else{
                console.log("没连wifi，或者断网");
            }
             
        }
        else if(cc.sys.os == cc.sys.OS_IOS){
             level=jsb.reflection.callStaticMethod(this.IOS_API, "getWifiLevel");
              console.log("ios wifi:    "+ level);
        }
        else{
            console.log("platform  cant get wifilevel ");
        }
        
    },

    //转换URL
    switchUrl:function(url,call){
        if(url==null || url==""){
            return ;
        }
        var onRec=function(ret){
            console.log("转换URL：",ret);
            if(call){
                call(ret);
            }
        };
        var reqData={
            url:url
        }
        cc.fy.http.sendRequest("/short-url", reqData, onRec,cc.CHANGEURL);
    },

    //ios传过来
    //监听屏幕旋转，ret : left,right,up,down
    onRotateScnene:function(ret){
        console.log("platform:",cc.sys.os);
        console.log("旋转方向，电池栏位置",ret);
    },

});
