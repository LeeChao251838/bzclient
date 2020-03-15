var GameMsgDef = require("GameMsgDef");
cc.Class({
    extends: require("BaseModuleView"),

    properties: {
        editBoxNum:cc.Node,
        codeLabel:cc.Label,
        add:cc.Node, //没有绑定过
        isBang:cc.Node,//已经绑定过
        // _btnWelfare:null,
        // _btnShop:null,
        // _lblGems:null,
        // _shopContent:null,
        // 本地签名要用的几个参数
        _agent_id:null,    // 代理提供的推广码
        _guid:null,    // 用户id
        _gameid:null,    // 苏州麻将游戏ID 2
        _secret:null,    // 密钥(苏州)

        _unionid:null,
        _proid:null,
        _signature:null,
        _mainURL:null,
        _userinfo:null,
        _labProid: null,
    },
    onLoad(){
        this.initEventHandlers();
        this.initView();
    },

    initEventHandlers(){
        var self = this;
        var game = cc.fy.gameNetMgr;
        
        game.addHandler(GameMsgDef.ID_SHOWWELFAREVIEW_CTC, function(data){
            if(data.isShow == false){
                self.close();
            }
            else{
                console.log("ID_SHOWWELFAREVIEW_CTC ---- ");
                self.show();
            }
        });
    },

    initView(){
        // 扬州麻将     游戏ID 9     secret  slz7ivd00hn3meh2q9knc25yuopjp8gr
        if(cc.fy.userMgr.proid != null && cc.fy.userMgr.proid != 0){
            //已经绑定
            this.add.active=false;
            this.isBang.active=true;
            this.codeLabel.string = cc.fy.userMgr.proid.toString();
        }else{
            //未绑定
            this.add.active=true;
            this.isBang.active=false;
        }
        this._gameid = cc.GAMEID;//2苏州麻将
        //this._secret = "2zgjqp5n3u"; //新
        // this._secret ="718p76j28d4"; //老
        this._secret = "9fd496649e5fa469bfbfad65d32d578e";
        this._mainURL = cc.WEBAPIURL;
        this._guid = cc.fy.userMgr.userId;
    },

    show(){
        this.node.active = true;
        
        this.initView();
    },

    close(){
        this.node.active = false;
    },

    getProidWeb(userid){
        var self = this;
        var data = {
            userId:userid,
            wx_uuid:/*"123",/*/cc.fy.userMgr.unionid,//*/
        }
        cc.fy.http.sendRequest('/get_proid_web', data, function(ret){
            console.log("==>> get_proid_web --> ret: ", ret);
            if(ret.errcode == 0){
                if(ret.proid != null && ret.proid != 0){
                    cc.fy.userMgr.proid = ret.proid;
                    // self._btnWelfare.active = false;
                }
            }
            else{
               // self._btnWelfare.active = true;
            }
        }, cc.fy.http.master_url);
    },

    getBaseInfo(userid){
        var self = this;   
        if(cc.fy.userMgr.proid != null && cc.fy.userMgr.proid != 0) return;
        cc.fy.http.sendRequest('/base_info', {userid:userid}, function(ret){
            console.log("==>> get_base_info --> ret: ", ret);
            if(ret.uuid != null){
                cc.fy.userMgr.unionid = ret.uuid;
                self._unionid = ret.uuid;
            }
            if(ret.proid != null && ret.proid != 0){
                cc.fy.userMgr.proid = ret.proid;
                self._proid = ret.proid;
            }
            else{
                self.getProidWeb(userid);
            }
        }, cc.fy.http.master_url);           
    },

    // 点击领取按钮
    onButtonGet(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this._agent_id = this.editBoxNum.getComponent(cc.EditBox).string;
        if(this._agent_id == null || this._agent_id == ""){
            cc.fy.hintBox.show("请填写推广码！");
            return;
        }
        this._agent_id = parseInt(this._agent_id);
        if(isNaN(this._agent_id)){
            cc.fy.hintBox.show("推广码只能是数字！");
            return;
        }
        this.localSignature(this._agent_id);
        this.bindAgent();
    },

    

    // 本地签名
    localSignature(agentid){
        var md5 =  require("md5");
        var data = {
            agent_id:agentid,
            guid:this._guid,
            gameid:this._gameid,
            secret:this._secret,
        }
        var code = this.getCodeN(data);
        console.log("code = " + code);
        this._signature = md5.hex_md5(code);
        console.log("signature = " + this._signature);
    },

    // 排序
    getCodeN(data){
        var keys = [];
        var str = "?";
        var _code = "";
        for(var k in data){
            if(str != "?"){
                str += "&";
            }
            str += k + "=" + data[k];
            keys.push(k);
        }
        keys.sort();
        for(var i = 0; i < keys.length; i++){
            if(keys[i].toString() == "name"){
                continue;
            }
            if(_code != ""){
                _code = _code + "&";
            }
            _code =  _code + keys[i] + "=" + data[keys[i]];
        }
        return _code;
    },

    // 绑定推广码
    bindAgent(){
        var data = {
            agent_id:this._agent_id,        // 1
            guid:this._guid,                // 10989
            gameid:this._gameid,            // 2
            unionid:cc.fy.userMgr.unionid,          // "onAPP1WdIXo6cn89t0zSVIMU8iaY"
            signature:this._signature,
        };

        var self = this;
        var onRec = function(ret){
            console.log(ret);
            if(cc.fy.loading){
                cc.fy.loading.hide();
            }
            if(cc.fy.hintBox == null){
                var HintBox = require("HintBox");
                cc.fy.hintBox = new HintBox();
            }
            if(ret.code == 2){
                cc.fy.alert.show("微信重新授权后才能绑定，点击确定重新授权！", function(){
                    cc.fy.userMgr.logOut();
                });             
            }
            else if(ret.code !== 0){
                cc.fy.hintBox.show(ret.message);
            }
            else{
                cc.fy.hintBox.show("绑定成功！");
                cc.fy.http.sendRequest('/set_proid', {userid:self._guid, proid:self._agent_id}, function(ret){
                    console.log("==>> set_proid: ", ret);
                }, cc.fy.http.master_url);
                cc.fy.userMgr.proid = self._agent_id;
                self.refreshInfo();
                self.close();
            }
        };

        cc.fy.http.sendRequest("/game/bindagent", data, onRec, this._mainURL, null, "test");
        cc.fy.loading.show("正在验证推广码，请稍等...");
    },

    // 刷新显示数据
    refreshInfo(){
        var onGet = function(ret){
            if(ret.errcode !== 0){
                console.log(ret.errmsg);
            }
            else{
                if(ret.gems != null){
                    // self._lblGems.string = ret.gems;
                }
            }
        };
        
        cc.fy.userMgr.getUserStatus(onGet);
    },
    onBtnClose(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.node.active = false;
    },
    
});
