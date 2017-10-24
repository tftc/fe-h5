import './index.less';

import $ from 'webpack-zepto';
import _ from 'lodash';

var formatter = require('../../../both/formatter');
var repayment = require('../common/loan-repay');

var loan = {
    init: function() {
        this.el = {
            body: $('body'),

            payment: $('#payment')
        };

        this.bindEvent();
    },
    bindEvent: function() {
        var self = this;

        //去还款按钮
        self.el.payment.on('click', repayment.repay);
    }
};
$(function() {
    loan.init();
});