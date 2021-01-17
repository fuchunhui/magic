## 文件使用说明
* main.js 获取具体某个订单编号的验收情况。需要指定订单编号value
* all.js 遍历调用main的操作
* cookies.js 存储当前登陆网站的cookie信息，用于自动登陆网址
* test.js 脚本临时测试使用

* temp.js 测试数据，订单编号的集合
* cluster.js 集群脚本 主入口
* cluster_master.js 主进程
* cluster_worker.js work进程

* single.js 单进程算法，多次打开关闭浏览器
* optimize.js 优化算法，重复利用tab页，单次打开关闭浏览器
* optimize 目录，存储优化算法生成的结果文件
* `${number}`.js 计算正确的结果文件，number代表 worker进程编号
* `${number}-error`.js 计算错误的结果文件，number代表 worker进程编号

* product.js 获取订单编号列表脚本
* product-list.js 订单编号存储文件
* mark.js 读取optimize下的内容，转化生成excel文件`result.xlsx`

* file.js 文件操作函数库，提供文件的增删存储操作

## Init
1. `git clone 代码库` 
2. `npm install` 初始化安装npm包
3. `cd abchina` 进入到脚本目录
4. 使用最新的cookie内容填充cookie.js（how？ chrome正常登录，获取目标网站的cookie内容（key，value））
5. 修改product.js中的最大页码数（每页50条），然后执行命令，`node product`，获取所有的订单编号
6. 上一步执行完成后，`node cluster`使用集群方式，获取验收结果
7. 生成结果在optimize文件夹下，结果处理需要进一步跟进解决

## 具体思路：
> 使用puppeteer模拟用户操作行为，点击查看，新打开页面选择检测验收情况。

### 实现步骤
1. 模拟器打开窗口，通过cookie成功登陆网站；
2. 访问https://e.abchina.com页面，使用sessionStorage设置目标查询值；
3. 访问https://e.abchina.com/jcgys/supplier/supplier.html#/order/saleOrderManager 页面；
4. 获取待验证的ID值列表；
5. 通过sessionStorage设置需要查询订单编号；
6. 访问https://e.abchina.com/jcgys/supplier/supplier.html#/order/saleOrderManager?tab=1 页面，获取验收情况。

### 获取id列表
1. 切换为每页50条。
2. 获取当前页面内容。
3. 点击下一页，再次获取。
4. 循环处理步骤3。
5. 存储。

### 验证流程
1. 读取本地存储文件。
2. 单点测试，检测流程是否ok。
3. 数组遍历测试。

### 集群方式
1. 根据本机CPU情况，开启多核集群。
2. 构建主进程和多个子work进程，注册事件监听。

### RoadMap
1. 结果的过滤和合并。
2. 算法可继续优化，利用单浏览器，多Tab页功能。比如，8核CPU，同时启动8个worker线程，每个浏览器同时开始4个tab页面，那么相当于同时计算8 * 4 = 32个订单。
3. 计算结果的递归处理。
  - 合并正确的计算结果，8核CPU为例，合并1.js，2.js ...... 8.js为result.js文件，错误的文件合并为result-error.js文件。
  - 递归处理，result-error.js文件记录的订单内容，直到没有error文件出现。
  - 后续递归需要调整策略，增加等待查询时间，否则第一次处理，不会报错，通常是等待时间不够导致的错误。
4. 脚本优化，整体可抽离作为一个和任意网站不相关的执行脚本，框架脚本可解决多数爬虫问题。