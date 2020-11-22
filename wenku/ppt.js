const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
const tarUrl = ''; // PPT

const getFile = (currentPage, realUrl) => axios({
  method: 'get',
  url: realUrl,
  responseType: 'stream'
}).then(res => {
  const name = currentPage < 10 ? `0${currentPage}` : currentPage;
  res.data.pipe(fs.createWriteStream(`${name}.png`));
});

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 250,
    defaultViewport: {
      width: 1920,
      height: 1080
    }
  });
  const page = await browser.newPage();
  await page.goto('https://www.baidu.com/');

  const cookies = [
    {
      'name': '',
      'value': ''
    },
    {
      'name': '',
      'value': ''
    }
  ];
  await page.setCookie(...cookies);
  await page.goto(tarUrl);
  await page.waitFor(2000);

  if (page.$('.fc2e')) {
    await page.click('.fc2e', {clickCount: 3});
  }

  console.log('start');

  const DELAY = 6000;
  const MAX_PAGE = 36;
  let currentPage = 1;
  do {
    let id = `#pageNo-${currentPage}`;

    await page.evaluate(id => {
      document.querySelector(id).scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'end'
      });
    }, id);

    await page.waitFor(DELAY);
  
    const imageUrl = await page.evaluate(id => {
      let item = document.querySelector(`${id} .reader-pptstyle`);
      return item.src;
    }, id);
    console.log(currentPage, imageUrl);

    getFile(currentPage, imageUrl);
    currentPage++;
  } while (MAX_PAGE >= currentPage);

  await browser.close();
})();
