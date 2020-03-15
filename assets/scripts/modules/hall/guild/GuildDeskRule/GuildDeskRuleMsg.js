var GameMsgDef = require("GameMsgDef");
var ConstsDef = require('ConstsDef');

cc.Class({
    extends: require("BaseModuleMsg"),

    properties: {
        ///////////////////////
        resPanelUrl: "prefabs/guild/GuildDeskRule/GuildDeskRule", // 预制体路径
        msgIdShowView: GameMsgDef.ID_SHOWGUILDDESKRULEVIEW_CTC, // 显示ID
        isPreload: false, // 是否需要预加载，备注:常用组件需要预加载加快显示
        limitScene: ConstsDef.SCENE_NAME.HALL, // 限制场景，指定模块的场景，null是不限制 如:limitScene:ConstsDef.SCENE_NAME.GAME 游戏场景模块
        ///////////////////////
    },

    // 初始化数据函数
    init: function () {
    },

    // 消息分发函数
    messageDispatch: function (msg) {



    },

    //房间配置
    getWanfaArr: function (conf) {

        if (conf == null) {
            return [];
        }
        var strArr = [];
        if (conf.aagems == 1) {
            strArr.push("AA制");
        } else if (conf.aagems == 2) {
            strArr.push("圈主付");
        }

        if (conf.maxCntOfPlayers > 0) {
            strArr.push(conf.maxCntOfPlayers + "人");
        }
        strArr.push(conf.maxGames + "局");

        if (conf.baseScore != null) {
            strArr.push(conf.baseScore + "分");
        }
        if (conf.isGps) {
            strArr.push("GPS限制");
        }
        if (conf.type == cc.GAMETYPE.GD) {
            strArr.push(conf.diFen + "分");
        } else if (conf.type == cc.GAMETYPE.DDZ) {
            var fengding = ["不封顶", "封顶12倍", "封顶24倍", "封顶48倍"];
            strArr.push(fengding[conf.caps]);
            if (conf.landlord == 0) {
                strArr.push("叫地主");
            } else if (conf.landlord == 1) {
                strArr.push("叫分");
            }
            if (conf.zha_landlord == 1) {
                strArr.push("王炸2炸3分");
            }
            if (conf.mingpai == 1) {
                strArr.push("明牌");
            }
            if (conf.jiabei == 1) {
                strArr.push("加倍");
            }
        } else if (conf.type == cc.GAMETYPE.SZTDH) {
            if (conf.wanfa.fanbeibaozi == 1) {
                strArr.push("豹子翻倍");
            }
            if (conf.wanfa.fanbeilianzhuang == 1) {
                strArr.push("连庄翻倍");
            }
            if (conf.wanfa.fanbeipaixing == 1) {
                strArr.push("牌型翻倍");
            }
            if (conf.wanfa.zuidafanshu == 2) {
                strArr.push("4倍");
            } else if (conf.wanfa.zuidafanshu == 3) {
                strArr.push("8倍");
            } else {
                strArr.push("16倍");
            }
            if (conf.wanfa.daipiao == 1) {
                strArr.push("带飘");
            } else {
                strArr.push("不带飘");
            }

        } else if (conf.type == cc.GAMETYPE.SZCT) {
            if (conf.wanfa.haoqi) {
                strArr.push("豪七");
            }
            if (conf.wanfa.diling) {
                strArr.push("滴零");
            }
        } else if (conf.type == cc.GAMETYPE.SZBD) {

            if (conf.wanfa.zimohu == 1) {
                strArr.push("胡自摸");
            }
            if (conf.wanfa.huqidui == 1) {
                strArr.push("胡七对");
            }
            if (conf.wanfa.baidafanpai == 0) {
                strArr.push("不翻牌");
            } else if (conf.wanfa.baidafanpai == 2) {
                strArr.push("翻2张");
            } else if (conf.wanfa.baidafanpai == 4) {
                strArr.push("翻4张");
            } else {
                strArr.push("翻6张");
            }
        } else if (conf.type == cc.GAMETYPE.SZER) {
            if (conf.wanfa.double == 1) {
                strArr.push("过胡翻倍");
            }


        } else if (conf.type == cc.GAMETYPE.SZHD) {
            if (conf.wanfa.daipiao == 1) {
                strArr.push("带飘");
            } else {
                strArr.push("不带飘");
            }
        } else if (conf.type == cc.GAMETYPE.SZWJ) {

            if (conf.wanfa.isHuangFan) {
                strArr.push("黄翻");
            }
            if (conf.wanfa.isHuangFengFan) {
                strArr.push("黄风翻");
            }
            if (conf.wanfa.isQiangGangHu) {
                strArr.push("抢杠胡");
            }

        }
        else {
            conf.type = conf.type;
            var wanfa = cc.fy.gameNetMgr.getWanfaArr(conf);
            console.log(conf, wanfa);
            strArr = strArr.concat(wanfa);
        }

        return strArr;

        if (conf.type == cc.GAMETYPE.SZER) {

        } else if (conf.type == cc.GAMETYPE.SZBD) {

        } else if (conf.type == cc.GAMETYPE.SZCT) {
            //有问题
            // var mshu=[0,2,4,6];
            // strArr.push(mshu[conf.maShu]+"码");

            // if(conf.qidui){

            // }
            // if(conf.quanZhong){

            // }

        } else if (conf.type == cc.GAMETYPE.HZEMJ) {

        }
        return strArr;
    },
});