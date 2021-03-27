import {getWechatUserInfo, toWechatLogin} from "@/scripts/wechat";
import {getCurrentEnv} from "@/scripts/fn.business";

/**
 * 登录判断
 * @param fn1
 * @param fn2
 */
let isLogin = (fn1: () => void, fn2?: () => void) => {
    let env = getCurrentEnv();
    if (window.location.hostname === 'localhost') {
        return _localLogin(fn1, fn2)
    }
    if (env === 'ths') {
        isLogin = _thsLogin;
    } else if (env === 'ijijin') {
        isLogin = _ijijinLogin;
    } else {
        isLogin = _wechatLogin;
    }
    isLogin(fn1, fn2)
};

/**
 * 本地登录
 * @param fn1
 * @param fn2
 * @private
 */
function _localLogin(fn1, fn2) {
    // 模拟手炒环境
    _.urlInfo.sys = 'ths';
    window.getUserid = function () {
        return '602563878'
    };
    // 模拟基金环境
    // _.urlInfo.sys = 'ijijin';
    let custId = 100000000002;
    window.userinfo = {
        custId: custId,
        encryptionCustId: custId * 59 + 101
    };
    return fn1 && fn1()
}


/**
 * 同花顺登录判断
 * @param fn1
 * @param fn2
 * @private
 */
function _thsLogin(fn1, fn2) {
    if (getAccount() === 0) {
        if (fn2 && fn2() === false) {
            return;
        }
        let timer = setInterval(function () {
            //手炒登录以后刷新页面
            if (getAccount() !== 0) {
                clearInterval(timer);
                window.location.reload();
            }
        }, 500);
        window.location.href = "http://eqhexin/changeUser";
    } else {
        fn1 && fn1();
    }
}

/**
 * 爱基金登录判断
 * @param fn1
 * @param fn2
 * @private
 */
function _ijijinLogin(fn1, fn2) {
    if (fn2) {
        _.getUserinfo(() => {
            fn1 && fn1();
        }, () => {
            fn2();
        });
    } else {
        _.getUserinfo(() => {
            fn1 && fn1();
        });
    }
}

/**
 * 微信登陆判断
 * @private
 */
function _wechatLogin(fn1, fn2) {
    getWechatUserInfo().then(data => {
        if (data) {
            fn1 && fn1()
        } else {
            fn2 ? fn2() : toWechatLogin();
        }
    })
}


/**
 * 跳转同花顺绑定
 * @param url 绑定成功后回跳链接
 */
function toBind(url = location.href) {
    // 2020/12/08 陈旭结束abtest 全部跳转新开户页面
    // let second = new Date().getSeconds();
    // // 奇数秒进来活动页面的用户跳转老版网页开户流程
    // // 偶数秒进来活动页面的用户跳转新版网页开户流程
    // if (second % 2) {
        window.location.href = `https://${_.urlInfo.test ? `testm.10jqka.com.cn/eq` : `eq.10jqka.com.cn`}/iFundOpenAccount/index.html#/?redir=${encodeURIComponent(url)}&source=1`
    // } else {
    //     let setCookie = (name: string, value: string, expires: any, path: string, domain: string, secure?: string): void | boolean => {
    //         if (!name) {
    //             return false;
    //         }
    //         expires = expires ? '; expires=' + new Date(expires * 10000).toUTCString() : "";
    //         document.cookie = name + "=" + escape(value) + expires + (path ? "; path=" + path : "") + (domain ? "; domain=" + domain : "") + (secure ? "; secure" : "");
    //     };
    //     let bindUrl: string = '';
    //     if (_.urlInfo.test) {
    //         // 测试环境
    //         bindUrl = "//testm.10jqka.com.cn/tg_templates/doubleone/2018/fundBind/index.html";
    //     } else {
    //         bindUrl = "//ozone.10jqka.com.cn/tg_templates/doubleone/2018/fundBind/index.html"
    //     }
    //     // 存标识
    //     setCookie("pushbackUrl", url, 1576800000, '/', '10jqka.com.cn');
    //     setCookie("from", "push", 1576800000, '/', '10jqka.com.cn');
    //     // 跳转到绑定页
    //     window.location.href = bindUrl;
    // }

}


/**
 * 客户端获取用户token
 * @param cb
 * @param prefix
 */
const tokenInit = (cb, prefix: string = 'default_') => {
    if (!cb) throw new Error('Error! No trade init callback.');

    function _showKeyValuesResult(info) {
        if (!info) alert('token error.');
        info = JSON.parse(info);

        if (!info.key1) {
            alert('客户端token获取失败');
            return false;
        }

        for (let i in info) {
            if (~i.indexOf('key')) {
                window[i] = info[i];
                localStorage.setItem(prefix + i, info[i]);
            }
        }
        cb();
    }

    // 安卓客户端直接调用该方法
    window.showKeyValuesResult = _showKeyValuesResult;

    // token
    const KeyValueEncrypt = {
        KeyValueTransmit: function () {
            callNativeHandler(
                'KeyValueTransmit',
                '',
                function (data) {
                    _showKeyValuesResult(data);
                }
            );
        },
        encryptTransmit: function () {
            callNativeHandler(
                'KeyValueTransmit',
                '',
                function () {
                }
            );
        }
    };

    isLogin(() => {
        // for test
        if (window.location.hostname === 'localhost') {
            _showKeyValuesResult(`
                {
                    "key1":"WnJ6TnySlXm1Jv/pqGPdHYdpymJi/g1xCUdOB5zTchnBpbDymOS9iK/uNMsfNHthF/BFlAiJ14UR9u5qDcUmcxt6J/yKQOJL6TU9ftg1b3v7J3RNnIrs5wICsTB3KcjrRTlxXPBc5HiskJBsDE4+1kl2DLyfRta7lI5xhRLaAr0=",
                    "key2":"JdYSUdFncT8uWygkrhKQ7NVvKINZarjF6Euepi7rXbWMRKZYvQYgAEiiIgZub0I6ToBTzQUWh+yqaIhu6nDskM2Ui+lcd/YJGLHpZkQ2YeSESZDQSEmw47YnNaIOoNcrW0/trGDJX4pTjq1fjF7+op2WUZPg90hIxxcKQfNqDHU=",
                    "key3":"P7tjY+LDsQVwbDGPpQ1JoVVKv7ZE9iyo/J6nH+uc0taFTjPKgmxR7Y+rFdh/neArkJQBjnkN+87ai4DFDz0vwQrIAEVJeVaB/0e5xJun9xD44JnU9wCLuQV8jsLGAeqspzV9MpdJHtkaNI8ZcJQJnxfsUnQVjsrwvZn8LN5OV2Y=",
                    "key4":"JBOZE0kzGJrZxE2JcdzxXrCtG6ZnS7p99bUTooHNDyUwXbkiwc4x5m0ZeUd/opDIZ7voZTDs3fv7Z5fLsOmIYGN7UCRusmNHyZMGhtMaZ/vcn+ZbHW6YumEWJ1UEaHmF768+2k6igIGEG+jQ0Wus+NB1hMtXdW1dGFxrjfbDRm0=",
                    "key5":"fg9OLR+2JnFfth4Yrz0Ojadp6cUPCoBaxjuJTaM/vtnHIOap3kwLTsJcQiwX2j5+DW/3I3rTkqlmVl1J60kv39x0eiNOWxtoFRjRICA8y53UfM3y8+Wut0FSKm3zDFnx5VhLZxrBqbQPMY7aTmCAJTrihrodL8PpELN5axCGD5I="
                }`);
            return false;
        }

        if (_.platform.osInfo === 'iphone') KeyValueEncrypt.KeyValueTransmit();
        else KeyValueEncrypt.encryptTransmit();
    });
};

export {isLogin, toBind, tokenInit}
