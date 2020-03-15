var GameMsgDef = require("GameMsgDef");
var ConstsDef = require('ConstsDef');

cc.Class({
    extends: require("BaseModuleMsg"),

    properties: {
        ///////////////////////
        resPanelUrl:"prefabs/mjgame/wanfaWin", // 预制体路径
        msgIdShowView:GameMsgDef.ID_SHOWWANFAWINVIEW_CTC, // 显示ID
        isPreload:false, // 是否需要预加载，ps:常用组件需要预加载加快显示
        limitScene:ConstsDef.SCENE_NAME.GAME_MJ, // 限制场景，指定模块的场景，null是不限制 如:limitScene:ConstsDef.SCENE_NAME.GAME 游戏场景模块
        ///////////////////////

    },

    // 初始化数据函数
    init:function() {
    },
    
    // 消息分发函数
    messageDispatch:function(msg){
        switch (msg.msgId) {
        }
    },

    getWanfaArr :function(_conf){
        var conf = _conf;
        if(_conf == null){
           conf = cc.fy.gameNetMgr.conf;
        }

        console.log('_conf: ' , conf);
        if(conf && conf.type != null){
            var strArr = {};
            strArr.seatNum = cc.fy.gameNetMgr.seats.length + "人";
            if (conf.type == cc.GAMETYPE.JDMJ) {
                strArr.roomInfo = "房间号：" + cc.fy.gameNetMgr.roomId.toString()

                if (conf.wanfa.indexOf(9) >= 0) {
                    strArr.maxCount = "对局数：" + conf.maxGames + "圈";
                }
                else {
                    strArr.maxCount = "对局数：" + conf.maxGames + "局";   
                }

                strArr.aagems = "";

                if(conf.aagems != null){
                    strArr.aagems = "付费方式：";
                    if (conf.aagems == 0) {
                        strArr.aagems += "房主付费"
                    }
                    else if (conf.aagems == 1) {
                        strArr.aagems += "AA付费";
                    }
                    else if (conf.aagems == 3) {
                        strArr.aagems += "大赢家付费";
                    }
                    else{
                        strArr.aagems += "群主开房";
                    }
                }

                strArr.modelInfo = "";
                strArr.wanfaInfo = "";
                if (conf.wanfa != null) {
                    for (var i = 0; i < conf.wanfa.length; i++) {
                        var WF = conf.wanfa[i];
                        if (WF == 0) {
                            strArr.modelInfo = "三家付";
                        }
                        if (WF == 1) {
                            strArr.modelInfo = "自摸胡";
                        }
                        if (WF == 2) {
                            strArr.modelInfo = "点炮胡";
                        }
                        if (WF == 3) {
                            strArr.wanfaInfo += "数胡子 ";
                        }
                        if (WF == 4) {
                            strArr.wanfaInfo += "连庄晃 ";
                        }
                        if (WF == 5) {
                            strArr.wanfaInfo += "起步晃 ";
                        }
                        if (WF == 6) {
                            strArr.wanfaInfo += "无限制 ";
                        }
                        if (WF == 7) {
                            strArr.wanfaInfo += "一番起胡 ";
                        }
                        if (WF == 8) {
                            strArr.wanfaInfo += "两番起胡 ";
                        }
                        
                        if (WF == 10) {
                            if (conf.wanfa.indexOf(2) <0){
                                strArr.wanfaInfo += "带拿米";
                            }else{
                                strArr.wanfaInfo += "拿米1倍付";
                            }
                        }
                        else if (WF == 11) {
                            strArr.wanfaInfo += "拿米2倍付";
                        }
                        else if (WF == 12) {
                            strArr.wanfaInfo += "拿米3倍付";
                        }
                    }
                }
                
                if(conf.baseScore != null){
                    strArr.baseScore = conf.baseScore + "分";
                }

                return strArr;
            }
            else{
                strArr.roomInfo = "房间号：" + cc.fy.gameNetMgr.roomId.toString()

                if (conf.wanfa.indexOf(9) >= 0) {
                    strArr.maxCount = "对局数：" + conf.maxGames + "圈";
                }
                else {
                    strArr.maxCount = "对局数：" + conf.maxGames + "局";   
                }

                strArr.aagems = "";

                if(conf.aagems != null){
                    strArr.aagems = "付费方式：";
                    if (conf.aagems == 0) {
                        strArr.aagems += "房主付费"
                    }
                    else if (conf.aagems == 1) {
                        strArr.aagems += "AA付费";
                    }
                    else if (conf.aagems == 3) {
                        strArr.aagems += "大赢家付费";
                    }
                    else{
                        strArr.aagems += "群主开房";
                    }
                }

                strArr.modelInfo = "";
                let wanfaA = cc.fy.gameNetMgr.getWanfaArr();
                strArr.wanfaInfo = wanfaA.join('  ');

                if(conf.baseScore != null){
                    strArr.baseScore = conf.baseScore + "分";
                }

                return strArr;
            }
        }

        return "";
    },
});