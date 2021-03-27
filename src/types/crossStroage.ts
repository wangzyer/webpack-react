/**
 * 跨域存储方法
 */
interface iCrossStorageReturn {
    get: (key: string | Array<string>) => Promise<iCrossStorageValue>
}

/**
 * 跨域存储Get方法返回值
 */
interface iCrossStorageValue {
    values: { [propsName: string]: string }
}


export {
    iCrossStorageReturn,
    iCrossStorageValue
}