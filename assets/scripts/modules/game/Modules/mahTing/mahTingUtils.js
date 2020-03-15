var Define = require("./mahDefine")

var HuTypes = Define.HuTypes;

var NoramlFlowerTypes = Define.NoramlFlowerTypes;

var NoramlFlowers = Define.NoramlFlowers;

var OperType = Define.OperType;

function mahTingUtils(isTdh) {
    isTdh = isTdh || false;
    this.duiGroups = [];
    this.huGroups = [];
    this.keDuiGroups = [];
    this.finds = [];
    this.isTdh = isTdh;
}

var exports = module.exports = mahTingUtils;
var prototype = mahTingUtils.prototype;

prototype.getPileCards = function (seatData) {
    var lstPile = [];

    if (!seatData) {
        return lstPile;
    }

    if (seatData.pengs) {
        for (var i = seatData.pengs.length - 1; i >= 0; i--) {
            var card = seatData.pengs[i];
            lstPile.push({ type: OperType.PENG, card: card });
        }
    }

    if (seatData.angangs) {
        for (var i = seatData.angangs.length - 1; i >= 0; i--) {
            var card = seatData.angangs[i];
            lstPile.push({ type: OperType.AN_GANG, card: card });
        }
    }

    if (seatData.diangangs) {
        for (var i = seatData.diangangs.length - 1; i >= 0; i--) {
            var card = seatData.diangangs[i];
            lstPile.push({ type: OperType.ZHI_GANG, card: card });
        }
    }

    if (seatData.wangangs) {
        for (var i = seatData.wangangs.length - 1; i >= 0; i--) {
            var card = seatData.wangangs[i];
            lstPile.push({ type: OperType.PENG_GANG, card: card });
        }
    }

    return lstPile;
}

prototype.getDictCntRiverAndPile = function (seatDatas) {
    var cntCard = function (dict, card, cnt) {
        if (!dict[card]) {
            dict[card] = 0;
        }

        dict[card] += cnt;
    }

    var ret = {};

    if (!seatDatas) {
        return ret;
    }

    for (var i = 0; i < seatDatas.length; i++) {
        var seatData = seatDatas[i];
        if (!seatData) {
            return ret;
        }

        if (seatData.folds) {
            for (var j = seatData.folds.length - 1; j >= 0; j--) {
                var card = seatData.folds[j];
                cntCard(ret, card, 1);
            }
        }

        if (seatData.holds) {
            for (var j = seatData.holds.length - 1; j >= 0; j--) {
                var card = seatData.holds[j];
                cntCard(ret, card, 1);
            }
        }

        if (seatData.pengs) {
            for (var j = seatData.pengs.length - 1; j >= 0; j--) {
                var card = seatData.pengs[j];
                cntCard(ret, card, 3);
            }
        }

        if (seatData.angangs) {
            for (var j = seatData.angangs.length - 1; j >= 0; j--) {
                var card = seatData.angangs[j];
                cntCard(ret, card, 4);
            }
        }

        if (seatData.diangangs) {
            for (var j = seatData.diangangs.length - 1; j >= 0; j--) {
                var card = seatData.diangangs[j];
                cntCard(ret, card, 4);
            }
        }

        if (seatData.wangangs) {
            for (var j = seatData.wangangs.length - 1; j >= 0; j--) {
                var card = seatData.wangangs[j];
                cntCard(ret, card, 4);
            }
        }
    }

    return ret;
}

prototype.calcQingOrHunYiSe = function (groups, pileCards, lstRes) {

    var lstAllCards = [];

    for (var i = 0; i < groups.length; i++) {
        lstAllCards = [];

        for (var j = 0; j < groups[i].length; j++) {
            for (var k = 0; k < groups[i][j].length; k++) {
                var card = groups[i][j][k];
                lstAllCards.push(card);
            }
        }

        for (var l = pileCards.length - 1; l >= 0; l--) {
            var pile = pileCards[l];
            lstAllCards.push(pile.card);
        }

        if (this.calcQingYiSe(lstAllCards)) {
            lstRes.push(HuTypes.QingYiSe);
            return i;
        } else if (this.calcHunYiSe(lstAllCards)) {
            lstRes.push(HuTypes.HunYiSe);
            return i;
        }
    }

    return -1;
}

// 胡法
// 普通胡
prototype.calcCombinationOfHu = function (cards, bdCard, findAll, record) {
    if (cards.length == 0) {
        return false;
    }

    findAll = findAll || false;
    record = record || false;
    if (bdCard == null) bdCard = 52;

    this.finds = [];
    this.huGroups = [];

    var dictCardCnt = getCardCntDict(cards);

    return this.standardHu(dictCardCnt, 0, bdCard, findAll, record);
}

// //手牌+胡的牌(牌序过的)
prototype.calcQiDui = function (cards, findAll, record) {
    // 一定14张牌
    if (cards.length != 14) {
        return false;
    }

    findAll = findAll || false;
    record = record || false;

    this.duiGroups = [];
    this.finds = [];

    var dictCardCnt = getCardCntDict(cards);

    return this.standardDui(dictCardCnt, findAll, record);
}

prototype.calcHaoQiTypes = function (cards) {
    // 计算所有对字
    var dictCardCnt = getCardCntDict(cards);
    var bdCnt = dictCardCnt[52] || 0;

    var dictCntCards = {};
    for (var card in dictCardCnt) {
        if (card == 52) {
            continue;
        }
        var cnt = dictCardCnt[card];
        if (cnt > 0) {
            if (!dictCntCards[cnt]) {
                dictCntCards[cnt] = [];
            }
            dictCntCards[cnt].push(card);
        }
    }

    if (dictCntCards[4]) {
        return true;
    } else if (dictCntCards[3]) {
        if (bdCnt > 0) return true;
    } else if (dictCntCards[1]) {
        if (bdCnt > dictCntCards[1].length) return true;
    } else if (bdCnt > 1) {
        return true;
    }

    return false;
}

// 大吊车
prototype.calcDaDiaoChe = function (pileCards) {
    return pileCards.length == 4;
}

// 手牌+胡的牌
prototype.calcPengPengHu = function (cards, pileCards, findAll, record) {
    // 记录刻杠数
    var pileCnt = pileCards.length;
    var keCnt = 4 - pileCnt;

    findAll = findAll || false;
    record = record || false;

    this.keDuiGroups = [];
    this.finds = [];

    var dictCardCnt = getCardCntDict(cards);
    return this.standardKeDui(dictCardCnt, 0, 0, keCnt, findAll, record);
}

prototype.calcQingYiSe = function (cards) {
    if (cards[0] == 52) {
        return true;
    }

    var firstCardType = getMJType(cards[0]);

    // 万条筒
    if (firstCardType != 0 && firstCardType != 1 && firstCardType != 2) {
        return false;
    }

    for (var i = cards.length - 1; i >= 0; i--) {
        if (cards[i] == 52) {
            continue;
        }

        var cardType = getMJType(cards[i]);
        if (cardType != firstCardType) {
            return false;
        }
    }

    return true;
}

prototype.calcHunYiSe = function (cards) {
    var hasZi = false;
    var numberCardType = -1;
    var bdCnt = 0;

    for (var i = cards.length - 1; i >= 0; i--) {
        var card = cards[i];
        if (card == 52) {
            bdCnt++;
            continue;
        }

        var cardType = getMJType(card);
        if (cardType == 3) {
            hasZi = true;
        } else if (cardType == 0 || cardType == 1 || cardType == 2) {
            if (numberCardType == -1) {
                numberCardType = cardType;
            } else if (numberCardType != cardType) {
                return false;
            }
        }
    }

    if (!hasZi || numberCardType == -1) {
        if (!hasZi) { // 没有字，单有数字牌
            if (bdCnt > 0) return true;
        } else if (bdCnt > 0) {// 有字，没有数字牌
            return true;
        }

        return false;
    }

    return true;
}


// 只能花麻使用
prototype.calcDaMenQing = function (pileCards, flowers, lstHandHu) {
    if (flowers.length > 0) {
        return false;
    }

    // 没有字暗刻
    var cntDict = getCardCntDict(lstHandHu);
    var hasKe = function (card) {
        return cntDict[card] && cntDict[card] >= 3;
    };
    if (hasKe(27) || hasKe(31) || hasKe(35) || hasKe(39)) {
        return false;
    }

    for (var i = pileCards.length - 1; i >= 0; i--) {
        var pile = pileCards[i];
        if ((pile.type & OperType.GANG) == pile.type) {
            return false;
        }

        if (pile.type == OperType.PENG) {
            if (pile.card >= 27 && pile.card <= 39) { //不能有风碰
                return false;
            }
        }
    }

    return true;
}

prototype.calcXiaoMenQing = function (pileCards) {
    // 结构牌中无碰、无明杠 只允许有暗杠
    for (var i = pileCards.length - 1; i >= 0; i--) {
        var pile = pileCards[i];
        if (pile.type != OperType.AN_GANG) {
            return false;
        }
    }

    return true;
}

prototype.calcDiaoBaiDa = function (lstHandHu, lstHuTypes) {
    var ret = false;

    var handHu = lstHandHu.slice(0);
    handHu.splice(handHu.length - 1, 1);
    var dictCardCnt = getCardCntDict(handHu);

    if (dictCardCnt[52] && dictCardCnt[52] > 0) {
        dictCardCnt[52]--;

        if (containHuType(lstHuTypes, HuTypes.QiDui)) {
            ret = this.standardDui(dictCardCnt, false, false);
        } else {
            ret = this.standardHu(dictCardCnt, 0, 52, false, false);

            if (dictCardCnt[52] > 0 && !ret) {// 不能成再去掉一张试
                dictCardCnt[52]--;
                ret = this.standardHu(dictCardCnt, 0, 52, false, false);
            }
        }
    }

    return ret;
}

prototype.calcNoBaiDa = function (lstHandHu) {
    var dictCardCnt = getCardCntDict(lstHandHu);
    return !dictCardCnt[52];
}

// 工具
prototype.standardHu = function (dictCardsCnt, jiangCard, bdCard, findAll, record) {
    if (remainCnt(dictCardsCnt) == 0) {
        if (record) {
            this.huGroups.push(this.finds.slice(0));
        }

        if (findAll) {
            return false;
        }

        return true;
    }

    var card = -1;
    // 先检测列表中还有没有正常牌
    var norLastCard = this.isTdh ? 51 : 39;
    for (var i = 0; i <= norLastCard; ++i) {
        if (dictCardsCnt[i] && dictCardsCnt[i] > 0) {
            if (i != bdCard) {
                card = i;
                break;
            }
        }
    }

    // 如果没有正常牌，看还有没有百搭牌
    if (card == -1) {
        if (dictCardsCnt[bdCard] && dictCardsCnt[bdCard] > 0) {
            card = bdCard;
        }
    }

    if (card == -1) {
        return false;
    }

    // a:普通牌， b:癞子牌
    // 先从刻字开始拆
    // aaa
    if (dictCardsCnt[card] >= 3) {
        dictCardsCnt[card] -= 3;

        if (record) {
            this.finds.push([card, card, card]);
        }

        if (this.standardHu(dictCardsCnt, jiangCard, bdCard, findAll, record)) {
            return true;
        }

        if (record) {
            this.finds.pop();
        }

        dictCardsCnt[card] += 3;
    }

    // aa + b
    if (dictCardsCnt[card] >= 2 && dictCardsCnt[bdCard] > 0 && card != bdCard) {
        dictCardsCnt[card] -= 2;
        dictCardsCnt[bdCard] -= 1;

        if (record) {
            this.finds.push([card, card, card]);
        }

        //找到了继续找
        if (this.standardHu(dictCardsCnt, jiangCard, bdCard, findAll, record)) {
            return true;
        }

        if (record) {
            this.finds.pop();
        }

        dictCardsCnt[card] += 2;
        dictCardsCnt[bdCard] += 1;
    }

    // a + bb 又可以是顺子
    if (dictCardsCnt[card] >= 1 && dictCardsCnt[bdCard] > 1 && card != bdCard) {
        dictCardsCnt[card] -= 1;
        dictCardsCnt[bdCard] -= 2;

        if (record) {
            this.finds.push([card, card, card]);
        }

        //找到了继续找
        if (this.standardHu(dictCardsCnt, jiangCard, bdCard, findAll, record)) {
            return true;
        }

        if (record) {
            this.finds.pop();
        }

        dictCardsCnt[card] += 1;
        dictCardsCnt[bdCard] += 2;
    }

    // 拆将牌
    // aa
    if (dictCardsCnt[card] >= 2 && jiangCard == 0) {
        dictCardsCnt[card] -= 2;
        jiangCard = card;

        if (record) {
            this.finds.push([card, card]);
        }

        if (this.standardHu(dictCardsCnt, jiangCard, bdCard, findAll, record)) {
            return true;
        }

        if (record) {
            this.finds.pop();
        }

        dictCardsCnt[card] += 2;
        jiangCard = 0;
    }

    // ab
    if (dictCardsCnt[card] >= 1 && jiangCard == 0 && dictCardsCnt[bdCard] > 0 && card != bdCard) {
        dictCardsCnt[card] -= 1;
        dictCardsCnt[bdCard] -= 1;
        jiangCard = card;

        if (record) {
            this.finds.push([card, card]);
        }

        if (this.standardHu(dictCardsCnt, jiangCard, bdCard, findAll, record)) {
            return true;
        }

        if (record) {
            this.finds.pop();
        }

        dictCardsCnt[card] += 1;
        dictCardsCnt[bdCard] += 1;
        jiangCard = 0;
    }

    // 拆顺子
    // a,a+1,a+2
    var card2 = card + 1;
    var card3 = card + 2;
    if (card < 26) {
        if (dictCardsCnt[card2] && dictCardsCnt[card3]) {
            if (dictCardsCnt[card2] > 0 && dictCardsCnt[card3] > 0 && isInSameRange([card, card2, card3], [[0, 8], [9, 17], [18, 26]])) {
                dictCardsCnt[card]--;
                dictCardsCnt[card2]--;
                dictCardsCnt[card3]--;

                if (record) {
                    this.finds.push([card, card2, card3]);
                }

                if (this.standardHu(dictCardsCnt, jiangCard, bdCard, findAll, record)) {
                    return true;
                }

                if (record) {
                    this.finds.pop();
                }

                dictCardsCnt[card]++;
                dictCardsCnt[card2]++;
                dictCardsCnt[card3]++;
            }
        }

        // b,a,a+1 | a,b,a+2 | a,a+1,b
        if (dictCardsCnt[card2] && dictCardsCnt[card2] > 0 && dictCardsCnt[bdCard] > 0 && card != bdCard && card2 != bdCard && isInSameRange([card, card2], [[0, 8], [9, 17], [18, 26]])) {
            dictCardsCnt[card]--;
            dictCardsCnt[card2]--;
            dictCardsCnt[bdCard]--;

            if (record) {
                if (card2 == 8 || card2 == 17 || card2 == 26) {
                    this.finds.push([card - 1, card, card2]);
                } else {
                    this.finds.push([card, card2, card3]);
                }
            }

            if (this.standardHu(dictCardsCnt, jiangCard, bdCard, findAll, record)) {
                return true;
            }

            if (record) {
                this.finds.pop();
            }

            dictCardsCnt[card]++;
            dictCardsCnt[card2]++;
            dictCardsCnt[bdCard]++;
        }

        if (dictCardsCnt[card3] && dictCardsCnt[card3] > 0 && dictCardsCnt[bdCard] > 0 && card != bdCard && card3 != bdCard && isInSameRange([card, card3], [[0, 8], [9, 17], [18, 26]])) {
            dictCardsCnt[card]--;
            dictCardsCnt[card3]--;
            dictCardsCnt[bdCard]--;

            if (record) {
                this.finds.push([card, card2, card3]);
            }

            if (this.standardHu(dictCardsCnt, jiangCard, bdCard, findAll, record)) {
                return true;
            }

            if (record) {
                this.finds.pop();
            }

            dictCardsCnt[card]++;
            dictCardsCnt[card3]++;
            dictCardsCnt[bdCard]++;
        }

    }

    return false;
}

prototype.standardDui = function (dictCardsCnt, findAll, record) {
    if (remainCnt(dictCardsCnt) == 0) {
        if (record) {
            this.duiGroups.push(this.finds.slice(0));
        }

        if (findAll) {
            return false;
        }

        return true;
    }

    var card = -1;
    // 先检测列表中还有没有正常牌
    var norLastCard = this.isTdh ? 51 : 39;
    for (var i = 0; i <= norLastCard; ++i) {
        if (dictCardsCnt[i] && dictCardsCnt[i] > 0) {
            card = i;
            break;
        }
    }

    // 如果没有正常牌，看还有没有百搭牌
    if (card == -1) {
        if (dictCardsCnt[52] && dictCardsCnt[52] > 0) {
            card = 52;
        }
    }

    if (card == -1) {
        return false;
    }

    // 拆将牌
    if (dictCardsCnt[card] >= 2) {
        dictCardsCnt[card] -= 2;

        if (record) {
            this.finds.push([card, card]);
        }

        // 找到了继续找
        if (this.standardDui(dictCardsCnt, findAll, record)) {
            return true;
        }

        // 失败了还原操作
        if (record) {
            this.finds.pop();
        }

        dictCardsCnt[card] += 2;
    }

    //单张和癞子牌组合
    if (dictCardsCnt[card] >= 1 && dictCardsCnt[52] > 0 && card != 52) {
        dictCardsCnt[card] -= 1;
        dictCardsCnt[52] -= 1;

        if (record) {
            this.finds.push([card, card]);
        }

        // 找到了继续找
        if (this.standardDui(dictCardsCnt, findAll, record)) {
            return true;
        }

        // 失败了还原操作
        if (record) {
            this.finds.pop();
        }

        dictCardsCnt[card] += 1;
        dictCardsCnt[52] += 1;
    }

    return false;
}

prototype.standardKeDui = function (dictCardsCnt, jiangCard, keCnt, tarKeCnt, findAll, record) {
    if (remainCnt(dictCardsCnt) == 0) {
        if (record) {
            this.keDuiGroups.push(this.finds.slice(0));
        }

        if (findAll) {
            return false;
        }

        return true;
    }

    var card = -1;
    // 先检测列表中还有没有正常牌
    var norLastCard = this.isTdh ? 51 : 39;
    for (var i = 0; i <= norLastCard; ++i) {
        if (dictCardsCnt[i] && dictCardsCnt[i] > 0) {
            card = i;
            break;
        }
    }

    // 如果没有正常牌，看还有没有百搭牌
    if (card == -1) {
        if (dictCardsCnt[52] && dictCardsCnt[52] > 0) {
            card = 52;
        }
    }

    if (card == -1) {
        return false;
    }

    // a:普通牌， b:癞子牌
    // 先从刻字开始拆
    // aaa
    if (dictCardsCnt[card] >= 3 && keCnt < tarKeCnt) {
        dictCardsCnt[card] -= 3;
        keCnt++;

        if (record) {
            this.finds.push([card, card, card]);
        }

        if (this.standardKeDui(dictCardsCnt, jiangCard, keCnt, tarKeCnt, findAll, record)) {
            return true;
        }

        if (record) {
            this.finds.pop();
        }

        dictCardsCnt[card] += 3;
        keCnt--;
    }

    // aa + b
    if (dictCardsCnt[card] >= 2 && dictCardsCnt[52] > 0 && card != 52 && keCnt < tarKeCnt) {
        dictCardsCnt[card] -= 2;
        dictCardsCnt[52] -= 1;
        keCnt++;

        if (record) {
            this.finds.push([card, card, card]);
        }

        //找到了继续找
        if (this.standardKeDui(dictCardsCnt, jiangCard, keCnt, tarKeCnt, findAll, record)) {
            return true;
        }

        if (record) {
            this.finds.pop();
        }

        dictCardsCnt[card] += 2;
        dictCardsCnt[52] += 1;
        keCnt--;
    }

    // a + bb 又可以是顺子
    if (dictCardsCnt[card] >= 1 && dictCardsCnt[52] > 1 && card != 52 && keCnt < tarKeCnt) {
        dictCardsCnt[card] -= 1;
        dictCardsCnt[52] -= 2;
        keCnt++;

        if (record) {
            this.finds.push([card, card, card]);
        }

        //找到了继续找
        if (this.standardKeDui(dictCardsCnt, jiangCard, keCnt, tarKeCnt, findAll, record)) {
            return true;
        }

        if (record) {
            this.finds.pop();
        }

        dictCardsCnt[card] += 1;
        dictCardsCnt[52] += 2;
        keCnt--;
    }

    // 拆将牌
    // aa
    if (dictCardsCnt[card] >= 2 && jiangCard == 0) {
        dictCardsCnt[card] -= 2;
        jiangCard = card;

        if (record) {
            this.finds.push([card, card]);
        }

        if (this.standardKeDui(dictCardsCnt, jiangCard, keCnt, tarKeCnt, findAll, record)) {
            return true;
        }

        if (record) {
            this.finds.pop();
        }

        dictCardsCnt[card] += 2;
        jiangCard = 0;
    }

    // ab
    if (dictCardsCnt[card] >= 1 && jiangCard == 0 && dictCardsCnt[52] > 0 && card != 52) {
        dictCardsCnt[card] -= 1;
        dictCardsCnt[52] -= 1;
        jiangCard = card;

        if (record) {
            this.finds.push([card, card]);
        }

        if (this.standardKeDui(dictCardsCnt, jiangCard, keCnt, tarKeCnt, findAll, record)) {
            return true;
        }

        if (record) {
            this.finds.pop();
        }

        dictCardsCnt[card] += 1;
        dictCardsCnt[52] += 1;
        jiangCard = 0;
    }

    return false;
}


// 只能 花麻使用
prototype.countFlower = function (lstFlower, lstHandHu, listPileCards) {
    var ret = 0;
    // 硬花
    ret = lstFlower.length;

    // 软花
    // 字暗刻
    var countMap = {}
    for (var i = lstHandHu.length - 1; i >= 0; i--) {
        var card = lstHandHu[i]
        countMap[card] = countMap[card] || 0;
        countMap[card]++;
    }

    for (var i = 27; i <= 39; i++) {
        if (countMap[i] && countMap[i] >= 3) {
            ret += NoramlFlowers[NoramlFlowerTypes.ZIANKE];
        }
    }

    for (var i = listPileCards.length - 1; i >= 0; i--) {
        var pile = listPileCards[i];
        if (pile.type == OperType.PENG) {
            if (pile.card >= 27 && pile.card <= 39) {
                ret += NoramlFlowers[NoramlFlowerTypes.ZIPENG];
            }
        }

        if (pile.type == OperType.AN_GANG) {
            if (pile.card >= 27 && pile.card <= 39) {
                ret += NoramlFlowers[NoramlFlowerTypes.ZIANGANG];
            } else {
                ret += NoramlFlowers[NoramlFlowerTypes.ANGANG];
            }
        }

        if (pile.type == OperType.ZHI_GANG || pile.type == OperType.PENG_GANG) {
            if (pile.card >= 27 && pile.card <= 39) {
                ret += NoramlFlowers[NoramlFlowerTypes.ZIMINGGANG];
            } else {
                ret += NoramlFlowers[NoramlFlowerTypes.MINGGANG];
            }
        }
    }

    return ret;
}

prototype.printHuTypes = function (lstHuTypes) {
    var ret = [];
    for (var i = 0; i < lstHuTypes.length; i++) {
        var val = lstHuTypes[i];
        for (var key in HuTypes) {
            if (HuTypes[key] == val) {
                ret.push(key);
            }
        }
    }
    // console.log(ret);
    return ret;
}

function isInRange(val, min, max) {
    return val >= min && val <= max;
}

function remainCnt(dictCardsCnt) {
    var ret = 0;

    for (var card in dictCardsCnt) {
        var cnt = dictCardsCnt[card];
        ret += cnt;
    }

    return ret;
}

function isInSameRange(vals, ranges) {
    var ret = false;

    for (var i = ranges.length - 1; i >= 0; i--) {
        var range = ranges[i];
        var firstVal = vals[0];

        var isInThisRange = isInRange(firstVal, range[0], range[1]);
        if (!isInThisRange) {
            continue;
        }

        ret = true;
        for (var j = vals.length - 1; j >= 1; j--) {
            var val = vals[j];
            if (!isInRange(val, range[0], range[1])) {
                ret = false;
            }
        }

        break;
    }

    return ret;
}

function getCardCntDict(cards) {
    var ret = {};

    for (var i = cards.length - 1; i >= 0; i--) {
        var card = cards[i];
        if (!ret[card]) {
            ret[card] = 1;
        } else {
            ret[card]++;
        }
    }

    return ret;
}

function getMJType(id) {
    if (id >= 0 && id < 9) {
        //筒
        return 0;
    }
    else if (id >= 9 && id < 18) {
        //条
        return 1;
    }
    else if (id >= 18 && id < 27) {
        //万
        return 2;
    }
    else if (id >= 27) {
        //字
        return 3;
    }
}

function containHuType(lstHuTypes, huType) {
    var ret = false;

    lstHuTypes = lstHuTypes || [];
    if (huType == null) huType = -1;

    for (var i = lstHuTypes.length - 1; i >= 0; i--) {
        if (lstHuTypes[i] == huType) {
            ret = true;
            break;
        }
    }

    return ret;
}
