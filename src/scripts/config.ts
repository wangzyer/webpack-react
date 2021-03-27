/**
 * 获取当前所在环境
 */
const getCurrentEnv = (): string => {
    const ua = navigator.userAgent.toLowerCase();
    if (/bestpay/gi.test(ua) || /orange/gi.test(ua)) { // 甜橙和翼支付环境
        return 'tc'
    } else if (/micromessenger/gi.test(ua)) { // 微信环境
        return 'wechat'
    } else if (/xiaomi/gi.test(ua)) { //小米环境
        return 'xiaomi'
    } else if (/maijinwang/gi.test(ua)) { // 买金网
        return 'maijin'
    } else {
        return _.urlInfo.sys
    }
};

interface iConfig {
    // 下载地址
    download: {
        ths: string,
        ijijin: string
    },
    isSharePage: boolean, // 是否是分享环境
    pageId: string, // 页面id
    urlVer: string, // 任务号
    localDev: boolean, // 是否是本地环境
    openMock: boolean, // 是否开启mock
    env: string, // 当前环境
    prefix: string, // 接口前缀
    testDev: boolean, // 正式测试环境判断
    [propsName: string]: any
}

const hostname = location.hostname;
const config: iConfig = {
    download: {
        ths: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.hexin.plat.android',
        ijijin: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.hexin.android.bank'
    },
    isSharePage: !!_.fn.getUrlParam('share'),
    pageId: '--',
    urlVer: '--',
    inTrade: hostname === 'trade.5ifund.com',
    openMock: !_.fn.getUrlParam('closeMock') && (_.urlInfo.test || hostname === 'localhost'),
    prefix: hostname === 'trade.5ifund.com' ? 'tohangqing' : '',
    localDev: hostname == 'localhost',
    testDev: hostname === 'localhost' || !!_.urlInfo.test,
    env: getCurrentEnv()
};
export default config