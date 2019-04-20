import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const TokenExpired = 'Admin-expired'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getExpired() {
  return Cookies.get(TokenExpired)
}

export function setExpired(expired) {
  return Cookies.set(TokenExpired, expired)
}
