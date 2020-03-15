var GameMsgDef = require("GameMsgDef");
cc.Class({
    extends: require("BaseModuleView"),

    properties: {
     
      
        guildName:cc.Label,
        guildId:cc.Label,
        onlineCount:cc.Label,
        gameLayout: cc.Node,  //玩法布局节点
        huoyuenum:cc.Label,
        zongchangnum:cc.Label,
        fangkanum:cc.Label,
        pageLabel: cc.Label,   //页面标签
        buttonList: cc.Node,  //排名按钮节点
  
        nullNode:cc.Node,
        tjcontent: cc.Node,
        rankItem:cc.Node,
        wanfaItem:cc.Node,
        beginDate:cc.Label,
        endDate:cc.Label,
   
        _sortType: 1,       //排序类型 1：对局 2：赢家 3：赢分
        _page: 1,           //当前页码
        _totalPage: 1,      //总页码
        _gameType: [],      //查询玩法
        _selDate: 1,        //选择的日期
        _beginDate: null,   //开始日期
        _endDate: null,     //结束日期

        //日期相关
        tjdate: cc.Node,
        year: cc.Label,
        month: cc.Label,
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
        
        game.addHandler(GameMsgDef.ID_SHOWGUILDTONGJIVIEW_CTC, function(data){
            if(data && data.isShow == false){
                self.hidePanel();
            }
            else{
                self.showPanel(data);
            }
        });
        //初始化
        //日期
        var center =  this.tjdate.getChildByName("date").getChildByName("center");
        for(var i = 1; i < center.childrenCount; i++){
            var item = center.children[i];
            for(var j = 0; j < item.childrenCount; j++){
                var itemBtn = item.children[j];
                cc.fy.utils.addClickEvent(itemBtn, this.node, "GuildTongjiView", "onChooseDate");
            }
        }

        //消息监听
        game.addHandler('get_clubinfo_rank_response',function(data){  
            if(data.code != 0){
                cc.fy.hintBox.show(data.msg);
                return;
            }
            cc.fy.loading.hide();
            self._totalPage = data.totalPages
            self.showTongJiView(data);
        });

        game.addHandler('get_club_statistics_response',function(data){  
            self.setTongjiInfo(data);
        });
    },

    

    initView:function(){
        // 作为弹框模式 不隐藏其它弹框
        this.setHideOther(false);
      
    },

    showPanel:function(data){
        this.node.active = true;
        this.getTongJi();
    },

    hidePanel:function(){
 
        this.node.active = false;
    },
    //关闭统计
    onTJClose: function(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        console.log("tongji close");
        // this._beginDate = null;
        // this._endDate = null;
        this.getNowDate();
        this.refreshSelect();
        this.checkGameType();
        this.node.active = false;
    },

    //开始查询统计
    getTongJi: function(){
        
        if((this._gameType == null || this._gameType.length == 0) || (this._beginDate == null || this._endDate == null)){
            this.requestDefault(); 
            this.initGameType();
        }
        else{
            this.requestInfo();
            this.requestStatistics();
        }
    }, 

    //初始化玩法节点
    initGameType: function(){
        this.gameLayout.removeAllChildren();
        for (var key in cc.GAMETYPE) {
            let type=cc.GAMETYPE[key];
                var item = this.getGameItem();
                item.active = true;
                item.getChildByName("labname").getComponent(cc.Label).string = cc.GAMETYPENAME[type];
                item.idx = type;
                let toggle= item.getChildByName("toggle").getComponent(cc.Toggle);
                toggle.isChecked=true;
                this.gameLayout.addChild(item);
        }
    },

    getGameItem: function(){
        var item = this.wanfaItem;
        var node = cc.instantiate(item);
        return node;
    },

    //请求默认统计数据
    requestDefault: function(){
        var gametype=[];
        for (var key in cc.GAMETYPE) {
            let type=cc.GAMETYPE[key]
            gametype.push(type);
        }      
        if(this._gameType == null || this._gameType.length == 0){
            this._gameType = gametype;
        }
        this.getNowDate();
        //console.log("Date",this._beginDate,this._endDate,adate,bdate);
        this.requestInfo();
        this.requestStatistics();
    },

    //请求玩家数据
    requestInfo:function(){
        cc.fy.loading.show();
        let curGuild = cc.fy.guildMainMsg.getCurClub().clubInfo;
        //cc.fy.net.send("get_clubinfo_rank_request",{"clubid":curGuild.clubid,"gameType":this._gameType,"time":{"from":this._beginDate,"to":this._endDate},sortType:this._sortType,page:this._page});
        cc.fy.net.send("get_clubinfo_rank_request_new",{"clubid":curGuild.clubid,"gameType":this._gameType,"time":{"from":this._beginDate,"to":this._endDate},sortType:this._sortType,page:this._page});
    },

    //请求消耗数据
    requestStatistics:function(){
        let curGuild = cc.fy.guildMainMsg.getCurClub().clubInfo;
        cc.fy.net.send("get_club_statistics_request",{"clubid":curGuild.clubid,"gameType":this._gameType,"time":{"from":this._beginDate,"to":this._endDate}});
    },

    //获取当前时间戳
    getNowDate: function(){
        var date = new Date();
        var Y = date.getFullYear();
        var M = (date.getMonth()+1 < 10 ? '0'+ date.getMonth() : date.getMonth());
        var D = ((date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()));

        var bdate = new Date(Y,M,D,0,0,0);
        this._beginDate = bdate.getTime();
        var edate = new Date(Y,M,D,23,59,59);
        this._endDate = edate.getTime();
        var adate = this.transformPHPTime(this._beginDate);
        var bdate = this.transformPHPTime(this._endDate);
        this.beginDate.string = adate;
        this.endDate.string = bdate;
    },

    //转换时间戳为具体时间
    transformPHPTime :function(time) 
    {
        var date = new Date(time);   　　　　
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+ (date.getMonth() + 1): (date.getMonth() + 1)) + '-';
        var D = date.getDate();
        return Y+M+D;
    },

    //显示统计界面
    showTongJiView:function(data){
        this.node.active = true;
        var userData = data.data;
        console.log("showTongJiView",userData);
        //公会名
        let curGuild = cc.fy.guildMainMsg.getCurClub().clubInfo;
        this.guildName.string = curGuild.name;

        //群ID
        this.guildId.string ="ID:"+ curGuild.promo_code;
        //在线人数
        this.onlineCount.string = curGuild.online + "/" + curGuild.players;
        //显示页码
        this.pageLabel.string = this._page + "/" + this._totalPage;

        this.refreshRankList(userData);
    },

    //刷新玩家排名
    refreshRankList:function(data){
        var len = 0;
        if(data!=null && data.length>0){
            len=data.length;
        }
        var children =this.tjcontent.children;
        for(let i=0;i<len;i++){
            var item=children[i];
            if(item==null){
                item = cc.instantiate(this.rankItem);
                this.tjcontent.addChild(item);
            }
            var index =(this._page-1)*5 + i+1;
            item.getComponent('GuildTongjiItem').updateItem(data[i],index);
        }

        for(let i=len;i<children.length;i++){
            children[i].active=false;
        }
        if(len>0){
            this.nullNode.active=false;
        }else{
            this.nullNode.active=true;
        }
    },

    

    //设置活跃、总场数、房卡消耗数据
    setTongjiInfo:function(data){
        var info = data.data;
        if(info.length > 0){
            console.log("Tong ji",info);
            this.huoyuenum.string = info[0];
            this.zongchangnum.string = info[1];
            this.fangkanum.string = info[2];
        }
    },

    //统计查询按钮事件
    onQuery:function(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.checkGameType();
        if(this._beginDate > this._endDate){
            cc.fy.hintBox.show("时间输入不正确");
            return;
        }

        if(this._gameType.length == 0){
            cc.fy.hintBox.show("请选择一种玩法");
            return;
        }
        //初始化页码
        this._page=1;
        this._totalPage=1;
        this.requestInfo();
        this.requestStatistics();
    },

    //检测需查询的玩法
    checkGameType:function(){
        var gametype = [];
        for(var i = 0; i < this.gameLayout.childrenCount;i++){
            var node = this.gameLayout.children[i];
            var toggle = node.getChildByName("toggle").getComponent(cc.Toggle);
            if(toggle.isChecked){
                gametype.push(node.idx);
            }
        }
      
        console.log("GameType",gametype);
        this._gameType = gametype;
    },

    //统计选择日期按钮事件
    onClickDate:function(event){
        var curNode = event.target;
        var name = curNode.name;
        if(name == "btnStartDate"){
            this._selDate = 1;
        }
        else if(name == "btnEndDate"){
            this._selDate = 2;
        }
        //console.log("Event",curNode);

        this.tjdate.active = true;
    },

    //选择日期按钮事件
    onChooseDate:function(event){
        this.refreshSelect();
        this.years = new Array();
        this.months = new Array();
        var curNode = event.target;
        
        //console.log("Event",curNode);
        this.day = curNode.getChildByName("date").getComponent(cc.Label).string;
        curNode.getChildByName("select").active = true;

        var year = this.year.string;
        this.years = year.split(" ");
        var month = this.month.string;
        this.months = month.split(" ");
        
        console.log("year",this.years,"month",this.months,"day",this.day);
    },

    //取消选择日期
    onCancelDate:function(){
        this.tjdate.active = false;
    },

    //确定选择日期
    onSureDate:function(){
        if(this._selDate == 1){
            var date = new Date(this.years[0],this.months[0] - 1,this.day,0,0,0);
            this._beginDate = date.getTime();
        }
        else{
            var date = new Date(this.years[0],this.months[0] - 1,this.day,23,59,59);
            this._endDate = date.getTime();
        }

        if(this._beginDate != null){
            var date = this.transformPHPTime(this._beginDate);
            this.beginDate.string = date;
        }

        if(this._endDate != null){
            var date = this.transformPHPTime(this._endDate);
            this.endDate.string = date;
        }

        this.tjdate.active = false;
    },

    //重置日期选择
    refreshSelect:function(){
        var center = this.tjdate.getChildByName("date").getChildByName("center");
        for(var i = 1; i < center.childrenCount; i++){
            var title = center.getChildByName("title" + i);
            for(var j = 0; j < title.childrenCount; j++){
                title.children[j].getChildByName("select").active = false;
            }
        }
    },

    //上一页
    onLastPage:function(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this._page--;
        if(this._page < 1){
            this._page = 1;
            return;
        }
        this.requestInfo();
        this.pageLabel.string = this._page + "/" + this._totalPage;
    },

    //下一页
    onNextPage:function(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this._page++;
        if(this._page > this._totalPage){
            this._page = this._totalPage;
            return;
        }
        this.requestInfo();
        this.pageLabel.string = this._page + "/" + this._totalPage;
    },

    //对局排名
    onDuiJuSort:function(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.banClick();
         if(this._beginDate > this._endDate){
            cc.fy.hintBox.show("时间输入不正确");
            setTimeout(function(){
                let buttonlist = this.buttonList;
                for(let i=0;i<buttonlist.childrenCount;i++){
                    var toggle =buttonlist.children[i].getComponent(cc.Toggle);
                    if(toggle){
                        console.log("i:"+(i+1) +"   ---type:"+this._sortType);
                        toggle.isChecked= this._sortType== i+1;
                    }
                }
             }.bind(this),100);
            return;
        }

        if(this._sortType != 1){
            this._page = 1;
            this._sortType = 1;
        }
        else{
            return;
        }
        this.requestInfo();
    },

    //赢家排名
    onYingJiaSort:function(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.banClick();
         if(this._beginDate > this._endDate){
            cc.fy.hintBox.show("时间输入不正确");
             setTimeout(function(){
                let buttonlist = this.buttonList;
                for(let i=0;i<buttonlist.childrenCount;i++){
                    var toggle =buttonlist.children[i].getComponent(cc.Toggle);
                    if(toggle){
                        console.log("i:"+(i+1) +"   ---type:"+this._sortType);
                        toggle.isChecked= this._sortType== i+1;
                    }
                }
             }.bind(this),100);
            return;
        }

        if(this._sortType != 2){
            this._page = 1;
            this._sortType = 2;
        }
        else{
            return;
        }
        this.requestInfo();
    },

    //赢分排名
    onYingFenSort:function(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.banClick();
         if(this._beginDate > this._endDate){
            cc.fy.hintBox.show("时间输入不正确");
             setTimeout(function(){
                let buttonlist = this.buttonList;
                for(let i=0;i<buttonlist.childrenCount;i++){
                    var toggle =buttonlist.children[i].getComponent(cc.Toggle);
                    if(toggle){
                        console.log("i:"+(i+1) +"   ---type:"+this._sortType);
                        toggle.isChecked= this._sortType== i+1;
                    }
                }
             }.bind(this),100);
            return;
        }

        if(this._sortType != 3){
            this._page = 1;
            this._sortType = 3;
        }
        else{
            return;
        }
        this.requestInfo();
    },

    //禁止点击
    banClick:function(){
        let buttonlist = this.buttonList;
        for(var i = 0; i < buttonlist.childrenCount; i++){
            var child = buttonlist.children[i].getComponent(cc.Button);
            child.interactable = false;
        }
        setTimeout(function(){
            for(var i = 0; i < buttonlist.childrenCount; i++){
                var child = buttonlist.children[i].getComponent(cc.Button);
                child.interactable = true;
            }
        }, 500);
    },

});
