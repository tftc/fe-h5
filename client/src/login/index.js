import './index.less';

import $ from 'webpack-zepto';
import _ from 'lodash';

var spinning = require('../common/spinning');
var inputFilter = require('../common/input-util');
var login = {
    init: function() {
        this.el = {
            body: $('body'),

            //提示信息
            tips: $('#tips'),

            //图文验证码确认弹框
            dialog: $('#dialog'),
            //图文验证码token
            token: $('#token'),
            //图文验证码输入框
            captcha: $('#captcha'),
            //刷新图文验证码
            valiGetter: $('#valiGetter'),
            //图文验证码确认弹框取消按钮
            cfmCancel: $('#cfmCancel'),
            //图文验证码确认弹框确定按钮
            cfmSure: $('#cfmSure'),

            //手机号输入框
            mobile: $('#mobile'),

            //验证码输入框
            smsCode: $('#smsCode'),

            //获取验证码
            smsGetter: $('#smsGetter'),

            //登录按钮
            login: $('#login')
        };

        this.bindEvents();
    },
    bindEvents: function() {
        var self = this;

        self.el.mobile
            //.prop('type', 'number')
            //.attr('maxlength', 11)
            .on('keyup', inputFilter.numberOnly)
            .on('keydown paste', inputFilter.maxLength)
            .on('keyup', self.mobileExist)
            .on('blur', self.mobileExist);

        this.el.smsCode
            //.prop('type', 'number')
            .on('keyup', inputFilter.numberOnly)
            .on('keydown paste', inputFilter.maxLength)
            .on('focus', function() {
                //if($(this).is('[readonly]'))
                //    return self.showTips('请先获取' + self.el.smsCode.attr('placeholder') + '！', self.el.smsGetter);
                if(self.el.mobile.attr('data-checked') == 'false') {
                    console.log(self.el.mobile.attr('data-checked'));
                    $(this).blur();
                    return login.showTips('请输入正确的' + self.el.mobile.attr('placeholder') + '！', self.el.mobile);
                }
            });

        this.el.smsGetter
            .on('click', function(e) {
                e.preventDefault();
                self.el.body.addClass('show-dialog');
                self.el.valiGetter.trigger('click');
            });

        this.el.login
            .on('click', function(e) {
                e.preventDefault();
                if(!self.required(self.el.mobile))
                    return false;

                if(!inputFilter.cellPhoneNumber(self.el.mobile.val()))
                    return self.showTips('请输入正确的' + self.el.mobile.attr('placeholder') + '！', self.el.mobile);

                if(!self.required(self.el.smsCode))
                    return false;

                if(self.el.smsCode.val().length < self.el.smsCode.attr('maxlength'))
                    return self.showTips('请输入正确的' + self.el.smsCode.attr('placeholder') + '！', self.el.smsCode);
                spinning.start();
                $.ajax({
                    url: '/h5/api/cps/registerOrLogin',
                    type: 'post',
                    data: $(this.form).serializeArray(),
                    success: function(result) {
                        spinning.end();
                        console.log(result);
                        //data.error: {message: "USER_REPEAT_ERROR", type: "", value: "甜菜存在用户,登陆失败", code: 0}

                        if(result.success) {
                            //{data: {token: "SA6A1Mhrg52cNI0nzqHVew", userId: "01E57A7A-5BBB-467B-ACEA-BB91A9453847"}, error: [], success: true}
                            window.location = 'carloan://login?mobile=' + self.el.mobile.val() + '&token=' + result.data.token;
                        } else {
                            return login.showTips(result.error[0].value + '！', self.el.mobile);
                        }
                    },
                    error: function(msg) {
                        console.log(msg);
                    }
                })
            });

        /*this.el.captcha.on('blur', function() {
            if($(this).val().length < $(this).attr('maxlength')) {
                return self.showTips('请输入正确的验证码！', $(this));
            }
        });*/

        this.el.valiGetter.on('click', function(e) {
            e.preventDefault();
            self.el.captcha.val('');
            spinning.start();
            $.ajax({
                url: '/h5/api/cps/captcha?t=' + Date.now(),
                success: function(result) {
                    spinning.end();
                    console.log(result);
                    //{createTime: 1504083212288, ttl: 1800, token: "8fc60ab8-94e1-4626-a3b6-2201b7984c73", captcha: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYA…KwkVCTmFIOLn3sJCQpbT8AIzs/Sco1f3BAAAAAElFTkSuQmCC"}
                    self.el.token.val(result.token);
                    self.el.valiGetter.find('img').attr('src', result.captcha);
                    self.el.captcha.focus();
                },
                error: function(msg) {
                    return login.showTips('网络存在问题，请稍后再试！', self.el.captcha);
                }
            })
        });

        this.el.cfmCancel.on('click', function(e) {
            e.preventDefault();
            self.el.body.removeClass('show-dialog');
        });

        this.el.cfmSure.on('click', function(e) {
            e.preventDefault();
            if(self.el.captcha.val().length < self.el.captcha.attr('maxlength')) {
                //self.el.valiGetter.trigger('click');
                return self.showTips('请输入正确的验证码！', self.el.captcha);
            }
            spinning.start();
            $.ajax({
                url: '/h5/api/cps/longinSms',
                data: {'mobile': self.el.mobile.val(), 'captcha': self.el.captcha.val(), 'captchaToken': self.el.token.val()},
                success: function(data) {
                    spinning.end();
                    console.log(data);
                    if(data.success) {

                        self.el.body.removeClass('show-dialog');
                        var getter = self.el.smsGetter,
                            resend = $(getter).attr('data-resend'),
                            countdown = 60,
                            delay = 1000,
                            counter = function () {
                                if (countdown <= 1) {
                                    window.clearTimeout(timer);
                                    $(getter).attr('data-get', resend).removeAttr('disabled');
                                    //self.el.smsCode.attr('readonly', true);
                                    return;
                                }
                                countdown--;
                                $(getter).attr('data-get', countdown);
                                timer = setTimeout(counter, delay);
                            },
                            timer = setTimeout(counter, delay);
                        $(getter).attr({'data-get': countdown, 'disabled': true});
                    } else {
                        //{message: "UNKNOWN", type: "", value: "未知错误", code: 0}
                        console.log(data.error[0].value);
                        self.el.valiGetter.trigger('click');
                        return self.showTips(data.error[0].value + '！', self.el.captcha);
                    }
                },
                error: function(msg) {
                    console.log(msg);
                    return self.showTips('网络存在问题，请稍后再试！', self.el.captcha);
                }
            });
        })
    },

    required: function(el) {

        if(el.val().length <= 0) {
            return this.showTips('请输入' + el.attr('placeholder') + '！', el);
        } else {
            return true;
        }
    },

    mobileExist: function(e) {
        var self = $(this);
        if(inputFilter.cellPhoneNumber(self.val())) {
            self.attr('data-checked', true);
            login.el.smsGetter.show();
        } else {
            if(e.type === 'blur')
                return login.showTips('请输入正确的' + self.attr('placeholder') + '！', self);
            self.attr('data-checked', false);
            login.el.smsGetter.hide();
        }
    },

    showTips: function(msg, el) {
        var self = this,
            focus = el.is();
        self.el.body.addClass('show-tips');
        self.el.tips.attr('title', msg);
        el.parent('label').addClass('focus');
        setTimeout(function() {
            self.el.body.removeClass('show-tips');
            self.el.tips.removeAttr('title');
            el.parent('label').removeClass('focus');
        }, 1500);
        return false;
    }
};
$(function() {
    login.init();
});