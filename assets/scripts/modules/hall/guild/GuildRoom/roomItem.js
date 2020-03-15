var GameMsgDef = require("GameMsgDef");
var ConstsDef = require("ConstsDef");
cc.Class({    
    extends: cc.Component,
    properties: {
        typeLabel:cc.Label,//玩法label
        jushuLabel:cc.Label, //局数
        difenLabel:cc.Label, //底分

        Gameing:cc.Node,  //游戏中图片
        Waiting:cc.Node,  //等待中图片

        _roomId:null, //房间号
        _groupId:null, //模板号
        _hasbegan:false, //开局了吗
        _type:null,     //玩法type
        _baseInfo:null,
        _playerNum:0,
        
    },

    /*
    base_info: "{"roomId":"203167","type":7,"xuanzejushu":0,"maxGames":4,"aagems":2,"wanfa":[7,0,5,6]
                ,"baseScore":1,"real_gems":0,"maxCntOfPlayers":3,"version":20171109,"channelid":3,
                    "creator":38061,"clubId":303,"groupId":3949,"isGroup":1,"isSameIp":0,"isGps":0}"
    id: "203167", hasbegan: 0,num_of_turns: 0 playerNum: 0
    */
    initRoom:function(data ,baseinfo){
        //获取房间桌子
        console.log(data);
        this.node.active=true;

        this._baseInfo =baseinfo;
        this._roomId =data.id;
        this._groupId =baseinfo.groupId;
        this._type =baseinfo.type;
        this._hasbegan=data.hasbegan;
        this._playerNum =data.playerNum;
        //基本规则（游戏名称 局数 付款方式）
        var gamename = cc.GAMETYPENAME[baseinfo.type];
        this.typeLabel.string=gamename;
        if(baseinfo.maxCntOfPlayers == null){
            baseinfo.maxCntOfPlayers = 4;
        } 
        this.difenLabel.string="底分:1";
        if(baseinfo.baseScore!=null){
           this.difenLabel.string="底分:"+baseinfo.baseScore;
        } 
        if(baseinfo.base_score!=null){
             this.difenLabel.string="底分:"+baseinfo.base_score;
        }
        if(baseinfo.diFen!=null){
            this.difenLabel.string="底分:"+baseinfo.diFen;
        }

        //MJ 和poker的 用图不一样
        var sprIdx= 0;
        sprIdx =this.isMJOrPoker(baseinfo.type);
        for(var y = 0; y < 4; ++y){
            var sprChair = "sprChair" + y;
            var chair =this.node.getChildByName(sprChair);
            if(chair){
                cc.fy.resMgr.setSpriteFrameByUrl(ConstsDef.URL_ATLAS_GUILDROOMCHAIR[sprIdx],chair.getComponent(cc.Sprite));
                chair.active = y < baseinfo.maxCntOfPlayers ? true : false; 
            }  
            var userNode = this.node.getChildByName("chairHead"+y);
            userNode.active=false;
        }
        var desk =this.node.getChildByName("sprDesk");
        if(desk){
            cc.fy.resMgr.setSpriteFrameByUrl(ConstsDef.URL_ATLAS_GUILDROOMTABLE[sprIdx],desk.getComponent(cc.Sprite));
        }
        
        if(sprIdx==0){//扑克
            this.typeLabel.node.color=new cc.Color(21,105,66);
            this.jushuLabel.node.color=new cc.Color(21,105,66);
            this.difenLabel.node.color =new cc.Color(21,105,66);
        }else if(sprIdx==1){//麻将
            this.typeLabel.node.color=new cc.Color(192,99,66);
            this.jushuLabel.node.color=new cc.Color(192,99,66);
            this.difenLabel.node.color =new cc.Color(192,99,66);
        }
    
        //局数
        var jushu=0;
        var maxGames=[4,8,16];
        if(baseinfo.maxGames>0){
            jushu=baseinfo.maxGames;
        }else{
            if(baseinfo.type==cc.GAMETYPE.DDZ){
                maxGames=[6,8,16];
            }
            jushu =maxGames[baseinfo.xuanzejushu];
            this._baseInfo.maxGames=jushu;
        }
        if(baseinfo.type==cc.GAMETYPE.GD){
            this._baseInfo.baseScore=baseinfo.difen;
        }
       //用户信息
        var namearr = ["0","1","2","3"];
        for (var x = 0; x < namearr.length; x++) {
            //座位
             var chairHeadName = "chairHead" + namearr[x];
            var chairHead = this.node.getChildByName(chairHeadName);
            //userid
            var useridstr="user_id"+namearr[x];
            var userid=data[useridstr];
            if(!userid){
                chairHead.active =false;
                continue;
            }
            chairHead.active =true;
            // 加载头像
            var imgstr = "user_icon" + namearr[x];
            var headimgStr = data[imgstr];
            var sprHead = chairHead.getChildByName('info_head').getChildByName('sprHead');
            var imageloader = sprHead.getComponent("ImageLoader");
            //先初始化默认头像
            cc.fy.resMgr.setSpriteFrameByUrl(ConstsDef.URL_ATLAS_HEADIMG,sprHead.getComponent(cc.Sprite));
            if (headimgStr != null && headimgStr != "null" && headimgStr != "") {
                imageloader.setUrl(headimgStr);
            }
           
            //加载名字
            var namestr = "user_name" + namearr[x];
            var userNameStr = data[namestr];
        
            var nodName = chairHead.getChildByName("labName");
            if (userNameStr != null && userNameStr != "") {
                nodName.getComponent(cc.Label).string =cc.fy.utils.subStringCN(userNameStr, 8, true) ;
            }else{
                nodName.getComponent(cc.Label).string ="";
            }
        }

        if (!data.hasbegan) {
            this.Gameing.active = false;
            this.Waiting.active = false;
            this.jushuLabel.string =  "0/" + jushu + "局";
        }
        else{
            this.Gameing.active = true;
            this.Waiting.active = false;                    
            if (parseInt(data.num_of_turns) + 1 > parseInt(jushu)) {
                this.jushuLabel.string =  jushu + "/" + jushu+ "局";
            }
            else{
                this.jushuLabel.string = parseInt(data.num_of_turns + 1) + "/" + jushu+ "局";
            }
        } 
    },

    onEnterRoom:function(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        if(this._hasbegan){
            cc.fy.hintBox.show("对局已开始");
        }else{
            cc.fy.userMgr.enterRoom(this._roomId);
        }
        
    },
    onRoomRule:function(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        let content={
            roomId:this._roomId,
            groupId:this._groupId,
            roomRule:this._baseInfo,//cc.fy.gameNetMgr.getWanfa(this._baseInfo,true),
            roomState:this._hasbegan,
            curtype:this._type,
            playerNum:this._playerNum,
        };
        //点桌子，和规则都弹规则
        cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWGUILDDESKRULEVIEW_CTC, { isShow: true,content:content});
    },

    isMJOrPoker(type){
        if(type == cc.GAMETYPE.PDK || type == cc.GAMETYPE.DDZ || type == cc.GAMETYPE.GD){
            return 0;
        }
        else{
            return 1;
        }
    },
    

});
