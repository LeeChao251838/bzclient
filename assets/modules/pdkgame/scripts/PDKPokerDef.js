// 扑克牌游戏的基础定义
var exports = module.exports;
// 没有牌
exports.POKER_NONE = 0;
// 带索引的牌背
exports.POKER_BACK = 541;


// 扑克牌的组成包含：花色、牌点、索引
// 相同牌之间索引不相同，因此三个元素组合在一起可以区别开任意一张牌
// 组合公式：
// nCard 表示 三者唯一的组合值：nCard = ((nSuit * 13) + nPoint) * 10 + idx
// nValue 表示 牌值（花色和牌点的组合值）：nValue = (nSuit * 13) + nPoint
// nPoint 为 牌点值
// nSuit 为 花色值

exports.PokerValue = {
    DIAMOND_A        :0,    // 方块
    DIAMOND_2        :1,
    DIAMOND_3        :2,
    DIAMOND_4        :3,
    DIAMOND_5        :4,
    DIAMOND_6        :5,
    DIAMOND_7        :6,
    DIAMOND_8        :7,
    DIAMOND_9        :8,
    DIAMOND_10       :  9,
    DIAMOND_J        : 10,
    DIAMOND_Q        : 11,
    DIAMOND_K        : 12,
    CLUB_A           : 13,   // 梅花
    CLUB_2           : 14,
    CLUB_3           : 15,
    CLUB_4           : 16,
    CLUB_5           : 17,
    CLUB_6           : 18,
    CLUB_7           : 19,
    CLUB_8           : 20,
    CLUB_9           : 21,
    CLUB_10          : 22,
    CLUB_J           : 23,
    CLUB_Q           : 24,
    CLUB_K           : 25,
    HEART_A          : 26,   // 红桃
    HEART_2          : 27,
    HEART_3          : 28,
    HEART_4          : 29,
    HEART_5          : 30,
    HEART_6          : 31,
    HEART_7          : 32,
    HEART_8          : 33,
    HEART_9          : 34,
    HEART_10         : 35,
    HEART_J          : 36,
    HEART_Q          : 37,
    HEART_K          : 38,
    SPADE_A          : 39,   // 黑桃
    SPADE_2          : 40,
    SPADE_3          : 41,
    SPADE_4          : 42,
    SPADE_5          : 43,
    SPADE_6          : 44,
    SPADE_7          : 45,
    SPADE_8          : 46,
    SPADE_9          : 47,
    SPADE_10         : 48,
    SPADE_J          : 49,
    SPADE_Q          : 50,
    SPADE_K          : 51,

    JOKER_B          : 52,    // 小王
    JOKER_R          : 53,    // 大王

    BACK             : 54,    // 背面

    MIN              : 0,     // 最小的牌值
    MAX              : 53,    // 最大的牌值
    NONE             : 99,    // 无效的牌值
};


// 扑克花色定义
exports.PokerSuit = {
    DIAMOND  :    0,   // 方块
    CLUB     :    1,   // 梅花
    HEART    :    2,   // 红桃
    SPADE    :    3,   // 黑桃
    JOKER    :    4,   // 大王和小王 背面 与 PASS

    MIN      :    0,   // 最小花色
    MAX      :    4,   // 最大花色
    NONE     :    5,   // 无效花色
};

// 扑克牌的Key值定义
exports.PokerKey = {
    PK_1    :   '1',
    PK_2    :   '2',
    PK_3    :   '3',
    PK_4    :   '4',
    PK_5    :   '5',
    PK_6    :   '6',
    PK_7    :   '7',
    PK_8    :   '8',
    PK_9    :   '9',
    PK_T   :    'T',
    PK_J    :   'J',
    PK_Q    :   'Q',
    PK_K    :   'K',
    PK_A    :   'A',
    PK_X    :   'X', // 癞子、百搭
    PK_B    :   'B', // 小王
    PK_R    :   'R', // 大王
};

// 扑克牌点定义
exports.PokerPoint = {
    PT_A        :    0,
    PT_2        :    1,
    PT_3        :    2,
    PT_4        :    3,
    PT_5        :    4,
    PT_6        :    5,
    PT_7        :    6,
    PT_8        :    7,
    PT_9        :    8,
    PT_T        :    9,
    PT_J        :    10,
    PT_Q        :    11,
    PT_K        :    12,

    PT_MIN      :    0,    // 最小牌点
    PT_MAX      :    12,   // 最大牌点
    PT_NONE     :    13,   // 无效牌点
};

// 牌点和Key的映射关系
exports.PokerMap = {
    [exports.PokerPoint.PT_A]: exports.PokerKey.PK_A,       //[0]='A'
	[exports.PokerPoint.PT_2]: exports.PokerKey.PK_2,       //[1]='2'
	[exports.PokerPoint.PT_3]: exports.PokerKey.PK_3,       //[2]='3'
	[exports.PokerPoint.PT_4]: exports.PokerKey.PK_4,       //[3]='4'
	[exports.PokerPoint.PT_5]: exports.PokerKey.PK_5,       //[4]='5'
	[exports.PokerPoint.PT_6]: exports.PokerKey.PK_6,       //[5]='6'
	[exports.PokerPoint.PT_7]: exports.PokerKey.PK_7,       //[6]='7'
	[exports.PokerPoint.PT_8]: exports.PokerKey.PK_8,       //[7]='8'
	[exports.PokerPoint.PT_9]: exports.PokerKey.PK_9,       //[8]='9'
	[exports.PokerPoint.PT_T]: exports.PokerKey.PK_T,       //[9]='T'
	[exports.PokerPoint.PT_J]: exports.PokerKey.PK_J,       //[10]='J'
	[exports.PokerPoint.PT_Q]: exports.PokerKey.PK_Q,       //[11]='Q'
	[exports.PokerPoint.PT_K]: exports.PokerKey.PK_K,       //[12]='K'
};

// 支持的扑克排序类型
exports.PokerSortType = {
    // 默认权重从大到小
    None                        :   0,
    Weight_Suit                 :   1,  // 先按权重，权重相同按花色
    AdjustedWeight_Suit         :   2,  // 先按调整后的权重，权重相同按花色
    Suit_AdjustedWeight         :   3,  // 先按花色，花色相同按调整后的权重
    Count_Weight_Suit           :   4,  // 先按张数，张数相同按权重，权重相同按花色
    Count_AdjustedWeight_Suit   :   5,  // 先按张数，张数相同按调整后的权重，权重相同按花色
    ReserveAdjustedWeight_Suit  :   6,  // 先按调整后的权重(从小到大)，权重相同按花色
};


exports.PokerType = {
	INVALID: -1,        /* 不是牌型 */
	PASS: 0,            /* 不要 */
	SINGLE: 1,          /* 单张 */
	PAIR: 2,            /* 对子 */
	THREE: 3,           /* 三张 */
	THREE_2: 4,         /* 三带二 */
	STRAIGHT_2: 5,      /* 2个以上的对子*/
	AIRPLANE: 6,        /* 飞机 */
	AIRPLANE_2: 7,      /* 飞机 连续三带二（飞机）333+22+444+kk */
	BOMB4: 8,           /* 炸弹 */
	BOMB4_2: 9,			/* 四带二 */
    STRAIGHT: 10,		/* 顺子 */
    THREE_1: 11,           /* 三带一 */
    AIRPLANE_1: 12,             /*飞机 连续三带一 333+2+444+k */
};

// 玩法
exports.WanfaType = {
	Win_First: 0,		//赢家先出
	SPADE_3_First: 1,	//黑桃三先出
	HEART_3_First: 2,	//红桃三先出
	BombDouble: 4,       //炸弹翻倍
	MustPlay: 5, 		//必管
	isThree_One:6,		//三带一
	Cards_16: 7,			//16张牌
	Cards_15: 8,			//15张牌
	BombScore: 9,       //炸弹加分
	Plane_1:10,			//飞机带单张
	ThreeBomb:11,		//3个A3个3是炸弹
};

exports.PokerTypeWeight = {
	[exports.PokerType.SINGLE]: 1,
	[exports.PokerType.PAIR]: 1,
	[exports.PokerType.THREE]: 1,
	[exports.PokerType.THREE_2]: 1,
	[exports.PokerType.STRAIGHT]: 1,
	[exports.PokerType.STRAIGHT_2]: 1,
    [exports.PokerType.AIRPLANE]: 1,
    [exports.PokerType.BOMB4_2]: 1,
	[exports.PokerType.BOMB4]: 2,
    [exports.PokerType.AIRPLANE_2]: 1,
    [exports.PokerType.THREE_1]: 1,
    [exports.PokerType.AIRPLANE_1]: 1,
};

//牌KAY的权重
exports.PokerKeyWeight = {
    [exports.PokerKey.PK_3]: 1,
	[exports.PokerKey.PK_4]: 2,
	[exports.PokerKey.PK_5]: 3,
	[exports.PokerKey.PK_6]: 4,
	[exports.PokerKey.PK_7]: 5,
	[exports.PokerKey.PK_8]: 6,
	[exports.PokerKey.PK_9]: 7,
	[exports.PokerKey.PK_T]: 8,
	[exports.PokerKey.PK_J]: 9,
	[exports.PokerKey.PK_Q]: 10,
	[exports.PokerKey.PK_K]: 11,
	[exports.PokerKey.PK_A]: 12,
	[exports.PokerKey.PK_2]: 13,
};

// exports.PokerKeyWeight = {
//     [exports.PokerKey.PK_1]: 1,
// 	[exports.PokerKey.PK_2]: 2,
// 	[exports.PokerKey.PK_3]: 3,
// 	[exports.PokerKey.PK_4]: 4,
// 	[exports.PokerKey.PK_5]: 5,
// 	[exports.PokerKey.PK_6]: 6,
// 	[exports.PokerKey.PK_7]: 7,
// 	[exports.PokerKey.PK_8]: 8,
// 	[exports.PokerKey.PK_9]: 9,
// 	[exports.PokerKey.PK_T]: 10,
// 	[exports.PokerKey.PK_J]: 11,
// 	[exports.PokerKey.PK_Q]: 12,
// 	[exports.PokerKey.PK_K]: 13,
// 	[exports.PokerKey.PK_A]: 14,
// 	[exports.PokerKey.PK_X]: 15,
// 	[exports.PokerKey.PK_B]: 16,
// 	[exports.PokerKey.PK_R]: 17,
// };

exports.PlayCardResult = {
    OK:         1, // 出牌成功！
    ERR_NOCARD: 2, // 请选择要出的牌！
    ERR_RULE:   3, // 出牌不符合规则！
    ERR_LESS:   4, // 出牌不够大
    
};

exports.PlayCardResultHint = {
    [exports.PlayCardResult.OK]:         "出牌成功！",
    [exports.PlayCardResult.ERR_NOCARD]: "请选择要出的牌！",
    [exports.PlayCardResult.ERR_RULE]:   "出牌不符合规则！",
    [exports.PlayCardResult.ERR_LESS]:   "出牌不够大！",
    
};