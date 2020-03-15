var GameMsgDef = require("GameMsgDef");
var ConstsDef = require("ConstsDef");

cc.Class({
    extends: cc.Component, 

    properties: {

       

        _mainNode: null,                //主节点
        _nodRoomType: null,             //玩法按钮父节点       
        _roomTypeContent: null,         //房间玩法按钮内容
         
        _roomScroll:null,               //房间列表滑动节点

        _roomNode: null,                //房间节点
        _roomContent: null,             //房间
        


        _curtype: -1,               //当前玩法类型
        _clubIndex: 0,                  //当前群下标
        _defultType: null,              //默认玩法
        
        _refreshTime:0,          //刷新桌子时间

        //默认头像地址
        _touxiangURL:"http://fyweb.51v.cn/pzmj/images/touxiang.png",  
    },

    onLoad: function () {
        if(cc.fy == null){
            return;
        }
       
        //初始化节点
        this._mainNode =  this.node.getChildByName('gameMain');
        this._nodRoomType = this._mainNode.getChildByName("nodRoomType");
        this._roomTypeContent =   this._nodRoomType.getChildByName("mask").getChildByName('roomTypeList');
       
       

        this._roomNode = this._mainNode.getChildByName("nodRoom");
        this._roomContent = this._roomNode.getChildByName("view").getChildByName("content");
         this._roomScroll =this._roomNode.getComponent(cc.ScrollView);
       

       
        

        this.initTypeButtons(); //初始化切换玩法
        this.initEventHandler(); //消息监听
    },

    initEventHandler:function(){
        //消息监听
        var self = this;
        var game =cc.fy.gameNetMgr;
        //获取房间列表响应结果
        game.addHandler('get_room_list_result',function(data){  
            console.log("GuildRoom get_room_list_result",data);
            setTimeout(function(){
                cc.fy.loading.hide();
            },100);
             
            var curClub=cc.fy.guildMainMsg.getCurClub();
            if (data.code != 0) {
                var ret = data.data;
                if(!curClub || ret.clubid != curClub.clubInfo.clubid){
                    return;
                }
                cc.fy.hintBox.show(data.msg);
                console.log("GuildRoom",curClub);
                if (data.code == 2) {
                    self.getSetRoomList();
                }
                else if (data.code == 3) {
                    cc.fy.guildMainMsg._clubList[cc.fy.guildMainMsg._currentClubIndex].clubInfo.groupList = ret.groupList;          
                    self.refreshButton();
                    self.showGuildViewGroups(ret.roomList);
                }
                return;
            } 
            else {
                var ret = data.data;
                if(!curClub || ret.clubid != curClub.clubInfo.clubid){
                        return;
                }

                // if(ret.groupList.length ==1 ){
                //    var type=parseInt(self._curtype);
                //     if(ret.groupList.indexOf(type) >= 0){
                //         for(var i = 0; i < ret.roomList.length; i++){
                //             var baseinfo = JSON.parse(ret.roomList[i].base_info);
                //             if(baseinfo.type != self._curtype){
                //                 return;
                //             }
                //         }
                //     }
                //     else{
                //         self._curtype = ret.groupList[0];
                //     }
                // }
                

                cc.fy.guildMainMsg._clubList[cc.fy.guildMainMsg._currentClubIndex].clubInfo.groupList = ret.groupList;
                self.refreshButton();
                self.showGuildViewGroups(ret.roomList,true);
            }
        });

      
        //获取设置房间列表响应
        game.addHandler('get_set_group_list_result',function(ret){  
            console.log("GuildRoom Set");
            console.log(ret);
            cc.fy.loading.hide();
            var data = ret;
            if (data.code == 0) {
                self.showGuildViewGroups(data.data.roomList);
            }
            else{
                cc.fy.hintBox.show(data.msg);
            }
        });

        game.addHandler('create_group_result', function(ret){  
            console.log("==>> create_group_result: ", ret);
            let data = ret;
            if (data.code == 0){
                self.getGuildRoom(cc.fy.guildMainMsg._currentClubIndex);
            }
            cc.fy.hintBox.show(data.msg);
        });
        
        game.addHandler('delete_group_result', function(ret){  
            console.log("==>> delete_group_result: ", ret);
            let data = ret;
            if (data.code == 0){
                var curGuild =cc.fy.guildMainMsg.getCurClub();
                self._curtype=-1;
                self.getGuildRoom(cc.fy.guildMainMsg._currentClubIndex);
            }
            cc.fy.hintBox.show(data.msg);
        });

        game.addHandler('club_room_del_result',function(ret){
            self.getGuildRoom(cc.fy.guildMainMsg._currentClubIndex);
        });


        game.addHandler('ctc_refresh_room_list',function(data){
            console.log("刷新房间消息：",self._curtype,data);
           if(data && data.isChange){
               self._curtype=-1;
           }
            console.log("curtype:"+self._curtype);
            self.getGuildRoom(cc.fy.guildMainMsg._currentClubIndex);
        });


    },

    //初始化切换玩法按钮事件
    initTypeButtons:function(){
        for(var i = 0; i < this._roomTypeContent.childrenCount; i++){
            var button = this._roomTypeContent.children[i];
            cc.fy.utils.addClickEvent(button,this.node,"GuildRoom","onChangeType");
        }
    },

    //获取房间列表
    getGuildRoom: function(clubIndex){
        if(clubIndex == null){
             cc.fy.loading.hide();
            cc.fy.hintBox.show("查询房间的圈子不存在！");
            return;
        }
        this.onRefreshGuildRoom();
    },

    //刷新房间列表,初始化
    onRefreshGuildRoom () {
        console.log("onRefreshGuildRoom");
        this.refreshButton();
        this.onChangeType();
    },

    //刷新玩法按钮，初始化
    refreshButton: function(){
        console.log("Button ===============>");
        this.initGameButton();
        var curGuild = cc.fy.guildMainMsg.getCurClub().clubInfo;
        console.log(curGuild);
        if (!curGuild) {
            return;
        } 
        if (!curGuild.groupList) {
            return;
        } 
        if(curGuild.groupList.length == 0){
            this._roomNode.active = true;
            this._roomNode.getChildByName("nullview").active = true;
            this.showGuildViewGroups([]); //传空参数，就清桌子了
            return;
        }

        this._roomNode.getChildByName("nullview").active = false;

        //初始化 ，
        if(this._curtype != -1){
            console.log("cur",curGuild.groupList,this._curtype);
            var type=parseInt(this._curtype);
            if(curGuild.groupList.indexOf(type) < 0){
                this._curtype = -1;
            }
            
        }

        console.log("curtype:"+this._curtype);
        for(var i = 0; i < this._roomTypeContent.childrenCount; i++){
            var button =this._roomTypeContent.children[i];
            var toggle = button.getComponent(cc.Toggle);
            var typename= this._curtype==-1?"A":this._curtype;
            toggle.isChecked = button.name=="Button_"+typename;
        }
    },
    //初始化群的所有玩法按钮
    initGameButton: function(){
        var groupList = cc.fy.guildMainMsg.getCurClub().clubInfo.groupList;
        console.log("groupList",groupList);
        if(!groupList){
            this._nodRoomType.active = false;
            return;
        }
        if( groupList.length == 0){
            this._nodRoomType.active = false;
            return;
        }
       
        this._nodRoomType.active = true;
        var buttons =this._roomTypeContent.children;
        for(let i =1;i<buttons.length;i++){
            var toggle=buttons[i].getComponent(cc.Toggle);
            toggle.isChecked=false;
            buttons[i].active=false;
        }
        for(var i = 0; i < groupList.length; i++){
           var type =groupList[i];   
           if(type!=null&&type>=0){
               if(this._roomTypeContent.getChildByName("Button_"+type)){
                this._roomTypeContent.getChildByName("Button_"+type).active=true;
               }
            
           }
        }
        if(groupList.length>0){
            this._roomTypeContent.getChildByName("Button_A").active=true;
        }else{
            this._roomTypeContent.getChildByName("Button_A").active=false;
        }
    },

    //切换玩法
    onChangeType: function(event){
        var type = -1;
        console.log("curtype:"+this._curtype);
        if(event ==null){
            for (var i = 1; i < this._roomTypeContent.childrenCount; i++) {
                var button = this._roomTypeContent.children[i];
                var toggle = button.getComponent(cc.Toggle);
                console.log(toggle.isChecked);
                if(button.active==true && toggle && toggle.isChecked){
                    console.log("checked:"+button.name);
                    type = parseInt(button.name.substring(7));
                    break;
                }
            }
            if(this._curtype==-1){
                type=-1;
            }
        }else{
            type =event.target.name.substring(7);
            if(type=="A"){
                type=-1;
            }
            type = parseInt(type);
        }
        
        this._curtype = type;
        var curGuild = cc.fy.guildMainMsg.getCurClub().clubInfo;
        console.log("get_room_list type:"+type +"  clubid:"+curGuild.clubid);
        cc.fy.net.send("get_room_list", {"clubid":curGuild.clubid,"type":this._curtype});
    },

    //检测群是否有默认玩法
    checkIsSaveTypeByClub:function(clubId){
        if (this._defultType == null) {
            return -1;
        }
        else {
            if (this._defultType[clubId] == null) {
                return -1;
            }
            else{
                console.log("this._defaulttype",this._defultType);
                return this._defultType[clubId];
            }
        }
    },

    //检测群的预设玩法是否包含默认玩法
    checkIsHaveTypeInClub: function(){
        var isHave = false;
        var curGuild = cc.fy.guildMainMsg.getCurClub().clubInfo;
        var type = this.checkIsSaveTypeByClub(curGuild.clubid);

        if(type == -1){
            return isHave;
        }
 
        for(var i = 0; i < curGuild.groupList.length; i++){
            if(type == curGuild.groupList[i]){
                isHave = true;
                break;
            }
        }
        return isHave;
    },

    //设置房间列表
    getSetRoomList:function(){
        cc.fy.loading.show();
        var curGuild = cc.fy.guildMainMsg.getCurClub().clubInfo;
        cc.fy.net.send("get_set_group_list",{"cluber":cc.fy.userMgr.userId,"clubid":curGuild.clubid});
    },
    changeRoomState(groupList){
        //改变房间桌子状态（游戏中还是等待中）
        var waitNum=0;
        var gameNum=0;
        for (var i = 0; i < groupList.length; i++)
        {
            var data = groupList[i];
            if (!data.hasbegan) {
                waitNum++;
            }else{
                gameNum++;
            }
        }
        var  topleft=this._mainNode.getChildByName('topleft');
        var  man=topleft.getChildByName('desk_man');
        var  wait=topleft.getChildByName('desk_wait');
        man.getComponent(cc.Label).string=gameNum;
        wait.getComponent(cc.Label).string=waitNum;
    },
    //显示桌子
    showGuildViewGroups:function(roomList,needRefresh){
        console.log("showGuildViewGroups==============>"+this._curtype);
    
        //判断一下，roomList 里面 是不是当前选择的type,
        if(roomList!=null && roomList.length>0){
            var types =[];
            var curType=this._curtype;
            var curGuild = cc.fy.guildMainMsg.getCurClub().clubInfo;
            var groupList =curGuild.groupList;
            
            
            for(let i=0;i<roomList.length;i++){
                var baseinfo = JSON.parse(roomList[i].base_info);
                if(types.indexOf(baseinfo.type)>=0){
                    continue;
                }
                types.push(baseinfo.type);
            }
            if(curType!=-1){
                if(groupList.indexOf(curType)<0){ //当前没有该玩法
                    this._curtype = -1; //重新申请一下
                }else{
                    if(types.indexOf(curType)<0 ){ //传回来的玩法里，没有当前玩法
                        if(needRefresh){
                            this.getGuildRoom(cc.fy.guildMainMsg._currentClubIndex);
                            console.log("showGuildViewGroups==============>不是当前玩法");
                        }
                        return;
                    }else{
                        if(types.length>1){
                            if(needRefresh){
                                this.getGuildRoom(cc.fy.guildMainMsg._currentClubIndex);
                                console.log("showGuildViewGroups==============>穿回来多了一些玩法");
                            }
                            return;
                        }
                    }

                }
            }

            //当前选所有，但是穿回来的数据不是所有玩法，只要刷部分桌子就可以了。
            if(curType==-1 &&types.length != groupList.length){
                if(needRefresh){
                    // this.getGuildRoom(cc.fy.guildMainMsg._currentClubIndex);
                    // console.log("showGuildViewGroups==============>刷新所有桌子");
                    this.updateCurRooms(roomList);
                    return ;
                }
            }
            
        }

        console.log("showGuildViewGroups==============>开始刷新桌子");
        var groupList = roomList;
        //改变左上角显示在线和等待数量（游戏中还是等待中）
        this.changeRoomState(groupList)
       
        //不一定要重新排序，可以按照第一次排的序，只是刷新桌子上的数据。
        groupList = this.sortGroupData(groupList);
    
        // if(this._roomScroll){
        //     console.log("拉到顶");
        //     this._roomScroll.scrollToTop(0.1);
        // }
        this._roomContent.active=true;
        var rooms=this._roomContent.children;
        var showCount = 0;
        if (groupList != null && groupList.length> 0) {
            for (var i = 0; i < groupList.length; i++) {
                var data = groupList[i];
                if(data != null && data != ""){
                    var baseinfo = JSON.parse(data.base_info);
                    if(baseinfo.type != this._curtype  && this._curtype != -1){
                        continue;
                    }
                    showCount++;
                    //获取房间桌子
                    var table =rooms[i];
                    if(table ==null){
                        var roomItem =cc.fy.resMgr.getRes(ConstsDef.URL_PREFAB_GUILDROOMTABLE);
                         table = cc.instantiate(roomItem);
                         this._roomContent.addChild(table);
                    }
                    table.getComponent("roomItem").initRoom(data,baseinfo);                 
                }
            }
        }
        //多出来不用显示，就隐藏掉
        for(let i=showCount;i<rooms.length;i++){
            rooms[i].active=false;
        }
    },

    //刷新当前部分桌子，看roomlist里面是什么数据,一般就是一种type的桌子
    updateCurRooms:function(roomList){
        if(roomList==null || roomList.length==0 ){
            return;
        }
      
        var rooms=this._roomContent.children;
        //判断一下需不需要全部刷新
         for(let i=0;i<roomList.length;i++){
            var data = roomList[i];
            if(data ==null || data==""){
                continue;
            }
            var isHave =false;
            for(let j=0;j<rooms.length;j++){
                var roomItem=rooms[j].getComponent("roomItem");
                if(data.id == roomItem._roomId){
                    isHave=true;
                    break;
                }
            }
            //roomlist中有新的桌子
            if(isHave==false){
                this.getGuildRoom(cc.fy.guildMainMsg._currentClubIndex);
                return;
            }
        }

        //只刷新部分
        for(let i=0;i<rooms.length;i++){
            var roomItem=rooms[i].getComponent("roomItem");
            for(let j=0;j<roomList.length;j++){
                var data = roomList[j];
                if(data ==null || data==""){
                    continue;
                }
                
                var baseinfo=JSON.parse(data.base_info);
                if(data.id != roomItem._roomId){
                    continue;
                }
                roomItem.initRoom(data,baseinfo);

            }
        }

       

    },

    //房间数据排序,等待，游戏中，空桌，type,
    sortGroupData:function(groupList){
        
        if(groupList==null || groupList.length==1){
            return groupList;
        }

        //玩法优先级排序
        var typeRank=cc.GAMETYPERANK;

        // var players={
        //     [cc.GAMETYPE.HAMJ] :  0,
        //     [cc.GAMETYPE.SZER] :  0,
        //     [cc.GAMETYPE.PDK] :   0,
        //     [cc.GAMETYPE.SZCT] :  0,
        //     [cc.GAMETYPE.SZTDH] :  0,
        //     [cc.GAMETYPE.GD] :    0,
        //     [cc.GAMETYPE.SZHD] : 0,
        //     [cc.GAMETYPE.SZBD] :  0,
        //     [cc.GAMETYPE.HZEMJ] : 0,
        //     [cc.GAMETYPE.DDZ] :   0,
        // };

        // for(let i=0;i<groupList.length;i++){
           
        //     if(groupList[i].base_info!=null && groupList[i].base_info!=""){
        //         var baseinfo=JSON.parse(groupList[i].base_info);
        //         console.log("type:"+baseinfo.type+"   num:"+groupList[i].playerNum);
        //         players[baseinfo.type] +=groupList[i].playerNum;
        //     } 
            
        // }
        // console.log("各玩法人数：",players);
        //按玩法排个大序
        groupList.sort(function(a,b){
            var baseinfo1=JSON.parse(a.base_info);
            var baseinfo2=JSON.parse(b.base_info);
            var type1=baseinfo1.type;
            var type2=baseinfo2.type;
            var leftNum1=baseinfo1.maxCntOfPlayers-a.playerNum;
            var leftNum2=baseinfo2.maxCntOfPlayers-b.playerNum;
            // if(type1==type2){
            //     if(a.hasbegan==b.hasbegan){ //1,1,0,0
            //         if(a.hasbegan==0){ //没开始
            //             if(b.playerNum==a.playerNum ){ 
            //                 return baseinfo2.maxCntOfPlayers-baseinfo1.maxCntOfPlayers;
            //             }else{//铁定有人座
            //                 return b.playerNum-a.playerNum; //空位置少的优先
            //             }
            //         }else{ //开始了的，人多的优先
            //             return baseinfo2.maxCntOfPlayers-baseinfo1.maxCntOfPlayers;
            //         }
            //     }else{
            //         return b.hasbegan-a.hasbegan; //开始了的优先
            //     }
            // }else{//根据满座的桌子多少决定玩法顺序
            //     console.log("type1:"+type1+"  type2:"+type2);
            //     console.log("num1:"+ players[type1]+" num2:"+ players[type2]);
            //     if(players[type1]==players[type2]){
            //         return typeRank[type1]-typeRank[type2];//玩法优先级
            //     }
            //     return players[type2]-players[type1];//开局多的玩法排前面
            // }
            if(a.hasbegan==b.hasbegan){
                if(a.hasbegan==1){ //都开局了
                    if(type1==type2){
                        return baseinfo2.maxCntOfPlayers-baseinfo1.maxCntOfPlayers;
                    }else{//玩法优先级
                        return typeRank[type1]-typeRank[type2];
                    }
                }else{ //都没开局
                    if(a.playerNum>0 && b.playerNum>0){//等待中
                        if(type1==type2){//人数多的在前
                            // if(baseinfo2.maxCntOfPlayers==baseinfo1.maxCntOfPlayers){ //4人桌在前
                            //     return b.playerNum-a.playerNum;                      //未开局的，等待人数多的在前
                            // }
                            // return baseinfo2.maxCntOfPlayers-baseinfo1.maxCntOfPlayers;
                            if(leftNum1==leftNum2){ //空座位一样多，4人桌在前
                                return baseinfo2.maxCntOfPlayers-baseinfo1.maxCntOfPlayers;
                            }else{//空座位少的在前
                                return leftNum1-leftNum2;
                            }
                        }else{//玩法优先级
                            return typeRank[type1]-typeRank[type2];
                        }

                    }else{//空桌
                        if(type1==type2){//人数多的在前
                            return baseinfo2.maxCntOfPlayers-baseinfo1.maxCntOfPlayers;
                        }else{//玩法优先级
                            return typeRank[type1]-typeRank[type2];
                        }
                    }
                }
            }else{//开局的在前面
                return b.hasbegan-a.hasbegan;
            }
        });

        return groupList;
    },

    // update(dt){

    //     this._refreshTime +=dt;
    //     if(this._refreshTime<5){
    //         return;
    //     }
    //     this._refreshTime=0;
    //     if(this._curtype==-1){
    //         this.getGuildRoom(cc.fy.guildMainMsg._currentClubIndex);
    //     }
    // },
   
 
});
