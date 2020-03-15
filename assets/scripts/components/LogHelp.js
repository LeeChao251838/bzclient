// http://hatest.d51v.com/api/gameassist/game_log

cc.LOGREQUESTTIME = -1;
cc.CANLOG = true;
//IOS Android 设备
window.__errorHandler = function (file, line, errMsg, error){
    console.log("window.__errorHandler   ");
    console.log([file, line, errMsg, error]);
    
    let userId = '0';
    if (cc.LOGREQUESTTIME > parseInt(Date.now() / 1000)) {
        return;
    }
    if (cc.CANLOG == false){
        return;
    }
    if (!cc.fy) {
        cc.fy = {};
    }
    if (!cc.fy.http) {
        cc.fy.http = require("HTTP");
    }
    if (cc.fy.userMgr && cc.fy.userMgr.userId) {
        userId = cc.fy.userMgr.userId;
    }

    cc.CHANNELID = 3;
    if (cc.sys.os == cc.sys.OS_ANDROID) {
        cc.CHANNELID = 2;
    }
    else if (cc.sys.os == cc.sys.OS_IOS) {
        cc.CHANNELID = 1;
    }

    let content = { userId, errMsg, file, line, error };
    let retData = {
        gameid: cc.GAMEID,
        platform: cc.CHANNELID,
        content: JSON.stringify(content),
    }
    cc.CANLOG = false;
    // cc.fy.http.sendRequest('/gameassist/game_log', retData, function (ret) {
    //     cc.CANLOG = true;
    //     console.log("=====>>>>>>>>>>>");
    //     console.log(ret);
    //     if (ret && ret.code == 3){
    //         cc.LOGREQUESTTIME = ret.data.end_time;
    //     }
    // }, cc.WEBAPIURL)先注释掉，web压力过大


}

//网页
// window.onerror = function (message, source, lineno, colno, error) {
//     console.log("window.onerror   ");
//     console.log(error);
//     let userId = '0';
//     if (cc.LOGREQUESTTIME > parseInt(Date.now() / 1000)) {
//         return;
//     }
//     if (!cc.fy) {
//         cc.fy = {};
//     }
//     if (!cc.fy.http) {
//         cc.fy.http = require("HTTP");
//     }
//     if (cc.fy.userMgr && cc.fy.userMgr.userId) {
//         userId = cc.fy.userMgr.userId;
//     }

//     cc.CHANNELID = 3;
//     if (cc.sys.os == cc.sys.OS_ANDROID) {
//         cc.CHANNELID = 2;
//     }
//     else if (cc.sys.os == cc.sys.OS_IOS) {
//         cc.CHANNELID = 1;
//     }

//     let content = { userId: userId, errMsg: message, stack: error.stack };
//     let retData = {
//         gameid: cc.GAMEID,
//         platform: cc.CHANNELID,
//         content:JSON.stringify(content),
//     }

//     cc.fy.http.sendRequest('/gameassist/game_log', retData, function (ret) {
//         console.log("=====>>>>>>>>>>>");
//         console.log(ret);
//         if (ret && ret.code == 3) {
//             cc.LOGREQUESTTIME = ret.data.end_time;
//         }
//     }, cc.WEBAPIURL)
// };


// if (console) {
//     let _console = {
//         log: console.log
//     }
//     if (!window.consoleLog) {
//         window.consoleLog = [];
//     }
//     console.log = function () {
//         let logTime = window.timeToString("--info--")
//         let logData = Array.prototype.slice.call(arguments, 0);
//         logData.unshift(logTime);
        
//         if (window.consoleLog.length > 1000) {
//             window.consoleLog.shift();
//         }
//         window.consoleLog.push(logData);
//         _console.log.apply(this, logData);
//     }
// }
// window.timeToString = function (extra) {
//     let date = new Date(),
//         format = "yyyy-MM-dd hh:mm:ss.S";
//     var _date = {
//         "M+": date.getMonth() + 1,
//         "d+": date.getDate(),
//         "h+": date.getHours(),
//         "m+": date.getMinutes(),
//         "s+": date.getSeconds(),
//         "q+": Math.floor((date.getMonth() + 3) / 3),
//         "S+": date.getMilliseconds()
//     };
//     if (/(y+)/i.test(format)) {
//         format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
//     }
//     for (var k in _date) {
//         if (new RegExp("(" + k + ")").test(format)) {
//             format = format.replace(RegExp.$1, RegExp.$1.length == 1
//                 ? _date[k] : ("00" + _date[k]).substr(("" + _date[k]).length));
//         }
//     }
//     format += " "+extra;
//     return format;
// }