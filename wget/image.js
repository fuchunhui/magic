var process = require('child_process');

// let a = document.getElementById('mp-editor')
// let b = a.getElementsByTagName('img')
// let d = [];
// for (let i = 0; i < b.length; i++) {
//   d.push(b[i].src)
// }
// copy(d)

const urlArr = [
  "https://5b0988e595225.cdn.sohucs.com/images/20180807/2f642c5b837746e09f1f2c05a93ecc41.jpeg",
  "https://5b0988e595225.cdn.sohucs.com/images/20180807/b324317177584a1195e8df9e9cef099d.jpeg",
  "https://5b0988e595225.cdn.sohucs.com/images/20180807/a8d3ec867df7413ca0d8b46ad928635a.jpeg",
  "https://5b0988e595225.cdn.sohucs.com/images/20180807/149384d39ada4d11b57fae356d8e5646.jpeg",
  "https://5b0988e595225.cdn.sohucs.com/images/20180807/e58cf16fadf04727b1dce0d19fd882f2.jpeg",
  "https://5b0988e595225.cdn.sohucs.com/images/20180807/c1c6903892734129a17d3db2b0618d02.jpeg",
  "https://5b0988e595225.cdn.sohucs.com/images/20180807/23e9c6809ed247d8ae1370072e81ceb7.jpeg",
  "https://5b0988e595225.cdn.sohucs.com/images/20180807/dc6532996129426a8a6f9c3d5aee35bd.jpeg",
  "https://5b0988e595225.cdn.sohucs.com/images/20180807/e2aafadb46504bbdb134e22df31ec88c.jpeg"
];

urlArr.forEach(item => {
  const cmd = `wget ${item}`;
  process.exec(cmd);
});
