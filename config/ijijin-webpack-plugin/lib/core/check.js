const {MAX_FILE_SIZE, ERROR_COLLECT_URL} = require('../config');
const {errorLog} = require('../helpers/log');
const packageJson = require('../../../../package');

/**
 * 检查package.json内容修改
 */
function checkIsNeedChangeJson() {
    if (!(packageJson.name && packageJson.author && packageJson.version && packageJson.task)) {
        const errorMessage = '请修改package.json配置文件，填写作者、任务号、版本号';
        errorLog(errorMessage);
        throw Error(errorMessage)
    }
    return true
}

/**
 * 检测必要的js文件是否引入
 */
function checkIsImportNecessaryAsset(HtmlWebpackPluginData) {
    // 错误收集文件检查
    if (packageJson.errorCollecting && !ERROR_COLLECT_URL.test(HtmlWebpackPluginData.html)) {
        const errorMessage = `${HtmlWebpackPluginData.outputName}错误收集未引入，如果强制不引入请修改 package.json 中 errorCollecting -> false`;
        errorLog(errorMessage);
        throw Error(errorMessage)
    }
    return true
}


/**
 * 检查输出资源大小
 * @param assets
 */
function checkIsExceed(assets) {
    Object.keys(assets).forEach(filename => {
        const file = assets[filename];
        const size = file.size();
        if (size > MAX_FILE_SIZE) {
            console.log(`资源${filename}大小(${size})超过${MAX_FILE_SIZE}，建议上传资源服务器。`)
        }
    });
    return true
}


module.exports = {
    checkIsNeedChangeJson,
    checkIsExceed,
    checkIsImportNecessaryAsset
};