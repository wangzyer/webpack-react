const puppeteer = require('puppeteer');

// 测试页面 默认为:http://testfund.10jqka.com.cn/scym_scsy/public/作者/项目名/dist/index.html
const enter = `---enter---`; // 占位

(async () => {
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            headless: true,
            defaultViewport: {width: 375, height: 700}
        });

        const page = await browser.newPage();

        await page.goto(enter, {waitUntil: 'networkidle0'});

        await page.screenshot({path: `---assetPath---/enter.png`});

        await browser.close();

        // 占位、勿删
        //---callback---//
})();
