function loadScript(a, b) {
    var c = document.createElement("script");
    c.type = "text/javascript",
        c.readyState ? c.onreadystatechange = function () {
                "loaded" != c.readyState && "complete" != c.readyState || (c.onreadystatechange = null,
                    b())
            }
            : c.onload = function () {
                b()
            }
        ,
        c.src = a,
        document.getElementsByTagName("head")[0].appendChild(c)
}

function getTimeStamp() {
    return Date.prototype.Format = function (a) {
        var b = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            S: this.getMilliseconds()
        };
        /(y+)/.test(a) && (a = a.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length)));
        for (var c in b)
            new RegExp("(" + c + ")").test(a) && (a = a.replace(RegExp.$1, 1 == RegExp.$1.length ? b[c] : ("00" + b[c]).substr(("" + b[c]).length)));
        return a
    }
        ,
        (new Date).Format("yyyyMMddhh")
}

let _url = location.hostname === 'trade.5ifund.com' ? `https://trade.5ifund.com${location.port ? `:${location.port}` : ''}/rs/wxapi/oauth/jsapi/createsignature/default` : `https://${_.urlInfo.test ? 'test' : ''}fund.10jqka.com.cn/hqapi/totrade/wxapi/oauth/jsapi/createsignature/default`;
var wxShare = {}
wxShare.init = function (a, b) {
    wxShare.ShareData.desc = wxShare.getDes(),
        wxShare.ShareData = $.extend(wxShare.ShareData, a),
        wxShare.callback = $.extend(wxShare.callback, b),
        wxShare.setMeta();
    var c = getTimeStamp();
    loadScript("//res2.wx.qq.com/open/js/jweixin-1.6.0.js", function () {
        loadScript("//s.thsi.cn/js/chameleon/chameleon.min." + c + ".js", function () {
            $.ajax({
                type: "POST",
                url: _url,
                data: {
                    url: window.location.href.split("#")[0]
                },
                dataType: "json",
                jsonp: "callback",
                success: function (a) {
                    a.code === '0000' && (wx.config({
                        debug: false,
                        appId: a.singleData.jsapiSignature.signature.appId,
                        timestamp: a.singleData.jsapiSignature.signature.timestamp,
                        nonceStr: a.singleData.jsapiSignature.signature.nonceStr,
                        signature: a.singleData.jsapiSignature.signature.signature,
                        jsApiList: ["checkJsApi", "onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "onMenuShareQZone"]
                    }),
                        wx.ready(function () {
                            wx.checkJsApi({
                                jsApiList: ["checkJsApi", "onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "onMenuShareQZone"],
                                success: function (a) {
                                    // console.log(JSON.stringify(a))
                                }
                            });
                            var a = {
                                title: wxShare.ShareData.title,
                                link: wxShare.ShareData.link,
                                imgUrl: wxShare.ShareData.imgUrl,
                                desc: wxShare.ShareData.desc
                            };
                            wx.onMenuShareAppMessage($.extend({
                                trigger: function () {
                                    "function" == typeof wxShare.callback.trigger && wxShare.callback.trigger({
                                        type: "wxhy"
                                    })
                                },
                                success: function () {
                                    "function" == typeof wxShare.callback.success && wxShare.callback.success({
                                        type: "wxhy"
                                    })
                                },
                                cancel: function () {
                                    "function" == typeof wxShare.callback.cancel && wxShare.callback.cancel({
                                        type: "wxhy"
                                    })
                                },
                                fail: function () {
                                    "function" == typeof wxShare.callback.fail && wxShare.callback.fail({
                                        type: "wxhy"
                                    })
                                }
                            }, a)),
                                wx.onMenuShareTimeline($.extend({
                                    trigger: function () {
                                        "function" == typeof wxShare.callback.trigger && wxShare.callback.trigger({
                                            type: "wxpyq"
                                        })
                                    },
                                    success: function () {
                                        "function" == typeof wxShare.callback.success && wxShare.callback.success({
                                            type: "wxpyq"
                                        })
                                    },
                                    cancel: function () {
                                        "function" == typeof wxShare.callback.cancel && wxShare.callback.cancel({
                                            type: "wxpyq"
                                        })
                                    },
                                    fail: function () {
                                        "function" == typeof wxShare.callback.fail && wxShare.callback.fail({
                                            type: "wxpyq"
                                        })
                                    }
                                }, a)),
                                wx.onMenuShareQQ($.extend({
                                    trigger: function () {
                                        "function" == typeof wxShare.callback.trigger && wxShare.callback.trigger({
                                            type: "qq"
                                        })
                                    },
                                    success: function () {
                                        "function" == typeof wxShare.callback.success && wxShare.callback.success({
                                            type: "qq"
                                        })
                                    },
                                    cancel: function () {
                                        "function" == typeof wxShare.callback.cancel && wxShare.callback.cancel({
                                            type: "qq"
                                        })
                                    },
                                    fail: function () {
                                        "function" == typeof wxShare.callback.fail && wxShare.callback.fail({
                                            type: "qq"
                                        })
                                    }
                                }, a)),
                                wx.onMenuShareQZone($.extend({
                                    trigger: function () {
                                        "function" == typeof wxShare.callback.trigger && wxShare.callback.trigger({
                                            type: "qqkj"
                                        })
                                    },
                                    success: function () {
                                        "function" == typeof wxShare.callback.success && wxShare.callback.success({
                                            type: "qqkj"
                                        })
                                    },
                                    cancel: function () {
                                        "function" == typeof wxShare.callback.cancel && wxShare.callback.cancel({
                                            type: "qqkj"
                                        })
                                    },
                                    fail: function () {
                                        "function" == typeof wxShare.callback.fail && wxShare.callback.fail({
                                            type: "qqkj"
                                        })
                                    }
                                }, a)),
                                wx.onMenuShareWeibo($.extend({
                                    trigger: function () {
                                        "function" == typeof wxShare.callback.trigger && wxShare.callback.trigger({
                                            type: "wbsina"
                                        })
                                    },
                                    success: function () {
                                        "function" == typeof wxShare.callback.success && wxShare.callback.success({
                                            type: "wbsina"
                                        })
                                    },
                                    cancel: function () {
                                        "function" == typeof wxShare.callback.cancel && wxShare.callback.cancel({
                                            type: "wbsina"
                                        })
                                    },
                                    fail: function () {
                                        "function" == typeof wxShare.callback.fail && wxShare.callback.fail({
                                            type: "wbsina"
                                        })
                                    }
                                }, a))
                        }),
                        wx.error(function (a) {
                        }))
                    // console.log(wx.config)
                },
                error: function (a) {
                }
            })
        })
    })
}
    ,
    wxShare.getDes = function () {
        var a = "";
        try {
            a = $("body").text().replace(/\s/g, "").slice(0, 30)
        } catch (a) {
        }
        return a
    }
    ,
    wxShare.setMeta = function () {
        var a = "";
        for (var b in wxShare.ShareData) {
            var c = wxShare.ShareData[b];
            if (c)
                switch (b) {
                    case "imgUrl":
                        var d = c.split("//")
                            , e = d[0].trim().length;
                        0 == e ? c = "http:" + c : 6 == e && (c = "http://" + d[1]),
                            a += '<meta itemprop="image" content="' + c + '">';
                        break;
                    case "title":
                        a += '<meta name="name" itemprop="name" content="' + c + '">';
                        break;
                    case "desc":
                        a += '<meta name="description" content="' + c + '">'
                }
        }
        $("head").prepend(a)
    }
    ,
    wxShare.ShareData = {
        link: window.location.href,
        imgUrl: "http://s.thsi.cn/css/m/zixun/images/thslogo.png",
        title: document.title,
        desc: ""
    },
    wxShare.callback = {
        trigger: function (a) {
            console.log(a.type)
        },
        success: function (a) {
            console.log(a.type)
        },
        cancel: function (a) {
            console.log(a.type)
        },
        fail: function (a) {
            console.log(a.type)
        }
    };
export default wxShare;