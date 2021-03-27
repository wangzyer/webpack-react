const axios = require('axios');
const archiver = require('archiver');
const fs = require('fs');
const FormData = require("form-data");
const packageJson = require('../../../../package.json');
const {UPLOAD_SCORE} = require('../config')

/**
 * 上传构建信息至服务器
 */
function uploadBuildInfo(data, compilation) {
    // let testurl = 'http://localhost:1211/build/save';
    let url = 'https://testfund.10jqka.com.cn/ifundtools/interface/build/save';

    // 获取资源相关信息
    const assetInfo = [];
    Object.keys(compilation.assets).forEach(filename => {
        const size = compilation.assets[filename].size();
        if (!assetInfo.includes(filename)) {
            assetInfo.push({
                name: filename,
                size: size
            });
        }
    });

    axios.post(url, Object.assign({
        name: packageJson.name,
        author: packageJson.author,
        version: packageJson.version,
        task: packageJson.task,
        platform: packageJson.platform,
        des: packageJson.description,
        assetInfo: assetInfo
    }, data))
}

/**
 * 上传源码至打分系统
 */
function uploadSrc(contextPath) {
    const targetPath = `${contextPath}/src.zip`;
    const archive = archiver('zip', {
        zlib: {level: 9} // Sets the compression level.
    });
    const output = fs.createWriteStream(targetPath);
    archive.pipe(output);
    UPLOAD_SCORE.files.forEach((name) => {
        archive.file(`${contextPath}/${name}`, {name});
    });
    UPLOAD_SCORE.dirs.forEach((name) => {
        archive.directory(`${contextPath}/${name}/`, name);
    });
    output.on('finish', function () {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(targetPath));
        axios({
            method: "post",
            url: "http://testfund.10jqka.com.cn/fessr/reportscore",
            data: formData,
            headers: formData.getHeaders()
        }).then(res => {
            fs.unlinkSync(targetPath);
        }).catch(e => {
            console.log(e)
        });
    });

    output.on('error', function (err) {
        console.error(error);
    });

    archive.finalize();
}


module.exports = {
    uploadBuildInfo,
    uploadSrc
};
