# React脚手架
### 初始化
更改package.json中name、version、platform、author、description字段信息。
### 多页面打包
可以在pages文件内新建多个文件夹，输出名字和文件夹名字一致。

### 操作命令
#### 本地开发


``` sh
	npm run start
```
#### 打包（测试环境包）
打测试包并会上传测试环境。
``` sh
	npm run upload 或执行 build.sh
```
#### 打包（生产包）
升级版本号需更改package.json中version, 打包会根据版本号自动备份。
``` sh
	npm run build:prod 或执行 prod.sh
```
* 注意：如需执行处理脚本，可在build/目录下增加脚本文件build.js。打包后版本备份前会执行该脚本。

### 目录结构
├─asset
     └─images 图片
     └─lib    工具库
├─components  组件
├─ijijinView  组件
├─less        样式
├─page        页面入口
├─script      js文件
│  └─config    配置文件
│  └─const     静态变量
│  └─fn.business  业务方法库
│  └─fn.util 基础方法库
│  └─http    请求文件
│  └─tokenInit  用户token（key1~key5）初始化
├─type        接口定义
├─view        view层

#   w e b p a c k - r e a c t  
 