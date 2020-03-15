// 推到胡听牌处理
var Define = require("./mahDefine");
var TingUtils = require("./mahTingUtils");
var utils = new TingUtils(true);
// 常量
var HuTypes = Define.HuTypes;
exports.getTingCards = function (lstHand, lstPileCards, lstFlower, dictCntRiverAndPile, bdCard) {
    var ret = [];

    var canCalcTingList = exports.getCanCalcTingList(dictCntRiverAndPile);

    for (var i = canCalcTingList.length - 1; i >= 0; i--) {
        var card = canCalcTingList[i];

        if (exports.checkCanHu(lstHand.concat(card), lstPileCards, bdCard)) {
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

exports.checkCanHu = function (lstHandHu, lstPileCards, bdCard) {
    var canNormalHu = utils.calcCombinationOfHu(lstHandHu, bdCard);
    var lstHuTypes = [];
    if (canNormalHu) {
        if (utils.calcDaDiaoChe(lstPileCards)) {
            lstHuTypes.push(HuTypes.DaDiaoChe);
        }
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