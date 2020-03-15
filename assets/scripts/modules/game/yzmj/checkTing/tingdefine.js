/*
* 筒:0-8, 条:9-17, 万:18-26(普通牌)
* 东:27, 南:31, 西:35, 北:39(风牌)
* 中:43, 发:47, 白:51(箭牌)
* 百:52, 大白:53(苏州花) 
* 春:54, 夏:55,秋:56,冬:57,梅:58,兰:59,竹:60,菊:61(花牌)
*/

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
module.exports = {
	CardDef,
	HuType,
	WanFaType,
	CardType
}