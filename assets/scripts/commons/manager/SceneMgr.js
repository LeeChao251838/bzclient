var ConstsDef = require('ConstsDef');
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        currentScene:ConstsDef.SCENE_NAME.UPDATE,
        loadedScene:ConstsDef.SCENE_NAME.UPDATE,
    },

    loadScene:function(scene, reload){
        console.log("loadScene " + scene);
        var data = Date.now();
        if((this.currentScene != scene || reload == true) && this.isLoading() == false){
            this.currentScene = scene;
            var self = this;
            var onSceneLaunched = function(){
                data = (Date.now() - data) / 1000;
                console.log(" 加载场景耗时 ========>>>>>>>>>> " + data);
                console.log("onSceneLaunched " + self.currentScene);
                self.loadedScene = self.currentScene;
            }
            cc.director.loadScene(scene, onSceneLaunched);
        }
    },

    isLoading:function(){
        return this.loadedScene != this.currentScene;
    },
    
    getGameSceneByType(type){
        var gameStr = ConstsDef.SCENE_NAME.GAME_MJ;
        if(type != null && type == cc.GAMETYPE.GD){
            gameStr = ConstsDef.SCENE_NAME.GAME_GD;
        }
        else if(type != null && type == cc.GAMETYPE.PDK){
            gameStr = ConstsDef.SCENE_NAME.GAME_PDK;
        }
        else if(type != null && type == cc.GAMETYPE.DDZ){
            gameStr = ConstsDef.SCENE_NAME.GAME_DDZ;
        }
        return gameStr;
    },

    loadGameScene:function(type, reload){
        this.loadScene(this.getGameSceneByType(type), reload);
    },

    isGameScene:function(){
        console.log("this._currentScene:========"+this.currentScene );
        if( this.currentScene == ConstsDef.SCENE_NAME.GAME_MJ ||
            this.currentScene == ConstsDef.SCENE_NAME.GAME_GD||
            this.currentScene == ConstsDef.SCENE_NAME.GAME_PDK ||
            this.currentScene == ConstsDef.SCENE_NAME.GAME_DDZ){
            return true;
        }
        return false;
    },

    isHallScene:function(){
        if(this.currentScene == ConstsDef.SCENE_NAME.HALL){
            return true;
        }
        return false;
    },

    // 判断是否是麻将界面
    isMJGameScene: function(){
        if(this.currentScene == ConstsDef.SCENE_NAME.GAME_MJ){
            return true;
        }
        return false;
    },

    isPDKGameScene: function(){
        console.log("isPDKGAME :"+this.currentScene);
        if(this.currentScene == ConstsDef.SCENE_NAME.GAME_PDK){
            return true;
        }
        return false;
    },

    isDDZGameScene: function(){
        if(this.currentScene == ConstsDef.SCENE_NAME.GAME_DDZ){
            return true;
        }
        return false;
    },

    isGDGameScene: function(){
        if(this.currentScene == ConstsDef.SCENE_NAME.GAME_GD){
            return true;
        }
        return false;
    },
    isLoadingScene(){
        console.log(this.currentScene);
        if(this.currentScene == ConstsDef.SCENE_NAME.LOADING||this.currentScene == ConstsDef.SCENE_NAME.UPDATE||this.currentScene == ConstsDef.SCENE_NAME.LOGIN){
            return true;
        }
        return false;
    },
    isTargetScene:function(scene){
        if(this.currentScene == scene){
            return true;
        }
        else if(scene == ConstsDef.SCENE_NAME.GAME){
            return this.isGameScene();
        }
        return false;
    },
});