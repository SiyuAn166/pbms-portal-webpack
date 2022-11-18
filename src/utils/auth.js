import Cookies from 'js-cookie'
import axios from 'axios'
import API from '../interface/index'

const TokenKey = 'Admin-Token'
const LoginTokenKey = 'Login-Token'


export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getLoginToken() {
  return Cookies.get(LoginTokenKey)
}

export function setLoginToken(token) {
  return Cookies.set(LoginTokenKey, token);
}

export function removeLoginToken() {
  Cookies.remove(LoginTokenKey)
}

export function checkLoginToken() {
  let sessionId = getLoginToken()
  // console.log(sessionId)
  return new Promise((resolve, reject) => {
    axios.post(API.user.checkSession, {"id": sessionId}).then(
      response => {
        const {data} = response
        resolve(data)
      }
    ).catch(
      error => {
        reject(error)
      }
    )
  })
}
