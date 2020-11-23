const xlsx = require('node-xlsx');
const fs = require('fs');

const str = fs.readFileSync('t.js');
// const str = fs.readFileSync('target.js');

const list = JSON.parse(`[${str.slice(0, str.length - 1)}]`);
const TARGET_NAME = 'result.xlsx';

const rows = [];
list.sort((a, b) => a.id - b.id);
list.forEach(({id, code}) => {
    rows.push([id, code]);
});
const title = ['客户订单号', '验收情况'];
rows.unshift(title);

console.log(rows);
const srouce = [
    {
        name : 'sheet1',
        data : rows
    }
];

const buffer = xlsx.build(srouce);
fs.writeFile(TARGET_NAME, buffer, function (err) {
    if (err) {
        throw err;
    }
    console.log('Write to xlsx has finished.');
});
