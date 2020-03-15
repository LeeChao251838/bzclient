// 百搭或花麻将听牌处理
var Define = require("./mahDefine");
var TingUtils = require("./mahTingUtils");
var utils = new TingUtils();

// 常量
var HuTypes = Define.HuTypes;

// 配置

var config = {
    canZiMoFlowerCnt: 3,
    canChongFlowerCnt: 4,
    canHuQiDui: true,
    canHuHaoQi: true,
    isBaiDa: true,
}

// 导出接口
var exports = module.exports;

exports.setCanHuQiDui = function (res) {
    config.canHuQiDui = res;
};

exports.setCanHuHaoQi = function (res) {
    config.canHuHaoQi = res;
};

exports.setIsBaiDa = function (res) {
    config.isBaiDa = res;

    if (res) {
        config.canHuHaoQi = false;
    } else {
        config.canHuQiDui = true;
    }
};

exports.getTingCards = function (lstHand, lstPileCards, lstFlower, dictCntRiverAndPile) {
    var ret = [];

    var canCalcTingList = exports.getCanCalcTingList(dictCntRiverAndPile);

    for (var i = canCalcTingList.length - 1; i >= 0; i--) {
        var card = canCalcTingList[i];

        if (exports.checkCanHu(lstHand.concat(card), lstPileCards, lstFlower)) {
            ret.push(card);
        }
    }

    // console.log(ret);
    return ret;
};

exports.getPileCards = function (seatData) {
    return utils.getPileCards(seatData);
};

exports.getDictCntRiverAndPile = function (seatDatas) {
    return utils.getDictCntRiverAndPile(seatDatas);
};

// 综合接口

exports.checkCanHu = function (lstHandHu, lstPileCards, lstFlower) {

    var canQiDui = config.canHuQiDui && utils.calcQiDui(lstHandHu);
    var canNormalHu = utils.calcCombinationOfHu(lstHandHu);
    var lstHuTypes = [];

    if (canQiDui || canNormalHu) {
        var lstHandHuUnsort = lstHandHu.slice(0);
        var lstHand = lstHandHu.slice(0);
        lstHand.splice(lstHand.length - 1, 1);
        var lstAllCards = lstHandHu.slice(0);
        for (var i = lstPileCards.length - 1; i >= 0; i--) {
            var pile = lstPileCards[i];
            lstAllCards.push(pile.card);
        }

        var sortFun = function (lhs, rhs) { return lhs - rhs; };
        lstHandHu.sort(sortFun);
        lstAllCards.sort(sortFun);

        var groups = [];
        if (lstHandHu.length < 14) {
            if (utils.calcDaDiaoChe(lstPileCards)) {
                lstHuTypes.push(HuTypes.DaDiaoChe);
                groups = [[lstHandHu[0], lstHandHu[1]]];

            } else if (utils.calcPengPengHu(lstHandHu, lstPileCards)) {
                lstHuTypes.push(HuTypes.DuiDuiHu);
                utils.calcPengPengHu(lstHandHu, lstPileCards, true, true);
                groups = utils.keDuiGroups;
            }

        } else {
            if (canQiDui) {
                lstHuTypes.push(HuTypes.QiDui);
                utils.calcQiDui(lstHandHu, true, true);
                groups = utils.duiGroups;

            } else if (utils.calcPengPengHu(lstHandHu, lstPileCards)) {
                lstHuTypes.push(HuTypes.DuiDuiHu);
                utils.calcPengPengHu(lstHandHu, lstPileCards, true, true);
                groups = utils.keDuiGroups;
            }
        }

        if (lstHuTypes.length == 0) {
            utils.calcCombinationOfHu(lstHandHu, 52, true, true);
            groups = utils.huGroups;
        }

        utils.calcQingOrHunYiSe(groups, lstPileCards, lstHuTypes);

        if (config.isBaiDa) {
            // 无百搭
            if (utils.calcNoBaiDa(lstHandHu)) {
                lstHuTypes.push(HuTypes.NoBaiDa);
            }
            //吊百搭（之前要先判断是否是七对）
            else if (utils.calcDiaoBaiDa(lstHandHuUnsort, lstHuTypes)) {
                lstHuTypes.push(HuTypes.DiaoBaiDa);
            }
        }

        if (!config.isBaiDa && config.canHuHaoQi) {
            if (canQiDui && utils.calcHaoQiTypes(lstHandHu)) lstHuTypes.push(HuTypes.HaoQi);
        }

        // 大门清
        if (utils.calcDaMenQing(lstPileCards, lstFlower, lstHandHu)) lstHuTypes.push(HuTypes.DaMenQing);
        // 小门清
        if (utils.calcXiaoMenQing(lstPileCards)) lstHuTypes.push(HuTypes.XiaoMenQing);

        var flowerCnt = utils.countFlower(lstFlower, lstHandHu, lstPileCards);

        // 三花自摸，四花冲
        if (lstHuTypes.length == 0) {
            if (flowerCnt >= config.canZiMoFlowerCnt) {
                lstHuTypes.push(HuTypes.Normal)
            }
        }
    }

    if (lstHuTypes.length > 0) utils.printHuTypes(lstHuTypes);
    return lstHuTypes.length > 0;
}

exports.getCanCalcTingList = function (dictCntRiverAndPile) {
    var ret = [];

    var pushCanCalcCard = function (card) {
        if (!dictCntRiverAndPile[card] || dictCntRiverAndPile[card] < 4) {
            ret.push(card);
        }
    };

    for (var i = 0; i <= 26; i++) {
        pushCanCalcCard(i);
    }

    pushCanCalcCard(27);
    pushCanCalcCard(31);
    pushCanCalcCard(35);
    pushCanCalcCard(39);
    // console.log("config.isBaiDa = " + config.isBaiDa);
    if (config.isBaiDa) {
        pushCanCalcCard(52);
    }

    return ret;
}
