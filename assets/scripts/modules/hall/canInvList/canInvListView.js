var GameMsgDef = require("GameMsgDef");
var ConstsDef = require("ConstsDef");
cc.Class({
    extends: require("BaseModuleView"),

    properties: {
        contentNode:cc.Node,//主内容侧边整体节点
        listScrollView:cc.Node,
        contentListNode:cc.Node,//装item
        itemNode:cc.Node,
        _currentFriendList:null,
        _isClick:true,
        nullView:cc.Node,//暂无
    },

    // use this for initialization
    onLoad(){
        this.initEventHandlers();
        this.initView();
    },

    initEventHandlers(){
        var self = this;
        var game = cc.fy.gameNetMgr;
        
        game.addHandler(GameMsgDef.ID_SHOWKCANINVLISTVIEW_CTC, function(data){
            if(data.isShow == false){
                self.close();
            }
            else{
                console.log("ID_SHOWKCANINVLISTVIEW_CTC ---- ");
                if(data.content){
                    self.show(data);
                }
            }
        });
    },

    initView(){
      
    },

    close(){
        var _this=this;
        if(this._isClick){
            this._isClick=false;
            var actionBy = cc.moveBy(0.2,-420, 0);  
            var seq=  cc.sequence(actionBy,cc.callFunc(function(){
                _this._isClick=true;      
               
                _this.node.active = false;
            }))
            this.contentNode.runAction(seq);
        } 
    },

    show(data){
        var _this=this;
        if(this._isClick){
            this._isClick=false;
            this.node.active = true;
            this.RefreshFriendList(data.content);
            var actionBy = cc.moveBy(0.2, 420, 0);          
            var seq=  cc.sequence(actionBy,cc.callFunc(function(){
                _this._isClick=true;
            }))
            this.contentNode.runAction(seq);
        }
    },

    RefreshFriendList:function(ret){
       
        this.contentListNode.removeAllChildren();
        this.listScrollView.active = true;
        let _friendContentScrollView=this.listScrollView.getComponent(cc.ScrollView);;
        if(_friendContentScrollView)
        {
            _friendContentScrollView.scrollToTop();
        }
        this.nullView.active=false;
        if (ret != null && ret.length> 0) {
            this._currentFriendList = ret;
            for (var i = 0; i < ret.length; i++) {
                var data = ret[i];
                var node = this.getFriendViewItem(i);
                node.active = data.userId == cc.fy.userMgr.userId ? false : true;
                node.idx = i;
                node.getChildByName('nameLabel').getComponent(cc.Label).string = data.name ;
                let headBox= node.getChildByName("headMask").getChildByName("mask")
                let imageloader = headBox.getChildByName("headimg").getComponent("ImageLoader");
                
                  //先初始化默认头像
                cc.fy.resMgr.setSpriteFrameByUrl(ConstsDef.URL_ATLAS_HEADIMG,headBox.getChildByName("headimg").getComponent(cc.Sprite));
                if (data.headimg != null && data.headimg != "") {
                    imageloader.setUrl(data.headimg);
                }
                node.getChildByName("online").active=true;
                node.getChildByName("gaming").active=false;
                if(data.isPlay){
                    node.getChildByName("online").active=false;
                    node.getChildByName('gaming').active=true
                }
                let btnInv = node.getChildByName("btnInv");
                btnInv.idx = i;
                if (btnInv) {
                    cc.fy.utils.addClickEvent(btnInv.getComponent(cc.Button), this.node, "canInvListView", "InvFriend");
                }
                btnInv.active = !data.isPlay;
            }
        }else{
            this.nullView.active=true;
        }
    },
    getFriendViewItem:function(index){
        var content = this.contentListNode;
        var node = cc.instantiate(this.itemNode);
        content.addChild(node);
        return node;
    },
    InvFriend:function(event){
        let  curNode = event.target;
        if (curNode.idx == null ) {
            return;
        }
        if (this._currentFriendList == null) {
            return;
        }
        setTimeout(function(){
            if (curNode == null) {
                return;
            }
            curNode.getComponent(cc.Button).interactable = true;
            curNode.getChildByName('bg_btn_agree').color = new cc.Color(255, 255, 255);
            curNode.getChildByName('btnLabel').color=new cc.Color(255, 255, 255);
            curNode.getChildByName('btnLabel').getComponent(cc.LabelOutline).width=2;  
        }, 5000);
        curNode.getComponent(cc.Button).interactable = false;
        curNode.getChildByName('bg_btn_agree').color = new cc.Color(138, 138, 138);
        curNode.getChildByName('btnLabel').color=new cc.Color(138, 138, 138);
        curNode.getChildByName('btnLabel').getComponent(cc.LabelOutline).width=0;  
       
        let friendData = this._currentFriendList[curNode.idx];
        var data = {
            userId :cc.fy.userMgr.userId,
            invite_userId:friendData.userId,
            clubId:cc.fy.gameNetMgr.conf.clubId,
            clubname:"xxx",
            conf:JSON.stringify(cc.fy.gameNetMgr.conf),
            roomid:cc.fy.gameNetMgr.roomId,
            username:cc.fy.userMgr.userName,
        }
        cc.fy.http.sendRequest('/invite_user_play', data, function(ret){
            console.log("invite_user_play");
            console.log(ret);
            cc.fy.hintBox.show('邀请成功')
        },"http://" + cc.fy.SI.clubHttpAddr); 
    },
    //关闭
    onCloseBtn:function(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.close()
    },

});