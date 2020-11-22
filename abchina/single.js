const puppeteer = require('puppeteer');
const cookies = require('./cookies');

const tarUrl = 'https://e.abchina.com/jcgys/supplier/supplier.html#/order/saleOrderManager?tab=1';

module.exports = async (value, index, workerId) => {
  try {
    const browser = await puppeteer.launch({
      timeout: 30000,
      ignoreHTTPSErrors: true,
      headless: false,
      slowMo: 250,
      devtools: false,
      defaultViewport: {
        width: 1920,
        height: 1080
      }
    });
    const page = await browser.newPage();
    await page.goto('https://e.abchina.com/');
    await page.setCookie(...cookies);

    // 设置sessionStorage
    await page.evaluate(value => {
      sessionStorage.setItem('OrderInfo', JSON.stringify({"OrderNo": value}));
    }, value);

    await page.goto(tarUrl);
    console.log(workerId, value, index, '查询中...');
    await page.waitForTimeout(3500).then(() => console.log('Waited 4 second!'));

    // target
    await page.evaluate(() => {
      const target = document.querySelectorAll('.group-box')[1]; 
      target.querySelector('.pull-right.m-t-sm').click();
    });
    // 点击 展开 检查结果
    await page.waitForTimeout(1500).then(() => console.log('Waited 1.5 second!'));
    const info = await page.evaluate(value => {
      const target = document.querySelectorAll('.group-con')[1];
      const nodeList = target.querySelectorAll('tr.ng-scope');
      let code = [];
      nodeList.forEach(ele => {
        const result = ele.getAttribute('ng-if');
        if (result === 'orderCheckList.length !== 0') { // 有结果, 存储，后续下载。
          code.push(ele.getElementsByClassName('txt-spill-no ng-binding')[1].textContent);
        }
      });
      return Promise.resolve({
        id: value,
        code: code.join(',')
      });
    }, value);

    console.log('--------------------->', workerId, {...info});
    await browser.close();
  } catch (error) {
    console.log(workerId, value, index);
    console.log(error);
  }
};
