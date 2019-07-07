import path from 'path';
import ProgressBarPlugin from 'progress-bar-webpack-plugin';

export const contentPath = path.resolve(__dirname, '../dist');
// 这里可以路径前一个名称作为页面区分
const entry = {
    index: ['./src/index.tsx'],
};
const rules = [{
    test: /\.tsx?$/,
    exclude: /node_modules/,
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
}];
const plugins = [
    new ProgressBarPlugin({
        format: '\u001b[90m\u001b[44mBuild\u001b[49m\u001b[39m [:bar] \u001b[32m\u001b[1m:percent\u001b[22m\u001b[39m (:elapseds) \u001b[2m:msg\u001b[22m\r',
        renderThrottle: 100,
        summary: true,
        clear: false,
    }),
];
const config = {
    entry,
    target: 'web',
    output: {
        filename: 'js/[name].[hash].js',
        chunkFilename: 'js/[name].[chunkhash].js',
    // 这个会影响externals的配置
    // libraryTarget: 'umd',
    },
    module: {
        rules,
    },
    resolve: {
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
            cacheGroups: {},
        },
    },
    plugins,
};
export default config;
