const fs = require('fs');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {RawSource} = require('webpack-sources');
const {copyDirSync, copyFileSync} = require('./helpers/fs');
const classNameToStyle = require('./core/classNameToStyle');
const extractClassName = require('./core/extractClassName');
const createPreload = require('./core/createPreload');
const {checkIsNeedChangeJson, checkIsExceed, checkIsImportNecessaryAsset} = require('./core/check');
const {uploadBuildInfo, uploadSrc} = require('./core/upload');

class IjijinPlugin {
    constructor(options) {
        // hash值
        this.hash = Math.floor(Math.random() * 10000000) + '';

        this.isBuild = options.isBuild;
        this.isProd = options.isProd;
        this.isDev = !options.isBuild;
        this.checkPass = false;
        // 样式转化相关
        this.moocss = {
            // moocss类名列表
            mooCssArray: new Set(),
            // 输出文件名
            cssFileName: `css/moocss.${this.hash}.css`,
            // 视口
            viewportUnit: (options.viewportUnit || 750) / 100
        };

        // 路径相关
        this.path = {
            // 项目路径
            context: '',
            // 输出路径
            output: ''
        };

        // 构建开始时间
        this.startBuildTime = '';
    }

    apply(compiler) {
        this.path.context = compiler.context;
        this.path.output = compiler.options.output.path;

        compiler.hooks.run.tap('ijijin-plugin', () => {
            this.startBuildTime = Date.now();
        });

        compiler.hooks.compilation.tap('ijijin-plugin', compilation => {
            compilation.hooks.optimizeChunkAssets.tapAsync('ijijin-plugin', (chunks, callback) => {
                chunks.forEach(chunk => {
                    chunk.files.forEach(file => {

                        // 提取原子化样式
                        if (file.indexOf('.css') === -1) {
                            const source = compilation.assets[file].source();
                            let classNames = extractClassName(source);
                            classNames.forEach((value) => this.moocss.mooCssArray.add(value))
                        }

                        if (this.isDev) {
                            // 原子化样式热更新
                            if (~file.indexOf('hot-update.js')) {
                                compilation.assets[file].children.splice(9, 0, new RawSource(`eval("document.getElementById('MooCssStyle').innerHTML = '${classNameToStyle(this.moocss.mooCssArray, this.moocss.viewportUnit)}'");`))
                            }
                        }

                    });
                });
                callback()
            });

            HtmlWebpackPlugin.getHooks(compilation).beforeAssetTagGeneration.tapAsync(
                'ijijin-plugin',
                (data, cb) => {
                    if (this.isBuild) {
                        // 添加moocss文件引用
                        data.assets.css.push(this.moocss.cssFileName);
                    }
                    cb(null, data)
                }
            );

            HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
                'ijijin-plugin',
                (data, cb) => {
                    if (this.isBuild) {
                        if (this.isProd) {
                            // 发布前检查
                            this.checkPass = checkIsNeedChangeJson() && checkIsExceed(compilation.assets) && checkIsImportNecessaryAsset(data)
                        }
                    } else {
                        // 增加css原子化样式内联 本地开发环境直接内联到HTML中
                        data.html = data.html.replace('</head>', `<style type="text/css" id="MooCssStyle">${classNameToStyle(this.moocss.mooCssArray, this.moocss.viewportUnit)}</style></head>`);
                    }
                    cb(null, data)
                }
            );
        });

        compiler.hooks.emit.tap('ijijin-plugin', compilation => {
            if (this.isBuild) {
                // 添加moocss资源
                compilation.assets[this.moocss.cssFileName] = new RawSource(classNameToStyle(this.moocss.mooCssArray, this.moocss.viewportUnit))
            }
        });

        compiler.hooks.afterEmit.tap('ijijin-plugin', compilation => {
            if (!this.checkPass) return
            if (this.isProd) {

                // 上传构建信息
                uploadBuildInfo({
                    buildSpendTimeStamp: Date.now() - this.startBuildTime
                }, compilation);

                // 上传源码目录至评分系统
                uploadSrc(this.path.context);

                // 预加载数据处理
                const preload = createPreload(compilation.assets);
                fs.writeFile(path.join(this.path.output, 'preload.json'), JSON.stringify(preload), 'utf-8', (err) => {
                    if (err) {
                        console.error(err);
                    }
                });

                // 复制自动化测试文件至dist
                copyDirSync(path.join(this.path.context, '/test'), path.join(this.path.output, '/test'))
                copyFileSync(path.join(this.path.context, '/package.json'), path.join(this.path.output, '/package.json'))
            }
        });
    }
}

module.exports = IjijinPlugin;
