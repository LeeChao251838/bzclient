var GameMsgDef = require("GameMsgDef");
cc.Class({
    extends: require("BaseModuleView"),

    properties: {
        nodHelpRules:{
            default:[],
            type:cc.Node
        },
        nodRadioButtons:{
            default:[],
            type:cc.Node
        }
    },

    // use this for initialization
    onLoad(){
        this.initEventHandlers();
    },

    start(){
    },

    initEventHandlers(){
        var self = this;
        var game = cc.fy.gameNetMgr;
        
        game.addHandler(GameMsgDef.ID_SHOWHELPVIEW_CTC, function(data){
            if(data.isShow == false){
                self.close();
            }
            else{
                console.log("ID_SHOWHELPVIEW_CTC ---- ");
                 self.show(data);
               // self.node.active = true;
            }
        });
        game.addHandler("game_over",function(){
            self.close();
        });

        game.addHandler("pdk_game_over",function(){
            self.close();
        });
        game.addHandler("ddz_game_over",function(){
            self.close();
        });
    },

    close(){
        this.node.active = false;
    },
    hidePanel:function(){
        this.node.active = false;
    },
    show(data){
        this.node.active = true;
        this.reset();
        //默认苏州麻将
        var idx=1;
        if(data && data.content!=null){
            idx=data.content;
            if(data.content==45){
                idx=7;  
            }
            if(data.content==23){
                idx=5; 
            }
       
        }
        if( this.nodRadioButtons[idx]){
            this.nodRadioButtons[idx].getComponent(cc.Toggle).isChecked= true;
            this.nodHelpRules[idx].active = true;
        }
  
    },

    onGameTypeClicked(event){
        // cc.fy.audioMgr.playSFX("click_return.mp3");
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        
        this.reset();
        var index = this.getTypeIndex(event.target.name);
        if( this.nodHelpRules[index]){
            this.nodHelpRules[index].active = true;
            this.nodRadioButtons[index].getComponent(cc.Toggle).isChecked = true;
        }
       
    },

    reset(){
        for(var i = 0; i < this.nodHelpRules.length; i++){
            if(this.nodHelpRules[i]){
                this.nodHelpRules[i].active = false;
            } 
        }
        for(var i = 0; i < this.nodRadioButtons.length; i++){
            if( this.nodRadioButtons[i]){
                this.nodRadioButtons[i].getComponent(cc.Toggle).isChecked = false;
            }    
        }
    },

    getTypeIndex:function(name){
        for(var i=0;i<this.nodRadioButtons.length;i++){
            if(this.nodRadioButtons[i]){
                if(name == this.nodRadioButtons[i].name){
                    return i;
                }
            }       
        }
        return 0;
    },
    onBtnClose(){
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.node.active = false;
    },
});