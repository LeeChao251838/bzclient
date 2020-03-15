cc.Class({
    extends: require('Item'),

    properties: {
       
        roomInfo:cc.Label,
        time:cc.Label,
        roomContent:cc.Node,

        _Data:null,
    },

    updateItem:function(index, data){
        console.log(data);
        this._super(index, data);
        this.node.active = true;
        this._Data=data;
        this.node.idx=index;
      
        var date = new Date(data.time * 1000);
        var dateStr = cc.fy.utils.timeToString(date, "yyyy-MM-dd");
        var timeStr = cc.fy.utils.timeToString(date, "hh:mm:ss");
        this.time.string = dateStr+ " "+timeStr;
     
        let roomId= "房间:"+data.id;
       

        var noStr = "";
        let noType = "";
        let difen ="";
        let isGroup=0;
        var creator=null;
        var conf =data.conf;
        if(data.maxGames>=0){
            noStr ="  局数:"+data.maxGames;
        }
        if (conf != null) {
            noType = " ("+ cc.GAMETYPENAME[conf.type] +")";
            difen =conf.baseScore>0?"  底分："+conf.baseScore:"";
            if(conf.type==cc.GAMETYPE.SZER){
                 difen ="  底分："+conf.baseScore;
            }
            if(conf.type==cc.GAMETYPE.GD){
                difen ="  底分："+conf.diFen;
            }
            if(conf.isClubRoom){
                isGroup=conf.isClubRoom;
            }
            if(conf.creator){
                creator=conf.creator;
            }        
        }
        this.roomInfo.string=roomId+difen+noStr+noType;
       
        // let selfIndex=0;
        // for(var j = 0; j < 4; ++j){
        //     let itemNode=this.roomContent.getChildByName("item"+j);
        //     itemNode.active=false;
        //     let s = data.seats[j];  
        //     if(s){
        //         if(s.userid==cc.fy.userMgr.userId){
        //             selfIndex=j;
        //         }
        //     }       
           
        // }
        for(let j=0;j<4;j++){
            let itemNode=this.roomContent.getChildByName("item"+j);
            itemNode.active=false;
        }
        
       
        var otherIndex =0;
        for(let i=0;i<data.seats.length;i++){
            var s = data.seats[i];    
            if(s &&s.userid== cc.fy.userMgr.userId){
                otherIndex=1;
                break;
            }
        }
        for(var k = 0; k <  data.seats.length; k++){

                let item=null;
                if(data.seats[k].userid ==cc.fy.userMgr.userId ){
                   item= this.roomContent.getChildByName("item0" );
                }else{
                    item =this.roomContent.getChildByName("item"+otherIndex );
                    otherIndex++;
                }
                
                item.active=true;
                let itemData = data.seats[k];               
                
                itemData.score = cc.fy.utils.floatToFixed(itemData.score,1,true);
                var info = cc.fy.utils.subStringCN(itemData.name, 12, true);            
                let name= item.getChildByName("name");
                name.getComponent(cc.Label).string = info;
                
                let scoreWin=  item.getChildByName('scoreWin');
                let scoreLose=  item.getChildByName('scoreLose');

                if(itemData.score >= 0 ){
                    scoreWin.active=true;
                    scoreLose.active=false;
                    scoreWin.getComponent(cc.Label).string= itemData.score;
                }else{
                    scoreWin.active=false;
                    scoreLose.active=true;
                    scoreLose.getComponent(cc.Label).string= itemData.score;
                }   
                let fangzhu=item.getChildByName("fangzhu"); 
                if(fangzhu){
                    fangzhu.active=false;
                    if(isGroup==0){
                         if(creator==itemData.userid && conf.aagems==0){
                            fangzhu.active=true;
                         }
                    }
                }            
        }
    },
    onClickDetail(event){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        var idx = this.node.idx;
        if(cc.fy.guildMainMsg._isInclub==true){
            cc.fy.gameNetMgr.dispatchEvent("ctc_guild_zhanji_detail",{idx:idx});
        }else{
            cc.fy.gameNetMgr.dispatchEvent("ctc_hall_zhanji_detail",{idx:idx});
        }
        
        
        
        

    },
  

});
