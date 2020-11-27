var process = require('child_process');

// const b = [];
// const c = [];
// b.forEach(item => {
//   c.push(item.getAttribute('src'));
// })
// copy(c)

const urlArr = [
  "http://img.jj20.com/up/allimg/tx20/32041101395241.jpg",
  "http://img.jj20.com/up/allimg/tx20/32041101395242.jpg",
  "http://img.jj20.com/up/allimg/tx20/32041101395243.jpg",
  "http://img.jj20.com/up/allimg/tx20/32041101405244.jpg",
  "http://img.jj20.com/up/allimg/tx20/32041101405245.jpg",
  "http://img.jj20.com/up/allimg/tx20/32041101405246.jpg",
  "http://img.jj20.com/up/allimg/tx20/32041101405247.jpg",
  "http://img.jj20.com/up/allimg/tx20/32041101405248.jpg"
];

urlArr.forEach(item => {
  const cmd = `wget ${item}`;
  process.exec(cmd);
});
