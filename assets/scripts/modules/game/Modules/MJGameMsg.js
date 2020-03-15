var GameMsgDef = require("GameMsgDef");
var ConstsDef = require('ConstsDef');

cc.Class({
    extends: require("BaseModuleMsg"),

    properties: {
        ///////////////////////
        resPanelUrl: "prefabs/mjgame/gameMain", // 预制体路径
        msgIdShowView: GameMsgDef.ID_SHOWGAMEVIEW_CTC, // 显示ID
        isPreload: true, // 是否需要预加载，备注:常用组件需要预加载加快显示
        limitScene: ConstsDef.SCENE_NAME.GAME_MJ, // 限制场景，指定模块的场景，null是不限制 如:limitScene:ConstsDef.SCENE_NAME.GAME 游戏场景模块
        ///////////////////////

    },

    // 初始化数据函数
    init: function () {
    },

    // 消息分发函数
    messageDispatch: function (msg) {
        switch (msg.msgId) {
            case GameMsgDef.ID_LOADSCENEFINISH:
                if (cc.fy.sceneMgr.isMJGameScene()) {
                    cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWGAMEVIEW_CTC);
                }
                break;
        }
    },
});