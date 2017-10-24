'use strict';

const path = require('path');
const webpack = require('webpack');
const isDev = process.env.NODE_ENV === 'dev';
const version = require('./package.json').version;
const name = require('./package.json').name;

const CleanWebpackPlugin = require('clean-webpack-plugin');

const lib = [ 'lodash', 'webpack-zepto', 'moment' ];
const plugins = [
  new CleanWebpackPlugin([ 'client/dist' ]),
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    },
  }),
  new webpack.DllPlugin({
    /**
     * path
     * 定义 manifest 文件生成的位置
     * [name]的部分由entry的名字替换
     */
    path: path.join(__dirname, `client/dist/${name}/${version}`, '[name]-manifest.json'),
    /**
     * name
     * dll bundle 输出到那个全局变量上
     * 和 output.library 一样即可。
     */
    name: '[name]_library',
  }),
];

// 非开发模式压缩代码
if (!isDev) plugins.push(new webpack.optimize.UglifyJsPlugin());

module.exports = {
  entry: {
    base: lib,
  },
  output: {
    path: path.join(__dirname, `client/dist/${name}/${version}`),
    filename: '[name].dll.js',
    /**
     * output.library
     * 将会定义为 window.${output.library}
     * 在这次的例子中，将会定义为`window.vendor_library`
     */
    library: '[name]_library',
  },
  plugins,
};
