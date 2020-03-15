const Def = require("./tingdefine");
const CardDef = Def.CardDef;

const huFuncs = [findKeZi, findJiangPai, findShunZi];
const keDuiFuncs = [findKeZi, findJiangPai];
const duiFuncs = [findDuiZi];
const GangDuifuncs = [findFourSame, findJiangPai]; // (4个一样的)* + （对子）+

let huGroups = [];
let finds = [];

function calcCombinationOfHu (cards, hasJiang, bdCard, findAll, record, replace, isBDSingle) {
    hasJiang = hasJiang || false;
    findAll = findAll || false;
    record = record || false;
    bdCard = bdCard == null ? CardDef.BaiDaCard : bdCard;
    replace = replace == null ? true : replace;
    isBDSingle = isBDSingle || false;

    finds = [];
    huGroups = [];

    if (cards.length == 0) return false;

    let dictCardsCnt = getCardCntDict(cards);

    return standardHu(dictCardsCnt, (hasJiang ? 1 : 0), bdCard, findAll, record, replace, isBDSingle);
};

function calcCombinationOfKeDui (cards, hasJiang, bdCard, findAll, record, replace, isBDSingle) {
    hasJiang = hasJiang || false;
    findAll = findAll || false;
    record = record || false;
    bdCard = bdCard == null ? CardDef.BaiDaCard : bdCard;
    replace = replace == null ? true : replace;
    isBDSingle = isBDSingle || false;

    finds = [];
    huGroups = [];

    if (cards.length == 0) return false;

    let dictCardsCnt = getCardCntDict(cards);

    return standardKeDui(dictCardsCnt, (hasJiang ? 1 : 0), bdCard, findAll, record, replace, isBDSingle);
};

function calcCombinationOfDui (cards, bdCard, findAll, record, replace, isBDSingle) {
    findAll = findAll || false;
    record = record || false;
    bdCard = bdCard == null ? CardDef.BaiDaCard : bdCard;
    replace = replace == null ? true : replace;
    isBDSingle = isBDSingle || false;

    finds = [];
    huGroups = [];

    if (cards.length == 0) return false;

    let dictCardsCnt = getCardCntDict(cards);

    return standardDui(dictCardsCnt, 0, bdCard, findAll, record, replace, isBDSingle);
};

function calcCombinationOfGangDui (cards, bdCard, findAll, record, replace, isBDSingle) {
    findAll = findAll || false;
    record = record || false;
    bdCard = bdCard == null ? CardDef.BaiDaCard : bdCard;
    replace = replace == null ? true : replace;
    isBDSingle = isBDSingle || false;

    finds = [];
    huGroups = [];

    if (cards.length == 0) return false;

    let dictCardsCnt = getCardCntDict(cards);

    return standardGangDui(dictCardsCnt, 0, bdCard, findAll, record, replace, isBDSingle);
};

function getHuGroups () {
    return huGroups;
};

function standardHu (dictCardsCnt, jiangCard, bdCard, findAll, record, replace, isBDSingle) {
    return standard(dictCardsCnt, jiangCard, bdCard, findAll, record, replace, isBDSingle, huFuncs);
}

function standardKeDui(dictCardsCnt, jiangCard, bdCard, findAll, record, replace, isBDSingle) {
    return standard(dictCardsCnt, jiangCard, bdCard, findAll, record, replace, isBDSingle, keDuiFuncs);
}

function standardDui(dictCardsCnt, jiangCard, bdCard, findAll, record, replace, isBDSingle) {
    return standard(dictCardsCnt, jiangCard, bdCard, findAll, record, replace, isBDSingle, duiFuncs);
}

function standardGangDui(dictCardsCnt, jiangCard, bdCard, findAll, record, replace, isBDSingle) {
    return standard(dictCardsCnt, jiangCard, bdCard, findAll, record, replace, isBDSingle, GangDuifuncs);
}

function standard(dictCardsCnt, jiangCard, bdCard, findAll, record, replace, isBDSingle, findFuns) {
    if (remainCnt(dictCardsCnt) == 0) {
        if (record) huGroups.push(finds.slice());

        if (findAll) return false;

        return true;
    }

    let card = findCard(dictCardsCnt, bdCard);

    if (card == -1) {
        return false;
    }

    let findOtherFun = (dictCardsCnt, jiangCard) => standard(dictCardsCnt, jiangCard, bdCard, findAll, record, replace, isBDSingle, findFuns);

    return findFuns.find(findFun => findFun(dictCardsCnt, card, jiangCard, bdCard, record, replace, isBDSingle, findOtherFun)) != null;
}

function findCard(dictCardsCnt, bdCard) {
    let ret = -1;

    for (let key in dictCardsCnt) {
        key = parseInt(key);
        if (dictCardsCnt[key] > 0 && key != bdCard) {
            ret = key;
            break;
        }
    }

    if (ret == -1 && dictCardsCnt[bdCard] && dictCardsCnt[bdCard] > 0) ret = bdCard;

    return ret;
}

function findKeZi (dictCardsCnt, card, jiangCard, bdCard, record, replace, isBDSingle, cb) {
    // a:普通牌， b:癞子牌
    // aaa
    if (dictCardsCnt[card] >= 3) {
        if(isBDSingle && (card == bdCard)){
            return false;
        }
        dictCardsCnt[card] -= 3;

        if (record) {
            finds.push([card, card, card]);
        }

        if (cb(dictCardsCnt, jiangCard)) {
            return true;
        }

        if (record) {
            finds.pop();
        }

        dictCardsCnt[card] += 3;
    }

    // aa + b
    if (dictCardsCnt[card] >= 2 && dictCardsCnt[bdCard] > 0 && card != bdCard) {
        dictCardsCnt[card] -= 2;
        dictCardsCnt[bdCard] -= 1;

        if (record) {
            if (replace) {
                finds.push([card, card, card]);
            } else {
                finds.push([card, card, bdCard]);
            }
        }

        if (cb(dictCardsCnt, jiangCard)) {
            return true;
        }

        if (record) {
            finds.pop();
        }

        dictCardsCnt[card] += 2;
        dictCardsCnt[bdCard] += 1;
    }

    // a + bb 又可以是顺子
    if (!isBDSingle && dictCardsCnt[card] >= 1 && dictCardsCnt[bdCard] > 1 && card != bdCard) {
        dictCardsCnt[card] -= 1;
        dictCardsCnt[bdCard] -= 2;

        if (record) {
            if (replace) {
                finds.push([card, card, card]);
            } else {
                finds.push([card, bdCard, bdCard]);
            }
        }
        
        if (cb(dictCardsCnt, jiangCard)) {
            return true;
        }

        if (record) {
            finds.pop();
        }

        dictCardsCnt[card] += 1;
        dictCardsCnt[bdCard] += 2;
    }
    
    return false;
}

function findJiangPai (dictCardsCnt, card, jiangCard, bdCard, record, replace, isBDSingle, cb) {
    // a:普通牌， b:癞子牌
    // aa
    if (dictCardsCnt[card] >= 2 && jiangCard == 0) {
        if(isBDSingle && (card == bdCard)){
            return false;
        }
        dictCardsCnt[card] -= 2;
        jiangCard = 1;

        if (record) {
            finds.push([card, card]);
        }

        if (cb(dictCardsCnt, jiangCard)) {
            return true;
        }

        if (record) {
            finds.pop();
        }

        dictCardsCnt[card] += 2;
        jiangCard = 0;
    }

    // ab
    if (dictCardsCnt[card] >= 1 && jiangCard == 0 && dictCardsCnt[bdCard] > 0 && card != bdCard) {
        dictCardsCnt[card] -= 1;
        dictCardsCnt[bdCard] -= 1;
        jiangCard = 1;

        if (record) {
            if (replace) {
                finds.push([card, card]);
            } else {
                finds.push([card, bdCard]);
            }
        }

        if (cb(dictCardsCnt, jiangCard)) {
            return true;
        }

        if (record) {
            finds.pop();
        }

        dictCardsCnt[card] += 1;
        dictCardsCnt[bdCard] += 1;
        jiangCard = 0;
    }

    return false;
}

function findDuiZi (dictCardsCnt, card, jiangCard, bdCard, record, replace, isBDSingle, cb) {
    // a:普通牌， b:癞子牌
    // aa
    if (dictCardsCnt[card] >= 2) {
        if(isBDSingle && (card == bdCard)){
            return false;
        }
        dictCardsCnt[card] -= 2;

        if (record) {
            finds.push([card, card]);
        }

        if (cb(dictCardsCnt, jiangCard)) {
            return true;
        }

        if (record) {
            finds.pop();
        }

        dictCardsCnt[card] += 2;
    }

    // ab
    if (dictCardsCnt[card] >= 1 && dictCardsCnt[bdCard] > 0 && card != bdCard) {
        dictCardsCnt[card] -= 1;
        dictCardsCnt[bdCard] -= 1;

        if (record) {
            if (replace) {
                finds.push([card, card]);
            } else {
                finds.push([card, bdCard]);
            }
        }

        if (cb(dictCardsCnt, jiangCard)) {
            return true;
        }

        if (record) {
            finds.pop();
        }

        dictCardsCnt[card] += 1;
        dictCardsCnt[bdCard] += 1;
    }

    return false;
}

function findFourSame (dictCardsCnt, card, jiangCard, bdCard, record, replace, isBDSingle, cb) {
    // a:普通牌， b:癞子牌
    // aaaa
    if (dictCardsCnt[card] >= 4) {
        if(isBDSingle && (card == bdCard)){
            return false;
        }
        dictCardsCnt[card] -= 4;

        if (record) {
            finds.push([card, card, card, card]);
        }

        if (cb(dictCardsCnt, jiangCard)) {
            return true;
        }

        if (record) {
            finds.pop();
        }

        dictCardsCnt[card] += 4;
    }

    // aaa + b
    if (dictCardsCnt[card] >= 3 && dictCardsCnt[bdCard] > 0 && card != bdCard) {
        dictCardsCnt[card] -= 3;
        dictCardsCnt[bdCard] -= 1;

        if (record) {
            if (replace) {
                finds.push([card, card, card, card]);
            } else {
                finds.push([card, card, card, bdCard]);
            }
        }

        if (cb(dictCardsCnt, jiangCard)) {
            return true;
        }

        if (record) {
            finds.pop();
        }

        dictCardsCnt[card] += 3;
        dictCardsCnt[bdCard] += 1;
    }

    // aa + bb 
    if (dictCardsCnt[card] >= 2 && dictCardsCnt[bdCard] > 1 && card != bdCard) {
        dictCardsCnt[card] -= 2;
        dictCardsCnt[bdCard] -= 2;

        if (record) {
            if (replace) {
                finds.push([card, card, card, card]);
            } else {
                finds.push([card, card, bdCard, bdCard]);
            }
        }
        
        if (cb(dictCardsCnt, jiangCard)) {
            return true;
        }

        if (record) {
            finds.pop();
        }

        dictCardsCnt[card] += 2;
        dictCardsCnt[bdCard] += 2;
    }

    // a + bbb 
    if (!isBDSingle && dictCardsCnt[card] >= 1 && dictCardsCnt[bdCard] > 2 && card != bdCard) {
        dictCardsCnt[card] -= 1;
        dictCardsCnt[bdCard] -= 3;

        if (record) {
            if (replace) {
                finds.push([card, card, card, card]);
            } else {
                finds.push([card, bdCard, bdCard, bdCard]);
            }
        }
        
        if (cb(dictCardsCnt, jiangCard)) {
            return true;
        }

        if (record) {
            finds.pop();
        }

        dictCardsCnt[card] += 1;
        dictCardsCnt[bdCard] += 3;
    }
    
    return false;
}

function findShunZi (dictCardsCnt, card, jiangCard, bdCard, record, replace, isBDSingle, cb) {
    for (let i = 0; i < 3; i++) {
        let card1 = card - 2 + i;
        let card2 = card - 1 + i;
        let card3 = card + i;

        // 范围
        if (isInSameRange([card1,card2,card3],[[CardDef.MinTongCard, CardDef.MaxTongCard],[CardDef.MinTiaoCard, CardDef.MaxTiaoCard],[CardDef.MinWanCard, CardDef.MaxWanCard]])) {
            // card1, card2, card3
            if (dictCardsCnt[card1] > 0 && dictCardsCnt[card2] > 0 && dictCardsCnt[card3] > 0) {
                dictCardsCnt[card1] --;
                dictCardsCnt[card2] --;
                dictCardsCnt[card3] --;

                if (record) {
                    finds.push([card1, card2, card3]);
                }

                if (cb(dictCardsCnt, jiangCard)) {
                    return true;
                }

                if (record) {
                    finds.pop();
                }

                dictCardsCnt[card1] ++;
                dictCardsCnt[card2] ++;
                dictCardsCnt[card3] ++;
            }

            // card1, card2, baida
            if (dictCardsCnt[card1] > 0 && dictCardsCnt[card2] > 0 && dictCardsCnt[bdCard] > 0 && card1 != bdCard && card2 != bdCard) {

                dictCardsCnt[card1] --;
                dictCardsCnt[card2] --;
                dictCardsCnt[bdCard] --;

                if (record) {
                    if (replace) {
                        finds.push([card1, card2, card3]);
                    } else {
                        finds.push([card1, card2, bdCard]);
                    }
                    
                }

                if (cb(dictCardsCnt, jiangCard)) {
                    return true;
                }

                if (record) {
                    finds.pop();
                }

                dictCardsCnt[card1] ++;
                dictCardsCnt[card2] ++;
                dictCardsCnt[bdCard] ++;
            }

            // card1, baida, card3
            if (dictCardsCnt[card1] > 0 && dictCardsCnt[card3] > 0  && dictCardsCnt[bdCard] > 0 && card1 != bdCard && card3 != bdCard) {

                dictCardsCnt[card1] --;
                dictCardsCnt[card3] --;
                dictCardsCnt[bdCard] --;

                if (record) {
                    if (replace) {
                        finds.push([card1, card2, card3]);
                    } else {
                        finds.push([card1, bdCard, card3]);
                    }
                }

                if (cb(dictCardsCnt, jiangCard)) {
                    return true;
                }

                if (record) {
                    finds.pop();
                }

                dictCardsCnt[card1] ++;
                dictCardsCnt[card3] ++;
                dictCardsCnt[bdCard] ++;
            }

            // baida, card2, card3
            if (dictCardsCnt[card2] > 0 && dictCardsCnt[card3] > 0  && dictCardsCnt[bdCard] > 0 && card2 != bdCard && card3 != bdCard) {

                dictCardsCnt[card2] --;
                dictCardsCnt[card3] --;
                dictCardsCnt[bdCard] --;

                if (record) {
                    if (replace) {
                        finds.push([card1, card2, card3]);
                    } else {
                        finds.push([bdCard, card2, card3]);
                    }
                }

                if (cb(dictCardsCnt, jiangCard)) {
                    return true;
                }

                if (record) {
                    finds.pop();
                }

                dictCardsCnt[card2] ++;
                dictCardsCnt[card3] ++;
                dictCardsCnt[bdCard] ++;
            }

            // card1, baida, baida
            if (!isBDSingle && dictCardsCnt[card1] > 0 && card1 != bdCard && dictCardsCnt[bdCard] > 1) {

                dictCardsCnt[card1] --;
                dictCardsCnt[bdCard] -= 2;

                if (record) {
                    if (replace) {
                        finds.push([card1, card2, card3]);
                    } else {
                        finds.push([card1, bdCard, bdCard]);
                    }
                }

                if (cb(dictCardsCnt, jiangCard)) {
                    return true;
                }

                if (record) {
                    finds.pop();
                }

                dictCardsCnt[card1] ++;
                dictCardsCnt[bdCard] += 2;
            }

            // baida, card2, baida
            if (!isBDSingle && dictCardsCnt[card2] > 0 && card2 != bdCard && dictCardsCnt[bdCard] > 1) {

                dictCardsCnt[card2] --;
                dictCardsCnt[bdCard] -= 2;

                if (record) {
                    if (replace) {
                        finds.push([card1, card2, card3]);
                    } else {
                        finds.push([bdCard, card2, bdCard]);
                    }
                }

                if (cb(dictCardsCnt, jiangCard)) {
                    return true;
                }

                if (record) {
                    finds.pop();
                }

                dictCardsCnt[card2] ++;
                dictCardsCnt[bdCard] += 2;
            }

            // baida, baida, card3
            if (!isBDSingle && dictCardsCnt[card3] > 0 && card3 != bdCard && dictCardsCnt[bdCard] > 1) {

                dictCardsCnt[card3] --;
                dictCardsCnt[bdCard] -= 2;

                if (record) {
                    if (replace) {
                        finds.push([card1, card2, card3]);
                    } else {
                        finds.push([bdCard, bdCard, card3]);
                    }
                }

                if (cb(dictCardsCnt, jiangCard)) {
                    return true;
                }

                if (record) {
                    finds.pop();
                }

                dictCardsCnt[card3] ++;
                dictCardsCnt[bdCard] += 2;
            }
        }
    }
 
    return false;
}

function isInSameRange (vals, ranges) {
    let ret = false;

    for (let i = ranges.length - 1; i >= 0; i--) {
        let range = ranges[i];
        let firstVal = vals[0];

        let isInThisRange = isInRange(firstVal, range[0],range[1]);
        if (!isInThisRange) {
            continue;
        }

        ret = true;
        for (let j = vals.length - 1; j >= 1; j--) {
            let val = vals[j];
            if (!isInRange(val, range[0],range[1]))
            {
                ret = false;
            }
        }

        break;
    }

    return ret;
}

function isInRange (val, min, max) {
    return val >= min && val <= max;
}

function remainCnt (dictCardsCnt) {
    let ret = 0;

    for(let card in dictCardsCnt) {
        let cnt = dictCardsCnt[card];
        ret += cnt;
    }

    return ret;
}

function getCardCntDict (cards) {
    let ret = {};

    for (let i = cards.length - 1; i >= 0; i--) {
        let card = cards[i];
        if (!ret[card]) {
            ret[card] = 1;
        }else{
            ret[card]++;
        }
    }

    return ret;
}

module.exports = {
    calcCombinationOfHu,
    calcCombinationOfKeDui,
    calcCombinationOfDui,
    calcCombinationOfGangDui,
    standardHu,
    standardKeDui,
    standardDui,
    standardGangDui,
    getHuGroups,
    isInSameRange,
    isInRange,
    getCardCntDict,
};

// console.log(standardDui({'1':2}, 0, 52, false, false, true));
// console.log(getCardCntDict([1,1]))

//calcCombinationOfKeDui([1,1,0,52,0], false, 52, true, true, false);
// calcCombinationOfGangDui([1,1,1,1,2,2,2,2,52,52,52,52,6,7], 52, true, true);
//  calcCombinationOfHu([1,1,0,0,52], false, 52, true, true, false);
// console.log(getHuGroups());
// let res =  calcCombinationOfGangDui([1,1,1,1,2,2,2,2,3,3,4,4,7,7], 52);
// console.log(res);