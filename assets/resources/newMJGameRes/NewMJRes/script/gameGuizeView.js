var GameMsgDef = require("GameMsgDef");
var ConstsDef = require('ConstsDef');
cc.Class({
    extends: cc.Component,

    properties: {
        rootLayer: [cc.Node],
        // _id:null,
        Frame: [cc.SpriteFrame]
    },

    // use this for initialization
    onEnable() {

    },
    onLoad: function () {
        this.initView();
        this.initEventHandlers();
    },

    initEventHandlers: function () {
        var self = this;
        var game = cc.fy.gameNetMgr;

        game.addHandler(GameMsgDef.ID_SHOWGAMEVIEW_MJPEIZHI_CTC, function (data) {
            if (data && data.isShow == false) {
                self.hidePanel();
            }
            else {
                self.showPanel(data);
            }
        });
    },

    initView: function () {
        // 作为弹框模式 不隐藏其它弹框
        // this.setHideOther(false);


    },

    showPanel: function (data) {
        this.node.active = true;
        this.show(data.id)
    },

    hidePanel: function () {
        this.node.active = false;
    },
    show(id) {
        //return

        this.getWanfa()
        this.node.active = true
        for (let i = 0; i < this.node.children.length; i++) {
            this.node.children[i].active = false
        }
        this.rootLayer[id].active = true
        let str = "Guize" + (id + 1)
        this.rootLayer[id].getComponent(str).initData(this.getWanfa())
    },
    close() {
        // cc.fy.audioMgr.playSFX("click_return.mp3");
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.node.active = false
    },
    changeSprite(curnode, isChoice) {
        if (isChoice) {
            curnode.getComponent(cc.Sprite).spriteFrame = this.Frame[0]
        } else {
            curnode.getComponent(cc.Sprite).spriteFrame = this.Frame[1]
        }
    },
    getWanfa: function () {
        //cc.fy.gameNetMgr.getWanfa()
        var curconf;
        // var curconf_ha = cc.fy.localStorage.getItem("createroom_sz");
        // if (curconf_ha) {
        //     curconf = curconf_ha
        // } else {
        //     curconf = cc.fy.localStorage.getItem("createroom_wanfa");
        // }
        var conf = cc.fy.gameNetMgr.conf;
        console.log('guize', conf)
        // var conf = JSON.parse(curconf)
        if (conf && conf.type != null) {
            var strArr = {};
            strArr.type = conf.type
            if (conf.type == cc.GAMETYPE.SZTDH) {
                strArr.name = "推倒胡";
            }
            else if (conf.type == cc.GAMETYPE.SZCT) {
                strArr.name = "苏州麻将";
            }
            else if (conf.type == cc.GAMETYPE.SZBD) {
                strArr.name = "百搭麻将";
            }
            else if (conf.type == cc.GAMETYPE.SZHD) {
                strArr.name = "黄埭麻将";
            }
            else if (conf.type == cc.GAMETYPE.SZER) {
                strArr.name = "二人麻将";
            } else if (conf.type == cc.GAMETYPE.SZWJ) {
                strArr.name = "吴江麻将";
            }




            //局数
            if (conf.xuanzejushu != null) {
                strArr.xuanzejushu = conf.xuanzejushu;
            } else if (conf.maxGames != null) {
                if (conf.maxGames < 8) {
                    strArr.xuanzejushu = 0
                } else if (conf.maxGames == 8) {
                    strArr.xuanzejushu = 1
                } else {
                    strArr.xuanzejushu = 2
                }
            } else {
                if (cc.fy.gameNetMgr.maxNumOfGames < 8) {
                    strArr.xuanzejushu = 0
                } else if (cc.fy.gameNetMgr.maxNumOfGames == 8) {
                    strArr.xuanzejushu = 1
                } else {
                    strArr.xuanzejushu = 2
                }

            }

            if (conf.type == cc.GAMETYPE.SZTDH) {

                strArr.baseScore = conf.baseScore
                strArr.fanbeibaozi = conf.wanfa.fanbeibaozi
                strArr.fanbeilianzhuang = conf.wanfa.fanbeilianzhuang
                strArr.fanbeipaixing = conf.wanfa.fanbeipaixing

                strArr.zuidafanshu = conf.wanfa.zuidafanshu
                strArr.daipiao = conf.wanfa.daipiao
            }
            else if (conf.type == cc.GAMETYPE.SZCT) {
                strArr.renshu = conf.maxCntOfPlayers
                strArr.haoqi = conf.wanfa.haoqi
                strArr.diling = conf.wanfa.diling

            }
            else if (conf.type == cc.GAMETYPE.SZBD) {
                strArr.zimohu = conf.wanfa.zimohu
                strArr.huqidui = conf.wanfa.huqidui
                strArr.baidafanpai = conf.wanfa.baidafanpai

            }
            else if (conf.type == cc.GAMETYPE.SZHD) {
                strArr.daipiao = conf.wanfa.daipiao
                strArr.baseScore = conf.baseScore
            }
            else if (conf.type == cc.GAMETYPE.SZER) {
                strArr.renshu = conf.maxCntOfPlayers
                if (conf.wanfa.double) {
                    strArr.double = conf.wanfa.double
                }
            }
            else if (conf.type == cc.GAMETYPE.SZWJ) {

                strArr.baseScore = conf.baseScore
                strArr.isHuangFan = conf.wanfa.isHuangFan
                strArr.isHuangFengFan = conf.wanfa.isHuangFengFan
                strArr.isQiangGangHu = conf.wanfa.isQiangGangHu
            }


            if (conf.aagems != null) {
                strArr.aagems = conf.aagems
            }

            if (conf.isGps) {
                strArr.isGps = conf.isGps
                if (conf.isSameIp == 1) {
                    strArr.isSameIp = conf.isSameIp
                }
            }

            strArr.renshu = cc.fy.gameNetMgr.seats.length
            console.log("<><><><><><LLLLLLLLLLL", strArr)
            return strArr;
        }
        return "";
    },



    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
