const packageJson = require('../../../../package');

/**
 * 生成当前项目资源数据
 * @param assets
 * @returns {{css: Array, images: Array, js: Array}}
 */
function createPreload(assets) {
    const preload = {
        js: [],
        css: [],
        images: []
    };

    const prefix = `/${packageJson.author}/${packageJson.name}/dist/`;
    Object.keys(assets).forEach((fileName) => {
        const path = `${prefix}${fileName}`;
        if (fileName.indexOf('.js') > -1) {
            preload.js.push(path)
        } else if (fileName.indexOf('.css') > -1) {
            preload.css.push(path)
        } else if (fileName.indexOf('images') > -1) {
            preload.images.push(path)
        }
    });

    return preload
}

module.exports = createPreload;