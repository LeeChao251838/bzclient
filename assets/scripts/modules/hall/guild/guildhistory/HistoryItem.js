cc.Class({
    extends: require('Item'),

    properties: {
        labTime: cc.Label,
        labRoom: cc.Label,
        labRound: cc.Label,
    },

    updateItem: function (index, data) {
        this._super(index, data);
        let date = new Date(data.time * 1000);
        let dateStr = cc.fy.utils.timeToString(date, "yyyy/MM/dd");
        let timeStr = cc.fy.utils.timeToString(date, "hh:mm");
        this.labTime.string = dateStr + '\n' + timeStr;
        this.labRoom.string = data.id;
        this.labRound.string = data.numOfGames + "/" + data.maxGame + "局";
        for (var i = 1; i < 5; i++) {
            if (i < data.seats.length + 1) {
                let s = data.seats[i - 1];
                s.score = cc.fy.utils.floatToFixed(s.score, 1, true);
                let name = cc.fy.utils.subStringCN(s.name, 8, true) + ":";

                setChildLabel(this.node, 'user' + i + 'Label', name);
                setChildLabel(this.node, 'user' + i + 'ScoreLabel', (s.score >= 0 ? ("+" + s.score) : s.score));

                let ndScore = this.node.getChildByName('user' + i + 'ScoreLabel');
                ndScore.active = true;
                ndScore.color = s.score >= 0 ? new cc.Color(255, 0, 0) : new cc.Color(0, 175, 0);
                let ndName = this.node.getChildByName('user' + i + 'Label');
                ndName.active = true;
            }
            else {
                setChildLabel(this.node, 'user' + i + 'Label', "");
                setChildLabel(this.node, 'user' + i + 'ScoreLabel', "");
            }

        }
        let btn = this.node.getChildByName('btnReplay');
        if (btn) {
            btn.idx = index;
        }

        function setChildLabel(node, name, str) {
            node.getChildByName(name).getComponent(cc.Label).string = str;
        }
    },
});
