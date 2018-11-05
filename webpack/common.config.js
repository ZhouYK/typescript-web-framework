/**
 * Created by ink on 2018/4/4.
 */
import path from 'path';
import webpack from 'webpack';
import { vendorPath } from './webpack.config.dll.babel';

export const contentPath = path.resolve(__dirname, '../dist');
// 这里可以路径前一个名称作为页面区分
const entry = {
  index: ['./client/index.jsx'],
};
const rules = [{
  test: /\.tsx?$/,
  exclude: /node_modules/,
  use: ['babel-loader', {
    loader: 'ts-loader',
    options: {
      transpileOnly: true,
      cacheDirectory: true,
    },
  }],
}];
const plugins = [
];
const config = {
  entry,
  target: 'web',
  output: {
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].[chunkhash:8].js',
    libraryTarget: 'umd',
  },
  module: {
    rules,
  },
  resolve: {
    alias: {
      $tools: path.resolve(__dirname, '../client/tools/'),
      $utils: path.resolve(__dirname, '../client/utils/'),
    },
    mainFiles: ['index.web', 'index'],
    modules: [
      path.resolve(__dirname, '../node_modules'),
      path.resolve(__dirname, '../client'),
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
