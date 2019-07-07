import path from 'path';
import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ManifestPlugin from 'webpack-manifest-plugin';
import OptimizeCssPlugin from 'optimize-css-assets-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import UglifyjsWebpackPlugin from 'uglifyjs-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

import commonConfig, { contentPath } from './common.config';

const nodeEnv = process.env.NODE_ENV || 'production';
const getConfig = (publicPath, env) => ({
    mode: nodeEnv,
    devtool: 'source-map',
    entry: commonConfig.entry,
    output: Object.assign({}, commonConfig.output, {
        path: contentPath,
        publicPath,
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
            use: [{
                loader: MiniCssExtractPlugin.loader,
            }, {
                loader: 'css-loader',
            }, {
                loader: 'postcss-loader',
            }, {
                loader: 'less-loader',
                options: {
                    javascriptEnabled: true,
                },
            }],
        }, {
            test: /\.css$/,
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
    },
    resolve: commonConfig.resolve,
    externals: commonConfig.externals,
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(nodeEnv),
            'process.env.JENKINS_ENV': JSON.stringify(env),
        }),
        new CleanWebpackPlugin(['dist'], {
            root: path.resolve(__dirname, '../'),
            verbose: true,
            dry: false,
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash].css',
        }),
        new ManifestPlugin({
            fileName: 'mapping.json',
            publicPath,
            seed: {
                title: '后台管理系统',
            },
        }),
        new HtmlWebpackPlugin({
            template: './html/index.html',
            filename: 'index.html',
            templateParameters: {
                title: '',
            },
            inject: true,
            favicon: 'html/favicon.ico',
        }),
        ...commonConfig.plugins,
    ],
    stats: 'verbose',
});
export default getConfig;
