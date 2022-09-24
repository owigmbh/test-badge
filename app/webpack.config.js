const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//todo replace it: const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const path = require('path');

function resolvePath(dir) {
  return path.join(__dirname, '..', dir);
}

const env = process.env.NODE_ENV || 'development';
const target = process.env.TARGET || 'web';
const isCordova = target === 'cordova';
const isElectronWatch = process.env.ELECTRON_WATCH || false;
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 8082;

const appSrc = process.env.APP_SOURCE;
const device = process.env.DEVICE;

module.exports = {
  mode: env,
  entry: [
      '../src/js/app.js'
  ],
  output: {
    path: resolvePath(isCordova ? (isElectronWatch ? 'cordova/platforms/electron/www' : 'www') : 'www'),
      filename: 'app.js',
      publicPath: '',
      hotUpdateChunkFilename: 'hot/hot-update.js',
      hotUpdateMainFilename: 'hot/hot-update.json',
  },
  resolve: {
    extensions: [".ts", ".tsx", '.js', '.json'],
    alias: {
      '@': resolvePath('src'),
      querystring: 'querystring-browser',
    },
  },
  devtool: env === 'production' ? 'source-map' : 'eval',
  devServer: {
    host: host,
    port: port,
    hot: true,
    open: true,
    compress: true,
    contentBase: './www',
    disableHostCheck: true,
    watchOptions: {
      poll: 1000,
      ignored: ['couchdb', 'node_modules']
    },
  },
  optimization: {
    minimizer: [new TerserPlugin({
      extractComments: false,
    })],
  },
  // node: {
  //   fs: 'empty'
  // },
  module: {
    rules: [
      {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          use: [
              {
                  loader: "ts-loader",
                  options: {
                      transpileOnly: true
                  }
              }
          ]
      },
      // {
      //   test: /\.(js|jsx)$/,
      //   use: 'babel-loader',
      //   include: [
      //     resolvePath('src'),
      //     resolvePath('node_modules/framework7'),
      //     resolvePath('node_modules/template7'),
      //     resolvePath('node_modules/dom7'),
      //     resolvePath('node_modules/ssr-window'),
      //   ],
      // },
      // {
      //   test: /\.f7.html$/,
      //   use: [
      //     'babel-loader',
      //     {
      //       loader: 'framework7-component-loader',
      //       options: {
      //         helpersPath: '../src/template7-helpers-list.js',
      //       },
      //     },
      //   ],
      // },
        {
            test: /\.(mjs|js|jsx)$/,
            include: [
                resolvePath('src'),

            ],
            use: [
                {
                    loader: require.resolve('babel-loader'),

                },
            ]
        },
        {
            test: /\.f7(.(html|js))?$/,
            use: [
                'babel-loader',
                'framework7-loader',
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
      'process.env.APP_SOURCE': JSON.stringify(appSrc),
      'process.env.DEVICE': JSON.stringify(device),
    }),

      ...(env === 'production' ? [
          // new OptimizeCSSPlugin({
          //     cssProcessorOptions: {
          //         safe: true,
          //         map: { inline: false },
          //     },
          // }),
          new webpack.optimize.ModuleConcatenationPlugin(),
      ] : [
          // Development only plugins
          new webpack.HotModuleReplacementPlugin(),
      ]),

    new HtmlWebpackPlugin({
          filename: './index.html',
          template: '../src/index.html',
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
      filename: 'css/app.css',
    }),

      // new CopyWebpackPlugin({
      //     patterns: [
      //         {
      //             noErrorOnMissing: true,
      //             from: resolvePath('src/static'),
      //             to: resolvePath(isCordova ? 'cordova/www/static' : 'www/static'),
      //         },
      //
      //     ],
      // })


  ],
};