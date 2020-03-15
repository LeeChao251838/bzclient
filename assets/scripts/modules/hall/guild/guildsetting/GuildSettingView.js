var GameMsgDef = require("GameMsgDef");
cc.Class({
    extends: require("BaseModuleView"),

    properties: {

        _curClub: null,
        _clubInfo: null,

        _agreeClub: null,
        _shareText: null,
        _shareChoose: null,
        _shareHistory: 0,   // 分享
    },

    onLoad: function () {
        this.initView();
        this.initEventHandlers();
    },

    start: function () {

    },

    initEventHandlers: function () {
        var self = this;
        var game = cc.fy.gameNetMgr;

        game.addHandler(GameMsgDef.ID_SHOWGUILDSETTINGVIEW_CTC, function (data) {
            if (data && data.isShow == false) {
                self.hidePanel();
            }
            else {
                self.showPanel(data);
            }
        });
        game.addHandler('share_histroy_url_push', function (data) {
            console.log(data);
            var data = data;
            if (data.code == 0) {
                self.onSetShareChecked(data.isShare);
            } else if (data.code == -2) {
                self.onSetShareChecked(2);
            } else {
                self.onSetShareChecked(false);
            }

        });


    },

    initView: function () {
        // 作为弹框模式 不隐藏其它弹框
        this.setHideOther(false);

        let chkAgree = cc.find('panel/contentEdit/layoutBox/choose/chkAgree', this.node);
        let chkRefuse = cc.find('panel/contentEdit/layoutBox/choose/chkRefuse', this.node);
        let chkOpen = cc.find('panel/contentEdit/layoutBox/chooseShare/chkOpen', this.node);
        let chkClose = cc.find('panel/contentEdit/layoutBox/chooseShare/chkClose', this.node);

        this._chkAgree = chkAgree.getComponent(cc.Toggle);
        this._chkRefuse = chkRefuse.getComponent(cc.Toggle);
        this._chkOpen = chkOpen.getComponent(cc.Toggle);
        this._chkClose = chkClose.getComponent(cc.Toggle);

        cc.fy.utils.addClickEvent(this._chkAgree, this.node, "GuildSettingView", "onSettingChoose");
        cc.fy.utils.addClickEvent(this._chkRefuse, this.node, "GuildSettingView", "onSettingChoose");
        cc.fy.utils.addClickEvent(this._chkOpen, this.node, "GuildSettingView", "onSettingChooseLink");
        cc.fy.utils.addClickEvent(this._chkClose, this.node, "GuildSettingView", "onSettingChooseLink");
        this._shareText = cc.find('panel/contentEdit/layoutBox/quesShare', this.node);
        this._shareChoose = cc.find('panel/contentEdit/layoutBox/chooseShare', this.node);

        // chkAgree.children.forEach(item => {
        //     cc.fy.utils.addClickEvent(item.getComponent(cc.Button), this.node, "GuildSettingView", "onSettingChoose");
        // });

        // chkRefuse.children.forEach(item => {
        //     cc.fy.utils.addClickEvent(item.getComponent(cc.Button), this.node, "GuildSettingView", "onSettingChoose");
        // });



        let btnLeave = cc.find('panel/leaveBtn', this.node);
        cc.fy.utils.addClickEvent(btnLeave.getComponent(cc.Button), this.node, "GuildSettingView", "onSettingLeave");


        // let btnChangeName = this.node.getChildByName('btnChangeName');
        // cc.fy.utils.addClickEvent(btnChangeName.getComponent(cc.Button), this.node, "GuildSettingView", "onSettingChangeName");
    },

    showPanel: function (data) {
        this.node.active = true;
        this._curClub = cc.fy.guildMainMsg.getCurClub();

        this._clubInfo = this._curClub.clubInfo;
        console.log(this._curClub, this._clubInfo);
        this.initSetting();
        this.initShare();
    },

    hidePanel: function () {
        this.node.active = false;
        this._clubInfo = null;
    },
    initShare() {
        this._shareText.active = false;
        this._shareChoose.active = false;

        if (this._curClub.level == 1) {
            this._chkOpen.isChecked = false;
            this._chkClose.isChecked = true;
            var state = 1;
            cc.fy.net.send("share_histroy_url", { "clubid": this._clubInfo.clubid, "state": state, "isShare": null });
        }
    },
    initSetting() {
        console.log('initSetting');
        var club = cc.fy.guildMainMsg.getCurClub();
        var clubid = null;
        if (club) {
            clubid = club.clubInfo.clubid;
        }
        let agree = cc.fy.guildSettingMsg.isAgree(clubid);
        console.log('agree:' + agree);
        if (agree) {
            this._chkAgree.isChecked = true;
            this._chkRefuse.isChecked = false;
        } else {
            this._chkAgree.isChecked = false;
            this._chkRefuse.isChecked = true;
        }
        let btnLeave = cc.find('panel/leaveBtn', this.node);
        btnLeave.active = this._curClub.level != 1;

    },
    // 设置公会是否可分享
    onSetShareChecked: function (bCheck) {
        console.log("---> setShareCheck ", bCheck);

        if (bCheck == 2) {   // 隐藏
            this._shareText.active = false;
            this._shareChoose.active = false;
        }
        else {
            this._shareText.active = true;
            this._shareChoose.active = true;

            if (bCheck) {
                this._chkOpen.isChecked = true;
                this._chkClose.isChecked = false;
            } else {
                this._chkOpen.isChecked = false;
                this._chkClose.isChecked = true;
            }
        }
    },
    onSettingChoose(event) {
        console.log('onSettingChoose');
        let target = event.target;
        if (this._agreeClub == null) {
            var confstr = cc.fy.localStorage.getItem("inviteClub");
            if (confstr != null) {
                this._agreeClub = JSON.parse(confstr);
            } else {
                this._agreeClub = {};
            }
        }
        var curClubid = cc.fy.guildMainMsg.getCurClub().clubInfo.clubid;
        switch (target.name) {
            case 'chkAgree':
                this._agreeClub[curClubid] = 1;

                break;
            case 'chkRefuse':
                this._agreeClub[curClubid] = 0;

                break;
        }
        if (this._agreeClub != null) {
            var agreeclubstr = JSON.stringify(this._agreeClub);
            cc.fy.localStorage.setItem("inviteClub", agreeclubstr);
        }

    },
    onSettingChooseLink(event) {
        let target = event.target;
        var isShare = 0;
        switch (target.name) {
            case 'chkOpen':
                //开启圈链接分享
                isShare = 1;
                break;
            case 'chkClose':
                //关闭圈链接分享
                isShare = 0;
                break;
        }
        var state = 0;
        cc.fy.net.send("share_histroy_url", { "clubid": this._clubInfo.clubid, "state": state, "isShare": isShare });
    },
    onSettingBack() {
        cc.fy.audioMgr.playBiuBiuBiu("click_return.mp3");
        this.hidePanel();
    },

    onSettingLeave() {
        console.log('setting leave');

        var clubid = cc.fy.guildMainMsg.getCurClub().clubInfo.clubid;
        let content = {
            id: clubid,
            type: "memberLeave",
            info: {
                name: cc.fy.userMgr.username,
            }
        }
        cc.fy.gameNetMgr.dispatchEvent(GameMsgDef.ID_SHOWCONFIRMSECONDVIEW_CTC, { isShow: true, content: content });
        this.hidePanel();
    },

    onSettingChangeName() {
        console.log('setting change name');
    },
});
