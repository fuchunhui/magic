const cluster = require('cluster');

(async () => {
  let run;
  if (cluster.isMaster) {
    run = require('./cluster_master');
  } else {
    run = require('./cluster_worker');
  }
  try {
    await run();
  } catch (e) {
    // 追踪函数的调用轨迹
    console.trace(e);
  }
})();