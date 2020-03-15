var md5 =  require("md5");

var GameMsgDef = require("GameMsgDef");
var ConstsDef = require("ConstsDef");

cc.Class({
    extends: require("BaseModuleMsg"),

    properties: {
        ///////////////////////
        resPanelUrl:"prefabs/guild/GuildWin/GuildWin", // 预制体路径
        msgIdShowView:GameMsgDef.ID_SHOWGUILDMAINVIEW_CTC, // 显示ID
        isPreload:true, // 是否需要预加载，ps:常用组件需要预加载加快显示
        limitScene:ConstsDef.SCENE_NAME.HALL, // 限制场景，指定模块的场景，null是不限制 如:limitScene:ConstsDef.SCENE_NAME.GAME 游戏场景模块
        ///////////////////////

        refreshBtnChicked:false,
        _myGuildInfo:null,
        _myGuildList: null, 
        _curGuild:null,   
        _headImgUrl:null,

        _clubList:null,           //俱乐部列表
        _currentClubIndex:0,      //当前俱乐部idx
        _curClubid:0,             //当前俱乐部id

        _inviteCode:null,

        _isInclub:false,        
        
        
    },

    // 消息分发函数
    messageDispatch:function(msg){
        switch (msg.msgId) {
            case GameMsgDef.ID_LOADSCENEFINISH: // 进入游戏场景
                if(cc.fy.sceneMgr.isHallScene() && cc.fy.net.isPinging == false && !cc.fy.userMgr.isInRoom) {
                    if(cc.fy.reloadData != null){
                        cc.fy.loading.show();
                    }
                    console.log("cc.fy.sceneMgr.isHallScene() ");
                    this.reqGuildLoginInfo();
                }
            break;
        }
    },

    // use this for initialization
    // onLoad: function () {
    //     var GuildNet = require("Net");
    //     if(cc.fy.net == null){
    //         cc.fy.net = new GuildNet();
    //     } 
    //     if(cc.fy.net.isPinging == false){
    //         console.log('===>>>>>>>>>>>   onload reqGuildLoginInfo');
            
    //         this.reqGuildLoginInfo();
    //     }
    // },

    //注册通知
    initNetHandlers:function(){
        var self = this;
        cc.fy.net.clearHandlers();        
        cc.fy.net.addHandler("club_login_result",function(data){
            console.log("club_login_result");
            console.log(data);
            if(cc.fy.loading){
                 cc.fy.loading.hide();
            }   
            if(data.errcode == 0){
                cc.fy.sceneMgr.loadScene("hall");
                if (cc.fy.reloadData != null) {
                    //隐藏俱乐部小界面,防止断线重连的时候作妖
                    cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWGUILDMAINVIEW_CTC, {isShow:false});  //主界面
                    cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWJOINGUILDVIEW_CTC, {isShow:false}); //加入界面
                    cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWGUILDDESKRULEVIEW_CTC, {isShow:false});//规则
                    cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWGUILDMEMBERVIEW_CTC, {isShow:false}); //成员
                    cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWGUILDRECORDVIEW_CTC, {isShow:false});// 记录
                    cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWGUILDSETTINGVIEW_CTC, {isShow:false});//设置
                    cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWGUILDTONGJIVIEW_CTC, {isShow:false});//统计
                    cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWZHANJIVIEW_CTC,{isShow:false}); //战绩
                    cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWSHAREVIEW_CTC,{isShow:false});//分享
                    cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWGUILDGONGGAOVIEW_CTC,{isShow:false});//公告
                    cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWCREATEROOMVIEW_CTC,{isShow:false});//预设
                    //展示主俱乐部界面 ，
                     cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWGUILDMAINVIEW_CTC, {isShow:true});
                }  
            }
            else{
                console.log(data.errmsg);
            }
        });

        cc.fy.net.addHandler('change_gems_results',function(data){
            console.log("change_gems_results",data);
            self.dispatchEvent("change_gems_results_push",data);
        });

        cc.fy.net.addHandler("disconnect", function(ret){
            console.log("==>> guildmgr disconnect");
            if (cc.fy.userMgr.isInRoom) {
                return;
            }
            console.log("GuildNet disconnect 断开了连接");
            cc.fy.loading.hide();
            if(cc.fy.sceneMgr.isHallScene()){
                cc.fy.loading.show("重新连接服务器");
                self.reqGuildLoginInfo();
                // console.log(" onConnect disconnect");
                // cc.fy.alert.show("与服务器断开连接，请重新登录！", function(){
                //     cc.fy.userMgr.logOut();
                // });
            }
        });

        cc.fy.net.addHandler("get_club_info_result",function(data){
            if (data.code == 0) {
                self._clubList = data.data;
                self._clubList.sort(function(a,b){ //clubid从小到大
                    if(a.clubInfo.userid == b.clubInfo.userid){
                         return a.clubInfo.clubid - b.clubInfo.clubid; 
                    }else{
                        if(a.clubInfo.userid==cc.fy.userMgr.userId){
                            return -1;
                        }

                        if(b.clubInfo.userid==cc.fy.userMgr.userId){
                            return 1;
                        }
                    }
                    return a.clubInfo.clubid - b.clubInfo.clubid; 
                });
            }else{
                self._clubList = null;
            }
            if(self._inviteCode!=null){
                 self.checkInvite();
            }else{
                cc.fy.gameNetMgr.dispatchEvent("get_club_info_result",data);
            }
           
           
        });


        cc.fy.net.addHandler("create_club_result",function(data){
            console.log("create_club_result");
            console.log(data);
            self.dispatchEvent("create_club_result",data);
        });

        cc.fy.net.addHandler("apply_join_club_result",function(data){
            console.log("apply_join_club_result");
            console.log(data);
            cc.fy.hintBox.show(data.msg);
            if (data.code != 0) {
                self.dispatchEvent("join_club_error",data);
            }
            else{
                self.dispatchEvent("join_club_success",data);
            }
        });

        cc.fy.net.addHandler("create_group_result",function(data){
            console.log("create_group_result");
            self.dispatchEvent("create_group_result",data);
        });

        cc.fy.net.addHandler("club_room_del_result",function(data){
            console.log("club_room_del_result");
            self.dispatchEvent("club_room_del_result",data);
        });

        cc.fy.net.addHandler("get_group_list_result",function(data){
            console.log("get_group_list_result");
            self.dispatchEvent("get_group_list_result",data);
        });

        cc.fy.net.addHandler("get_set_group_list_result",function(data){
            console.log("get_set_group_list_result");
            self.dispatchEvent("get_set_group_list_result",data);
        });

        cc.fy.net.addHandler("delete_group_result",function(data){
            console.log("delete_group_result");
            self.dispatchEvent("delete_group_result",data);
        });

        cc.fy.net.addHandler("get_club_applyinfo_result",function(data){
            console.log("get_club_applyinfo_result");
            self.dispatchEvent("get_club_applyinfo_result",data);
        });

        cc.fy.net.addHandler("get_room_list_result",function(data){
           // console.log("get_room_list_result");
            self.dispatchEvent("get_room_list_result",data);
        });

        cc.fy.net.addHandler("create_club_room_result",function(data){
            console.log("create_club_room_result");
            console.log(data);
            if (data.code != 0) {
                // cc.fy.hintBox.show(data.msg);
            }
            else{
                // cc.fy.hintBox.show("创建成功，请刷新");
                self.dispatchEvent("create_club_room_result",data);
            }
        });

        cc.fy.net.addHandler("be_invited_to_play",function(data){
            console.log("be_invited_to_play");
            self.dispatchEvent("be_invited_to_play",data);
        });

        cc.fy.net.addHandler("user_apply",function(data){
            console.log("user_apply",data);
            var curClub =self.getCurClub();
            if(curClub){
                if(data && data.clubId==curClub.clubInfo.clubid){
                    self.dispatchEvent("user_apply_push",data);
                } 
            }

        });

        cc.fy.net.addHandler("club_apply_join_result",function(data){
            console.log("club_apply_join_result");
            self.dispatchEvent("club_apply_join_result",data);
        });

        cc.fy.net.addHandler("club_oper_records_response",function(data){
            console.log("club_oper_records_response");
            self.dispatchEvent("club_oper_records_response",data);
        });

        cc.fy.net.addHandler("club_members_response",function(data){
            console.log("club_members_response");
            self.dispatchEvent("club_members_response",data);
        });

        cc.fy.net.addHandler("get_group_history_response",function(data){
            console.log("get_group_history_response");
            self.dispatchEvent("get_group_history_response",data);
        });

        cc.fy.net.addHandler("club_member_oper_response",function(data){
            console.log("club_member_oper_response");
            self.dispatchEvent("club_member_oper_response",data);
        });

        cc.fy.net.addHandler("out_club_result",function(data){
            console.log("out_club_result",data);
            cc.fy.hintBox.show(data.msg);
            self.dispatchEvent("out_club_result", data);
        });

        cc.fy.net.addHandler("user_state_change",function(data){
           // console.log("user_state_change");
            self.dispatchEvent("user_state_change", data);
        });

        cc.fy.net.addHandler("set_club_type_response",function(data){
            console.log("set_club_type_response");
            self.dispatchEvent("set_club_type", data);
        });
        
        cc.fy.net.addHandler("get_clubinfo_rank_response",function(data){
            console.log("get_clubinfo_rank_response");
            self.dispatchEvent("get_clubinfo_rank_response", data);
        });

        cc.fy.net.addHandler("get_club_statistics_response",function(data){
            console.log("get_club_statistics_response");
            self.dispatchEvent("get_club_statistics_response", data);
        });

        cc.fy.net.addHandler("share_histroy_url_result",function(data){
            console.log("share_histroy_url_result",data);
            self.dispatchEvent("share_histroy_url_push",data);
        });

        cc.fy.net.addHandler("get_game_playnum_response_reslut",function(data){
            console.log("get_game_playnum_response_reslut",data);
            self.dispatchEvent("get_game_playnum_response_reslut_push",data.data);
        });

        //获取公会
        cc.fy.net.addHandler("get_message_response",function(data){
            console.log("get_message_response");
            self.dispatchEvent("get_message_response_push",data);
        });

        //更新公告信息
        cc.fy.net.addHandler("update_message_response",function(data){
            console.log("update_message_response");
            self.dispatchEvent("update_message_response_push",data);
        });

    },

    // 请求登录相关信息
    reqGuildLoginInfo:function(){
        if(cc.fy.net.sio && cc.fy.net.sio.connected){
               cc.fy.net.close();
        }
        var self = this;
        var onRes = function(ret){
            console.log("==>> reqGuildLoginInfo");
            console.log(ret);
            cc.fy.loading.hide();
             if(ret.errcode ==1){
                 cc.fy.alert.show("当前游戏版本过低，请下载新版本！", function(){
                    cc.sys.openURL(cc.fy.SI.appweb);
                });
            }else if(ret.errcode !== 0){
                cc.fy.alert.show("与服务器断开连接，请重新登录！", function(){
                    cc.fy.userMgr.logOut();
                });
            }
            else{
                self._myGuildInfo = ret;
                self._myGuildList = ret.clubList;
                self._headImgUrl = ret.headimg;
                self.onconnectGuildServer(ret);
            }
        };
        

        var data = {
            account:cc.fy.userMgr.account,
            sign:cc.fy.userMgr.sign,
            version:cc.VERSION,
            channelId:cc.CHANNELID,
        };
        console.log('--------------------------------------------');
        
        console.log(cc.fy.SI.clubHttpAddr);
        cc.fy.http.sendRequest("/guild_login", data, onRes, "http://" + cc.fy.SI.clubHttpAddr, 2, null, false);


    },

    onconnectGuildServer:function(ret){
         cc.fy.userMgr.isInRoom = false;
        var self = this;
        this.dissoveData = null;
        var self = this;
        var timeOut = null;
        var timestamp = Date.parse(new Date());
        console.log("clubsocket："+cc.fy.SI.clubSocketAddr);
        cc.fy.net.ip = cc.fy.SI.clubSocketAddr;
        cc.fy.userMgr.isInRoom = false;
      
            this.initNetHandlers();
        

        var onConnectOK = function(){
            console.log("guild onConnectOK");
           
            if(timeOut != null){
                clearTimeout(timeOut);
                timeOut = null;
            }
            var sign = md5.hex_md5(ret.taken + timestamp + cc.ROOM_PRI_KEY);
            var sd = {
                token:ret.taken,
                time:timestamp,
                sign:sign,
                clublist:self._myGuildList,
                headimg:self._headImgUrl,
                name:cc.fy.userMgr.userName,
            };

            console.log('loginsd:',sd);
            cc.fy.net.send("club_socket_login",sd);
        };
        

        var conFailCall = function(){
            console.log("==>> conFailCall");
            if(timeOut != null){
                clearTimeout(timeOut);
                timeOut = null;
            }
        };
        timeOut = setTimeout(conFailCall, 6000);
        var onConnectFailed = function(){
            console.log("==>> on guild ConnectFailed");
        };
        cc.fy.net.connect(onConnectOK,onConnectFailed,true);
    },

    dispatchEvent(event,data){
        cc.fy.gameNetMgr.dispatchEvent(event,data);
    },
    
    getCurClub(){
        if(this._clubList && this._clubList.length>0){
            return this._clubList[this._currentClubIndex];
        }else{
            this._currentClubIndex=0;
        }
        return null;
    },

    //记录当前俱乐部，方便下次从游戏出来直接进
    saveCurGuild:function(){
        var curClub =this.getCurClub();
        if(!curClub){
            return;
        }
       
        cc.fy.reloadData={};
        cc.fy.reloadData.curClubId=curClub.clubInfo.clubid;
        this._curClubid=curClub.clubInfo.clubid;
        cc.fy.localStorage.setItem("reloadClub", JSON.stringify(cc.fy.reloadData));
        console.log("save curClub:"+curClub.clubInfo.clubid);
    },

    getSaveGuild:function(){
        var reload=cc.fy.localStorage.getItem("reloadClub");
        if( reload==null||reload ==""){
            return;
        }else{
            return JSON.parse(reload);
        }
    },  

    isCurClub(clubid){
        if(this._curClubid==0){
            this._curClubid =this._clubList[this._currentClubIndex].clubInfo.clubid;
        }
        return this._curClubid==clubid;
    },
    //判断是否在俱乐部
    isInClub(data){
        console.log("1223",data);
        console.log("clublist:",this._clubList);
        
        this._inviteCode=data;
        
        if (this._inviteCode != null) {
            cc.fy.net.send("get_club_info");
           // cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWGUILDMAINVIEW_CTC, {isShow:true});
        } 
    },

    //判断邀请俱乐部是否已存在
    checkInvite(){
        var isInClub=false;
        if(this._clubList && this._clubList.length>0){
            for(let i=0;i<this._clubList.length;i++){
                var clubInfo =this._clubList[i].clubInfo;
                if(this._inviteCode==clubInfo.promo_code){
                    this._currentClubIndex=i;
                    isInClub=true;
                    break;
                }
            }
        }
        if(isInClub==false && this._inviteCode!=null){
            cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWJOINGUILDVIEW_CTC,{isShow:true,inviteClub:this._inviteCode});
        }else{
           cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWGUILDMAINVIEW_CTC, {isShow:true}); 
        }
        this._inviteCode=null;
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
