var PDKPokerDef = require("PDKPokerDef");
var PokerType = PDKPokerDef.PokerType;

cc.Class({
    extends: cc.Component,

    properties: {
         _aniPokerType: null,          //牌型动画节点
        _aniFaPai: null,              //发牌动画
        _ainPokerSpecial: null,       //特殊动画节点
        _ainQuanGuan:null,            //全关动画节点
    },

    onLoad: function () {
        var gameChild = this.node.getChildByName("game");
        
        if(gameChild){
            console.log("正常加载")
            this._aniPokerType = gameChild.getChildByName("ainPokerType").getComponent(sp.Skeleton);
            this._ainPokerSpecial = gameChild.getChildByName("ainPokerSpecial");
            this._aniFaPai = gameChild.getChildByName("ainFaPai").getComponent(sp.Skeleton);
            this._ainQuanGuan = gameChild.getChildByName("ainQuanGuan").getComponent(sp.Skeleton);
            this._xianchu =gameChild.getChildByName("Xianchu");
        }
        
        this.initEventHandlers();
    },

    initEventHandlers: function(){
        var self = this;
        var game = cc.fy.gameNetMgr;

        game.addHandler("cc_pdk_stc_dealcard", function(data){
             self.playEffect("fapai_1.mp3");
            setTimeout(function(){
                self.playEffect("lipai.mp3");
                setTimeout(function(){
                    self.playEffect("first_chupai.mp3"); 
                },800)
            },1000)
        });

        game.addHandler('cc_pdk_stc_playcard', function(data)
        {
            var userid=cc.fy.gameNetMgr.getIDBySeatIndex(data.seatIndex);
            var sex = 0;
            //1是男 其他是女
            var cont=null;
            if(cc.fy.baseInfoMap){
                cont = cc.fy.baseInfoMap[userid];                               
            }
            if(cont){
                sex = cont.sex;
                if(data.playedCards != null && data.playedCards.length > 0){
                    self.playEffect("poker_deal.mp3");
                    var typeData = cc.fy.PDKGameMgr.getPokerType(data.playedCards);
                    var localIndex=cc.fy.gameNetMgr.getLocalIndex(data.seatIndex);
                    self.showPokerType(typeData.type,localIndex);
                    // 播放牌型声音
                    self.playPokerSound(typeData.type, data.playedCards, sex);
                }
                else{               
                    self.playSound("yaobuqi", sex);
                } 
                return;                         
            }else{
                cc.fy.userMgr.getBaseInfo(userid,function(code,content){
                    if(content.name){
                        sex= content.sex;
                          
                        if(data.playedCards != null && data.playedCards.length > 0){
                            self.playEffect("poker_deal.mp3");
                            var typeData = cc.fy.PDKGameMgr.getPokerType(data.playedCards);
                            var localIndex=cc.fy.gameNetMgr.getLocalIndex(data.seatIndex);
                            self.showPokerType(typeData.type,localIndex);
                            // 播放牌型声音
                            self.playPokerSound(typeData.type, data.playedCards, sex);
                        }
                        else{
                          
                            self.playSound("yaobuqi", sex);
                        }                 
                     } else{
                      
                        if(data.playedCards != null && data.playedCards.length > 0){
                            self.playEffect("poker_deal.mp3");
                            var typeData = cc.fy.PDKGameMgr.getPokerType(data.playedCards);
                            var localIndex=cc.fy.gameNetMgr.getLocalIndex(data.seatIndex);
                            self.showPokerType(typeData.type,localIndex);
                            // 播放牌型声音
                            self.playPokerSound(typeData.type, data.playedCards, sex);
                        }
                        else{                        
                            self.playSound("yaobuqi", sex);
                        }
                     }
                 });
            } 
                 
           
        });

       game.addHandler('cc_pdk_baodan', function(seatIndex){
            console.log("PDKGame AniSound cc_pdk_baodan"); 
            var userid=cc.fy.gameNetMgr.getIDBySeatIndex(seatIndex);
            var sex = 0;
            //1是男 其他是女
            var cont=null;
            if(cc.fy.baseInfoMap){
                cont = cc.fy.baseInfoMap[userid];                               
            }
            if(cont){
                sex = cont.sex;
                self.playSound("baodan",sex);
                return;                         
            }else{
                cc.fy.userMgr.getBaseInfo(userid,function(code,content){
                    if(content.name){
                        sex= content.sex;                          
                        self.playSound("baodan",sex);             
                     } else{
                        self.playSound("baodan",sex);                      
                     }
                 });
            }         
           
        });

        game.addHandler('pdk_game_over',function(data){
            self.onGameOver(data);
        });

        game.addHandler("pdk_quanguan",function(data){
            self.onQuanGuan();
        });

        //先出
        game.addHandler("pdk_play_begin",function(data){
            console.log("pdk_play_begin");
            setTimeout(function(){
                 self.onPlayBegan(data);
            },2000);
        });
    },

    //先出动画,目前只有自嗨。别人先出看不到

    onPlayBegan:function(seat){
        console.log("先出："+seat+"type：",cc.fy.gameNetMgr.conf.wanfa);
        if(seat==null ){
            return;
        }
        var seatInfo=cc.fy.gameNetMgr.seats[seat];
        if(seatInfo==null){
            return;
        }
        var type=0;
        if(cc.fy.gameNetMgr.conf.wanfa.indexOf(0)>=0){
            type=0;//赢
        }else if(cc.fy.gameNetMgr.conf.wanfa.indexOf(1)>=0){
            type=1;//黑桃
        }else if(cc.fy.gameNetMgr.conf.wanfa.indexOf(2)>=0){
            type=2;//红桃
        }else{
            return;
        }
        var localIndex=cc.fy.gameNetMgr.getLocalIndex(seat);

        var sideName=cc.fy.pdkGameNetMgr.getSideByLocalIndex(localIndex);
        console.log("localIndex:"+localIndex+"   sidname:"+sideName);
        var _rotation=0;
        var _po={x:0,y:0};
        if(sideName=="up"){
            _rotation=-120;
            _po.x=300;
            _po.y=200;
        }else if(sideName=="myself"){
            _po.y=-300;
        }else if(sideName=="left"){
            _rotation=90;
            _po.x=-500;
        }else if(sideName=="right"){
            _rotation=-90;
            _po.x=500;
        }
        if(localIndex==0){
            //是自己才有先出语音
   
            this.playSound("first",'myself'); //先出
        }

     
        var self= this;
        this._xianchu.active=true;
        var anim=null;
        for(let i=0;i<3;i++){
            var ndPoker=this._xianchu.getChildByName(i+"");
            if(i==type){
                ndPoker.active=true;
                anim=ndPoker;
            }else{
                ndPoker.active=false;
            }
        }
        anim.opacity=0;
        anim.x=0;
        anim.y=0;
        anim.rotation=0;
        var action1=cc.spawn(cc.fadeIn(0.5),cc.scaleTo(0.5,1.2));
        var action2= cc.spawn(cc.fadeTo(0.3,100),cc.scaleTo(0.3,1));
        var action3 =cc.spawn(cc.fadeIn(0.3),cc.scaleTo(0.3,1.2));
        var action4 =cc.sequence(cc.rotateTo(0.1,_rotation),cc.spawn(cc.moveTo(0.4,_po.x,_po.y),cc.fadeOut(0.4)));
        anim.runAction(cc.sequence(action1,action2,action3,action4,
            cc.callFunc(function(){
                self._xianchu.active=false;
            })
        ));
       
    },


    //显示全关动画
    onQuanGuan:function(){
        if(this._ainQuanGuan){
            var self=this;
            this._ainQuanGuan.node.active=true;
            this._ainQuanGuan.setAnimation(1,"animation",false);
            this._ainQuanGuan.setCompleteListener(function(){
                console.log("PDKGAME QuanGuan Complete");
                setTimeout(function(){
                    self._ainQuanGuan.node.active=false;
                },1000)
                
            });
        }
    },


    //显示牌动画
    showFaPai: function(){
        var self = this;
        this._aniFaPai.node.active = true;
        if(cc.fy.gameNetMgr.seats.length == 3){
            this._aniFaPai.setAnimation(1, "fapai", false);
        }
        else{
            this._aniFaPai.setAnimation(1, "fapai2", false);
        }
        
        this._aniFaPai.setCompleteListener(function(){
            console.log("PDKGAME FaPai CompleteListener ");
            self._aniFaPai.node.active = false;
        });
    },


    //显示牌型动画
    showPokerType: function(type,seat){
        var self = this;
        var aniType = this.getAniType(type,seat);

        console.log("PDKGAME AniType = " + aniType);
        if(aniType == null){
            return;
        }

        if(aniType == "feiji" ){
            console.log("播放飞机啦");
            self.playEffect("plane_effect.mp3"); 
            this._ainPokerSpecial.active = true;
            var aniBomb= this._ainPokerSpecial.getChildByName("ainBomb");
            aniBomb.active=false;
            var aniFeiji= this._ainPokerSpecial.getChildByName("ainFeiji").getComponent(sp.Skeleton);
            aniFeiji.node.active=true;
            aniFeiji.setAnimation(0, "animation", false);
            aniFeiji.setCompleteListener(function(){
                console.log("PDKGAME PokerSpecial CompleteListener ");
                self._ainPokerSpecial.active = false;
               
            });
        }else if(aniType=="zhadan"){
            console.log("播放炸弹啦");
            self.playEffect("bomb_effect.mp3"); 
            this._ainPokerSpecial.active = true;
            var aniFeiji= this._ainPokerSpecial.getChildByName("ainFeiji");
            aniFeiji.active=false;
            var aniBomb= this._ainPokerSpecial.getChildByName("ainBomb").getComponent(sp.Skeleton);
            aniBomb.node.active=true;
            aniBomb.setAnimation(0, "animation", false);
            aniBomb.setCompleteListener(function(){
                console.log("PDKGAME PokerSpecial CompleteListener ");
                self._ainPokerSpecial.active = false;
               
            });
        }
        else{
            if(aniType == "shunzi01" || aniType=="shunzi02"){
                self.playEffect("shunzi_effect.mp3");
            }
            else if(aniType == "liandui01" || aniType=="liandui02"){
                self.playEffect("liandui_effect.mp3");
            }
            
            this._aniPokerType.node.active = true;
            this._aniPokerType.setAnimation(1, aniType, false);
            this._aniPokerType.setCompleteListener(function(){
                console.log("PDKGAME PokerType CompleteListener ");
                self._aniPokerType.node.active = false;
            });
        }
    },

    //获取牌型动画名称
    getAniType: function(aniType,seat){
        var type = null;
        var seatstr="01";
        if(seat==1){
            seatstr="01";
        }
        
        switch (aniType) {
            case PokerType.THREE:                  //三张
                type = "sanzhang"+seatstr;
                break;
            case PokerType.THREE_1:                //三带一
                type = "sandaiyi"+seatstr;
                break;
            case PokerType.THREE_2:                //三带二
                type = "sandaier"+seatstr;
                break;
            case PokerType.BOMB4_2:                //四带二
                type = "sidaier"+seatstr;
                break;
            case PokerType.STRAIGHT_2:             //连对
                type = "liandui"+seatstr;
                break;
            case PokerType.AIRPLANE:               //飞机
                type = "feiji";
                break;
            case PokerType.AIRPLANE_2:             //飞机
                type = "feiji";
                break;
            case PokerType.STRAIGHT:               //顺子
                type = "shunzi"+seatstr;
                break;
            case PokerType.BOMB4:                  //炸弹
                type = "zhadan";
                break;
            default:
                break;
        }

        return type;
    },
    //获取语音地址
    getSoundUrl: function(type, cards, sex){
        var _sex = ""
           
        if(sex == 1){
            _sex = "nan"
        }
        else{
            _sex = "nv"
        }
               
        var soundurl = "";
        switch (type) {
            case PokerType.SINGLE:
                soundurl = "1card_" + cc.fy.PDKGameMgr.getCardName(cards[0]) + "_" + _sex;
                break;
            case PokerType.PAIR:
                soundurl = "2card_" + cc.fy.PDKGameMgr.getCardName(cards[0]) + "_" + _sex;
                break;
            case PokerType.THREE:
                soundurl = "3card_" + cc.fy.PDKGameMgr.getCardName(cards[0]) + "_" + _sex;
                break;
            case PokerType.THREE_1:
                soundurl = "3with1_" + _sex;
                break;
            case PokerType.THREE_2:
                soundurl = "3with2_" + _sex;
                break;
            case PokerType.BOMB4_2:                
                soundurl = "4with2_" + _sex;
                break;
            case PokerType.STRAIGHT_2:
                soundurl = "liandui_" + _sex;
                break;
            case PokerType.AIRPLANE:
                soundurl = "feiji_" + _sex;
                break;
            case PokerType.AIRPLANE_2:
                soundurl = "feiji_" + _sex;
                break;
            case PokerType.STRAIGHT:
                soundurl = "shunzi_" + _sex;
                break;
            case PokerType.BOMB4:
                soundurl = "bomb_" + _sex;
                break;
            default:
                break;
        }

        return soundurl;
    },
    //播放牌型声音
    playSound: function(name, sex){
        //1男其他女
        var url = "";
        if(sex=='myself'){
            sex=cc.fy.userMgr.sex;
        }
        if(sex == 1){
            url = name + "_nan.mp3"
        }
        else{
            url = name + "_nv.mp3"
        }
        cc.fy.audioMgr.playPDKSound(url, sex);
    },


   //播放音效
    playEffect: function(name){
        var url =cc.fy.audioMgr.getPDKUrl(name,cc.GAMETYPE.PDK);
        console.log(url);
        if(cc.fy.audioMgr.sfxVolume > 0){
            cc.audioEngine.play(url, false, cc.fy.audioMgr.sfxVolume);    
        }
    },

    //播放打牌声音
    playPokerSound: function(type, cards, sex){
        var soundUrl = this.getSoundUrl(type, cards, sex);

        if(soundUrl == ""){
            return;
        }
        cc.fy.audioMgr.playPDKSound(soundUrl + ".mp3", sex);
    },

    onGameOver: function(data){
        var seats = cc.fy.gameNetMgr.seats;
        if(data == null || data.length == 0){
            return;
        }
        //停止背景音乐
        cc.fy.audioMgr.stopBGM();

        for(var i = 0; i < seats.length; i++){
            var result = data[i];
            if(result.userId == cc.fy.userMgr.userId){
                if(result.win){
                    this.playEffect("bgm_win.mp3"); 
                }
                else{
                    //流局也播放失败的音乐
                    this.playEffect("bgm_lose.mp3");                    
                }
            }
        }     
    }
});
