var GameMsgDef = require("GameMsgDef");

cc.Class({
    extends: require("BaseModuleView"),

    properties: {
        
        _mainNode:null,//主内容节点
        _contentNode:null,//主内容侧边整体节点
        _memberNode: null,           //成员节点



        _memberSearch: null,              //成员搜索
        _searchEditBox: null,         //成员输入框
        _memberName: null,           //查询的成员名
      
        _memberList: null,           //成员数据

        //_memberHongDian: null,       //成员提示红点
        _joinView: null,         //成员申请滚动区 

        _joinList: null,         //成员申请数据
        
        //_applyInfo: [],              //申请信息

        _operView:null,

        scrollViewMember:cc.ScrollView,        // 成员列表
        memberContent:cc.Node,          
        memberItem:cc.Node,                     //单个成员
        scrollViewJoin:require("ScrollViewController"),        // 审核列表

        checkTip:cc.Node,            //成员审核提示红点

    
        tabBtn:cc.Node,//审批遮罩按钮节点

        _tabsArr:null,//页签
        
        _currentTabIndex:0,//当前页签  0成员 1审核

        _curPage:0,
        _maxPage:0,
        _isClick:true,


        _beganX:0,
    },

    onLoad: function () {
        this.initView();
        this.initEventHandlers();
    },

    start:function(){
        
    },

    initEventHandlers:function(){
        var self = this;
        var game = cc.fy.gameNetMgr;
        
        game.addHandler(GameMsgDef.ID_SHOWGUILDMEMBERVIEW_CTC, function(data){
            if(data && data.isShow == false){
                self.hidePanel();
            }
            else{
                self.showPanel(data);
            }
        });

         //玩家状态改变响应
        game.addHandler('user_state_change', function (data) {
            console.log("user_state_change,,refresh member list");
            console.log(data);
            return;
            if(self.node.active==false){
                return;
            }
            let userId = data.userId;
            let clubId = data.clubId;

            if (!cc.fy.guildMainMsg._clubList) {
                return;
            }
            var curGuild =cc.fy.guildMainMsg.getCurClub();
            var clubInfo =curGuild.clubInfo;

            if(clubInfo.clubid != clubId){
                return ;
            }
           
            if (['offline', 'dissconnect', 'logout'].indexOf(data.action) != -1) {
                if (userId == cc.fy.userMgr.userId) {
                    return;
                }
                if(self._currentTabIndex==0){
                    self._operView.active = false;
                    self.sendMemberRequest();
                }
            }

             if (data.action == 'online') {
                if (userId == cc.fy.userMgr.userId) {
                    return;
                }
                if(self._currentTabIndex==0){
                    self._operView.active = false;
                    self.sendMemberRequest();
                }
             }

             if (data.action == 'join') {
                if (userId == cc.fy.userMgr.userId) {
                    return;
                }  
                if(self._currentTabIndex==0){
                    self._operView.active = false;
                    self.sendMemberRequest();
                }
             }

              if (['leave', 'remove'].indexOf(data.action) != -1) {
                if (userId == cc.fy.userMgr.userId) {
                    self.hidePanel();
                    return;
                }
            }

        });

        
      
        //请求成员响应
        game.addHandler('club_members_response',function(data){  
            console.log(data);
            if (data.code == 0) {
              
                self._memberList = data.groupUsers;
                console.log(self._memberList);
                self.refreshMemberList(true);
            }
        });

        //有玩家响应
        game.addHandler('user_apply_push', function(ret){  
            console.log("==>> user_apply: ", ret);
            if(self.node.active==false){
                return;
            }
            self.showCheckTip(true);
             if(self._currentTabIndex==1){
                self.getUserApply();
            }
        });
        //请求成员操作响应
        game.addHandler('club_member_oper_response', function (data) {
            console.log("GuildMemberOper");
            console.log(data);
            var ret = data;
            if (ret.code != 0) {
                cc.fy.hintBox.show(ret.msg);
            }
            else{
                if(!ret.data || ret.data.operId == cc.fy.userMgr.userId){
                    self._operView.active = false;
                    cc.fy.hintBox.show(ret.msg);
                    self.getMemberRequest(null);
                }
                else if(ret.data.userId != cc.fy.userMgr.userId){
                    self.getMemberRequest(null);
                    return;
                }
                else{
                    self.refreshMember(ret.data);
                }
            }
        });

        //请求成员申请响应结果
        game.addHandler('get_club_applyinfo_result',function(data){  
            console.log("GuildMemberApply");
            console.log(data);    
            if(self.node.active==false){
                return;
            }       
            if (data.code == 0) {
                self._joinList = data.data;
                self.refreshJoinList(data);
                if(data.data.length>0){
                    self.showCheckTip(true);
                }else{
                    self.showCheckTip(false);
                }
            }
            else{
                cc.fy.hintBox.show(data.msg);
            }
        });

        //操作成员申请响应结果
        game.addHandler('club_apply_join_result',function(data){  
            console.log("GuildMemberApplyOper");
            console.log(data);
            if (data.errcode != 0) {
                cc.fy.hintBox.show(data.msg);
            }
            else{
                self.getUserApply();
                cc.fy.hintBox.show("操作成功");
            }
        });

          //成员申请响应
        // game.addHandler('user_apply_response',function(data){  
        //     console.log("GuildMemberUserApply");
        //     console.log(data);
        //     console.log(self._clubIndex);
        //     var info = {
        //         clubid:data.clubId,
        //         userid:data.userId,
        //         isDeal:false
        //     }
        //     self._applyInfo.push(info);
        //     console.log(self._applyInfo);
        //     if(cc.fy.guildMgr._clubInfo[self._clubIndex].clubInfo.clubid == data.clubId){
        //         var isShow = cc.fy.guildMgr._clubInfo[self._clubIndex].level >= 1 ? true : false;
        //         if(isShow){
        //             self._memberHongDian.active = !info.isDeal;
        //             self._joinHongDian.active = !info.isDeal; 
        //         }
        //     }
        // });         
    },

    

    initView:function(){
        // 作为弹框模式 不隐藏其它弹框
        this.setHideOther(false);
      
        //初始化节点
  
        this._mainNode= this.node.getChildByName("gameMain")
        this._contentNode= this._mainNode.getChildByName("content");
        //this._memberHongDian = this._GuildWinRight.getChildByName("memberTab").getChildByName("hongdian");
        this._memberNode = this._contentNode.getChildByName("memberNode");

        this._memberSearch = this._memberNode.getChildByName("search");
    
        this._searchEditBox = this._memberSearch.getChildByName("searchEditBox");
        //this._joinHongDian = this._changePage.getChildByName("btnJoinList").getChildByName("hongdian");
        //查询成员
        var btnSearch = this._memberSearch.getChildByName("btnSearch");
        cc.fy.utils.addClickEvent(btnSearch, this.node, "GuildMemberView", "searchMember");


        this._joinView = this._contentNode.getChildByName("joinNode");
   

   
        // //成员申请上一页
        // var btnJoinLast = this._joinNode.getChildByName("btnLast");
        // cc.fy.utils.addClickEvent(btnJoinLast, this.node, "GuildMemberView", "onJoinLeft");
        // //成员申请下一页
        // var btnJoinNext = this._joinNode.getChildByName("btnNext");
        // cc.fy.utils.addClickEvent(btnJoinNext, this.node, "GuildMemberView", "onJoinRight");

        //成员操作
        this._operView = this._mainNode.getChildByName("operView");
        cc.fy.utils.addClickEvent(this._operView, this.node, "GuildMemberView", "onOperViewClicked");
        //升职
        var btnPromote = cc.find('listView/btnPromote', this._operView);
        cc.fy.utils.addClickEvent(btnPromote, this.node, "GuildMemberView", "onOperBtnClicked");
        //降职
        var btnDemote = cc.find('listView/btnDemote', this._operView);
        cc.fy.utils.addClickEvent(btnDemote, this.node, "GuildMemberView", "onOperBtnClicked");
        //开除
        var btnRemove = cc.find('listView/btnRemove', this._operView);
        cc.fy.utils.addClickEvent(btnRemove, this.node, "GuildMemberView", "onOperBtnClicked");


        
        this._tabsArr = [];
        if (this._tabsArr) {
            var toggleTab=this._contentNode.getChildByName("toggleTab");
          
            var memberTab=toggleTab.getChildByName("memberTab");
            var joinTab=toggleTab.getChildByName("joinTab");
            memberTab.idx=0;
            joinTab.idx=1;
            this._tabsArr.push(memberTab);
            this._tabsArr.push(joinTab);
            // cc.fy.utils.addClickEvent(memberTab, this.node, "GuildMemberView", "changeTabs");
           
            // cc.fy.utils.addClickEvent(joinTab, this.node, "GuildMemberView", "changeTabs");
            
        }
    },

    showPanel:function(data){
        var _this=this;
        if(this._isClick){
            this._isClick=false;
            this.node.active = true;
            if(cc.fy.guildMainMsg.getCurClub().level >= 1){
                this.tabBtn.active=false;           
            }else{
                this.tabBtn.active=true;   
            }
    
            if(data.showTip){
                this.showCheckTip(true);
            }else{
                this.showCheckTip(false);
            }
            this.initInfo();
            
            var actionBy = cc.moveTo(0.2, -263, 0);  
            if(this._beganX!=0){
                actionBy = cc.moveTo(0.2, this._beganX, 0);
            }        
            var seq=  cc.sequence(actionBy,cc.callFunc(function(){
                _this._isClick=true;
            }))
            this._contentNode.runAction(seq);
        }
    },

    hidePanel:function(){
        if(this.node.active==false){
            return;
        }
        var _this=this;
        if(this._isClick){
            this._isClick=false;
            this._operView.active = false;
            if(this._beganX==0){
                this._beganX=this._contentNode.x;
            }
            var actionBy = cc.moveTo(0.2,-800, 0);  
            var seq=  cc.sequence(actionBy,cc.callFunc(function(){
                _this._isClick=true;      
               
                _this.node.active = false;
            }))
            this._contentNode.runAction(seq);
        } 
    },
    initInfo(){
        this._currentTabIndex=0;
        this.setTab(0,true);
        
    },
     //切换页签
     changeTabs:function(event){
        let  curNode = event.target;
        this.setTab(curNode.idx);
    },

    //提示红点
    showCheckTip:function(bShow){
        var curGuild =cc.fy.guildMainMsg.getCurClub();
        if(curGuild.level>=1){
            this.checkTip.active=bShow;
        }else{
            this.checkTip.active=false;
        }
    },
    //页签（0：c成员 1：审核）
    setTab:function(tabIdx, refresh) {
        tabIdx = tabIdx || 0;
        refresh = refresh || false;
        if (!refresh && tabIdx == this._currentTabIndex) {
            return;
        }
        if(tabIdx==1&&cc.fy.guildMainMsg.getCurClub().level < 1){
            //看权限        
            cc.fy.hintBox.show("权限不足");
            
            return;            
        }
        this._currentTabIndex = tabIdx;
        for (var i = 0; i < this._tabsArr.length; i++) {
            let curBtn = this._tabsArr[i].getComponent(cc.Toggle);
            

            if (tabIdx == i) {             
                curBtn.isChecked=true;
                
            }
            else{              
                curBtn.isChecked=false;
               
            }
        }

        this._operView.active = false;

       //点击成员操作列表，强制刷新成员列表。
        if (tabIdx == 0) {
            if(this.scrollViewMember){
                this.scrollViewMember.scrollToTop(0.1);
            }
            this.getMemberRequest( null); 
        }
        else if (tabIdx == 1) {

            this.getUserApply();
        } 
    },
    tabBtnClick(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        if(cc.fy.guildMainMsg.getCurClub().level < 1){
            //看权限        
            cc.fy.hintBox.show("权限不足");  
        }

    },
       //检查成员申请信息
    checkMemberApply: function(clubIndex){
        if(clubIndex == null){
            cc.fy.hintBox.show("查询成员申请信息的圈子不存在！");
            return;
        }
      
        //var curGuild = cc.fy.guildMgr._clubInfo[clubIndex];
        // if(this._applyInfo.length > 0){
        //     for(var i = 0; i < this._applyInfo.length; i++){
        //         if(this._applyInfo[i].clubid == curGuild.clubInfo.clubid){
        //             var isShow = curGuild.level >= 1 ? true : false;
        //             if(isShow){
        //                 this._memberHongDian.active = !this._applyInfo[i].isDeal;
        //                 this._joinHongDian.active = !this._applyInfo[i].isDeal; 
        //                 break;
        //             }
        //         }
        //     }
        // }
    },

    //获取成员请求
    getMemberRequest(name){
        this._memberName = name;
        this.sendMemberRequest();
    },

    //发送成员请求
    sendMemberRequest: function(){
        var curGuild =cc.fy.guildMainMsg.getCurClub().clubInfo;
        cc.fy.net.send("club_members_request_new",{"clubId":curGuild.clubid,"name":this._memberName});        
    },

    //刷新成员信息
    refreshMember: function(data){
        var clubinfo = cc.fy.guildMainMsg._clubList;
        for(var i = 0; i < clubinfo.length; i++){
            if(clubinfo[i].clubInfo.clubid == data.clubId){
                clubinfo[i].level = data.level;
            }
        }

        var curGuild=cc.fy.guildMainMsg.getCurClub();
        if(data.clubId != curGuild.clubInfo.clubid){
            return;
        }

        if(this._currentTabIndex == 0){
            this.getMemberRequest( null);
        }
        //成员大于一才有统计按钮
        // var btnTongJi = this._GuildWinTop.getChildByName("btnTongJi");
        // btnTongJi.active =  data.level > 1 ? true : false;
    },

    //刷新成员列表
    refreshMemberList:function(isForce){
        this._memberNode.active=true;
        this._joinView.active=false;
        
       
        if(isForce){
            this._maxPage=parseInt(this._memberList.length /10) +1;
            this._curPage=0;
            // this._curPage--;
            // if(this._curPage<0){
            //     this._curPage=0;
            // }else if(this._maxPage!=0 && this._curPage>=this._maxPage){
            //     this._curPage=this._maxPage-1;
            // }
        }
        
        if(this._memberList!=null&&this._memberList.length>=0){
            //this.scrollViewMember.setData(memberList);
            if(this._curPage==this._maxPage&& this._maxPage!=0){
                return;
            }
            var children=this.memberContent.children;
            var start =this._curPage*10;
            var end =this._curPage*10+10;
            if(end>=this._memberList.length){
                end=this._memberList.length;
            }
            this._curPage++;
            
            for(let i=start;i<end;i++){
                var user=this._memberList[i];
                var item =children[i];
                if(item==null){
                    item =cc.instantiate(this.memberItem);
                    this.memberContent.addChild(item);
                }
                item.getComponent("GuildMemberItem").updateItem(i,user);
            }
            
            for(let i=end;i<children.length;i++){
                children[i].active=false;
            }

        }else{
            for(let i=0;i<children.length;i++){
                children[i].active=false;
            }
        }
        // this.memberContent
        // this._memberContent.removeAllChildren();
        // this._memberContent.active = true;
        // for(var i = 0; i < memberList.length; i++){
        //     var item = cc.instantiate(this._memberItem);
        //     this.initMemberItem(item, memberList[i], i);
        //     this._memberContent.addChild(item);
        // }
    },

    memberScrollEvent:function(sender,event){
        var str="";
        switch(event) {
            case 0: 
            str= "Scroll to Top"; 
            break;
            case 1: 
            str = "Scroll to Bottom"; 
            console.log("Scroll to Bottom"+this._curPage);
           
            this.refreshMemberList();
            
            break;
            case 2: 
            str = "Scroll to Left"; 
            break;
            case 3: 
            str = "Scroll to Right"; 
            break;
            case 4: 
            str = "Scrolling"; 
            break;
            case 5: 
            str = "Bounce Top"; 
            break;
            case 6: 
            str = "Bounce bottom"; 
            break;
            case 7: 
            str = "Bounce left"; 
            break;
            case 8: 
            str = "Bounce right"; 
            break;
            case 9: 
            str = "Auto scroll ended"; 
            break;
        }
    },

    //格式化时间
    // formatDuring:function (mss) {
    //     var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
    //     if (minutes == 0) {
    //         return  " 1分钟 ";
    //     }
    //     var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    //     if (hours == 0) {
    //         return  minutes + " 分钟 ";
    //     }
    //     var days = parseInt(mss / (1000 * 60 * 60 * 24));
    //     if (days == 0) {
    //         return hours + " 小时 " + minutes + " 分钟 ";
    //     }
    //     else if (days >= 7) {
    //         return "7天";
    //     }
    //     return days + " 天 " + hours + " 小时 " + minutes + " 分钟 ";
    // },
   
    //成员操作控制
    onMemberCtrl (event) {
         cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        var  curNode = event.target;
        if (curNode.idx == null ) {
            return;
        }
      
        var memberData = this._memberList[curNode.idx];
        if (!memberData) {
            return;
        }

        var curGuild=cc.fy.guildMainMsg.getCurClub();
        if(!curGuild){
            return;
        }
        this._operView.active=false;
        //管理员只有踢出所以不弹筐
        if(curNode.isRemove){
            //管理员踢出二次确认
            // this.memberOperRequest(userId, 6);
            let content={
                id:memberData.userId,
                type:"memberRemove",
                info:{
                    name:memberData.userName,
                }
            }
            cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWCONFIRMSECONDVIEW_CTC, { isShow: true,content:content});
            
        }else{
            var btnNames = [];
            btnNames.push('btnRemove');
             
            if (memberData.level == 2) {
                btnNames.push('btnDemote');
            } else {
                btnNames.push('btnPromote');
            }
           
            this._operView.active = true;
            this._operView.idx = curNode.idx;
            
            this._operView.getChildByName('listView').children.forEach(nodBtn => {
                var idx = btnNames.indexOf(nodBtn.name);
                nodBtn.active = idx != -1;
            });
            var worldPos = curNode.convertToWorldSpace(cc.v2(0, 0));
            var pos = this._operView.convertToNodeSpaceAR(worldPos);
            this._operView.getChildByName('listView').y = pos.y+26;
    
        }   
       
    },

   

    //获取身份等级
    getLevelPriority (level) {
        switch (level) {
            case 1: // 会长
                return 10;
            case 2: // 管理员
                return 9;
            case 0: // 会员
                return 8;
        }
        return 1;
    },

    //成员操作关闭
    onOperViewClicked () {
        this._operView.active = false;
    },

    //成员操作
    onOperBtnClicked (event) {
        //踢出操作要二次确认 

        var curNode = event.target;
        var name = curNode.name;

        var memberData = this._memberList[this._operView.idx];
        var userId = memberData.userId;
        this._operView.active=false;
        switch (name) {
            case 'btnRemove':
                // this.memberOperRequest(userId, 6);
                //圈主踢出二次确认
                let content={
                    id:userId,
                    type:"memberRemove",
                    info:{
                        name:memberData.userName,
                    }
                }
                cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWCONFIRMSECONDVIEW_CTC, { isShow: true,content:content});
               
            break;
            case 'btnPromote':
                this.memberOperRequest(userId, 7);
                break;
            case 'btnDemote':
                this.memberOperRequest(userId, 8);
                break;
        }
    },

    //成员操作请求
    memberOperRequest(userid, action) {
        var clubid = cc.fy.guildMainMsg.getCurClub().clubInfo.clubid;
        var msg = {userid, clubid, action};
        cc.fy.net.send("club_member_oper_request", msg);
    },

    //查询成员
    searchMember:function(){
     
        this._memberName = this._searchEditBox.getComponent(cc.EditBox).string;
        this.getMemberRequest(this._memberName);
    },

    //获取成员申请记录
    getUserApply:function(){
        var curGuild = cc.fy.guildMainMsg.getCurClub().clubInfo;
        cc.fy.net.send("get_club_applyinfo",{"clubid":curGuild.clubid});
    },


    //刷新成员申请条目
    refreshJoinList:function(ret){
        var joinList = ret.data;
        this._memberNode.active=false;
        this._joinView.active=true;

        if(joinList!=null&&joinList.length>=0){ 
            this.scrollViewJoin.setData(joinList);
        }
         
        //cc.fy.guildMgr._clubInfo[this._clubIndex].clubInfo.applyInfo = joinList;
        //if(joinList.length == 0){
        //     var curGuild = cc.fy.guildMgr._clubInfo[this._clubIndex];
        //     if(this._applyInfo.length > 0){
        //         for(var i = 0; i < this._applyInfo.length; i++){
        //             if(this._applyInfo[i].clubid == curGuild.clubInfo.clubid){
        //                 this._applyInfo[i].isDeal = true;
        //                 var isShow = curGuild.level >= 1 ? true : false;
        //                 if(isShow){
        //                     //this._memberHongDian.active = !this._applyInfo[i].isDeal;
        //                     this._joinHongDian.active = !this._applyInfo[i].isDeal; 
        //                     this._applyInfo.splice(i, 1);
        //                     break;
        //                 }
        //             }
        //         }
        //     }
        //     else{
        //         var isShow = curGuild.level >= 1 ? true : false;
        //         if(isShow){
        //             //this._memberHongDian.active = false;
        //             this._joinHongDian.active = false;
        //         }
        //     }
        //}   
    },

  
    
   
    //关闭
    onCloseBtn:function(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.hidePanel()
    },
});
