import path from 'path';
import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCssPlugin from 'optimize-css-assets-webpack-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import UglifyjsWebpackPlugin from 'uglifyjs-webpack-plugin';

import commonConfig, { contentPath } from './common.config';

const nodeEnv = process.env.NODE_ENV || 'production';
const getConfig = (publicPath, env) => ({
  mode: nodeEnv,
  devtool: 'source-map',
  entry: commonConfig.entry,
  output: {
    ...commonConfig.output,
    path: contentPath,
    publicPath,
  },
  module: {
    rules: [{
      test: /\.(ts|js)x$/,
      enforce: 'pre',
      use: [
        {
          loader: 'eslint-loader',
          options: {
            emitErrors: true,
            failOnHint: true,
          },
        },
      ],
    }, {
      test: /\.less$/,
      exclude: /(node_modules)|(global\.less)/,
      use: [{
        loader: MiniCssExtractPlugin.loader,
      }, {
        loader: 'css-loader',
        options: {
          modules: true,
        },
      }, {
        loader: 'postcss-loader',
      }, {
        loader: 'less-loader',
        options: {
          lessOptions: {
            javascriptEnabled: true,
          },
        },
      }],
    }, {
      test: /\.less$/,
      include: /(node_modules)|(global\.less)/,
      use: [{
        loader: MiniCssExtractPlugin.loader,
      }, {
        loader: 'css-loader',
      }, {
        loader: 'postcss-loader',
      }, {
        loader: 'less-loader',
        options: {
          lessOptions: {
            javascriptEnabled: true,
          },
        },
      }],
    }, {
      test: /\.css$/,
      exclude: /node_modules/,
      use: [{
        loader: MiniCssExtractPlugin.loader,
      }, {
        loader: 'css-loader',
        options: {
          modules: true,
        },
      }, {
        loader: 'postcss-loader',
      }],
    }, {
      test: /\.css$/,
      include: /node_modules/,
      use: [{
        loader: MiniCssExtractPlugin.loader,
      }, {
        loader: 'css-loader',
      }, {
        loader: 'postcss-loader',
      }],
    }, ...commonConfig.module.rules],
  },
  optimization: {
    minimizer: [
      new UglifyjsWebpackPlugin({
        uglifyOptions: {
          warnings: false,
          output: {
            comments: false,
          },
          compress: {
            // Disabled because of an issue with Uglify breaking seemingly valid code:
            // https://github.com/facebook/create-react-app/issues/2376
            // Pending further investigation:
            // https://github.com/mishoo/UglifyJS2/issues/2011
            comparisons: false,
          },
        },
        // Use multi-process parallel running to improve the build speed
        // Default number of concurrent runs: os.cpus().length - 1
        parallel: true,
        // Enable file caching
        cache: true,
        sourceMap: true,
      }),
      new OptimizeCssPlugin({
        cssProcessorOptions: {
          discardComments: { removeAll: true },
          // 避免 cssnano 重新计算 z-index
          safe: true,
        },
      }),
    ],
    ...commonConfig.optimization,
  },
  resolve: commonConfig.resolve,
  externals: commonConfig.externals,
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(nodeEnv),
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
    }),
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map',
      test: /\.(js|ts)x?$/,
      append: '\n//# sourceMappingURL=https://cyamis.baicizhan.com/js/[url]',
    }),
    ...commonConfig.plugins,
  ],
  stats: 'normal',
});
export default getConfig;
