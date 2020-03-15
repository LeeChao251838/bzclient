var Global = cc.Class({
    extends: cc.Component,
    statics: {
        zIndex:100,
        isstarted:false,
        netinited:false,
        userguid:0,
        nickname:"",
        money:0,
        lv:0,
        roomId:0,
        isforcenotice:true, // 强制弹公告
        isforceZhaomu:true,// 强制弹招募代理
        msgWelcome:null,
        msgActivity:null,
        activitydata:null,
        isShowTing:true,
        hasLotteryChance:false,
        // showGPSWarn:true,
        masterKillMe:false,    // 被房主踢了
        isFirst3D:true,
        fangchenmiUrl:'',//防沉迷链接
        healthnoticeUrl  :'',
        adultctrlUrl:'',
        cardFree:null,    //房卡限免活动
    },
});