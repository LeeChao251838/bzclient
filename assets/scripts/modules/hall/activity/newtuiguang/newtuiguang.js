cc.Class({
    extends: cc.Component,

    properties: {
        _tuiguangWin:null,
        _codeWin:null,
        _tipWin:null,
        _codeEditBox:null,
        _codeLabel:null,
        _newPlayerButton:null,
        _sureButton:null,
        _getRButton:null,
        _getButton:null,
        _timeLabel:null,
        _headArr:null,
        _lblGems:null,

        _touxiangURL:"http://fyweb.51v.cn/pzmj/images/touxiang.png",
    },

    // use this for initialization
    onLoad: function () {
        this._tuiguangWin = this.node.getChildByName("newtuiguangWin");
        this._codeWin = this._tuiguangWin.getChildByName("codeWin");
        this._tipWin = this._tuiguangWin.getChildByName("tipWin");
        this._headArr = [];

        var winBg = this._tuiguangWin.getChildByName("win_bg");
        this._newPlayerButton = winBg.getChildByName("newPlayerButton");
        this._getRButton = winBg.getChildByName("getButton").getComponent("RadioButton");
        this._getButton = winBg.getChildByName("getButton").getComponent(cc.Button);
        this._timeLabel = winBg.getChildByName("timeLabel").getComponent(cc.Label);
        this._codeLabel = winBg.getChildByName("codeLabel").getComponent(cc.Label);
        this._codeEditBox = this._codeWin.getChildByName("win_bg").getChildByName("Sprite2").getChildByName("EditBox").getComponent(cc.EditBox);;
        this._sureButton = this._codeWin.getChildByName("win_bg").getChildByName("Button").getComponent(cc.Button);;

        for (var i = 0; i < winBg.getChildByName("friendsSprite").children.length; i++) {
            this._headArr.push(winBg.getChildByName("friendsSprite").children[i]); 
        }

         // 大厅房卡数量
        if(this._lblGems == null){
            this._lblGems = cc.find("Canvas/top_left/headinfo/lblGems").getComponent(cc.Label);
        }

        this.isNewPlayer();
        this._codeLabel.string = cc.fy.userMgr.invitationcode;


        // if (cc.fy.userMgr.bindcode == "0") {
        //     this._newPlayerButton.active = true;
        // }

    },


    opentuiguangWin:function(){
        this._tuiguangWin.active = true;
        this.getBindInfo();
        if (cc.fy.actConfig.LXStartTime != null && cc.fy.actConfig.LXEndTime != null) {
            var start = this.dateFormat(cc.fy.actConfig.LXStartTime).substring(0,10);
            var end = this.dateFormat(cc.fy.actConfig.LXEndTime).substring(0,10);
            this._timeLabel.string = "活动时间: " + start + "到" + end;
        }
    },

    closetuiguangWin:function(){
        this._tuiguangWin.active = false;
    },

    opencodeWin:function(){
        this._codeWin.active = true;
    },

    closecodeWin:function(){
        this._codeWin.active = false;
    },

    opentipWin:function(){
        this._tipWin.active = true;
    },

    closetipWin:function(){
        this._tipWin.active = false;
    },

    //判断是否新用户
    isNewPlayer:function(){
        var self = this;
        var onGet = function(ret){
            console.log("isNewPlayer=====>",ret);
            if(ret.errcode == 0 && ret.isShow == true){
                self._newPlayerButton.active = true;
            }
        };
        var data = {
            userid:cc.fy.userMgr.userId,
            activitytype:cc.ACTTYPE.LX,
        };
        cc.fy.http.sendRequest("/is_new_user",data,onGet,cc.activityURL);
    },

    getBindInfo:function(){
        var self = this;
        var onGet = function(ret){
            if (ret.errcode == 0) {
                self.showBingInfo(ret.data);
                if (ret.data.length < 6) {
                    self._getRButton.checked = true;
                    self._getButton.interactable = false;
                }
                else{
                    self._getRButton.checked = false;
                    self._getButton.interactable = true;
                }
            }
            else{
                self._getRButton.checked = true;
                self._getButton.interactable = false;
            }
            self._getRButton.refresh();

        };
        var data = {
            userid:cc.fy.userMgr.userId,
            activityid:cc.ACTTYPE.LX,
            code:cc.fy.userMgr.invitationcode,
        };
        cc.fy.http.sendRequest("/new_get_bind_info",data,onGet,cc.activityURL);
    },
  
    showBingInfo:function(data){
        data.sort(function(a,b){
            console.log(a.bindtime);
            return a.bindtime > b.bindtime; 
        });
        for (var i = 0; i < data.length; i++) {
            if (i >= 6) {
                return;
            }
            var personInfo = data[i];
            var friendsSprite = this._headArr[i];
            if (personInfo.name != null) {
                friendsSprite.getChildByName("nameLabel").active = true;
                friendsSprite.getChildByName("bgSprite").active = true;
                friendsSprite.getChildByName("nameLabel").getComponent(cc.Label).string = personInfo.name;
            }
            var imageloader = friendsSprite.getChildByName("headSprite").getComponent("ImageLoader");
            if (personInfo.headimg != null) {
                imageloader.setUrl(personInfo.headimg);
            }
            else{
                imageloader.setUrl(this._touxiangURL);
            }
        }

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
                self._newPlayerButton.active = false;
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

    //验证是否是数字
    checkEnter:function(){
        var self = this;
        this._sureButton.interactable = false;
        setTimeout(function(){
            self._sureButton.interactable = true;
        }, 1500);
        console.log(this._codeEditBox.string);
        if (isNaN(this._codeEditBox.string) || this._codeEditBox.string == "") {
            cc.fy.hintBox.show("请输入数字！");
        }
        else{
            this.bindcode();
        }
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
    

    //分享
    shareToGet:function(){
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
});
