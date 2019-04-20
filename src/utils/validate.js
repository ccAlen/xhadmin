/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * 合法邮箱
 * @param str
 * @returns {boolean}
 */
export function validatEmail(str) {
  const reg = /^[A-Za-z0-9._%-]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,4}$/
  return reg.test(str)
}

/**
 * 合法金额
 * @param s
 * @returns {boolean}
 */
export function validatMoney(s) {
  var reg = /^[0-9]+[\.][0-9]{0,3}$/
  var re = new RegExp(reg)
  return re.test(s)
}

/**
 * 判断是否正数
 * @param i
 * @returns {*|boolean}
 */
export function validateInt(i) {
  var reg = new RegExp('^[0-9]+$')
  return reg.test(i)
}
export function validateNumber(int) {
  var reg = /^\d+(\.\d+)?$/
  return reg.exec(int)
}
/**
 * 合法分成比例
 * @param s
 * @returns {boolean}
 */
export function validatSeparateInto(s) {
  var reg = /^[0-1]{1}[\.[0-9]{0,3}]?$/
  var re = new RegExp(reg)
  return re.test(s)
}
