var GameModules = module.exports;

GameModules.init = function () {
    // 各模块消息监听
    // 加入房间
    var JoinGameMsg = require("JoinGameMsg");
    cc.fy.joinGameMsg = new JoinGameMsg();

    

    // 招募
    var ZhaoMuMsg = require("ZhaoMuMsg");
    cc.fy.zhaoMuMsg = new ZhaoMuMsg();
    // 规则
    var HelpMsg = require("HelpMsg");
    cc.fy.helpMsg = new HelpMsg();

    // 个人信息
    var UserInfoMsg = require("UserInfoMsg");
    cc.fy.userInfoMsg = new UserInfoMsg();

    // 战绩
    var HistoryMsg = require("HistoryMsg");
    cc.fy.historyMsg = new HistoryMsg();

    //新战绩
    var ZhanjiMsg = require("ZhanjiMsg");
    cc.fy.zhanjiMsg = new ZhanjiMsg();

  
    //关于
    var AboutMsg = require("AboutMsg");
    cc.fy.aboutMsg = new AboutMsg();
    // 绑定
    var WelfareMsg = require("WelfareMsg");
    cc.fy.welfareMsg = new WelfareMsg();
    // 客服
    var KefuMsg = require("KefuMsg");
    cc.fy.kefuMsg = new KefuMsg();
    // 新商城
    var HallShopMsg = require("HallShopMsg");
    cc.fy.hallShopMsg = new HallShopMsg();
    // 实名
    var RealnameMsg = require("RealnameMsg");
    cc.fy.realnameMsg = new RealnameMsg();
    // 输入分享码
    var HistoryCodeMsg = require("HistoryCodeMsg");
    cc.fy.historyCodeMsg = new HistoryCodeMsg();

    // // 分享
    var ShareMsg = require("ShareMsg");
    cc.fy.shareMsg = new ShareMsg();
    //大厅设置
    var HallSettingMsg = require("HallSettingMsg");
    cc.fy.hallSettingMsg = new HallSettingMsg();


    // 游戏邀请圈成员
    var canInvListMsg = require("canInvListMsg");
    cc.fy.canInvListMsg = new canInvListMsg();




    // 公告
    var PopNoticeMsg = require("PopNoticeMsg");
    cc.fy.popNoticeMsg = new PopNoticeMsg();

    // 商城
    // var ShopMsg = require("ShopMsg");
    // cc.fy.shopMsg = new ShopMsg();


    // web活动
    var WebActivityMsg = require("WebActivityMsg");
    cc.fy.webActivityMsg = new WebActivityMsg();

    // 
    var WebviewBoxMsg = require("WebviewBoxMsg");
    cc.fy.webviewBoxMsg = new WebviewBoxMsg();


    // 房间内模块
    var GameMsg = require("GameMsg");
    cc.fy.gameMsg = new GameMsg();
    // 麻将main
    var MJGameMsg = require("MJGameMsg");
    cc.fy.mjGameMsg = new MJGameMsg();
    // 小结算
    // var GameOverMsg_YZ = require("GameOverMsg_YZ");
    // cc.fy.gameOverMsg_YZ = new GameOverMsg_YZ();
    // var GameOverMsg_JD = require("GameOverMsg_JD");
    // cc.fy.gameOverMsg_JD = new GameOverMsg_JD();

    // var GameOverMsg_LS = require("GameOverMsg_LS");
    // cc.fy.gameOverMsg_LS = new GameOverMsg_LS();

    // var GameOverMsg_CC = require("GameOverMsg_CC");
    // cc.fy.gameOverMsg_CC = new GameOverMsg_CC();

    // var GameOverMsg_CZ = require("GameOverMsg_CZ");
    // cc.fy.gameOverMsg_CZ = new GameOverMsg_CZ();

    // var GameOverMsg_HA = require("GameOverMsg_HA");
    // cc.fy.gameOverMsg_HA = new GameOverMsg_HA();

    // var GameOverMsg_HZE = require("GameOverMsg_HZE");
    // cc.fy.gameOverMsg_HZE = new GameOverMsg_HZE();

    // var GameOverMsg_HZ = require("GameOverMsg_HZ");
    // cc.fy.gameOverMsg_HZ = new GameOverMsg_HZ();

    // var GameOverMsg_TTZ = require("GameOverMsg_TTZ");
    // cc.fy.gameOverMsg_TTZ = new GameOverMsg_TTZ();

    // var ZhuapaiMsg = require("ZhuapaiMsg");
    // cc.fy.zhuapaiMsg = new ZhuapaiMsg();

    // 总结算
    // var GameResultMsg = require("GameResultMsg_MJ");
    // cc.fy.gameResultMsg = new GameResultMsg();

    // 跑得快模块
    var PDKGameMsg = require("PDKGameMsg");
    cc.fy.pdkGameMsg = new PDKGameMsg();

    var PDKChangeSkinMsg = require("PDKChangeSkinMsg");
    cc.fy.PDKChangeSkinMsg = new PDKChangeSkinMsg();
    // 设置
    var GameSettingMsg_PDK = require("GameSettingMsg_PDK");
    cc.fy.gameSettingMsg_PDK = new GameSettingMsg_PDK();
    // 总结算
    var GameResultMsg_PDK = require("GameResultMsg_PDK");
    cc.fy.gameResultMsg_PDK = new GameResultMsg_PDK();
    // 小结算
    var GameOverMsg_PDK = require("GameOverMsg_PDK");
    cc.fy.gameOverMsg_PDK = new GameOverMsg_PDK();

    // 跑得快组件管理
    var PDKGameMgr = require("PDKGameMgr");
    cc.fy.PDKGameMgr = new PDKGameMgr();
    cc.fy.PDKGameMgr.init();

    // // 斗地主模块
    // var DDZGameMsg = require("DDZGameMsg");
    // cc.fy.ddzGameMsg = new DDZGameMsg();
    // // 设置
    // var GameSettingMsg_DDZ = require("GameSettingMsg_DDZ");
    // cc.fy.gameSettingMsg_DDZ = new GameSettingMsg_DDZ();
    // // 总结算
    // var GameResultMsg_DDZ = require("GameResultMsg_DDZ");
    // cc.fy.gameResultMsg_DDZ = new GameResultMsg_DDZ();
    // // 小结算
    // var GameOverMsg_DDZ = require("GameOverMsg_DDZ");
    // cc.fy.gameOverMsg_DDZ = new GameOverMsg_DDZ();
    // // 斗地主组件管理
    // var DDZGameMgr = require("DDZGameMgr");
    // cc.fy.DDZGameMgr = new DDZGameMgr();

    // // 模块管理
    // var GameSettingMsg_GD = require("GameSettingMsg_GD");
    // cc.fy.gameSettingMsg_GD = new GameSettingMsg_GD();

    // 聊天
    // var ChatMsg = require("ChatMsg");
    // cc.fy.chatMsg = new ChatMsg();
    // 解散房间
    var DissolveMsg = require("DissolveMsg");
    cc.fy.dissolveMsg = new DissolveMsg();
    // // 游戏设置
    // var GameSettingMsg = require("GameSettingMsg");
    // cc.fy.gameSettingMsg = new GameSettingMsg();

    // 游戏mj设置
    var SettingMsg = require("SettingMsg");
    cc.fy.SettingMsg = new SettingMsg();

    // 麻将通用大结算
    // var gameResultMsg = require("gameResultMsg");
    // cc.fy.gameResultMsgNew = new gameResultMsg();

    var gameGuizeMsg = require("gameGuizeMsg");
    cc.fy.gameGuizeMsg = new gameGuizeMsg();
    //表情包，快捷语
    var ChatBagMsg = require("ChatBagMsg");
    cc.fy.chatBagMsg = new ChatBagMsg();
    // 语音
    var VoiceMsg = require("VoiceMsg");
    cc.fy.voiceMsg = new VoiceMsg();
    // 番数
    var HelpFanshuMsg = require("HelpFanshuMsg");
    cc.fy.helpFanshuMsg = new HelpFanshuMsg();


    // 玩法显示
    var WanfaWinMsg = require("WanfaWinMsg");
    cc.fy.wanfaWinMsg = new WanfaWinMsg();
    // 玩家信息显示
    var SeatInfoMsg = require("UserInfoGameMsg");
    cc.fy.seatInfoMsg = new SeatInfoMsg();

    // 玩家信息显示
    // var UserInfoMsg = require("UserInfoGameMsg");
    // cc.fy.userInfoMsg = new UserInfoMsg();
    // 玩家信息扔鸡蛋动画
    var UsePropMsg = require("UsePropMsg");
    cc.fy.usePropMsg = new UsePropMsg();
    // 玩家位置显示
    var GpsAlertMsg = require("GpsAlertMsg");
    cc.fy.gpsAlertMsg = new GpsAlertMsg();


    // 俱乐部
    // 俱乐部主界面
    // var GuildMsg = require("GuildMsg");
    // cc.fy.guildMsg = new GuildMsg();
    var GuildMainMsg = require("GuildMainMsg");
    cc.fy.guildMainMsg = new GuildMainMsg();
    // 加入俱乐部
    var JoinGuildMsg = require("CreateJoinGuildMsg");
    cc.fy.joinGuildMsg = new JoinGuildMsg();
    // 俱乐部邀请
    var GuildGameInvMsg = require("GuildGameInvMsg");
    cc.fy.guildGameInvMsg = new GuildGameInvMsg();
    // 俱乐部设置
    var GuildSettingMsg = require("GuildSettingMsg");
    cc.fy.guildSettingMsg = new GuildSettingMsg();
    // 俱乐部房间预设
    // var PreRoomMsg = require("PreRoomMsg");
    // cc.fy.preRoomMsg = new PreRoomMsg();
    // 俱乐部统计
    var GuildTongjiMsg = require("GuildTongjiMsg");
    cc.fy.guildTongjiMsg = new GuildTongjiMsg();
    //圈子桌子规则（包含解散）
    var GuildDeskRuleMsg = require("GuildDeskRuleMsg");
    cc.fy.guildDeskRuleMsg = new GuildDeskRuleMsg();
    //圈子记录
    var GuildRecordMsg = require("GuildRecordMsg");
    cc.fy.guildRecordMsg = new GuildRecordMsg();
    //圈子成员列表和审核
    var GuildMemberMsg = require("GuildMemberMsg");
    cc.fy.guildMemberMsg = new GuildMemberMsg();
    //圈子公告
    var GuildGonggaoMsg = require("GuildGonggaoMsg");
    cc.fy.guildGonggaoMsg = new GuildGonggaoMsg();
    //二次确认
    var ConfirmSecondMsg = require("ConfirmSecondMsg");
    cc.fy.confirmSecondMsg = new ConfirmSecondMsg();



    // 创建房间
    var CreateRoomMsg = require("CreateRoomMsg");
    cc.fy.createRoomMsg = new CreateRoomMsg();
    
};