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
##Git 操作的具体步骤:
  0. 工作区(本地) ==> 缓存区(虚拟区域) ==> 仓库区(git网站 + 创建的仓库名称)
    0.1: 工作区:在本地新建一个文件夹,编写代码或者说明文档等
    0.2: 仓库区:在github网站,新建一个仓库
    0.3: 建立缓存区: 在工作区command命令: git init

  1.工作区 =》暂存区
    1.1: cd 路径 进入当前目录
    1.2: git add 文件名  //提交该文件
         git add *  //提交所有文件
    1.3: git commit -m "这次提交的说明描述"
      1.3.1: 查看当前工作区的状态: git status
      1.3.2: 从暂存区恢复文件到工作区: git checkout 文件名
      1.3.3: 查看当前工作区 和 暂存区 文件的区别: git diff
      1.3.4: 查看所有提交的历史版本: git log
      1.3.5: 恢复文件到指定版本: git reset --hard 版本号
  2.暂存区 =》仓库区
    2.0: 授权: ssh密匙
      生成: ssh-keygen -t rsa -C "你的github邮箱地址"
      找到:.id_rsa.pub 文件,一长串字符
      到github网站=》setting =》ssh配置
    2.1: 提交
      git remote add o origin 地址(https://xxx.git)
      git push -u origin master

      第二次以后提交:
        git add *
        git commit -m "说明描述"
        git push
  3.仓库区 =》另一个本地
    克隆: git clone 地址
    更新: git pull

  4.创建不同分支:
    创建不同分支: git branch (branchname)
    切换分支命令: git checkout (branchname)
    列出分支基本命令: git branch
      发布主 master
      开发主 dev
                  ⬆️git merge <name>         ⬆️           ⬆️
          自行创建  dev-A
                                        自行创建  dev-B
                                                          ...