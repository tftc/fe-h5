/**
 * @file
 * @desc
 * @author
 * @date 2017/9/1
 */

import './index.less';

import $ from 'webpack-zepto';
import _ from 'lodash';

var formatter = require('../../../both/formatter');
var mapping = require('../common/banks-mapping');
var spinning = require('../common/spinning');

var loan = {
    init: function() {
        this.el = {
            p2pUid: $('#p2pUid').val(),
            token: $('#token').val(),
            cards: $('#cards')
        };

        this.renderCards();
    },
    renderCards: function() {
        var self = this;
        spinning.start();
        $.ajax({
            'url': '/v1/api/account/queryBankCardList',
            'beforeSend': function(request) {
                request.setRequestHeader("token", self.el.token);
                request.setRequestHeader("p2pUid", self.el.p2pUid);
            },
            'success': function(result) {
                spinning.end();
                console.log(result);
                if(result.errorCode == '00000') {
                    $.map(result.data, function(obj) {
                        console.log(obj);
                        //todo : get card limits, bank logo
                        self.el.cards.append('<dl data-limit="' + mapping[obj.account.bank].limit + '"><dt title="' + obj.account.bankName + '"><i class="icon-' + obj.account.bank.toLowerCase() + '"></i></dt><dd>' + formatter.bankAccount(obj.account.account) + '</dd></dl>');
                    })
                } else {
                    console.log(result.errorMsg)
                }
            },
            'error': function(err) {
                console.log(err.msg);
            }
        })
    }
};
$(function() {
    loan.init();
});