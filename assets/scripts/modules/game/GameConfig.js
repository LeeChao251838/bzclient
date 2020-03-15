// 游戏配置
cc.GAMETYPE = {
    //TDHMJ: 0, // 推到胡
    //HMJ: 1, // 花麻将
    // BDMJ: 2, // 白搭麻将
    // HDMJ: 3, // 黄埭麻将
    //RGMJ: 4, // 如皋麻将
    //GD: 5, // 掼蛋
    // BZTDH: 6, // 亳州推到胡
    // BZDB: 7, // 亳州点炮推到胡
    // BZSZ: 8, // 亳州点炮推到胡
    // PZMJ: 9, // 邳州麻将
    // PZTWO: 13, // 邳州二人麻将
    // PZTHREE: 14, // 邳州三人麻将
    // YZDDH: 18, // 扬州跌倒胡
    // YZHZ: 19, // 仪征黄庄
    // GYCG: 20, // 高邮炒锅 二四六八十
    // GYPDZ: 21, // 高邮麻将 跑点子
    // YZER_YZ: 25, // 仪征二人麻将
    PDK: 45, // 跑得快，苏州关牌
    // DDZ: 27, // 斗地主
    // JDMJ: 28, // 江都麻将
    // YZER: 29, // 扬州二人麻将

    SZCT: 1, // 传统麻将 苏州 就是HMJ
    SZBD: 2, // 百搭麻将 苏州
    SZTDH: 0, // 推倒胡 苏州
    SZHD: 3, // 黄埭麻将 苏州
    SZWJ: 23, // 吴江麻将 苏州
    SZER: 4 // 二人麻将 苏州
};
//代理后台游戏id配置
cc.GAMEIDCONFIG = {
    HUAIAN: 1, // 掼蛋网淮安
    SUZHOU: 2, // 苏州
    BOZHOU: 3, // 亳州
    NANTONG: 4, // 南通
    LIANYUNGANG: 5, // 连云港
    PIZHOU: 6, // 邳州
    YZMJ: 9, // 扬州
    LBHUAIAN: 10, // 乐百淮安
    LBSZMJ: 11, // 乐百苏州
    LBHUAIAN_NEW: 15, // 新乐淮安
}
cc.URL_ROOMCONFIG = {
    [cc.GAMETYPE.PDK]: 0,
    [cc.GAMETYPE.SZTDH]: 1,
    [cc.GAMETYPE.SZCT]: 2,
    [cc.GAMETYPE.SZBD]: 3,
    [cc.GAMETYPE.SZHD]: 4,
    [cc.GAMETYPE.SZER]: 5,
    [cc.GAMETYPE.SZWJ]: 8,

}
cc.isMJ = function (type) {
    var result = false;
    switch (type) {
        case cc.GAMETYPE.SZER:
        case cc.GAMETYPE.SZWJ:
        case cc.GAMETYPE.SZBD:
        case cc.GAMETYPE.SZHD:
        case cc.GAMETYPE.SZCT:
        case cc.GAMETYPE.SZTDH:
            result = true;
            break;
        default:
            break;
    }

    return result;
};
cc.GAMETYPENAME = {
    [cc.GAMETYPE.SZCT]: "苏州麻将",//1
    [cc.GAMETYPE.SZHD]: "黄埭麻将",//3
    [cc.GAMETYPE.PDK]: "苏州关牌",//45
    [cc.GAMETYPE.SZBD]: "百搭麻将",//2
    [cc.GAMETYPE.SZTDH]: "推倒胡",//0
    [cc.GAMETYPE.SZER]: "二人麻将",//4
    [cc.GAMETYPE.SZWJ]: "吴江麻将",//23

};

// cc.Game3DType = [18, 21, 19, 28, 29, 30, 31, 32, 33, 34, 35];
cc.Game3DType = [0, 1, 2, 3, 4, 23];

//公会统计
cc.tongjiType = [
    cc.GAMETYPE.PDK,
    cc.GAMETYPE.GYPDZ,
    cc.GAMETYPE.YZDDH,
    cc.GAMETYPE.YZHZ,
    cc.GAMETYPE.YZER_YZ,
    cc.GAMETYPE.JDMJ,
    cc.GAMETYPE.YZER,
    cc.GAMETYPE.DDZ,
    cc.GAMETYPE.GD,
    cc.GAMETYPE.SZCT,
    cc.GAMETYPE.SZBD, // 百搭麻将 苏州
    cc.GAMETYPE.SZTDH, // 推倒胡 苏州
    cc.GAMETYPE.SZHD, // 黄埭麻将 苏州
    cc.GAMETYPE.SZWJ, // 吴江麻将 苏州
    cc.GAMETYPE.SZER // 二人麻将 苏州
];

cc.GDConfig = {
    limitePlayCard: true
};

cc.CardConfig = {
    [cc.GAMETYPE.YZDDH]: [3, 4, 8, 12],
    [cc.GAMETYPE.YZHZ]: [3, 4, 8, 4],
    [cc.GAMETYPE.GYCG]: [4, 8, 16],
    [cc.GAMETYPE.GYPDZ]: [4, 8]
};

cc.NewCardConfig = {
    gemsArr4quan: [3, 6, 12, 14],
    gemsArrAA4quan: [1, 1, 2, 3],
    gemsArrWin4quan: [2, 5, 11, 13],
    gemsArrGY: [6, 10, 18],
    gemsArrGYWin: [5, 9, 17],
    gemsArrAAGY: [1, 2, 4],
    gemsArrNEWGY: [6, 10],
    gemsArrNEWGYWin: [5, 9],
    gemsArrAANEWGY: [1, 2],
    gemsArrYZ: [6, 6, 10, 6, 10],
    gemsArrYZWin: [5, 5, 9, 5, 9],
    gemsArrAAYZ: [1, 1, 2, 1, 2],
    gemsArrYZTWO: [4, 4, 8, 4, 8],
    gemsArrYZTWOWin: [3, 3, 7, 3, 7],
    gemsArrAAYZTWO: [2, 2, 3, 2, 3],
    gemsArrYZ4quan: [3, 6, 10, 12],
    gemsArrYZWinquan: [2, 5, 9, 11],
    gemsArrYZAA4quan: [1, 2, 4, 5],
    gemsArrSZCT: [3, 3, 4, 8],
    gemsArrAASZCT: [1, 1, 1, 2],

    gemsArrSZER: [4, 4, 8, 16],
    gemsArrAASZER: [2, 2, 4, 8],

};
// 大赢家
cc.SZCardConfig_DYJ = {
    [cc.GAMETYPE.PDK]: [[4, 4, 8], [3, 3, 6], [2, 2, 4]],
    [cc.GAMETYPE.SZER]: [[2, 4, 8], [2, 3, 6], [2, 2, 4]],
    [cc.GAMETYPE.HAMJ]: [[2, 4, 8], [2, 4, 8], [2, 4, 8]],
    [cc.GAMETYPE.HZEMJ]: [[2, 4, 8], [2, 3, 6], [2, 4, 8]],
    [cc.GAMETYPE.HZMJ]: [[2, 4, 8], [2, 4, 8], [2, 4, 8]],
    [cc.GAMETYPE.CCMJ]: [[2, 4, 8], [2, 4, 8], [2, 4, 8]],
    [cc.GAMETYPE.CZMJ]: [[2, 4, 8], [2, 4, 8], [2, 4, 8]],
    [cc.GAMETYPE.SZHD]: [[2, 4, 8], [2, 4, 8], [2, 4, 8]],
    [cc.GAMETYPE.SZWJ]: [[8, 12, 16], [8, 12, 16], [8, 12, 16]],
    [cc.GAMETYPE.DDZ]: [3, 3, 6],
};

// aa
cc.SZCardConfig_AA = {
    [cc.GAMETYPE.PDK]: [[1, 1, 2], [1, 1, 2], [1, 1, 2]],
    [cc.GAMETYPE.SZER]: [[2, 4, 8], [2, 4, 8], [2, 4, 8]],
    [cc.GAMETYPE.HAMJ]: [[1, 1, 2], [1, 1, 2], [1, 1, 2]],
    [cc.GAMETYPE.SZCT]: [[1, 1, 2], [1, 1, 2], [1, 1, 2]],
    [cc.GAMETYPE.HZMJ]: [[1, 1, 2], [1, 1, 2], [1, 1, 2]],
    [cc.GAMETYPE.SZTDH]: [[1, 1, 2], [1, 1, 2], [1, 1, 2]],
    [cc.GAMETYPE.SZBD]: [[1, 1, 2], [1, 1, 2], [1, 1, 2]],
    [cc.GAMETYPE.SZHD]: [[1, 1, 2], [1, 1, 2], [1, 1, 2]],
    [cc.GAMETYPE.SZWJ]: [[1, 1, 2], [1, 1, 2], [1, 1, 2]],
    [cc.GAMETYPE.DDZ]: [1, 1, 2],
};

// 房主、群主
cc.SZCardConfig = {
    [cc.GAMETYPE.PDK]: [[3, 3, 6], [3, 3, 6], [2, 2, 4]], //4人，3人，2ren 
    [cc.GAMETYPE.SZER]: [[4, 8, 16], [4, 8, 16], [4, 8, 16]],
    [cc.GAMETYPE.HAMJ]: [[2, 4, 8], [2, 4, 8], [2, 4, 8]],
    [cc.GAMETYPE.SZCT]: [[3, 4, 8], [3, 4, 8], [2, 2, 4]],
    [cc.GAMETYPE.HZMJ]: [[2, 4, 8], [2, 4, 8], [2, 4, 8]],
    [cc.GAMETYPE.SZTDH]: [[3, 4, 8], [3, 4, 8], [2, 2, 4]],
    [cc.GAMETYPE.SZBD]: [[3, 4, 8], [3, 4, 8], [2, 2, 4]],
    [cc.GAMETYPE.SZHD]: [[3, 4, 8], [3, 4, 8], [2, 2, 4]],
    [cc.GAMETYPE.SZWJ]: [[3, 4, 8], [3, 4, 8], [3, 4, 8]],
    [cc.GAMETYPE.DDZ]: [3, 3, 6],
};

// 大赢家掼蛋 斗地主
cc.YZCardConfig_DYJ = {
    [cc.GAMETYPE.GD]: [[8, 12, 16], [8, 12, 16], [8, 12, 16]],
    [cc.GAMETYPE.DDZ]: [[4, 7, 10], [2, 2, 4]] //3人、2人
};

// aa 掼蛋 斗地主
cc.YZCardConfig_AA = {
    [cc.GAMETYPE.GD]: [[2, 3, 4], [2, 3, 4], [2, 3, 4]],
    [cc.GAMETYPE.DDZ]: [[1, 2, 3], [1, 1, 2]]
};

// 房主、群主  掼蛋 斗地主
cc.YZCardConfig = {
    [cc.GAMETYPE.GD]: [[8, 12, 16], [8, 12, 16], [8, 12, 16]],
    [cc.GAMETYPE.DDZ]: [[5, 8, 11], [2, 2, 4]] //3人、2人
};
cc.NewCardStrConfig = {
    gemsArrJDMJ: ["8局(       x6)", "16局(       x12)"],
    gemsArrJDMJWin: ["8局(       x5)", "16局(       x11)"],
    gemsArrQuanJDMJ: ["2圈(       x8)", "4圈(        x16)"],
    gemsArrQuanJDMJWin: ["2圈(       x7)", "4圈(        x15)"],
    gemsArrAAJDMJ: ["8局(       x1/人)", "16局(       x2/人)"],
    gemsArrQuanAAJDMJ: ["2圈(       x2/人)", "4圈(        x4/人)"],
    gemsArrPDK: ["4局(       x5)", "8局(       x8)", "16局(       x11)"],
    gemsArrPDKWin: ["4局(       x4)", "8局(       x7)", "16局(       x10)"],
    gemsArrPDKTWO: ["4局(       x4)", "8局(       x6)", "16局(       x10)"],
    gemsArrPDKTWOWin: ["4局(       x3)", "8局(       x5)", "16局(       x9)"],
    gemsArrAAPDK: [
        "4局(       x1/人)",
        "8局(       x2/人)",
        "16局(       x3/人)"
    ],
    gemsArrAAPDKTWO: [
        "4局(       x1/人)",
        "8局(       x2/人)",
        "16局(       x4/人)"
    ],
    gemsArrDDZ: ["6局(       x3)", "8局(       x3)", "16局(       x6)"],
    gemsArrAADDZ: ["4局(       x1/人)", "8局(       x1/人)", "16局(       x2/人)"]
};

cc.HuMethod = {
    Null: 0,
    JiePao: 1,
    DianPao: 2,
    ZiMo: 3,
    BeiZiMo: 4,
    GangKai: 5,
    BeiGangKai: 6,
    QiangGangHu: 7,
    BeiQiangGangHu: 8,
    ZhaHu: 9 // 诈胡
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
    TuoMaSi: 13, //托马斯
    TuoMaSi_HunYiSe: 14, //托马斯混一色
    TuoMaSi_DuiDuiHu: 15, //托马斯对对胡
    TuoMaSi_QiXiaoDui: 16, //托马斯七对
    XiaoQing: 17, //小清
    TuoMaSi_HunDuiDui: 18, //托马斯混对对
    TuoMaSi_HunQiDui: 19, //托马斯混七对
    DaQing: 20, //大清
    TuoMaSi_ShuangQi: 21, //托马斯双七
    XiaoQingQiDui: 22, //小清七对
    TuoMaSi_QingDuiDui: 23, //托马斯清对对
    HunShuangQi: 24, //混双七
    TuoMaSi_HunShuangQi: 25, //托马斯混双七
    DaQingQiDui: 26, //大清七对
    XiaoQingShuangQi: 27, //小清双七
    DaQingShuangQi: 28, //大清双七
    QuanDaYuan: 29, //全大元

    GangKai: 30, // 杠开
    DiHu: 31, // 地胡
    ZhiTing: 32, // 直听
    TianHu: 33, // 天胡
    QiangGangHu: 34, // 抢杠胡
    HunLong: 35, //混龙
    QingLong: 36, //清龙
    ShuangQiDui: 37, //双七对 （与 8 牌型相同）
    RepShuangQiDui: 38 //双双七对 （与 11 牌型相同）
};

cc.HuStr = {
    [HuType.XiaoHuZi]: "小胡子", // 小胡子
    [HuType.DuiDuiHu]: "对对胡", // 对对胡
    [HuType.HunYiSe]: "混一色", // 混一色
    [HuType.YiTiaoLong]: "一条龙", // 一条龙
    [HuType.QiDui]: "七小对", // 七小对
    [HuType.QingYiSe]: "清一色", // 清一色
    [HuType.HunDuiDui]: "混对对", // 混对对
    [HuType.HunQiDui]: "混七对", // 混七对
    [HuType.ShuangQi]: "炸七对", // 双七对
    [HuType.QingDuiDui]: "清对对", // 清对对
    [HuType.QingQiDui]: "清七对", // 清七对
    [HuType.HaoShuangQi]: "炸七对", // 豪华双七对
    [HuType.FengQing]: "风清", // 风清 进园子20分，紧淌40分
    [HuType.HunLong]: "混龙", //混龙
    [HuType.QingLong]: "清龙", //清龙
    [HuType.ShuangQiDui]: "双七对", //双七对 （与 8 牌型相同）
    [HuType.RepShuangQiDui]: "双双七对", //双双七对 （与 11 牌型相同）

    [HuType.TuoMaSi]: "托马斯",
    [HuType.TuoMaSi_HunYiSe]: "托马斯混一色",
    [HuType.TuoMaSi_DuiDuiHu]: "托马斯对对胡",
    [HuType.TuoMaSi_QiXiaoDui]: "托马斯七对",
    [HuType.XiaoQing]: "小清",
    [HuType.TuoMaSi_HunDuiDui]: "托马斯混对对",
    [HuType.TuoMaSi_HunQiDui]: "托马斯混七对",
    [HuType.DaQing]: "大清",
    [HuType.TuoMaSi_ShuangQi]: "托马斯双七",
    [HuType.XiaoQingQiDui]: "小清七对",
    [HuType.TuoMaSi_QingDuiDui]: "托马斯清对对",
    [HuType.HunShuangQi]: "混双七",
    [HuType.TuoMaSi_HunShuangQi]: "托马斯混双七",
    [HuType.DaQingQiDui]: "大清七对",
    [HuType.XiaoQingShuangQi]: "小清双七",
    [HuType.DaQingShuangQi]: "大清双七",
    [HuType.QuanDaYuan]: "全大元",

    [HuType.GangKai]: "杠开x2",
    [HuType.DiHu]: "地胡x2",
    [HuType.ZhiTing]: "直听x2",
    [HuType.TianHu]: "天胡x2",
    [HuType.QiangGangHu]: "抢杠胡x3"
};

const GYHuType = {
    XiaoHuZi: 0, // 小胡子
    SanZhao: 1, // 三招
    DuiDuiHu: 2, // 对对胡
    HunYiSe: 3, // 混一色
    YiTiaoLong: 4, // 一条龙
    SanFeng: 5, // 三风
    QiDui: 6, // 七小对
    QingYiSe: 7, // 清一色
    DaSanFeng: 8, // 大三风
    XiaoKan: 9, // 小坎
    SiZhao: 10, // 四招
    DaKan: 11, // 大坎
    ShuangQi: 12, // 双七对
    SiXi: 13, // 四喜
    ShuangShuangQi: 14, // 双双七对
    HaoShuangQi: 15, // 豪华双七对
    QuanBaiDa: 16 // 全百搭
};

cc.GYHuStr = {
    [GYHuType.XiaoHuZi]: "小胡子", // 小胡子
    [GYHuType.SanZhao]: "三招", // 三招
    [GYHuType.DuiDuiHu]: "对对胡", // 对对胡
    [GYHuType.HunYiSe]: "混一色", // 混一色
    [GYHuType.YiTiaoLong]: "一条龙", // 一条龙
    [GYHuType.SanFeng]: "三风", // 三风
    [GYHuType.QiDui]: "七小对", // 七小对
    [GYHuType.QingYiSe]: "清一色", // 清一色
    [GYHuType.DaSanFeng]: "大三风", // 大三风
    [GYHuType.XiaoKan]: "小坎", // 小坎
    [GYHuType.SiZhao]: "四招", // 四招
    [GYHuType.DaKan]: "大坎", // 大坎
    [GYHuType.ShuangQi]: "双七对", // 双七对
    [GYHuType.SiXi]: "四喜", // 四喜
    [GYHuType.ShuangShuangQi]: "双双七对", // 双双七对
    [GYHuType.HaoShuangQi]: "豪华双七对", // 豪华双七对
    [GYHuType.QuanBaiDa]: "全百搭" // 全百搭
};

const NEWHuType = {
    DiHu: 0, // 底胡
    SanZhao: 1, // 三招
    DuiDuiHu: 2, // 对对胡
    HunYiSe: 3, // 混一色
    YiTiaoLong: 4, // 一条龙
    SanFeng: 5, // 三风
    QiDui: 6, // 七小对
    WuHuaGuo: 7, // 无花果
    SiZhao: 8, // 四招
    QingYiSe: 9, // 清一色
    DaSanFeng: 10, // 大三风
    TianHu: 11, // 天胡
    ShuangQi: 12, // 双七对
    SiXi: 13, // 四喜
    ShuangShuangQi: 14, // 双双7
    HaoShuangQi: 15, // 豪华双七对
    QuanBaiDa: 16 // 全百搭
};

cc.NEWHuStr = {
    [NEWHuType.DiHu]: "底胡", // 底胡
    [NEWHuType.SanZhao]: "三招", // 三招
    [NEWHuType.DuiDuiHu]: "对对胡", // 对对胡
    [NEWHuType.HunYiSe]: "混一色", // 混一色
    [NEWHuType.YiTiaoLong]: "一条龙", // 一条龙
    [NEWHuType.SanFeng]: "三风", // 三风
    [NEWHuType.QiDui]: "七小对", // 七小对
    [NEWHuType.WuHuaGuo]: "无花果", // 无花果
    [NEWHuType.SiZhao]: "四招", // 四招
    [NEWHuType.QingYiSe]: "清一色", // 清一色
    [NEWHuType.DaSanFeng]: "大三风", // 大三风
    [NEWHuType.TianHu]: "天胡", // 天胡
    [NEWHuType.ShuangQi]: "双七对", // 双七对
    [NEWHuType.SiXi]: "四喜", // 四喜
    [NEWHuType.ShuangShuangQi]: "双双七对", // 双双七对
    [NEWHuType.HaoShuangQi]: "豪华双七对", // 豪华双七对
    [NEWHuType.QuanBaiDa]: "全百搭" // 全百搭
};

const NormalScoreType = {
    MenQing: 0, // 门清
    QiangGangHu: 3, // 抢杠
    DaDiaoChe: 4, // 大吊车
    GangKai: 5, // 杠开
    Flower: 11, // 花
    TianHu: 12, // 天胡
    WuPei: 13, // 无配
    BaBaShuang: 14 // 把把双
};

cc.NSStr = {
    [NormalScoreType.MenQing]: "门清", // 门清
    [NormalScoreType.QiangGangHu]: "抢杠", // 抢杠
    [NormalScoreType.DaDiaoChe]: "大吊车", // 大吊车
    [NormalScoreType.GangKai]: "杠开", // 杠开
    [NormalScoreType.Flower]: "花", // 花
    [NormalScoreType.TianHu]: "天胡", // 天胡
    [NormalScoreType.WuPei]: "无配", // 无配
    [NormalScoreType.BaBaShuang]: "把把双" // 把把双
};

const NEWNormalScoreType = {
    MenQing: 0, // 门清
    XiaoXi: 1, // 小喜
    DaXi: 2, // 大喜
    QiangGangHu: 3, // 抢杠
    GangKai: 4, // 杠开
    Flower: 10,
    DaDiaoChe: 11,
    BaBaShuang: 12,
    YouPei: 13,
    WuPei: 14
};

cc.NEWNSStr = {
    [NEWNormalScoreType.MenQing]: "门清", // 门清
    [NEWNormalScoreType.XiaoXi]: "小喜", // 小喜
    [NEWNormalScoreType.DaXi]: "大喜", // 大喜
    [NEWNormalScoreType.QiangGangHu]: "抢杠", // 抢杠
    [NEWNormalScoreType.GangKai]: "杠开", // 杠开
    [NEWNormalScoreType.Flower]: "花", // 花
    [NEWNormalScoreType.DaDiaoChe]: "大吊车", // 大吊车
    [NEWNormalScoreType.BaBaShuang]: "把把双", // 把把双
    [NEWNormalScoreType.YouPei]: "有配", // 有配
    [NEWNormalScoreType.WuPei]: "无配" // 无配
};

// 江都
const JDMJHuType = {
    XiaoHu: 0, // 小胡
    DuiDuiHu: 1, // 对对胡
    HunYiSe: 2, // 混一色
    QingYiSe: 3, // 清一色
    ZiYiSe: 4, // 字一色
    TianHu: 5, // 天胡
    DiHu: 6, // 地胡
    DaSanYuan: 7, // 大三元
    XiaoSanYuan: 8, // 小三元
    BaHua: 9, // 八花
    DaSiXi: 10, // 大四喜
    XiaoSiXi: 11, // 小四喜
    ZhongFaBai: 12, // 中发白
    QuanFeng: 13, // 圈风
    MenFeng: 14, // 门风
    SiBaiDa: 15, // 四百搭
    HuaGang: 16, // 花杠
    HuaPai: 17, // 花牌
    ZhongFaBai_2: 18 // 中发白
};

cc.JDMJHuTypeStr = {
    [JDMJHuType.XiaoHu]: "小胡 0番",
    [JDMJHuType.DuiDuiHu]: "对对胡 2番",
    [JDMJHuType.HunYiSe]: "混一色 2番",
    [JDMJHuType.QingYiSe]: "清一色 6番",
    [JDMJHuType.ZiYiSe]: "字一色 6番",
    [JDMJHuType.TianHu]: "天胡 6番",
    [JDMJHuType.DiHu]: "地胡 6番",
    [JDMJHuType.DaSanYuan]: "大三元 6番",
    [JDMJHuType.XiaoSanYuan]: "小三元 4番",
    [JDMJHuType.BaHua]: "八花 6番",
    [JDMJHuType.DaSiXi]: "大四喜 6番",
    [JDMJHuType.XiaoSiXi]: "小四喜 4番",
    [JDMJHuType.ZhongFaBai]: "中发白 1番",
    [JDMJHuType.QuanFeng]: "圈风 1番",
    [JDMJHuType.MenFeng]: "门风 1番",
    [JDMJHuType.SiBaiDa]: "四百搭 2番",
    [JDMJHuType.HuaGang]: "花杠 2番",
    [JDMJHuType.HuaPai]: "花牌 1番",
    [JDMJHuType.ZhongFaBai_2]: "中发白 2番"
};

cc.PZMJConfig = {
    normal: 0, // 创建并进入
    forOther: 1, // 创建不进入

    HuType: {
        Null: 0,
        LiuJu: 1,
        PingHu: 2,
        TaPai: 3,
        PiaoHun: 4,
        BaoZhuang: 5
    },
    // ScoreType : {
    //     DiHu: 1,
    //     DuiZi: 2,
    //     Kan: 3,
    //     SongGang: 4,
    //     ZiGang: 5,
    //     XianNing: 6,
    //     HunDi: 7,
    // },
    ScoreTypeStr: {
        [1]: "底胡",
        [2]: "对子",
        [3]: "坎",
        [4]: "送杠",
        [5]: "自杠",
        [6]: "掀拧",
        [7]: "荤底"
    },
    ActionType: ["胡", "幺", "分"]
    // ActionType : {// [幺: [胡, 幺, 分], 草牌: [胡, 幺, 分]]
    //     [ScoreType.DiHu]: [10, 0, 0],
    //     [ScoreType.DuiZi]: [2, 0, 0], [1, 0, 0],
    //     [ScoreType.Kan]: [4, 1, 0], [2, 0, 0],
    //     [ScoreType.SongGang]: [8, 2, 0], [4, 0, 0],
    //     [ScoreType.ZiGang]: [[12, 3, 0], [6, 0, 0]],
    //     [ScoreType.XianNing]: [[0, 0, -10]], //
    //     [ScoreType.HunDi]: [[0, 0, 30]],
    // },
};
cc.GameConfigJson = {
    filterword: "fileData/filterword" // 屏蔽词库
};
cc.XConfig = {
    [cc.GAMETYPE.YZDDH]: false, // 扬州麻将_扬州跌倒胡
    [cc.GAMETYPE.YZHZ]: false, // 扬州麻将_仪征
    [cc.GAMETYPE.GYCG]: false, // 扬州麻将_高邮炒锅 二四六八十
    [cc.GAMETYPE.GYPDZ]: false, // 扬州麻将_新高邮麻将 跑点子
    [cc.GAMETYPE.YZER_YZ]: false, // 扬州麻将_仪征二人麻将
    [cc.GAMETYPE.PDK]: true, // 跑得快
    [cc.GAMETYPE.DDZ]: false, // 斗地主
    [cc.GAMETYPE.JDMJ]: true, // 江都麻将
    [cc.GAMETYPE.YZER]: false, // 扬州二人麻将
    [cc.GAMETYPE.SZER]: true,         // 涟水麻将
    [cc.GAMETYPE.HAMJ]: false,         // 淮安麻将
    [cc.GAMETYPE.SZCT]: true,         // 红中麻将
    [cc.GAMETYPE.SZBD]: true,         // 楚州麻将
    [cc.GAMETYPE.SZTDH]: true,         // 出铳麻将
    [cc.GAMETYPE.SZHD]: true,         // 团团转麻将
    [cc.GAMETYPE.HZEMJ]: false,         // 洪泽麻将
    [cc.GAMETYPE.HAER]: false,         // 淮安二人
    [cc.GAMETYPE.GD]: false, // 掼蛋
    [cc.GAMETYPE.SZCT]: true, // 传统麻将 苏州
    [cc.GAMETYPE.SZBD]: true, // 百搭麻将 苏州
    [cc.GAMETYPE.SZTDH]: true, // 推倒胡 苏州
    [cc.GAMETYPE.SZHD]: true, // 黄埭麻将 苏州
    [cc.GAMETYPE.SZWJ]: true, // 吴江麻将 苏州
    [cc.GAMETYPE.SZER]: true // 二人麻将 苏州
};

//玩法优先级
cc.GAMETYPERANK = {
    [cc.GAMETYPE.SZCT]: 1,
    [cc.GAMETYPE.SZHD]: 2,
    [cc.GAMETYPE.PDK]: 3,
    [cc.GAMETYPE.SZBD]: 4,
    [cc.GAMETYPE.SZTDH]: 5,
    [cc.GAMETYPE.SZER]: 6,
    [cc.GAMETYPE.SZWJ]: 7,
}