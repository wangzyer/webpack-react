window.addEventListener('load', () => {
    const timing = performance.timing;
    // DNS解析用时
    const dnsTime = timing.domainLookupEnd - timing.domainLookupStart;
    // TCP链接用时
    const tcpTime = timing.connectEnd - timing.connectStart;
    // TCP链接用时
   const ttfbTime = timing.responseStart - timing.navigationStart;
    // DOM解析用时
    const analysisTime = timing.domInteractive - timing.domLoading;
    // DOM渲染用时
    const drawTime = timing.domComplete - timing.domInteractive;
    // 文件加载用时
    const docTime = timing.responseEnd - timing.requestStart;
    // 白屏时间
    const blankTime = timing.domInteractive - timing.fetchStart;
    // 首屏时间
    const readyTime = timing.domContentLoadedEventEnd - timing.fetchStart;

    console.log('DNS解析用时：', dnsTime);
    console.log('TCP链接用时：', tcpTime);
    console.log('TTFB用时：', ttfbTime);
    console.log('DOM解析用时：', analysisTime);
    console.log('DOM渲染用时：', drawTime);
    console.log('文件加载用时：', docTime);
    console.log('白屏时间：', blankTime);
    console.log('首屏时间：', readyTime);
});