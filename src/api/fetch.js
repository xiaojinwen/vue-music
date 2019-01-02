import axios from 'axios'

const {hostname} = window.location
const API_HOST = (() => {
    if (hostname === 'localhost') {
        // return 'https://xiaojinwen.github.io/vue-music/api'
        return 'http://web.xiaojw.xyz/api'
    } else if (hostname === 'xiaojinwen.github.io') {
        return 'https://xiaojinwen.github.io/vue-music/api'
    }
    return `/api`
})()

const instance = axios.create({
    // 设置默认根地址
    baseURL: API_HOST,
    // 设置请求超时设置
    timeout: 5000,
    // 设置请求时的header
    header: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    // 公用参数
    data: {}
})

// POST传参序列化
instance.interceptors.request.use(
    config => {
        // if (config.method === 'post') {
        //     config.data = qs.stringify(config.data)
        // }

        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// 返回状态判断
instance.interceptors.response.use(
    res => {
        let data = res.data
        if (
            data.code === 1001 ||
            data.code === 1002
        ) {
            return Promise.reject(res)
        }
        return res
    },
    err => {
        if (err.response) {
            console.log(err.response)
        }
        if (err && err.response) {
            switch (err.response.status) {
                case 400:
                    err.message = '请求错误'
                    break

                case 401:
                    err.message = '未授权，请登录'
                    break

                case 403:
                    err.message = '拒绝访问'
                    break

                case 404:
                    err.message = `请求地址出错: ${err.response.config.url}`
                    break

                case 408:
                    err.message = '请求超时'
                    break

                case 500:
                    err.message = '服务器内部错误'
                    break

                case 501:
                    err.message = '服务未实现'
                    break

                case 502:
                    err.message = '网关错误'
                    break

                case 503:
                    err.message = '服务不可用'
                    break

                case 504:
                    err.message = '网关超时'
                    break

                case 505:
                    err.message = 'HTTP版本不受支持'
                    break
                default:
            }
            console.log(err.message)
        }
        return Promise.reject(err)
    }
)

export default options => {
    return new Promise((resolve, reject) => {
        instance(options)
            .then(res => {
                resolve(res.data)
            })
            .catch(error => {
                reject(error)
            })
    })
}
