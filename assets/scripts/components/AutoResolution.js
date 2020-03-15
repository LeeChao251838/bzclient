cc.Class({
    extends: cc.Component,
    properties: {
    },
    onLoad: function () {
        let width = cc.view.getFrameSize().width;
        let height = cc.view.getFrameSize().height;
        var realwidth = width / height;
        var cvs = this.node.getComponent(cc.Canvas);
        if (cc.fy == null) {
            cc.fy = {};
        }
        //  let v2 = cc.winSize;
        //  let rect = cc.director.getSafeAreaRect() //忘了啥时候支持的api，1.9.0是支持的
        //  let liuhai=Math.ceil(v2.width - rect.width)/2;
        // console.log("liuhai:"+liuhai);
        if(cc.fy.sceneMgr.isPDKGameScene() ||cc.fy.sceneMgr.isMJGameScene() ){
            let size=1366/768;
            console.log("width:"+width+"   heigth:"+height);
            if(realwidth>size){
                cvs.fitHeight = true;
                cvs.fitWidth = false;
                let safeWidth=(size/realwidth)*1366;
                let offset=(1366-safeWidth)/2;
                console.log("safeWidth:"+safeWidth+" offset:"+offset);
                let gameMain  =this.node.getChildByName("gameMain");
                if(gameMain){
                    let widget=  gameMain.getComponent(cc.Widget);
                    if(widget){
                        widget.left=offset>56?56:offset;
                        widget.right=offset>56?56:offset;
                    }
                }
            }else{
                cvs.fitHeight = false;
                cvs.fitWidth = true;
            }
        }else if(cc.fy.sceneMgr.isHallScene()){
             let size=1366/768;
             var bg =cc.find("Canvas/hallBg");
            if(realwidth>size){
                 cvs.fitHeight = true;
                cvs.fitWidth = false;
                let safeWidth=(size/realwidth)*1366;
                let offset=(1366-safeWidth)/2;
                console.log("safeWidth:"+safeWidth+" offset:"+offset);
                let gameMain  =this.node.getChildByName("gameMain");
                if(gameMain){
                    let widget=  gameMain.getComponent(cc.Widget);
                    if(widget){
                       widget.left=offset>56?56:offset;
                        widget.right=offset>56?56:offset;
                    }
                }
                bg.scale =realwidth/size;
            }else{
                 cvs.fitHeight = false;
                cvs.fitWidth = true;
            }
            
            console.log("width:"+width+"height:"+height+" bgwidth:"+bg.width+" bgheight:"+bg.height+" x:"+bg.x+" y:"+bg.y);
            //console.log()
        }
        //loading 背景图
        else if(cc.fy.sceneMgr.isLoadingScene()){
            let size=1366/768;
            var bg =cc.find("Canvas/mainBg");
            if(realwidth>size){
                cvs.fitHeight = true;
                cvs.fitWidth = false;
                bg.scale =realwidth/size;
            }else{
                cvs.fitHeight = false;
                cvs.fitWidth = true; 
            }
        }else if(cc.fy.sceneMgr.isDDZGameScene() || cc.fy.sceneMgr.isGDGameScene()){
            let size=1136/640;
            if(realwidth>size){
                cvs.fitHeight = true;
                cvs.fitWidth = false;
            }else{
                cvs.fitHeight = false;
                cvs.fitWidth = true; 
            }
        }
        else{
            let size=1366/768;
            if(realwidth>size){
                 cvs.fitHeight = true;
                cvs.fitWidth = false;
            }else{
                 cvs.fitHeight = false;
                cvs.fitWidth = true;
            }
        }
        
        

        // var isIphoneX = false;
        // cc.fy.isFitWidth = false;
        // if (cc.sys.os == cc.sys.OS_IOS) {
        //     if (realwidth <= 1.44) {
        //         cvs.fitHeight = false;
        //         cvs.fitWidth = true;

        //     }
        //     //iPhone X流黑边
        //     if (cc.fy.sceneMgr && cc.fy.sceneMgr.isGameScene()) {
        //         isIphoneX = (width == 2436 && height == 1125) || (width == 1125 && height == 2436);
        //         if (isIphoneX) {
        //             cvs.fitHeight = true;
        //             cvs.fitWidth = true;
        //         }

        //     }
        // }
        // else/* if(cc.sys.os == cc.sys.OS_ANDROID)*/ {
        //     if (realwidth <= 1.67) {
        //         cvs.fitHeight = false;
        //         cvs.fitWidth = true;
        //     }
        // }
        // if (realwidth > 1.8 && !isIphoneX) {
        //     cc.fy.isFitWidth = true;
        // }
    }
});