var GameMsgDef = require("GameMsgDef");

cc.Class({
    extends: require("BaseModuleView"),

    properties: {

         nullview:cc.Node,
         logContent:cc.Node,
         logView: cc.Node,          //日志内容   
         scrollViewContent:require("ScrollViewController"),   

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
        
        game.addHandler(GameMsgDef.ID_SHOWGUILDRECORDVIEW_CTC, function(data){
            if(data && data.isShow == false){
                self.hidePanel();
            }
            else{
                self.showPanel(data);
            }
        });
             
        game.addHandler('club_oper_records_response',function(data){  
            console.log("GuildLog");
            console.log(data);
            cc.fy.loading.hide();
            if (data.code == 0) {
                self.refreshLogList(data);
            }
            else{
                cc.fy.hintBox.show("获取日志数据失败！");
            }
        });
 
    },
    initView:function(){
        // 作为弹框模式 不隐藏其它弹框
        this.setHideOther(false);
    },

    showPanel:function(data){
        this.node.active = true;
        cc.fy.guildlog = this;

        this.initInfo();
       
    },

    hidePanel:function(){
        this.node.active = false;
    },
    initInfo(){
        this.getLogRequest();
    },
     //获取日志请求
     getLogRequest(){
       
        this.sendLogRequest();
    },
    //发送日志请求
    sendLogRequest: function(){
        var curGuild = cc.fy.guildMainMsg.getCurClub().clubInfo;
        cc.fy.loading.show();
        cc.fy.net.send("club_oper_records_request_new",{"clubId":curGuild.clubid});
    },
    //刷新日志记录
    refreshLogList:function(ret){
        var logList = ret.actions;
        // this.logView.active=false;
        // this.nullview.active = logList.length > 0 ? false : true;
          
        if(logList!=null&&logList.length>=0){
            logList.sort(function(a,b){
                return  b.time-a.time; 
            });
            this.scrollViewContent.setData(logList);
        }
    },

    
    
    //关闭
    onCloseBtn:function(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.node.active = false;
    },
});
