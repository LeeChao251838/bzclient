var HuTypes = {
    Normal : 0,
    QiDui : 1,
    QingYiSe : 2,
    DuiDuiHu : 3,
    HunYiSe : 4,
    HDLY : 5,
    DaMenQing : 6,
    XiaoMenQing : 7,
    HaoQi : 8,
    DaDiaoChe : 9,
    TianHu : 10,
    DiHu : 11,
    GangKai : 12,
    BaoJiaoZi : 13,
    QiangGang : 14,
    DiaoBaiDa : 15,
    NoBaiDa : 16,
}

var NoramlFlowerTypes = {
    
    BASE            :     1 ,               //底
    FLOW            :     2 ,               //漂
    YING            :     3 ,               //硬花
    MINGGANG        :     4 ,               //明杠（筒万条）
    ANGANG          :     5 ,               //暗杠（筒万条）
    ZIPENG          :     6 ,               //字碰（东南西北）
    ZIANKE          :     7 ,               //字暗刻（东南西北）     
    ZIMINGGANG      :     8 ,               //字明杠 （东南西北）
    ZIANGANG        :     9 ,               //字暗杠 （东南西北）
}

var NoramlFlowers = {
    [NoramlFlowerTypes.BASE         ]   :     5,                //底
    [NoramlFlowerTypes.YING         ]   :     1 ,               //硬花
    [NoramlFlowerTypes.MINGGANG     ]   :     1 ,               //明杠（筒万条）
    [NoramlFlowerTypes.ANGANG       ]   :     2 ,               //暗杠（筒万条）
    [NoramlFlowerTypes.ZIPENG       ]   :     1 ,               //字碰（东南西北）
    [NoramlFlowerTypes.ZIANKE       ]   :     2 ,               //字暗刻 （东南西北）        
    [NoramlFlowerTypes.ZIMINGGANG   ]   :     3 ,               //字明杠 （东南西北）
    [NoramlFlowerTypes.ZIANGANG     ]   :     4 ,               //字暗杠 （东南西北）
}

var OperType = {
    NULL      : 0x00000000,    // 无效操作
    HU        : 0x00000001,    // 胡 1
    PENG      : 0x00000002,    // 碰 2
    ZHI_GANG  : 0x00000004,    // 直杠 4
    PENG_GANG : 0x00000008,    // 碰杠(面下杠) 8
    AN_GANG   : 0x00000010,    // 暗杠 16
    LCHI      : 0x00000020,    // 左吃 32
    MCHI      : 0x00000040,    // 中吃 64
    RCHI      : 0x00000080,    // 右吃 128
    BUHA      : 0x00000100,    // 补花 256
    PLAYCARD  : 0x00000200,    // 打牌 512
    CANCEL    : 0x00000400,    // 取消 1024
    TING      : 0x00000800,    // 听牌 2048
    GETCARD   : 0x00001000,    // 获得新牌（发新牌）4096

    RESERVE   : 0x00010000,    // 保留操作，用于游戏中自定义 65536

    GANG      : 0x00000004 | 0x00000008 | 0x00000010,   // 所有杠与集
    
    CHI       : 0x00000020 | 0x00000040 | 0x00000080,   // 所有吃与集
}

var exports = module.exports;

exports.HuTypes = HuTypes;
exports.NoramlFlowerTypes = NoramlFlowerTypes;
exports.NoramlFlowers = NoramlFlowers;
exports.OperType = OperType;
