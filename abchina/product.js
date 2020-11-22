const puppeteer = require('puppeteer');
const cookies = require('./cookies');
const {appendFile, removeFile} = require('./file');

const targetUrl = 'https://e.abchina.com/jcgys/supplier/supplier.html#/order/saleOrderManager';

(async () => {
  const browser = await puppeteer.launch({
    timeout: 30000,
    ignoreHTTPSErrors: true,
    headless: false,
    slowMo: 250,
    devtools: false,
    defaultViewport: {
      width: 1920,
      height: 1480
    }
  });
  const page = await browser.newPage();
  await page.goto('https://e.abchina.com/');

  await page.setCookie(...cookies);
  await page.goto(targetUrl);
  await page.waitForTimeout(1000 * 20).then(() => console.log('Waited 20 second!'));

  // 切换到每页50个
  await page.evaluate(() => {
    const target = document.querySelectorAll('.form-control.input-sm.ng-pristine.ng-valid')[0];
    target.selectedIndex = 4;
    target.dispatchEvent(new Event('change'));
  });
  await page.waitForTimeout(3000).then(() => console.log('Waited 3 second, update pages to 50'));

  const MAX_PAGE = 121;
  let currentPage = 1;
  do {
    console.log('currentPage: ', currentPage);

    const list = await page.evaluate(() => {
      const table = document.getElementsByClassName('table table-fixed table-hover')[0];
      const trList = table.querySelectorAll('tr.ng-scope');
      const list = [];

      trList.forEach(item => {
        let text = item.querySelectorAll('.txt-spill-no.ng-binding')[0].textContent;
        list.push(text);
      });

      return Promise.resolve(list);
    });

    if (currentPage === 1) {
      removeFile();
    } else {
      appendFile(',');
    }
    appendFile(list);

    const TEMP_FILE = 'temp.js'; // 备份，便于错误中断，可以继续操作
    appendFile(`\n---------------------------${currentPage}\n`, TEMP_FILE);
    appendFile(list, TEMP_FILE);

    await page.evaluate(() => {
      const nodeList = document.querySelectorAll('ul.pagination-sm.pull-right li.ng-scope a.ng-binding');
      const target = nodeList[nodeList.length - 1];
      target.click();
    });

    await page.waitForTimeout(3000).then(() => console.log('Waited 3 second, update pages to next 50'));

    currentPage++;
  } while (MAX_PAGE >= currentPage);

  await browser.close();
})();
