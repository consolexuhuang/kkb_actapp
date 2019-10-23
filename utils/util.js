const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const formatUrlParams = (baseUrl, data) => {
  baseUrl += (baseUrl.indexOf('?') < 0 ? '?' : '&') + param(data)
  return baseUrl
}
const param = (data) => {
  let url = ''
  // 遍历data对象，取出需要的参数
  for (var k in data) {
    // 如果当前value为undefined ，则返回空字符串
    let value = data[k] !== undefined ? data[k] : ''
    // 得到参数，并且拼接参数，为下一步拼接到url后面做准备
    url += '&' + k + '=' + encodeURIComponent(value)
  }
  // 如果url存在，则去除首字符并返回，因为主函数已经包含了'&'，否则返回空串
  return url ? url.substring(1) : ''
}

module.exports = {
  formatTime: formatTime,
  formatUrlParams: formatUrlParams
}
