/**
 * Created by ink on 2018/4/4.
 */
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import packageObj from '../package.json';
import { vendorPath } from './webpack.config.dll.babel';

export const contentPath = path.resolve(__dirname, '../dist');
// 这里可以路径前一个名称作为页面区分
const entry = {
  index: ['babel-polyfill', './client/index.tsx'],
};
const rules = [{
  enforce: 'pre',
  test: /\.(tsx?)|(jsx?)$/,
  exclude: /node_modules/,
  use: ['source-map-loader'],
}, {
  test: /\.tsx?$/,
  exclude: /node_modules/,
  use: ['babel-loader', {
    loader: 'ts-loader',
    options: {
      transpileOnly: true,
    },
  }],
}, {
  test: /\.jsx?$/,
  exclude: /node_modules/,
  use: ['babel-loader'],
}];
const plugins = [
  new HtmlWebpackPlugin({
    title: packageObj.name,
    template: './html/index.html',
    filename: 'index.html',
    inject: true,
  }),
  new webpack.DllReferencePlugin({
    context: __dirname,
    manifest: require(`${vendorPath}/vendors.manifest.json`),
  }),
];
const config = {
  entry,
  target: 'web',
  output: {
    filename: 'js/[name].[hash:8].js',
    chunkFilename: 'js/[name].[chunkhash:8].js',
    libraryTarget: 'umd',
  },
  module: {
    rules,
  },
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'client'),
    ],
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
  plugins,
};
export default config;
