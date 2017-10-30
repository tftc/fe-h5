/**
 * @file gulpfile.js
 * @desc 自动化脚本
 * @author shijianguo
 * @date 2017/8/23 14:13
 * @extends 提升打包效率，做了以下调整：
 * @extension >>使用babel统一打包，增加对es6支持
 * @extension >>分离公共css文件，分开打包，只打包一次
 * @extension >>分离公共js文件，分开打包，只打包一次
 * @extension >>增加gulp编译容错处理，报错不退出进程
 * @extension >>打包编译生成指定版本的静态资源、页面
 */
'use strict';

const path = require('path');
const gulp = require('gulp');
const gutil = require('gulp-util');
const gulpSequence = require('gulp-sequence');
const htmlUrlReplace = require('gulp-url-replace');
const browserSync = require('browser-sync').create();
const opn = require('opn');
const plumber = require('gulp-plumber');
const webpack = require('webpack-stream');
const wp = require('webpack');

const webpackDllConfig = require('./webpack.dll.config.js');
const webpackConfig = require('./webpack.config.js');

const pkg = require('./package.json');
const { version, name } = pkg;

// =========================================================================
//
// 本地开发
//
// =========================================================================

// open chrome browser
gulp.task('open', () => {
  opn('http://127.0.0.1:7001', {
    app: [ 'google chrome' ],
  });
});

// 打包公共js文件，提升webpack效率
gulp.task('dll', done => {
  const config = Object.create(webpackDllConfig);
  wp(config, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack:dll', err);
    gutil.log('[webpack:dll]', stats.toString({
      colors: true,
    }));
    done();
  });
});

// webpack打包编译静态资源
gulp.task('compile', () => {
  const globPath = 'client/src/**/*.js';
  const pathDir = 'client/src/';

  return gulp.src(globPath)
    .pipe(plumber())
    .pipe(webpack(webpackConfig(globPath, pathDir), wp, (err, stats) => {
      if (err) throw new gutil.PluginError('webpack:compile', err);

      gutil.log('[webpack:compile]', stats.toString({
        colors: true,
      }));

    }))
    .pipe(gulp.dest(`client/dist/${name}/${version}`))
    // .pipe(browserSync.reload({ stream: true }));
});

// 构建多个view
gulp.task('build-multiple-view', () => {
  return gulp.src('app/view/**/*.*')
    .pipe(htmlUrlReplace({
      '/dist/': '<%=contextRoot%>/dist/',
    }))
    .pipe(gulp.dest(path.resolve(__dirname, `views/${version}`)))
    .pipe(browserSync.reload({ stream: true }));
});

// 前置操作
gulp.task('pre-task', gulpSequence('dll'));

// 监听静态文件和模板以及pid修改，并刷新页面
gulp.task('watch', [ 'compile' ], () => {
  setTimeout(browserSync.reload, 0);
});

gulp.task('browser-sync', () => {
  browserSync.init({
    proxy: 'http://localhost:7001',
  });
  gulp.watch('client/src/**/*.*', [ 'watch' ]);
  gulp.watch('app/view/**/*.*', [ 'build-multiple-view' ]);
});

// 静态资源编译
gulp.task('build', gulpSequence('pre-task', 'compile', 'build-multiple-view'));

// 运行Gulp时，默认的Task
gulp.task('dev', gulpSequence('build', 'browser-sync'));
