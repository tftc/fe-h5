/**
 * @file
 * @desc
 * @author
 * @date 2017/8/31
 */

import './index.less';

import $ from 'webpack-zepto';
import _ from 'lodash';
import moment from 'moment';

var formatter = require('../../../both/formatter');
var repayment = require('../common/loan-repay');

var loan = {
    init: function() {
        this.el = {
            body: $('body'),

            p2pUid: $('#p2pUid').val(),
            token: $('#token').val(),
            listTab: $('section > aside > a'),
            list: $('section'),
            ring: $('#ring'),
            ringRound: $('#ringRound'),
            available: $('#available'),
            expected: $('#expected'),
            credited: $('#credited'),
            page: 1
        };

        var loanBtn = $('footer > label'),
            u = navigator.userAgent,
            isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        //var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

        if(isAndroid)
            loanBtn.css('margin-top', 0);

        this.bindEvents();
        this.renderQuota();
        this.renderLists();

        this.isDone = true;
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
                    window.location = 'carloan://detail?loanId=' + $(this).attr('data-item-id');
            })

            //去还款按钮
            .on('click', 'li a', repayment.repay);
    },
    renderQuota: function () {
        var self = this;
        function drawCircle(el, progress) {
            var pathBD = self.el.ring.css('stroke-width').split('px')[0],
                r = ((self.el.available.width() - pathBD * 2) / 2) / window.dpr,
                pos = (r + 10) * window.dpr;

            //var progress=.6;

            //将path平移到我们需要的坐标位置
            el.attr('transform', 'translate(' + pos + ',' + pos + ')');
            r = r * window.dpr;
            // 计算当前的进度对应的角度值
            var degrees = progress * 360;

            // 计算当前角度对应的弧度值
            var rad = degrees* (Math.PI / 180);

            //极坐标转换成直角坐标
            var x = (Math.sin(rad) * r).toFixed(2);
            var y = -(Math.cos(rad) * r).toFixed(2);

            //大于180度时候画大角度弧，小于180度的画小角度弧，(deg > 180) ? 1 : 0
            var lenghty = window.Number(degrees > 180);

            //path 属性
            var descriptions = ['M', 5, -r, 'A', r, r, 5, lenghty, 1, x, y];

            // 给path 设置属性
            el.attr('d', descriptions.join(' '));
        }

        $.ajax({
            'url': '/v1/api/account/credit/query',
            'beforeSend': function(request) {
                request.setRequestHeader("token", self.el.token);
                request.setRequestHeader("p2pUid", self.el.p2pUid);
            },
            'success': function(result) {
                console.log(result.data);
                if(result.data) {
                    var progress = result.data.creditRemAmt / result.data.creditAmt,
                        increase = 0,
                        step = 0,
                        delay = 50;

                    progress = progress > 1 ? 1 : progress;
                    step = progress / 10;

                    function draw() {
                        if(increase < progress) {
                            drawCircle(self.el.ring, increase);
                        } else {
                            clearTimeout(ani);
                            return;
                        }
                        increase += step;
                        ani = setTimeout(draw, delay);
                    }
                    var ani = setTimeout(draw, delay);

                    self.el.available.attr('data-amount', formatter.currency(result.data.creditRemAmt));
                    self.el.expected.attr('data-amount', formatter.currency(result.data.sumPrincipal / 100));
                    self.el.credited.attr('data-amount', formatter.currency(result.data.creditAmt));
                } else {
                    console.log('获取额度失败：', result.errorMsg);
                }
            },
            'error': function(data) {
                console.log('获取额度失败：', data.msg);
            }
        });
        drawCircle(self.el.ringRound, 1);

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
                    self.isDone = true;
                    $(ul[idx]).removeClass('loading empty no-more');

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
                                $(ul[idx]).html(items).removeClass('loading empty no-more');
                            }
                            self.el.page++;
                        } else {
                            if(append) {
                                $(ul[idx]).addClass('no-more');
                                setTimeout(function() {
                                    $(ul[idx]).removeClass('loading empty no-more');
                                }, 1000);
                            } else {
                                $(ul[idx]).empty().addClass('empty');
                            }
                        }
                    } else {
                        console.log('获取借款列表失败：', result.tips);
                    }
                },
                'error': function(data) {
                    self.isDone = true;
                    console.log('获取借款列表失败：', data.msg);
                }
            });
        }

        var wrap = this.el.list.find('.lists'),
            aside = this.el.list.find('aside'),
            ul = this.el.list.find('ul').width(aside.width());

        wrap.width(aside.width() * ul.length);

        $(document).on('touchend',function() {
            var h = $(document).height(),
                idx = $('.active').index(),
                list = $(ul[idx]);

            if($(window).scrollTop() >= h - $(window).height()) {
                $(list).addClass('loading');
                if (!self.isDone) return;
                getData(list.attr('data-status'), self.el.page, 5, idx, true);
                self.isDone = false;
            }
        });

        //借款列表按状态显示按钮
        aside.on('click', 'a', function(e) {
            e.preventDefault();
            var t = this.href,
                idx = $(this).index(),
                status = $(this).attr('data-status');
            //console.log(idx);
            self.el.page = 1;
            $(ul[idx]).show().siblings().hide();

            getData(status, self.el.page, 5, idx, false);
            self.isDone = false;
        }).find('a').first().trigger('click');
    }
};
$(function() {
    loan.init();
});