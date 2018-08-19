'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')

const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

var axios = require('axios')

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({sourceMap: config.dev.cssSourceMap, usePostCSS: true})
    },
    // cheap-module-eval-source-map is faster for development
    devtool: config.dev.devtool,

    // these devServer options should be customized in /config/index.js
    devServer: {
        before(app) {
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
                    var ret = response.data.substring(9, response.data.length - 1)
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
                // const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg?_=1524151611827'
                // 1524152008919
                // https://u.y.qq.com/cgi-bin/musicu.fcg?_=1524152080859
                // http://base.music.qq.com/fcgi-bin/fcg_musicexpress.fcg
                const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'
                // const url = 'http://base.music.qq.com/fcgi-bin/fcg_musicexpress.fcg'
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
            app.get('/api/search', (req, res) => {
                const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'

                axios.get(url, {
                    headers: {
                        referer: 'https://c.y.qq.com/',
                        host: 'c.y.qq.com'
                    },
                    params: req.query
                }).then((response) => {
                    var ret = response.data
                    // console.log(typeof ret === 'string')
                    if (typeof ret === 'string') {
                        var reg = /^\w+\(({[^()]+})\)$/
                        var mathes = ret.match(reg)
                        if (mathes) {
                            ret = JSON.parse(mathes[1])
                            // console.log(ret)
                        }
                    }
                    res.json(ret)
                }).catch((e) => {
                    console.log('错误: ' + e)
                })
            })
        },
        clientLogLevel: 'warning',
        historyApiFallback: {
            rewrites: [
                {from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html')},
            ],
        },
        hot: true,
        contentBase: false, // since we use CopyWebpackPlugin.
        compress: true,
        host: HOST || config.dev.host,
        port: PORT || config.dev.port,
        open: config.dev.autoOpenBrowser,
        overlay: config.dev.errorOverlay
            ? {warnings: false, errors: true}
            : false,
        publicPath: config.dev.assetsPublicPath,
        proxy: config.dev.proxyTable,
        quiet: true, // necessary for FriendlyErrorsPlugin
        watchOptions: {
            poll: config.dev.poll,
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': require('../config/dev.env')
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
        new webpack.NoEmitOnErrorsPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true
        }),
        // copy custom static assets
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static'),
                to: config.dev.assetsSubDirectory,
                ignore: ['.*']
            }
        ])
    ]
})

module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = process.env.PORT || config.dev.port
    portfinder.getPort((err, port) => {
        if (err) {
            reject(err)
        } else {
            // publish the new Port, necessary for e2e tests
            process.env.PORT = port
            // add port to devServer config
            devWebpackConfig.devServer.port = port

            // Add FriendlyErrorsPlugin
            devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
                compilationSuccessInfo: {
                    messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
                },
                onErrors: config.dev.notifyOnErrors
                    ? utils.createNotifierCallback()
                    : undefined
            }))

            resolve(devWebpackConfig)
        }
    })
})
