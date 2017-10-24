"use strict";
//available: 当前支持快捷支付的银行
module.exports = {
    ABC: {name: "农业银行", available: 1, limit: '5万单笔/单日',limitAmount:"50000"},
    BCCB: {name: "北京银行", available: 0, limit: '',limitAmount:""},
    BOC: {name: "中国银行", available: 1, limit: '5万/笔，10万/单日',limitAmount:"50000"},
    BOCOM: {name: "交通银行", available: 1, limit: '5万单笔/单日',limitAmount:"50000"},
    CCB: {name: "建设银行", available: 1, limit: '5万/笔，10万/单日',limitAmount:"50000"},
    CEB: {name: "光大银行", available: 1, limit: '5万/笔，10万/单日',limitAmount:"50000"},
    CIB: {name: "兴业银行", available: 1, limit: '5万单笔/单日',limitAmount:"50000"},
    CITIC: {name: "中信银行", available: 1, limit: '5万/笔，10万/单日',limitAmount:"50000"},
    CMB: {name: "招商银行", available: 1, limit: '1000元单笔/单日',limitAmount:"1000"},
    CMBC: {name: "民生银行", available: 1, limit: '5万/笔，10万/单日',limitAmount:"50000"},
    GDB: {name: "广发银行", available: 1, limit: '5万/笔，10万/单日',limitAmount:"50000"},
    HKBEA: {name: "东亚银行", available: 0, limit: '',limitAmount:""},
    //HXB: {name: "华夏银行", available: 1, limit: '5万单笔/单日',limitAmount:"50000"},
    ICBC: {name: "工商银行", available: 1, limit: '5万单笔/单日',limitAmount:"50000"},
    //PSBC: {name: "邮储银行", available: 1, limit: '5万单笔/单日',limitAmount:"50000"},
    SPDB: {name: "浦发银行", available: 1, limit: '5万单笔/单日',limitAmount:"50000"}, 
    SRCB: {name: "上海农村商业银行", available: 0, limit: '',limitAmount:""},
    WZCB: {name: "温州银行", available: 0, limit: '',limitAmount:""},
    PINGAN: {name: "平安银行", available: 1, limit: '5万/笔，10万/单日',limitAmount:"50000"}
    /*BJRCB: {name: "北京农村商业银行", available: 0, limit: ''},
    BOS: {name: "上海银行", available: 0, limit: ''},
    CBHB: {name: "渤海银行", available: 0, limit: ''},
    CZB: {name: "浙商银行", available: 0, limit: ''},
    HZCB: {name: "杭州银行", available: 0, limit: ''},
    HJCB: {name: "南京银行", available: 0, limit: ''},
    SDB: {name: "深发银行", available: 0, limit: ''},
    NJCB: {name: "南京银行", available: 0, limit: ''}*/
};