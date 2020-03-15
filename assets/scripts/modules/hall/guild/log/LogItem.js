cc.Class({
    extends: require('Item'),

    properties: {
        labInfo:cc.Label,
        labTime:cc.Label,
    },

    updateItem:function(index, data){
        this._super(index, data);
        var levelstr = "玩家";
        switch(data.level){
            case 0:
                levelstr = "成员";
                break;
            case 1:
                levelstr = "会长";
                break;
            case 2:
                levelstr = "管理员";
                break;
        }

        var eventStr = levelstr;
        if((data.level >= 1 )&& data.action == 9){
            eventStr += "同意";
        }
        if(data.userName){
            eventStr += "[" + data.userName + "]";
        }
        eventStr += this.getActionStr(data.action);
        if(data.operedUserName){
            eventStr += "[" + data.operedUserName + "]";
        }
        this.labInfo.string = eventStr;
        this.labTime.string = cc.fy.utils.timetrans(data.time);
    },

    getActionStr(type){
        if (type == 0) {
            return "创建牌友圈";
        }
        else if (type == 1) {
            return "创建房间";
        }
        else if (type == 2) {
            return "删除房间";
        }
        else if (type == 3) {
            return "申请加入";
        }
        else if (type == 4) {
            return "接收成员";
        }
        else if (type == 5) {
            return "拒绝成员";
        }
        else if (type == 6) {
            return "开除成员";
        }
        else if (type == 7) {
            return "升职成员";
        }
        else if (type == 8) {
            return "降职成员";
        }
        else if (type == 9) {
            return "申请退出牌友圈";
        }
    },
});