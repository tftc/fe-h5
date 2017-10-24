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
var fundsType = require('../common/funds-type');
var spinning = require('../common/spinning');

var loan = {
    init: function() {
        this.el = {
            p2pUid: $('#p2pUid').val(),
            token: $('#token').val(),
            records: $('#records')
        };

        this.bindEvents();
        this.renderList();
    },
    bindEvents: function() {
        var self = this;

    },
    renderList: function() {
        var self = this,
            page = 1;

        self.el.records
        .on('touchend', function() {
            if (window.innerHeight + document.body.scrollTop > document.body.scrollHeight - 10) {
                var hs = _.map($(this).find('ul'), function(obj) { return $(obj).height(); }),
                    h = _.reduce(hs, function(sum, n) {
                        return sum + n
                    });

                if($(this).scrollTop() >= h - $(this).height()) {
                    $(this).addClass('loading');
                    getData(page, true);
                    page++;
                }
            }
        });

        function getData(page, append) {
            var d, y = 0, m = 0, temp = $('<div></div>'), u = null, i, obj;
            spinning.start();
            $.ajax({
                'url': '/v1/api/account/funds',// + page,
                'data': {
                    type:'ALL',
                    allStatus: false,
                    allOperation: false,
                    startDate: 0,
                    endDate: Date.now(),
                    page: page,
                    pageSize: 10
                },
                'beforeSend': function(request) {
                    request.setRequestHeader("token", self.el.token);
                    request.setRequestHeader("p2pUid", self.el.p2pUid);
                },
                'success': function(result) {
                    spinning.end();
                    const filterProp = ['LOAN', 'FEE_LOAN_SERVICE', 'WITHDRAW',
                     'DEPOSIT', 'LOAN_REPAY', 'FEE_LOAN_PENALTY'];
                    self.el.records.removeClass('loading');
                    if(result) {
                        if(result.results.length > 0) {
                            for(var idx = 0; idx < result.results.length; idx++) {
                                obj = result.results[idx];
                                d = new Date(obj.timeRecorded);

                                //只显示指定的交易类型数据
                                if (_.indexOf(filterProp, obj.type) === -1) continue; 

                                i = $('<li data-amount="' + formatter.currency(obj.amount) + '" class="' + obj.type.toLowerCase() + '"><em title="' + _.find(fundsType, type => type.code === obj.type).name + '" data-date="' + moment(d).format('YYYY.MM.DD HH:mm') + '"></em></li>');
                                if(d.getMonth() + 1 == m) {
                                    u.attr('title', moment(d).format('YYYY年MM月')).append(i)
                                } else {
                                    u = $('<ul></ul>').appendTo(self.el.records)
                                        .attr('title', moment(d).format('YYYY年MM月'))
                                        .append(i)
                                }
                                y = d.getFullYear();
                                m = d.getMonth() + 1;
                            }
                        } else {
                            if(append){
                                self.el.records.addClass('no-more');
                                setTimeout(function() {
                                    self.el.records.removeClass('no-more');
                                }, 1000);
                            } else
                                self.el.records.addClass('empty');
                        }
                    } else {
                        console.log(result);
                        self.el.records.addClass('empty');
                    }
                },
                'error': function(error) {
                    console.log(error.msg);
                    self.el.records.addClass('empty');
                }
            });
        }

        getData(page++, false);
    }
};
$(function() {
    loan.init();
});