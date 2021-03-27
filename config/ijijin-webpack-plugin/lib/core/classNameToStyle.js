const packageJson = require('../../../../package');
const {px2vw} = require('./unit');
const {MOO_CSS_TABLE} = require('../config');

/**
 * 类名转化成css样式字符串
 * @param classNameArray
 * @param viewportUnit
 * @returns {string|string}
 */
function classNameToStyle(classNameArray, viewportUnit) {
    let mooCssString = '';
    for (let cssClassName of classNameArray) {
        let cssName = cssClassName.split('-')[1];
        let attr = /[a-z]+/.exec(cssName)[0];
        let value = /\d+/.exec(cssName)[0];
        mooCssString += `.${cssClassName}{${MOO_CSS_TABLE[attr]}:${packageJson.platform === 'mobile' ? px2vw(value, viewportUnit) : `${value}px`}}`
    }
    return mooCssString
}

module.exports = classNameToStyle;
