'use strict';

module.exports = app => {
  const { passport: passportPrefix, p2p: p2pPrefix } = app.config.nakedBackendPrefix;

  class LoginService extends app.Service {
    * sendCaptcha() {
      const uri = `${passportPrefix}/api/captcha/img`;

      this.ctx.logger.info('uri: %s', uri);

      const result = yield app.curl(uri, {
        // 自动解析 JSON response
        dataType: 'json',
      });

      this.ctx.logger.info('app curl sendCaptcha: %j', result);

      return result;
    }

    * loginSms(args) {
      const { mobile, captcha, captchaToken } = args;

      const uri = `${p2pPrefix}/openapi/cps/longinSms`;

      this.ctx.logger.info('uri: %s', uri);

      const result = yield app.curl(uri, {
        data: {
          mobile, captcha, captchaToken,
        },
        dataType: 'json',
      });

      this.ctx.logger.info('app curl loginSms: %j', result);

      return result;
    }

    * registerOrLogin(args) {
      const { mobile, sms, cpsType, source } = args;

      const uri = `${p2pPrefix}/openapi/cps/registerOrLogin`;

      this.ctx.logger.info('uri: %s', uri);

      const result = yield app.curl(uri, {
        method: 'POST',
        data: {
          mobile, sms, cpsType, source,
        },
        dataType: 'json',
      });

      this.ctx.logger.info('app curl registerOrLogin: %j', result);

      return result;
    }
  }
  return LoginService;
};
