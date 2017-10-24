/**
 * @file
 * @desc
 * @author
 * @date 2017/9/18
 */

var $ = require('webpack-zepto');

var spinning = {
    delay: null,
    start: function() {

        if($('.spinning').length > 0)
            return false;
        $('body').addClass('show-spinning');
        $('<div></div>').addClass('spinning').height($(document).height()).prependTo('body').append($('<em></em>').css('margin-top', $(document).height() / 2 + $(document).scrollTop()));
    },
    end: function() {
        if(this.delay) {
            clearTimeout(this.delay);
            this.delay = null;
        }
        this.delay = setTimeout(function() {
            $('.spinning').remove();
            $('body').removeClass('show-spinning');
        }, 50)
    }
};

module.exports = spinning;