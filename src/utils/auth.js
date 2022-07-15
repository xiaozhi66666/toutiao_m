// 导入stroage
import stroage from './stroage'
// 定义一个常量表示要存储的本地的key
const TOKEN_USER = 'USER_TOKEN'
// 取token的方法
export const getToken = () => stroage.get(TOKEN_USER)
// 设置token的方法
export const setToken = (token) => stroage.set(TOKEN_USER, token)
// 移除token的方法
export const removeToken = () => stroage.remove(TOKEN_USER)
