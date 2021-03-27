import Config from "@/scripts/config";
const frameId = 'tradeFrame';
const safeOrigin = ['https://trade.5ifund.com:8443', 'https://trade.5ifund.com'];
const frameUrl = `https://trade.5ifund.com${Config.testDev ? ':8443' : ''}/tohangqing/public/wzy/crossStorage/dist/index.html`;

const _cbs = []; // 回调函数列表
let _cid = 0;// 回调函数id

let first = false; // 是否第一次创建

let _frame: any = null;
let _frameContent: any = null;

window.addEventListener('message', (event) => {
    if (~safeOrigin.indexOf(event.origin)) {
        event?.data?.cid && _cbs[event.data.cid](event.data.values);
    }
});


const operators = {
    get: (key: string | Array<string>) => {
        return new Promise((resolve) => {
            _cbs[++_cid] = resolve;
            _frameContent.postMessage({key, cid: _cid}, Config.testDev ? safeOrigin[0] : safeOrigin[1])
        })
    }
};

export default function () {

    if (!_frame && !_frameContent) {
        first = true;
        _frame = createFrame(frameUrl, frameId);
        _frameContent = _frame.contentWindow;
    }

    return new Promise((resolve) => {
        if (first) {
            _frame.onload = function () {
                resolve(operators);
            };
        } else {
            resolve(operators);
        }

    })
}

function createFrame(url: string, id?: string) {
    let frame;
    frame = window.document.createElement('iframe');
    frame.style['display'] = 'none';
    id && (frame.id = id);
    window.document.body.appendChild(frame);
    frame.src = url;
    return frame;
}