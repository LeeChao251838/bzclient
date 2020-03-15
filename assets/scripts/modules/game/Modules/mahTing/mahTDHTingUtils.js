// 推到胡听牌处理
var Define = require("./mahDefine");
var TingUtils = require("./mahTingUtils");
var utils = new TingUtils(true);

// 常量
var HuTypes = Define.HuTypes;

exports.getTingCards = function (lstHand, lstPileCards, lstFlower, dictCntRiverAndPile) {
    var ret = [];

    var canCalcTingList = exports.getCanCalcTingList(dictCntRiverAndPile);

    for (var i = canCalcTingList.length - 1; i >= 0; i--) {
        var card = canCalcTingList[i];

        if (exports.checkCanHu(lstHand.concat(card), lstPileCards)) {
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

    var canNormalHu = utils.calcCombinationOfHu(lstHandHu);
    var lstHuTypes = [];

    if (canNormalHu) {
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
            if (utils.calcPengPengHu(lstHandHu, lstPileCards)) {
                lstHuTypes.push(HuTypes.DuiDuiHu);
                utils.calcPengPengHu(lstHandHu, lstPileCards, true, true);
                groups = utils.keDuiGroups;
            }
        }

        if (lstHuTypes.length == 0) {
            utils.calcCombinationOfHu(lstHandHu, null, true, true);
            groups = utils.huGroups;
        }

        utils.calcQingOrHunYiSe(groups, lstPileCards, lstHuTypes);

        if (lstHuTypes.length == 0) {
            lstHuTypes.push(HuTypes.Normal)
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
    pushCanCalcCard(43);
    pushCanCalcCard(47);
    pushCanCalcCard(51);

    return ret;
}