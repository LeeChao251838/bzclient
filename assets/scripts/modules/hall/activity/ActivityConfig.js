// 活动配置
cc.ACTTYPE = {
    FREEGAME:0,          //免费开房
    KEEPLOGIN:1,         //连续登陆
    LX:2,                //拉新活动
};
cc.Class({
    extends: cc.Component,

    properties: {
        LXStartTime:null,
        LXEndTime:null,

    },

    //判断活动是否开启
    checkIsOpen:function(Actdata){
        var myDate = new Date()
        var timestamp = Date.parse(new Date()); 
        var nowHour =  myDate.getHours();
        //判断白名单
        if (Actdata.whitelist != null && Actdata.whitelist.indexOf(cc.fy.userMgr.userId) == -1) {
            return false;
        }
        //判断是否开启
        if (Actdata.is_open != 0) {
            return false;
        }
        //判断日期
        if (Actdata.start_time > timestamp || Actdata.end_time < timestamp) {
            return false;
        }
        if (Actdata.start_hour > nowHour || Actdata.end_hour < nowHour) {
            return false;
        }

        return true;
    },

});

