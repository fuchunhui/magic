const fs = require('fs');
const axios = require('axios');

const SAVE_NAME = 'product-list.js';

const appendFile = (data, path = SAVE_NAME) => {
  try {
    fs.appendFileSync(path, data);
  } catch (err) {
    console.log('写入error: ', err);
  }
};

const removeFile = (path = SAVE_NAME) => {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
};

const getFile = (path = SAVE_NAME) => {
  const content = fs.readFileSync(path, 'utf-8');
  const list = content.split(',');
  return list;
};

// const getFileStream = (currentPage, realUrl) => axios({
//   method: 'get',
//   url: realUrl,
//   responseType: 'stream'
// }).then(res => {
//   const name = currentPage < 10 ? `0${currentPage}` : currentPage;
//   res.data.pipe(fs.createWriteStream(`${name}.png`));
// });

module.exports = {
    appendFile,
    removeFile,
    getFile
};
