cc.Class({
    extends: cc.Component,
    properties: {
    },
    onLoad: function () {
        let width = cc.view.getFrameSize().width;
        let height = cc.view.getFrameSize().height;
        var realwidth = width / height;
        var widget = this.node.getComponent(cc.Widget);
        let size = 1366 / 768;
        console.log("width:" + width + "   heigth:" + height);
        if (realwidth > size) {
            let safeWidth = (size / realwidth) * 1366;
            let offset = (1366 - safeWidth) / 2;
            console.log("safeWidth:" + safeWidth + " offset:" + offset);
            if (widget) {
                widget.left = offset > 56 ? 56 : offset;
                widget.right = offset > 56 ? 56 : offset;
            }
        }
        // var isIphoneX = false;
        // cc.fy.isFitWidth = false;
        // if (cc.sys.os == cc.sys.OS_IOS) {
        //     if (realwidth <= 1.44) {
        //         cvs.fitHeight = false;
        //         cvs.fitWidth = true;
        //     }
        //     //iPhone X浝黑边
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