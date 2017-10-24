/**
 * @file
 * @desc
 * @author
 * @date 2017/9/4
 */

/**
 * 将数字格式化为货币格式
 * @param num           要格式化的数字    例: 1000
 * @param dLength       保留小数位       例: 2
 * @returns {string}                    例: 1,000.00
 */
exports.currency = function(num, dLength) {
    var p = num.toString().split("."),
        integer = p[0].split("").reverse().reduce(function(acc, num, i, orig) {
            return  num=="-" ? acc : num + (i && !(i % 3) ? "," : "") + acc;
        }, ""),
        decimal = p[1] ? '.' + p[1] : '';

    if(dLength && !isNaN(dLength) && dLength > 0) {
        decimal = decimal || 0;
        decimal = '.' + Number(decimal).toFixed(dLength).split('.')[1];
    }
    return integer + decimal;
};

/**
 * 格式化银行卡号，星号遮罩
 * @param str
 * @returns {string}
 */
exports.bankAccount = function (str) {
    str = str.trim();
    var result = '';
    if (str.length == 16) {
        result = str.substring(0, 4) + ' ' + '**** ****' + ' ' + str.substring(12);
    } else if (str.length == 19) {
        result = str.substring(0, 6) + ' ' + '*******' + ' '
            + str.substring(13);
    } else {
        console.error('Bank account number '+str+' is invalid');
        result = str;
    }
    //return result.replace(/\s/g, '&nbsp;')
    return result;
};