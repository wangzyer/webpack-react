const fs = require('fs');
const path = require('path');

/**
 * 通过文件名称获取文件路径
 * @param  path
 * @param  files
 */
function getFileDirs(path, files) {
    return files.map(item => path + item)
}

/**
 * 文件拷贝
 * @param from
 * @param to
 */
function copyFileSync(from, to) {
    fs.copyFileSync(from, to, function (err) {
        if (err) {
            console.log(err);
        }
    })
}


/**
 * 文件夹拷贝
 */
function copyDirSync(from, to, deep = true) {
    const fromPath = path.resolve(from);
    const toPath = path.resolve(to);
    fs.access(toPath, function (err) {
        if (err) {
            fs.mkdirSync(toPath)
        }
    });
    fs.readdir(fromPath, function (err, paths) {
        if (err) {
            console.log(err);
            return
        }
        paths.forEach(function (item) {
            const newFromPath = fromPath + '/' + item;
            const newToPath = path.resolve(toPath + '/' + item);
            fs.stat(newFromPath, function (err, stat) {
                if (err) return;
                if (stat.isFile()) {
                    copyFileSync(newFromPath, newToPath);
                }
                if (stat.isDirectory() && deep) {
                    copyDirSync(newFromPath, newToPath)
                }
            })
        })
    })
}

module.exports = {
    getFileDirs,
    copyFileSync,
    copyDirSync
};