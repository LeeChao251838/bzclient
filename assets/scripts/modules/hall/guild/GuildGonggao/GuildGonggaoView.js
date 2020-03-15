var GameMsgDef = require("GameMsgDef");
var FilterWord = require("FilterWord");
cc.Class({
    extends: require("BaseModuleView"),

    properties: {
        content: cc.Node,          
        contentInfo: cc.Node,       
        contentInfo2:cc.Node,   
        contentInfoScroll:cc.Node,    
        contentEdit: cc.Node,    
        contentEditInfo: cc.Node,   
        contentEditInfo2:cc.Node, 
        contentEditInfoScroll:cc.Node,         
        btnEdit: cc.Node,          
        btnQueRen: cc.Node,        
        btnQuXiao: cc.Node,   
        editBoxNode:cc.Node, 
        editBox:cc.EditBox,    
        _contentInfo:"暂无公告",
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
        
        game.addHandler(GameMsgDef.ID_SHOWGUILDGONGGAOVIEW_CTC, function(data){
            if(data && data.isShow == false){
                self.hidePanel();
            }
            else{
                self.showPanel(data);
            }
        });
        game.addHandler('get_message_response_push',function(data){
            console.log(data);
            console.log("aaaa1",Date.now());
            if(data.code != 0){
                cc.fy.hintBox.show(data.msg);
            }
            else{ 
                if(data.data!=null && data.data!=""){
                    self._contentInfo= data.data;
                }else{
                   self._contentInfo= "暂无公告";
                }
                self.showGongGao();
                // self.saveGongGao();
            }
        });
        //更新公告响应
        game.addHandler('update_message_response_push',function(data){
            console.log(data);
            //self.node.active = false;
            if(data.code != 0){
                cc.fy.hintBox.show(data.msg); 
                self.showGongGao();
            }
            else{
              
                var clubinfo = cc.fy.guildMainMsg.getCurClub().clubInfo;
                console.log("aaa",clubinfo);
                if(clubinfo.clubid == data.data.clubId){
                    if(data.data.content!=null && data.data.content!=""){
                         self._contentInfo = data.data.content;
                    }else{
                        self._contentInfo= "暂无公告";
                    }
                   
                    self.showGongGao();
                    // self.saveGongGao();
                }          
            }
        });
       
       
    },

    

    initView:function(){
        // 作为弹框模式 不隐藏其它弹框
        this.setHideOther(false);

    },

    showPanel:function(data){
        this.node.active = true;
       
        this.initInfo();
       
    },

    hidePanel:function(){

        this.node.active = false;
    },
    initInfo(){
        this.getGongGao()
    },
   
    //缓存是否查看过公告
    // saveGongGao: function(){
    //     var clubinfo = cc.fy.guildMainMsg.getCurClub().clubInfo;
    //     console.log("AAA",clubinfo);
    //     if(clubinfo){
    //         cc.sys.localStorage.setItem("clubclick" + clubinfo.clubid,true);
    //     }
    // },

    //群公告按钮事件
    getGongGao: function(){
        
        this.sendGongGao(); 
    },

    //发送获取公告
    sendGongGao: function(){
        console.log("aaaa",Date.now());
        let curGuild = cc.fy.guildMainMsg.getCurClub().clubInfo;
        cc.fy.net.send("get_message_request",{"clubId":curGuild.clubid});
    },

    //显示公告
    showGongGao: function(){
        
        var isShow = cc.fy.guildMainMsg.getCurClub().level >= 1 ? true : false;
        if(isShow){
            this.hasPowerInit();   
            this.contentEditInfo2.getComponent(cc.Label).string =this._contentInfo; 
            this.contentEditInfo.getComponent(cc.Label).string =this._contentInfo; 
            if(this.contentEditInfo.height>240){
                 this.contentEditInfo2.active=false;
                 this.contentEditInfoScroll.active=true;
            }else{
                this.contentEditInfo2.active=true;
                this.contentEditInfoScroll.active=false;
            }
       
        }
        else{
            this.noPower();
            this.contentInfo.getComponent(cc.Label).string =this._contentInfo;    
            this.contentInfo2.getComponent(cc.Label).string =this._contentInfo; 
            if(this.contentInfo.height>240){
                 this.contentInfo2.active=false;
                 this.contentInfoScroll.active=true;
            }else{
                this.contentInfo2.active=true;
                this.contentInfoScroll.active=false;
            }
            
        }
    },
    noPower(){
        this.btnEdit.active = false;
        this.btnQueRen.active = false;
        this.btnQuXiao.active = false;
        this.contentEdit.active=false;
        this.editBoxNode.active=false;
        this.content.active=true;
       
    },
    hasPowerInit(){
        this.btnEdit.active = true;
        this.btnQueRen.active = false;
        this.btnQuXiao.active = false;
        this.contentEdit.active=true;
        
        this.content.active=false;
        this.editBoxNode.active=false;
    },
    hasPowerEdit(){
        this.btnEdit.active = false;
        this.btnQueRen.active = true;
        this.btnQuXiao.active = true;
        this.contentEdit.active=false;
        this.content.active=false;
        this.editBoxNode.active=true;
    },
    //关闭公告
    onClose: function(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.onCancel();
        this.node.active = false;      
    },

    //编辑公告
    onEdit: function(){
        this.hasPowerEdit()
        this.editBox.string = this.contentEditInfo.getComponent(cc.Label).string;
      
    },

    //确认修改公告
    onSure: function(){
        let curGuild = cc.fy.guildMainMsg.getCurClub().clubInfo;
        let info=  this.editBox.string;
       
        if(info== ""){
            cc.fy.hintBox.show("发送内容不能为空");
            return;
        }
        if(FilterWord.chkFilterWord(info)){
            cc.fy.hintBox.show("发送内容不能包含敏感词");
            return;
        }
      
        cc.fy.net.send("update_message_request",{"clubId":curGuild.clubid,"content":info});
        this.onCancel();
    },

    //取消修改
    onCancel: function(){
        this.hasPowerInit();    
    },

  
});
