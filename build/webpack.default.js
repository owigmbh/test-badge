const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');


const path = require('path');

function resolvePath(dir) {
  return path.join(__dirname, '..', dir);
}

const env = process.env.NODE_ENV || 'development';
const target = process.env.TARGET || 'web';
const isCordova = target === 'cordova';
const isElectronWatch = process.env.ELECTRON_WATCH || false;

module.exports = {
  mode: env,
  entry: {
      // './src/js/srv.ts',
      admin: './src/js/admin.ts',
      app: './src/js/srv.ts'
  },
  output: {
    path: resolvePath(isCordova ? (isElectronWatch ? 'cordova/platforms/electron/www' : 'cordova/www') : 'www'),
    filename: '[name].js',
    publicPath: '',
    hotUpdateChunkFilename: 'hot/hot-update.js',
    hotUpdateMainFilename: 'hot/hot-update.json',
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {

      '@': resolvePath('src'),
      querystring: 'querystring-browser',
    },
  },
  devtool: env === 'production' ? 'source-map' : 'eval',
  devServer: {
    hot: true,
    open: true,
    compress: true,
    contentBase: '/www/',
    disableHostCheck: true,
    watchOptions: {
      poll: 1000,
      ignored: ['couchdb', 'node_modules']
    },
  },
  optimization: {
    minimizer: [new TerserPlugin({
      sourceMap: true,
    })],
  },
  node: {
    fs: 'empty'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        include: [
          resolvePath('src'),
          resolvePath('node_modules/framework7'),
          resolvePath('node_modules/template7'),
          resolvePath('node_modules/dom7'),
          resolvePath('node_modules/ssr-window'),
        ],
      },
      {
        test: /\.f7.html$/,
        use: [
          'babel-loader',
          {
            loader: 'framework7-component-loader',
            options: {
              helpersPath: './src/template7-helpers-list.js',
            },
          },
        ],
      },

      {
        test: /\.css$/,
        use: [
          (env === 'development' ? 'style-loader' : {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          }),
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.styl(us)?$/,
        use: [
          (env === 'development' ? 'style-loader' : {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          }),
          'css-loader',
          'postcss-loader',
          'stylus-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [
          (env === 'development' ? 'style-loader' : {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          }),
          'css-loader',
          'postcss-loader',
          'less-loader',
        ],
      },
      {
        test: /\.(sa|sc)ss$/,
        use: [
          (env === 'development' ? 'style-loader' : {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          }),
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'images/[name].[ext]',

        },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac|m4a)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name].[ext]',

        },
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[ext]',

        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
      'process.env.TARGET': JSON.stringify(target),
    }),

    ...(env === 'production' ? [
      new OptimizeCSSPlugin({
        cssProcessorOptions: {
          safe: true,
          map: { inline: false },
        },
      }),
      new webpack.optimize.ModuleConcatenationPlugin(),
    ] : [
      // Development only plugins
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(),
    ]),
    new HtmlWebpackPlugin({
        filename: 'admin/index.html',
        template: './src/index.html',
        inject: true,
        minify: env === 'production' ? {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: false,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true
          } : false,
    }),
    new HtmlWebpackPlugin({
          filename: 'srv/index.html',
          template: './src/indexApp.html',
          inject: true,
          minify: env === 'production' ? {
              collapseWhitespace: true,
              removeComments: true,
              removeRedundantAttributes: false,
              removeScriptTypeAttributes: true,
              removeStyleLinkTypeAttributes: true,
              useShortDoctype: true
          } : false,
    }),
    new MiniCssExtractPlugin({
      filename: 'css/srv.css',
    }),
    new CopyWebpackPlugin([
      {
        from: resolvePath('src/static'),
        to: resolvePath(isCordova ? 'cordova/www/static' : 'www/static'),
      },

    ]),


  ],
};