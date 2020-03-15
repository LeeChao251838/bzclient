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
        _logContent:"",
        _logPath:null,
        _isWriting:false,
    },

    log:function(logData, logDes){
        if(cc.LOGOUTFILE == false){
            return;
        }
        if(logDes == null){
            logDes = "";
        }
        else{
            logDes = logDes + " : ";
        }
        if(logData == null){
            logData = "";
        }
        var date = new Date();
        var logStr = "";
        if(typeof logData === "string"){
            logStr = logStr + logDes + logData;
        }
        else{
            logStr = logStr + logDes + JSON.stringify(logData);
        }
        // console.log(logStr);
        logStr = this.timeToString(date, "yyyy-MM-dd hh:mm:ss.S") + " " + logStr;
        // console.log(logStr);
        if(cc.sys.isNative && cc.sys.os == cc.sys.OS_ANDROID && cc.LOGOUTFILE == true){
            this.outFile(logStr, date);
        }
    },

    outFile:function(logStr, date){
        if(this._logPath == null){
            this.initOutFile();
            var fullPath = jsb.fileUtils.getWritablePath();
            var fileName =  "log_" + this.timeToString(date, "yyMMddhhmmss") + ".txt";
            this._logPath = fullPath + fileName;
        }
        this._logContent = this._logContent + logStr + "\n";
        
        if(this._isWriting != true){
            this._isWriting = true;
            var self = this;
            setTimeout(function(){
                self.writeFile();
                self._isWriting = false;
            }, 10);
        }
        
    },

    timeToString:function(date,format) {
        var _date = {
        "M+": date.getMonth() + 1,
        "d+": date.getDate(),
        "h+": date.getHours(),
        "m+": date.getMinutes(),
        "s+": date.getSeconds(),
        "q+": Math.floor((date.getMonth() + 3) / 3),
        "S+": date.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in _date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? _date[k] : ("00" + _date[k]).substr(("" + _date[k]).length));
        }
        }
        return format;
    },

    writeFile:function(){
        if(this._logPath != null){
            jsb.fileUtils.writeStringToFile(this._logContent, this._logPath);
        }
        console.log("writeFile = " + this._logContent);
    },

    // 切换后台监听
    initOutFile:function(){
        var self = this;
        cc.game.on(cc.game.EVENT_HIDE, function () {
            self.writeFile();
        });
    },
});
