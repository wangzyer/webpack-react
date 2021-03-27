import ajax from './http'
import config from './config';
import wechatShare from '../assets/lib/weChatShare'
import {iShareCallback, iShareConfig} from "@/types/wechat";
import crossStorage from "./crossTradeStorage";
import {iCrossStorageReturn} from "@/types/crossStroage";
import {getCurrentEnv} from "@/scripts/fn.business";


const wechatBindUrl = `https://trade.5ifund.com${config.testDev ? ':8443' : ''}/app/wechat/dist/login.html#/bind`;
const env = getCurrentEnv();


/**
 * 装填用户登录信息
 */

export const installLoginInfo = (data) => {
    if (env !== 'wechat') return console.error('请在微信环境调用');
    let userInfo = data.accountInfo;

    if (config.inTrade) {
        localStorage.setItem('custid', data.key3);
        localStorage.setItem('key3', data.key3);
        localStorage.setItem('key4', data.key4);
        localStorage.setItem('key5', data.key5);
        localStorage.setItem('isEvaluating', userInfo.isEvaluating);
        localStorage.setItem('mobileTelNo', userInfo.mobileTelNo);
        localStorage.setItem('clientRiskRate', userInfo.clientRiskRate);
        localStorage.setItem('certificateType', userInfo.certificateType);
        localStorage.setItem('certificateNo', userInfo.certificateNo);
        localStorage.setItem('investorName', userInfo.investorName);
        localStorage.setItem('clientRiskRateText', userInfo.clientRiskRateText);
        localStorage.setItem('openAccoSteps', userInfo.openAccoSteps);
        localStorage.setItem('wxBind', '1') // 微信是否绑定
    }

    window.userinfo = {
        custId: data.custid,
        encryptionCustId: Number(data.custid) * 59 + 101,
        investorName: userInfo.investorName,
        clientRiskRate: userInfo.clientRiskRate,
        clientRiskRateText: userInfo.clientRiskRateText,
        wxBind: '1'
    };
};

/**
 * 检测授权码
 * @param callback1 有授权码回调
 * @param callback2 无授权码回调
 */
export function checkWeChatCode(callback1: (code: string, state: string | null) => void, callback2?: () => void) {
    if (env !== 'wechat') return console.error('请在微信环境调用');
    // 检查是否有授权码
    let code = _.fn.getUrlParam('code');
    let state = _.fn.getUrlParam('state');
    if (code) { // 如果有code则吊起授权登录
        callback1(code, state);
    } else {
        callback2 && callback2()
    }
};

/**
 * 获取授权链接
 */
export const fetchWeChatAuthUrl = () => {
    return new Promise((resolve, reject) => {
        if (env !== 'wechat') return console.error('请在微信环境调用');
        let url = localStorage.getItem('authUrl');
        if (url) { // 授权后跳转指定链接 一般微信外部页面使用
            localStorage.removeItem('authUrl')
        } else if (window.location.port === '8444') { // 准生产域名无法配置授权，所以跳到生产转发一次
            url = `https://trade.5ifund.com/tohangqing/ifundapp_app/public/wzy/wecahtJump/dist/index.html?jumpUrl=${encodeURIComponent(window.location.href)}`
        } else {
            url = window.location.href
        }
        ajax('fetchWeChatAuthUrl', {
            redirecturl: url,
            scope: 'snsapi_userinfo'
        }).then((data: any) => {
            resolve(data.singleData.oauthUrl)
        })
    })
};

/**
 * 获取用户信息
 * @param code 微信授权码
 * @param state 额外参数
 */
export const fetchWeChatUserInfo = (code: string, state: string | null) => {
    return new Promise((resolve, reject) => {
        if (env !== 'wechat') return console.error('请在微信环境调用');
        ajax(`fetchWeChatUserInfo`, {
            code: code,
            state: state
        }).then((data: any) => {
            resolve(data.singleData)
        })
    })
};

/**
 * 检查用户是否关注订阅号
 * @token 令牌
 * @checkFlag 检查状态
 */
export const checkWechatUserAttention = (token: string, checkFlag = 0) => {
    return new Promise((resolve, reject) => {
        if (env !== 'wechat') return console.error('请在微信环境调用');
        ajax(`checkSubscribe`, {
            wxauthenticition: token,
            checkFlag: checkFlag
        }).then((data: any) => {
            resolve(data.singleData.subscribe)
        })
    })
};


/**
 * 微信授权码登录
 * @param toLogin
 */
export const wechatLogin = (toLogin = false) => {
    let code = _.fn.getUrlParam('code');
    let state = _.fn.getUrlParam('state');
    return new Promise((resolve, reject) => {
        if (env !== 'wechat') return console.error('请在微信环境调用');
        if (!code) return;
        ajax('wechatLogin', {
            code: code,
            state: state,
            key1: 'orange',
            key2: 'FE01D67A002DFA0F3AC084298142ECCD'
        }).then((data: any) => {
            let respond = data.singleData;
            if (data.code === '0000') {
                installLoginInfo(respond);
                window.userinfo.wxUserInfo = respond.wxUserInfo;
                resolve(window.userinfo);
            } else if (data.code === '9998' || data.code === '9997') { //  微信账户未绑定
                // 未绑定返回null
                resolve(null);
                if (!toLogin) return;
                location.replace(wechatBindUrl);
            } else {
                window.component && window.component.$alert.show(data.message);
                reject();
            }
        })
    })
};

/**
 * 微信分享
 * @param config
 * @param callbacks
 */
export const wechatShareInit = (config: iShareConfig, callbacks?: iShareCallback) => {
    if (env !== 'wechat') return console.error('请在微信环境调用');
    _.fn.appendScript('//s.thsi.cn/js/m/common/zepto.js', () => {
        wechatShare.init(config, callbacks)
    });
};


/**
 * 获取微信端用户登录信息
 */
export const getWechatUserInfo = () => {
    return new Promise(resolve => {
        if (env !== 'wechat') return console.error('请在微信环境调用');
        if (config.inTrade) {
            if (localStorage.getItem('key3') && localStorage.getItem('key4') && localStorage.getItem('key5')) {
                window.userinfo = {
                    custId: localStorage.getItem('custid'),
                    encryptionCustId: Number(localStorage.getItem('custid')) * 59 + 101,
                    investorName: localStorage.getItem('investorName'),
                    clientRiskRate: localStorage.getItem('clientRiskRate'),
                    clientRiskRateText: localStorage.getItem('clientRiskRateText')
                };
                resolve(window.userinfo)
            } else {
                resolve(null)
            }
        } else {
            crossStorage().then((operator: iCrossStorageReturn) => {
                operator.get(['key3', 'key4', 'key5', 'custid', 'investorName', 'clientRiskRate', 'clientRiskRateText']).then((data: any) => {
                    if (data.key3 && data.key4 && data.key5) {
                        window.userinfo = {
                            custId: data.custid,
                            encryptionCustId: Number(data.custid) * 59 + 101,
                            investorName: data['investorName'],
                            clientRiskRate: data['clientRiskRate'],
                            clientRiskRateText: data['clientRiskRateText']
                        };
                        resolve(window.userinfo)
                    } else {
                        resolve(null)
                    }
                })
            })
        }
    })
};

/**
 * 跳转到温馨登录
 * @param url
 */
export const toWechatLogin = (url = location.href) => {
    location.href = `https://trade.5ifund.com${config.testDev ? ':8443' : ''}/app/wechat/dist/login.html?url=${encodeURIComponent(url)}#/authLogin`
};