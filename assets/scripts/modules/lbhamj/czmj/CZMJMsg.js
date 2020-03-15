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

        guanmen:0, // 关门数据 0没有关门，1关门只能出摸的牌， 2关门都可以出牌
        guanmenAction:null, // 关门按钮数据暂存，用于断线重入的状态保存
        otherHasAction:false,
        zhaoningData:null,
        xianningData:null,
        xiangPai:[], // 香牌列表
        guanmenpai:[],

        gameWaitData:null,

        tiantingState:false,
    },

    reset:function(){
        this.guanmen = 0;
        var seats = cc.fy.gameNetMgr.seats;
        if(seats != null)
        {
            for(var i = 0; i < seats.length; ++i){
                seats[i].baozhuangCard = null;
                seats[i].guanmen = null;
                seats[i].xianning = null;
                seats[i].zatoucard = null;
            }
        }
        this.xiangPai = [];
        this.guanmenAction = null;
        this.guanmenpai = [];
        this.otherHasAction = false;
        this.gameWaitData = null;
        this.xianningData = null;
        this.zhaoningData = null;
    },

    // 消息监听
    initHandlers:function()
    {
        if(cc.fy.gameMsg == null)
        {
            return;
        }

        if(cc.fy.gameNetMgr.conf.type != cc.GAMETYPE.SZBD){
            return;
        }

        this.reset();

        var self = this;
        // 服务器把关门找拧掀拧 放到game_action_push里了
        // 显示操作按钮看这里，服务器把消息放这里啦！！！
        cc.fy.gameMsg.addHandler("game_action_push", function(data){
            console.log('gameMsg game_action_push');
            console.log(data);
            if(data && data.guanmen == true){
                self.guanmenAction = data.guanmen;
                self.guanmenpai = data.guanmenpai;
                cc.fy.gameNetMgr.dispatchEvent("cc_game_action_guanmen", self.guanmenpai);
            }
            if(data && data.zhaoning == true){
                self.zhaoningData = true;
                cc.fy.gameNetMgr.dispatchEvent("cc_game_zhaoning_push");
            }
            if(data && data.xianning == true){
                self.xianningData = true;
                cc.fy.gameNetMgr.dispatchEvent("cc_game_xianning_push");
            }
        });
        cc.fy.gameMsg.addHandler("guanmen_notify_push", function(data){
            console.log('guanmen_notify_push');
            console.log(data);
            
            self.doGuanmen(data);
        });

        // 找拧操作按钮
        cc.fy.gameMsg.addHandler("game_zhaoning_push", function(data){
            console.log('game_zhaoning_push');
            console.log(data);
            self.zhaoningData = true;
            cc.fy.gameNetMgr.dispatchEvent("cc_game_zhaoning_push");
        });
        // 找拧返回数据
        cc.fy.gameMsg.addHandler("zhaoning_recv_push", function(data){
            console.log('zhaoning_recv_push');
            console.log(data);
            self.doZhaoning(data);
        });

        cc.fy.gameMsg.addHandler("game_zhaoning_notify_push", function(data){
            console.log("game_zhaoning_notify_push");
            console.log(data);
            self.doZhaoning_new(data);
        })

        // 掀拧操作按钮
        cc.fy.gameMsg.addHandler("game_xianning_push", function(data){
            console.log('game_xianning_push');
            console.log(data);
            self.xianningData = true;
            cc.fy.gameNetMgr.dispatchEvent("cc_game_xianning_push");
        });
        // 掀拧返回数据
        cc.fy.gameMsg.addHandler("xianning_recv_push", function(data){
            console.log('xianning_recv_push');
            console.log(data);
            cc.fy.gameNetMgr.dispatchEvent("cc_xianning_recv_push",data);
        });

        cc.fy.gameMsg.addHandler("game_xianning_notify_push", function(data){
            console.log('game_xianning_notify_push');
            console.log(data);
            self.doXianning(data);
        });

        // 包庄显示
        cc.fy.gameMsg.addHandler("game_baozhuang_notify_push", function(data){
            console.log('game_baozhuang_notify_push');
            console.log(data);
            self.doBaozhuang(data);
        });

        // 香牌列表
        cc.fy.gameMsg.addHandler("game_xiangpai_notify_push", function(data){
            console.log('game_xiangpai_notify_push');
            console.log(data);
            self.doXiangpai(data);
        });

        // 其它玩家正在操作
        cc.fy.gameMsg.addHandler("other_has_actions_push", function(data){
            console.log('other_has_actions_push');
            console.log(data);
            self.otherHasAction = data;
            cc.fy.gameNetMgr.limitOutCard = data;
            cc.fy.gameNetMgr.dispatchEvent("cc_other_has_actions_push",data);
        });
        
        // 超时
        cc.fy.gameMsg.addHandler("game_wait_notify_push", function(data){
            console.log('game_wait_notify_push');
            console.log(data);
            self.gameWaitData = data;
            cc.fy.gameNetMgr.dispatchEvent("cc_game_wait_notify",data);
        });

        // 被踢
        cc.fy.gameMsg.addHandler("master_kill_you", function(){
            console.log("==>> master_kill_you");
            cc.fy.gameNetMgr.dispatchEvent("cc_master_kill_you_notify");
        });

        // 断线重连
        cc.fy.gameMsg.addHandler("game_sync_push", function(data){
            var seats = cc.fy.gameNetMgr.seats;
            for(var i = 0; i < seats.length; ++i){
                var seat = seats[i];
                var sd = data.seats[i];
                seat.guanmen = sd.guanmen;
                seat.zatoucard = sd.zatoucard; // 砸头
                seat.xianning = sd.xianning;
                seat.baozhuangCard = sd.baozhuangcard;
                if(seat.guanmen && i == cc.fy.gameNetMgr.seatIndex){
                    console.log("==>> game_sync_push");
                    var hasNewCard = self.hasNewCard(sd);
                    if(hasNewCard){
                        // 关门
                        if(sd.holds.length <= 2){
                            self.guanmen = 2;
                        }
                        else{
                            self.guanmen = 1;
                        }
                    }
                    else{
                        // 关门
                        if(sd.holds.length < 2){
                            self.guanmen = 2;
                        }
                        else{
                            self.guanmen = 1;
                        }
                    }  
                }
           }
           // 香牌列表
           self.xiangPai = data.xiangpai;
            cc.fy.gameNetMgr.dispatchEvent('gamebaida');
        });

        cc.fy.gameMsg.addHandler("game_baida_push", function(data){
            console.log('game_baida_push');
            console.log(data);
            cc.fy.gameNetMgr.baida = data;
            cc.fy.gameNetMgr.dispatchEvent('gamebaida');
            cc.fy.gameNetMgr.dispatchEvent('initmahjongs');
        });

        cc.fy.gameMsg.addHandler("game_banzi_push", function(data){
            console.log('game_banzi_push');
            console.log(data);
            cc.fy.gameNetMgr.fanbaida = data;
            cc.fy.gameNetMgr.dispatchEvent('game_fanbaida', data);
        });

        cc.fy.gameMsg.addHandler("IsTing", function(data){
            console.log("==>> isTing: ", data);
            // self.tingData = data;
            // var si = cc.fy.gameNetMgr.getSeatIndexByID(data.userId);
            // if(si != -1){
            //     cc.fy.gameNetMgr.seats[si].tingState = 1;
            //     cc.fy.gameNetMgr.seats[si].jiating = data.pai;
            // }
            // cc.fy.gameNetMgr.dispatchEvent('game_isTing', data);
            if (data.userId == cc.fy.userMgr.userId) {
                cc.fy.gameNetMgr.dispatchEvent("tingpai_ctc", data);
            }
            else{
                cc.fy.gameNetMgr.dispatchEvent("otherTingPai_ctc", data);
            }
        });
    },

    doGuanmen:function(data){
        var userId = data;
        var seatData = cc.fy.gameNetMgr.getSeatByID(userId);
        seatData.guanmen = true;
        if(userId == cc.fy.userMgr.userId){
            var holdNum = cc.fy.gameNetMgr.seats[cc.fy.gameNetMgr.seatIndex].holds.length;
            // 手里之后两张牌，不限制出牌，即可以换牌
            var hasNewCard = this.hasNewCard(seatData);
            if(hasNewCard){
                // 关门
                if(holdNum <= 2){
                    this.guanmen = 2;
                }
                else{
                    // 不能换牌 只能打摸的牌
                    this.guanmen = 1;
                }
            }
            else{
                // 关门
                if(holdNum < 2){
                    this.guanmen = 2;
                }
                else{
                    // 不能换牌 只能打摸的牌
                    this.guanmen = 1;
                }
            }            
        }

        cc.fy.gameNetMgr.dispatchEvent("cc_guanmen_notify", data);
    },
    doZhaoning:function(data){
        cc.fy.gameNetMgr.dispatchEvent("cc_zhaoning_recv_push",data);
    },
    doZhaoning_new:function(data){
        cc.fy.gameNetMgr.dispatchEvent("cc_zhaoning_notify_push", data);
    },
    doXianning:function(data){
        var seatData = cc.fy.gameNetMgr.getSeatByID(data);
        seatData.xianning = true;
        cc.fy.gameNetMgr.dispatchEvent("cc_game_xianning_notify_push",data);
    },
    doBaozhuang:function(data){
        console.log("==>> replay --> doBaozhuang");
        console.log(data);
        var seatData = cc.fy.gameNetMgr.getSeatByID(data.userId);
        seatData.baozhuangCard = data.pai;
        cc.fy.gameNetMgr.dispatchEvent("cc_game_baozhuang_notify", seatData);
    },
    doXiangpai:function(data){
        // var data = {
        //     xiangPai:[], // 香牌列表
        //     delXiangPai:-1 // 删除的香牌id
        // }
        if(data != null){
            if(data.delXiangPai >= 0 && this.xiangPai != null){
                var idx = this.xiangPai.indexOf(data.delXiangPai);
                if(idx != -1){
                    this.xiangPai.splice(idx,1);
                }
            }
            else{
                this.xiangPai = data.xiangPai;
            }
            
            cc.fy.gameNetMgr.dispatchEvent("cc_game_xiangpai_notify_push",this.xiangPai);
        }
    },

    // 判断有摸牌
    hasNewCard:function(seatData) {
        if (seatData.zatoucard == null || seatData.zatoucard == -1) {
            return seatData.holds.length % 3 == 2;
        } else {
            return seatData.holds.length % 3 == 0;
        }
    },

    prepareReplay:function(roomInfo,detailOfGame){
        var baseInfo = detailOfGame.base_info;
        var conf = cc.fy.gameNetMgr.conf;
        conf.zhaoning = baseInfo.zhaoning;                // 找拧 0/1
        conf.baozhuang = baseInfo.baozhuang;              // 包庄 0/1
        conf.zatou = baseInfo.zatou;                      // 砸头 0/1
        conf.overtimedissolve = baseInfo.overtimedissolve;// 超时解散 0/1
        conf.circleCnt = baseInfo.circleCnt + 1;
        conf.wind = baseInfo.wind;
    },
});