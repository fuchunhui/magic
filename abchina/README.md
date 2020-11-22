## 使用方式

## 具体思路：
> 使用puppeteer模拟用户操作行为，点击查看，新打开页面选择检测验收情况。

### 实现步骤
1. 模拟器打开窗口，通过cookie成功登陆网站。
2. 访问https://e.abchina.com 页面 设置sessionStorage格式
3. 访问https://e.abchina.com/jcgys/supplier/supplier.html#/order/saleOrderManager 页面
4. 获取待验证的ID值列表；
5. 通过sessionStorage设置需要查询订单编号.
6. 访问https://e.abchina.com/jcgys/supplier/supplier.html#/order/saleOrderManager?tab=1 页面，获取验收情况。

### 获取id列表
1. 切换为每页50条
2. 获取当前页面内容
3. 点击下一页，再次获取
4. 循环处理步骤3.
5. 存储。

### 验证流程
1. 读取本地存储文件。
2. 单点测试，检测流程是否ok。
3. 数组遍历测试

### 集群方式
1. 根据本机CPU情况，开启多核集群。
2. 构建主和多子，事件监听。

### RoadMap
1. 