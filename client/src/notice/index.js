import './index.less';

import $ from 'webpack-zepto';
import _ from 'lodash';
import moment from 'moment';

var formatter = require('../../../both/formatter');
var spinning = require('../common/spinning');

var notice = {
    init: function() {
        this.el = {
            body: $('body'),
            p2pUid: $('#p2pUid').val(),
            token: $('#token').val(),
            notices: $('#notices')
        };

        this.renderList();
    },
    renderList: function() {
        var self = this,
            page = 1;

        self.el.notices.height($(window).height() - $('nav').height())
            .on('scroll', _.throttle(function () {
                var hs = _.map($(this).find('ul'), function(obj) { return $(obj).height(); }),
                    h = _.reduce(hs, function(sum, n) {
                        return sum + n
                    });

                //if($(this).scrollTop() >= 1) {
                    $(this).addClass('loading');
                    spinning.start();
                    $.ajax({
                        'url': '/v1/api/notice/list',
                        'data': {
                            page: page,
                            size: 10
                        },
                        'success': function(result) {
                            spinning.end();
                            console.log(result);
                            if(result.code == '00000') {
                                if(result.data.content.length > 0) {
                                    var items = _.map(result.data.content, function(item) {
                                        return '<div class="notice-item">' +
                                            '<div class="notice-item-content">' + item.title + '</div>' +
                                            '<div class="notice-item-time">' + item.cTime + '</div>' +
                                            '</div>'
                                    }).join('');

                                    self.el.notices.append(items);
                                } else {
                                    console.log('nomore')
                                    self.el.notices.addClass('nomore');
                                }
                            } else {
                                console.log(result.tips)
                            }
                        },
                        'error': function(error) {
                            console.log(error)
                        }
                    });

                    page++;
                //}
            }, 500));
    }
};
$(function() {
    notice.init();
});