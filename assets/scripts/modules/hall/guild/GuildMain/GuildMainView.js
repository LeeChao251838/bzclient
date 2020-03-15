
var md5 =  require("md5");
var GameMsgDef = require("GameMsgDef");
var ConstsDef  = require("ConstsDef");
cc.Class({
    extends: require("BaseModuleView"),

    properties: {
        
        
        
        _clubList:null,          //群列表数据
        _isChairman:false,       //是否是群主
        _isAdmin:false,          //是否是管理员
        _beInvRoomId:null,       //邀请房间ID
        nodMemberTip:cc.Node,    //成员提示红点

        _roomScroll:null,       //房间列表
        
        _mainNode:null,//主内容节点
        _topLeftNode:null,//上左部分节点
        _topRightNode:null,
        _bottomOprNode:null,//底部按钮节点
        _bottomInfoNode:null,//底部个人信息节点
        _nodRoomType:null, // 房间类型选项节点

        _gonggao:null,//公告内容
        _gonggaoNode:null,
        _gonggaoLabel:null,

        _quanzi:null,//圈子按钮
        _quanziNode:null,//圈子
        _quanziList:null,
        _guildContentScrollView:null,
        _guildContent:null,
        _guildViewitemTemp:null,
        _guildViewlist:null,

        _isClick:true,//圈子

        _clickTime: null,           //分享连接按钮点击时间

        _beganX:0,     //圈子列表专用
    },

    onLoad: function () {
        this.initEventHandlers();
        //适配
        // if(cc.sys.isNative && (cc.sys.platform == cc.sys.IPHONE || cc.sys.platform == cc.sys.ANDROID)){
        //     var size = cc.view.getFrameSize();
        //     if (size.width/size.height > cc.ScreenRatio ) {
        //         var cvs = this.node.getComponent(cc.Canvas);
        //         cvs.fitHeight = true;
        //         cvs.fitWidth = false;
        //     }  
        // }
     
        //  this.addComponent("GuildGongGao");
        //  this.addComponent("GuildHistory");
        //  this.addComponent("GuildLog");
        //  this.addComponent("GuildTongJi");
        // this.addComponent("GuildSetting");
        //  this.addComponent("GuildMember");
        //  this.addComponent("GuildPreRoom");
         this.addComponent("GuildRoom");
        
        //主内容节点
        this._mainNode= this.node.getChildByName("gameMain");  
        this._topLeftNode= this._mainNode.getChildByName("topleft");
        //主界面关闭按钮
        let BtnCloseGuild = this._topLeftNode.getChildByName("btn_back");
        cc.fy.utils.addClickEvent(BtnCloseGuild, this.node, "GuildMainView", "closeGuildMain");
        this._bottomOprNode= this._mainNode.getChildByName("bottom_opr"); 
        this._nodRoomType= this._mainNode.getChildByName("nodRoomType"); 
        this._bottomInfoNode= this._mainNode.getChildByName("bottom_info");
        this._gonggaoNode= this._mainNode.getChildByName("gonggao");
        this._gonggaoLabel= this._gonggaoNode.getChildByName("mask").getChildByName('gonggaoLabel');
        
         this._roomScroll =this._mainNode.getChildByName("nodRoom").getComponent(cc.ScrollView);
 

        this._quanzi = this._mainNode.getChildByName("quanzi");
      
        this._quanziNode = this._mainNode.getChildByName("quanziNode");
        this._quanziList = this._quanziNode.getChildByName("quanziList");
       
       
       
        //圈子列表ScrollView
        if (this._guildViewlist == null) {
            this._guildViewlist = this._quanziList.getChildByName("GuildsScrollView");
            this._guildViewlist.active = false;
            this._guildContentScrollView = this._guildViewlist.getComponent(cc.ScrollView);
        }
        if (this._guildContent == null) {
            this._guildContent = this._guildViewlist.getChildByName("view").getChildByName("content");
            this._guildContent.active = true;
        }
        this._guildViewitemTemp = cc.find("view/guildNode", this._guildViewlist);


       
        this._topRightNode = this._mainNode.getChildByName("topright");
        //分享
        let btnShare = this._topRightNode.getChildByName("btnShare");
        cc.fy.utils.addClickEvent(btnShare, this.node, "GuildMainView", "onClickShare");
        //公告
        var btnGongGao = this._topRightNode.getChildByName("btnGongGao");
        cc.fy.utils.addClickEvent(btnGongGao, this.node, "GuildMainView", "onGongGao");     
        //刷新
        let btnRefresh = this._topRightNode.getChildByName("btnRefresh");
        cc.fy.utils.addClickEvent(btnRefresh, this.node, "GuildMainView", "onRefresh");
        //设置
        let btnSetting = this._topRightNode.getChildByName("btnSetting");
        cc.fy.utils.addClickEvent(btnSetting, this.node, "GuildMainView", "onSetting");

         //成员
         let btn_member = this._bottomOprNode.getChildByName("btn_member");
         cc.fy.utils.addClickEvent(btn_member, this.node, "GuildMainView", "onMember");
         //记录
         let btn_record = this._bottomOprNode.getChildByName("btn_record");
         cc.fy.utils.addClickEvent(btn_record, this.node, "GuildMainView", "onRecord");
         //战绩
         let btn_zhanji = this._bottomOprNode.getChildByName("btn_zhanji");
         cc.fy.utils.addClickEvent(btn_zhanji, this.node, "GuildMainView", "onZhanji");
       
        //统计
        let btn_tongji = this._bottomOprNode.getChildByName("btn_tongji");
        cc.fy.utils.addClickEvent(btn_tongji, this.node, "GuildMainView", "getTongJi");
        //预设房间
        let btn_pre = this._bottomOprNode.getChildByName("btn_pre");
        cc.fy.utils.addClickEvent(btn_pre, this.node, "GuildMainView", "getGroupList");      
    },

    initEventHandlers: function () {
        let self = this;
        let game = cc.fy.gameNetMgr;
        
        game.addHandler(GameMsgDef.ID_SHOWGUILDMAINVIEW_CTC, function(data){
            if(data && data.isShow == false){
                self.hidePanel();
            }
            else{
                self.showPanel(data);
            }
        });
      
        //获取圈子信息响应
        game.addHandler('get_club_info_result',function(ret){  
            console.log("get_club_info_result111111111111111");
            console.log(ret);
            let data = ret;

            cc.fy.loading.hide();
            if (data.code == 0) {
                self.showGuildWin();
                self.shareResultURL();
            }
            else{
                cc.fy.hintBox.show(data.msg);
            }
        });
      
        
        

        //游戏邀请响应
        // game.addHandler('be_invited_to_play',function(data){  
        //     console.log("be_invited_to_playt111111111111");
        //     console.log(data);
        //     if (data.errcode != 0) {
        //         cc.fy.hintBox.show(data.msg);
        //     }
        //     else{
        //         if (!cc.fy.guildSet.isAgree()) {
        //             return;
        //         }
        //         self.showGuildGameInvAlert(data);
        //     }
        // });
      
        //玩家状态改变响应
        game.addHandler('user_state_change', function (data) {
            console.log("user_state_change111111111111111111");
            console.log(data);
            let userId = data.userId;
            let clubId = data.clubId;

            if (!cc.fy.guildMainMsg._clubList) {
                return;
            }
            var curGuild =cc.fy.guildMainMsg.getCurClub();
            var clubInfo=null;
            if(curGuild!=null){
                clubInfo =curGuild.clubInfo;
            }
            
            
            if (['offline', 'dissconnect', 'logout'].indexOf(data.action) != -1) {
                if (userId == cc.fy.userMgr.userId) {
                    return;
                }
                // for(let i=0;i<cc.fy.guildMainMsg._clubList.length;i++){
                //     var _club =cc.fy.guildMainMsg._clubList[i].clubInfo;
                //     if(_club.clubid==clubId){
                //         cc.fy.guildMainMsg._clubList[i].clubInfo.online--;
                //     }
                // }
    
            }

            if (data.action == 'online') {
                if (userId == cc.fy.userMgr.userId) {
                    return;
                }
            //    for(let i=0;i<cc.fy.guildMainMsg._clubList.length;i++){
            //         var _club =cc.fy.guildMainMsg._clubList[i].clubInfo;
            //         if(_club.clubid==clubId){
            //             cc.fy.guildMainMsg._clubList[i].clubInfo.online++;
            //         }
            //     }
               
            }

            if (data.action == 'join') {
                if (userId == cc.fy.userMgr.userId && self.node.active == true) {
                    cc.fy.net.send("get_club_info");
                   
                    return;
                }

                let club = cc.fy.guildMainMsg._clubList.find(club => club.clubInfo.clubid == clubId);
                if (!club) {
                    return;
                }
            //    for(let i=0;i<cc.fy.guildMainMsg._clubList.length;i++){
            //         var _club =cc.fy.guildMainMsg._clubList[i].clubInfo;
            //         if(_club.clubid==clubId){
            //             cc.fy.guildMainMsg._clubList[i].clubInfo.players++;
            //         }
            //     }        
            }

            if (['leave', 'remove'].indexOf(data.action) != -1) {
                if (userId == cc.fy.userMgr.userId && self.node.active == true) {
                    cc.fy.guildMainMsg._currentClubIndex = 0;
                    cc.fy.guildMainMsg._curClubid=0;
                    cc.fy.net.send("get_club_info");
                    return;
                }

                let club = cc.fy.guildMainMsg._clubList.find(club => club.clubInfo.clubid == clubId);
                if (!club) {
                    return;
                }
                // for(let i=0;i<cc.fy.guildMainMsg._clubList.length;i++){
                //     var _club =cc.fy.guildMainMsg._clubList[i].clubInfo;
                //     if(_club.clubid==clubId){
                //         cc.fy.guildMainMsg._clubList[i].clubInfo.players--;
                //     }
                // }    
                //
            }
            console.log("请求刷新:"+data.action);
            cc.fy.net.send("get_game_playnum_request",{clubId:clubId});
            // 圈子列表
          //  self.showGuildList();
        });
        
        //同意加入申请
        game.addHandler('club_apply_join_result', function(data){
            if(data.errcode != 0){
                cc.fy.hintBox.show(data.msg);
            }
            else{
                self.getUserApply();
                cc.fy.hintBox.show("操作成功");
            }
        });

        //获取玩家申请信息
        game.addHandler('get_club_applyinfo_result', function(data){  
            console.log("==>> get_club_applyinfo_result: ", data);
             if(data.code == 0){
                if(data.data.length > 0){
                    self.showJoinMemberTip(true);
                }
                else{
                    self.showJoinMemberTip(false);
                }
             }
        });
        //有玩家申请
        game.addHandler('user_apply_push', function(ret){  
            console.log("==>> user_apply: ", ret);
            
            self.showJoinMemberTip(true);
        });
        //再次进入群响应
        game.addHandler('playAgain',function(data){  
            self.playAgain();
           
        
        });

        //游戏人数响应
        game.addHandler('get_game_playnum_response_reslut_push',function(data){
            console.log("刷新人数");
          //  setTimeout(function(){
            self.refreshGuildGroupPlayerNum(data);
           // },500);
           
        });

        //房卡数目变动响应
        game.addHandler('gems_change',function(data){
            
            self.refreshGems(data);
        });
        //获取群公告
        game.addHandler('get_message_response_push',function(data){
            console.log(data);
            if(data.code != 0){
                cc.fy.hintBox.show(data.msg);
            }
            else{ 
              
                self._gonggao= data.data;
                self.showGonggao();
            }
        });
        //更新公告响应
        game.addHandler('update_message_response_push',function(data){
            console.log(data);
            if(data.code != 0){
                cc.fy.hintBox.show(data.msg); 
            }
            else{
                self._gonggao=  data.data.content ;
                self.showGonggao();
               
            }
        });
    },


    showPanel(data){
       
        this.node.active = false;
        this.openGuildWin();
    },

    hidePanel(){
       
        this.node.active = false;
    },

    //刷新房卡
    refreshGems:function(data){
     
        var lblGems = cc.find("gameMain/bottom_info/info_card/count",this.node);
        if(data == null) return;
        if(lblGems){
            var lbl = lblGems.getComponent(cc.Label);
            lbl.string = data.gems;
        }
    },
    showGonggao(){
       //公告跑马灯
        if(this._gonggao==null||this._gonggao==""){
            this._gonggaoNode.active=false;
        }else{
            var strs =this._gonggao.split("\n");
            this._gonggao=strs.join(" ");
            this._gonggaoLabel.getComponent(cc.Label).string=this._gonggao;
            this._gonggaoNode.active=true;
        }
    },

    //切换主界面页签
    changeTabs:function(event){
        let  curNode = event.target;
        // this.setTab(curNode.idx);
    },

    //设置公会右边页签（0：房间 1：成员 2：日志 3：战绩）
    setTab:function(tabIdx, refresh) {
        tabIdx = tabIdx || 0;
        refresh = refresh || false;
        if (!refresh && tabIdx == cc.fy.guildMainMsg._currentTabIndex) {
            return;
        }
        cc.fy.guildMainMsg._currentTabIndex = tabIdx;
        for (var i = 0; i < this._tabsArr.length; i++) {
            let curBtn = this._tabsArr[i].getComponent("RadioButton");
            let curWin = this._tabsWinArr[i];
            var checkimg = this._tabsArr[i].getChildByName("checkimg");
            if (tabIdx == i) {
                curWin.active = true;
                curBtn.checked = true;
                checkimg.active = true;
            }
            else{
                curWin.active = false;
                curBtn.checked = false;
                checkimg.active = false;
            }
            curBtn.refresh();
        }

       
        if (tabIdx === 0) {
            cc.fy.gameNetMgr.dispatchEvent("ctc_refresh_room_list");
        }
        else if (tabIdx == 1) {          
            cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWGUILDMEMBERVIEW_CTC, { isShow: true});
           
        }
        else if (tabIdx == 2) {
            cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWGUILDRECORDVIEW_CTC, { isShow: true});
           
        } else if (tabIdx == 3) {
            cc.fy.guildhistory.getHistroyRequest(cc.fy.guildMainMsg._currentClubIndex, 1);
        }
    },

     
    onClickShare: function () {
        let btnShare = this._topRightNode.getChildByName("btnShare");
       
        // if (btnShare) {
        //     btnShare.getComponent(cc.Button).interactable = false;
        //    this.schedule(function () {
        //         btnShare.getComponent(cc.Button).interactable = true;
        //     }, 5);
        // }

        // if(cc.fy.anysdkMgr.isXianliaoInstalled()){
            //没装闲聊
            // this.onXianLiaoShare();
        // }else{
           cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWSHAREVIEW_CTC,{isShow:true,sharetype:3});
      
    },
    //微信分享
    onWeichatShare: function(){
         var title = "【牌友圈ID:";
        
        var curGuild =cc.fy.guildMainMsg.getCurClub();
        var clubInfo =curGuild.clubInfo;
        
        // 淮安 1  苏州 2  如皋 3  连云港 5 泰兴 7
        var param = "https://hyjgame.51v.cn/activity/share/linkme?gameid=" + cc.GAMEID +"&link=" + "lbhamj" + "://mylink?" + encodeURIComponent("openPage=club&inviteCode=" + clubInfo.promo_code);
        // var userNum = this.getRoomUserNum();
        // var queStr = "";
        // if(userNum > 0 && userNum < cc.fy.gameNetMgr.seats.length){
        //     queStr = userNum + "缺" + (cc.fy.gameNetMgr.seats.length - userNum);
        // }
        console.log("param:"+param);
         cc.fy.anysdkMgr.share(title+ clubInfo.promo_code+ "】", "点击链接自动进入牌友圈", param);
    },

    onXianLiaoShare: function(){

        var title = "【牌友圈ID:";

        var curGuild =cc.fy.guildMainMsg.getCurClub();
        var clubInfo =curGuild.clubInfo;

        title=title+ clubInfo.promo_code+"】";
        // 淮安 1  苏州 2  如皋 3  连云港 5 泰兴 7
        var param = "http://fyweb.51v.cn/szmj/images/icon.png";
        // var param = "https://hyjgame.51v.cn/activity/share/linkme?gameid=" + cc.GAMEID +"&link=" + "lbhamj" + "://mylink?" + encodeURIComponent("openPage=club&inviteCode=" + clubInfo.promo_code);
        
        cc.fy.anysdkMgr.xianLiaoShareGame(clubInfo.promo_code,"club",title,"点击链接自动进入牌友圈",param);

    },

    //切换公会
    onChooseGuild:function (event) {
        let curNode = event.target;
        console.log("onChooseGuild currentClubIndex:" + cc.fy.guildMainMsg._currentClubIndex);
        console.log('idx:' + curNode.idx);

        if (cc.fy.guildMainMsg._currentClubIndex == curNode.idx)　{
            console.log("onChooseGuild same guild choosed");
            return;
        }
        cc.fy.guildMainMsg._currentClubIndex = curNode.idx;
        cc.fy.guildMainMsg.saveCurGuild();
        // this.setTab(0, true);
        this.initGuildInfo();
        this.shareResultURL();
    },

    // //群邀请信息
    // showGuildGameInvAlert:function(ret){
    //     var data = ret.data;
    //     var conf = JSON.parse(data.conf);
    //     console.log(data);
    //     this._GuildGameInvAlert.active = true;
    //     this._beInvRoomId = data.roomid;
    //     this._GuildGameInvAlert.getChildByName("guildLabel").getComponent(cc.Label).string = 
    //     "我是群(" + data.clubname + ")的" + data.username + ",\n快来一起玩吧";
    //     this._GuildGameInvAlert.getChildByName("wanfaLabel").getComponent(cc.Label).string =
    //     cc.fy.guildpreroom.getRoomName(conf) 
    //     + " " + cc.fy.guildpreroom.getRoomJuShu(conf) 
    //     + " " + cc.fy.guildpreroom.getRoomWanfa(conf)
    //     + " " + cc.fy.guildpreroom.getRoomaagems(conf);

    //     if (ret.promocode != null) {
    //         cc.fy.promoCode = ret.promocode;
    //     }
    // },

    // //进入邀请房间
    // enterInvRoom:function(){
    //     if (this._beInvRoomId != null) {
    //         cc.fy.userMgr.enterRoom(this._beInvRoomId);
    //     }
    //     this.closeGuildGameInvAlert();
    //     this._beInvRoomId = null;
    // },

    //  //关闭群邀请界面
    // closeGuildGameInvAlert:function(){
    //     cc.fy.promoCode = null;
    //     this._GuildGameInvAlert.active = false;
    // },

    //显示圈子主界面
    showGuildWin:function(){
        this.node.active = true;
       
        cc.fy.guildMainMsg._currentClubIndex=0;
        cc.fy.guildMainMsg._curClubid=0;
        
        if (cc.fy.guildMainMsg._clubList == null || cc.fy.guildMainMsg._clubList.length == 0) {          
            this.openJoinGuildInput();
        }else{
            console.log("save curClub:",cc.fy.reloadData);
            if(cc.fy.reloadData==null){
                cc.fy.reloadData =cc.fy.guildMainMsg.getSaveGuild();
            }
            if(cc.fy.reloadData!=null && cc.fy.reloadData.curClubId!=null){
                for(let i=0;i<cc.fy.guildMainMsg._clubList.length;i++){
                    var clubInfo =cc.fy.guildMainMsg._clubList[i].clubInfo;
                    console.log("save curClub i:"+i,clubInfo);
                    if(clubInfo.clubid==cc.fy.reloadData.curClubId){
                        cc.fy.guildMainMsg._currentClubIndex =i ;
                        break;
                    }
                }
            }
            console.log("save curClubcurClubindex:"+cc.fy.guildMainMsg._currentClubIndex );
            this._quanzi.active=false;
            this._quanziNode.active=true;
            //初始化圈列表位置
            if(this._beganX!=0){
                this._quanziList.x=this._beganX;
            }else{
                this._quanziList.active=true;
            }
            
            console.log("553beganX:"+this._beganX+"======="+this._quanziList.x);
            //圈子列表
            this.showGuildList();
            this.initGuildInfo();
            this.initUserInfo();
        }
        cc.fy.guildMainMsg.saveCurGuild();
    }, 

    

    //刷新群房间人数
    refreshGuildGroupPlayerNum:function(data){
        console.log("刷新群在线人数：",data);
        if(data == null) return;
        var clubid = data.clubId;
        var players = data.players;
        var online = data.online + (data.playInger? data.playInger:0);

        
        if(this._guildContent){
            for(var i = 0; i < this._guildContent.childrenCount; ++i){
                var child = this._guildContent.children[i];
                console.log("clubid:"+child.clubid+"------"+clubid);
                if(child && child.clubid == clubid){
                    var info=  child.getChildByName('guildInfo').getChildByName('background');
                    var infoCheck= child.getChildByName('guildInfo').getChildByName('checkmark');
                    info.getChildByName("onlineLabel").getComponent(cc.Label).string =  online + "/" + players;
                    infoCheck.getChildByName("onlineLabel").getComponent(cc.Label).string =  online + "/" + players ;
                    break;
                }
            }  
        }
      
    },

    //设置圈子信息
    initGuildInfo () {
        
        let curClub=cc.fy.guildMainMsg.getCurClub();
        if(curClub==null){
            return;
        }
        let clubInfo =curClub.clubInfo;
        let level = curClub.level;
        this._topLeftNode.getChildByName('guildNameLabel').getComponent(cc.Label).string = clubInfo.name;
        this._topLeftNode.getChildByName('guildIdLabel').getComponent(cc.Label).string = 'ID:' + clubInfo.promo_code;

        let btnPre = this._bottomOprNode.getChildByName("btn_pre");
        btnPre.active = level == 1 ;

        let btnTongJi = this._bottomOprNode.getChildByName("btn_tongji");
        btnTongJi.active =  level >= 1 ;

        let btnRecord =this._bottomOprNode.getChildByName("btn_record");
        btnRecord.active = level>=1;

        this.getGongGao(clubInfo);
        //房间
        cc.fy.loading.show();
        cc.fy.gameNetMgr.dispatchEvent("ctc_refresh_room_list",{isChange:true});
         this.getUserApply();
    },
    initUserInfo(){
        var headNode=this._bottomInfoNode.getChildByName('info_head');
        var imgLoader = headNode.getChildByName('headimg').getComponent("ImageLoader");
        cc.fy.resMgr.setSpriteFrameByUrl(ConstsDef.URL_ATLAS_HEADIMG,headNode.getChildByName('headimg').getComponent(cc.Sprite));
        imgLoader.setUserID(cc.fy.userMgr.userId);
        this._bottomInfoNode.getChildByName('info_name').getComponent(cc.Label).string = cc.fy.userMgr.userName;
        var cardNode=this._bottomInfoNode.getChildByName('info_card');
        var count = cardNode.getChildByName('count').getComponent(cc.Label);
        count.string=cc.fy.userMgr.gems;
    },

     // 有会员加入提醒
    showJoinMemberTip(bShow){
        let curGuild = cc.fy.guildMainMsg.getCurClub();
        if (curGuild.level >= 1 ) {   // 是会长 管理员
            this.nodMemberTip.active = bShow;
        }
        else {
             this.nodMemberTip.active = false;
           
        }
    },
    //获取成员申请信息
    getUserApply(){
        let curGuild = cc.fy.guildMainMsg.getCurClub();
        if(curGuild != null){
            let curGuildInfo = curGuild.clubInfo;
            cc.fy.net.send("get_club_applyinfo", {"clubid":curGuildInfo.clubid});
        }
    },

    //显示公告信息
    getGongGao: function(clubInfo){      
        if(clubInfo.clubid){         
            cc.fy.net.send("get_message_request",{"clubId":clubInfo.clubid});
        }
    },

    //获取群列表条目
    getGuildViewItem:function(){
        var content = this._guildContent;
        var viewitemTemp = this._guildViewitemTemp;
        var node = cc.instantiate(viewitemTemp);  
        cc.fy.utils.addClickEvent(node, this.node, "GuildMainView", "onChooseGuild");
        content.addChild(node);
        return node;
    },

     //显示公会列表
     showGuildList:function(){
         console.log("刷新俱乐部列表")
        // this._guildContent.removeAllChildren();
        this._guildViewlist.active = true;
        if(this._guildContentScrollView)
        {
            this._guildContentScrollView.scrollToTop(0.1);
        }
       
        var guildnods=this._guildContent.children;
        var len=0;
        if (cc.fy.guildMainMsg._clubList != null && cc.fy.guildMainMsg._clubList.length> 0) {
            var count=cc.fy.guildMainMsg._clubList.length;
            len=count;
            this._quanziList.getChildByName('quanCount').getComponent(cc.Label).string="圈子:"+count;
            for (var i = 0; i < cc.fy.guildMainMsg._clubList.length; i++) {
                var data = cc.fy.guildMainMsg._clubList[i].clubInfo;
                var node = guildnods[i];
                if(node==null){
                    node = cc.instantiate(this._guildViewitemTemp);
                    this._guildContent.addChild(node);
                    cc.fy.utils.addClickEvent(node, this.node, "GuildMainView", "onChooseGuild");
                }
                node.active = true;
                node.idx = i;
                node.clubid = data.clubid;
               
                let toggle= node.getComponent(cc.Toggle);
                if(cc.fy.guildMainMsg.isCurClub(data.clubid)){
                    toggle.check();
                } else{
                    toggle.uncheck();
                }
                let guild=node.getChildByName('guildInfo').getChildByName('background');
                let guildCheck=node.getChildByName('guildInfo').getChildByName('checkmark');
                guild.getChildByName('guildNameLabel').getComponent(cc.Label).string = data.name;
                guildCheck.getChildByName('guildNameLabel').getComponent(cc.Label).string = data.name;
                if (data.online <= 1) {data.online = 1};
                if (data.players <= 1) {data.players = 1};
                if (data.online >= data.players) {data.online = data.players};
                guild.getChildByName('onlineLabel').getComponent(cc.Label).string =   data.online + "/" + data.players ;
                guildCheck.getChildByName('onlineLabel').getComponent(cc.Label).string =   data.online + "/" + data.players ;
                let head= guild.getChildByName('headMask').getChildByName('mask').getChildByName('chairmanImage');
                let headCheck= guildCheck.getChildByName('headMask').getChildByName('mask').getChildByName('chairmanImage');
                cc.fy.resMgr.setSpriteFrameByUrl(ConstsDef.URL_ATLAS_HEADIMG,head.getComponent(cc.Sprite));
                let imageloader = head.getComponent("ImageLoader");
                if (imageloader && data.headimg) {
                    imageloader.setUrl(data.headimg);
                }
                cc.fy.resMgr.setSpriteFrameByUrl(ConstsDef.URL_ATLAS_HEADIMG,headCheck.getComponent(cc.Sprite));
                let imageloaderCheck = headCheck.getComponent("ImageLoader");
                if (imageloaderCheck && data.headimg) {
                    imageloaderCheck.setUrl(data.headimg);
                }
                 cc.fy.net.send("get_game_playnum_request",{clubId:data.clubid});
            }
            for(let i=len;i<guildnods.length;i++){
                guildnods[i].active=false;
            }
        }
        console.log("save curClubcurClubindex:"+cc.fy.guildMainMsg._currentClubIndex );
    },
   
    
    quanListOpen(){
       
        var _this=this;
        if(this._isClick){
            cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
            this._isClick=false;
            this._quanzi.active=false;
            this._quanziNode.active=true;
            
            
            var actionBy = cc.moveTo(0.2,this._beganX,-3.5);    
            console.log("715beganX:"+this._beganX+" ====="+this._quanziList.x);      
            var seq=  cc.sequence(actionBy,cc.callFunc(function(){
                _this._isClick=true;
            }))
           
            this._quanziList.runAction(seq);
        }
    },
    quanListClose(){
       
        var _this=this;
        if(this._isClick){
            this._isClick=false;
            cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
            if(this._beganX==0){
                this._beganX=this._quanziList.x;
            }   
            var actionBy = cc.moveTo(0.2,this._beganX-500,-3.5);
           console.log("730beganX:"+this._beganX+" ======"+this._quanziList.x);
            var seq=  cc.sequence(actionBy,cc.callFunc(function(){
                _this._isClick=true;
                _this._quanziNode.active=false;
                _this._quanzi.active=true;
            }))
             this._quanziList.runAction(seq);
        }  
    },
    btnAddGuild(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.openJoinGuildInput();
        
    },
    //统计按钮事件
    getTongJi:function(){
   
       
        cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWGUILDTONGJIVIEW_CTC,{isShow:true});
    },

    //公告按钮事件
    onGongGao:function(){
        cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWGUILDGONGGAOVIEW_CTC,{isShow:true});
      
    },

    //刷新按钮事件
    onRefresh (event) {
        let curNode = event.target;
        cc.fy.loading.show();
        curNode.getComponent(cc.Button).interactable = false;
        setTimeout(function(){
            curNode.getComponent(cc.Button).interactable = true;
        }, 1500);
        //刷新房间信息
        // cc.fy.gameNetMgr.dispatchEvent("ctc_refresh_room_list");
        if(this._roomScroll){
            console.log("拉到顶");
            this._roomScroll.scrollToTop(0.1);
        }
        cc.fy.loading.show();
        cc.fy.net.send("get_club_info");
    },

    //设置按钮事件
    onSetting () {
        
        cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWGUILDSETTINGVIEW_CTC,{isShow:true}); 
    },
    onMember(){
               
        cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWGUILDMEMBERVIEW_CTC, { isShow: true,showTip:this.nodMemberTip.active});
       
    },
    onRecord(){
        cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWGUILDRECORDVIEW_CTC, { isShow: true});
    },
    onZhanji(){

        cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWZHANJIVIEW_CTC, { isShow: true});
    },

    //获取群信息
    getClubInfo:function(){
        cc.fy.loading.show("正在进入圈子");
        cc.fy.net.send("get_club_info");
    },

    //预设房间按钮事件
    getGroupList:function(){
        var club=cc.fy.guildMainMsg.getCurClub();
        var clubInfo=club.clubInfo;
        cc.fy.guildMainMsg._curGuild=clubInfo;
        cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWCREATEROOMVIEW_CTC, {isShow:true, isClub:true, clubInfo:clubInfo});
    },

    //打开创建（加入）群界面
    openJoinGuildInput:function(){  
        cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWJOINGUILDVIEW_CTC,{isShow:true});
    },
  
    //打开群界面
    openGuildWin:function(){
        if (cc.fy.net.isPinging == false) {
            cc.fy.hintBox.show("您的网络不稳定，请稍后重试！");
            cc.fy.guildMainMsg.reqGuildLoginInfo();
            return;
        }

       

        this.getClubInfo();

    },

    //关闭群界面
    closeGuildMain:function(){
       
        this.node.active = false;
         cc.fy.reloadData = null;
       
    },

    // //播放第一次打开群的指示动画
    // playfirstTimeGuide:function(){
    //     let tarnode = this._GuildWinLeft.getChildByName("firstTimeGuide");
    //     tarnode.active = true;
    //     var skeleton = tarnode.getComponent(sp.Skeleton);
    //     skeleton.paused = false;
    //     skeleton.setAnimation(1, "animation", true);

    //     setTimeout(function(){
    //         skeleton.paused = true;
    //         tarnode.active = false;
    //     }, 100000);
    // },

    // //停止播放第一次打开群的指示动画
    // stopfirstTimeGuide:function(){
    //     let tarnode = this._GuildWinLeft.getChildByName("firstTimeGuide");
    //     if (tarnode && tarnode.active == true) {
    //         tarnode.active = true;
    //         var skeleton = tarnode.getComponent(sp.Skeleton);
    //         skeleton.paused = true;
    //         tarnode.active = false;
    //     }
    // },

    //销毁群
    onDestroy:function(){
        // cc.fy.net.fuckSelf(); 
    },

    //分享连接
    shareResultURL:function(event){
        var state = 0;
        console.log("分享链接");
        console.log(cc.fy.guildMainMsg._currentClubIndex);
        console.log(cc.fy.guildMainMsg._clubList);
        var curGuild =null;
        if(cc.fy.guildMainMsg._clubList){
            if(cc.fy.guildMainMsg._clubList[cc.fy.guildMainMsg._currentClubIndex] == null) return;
            curGuild = cc.fy.guildMainMsg._clubList[cc.fy.guildMainMsg._currentClubIndex].clubInfo;
        }
     
        if (!curGuild) return;
        if(event && event.target){ // 设置分享
            var dt = Date.now();
            if(this._clickTime != null){         
                if(dt - this._clickTime < 1000){
                    cc.fy.hintBox.show("操作过快，请稍后重试！");
                    var localIsShare = cc.fy.localStorage.getItem("isShare");
                    if(localIsShare == null) localIsShare = false;
                    var toggle = event.target.parent.getComponent(cc.Toggle);
                    toggle.isChecked = localIsShare;
                    return;
                }
            }

            state = 0;
            var toggle = event.target.parent.getComponent(cc.Toggle);
            var isShare = toggle.isChecked ? 1 : 0;
            this._clickTime = Date.now();
            cc.fy.net.send("share_histroy_url", {"clubid":curGuild.clubid,"state":state,"isShare":isShare});
        }
        else{ // 获取分享设置
            state = 1;
            cc.fy.net.send("share_histroy_url", {"clubid":curGuild.clubid,"state":state,"isShare":null});
        }
    },
    update(dt){
        if(this._gonggao){
            var x = this._gonggaoLabel.x;
            x -= dt*100;
            if(x +this._gonggaoLabel.width< -350){
                x = 250;
            }
            this._gonggaoLabel.x = x;
        }

    },
});
