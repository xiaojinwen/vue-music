const axios = require('axios');
const path = require('path');
// const vConsolePlugin = require('vconsole-webpack-plugin'); // 引入 移动端模拟开发者工具 插件 （另：https://github.com/liriliri/eruda）
// const CompressionPlugin = require('compression-webpack-plugin'); //Gzip
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin; //Webpack包文件分析器
// const baseUrl = process.env.NODE_ENV === "production" ? "/static/" : "/"; //font scss资源路径 不同环境切换控制
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const PrerenderSpaPlugin = require('prerender-spa-plugin')

function resolve(dir) {
	return path.join(__dirname, dir);
}

const date = new Date()
const appendPath = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}/`

const cdn = {
	css: [
		'https://cdn.udai361.com/cdn/element-ui/2.7.0/index.css',
		'https://cdn.udai361.com/cdn/quill/1.3.6/quill.snow.min.css',
		'https://cdn.udai361.com/cdn/quill/1.3.6/quill.core.min.css',
		'https://cdn.udai361.com/cdn/quill/1.3.6/quill.bubble.min.css',
	],
	js: [
		'https://cdn.udai361.com/cdn/vue/2.6.10/vue.min.js',
		'https://cdn.udai361.com/cdn/element-ui/2.7.0/index.js',
		'https://cdn.udai361.com/cdn/vue-router/3.0.2/vue-router.min.js',
		'https://cdn.udai361.com/cdn/moment/2.6.10/moment.min.js',
		'https://cdn.udai361.com/cdn/vuex/3.1.0/vuex.min.js',
		'https://cdn.udai361.com/cdn/vue-i18n/8.9.0/vue-i18n.min.js',
		'https://cdn.udai361.com/cdn/lodash/4.17.11/lodash.min.js',
		'https://cdn.udai361.com/cdn/antv-g2/3.4.10/g2.min.js',
		'https://cdn.udai361.com/cdn/axios/0.18.0/axios.min.js',
		'https://cdn.udai361.com/cdn/quill/1.3.6/quill.min.js',
	]
}
module.exports = {
	//基本路径 publicPath baseUrl
	publicPath: process.env.NODE_ENV === 'production' && process.env.APP_PATH ? process.env.APP_PATH + appendPath : '/music/',
	indexPath: './index.html',
	//输出文件目录
	outputDir: './dist',
	// eslint-loader 是否在保存的时候检查
	lintOnSave: false,
	// lintOnSave: process.env.NODE_ENV !== 'production',
	//放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
	assetsDir: 'static',
	//以多页模式构建应用程序。
	pages: undefined,
	//是否使用包含运行时编译器的 Vue 构建版本
	runtimeCompiler: false,
	//是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建，在适当的时候开启几个子进程去并发的执行压缩
	parallel: require('os').cpus().length > 1,
	//生产环境是否生成 sourceMap 文件，一般情况不建议打开
	productionSourceMap: false,
	// webpack配置
	//对内部的 webpack 配置进行更细粒度的修改 https://github.com/neutrinojs/webpack-chain see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
	chainWebpack: config => {
		/**
		 * 删除懒加载模块的prefetch，降低带宽压力
		 * https://cli.vuejs.org/zh/guide/html-and-static-assets.html#prefetch
		 * 而且预渲染时生成的prefetch标签是modern版本的，低版本浏览器是不需要的
		 */
		config.plugins.delete('prefetch');
		// if (process.env.NODE_ENV === 'production') { // 为生产环境修改配置...process.env.NODE_ENV !== 'development'
		// 	config.plugin('html')
		// 	.tap(args => {
		// 		args[0].cdn = cdn;
		// 		return args;
		// 	})
		// }
		config.resolve.alias
		.set("vue$", "vue/dist/vue.esm.js")
		.set("@", resolve("src"))
		.set("src", resolve("src"))
		.set("common", resolve("src/common"))
		.set("components", resolve("src/components"))
		.set("api", resolve("src/api"))
		.set("base", resolve("src/base"))
	},
	//调整 webpack 配置 https://cli.vuejs.org/zh/guide/webpack.html#%E7%AE%80%E5%8D%95%E7%9A%84%E9%85%8D%E7%BD%AE%E6%96%B9%E5%BC%8F
	configureWebpack: config => {
		if (process.env.NODE_ENV === 'production') {
			/*config.externals = {
        'vue': 'Vue',
        'vue-router': 'VueRouter',
        'vuex': 'Vuex',
        'axios': 'axios',
        "fastclick": "FastClick",
        "vue-lazyload": "VueLazyload"
			}*/
			// 以及修改 public/index.html
		}
		//生产and测试环境
		let pluginsPro = [
			// new CompressionPlugin({ //文件开启Gzip，也可以通过服务端(如：nginx)(https://github.com/webpack-contrib/compression-webpack-plugin)
			// 	filename: '[path].gz[query]',
			// 	algorithm: 'gzip',
			// 	// test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$',),
			// 	test: new RegExp('\\.(js|css)$',),
			// 	threshold: 8192,
			// 	minRatio: 0.8,
			// }),
			//	Webpack包文件分析器(https://github.com/webpack-contrib/webpack-bundle-analyzer)
			// new BundleAnalyzerPlugin(),
			// 添加自定义代码压缩配置 压缩影响打包速度,增加访问速度
			// new UglifyJsPlugin({
			// 	uglifyOptions: {
			// 		compress: {
			// 			warnings: false,
			// 			drop_debugger: true,
			// 			drop_console: true,
			// 		},
			// 	},
			// 	sourceMap: false,
			// 	parallel: true,
			// })
			new PrerenderSpaPlugin({
				//将渲染的文件放到dist目录下
				staticDir: path.join(__dirname, '../dist'),
				//需要预渲染的路由信息
				routes: ['/', '/recommend', '/singer', '/rank', '/search', '/user']
			})
		];

		//开发环境
		/*let pluginsDev = [
			//移动端模拟开发者工具(https://github.com/diamont1001/vconsole-webpack-plugin  https://github.com/Tencent/vConsole)
			new vConsolePlugin({
				filter: [], // 需要过滤的入口文件
				enable: true // 发布代码前记得改回 false
			}),
		];*/
		if (process.env.NODE_ENV === 'production') {
			config.plugins = [...config.plugins, ...pluginsPro];
		} else {
			// 为开发环境修改配置...
			// config.plugins = [...config.plugins, ...pluginsDev];
		}
	},
	css: {
		// 启用 CSS modules
		modules: false,
		// 是否使用css分离插件 注釋掉 解决热更新失效问题
		// extract: true,
		// 开启 CSS source maps，一般不建议开启
		sourceMap: false,
		// css预设器配置项
		loaderOptions: {
			sass: {
				//设置css中引用文件的路径，引入通用使用的scss文件（如包含的@mixin）
				data: `$baseUrl:"/";`
				// @import '@/assets/scss/_common.scss';
				//data: `$baseUrl: "/";`
			}
		}
	},
// webpack-dev-server 相关配置 https://webpack.js.org/configuration/dev-server/
	devServer: {
		host: "0.0.0.0", //localhost
		port: 8910, // 端口号
		https: false, // https:{type:Boolean}
		open: false, // 配置自动启动浏览器
		hotOnly: true, // 热更新
		// proxy: 'http://localhost:8000'   // 配置跨域处理,只有一个代理
		/*proxy: { //配置自动启动浏览器
			"/rest/!*": {
				target: "http://172.16.1.12:7071",
				changeOrigin: true,
				// ws: true,//websocket支持
				secure: false
			}
		}*/
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
	},
// 第三方插件配置 https://www.npmjs.com/package/vue-cli-plugin-style-resources-loader
	pluginOptions: {
		'style-resources-loader':
			{//https://github.com/yenshih/style-resources-loader
				preProcessor: 'scss',//声明类型
				'patterns':
					[
						//path.resolve(__dirname, './src/assets/scss/_common.scss'),
					],
				//injector: 'append'
			}
	}
};
