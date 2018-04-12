//引入express中间件
var axios = require('axios')
var express = require('express');
var app = express();

// 开始
app.get('/api/getDiscList', (req, res) => {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
    // console.log('response.data: ' + response.data)
  }).catch((e) => {
    console.log('错误: ' + e)
  })
})
app.get('/api/getSongList', (req, res) => {
  const url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://y.qq.com/n/yqq/playsquare/3562814436.html',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    var ret = response.data.substring(9,response.data.length-1)
    // console.log(ret)
    // if (typeof ret === 'string') {
    //   var reg = /^\w+\(({[^()]+})\)$/
    //   var mathes = ret.match(reg)
    //   if (mathes) {
    //     ret = JSON.parse(mathes[1])
    //   }
    // }
    ret = JSON.parse(ret)
    res.json(ret)
  }).catch((e) => {
    console.log('错误: ' + e)
  })
})
app.get('/api/getMusic', (req, res) => {
  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
    // console.log('response.data: ' + response.data)
  }).catch((e) => {
    console.log('错误: ' + e)
  })
})
app.get('/api/lyric', (req, res) => {
  const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    var ret = response.data
    // console.log(ret)
    if (typeof ret === 'string') {
      var reg = /^\w+\(({[^()]+})\)$/
      var mathes = ret.match(reg)
      if (mathes) {
        ret = JSON.parse(mathes[1])
      }
    }
    res.json(ret)
    // console.log('response.data: ' + response.data)
  }).catch((e) => {
    console.log('错误: ' + e)
  })
})
app.get('/api/getTopList', (req, res) => {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'

  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
      host: 'c.y.qq.com'
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
    // console.log('response.data: ' + response.data)
  }).catch((e) => {
    console.log('错误: ' + e)
  })
})
//指定启动服务器到哪个文件夹，我这边指的是dist文件夹
app.use(express.static('dist'));

//监听端口为3000
var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
