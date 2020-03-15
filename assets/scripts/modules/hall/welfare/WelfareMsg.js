var GameMsgDef = require("GameMsgDef");
var ConstsDef = require("ConstsDef");

cc.Class({
    extends: require("BaseModuleMsg"),

    properties: {
        resPanelUrl:"prefabs/hall/Bangding/Bangding", // 预制体路径
        msgIdShowView:GameMsgDef.ID_SHOWWELFAREVIEW_CTC, // 显示ID
        isPreload:false, // 是否需要预加载，ps:常用组件需要预加载加快显示
        limitScene:ConstsDef.SCENE_NAME.HALL, // 限制场景，指定模块的场景，null是不限制 如:limitScene:ConstsDef.SCENE_NAME.GAME 游戏场景模块
    },

    messageDispatch:function(msg){
        switch (msg.msgId) {
            case GameMsgDef.ID_LOADSCENEFINISH:    // 进入游戏场景
                if(cc.fy.sceneMgr.isHallScene()){
                    this.getBaseInfo();
                }
            break;
        }
    },

    getBaseInfo(){
        var self = this; 
        var userid = parseInt(cc.fy.userMgr.userId);
        // if(cc.fy.userMgr.proid != null && cc.fy.userMgr.proid != 0){
            // return;
        // }
        
        cc.fy.http.sendRequest('/base_info', {userid:userid}, function(ret){
            console.log("==>> get_base_info --> ret: ", ret);
            if(ret.uuid != null){
                cc.fy.userMgr.unionid = ret.uuid;
                self._unionid = ret.uuid;
            }
            //if(ret.proid != null && ret.proid != 0){
                // cc.fy.userMgr.proid = ret.proid;
              //  self._proid = ret.proid;
           // }
            
            self.getProidWeb(userid);
            
        }, cc.fy.http.master_url); 
        
       
    },

    getProidWeb(userid){
        var data = {
            userId:userid,
            wx_uuid:/*"123",/*/cc.fy.userMgr.unionid,//*/
        }
        cc.fy.http.sendRequest('/get_proid_web', data, function(ret){
            console.log("==>> get_proid_web --> ret: ", ret);
            if(ret.errcode == 0){
                if(ret.proid != null && ret.proid != 0){
                    cc.fy.userMgr.proid = ret.proid;
                }
            }else{
                cc.fy.userMgr.proid =null;
            }
        }, cc.fy.http.master_url);
    },
});