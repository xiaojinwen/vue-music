export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s])' + className + '(\\s|$)')
  return reg.test(el.className)
}

export function getData(el, name, val) {
  const prefix = 'data-'
  name = prefix + name
  if (val) {
    return el.setAttribute(name, val)
  } else {
    return el.getAttribute(name)
  }
}

let elementStyle = document.createElement('div').style
let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }
  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      // console.log(key)
      return key
    }
  }
  return false
})()

export function prefixStyle(style) {
  if (vendor === false) {
    return false
  }
  if (vendor === 'standard') {
    return style
  }
  return vendor + style.charAt(0).toUpperCase() + style.substring(1)
}
/*

/!**
 * 获取 blob
 * @param  {String} url 目标文件地址
 * @return {Promise}
 *!/
function getBlob(url) {
  return new Promise(resolve => {
    const xhr = new XMLHttpRequest()

    xhr.open('GET', url, true)
    xhr.responseType = 'blob'
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response)
      }
    }
    xhr.send()
  })
}

/!**
 * 保存
 * @param  {Blob} blob
 * @param  {String} filename 想要保存的文件名称
 *!/
function saveAs(blob, filename) {
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, filename)
  } else {
    const link = document.createElement('a')
    const body = document.querySelector('body')

    link.href = window.URL.createObjectURL(blob)
    link.download = filename

    // fix Firefox
    link.style.display = 'none'
    body.appendChild(link)

    link.click()
    body.removeChild(link)

    window.URL.revokeObjectURL(link.href)
  }
}

/!**
 * 下载
 * @param  {String} url 目标文件地址
 * @param  {String} filename 想要保存的文件名称
 *!/
export function download(url, filename) {
  getBlob(url).then(blob => {
    saveAs(blob, filename)
  })
}

/!*
 *  作者：RoamIn
 *  链接：https://www.jianshu.com/p/6545015017c4
 *  來源：简书
 *  简书著作权归作者所有，任何形式的转载都请联系作者获得授权并注明出处。
 *
 * *!/
*/
