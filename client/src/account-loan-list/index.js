/**
 * @file
 * @desc
 * @author
 * @date 2017/9/1
 */


import './index.less';

import $ from 'webpack-zepto';
import _ from 'lodash';
import moment from 'moment';

var formatter = require('../../../both/formatter');
var Clipboard = require('clipboard');

var loan = {
    init: function() {
        this.el = {
            body: $('body'),
            //提示信息
            tips: $('#tips'),

            p2pUid: $('#p2pUid').val(),
            token: $('#token').val(),
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
            listTab: $('section > aside > a'),
            list: $('section'),
            ring: $('#ring'),
            ringRound: $('#ringRound'),
            available: $('#available'),
            expected: $('#expected'),
            credited: $('#credited'),
            page: 1,
            paymentId: '',
            paymentObj: '',
            availableAmount: 0,
            repayAmount: 0
        };

        this.bindEvents();

        this.renderLists();
    },
    bindEvents: function() {
        var self = this;
        self.el.listTab.on('click', function(e) {
            e.preventDefault();

            $(this).addClass('active').siblings('.active').removeClass('active')
        });

        self.el.list

            //显示借款详情
            .on('click', 'li', function(e) {
                if(!$(e.target).is('a'))
                    window.location = 'carloan://detail?loanId=' + $(this).attr('data-item-id'); //'/loan/detail/' + $(this).attr('data-id') + '/' + self.el.p2pUid + '/' + self.el.token;
            })

            //去还款按钮
            .on('click', 'li a', function(e) {
                e.preventDefault();

                //确认弹框获取还款id
                self.el.paymentId = $(this).attr('data-id');
                self.el.paymentObj = $(this);

                $.ajax({
                    'url': '/v1/api/account/info',
                    beforeSend: function(request) {
                        request.setRequestHeader("token", self.el.token);
                        request.setRequestHeader("p2pUid", self.el.p2pUid);
                    },
                    'success': function(account) {
                        console.log(account)
                        if(account.errorCode == '00000') {
                            self.el.availableAmount = account.data.availableAmount;
                            self.el.cfmAvailable.html(formatter.currency(self.el.availableAmount, 2));
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
                                    console.log(result);
                                    if(result) {
                                        if(result.repayDetails.length > 0) {
                                            var r = result.repayDetails[0];
                                            self.el.repayAmount = r.repayPrincipal / 100 + r.repayInterest / 100 + (r.repayOverdueFee || 0) + (r.repayServiceFee || 0);
                                            self.el.cfmPayment.html(formatter.currency(self.el.repayAmount, 2));


                                            var rechargeUrl = window.location + '/' + self.el.token;
                                            rechargeUrl = rechargeUrl.replace('loan', 'recharge');
                                            self.el.repaymentURL.attr("data-clipboard-text", rechargeUrl);
                                            self.showDialog('insufficient');
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
            });

        var clipboard = new Clipboard('#repaymentURL');
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
            if(box.is('.insufficient')) {
                if(self.el.availableAmount < self.el.repayAmount) {
                    self.el.body.removeClass('show-dialog');
                    self.showDialog('failed');
                } else {
                    self.el.body.removeClass('show-dialog');
                    $.ajax({
                        'url': '/v1/api/repay/userRepayForCar',
                        'data': {'loanId': self.el.paymentId},
                        'beforeSend': function(request) {
                            request.setRequestHeader("token", self.el.token);
                            request.setRequestHeader("p2pUid", self.el.p2pUid);
                        },
                        'success': function(result) {
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
                window.location = 'carloan://goBack';
            } else if(box.is('.failed')) {
                //还款结果
                self.el.body.removeClass('show-dialog');
            }
        })
    },
    renderLists: function() {
        var self = this;

        function getData(status, page, size, idx, append) {
            console.log(page);
            $.ajax({
                'url': '/v1/api/loan/list',
                'type': 'post',
                'data': {status: status, page: page, size: size},
                'beforeSend': function(request) {
                    request.setRequestHeader("token", self.el.token);
                    request.setRequestHeader("p2pUid", self.el.p2pUid);
                },
                'success': function(result) {
                    console.log(result);
                    $(ul[idx]).removeClass('loading');

                    if(result.code == '00000') {
                        if(result.data.content.length > 0) {
                            var statusClass = ['', 'checking', 'loaning', 'repayment', 'paid', '', '', 'reject', 'processing'];
                            var items = $.map(result.data.content, function(obj) {
                                return  '<li class="' + (statusClass[obj.status <= statusClass.length ? obj.status : 0]) + '" data-item-id="' + obj.id + '" data-id="' + obj.loanId + '" data-amount="' + obj.amount + '">' +
                                    '<em title="' + obj.loanTitle + '" data-date="' + moment(obj.cTime).format('YYYY.MM.DD') + '" data-term="' + obj.days + '"></em>' +
                                    '<dfn data-amount="' + formatter.currency(obj.amount) + '">' + (obj.status == 3 ? '<a href="#" data-id="' + obj.loanId + '" title="去还款"></a>' : '') + '</dfn>' +
                                    '</li>';
                            }).join('');
                            if(append) {
                                $(ul[idx]).append(items);
                            } else {
                                $(ul[idx]).html(items).removeClass('empty');
                            }
                            self.el.page++;
                        } else {
                            if(append) {
                                $(ul[idx]).addClass('no-more');
                                setTimeout(function() {
                                    $(ul[idx]).removeClass('no-more');
                                }, 1000);
                            } else {
                                $(ul[idx]).addClass('empty');
                            }
                        }
                    } else {
                        console.log('获取借款列表失败：', result.tips);
                    }
                },
                'error': function(data) {
                    console.log('获取借款列表失败：', data.msg);
                }
            });
        }

        var wrap = this.el.list.find('.lists'),
            ul = this.el.list.find('ul'),
            aside = this.el.list.find('aside');
        ul.width(aside.width()).on('scroll', _.throttle(function() {
            var idx = $(this).index(),
                items = $(this).find('li'),
                h = $(items[0]).height() * items.length,
                status = $(this).attr('data-status');

            if($(this).scrollTop() >= h - $(this).height()) {
                $(this).addClass('loading');
                getData(status, self.el.page, 10, idx, true);
            }
        }, 500));
        wrap.width(aside.width() * ul.length);

        //借款列表按状态显示按钮
        aside.on('click', 'a', function(e) {
            e.preventDefault();
            var t = this.href,
                idx = $(this).index(),
                status = $(this).attr('data-status');
            //console.log(idx);
            self.el.page = 1;
            $(ul[idx]).show().siblings().hide();
            //wrap/*.removeClass('scroll-list1 scroll-list2 scroll-list3 scroll-list4').addClass('scroll-list' + idx)*/.css({marginLeft: - idx * aside.width()})
            getData(status, self.el.page, 10, idx, false);
        }).find('a').first().trigger('click');
    },
    showDialog: function(status) {
        this.el.body.addClass('show-dialog');
        this.el.dialog.css('height', $(document).height()).find('dl').removeClass('succeed failed insufficient').addClass(status).css('marginTop', this.el.body.scrollTop() + 200);
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
$(function() {
    loan.init();
});