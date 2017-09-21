# music-project
一个移动端的网易云音乐页面
具备播放、暂停、动态显示歌词的功能， 使用leancloud作为数据库,实现搜索歌曲并点击跳转到相应的歌曲页面， 通过函数限流处理请求重复发送。 用gulp进行打包，以应对复杂场景进行性能优化。
功能：歌曲播放、歌单实时更新、曲库搜索、歌词滚动
部署：leanCloud + 七牛云
技术栈：jQuery + BOM + Leancloud + postcss + uglifyjs + gulp
难点：搜索栏体验和逻辑的优化、歌词显示与音频同步的实现、以及在IOS系统下各种奇怪的Bug的修复，使用gulp打包
