const puppeteer = require('puppeteer');
const cookies = require('./cookies');

const tarUrl = 'https://e.abchina.com/jcgys/supplier/supplier.html#/order/saleOrderManager?tab=1';
const testList = [
  "1000356428",
  "1000356442",
  "1000356445",
  "1000356449",
  "1000356453",
  "1000356469",
  "1000356487",
  "1000356488",
  "1000356491",
  "1000356485",
  "1000356499",
  "1000356674",
  "1000356675",
  "1000356676",
  "1000356677",
  "1000356709",
  "1000356712",
  "1000356713",
  "1000356714",
  "1000356717",
  "1000356718",
  "1000356719",
  "1000356720",
  "1000356721",
  "1000356722",
  "1000349051",
  "1000350960",
  "1000350942",
  "1000350966",
  "1000350934",
  "1000350937",
  "1000350971",
  "1000354107",
  "1000356619",
  "1000356598",
  "1000355414",
  "1000355416",
  "1000355415",
  "1000355417",
  "1000356188",
  "1000356206",
  "1000356170",
  "1000356385",
  "1000356410",
  "1000356382",
  "1000356378",
  "1000356571",
  "1000356556",
  "1000356482",
  "1000356484"
];
const totalList = [];

(async () => {
  console.log('start: ', totalList.length);
  const browser = await puppeteer.launch({
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
  const getInfo = async value => {
    await page.evaluate(value => {
      sessionStorage.setItem('OrderInfo', JSON.stringify({"OrderNo": value}));
    }, value);
  
    await page.goto(tarUrl);
    await page.waitForTimeout(3000).then(() => console.log('Waited 3 second!'));
  
    // target
    await page.evaluate(() => {
      const target = document.querySelectorAll('.group-box')[1]; 
      target.querySelector('.pull-right.m-t-sm').click();
    });
    // 点击 展开 检查结果
    return await page.evaluate(value => {
      const target = document.querySelectorAll('.group-con')[1];
      const ele = target.querySelector('tr.ng-scope');
      const result = ele.getAttribute('ng-if');
      let code = '';
      if (result === 'orderCheckList.length !== 0') { // 有结果, 存储，后续下载。
        code = ele.getElementsByClassName('txt-spill-no ng-binding')[0].textContent;
      }
      return Promise.resolve({
        id: value,
        code
      });
    }, value);
  }

  do {
    const value = testList.shift();
    let info = await getInfo(value);
    totalList.push(info);
  } while (testList.length > 0);

  console.log('totalList: ', totalList);
  await browser.close();
})();
