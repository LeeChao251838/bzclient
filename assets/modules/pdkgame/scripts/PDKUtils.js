var Def = require("PDKPokerDef");

// 扑克牌的组成包含：花色、牌点、索引
// 相同牌之间索引不相同，因此三个元素组合在一起可以区别开任意一张牌
// 组合公式：
// nCard 表示 三者唯一的组合值：nCard = ((nSuit * 13) + nPoint) * 10 + idx
// nValue 表示 牌值（花色和牌点的组合值）：nValue = (nSuit * 13) + nPoint
// nPoint 为 牌点值
// nSuit 为 花色值

// 获取nCard的牌值（花色和牌点的组合值）
exports.getValue = function (nCard) {
	return Math.floor(nCard / 10);
};

// 获取nCard的花色
exports.getSuit = function (nCard) {
	var val = exports.getValue(nCard);
	return Math.floor(val / Def.PokerPoint.PT_NONE);
};

// 获取nCard的牌点
exports.getPoint = function (nCard) {
	var val = exports.getValue(nCard);
	return val % Def.PokerPoint.PT_NONE;
};

// 获取nCard的Key值
exports.getKey = function (nCard) {
	var val = exports.getValue(nCard),
		point,
		key;

	if (val == Def.PokerValue.JOKER_B) {
		return Def.PokerKey.PK_B;
	} else if (val == Def.PokerValue.JOKER_R) {
		return  Def.PokerKey.PK_R;
	} else {
		point = exports.getPoint(nCard);
		key = Def.PokerMap[point];

		if (key) {
			return key;
		}
	}

	return "";
};

// 获取牌的名称
exports.getPokerName = function (nCard) {
	var val = exports.getValue(nCard),
		point,
		key,
		suit;

	if (val == Def.PokerValue.JOKER_B) {
		return "Jb";
	} else if (val == Def.PokerValue.JOKER_R) {
		return  "Jr";
	} else {
		point = exports.getPoint(nCard);
		key = Def.PokerMap[point];

		if (key) {
			suit = exports.getSuit(nCard);
			switch (suit) {
				case Def.PokerSuit.DIAMOND:
					return 'D' + key;
				case Def.PokerSuit.CLUB:
					return 'C' + key;
				case Def.PokerSuit.HEART:
					return 'H' + key;
				case Def.PokerSuit.SPADE:
					return 'S' + key;
			}
			return key;
		}
	}

	return "unknow";
};

//删除选中的牌
exports.removeCards = function (cards, removeCards) {
	var idx,
		removeCard,
		i;

	if (removeCards.length == 0) {
		return;
	}

	for (idx in removeCards) {
		removeCard = removeCards[idx];
		for (i = 0; i< cards.length; i++) {
			if (cards[i] == removeCard) {
				cards.splice(i,1);
				break;
			}
		}
	}
};

exports.isPairs = function (strKey, strExcept) {
	var keyLen = strKey.length,
		dictCnt = {},
		i,
		key,
		exceptLen,
		singleCnt = 0;

	if (keyLen % 2 != 0) {
		return false;
	}

	for (i = 0; i < keyLen; i++) {
		key = strKey[i];
		if(dictCnt[key] == null) {
			dictCnt[key] = 1;
		} else {
			dictCnt[key] ++;
		}
	}

	exceptLen = strExcept.length;
	for (i = 0; i < exceptLen; i++) {
		key = strExcept[i];
		if (dictCnt[key] && dictCnt[key] % 2 != 0) {
			return false;
		}
	}

	for (key in dictCnt) {
		if (key != 'X' && dictCnt[key] % 2 != 0) {
			singleCnt ++;
		}
	}

	if (dictCnt['X']) {
		return singleCnt <= dictCnt['X'];
	} else {
		return singleCnt == 0;
	}
};

// 是否全部为相同牌值的牌
exports.isSameValue = function (lstCards) {
	if(lstCards == null || lstCards.length == 0){
        return false;
    }

    // 取第一张牌值
    var nValue = exports.getValue(lstCards[0]);
    for(var i = 0; i < lstCards.length; i++){
        if(exports.getValue(lstCards[i]) != nValue){
            return false;
        }
    }
    return true;
};

exports.isSameKey = function (lstCards) {
	if (lstCards == null || lstCards.length == 0) {
		return false;
	}

	var key = exports.getKey(lstCards[0]);
	for (var i=0;i<lstCards.length;i++) {
		if (exports.getKey(lstCards[i]) != key) {
			return false;
		}
	}

	return true; 
};

exports.countCardsByKey = function (lstCards) {
	var dictNum = {};

	for(var i=0;i<lstCards.length;i++){
		var key = exports.getKey(lstCards[i]);
		if (dictNum[key]) {
			dictNum[key]++;
		} else {
			dictNum[key] = 1;
		}
	}

	return dictNum;
};