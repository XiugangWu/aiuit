# aiuit

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

# 项目规划
  1.项目设想:公司介绍的项目.首先,能够对公司的运营活动进行数字化;其次,介绍公司的产品.


# 技术栈

# 1.Git 操作的具体步骤:
  0. 工作区(本地) ==> 缓存区(虚拟区域) ==> 仓库区(git网站 + 创建的仓库名称)
    0.1: 工作区:在本地新建一个文件夹,编写代码或者说明文档等
    0.2: 仓库区:在github网站,新建一个仓库
    0.3: 建立缓存区: 在工作区command命令: git init

  ### 1.工作区 =》暂存区
    1.1: cd 路径 进入当前目录
    1.2: git add 文件名  //提交该文件
         git add *  //提交所有文件
    1.3: git commit -m "这次提交的说明描述"
      1.3.1: 查看当前工作区的状态: git status
      1.3.2: 从暂存区恢复文件到工作区: git checkout 文件名
      1.3.3: 查看当前工作区 和 暂存区 文件的区别: git diff
      1.3.4: 查看所有提交的历史版本: git log
      1.3.5: 恢复文件到指定版本: git reset --hard 版本号
  ### 2.暂存区 =》仓库区
    2.0: 授权: ssh密匙
      生成: ssh-keygen -t rsa -C "你的github邮箱地址"
      找到:.id_rsa.pub 文件,一长串字符
      到github网站=》setting =》ssh配置
    2.1: 提交
      git remote add origin 地址(https://xxx.git)
      git push -u origin master

      第二次以后提交:
        git add *
        git commit -m "说明描述"
        git push
  ### 3.仓库区 =》另一个本地
    克隆: git clone 地址
    更新: git pull

  ### 4.创建不同分支:
    创建不同分支: git branch (branchname)
    切换分支命令: git checkout (branchname)
    列出分支基本命令: git branch
      发布主 master
      主 main
      开发主 dev
                  ⬆️git merge <name>         ⬆️           ⬆️
          自行创建  dev-A
                                        自行创建  dev-B
                                                          ...

# 2.bootstrap
  why? 5.0--删除jquery,停止支持IE
  引入方式:
    2.1.cdn:  
    2.2.npm

# 3.Todolist -》createPost
  引入 微信云开发:
  https://docs.cloudbase.net/api-reference/webv2/initialization.html

  ### 3.1npm引入 云开发SDK: npm install @cloudbase/js-sdk -S
  ### 3.2在需要使用的页面:import cloudbase from '@cloudbase/js-sdk'

# 4. AiuIT
  **公司数字化转型产品.用户公司的事务处理流程,如打卡/请假/通讯录/产品介绍/商城...等.**

  架构:前端为vue架构的页面,可在微信公众号中查看,通过kbone技术生成小程序.
  后端使用 腾讯云: 使用小程序的云环境(含有云数据库/云存储/云函数/云调用);
  **利用云函数可直接访问云数据库的特性,将云函数作为访问云数据库的接口**

  链接 小程序云环境 的方法:
  1.新建云函数--根目录-cloudfunctions-login(例子:创建login的)
  1.1 在login目录下,新建index.js 和 package.json
    ```
      // index.js
      const cloud = require("@cloudbase/node-sdk");

      exports.main = async (event, context) => {
          const app = cloud.init({
              env: cloud.SYMBOL_CURRENT_ENV,
          });
          
          // todo
          // your code here
          return {
              event,
          };
      };
    ```

    ```
      // package.json
      {
        "name": "login",
        "version": "1.0.0",
        "description": "",
        "main": "index.js",
        "scripts": {},
        "author": "",
        "license": "ISC",
        "dependencies": {
          "@cloudbase/node-sdk": "1.1.1"
        }
      }
    ```
  2.新建config文件:cloudbaserc.json
    ```
      {
        "version": "2.0",
        "envId": "aiu-mycompany-1uzhz",
        "functionRoot": "",   // 编者注,此处如果json在跟目录下,则为空
        "functions": [
          {
            "name": "login",
            "timeout": 5,
            "envVariables": {},
            "runtime": "Nodejs10.15",
            "memory": 128,
            "aclRule": { "invoke": true }
          }
        ]
      }
    ```
  3.部署云函数: 在根目录cloudfunction 使用命令--tcb fn deploy login

  ### 4.1 登陆鉴权
  ##### 4.1.1 用户可在未登陆/匿名登陆/邮箱登陆/微信登陆 四种情况下使用.
     * 初始状态下,用户属于未登陆的状态;
     * 当用户与产品进行交互时(如点击按钮等),则需要用户登陆
     * 用户可选择: 邮箱登陆/*微信登陆*/匿名登陆(部分功能匿名登陆状态下不可使用,如修改用户昵称等)
  

