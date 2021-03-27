/**
 * @module webpack.dll
 * @author whw
 */

const path = require('path');
const webpack = require('webpack');
const CONFIGS = require('./configs');

// top banner
const MY_BANNER = `
${CONFIGS.name} library
@packer: ${CONFIGS.author}
@version: ${CONFIGS.version}
`;

module.exports = (options = {}) => {
    return {
        mode: 'production',
        entry: {
            'vendors': [
                'classnames',
                'react-router-dom'
            ],
            'dev': [
                'react',
                'react-dom',
                'react-router'
            ]
        },
        output: {
            filename: '[name].dll.js',
            path: path.join(CONFIGS.root, 'lib'),
            library: '[name]'
        },
        plugins: [
            new webpack.BannerPlugin(MY_BANNER),
            new webpack.DllPlugin({
                name: '[name]',
                path: path.join(CONFIGS.root, 'lib/[name].manifest.json')
            })
        ]
    }
};

