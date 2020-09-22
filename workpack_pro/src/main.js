const common = require('./common')
const utils = require('./utils')
require('./style.css')
common.info('Hello' + utils.add(100, 200))
//document是浏览器下的JavaScript对象，无法在node.js运行，需要
//在页面运行