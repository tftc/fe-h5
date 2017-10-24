'use strict';

module.exports = app => {
  app.get('/', 'login.index');
  app.get('/login', 'login.index');

  app.get('/h5/api/cps/captcha', 'login.sendCaptcha');
  app.get('/h5/api/cps/longinSms', 'login.loginSms');
  app.post('/h5/api/cps/registerOrLogin', 'login.registerOrLogin');
};
