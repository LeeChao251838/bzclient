cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        _nextPlayTime: 1,
        _replay: null,
        _btnpause: null,
        _btnplay: null,
        _btnSudu0: null,
        _btnSudu1: null,
        _btnSudu2: null,
        _btnChange: null,
        _speed: 0.8,

        _colorcount: 0, // 颜色计时回调
    },

    // use this for initialization
    onLoad: function () {
        if (cc.fy == null) {
            return;
        }

        this._replay = this.node.getChildByName("replay");
        this._replay.active = cc.fy.replayMgr.isReplay();
        this._btnpause = this._replay.getChildByName("btn_pause");
        this._btnplay = this._replay.getChildByName("btn_play");
        this._btnSudu0 = this._replay.getChildByName("btn_sudu0");
        this._btnSudu1 = this._replay.getChildByName("btn_sudu1");
        this._btnSudu2 = this._replay.getChildByName("btn_sudu2");
        this._btnChange = this._replay.getChildByName("btn_change");
        this._btnBack = this._replay.getChildByName("btn_back");

        //PDK专用按钮,快、慢
        this._btnfast = this._replay.getChildByName("btn_fast");
        this._btnslow = this._replay.getChildByName("btn_slow");
        if (this._btnfast) {
            cc.fy.utils.addClickEvent(this._btnfast, this.node, "ReplayCtrl", "onBtnClicked");
            this._btnfast.active = true;
        }
        if (this._btnslow) {
            cc.fy.utils.addClickEvent(this._btnslow, this.node, "ReplayCtrl", "onBtnClicked");
            this._btnslow.active = true;
        }

        if (this._btnpause) {
            cc.fy.utils.addClickEvent(this._btnpause, this.node, "ReplayCtrl", "onBtnClicked");
            this._btnpause.active = true;
        }
        if (this._btnplay) {
            cc.fy.utils.addClickEvent(this._btnplay, this.node, "ReplayCtrl", "onBtnClicked");
            this._btnplay.active = false;
        }
        if (this._btnSudu0) {
            cc.fy.utils.addClickEvent(this._btnSudu0, this.node, "ReplayCtrl", "onBtnClicked");
            this._btnSudu0.active = true;
        }
        if (this._btnSudu1) {
            cc.fy.utils.addClickEvent(this._btnSudu1, this.node, "ReplayCtrl", "onBtnClicked");
            this._btnSudu1.active = false;
        }
        if (this._btnSudu2) {
            cc.fy.utils.addClickEvent(this._btnSudu2, this.node, "ReplayCtrl", "onBtnClicked");
            this._btnSudu2.active = false;
        }
        if (this._btnChange) {
            cc.fy.utils.addClickEvent(this._btnChange, this.node, "ReplayCtrl", "onBtnClicked");
        }
        if (this._btnBack) {
            cc.fy.utils.addClickEvent(this._btnBack, this.node, "ReplayCtrl", "onBtnClicked");
        }

    },

    onBtnClicked: function (event) {
        this._colorcount = 0;// 计划重置为0

        // this._replay.setOpacity(50);// 此处是个bug 透明在这个版本中设置有问题
        //this._replay.setOpacity(255);// 不透明

        if (event.target.name == "btn_pause") {
            cc.fy.replayMgr.isPlaying = false;
            this._btnpause.active = false;
            this._btnplay.active = true;
        }
        else if (event.target.name == "btn_play") {
            cc.fy.replayMgr.isPlaying = true;
            this._btnpause.active = true;
            this._btnplay.active = false;
        } else if (event.target.name == "btn_fast") {
            if (this._speed == 0.8) {
                this._speed = 1;
            } else if (this._speed == 1) {
                this._speed = 3;
            } else if (this._speed == 3) {
                return
            }
        } else if (event.target.name == "btn_slow") {
            if (this._speed == 0.8) {
                return
            } else if (this._speed == 1) {
                this._speed = 0.8;
            } else if (this._speed == 3) {
                this._speed = 1
            }
        }
        else if (event.target.name == "btn_sudu0") {
            this._btnSudu0.active = false;
            this._btnSudu1.active = true;
            this._btnSudu2.active = false;
            this._speed = 1;
        }
        else if (event.target.name == "btn_sudu1") {
            this._btnSudu0.active = false;
            this._btnSudu1.active = false;
            this._btnSudu2.active = true;
            this._speed = 3;
        }
        else if (event.target.name == "btn_sudu2") {
            this._btnSudu0.active = true;
            this._btnSudu1.active = false;
            this._btnSudu2.active = false;
            this._speed = 0.8;
        }
        else if (event.target.name == "btn_change") {
            cc.fy.replayMgr.changeSeat();
        }
        else if (event.target.name == "btn_back") {
            cc.fy.alert.show("是否要终止回放？", function () {
                cc.fy.replayMgr.clear();
                cc.fy.gameNetMgr.reset();
                cc.fy.gameNetMgr.roomId = null;
                cc.fy.sceneMgr.loadScene("hall");
            }, true);
        }
    },

    // 处理控制面板透明度
    planColorChangerCtrl: function (dt) {
        // 此处加一个特效用于处理控制面板透明度
        if (this._colorcount > 1.5) {
            if (this._replay.opacity != 50)
                this._replay.setOpacity(50);
        } else {
            this._colorcount += dt;
        }
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        // this.planColorChangerCtrl(dt); 
        if (cc.fy) {
            if (cc.fy.replayMgr.isPlaying && cc.fy.replayMgr.isReplay() == true) {
                if (this._nextPlayTime >= 0) {
                    this._nextPlayTime -= dt;
                    if (this._nextPlayTime < 0) {
                        // if () { }
                        var tmp = cc.fy.replayMgr.takeAction();
                        var action = cc.fy.replayMgr.getNextActionNotUp();
                        if (tmp == -1 || action == null || (action != null && (action.type == 5 || action.type == 6))) {
                            if (cc.isMJ(cc.fy.gameNetMgr.conf.type)) {
                                this._btnpause.getComponent(cc.Button).interactable = false;
                                this._btnplay.getComponent(cc.Button).interactable = false;
                                this._btnSudu0.getComponent(cc.Button).interactable = false;
                                this._btnSudu1.getComponent(cc.Button).interactable = false;
                                this._btnSudu2.getComponent(cc.Button).interactable = false;
                                this._btnChange.getComponent(cc.Button).interactable = false;
                            }
                        }
                        this._nextPlayTime = tmp / this._speed;
                    }
                } else {
                    if (cc.isMJ(cc.fy.gameNetMgr.conf.type)) {
                        this._btnpause.getComponent(cc.Button).interactable = false;
                        this._btnplay.getComponent(cc.Button).interactable = false;
                        this._btnSudu0.getComponent(cc.Button).interactable = false;
                        this._btnSudu1.getComponent(cc.Button).interactable = false;
                        this._btnSudu2.getComponent(cc.Button).interactable = false;
                        this._btnChange.getComponent(cc.Button).interactable = false;
                    }
                }
            }
        }
    },
});
