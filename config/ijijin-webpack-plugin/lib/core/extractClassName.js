const {MO0_CSS_REGEXP} = require('../config')

/**
 * 从字符串中提取MooCss样式类名
 * @param source
 */
function extractMooCssName(source) {
    let mooCssArray = new Set();
    if (source) {
        let result = MO0_CSS_REGEXP.exec(source);
        while (result) {
            mooCssArray.add(result[0]);
            result = MO0_CSS_REGEXP.exec(source)
        }
        return mooCssArray
    }
}

module.exports = extractMooCssName;