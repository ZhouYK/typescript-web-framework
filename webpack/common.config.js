import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';

export const contentPath = path.resolve(__dirname, '../dist');
// 这里可以路径前一个名称作为页面区分
const entry = {
  index: ['./src/index.tsx'],
};
const rules = [{
  test: /\.(ts|js)x?$/,
  include: [
    path.resolve(__dirname, '../src'),
    /node_modules[\\/](antd)|(pinyin)/,
  ],
  use: [{
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
    },
  }, {
    loader: 'ts-loader',
    options: {
      transpileOnly: true,
    },
  }],
}, {
  test: /\.(png|jpe?g|gif)$/i,
  loader: 'file-loader',
}, {
  test: /\.svg(\?v=\d+\.\d+\.\d+)?$/i,
  issuer: {
    test: /\.tsx?$/,
  },
  use: [{
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
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
      title: 'MIS',
    },
    chunksSortMode: 'manual',
    chunks: ['runtime', 'base', 'uis', 'mis_style', 'index'],
    favicon: 'html/favicon.ico',
  }),
];
const config = {
  entry,
  target: 'web',
  output: {
    filename: process.env.NODE_ENV === 'development' ? 'js/[name].[hash].js' : 'js/[name].[chunkhash].js',
    chunkFilename: 'js/[name].[chunkhash].js',
    // 这个会影响externals的配置
    // libraryTarget: 'umd',
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
  },
  optimization: {
    chunkIds: 'named',
    moduleIds: 'hashed',
    runtimeChunk: {
      name: 'runtime',
    },
    splitChunks: {
      automaticNameDelimiter: '_',
      cacheGroups: {
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
