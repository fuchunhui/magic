const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const {getFile} = require('./file');

// 处理的任务列表
const list = getFile();
// const list = getFile('./t.js'); // test
console.log('总任务数：', list.length);

module.exports = async () => {
  const startTime = new Date();
  // 每个 CPU 分配 N 个任务
  const n = Math.floor(list.length / numCPUs);
  // 未分配的余数
  const remainder = list.length % numCPUs;

  for (let i = 1; i <= numCPUs; i += 1) {
    const tasks = list.splice(0, n + (i > remainder ? 0 : 1));
    // 将任务编号传递到 Cluster 内启动
    setTimeout(() => {
      cluster.fork({ tasks: JSON.stringify(tasks) });
    }, 400 * i);
  }
  
  cluster.on('exit', (worker) => {
    console.log(`worker #${worker.id} PID:${worker.process.pid} died`);
    const endTime = new Date();
    console.log('整体耗时================>', Math.floor((endTime - startTime) / 1000 / 60, '分'));
  });

  cluster.on('error', (err) => {
    console.log(`worker #${worker.id} PID ERROR: `, err);
  });
};
