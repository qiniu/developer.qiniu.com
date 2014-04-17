## 本地运行文档

安装[NodeJS](http://nodejs.org/)

安装[Grunt CLI](http://gruntjs.com/getting-started#installing-the-cli),`npm install -g grunt-cli`

``` bash
make test
```

浏览器中访问[localhost:4000](localhost:4000)

## 上传文档至七牛空间

编辑 `_jekyll_qiniu.yml` ,填写正确的AccessKey、SecretKey以及Bucket

``` bash
make install
```

## Markdown Editor

### Mac

- [Mou](http://mouapp.com/)
- [Sublime Text 2](http://www.sublimetext.com/2)

### Linux

- [ReText](http://sourceforge.net/p/retext/home/ReText/)

### Windows

- [MarkdownPad](http://markdownpad.com/)

### Web

- [Dillinger](http://dillinger.io/)


## Contributing

1. 登录 <https://github.com>
2. Fork <https://github.com/qiniu/developer.qiniu.com>
3. 创建您的特性分支 (`git checkout -b my-new-feature`)
4. 提交您的改动 (`git commit -am 'Added some feature'`)
5. 将您的改动记录提交到远程 git 仓库 (`git push origin my-new-feature`)
6. 然后到 github 网站的该 git 远程仓库的 `my-new-feature` 分支下发起 Pull Request

## Remote Sync

与远程库 `git://github.com/qiniu/developer.qiniu.com.git` 保持同步，避免冲突的办法如下：

1. `cd <your_fork_dir>`
2. `git remote add qiniu git://github.com/qiniu/developer.qiniu.com.git`
3. `git fetch qiniu`
4. `git merge qiniu/master`

后续同步更新只需运行第3步和第4步。
