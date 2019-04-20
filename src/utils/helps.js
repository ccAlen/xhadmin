'use strict'
import Vue from 'vue'

export function treeToTree(data, expandAll, parent, level, item, id) {
  const marLTemp = []
  let tmp = []
  Array.from(data).forEach(function(record) {
    if (record._expanded === undefined) {
      Vue.set(record, '_expanded', expandAll)
    }
    let _level = 1
    if (level !== undefined && level !== null) {
      _level = level + 1
    }
    if (id === record.id) {
      Vue.set(record, 'isDisabled', true)
    }
    if (record.name) {
      Vue.set(record, 'label', record.name)
    } else {
      Vue.set(record, 'label', record.cat_name)
    }

    Vue.set(record, '_level', _level)
    // 如果有父元素
    if (parent) {
      Vue.set(record, 'parent', parent)
      // 如果父元素有偏移量，需要计算在this的偏移量中
      // 偏移量还与前面同级元素有关，需要加上前面所有元素的长度和
      if (!marLTemp[_level]) {
        marLTemp[_level] = 0
      }
      Vue.set(record, '_marginLeft', marLTemp[_level] + parent._marginLeft)
      Vue.set(record, '_width', record[item] / parent[item] * parent._width)
      // 在本次计算过偏移量后加上自己长度，以供下一个元素使用
      marLTemp[_level] += record._width
    } else {
      // 如果为根
      // 初始化偏移量存储map
      marLTemp[record.id] = []
      // map中是一个数组，存储的是每级的长度和
      // 初始情况下为0
      marLTemp[record.id][_level] = 0
      Vue.set(record, '_marginLeft', 0)
      Vue.set(record, '_width', 1)
    }
    if (record.children && record.children.length === 0) {
      Vue.delete(record, 'children')
    }
    tmp.push(record)
    if (record.children && record.children.length > 0) {
      const children = treeToTree(record.children, expandAll, record, _level, item, id)
      if (children[0].children > 0) {
        tmp = tmp.concat(children)
      }
    }
  })
  return tmp
}

/**
 * 格式化时间
 * @param obj
 * @returns {string}
 */
export function fmtDate(obj) {
  var date = new Date(obj) // 如果date为10位不需要乘1000
  var Y = date.getFullYear() + '-'
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' '
  var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
  var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
  return Y + M + D + h + m + s
}
export function delNull(json) {
  for (var t in json) {
    if (json[t] === null) {
      delete json[t]
    }
  }
  return json
}
