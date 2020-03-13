# vue-music

升级vue-cli3
> 音乐播放器

## 展示(无数据)
 https://xiaojinwen.github.io/vue-music/

## 展示(含数据)
 http://web.xiaojw.xyz/music

### 修复bugs
1. 修复首页路由touch切换bug
2. 修复手机端不能播放音乐,请点击一下播放页面中右上角的按钮(不能播放?),或者点击播放按钮
3. 修复轮播图中某些情况下不能自动播放
4. 其他修复

### bug 不能播放音乐
    qq音乐接口对ip做了限制
    线上有时拿不到vkey,可以用代理解决
    本地没有问题

    修改配置 本地可播放(有些歌曲不能播放) 不行的话多点几首
    部署线上需要部署deploy里的文件
    然后修改 src/api/fetch.js 的接口
## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```
