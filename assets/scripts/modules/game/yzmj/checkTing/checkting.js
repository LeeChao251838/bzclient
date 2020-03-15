var MahUtil = require('./util');
var TingUtils =  require('../../Modules/mahTing/mahTingUtils');
var utils = new TingUtils(true);
const WanFaType = {
    JingYuanZi: 0, //进园子
    ChangPao: 1,	//紧趟
    DaiPeiZi: 2, //带配子
    PeiZiKeDianPao: 3,
    DaiQiDui: 4,
    YiTiaoLong: 5
};
const CardType = {
    Null: 0,
    Tong: 1,
    Tiao: 2,
    Wan: 3,
    Zi: 4,
};
const CardDef = {
    MinTongCard: 0,
    MaxTongCard: 8,
    MinTiaoCard: 9,
    MaxTiaoCard: 17,
    MinWanCard: 18,
    MaxWanCard: 26,
    DongCard: 27,
    NanCard: 31,
    XiCard: 35,
    BeiCard: 39,
    ZhongCard: 43,
    FaCard: 47,
    BaiCard: 51,
    BaiDaCard: 52,
    DaBaiBanCard: 53,
    ChunCard: 54,
    XiaCard: 55,
    QiuCard: 56,
    DongCardHua: 57,
    MeiCard: 58,
    LanCard: 59,
    ZhuCard: 60,
    JuCard: 61,
    AnyCharacter:100,
    AnyDot:101,
    AnyBamboo:102,
    AnyWind:103,
    AnyCard:104,

    characterArr:[18,19,20,21,22,23,24,25,26],
    dotArr:[0,1,2,3,4,5,6,7,8],
    bambooArr:[9,10,11,12,13,14,15,16,17],
    windArr:[27,31,35,39,43,47,51],
    totalArr:[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,31,35,39,43,47,51],
};

const HuType = {
    XiaoHuZi: 0, // 小胡子
    DuiDuiHu: 1, // 对对胡
    HunYiSe: 2, // 混一色
    YiTiaoLong: 3, // 一条龙
    QiDui: 4, // 七小对
    QingYiSe: 5, // 清一色
    HunDuiDui: 6, // 混对对
    HunQiDui: 7, // 混七对
    ShuangQi: 8, // 双七对
    QingDuiDui: 9, // 清对对
    QingQiDui: 10, // 清七对
    HaoShuangQi: 11, // 豪华双七对
    FengQing: 12, // 风清
    HunLong: 35, //混龙
    QingLong: 36, //清龙
};

function checkHu(hand, conf, plieCard, baida) {
    let lstHandHu = hand.slice();


    let canQiDui = calcQiDui(conf, lstHandHu, baida);
    let canNormalHu = MahUtil.calcCombinationOfHu(lstHandHu, false, baida, false, false, true, conf.type == cc.GAMETYPE.JDMJ);

    // let hasBaida = lstHandHu.indexOf(baida) == -1 ? false : true;
    if(conf.type == cc.GAMETYPE.HZEMJ){
        canQiDui = false;
    }

    if (!canQiDui && !canNormalHu) {
        return false;
    }
    // console.log(lstHandHu)
    //console.log(1);
    return true;

}

// -- 牌型计算 --
function calcQiDui(conf, cards, baida) {
    if(conf.type == cc.GAMETYPE.JDMJ) return false;
    
    if (conf.type == 18 && conf.wanfa.indexOf(WanFaType.DaiQiDui) == -1) {

    // if (conf.type == cc.GAMETYPE.yzmj_yangzhou_tdh && conf.wanfa.indexOf(WanFaType.DaiQiDui) == -1) {
        return false;
    }

    if (conf.type == cc.GAMETYPE.YZTWO && conf.wanfa.indexOf(WanFaType.DaiQiDui) == -1) {
        return false;
    }
    if (cards.length == 0) {
        return false;
    }
    if (cards.length != 14) {
        return false;
    }
    return MahUtil.calcCombinationOfDui(cards, baida);
}

exports.getTingCards = function (lstHand, conf, plieCard, baida) {
    var ret = [];

    //江都麻将 有花牌不能胡
    if(conf.type == cc.GAMETYPE.JDMJ){
        for (let index = 0; index < lstHand.length; index++) {
            const element = lstHand[index];
            if([CardDef.ChunCard, CardDef.XiaCard, CardDef.QiuCard, CardDef.DongCardHua].indexOf(element) > 0){
                return ret;
            }

        }
    }

// console.log("开始算牌 : " );
// console.log(Date.now());
    var canCalcTingList = getCanCalcTingList(conf);
    for (var i = canCalcTingList.length - 1; i >= 0; i--) {
        var card = canCalcTingList[i];
//         console.log("第" + i+ "次 算牌时间： ")
// console.log(Date.now());
        if (checkHu(lstHand.concat(card), conf, plieCard, baida)) {
            ret.push(card);
        }
    }

    //  console.log("结束算牌: ")
    // console.log(Date.now());
    //  console.log("result",ret);
    // return ret;
    let _arr = [];
    for(let i=0;i<ret.length;i++){
        if(ret[i] >= 0){
            _arr.push(ret[i]);
        }
    }
    
    if(conf.type == cc.GAMETYPE.SZCT){
        if(_arr.length == 1 && _arr[0] == 43){
            return [CardDef.AnyCard];
        }
    }
    else if(_arr.length == 1 && cc.fy.mahjongmgr.isBaida(_arr[0])){
        return [CardDef.AnyCard];
    }
    return exports.sortResult(ret,baida);
};

exports.sortResult = function(rett,baida){
    // console.log("sort0000",ret);
let ret = rett.slice();
    let sortArr = [];
    let typeArr = [CardDef.characterArr,CardDef.dotArr,CardDef.bambooArr,CardDef.windArr];
    if (utils.isContained(ret,CardDef.totalArr)) {
        sortArr.push(CardDef.AnyCard);
            // console.log(sortArr);
        return sortArr;
    }
    if (utils.array_contain(ret,baida) && baida != -1) {
        sortArr.push(baida);
        ret.splice(ret.indexOf(baida),1);
    }

    for (var i = 0; i < typeArr.length; i++) {
        let typePaiArr = typeArr[i];
        //是否完整包含万桶条风
        if (utils.isContained(ret,typePaiArr)) {
            sortArr.push(i + 100);
        }
        //不包含按顺序添加
        else{
            for (var x = 0; x < typePaiArr.length; x++) {
                let pai = typePaiArr[x];
                if (utils.array_contain(ret,pai)) {
                    sortArr.push(pai);
                }
            }
        }
    }

    // console.log("sort",sortArr);

    return sortArr;
};

// let totalArr = [27, 14, 13, 12, 11, 10, 8, 7, 6, 5, 2 ];
// exports.sortResult(totalArr,27);

function getCanCalcTingList(conf) {
    var ret = [];

    var pushCanCalcCard = function (card) {
        // if (!dictCntRiverAndPile[card] || dictCntRiverAndPile[card] < 4) {
        ret.push(card);
        // }
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

    if (conf.type == cc.GAMETYPE.JDMJ) {
        pushCanCalcCard(52);
    }
    else if (conf.wanfa.indexOf(WanFaType.DaiPeiZi) != -1) {
        pushCanCalcCard(52);
    }
    else {
        pushCanCalcCard(-1);
    }

    return ret;
}

exports.getDictCntRiverAndPile = function (seatDatas) {
    return utils.getDictCntRiverAndPile(seatDatas);
};


 //let lsthand = [0,0,0,0,1,1,2,2,3,3,27,27,27],
// // let lsthand = [1,1,2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7],
//  let lsthand = [39,39, 26, 26],
//      wanfa = [0, 2, 3, 4, 5],//[WanFaType.ChangPao, WanFaType.DaiPeiZi, WanFaType.DaiQiDui, WanFaType.YiTiaoLong],
// // //     wanfa = [7],
//      conf = {"wanfa":wanfa,"type":19};
//      plieCard =[];// [20,2,3,44],
//      baida = 39;
//  console.log(exports.getTingCards(lsthand, conf, plieCard, baida));