import webpack from 'webpack';
import commonConfig, { contentPath } from './common.config';

const nodeEnv = process.env.NODE_ENV || 'development';
const devPort = process.env.PORT || '9999';
const publicPath = '/'; // 可自定义
const entry = { ...commonConfig.entry };
const config = {
  devtool: 'eval-source-map',
  mode: nodeEnv,
  entry,
  target: commonConfig.target,
  output: {
    ...commonConfig.output,
    path: contentPath,
    publicPath,
    globalObject: 'this',
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
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            modules: true,
          },
        },
        'postcss-loader',
        {
          loader: 'less-loader',
          options: {
            lessOptions: {
              javascriptEnabled: true,
            },
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
        },
        'postcss-loader',
        {
          loader: 'less-loader',
          options: {
            lessOptions: {
              javascriptEnabled: true,
            },
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
        },
      }, 'postcss-loader'],
    },
    {
      test: /\.css$/,
      include: /node_modules/,
      use: ['style-loader', {
        loader: 'css-loader',
      }, 'postcss-loader'],
    },
    ...commonConfig.module.rules,
    ],
  },
  resolve: commonConfig.resolve,
  externals: commonConfig.externals,
  watchOptions: {
    aggregateTimeout: 400,
    poll: 1000,
    ignored: /node_modules/,
  },
  optimization: {
    ...commonConfig.optimization,
    chunkIds: 'named', // 开发环境使用named，生产使用hashed
    moduleIds: 'named', // 开发环境使用named，生产使用hashed
  },
  devServer: {
    hot: true,
    host: '127.0.0.1',
    port: devPort,
    disableHostCheck: true,
    contentBase: contentPath,
    historyApiFallback: true,
    stats: 'minimal',
    compress: true,
    proxy: {
      context: ['/api/'],
      // target: 'http://172.16.40.96:8080/',
      target: 'http://127.0.0.1:3000/',
      headers: {
        // host: 'cyamis-staging.baicizhan.com',
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
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(nodeEnv),
    }),
    ...commonConfig.plugins,
  ],
};
export default config;
