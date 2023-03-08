const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CompressionPlugin = require('compression-webpack-plugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = function(_env, argv) {
  const isProduction = argv.mode === "production";
  const isDevelopment = !isProduction;

  const CSSModuleLoader = {
    loader: 'css-loader',
    options: {
      modules: {
        mode: 'local',
        localIdentName: '[name]_[local]_[hash:base64:5]',
        exportLocalsConvention: 'camelCaseOnly'
      },
      importLoaders: 2,
      // camelCase:true,
      sourceMap: false, // turned off as causes delay
    }
  }

  const CSSLoader = {
    loader: 'css-loader',
    options: {
      modules: "global",
      importLoaders: 2,
      // camelCase:true,
      sourceMap: false, // turned off as causes delay
    }
  }

  return {
    devtool: isDevelopment && "cheap-module-source-map",
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "./resources/js"),
      filename: "bundle.js",
      publicPath: "/"
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                loader: "babel-loader",
                options: {
                    cacheDirectory: true,
                    cacheCompression: false,
                    envName: isProduction ? "production" : "development"
                }
                }
            },
            // {
            //     test: /\.css$/,
            //     use: [
            //       "style-loader",
            //       "css-loader"
            //     ]
            // },
            {
              test: /\.css$/,
              exclude: /\.module\.css$/,
              use: ["style-loader", CSSLoader]
            },
            {
              test: /\.module\.css$/,
              use: ["style-loader", CSSModuleLoader]
            },
            {
              test: /\.less$/,
              use: [{
                  loader: "style-loader"
              }, {
                  loader: "css-loader"
              }, {
                  loader: "less-loader",
                  options: {
                    lessOptions: {
                       javascriptEnabled: true
                    }
                  }
              }]
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: {
                  loader: "url-loader",
                  options: {
                    limit: 102400,
                    name: "static/media/[name].[hash:8].[ext]"
                  }
                }
            },
            {
                test: /\.svg$/,
                use: ["@svgr/webpack"]
            },
            {
                test: /\.(eot|otf|ttf|woff|woff2)$/,
                loader: require.resolve("file-loader"),
                options: {
                  name: "static/media/[name].[hash:8].[ext]"
                }
            }
        ]
    },
    resolve: {
        extensions: [".js", ".jsx"]
    },
    plugins: [
        isProduction &&
            new MiniCssExtractPlugin({
                filename: "assets/css/[name].[contenthash:8].css",
                chunkFilename: "assets/css/[name].[contenthash:8].chunk.css"
            }),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            filename: "./index.html",
            inject: true,
			favicon: "./src/assets/icons/logo.png"
        }),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(
            isProduction ? "production" : "development"
            )
        })
    ].filter(Boolean),
    optimization: {
        minimize: isProduction,
        minimizer: [
          // new UglifyJsPlugin(),
          new TerserWebpackPlugin({
            terserOptions: {
              compress: {
                comparisons: false
              },
              mangle: {
                safari10: true
              },
              output: {
                comments: false,
                ascii_only: true
              },
              warnings: false
            }
          }),
          new OptimizeCssAssetsPlugin(),
          new CompressionPlugin()
        ],
    },
    devServer: {
        compress: true,
        historyApiFallback: true,
        open: true,
        overlay: true
    }
  };
};