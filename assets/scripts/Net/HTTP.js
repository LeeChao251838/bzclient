var md5 =  require("md5");

var HTTP = cc.Class({
    extends: cc.Component,

    statics:{
        sessionId : 0,
        userId : 0,
        master_url:cc.URL,
        url:cc.URL,
        httpTimer:{},
        sendCount:{},
        failurl:{},
        path:null,
        data:null,
        handler:null,
        noChangeUrl:null, // 不切换地址
        extraUrl:{}, // 指定的地址
        autoSignature:null, // 指定的Singnature
        private_key:"ZNuYh#i!@D",
        sendRequest : function(path,data,handler,extraUrl,stime,autoSignature,noChangeUrl){
            if(HTTP.sendCount[path] == null){
                HTTP.sendCount[path] = 0;
            }
            HTTP.path = path;
            HTTP.data = data;
            HTTP.handler = handler;
            HTTP.noChangeUrl = noChangeUrl;
            HTTP.autoSignature = autoSignature;
            HTTP.extraUrl[path] = extraUrl;
            var xhr = cc.loader.getXMLHttpRequest();
            xhr.timeout = 5000;

            var keys = [];
            var str = "?";
            for(var k in data){
                if(str != "?"){
                    str += "&";
                }
                str += k + "=" + data[k];

                keys.push(k);
            }

            if(HTTP.autoSignature == null){
                // 生成signature开始
                var code = HTTP.getCodeN(keys, data);
                code = code + HTTP.private_key;
              //  console.log("code:" + code);   //正式版本不要把这句注释打开，会泄密的！！！！
                var signature = md5.hex_md5(code);
                 //console.log("signature:" + signature);
                // 生成signature结束
                // 添加signature
                str += "&signature=" + signature;
                // 添加signature结束
            }

            var temp = HTTP.getUrlType(HTTP.url);
            if(extraUrl == null){
                extraUrl = temp;
            }
            else{
                extraUrl = HTTP.getUrlType(extraUrl);
            }
            console.log("extraUrl:" + extraUrl);
            var requestURL = extraUrl + path + encodeURI(str);
            console.log("RequestURL:" + requestURL);
            if(cc.logMgr){
                cc.logMgr.log(requestURL, "RequestURL : ");
            }
            // xhr.open("GET",requestURL, true);
            xhr.open("POST",requestURL, true);
            if (cc.sys.isNative){
                xhr.setRequestHeader("Accept-Encoding","gzip,deflate","text/html;charset=UTF-8");
            }
            
            xhr.onreadystatechange = function() {
                if(xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 300)){
                    console.log("http res("+ xhr.responseText.length + "):" + xhr.responseText);
                    try {
                        var ret = JSON.parse(xhr.responseText);
                        console.log(ret);
                        if(HTTP.httpTimer[path] != null){
                            clearTimeout(HTTP.httpTimer[path]);
                            HTTP.httpTimer[path] = null;
                            HTTP.sendCount[path] = 0;
                        }
                        if(handler !== null){
                            handler(ret);
                        }
                    } catch (e) {
                        console.log("err:" + e);
                        //handler(null);
                    }
                    finally{
                    }
                }
            };
            
            if(stime == null || stime > 0){
                var sCount = 5;
                if(stime != null){
                    sCount = stime;
                }
                if(HTTP.httpTimer[path] != null){
                    clearTimeout(HTTP.httpTimer[path]);
                    HTTP.httpTimer[path] = null;
                }
                HTTP.httpTimer[path] = setTimeout(function(){
                        if(xhr){
                            xhr.abort();
                        }
                        if(HTTP.sendCount[path] >= sCount)
                        {   
                            var rett = {
                                errcode:-111,
                                errmsg:"连接服务器超时！",
                            };
                            if(handler != null){
                                handler(rett);
                            }
                            if(HTTP.httpTimer[path] != null){
                                clearTimeout(HTTP.httpTimer[path]);
                                HTTP.httpTimer[path] = null;
                            }
                            HTTP.sendCount[path] = 0;
                            // cc.game.restart();
                        }
                        else{
                            HTTP.sendCount[path]++;
                            // if(noChangeUrl == null || noChangeUrl == false){
                            //     if(HTTP.extraUrl[path] != null){
                            //         HTTP.extraUrl[path] = "http://" + HTTP.getNextUrl(HTTP.extraUrl[path]);
                            //     }
                            //     else{
                            //         HTTP.url = "http://" + HTTP.getNextUrl(HTTP.url);
                            //         if(HTTP.url.indexOf("fyacc") >= 0 || HTTP.url.indexOf("LOGIN") >= 0){
                            //             HTTP.master_url = HTTP.url;
                            //         }
                            //     }
                            // }
                            HTTP.sendRequest(path,data,handler,HTTP.extraUrl[path],stime,autoSignature,noChangeUrl);
                        }
                    },2000);
            }
            xhr.send();
            return xhr;
        },

        getCodeN:function(keys, data){
            keys.sort();
            var _code = "";
            for(var i=0;i<keys.length;i++)
            {
                if(keys[i].toString() == "name"){
                    continue;
                }
                if(_code!="")
                {
                    _code = _code+"&";
                }
                _code =  _code + keys[i] +"="+ data[keys[i]];
            }

            return _code;
        },

        getNextUrl:function(url){
            var sp = url.indexOf("//");
            if(sp >= 0){
                var sparr = url.split('//');
                url = sparr[1];
                console.log("getNextUrl http : " + url);
            }

            var _url = url;
            var arr = _url.split(':');
            var port = null;
            if(arr && arr.length == 2){
                port = arr[1];
            }
            // fyacc1.d51v.cn 登录
            // fyhall1-4 大厅
            // fymj1-4 游戏

            var index = _url.indexOf("fygame");// 默认登录地址
            if(index >= 0){
                return "|LOGIN|"+ HTTP.getRandomUrl("LOGIN") + (port == null ? ":32100":":" + port);
            }
            var index = _url.indexOf("LOGIN");
            if(index >= 0){
                return "|LOGIN|"+ HTTP.getRandomUrl("LOGIN") + (port == null ? ":32100":":" + port);
            }
            index = _url.indexOf("fyacc");
            if(index >= 0){
                return "|LOGIN|"+ HTTP.getRandomUrl("LOGIN") + (port == null ? ":32100":":" + port);
            }

            index = _url.indexOf("fyhall");
            if(index >= 0){
                return "|HALL|"+ HTTP.getRandomUrl("HALL") + (port == null ? ":32101":":" + port);
            }
            var index = _url.indexOf("HALL");
            if(index >= 0){
                var hallurl = HTTP.getRandomUrl("HALL");
                if(port == '32500') {
                    cc.fy.SI.clubSocketAddr = hallurl + ":32600";
                    cc.fy.SI.clubHttpAddr = hallurl + ":32500";
                    return "|HALL|"+ hallurl + ":32500";
                }
                else{
                    return "|HALL|"+ hallurl + (port == null ? ":32101":":" + port);
                }
            }

            index = _url.indexOf("fymj");
            if(index >= 0){
                return "|GAME|"+ HTTP.getRandomUrl("GAME") + (port == null ? ":40000":":" + port);
            }
            var index = _url.indexOf("GAME");
            if(index >= 0){
                return "|GAME|"+ HTTP.getRandomUrl("GAME") + (port == null ? ":40000":":" + port);
            }

            // 扬州麻将配置
            var index = _url.indexOf("lbhaacc");
            if(index >= 0){
                return "|LOGIN|"+ HTTP.getRandomUrl("LOGIN") + (port == null ? ":32100":":" + port);
            }

            index = _url.indexOf("lbhahall");
            if(index >= 0){
                var hallurl = HTTP.getRandomUrl("HALL");
                if(port == '32500') {
                    cc.fy.SI.clubSocketAddr = hallurl + ":32600";
                    cc.fy.SI.clubHttpAddr = hallurl + ":32500";
                    return "|HALL|"+ hallurl + ":32500";
                }
                else{
                    return "|HALL|"+ hallurl + (port == null ? ":32101":":" + port);
                }
            }

            var index = _url.indexOf("lbhagame");
            if(index >= 0){
                return "|GAME|"+ HTTP.getRandomUrl("GAME") + (port == null ? ":40000":":" + port);
            }
            return url;
        },

        getRandomIndex:function(type){
            var urlArr = this.getArrByType(type);
            if(urlArr == null){
                urlArr = [];
            }
            if(HTTP.failurl == null){
                HTTP.failurl = {};
            }
            if(HTTP.failurl[type] != null && HTTP.failurl[type].failCount >= urlArr.length - 1){
                HTTP.failurl[type] = null;
            }
            if(HTTP.failurl[type] == null){
                HTTP.failurl[type] = {};
                
                if(urlArr != null){
                    HTTP.failurl[type].randArr = [];
                    var length = urlArr.length;
                    for(var i=0;i<length;i++){
                        HTTP.failurl[type].randArr.push(i);
                    }
                }else{
                    HTTP.failurl[type].randArr = [0];
                }
                HTTP.failurl[type].randArr.sort(function(){ return 0.5 - Math.random(); });
                HTTP.failurl[type].failCount = 0;
                return HTTP.failurl[type].randArr[0];
            }else{
                HTTP.failurl[type].failCount++;
                var index = HTTP.failurl[type].randArr[HTTP.failurl[type].failCount];
                return index;
            }
        },

        getArrByType:function(type){
            var loginIp = ["lbhaacc1.d51v.com", "lbhaac2.d51v.com", "lbhaacc3.d51v.com", "lbhaacc4.d51v.com", "lbhaacc.hy51v.com"];
            var hallIp = ["lbhahall1.d51v.com", "lbhahall2.d51v.com", "lbhahall3.d51v.com", "lbhahall4.d51v.com", "lbhahall.hy51v.com"];
            var gameIp = ["lbhagame.d51v.com", "lbhagame.d51v.com", "lbhagame.d51v.com", "lbhagame.d51v.com", "lbhagame.hy51v.com"];


            if(type == "LOGIN"){
                return loginIp;
            }
            else if(type == "HALL"){
                return hallIp;
            }
            else if(type == "GAME"){
                return gameIp;
            }
        },

        getRandomUrl:function(type){
            var index = HTTP.getRandomIndex(type);
            var arrTemp = HTTP.getArrByType(type);
            return arrTemp[index];
        },

        getUrlType:function(_url){
            var arr = _url.split('|');
            var urlTemp = null;
            if(arr && arr.length == 3){
                urlTemp = arr[1];
                if(urlTemp == "LOGIN" || urlTemp == "HALL" || urlTemp == "GAME"){
                    return arr[0] + arr[2];
                }
            }

            return _url;
        },

        randomNumBoth:function(Min,Max){
            var _Range = Max - Min;
            var _Rand = Math.random();
            var num = Min + Math.round(_Rand * _Range); //四舍五入
            return num;
        },
    },
});