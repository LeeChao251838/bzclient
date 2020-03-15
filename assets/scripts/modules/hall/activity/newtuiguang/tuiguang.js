cc.Class({
    extends: cc.Component,

    properties: {
        _tuiguangWin:cc.Node,
        _codeWin:cc.Node,
        _tipWin:cc.Node,
        _ruleWin:cc.Node,

        _mycodeLabel:cc.Node,
        _myurlLabel:cc.Node,
        _invnumLabel:cc.Node,
        _codeEditBox:cc.Node,
        _getNumLabel:cc.Node,
        _getRewardButton:cc.Node,

        _lblGems:null,
        _canGetNum:0,

        _contentScrollView:null,
        _content:null,
        _viewitemTemp:null,
        _viewlist:null,

    },

    // use this for initialization
    onLoad: function () {

        this._tuiguangWin = this.node.getChildByName("tuiguangWin");
        this._codeWin = this._tuiguangWin.getChildByName("codeWin");
        this._tipWin = this._tuiguangWin.getChildByName("tipWin");
        this._ruleWin = this._tuiguangWin.getChildByName("ruleWin");

        this._codeEditBox = this._codeWin.getChildByName("win_bg").getChildByName("Sprite2").getChildByName("EditBox").getComponent(cc.EditBox);
        this._getNumLabel = this._tuiguangWin.getChildByName("win_bg").getChildByName("Section3").getChildByName("Sprite2").getChildByName("Label").getComponent(cc.Label);
        this._mycodeLabel = this._tuiguangWin.getChildByName("win_bg").getChildByName("Section2").getChildByName("Sprite3").getChildByName("Label").getComponent(cc.Label);
        this._myurlLabel = this._tuiguangWin.getChildByName("win_bg").getChildByName("Section2").getChildByName("Sprite2").getChildByName("Label").getComponent(cc.Label);
        this._invnumLabel = this._tuiguangWin.getChildByName("win_bg").getChildByName("Section3").getChildByName("Label2").getChildByName("numLabel").getComponent(cc.Label);
        this._getRewardButton = this._tuiguangWin.getChildByName("win_bg").getChildByName("Section3").getChildByName("Button1").getComponent(cc.Button);

        // 大厅房卡数量
        if(this._lblGems == null){
            this._lblGems = cc.find("Canvas/top_left/headinfo/lblGems").getComponent(cc.Label);
        }

        this._mycodeLabel.string = cc.fy.userMgr.invitationcode;
        this._myurlLabel.string = "http://fyweb.51v.cn/pzmj/index.html?code=" + cc.fy.userMgr.invitationcode;

    },

    opentuiguangWin:function(){
        this._tuiguangWin.active = true;
        this.getUserBindNum();
    },

    closetuiguangWin:function(){
        this._tuiguangWin.active = false;
    },

    opencodeWin:function(){
        if (cc.fy.userMgr.bindcode != 0) {
            cc.fy.hintBox.show("您已经绑定！");
            return;
        }
        this._codeWin.active = true;
        this.getHistoryList("免费领卡");
    },

    closecodeWin:function(){
        this._codeWin.active = false;
    },

    openruleWin:function(){
        this._ruleWin.active = true;
    },

    closeruleWin:function(){
        this._ruleWin.active = false;
    },

    opentipWin:function(){
        this._tipWin.active = true;
    },

    closetipWin:function(){
        this._tipWin.active = false;
    },
    
    //显示记录
    showRecordDetailWin:function(){
        this._recordDetailWin.active = true;
        this._guizeDetailWin.active = false;
        this._recordBtn.checked = true;
        this._recordBtn.refresh();
        this._guizeBtn.checked = false;
        this._guizeBtn.refresh();
    },

    //显示规则
    showguizeDetailWin:function(){
        this._recordDetailWin.active = false;
        this._guizeDetailWin.active = true;
        this._recordBtn.checked = false;
        this._recordBtn.refresh();
        this._guizeBtn.checked = true;
        this._guizeBtn.refresh();
    },

    //获取邀请记录
    getInvRecord:function(){
        var self = this;
         var initContent = function(ret){
            self._content.removeAllChildren();

            if (ret.errcode != 0){
                // cc.fy.hintBox.show(ret.errmsg);
            } 
            else{
                self._viewlist.active = true;
                if(self._contentScrollView)
                {
                   self._contentScrollView.scrollToTop();
                }
            }
            
            for (var i = 0; i < ret.data.record.length; i++) {
                var node = self.getViewItem(i);
                node.active = true;
                node.idx = i;
                var data = ret.data.record[i];
                var datetime = self.dateFormat(data.time);
              
                node.getChildByName('timeLabel').getComponent(cc.Label).string = datetime ;
                node.getChildByName('nameLabel').getComponent(cc.Label).string = data.name;
            }
        };
        var data = {
            userid:cc.fy.userMgr.userId,
            invitationcode:cc.fy.userMgr.invitationcode,
        };
        cc.fy.http.sendRequest("/get_invitation_record",data,initContent,cc.activityURL);
    },

    getViewItem:function(index){
        var content = this._content;
        var viewitemTemp = this._viewitemTemp;
        var node = cc.instantiate(viewitemTemp);
        content.addChild(node);
        return node;
    },


     dateFormat:function(time){
        var date = new Date(time);
        var datetime = "{0}-{1}-{2}\n{3}:{4}:{5}";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        month = month >= 10? month : ("0"+month);
        var day = date.getDate();
        day = day >= 10? day : ("0"+day);
        var h = date.getHours();
        h = h >= 10? h : ("0"+h);
        var m = date.getMinutes();
        m = m >= 10? m : ("0"+m);
        var s = date.getSeconds();
        s = s >= 10? s : ("0"+s);
        datetime = datetime.format(year,month,day,h,m,s);
        return datetime;
    },
    
    //获取系统赠送房卡
    getUserBindCard:function(){
    	var self = this;
    	this._getRewardButton.interactable = false;
    	setTimeout(function(){
    	    self._getRewardButton.interactable = true;
    	}, 2000);
        if (this._canGetNum <=  0 ) {
            cc.fy.hintBox.show("您没有话费可以领取");
            return;
        }
        var onGet = function(ret){
            if(ret.errcode != 0){
                cc.fy.hintBox.show(ret.errmsg);
            }
            else{
                cc.fy.hintBox.show(ret.errmsg);
                self._canGetNum = 0;
                self._getNumLabel.string = "0元";
                // self.opentipWin();
            }
        };
        var data = {
            userid:cc.fy.userMgr.userId,
            // invitationcode:cc.fy.userMgr.invitationcode,
            money:this._canGetNum,
            activityid:cc.ACTTYPE.LX,
            wx_uuid:cc.fy.userMgr.unionid,
        };
        cc.fy.http.sendRequest("/receive_user_reward",data,onGet,cc.activityURL);
    },
    
    //获取可以领取房卡数量
    getUserBindNum:function(){
        var self = this;
        var onGet = function(ret){
            if(ret.errcode !== 0){
                // cc.fy.hintBox.show(ret.errmsg);
            }
            else{
                self._canGetNum = ret.money;
                self._getNumLabel.string = ret.money + "元";
                self._invnumLabel.string = ret.num ;
            }
        };
        var data = {
            userid:cc.fy.userMgr.userId,
            code:cc.fy.userMgr.invitationcode,
            activityid:cc.ACTTYPE.LX,
        };
        cc.fy.http.sendRequest("/get_bind_info",data,onGet,cc.activityURL);
    },

    copycode:function(){
       
        try{
            cc.fy.anysdkMgr.copyAndJump(this._mycodeLabel.string,false);
        }catch(e)
        {
            cc.fy.alert.show("不支持老版本客户端，点击确定前往下载新版本！",function(){
                cc.sys.openURL("http://fyweb.51v.cn/pzmj/");
            },true);

           // cc.fy.hintBox.show("不支持老版本客户端");
        }
        // cc.fy.hintBox.show("复制成功");
    },

    copyurl:function(){
        try{
            cc.fy.anysdkMgr.copyAndJump(this._myurlLabel.string,false);
        }catch(e)
        {
            cc.fy.alert.show("不支持老版本客户端，点击确定前往下载新版本！",function(){
                cc.sys.openURL("http://fyweb.51v.cn/pzmj/");
            },true);
        }
        // cc.fy.hintBox.show("复制成功");
    },
    
    //验证是否是数字
    checkEnter:function(){
        console.log(this._codeEditBox.string);
        if (isNaN(this._codeEditBox.string) || this._codeEditBox.string == "") {
            cc.fy.hintBox.show("请输入数字！");
        }
        else{
            this.bindcode();
        }
    },
    
    onDownLoad:function(){
        cc.sys.openURL("http://fyweb.51v.cn/pzmj/");
    },
    //绑定code
    bindcode:function(){
        var self = this;
        var onGet = function(ret){
            console.log(ret);
            if(ret.errcode !== 0){
                cc.fy.hintBox.show(ret.errmsg);
                console.log(ret.errmsg);
            }
            else{
                cc.fy.hintBox.show(ret.errmsg);
                cc.fy.userMgr.bindcode = self._codeEditBox.string;
                self.closecodeWin();
                setTimeout(function(){
                    self.refreshInfo();
                }, 1000);
            }
        };
        var data = {
            userid:cc.fy.userMgr.userId,
            code:this._codeEditBox.string,
            activityid:cc.ACTTYPE.LX,
        };
        cc.fy.http.sendRequest("/bind_user_code",data,onGet,cc.activityURL);
    },

    // 刷新显示数据
    refreshInfo:function(){
        var self = this;
        var onGet = function(ret){
            if(ret.errcode !== 0){
                console.log(ret.errmsg);
            }
            else{
                if(ret.gems != null){
                    self._lblGems.string = ret.gems;
                }
            }
        };
        
        var data = {
            account:cc.fy.userMgr.account,
            sign:cc.fy.userMgr.sign,
        };
        cc.fy.http.sendRequest("/get_user_status", data, onGet.bind(this));
    },
    
    //分享
    shareToGet:function(event,data){
        if (data == 1) {
            this.getHistoryList("免费发卡");
        }
        else{
            this.getHistoryList("邀请");
        }
        var self = this;
        var shareType = "1";
        var shareUrl = "http://fyweb.51v.cn/pzmj/index.html?code=" + cc.fy.userMgr.invitationcode;
        var info = "我的礼包码：" +  cc.fy.userMgr.invitationcode  + "，跟我一起玩地道邳州麻将，想要赶紧下手！";
        try{
            cc.fy.anysdkMgr.share("邳州麻将", info, shareUrl, shareType);
        }catch(e){
            cc.fy.anysdkMgr.share("邳州麻将", info, shareUrl, shareType);
        }finally{
        }
    },


    //记录
    getHistoryList:function(msg){
        var data = {
            userid:cc.fy.userMgr.userId,
            sign:cc.fy.userMgr.sign,
            type:this.encodeUnicode(msg),
        };
        console.log("getHistoryList",data);
        cc.fy.http.sendRequest("/set_user_statistics",data,null,cc.activityURL);
    },
    

    //转码
    encodeUnicode:function(str){  
        var res = [];  
        for ( var i=0; i<str.length; i++ ) {  
        res[i] = ( "00" + str.charCodeAt(i).toString(16) ).slice(-4);  
        }  
        return "\\u" + res.join("\\u");  
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
