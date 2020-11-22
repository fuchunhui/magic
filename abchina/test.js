// var cluster = require('cluster');

// if(cluster.isMaster) {
//   var numWorkers = require('os').cpus().length;
//   console.log('Master cluster setting up ' + numWorkers + ' workers...');

//   for(var i = 0; i < numWorkers; i++) {
//     cluster.fork();
//   }

//   cluster.on('online', function(worker) {
//     console.log('Worker ' + worker.process.pid + ' is online');
//   });

//   cluster.on('exit', function(worker, code, signal) {
//     console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
//     console.log('Starting a new worker');
//     cluster.fork();
//   });
// }

// async function doAnalyze(url, i) {
//   try {
//     const browser = await (puppeteer.launch({
//       timeout: 30000,
//       ignoreHTTPSErrors: true,
//       devtools: false,
//       headless: false
//     }));
//     const page = await browser.newPage();
//     await page.setViewport({width: 1920, height: 1080});
//     await page.goto(url);
//     await page.waitForTimeout(4000).then(() => console.log('Waited 4 second!'));
//     console.log(cluster.worker.id, url, i, '截图中...');
//     await page.screenshot({
//       path: `./img_cluster/${cluster.worker.id}-${i}.png`,
//       type: 'png',
//     });
//     browser.close();
//   } catch (error) {
//     console.log(cluster.worker.id, url, i)
//     console.log(error)
//   }
// };

const fs = require('fs');
const str = fs.readFileSync('./t.js', 'utf-8');
const list = str.split(',');
console.log('list: ', list);
