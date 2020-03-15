cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        content: cc.Node,
        viewitemTemp: cc.Node,
        input: cc.EditBox,
    },

    // use this for initialization
    onLoad: function () {
        this.initData();
    },

    initData: function () {
        this.viewitemTemp.active = false;
        var btnList =
            [
                "普通胡（胡3条）",
                "对对胡（胡2条）",
                "清一色",
                "混一色",
                "混对对",
                "清对对",
                "大吊车",
                "天胡（14张）",
                "地胡",
                "杠开",
                "抢杠",
                "被抢杠者",
                "清一色11",
                "多11",
            ];
        var btnList1 =
            [
                "普通胡",      // 0
                "大门清",      // 1
                "小门清",      // 2
                "大小门清",    // 3
                "对对胡",      // 4
                "混一色1",     // 5
                "混一色2",     // 6
                "清一色1",     // 7
                "清一色2",     // 8
                "七对",        // 9
                "豪七对",      // 10
                "双豪七",      // 11
                "三豪七1",     // 12
                "三豪七2",     // 13
                "杠开1",       // 14
                "杠开2",       // 15
                "包饺子",      // 16
                "抢杠",        // 17
                "被抢杠者",    // 18
                "大吊车1",     // 19
                "大吊车2",     // 20
                "天胡开",       // 21
                "天胡关",       // 22
                "地胡开",        // 23
                "地胡关",    // 24
                "25",    // 24
                "26",    // 24
            ];

        var btnList2 =
            [
                "普通胡",      // 0
                "大门清",      // 1
                "小门清",      // 2
                "大小门清",    // 3
                "对对胡",      // 4
                "混一色1",     // 5
                "混一色2",     // 6
                "清一色1",     // 7
                "清一色2",     // 8
                "七对",        // 9
                "豪七对",      // 10
                "双豪七",      // 11
                "三豪七1",     // 12
                "三豪七2",     // 13
                "杠开1",       // 14
                "杠开2",       // 15
                "包饺子",      // 16
                "抢杠",        // 17
                "被抢杠者",    // 18
                "大吊车1",     // 19
                "大吊车2",     // 20
                "天胡1",       // 21
                "天胡2",       // 22
                "地胡",        // 23
                "海底捞月",    // 24
                "2摸3冲",      // 25
            ];

        var btnList3 =
            [
                "普通胡",      // 0
                "大门清",      // 1
                "小门清",      // 2
                "大小门清",    // 3
                "对对胡",      // 4
                "混一色1",     // 5
                "混一色2",     // 6
                "清一色1",     // 7
                "清一色2",     // 8
                "七对",        // 9
                "豪七对",      // 10
                "双豪七",      // 11
                "三豪七1",     // 12
                "三豪七2",     // 13
                "杠开1",       // 14
                "杠开2",       // 15
                "包饺子",      // 16
                "抢杠",        // 17
                "被抢杠者",    // 18
                "大吊车1",     // 19
                "大吊车2",     // 20
                "天胡1",       // 21
                "天胡2",       // 22
                "地胡",        // 23
                "海底捞月",    // 24
                "2摸3冲",      // 25
            ];

        var btnList4 =
            [
                "普通胡",      // 0
                "八花",      // 1
                "七对",      // 2
            ];

        // 根据游戏显示调试内容
        btnList = btnList1;
        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.PDK || cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.GD) {
            btnList = [
                "关闭出牌限制",
                "打开出牌限制",
            ];
        }
        else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.JDMJ) {
            btnList = btnList4;
        }

        var length = btnList.length;
        for (var i = 0; i < length; i++) {
            var node = this.getViewItem(i);
            node.active = true;
            var button = node.getChildByName("Label").getComponent(cc.Label);
            button.string = i + " : " + btnList[i];
        }
    },

    addClickEvent: function (node, target, component, handler) {
        var eventHandler = new cc.Component.EventHandler();
        eventHandler.target = target;
        eventHandler.component = component;
        eventHandler.handler = handler;

        var clickEvents = node.getComponent(cc.Button).clickEvents;
        clickEvents.push(eventHandler);
    },

    getViewItem: function (index) {
        var _content = this.content;
        var node = cc.instantiate(this.viewitemTemp);
        _content.addChild(node);
        node.name = index.toString();
        return node;
    },

    onListButtonClick: function (event) {
        console.log(event.target.parent.name);
        this.sendHolds(event.target.parent.name);
    },

    getTypeID: function (idStr) {
        var index = idStr.indexOf("@");
        if (index >= 0) {
            var str = idStr.substr(1, idStr.length - 1);
            this.sendHolds(str)
            return true;
        }

        return false;
    },

    sendHolds: function (idStr) {
        var eID = parseInt(idStr);
        console.log("sendHolds = " + eID);
        if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.PDK || cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.GD) {
            if (eID == 0) {
                cc.GDConfig.limitePlayCard = false;
                var data = {
                    type: "check",
                    cont: 0,
                }
                cc.fy.net.send('game_tiaoshi', data);
            }
            else if (eID == 1) {
                cc.GDConfig.limitePlayCard = true;
                var data = {
                    type: "check",
                    cont: 1,
                }
                cc.fy.net.send('game_tiaoshi', data);
            }
        }
        else if (cc.fy.gameNetMgr.conf.type == cc.GAMETYPE.JDMJ) {
            if (eID == 0) {
                var cont = [18, 19, 20, 21, 22, 23, 26, 26, 26, 10, 10, 10, 11, 11, 11, 12];
                this.cmdHolds(cont)
            }
            if (eID == 1) {
                var cont = [18, 19, 20, 21, 22, 23, 26, 26, 54, 55, 56, 57, 52, 52, 52, 52];
                this.cmdHolds(cont)
            }
            else if (eID == 2) {
                var cont = [18, 18, 0, 0, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 15];
                this.cmdHolds(cont)
            }
        }
        else {

            if (eID == 0) {
                // var cont = [18, 19, 20, 21, 22, 23, 26, 26, 26, 10, 10, 10, 11];
                var cont = [1, 2, 2, 2, 3, 8, 8, 8, 15, 15, 13, 13, 14];
                // var cont = [18, 18, 18, 19, 20, 21, 22, 23, 24, 25, 26, 26, 26];

                this.cmdHolds(cont)
            }
            else if (eID == 1) {
                var cont = [18, 18, 18, 18, 10, 10, 10, 10, 27, 27, 27, 27, 31];
                this.cmdHolds(cont)
            }
            else if (eID == 2) {
                var cont = [18, 18, 18, 19, 20, 21, 22, 23, 24, 25, 26, 26, 26];
                this.cmdHolds(cont)
            }
            else if (eID == 3) {
                var cont = [18, 18, 18, 19, 20, 21, 22, 23, 24, 25, 26, 26, 26];
                this.cmdHolds(cont)
            }
            else if (eID == 4) {
                var cont = [18, 18, 18, 27, 27, 27, 31, 31, 31, 35, 35, 35, 39];
                this.cmdHolds(cont)
            }
            else if (eID == 5) {
                var cont = [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 27, 27, 31];
                this.cmdHolds(cont)
            }
            else if (eID == 6) {
                var cont = [18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 27];
                this.cmdHolds(cont)
            }
            else if (eID == 7) {
                var cont = [18, 19, 20, 19, 20, 21, 19, 20, 21, 22, 22, 22, 26];
                this.cmdHolds(cont)
            }
            else if (eID == 8) {
                var cont = [27, 27, 27, 27, 31, 31, 31, 31, 35, 35, 35, 35, 39];
                this.cmdHolds(cont)
            }
            else if (eID == 9) {
                var cont = [18, 18, 0, 0, 9, 9, 10, 10, 11, 11, 12, 12, 13];
                this.cmdHolds(cont)
            }
            else if (eID == 10) {
                var cont = [18, 18, 19, 19, 19, 19, 20, 20, 21, 21, 22, 22, 23];
                this.cmdHolds(cont)
            }
            else if (eID == 11) {
                var cont = [27, 27, 27, 27, 31, 31, 31, 31, 9, 9, 0, 1, 2];
                this.cmdHolds(cont)
            }
            else if (eID == 12) {
                var cont = [18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 27];
                this.cmdHolds(cont)
            }
            else if (eID == 13) {
                var cont = [9, 9, 9, 9, 10, 10, 10, 10, 11, 11, 11, 11, 12];
                this.cmdHolds(cont)
            }
            else if (eID == 14) {
                var cont = [18, 18, 18, 9, 10, 11, 1, 2, 3, 4, 5, 6, 21];
                this.cmdHolds(cont)
            }
            else if (eID == 15) {
                var cont = [27, 27, 27, 20, 20, 20, 9, 9, 9, 26, 26, 26, 0];
                this.cmdHolds(cont)
            }
            else if (eID == 16) {
                var cont = [18, 18, 18, 19, 19, 19, 20, 20, 21, 21, 21, 22];
                this.cmdHolds(cont)
            }
            else if (eID == 17) {
                var cont = [18, 19, 21, 21, 21, 22, 22, 22, 23, 23, 23, 24, 24];
                this.cmdHolds(cont)
            }
            else if (eID == 18) {
                var cont = [20, 20, 21, 21, 21, 9, 9, 10, 10, 1, 2, 3, 21,];
                this.cmdHolds(cont)
            }
            else if (eID == 19) {
                var cont = [18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21];
                this.cmdHolds(cont)
            }
            else if (eID == 20) {
                var cont = [18, 18, 10, 10, 11, 11, 2, 2, 27, 27, 31, 31, 39];
                this.cmdHolds(cont)
            }
            else if (eID == 21) {
                // var cont = [18, 18, 18, 19, 20, 21, 22, 23, 24, 25, 26, 26, 26];
                this.tianhuOn();
                // this.cmdHolds(cont)
            }
            else if (eID == 22) {
                // var cont = [27, 27, 27, 27, 31, 31, 31, 31, 9, 9, 0, 1, 2];
                // this.cmdHolds(cont)
                this.tianhuOff();
            }
            else if (eID == 23) {
                // var cont = [18, 18, 18, 19, 19, 19, 20, 20, 20, 21, 21, 21, 26];
                // this.cmdHolds(cont)
                this.dihuOn();
            }
            else if (eID == 24) {
                // var cont = [18, 18, 18, 27, 27, 27, 31, 31, 31, 35, 35, 35, 39];
                // this.cmdHolds(cont)
                this.dihuOff();
            }
            else if (eID == 25) {
                var cont = [18, 19, 20, 21, 22, 23, 27, 27, 27, 47, 47, 47, 47];
                this.cmdHolds(cont)
            } else if (eID == 26) {
                var cont = [19, 20, 21, 1, 1, 5, 5, 9, 10, 11, 13, 14, 43];
                this.cmdHolds(cont)
            }
        }

    },

    cmdHolds: function (cont) {
        var data =
        {
            type: "holds",
            cont: cont,
        }
        console.log("game_tiaoshi type = " + data.type + " cont = " + data.cont.join(" "));
        cc.fy.net.send('game_tiaoshi', data);
    },

    tianhuOn() {
        var data = {
            type: "tianhu",
            cont: [1],
        }
        cc.fy.net.send('game_tiaoshi', data);
    },

    tianhuOff() {
        var data = {
            type: "tianhu",
            cont: [0],
        }
        cc.fy.net.send('game_tiaoshi', data);
    },

    dihuOn() {
        var data = {
            type: "dihu",
            cont: [1],
        }
        cc.fy.net.send('game_tiaoshi', data);
    },

    dihuOff() {
        var data = {
            type: "dihu",
            cont: [0],
        }
        cc.fy.net.send('game_tiaoshi', data);
    },

    onSendButtonClick: function (event) {
        var inputString = this.input.string;
        console.log(inputString);
        if (inputString == null || inputString == "") {
            return;
        }

        if (inputString == "ting0") {
            cc.fy.global.isShowTing = false;
            return;
        }
        else if (inputString == "ting1") {
            cc.fy.global.isShowTing = true;
            return;
        }

        var contStr = inputString.split(" ");
        var length = contStr.length;
        if (length < 1) {
            return;
        }
        var cont = [];
        var isCantgo = false;
        var type = "holds";

        var firstLetter = contStr[0];
        // if (firstLetter == "#") {
        //     for (var j = 1; j < length; j++) {
        //         var pa = parseInt(contStr[j]);
        //         if (pa == null) {
        //             isCantgo = true;
        //             break;
        //         }
        //         cont.push(pa);
        //     }
        //     type = "mopai";
        // }
        // else 
        if (firstLetter == 'th') {
            for (var j = 1; j < length; j++) {
                var pa = parseInt(contStr[j]);
                if (pa == null) {
                    isCantgo = true;
                    break;
                }
                cont.push(pa);
            }
            type = "tianhu";
        }
        else if (firstLetter == "*") {
            for (var j = 1; j < length; j++) {
                var pa = parseInt(contStr[j]);
                if (pa == null) {
                    isCantgo = true;
                    break;
                }
                cont.push(pa);
            }
            type = "changebaida";
        } else if (firstLetter == "hp") {
            var fromStr,
                toStr,
                len,
                j;
            console.log("hp");
            console.log(contStr);
            if (length == 3) {
                fromStr = contStr[1].split(",");
                toStr = contStr[2].split(",");
                len = fromStr.length;
                for (j = 0; j < len; j++) {
                    cont.push([parseInt(fromStr[j]), parseInt(toStr[j])]);
                }
                console.log(cont);
            }
            type = "part";
        } else if (firstLetter == "lv") {
            var lv = parseInt(contStr[1]);
            cont = lv;
            type = "level";
        } else if (firstLetter == "jc") {
            var check = parseInt(contStr[1]);
            cont = check;
            type = "check";
        } else if (firstLetter == "add") {
            for (var j = 1; j < length; j++) {
                var pa = parseInt(contStr[j]);
                if (pa == null) {
                    isCantgo = true;
                    break;
                }
                cont.push(pa);
            }
            type = "add";
        } else if (firstLetter == "nh") {
            type = "nextHolds";
            for (var i = 1; i < length; i++) {
                var pa = parseInt(contStr[i]);
                if (pa == null) {
                    isCantgo = true;
                    break;
                }
                cont.push(pa);
            }

            if (isCantgo == true) {
                return;
            }
        } else if (firstLetter == "#") {
            type = "shaizi";
            for (var j = 1; j < length; j++) {
                var pa = parseInt(contStr[j]);
                if (pa == null) {
                    isCantgo = true;
                    break;
                }
                pa = pa > 6 || pa < 1 ? 1 : pa;
                cont.push(pa);
            }
            // cont.push(pa);
        }
        else {
            if (length == 1) {
                if (this.getTypeID(inputString) == true) {
                    return;
                }
                type = "mopai";
            }

            for (var i = 0; i < length; i++) {
                var pa = parseInt(contStr[i]);

                if (pa == null) {
                    isCantgo = true;
                    break;
                }

                cont.push(pa);
            }

            if (isCantgo == true) {
                return;
            }
        }

        var data = {
            type: type,
            cont: cont,
        }
        console.log("game_tiaoshi type = " + data.type);
        console.log(data);
        cc.fy.net.send('game_tiaoshi', data);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
