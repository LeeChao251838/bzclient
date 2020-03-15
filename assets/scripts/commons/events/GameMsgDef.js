var GameMsgDef = module.exports;

GameMsgDef.MSGID = 'message';

var gameMsgStruct = {};

GameMsgDef.ID_LOADSCENEFINISH = 99; // 进入场景成功
gameMsgStruct[GameMsgDef.ID_LOADSCENEFINISH] = function(){
	this.msgId = GameMsgDef.ID_LOADSCENEFINISH;
	this.scene = '';
};

GameMsgDef.ID_LOGIN_RESULT = 'login_result'; // 登录成功
GameMsgDef.ID_GAME_OVER_PUSH = 'game_over_push'; // 游戏结束
GameMsgDef.ID_GET_CLUB_NAME_RESULT = 'get_club_name_result'; // 俱乐部名
GameMsgDef.ID_DISSOLVE_NOTICE_PUSH = 'dissolve_notice_push'; // 解散房间
GameMsgDef.ID_DISSOLVE_CANCEL_PUSH = 'dissolve_cancel_push'; // 取消解散房间
GameMsgDef.ID_DISSOLVE_FINISH_PUSH = 'dissolve_finish_push'; // 解散房间结束成功


GameMsgDef.ID_PDK_STC_GAMEOVER = 'pdk_stc_gameover'; // 跑得快游戏结束
GameMsgDef.ID_DDZ_STC_GAMEOVER = 'ddz_stc_gameover'; // 斗地主游戏结束
GameMsgDef.ID_GD_STC_GAMEOVER  = 'gd_stc_gameover';  // 掼蛋游戏结束

GameMsgDef.ID_BE_INVITED_TO_PLAY = 'be_invited_to_play'; // 俱乐部邀请游戏

GameMsgDef.ID_SHOWGAMEVIEW_MJPEIZHI_CTC				= 'ID_SHOWGAMEVIEW_MJPEIZHI_CTC';			// 麻将游戏 游戏配置界面{isShow}

/////////////////////////////////////////////////////////////////
// 这里定义客户端消息 
/////////////////////////////////////////////////////////////////
//webview盒子

GameMsgDef.ID_SHOWWEBVIEWBOXVIEW_CTC				= 'ID_SHOWWEBVIEWBOXVIEW_CTC';			// {isShow,url}
//游戏内邀请群成员
GameMsgDef.ID_SHOWKCANINVLISTVIEW_CTC				= 'ID_SHOWKCANINVLISTVIEW_CTC';			// {isShow,url}




GameMsgDef.ID_SHOWJOINGAMEVIEW_CTC				= 'ID_SHOWJOINGAMEVIEW_CTC';			// 加入房间界面{isShow}
GameMsgDef.ID_SHOWCREATEROOMVIEW_CTC			= 'ID_SHOWCREATEROOMVIEW_CTC';			// 创建房间{isShow}
GameMsgDef.ID_SHOWZHAOMUVIEW_CTC				= 'ID_SHOWZHAOMUVIEW_CTC';				// 招募{isShow}
GameMsgDef.ID_SHOWHELPVIEW_CTC					= 'ID_SHOWHELPVIEW_CTC';				// 规则{isShow}
GameMsgDef.ID_SHOWUSERINFOVIEW_CTC				= 'ID_SHOWUSERINFOVIEW_CTC';			// 个人信息{isShow, userData}
GameMsgDef.ID_REFRESHGEO_CTC					= 'ID_REFRESHGEO_CTC';                 	// 刷新地理位置信息{geoData}
GameMsgDef.ID_SHOWHISTORYVIEW_CTC				= 'ID_SHOWHISTORYVIEW_CTC';				// 战绩{isShow}
//新战绩
GameMsgDef.ID_SHOWZHANJIVIEW_CTC				= 'ID_SHOWZHANJIVIEW_CTC';				// 战绩{isShow}

//关于
GameMsgDef.ID_SHOWABOUTVIEW_CTC				= 'ID_SHOWABOUTVIEW_CTC';				// 关于{isShow}
//新商店
GameMsgDef.ID_SHOWHALLSHOPVIEW_CTC				= 'ID_SHOWHALLSHOPVIEW_CTC';				// 商店{isShow}
GameMsgDef.ID_SHOWWELFAREVIEW_CTC				= 'ID_SHOWWELFAREVIEW_CTC';				// 绑定{isShow}

 GameMsgDef.ID_SHOWSHAREVIEW_CTC					= 'ID_SHOWSHAREVIEW_CTC';				// 分享{isShow}
GameMsgDef.ID_SHOWHALLSETTINGVIEW_CTC			= 'ID_SHOWHALLSETTINGVIEW_CTC';			// 设置{isShow}
GameMsgDef.ID_SHOWSHOPVIEW_CTC					= 'ID_SHOWSHOPVIEW_CTC';				// 商城{isShow}
GameMsgDef.ID_SHOWPOPNOTICEVIEW_CTC				= 'ID_SHOWPOPNOTICEVIEW_CTC';			// 公告{isShow}
GameMsgDef.ID_SHOWACTIVITYVIEW_CTC				= 'ID_SHOWACTIVITYVIEW_CTC';			// 活动{isShow}
GameMsgDef.ID_SHOWREALNAMEVIEW_CTC				= 'ID_SHOWREALNAMEVIEW_CTC';			// 实名{isShow}

GameMsgDef.ID_SHOWFCMVIEW_CTC					= 'ID_SHOWFCMVIEW_CTC';					// 防沉迷{isShow}
GameMsgDef.ID_SHOWHISTORYCODEVIEW_CTC			= 'ID_SHOWHISTORYCODEVIEW_CTC';        	// 输入分享码{isShow}
GameMsgDef.ID_REFRESHQRCODE_CTC					= 'ID_REFRESHQRCODE_CTC';				// 刷新二维码

GameMsgDef.ID_GETBASEINFO_CTC				 	= 'ID_GETBASEINFO_CTC';					// 获取基本信息				
GameMsgDef.ID_SHOWKEFUVIEW_CTC					= 'ID_SHOWKEFUVIEW_CTC';				// 客服{isShow}
GameMsgDef.ID_BUYCALLBACK_CTC					= 'ID_BUYCALLBACK_CTC';					// 内购回调{code}
GameMsgDef.ID_GETWEBACTIVITYURL_CTC				= 'ID_GETWEBACTIVITYURL_CTC';			// web活动数据

GameMsgDef.ID_SHOWGAMEVIEW_CTC					= 'ID_SHOWGAMEVIEW_CTC';   				// 游戏界面{isShow}
GameMsgDef.ID_SHOWGAMERESULTVIEW_CTC			= 'ID_SHOWGAMERESULTVIEW_CTC';   		// 总结算界面{isShow}
GameMsgDef.ID_SHOWGAMEOVERVIEW_YZ_CTC			= 'ID_SHOWGAMEOVERVIEW_YZ_CTC';  		// 小结算界面{isShow}
GameMsgDef.ID_SHOWGAMEOVERVIEW_JD_CTC			= 'ID_SHOWGAMEOVERVIEW_JD_CTC';  		// 小结算界面{isShow}
GameMsgDef.ID_SHOWGAMEOVERVIEW_LS_CTC			= 'ID_SHOWGAMEOVERVIEW_LS_CTC';			// 小结算界面{isShow}
GameMsgDef.ID_SHOWGAMEOVERVIEW_HZ_CTC			= 'ID_SHOWGAMEOVERVIEW_HZ_CTC';			// 小结算界面{isShow}
GameMsgDef.ID_SHOWGAMEOVERVIEW_HZE_CTC			= 'ID_SHOWGAMEOVERVIEW_HZE_CTC';		// 小结算界面{isShow}
GameMsgDef.ID_SHOWGAMEOVERVIEW_CC_CTC			= 'ID_SHOWGAMEOVERVIEW_CC_CTC';			// 小结算界面{isShow}
GameMsgDef.ID_SHOWGAMEOVERVIEW_CZ_CTC			= 'ID_SHOWGAMEOVERVIEW_CZ_CTC';			// 小结算界面{isShow}
GameMsgDef.ID_SHOWGAMEOVERVIEW_HA_CTC			= 'ID_SHOWGAMEOVERVIEW_HA_CTC';			// 小结算界面{isShow}
GameMsgDef.ID_SHOWGAMEOVERVIEW_TTZ_CTC			= 'ID_SHOWGAMEOVERVIEW_TTZ_CTC';		// 小结算界面{isShow}
GameMsgDef.ID_SHOWZHUAPAIVIEW_CTC				= 'ID_SHOWZHUAPAIVIEW_CTC';				// 抓牌{isShow}
//GameMsgDef.ID_SHOWCHATVIEW_CTC					= 'ID_SHOWCHATVIEW_CTC';  		  		// 聊天界面{isShow}
GameMsgDef.ID_SHOWWANFAWINVIEW_CTC				= 'ID_SHOWWANFAWINVIEW_CTC';			// 玩法显示界面{isShow}
GameMsgDef.ID_SHOWDISSOLVEVIEW_CTC				= 'ID_SHOWDISSOLVEVIEW_CTC';			// 申请解散界面{isShow}
//GameMsgDef.ID_SHOWGAMESETTINGVIEW_CTC			= 'ID_SHOWGAMESETTINGVIEW_CTC';			// 游戏内的设置面板{isShow}
GameMsgDef.ID_SHOWVOICEVIEW_CTC					= 'ID_SHOWVOICEVIEW_CTC';				// 语音界面
GameMsgDef.ID_SHOWVOICEFAILEDVIEW_CTC			= 'ID_SHOWVOICEFAILEDVIEW_CTC';			// 语音界面错误信息


GameMsgDef.ID_SHOWSEATINFOVIEW_CTC				= 'ID_SHOWSEATINFOVIEW_CTC';			// 房间seat玩家信息

//设置
GameMsgDef.ID_SHOWMJGAMESETTINGVIEW_CTC			= 'ID_SHOWMJGAMESETTINGVIEW_CTC';		//设置面板{isShow}

GameMsgDef.ID_SHOWMJGAMEOVERVIEW_CTC			= 'ID_SHOWMJGAMEOVERVIEW_CTC';			//所有麻将通用大结算{isShow}
GameMsgDef.ID_SHOWMJGAMEOVERVIEW_SEL_CTC		= 'ID_SHOWMJGAMEOVERVIEW_SEL_CTC';	    //所有麻将通用小结算{isShow}

GameMsgDef.ID_SHOWGPSALERTVIEW_CTC= 'ID_SHOWGPSALERTVIEW_CTC';			//玩家定位距离弹窗
GameMsgDef.ID_SHOWUSEPROPVIEW_CTC= 'ID_SHOWUSEPROPVIEW_CTC';			//玩家扔鸡蛋动画弹窗
GameMsgDef.ID_SHOWCHATBAGVIEW_CTC               = 'ID_SHOWCHATBAGVIEW_CTC';			//发送表情
GameMsgDef.ID_SHOWCHANGESKIN_CTC                = 'ID_SHOWCHANGESKIN_CTC';              // 换皮肤，跑得快界面
GameMsgDef.ID_SHOWGAMEVIEW_PDK_CTC				= 'ID_SHOWGAMEVIEW_PDK_CTC';			// 跑得快界面{isShow}
GameMsgDef.ID_SHOWGAMERESULTVIEW_PDK_CTC		= 'ID_SHOWGAMERESULTVIEW_PDK_CTC';		// 跑得快总结算界面{isShow}
GameMsgDef.ID_SHOWGAMEOVERVIEW_PDK_CTC			= 'ID_SHOWGAMEOVERVIEW_PDK_CTC';		// 跑得快小结算界面{isShow}
GameMsgDef.ID_SHOWGAMESETTINGPDKVIEW_CTC		= 'ID_SHOWGAMESETTINGPDKVIEW_CTC';		// 跑得快设置{isShow}
			// 牌友圈俱乐部界面{isShow}
GameMsgDef.ID_SHOWGUILDMAINVIEW_CTC				= 'ID_SHOWGUILDMAINVIEW_CTC';		//改版后牌友圈俱乐部界面{isShow}

GameMsgDef.ID_SHOWGUILDTONGJIVIEW_CTC			= 'ID_SHOWGUILDTONGJIVIEW_CTC';			//  圈子统计界面{isShow}
GameMsgDef.ID_SHOWGUILDDESKRULEVIEW_CTC			= 'ID_SHOWGUILDDESKRULEVIEW_CTC';			//  圈子桌子规则解散
GameMsgDef.ID_SHOWGUILDRECORDVIEW_CTC			= 'ID_SHOWGUILDRECORDVIEW_CTC';			// 圈子记录弹窗
GameMsgDef.ID_SHOWGUILDMEMBERVIEW_CTC			= 'ID_SHOWGUILDMEMBERVIEW_CTC';	//圈子成员列表和审核
GameMsgDef.ID_SHOWCONFIRMSECONDVIEW_CTC			= 'ID_SHOWCONFIRMSECONDVIEW_CTC';	//二次确认
GameMsgDef.ID_SHOWGUILDGONGGAOVIEW_CTC			= 'ID_SHOWGUILDGONGGAOVIEW_CTC';		// 圈子公告{isShow}

GameMsgDef.ID_SHOWJOINGUILDVIEW_CTC				= 'ID_SHOWJOINGUILDVIEW_CTC';			// 加入俱乐部界面{isShow}
GameMsgDef.ID_SHOWGUILDGAMEINVALERTVIEW_CTC			= 'ID_SHOWGUILDGAMEINVALERTVIEW_CTC';		// 邀请游戏俱乐部界面{isShow}
GameMsgDef.ID_SHOWGUILDSETTINGVIEW_CTC			= 'ID_SHOWGUILDSETTINGVIEW_CTC';		// 俱乐部设置界面{isShow}
// GameMsgDef.ID_SHOWGUILDAPPLYLISTVIEW_CTC		= 'ID_SHOWGUILDAPPLYLISTVIEW_CTC';		// 俱乐部申请加入列表界面{isShow}
GameMsgDef.ID_SHOWGUILDPREROOMVIEW_CTC			= 'ID_SHOWGUILDPREROOMVIEW_CTC';		// 俱乐部房间预设界面{isShow}
// GameMsgDef.ID_SHOWGUILDTONGJIVIEW_CTC			= 'ID_SHOWGUILDTONGJIVIEW_CTC';			// 俱乐部统计界面{isShow}



GameMsgDef.ID_SHOWGAMEVIEW_DDZ_CTC				= 'ID_SHOWGAMEVIEW_DDZ_CTC';			// 斗地主界面{isShow}
GameMsgDef.ID_SHOWGAMERESULTVIEW_DDZ_CTC		= 'ID_SHOWGAMERESULTVIEW_DDZ_CTC';		// 斗地主总结算界面{isShow}
GameMsgDef.ID_SHOWGAMEOVERVIEW_DDZ_CTC			= 'ID_SHOWGAMEOVERVIEW_DDZ_CTC';		// 斗地主小结算界面{isShow}
GameMsgDef.ID_SHOWGAMESETTINGDDZVIEW_CTC		= 'ID_SHOWGAMESETTINGDDZVIEW_CTC';		// 斗地主设置{isShow}

GameMsgDef.ID_SHOWGAMEVIEW_GD_CTC				= 'ID_SHOWGAMEVIEW_GD_CTC';			// 掼蛋界面{isShow}
GameMsgDef.ID_SHOWGAMERESULTVIEW_GD_CTC			= 'ID_SHOWGAMERESULTVIEW_GD_CTC';	// 掼蛋总结算界面{isShow}
GameMsgDef.ID_SHOWGAMEOVERVIEW_GD_CTC			= 'ID_SHOWGAMEOVERVIEW_GD_CTC';		// 掼蛋小结算界面{isShow}
GameMsgDef.ID_SHOWGAMESETTING_GD_VIEW_CTC		= 'ID_SHOWGAMESETTING_GD_VIEW_CTC';	// 掼蛋设置{isShow}

GameMsgDef.ID_SHOWHELPFANSHUVIEW_CTC				= 'ID_SHOWHELPFANSHUVIEW_CTC';			// 番数宝典{isShow}


/////////////////////////////////////////////////////////////////

// 根据消息id获取消息
GameMsgDef.getMsg = function(msgId){
	if(gameMsgStruct[msgId] == null){
		return {msgId:msgId};
	}
	return new gameMsgStruct[msgId]();
};

GameMsgDef.packagMsg = function(msgId, data){
	var msg = {
		msgId:msgId,
		data:data,
	};
	return msg;
};
