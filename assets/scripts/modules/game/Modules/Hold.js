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
        _mjid: -1,// 牌id
        _createType: -1, // 牌的创建类型
        _side: '',// 方向
        _effect: '',// 作用 
        _index: 0,
    },

    // use this for initialization
    onLoad: function () {

    },

    // 切换牌的配置纹理 自动化配置
    changeConfigTexture: function () {
        if (this._createType == 1) {// 牌面
            // jnmvnipdaj 新牌替换
            if (this._mjid != -1 && this.node != null && this.node.parent != null)
                cc.fy.mahjongmgr.createMahjongNode(this._side, this._mjid, this.node.parent);
            else
                this.destroy();
        } else if (this._createType == 2) {// 牌背
            // jnmvnipdaj 替换
            cc.fy.mahjongmgr.createBackMahjongNode(this._side, this.node);
        } else if (this._createType == 3) {
            cc.fy.mahjongmgr.getNewEmptySpriteFrame(this._side, this.node);
        }
    },

    // 初始化牌型,如果是-1 则连图都初始化
    setMJid: function (val) {
        if (this._mjid == -1) return;

        console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
        this._mjid == val;

        if (this._createType == 1) { // 牌面
            this.node.parent.mjId = val;
            if (val == -1) {
                this.node.parent.getComponent(cc.Sprite).spriteFrame = null;
                var mjnode = this.node.parent.getChildByName("mjnode");
                if (mjnode) {
                    mjnode.getChildByName('back').getComponent(cc.Sprite).spriteFrame = null;
                    mjnode.getChildByName('front').getComponent(cc.Sprite).spriteFrame = null;
                }
            }
        } else if (this._createType == 2) { // 牌背
            this.node.mjId = val;
            if (val == -1) {
                this.node.getComponent(cc.Sprite).spriteFrame = null;
            }
        } else if (this._createType == 3) {
            this.node.mjId = val;
            if (val == -1) {
                this.node.getComponent(cc.Sprite).spriteFrame = null;
            }
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
