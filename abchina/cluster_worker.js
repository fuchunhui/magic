const cluster = require('cluster');

// 禁止直接启动
if (cluster.isMaster) {
  console.log('----', cluster.worker.id)
  process.exit(0);
}

module.exports = async () => {
  const env = process.env.tasks;
  let tasks = [];
  if (/^\[.*\]$/.test(env)) {
    tasks = JSON.parse(env);
  }
  if (tasks.length === 0) {
    console.log('????', tasks)
    // 非法启动, 释放进程资源
    process.exit(0);
  }
  console.log(`worker #${cluster.worker.id} PID:${process.pid} Start`);

  console.log(cluster.worker.id + ' 顺利完成');
  process.exit(0);
};
