import config from './config'

interface iINTERFACE {
    [propName: string]: string
}

const WECHAT_INTERFACE: iINTERFACE = {
    'fetchWeChatAuthUrl': `get ${config.inTrade ? '/rs' : '/hqapi/totrade'}/wxapi/oauth/init/default`, // 获取微信授权链接
    'fetchWeChatUserInfo': `get ${config.inTrade ? '/rs' : '/hqapi/totrade'}/wxapi/oauth/result/default`, // 获取微信用户信息
    'checkSubscribe': `get ${config.inTrade ? '/rs' : '/hqapi/totrade'}/wxapi/oauth/checksubscribe`, // 检查是否关注公众号
    'wechatLogin': `get ${config.inTrade ? '/rs' : '/hqapi/totrade'}/wxapi/oauth/login/result/default` // 微信登陆'
};

const INTERFACE: iINTERFACE = {
    'fetchNowTime': `get ${config.prefix}/getNowTime`, // 获取当前时间
    ...WECHAT_INTERFACE
};

// mock请求地址
const mockUrl = config.openMock ? `https://testfund.10jqka.com.cn/ifundtools/mock/entry/${config.urlVer}` : '';

export default function (Interface: string, data = {}) {
    const requestInfo = INTERFACE[Interface] || Interface;
    const requestInfoArr: Array<string> = requestInfo.split(' ');
    let url: string = requestInfoArr[1];
    let method: string = requestInfoArr[0];
    return new Promise(resolve => {
        _[method](`${mockUrl}${url}`, data).then((data: any) => {
            resolve(data);
        })
    })
}