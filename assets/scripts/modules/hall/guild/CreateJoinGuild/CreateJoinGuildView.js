var GameMsgDef = require("GameMsgDef");
var FilterWord = require("FilterWord");
var md5 =  require("md5");
cc.Class({
    extends: require("BaseModuleView"),

    properties: {

        btnCreateGuild:cc.Button,
        btnJoinGuild:cc.Button,

        CreateInputView:cc.Node,
        CreateAgreeView:cc.Node,
        JoinGuildInputView:cc.Node,          

        nameEditBox:cc.EditBox,              //guildname输入框

        nums: [],                      //显示输入的ID
        _inputIndex: 0,                //输入数字index
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
        
        game.addHandler(GameMsgDef.ID_SHOWJOINGUILDVIEW_CTC, function(data){
            console.log("加入俱乐部：",data);
            if(data && data.isShow == false){
                self.hidePanel();
            }
            else{
                self.showPanel(data);
            }
        });
        //初始化事件监听
        //创建群响应
        game.addHandler('create_club_result',function(data){  
            console.log("create_club_result 11111111111");
            console.log(data);
            if (data.code == 0) {     
                cc.fy.hintBox.show(data.msg);
                cc.fy.net.send("get_club_info");
                self.hidePanel();
            }
            else{
                cc.fy.hintBox.show(data.msg);
            }
        }); 

        //加入群成功响应
        game.addHandler('join_club_success',function(data){ 
            console.log("join_club_success"); 
            cc.fy.hintBox.show(data.msg);
            self.JoinGuildInputView.active = false;
            self.onResetClicked();
        });

        //加入群错误响应
        game.addHandler('join_club_error',function(data){  
            console.log("join_club_error");
            cc.fy.hintBox.show(data.msg);
        });
    },

    

    initView:function(){
        // 作为弹框模式 不隐藏其它弹框
        this.setHideOther(false);


        var inputnum = this.JoinGuildInputView.getChildByName("num");
        for(var i = 0; i < inputnum.childrenCount; i++){
            var n = inputnum.children[i].getComponent(cc.Label);
            if(n != null){
                this.nums.push(n);
            }
        }
    },

    showPanel:function(data){
        this.node.active = true;
        if(data.inviteClub){
            this.autoInput(data.inviteClub);
        }
    },

    hidePanel:function(){
        this.CreateAgreeView.active=false;
        this.CreateInputView.active=false;
        this.JoinGuildInputView.active=false;
        this.node.active = false;
        if(cc.fy.guildMainMsg._clubList==null ||cc.fy.guildMainMsg._clubList.length==0 ){
            cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWGUILDMAINVIEW_CTC,{isShow:false});
        }
    },

    //自动输入群id
    autoInput(code){
        console.log("自动输入",code);
         this.JoinGuildInputView.active=true;
         code = code.toString();
         for(let i=0;i<code.length;i++){
             this.onInput(code[i]);
         }
    },

    onBtnClick:function(event){
        console.log("anniu dianji ",event);
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        var name =event.target.name;
        if(name == "close"){
            this.hidePanel();
        }else if(name == "closeJoin"){
            this.JoinGuildInputView.active=false;
            this.onResetClicked();
        }else if(name == "btnJoinGuild"){
            this.JoinGuildInputView.active=true;
        }else if(name == "btnCreateGuild"){
            this.CreateAgreeView.active=true;
        }else if(name == "btnAgree"){
            this.CreateAgreeView.active=false;
            this.CreateInputView.active=true;
            this.nameEditBox.string = "";
        }else if(name == "closeAgree"){
            console.log("anniu dianji closeAgree");
             this.CreateAgreeView.active=false;
        }else if(name == "btnConfirm"){
            //creat guild
            this.createGuild();
        }else if(name == "btnCancel"){
            this.nameEditBox.string="";
            this.CreateInputView.active=false;
        }
    },

    //创建群
    createGuild:function(){
        var clubName = this.nameEditBox.string;
        if (clubName == null || clubName == "") {
            cc.fy.hintBox.show("名字不能为空");
            return;
        }
        if (clubName.length > 6) {
            cc.fy.hintBox.show("名字过长");
            return;
        }
        if (FilterWord.chkFilterWord(clubName)) {
            cc.fy.hintBox.show("名字不能包含敏感词");
            return;
        }
        if(!this.nameValid(clubName)){
            cc.fy.hintBox.show("名字不能包含字符");
            return;
        }
          
        this.btnCreateGuild.interactable = false;
        setTimeout(function(){
            this.btnCreateGuild.interactable = true;
        }.bind(this), 1000);
        this.sendCreateGuild(clubName);
    },
    
    nameValid:function(name){
        var regName = /^[\u4E00-\u9FA5A-Za-z0-9]+$/;
        if(!regName.test(name)){
            return false;
        }
        return true;
    },

    //发送创建群请求
    sendCreateGuild:function(name){
        var sign = md5.hex_md5("" + cc.fy.userMgr.unionid + cc.fy.userMgr.userId + cc.ROOM_PRI_KEY);
        cc.fy.net.send("create_club",{"uuid":cc.fy.userMgr.unionid,"name":name,"sign":sign});
    },
           
     //数字按钮点击事件
    addButtonClick: function(event){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        var name = event.target.name;
        if(name == "0"){
            this.onInput(0);
        }
        else if(name == "1"){
            this.onInput(1);
        }
        else if(name == "2"){
            this.onInput(2);
        }
        else if(name == "3"){
            this.onInput(3);
        }
        else if(name == "4"){
            this.onInput(4);
        }
        else if(name == "5"){
            this.onInput(5);
        }
        else if(name == "6"){
            this.onInput(6);
        }
        else if(name == "7"){
            this.onInput(7);
        }
        else if(name == "8"){
            this.onInput(8);
        }
        else if(name == "9"){
            this.onInput(9);
        }
        else if(name == "re"){
            this.onResetClicked();
        }
        else if(name == "d"){
            this.onDelClicked();
        }
    },

    //输入群ID
    onInput:function(num){
        if(this.nums.length > 0){
            if(this._inputIndex >= this.nums.length){
                return;
            }
            this.nums[this._inputIndex].string = num;
            this._inputIndex += 1;
            if(this._inputIndex == this.nums.length){
                var guildId = this.parseGuildId();
                console.log("ok:" + guildId);
                this.onInputFinished(guildId);
            }
        }
    },

    //输入结束
    onInputFinished:function(clubId){
        console.log(clubId);
        cc.fy.net.send("apply_join_club",{"clubCode":clubId});
        //this.onResetClicked();
    },

    //重置按钮事件
    onResetClicked:function(){
        
        for(var i = 0; i < this.nums.length; ++i){
            this.nums[i].string = "";
        }
        this._inputIndex = 0;
    },

    //删除按钮事件
    onDelClicked:function(){
        if(this._inputIndex > 0){
            this._inputIndex -= 1;
            this.nums[this._inputIndex].string = "";
        }
    },
   
    //生成群ID
    parseGuildId:function(){
        var str = "";
        for(var i = 0; i < this.nums.length; ++i){
            str += this.nums[i].string;
        }
        return str;
    },
});
