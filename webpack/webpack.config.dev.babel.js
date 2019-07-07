import webpack from 'webpack';
import ManifestPlugin from 'webpack-manifest-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import commonConfig, { contentPath } from './common.config';
import packageObj from '../package.json';

const nodeEnv = process.env.NODE_ENV || 'development';
const devPort = process.env.PORT || '9999';
const publicPath = '/'; // 可自定义
const entry = Object.assign({}, commonConfig.entry);
const config = {
    devtool: 'eval-source-map',
    mode: nodeEnv,
    entry,
    target: commonConfig.target,
    output: Object.assign({}, commonConfig.output, {
        path: contentPath,
        publicPath,
        globalObject: 'this',
    }),
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
            use: [
                'style-loader',
                'css-loader',
                'postcss-loader',
                {
                    loader: 'less-loader',
                    options: {
                        javascriptEnabled: true,
                    },
                },
            ],
        },
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader', 'postcss-loader'],
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
    devServer: {
        hot: true,
        host: '0.0.0.0',
        port: devPort,
        disableHostCheck: true,
        contentBase: contentPath,
        historyApiFallback: true,
        stats: 'minimal',
        compress: true,
        proxy: {},
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(nodeEnv),
            'process.env.JENKINS_ENV': JSON.stringify('test'),
        }),
        new ManifestPlugin({
            fileName: 'mapping.json',
            publicPath,
            seed: {
                title: packageObj.name,
            },
        }),
        new HtmlWebpackPlugin({
            template: './html/index.html',
            filename: 'index.html',
            templateParameters: {
                title: packageObj.name,
            },
            inject: true,
            favicon: 'html/favicon.ico',
        }),
        ...commonConfig.plugins,
    ],
};
export default config;
