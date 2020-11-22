// 只打关闭浏览器一次，重复使用当前tab。

const puppeteer = require('puppeteer');
const cookies = require('./cookies');
const {appendFile, removeFile} = require('./file');

const tarUrl = 'https://e.abchina.com/jcgys/supplier/supplier.html#/order/saleOrderManager?tab=1';
const publicPath = 'optimize';

const updateFile = (path, data) => {
  appendFile(data + ',', path);
};

const getPath = workerId => {
  const workerPath = `./${publicPath}/${workerId}.js`;
  const errorPath = `./${publicPath}/${workerId}-error.js`;
  return {
    workerPath,
    errorPath
  };
};

const removeLocalFiles = workerId => {
  const {workerPath, errorPath} = getPath(workerId);
  removeFile(workerPath);
  removeFile(errorPath);
};

module.exports = async (tasks, workerId) => {
  removeLocalFiles(workerId);

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

    await tasks.reduce((sequence, item, index) => {
      return sequence.then(() => {
        return analyze(item, index, workerId, page);
      });
    }, Promise.resolve());
    
    await browser.close();
  } catch (error) {
    console.log(workerId, error);
  }
};

async function analyze(value, index, workerId, page) {
  const {workerPath, errorPath} = getPath(workerId);
  try {
    // 设置sessionStorage
    await page.evaluate(value => {
      sessionStorage.setItem('OrderInfo', JSON.stringify({"OrderNo": value}));
    }, value);

    await page.goto(tarUrl);
    console.log(workerId, value, index, '查询中...');
    await page.waitForTimeout(20000).then(() => console.log('Waited 10 second!'));

    // target
    await page.evaluate(() => {
      const target = document.querySelectorAll('.group-box')[1]; 
      target.querySelector('.pull-right.m-t-sm').click();
    });
    // 点击 展开 检查结果
    await page.waitForTimeout(3000).then(() => console.log('Waited 1 second!'));
    const info = await page.evaluate(value => {
      const target = document.querySelectorAll('.group-con')[1];
      const nodeList = target.querySelectorAll('tr.ng-scope');
      let code = [];
      nodeList.forEach(ele => {
        const result = ele.getAttribute('ng-if');
        if (result === 'orderCheckList.length !== 0') { // 有结果, 存储，后续下载。
          code.push(ele.getElementsByClassName('txt-spill-no ng-binding')[1].textContent);
          // TODO 另起线程，下载。读取body，获取元素，点击下载。
        }
      });
      return Promise.resolve({
        id: value,
        code: code.join(',')
      });
    }, value);
    
    console.log('--------------------->', workerId, {...info});
    updateFile(workerPath, JSON.stringify(info), index);

    return info;
  } catch (error) {
    console.log(workerId, value, index);
    updateFile(errorPath, value, index);

    console.log(error);
  }
};
