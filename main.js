const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');

const tarUrl = ''; // PDF

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
    // devtools: true,
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

  await page.click('.read-all', {clickCount: 3});
  await page.waitFor(200);
  
  console.log('start');

  const DELAY = 10000;
  const MAX_PAGE = 100;
  let currentPage = 1;
  do {
    // if (currentPage % 50 === 0) {
    //   await page.click('.read-all', {clickCount: 3});
    // }
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
      let item = document.querySelector(`${id} .reader-pic-item`);
      return item.style.backgroundImage
    }, id);
    const realUrl = imageUrl.replace(/url\("(.*)"\)/, '$1');
    console.log(currentPage, realUrl);

    getFile(currentPage, realUrl);
    currentPage++;
  } while (MAX_PAGE >= currentPage);

  await browser.close();
})();
