'use strict';

const path = require('path');

module.exports = options => {
  return function* (next) {
    const pkg = require(path.resolve(__dirname, '../..', 'package.json'));
    const version = pkg.version;
    const name = pkg.name;

    this.locals.version = this.query._version || version;
    this.locals.name = name;
    this.locals.contextRoot = this.app.config.static.contextRoot;

    yield next;
  };
};
