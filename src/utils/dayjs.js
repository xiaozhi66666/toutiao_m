// 引入dayjs事件格式化工具
import dayjs from 'dayjs'
// 配置相对时间
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)
// 配置dayjs全局默认语言包,修改为中文
require('dayjs/locale/zh-cn')
dayjs.locale('zh-cn')
// 默认导出已经配置好的dayjs方法
export default dayjs
