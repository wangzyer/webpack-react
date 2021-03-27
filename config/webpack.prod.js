/**
 * @module webpack.prod
 * @author whw
 */
const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const cssnano = require('cssnano');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');

const PreloadWebpackPlugin = require('preload-webpack-plugin');
const {useMPA} = require('./fn');

const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
const baseConfig = require('./webpack.base');
const CONFIGS = require('./configs');


let htmlWebpackExternalsPlugins = [];
let preloadWebpackPlugins = [];

useMPA(({chunkNames}) => {
    for (let i = 0, len = chunkNames.length; i < len; i++) {
        let chunkName = chunkNames[i];
        htmlWebpackExternalsPlugins.push(new HtmlWebpackExternalsPlugin({
            externals: [{
                module: 'react',
                entry: '//s.thsi.cn/ijijin/js/lib/react.16.8.6.production.min.js',
                global: 'React'
            },
                {
                    module: 'react-dom',
                    entry: '//s.thsi.cn/ijijin/js/lib/react-dom.16.8.6.production.min.js',
                    global: 'ReactDOM'
                },
                {
                    module: 'moo-css-base',
                    entry: {
                        path: '//s.thsi.cn/ijijin/appAssets/css/moo-css-base.min.css',
                        type: 'css'
                    }
                }
            ],
            files: [`${chunkName}.html`]
        }))
    }
    // todo �����ҳ����ÿ��html�ļ�����preload������Դ ���Ե�ҳ���ʹ��
    if (chunkNames.length === 1) {
        preloadWebpackPlugins.push(new PreloadWebpackPlugin({
            rel: 'preload',
            as(entry) {
                if (/\.css$/.test(entry)) return 'style';
                if (/\.woff$/.test(entry)) return 'font';
                if (/\.png$/.test(entry)) return 'image';
                return 'script';
            },
            include: 'allChunks'
        }))
    }
});




// top banner
const MY_BANNER = `
  ${CONFIGS.name}
  @version: ${CONFIGS.version}
  @description: ${CONFIGS.description}
  @author: ${CONFIGS.author}
  @task: ${CONFIGS.task || ''}
  @build time: ${new Date().toLocaleTimeString()}
`;
const prodConfig = options => ({
    mode: 'production',

    stats: 'errors-only',

    plugins: [
        new CleanWebpackPlugin(),
        new webpack.IgnorePlugin(/mock\/*/),
        new webpack.BannerPlugin(MY_BANNER),
        new OptimizeCSSAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: cssnano
        }),
        ...htmlWebpackExternalsPlugins,
        ...preloadWebpackPlugins,
        // new webpack.DllReferencePlugin({
        //     manifest: path.resolve(__dirname, '../lib/vendors.manifest.json')
        // }),
        function errorPlugin() {
            this.hooks.done.tap('done', (stats) => {
                if (stats.compilation.errors &&
                    stats.compilation.errors.length &&
                    process.argv.indexOf('--watch') === -1) {
                    process.exit(1);
                }
            });
        }
    ],
    performance: {
        hints: 'warning'
    },
    optimization: {
        splitChunks: {
            minSize: 0,
            cacheGroups: {
                commons: {
                    name: 'vendors',
                    chunks: 'all',
                    minChunks: 2
                }
            }
        }
    }
});

module.exports = (options = {}) => {
    return webpackMerge(baseConfig(options), prodConfig(options))
};
