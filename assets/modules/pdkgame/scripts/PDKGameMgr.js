var PokerDef = require("PDKPokerDef");
var PokerArithmetic = require("PDKArithmetic");
var PokerUtil = require("PDKUtils");
var ConstsDef = require("ConstsDef");

var PokerSuit = PokerDef.PokerSuit;
var PokerPoint = PokerDef.PokerPoint;
var PokerMap = PokerDef.PokerMap;
var PokerKey = PokerDef.PokerKey;
var PokerValue = PokerDef.PokerValue;
var PokerKeyWeight = PokerDef.PokerKeyWeight;
var PokerType = PokerDef.PokerType;
var PokerTypeWeight = PokerDef.PokerTypeWeight;
var PlayCardResult = PokerDef.PlayCardResult;
var PlayCardResultHint = PokerDef.PlayCardResultHint;

cc.Class({
    properties: {
        _holdsType: 0,                 //手牌摆放方向 0横排 1竖排
    },

    init: function () {
        PokerArithmetic.createPokerTypes();
    },

    //手牌排序
    sortHandsCard: function (hands) {
        this.sortCards(hands);
    },



    //扑克牌排序
    sortCards: function (cards) {
        var self = this;
        var _cards = [];
        if (cards == null || cards.length == 0) {
            return;
        }

        _cards = cards;
        this.printCards(_cards, "Sort Cards");

        _cards.sort(function (a, b) {
            var keyA = self.getKey(a);
            var keyB = self.getKey(b);

            if (keyA == keyB) {
                var suitA = self.getSuit(a);
                var suitB = self.getSuit(b);
                return suitB - suitA;
            }

            return PokerKeyWeight[keyB] - PokerKeyWeight[keyA];
        });

        return _cards;
    },

    sortSpecial(cards) {
        let tmpMap = new Map();
        let tmpArr = [];
        let result = [];
        let ret = PokerArithmetic.getMaxPokerTypeAndKey(cards, null, cc.fy.gameNetMgr.conf.wanfa);
        if (ret.type == PokerDef.PokerType.STRAIGHT && isHave2(cards)) {
            for (let i = 0; i < cards.length; i++) {
                let tmpPoint = cards[i] / 10;
                if (tmpPoint > 12) {
                    tmpPoint = tmpPoint % 13;
                }
                tmpMap.set(tmpPoint, cards[i]);
            }
            tmpMap.forEach((value, key) => {
                tmpArr.push(key);
            });
            tmpArr.sort((a, b) => { return b - a })
            for (let i = 0; i < tmpArr.length; i++) {
                result.push(tmpMap.get(tmpArr[i]));
            }
            return result;
        } else {
            return false;
        }
        function isHave2(cards) {
            for (let i = 0; i < cards.length; i++) {
                let tmpPoint = cards[i] / 10;
                if (tmpPoint > 12) {
                    tmpPoint = tmpPoint % 13;
                }
                if (tmpPoint == PokerDef.PokerPoint.PT_2) {
                    return true;
                }
            }
            return false;
        }
    },

    getMinCardByType(cards, type) {
        console.log("找牌型：" + type);
        let cardList = PokerArithmetic.getCardListByType(cards, type, cc.fy.gameNetMgr.conf.wanfa);
        let minCards = null;
        let minKey = "2";
        let minLen = 0;
        for (let i = 0; i < cardList.length; i++) {
            let cards = cardList[i];
            console.log("cards:" + cards);
            let map = PokerArithmetic.getMaxPokerTypeAndKey(cards, null, cc.fy.gameNetMgr.conf.wanfa);
            console.log("===>MaxCardmap: ", map);
            if (map != null) {
                if (map.len >= minLen && PokerKeyWeight[map.key] <= PokerKeyWeight[minKey]) {
                    console.log("===>MaxCardmap --->: ", map);
                    minLen = map.len;
                    //minKey = map.key;
                    minCards = null;
                    minCards = cards;
                }
            }
        }

        return minCards;
    },

    getCardListByType(cards, type, wanfa) {
        return PokerArithmetic.getCardListByType(cards, type, wanfa);
    },

    getWeight: function (cards) {
        if (cards == null) {
            return null;
        }

        var keyCard = this.getKey(cards);

        return PokerKeyWeight[keyCard];
    },
    //检查首次出牌牌型是否符合
    checkValidType: function (lstCards) {
        var data = {
            ret: 0,
            result: PlayCardResult.OK,
            hint: PlayCardResultHint[PlayCardResult.OK],
        }

        var type = this.getPokerType(lstCards);
        console.log("type:", type);
        if (type.type == PokerType.INVALID) {
            data.ret = -1;
            data.result = PlayCardResult.ERR_RULE;
            data.hint = PlayCardResultHint[data.result];
        }

        if (cc.fy.gameNetMgr.conf.wanfa.indexOf(6) < 0) {
            if (type.type == PokerType.THREE_1) {
                data.ret = -1;
                data.result = PlayCardResult.ERR_RULE;
                data.hint = PlayCardResultHint[data.result];
            }
        }

        return data;
    },

    //检查牌是否可出
    checkCanOutCard: function (lastCards, selCards) {
        var result = this.compareTypeByPoker(lastCards, selCards);
        var data = {
            ret: 0,
            result: result,
            hint: PlayCardResultHint[result],
        }

        if (result != PlayCardResult.OK) {
            data.ret = -1;
        }

        return data;
    },

    //检查手牌能否一手出完
    checkOnlyOne: function (handCards) {
        var ret = PokerArithmetic.getMaxPokerTypeAndKey(handCards, null, cc.fy.gameNetMgr.conf.wanfa);
        if (ret.type != -1) {
            return true;
        }
        return false;
    },

    //检查是否有可出的牌
    checkHaveOutCard: function (lastCards, handCards) {
        // if(lastCards == null || lastCards.length == 0){
        //     return true;
        // }
        console.log("检查是否有可出：",lastCards,handCards);
        var isBaoDan = cc.fy.pdkGameNetMgr.checkNextBaoDan();
        var tipList = PokerArithmetic.calcPrompts(lastCards, handCards, isBaoDan, null, cc.fy.gameNetMgr.conf.wanfa);
        
        if (tipList == null || tipList.length == 0) {
            return false;
        }
        return true;
    },

    //获取提示牌型
    getBiggerTips: function (lastCards, handCards) {
        cc.fy.PDKGameMgr.printCards(lastCards, "pdk lastCards");
        cc.fy.PDKGameMgr.printCards(handCards, "pdk handCards");
        var isBaoDan = cc.fy.pdkGameNetMgr.checkNextBaoDan();
        console.log("报单了" + isBaoDan);
        var tipList = PokerArithmetic.calcPrompts(lastCards, handCards, isBaoDan, null, cc.fy.gameNetMgr.conf.wanfa);
        console.log("getBiggerTips");
        console.log(tipList);
        return tipList;
    },



    //检查是否是特殊炸弹
    checkSpecialBomb: function (tipList, countHandCards, roomConf) {
        for (var i = 0; i < tipList.length; i++) {
            let list = tipList[i]
            var map = null;
            if (cc.fy.replayMgr.isReplay()) {
                map = PokerArithmetic.getMaxPokerTypeAndKey(list, null, cc.fy.pdkGameNetMgr.wanfa);
            }
            else {
                map = PokerArithmetic.getMaxPokerTypeAndKey(list, null, cc.fy.gameNetMgr.conf.wanfa);
            }

            // 判断手牌有四张  但是当前牌型不是炸弹,4dai2
            let hasBomb = false;
            for (let k = 0; k < list.length; k++) {
                let key = PokerUtil.getKey(list[k])
                if (countHandCards[key] == 4) {
                    if (this.IsBomb(list) == false && this.IsBomb2(list) == false) {
                        hasBomb = true;
                    }
                }
                else if (key == "A" && countHandCards[key] == 3) {
                    if (roomConf.wanfa.indexOf(11) >= 0) {
                        if (this.IsBomb(list) == false) {
                            hasBomb = true;
                        }

                    }
                }
            }

            if (hasBomb) {
                tipList.splice(i, 1);
                i--;
                continue;
            }


            if (map.type == PokerType.BOMB4 && map.key == "3") {
                if (roomConf.wanfa.indexOf(0) >= 0) {
                    if (!PokerUtil.isSameKey(list)) {
                        tipList.splice(i, 1);
                        i--;
                    }
                }
                else if ((roomConf.wanfa.indexOf(1) >= 0)) {
                    if (!PokerUtil.isSameKey(list) && list.indexOf(PokerValue.SPADE_3 * 10) >= 0) {
                        tipList.splice(i, 1);
                        i--;
                    }
                }
                else if ((roomConf.wanfa.indexOf(2) >= 0)) {
                    if (!PokerUtil.isSameKey(list) && list.indexOf(PokerValue.HEART_3 * 10) >= 0) {
                        tipList.splice(i, 1);
                        i--;
                    }
                }
                else if ((roomConf.wanfa.indexOf(PokerDef.WanfaType.ThreeBomb) >= 0)) {
                    if (PokerUtil.isSameKey(list) && list.indexOf(PokerValue.HEART_3 * 10) >= 0) {
                        tipList.splice(i, 1);
                        i--;
                    }
                }
            }

        }
        return tipList;
    },


    //比较牌型
    compareTypeByPoker: function (lstCards0, lstCards1) {
        var type0 = this.getPokerType(lstCards0);
        var type1 = this.getPokerType(lstCards1);
        if (type0.type == PokerType.INVALID || type1.type == PokerType.INVALID) {
            return PlayCardResult.ERR_RULE;
        }

        console.log(type0,type1);
        return this.compareTypeByType(type0, type1);
    },

    compareTypeByType: function (type0, type1) {
        if (type0.type == type1.type) {
            var numt = PokerKeyWeight[type1.key] - PokerKeyWeight[type0.key];
            if (numt > 0) {
                return PlayCardResult.OK;
            }
            else {
                return PlayCardResult.ERR_LESS;
            }
        }
        else {
            var numt = PokerTypeWeight[type1.type] - PokerTypeWeight[type0.type];
            if (numt > 0) {
                return PlayCardResult.OK;
            }
            else {
                return PlayCardResult.ERR_RULE;
            }
        }
    },

    // 检查牌是否是炸弹
    IsBomb: function (cards) {
        let map = PokerArithmetic.getMaxPokerTypeAndKey(cards, null, cc.fy.gameNetMgr.conf.wanfa);
        if (map.type == PokerDef.PokerType.BOMB4) {
            return true;
        }

        return false;
    },

    //检查4带2
    IsBomb2: function (cards) {
        let map = PokerArithmetic.getMaxPokerTypeAndKey(cards, null, cc.fy.gameNetMgr.conf.wanfa);
        if (map.type == PokerDef.PokerType.BOMB4_2) {
            return true;
        }

        return false;
    },


    //从手牌lstCards中删除牌lstRemove
    removeCards: function (lstCards, lstRemove) {
        if (lstCards == null || lstCards.length == 0 || lstRemove == null || lstRemove.length == 0) {
            return;
        }

        for (var i = 0; i < lstRemove.length; i++) {
            for (var j = 0; j < lstCards.length; j++) {
                if (lstRemove[i] == lstCards[j]) {
                    lstCards.splice(j, 1);
                    break;
                }
            }
        }
    },

    //获得牌的类型
    getPokerType: function (lstCards) {
        var type = null;
        if (cc.fy.replayMgr.isReplay()) {
            type = PokerArithmetic.getMaxPokerTypeAndKey(lstCards, null, cc.fy.pdkGameNetMgr.wanfa);
        }
        else {
            type = PokerArithmetic.getMaxPokerTypeAndKey(lstCards, null, cc.fy.gameNetMgr.conf.wanfa);
        }
        this.printCards(lstCards, " lstCards type:" + type.type.toString() + " key:" + type.key);
        return type;
    },

    //获得牌的模板 0：横 1：竖 2：出
    getPokerPrefab: function (type) {
        if (type == 0) {
            return cc.fy.resMgr.getRes(ConstsDef.URL_PREFAB_POKER_HAND);
        }
        else if (type == 1) {
            return cc.fy.resMgr.getRes(ConstsDef.URL_PREFAB_POKER_HAND);
        }
        else if (type == 2) {
            return cc.fy.resMgr.getRes(ConstsDef.URL_PREFAB_POKER_CHU);
        }
        else {
            return cc.fy.resMgr.getRes(ConstsDef.URL_PREFAB_POKER_HAND);
        }
    },

    //获得手牌模板
    getHandsPokerPrefab: function (type) {
        if (type == null) {
            return this.getPokerPrefab(this._holdsType);
        }
        return this.getPokerPrefab(type);
    },

    getHandsPoferBoxPrefab: function () {
        return cc.fy.resMgr.getRes(ConstsDef.URL_PREFAB_POKER_HAND_BOX);
    },
    //获得出牌模板
    getFoldsPokerBoxPrefab: function () {
        return cc.fy.resMgr.getRes(ConstsDef.URL_PREFAB_POKER_CHU_BOX);
    },

    //获得出牌模板
    getFoldsPokerPrefab: function () {
        return this.getPokerPrefab(2);
    },

    //获得牌点数纹理
    getPointSprite: function (nCard, pType) {
        var nSuit = this.getSuit(nCard);
        var nPoint = this.getPoint(nCard);

        var pointStr = "";
        if (nSuit == PokerSuit.CLUB || nSuit == PokerSuit.SPADE) {
            pointStr = "black";
        }
        else if (nSuit == PokerSuit.DIAMOND || nSuit == PokerSuit.HEART) {
            pointStr = "red";
        }

        //img_red_1 red代表红，1代表牌点数 
        var point = nPoint + 1;
        if (point < 10) {
            pointStr = pointStr + "_0" + point;
        }
        else {
            pointStr = pointStr + "_" + point;
        }
        var spriteStr = "img_" + pointStr;

        return this.getPokerAtlas().getSpriteFrame(spriteStr);
    },


    getPokerAtlas: function () {
        return cc.fy.resMgr.getRes(ConstsDef.URL_ATLAS_POKER);
    },

    //获得牌花色纹理
    getSuitSprite: function (nCard, index) {
        //red 红色 black 黑色 sf 小号方块  bm 大号梅花
        var nSuit = this.getSuit(nCard);
        var nPoint = this.getPoint(nCard);

        var suitstr = "";
        // var specialstr = "";
        if (nPoint == 10 && index == 1) {
            suitstr = (nSuit == PokerSuit.CLUB || nSuit == PokerSuit.SPADE) ? "black_J" : "red_J";
        } else if (nPoint == 11 && index == 1) {
            suitstr = (nSuit == PokerSuit.CLUB || nSuit == PokerSuit.SPADE) ? "black_Q" : "red_Q";
        } else if (nPoint == 12 && index == 1) {
            suitstr = (nSuit == PokerSuit.CLUB || nSuit == PokerSuit.SPADE) ? "black_K" : "red_K";
        } else if (nSuit == PokerSuit.DIAMOND && index == 2) {
            suitstr = "red_sf"
        }
        else if (nSuit == PokerSuit.DIAMOND && index == 1) {
            // if(specialstr == ""){
            //     suitstr = "red_bf"
            // }else{
            //     suitstr = "red_" + specialstr;
            // }
            suitstr = "red_bf"
        }
        else if (nSuit == PokerSuit.CLUB && index == 2) {
            suitstr = "black_sm"
        }
        else if (nSuit == PokerSuit.CLUB && index == 1) {
            // if(specialstr == ""){
            //     suitstr = "black_bm"
            // }else{
            //     suitstr = "red_" + specialstr;
            // }
            suitstr = "black_bm"
        }
        else if (nSuit == PokerSuit.HEART && index == 2) {
            suitstr = "red_sh"
        }
        else if (nSuit == PokerSuit.HEART && index == 1) {
            // if(specialstr == ""){
            //     suitstr = "red_bh"
            // }else{
            //     suitstr = "red_" + specialstr;
            // }
            suitstr = "red_bh"
        }
        else if (nSuit == PokerSuit.SPADE && index == 2) {
            suitstr = "black_sh"
        }
        else if (nSuit == PokerSuit.SPADE && index == 1) {
            // if(specialstr == ""){
            //     suitstr = "black_bh"
            // }else{
            //     suitstr = "red_" + specialstr;
            // }
            suitstr = "black_bh"
        }

        var spriteStr = "img_" + suitstr;

        return this.getPokerAtlas().getSpriteFrame(spriteStr);
    },

    // 扑克牌的组成包含：花色、牌点、索引
    // 相同牌之间索引不相同，因此三个元素组合在一起可以区别开任意一张牌
    // 组合公式：
    // nCard 表示 三者唯一的组合值：nCard = ((nSuit * 13) + nPoint) * 10 + idx
    // nValue 表示 牌值（花色和牌点的组合值）：nValue = (nSuit * 13) + nPoint
    // nPoint 为 牌点值
    // nSuit 为 花色值

    // 获取nCard的牌值（花色和牌点的组合值）
    getValue: function (nCard) {
        return Math.floor(nCard / 10);
    },

    // 获取nCard的花色
    getSuit: function (nCard) {
        var val = this.getValue(nCard);
        return Math.floor(val / PokerPoint.PT_NONE);
    },

    // 获取nCard的牌点
    getPoint: function (nCard) {
        var val = this.getValue(nCard);
        return Math.floor(val % PokerPoint.PT_NONE);
    },

    //获取牌的名称
    getPokerName: function (nCard) {
        var val, point, key, suit;
        val = this.getValue(nCard)

        if (val == PokerValue.JOKER_B) {
            return "Jb";
        } else if (val == PokerValue.JOKER_R) {
            return "Jr";
        } else {
            point = this.getPoint(nCard);
            key = PokerMap[point];

            if (key) {
                suit = this.getSuit(nCard);
                switch (suit) {
                    case PokerSuit.DIAMOND:
                        return 'D' + key;
                    case PokerSuit.CLUB:
                        return 'C' + key;
                    case PokerSuit.HEART:
                        return 'H' + key;
                    case PokerSuit.SPADE:
                        return 'S' + key;
                }
                return key;
            }
        }
        return "unknow";
    },

    // 通过nCard获取牌名称
    getCardName: function (nCard) {
        var nPoint = this.getPoint(nCard);
        return this.getPointName(nPoint);
    },

    // 获取牌点名
    getPointName: function (nPoint) {
        var sKey = PokerDef.PokerMap[nPoint];
        if (sKey) {
            if (sKey == 'T') {
                sKey = '10'
            }
            return sKey;
        }
        return "unknow";
    },


    // 获取nCard的key
    getKey: function (nCard) {
        var val = this.getValue(nCard), point, key;

        if (val == PokerValue.JOKER_B) {
            return PokerKey.PK_B;
        } else if (val == PokerValue.JOKER_R) {
            return PokerKey.PK_R;
        } else {
            point = this.getPoint(nCard);
            key = PokerMap[point];

            if (key) {
                return key;
            }
        }
        return "";
    },


    // 打印牌列表
    printCards: function (lstCards, desc) {
        // if(lstCards == null || lstCards.length == 0){
        //     console.log("lstCards == null || lstCards.length = 0");
        //     return;
        // }

        // var strCards = "";
        // var strTranslate = "";
        // for(var i = 0; i < lstCards.length; i++){
        //     strCards = strCards + lstCards[i] + ",";
        //     strTranslate = strTranslate + this.getPokerName(lstCards[i]) + ",";
        // }

        // if(desc == null || desc == "" ){
        //     desc = "printCards";
        // }

        // var str = strCards + "[" + strTranslate + "]";
        // console.log(desc + ": " + str);
    },

});
