var GameMsgDef = require("GameMsgDef");
cc.Class({
    extends: require("BaseModuleView"),

    properties: {
       
    },

    onLoad(){
        this.initView();
        this.initEventHandlers();
    },

    initEventHandlers(){
        var self = this;
        var game = cc.fy.gameNetMgr;
        
        game.addHandler(GameMsgDef.ID_SHOWHALLSHOPVIEW_CTC, function(data){
            if(data.isShow == false){
                self.close();
            }
            else{
                console.log("ID_SHOWSHOPVIEW_CTC ---- ");
                self.show();
            }
        });

        game.addHandler(GameMsgDef.ID_BUYCALLBACK_CTC, function(data){
            self.onBuyCallBack(data.code);
        });
    },

    initView(){
      
    },

    show(){
        this.node.active = true;
        cc.fy.http.sendRequest('/is_certification', { userId: cc.fy.userMgr.userId}, function(data){
            if(!data.is){
                cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWREALNAMEVIEW_CTC,{isShow:true});
            }
        });   
    },

    close(){
     
        this.node.active = false;
    },
   
    //点击购买
    onShopClick(event){
        // cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        // var self = this;
        // cc.fy.httpclub.sendRequest('/is_certification', { userId: cc.fy.userMgr.userId}, function(data){
        //     if(!data.is){
        //        // self._realname.active = true;
        //         // cc.fy.hintBox.show("请先实名认证后再购买！");
        //         //return;
        //         cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWREALNAMEVIEW_CTC,{isShow:true});
        //     }
        //     else{
        //         self.buyZuanShi(event);
        //     }
        // });
        // this.buyZuanShi(event);
    },

     buyZuanShi: function(event){
        if(event == null || event.target == null) return;
        event.target.getComponent(cc.Button).interactable = false;
        this.schedule(function() {
            event.target.getComponent(cc.Button).interactable = true;
        }, 5);
        // // 购买
        // cc.fy.anysdkMgr.onIap("com.javgame."+ this._cardnum +"card");
        // if(cc.fy.wc){
        //     cc.fy.wc.show("请求中", 10, false);
        // }
        // this.onBuyCallBack("0|com.javgame." + this._cardnum + "card|receiptStr");
        this.sendToServer(0);
    },

    sendToServer:function(idx){
        var self = this;
        if(idx == null) return;

        var onRecv = function(ret){
           console.log("-------------->>>>>>>>>>>>>",ret);
           if(ret.errcode == 0){
                var data = ret.errmsg;
                var appid = data.appid;
                var noncestr = data.noncestr;
                var partnerid = data.partnerid;
                var prepayid = data.prepayid;
                var sign = data.sign;
                var timestamp = data.timestamp;
                cc.fy.anysdkMgr.WXPay(appid,partnerid,prepayid,noncestr,timestamp,sign);
           }
           else{
               cc.fy.hintBox.show("服务器忙，请稍后购买！");
           }
        };
        var data = {
            userid:cc.fy.userMgr.userId,
            gid:idx
        };
        cc.fy.http.sendRequest("/wx_pay_gems",data,onRecv);
    },

    //点击复制微信号
    onWeixinClick(event){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        cc.fy.anysdkMgr.copyAndJump('风云苏州棋牌', true);
    },
    onBuyCallBack(code){
        //code 示例   成功与否|商品id|消息
        //用户取消或失败这时商品id会是“（null）”   -1|(null)|用户取消
        //购买成功，正常情况下receiptStr是丢给服务器做验证的 0|com.javgame.8card|receiptStr
         var arr = code.split("|");
        if(arr[0] == 0) {
            var data = {
                from:"appstore",
                userid:cc.fy.userMgr.userId,
                productid:arr[1],
                receipt:arr[2]
            };
            cc.fy.http.sendRequest("/iaphandler",data,function(ret){
                if(ret.code == 0)
                {
                }else if(ret.code != null &&　ret.code != 0){
                    console.log(ret.message);
                }
            });
        } 
        else if(code ==-1){
            if(cc.fy.hintBox == null){
                var HintBox = require("HintBox");
                cc.fy.hintBox = new HintBox();
            }
            cc.fy.hintBox.show("购买失败！");
        }
    },
    onBtnClose(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.node.active = false;
    },
});
