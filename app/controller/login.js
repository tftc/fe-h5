'use strict';

module.exports = app => {
  class LoginController extends app.Controller {
    * index() {
      yield this.ctx.render(`${this.ctx.locals.version}/login`, {
        page: 'login',
        title: '欢迎，请登录',
      });
    }

    * sendCaptcha() {
      const { ctx, service } = this;
      // 调用 Service 进行业务处理
      const { data, status, headers } = yield service.login.sendCaptcha();
      // 设置响应内容和响应状态码
      ctx.body = data;
    }

    * loginSms() {
      const { ctx, service } = this;
      const { mobile, captcha, captchaToken } = ctx.query;

      app.logger.info('controller => login => loginSms :%j', ctx.query);

      // 调用 Service 进行业务处理
      const { data, status, headers } = yield service.login.loginSms({ mobile, captcha, captchaToken });
      // 设置响应内容和响应状态码
      ctx.body = data;
    }

    * registerOrLogin() {
      const { ctx, service } = this;
      const { mobile, sms, cpsType, source } = ctx.request.body;

      app.logger.info('controller => login => registerOrLogin :%j', ctx.request.body);

      // 调用 Service 进行业务处理
      const { data, status, headers } = yield service.login.registerOrLogin({ mobile, sms, cpsType, source });
      // 设置响应内容和响应状态码
      ctx.body = data;
    }
  }
  return LoginController;
};
