cc.VERSION = 20200120;
cc.CHANNELID = "1";
cc.FREEVERSION = false;
cc.GAMEID = 2;                             // 苏州麻将
cc.HOTVERSION = 201804252216;               // 热更新版本
cc.FREECHAT = true;                         // 闲聊
cc.FREECHAT_GAMEROOM = false;               // 游戏房间内的闲聊按钮
cc.APPSTORE = false;                        // 苹果审核
cc.LOGOUTFILE = false;                      // 输出日志
cc.ROOM_PRI_KEY = "*&^%$#!!@#$";
cc.ScreenRatio = 1.9;                       // 屏幕比例


cc.SHAREWXBOOK = "https://mp.weixin.qq.com/s/muMgc6mP2eTVC7yls5N0zA";//、、、、、

// 调试其它玩家的accountid
// cc.DEBUG_ACCOUNT_ID = "wx_onbQs1aLJLaXQXvFNpHagHmLaUaA";

/*----------------------------------------------测试配置---------------------------------------------------------------------------------------*/
//*
// 测试服

// cc.URL = "http://10.224.23.63:32100"; //江汉
cc.URL = "http://tslogin.sanxiwl.cn:33101"; //安克林
//cc.URL = "http://10.224.23.58:32100"; //浦
//cc.URL ="http://139.224.213.39:32100"; //安可灵
// cc.URL = "http://139.224.213.39:32100"; //苏州外网测试服
cc.REALNAMEURL = "http://106.15.64.139:32101";
//web域名
cc.WEBURL = "http://hatest.d51v.com/";
// 分享房间邀请链接 测试
// cc.InviteLink = "http://hatest.d51v.com/activity/share/linkme?gameid=" + cc.GAMEID + "&link=" + "smq" + "://mylink?";
// // 网页活动 测试
// cc.WEBAPIURL = "http://hatest.d51v.com/api/game";
// // 用户行为记录 测试
// cc.ACTIONAPIURL = "http://hatest.d51v.com/api";
// //转换URL
// cc.CHANGEURL = "http://hatest.d51v.com/api/tools";//...
// // 分享链接 测试
// cc.shareURL = "http://hatest.d51v.com/activity/share/combat_winlose?";
// cc.SHAREWEBURL = "http://hatest.d51v.com/activity/share/combat_winlose?room_id={0}&uuid={1}";//....
// // 第三方商城 测试
// cc.WebShopUrl = "http://hatest.d51v.com/activity/share/info?user_id={0}&room_id={1}";
// 开启切换为服务器返回IP
cc.CHANGEIP = false;
// 游戏内的做牌按钮
cc.DEBUGBTN = true;
//*
/*---------------------------------------------------------------------------------------------------------------------------------------------*/

/*--------------------------------------------线上正式配置-------------------------------------------------------------------------------------*/
/*
// 正式服
cc.URL = "http://fygame.hy51v.com:32100";

cc.REALNAMEURL = "http://fygame.hy51v.com:32101";//...

//web域名
cc.WEBURL="http://ha.bozhouyouxi.cn/";
// 分享房间邀请链接 线上正式
// cc.InviteLink = "http://ha.fengyunyouxi.cn/activity/share/linkme?gameid=" + cc.GAMEID + "&link=" + "smq" + "://mylink?";
// // 网页活动 线上正式
// cc.WEBAPIURL = "http://ha.51v.cn/api/game";
// // 用户行为记录 线上正式
// cc.ACTIONAPIURL = "http://ha.51v.cn/api";
// //转换URL
// cc.CHANGEURL = "http://ha.fengyunyouxi.cn/api/tools";//...
// // 分享链接 线上正式
// cc.shareURL = "http://ha.fengyunyouxi.cn/activity/share/combat_winlose?";
// cc.SHAREWEBURL = "http://ha.fengyunyouxi.cn/activity/share/combat_winlose?room_id={0}&uuid={1}";//...
// // 第三方商城 线上正式
// cc.WebShopUrl = "http://ha.fengyunyouxi.cn/activity/share/info?user_id={0}&room_id={1}";
// 开启切换为服务器返回IP
cc.CHANGEIP = true;
// 游戏内的做牌按钮
cc.DEBUGBTN = false;
//*/
/*--------------------------------------------------------------------------------------------------------------------------------------------*/
// 分享房间邀请链接 测试
cc.InviteLink = cc.WEBURL + "activity/share/linkme?gameid=" + cc.GAMEID + "&link=" + "smq" + "://mylink?";
// 网页活动 测试
cc.WEBAPIURL = cc.WEBURL + "api";
// 用户行为记录 测试
cc.ACTIONAPIURL = cc.WEBURL + "api";
//转换URL
cc.CHANGEURL = cc.WEBURL + "api/tools";
// 分享链接 测试
cc.shareURL = cc.WEBURL + "activity/share/combat_winlose?";
cc.SHAREWEBURL = cc.WEBURL + "activity/share/combat_winlose?room_id={0}&uuid={1}";
// 第三方商城 测试
cc.WebShopUrl = cc.WEBURL + "activity/share/info?user_id={0}&room_id={1}";