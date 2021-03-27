import Config from './config';
import ajax from './http'

/**
 * 获取用户自选列表
 */
export const getOptional = () => {
    return new Promise((resolve, reject) => {
        if (Config.localDev) {
            resolve(["540009", "210008"]);
        } else {
            _.ijijinVerControl('5.77.01', () => {
                reject();
            }, () => {
                callNativeHandler("getAllMyFund", {}, (data) => {
                    if (typeof data === "string") data = JSON.parse(data);
                    let result: Array<any> = [];
                    if (data[0]){
                        result = result.concat(data[0]);
                    }
                    if (data[1]){
                        result = result.concat(data[1]);
                    }
                    resolve(result);
                });
            });
        }
    });
};

/**
 * 添加自选
 * @param code 基金代码
 * @param name 基金名
 * @param type 基金类型 1-货币 0-普通
 */
export const addOptional = (code: string, name: string, type: number) => {
    return new Promise((resolve, reject) => {
        if (Config.localDev) {
            resolve();
        } else {
            _.ijijinVerControl('5.77.01', () => {
                _.jump().outpage(Config.download['ijijin']);
                reject();
            }, () => {
                callNativeHandler("addMyFund", {code: code, name: name, type: type}, (data) => {
                    if (data === "YES") {
                        resolve();
                    } else {
                        reject();
                    }
                });
            });
        }
    });
};

/**
 * 删除自选
 * @param code 基金代码
 */
export const deleteOptional = (code: string) => {
    return new Promise((resolve, reject) => {
        if (Config.localDev) {
            resolve();
        } else {
            _.ijijinVerControl('5.77.01', () => {
                _.jump().outpage(Config.download['ijijin']);
                reject();
            }, () => {
                callNativeHandler("deleteMyFund", {code: code}, (data) => {
                    if (data === "YES") {
                        resolve();
                    } else {
                        reject();
                    }
                });
            });
        }
    });
};

/**
 * 跳转至股票页面
 * @param code 股票代码
 */
export const toStockInfo = (code: string) => {
    return new Promise((resolve, reject) => {
        if (_.urlInfo.sys === 'ijijin') {
            if (_.platform.osInfo === 'iphone') {
                callNativeHandler('canOpenApp', {
                    appName: ['AMIHexin', 'AMIHexinpro'],
                    url: `command=gotoHQ&action=GGFS&stockcode=${code}&appName=爱基金&version=1`
                }, function (data) {
                    // 如果没有手抄APP 返回 false(boolean)
                    resolve(data);
                });
            } else {
                window.location.href = `client.html?action=gotoStockIndex,stockCode=${code}`;
            }
        } else {
            window.location.href = `client.html?action=ymtz^stockcode=${code}^webid=2205`; //;
        }
    });
};

/**
 * 获取倒计时时间
 * @param endTime 截止时间
 * @param startTime 开始时间
 * @returns [day,hour,minute,second]
 */
export const getCountDown = (endTime: string | Date, startTime: string | Date = new Date()) => {
    let endDate = endTime instanceof Date ? endTime : new Date(endTime);
    let startDate = startTime instanceof Date ? startTime : new Date(startTime);
    let t = endDate.getTime() - startDate.getTime();
    let day = 0, hour = 0, minute = 0, second = 0;
    if (t >= 0) {
        day = Math.floor(t / 1000 / 3600 / 24);
        hour = Math.floor(t / 1000 / 60 / 60 % 24);
        minute = Math.floor(t / 1000 / 60 % 60);
        second = Math.floor(t / 1000 % 60);
    }
    return [day, hour, minute, second];
};

/**
 * 写入粘贴板
 * @param data 要复制的值
 * @param successCallback 成功回调
 * @param errorCallback 失败回调
 */
export const clipboard = (data: string, successCallback: () => void, errorCallback: () => void) => {
    try {
        let input = document.createElement('input');
        input.value = data;
        input.setAttribute('readonly', 'readonly');
        let dialog = document.createElement('div');
        dialog.style.position = 'fixed';
        dialog.style.top = '0';
        dialog.style.left = '0';
        dialog.style.bottom = '0';
        dialog.style.right = '0';
        document.body.appendChild(dialog);
        dialog.appendChild(input);
        input.focus();
        input.setSelectionRange(0, input.value.length);
        let copyResult = document.execCommand('copy');
        if (copyResult) {
            successCallback && successCallback()
        } else {
            errorCallback && errorCallback()
        }
        document.body.removeChild(dialog);
    } catch (e) {
        console.error('copy to clipboard fail' + e)
    }
};

/**
 * 改变标题栏颜色
 * @param color 16进制颜色
 *
 */
export const changeTitleBar = (color: string) => {
    // 标题栏颜色
    if (_.urlInfo.sys === 'ths') {
        callNativeHandler("changeWebViewTitleColor", {
            "data": {
                "status": "change",
                "color": color
            }
        }, function () {

        });
    }
};

/**
 * 跳转至下载页
 */
export const toDownLoadApp = () => {
    location.href = Config.download[_.urlInfo.sys];
};


/**
 * 获取收益走势图链接
 * @param code 基金代码
 * @param time 时间
 */
export const getFundImg = (code: string, time = 'year') => {
    return `https://${Config.testDev ? 'test' : ''}fund.10jqka.com.cn/fundminicon/${Config.testDev ? 'dist/' : ''}${code}_${time}.jpg`
};

/**
 * 根据服务器字段自动转化为文字
 * @param value
 */
export const profitTimeToText = (value: string) => {
    switch (value) {
        case 'rate':
            return '昨日';
        case 'nowyear':
            return '今年以来';
        case 'week':
            return '近一周';
        case 'month':
            return '近一月';
        case 'tmonth':
            return '近三月';
        case 'hyear':
            return '近半年';
        case 'year':
            return '近一年';
        case 'twoyear':
            return '近两年';
        case 'tyear':
            return '近三年';
        case 'fyear':
            return '近五年';
    }
};


/**
 * 获取当前所在环境
 */
export const getCurrentEnv = (): string => {
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

/**
 * 数据装填用户信息
 * @param data
 */
export const fillUserAccount = (data: any = {}): any => {
    let sendData = Object.assign({}, data);
    if (_.urlInfo.sys === 'ijijin') {
        sendData.custId = window.userinfo && window.userinfo.custId
    } else {
        sendData.thsId = getUserid() || ''
    }
    return sendData
};


/**
 * 获取账户数据
 */
export const getThsOrJijinUserId = () => {
    if (_.urlInfo.sys === 'ijijin') {
        return window.userinfo && window.userinfo.custId
    } else {
        return getUserid() || ''
    }
};

/**
 * 获取红包信息
 */
export function fetchPacketInfo(couponId) {
    return new Promise(resolve => {
        ajax('queryCoupon', {ids: couponId}).then((data: any) => {
            const couponInfo = data.data[0];
            resolve(couponInfo)
        })
    })
}