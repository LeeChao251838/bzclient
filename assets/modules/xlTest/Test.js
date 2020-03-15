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
    },

    // use this for initialization
    onLoad: function () {

    },

    xianLiaoShareText: function()
    {
        console.log("xianLiaoShareText");
        cc.fy.anysdkMgr.xianLiaoShareText("xianLiaoShareText");
    },

    xianLiaoShareDataImage:function()
    {
        console.log("xianLiaoShareDataImage");
        cc.fy.anysdkMgr.xianLiaoShareDataImage();
    },

    xianLiaoShareUrlImage:function()
    {
        console.log("xianLiaoShareUrlImage");
        cc.fy.anysdkMgr.xianLiaoShareUrlImage("http://cocos2d-x.org/s/upload/users.jpg")
    },

    xianLiaoShareGame:function()
    {
        //roomid,roomtoken,title,text,url
        cc.fy.anysdkMgr.xianLiaoShareGame("111","222","title3","text4","http://www.baidu.com");
    },

    xianLiaoLogin:function()
    {
        cc.fy.anysdkMgr.xianLiaoLogin();
    },

    isXianliaoInstalled:function()
    {
        cc.fy.anysdkMgr.isXianliaoInstalled();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
