/**
 * @file
 * @desc
 * @author
 * @date 2017/9/18
 */
var $ = require('webpack-zepto');
var Clipboard = require('clipboard');
var formatter = require('../../../both/formatter');
var spinning = require('../common/spinning');

var repayment = {
    init: function() {
        this.el = {
            body: $('body'),
            p2pUid: $('#p2pUid').val(),
            token: $('#token').val(),
            //提示信息
            tips: $('#tips'),
            dialog: $('#dialog'),
            //复制还款地址
            repaymentURL: $('#repaymentURL'),
            //弹框取消按钮
            cfmCancel: $('#cfmCancel'),
            //弹框确定按钮
            cfmSure: $('#cfmSure'),
            cfmAvailable: $('#cfmAvailable'),
            cfmPayment: $('#cfmPayment'),
            winWidth: $(window).width(),
            paymentId: '',
            paymentObj: '',
            availableAmount: 0,
            repayAmount: 0,
            originRepayAmount: 0
        };


        var self = this,
            clipboard = new Clipboard('#repaymentURL');

        clipboard.on('success', function(e) {
            console.info('Action:', e.action);
            console.info('Text:', e.text);
            console.info('Trigger:', e.trigger);
            self.showTips('复制成功！');
            e.clearSelection();
        });

        clipboard.on('error', function(e) {
            console.error('Action:', e.action);
            console.error('Trigger:', e.trigger);
        });

        this.el.cfmCancel.on('click', function(e) {
            e.preventDefault();
            self.el.body.removeClass('show-dialog');
        });

        this.el.cfmSure.on('click', function(e) {
            e.preventDefault();
            var item = self.el.paymentObj,
                box = $(this).parents('.box');

            //还款
            if(box.is('.confirm')) {
                if(self.el.availableAmount * 100 < self.el.originRepayAmount) {
                    self.el.body.removeClass('show-dialog');
                    self.showDialog('insufficient');
                } else {
                    self.el.body.removeClass('show-dialog');
                    spinning.start();
                    $.ajax({
                        'url': '/v1/api/repay/userRepayForCar',
                        'data': {'loanId': self.el.paymentId},
                        'beforeSend': function(request) {
                            request.setRequestHeader("token", self.el.token);
                            request.setRequestHeader("p2pUid", self.el.p2pUid);
                        },
                        'success': function(result) {
                            spinning.end();
                            /*{ retCode: 'TC500001',
                             retMsg: '标的不是未还款或逾期状态,不能进行还款',
                             data: null }*/
                            console.log(result);
                            if(result.retCode == 'TC000000') {
                                self.showDialog('succeed');
                                if(item.parents('ul').is('#repayment') ) {
                                    item.parents('li').remove();
                                } else {
                                    item.parents('li').removeClass('repayment').addClass('paid');
                                }
                            } else {
                                self.showDialog('failed');
                                console.log('还款失败：', result.retMsg);
                            }
                        }
                    })
                }
            } else if(box.is('.succeed')) {
                self.el.body.removeClass('show-dialog');
                if(item.is('#payment'))
                //借款详情页还款按钮
                    window.location = 'carloan://goBack';
            } else if(box.is('.failed')) {
                //还款结果
                self.el.body.removeClass('show-dialog');
            } else if (box.is('.insufficient')) {
                self.el.body.removeClass('show-dialog');
            }
        })
    },
    repay: function(e) {
        e.preventDefault();
        var self = repayment;
        //确认弹框获取还款id
        self.el.paymentId = $(this).attr('data-id');
        self.el.paymentObj = $(this);
        spinning.start();
        $.ajax({
            'url': '/v1/api/account/info',
            beforeSend: function(request) {
                request.setRequestHeader("token", self.el.token);
                request.setRequestHeader("p2pUid", self.el.p2pUid);
            },
            'success': function(account) {
                spinning.end();
                console.log(account)
                if(account.errorCode == '00000') {
                    self.el.availableAmount = account.data.availableAmount;
                    self.el.cfmAvailable.html(formatter.currency(self.el.availableAmount, 2));
                    spinning.start();
                    //计算还款
                    $.ajax({
                        'url': '/v1/api/repay/userRepayCal',
                        'data': {loanId: self.el.paymentId},
                        beforeSend: function(request) {
                            request.setRequestHeader("token", self.el.token);
                            request.setRequestHeader("p2pUid", self.el.p2pUid);
                        },
                        'type': 'post',
                        'success': function(result) {
                            spinning.end();
                            console.log(result);
                            if(result) {
                                if(result.repayDetails.length > 0) {
                                    var r = result.repayDetails[0];
                                    self.el.repayAmount = r.repayPrincipal / 100 + r.repayInterest / 100 + r.repayOverdueFee / 100 + r.repayServiceFee / 100;
                                    self.el.originRepayAmount = r.repayPrincipal + r.repayInterest + r.repayOverdueFee + r.repayServiceFee;
                                    self.el.cfmPayment.html(formatter.currency(self.el.repayAmount, 2));

                                    console.log(location.origin);
                                    var rechargeUrl = location.origin + '/recharge/' + self.el.token;
                                    self.el.repaymentURL.attr("data-clipboard-text", rechargeUrl);
                                    self.showDialog('confirm');
                                }
                            }
                        },
                        'error': function(error) {
                            console.log(error);
                        }
                    });
                } else {
                    console.log('获取账户信息失败！' + account.errorMsg)
                }
            },
            'error': function(error) {
                console.log('获取账户信息失败！' + error)
            }
        });
    },
    showDialog: function(status) {
        this.el.dialog.css('height', $(document).height()).find('dl').removeClass('succeed failed confirm insufficient').addClass(status).css('marginTop', this.el.body.scrollTop() + 200);
        this.el.body.addClass('show-dialog');
    },

    showTips: function(msg) {
        var self = this;
        self.el.body.addClass('show-tips');
        self.el.tips.attr('title', msg).css('top', $(window).scrollTop());

        setTimeout(function() {
            self.el.body.removeClass('show-tips');
            self.el.tips.removeAttr('title');
        }, 1500);
        return false;
    }
};
repayment.init();

module.exports = repayment;