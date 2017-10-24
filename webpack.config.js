'use strict';

const glob = require('glob');
const path = require('path');
const wp = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const CleanWebpackPlugin = require('clean-webpack-plugin');

const version = require('./package.json').version;
const name = require('./package.json').name;

const isDev = process.env.NODE_ENV === 'dev';

// 静态资源前缀
const cdn = '';

// 拼装webpack多文件入口
function getEntry(globPath) {
  const files = glob.sync(globPath);

  const entries = {};

  for (let i = 0; i < files.length; i++) {
    // 兼容windows
    const entry = files[i].replace(/\\/g, '/');
    const extname = path.extname(entry);
    const basename = entry.split(extname).shift();
    const sep = '/';

    entries[basename.split(sep).slice(2).join(sep)] = [ './' + entry ];
  }
  return entries;
}

module.exports = (globPath, pathDir) => {
  const entries = getEntry(globPath, pathDir);

  return {
    entry: entries,
    cache: true,
    output: {
      filename: '[name].js',
      chunkFilename: '[id].[chunkhash].bundle.js',
      publicPath: `${cdn}/dist/${name}/${version}/`,
    },
    performance: {
      hints: 'warning',
      maxAssetSize: 200000,
      maxEntrypointSize: 400000,
      assetFilter: assetFilename => {
        return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
      },
    },
    plugins: [
      // new wp.optimize.CommonsChunkPlugin({
      //   name: 'common',
      //   minChunks: (module, count) => {
      //     const resource = module.resource;
      //     return resource && /\.css/.test(resource);
      //   }
      // }),
      new ExtractTextPlugin('[name].css'),
      isDev ? () => {} : new wp.optimize.UglifyJsPlugin({
        compress: {
          dead_code: false,
          drop_debugger: true,
          drop_console: true,
        },
        beautifier: {
          ascii_only: true,
        },
        mangle: {
          toplevel: true,
        },
      }),
      new wp.DllReferencePlugin({
        context: __dirname,
        /**
         * 在这里引入 manifest 文件
         */
        manifest: require(path.resolve(__dirname, `client/dist/${name}/${version}/base-manifest.json`)),
      }),
    ],
    module: {
      rules: [{
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          }, {
            loader: 'postcss-loader',
            options: {
              plugins: () => {
                return [
                  require('autoprefixer')({
                    browsers: [ 'ios >= 7.0' ],
                  }),
                ];
              },
            },
          }],
        }),
      }, {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          }, {
            loader: 'autoprefixer-loader',
          }, {
            loader: 'less-loader',
            options: {
              sourceMap: true,
            },
          }],
        }),
      }, {
        test: /\.(eot|woff|svg|ttf|woff2|appcache)(\?|$)/,
        exclude: /^node_modules$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'font/[name].[ext]',
          },
        }],
      }, {
        test: /\.(png|jpg|gif)$/,
        exclude: /^node_modules$/,
        use: [{
          loader: 'url-loader',
          options: {
            // name: '[name].[ext]',
            // limit: '8192',
            limit: '30000',
            regExp: '\\b(img.+)',
            name: '[1]?[hash:10]',
          },
        }],
      }, {
        test: /\.(js|jsx)?$/,
        exclude: /^node_modules$/,
        use: [{
          // 编译新版本js语法为低版本js语法
          loader: 'babel-loader',
          options: {
            presets: [[ 'es2015', { modules: false }], 'stage-0' ],
          },
        }],
      }],
    },
  };
};
