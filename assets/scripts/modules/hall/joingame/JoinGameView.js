var GameMsgDef = require("GameMsgDef");
cc.Class({
    extends: require("BaseModuleView"),

    properties: {
        nums:{
            default:[],
            type:[cc.Label]
        },
        _inputIndex:0,
        inputNum:cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        this.initEventHandlers();
    },

    start:function(){
        this.initView();
    },

    initEventHandlers:function(){
        var self = this;
        var game = cc.fy.gameNetMgr;
        
        game.addHandler(GameMsgDef.ID_SHOWJOINGAMEVIEW_CTC, function(data){
            if(data.isShow == false){
                self.hidePanel();
            }
            else{
                console.log("ID_SHOWJOINGAMEVIEW_CTC ---- ");
                self.showPanel(data);
            }
        });
    },

    initView:function(){
        // 作为弹框模式 不隐藏其它弹框
        this.setHideOther(false);
        this.resetInput();
    },

    showPanel:function(data){
        this.node.active = true;
    },

    hidePanel:function(){
        this.node.active = false;
        this.resetInput();
    },
    
    onInputFinished:function(roomId){
        cc.fy.userMgr.enterRoom(roomId,function(ret){
            if(ret.errcode == 0){
                this.node.active = false;
            }
            else{
                var content = "房间["+ roomId +"]不存在，请重新输入!";
                if(ret.errcode == 4){
                    content = "房间["+ roomId + "]已满!";
                }
                if(ret.errcode == 5){
                    content = "房卡不足！";
                }
                if(ret.errcode == 7){
                    cc.fy.alert.show("您不是圈子成员，无法进入!");
                    if(callback != null){
                        callback(ret);
                    }
                }
                if(ret.errmsg)
                {
                    content = ret.errmsg;
                    var index = content.indexOf("已经在其他房间");
                    if(index >= 0){
                        cc.fy.alert.show("进入房间失败, " + ret.errmsg ,function(){
                            cc.fy.audioMgr.stopAllAudio()
                            cc.game.restart();
                        });
                        return;
                    }
                }
                cc.fy.alert.show(content);
                this.resetInput();
            }
        }.bind(this)); 
    },
    
    onInput:function(num){
        if(this.nums.length > 0){
            if(this._inputIndex >= this.nums.length){
                return;
            }
            this.nums[this._inputIndex].string = num;
            this._inputIndex += 1;
            
            if(this._inputIndex == this.nums.length){
                var roomId = this.parseRoomID();
                console.log("ok:" + roomId);
                this.onInputFinished(roomId);
            }
        }
        else if(this.inputNum != null){
            var strNum = this.inputNum.string + "" + num;
            if(strNum.length > 10){
                cc.fy.hintBox.show("请输入正确的回放码！");
                return;
            }
            this.inputNum.string = strNum;
        }
    },
    
    onN0Clicked:function(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.onInput(0);  
    },
    onN1Clicked:function(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.onInput(1);  
    },
    onN2Clicked:function(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.onInput(2);
    },
    onN3Clicked:function(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.onInput(3);
    },
    onN4Clicked:function(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.onInput(4);
    },
    onN5Clicked:function(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.onInput(5);
    },
    onN6Clicked:function(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.onInput(6);
    },
    onN7Clicked:function(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.onInput(7);
    },
    onN8Clicked:function(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.onInput(8);
    },
    onN9Clicked:function(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.onInput(9);
    },

    onResetClicked:function(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.resetInput();
    },

    onDelClicked:function(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        if(this._inputIndex > 0){
            this._inputIndex -= 1;
            this.nums[this._inputIndex].string = "";
        }
        if(this.inputNum != null){
            var str = this.inputNum.string;
            str = str.substring(0, str.length - 1);
            this.inputNum.string = str;
        }
    },
    onCloseClicked:function(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.hidePanel();
    },

    resetInput:function(){
        for(var i = 0; i < this.nums.length; ++i){
            this.nums[i].string = "";
        }
        this._inputIndex = 0;
        if(this.inputNum != null){
            this.inputNum.string = "";
        }
    },
    
    parseRoomID:function(){
        var str = "";
        for(var i = 0; i < this.nums.length; ++i){
            str += this.nums[i].string;
        }
        return str;
    },

    onHuifangClick:function(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        // 回放点击
        if(this.inputNum == null){
            console.log("onHuifangClick this.inputNum == null");
            return;
        }
        if(cc.fy.gameNetMgr.roomId != null || cc.fy.userMgr.oldRoomId != null)
        {
            cc.fy.hintBox.show("您正在包厢中，不能查看回放！");
            return;
        }
        var codeStr = this.inputNum.string;
        if(codeStr != null && codeStr != ""){
            var code = parseInt(codeStr);
            cc.fy.replayMgr.getDetailOfGameByCode(code);
        }
        else{
            cc.fy.hintBox.show("请输入回放码！");
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
