var PokerDef = require("PDKPokerDef");
var PokerUtil = require("PDKUtils");

exports.getMaxPokerTypeAndKey = function (cards, xPokerPoint, wanfa) {
	var xHeartPokerValue = -1;
	if (xPokerPoint != null && xPokerPoint >= 0) {
		xHeartPokerValue = PokerDef.PokerPoint.PT_NONE * PokerDef.PokerSuit.HEART + xPokerPoint;
	}
	var ret = {
		type: PokerDef.PokerType.INVALID,
		key: "",
		len: cards == null ? 0 : cards.length,
	};


	if (cards == null || cards.length == 0) {
		return ret;
	}

	//连对
	if (cards.length >= 4 && cards.length % 2 == 0) {
		if (isStraight(cards, 2, cards.length)) {
			ret.type = PokerDef.PokerType.STRAIGHT_2;
			return ret;
		}
	}
	//顺子 2不能在顺子中
	if (cards.length >= 5) {

		if (!isHave2(cards)) {
			if (isStraight(cards, 1, cards.length)) {
				ret.type = PokerDef.PokerType.STRAIGHT;
				return ret;
			}
		} else {
			if (isSpecialStraight(cards, cards.length)) {
				ret.type = PokerDef.PokerType.STRAIGHT;
				return ret;
			}
		}

	}

	if (cards.length >= 6) {

		if (isPlane_2(cards, wanfa)) {// 飞机三带二
			ret.type = PokerDef.PokerType.AIRPLANE_2;
			console.log("飞机三带二")
			return ret;
		}
		if (cards.length % 3 == 0) {// 飞机 666+777+888
			if (isStraight(cards, 3, cards.length)) {
				ret.type = PokerDef.PokerType.AIRPLANE;
				return ret;
			}
		}
	}

	switch (cards.length) {
		case 1:
			if (isAllSamePoint(cards)) {
				ret.type = PokerDef.PokerType.SINGLE;
				return ret;
			}
			break;

		case 2:
			if (isAllSamePoint(cards)) {
				ret.type = PokerDef.PokerType.PAIR;
				return ret;
			}
			break;

		case 3:
			if (isABomb(cards)) {
				ret.type = PokerDef.PokerType.BOMB4;
				return ret;
			}
			if (isAllSamePoint(cards)) {
				ret.type = PokerDef.PokerType.THREE;
				return ret;
			}
			break;

		case 4:
			//4炸
			if (isAllSamePoint(cards)) {
				ret.type = PokerDef.PokerType.BOMB4;
				return ret;
			}
			else if (isBomb_1(cards, wanfa)) {
				return ret;
			}
			break;
		case 5://三带二
			if (isThree2(cards)) {
				ret.type = PokerDef.PokerType.THREE_2;
				return ret;
			}
			break;
		case 6:// 四带二
			if (isBomb_2(cards)) {
				ret.type = PokerDef.PokerType.BOMB4_2;
				return ret;
			}
			break;
	}

	return ret;

	function isHave2(cards) {
		for (let i = 0; i < cards.length; i++) {
			let tmpPoint = cards[i] / 10;
			if (tmpPoint > 12) {
				tmpPoint = tmpPoint % 13;
			}
			if(tmpPoint == PokerDef.PokerPoint.PT_2){
				return true;
			}
		}
		return false;
	}

	function isAllSamePoint(cards) {
		var i,
			firstCardPoint,
			lstX = [],
			lstR = [],
			lstB = [],
			lstNoXAndKing = [],
			pokerValue,
			keyPoint;

		if (cards == null || cards.length == 0) {
			return false;
		}

		cards.forEach(function (card, i) {
			pokerValue = PokerUtil.getValue(card);
			switch (pokerValue) {
				case xHeartPokerValue:
					lstX.push(card);
					break;
				case PokerDef.PokerValue.JOKER_B:
					lstB.push(card);
					break;
				case PokerDef.PokerValue.JOKER_R:
					lstR.push(card);
					break;
				default:
					lstNoXAndKing.push(card);
			}
		});
		if (lstR.length > 0 && lstB.length > 0) {
			return false;
		} else if (lstR.length > 0 || lstB.length > 0) {
			if (lstNoXAndKing.length > 0 || lstX.length > 0) return false;
		} else {
			if (lstNoXAndKing.length > 1) {
				firstCardPoint = PokerUtil.getPoint(lstNoXAndKing[0]);
				for (i = 1; i < lstNoXAndKing.length; i++) {
					if (firstCardPoint != PokerUtil.getPoint(lstNoXAndKing[i])) {
						return false;
					}
				}
			}
		}

		if (lstB.length > 0) {
			ret.key = PokerDef.PokerKey.PK_B;
		} else if (lstR.length > 0) {
			ret.key = PokerDef.PokerKey.PK_R;
		} else if (lstNoXAndKing.length == 0) {
			ret.key = PokerDef.PokerKey.PK_X;
		} else {
			keyPoint = PokerUtil.getPoint(lstNoXAndKing[0]);
			ret.key = keyPoint == xPokerPoint ? PokerDef.PokerKey.PK_X : PokerDef.PokerMap[keyPoint];
		}

		return true;
	};


	//三带二
	function isThree2(cards) {
		var idx,
			card,
			value,
			point,
			pokerPointCnt = {},
			jbCnt = 0,
			jrCnt = 0,
			noXCnt = 0,
			key,
			cnt,
			sum1 = 0,
			sum2 = 0,
			times = 0,
			keyPoint;

		if (cards == null || cards.length != 5) {
			return false;
		}
		for (idx = 0; idx < cards.length; idx++) {
			card = cards[idx];
			value = PokerUtil.getValue(card);

			if (value == PokerDef.PokerValue.JOKER_B) {
				jbCnt++;
				noXCnt++;
			} else if (value == PokerDef.PokerValue.JOKER_R) {
				jrCnt++;
				noXCnt++;
			} else if (value != xHeartPokerValue) {
				point = PokerUtil.getPoint(card);
				if (pokerPointCnt[point] == null) {
					pokerPointCnt[point] = 1;
				} else {
					pokerPointCnt[point]++;
				}
				noXCnt++;
			}
		}
		switch (noXCnt) {
			case 5:
				for (key in pokerPointCnt) {
					cnt = pokerPointCnt[key];
					if (cnt == 3 || cnt == 2) {
						sum1 += cnt;
						times++;
						if (cnt == 3) {
							keyPoint = parseInt(key);
							ret.key = keyPoint == xPokerPoint ? PokerDef.PokerKey.PK_X : PokerDef.PokerMap[keyPoint];
						}
					}
				}

				if (jbCnt == 2) {
					sum1 += 2;
					times++;
				}

				if (jrCnt == 2) {
					sum1 += 2;
					times++;
				}

				if (sum1 == 5 && times == 2) {
					return true;
				}
				break;

			case 4: // 3 1, 2 2
				for (key in pokerPointCnt) {
					cnt = pokerPointCnt[key];
					if (cnt == 3 || cnt == 1) {
						sum1 += cnt;
						times++;
						if (cnt == 3) {
							keyPoint = parseInt(key);
							ret.key = keyPoint == xPokerPoint ? PokerDef.PokerKey.PK_X : PokerDef.PokerMap[keyPoint];
						}
					}

					if (cnt == 2) {
						sum2 += cnt;
						times++;

						if (keyPoint == null) {
							keyPoint = parseInt(key);
							ret.key = keyPoint == xPokerPoint ? PokerDef.PokerKey.PK_X : PokerDef.PokerMap[keyPoint];
						} else {
							if (parseInt(key) == xPokerPoint || (keyPoint != PokerDef.PokerPoint.PT_A && keyPoint != xPokerPoint && parseInt(key) > keyPoint)) {
								keyPoint = parseInt(key);
								ret.key = keyPoint == xPokerPoint ? PokerDef.PokerKey.PK_X : PokerDef.PokerMap[keyPoint];
							}
						}
					}
				}

				if (jbCnt == 2) {
					sum1 += 2;
					sum2 += 2;
					times++;
				}

				if (jrCnt == 2) {
					sum1 += 2;
					sum2 += 2;
					times++;
				}

				if ((sum1 == 4 || sum2 == 4) && times == 2) {
					return true;
				}
				break;

			case 3: // 1 2
				for (key in pokerPointCnt) {
					cnt = pokerPointCnt[key];

					if (cnt == 2 || cnt == 1) {
						sum1 += cnt;
						times++;

						if (keyPoint == null) {
							keyPoint = parseInt(key);
							ret.key = keyPoint == xPokerPoint ? PokerDef.PokerKey.PK_X : PokerDef.PokerMap[keyPoint];
						} else {
							if (parseInt(key) == xPokerPoint || (keyPoint != PokerDef.PokerPoint.PT_A && keyPoint != xPokerPoint && parseInt(key) > keyPoint)) {
								keyPoint = parseInt(key);
								ret.key = keyPoint == xPokerPoint ? PokerDef.PokerKey.PK_X : PokerDef.PokerMap[keyPoint];
							}
						}
					}
				}

				if (jbCnt == 2) {
					sum1 += 2;
					times++;
				}

				if (jrCnt == 2) {
					sum1 += 2;
					times++;
				}

				if (sum1 == 3 && times == 2) {
					return true;
				}
				break;
		}

		return false;
	};
	//单顺:1,5 双顺：2,6 三顺：3,6
	function isStraight(cards, repeat, len) {
		var idx,
			card,
			cnt = {},
			point,
			value,
			prevMin,
			min = PokerDef.PokerPoint.PT_MAX,
			max = PokerDef.PokerPoint.PT_MIN,
			diff,
			keyPoint,
			pointKindCnt = 0,
			biggestMinPoint;

		if (cards == null || cards.length != len) {
			return false
		}

		for (idx = 0; idx < cards.length; idx++) {
			card = cards[idx];
			value = PokerUtil.getValue(card);

			if (value == PokerDef.PokerValue.JOKER_B || value == PokerDef.PokerValue.JOKER_R) {
				return false;
			}

			if (value != xHeartPokerValue) {
				point = PokerUtil.getPoint(card);
				if (point == PokerDef.PokerPoint.PT_2) {
					return false;
				}
				if (cnt[point] == null) {
					pointKindCnt++;
					cnt[point] = 1;
				} else {
					cnt[point]++;
				}

				if (pointKindCnt > len / repeat) {
					return false;
				}

				if (cnt[point] > repeat) {
					return false;
				}

				if (point < min) {
					prevMin = min;
					min = point;
				} else if (cnt[point] == 1 && prevMin > point) {
					prevMin = point;
				}

				if (point > max) {
					max = point;
				}
			}
		}

		diff = max - min;
		pointKindCnt = len / repeat;
		biggestMinPoint = (PokerDef.PokerPoint.PT_K + 1) - (pointKindCnt - 1);

		if (diff <= (pointKindCnt - 1)) {
			keyPoint = min <= biggestMinPoint ? min : biggestMinPoint;
			ret.key = PokerDef.PokerMap[(keyPoint + diff - 1) % PokerDef.PokerPoint.PT_NONE];
			return true;
		} else if (min == 0 && (PokerDef.PokerPoint.PT_NONE - prevMin) <= (pointKindCnt - 1)) {
			keyPoint = biggestMinPoint;
			ret.key = PokerDef.PokerMap[diff % PokerDef.PokerPoint.PT_NONE];
			return true;
		}

		return false;
	};

	function isSpecialStraight(cards, len) {
		var idx,
			card,
			cnt = [],
			key,
			point;
		if (cards == null || cards.length != len) {
			return false
		}
		for (idx = 0; idx < cards.length; idx++) {
			card = cards[idx];
			key = PokerUtil.getKey(card);
			cnt.push(getArrayIndex(specialStraightKeys, key));
		}
		cnt.sort((a, b) => {
			return a - b;
		})
		if (cnt.length != len) {
			return false;
		}
		for (let i = 0; i < cnt.length; i++) {
			if (i == 0) {
				if (cnt[i] != 0) {
					return false
				}
			}
			if (i > 0) {
				if (cnt[i] - cnt[i - 1] != 1) {
					return false;
				}
			}
		}
		ret.key = specialStraightKeys[len - 1];
		return true;
	};
	function getArrayIndex(arr, obj) {
		var i = arr.length;
		while (i--) {
			if (arr[i] === obj) {
				return i;
			}
		}
		return -1;
	}
	//飞机 带对子
	function isPlane_2(cards, wanfa) {
		// 1.至少10张牌，并且牌数需要是5的倍数
		// 2.三张和两张的个数必须相等
		// 3.去掉两张的牌，剩下的牌需要组成飞机
		// 4.张数大于三张，减去三张后剩下的牌需要组成对子
		if (cards == null || cards.length < 10 || cards.length % 5 != 0) { // 飞机三带二至少10张
			return false
		}

		var threeCnt = 0; // 三张个数
		var twoCnt = 0; // 两张个数
		var twoPoint = []; // 两张的牌点
		var pointCnt = {};
		cards.forEach(function (card, i) {
			var point = PokerUtil.getPoint(card);
			if (pointCnt[point] == null) {
				pointCnt[point] = 1;
			}
			else {
				pointCnt[point]++;
			}
		});
		var planeCards = [];
		var planePointCount = {};
		// 计算三张和两张
		for (var i = 0; i < cards.length; i++) {
			var point = PokerUtil.getPoint(cards[i]);
			if (pointCnt[point] >= 3 && (pointCnt[point] - 3) % 2 == 0 && (planePointCount[point] == null || planePointCount[point] < 3)) {
				threeCnt++;
				planeCards.push(cards[i]);
				if (planePointCount[point] == null) {
					planePointCount[point] = 1;
				}
				else {
					planePointCount[point]++;
				}
			}
			else if (pointCnt[point] >= 2 && (pointCnt[point] % 2 == 0 || (pointCnt[point] - 3) % 2 == 0)) {
				twoCnt++;
				twoPoint.push(cards[i]);
			}
			else {
				return false; // 出现其它张数，说明不是飞机三带二了
			}
		}
		threeCnt = threeCnt / 3;
		twoCnt = twoCnt / 2;

		if (threeCnt != twoCnt) {
			return false; // 三张和两张的牌个数不同，不是飞机三带二
		}
		if (wanfa) {
			return isStraight(planeCards, 3, planeCards.length);
		} else { //16张
			console.log("三张：", planeCards, "两张：", twoPoint);
			return isStraight(planeCards, 3, planeCards.length);
		}
	};

	//四带二
	function isBomb_2(cards) {
		if (cards.length != 6) {
			return false;
		}
		var pointCnt = {};
		cards.forEach(function (card, i) {
			var point = PokerUtil.getPoint(card);
			if (pointCnt[point] == null) {
				pointCnt[point] = 1;
			}
			else {
				pointCnt[point]++;
			}
		});

		for (var i = 0; i < cards.length; i++) {
			var point = PokerUtil.getPoint(cards[i]);
			if (pointCnt[point] == 4) {
				ret.key = PokerDef.PokerMap[point];
				return true;
			}
		};
		return false
	}

	//炸弹 3带1 3或者A 333n/AAAn
	function isBomb_1(cards, wanfa) {
		if (cards.length != 4) {
			return false;
		}
		var pointCnt = {};

		cards.forEach(function (card, i) {
			var point = PokerUtil.getPoint(card);
			if (pointCnt[point] == null) {
				pointCnt[point] = 1;
			}
			else {
				pointCnt[point]++;
			}
		});
		// if (pointCnt[PokerDef.PokerPoint.PT_3] == 3) {
		// 	ret.key = PokerDef.PokerMap[PokerDef.PokerPoint.PT_3];
		// 	if ((wanfa.indexOf(0) >= 0) || (wanfa.indexOf(8) >= 0)
		// 		|| (wanfa.indexOf(2) >= 0 && cards.indexOf(PokerDef.PokerValue.HEART_3 * 10) >= 0)
		// 		|| (wanfa.indexOf(1) >= 0 && cards.indexOf(PokerDef.PokerValue.SPADE_3 * 10) >= 0)) 
		// 	{
		// 		ret.type = PokerDef.PokerType.THREE_1;
		// 	}
		// 	else {
		// 		ret.type = PokerDef.PokerType.BOMB4;
		// 	}
		// 	return true;
		// }

		if (pointCnt[PokerDef.PokerPoint.PT_A] == 3) {
			ret.key = getABombKey(cards);
			ret.type = PokerDef.PokerType.BOMB4;
			return true;
		}

		if (wanfa.indexOf(6) >= 0) {
			cards.forEach(function (card, i) {
				var point = PokerUtil.getPoint(card);
				if (pointCnt[point] == 3) {
					ret.key = PokerDef.PokerMap[point];
					ret.type = PokerDef.PokerType.THREE_1;
					return true;
				}
			});
		}
		return false;
	}

	function getABombKey(pointCnt) {
		for (const key in pointCnt) {
			if (PokerUtil.getPoint(pointCnt[key]) != PokerDef.PokerPoint.PT_A) {
				let point = PokerDef.PokerMap[PokerUtil.getPoint(pointCnt[key])];
				return point;
			};
		}
	}

	function isABomb(cards) {
		if (cards.length != 3) {
			return false;
		}
		var pointCnt = {};
		cards.forEach(function (card, i) {
			var point = PokerUtil.getPoint(card);
			if (pointCnt[point] == null) {
				pointCnt[point] = 1;
			}
			else {
				pointCnt[point]++;
			}
		});
		if (pointCnt[PokerDef.PokerPoint.PT_A] == 3) {
			ret.key = PokerDef.PokerMap[PokerDef.PokerPoint.PT_A];
			ret.type = PokerDef.PokerType.BOMBRB;
			return true;
		}
		return false;
	}
};



//数据结构

var PokerType = {
	strKey: "",
	strWeightKey: "",
	id: -1,
	len: 0,
	isMatchSuit: false,
	isSameSuit: false,
	isMatchPair: false,
	isAdustedWeight: true,
},

	PokerKeys = ['3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A', '2'],
	specialStraightKeys = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'],

	ExceptKey = "BR";

var pokerTypesMap = {};
var isFinishAddType = false;
var hasSortType = {};
function addPokerType(pokerType) {
	pokerTypesMap[pokerType.id] = pokerTypesMap[pokerType.id] || [];
	pokerTypesMap[pokerType.id].push(pokerType);
};


function createPokerType(beginKey, endKey, repeat, len, id, cfg) {
	var idx,
		key,
		beginIdx,
		endIdx,
		i,
		j,
		keys,
		pokerType;

	for (idx = 0; idx < specialStraightKeys.length; idx++) {
		key = PokerKeys[idx];
		if (key == beginKey) {
			beginIdx = parseInt(idx);
		} else if (key == endKey) {
			endIdx = parseInt(idx);
		}
	}

	for (i = beginIdx; i <= endIdx; i++) {
		keys = "";
		for (j = 0; j < len; j++) {
			if ((i + j) <= 12) {
				if (cfg.isMatchSuit && (i + j) == 12) return;
				keys += PokerKeys[i + j].repeat(repeat);
			}
			else {
				return;
			}
		}
		pokerType = extendDeep(cfg);
		pokerType.id = id;
		pokerType.strKey = keys;
		pokerType.strWeightKey = PokerKeys[i + len - 1];
		pokerType.len = pokerType.len || keys.length;

		addPokerType(pokerType);
	}
};

function createSpecialcStraight(len, id, cfg) {
	var i,
		j,
		keys,
		pokerType;
	keys = "";
	for (j = 0; j < len; j++) {
		if (len <= 12) {
			if (cfg.isMatchSuit && (j) == 12) return;
			keys += specialStraightKeys[j].repeat(1);
		}
		else {
			return;
		}
	}

	pokerType = extendDeep(cfg);
	pokerType.id = id;
	pokerType.strKey = keys;
	pokerType.strWeightKey = specialStraightKeys[len - 1];
	pokerType.len = pokerType.len || keys.length;

	addPokerType(pokerType);
};

function createPokerTypes() {
	if (isFinishAddType == true) {
		return;
	}
	var pokerType,
		PokerKey = PokerDef.PokerKey,
		tempPokerType;

	// 单牌[2,A]
	createPokerType(PokerKey.PK_3, PokerKey.PK_2, 1, 1, PokerDef.PokerType.SINGLE, PokerType);

	// 对子[3,A]
	createPokerType(PokerKey.PK_3, PokerKey.PK_A, 2, 1, PokerDef.PokerType.PAIR, PokerType);

	// 三张[3,A]
	createPokerType(PokerKey.PK_3, PokerKey.PK_K, 3, 1, PokerDef.PokerType.THREE, PokerType);

	// 三带二[3,A]
	pokerType = extendDeep(PokerType);
	pokerType.len = 5;
	pokerType.isMatchPair = true;
	createPokerType(PokerKey.PK_3, PokerKey.PK_A, 3, 1, PokerDef.PokerType.THREE_2, pokerType);

	// // 顺子[3,A]
	pokerType = extendDeep(PokerType);
	pokerType.isMatchSuit = true;
	pokerType.isAdustedWeight = false;
	for (var i = 5; i <= 12; i++) {
		createPokerType(PokerKey.PK_3, PokerKey.PK_A, 1, i, PokerDef.PokerType.STRAIGHT, pokerType);
	}
	for (var i = 5; i <= 12; i++) {
		createSpecialcStraight(i, PokerDef.PokerType.STRAIGHT, pokerType);
	}
	// 双顺，三连对
	for (var i = 2; i <= 8; i++) {
		createPokerType(PokerKey.PK_3, PokerKey.PK_K, 2, i, PokerDef.PokerType.STRAIGHT_2, PokerType);
	}

	// 飞机 [3,A] 333444 - KKKAAA
	for (var i = 2; i <= 5; i++) {
		createPokerType(PokerKey.PK_3, PokerKey.PK_K, 3, i, PokerDef.PokerType.AIRPLANE, PokerType);
	}

	//飞机带二
	for (var i = 2; i <= 5; i++) {
		pokerType = extendDeep(PokerType);
		pokerType.isMatchPair = true;
		pokerType.len = (i * 3) + (i * 2);
		createPokerType(PokerKey.PK_3, PokerKey.PK_K, 3, i, PokerDef.PokerType.AIRPLANE_2, pokerType);
	}

	// 炸弹 [A]
	var special = ["A"];
	for (var j = 0; j < special.length; j++) {
		for (var i = 0; i < PokerKeys.length; i++) {
			pokerType = extendDeep(PokerType);
			pokerType.isAdustedWeight = false;
			tempPokerType = extendDeep(pokerType);
			tempPokerType.id = PokerDef.PokerType.BOMB4;
			tempPokerType.strKey = special[j] + special[j] + special[j] + PokerKeys[i];
			tempPokerType.strWeightKey = PokerKeys[i];
			tempPokerType.len = 4;
			addPokerType(tempPokerType);
		}
	}

	addSpecialPokerType();

	createPokerType(PokerKey.PK_3, PokerKey.PK_K, 4, 1, PokerDef.PokerType.BOMB4, PokerType);

	//三带一 || 特殊炸 [3]
	checkThree_1ORBomb()

	//四带二
	pokerType = extendDeep(PokerType);
	pokerType.len = 6;
	createPokerType(PokerKey.PK_3, PokerKey.PK_K, 4, 1, PokerDef.PokerType.BOMB4_2, pokerType);

	function checkThree_1ORBomb() {
		for (var j = 0; j < PokerKeys.length; j++) {
			if (PokerKeys[j] == "A" || PokerKeys[j] == "2")
				continue;
			for (var i = 0; i < PokerKeys.length; i++) {
				if (PokerKeys[j] == PokerKeys[i])
					continue;
				pokerType = extendDeep(PokerType);
				pokerType.isAdustedWeight = false;
				tempPokerType = extendDeep(pokerType);
				tempPokerType.id = PokerDef.PokerType.THREE_1

				tempPokerType.strKey = PokerKeys[j] + PokerKeys[j] + PokerKeys[j] + PokerKeys[i];
				tempPokerType.strWeightKey = PokerKeys[j];
				tempPokerType.len = 4;
				addPokerType(tempPokerType);
			}
		}
	}

	isFinishAddType = true
};

function addSpecialPokerType() { //增加苏州关牌特殊牌型
	var pokerType,
		PokerKey = PokerDef.PokerKey,
		tempPokerType;

	pokerType = extendDeep(PokerKey);
	pokerType.isAdustedWeight = false;
	tempPokerType = extendDeep(pokerType);
	tempPokerType.id = PokerDef.PokerType.BOMB4;
	tempPokerType.strKey = "AAA";
	tempPokerType.strWeightKey = "A";
	tempPokerType.len = 3;
	addPokerType(tempPokerType);
}

//找符合下家报单的牌型
function getMatchBaodan(cards, wanfa) {
	var result = [];
	var pairs = getAllPairs(cards, null);
	console.log("pairs:", pairs);
	var threes = [];
	if (pairs.length > 0) {
		for (let i = 0; i < pairs.length; i++) {
			var pair = pairs[i];
			var key = PokerUtil.getKey(pair[0]);
			var pokerType = {};
			pokerType.id = PokerDef.PokerType.THREE;
			pokerType.strKey = key + key + key;
			pokerType.strWeightKey = key;
			pokerType.len = 3;
			var three = getMatchCards(cards, pokerType, null, null, wanfa);
			if (three.length > 0) {
				threes.push(three);
			} else {
				result = pair;
				break;
			}
		}
	}
	//有对子了
	if (result.length > 0) {
		return result;
	}
	//找三条
	var bombs = [];
	for (let i = 0; i < threes.length; i++) {
		var three = threes[i];
		var key = PokerUtil.getKey(three[0]);
		var pokerType = {};
		pokerType.id = PokerDef.PokerType.BOMB4;
		pokerType.strKey = key + key + key + key;
		pokerType.strWeightKey = key;
		pokerType.len = 4;
		var bomb = getMatchCards(cards, pokerType, null, null, wanfa);
		if (bomb.length > 0) {
			bombs.push(bomb);
		} else {
			result = three;
			break;
		}
	}
	//有三条了
	if (result.length > 0) {
		return result;
	}
	//炸弹
	if (bombs.length > 0) {
		return bombs[0];
	} else {//返回最大的单张
		result = getMaxTypeCards(cards, PokerDef.PokerType.SINGLE, false, wanfa);
	}
	return result;
};

//获取最大的该牌型的牌
function getMaxTypeCards(cards, type, isChai, wanfa) {
	var result = [];
	var cardList = exports.getCardListByType(cards, type, wanfa);
	let maxCards = null;
	let maxKey = "3";
	for (let i = 0; i < cardList.length; i++) {
		let cards = cardList[i];
		console.log("cards:" + cards);
		let map = exports.getMaxPokerTypeAndKey(cards, null, cc.fy.gameNetMgr.conf.wanfa);
		console.log("===>MaxCardmap: ", map);
		if (map != null) {
			if (PokerDef.PokerKeyWeight[map.key] >= PokerDef.PokerKeyWeight[maxKey]) {
				console.log("===>MaxCardmap --->: ", map);
				maxKey = map.key;
				maxCards = null;
				maxCards = cards;
			}
		}
	}
	if (maxCards != null) {
		result = maxCards;
	}
	return result;
}

//获取最小的该牌型的牌
function getMinTypeCards(cards, type, isChai, wanfa) {
	var result = [];
	var cardList = exports.getCardListByType(cards, type, wanfa);
	let maxCards = null;
	let maxKey = "2";
	for (let i = 0; i < cardList.length; i++) {
		let cards = cardList[i];
		console.log("cards:" + cards);
		let map = exports.getMaxPokerTypeAndKey(cards, null, cc.fy.gameNetMgr.conf.wanfa);
		console.log("===>MaxCardmap: ", map);
		if (map != null) {
			if (PokerDef.PokerKeyWeight[map.key] >= PokerDef.PokerKeyWeight[maxKey]) {
				console.log("===>MaxCardmap --->: ", map);
				maxKey = map.key;
				maxCards = null;
				maxCards = cards;
			}
		}
	}
	if (maxCards != null) {
		result = maxCards;
	}
	return result;
}

//计算大过出牌的牌    上家出的牌     手牌  下家报单  百搭       玩法
function calcPrompts(playedCards, hand, isBaoDan, xPokerPoint, wanfa) {
	var playedType,
		prompts = [],
		xProCards = [], // 带有癞子牌的提示
		key,
		idx,
		type,
		types,
		matchCards;

	console.log(playedCards, hand, isBaoDan, xPokerPoint, wanfa);
	//自己出牌，不用压过别人
	if (playedCards == null || playedCards.length == 0) {
		//如果一手能出完。
		var OnlyOne = exports.getMaxPokerTypeAndKey(hand, null, wanfa);
		console.log("最后一手牌：", OnlyOne, hand);
		if (OnlyOne.type != -1) {
			console.log("最后一手牌：", OnlyOne, typeof hand);
			xProCards[0] = hand.map(ha => {
				return ha;
			})
			// var result=[];
			// result=[[],[],[]];
			// result[0]=temp;
			console.log("prompts", xProCards[0], xProCards.length);
			return xProCards;

		} else {//一手出不完，出最小牌
			//如果下家报单
			if (isBaoDan) {
				var temp = getMatchBaodan(hand, wanfa);
				prompts.push(temp);
				return prompts;
			}

			var min = PokerDef.PokerKey.PK_2;
			for (let i = 0; i < hand.length; i++) {
				var card = PokerUtil.getKey(hand[i]);
				if (PokerDef.PokerKeyWeight[min] > PokerDef.PokerKeyWeight[card]) {
					min = card;
				}
			}
			console.log("最小牌：" + min);
			var temp = [];
			for (let i = 0; i < hand.length; i++) {
				var card = PokerUtil.getKey(hand[i]);
				if (card == min) {
					temp.push(hand[i]);
				}
			}
			if (temp.length > 0) {
				prompts.push(temp);
			}
		}
		console.log("prompts", prompts);
		return prompts;
	}
	//跟牌
	playedType = getMaxPokerType(playedCards, xPokerPoint, wanfa);
	console.log("要跟的牌型", playedType);
	for (key in pokerTypesMap) {  //全局变量，所有牌型的枚举
		types = pokerTypesMap[key];
		if (playedType != null && isCompatibleType(parseInt(key), playedType.id)) {
			if (isNeedSortKey(key) && (hasSortType[key] == null || hasSortType[key] != xPokerPoint)) {
				hasSortType[key] = xPokerPoint;
				sortTypeByKey(types, xPokerPoint);
			}
			console.log("types:", types);
			for (idx = 0; idx < types.length; idx++) {
				type = types[idx];
				if (type.id != PokerDef.PokerType.BOMB4 && playedType.len != type.len) { //除了炸弹牌型，其他牌型的长度必须一致
					continue;
				}
				if (compareType(type, playedType, xPokerPoint) == true) { //牌型大于 出牌牌型
					matchCards = getMatchCards(hand, type, xPokerPoint, null, wanfa);

					if (matchCards.length > 0) {
						if (type.id == 7) {
							for (var i = 0; i < matchCards.length; i++) {
								var matchCard = matchCards[i];
								if (prompts.length > 0) {

									if (isSameList(prompts[prompts.length - 1], matchCard) == false) {
										prompts.push(matchCard);
									}
								}
								else {
									prompts.push(matchCard);
								}
							}
						}
						else if (type.id == 4) {
							for (var i = 0; i < matchCards.length; i++) {
								var matchCard = matchCards[i];
								if (prompts.length > 0) {

									if (isSameList(prompts[prompts.length - 1], matchCard) == false) {
										prompts.push(matchCard);
									}
								}
								else {
									prompts.push(matchCard);
								}
							}
						}
						else {
							if (prompts.length > 0) {
								if (isSameList(prompts[prompts.length - 1], matchCards) == false) {
									prompts.push(matchCards);
								}
							}
							else {
								prompts.push(matchCards);
							}
						}
					}
				}
			}
		}
	}
	if (playedType != null) {
		var newResult = [];
		console.log("老结果：", prompts);
		//如果上家出的是单排
		var countCards = PokerUtil.countCardsByKey(hand);//手牌中各牌的数量
		console.log("countKey", countCards);
		if (playedType.id == PokerDef.PokerType.SINGLE) {
			var maxCards = null;
			var maxKey = '3';
			for (let i = 0; i < prompts.length; i++) {
				var type = exports.getMaxPokerTypeAndKey(prompts[i], null, wanfa);
				console.log("type", type);
				if (type.type == PokerDef.PokerType.SINGLE) {
					if (isBaoDan) {
						if (PokerDef.PokerKeyWeight[maxKey] <= PokerDef.PokerKeyWeight[type.key]) {
							maxCards = prompts[i];
							maxKey = type.key;
						}
					} else {
						if (countCards[type.key] == 1) {
							console.log("一个结果：", prompts[i], countCards[type.key], type.key);
							newResult.push(prompts[i]);
						}
					}
				} else {
					console.log("一个结果：", prompts[i]);
					newResult.push(prompts[i]);
				}
			}
			if (maxCards != null && isBaoDan) {
				var temp = [];
				temp.push(maxCards);
				newResult = temp.concat(newResult);
			}
			if (newResult.length == 0) {
				newResult = prompts.slice();
			}
		} else {
			//不拆牌的 带单张和对子，
			// var firstType=null;
			// prompts.sort(function(a,b){
			// 	var type_a=exports.getMaxPokerTypeAndKey(a,null,wanfa);
			// 	var type_b=exports.getMaxPokerTypeAndKey(b,null,wanfa);
			// 	if(type_a.id ==type_b.id && type_a.id==PokerDef.PokerType.THREE_1 || type_a.id ==PokerDef.PokerType.THREE_2){
			// 		var extra_a=type_a.strKey[3];
			// 		var extra_b=type_b.strKey[3];
			// 	}
			// 	return type_a.id-type_b.id;

			// });
			// for(let i=0;i<prompts.length;i++){
			// 	var type=exports.getMaxPokerTypeAndKey(prompts[i],null,wanfa);
			// 	if(firstType==null || type.key !=firstType.key || type.type!=firstType.type){
			// 		firstType=type;
			// 		newResult.push(prompts[i]);
			// 	}else{

			// 	}
			// }
			return prompts;
		}
		console.log("新结果：", newResult);
		return newResult;
	}
	return prompts;
};

//检查牌组里有没有重复的牌
function checkSingle(cards, card) {
	var cnt = 0;
	for (i in cards) {
		if (PokerUtil.getKey(cards[i]) == PokerUtil.getKey(card)) {
			cnt++;
		}
	}
	return
};

// 按照权重排序
function sortTypeByKey(types, xPokerPoint) {
	types.sort(function (type0, type1) {
		var key0 = type0.strWeightKey;
		var key1 = type1.strWeightKey;
		return PokerDef.PokerKeyWeight[key0] - PokerDef.PokerKeyWeight[key1];
	});
};

function isNeedSortKey(key) {
	if (key == PokerDef.PokerType.STRAIGHT ||
		key == PokerDef.PokerType.STRAIGHT_2 ||
		key == PokerDef.PokerType.AIRPLANE ||
		key == PokerDef.PokerType.STRAIGHTFLUSH) {
		return false;
	}

	return true;
}


function compareType(type1, type2, xPokerPoint) {
	var typeid1,
		typeid2,
		typeweight1,
		typeweight2,
		keyweight1,
		keyweight2;

	if (type1 == null || type2 == null) {
		return -1;
	}
	typeid1 = type1.id;
	typeid2 = type2.id;

	if (isCompatibleType(typeid1, typeid2) == false) {
		return -1;
	}

	typeweight1 = PokerDef.PokerTypeWeight[typeid1];
	typeweight2 = PokerDef.PokerTypeWeight[typeid2];

	if (typeweight1 != typeweight2) {
		return typeweight1 > typeweight2;
	} else {
		keyweight1 = getKeyWeight(type1, xPokerPoint);
		keyweight2 = getKeyWeight(type2, xPokerPoint);

		if (keyweight1 == keyweight2) {
			return -1;
		} else {
			return keyweight1 > keyweight2;
		}
	}
};

function isCompatibleType(typeid1, typeid2) {
	var weight1,
		weight2;

	if (typeid1 == typeid2) {
		return true;
	} else {
		weight1 = PokerDef.PokerTypeWeight[typeid1];
		if (weight1 == null) {
			return false;
		}

		weight2 = PokerDef.PokerTypeWeight[typeid2];
		if (weight2 == null) {
			return false;
		}

		return weight1 != weight2;
	}
};

function getMatchCards(cards, pokerType, xPokerPoint, matchSuit, wanfa) {
	var splits,
		remains,
		extras,
		matches = [],
		idx,
		card,
		maxType;

	if (matchSuit == undefined || matchSuit == null) {
		matchSuit = PokerDef.PokerSuit.NONE;
	}

	if (cards.length < pokerType.len) {
		return [];
	}

	var ret = splitCards(pokerType, cards.slice(), pokerType.strKey, xPokerPoint, matchSuit);

	splits = ret.splits;
	remains = ret.remains;

	if (splits == null) {
		return [];
	}

	if (pokerType.id == 7 && pokerType.len == 10) {
		var plane = [],
			match = [];
		extras = getPlaneExtraCards(remains, pokerType, xPokerPoint, wanfa);

		if (extras.length > 0) {
			for (idx = 0; idx < splits.length; idx++) {
				card = splits[idx];
				plane.push(card);
			}

			for (idx = 0; idx < extras.length; idx++) {
				match.push(plane.concat(extras[idx]));
			}

			for (idx = 0; idx < match.length; idx++) {
				matches.push(match[idx]);
			}
			return matches;
		}
		return [];
	}
	else if (pokerType.id == 4 && pokerType.len == 5) {
		var three = [],
			match = [];
		extras = getThreeExtraCards(remains, pokerType, xPokerPoint);

		if (extras.length > 0) {
			for (idx = 0; idx < splits.length; idx++) {
				card = splits[idx];
				three.push(card);
			}

			for (idx = 0; idx < extras.length; idx++) {
				match.push(three.concat(extras[idx]));
			}

			for (idx = 0; idx < match.length; idx++) {
				matches.push(match[idx]);
			}
			return matches;
		}
		return [];
	}
	else {
		extras = getExtraCards(remains, pokerType, xPokerPoint);
	}


	for (idx = 0; idx < splits.length; idx++) {
		card = splits[idx];
		matches.push(card);
	}

	for (idx = 0; idx < extras.length; idx++) {
		card = extras[idx];
		matches.push(card);
	}

	maxType = getMaxPokerType(matches, xPokerPoint, wanfa);
	if (maxType == null || maxType.id != pokerType.id) {
		return [];
	}

	return matches;
};

function getExtraCards(remains, pokerType, xPokerPoint) {
	var extraLen = pokerType.len - pokerType.strKey.length,
		pairCnt,
		allPairs,
		extras = [],
		i,
		idx;

	if (extraLen == 0) {
		return [];
	}

	if (remains.length < extraLen) {
		return [];
	}
	if (pokerType.isMatchPair) {
		pairCnt = Math.floor(extraLen / 2);
		allPairs = getAllPairs(remains, xPokerPoint);
		if (allPairs.length > 0 && allPairs.length >= pairCnt) {
			for (i = 0; i < pairCnt; i++) {
				for (idx = 0; idx < allPairs[i].length; idx++) {
					extras.push(allPairs[i][idx]);
				}
			}
			return extras;
		}
	}

	return [];
};

function getThreeExtraCards(remains, pokerType, xPokerPoint) {
	var extraLen = pokerType.len - pokerType.strKey.length,
		allPairs;

	if (extraLen == 0) {
		return [];
	}

	if (remains.length < extraLen) {
		return [];
	}
	if (pokerType.isMatchPair) {
		allPairs = getAllPairs(remains, xPokerPoint);
		if (allPairs.length > 0) {
			return allPairs;
		}
	}

	return [];
};

function getPlaneExtraCards(remains, pokerType, xPokerPoint, wanfa) {
	var extraLen = pokerType.len - pokerType.strKey.length,
		pairCnt,
		allPairs,
		extras = [],
		twoPairs = [],
		i,
		idx,
		j,
		k;


	if (extraLen == 0) {
		return [];
	}

	if (remains.length < extraLen) {
		return [];
	}
	if (pokerType.isMatchPair) {
		pairCnt = Math.floor(extraLen / 2);
		allPairs = getAllPairs(remains, xPokerPoint);
		if (allPairs.length > 0 && allPairs.length >= pairCnt) {
			console.log("allPairs length =", allPairs.length, allPairs);
			for (i = 0; i < allPairs.length - 1; i++) {
				for (j = i + 1; j < allPairs.length; j++) {
					twoPairs = [];
					for (k = 0; k < 2; k++) {
						twoPairs.push(allPairs[i][k]);
						twoPairs.push(allPairs[j][k]);
						console.log("Twopairs", twoPairs);
					}
					extras.push(twoPairs);
				}
			}
			if (!(wanfa.indexOf(8) >= 0)) {
				for (idx = 0; idx < extras.length; idx++) {
					var extra = extras[idx];
					if (!isStraight2(extra, 2, extra.length)) {
						extras.splice(idx, 1);
						idx--;
					}
				}
			}
			console.log("extras", extras);
			return extras;
		}
	}

	return [];
};

function isStraight2(cards, repeat, len) {
	var xHeartPokerValue = -1;
	var idx,
		card,
		cnt = {},
		point,
		value,
		prevMin,
		min = PokerDef.PokerPoint.PT_MAX,
		max = PokerDef.PokerPoint.PT_MIN,
		diff,
		keyPoint,
		pointKindCnt = 0,
		biggestMinPoint;

	if (cards == null || cards.length != len) {
		return false
	}

	for (idx = 0; idx < cards.length; idx++) {
		card = cards[idx];
		value = PokerUtil.getValue(card);

		if (value == PokerDef.PokerValue.JOKER_B || value == PokerDef.PokerValue.JOKER_R) {
			return false;
		}

		if (value != xHeartPokerValue) {
			point = PokerUtil.getPoint(card);
			if (point == PokerDef.PokerPoint.PT_2) {
				return false;
			}
			if (cnt[point] == null) {
				pointKindCnt++;
				cnt[point] = 1;
			} else {
				cnt[point]++;
			}

			if (pointKindCnt > len / repeat) {
				return false;
			}

			if (cnt[point] > repeat) {
				return false;
			}

			if (point < min) {
				prevMin = min;
				min = point;
			} else if (cnt[point] == 1 && prevMin > point) {
				prevMin = point;
			}

			if (point > max) {
				max = point;
			}
		}
	}

	diff = max - min;
	pointKindCnt = len / repeat;
	biggestMinPoint = (PokerDef.PokerPoint.PT_K + 1) - (pointKindCnt - 1);

	if (diff <= (pointKindCnt - 1)) {
		keyPoint = min <= biggestMinPoint ? min : biggestMinPoint;
		return true;
	} else if (min == 0 && (PokerDef.PokerPoint.PT_NONE - prevMin) <= (pointKindCnt - 1)) {
		keyPoint = biggestMinPoint;
		return true;
	}

	return false;
};

// 从lstCards中按照权重取出所有的对子
// 策略：对子-》拆三张-》单张和癞子-》全部是癞子-》全部是王-》拆分炸弹
// 按照key权重从小到大遍历牌数据
function getAllPairs(cards, xPokerPoint) {
	var lstPairs = [],
		lstSplit,
		lstSplitX,
		len,
		i,
		lst,
		lstT,
		lstX,
		key,
		xPairCnt,
		jPairCnt,
		j;

	if (cards.length == 0) {
		return [];
	}

	var ret = spiltByCount(cards, xPokerPoint);
	lstSplit = ret.lstSplit;
	lstSplitX = ret.lstSplitX;


	len = lstSplit.length;
	for (i = len - 1; i >= 0; i--) {
		lst = lstSplit[i];
		if (lst.length == 2) {
			lstPairs.push(lst);
			lstSplit.splice(i, 1);
		}
	}

	len = lstSplit.length;
	for (i = len - 1; i >= 0; i--) {
		lst = lstSplit[i];
		if (lst.length == 3) {
			lstT = [];
			lstT.push(lst.pop());
			lstT.push(lst.pop());
			lstPairs.push(lstT);
		}
	}

	lstX = [];
	len = lstSplitX.length;
	for (i = len - 1; i >= 0; i--) {
		lst = lstSplitX[i];
		if (isX(lst[0], xPokerPoint)) {
			lstX = lstSplitX.splice(i, 1)[0];
		}
	}

	len = lstSplit.length;
	for (i = len - 1; i >= 0; i--) {
		if (lstX.length == 0) {
			break;
		}
		lst = lstSplit[i];
		if (lst.length == 1) {
			key = PokerUtil.getKey(lst[0]);
			if (key != "") {
				lstT = [];
				lstT.push(lst[0]);
				lstT.push(lstX.pop());
				lstPairs.push(lstT);

			}
		}
	}

	xPairCnt = Math.floor(lstX.length / 2);
	for (i = 0; i < xPairCnt; i++) {
		lstT = [];
		lstT.push(lstX.pop());
		lstT.push(lstX.pop());

		lstPairs.push(lstT);
	}

	len = lstSplitX.length;
	for (i = len - 1; i >= 0; i--) {
		lst = lstSplitX[i];
		if (PokerUtil.isJoker(lst[0])) {
			jPairCnt = Math.floor(lst.length / 2);
			for (j = 0; j < jPairCnt; j++) {
				lstT = [];
				lstT.push(lst.pop());
				lstT.push(lst.pop());

				lstPairs.push(lstT);
			}

		}
	}

	len = lstSplit.length;
	for (i = len - 1; i >= 0; i--) {
		lst = lstSplit[i];
		if (lst.length > 3) {
			lstT = [];
			lstT.push(lst.pop());
			lstT.push(lst.pop());

			lstPairs.push(lstT);

		}
	}

	return lstPairs;
};

function spiltByCount(cards, xPokerPoint) {
	var lstSorted,
		len,
		lstSplit = [],
		lstSplitX = [],
		lstJR = [],
		lstJB = [],
		lstX = [],
		i,
		card,
		lstFind = [],
		lastCard;

	lstSorted = sort(cards, xPokerPoint);
	len = lstSorted.length;

	for (i = len - 1; i >= 0; i--) {
		card = lstSorted[i];
		if (isX(card, xPokerPoint)) {
			lstX.push(lstSorted.splice(i, 1)[0]);
		} else if (PokerUtil.getValue(card) == PokerDef.PokerValue.JOKER_B) {
			lstJB.push(lstSorted.splice(i, 1)[0]);
		} else if (PokerUtil.getValue(card) == PokerDef.PokerValue.JOKER_R) {
			lstJR.push(lstSorted.splice(i, 1)[0]);
		}
	}

	if (lstJR.length > 0) {
		lstSplitX.push(lstJR);
	}

	if (lstJB.length > 0) {
		lstSplitX.push(lstJB);
	}

	if (lstX.length > 0) {
		lstSplitX.push(lstX);
	}

	len = lstSorted.length;
	lastCard = lstSorted[0];

	if (len == 1) {
		lstSplit.push([lastCard]);
	}

	for (i = 1; i < len; i++) {
		card = lstSorted[i];
		lstFind.push(lastCard);

		if (PokerUtil.getPoint(card) != PokerUtil.getPoint(lastCard)) {
			lstSplit.push(lstFind);
			lstFind = [];
			if (i == len - 1) {
				lstSplit.push({ card });
			}
		} else {
			if (i == len - 1) {
				lstFind.push(card);
				lstSplit.push(lstFind);
			}
		}

		lastCard = card;
	}

	return { lstSplit: lstSplit, lstSplitX: lstSplitX };
};

function sort(cards, xPokerPoint) {
	var sortInfos = translateToSortInfo(cards, xPokerPoint),
		idx,
		lstSorted = [];
	sortInfos.sort(sortByCountAndAdjustedWeightAndSuit);
	for (idx = 0; idx < sortInfos.length; idx++) {
		lstSorted.push(sortInfos[idx].card);
	}

	return lstSorted;
};

function translateToSortInfo(cards, xPokerPoint) {
	var keyCnt = {},
		sortInfos = [],
		idx,
		card,
		key,
		xKey = PokerDef.PokerMap[xPokerPoint];

	for (idx = 0; idx < cards.length; idx++) {
		card = cards[idx];
		key = PokerUtil.getKey(card);
		if (keyCnt[key] == null) {
			keyCnt[key] = 1;
		} else {
			keyCnt[key]++;
		}
	}

	for (idx = 0; idx < cards.length; idx++) {
		card = cards[idx];
		key = PokerUtil.getKey(card);
		sortInfos.push({
			card: card,
			strKey: key,
			cnt: keyCnt[key],
			weight: xKey == key ? PokerDef.PokerKeyWeight['X'] : PokerDef.PokerKeyWeight[key],
			suit: PokerUtil.getSuit(card),
		});
	}

	return sortInfos;
};

function sortByCountAndAdjustedWeightAndSuit(sortinfo1, sortinfo2) {
	if (sortinfo1.cnt == sortinfo2.cnt) {
		if (sortinfo1.weight == sortinfo2.weight) {
			return sortinfo2.suit - sortinfo1.suit;
		} else {
			return sortinfo2.weight - sortinfo1.weight;
		}
	} else {
		return sortinfo2.cnt - sortinfo1.cnt;
	}
};


function getMaxPokerType(cards, xPokerPoint, wanfa) {

	
	var maxType = null,
		maxWeight = -1,
		types = findPokerTypes(cards, xPokerPoint, wanfa),
		idx,
		type,
		weight,
		maxKeyWeight,
		keyWeight;

	
	for (idx = 0; idx < types.length; idx++) {
		type = types[idx];
		weight = PokerDef.PokerTypeWeight[type.id];
		if (maxType == null) {
			maxWeight = weight;
			maxType = type;
		} else {
			if (maxWeight < weight) {
				maxWeight = weight;
				maxType = type;
			} else if (maxWeight == weight) {
				maxKeyWeight = getKeyWeight(maxType, xPokerPoint);
				keyWeight = getKeyWeight(type, xPokerPoint);
				if (maxKeyWeight < keyWeight) {
					maxType = type;
				}
			}
		}
	}

	return maxType;
};

function getKeyWeight(pokerType, xPokerPoint) {
	var xKey = PokerDef.PokerMap[xPokerPoint];

	if (pokerType.isAdustedWeight) {
		return xKey == pokerType.strWeightKey ? PokerDef.PokerKeyWeight['X'] : PokerDef.PokerKeyWeight[pokerType.strWeightKey];
	} else {
		return PokerDef.PokerKeyWeight[pokerType.strWeightKey];
	}
};

function findPokerTypes(cards, xPokerPoint, wanfa) {

	var ret = [],
		key,
		types,
		idx,
		type;

	for (key in pokerTypesMap) {
		types = pokerTypesMap[key];
		for (idx = 0; idx < types.length; idx++) {
			type = types[idx];
			if (isMatch(type, cards.slice(), xPokerPoint, wanfa)) {
				ret.push(type);
			}
		}
	}
	return ret;
};

function isMatch(pokerType, cards, xPokerPoint, wanfa) {
	var splits,
		remains,
		strXKey,
		isPairs;

	if (pokerType.len != cards.length) {
		
		return false;
	}

	var ret = splitCards(pokerType, cards, pokerType.strKey, xPokerPoint);

	splits = ret.splits;
	remains = ret.remains;
	if (splits == null || splits.length == 0) {
		
		return false;
	}

	if (pokerType.isMatchPair) {
		strXKey = toXKeys(remains, xPokerPoint);
		isPairs = PokerUtil.isPairs(strXKey, ExceptKey);
		if (isPairs == false) {
		
			return false;
		}
	}


	// if (pokerType.strWeightKey == '3' && pokerType.len == 4) {
	// 	if (pokerType.id == 8) {
	// 		if (wanfa.indexOf(0) >= 0) {
	// 			return pokerType.strKey == '3333';
	// 		}
	// 		else if (wanfa.indexOf(2) >= 0) {
	// 			if (pokerType.strKey == '3333') {
	// 				return true;
	// 			}
	// 			if (cards.indexOf(PokerDef.PokerValue.HEART_3 * 10) < 0 && wanfa.indexOf(7) >= 0) {
	// 				return true;
	// 			}
	// 		}
	// 		else if (wanfa.indexOf(1) >= 0) {
	// 			if (pokerType.strKey == '3333') {
	// 				return true;
	// 			}
	// 			if (cards.indexOf(PokerDef.PokerValue.SPADE_3 * 10) < 0 && wanfa.indexOf(7) >= 0) {
	// 				return true;
	// 			}
	// 		}

	// 		return false;
	// 	}
	// 	else if (pokerType.id == 11) {
	// 		if (wanfa.indexOf(0) >= 0 || wanfa.indexOf(8) >= 0) {
	// 			return true;
	// 		}
	// 		else if (wanfa.indexOf(2) >= 0) {
	// 			if (cards.indexOf(PokerDef.PokerValue.HEART_3 * 10) >= 0) {
	// 				return true;
	// 			}
	// 		}
	// 		else if (wanfa.indexOf(1) >= 0) {

	// 			if (cards.indexOf(PokerDef.PokerValue.SPADE_3 * 10) >= 0) {
	// 				return true;
	// 			}
	// 		}

	// 		return false;
	// 	}

	// }

	return true;
};

function toXKeys(cards, xPokerPoint) {
	var strKey = "",
		idx,
		card;

	for (idx = 0; idx < cards.length; idx++) {
		card = cards[idx];
		if (isX(card, xPokerPoint)) {
			strKey += "X";
		} else {
			strKey += PokerUtil.getKey(card);
		}
	}

	return strKey;
};

function splitCards(pokerType, cards, strKey, xPokerPoint, matchSuit) {
	var splits = [],
		remains = [],
		keyLen = strKey.length,
		lstNoX,
		lstX,
		idx,
		card,
		isAllX = true,
		tempList,
		i,
		key;

	if (matchSuit == undefined || matchSuit == null) {
		matchSuit = PokerDef.PokerSuit.NONE;
	}

	var ret = splitX(cards, xPokerPoint);

	lstNoX = ret.lstNoX;
	lstX = ret.lstX;

	splits = findMatch(lstNoX, lstX, strKey);



	if (splits.length == 0) {
		return false;
	}


	for (idx = 0; idx < splits.length; idx++) {
		card = splits[idx];
		if (isX(card, xPokerPoint) == false) {
			isAllX = false;
			break;
		}
	}

	if (isAllX) {

		tempList = splits.slice();
		for (i = 0; i < keyLen; i++) {
			key = strKey[i];
			for (idx = 0; idx < tempList.length; idx++) {
				card = tempList[idx];
				if (PokerUtil.getKey(card) == key) {
					tempList.splice(parseInt(idx), 1);
					break;
				}
			}
		}

		if (tempList.length == 0) {
			return { splits: splits, remains: remains };
		} else {
			splits = [];
		}
	}

	remains = cards.slice();

	PokerUtil.removeCards(remains, splits);

	return { splits: splits, remains: remains };
};

function findMatch(lstNoX, lstX, strKey) {

	var splits = [],
		idx,
		key,
		find,
		i,
		card;
	lstNoX = lstNoX.slice();
	lstX = lstX.slice();


	for (idx = 0; idx < strKey.length; idx++) {
		key = strKey[idx];


		find = false;
		for (i = lstNoX.length - 1; i >= 0; i--) {
			card = lstNoX[i];
			if (PokerUtil.getKey(card) == key) {


				lstNoX.splice(i, 1);
				splits.push(card);
				find = true;
				break;
			}
		}

		if (find == false) {
			if (lstX.length == 0) {
				return [];
			}

			if (isExceptKey(key)) {
				return [];
			}

			splits.push(lstX.pop());
		}
	}

	return splits;
};

function splitX(cards, xPokerPoint) {
	var ret = {
		lstNoX: [],
		lstX: [],
	},

		idx,
		card;

	for (idx = 0; idx < cards.length; idx++) {
		card = cards[idx];
		if (isX(card, xPokerPoint)) {
			ret.lstX.push(card);
		} else {
			ret.lstNoX.push(card);
		}
	}

	return ret;
};

function isX(card, xPokerPoint) {
	return false;
	// return PokerUtil.getValue(card) == (PokerDef.PokerPoint.PT_NONE * PokerDef.PokerSuit.HEART + xPokerPoint);
};

function extend(parent, child) {
	var i;
	child = child || {};

	for (i in parent) {
		if (parent.hasOwnProperty(i)) {
			child[i] = parent[i];
		}
	}

	return child;
};

function extendDeep(parent, child) {
	var i,
		toStr = Object.prototype.toString,
		astr = "[object Array]";

	child = child || {};

	for (i in parent) {
		if (parent.hasOwnProperty(i)) {
			if (typeof parent[i] === "object") {
				child[i] = (toStr.call(parent[i]) === astr) ? [] : {};
				extendDeep(parent[i], child[i]);
			} else {
				child[i] = parent[i];
			}
		}
	}

	return child;
};

function isSameList(lst0, lst1) {
	if (lst0.length != lst1.length) {
		return false;
	}
	var lst0 = lst0.slice(0);
	var lst1 = lst1.slice(0);
	lst0.sort();
	lst1.sort();
	for (var i = 0; i < lst0.length; i++) {
		if (lst0[i] != lst1[i]) {
			return false;
		}
	}

	return true;
};

// 通过牌型筛选出对应的牌型
function getCardListByType(cards, type, wanfa) {
	let types = pokerTypesMap[type];
	if (types == null) {
		return [];
	}


	let cardList = [];
	let splits = null;
	console.log("分割前", cards);
	for (let idx = 0; idx < types.length; idx++) {
		let pokerType = types[idx];
		// console.log("pokerType:", pokerType.strKey);
		var ret = splitCards(pokerType, cards, pokerType.strKey, null);
		splits = ret.splits;
		console.log("pokertype", pokerType);
		console.log("分割后:", ret);
		if (pokerType.id == PokerDef.PokerType.BOMB4) {

			if (pokerType.strWeightKey == '3' && pokerType.len == 4 && pokerType.strKey != '3333') {
				if (wanfa.indexOf(PokerDef.WanfaType.Win_First) >= 0) {
					continue;
				}
				else if (wanfa.indexOf(2) >= 0) {
					if (wanfa.indexOf(PokerDef.WanfaType.ThreeBomb) >= 0) {		// 333是炸弹玩法 333+n就是三带一牌型了
						continue;
					}
					if (cards.indexOf(PokerDef.PokerValue.HEART_3 * 10) >= 0) {
						continue;
					}
				}
				else if (wanfa.indexOf(1) >= 0) {
					if (wanfa.indexOf(PokerDef.WanfaType.ThreeBomb) >= 0) {		// 333是炸弹玩法 333+n就是三带一牌型了
						continue;
					}
					if (cards.indexOf(PokerDef.PokerValue.SPADE_3 * 10) >= 0) {
						continue;
					}
				}
			}

			if (pokerType.strWeightKey == '3' && pokerType.len == 3) {
				if (wanfa.indexOf(PokerDef.WanfaType.Win_First) >= 0 || wanfa.indexOf(PokerDef.WanfaType.ThreeBomb) < 0) {
					continue;
				}
				else if (wanfa.indexOf(PokerDef.WanfaType.HEART_3_First) >= 0 && cards.indexOf(PokerDef.PokerValue.HEART_3 * 10) >= 0) {
					continue;
				}
				else if (wanfa.indexOf(PokerDef.WanfaType.SPADE_3_First) >= 0 && cards.indexOf(PokerDef.PokerValue.SPADE_3 * 10) >= 0) {
					continue;
				}
			}

			if (pokerType.strWeightKey == 'A' && pokerType.len == 4) {
				if (wanfa.indexOf(PokerDef.WanfaType.ThreeBomb) >= 0) {
					continue;
				}
			}

			if (pokerType.strWeightKey == 'A' && pokerType.len == 3) {
				if (pokerType.id == PokerDef.PokerType.BOMB4) {
					if (wanfa.indexOf(PokerDef.WanfaType.ThreeBomb) < 0) {
						continue;
					}
				}
			}

		} else if (pokerType.id == PokerDef.PokerType.AIRPLANE_2 && splits != null && ret.remains != null) {
			var twoCnt = pokerType.len / 5;//需要凑几个对子
			var tempPairs = getPlaneExtraCards(ret.remains, pokerType, null, wanfa);
			if (tempPairs.length != 0) {
				cardList.push(splits.concat(tempPairs));
			}
			continue;
		}






		// remains = ret.remains;
		if (splits != null) {
			cardList.push(splits);
		}
		// console.log("==> ret :", ret);
	}
	return cardList;

};


exports.calcPrompts = calcPrompts;
exports.createPokerTypes = createPokerTypes;
exports.getCardListByType = getCardListByType;