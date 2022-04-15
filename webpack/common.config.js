import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ESLintWebpackPlugin from 'eslint-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import reactRefreshBabel from 'react-refresh/babel';
import reactRefreshTs from 'react-refresh-typescript';
import FriendlyErrorsWebpackPlugin from '@nuxtjs/friendly-errors-webpack-plugin';
import webpack from 'webpack';

const isDevelopment = process.env.NODE_ENV === 'development';
export const contentPath = path.resolve(__dirname, '../dist');
// 这里可以路径前一个名称作为页面区分
const entry = {
  index: ['./src/index.tsx'],
};
const rules = [{
  test: /\.(ts|js)x?$/,
  include: [
    path.resolve(__dirname, '../src'),
  ],
  use: [{
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      cacheCompression: false,
      plugins: [
        isDevelopment && reactRefreshBabel,
      ].filter(Boolean),
    },
  }, {
    loader: 'ts-loader',
    options: {
      transpileOnly: true,
      getCustomTransformers: () => ({
        before: isDevelopment ? [reactRefreshTs()] : [],
      }),
    },
  }],
}, {
  test: /\.(ts|js)x?$/,
  include: [
    /node_modules[\\/](antd)/,
  ],
  use: [{
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      cacheCompression: false,
      presets: [
        ['@babel/preset-env', {
          modules: 'cjs',
          useBuiltIns: 'usage',
          corejs: '3.9',
        }],
      ],
    },
  }],
}, {
  test: /\.(png|jpe?g|gif)$/i,
  // loader: 'file-loader', // https://webpack.docschina.org/guides/asset-modules/
  type: 'asset/resource',
  generator: {
    filename: 'imgs/[hash][ext][query]',
  },
}, {
  test: /\.(ttf|eot|otf|woff)$/i,
  // loader: 'file-loader', // https://webpack.docschina.org/guides/asset-modules/
  type: 'asset/resource',
  generator: {
    filename: 'fonts/[hash][ext][query]',
  },
}, {
  test: /\.svg(\?v=\d+\.\d+\.\d+)?$/i,
  use: [{
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      cacheCompression: false,
    },
  }, {
    loader: 'ts-loader',
    options: {
      transpileOnly: true,
    },
  }, {
    loader: '@svgr/webpack',
  }],
}];
const plugins = [
  new HtmlWebpackPlugin({
    template: './html/index.html',
    filename: 'index.html',
    templateParameters: {
      title: 'Mesh',
    },
    chunksSortMode: 'manual',
    chunks: ['runtime', 'base', 'uis', 'style', 'index'],
    favicon: './html/favicon.ico',
  }),
  new ESLintWebpackPlugin({
    extensions: ['js', 'jsx', 'tsx', 'ts'],
    threads: true,
    emitError: true,
    emitWarning: true,
    failOnError: true,
  }),
  new FriendlyErrorsWebpackPlugin(),
  new webpack.container.ModuleFederationPlugin({
    name: 'federation_test',
    filename: 'js/myRemote.js',
    exposes: {
      './hello': '@src/federationTest',
    },
  }),
  isDevelopment && new ReactRefreshWebpackPlugin({
    overlay: false,
  }),
].filter(Boolean);
const config = {
  entry,
  target: 'web',
  output: {
    filename: isDevelopment ? 'js/[name].js' : 'js/[name].[chunkhash:16].js',
    chunkFilename: isDevelopment ? 'js/[name].js' : 'js/[id].[contenthash:16].js',
    pathinfo: false,
    // 这个会影响externals的配置
    // libraryTarget: 'umd',
  },
  cache: {
    type: 'filesystem', // memory,
    buildDependencies: {
      config: [__filename],
    },
    maxAge: 5184000000 * 12, // 允许未使用的缓存留在文件系统缓存中的时间：一年
  },
  module: {
    rules,
  },
  resolve: {
    alias: {
      '@src': path.resolve('src'),
    },
    mainFiles: ['index'],
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.d.ts', '.less'],
    symlinks: false,
    cacheWithContext: false,
  },
  optimization: isDevelopment ? {
    chunkIds: 'named', // 开发环境使用named，生产使用hashed
    moduleIds: 'named', // 开发环境使用named，生产使用hashed
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  } : {
    chunkIds: 'deterministic',
    moduleIds: 'deterministic',
    runtimeChunk: {
      name: 'runtime',
    },
    splitChunks: {
      automaticNameDelimiter: '_',
      cacheGroups: {
        style: {
          name: 'style',
          chunks: 'all',
          test: /\.(css|less)$/,
          enforce: true,
        },
        base: {
          test: /[\\/]node_modules[\\/]((?!antd|@ant-design).)+[\\/]/,
          name: 'base',
          chunks: 'all',
          enforce: true,
        },
        ui: {
          test: /[\\/]node_modules[\\/](antd|@ant-design)[\\/]/,
          name: 'uis',
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  plugins,
};
export default config;
