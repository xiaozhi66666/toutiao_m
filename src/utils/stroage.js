// 封装一个从本地存取值的class
class Stroage {
  // window.localStorage.setItem('USER_TOKEN', JSON.stringify(state.user))
  set (key, value) {
    if (typeof value === 'object') { // null也是一个对象  typeof value === 'object' && typeof value === 'null'
      // 表示要存入的value是一个复杂数据类型的数据，需要先转换成JSON字符串再进行存储
      value = JSON.stringify(value)
    }
    // 否则就是基本数据类型，直接存储
    localStorage.setItem(key, value)
  }

  get (key) {
    const value = localStorage.getItem(key)
    try {
      return JSON.parse(value)
    } catch (error) {
      return value
    }
  }

  remove (key) {
    localStorage.removeItem(key)
  }
}
// 使用类的时候需要首先new出一个实例对象再进行使用
const stroage = new Stroage()
// 向外导出Stroage这个类new出来的对象
export default stroage
