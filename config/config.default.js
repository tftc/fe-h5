'use strict';

const path = require('path');

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1508311665028_739';

  // 添加中间件
  config.middleware = [ 'select' ];

  // 模板配置
  config.view = {
    root: path.join(appInfo.baseDir, 'views'),
    mapping: {
      '.html': 'ejs',
    },
  };

  // token过期时间，单位s
  config.expire = 7 * 24 * 60 * 60;

  // 后端服务地址
  config.nakedBackendPrefix = {
    p2p: 'xxx',
    p2pBack: 'xxx',
    car: 'xxx',
    passport: 'xxx',
  };

  // 阿里云相关服务配置
  config.aliyun = {
    // 实名认证服务
    authentication: {
      api: 'xxx',
      AppKey: 'xxx',
      AppSecret: 'xxx',
      AppCode: 'xxx',
    },
  };

  // 静态资源配置
  // todo:需在config.local.js覆盖掉，webpack中会使用到相关配置
  config.static = {
    prefix: '/dist',
    dir: path.join(appInfo.baseDir, 'client/dist'),
    contextRoot: '',
  };

  return config;
};
