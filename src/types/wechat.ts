interface iShareConfig {
    link: string, // 分享链接
    imgUrl?: string, // 分享icon
    title?: string, // 分享标题
    desc?: string //  分享描述
}

interface iShareCallback {
    trigger?: (e?: any) => void,
    success?: (e?: any) => void,
    cancel?: (e?: any) => void,
    fail?: (e?: any) => void
}

export {iShareCallback, iShareConfig}