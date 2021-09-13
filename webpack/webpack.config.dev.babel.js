import webpack from 'webpack';
import WebpackBar from 'webpackbar';
import commonConfig, { contentPath } from './common.config';

const nodeEnv = process.env.NODE_ENV || 'development';
const devPort = process.env.PORT || '9999';
const publicPath = '/'; // 可自定义
const entry = { ...commonConfig.entry };
const bar = new WebpackBar({
  color: '#ffda00',
});
const config = {
  devtool: 'eval-cheap-module-source-map',
  mode: nodeEnv,
  entry,
  cache: commonConfig.cache,
  target: commonConfig.target,
  output: {
    ...commonConfig.output,
    path: contentPath,
    publicPath,
    globalObject: 'this',
  },
  module: {
    rules: [{
      test: /\.less$/,
      exclude: /(node_modules)|(global\.less)/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: true,
            sourceMap: false,
          },
        },
        'postcss-loader',
        {
          loader: 'less-loader',
          options: {
            lessOptions: {
              javascriptEnabled: true,
            },
            sourceMap: false,
          },
        },
      ],
    }, {
      test: /\.less$/,
      include: /(node_modules)|(global\.less)/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            sourceMap: false,
          },
        },
        'postcss-loader',
        {
          loader: 'less-loader',
          options: {
            lessOptions: {
              javascriptEnabled: true,
            },
            sourceMap: false,
          },
        },
      ],
    },
    {
      test: /\.css$/,
      exclude: /node_modules/,
      use: ['style-loader', {
        loader: 'css-loader',
        options: {
          modules: true,
          sourceMap: false,
        },
      }, 'postcss-loader'],
    },
    {
      test: /\.css$/,
      include: /node_modules/,
      use: ['style-loader', {
        loader: 'css-loader',
        options: {
          sourceMap: false,
        },
      }, 'postcss-loader'],
    },
    ...commonConfig.module.rules,
    ],
  },
  resolve: commonConfig.resolve,
  externals: commonConfig.externals,
  watchOptions: {
    aggregateTimeout: 400,
    poll: 3000,
    ignored: /node_modules/,
  },
  optimization: {
    ...commonConfig.optimization,
  },
  devServer: {
    hot: true,
    host: '0.0.0.0',
    port: devPort,
    disableHostCheck: true,
    contentBase: contentPath,
    historyApiFallback: true,
    stats: 'errors-only',
    compress: true,
    useLocalIp: true,
    // quiet: true,
    proxy: {
      context: ['/api/'],
      // target: 'http://172.16.40.96:8080/',
      target: 'https://mesh-dev.baicizhan.com/',
      headers: {
        host: 'mesh-dev.baicizhan.com',
        // host: '172.16.111.13',
      },
      onProxyReq: (proxyReq, req) => {
        // let { cookie } = req.headers;
        // const { host } = req.headers;
        // proxyReq.setHeader('cookie', '');
      },
    },
    open: true,
  },
  plugins: [
    bar,
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(nodeEnv),
    }),
    ...commonConfig.plugins,
  ],
  stats: 'normal',
};
export default config;
